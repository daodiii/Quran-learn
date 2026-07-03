// src/lib/grammar-labels.ts
// Human-readable labels for corpus tags. Browser-safe, dependency-free.
// Unknown codes are shown raw (honest + debuggable), never dropped.

export const ROMAN_FORMS = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];

const POS: Record<string, string> = {
  N: 'noun', PN: 'proper noun', V: 'verb', ADJ: 'adjective', P: 'preposition',
  PRON: 'pronoun', DEM: 'demonstrative', REL: 'relative pronoun',
  CONJ: 'conjunction', SUB: 'subordinating conjunction',
  ACC: 'accusative particle (inna-family)', NEG: 'negative particle',
  T: 'time adverb', LOC: 'location adverb', COND: 'conditional particle',
  RES: 'restriction particle', INTG: 'interrogative particle',
  CERT: 'particle of certainty', PRO: 'prohibition particle',
  PREV: 'preventive particle', RET: 'retraction particle',
  EXP: 'exceptive particle', INC: 'inceptive particle', EXL: 'explanation particle',
  AMD: 'amendment particle', INT: 'particle of interpretation', FUT: 'future particle',
  EXH: 'exhortation particle', ANS: 'answer particle', SUR: 'surprise particle',
  AVR: 'aversion particle', INL: 'Quranic initials (muqattaat)',
  SUP: 'supplemental particle', IMPN: 'imperative verbal noun',
};
export function posLabel(code: string): string { return POS[code] ?? code; }

const TOKENS: Record<string, string> = {
  PERF: 'past (perfect)', IMPF: 'present (imperfect)', IMPV: 'imperative',
  ACT: 'active', PASS: 'passive', PCPL: 'participle', VN: 'verbal noun',
  NOM: 'nominative', ACC: 'accusative', GEN: 'genitive', INDEF: 'indefinite',
  'MOOD:JUS': 'jussive mood', 'MOOD:SUBJ': 'subjunctive mood',
  'SP:<in~': 'inna-family', 'SP:kaAn': 'kana-family', 'SP:kaAd': 'kada-family',
};
const PERSON: Record<string, string> = { '1': '1st person', '2': '2nd person', '3': '3rd person' };
const GENDER: Record<string, string> = { M: 'masculine', F: 'feminine' };
const NUMBER: Record<string, string> = { S: 'singular', D: 'dual', P: 'plural' };

function tokenLabel(t: string): string {
  if (TOKENS[t]) return TOKENS[t];
  const m = t.match(/^([123])?(M|F)?(S|D|P)?$/);
  // Require person or gender: a bare "P" (particle-function tag) must not
  // masquerade as "plural".
  if (m && (m[1] || m[2]) && t.length) {
    return [PERSON[m[1] ?? ''], GENDER[m[2] ?? ''], NUMBER[m[3] ?? '']]
      .filter(Boolean).join(' ');
  }
  return t;
}

export function grammarLine(pos: string, form: number, feat: string): string {
  const head = form > 0 ? `${posLabel(pos)}, Form ${ROMAN_FORMS[form - 1] ?? form}` : posLabel(pos);
  const tokens = feat ? feat.split('|').map(tokenLabel).filter(Boolean) : [];
  return tokens.length ? `${head} — ${tokens.join(', ')}` : head;
}

// Affix feature → teaching label. The Arabic segment itself is displayed from
// corpus data next to this label; the label is reference content.
const AFFIXES: Record<string, string> = {
  'Al+': 'al- (the)', 'bi+': 'bi- (with, by)', 'ka+': 'ka- (like)',
  'ta+': 'ta- (oath: by)', 'sa+': 'sa- (will)', 'ya+': 'ya- (O, calling)',
  'ha+': 'ha- (behold)', 'A:INTG+': 'a- (question marker)', 'A:EQ+': 'a- (whether)',
  'w:CONJ+': 'wa- (and)', 'w:REM+': 'wa- (then)', 'w:CIRC+': 'wa- (while)',
  'w:SUP+': 'wa- (and)', 'w:P+': 'wa- (oath: by)', 'w:COM+': 'wa- (with)',
  'f:CONJ+': 'fa- (and, so)', 'f:REM+': 'fa- (then, so)', 'f:RSLT+': 'fa- (so, as a result)',
  'f:SUP+': 'fa- (then)', 'f:CAUS+': 'fa- (so that)',
  'l:P+': 'li- (for, to)', 'l:EMPH+': 'la- (surely)', 'l:PRP+': 'li- (in order to)',
  'l:IMPV+': 'li- (let ...)',
  '+n:EMPH': 'emphasis -nna', '+VOC': 'vocative ending',
  'PRON:1S': 'I / me / my', 'PRON:1P': 'we / us / our',
  'PRON:2MS': 'you / your (masc.)', 'PRON:2FS': 'you / your (fem.)',
  'PRON:2D': 'you two', 'PRON:2MD': 'you two', 'PRON:2FD': 'you two',
  'PRON:2MP': 'you / your (plural)', 'PRON:2FP': 'you / your (fem. plural)',
  'PRON:3MS': 'him / his / it', 'PRON:3FS': 'her / hers / it',
  'PRON:3D': 'they two / their', 'PRON:3MD': 'they two / their',
  'PRON:3FD': 'they two / their', 'PRON:3MP': 'they / them / their',
  'PRON:3FP': 'they / them / their (fem.)',
};
export function affixLabel(feature: string): string { return AFFIXES[feature] ?? feature; }
