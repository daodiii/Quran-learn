// scripts/lib/word-index.ts
// Aggregates word occurrences into the packed lookup index (spec: Output contract).
import { FORM_OVERRIDES } from './form-overrides.ts';
import { bwLemmaToArabic } from './buckwalter.ts';
import { bwToArabicSurface, bwToTranslitSurface } from './bw-surface.ts';
import { normalizeArabic, deriveAltKeys } from '../../src/lib/arabic-normalize.ts';
import type { WordOccurrence, WordStem } from './group-words.ts';

export type PackedAnalysis = [
  string, string, string | null, string, string, number, string,
  string[], string[], string | null, number, string[],
];
export interface LookupIndex {
  meta: { source: string; words: number; analyses: number; version: number };
  words: Record<string, PackedAnalysis[]>;
  altKeys: Record<string, string>;
}

// Corpus ROOT: fields write hamza as A (same quirk handled in build-verb-dataset.ts —
// duplicated here rather than refactoring a shipped pipeline).
function rootToArabic(rootBw: string): string {
  return [...rootBw].map(c => (c === 'A' ? 'ء' : bwToArabicSurface(c))).join('');
}

export interface VerbFormsData {
  roots: { root: string; forms: Record<string, { past: string; meaning: string | null }[]> }[];
}

// Gloss join (build-time, one source of truth = public/data/verb-forms.json):
//   root|form            → meaning, only when that form has exactly one entry
//   root|form|past       → meaning, disambiguates the 7 lemma-merged forms
export function buildGlossMap(verbForms: VerbFormsData): Map<string, string> {
  const map = new Map<string, string>();
  for (const r of verbForms.roots) {
    for (const [form, list] of Object.entries(r.forms)) {
      if (list.length === 1 && list[0].meaning) map.set(`${r.root}|${form}`, list[0].meaning);
      for (const e of list) if (e.meaning) map.set(`${r.root}|${form}|${e.past}`, e.meaning);
    }
  }
  return map;
}

// Non-verb glosses are curated per lemma (src/data/morphology/glosses-nouns/output/):
// one meaning per lemma|pos — the corpus lemma already disambiguates homographs.
export interface NounGlossBatch {
  batch: string;
  glosses: { lemma: string; pos: string; meaning: string }[];
}
export function buildNounGlossMap(batches: NounGlossBatch[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const b of batches)
    for (const g of b.glosses)
      // NFC like the verb merge path — validation normalizes before checking,
      // so the artifact must store the same form it validated.
      if (g.meaning) map.set(`${g.lemma}|${g.pos}`, g.meaning.normalize('NFC'));
  return map;
}

// Lemmaless particles are curated per vocalized surface (batch-sNN files):
// keyed surface|pos. INL (muqatta'at) is never glossed — spec: out of scope.
export interface SurfaceGlossBatch {
  batch: string;
  glosses: { surface: string; pos: string; meaning: string }[];
}
export function buildSurfaceGlossMap(batches: SurfaceGlossBatch[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const b of batches)
    for (const g of b.glosses)
      if (g.meaning)
        map.set(`${g.surface.normalize('NFC')}|${g.pos}`, g.meaning.normalize('NFC'));
  return map;
}

interface Acc {
  surfaceAr: string; translit: string; root: string | null; lemma: string;
  pos: string; form: number; feat: string; prefixes: string[]; suffixes: string[];
  gloss: string | null; count: number; refs: string[];
}

export function buildIndex(
  words: WordOccurrence[], verbForms: VerbFormsData,
  nounGlosses: Map<string, string> = new Map(),
  surfaceGlosses: Map<string, string> = new Map(),
): LookupIndex {
  const glosses = buildGlossMap(verbForms);
  const acc = new Map<string, Acc>();

  for (const w of words) {
    const surfaceAr = bwToArabicSurface(w.surfaceBw);
    const prefixes = w.prefixes.map(p => `${bwToArabicSurface(p.formBw)}|${p.feature}`);
    const suffixes = w.suffixes.map(s => `${bwToArabicSurface(s.formBw)}|${s.feature}`);
    for (const stem of w.stems) {
      const a = analysisFieldsForStem(stem, glosses, nounGlosses);
      if (a.gloss === null && !a.lemma && a.pos !== 'INL') {
        a.gloss = surfaceGlosses.get(`${surfaceAr.normalize('NFC')}|${a.pos}`) ?? null;
      }
      // \u0001 separator: bare concatenation could alias adjacent fields.
      const id = [surfaceAr, a.lemma, a.root ?? '', a.pos, a.form, a.feat,
                  prefixes.join(','), suffixes.join(',')].join('\u0001');
      let e = acc.get(id);
      if (!e) {
        e = { surfaceAr, translit: bwToTranslitSurface(w.surfaceBw), ...a,
              prefixes, suffixes, count: 0, refs: [] };
        acc.set(id, e);
      }
      e.count++;
      if (e.refs.length < 3 && !e.refs.includes(w.location)) e.refs.push(w.location);
    }
  }

  const out: Record<string, PackedAnalysis[]> = {};
  for (const e of acc.values()) {
    const key = normalizeArabic(e.surfaceAr);
    (out[key] ??= []).push([e.surfaceAr, e.translit, e.root, e.lemma, e.pos,
      e.form, e.feat, e.prefixes, e.suffixes, e.gloss, e.count, e.refs]);
  }
  for (const list of Object.values(out)) list.sort((x, y) => y[10] - x[10]);

  // Alternate spellings: derived per vocalized surface; a real word always wins
  // over an alternate; among alternates the higher-frequency canonical wins.
  const totals = new Map(Object.entries(out).map(([k, l]) =>
    [k, l.reduce((n, a) => n + a[10], 0)]));
  const altKeys: Record<string, string> = {};
  for (const [key, list] of Object.entries(out)) {
    for (const a of list) {
      for (const alt of deriveAltKeys(a[0])) {
        if (out[alt]) continue;
        const prev = altKeys[alt];
        const tk = totals.get(key) ?? 0;
        const tp = prev ? totals.get(prev) ?? 0 : -1;
        // frequency wins; on ties the lexicographically smaller key, so the
        // choice is stable under any future re-ordering of the corpus walk
        if (!prev || tk > tp || (tk === tp && key < prev)) altKeys[alt] = key;
      }
    }
  }

  return {
    meta: {
      source: 'Quranic Arabic Corpus v0.4 (Kais Dukes, GPL) — corpus.quran.com',
      words: Object.keys(out).length,
      analyses: Object.values(out).reduce((n, l) => n + l.length, 0),
      version: 1,
    },
    words: out,
    altKeys,
  };
}

export function analysisFieldsForStem(
  stem: WordStem, glosses: Map<string, string>,
  nounGlosses: Map<string, string> = new Map(),
): { root: string | null; lemma: string; pos: string; form: number; feat: string; gloss: string | null } {
  const isVerb = stem.pos === 'V';
  const ov = isVerb ? FORM_OVERRIDES[`${stem.rootBw}|${stem.formNo}|${stem.lemmaBw}`] : undefined;
  const form = isVerb ? (ov?.form ?? stem.formNo) : 0;
  const lemmaBw = ov?.mergeInto ?? stem.lemmaBw;
  const root = stem.rootBw ? rootToArabic(stem.rootBw) : null;
  const lemma = lemmaBw ? bwLemmaToArabic(lemmaBw) : '';
  const gloss = isVerb && root
    ? glosses.get(`${root}|${form}|${lemma}`) ?? glosses.get(`${root}|${form}`) ?? null
    : !isVerb && lemma
      ? nounGlosses.get(`${lemma}|${stem.pos}`) ?? null
      : null;
  return { root, lemma, pos: stem.pos, form, feat: stem.featureTokens.join('|'), gloss };
}
