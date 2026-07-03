// src/lib/arabic-normalize.ts
// Single source of truth for lookup matching. Imported by BOTH the Node build
// pipeline and the browser page — index keys and query normalization must
// never drift apart. Keep this file dependency-free and browser-safe.

// Harakat (U+064B-U+065F) + superscript alef (U+0670) + Quranic annotation
// marks (U+06D6-U+06ED) + tatweel (U+0640) + whitespace: invisible to matching.
// Explicit escapes -- a raw character range here would swallow the Arabic-Indic digits.
const STRIP = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640\s]/g;

export function normalizeArabic(input: string): string {
  return input
    .normalize('NFC')
    .replace(STRIP, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ىی]/g, 'ي')  // alif maqsura + farsi yeh
    .replace(/ک/g, 'ك');     // farsi kaf (common on mobile keyboards)
}

export function isArabicQuery(q: string): boolean {
  return /[؀-ۿ]/.test(q);
}

// Fold scholarly transliteration to plain ASCII so loose typing matches.
// The table must cover every non-ASCII char bwToTranslit can emit
// (locked by a test in Task 6's validator).
const LATIN_FOLD: Record<string, string> = {
  'ā': 'a', 'ī': 'i', 'ū': 'u', 'â': 'a', 'î': 'i', 'û': 'u',
  'ḥ': 'h', 'ḍ': 'd', 'ṣ': 's', 'ṭ': 't', 'ẓ': 'z',
  'ʿ': '', 'ʾ': '', '‘': '', '’': '', 'ʻ': '', 'ʼ': '', "'": '', '`': '',
}

export function foldLatin(input: string): string {
  return [...input.normalize('NFC').toLowerCase()]
    .map(c => LATIN_FOLD[c] ?? c)
    .join('')
    .replace(/[\s\-·.]/g, '');
}

// Classical (Uthmani) orthography -> the spelling a modern hand types.
// Rules are mechanical, derived from the vocalized surface itself -- no word list.
export function deriveAltKeys(vocalized: string): string[] {
  const v = vocalized.normalize('NFC');
  const canonical = normalizeArabic(v);
  // Miniature letters (silat vowels) read as full letters when typed by hand.
  const smalls = (s: string) =>
    s.replace(/ۥ/g, 'و').replace(/[ۦۧ]/g, 'ي');
  // Superscript alef = an omitted alif in modern spelling. Seats:
  //   وٰ -> ا (الصلوٰة -> الصلاة)
  //   ءٰ -> ا or ءا (قرءٰن -> قران / قرءان)
  //   Cٰ -> Cا for consonants up to و -- deliberately EXCLUDES ى (U+0649),
  //   where the superscript alef only marks pronunciation (عَلَىٰ).
  // Strip harakat (U+064B–U+065F) but preserve dagger alif (U+0670) so the
  // consonant-dagger adjacency regex fires correctly on vocalized input.
  const stripHarakat = (s: string) => s.replace(/[ً-ٟ]/g, '');
  const daggerA = (s: string) => stripHarakat(s)
    .replace(/وٰ/g, 'ا').replace(/ءٰ/g, 'ا')
    .replace(/([ء-و])ٰ/g, '$1ا');
  const daggerB = (s: string) => stripHarakat(s)
    .replace(/ءٰ/g, 'ءا').replace(/وٰ/g, 'ا')
    .replace(/([ء-و])ٰ/g, '$1ا');
  const out = new Set<string>();
  for (const f of [smalls, daggerA, daggerB,
                   (x: string) => daggerA(smalls(x)), (x: string) => daggerB(smalls(x))]) {
    const k = normalizeArabic(f(v));
    if (k && k !== canonical) out.add(k);
  }
  return [...out];
}
