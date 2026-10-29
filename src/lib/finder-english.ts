// src/lib/finder-english.ts
// English understanding for the word finder. Browser-safe, dependency-free,
// no network. It reads the plain-English layer (src/data/finder/plain-layer.json)
// and answers "which base words does this English mean?" for phrases ("he said"),
// other forms of a word ("ate"), loanword spellings ("sabr") and typos ("beleive").
import { stem } from './latin-match.ts';

export interface LayerEntry {
  easy: string; kind: string; type: string[]; note: string | null; check: boolean;
  n: number;          // times in the Quran
  r: string[];        // root(s), Arabic letters as in the corpus
}
export type Layer = Record<string, LayerEntry>;   // key: "lemma|pos"

export interface Hint {
  person: '1' | '2' | '3' | null;
  number: 'S' | 'P' | null;
  tense: 'past' | 'present' | 'command' | null;
}
export interface Concept {
  key: string; entry: LayerEntry;
  tier: 0 | 1 | 2;                 // 0 exact phrase, 1 every word, 2 words from the plain meaning
  via: string;                     // the typing term that matched, for "why it matched"
  corrected: string | null;        // what the query was corrected to, when a typo was fixed
}
export interface Understood {
  tokens: string[];                // content words, lowercase
  hint: Hint;
  corrected: string | null;
}

// Words that carry person or tense but no meaning of their own.
const PRONOUN: Record<string, Pick<Hint, 'person' | 'number'>> = {
  i: { person: '1', number: 'S' }, me: { person: '1', number: 'S' },
  we: { person: '1', number: 'P' }, us: { person: '1', number: 'P' },
  you: { person: '2', number: null },
  he: { person: '3', number: 'S' }, she: { person: '3', number: 'S' }, it: { person: '3', number: 'S' },
  they: { person: '3', number: 'P' }, them: { person: '3', number: 'P' },
};
const FILLER = new Set(['the', 'a', 'an', 'to', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'am',
  'will', 'would', 'shall', 'does', 'has', 'have', 'had', 'my', 'your', 'his', 'her', 'their', 'our',
  'please', 'meaning', 'mean', 'word', 'arabic', 'what', 'how']);

// Past forms the stemmer cannot undo by rule, beyond the ones in latin-match.
const PAST_EXTRA = new Set(['ate', 'did', 'drank', 'ran', 'sat', 'stood', 'slept', 'died', 'lied', 'wept',
  'swore', 'fled', 'led', 'read', 'heard', 'paid', 'put', 'let', 'met', 'got', 'had', 'lost', 'won']);
const IRREGULAR_BASE: Record<string, string> = {
  ate: 'eat', eaten: 'eat', did: 'do', done: 'do', drank: 'drink', drunk: 'drink', ran: 'run',
  sat: 'sit', stood: 'stand', slept: 'sleep', wept: 'weep', swore: 'swear', sworn: 'swear',
  fled: 'flee', led: 'lead', heard: 'hear', paid: 'pay', lost: 'lose', won: 'win', got: 'get',
  rose: 'rise', woke: 'wake', fought: 'fight', taught: 'teach', caught: 'catch', brought: 'bring',
  bought: 'buy', built: 'build', broke: 'break', broken: 'break', hid: 'hide', hidden: 'hide',
  struck: 'strike', swam: 'swim', threw: 'throw', thrown: 'throw', understood: 'understand',
  began: 'begin', begun: 'begin', gave: 'give', given: 'give', knew: 'know', known: 'know',
  made: 'make', said: 'say', saw: 'see', seen: 'see', sent: 'send', took: 'take', taken: 'take',
  went: 'go', gone: 'go', wrote: 'write', written: 'write', came: 'come', spoke: 'speak',
  spoken: 'speak', thought: 'think', told: 'tell', found: 'find', forgave: 'forgive', forgiven: 'forgive',
  felt: 'feel', held: 'hold', kept: 'keep', left: 'leave', chose: 'choose', chosen: 'choose',
  fell: 'fall', fallen: 'fall', became: 'become',
};

const words = (s: string): string[] =>
  s.normalize('NFD').toLowerCase().replace(/[̀-ͯ]/g, '').match(/[a-z0-9']+/g) ?? [];

// Canonical stem of an English word, irregular verbs first ("ate" → "eat" → stem).
export function baseStem(w: string): string {
  return stem(Object.hasOwn(IRREGULAR_BASE, w) ? IRREGULAR_BASE[w] : w);
}

export function understand(query: string, vocab?: Vocab): Understood {
  const raw = words(query);
  const hint: Hint = { person: null, number: null, tense: null };
  const content: string[] = [];
  for (const w of raw) {
    const p = PRONOUN[w];
    if (p && raw.length > 1) { hint.person = p.person; hint.number = p.number; continue; }
    if (FILLER.has(w) && raw.length > 1) continue;
    content.push(w);
  }
  const toks = content.length ? content : raw;
  const last = toks[toks.length - 1] ?? '';
  if (hint.person) {
    const irregularPast = Object.hasOwn(IRREGULAR_BASE, last) && last !== IRREGULAR_BASE[last];
    hint.tense = PAST_EXTRA.has(last) || irregularPast || /ed$/.test(last) ? 'past' : 'present';
  }
  let corrected: string | null = null;
  const fixed = toks.map(t => {
    if (!vocab) return t;
    const f = vocab.fix(t);
    if (f && f !== t) corrected = (corrected ?? '') + (corrected ? ' ' : '') + f;
    return f ?? t;
  });
  return { tokens: fixed, hint, corrected: corrected ? fixed.join(' ') : null };
}

// ---------- vocabulary and typo tolerance ----------

export class Vocab {
  private stems = new Set<string>();
  private byLen = new Map<number, string[]>();   // surface words, by length, most-seen first
  constructor(counts: Map<string, number>) {
    const ordered = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0]);
    for (const w of ordered) {
      this.stems.add(baseStem(w));
      const l = this.byLen.get(w.length) ?? [];
      l.push(w); this.byLen.set(w.length, l);
    }
  }
  has(w: string): boolean { return this.stems.has(baseStem(w)); }
  // One edit for words of 4 to 6 letters, two for longer ones; never for 1 to 3 letters.
  fix(w: string): string | null {
    if (w.length < 4 || this.has(w)) return null;
    const max = w.length >= 8 ? 2 : 1;
    let best: string | null = null, bestD = max + 1;
    for (let len = w.length - max; len <= w.length + max; len++) {
      for (const c of this.byLen.get(len) ?? []) {
        if (c[0] !== w[0] && max === 1) continue;           // a wrong first letter is rarely a typo
        const d = damerau(w, c, bestD - 1);
        if (d < bestD) { bestD = d; best = c; if (d === 1) break; }
      }
      if (bestD === 1) break;
    }
    return best;
  }
}

// Optimal string alignment distance with an early exit above `cap`.
export function damerau(a: string, b: string, cap = 3): number {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  const dp: number[][] = [];
  for (let i = 0; i <= a.length; i++) { dp[i] = [i]; }
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, dp[i - 2][j - 2] + 1);
      dp[i][j] = v; if (v < rowMin) rowMin = v;
    }
    if (rowMin > cap) return cap + 1;
  }
  return dp[a.length][b.length];
}

// ---------- the index ----------

export interface PreparedLayer {
  layer: Layer;
  vocab: Vocab;
  phrase: Map<string, Array<{ key: string; rank: number; term: string }>>;   // stem phrase → entries
  token: Map<string, Array<{ key: string; rank: number; term: string }>>;    // stem → entries (typing terms)
  easy: Map<string, string[]>;                                               // stem → keys (plain meaning words)
}

export function prepareLayer(layer: Layer): PreparedLayer {
  const phrase: PreparedLayer['phrase'] = new Map();
  const token: PreparedLayer['token'] = new Map();
  const easy: PreparedLayer['easy'] = new Map();
  const counts = new Map<string, number>();
  const push = <T>(m: Map<string, T[]>, k: string, v: T) => { const l = m.get(k); if (l) l.push(v); else m.set(k, [v]); };
  for (const [key, e] of Object.entries(layer)) {
    e.type.forEach((term, rank) => {
      const ws = words(term);
      if (!ws.length) return;
      push(phrase, ws.map(baseStem).join(' '), { key, rank, term });
      for (const w of new Set(ws)) push(token, baseStem(w), { key, rank, term });
      for (const w of ws) counts.set(w, (counts.get(w) ?? 0) + 1);
    });
    for (const w of new Set(words(e.easy))) { push(easy, baseStem(w), key); counts.set(w, (counts.get(w) ?? 0) + 1); }
  }
  return { layer, vocab: new Vocab(counts), phrase, token, easy };
}

// Ranked concepts for an English query. Exact phrase beats "every word", which
// beats a hit in the plain meaning. Within a tier, a term earlier in an entry's list
// (more central) wins, then how often the word is in the Quran.
export function findConcepts(p: PreparedLayer, query: string, cap = 12): { concepts: Concept[]; understood: Understood } {
  const understood = understand(query, p.vocab);
  const toks = understood.tokens;
  const out = new Map<string, Concept & { score: number }>();
  if (!toks.length) return { concepts: [], understood };
  const stems = toks.map(baseStem);
  const add = (key: string, tier: 0 | 1 | 2, rank: number, via: string) => {
    const e = p.layer[key];
    const score = tier * 1000 + Math.min(rank, 20) * 10 - Math.log10(1 + e.n) * 50;
    const prev = out.get(key);
    if (!prev || score < prev.score) out.set(key, { key, entry: e, tier, via, corrected: understood.corrected, score });
  };
  // 1. the whole query as one typing term, tried with and without filler words
  const whole = [stems.join(' '), words(query).map(baseStem).join(' ')];
  for (const w of whole) for (const h of p.phrase.get(w) ?? []) add(h.key, 0, h.rank, h.term);
  // 2. every content word appears among one entry's typing-term words
  if (stems.length >= 1) {
    const lists = stems.map(s => p.token.get(s) ?? []);
    if (lists.every(l => l.length)) {
      const first = lists[0];
      for (const h of first) {
        const ok = lists.slice(1).every(l => l.some(x => x.key === h.key));
        if (ok) add(h.key, 1, h.rank, h.term);
      }
    }
  }
  // 3. every content word appears in the plain meaning
  const meaningHits = stems.map(s => new Set(p.easy.get(s) ?? []));
  if (meaningHits.every(s => s.size)) {
    for (const k of meaningHits[0]) if (meaningHits.every(s => s.has(k))) add(k, 2, 10, p.layer[k].easy);
  }
  const concepts = [...out.values()].sort((a, b) => a.score - b.score).slice(0, cap)
    .map(({ score, ...c }) => c);
  return { concepts, understood };
}
