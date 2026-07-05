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
// ies/ied → y, plural -es/-s, one derivational suffix, trailing i → y,
// trailing e strip, doubled-final-consonant collapse.
export function stem(word: string): string {
  let w = word.toLowerCase();
  // Irregulars REJOIN the pipeline (no early return): the canonical form must
  // reduce exactly like a directly-stemmed query ('gave'→'give'→'giv' ≡ 'give'→'giv').
  const irr = IRREGULAR[w];
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
