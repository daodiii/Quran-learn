// src/lib/finder-card.ts
// Pure helpers for the finder's word card: turn corpus tags into plain English and group
// written forms under their base word. Browser-safe, dependency-free apart from grammar-labels.
import { affixLabel } from './grammar-labels.ts';

// Same packed row as lookup-search: [surface, translit, root, lemma, pos, form, feat,
// prefixes, suffixes, gloss, count, refs].
export type Row = [string, string, string | null, string, string, number, string,
  string[], string[], string | null, number, string[]];

export interface Part { ar: string; say: string; role: 'prefix' | 'stem' | 'ending' }
export interface Built { parts: Part[]; who: string | null; when: string | null; line: string }

const PERSON: Record<string, string> = {
  '1S': 'I', '1P': 'we',
  '2MS': 'you (one man)', '2FS': 'you (one woman)', '2MP': 'you (several men)', '2FP': 'you (several women)',
  '2D': 'you two', '2MD': 'you two', '2FD': 'you two',
  '3MS': 'he', '3FS': 'she', '3MP': 'they (several men)', '3FP': 'they (several women)',
  '3D': 'they two', '3MD': 'they two', '3FD': 'they two',
};
const WHEN: Record<string, string> = { PERF: 'in the past', IMPF: 'now or later', IMPV: 'as a command' };

// "wa- (and)" → "and"; a label with no brackets is used whole.
const inBrackets = (label: string): string => label.match(/\(([^)]+)\)/)?.[1] ?? label;

// "ونَ|PRON:3MP" → { ar: "ونَ", say: "they, them" }; "وَ|w:CONJ+" → { ar: "وَ", say: "and" }
function piece(raw: string, role: 'prefix' | 'ending'): Part {
  const [ar, tag] = raw.split('|');
  const label = affixLabel(tag ?? '');
  const say = role === 'ending' && tag?.startsWith('PRON:') ? label.replace(/ \/ /g, ', ') : inBrackets(label);
  return { ar, say, role };
}

export function plainPerson(feat: string): string | null {
  for (const t of feat.split('|')) if (PERSON[t]) return PERSON[t];
  return null;
}

export function howBuilt(a: Row, easy: string): Built {
  const parts: Part[] = [
    ...a[7].map(p => piece(p, 'prefix')),
    { ar: a[3] || a[0], say: easy, role: 'stem' },
    ...a[8].map(p => piece(p, 'ending')),
  ];
  const tokens = a[6].split('|');
  const who = a[4] === 'V' ? plainPerson(a[6]) : null;
  const when = a[4] === 'V' ? tokens.map(t => WHEN[t]).find(Boolean) ?? null : null;
  const bits = [...a[7].map(p => piece(p, 'prefix').say), easy];
  const end = a[8].map(p => piece(p, 'ending').say);
  if (end.length) bits.push('+ ' + end.join(' '));
  return { parts, who, when, line: bits.join(' · ') };
}

// Group every written form under its base word: "lemma|pos" → keys, most-used first.
export function groupByLemma(words: Record<string, Row[]>): Map<string, string[]> {
  const total = (k: string) => words[k].reduce((n, a) => n + a[10], 0);
  const g = new Map<string, string[]>();
  for (const [key, list] of Object.entries(words)) {
    for (const lp of new Set(list.map(a => `${a[3]}|${a[4]}`))) {
      const l = g.get(lp); if (l) l.push(key); else g.set(lp, [key]);
    }
  }
  for (const l of g.values()) l.sort((a, b) => total(b) - total(a));
  return g;
}

// Root letters compared the way verb-search compares them: hamza carriers collapse.
export const rootKey = (s: string): string =>
  s.replace(/[ً-ْٰ]/g, '').replace(/[أإآٱؤئ]/g, 'ء').replace(/[·\s\-]/g, '');
