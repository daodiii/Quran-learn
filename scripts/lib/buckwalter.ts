// Buckwalter transliteration (Quranic Arabic Corpus v0.4 variant) converters.
const BW_TO_AR: Record<string, string> = {
  "'": 'ء', '>': 'أ', '<': 'إ', '&': 'ؤ', '}': 'ئ', '|': 'آ',
  A: 'ا', b: 'ب', p: 'ة', t: 'ت', v: 'ث', j: 'ج', H: 'ح', x: 'خ',
  d: 'د', '*': 'ذ', r: 'ر', z: 'ز', s: 'س', $: 'ش', S: 'ص', D: 'ض',
  T: 'ط', Z: 'ظ', E: 'ع', g: 'غ', f: 'ف', q: 'ق', k: 'ك', l: 'ل',
  m: 'م', n: 'ن', h: 'ه', w: 'و', y: 'ي', Y: 'ى', '{': 'ٱ',
  '`': 'ٰ', F: 'ً', N: 'ٌ', K: 'ٍ', a: 'َ', u: 'ُ', i: 'ِ',
  '~': 'ّ', o: 'ْ', _: 'ـ',
};

const AR_LETTER = /[ء-يآ]/;
const AR_MARK = /[ً-ْٰ]/;
const NEVER_SUKUN = new Set(['ا', 'آ', 'ى']); // long-vowel / madda carriers

// Corpus lemmas omit some internal sukuns (>anzala → أَنزَلَ). Fill them in:
// a consonant directly followed by another letter takes sukun — unless it is
// a long-vowel carrier (ا always; و after damma; ي after kasra).
function fillSukun(s: string): string {
  const chars = [...s];
  const out: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    out.push(c);
    if (!AR_LETTER.test(c) || NEVER_SUKUN.has(c)) continue;
    const next = chars[i + 1];
    if (next === undefined || !AR_LETTER.test(next)) continue; // mark or end follows
    const prev = chars[i - 1];
    if (c === 'و' && prev === 'ُ') continue; // ū
    if (c === 'ي' && prev === 'ِ') continue; // ī
    out.push('ْ');
  }
  return out.join('');
}

// Display convention: dictionary-style wasla shown as bare alif + short vowel
// (اِسْتَغْفَرَ), matching the site's verb-forms master reference. Output is
// NFC-normalized so mark ordering (fatha vs shadda) is canonical.
export function bwToArabic(bw: string): string {
  let out = '';
  for (const ch of bw) out += BW_TO_AR[ch] ?? ch;
  return fillSukun(out.replace(/^ٱ/, 'ا')).normalize('NFC');
}

const BW_CONSONANT_TL: Record<string, string> = {
  "'": 'ʾ', '>': 'ʾ', '<': 'ʾ', '&': 'ʾ', '}': 'ʾ',
  b: 'b', t: 't', v: 'th', j: 'j', H: 'ḥ', x: 'kh', d: 'd', '*': 'dh',
  r: 'r', z: 'z', s: 's', $: 'sh', S: 'ṣ', D: 'ḍ', T: 'ṭ', Z: 'ẓ',
  E: 'ʿ', g: 'gh', f: 'f', q: 'q', k: 'k', l: 'l', m: 'm', n: 'n',
  h: 'h', w: 'w', y: 'y', p: 'a',
};

// Draft-quality scholarly transliteration; gloss curation reviews/corrects it.
export function bwToTranslit(bw: string): string {
  // Normalize: madda = ʾā; wasla starts lemmas of Forms VII–X.
  let s = bw.replace(/\|/g, ">aA").replace(/^\{/, '');
  let out = '';
  let i = 0;
  let prev = ''; // last emitted consonant cluster (for shadda)
  while (i < s.length) {
    const ch = s[i];
    if (ch === 'a') {
      if (s[i + 1] === 'A' || s[i + 1] === 'Y' || s[i + 1] === '`') { out += 'ā'; i += 2; continue; }
      out += 'a'; i++; continue;
    }
    if (ch === 'i') {
      if (s[i + 1] === 'y' && !'aiu~'.includes(s[i + 2] ?? '')) { out += 'ī'; i += 2; continue; }
      out += 'i'; i++; continue;
    }
    if (ch === 'u') {
      if (s[i + 1] === 'w' && !'aiu~'.includes(s[i + 2] ?? '')) { out += 'ū'; i += 2; continue; }
      out += 'u'; i++; continue;
    }
    if (ch === 'o') { i++; continue; }              // sukun
    if (ch === '~') { out += prev; i++; continue; } // shadda doubles consonant
    if (ch === 'A') { out += 'ā'; i++; continue; }  // bare alif (defective spellings)
    const tl = BW_CONSONANT_TL[ch];
    if (tl !== undefined) { prev = tl; out += tl; i++; continue; }
    i++; // unknown marker: skip in draft
  }
  return out.replace(/^ʾ/, '');
}
