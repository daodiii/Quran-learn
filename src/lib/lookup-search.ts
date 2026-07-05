// src/lib/lookup-search.ts
// Pure in-memory matching over the packed index. Browser-safe; the page script
// is only DOM glue around this module.
import { normalizeArabic, isArabicQuery, foldLatin } from './arabic-normalize.ts';
import { prepareGloss, prepareQuery, matchGloss } from './latin-match.ts';
import type { PreparedGloss } from './latin-match.ts';

type PackedAnalysis = [string, string, string | null, string, string, number, string,
  string[], string[], string | null, number, string[]];
export interface LookupIndexData {
  meta: { source: string; words: number; analyses: number; version: number };
  words: Record<string, PackedAnalysis[]>;
  altKeys: Record<string, string>;
}
export interface KeyRef {
  key: string; surface: string; translit: string; pos: string; form: number;
  total: number; hint: string | null;
}
export interface Prepared {
  data: LookupIndexData;
  keys: string[];                       // sorted by total desc (suggestion ranking)
  refs: Map<string, KeyRef>;
  folds: Array<[string, string]>;       // [foldedTranslit, key]
  glossed: Array<{ gloss: PreparedGloss; key: string }>;
}

export function prepareIndex(data: LookupIndexData): Prepared {
  const refs = new Map<string, KeyRef>();
  const folds: Array<[string, string]> = [];
  const glossed: Array<{ gloss: PreparedGloss; key: string }> = [];
  // 1,742 unique gloss strings back ~10k glossed entries — share PreparedGloss.
  const glossCache = new Map<string, PreparedGloss>();
  for (const [key, list] of Object.entries(data.words)) {
    const total = list.reduce((n, a) => n + a[10], 0);
    refs.set(key, {
      key, surface: list[0][0], translit: list[0][1],
      pos: list[0][4], form: list[0][5],
      total, hint: list.find(a => a[9])?.[9] ?? null,
    });
    const seenFold = new Set<string>();
    const seenGloss = new Set<string>();
    for (const a of list) {
      const f = foldLatin(a[1]);
      if (f && !seenFold.has(f)) { seenFold.add(f); folds.push([f, key]); }
      if (a[9] && !seenGloss.has(a[9])) {
        seenGloss.add(a[9]);
        let pg = glossCache.get(a[9]);
        if (!pg) { pg = prepareGloss(a[9]); glossCache.set(a[9], pg); }
        glossed.push({ gloss: pg, key });
      }
    }
  }
  const keys = [...refs.keys()].sort((a, b) => refs.get(b)!.total - refs.get(a)!.total);
  return { data, keys, refs, folds, glossed };
}

export interface ArabicResult {
  kind: 'arabic';
  exact: { key: string; analyses: PackedAnalysis[] } | null;
  suggestions: KeyRef[];
  didYouMean: KeyRef[];
}
export interface MeaningRef extends KeyRef {
  // The best-tier MATCHED gloss — meaning rows must render THIS (with ranges),
  // not the inherited `hint` (which is just the first glossed analysis).
  gloss: string; ranges: [number, number][]; tier: 1 | 2 | 3;
}
export interface LatinResult { kind: 'latin'; sound: KeyRef[]; meaning: MeaningRef[] }

export function search(p: Prepared, raw: string): ArabicResult | LatinResult {
  const q = raw.trim();
  if (isArabicQuery(q)) return searchArabic(p, q);
  return searchLatin(p, q);
}

function searchArabic(p: Prepared, q: string): ArabicResult {
  const k = normalizeArabic(q);
  const canonical = p.data.words[k] ? k : p.data.altKeys[k];
  const exact = canonical ? { key: canonical, analyses: p.data.words[canonical] } : null;
  // p.keys is pre-sorted by total desc, so filter-then-slice IS the true top-N
  // here — unlike the Latin routes, whose scan lists are in insertion order
  // and must therefore sort before capping.
  const suggestions = exact || !k ? [] :
    p.keys.filter(w => w.startsWith(k) && w !== k).slice(0, 8).map(w => p.refs.get(w)!);
  const didYouMean = exact || suggestions.length ? [] : nearestByPrefix(p, k);
  return { kind: 'arabic', exact, suggestions, didYouMean };
}

function nearestByPrefix(p: Prepared, k: string): KeyRef[] {
  for (let n = Math.min(k.length, 8) - 1; n >= 2; n--) {
    const pre = k.slice(0, n);
    const hits = p.keys.filter(w => w.startsWith(pre)).slice(0, 5);
    if (hits.length) return hits.map(w => p.refs.get(w)!);
  }
  return [];
}

function searchLatin(p: Prepared, q: string): LatinResult {
  const f = foldLatin(q);
  const sound: KeyRef[] = [];
  const seen = new Set<string>();
  if (f.length >= 2) {
    for (const [fold, key] of p.folds) {
      if (fold.startsWith(f) && !seen.has(key)) { seen.add(key); sound.push(p.refs.get(key)!); }
    }
  }
  const qTokens = prepareQuery(q);
  // Per key keep the BEST-tier gloss (a key can have several glossed analyses).
  const best = new Map<string, { gloss: PreparedGloss; tier: 1 | 2 | 3; ranges: [number, number][] }>();
  if (qTokens.length) {
    for (const { gloss, key } of p.glossed) {
      const m = matchGloss(qTokens, gloss);
      if (!m) continue;
      const prev = best.get(key);
      if (!prev || m.tier < prev.tier) best.set(key, { gloss, tier: m.tier, ranges: m.ranges });
    }
  }
  // Sort BEFORE capping (scan lists are insertion-ordered — see searchArabic
  // note); tier outranks frequency. Materialize refs only for the capped 20:
  // stop-word-shaped queries can match thousands of keys.
  const meaning: MeaningRef[] = [...best.entries()]
    .sort((a, b) => a[1].tier - b[1].tier
      || p.refs.get(b[0])!.total - p.refs.get(a[0])!.total)
    .slice(0, 20)
    .map(([key, b]) => ({ ...p.refs.get(key)!, gloss: b.gloss.raw, ranges: b.ranges, tier: b.tier }));
  sound.sort((a, b) => b.total - a.total);
  return { kind: 'latin', sound: sound.slice(0, 20), meaning };
}
