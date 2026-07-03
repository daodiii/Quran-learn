// src/lib/lookup-search.ts
// Pure in-memory matching over the packed index. Browser-safe; the page script
// is only DOM glue around this module.
import { normalizeArabic, isArabicQuery, foldLatin } from './arabic-normalize.ts';

type PackedAnalysis = [string, string, string | null, string, string, number, string,
  string[], string[], string | null, number, string[]];
export interface LookupIndexData {
  meta: { source: string; words: number; analyses: number; version: number };
  words: Record<string, PackedAnalysis[]>;
  altKeys: Record<string, string>;
}
export interface KeyRef { key: string; surface: string; total: number; hint: string | null }
export interface Prepared {
  data: LookupIndexData;
  keys: string[];                       // sorted by total desc (suggestion ranking)
  refs: Map<string, KeyRef>;
  folds: Array<[string, string]>;       // [foldedTranslit, key]
  glossed: Array<[string, string]>;     // [lowercased gloss, key]
}

export function prepareIndex(data: LookupIndexData): Prepared {
  const refs = new Map<string, KeyRef>();
  const folds: Array<[string, string]> = [];
  const glossed: Array<[string, string]> = [];
  for (const [key, list] of Object.entries(data.words)) {
    const total = list.reduce((n, a) => n + a[10], 0);
    refs.set(key, { key, surface: list[0][0], total, hint: list.find(a => a[9])?.[9] ?? null });
    const seenFold = new Set<string>();
    for (const a of list) {
      const f = foldLatin(a[1]);
      if (f && !seenFold.has(f)) { seenFold.add(f); folds.push([f, key]); }
      if (a[9]) glossed.push([a[9].toLowerCase(), key]);
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
export interface LatinResult { kind: 'latin'; sound: KeyRef[]; meaning: KeyRef[] }

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
  const ql = q.toLowerCase();
  const sound: KeyRef[] = [];
  const seen = new Set<string>();
  if (f.length >= 2) {
    for (const [fold, key] of p.folds) {
      if (fold.startsWith(f) && !seen.has(key)) { seen.add(key); sound.push(p.refs.get(key)!); }
    }
  }
  const meaning: KeyRef[] = [];
  const seenM = new Set<string>();
  if (ql.length >= 3) {
    for (const [gloss, key] of p.glossed) {
      if (gloss.includes(ql) && !seenM.has(key)) { seenM.add(key); meaning.push(p.refs.get(key)!); }
    }
  }
  // Sort BEFORE capping: the scans collect in insertion order, and truncating
  // first would drop high-frequency matches (e.g. "ta" losing taʿmalūna).
  sound.sort((a, b) => b.total - a.total);
  meaning.sort((a, b) => b.total - a.total);
  return { kind: 'latin', sound: sound.slice(0, 20), meaning: meaning.slice(0, 20) };
}
