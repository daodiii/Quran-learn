// src/lib/verb-search.ts
// Pure matching over verb-forms.json roots — extracted from the generator
// page so behavior is unit-tested; the page is DOM glue only.
import { foldLatin, isArabicQuery } from './arabic-normalize.ts';
import { prepareGloss, prepareQuery, matchGloss } from './latin-match.ts';
import type { PreparedGloss } from './latin-match.ts';

export interface VerbEntry {
  past: string; present: string | null; translit: string;
  meaning: string | null; count: number; example: string;
}
export interface VerbRoot {
  root: string; translit: string; quad: boolean; totalCount: number;
  forms: Record<string, VerbEntry[]>;
}
interface Item {
  root: VerbRoot; rootNorm: string; rootFold: string;
  entries: Array<{ formNo: string; entry: VerbEntry; fold: string; gloss: PreparedGloss | null }>;
  top: { formNo: string; entry: VerbEntry };
}
export interface PreparedVerbs { items: Item[] }
export interface VerbMatch {
  root: VerbRoot; reason: 'root' | 'translit' | 'meaning';
  formNo: string; meaning: string | null; ranges: [number, number][] | null;
}

// Root-letter comparison collapses hamza carriers — a user typing ءمن or أمن
// must hit the same root. Different from normalizeArabic (which maps to ا).
const AR_DIACRITICS = /[ً-ْٰ]/g;
const normalizeRoot = (s: string) =>
  s.replace(AR_DIACRITICS, '').replace(/[أإآٱؤئ]/g, 'ء').replace(/[·\s\-]/g, '');

export function prepareVerbs(roots: VerbRoot[]): PreparedVerbs {
  const items: Item[] = roots.map((root) => {
    const entries = Object.entries(root.forms).flatMap(([formNo, list]) =>
      list.map((entry) => ({
        formNo, entry, fold: foldLatin(entry.translit),
        gloss: entry.meaning ? prepareGloss(entry.meaning) : null,
      })));
    // Every root carries ≥1 entry (guaranteed by extract-verbs); an empty
    // forms map would make `top` undefined and throw at page load.
    const top = entries.reduce((a, b) => (b.entry.count > a.entry.count ? b : a), entries[0]);
    return { root, rootNorm: normalizeRoot(root.root), rootFold: foldLatin(root.translit),
             entries, top: { formNo: top.formNo, entry: top.entry } };
  });
  return { items };
}

export function searchVerbs(p: PreparedVerbs, rawQuery: string, cap = 12): VerbMatch[] {
  const q = rawQuery.trim();
  const out: Array<VerbMatch & { rank: number }> = [];
  if (isArabicQuery(q)) {
    const nq = normalizeRoot(q);
    if (!nq) return [];
    for (const it of p.items) {
      if (it.rootNorm.includes(nq)) out.push({
        root: it.root, reason: 'root', formNo: it.top.formNo,
        meaning: it.top.entry.meaning, ranges: null, rank: 2,
      });
    }
  } else {
    const fq = foldLatin(q);
    const qTokens = prepareQuery(q);
    for (const it of p.items) {
      const translitHit = fq.length >= 2 &&
        (it.rootFold.includes(fq) || it.entries.some(e => e.fold.includes(fq)));
      let bestGloss: { formNo: string; entry: VerbEntry; tier: number; ranges: [number, number][] } | null = null;
      if (qTokens.length) {
        for (const e of it.entries) {
          if (!e.gloss) continue;
          const m = matchGloss(qTokens, e.gloss);
          if (m && (!bestGloss || m.tier < bestGloss.tier))
            bestGloss = { formNo: e.formNo, entry: e.entry, tier: m.tier, ranges: m.ranges };
        }
      }
      if (bestGloss && (!translitHit || bestGloss.tier <= 2)) out.push({
        root: it.root, reason: 'meaning', formNo: bestGloss.formNo,
        meaning: bestGloss.entry.meaning, ranges: bestGloss.ranges, rank: bestGloss.tier,
      });
      else if (translitHit) out.push({
        root: it.root, reason: 'translit', formNo: it.top.formNo,
        meaning: it.top.entry.meaning, ranges: null, rank: 2,
      });
    }
  }
  // rank (meaning tier / translit=2) first, then corpus frequency.
  out.sort((a, b) => a.rank - b.rank || b.root.totalCount - a.root.totalCount);
  return out.slice(0, cap).map(({ rank, ...m }) => m);
}
