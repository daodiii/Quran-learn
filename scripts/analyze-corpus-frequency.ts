/**
 * Word and grammar frequency from the Quranic Arabic Corpus morphology file.
 * Counts orthographic words (one per s:v:w location) by the lemma of their stem.
 *
 *   npx tsx scripts/analyze-corpus-frequency.ts
 *
 * Writes docs/curriculum/frequency.json (full data) and prints a summary.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { bwLemmaToArabic } from './lib/buckwalter';

const FILE = 'src/data/morphology/quranic-corpus-morphology-0.4.txt';
const OUT_DIR = 'docs/curriculum';

// Words whose stem has no LEM (mostly pronouns) are keyed by "~POS:form" so they still count.
type Word = { stem?: { pos: string; lem?: string; root?: string; feats: string[] }; tags: string[] };
const words = new Map<string, Word>();

for (const line of readFileSync(FILE, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\((\d+):(\d+):(\d+):(\d+)\)\t([^\t]*)\t([^\t]*)\t(.*)$/);
  if (!m) continue;
  const key = `${m[1]}:${m[2]}:${m[3]}`;
  const feats = m[7].split('|');
  const w = words.get(key) ?? { tags: [] };
  w.tags.push(m[6]);
  if (feats[0] === 'STEM' && !w.stem) {
    const get = (p: string) => feats.find((f) => f.startsWith(p))?.slice(p.length);
    const pos = get('POS:') ?? m[6];
    w.stem = { pos, lem: get('LEM:') ?? `~${pos}:${m[5]}`, root: get('ROOT:'), feats };
  }
  words.set(key, w);
}

const total = words.size;
const noStem = [...words.values()].filter((w) => !w.stem).length;

// --- lemma frequency
const lemmaCount = new Map<string, { n: number; pos: string; root?: string }>();
const rootCount = new Map<string, number>();
for (const w of words.values()) {
  if (!w.stem?.lem) continue;
  const k = w.stem.lem;
  const e = lemmaCount.get(k) ?? { n: 0, pos: w.stem.pos, root: w.stem.root };
  e.n++;
  lemmaCount.set(k, e);
  if (w.stem.root) rootCount.set(w.stem.root, (rootCount.get(w.stem.root) ?? 0) + 1);
}
const lemmas = [...lemmaCount.entries()].sort((a, b) => b[1].n - a[1].n);
const roots = [...rootCount.entries()].sort((a, b) => b[1] - a[1]);

const cum = (arr: number[], n: number) => arr.slice(0, n).reduce((s, x) => s + x, 0);
const lemmaNs = lemmas.map(([, v]) => v.n);
const rootNs = roots.map(([, n]) => n);
const stems = [...words.values()].filter((w) => w.stem?.lem).length;
const levels = [25, 50, 100, 200, 300, 400, 500, 750, 1000, 1500, 2000];
const coverage = levels.map((n) => ({
  n,
  lemmaPct: +((cum(lemmaNs, n) / stems) * 100).toFixed(1),
  rootPct: +((cum(rootNs, n) / stems) * 100).toFixed(1),
}));

// --- grammar topics, counted per word (by its stem)
const has = (w: Word, f: string) => w.stem?.feats.includes(f) ?? false;
const topics: Record<string, number> = {};
const bump = (k: string) => (topics[k] = (topics[k] ?? 0) + 1);
const featureCount: Record<string, number> = {};
for (const w of words.values()) {
  if (!w.stem) continue;
  for (const f of w.stem.feats) if (!/^(LEM|ROOT|POS|STEM)/.test(f)) featureCount[f] = (featureCount[f] ?? 0) + 1;
  const pos = w.stem.pos;
  if (pos === 'V') {
    bump('verbs (all)');
    const form = w.stem.feats.find((f) => /^\((I{1,3}|IV|V|VI{1,3}|IX|X)\)$/.test(f));
    bump(form ? `verb form ${form.slice(1, -1)}` : 'verb form I');
    if (has(w, 'PERF')) bump('verb: past (perfect)');
    if (has(w, 'IMPF')) bump('verb: present (imperfect)');
    if (has(w, 'IMPV')) bump('verb: imperative');
    if (has(w, 'PASS')) bump('verb: passive');
    if (w.stem.feats.some((f) => f.startsWith('MOOD:SUBJ'))) bump('verb: subjunctive');
    if (w.stem.feats.some((f) => f.startsWith('MOOD:JUS'))) bump('verb: jussive');
    const r = w.stem.root;
    if (r && r.length === 3) {
      if (/[wy]/.test(r[0])) bump('verb root: assimilated (1st radical w/y)');
      if (/[wy]/.test(r[1])) bump('verb root: hollow (2nd radical w/y)');
      if (/[wy]/.test(r[2])) bump('verb root: defective (3rd radical w/y)');
      if (r.includes('A')) bump('verb root: hamzated');
      if (r[1] === r[2]) bump('verb root: doubled');
    }
  }
  if (pos === 'N' || pos === 'ADJ') {
    if (has(w, 'ACT') && has(w, 'PCPL')) bump('active participle');
    if (has(w, 'PASS') && has(w, 'PCPL')) bump('passive participle');
    if (has(w, 'VN')) bump('verbal noun (masdar)');
  }
  if (['PRON', 'DEM', 'REL', 'NEG', 'COND', 'ACC', 'EMPH', 'EXP', 'INTG', 'T', 'LOC', 'SUB', 'RES', 'CERT', 'VOC', 'RSLT'].includes(pos)) bump(`particle/pronoun class: ${pos}`);
  if (pos === 'PN') bump('proper nouns');
  if (w.stem.feats.some((f) => f.startsWith('NOM'))) bump('case: nominative');
  if (w.stem.feats.some((f) => f === 'ACC')) bump('case: accusative');
  if (w.stem.feats.some((f) => f === 'GEN')) bump('case: genitive');
  if (w.stem.feats.includes('D')) bump('number: dual');
}
const prefixes = { definiteArticle: 0 };
for (const w of words.values()) if (w.tags.includes('DET')) prefixes.definiteArticle++;
topics['words with the definite article (Al-)'] = prefixes.definiteArticle;

const top = lemmas.slice(0, 500).map(([bw, v], i) => ({
  rank: i + 1,
  lemmaBw: bw,
  arabic: bw.startsWith('~') ? '' : bwLemmaToArabic(bw),
  pos: v.pos,
  root: v.root ?? null,
  count: v.n,
  cumPct: +((cum(lemmaNs, i + 1) / stems) * 100).toFixed(1),
}));

const out = {
  source: FILE,
  totalWords: total,
  wordsWithoutStem: noStem,
  wordsWithLemma: stems,
  distinctLemmas: lemmas.length,
  distinctRoots: roots.length,
  coverage,
  lemmasOccurringOnce: lemmaNs.filter((n) => n === 1).length,
  topics,
  top500: top,
  featureCountTop: Object.entries(featureCount).sort((a, b) => b[1] - a[1]).slice(0, 60),
};
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(`${OUT_DIR}/frequency.json`, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ ...out, top500: undefined, featureCountTop: undefined }, null, 2));
