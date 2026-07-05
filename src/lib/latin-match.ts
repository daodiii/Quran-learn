// src/lib/latin-match.ts
// English token matching with a light, deterministic stemmer. Browser-safe,
// dependency-free. Shared by lookup-search (word glosses) and verb-search
// (verb meanings). NOT a linguistic stemmer: correctness = both sides of a
// comparison pass through the same function, so only CONSISTENCY matters.

const IRREGULAR: Record<string, string> = {
  became: 'become', began: 'begin', begun: 'begin', bought: 'buy',
  brought: 'bring', came: 'come', chose: 'choose', chosen: 'choose',
  fell: 'fall', fallen: 'fall', felt: 'feel', forgave: 'forgive',
  forgiven: 'forgive', found: 'find', gave: 'give', given: 'give',
  gone: 'go', held: 'hold', kept: 'keep', knew: 'know', known: 'know',
  left: 'leave', made: 'make', rose: 'rise', risen: 'rise', said: 'say',
  saw: 'see', seen: 'see', sent: 'send', sought: 'seek', spoke: 'speak',
  spoken: 'speak', thought: 'think', told: 'tell', took: 'take',
  taken: 'take', went: 'go', wrote: 'write', written: 'write',
};

// Pipeline order is load-bearing (see families/family test): irregulars,
// ies/ied → y, plural -es/-s, one suffix, trailing i → y,
// trailing e strip, doubled-final-letter collapse.
export function stem(word: string): string {
  let w = word.toLowerCase();
  // Irregulars REJOIN the pipeline (no early return): the canonical form must
  // reduce exactly like a directly-stemmed query ('gave'→'give'→'giv' ≡ 'give'→'giv').
  const irr = Object.hasOwn(IRREGULAR, w) ? IRREGULAR[w] : undefined;
  if (irr) w = irr;
  if (w.length > 4 && (w.endsWith('ies') || w.endsWith('ied'))) w = w.slice(0, -3) + 'y';
  if (w.length > 3 && /(s|x|z|ch|sh)es$/.test(w)) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  for (const suf of ['ings', 'ing', 'ers', 'er', 'ed', 'ly', 'ful']) {
    if (w.length - suf.length >= 3 && w.endsWith(suf)) { w = w.slice(0, -suf.length); break; }
  }
  if (w.length > 3 && w.endsWith('i')) w = w.slice(0, -1) + 'y';
  if (w.length > 3 && w.endsWith('e')) w = w.slice(0, -1);
  if (w.length > 3 && w[w.length - 1] === w[w.length - 2]) w = w.slice(0, -1);
  return w;
}

export interface GlossToken { text: string; stem: string; start: number; end: number }
export interface PreparedGloss { raw: string; lower: string; tokens: GlossToken[] }
export interface QueryToken { text: string; stem: string }
export interface GlossMatch { tier: 1 | 2 | 3; ranges: [number, number][] }

const WORD_RE = /[a-z0-9']+/g;

export function prepareGloss(raw: string): PreparedGloss {
  const lower = raw.toLowerCase();
  const tokens: GlossToken[] = [];
  for (const m of lower.matchAll(WORD_RE))
    tokens.push({ text: m[0], stem: stem(m[0]), start: m.index!, end: m.index! + m[0].length });
  return { raw, lower, tokens };
}

// 1-char tokens are noise ("a", "o") — dropped here so they can never match.
export function prepareQuery(rawQuery: string): QueryToken[] {
  const out: QueryToken[] = [];
  for (const m of rawQuery.toLowerCase().matchAll(WORD_RE))
    if (m[0].length >= 2) out.push({ text: m[0], stem: stem(m[0]) });
  return out;
}

function mergeRanges(ranges: [number, number][]): [number, number][] {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    // gap ≤1 (space, hyphen, any single separator) — mark adjacent words as one
    if (last && r[0] <= last[1] + 1) last[1] = Math.max(last[1], r[1]);
    else out.push([r[0], r[1]]);
  }
  return out;
}

// Tiers: 1 whole-word (token or stem equality) · 2 token-prefix (query ≥3
// chars) · 3 raw substring (query ≥3 chars). Every query token must match;
// the gloss ranks at its WORST token tier.
export function matchGloss(queryTokens: QueryToken[], gloss: PreparedGloss): GlossMatch | null {
  if (!queryTokens.length) return null;
  let worst: 1 | 2 | 3 = 1;
  const ranges: [number, number][] = [];
  for (const qt of queryTokens) {
    let hit: { tier: 1 | 2 | 3; range: [number, number] } | null = null;
    for (const t of gloss.tokens) {
      if (t.text === qt.text || t.stem === qt.stem) { hit = { tier: 1, range: [t.start, t.end] }; break; }
      if (!hit && qt.text.length >= 3 && t.text.startsWith(qt.text))
        hit = { tier: 2, range: [t.start, t.end] };
    }
    if (!hit && qt.text.length >= 3) {
      const i = gloss.lower.indexOf(qt.text);
      if (i >= 0) hit = { tier: 3, range: [i, i + qt.text.length] };
    }
    if (!hit) return null;
    if (hit.tier > worst) worst = hit.tier;
    ranges.push(hit.range);
  }
  return { tier: worst, ranges: mergeRanges(ranges) };
}
