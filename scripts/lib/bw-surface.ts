// scripts/lib/bw-surface.ts
// Converters for corpus FORM strings (surface text, Tanzil Uthmani in extended
// Buckwalter). Unlike buckwalter.ts (lemma display), surfaces carry their exact
// diacritics and Quranic annotation marks — convert strictly, never guess.
import { bwToTranslit, BW_ANNOTATION_MARKS } from './buckwalter.ts';

const BW_SURFACE: Record<string, string> = {
  "'": 'ء', '>': 'أ', '<': 'إ', '&': 'ؤ', '}': 'ئ', '|': 'آ',
  A: 'ا', b: 'ب', p: 'ة', t: 'ت', v: 'ث', j: 'ج', H: 'ح', x: 'خ',
  d: 'د', '*': 'ذ', r: 'ر', z: 'ز', s: 'س', $: 'ش', S: 'ص', D: 'ض',
  T: 'ط', Z: 'ظ', E: 'ع', g: 'غ', f: 'ف', q: 'ق', k: 'ك', l: 'ل',
  m: 'م', n: 'ن', h: 'ه', w: 'و', y: 'ي', Y: 'ى', '{': 'ٱ',
  '`': 'ٰ', F: 'ً', N: 'ٌ', K: 'ٍ', a: 'َ', u: 'ُ', i: 'ِ',
  '~': 'ّ', o: 'ْ', '_': 'ـ',
  ' ': ' ', // 37:130 إِلْ يَاسِينَ — the one corpus FORM with an embedded space
  // Tanzil extended Buckwalter — Uthmani annotation marks (shared table):
  ...BW_ANNOTATION_MARKS,
};

export function bwToArabicSurface(bw: string): string {
  let out = '';
  for (const ch of bw) {
    const ar = BW_SURFACE[ch];
    if (ar === undefined) {
      throw new Error(`bwToArabicSurface: unmapped Buckwalter char "${ch}" in "${bw}"`);
    }
    out += ar;
  }
  return out.normalize('NFC');
}

// Draft-quality transliteration of a whole surface. Known cosmetic limits
// (accepted in the spec): rare non-article "al…" words gain a hyphen; tanwin
// before pause is rendered fully voweled. Sound-search folds hide most of this.
const MARK_CHARS = new Set(Object.keys(BW_ANNOTATION_MARKS));

export function bwToTranslitSurface(bw: string): string {
  let s = [...bw].filter(c => !MARK_CHARS.has(c)).join('');
  s = s.replace(/(.)\1~/g, '$1$1');            // written gemination (الله): don't triple
  s = s[0] === '{' ? 'a' + s.slice(1) : s;     // initial hamzat wasl: liaison vowel
  s = s.replace(/\{/g, '');                    // medial wasla: silent
  s = s.replace(/^([wf]a)?([bk]i?a?)?al(.)~/, '$1$2a$3~'); // article + sun letter assimilates
  s = s.replace(/w`/g, 'A');                   // وٰ pronounced ā (Uthmani spelling)
  s = s.replace(/p(?=[aiuFNK])/g, 't').replace(/p/g, 'h'); // ta marbuta
  s = s.replace(/F[AY]?/g, 'an').replace(/N/g, 'un').replace(/K/g, 'in'); // tanwin
  const core = bwToTranslit(s);
  // Moon-letter hyphen excludes a following l: "allahi"/"alladhīna" keep their
  // written gemination rather than becoming "al-lahi".
  return core
    .replace(/^((?:wa|fa)?(?:bi|ka)?al)(?=[^aeiouāīūl])/, '$1-')
    .replace(/^((?:wa|fa)?(?:bi|ka)?a(sh|th|dh|[tdrzsnṣḍṭẓ]))(?=\2)/, '$1-');
}
