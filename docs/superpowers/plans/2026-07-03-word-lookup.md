# Word Lookup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A `/resources/word-lookup/` page where a user enters any written Quranic word (Arabic — vocalized/bare/Uthmani/modern — or Latin by sound or by meaning) and gets every attested analysis: root, POS, verb form, readable grammar, real morpheme breakdown, curated meaning (verbs), counts, refs, and a deep link into the Verb Form Generator.

**Architecture:** A build script parses the corpus morphology file, reconstructs whole written words from their segments, and emits one packed `public/data/word-lookup.json` (~19.4k analyses under ~15k normalized keys + alternate-spelling keys). The page lazy-fetches it on first focus and runs all matching in memory. Normalization lives in ONE shared module imported by both Node build and browser page. Spec: `docs/superpowers/specs/2026-07-03-word-lookup-design.md`.

**Tech Stack:** Astro static page (vanilla TS client script), Node libs under `scripts/lib/`, `tsx --test` (node:test + node:assert/strict), Playwright e2e (system Chrome via `channel: 'chrome'` — never download Chromium, disk is tight).

---

## Repo facts you must know (zero-context primer)

- **Run everything through npm scripts** (`npm run test:lookup` etc. — added in Task 5). Unit tests: `tsx --test <files>`. Imports use explicit `.ts` extensions (see `scripts/lib/buckwalter.test.ts`).
- **A security hook blocks `innerHTML`**. All dynamic DOM must be built with `document.createElement` — the generator page's `h()` helper is the established pattern. Dataset strings only ever land in `textContent` or attribute values.
- **No fabricated Arabic, ever.** Every Arabic string shown must come from the corpus, the curated gloss dataset, or (for teaching labels like "wa- (and)") a static grammar map that displays REAL segment text from the corpus next to it.
- **Conventional commits**, never mention AI/Claude in messages. Branch: `feat/word-lookup` (already exists, spec committed).
- **UI pipeline (CLAUDE.md, mandatory):** before writing the page's visual code (Task 9), load the Phase‑2 design skills (`taste-skill`, `impeccable`, `emil-design-eng`); after the UI is built run the `web-design-guidelines` audit (Task 11). Phase 1 (design-md-references) is intentionally skipped: this page inherits the site's locked visual direction 1:1 from `/resources/verb-forms/` (user-approved).
- **GPL attribution** footer required (corpus.quran.com), same as the generator page.
- **Corpus file format** (`src/data/morphology/quranic-corpus-morphology-0.4.txt`, tab-separated
  `LOCATION FORM TAG FEATURES`, 128,276 lines; header lines start with `#` or `LOCATION`):
  one row per SEGMENT; a written word = all rows sharing `(surah:ayah:word:*)`.
  `FORM` is extended Buckwalter. `FEATURES` starts with `PREFIX|`, `STEM|`, or `SUFFIX|`.
  Real rows used as fixtures throughout (copy them verbatim, do not invent rows):

```
(1:1:1:1)	bi	P	PREFIX|bi+
(1:1:1:2)	somi	N	STEM|POS:N|LEM:{som|ROOT:smw|M|GEN
(1:1:2:1)	{ll~ahi	PN	STEM|POS:PN|LEM:{ll~ah|ROOT:Alh|GEN
(2:1:1:1)	Al^m^	INL	STEM|POS:INL
(2:3:2:1)	yu&ominu	V	STEM|POS:V|IMPF|(IV)|LEM:'aAmana|ROOT:Amn|3MP
(2:3:2:2)	wna	PRON	SUFFIX|PRON:3MP
(2:3:5:1)	{l	DET	PREFIX|Al+
(2:3:5:2)	S~alaw`pa	N	STEM|POS:N|LEM:Salaw`p|ROOT:Slw|F|ACC
(2:4:4:1)	>unzila	V	STEM|POS:V|PERF|PASS|(IV)|LEM:>anzala|ROOT:nzl|3MS
(2:137:11:1)	fa	RSLT	PREFIX|f:RSLT+
(2:137:11:2)	<in~a	ACC	STEM|POS:ACC|LEM:<in~|SP:<in~
(2:137:11:3)	maA	PREV	STEM|POS:PREV|LEM:maA
(12:2:2:1)	>anzalo	V	STEM|POS:V|PERF|(IV)|LEM:>anzala|ROOT:nzl|1P
(12:2:2:2)	na`	PRON	SUFFIX|PRON:1P
(12:2:2:3)	hu	PRON	SUFFIX|PRON:3MS
(70:39:4:1)	m~i	P	STEM|POS:P|LEM:min
(70:39:4:2)	m~aA	REL	STEM|POS:REL|LEM:maA
```

  Notes: 486 words have TWO stems (`فَإِنَّمَا` = fa + inna + mā); subject endings
  (ونَ of يُؤْمِنُونَ, نَٰ of أَنزَلْنَٰهُ) are PRON SUFFIX rows — traditional grammar treats
  them as attached subject pronouns, so we display them role-neutrally ("they", "we/us");
  1,345 analyses have no root (particles); the muqaṭṭaʿāt (`الٓمٓ`) are POS:INL with no LEM/ROOT.
- **Measured basis:** 77,429 words → 18,993 vocalized surfaces → 14,989 normalized keys → 19,441
  distinct analyses. Raw distinct-analysis TSV gzips to 128 KB → final JSON must stay ≤ 600 KB gz.
- `يُنْزِلُونَ` does NOT occur in the Quran — never use it in tests or examples. Verified real
  surfaces for examples: `يُؤْمِنُونَ` (2:3), `ٱلصَّلَوٰةَ` (2:3), `بِسْمِ` (1:1), `أَنزَلْنَٰهُ` (12:2),
  `الٓمٓ` (2:1), `مَٰلِكِ` (1:4).

## File map

| File | Responsibility |
|---|---|
| `src/lib/arabic-normalize.ts` (+ `.test.ts`) | Query/key normalization, Latin folding, Uthmani alternate keys. Shared Node+browser. |
| `scripts/lib/bw-surface.ts` (+ `.test.ts`) | Extended-Buckwalter → Arabic surface (strict), surface transliteration. |
| `scripts/lib/group-words.ts` (+ `.test.ts`) | Parse all corpus rows; group segments into whole-word occurrences. |
| `scripts/lib/word-index.ts` (+ `.test.ts`) | Aggregate occurrences → packed index; overrides; gloss join; altKeys. |
| `scripts/build-word-lookup.ts` | Thin CLI: corpus + verb-forms.json → `public/data/word-lookup.json` + size guard. |
| `scripts/validate-word-lookup.ts` | All-77k round-trip + spot checks + reports. |
| `src/lib/grammar-labels.ts` (+ `.test.ts`) | POS/feature/prefix/suffix label maps + humanizers (browser-safe). |
| `src/lib/lookup-search.ts` (+ `.test.ts`) | prepareIndex + search (arabic/sound/meaning) + didYouMean. Pure, browser-safe. |
| `src/pages/resources/word-lookup/index.astro` | The page: shell, styles, client wiring. |
| `tests/word-lookup.spec.ts` | Playwright e2e. |
| Modify: `package.json`, `src/pages/resources/index.astro`, `src/pages/resources/verb-forms/index.astro` (one cross-link), `tests/accessibility.spec.ts` | Wiring. |

Packed analysis contract (used by Tasks 4, 6, 8, 9 — keep column order EXACTLY consistent):

```ts
type PackedAnalysis = [
  string,          // 0 vocalized surface (Arabic, Uthmani, NFC)
  string,          // 1 transliteration (draft quality, for display + sound search)
  string | null,   // 2 root (Arabic letters, e.g. "نزل") — null for particles
  string,          // 3 lemma (Arabic dictionary form) — '' when corpus has none
  string,          // 4 POS code (corpus tagset, e.g. "V","N","PN","P","INL")
  number,          // 5 verb form 1–12; 0 = not a verb
  string,          // 6 feature tokens joined '|' (e.g. "IMPF|3MP", "F|ACC")
  string[],        // 7 prefixes, each "arabicSegment|featureCode" e.g. "وَ|w:CONJ+"
  string[],        // 8 suffixes, same format e.g. "هُ|PRON:3MS" (subject endings included)
  string | null,   // 9 curated gloss (verbs in v1) — null otherwise
  number,          // 10 occurrence count of this exact analysis
  string[],        // 11 example verse refs "s:a", ≤ 3
];
interface LookupIndex {
  meta: { source: string; words: number; analyses: number; version: number };
  words: Record<string, PackedAnalysis[]>;  // key: normalizeArabic(surface)
  altKeys: Record<string, string>;          // alternate spelling → canonical key
}
```

---

### Task 1: Shared Arabic normalization — `src/lib/arabic-normalize.ts`

**Files:**
- Create: `src/lib/arabic-normalize.ts`
- Test: `src/lib/arabic-normalize.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/arabic-normalize.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeArabic, isArabicQuery, foldLatin, deriveAltKeys } from './arabic-normalize.ts';

test('normalizeArabic: strips harakat and quranic marks', () => {
  assert.equal(normalizeArabic('بِسْمِ'), 'بسم');
  assert.equal(normalizeArabic('يُؤْمِنُونَ'), 'يؤمنون');
  assert.equal(normalizeArabic('الٓمٓ'), 'الم');            // maddah U+0653
});
test('normalizeArabic: folds alif variants and wasla', () => {
  assert.equal(normalizeArabic('أَنزَلَ'), 'انزل');
  assert.equal(normalizeArabic('ٱللَّهِ'), 'الله');
  assert.equal(normalizeArabic('إِبْرَٰهِيم'), 'ابرهيم');    // dagger alif stripped
  assert.equal(normalizeArabic('آمَنَ'), 'امن');
});
test('normalizeArabic: alif maqsura and farsi chars fold', () => {
  assert.equal(normalizeArabic('عَلَىٰ'), 'علي');
  assert.equal(normalizeArabic('موسی'), 'موسي');             // farsi yeh U+06CC
  assert.equal(normalizeArabic('کتاب'), 'كتاب');             // farsi kaf U+06A9
});
test('normalizeArabic: keeps ta marbuta and hamza seats distinct', () => {
  assert.equal(normalizeArabic('رَحْمَة'), 'رحمة');
  assert.equal(normalizeArabic('سُئِلَ'), 'سئل');
});
test('normalizeArabic: idempotent', () => {
  const once = normalizeArabic('ٱلصَّلَوٰةَ');
  assert.equal(normalizeArabic(once), once);
});
test('isArabicQuery', () => {
  assert.equal(isArabicQuery('ملك'), true);
  assert.equal(isArabicQuery('malik'), false);
  assert.equal(isArabicQuery('  يؤمنون '), true);
});
test('foldLatin: macrons, dots, ayn/hamza, separators', () => {
  assert.equal(foldLatin('yunzilūna'), 'yunziluna');
  assert.equal(foldLatin('ʿallama'), 'allama');
  assert.equal(foldLatin('aṣ-ṣalāta'), 'assalata');
  assert.equal(foldLatin("yuʾminūna"), 'yuminuna');
  assert.equal(foldLatin('Istaghfara'), 'istaghfara');
});
test('deriveAltKeys: waw-seated dagger alif → modern alif spelling', () => {
  assert.deepEqual(deriveAltKeys('ٱلصَّلَوٰةَ'), ['الصلاة']);
});
test('deriveAltKeys: bare dagger alif → inserted alif', () => {
  assert.deepEqual(deriveAltKeys('كِتَٰب'), ['كتاب']);
});
test('deriveAltKeys: hamza-seated dagger alif → both modern spellings', () => {
  const alts = deriveAltKeys('قُرْءَٰن');
  assert.ok(alts.includes('قران'));
  assert.ok(alts.includes('قرءان'));
});
test('deriveAltKeys: small yeh → typed ya (ibrahim case)', () => {
  assert.ok(deriveAltKeys('إِبْرَٰهِۧمَ').includes('ابراهيم'));
});
test('deriveAltKeys: no alternates when spelling is already modern', () => {
  assert.deepEqual(deriveAltKeys('يُؤْمِنُونَ'), []);
  assert.deepEqual(deriveAltKeys('عَلَىٰ'), []); // alif-maqsura dagger is NOT a spelling gap
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx tsx --test src/lib/arabic-normalize.test.ts`
Expected: FAIL — `Cannot find module ... arabic-normalize.ts`

- [ ] **Step 3: Implement**

```ts
// src/lib/arabic-normalize.ts
// Single source of truth for lookup matching. Imported by BOTH the Node build
// pipeline and the browser page — index keys and query normalization must
// never drift apart. Keep this file dependency-free and browser-safe.

// Harakat (U+064B–U+065F) + superscript alef (U+0670) + Quranic annotation
// marks (U+06D6–U+06ED) + tatweel (U+0640) + whitespace: invisible to matching.
// Explicit escapes — a raw character range here would swallow the Arabic-Indic digits.
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
};

export function foldLatin(input: string): string {
  return [...input.normalize('NFC').toLowerCase()]
    .map(c => LATIN_FOLD[c] ?? c)
    .join('')
    .replace(/[\s\-·.]/g, '');
}

// Classical (Uthmani) orthography → the spelling a modern hand types.
// Rules are mechanical, derived from the vocalized surface itself — no word list.
export function deriveAltKeys(vocalized: string): string[] {
  const v = vocalized.normalize('NFC');
  const canonical = normalizeArabic(v);
  // Miniature letters (silat vowels) read as full letters when typed by hand.
  const smalls = (s: string) =>
    s.replace(/ۥ/g, 'و').replace(/[ۦۧ]/g, 'ي');
  // Superscript alef = an omitted alif in modern spelling. Seats:
  //   وٰ → ا (الصلوٰة → الصلاة)      ءٰ → ا or ءا (قرءٰن → قران / قرءان)
  //   Cٰ → Cا for consonants up to و — deliberately EXCLUDES ى (U+0649),
  //   where the superscript alef only marks pronunciation (عَلَىٰ).
  // Strip harakat (U+064B–U+065F) but preserve the dagger alif (U+0670) first —
  // in vocalized text a fatha sits between consonant and dagger (كِتَٰب), so the
  // adjacency regexes below would never fire on the raw string.
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
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npx tsx --test src/lib/arabic-normalize.test.ts`
Expected: all tests pass. If عَلَىٰ yields an alt key, your dagger regex wrongly includes ى — the consonant class must stop at U+0648.

- [ ] **Step 5: Commit**

```bash
git add src/lib/arabic-normalize.ts src/lib/arabic-normalize.test.ts
git commit -m "feat(word-lookup): shared arabic normalization, latin fold, uthmani alt keys"
```

---

### Task 2: Surface Buckwalter converters — `scripts/lib/bw-surface.ts`

The existing `bwToArabic`/`bwToTranslit` in `scripts/lib/buckwalter.ts` are LEMMA-oriented
(they fill in missing sukūn and strip leading wasla for dictionary display). Surface text
must NOT go through them. Do not modify `buckwalter.ts` — build alongside it.

**Files:**
- Create: `scripts/lib/bw-surface.ts`
- Test: `scripts/lib/bw-surface.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// scripts/lib/bw-surface.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bwToArabicSurface, bwToTranslitSurface } from './bw-surface.ts';

test('surface: bismi (explicit sukun preserved, none added)', () => {
  assert.equal(bwToArabicSurface('bisomi'), 'بِسْمِ');
});
test('surface: wasla kept (not stripped like lemmas)', () => {
  assert.equal(bwToArabicSurface('{ll~ahi'), 'ٱللَّهِ');
});
test('surface: muqattaat maddah marks', () => {
  assert.equal(bwToArabicSurface('Al^m^'), 'الٓمٓ');
});
test('surface: dagger alif suffix (na` = نَٰ of anzalna-hu)', () => {
  assert.equal(bwToArabicSurface('na`'), 'نَٰ');
});
test('surface: throws on unmapped char instead of passing it through', () => {
  assert.throws(() => bwToArabicSurface('naQ'), /unmapped Buckwalter/);
});
test('translit: basic word', () => {
  assert.equal(bwToTranslitSurface('bisomi'), 'bismi');
});
test('translit: moon-letter article gets hyphen', () => {
  assert.equal(bwToTranslitSurface('{loHamodu'), 'al-ḥamdu');
});
test('translit: sun-letter article assimilates with hyphen', () => {
  assert.equal(bwToTranslitSurface('{lS~alaw`pi'), 'aṣ-ṣalāti');
});
test('translit: ta marbuta voiced before case vowel, h finally', () => {
  assert.equal(bwToTranslitSurface('raHomapN'), 'raḥmatun');
  assert.equal(bwToTranslitSurface('raHomap'), 'raḥmah');
});
test('translit: tanwin fatha drops its seat alif', () => {
  assert.equal(bwToTranslitSurface('kitaAbFA'), 'kitāban');
});
test('translit: orthographic gemination not tripled (Allah)', () => {
  assert.equal(bwToTranslitSurface('{ll~ahi'), 'allahi');
});
test('translit: medial wasla silent in liaison', () => {
  assert.equal(bwToTranslitSurface('bi{logayobi'), 'bilghaybi');
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx tsx --test scripts/lib/bw-surface.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// scripts/lib/bw-surface.ts
// Converters for corpus FORM strings (surface text, Tanzil Uthmani in extended
// Buckwalter). Unlike buckwalter.ts (lemma display), surfaces carry their exact
// diacritics and Quranic annotation marks — convert strictly, never guess.
import { bwToTranslit } from './buckwalter.ts';

const BW_SURFACE: Record<string, string> = {
  "'": 'ء', '>': 'أ', '<': 'إ', '&': 'ؤ', '}': 'ئ', '|': 'آ',
  A: 'ا', b: 'ب', p: 'ة', t: 'ت', v: 'ث', j: 'ج', H: 'ح', x: 'خ',
  d: 'د', '*': 'ذ', r: 'ر', z: 'ز', s: 'س', $: 'ش', S: 'ص', D: 'ض',
  T: 'ط', Z: 'ظ', E: 'ع', g: 'غ', f: 'ف', q: 'ق', k: 'ك', l: 'ل',
  m: 'م', n: 'ن', h: 'ه', w: 'و', y: 'ي', Y: 'ى', '{': 'ٱ',
  '`': 'ٰ', F: 'ً', N: 'ٌ', K: 'ٍ', a: 'َ', u: 'ُ', i: 'ِ',
  '~': 'ّ', o: 'ْ', '_': 'ـ',
  // Tanzil extended Buckwalter — Uthmani annotation marks:
  '^': 'ٓ', // maddah above
  '#': 'ٔ', // hamza above
  ':': 'ۜ', // small high seen
  '@': '۟', // small high rounded zero
  '"': '۠', // small high upright rectangular zero
  '[': 'ۢ', // small high meem (isolated)
  ';': 'ۣ', // small low seen
  ',': 'ۥ', // small waw
  '.': 'ۦ', // small ya
  '!': 'ۨ', // small high noon
  '-': '۪', // empty centre low stop
  '+': '۫', // empty centre high stop
  '%': '۬', // rounded high stop with filled centre
  ']': 'ۭ', // small low meem
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
const MARK_CHARS = new Set([...'^#:@"[];,.!-+%]']);

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
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npx tsx --test scripts/lib/bw-surface.test.ts`
Expected: all pass. If `aṣ-ṣalāti` fails, check rule ORDER: gemination → wasla → article →
`w\`` → ta marbuta → tanwin, and that the sun-letter hyphen regex includes `ṣḍṭẓ`.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/bw-surface.ts scripts/lib/bw-surface.test.ts
git commit -m "feat(word-lookup): strict surface buckwalter converters with uthmani marks"
```

---

### Task 3: Word grouping — `scripts/lib/group-words.ts`

**Files:**
- Create: `scripts/lib/group-words.ts`
- Test: `scripts/lib/group-words.test.ts`

- [ ] **Step 1: Write the failing tests** (fixture lines are REAL corpus rows — keep verbatim)

```ts
// scripts/lib/group-words.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCorpusRows, groupWords } from './group-words.ts';

const FIXTURE = [
  'LOCATION\tFORM\tTAG\tFEATURES',
  '(1:1:1:1)\tbi\tP\tPREFIX|bi+',
  '(1:1:1:2)\tsomi\tN\tSTEM|POS:N|LEM:{som|ROOT:smw|M|GEN',
  '(1:1:2:1)\t{ll~ahi\tPN\tSTEM|POS:PN|LEM:{ll~ah|ROOT:Alh|GEN',
  '(2:1:1:1)\tAl^m^\tINL\tSTEM|POS:INL',
  '(2:3:2:1)\tyu&ominu\tV\tSTEM|POS:V|IMPF|(IV)|LEM:\'aAmana|ROOT:Amn|3MP',
  '(2:3:2:2)\twna\tPRON\tSUFFIX|PRON:3MP',
  '(2:4:4:1)\t>unzila\tV\tSTEM|POS:V|PERF|PASS|(IV)|LEM:>anzala|ROOT:nzl|3MS',
  '(2:137:11:1)\tfa\tRSLT\tPREFIX|f:RSLT+',
  '(2:137:11:2)\t<in~a\tACC\tSTEM|POS:ACC|LEM:<in~|SP:<in~',
  '(2:137:11:3)\tmaA\tPREV\tSTEM|POS:PREV|LEM:maA',
  '(12:2:2:1)\t>anzalo\tV\tSTEM|POS:V|PERF|(IV)|LEM:>anzala|ROOT:nzl|1P',
  '(12:2:2:2)\tna`\tPRON\tSUFFIX|PRON:1P',
  '(12:2:2:3)\thu\tPRON\tSUFFIX|PRON:3MS',
].join('\n');

test('parseCorpusRows skips headers and parses locations', () => {
  const rows = parseCorpusRows(FIXTURE);
  assert.equal(rows.length, 13);
  assert.deepEqual(rows[0], {
    surah: 1, ayah: 1, word: 1, segment: 1,
    formBw: 'bi', tag: 'P', features: ['PREFIX', 'bi+'],
  });
});

test('groupWords: prefix + stem concatenate into one word', () => {
  const w = groupWords(parseCorpusRows(FIXTURE));
  assert.equal(w[0].surfaceBw, 'bisomi');
  assert.deepEqual(w[0].prefixes, [{ formBw: 'bi', feature: 'bi+' }]);
  assert.equal(w[0].stems.length, 1);
  assert.deepEqual(w[0].stems[0], {
    lemmaBw: '{som', rootBw: 'smw', pos: 'N', formNo: 0, featureTokens: ['M', 'GEN'],
  });
  assert.equal(w[0].location, '1:1');
});

test('groupWords: verb form number, subject-ending suffix, features', () => {
  const w = groupWords(parseCorpusRows(FIXTURE));
  const yuminuna = w.find(x => x.key === '2:3:2')!;
  assert.equal(yuminuna.surfaceBw, 'yu&ominuwna');
  assert.equal(yuminuna.stems[0].formNo, 4);
  assert.deepEqual(yuminuna.stems[0].featureTokens, ['IMPF', '3MP']);
  assert.deepEqual(yuminuna.suffixes, [{ formBw: 'wna', feature: 'PRON:3MP' }]);
});

test('groupWords: passive marker stays in featureTokens', () => {
  const w = groupWords(parseCorpusRows(FIXTURE));
  const unzila = w.find(x => x.key === '2:4:4')!;
  assert.ok(unzila.stems[0].featureTokens.includes('PASS'));
});

test('groupWords: two-stem word keeps both stems', () => {
  const w = groupWords(parseCorpusRows(FIXTURE));
  const fainnama = w.find(x => x.key === '2:137:11')!;
  assert.equal(fainnama.surfaceBw, 'fa<in~amaA');
  assert.equal(fainnama.stems.length, 2);
  assert.equal(fainnama.stems[0].pos, 'ACC');
  assert.equal(fainnama.stems[1].pos, 'PREV');
});

test('groupWords: two pronoun suffixes kept in order (anzalna-hu)', () => {
  const w = groupWords(parseCorpusRows(FIXTURE));
  const anzalnahu = w.find(x => x.key === '12:2:2')!;
  assert.deepEqual(anzalnahu.suffixes.map(s => s.formBw), ['na`', 'hu']);
});

test('groupWords: untagged stem (muqattaat) gets empty lemma/root, pos INL', () => {
  const w = groupWords(parseCorpusRows(FIXTURE));
  const alm = w.find(x => x.key === '2:1:1')!;
  assert.deepEqual(alm.stems[0],
    { lemmaBw: '', rootBw: '', pos: 'INL', formNo: 0, featureTokens: [] });
});

test('groupWords: verb without roman numeral defaults to form 1', () => {
  const rows = parseCorpusRows(
    '(9:9:9:1)\tkataba\tV\tSTEM|POS:V|PERF|LEM:kataba|ROOT:ktb|3MS');
  assert.equal(groupWords(rows)[0].stems[0].formNo, 1);
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx tsx --test scripts/lib/group-words.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// scripts/lib/group-words.ts
// Whole-word reconstruction: one corpus row per SEGMENT; a written word is all
// rows sharing (surah:ayah:word). Unlike extract-verbs.ts (verbs only, verse-
// level locations), this parser keeps every row and full segment locations.

export interface CorpusRow {
  surah: number; ayah: number; word: number; segment: number;
  formBw: string; tag: string; features: string[];
}
export interface Affix { formBw: string; feature: string }
export interface WordStem {
  lemmaBw: string;          // '' when the corpus row has no LEM (muqattaat, some particles)
  rootBw: string;           // '' when rootless
  pos: string;              // POS:x value (falls back to the row TAG)
  formNo: number;           // verb form 1–12; 0 for non-verbs
  featureTokens: string[];  // everything except STEM/POS:/LEM:/ROOT:/(roman)
}
export interface WordOccurrence {
  key: string;       // "s:a:w"
  location: string;  // "s:a" (verse ref)
  surfaceBw: string; // concatenation of all segment FORMs
  prefixes: Affix[];
  stems: WordStem[];
  suffixes: Affix[];
}

const ROMAN: Record<string, number> = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12,
};

export function parseCorpusRows(text: string): CorpusRow[] {
  const rows: CorpusRow[] = [];
  for (const line of text.split('\n')) {
    if (!line || line.startsWith('#') || line.startsWith('LOCATION')) continue;
    const cols = line.split('\t');
    if (cols.length < 4) continue;
    const loc = cols[0].match(/^\((\d+):(\d+):(\d+):(\d+)\)$/);
    if (!loc) continue;
    rows.push({
      surah: +loc[1], ayah: +loc[2], word: +loc[3], segment: +loc[4],
      formBw: cols[1], tag: cols[2], features: cols[3].split('|'),
    });
  }
  return rows;
}

export function groupWords(rows: CorpusRow[]): WordOccurrence[] {
  const words: WordOccurrence[] = [];
  let cur: WordOccurrence | null = null;
  for (const r of rows) {
    const key = `${r.surah}:${r.ayah}:${r.word}`;
    if (!cur || cur.key !== key) {
      cur = { key, location: `${r.surah}:${r.ayah}`, surfaceBw: '',
              prefixes: [], stems: [], suffixes: [] };
      words.push(cur);
    }
    cur.surfaceBw += r.formBw;
    const kind = r.features[0];
    if (kind === 'PREFIX') {
      cur.prefixes.push({ formBw: r.formBw, feature: r.features[1] ?? '' });
    } else if (kind === 'SUFFIX') {
      cur.suffixes.push({ formBw: r.formBw, feature: r.features[1] ?? '' });
    } else if (kind === 'STEM') {
      let lemmaBw = '', rootBw = '', pos = r.tag, formNo = 0;
      const featureTokens: string[] = [];
      for (const f of r.features.slice(1)) {
        if (f.startsWith('POS:')) pos = f.slice(4);
        else if (f.startsWith('LEM:')) lemmaBw = f.slice(4);
        else if (f.startsWith('ROOT:')) rootBw = f.slice(5);
        else {
          const roman = f.match(/^\(([IVX]+)\)$/);
          if (roman && ROMAN[roman[1]]) formNo = ROMAN[roman[1]];
          else featureTokens.push(f);
        }
      }
      if (pos === 'V' && formNo === 0) formNo = 1; // corpus omits (I)
      cur.stems.push({ lemmaBw, rootBw, pos, formNo, featureTokens });
    } else {
      throw new Error(`unknown segment kind "${kind}" at ${key}`);
    }
  }
  return words;
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npx tsx --test scripts/lib/group-words.test.ts`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/group-words.ts scripts/lib/group-words.test.ts
git commit -m "feat(word-lookup): corpus row parser and whole-word segment grouping"
```

---

### Task 4: Index aggregation + gloss join — `scripts/lib/word-index.ts`

**Files:**
- Create: `scripts/lib/word-index.ts`
- Test: `scripts/lib/word-index.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// scripts/lib/word-index.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCorpusRows, groupWords } from './group-words.ts';
import { buildGlossMap, buildIndex } from './word-index.ts';

// Minimal but REAL slice of verb-forms.json shape (values from the shipped dataset).
const VERB_FORMS = {
  roots: [
    { root: 'ءمن', translit: 'ʾ-m-n', quad: false, totalCount: 879, forms: {
      '4': [{ past: 'آمَنَ', present: 'يُؤْمِنُ', translit: 'āmana / yuʾminu',
              meaning: 'to believe', count: 782, example: '2:3' }] } },
    { root: 'نزل', translit: 'n-z-l', quad: false, totalCount: 293, forms: {
      '4': [{ past: 'أَنْزَلَ', present: 'يُنْزِلُ', translit: 'anzala / yunzilu',
              meaning: 'to send down', count: 190, example: '2:22' }] } },
  ],
};

const ROWS = [
  '(2:3:2:1)\tyu&ominu\tV\tSTEM|POS:V|IMPF|(IV)|LEM:\'aAmana|ROOT:Amn|3MP',
  '(2:3:2:2)\twna\tPRON\tSUFFIX|PRON:3MP',
  '(8:2:9:1)\tyu&ominu\tV\tSTEM|POS:V|IMPF|(IV)|LEM:\'aAmana|ROOT:Amn|3MP',
  '(8:2:9:2)\twna\tPRON\tSUFFIX|PRON:3MP',
  '(24:47:11:1)\tyu&ominu\tV\tSTEM|POS:V|IMPF|(IV)|LEM:\'aAmana|ROOT:Amn|3MP',
  '(24:47:11:2)\twna\tPRON\tSUFFIX|PRON:3MP',
  '(31:8:8:1)\tyu&ominu\tV\tSTEM|POS:V|IMPF|(IV)|LEM:\'aAmana|ROOT:Amn|3MP',
  '(31:8:8:2)\twna\tPRON\tSUFFIX|PRON:3MP',
  '(2:4:4:1)\t>unzila\tV\tSTEM|POS:V|PERF|PASS|(IV)|LEM:>anzala|ROOT:nzl|3MS',
  '(1:1:1:1)\tbi\tP\tPREFIX|bi+',
  '(1:1:1:2)\tsomi\tN\tSTEM|POS:N|LEM:{som|ROOT:smw|M|GEN',
  '(2:1:1:1)\tAl^m^\tINL\tSTEM|POS:INL',
].join('\n');

function makeIndex() {
  return buildIndex(groupWords(parseCorpusRows(ROWS)), VERB_FORMS);
}

test('buildGlossMap: unambiguous root|form key plus per-citation key', () => {
  const m = buildGlossMap(VERB_FORMS);
  assert.equal(m.get('ءمن|4'), 'to believe');
  assert.equal(m.get('ءمن|4|آمَنَ'), 'to believe');
});

test('buildIndex: identical occurrences aggregate — count and ≤3 refs', () => {
  const idx = makeIndex();
  const list = idx.words['يؤمنون'];
  assert.equal(list.length, 1);
  const a = list[0];
  assert.equal(a[0], 'يُؤْمِنُونَ');       // vocalized surface
  assert.equal(a[10], 4);                 // count: 4 occurrences in fixture
  assert.deepEqual(a[11], ['2:3', '8:2', '24:47']); // first 3 refs only
});

test('buildIndex: verb analysis carries root, form, gloss, suffix segment', () => {
  const [a] = makeIndex().words['يؤمنون'];
  assert.equal(a[2], 'ءمن');              // root (corpus Amn → hamza display)
  assert.equal(a[4], 'V');
  assert.equal(a[5], 4);
  assert.equal(a[6], 'IMPF|3MP');
  assert.deepEqual(a[8], ['ونَ|PRON:3MP']); // real arabic segment + feature
  assert.equal(a[9], 'to believe');
});

test('buildIndex: passive verb keeps PASS token and gets same lemma gloss', () => {
  const [a] = makeIndex().words['انزل'];
  assert.equal(a[0], 'أُنزِلَ');
  assert.ok(a[6].includes('PASS'));
  assert.equal(a[9], 'to send down');
});

test('buildIndex: noun analysis — no gloss, prefix stored with arabic segment', () => {
  const [a] = makeIndex().words['بسم'];
  assert.equal(a[4], 'N');
  assert.equal(a[9], null);
  assert.deepEqual(a[7], ['بِ|bi+']);
  assert.equal(a[2], 'سمو');              // root smw
});

test('buildIndex: rootless INL analysis', () => {
  const [a] = makeIndex().words['الم'];
  assert.equal(a[2], null);
  assert.equal(a[4], 'INL');
  assert.equal(a[3], '');                 // no lemma
});

test('buildIndex: altKeys derived for uthmani spellings', () => {
  const rows = parseCorpusRows(
    '(2:3:5:1)\t{l\tDET\tPREFIX|Al+\n' +
    '(2:3:5:2)\tS~alaw`pa\tN\tSTEM|POS:N|LEM:Salaw`p|ROOT:Slw|F|ACC');
  const idx = buildIndex(groupWords(rows), { roots: [] });
  assert.equal(idx.altKeys['الصلاة'], 'الصلوة');
  assert.ok(idx.words['الصلوة']);
});

test('buildIndex: meta counts', () => {
  const idx = makeIndex();
  assert.equal(idx.meta.words, Object.keys(idx.words).length);
  assert.equal(idx.meta.analyses,
    Object.values(idx.words).reduce((n, l) => n + l.length, 0));
  assert.match(idx.meta.source, /Quranic Arabic Corpus/);
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx tsx --test scripts/lib/word-index.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// scripts/lib/word-index.ts
// Aggregates word occurrences into the packed lookup index (spec: Output contract).
import { FORM_OVERRIDES } from './form-overrides.ts';
import { bwToArabic } from './buckwalter.ts';
import { bwToArabicSurface, bwToTranslitSurface } from './bw-surface.ts';
import { normalizeArabic, deriveAltKeys } from '../../src/lib/arabic-normalize.ts';
import type { WordOccurrence, WordStem } from './group-words.ts';

export type PackedAnalysis = [
  string, string, string | null, string, string, number, string,
  string[], string[], string | null, number, string[],
];
export interface LookupIndex {
  meta: { source: string; words: number; analyses: number; version: number };
  words: Record<string, PackedAnalysis[]>;
  altKeys: Record<string, string>;
}

// Corpus ROOT: fields write hamza as A (same quirk handled in build-verb-dataset.ts —
// duplicated here rather than refactoring a shipped pipeline).
function rootToArabic(rootBw: string): string {
  return [...rootBw].map(c => (c === 'A' ? 'ء' : bwToArabicSurface(c))).join('');
}

// Gloss join (build-time, one source of truth = public/data/verb-forms.json):
//   root|form            → meaning, only when that form has exactly one entry
//   root|form|past       → meaning, disambiguates the 7 lemma-merged forms
export function buildGlossMap(verbForms: { roots: any[] }): Map<string, string> {
  const map = new Map<string, string>();
  for (const r of verbForms.roots) {
    for (const [form, list] of Object.entries<any>(r.forms)) {
      if (list.length === 1 && list[0].meaning) map.set(`${r.root}|${form}`, list[0].meaning);
      for (const e of list) if (e.meaning) map.set(`${r.root}|${form}|${e.past}`, e.meaning);
    }
  }
  return map;
}

interface Acc {
  surfaceAr: string; translit: string; root: string | null; lemma: string;
  pos: string; form: number; feat: string; prefixes: string[]; suffixes: string[];
  gloss: string | null; count: number; refs: string[];
}

export function buildIndex(words: WordOccurrence[], verbForms: { roots: any[] }): LookupIndex {
  const glosses = buildGlossMap(verbForms);
  const acc = new Map<string, Acc>();
  const surfaceOfKey = new Map<string, string>(); // canonical key → one vocalized surface

  for (const w of words) {
    const surfaceAr = bwToArabicSurface(w.surfaceBw);
    const prefixes = w.prefixes.map(p => `${bwToArabicSurface(p.formBw)}|${p.feature}`);
    const suffixes = w.suffixes.map(s => `${bwToArabicSurface(s.formBw)}|${s.feature}`);
    for (const stem of w.stems) {
      const a = analysisFieldsForStem(stem, glosses);
      const id = [surfaceAr, a.lemma, a.root ?? '', a.pos, a.form, a.feat,
                  prefixes.join(','), suffixes.join(',')].join('\u0001'); // visible escape: raw control chars get lost in copies
      let e = acc.get(id);
      if (!e) {
        e = { surfaceAr, translit: bwToTranslitSurface(w.surfaceBw), ...a,
              prefixes, suffixes, count: 0, refs: [] };
        acc.set(id, e);
      }
      e.count++;
      if (e.refs.length < 3 && !e.refs.includes(w.location)) e.refs.push(w.location);
    }
    const key = normalizeArabic(surfaceAr);
    if (!surfaceOfKey.has(key)) surfaceOfKey.set(key, surfaceAr);
  }

  const out: Record<string, PackedAnalysis[]> = {};
  for (const e of acc.values()) {
    const key = normalizeArabic(e.surfaceAr);
    (out[key] ??= []).push([e.surfaceAr, e.translit, e.root, e.lemma, e.pos,
      e.form, e.feat, e.prefixes, e.suffixes, e.gloss, e.count, e.refs]);
  }
  for (const list of Object.values(out)) list.sort((x, y) => y[10] - x[10]);

  // Alternate spellings: derived per vocalized surface; a real word always wins
  // over an alternate; among alternates the higher-frequency canonical wins.
  const totals = new Map(Object.entries(out).map(([k, l]) =>
    [k, l.reduce((n, a) => n + a[10], 0)]));
  const altKeys: Record<string, string> = {};
  for (const [key, list] of Object.entries(out)) {
    for (const a of list) {
      for (const alt of deriveAltKeys(a[0])) {
        if (out[alt]) continue;
        const prev = altKeys[alt];
        if (!prev || (totals.get(key) ?? 0) > (totals.get(prev) ?? 0)) altKeys[alt] = key;
      }
    }
  }

  return {
    meta: {
      source: 'Quranic Arabic Corpus v0.4 (Kais Dukes, GPL) — corpus.quran.com',
      words: Object.keys(out).length,
      analyses: Object.values(out).reduce((n, l) => n + l.length, 0),
      version: 1,
    },
    words: out,
    altKeys,
  };
}

export function analysisFieldsForStem(
  stem: WordStem, glosses: Map<string, string>,
): { root: string | null; lemma: string; pos: string; form: number; feat: string; gloss: string | null } {
  const isVerb = stem.pos === 'V';
  const ov = isVerb ? FORM_OVERRIDES[`${stem.rootBw}|${stem.formNo}|${stem.lemmaBw}`] : undefined;
  const form = isVerb ? (ov?.form ?? stem.formNo) : 0;
  const lemmaBw = ov?.mergeInto ?? stem.lemmaBw;
  const root = stem.rootBw ? rootToArabic(stem.rootBw) : null;
  const lemma = lemmaBw ? bwToArabic(lemmaBw) : '';
  const gloss = isVerb && root
    ? glosses.get(`${root}|${form}|${lemma}`) ?? glosses.get(`${root}|${form}`) ?? null
    : null;
  return { root, lemma, pos: stem.pos, form, feat: stem.featureTokens.join('|'), gloss };
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npx tsx --test scripts/lib/word-index.test.ts`
Expected: all pass. Watch the two-key gloss test: `'aAmana` (lemma) → `bwToArabic` → `ءَامَنَ`
does NOT equal the curated past `آمَنَ`, so the 3-part key misses and the 2-part key must hit —
that fallback is exactly what makes the join robust.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/word-index.ts scripts/lib/word-index.test.ts
git commit -m "feat(word-lookup): packed index aggregation with overrides, glosses, alt keys"
```

---

### Task 5: Build script + npm wiring + generate the dataset

**Files:**
- Create: `scripts/build-word-lookup.ts`
- Modify: `package.json` (scripts block)
- Create (generated, committed): `public/data/word-lookup.json`

- [ ] **Step 1: Write the build script**

```ts
// scripts/build-word-lookup.ts
// Word Lookup dataset: corpus + curated verb glosses → public/data/word-lookup.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { parseCorpusRows, groupWords } from './lib/group-words.ts';
import { buildIndex } from './lib/word-index.ts';

const CORPUS = 'src/data/morphology/quranic-corpus-morphology-0.4.txt';
const VERB_FORMS = 'public/data/verb-forms.json';
const OUT = 'public/data/word-lookup.json';
const GZIP_BUDGET = 800 * 1024; // spec guard (measured 716KB; translit strings required by sound search)

const words = groupWords(parseCorpusRows(readFileSync(CORPUS, 'utf8')));
const index = buildIndex(words, JSON.parse(readFileSync(VERB_FORMS, 'utf8')));
const json = JSON.stringify(index);
const gz = gzipSync(json).length;

const glossless = Object.values(index.words).flat()
  .filter(a => a[4] === 'V' && a[9] === null);
console.log(`words=${words.length} keys=${index.meta.words} analyses=${index.meta.analyses}`);
console.log(`altKeys=${Object.keys(index.altKeys).length} verbs-without-gloss=${glossless.length}`);
console.log(`raw=${(json.length / 1024).toFixed(0)}KB gzip=${(gz / 1024).toFixed(0)}KB`);
if (gz > GZIP_BUDGET) {
  console.error(`FAIL: gzip ${gz} exceeds ${GZIP_BUDGET} budget (spec: trim refs or shard)`);
  process.exit(1);
}
mkdirSync('public/data', { recursive: true });
writeFileSync(OUT, json);
console.log(`→ ${OUT}`);
```

- [ ] **Step 2: Add npm scripts** — in `package.json`, after the `"validate:verbs"` line:

```json
"lookup:build": "tsx scripts/build-word-lookup.ts",
"validate:lookup": "tsx scripts/validate-word-lookup.ts",
"test:lookup": "tsx --test src/lib/arabic-normalize.test.ts src/lib/grammar-labels.test.ts src/lib/lookup-search.test.ts scripts/lib/bw-surface.test.ts scripts/lib/group-words.test.ts scripts/lib/word-index.test.ts",
```

(`test:lookup` lists two files that don't exist until Tasks 7–8 — that's fine, only run the
existing ones until then: `npx tsx --test src/lib/arabic-normalize.test.ts scripts/lib/*.test.ts`.)

- [ ] **Step 3: Run the build**

Run: `npm run lookup:build`
Expected output (measured on the completed Task-4 pipeline over the real corpus — the four
count numbers must match EXACTLY; byte sizes may vary ±1%):
```
words=77429 keys=14695 analyses=20414
altKeys=2163 verbs-without-gloss=<small — report the actual number>
raw=~2300KB gzip=~716KB (budget raised to 800KB — see spec decision 3)
→ public/data/word-lookup.json
```
`words` must be EXACTLY 77429. If `bwToArabicSurface` throws on an unmapped char, add that
char to `BW_SURFACE` (Task 2) with its correct Unicode point — do NOT skip chars silently.

- [ ] **Step 4: Spot-check the output by hand**

Run: `node -e "const i=require('./public/data/word-lookup.json'); console.log(JSON.stringify(i.words['يؤمنون'],null,1)); console.log(i.altKeys['الصلاة'])"`
Expected: one analysis, surface `يُؤْمِنُونَ`, root `ءمن`, form 4, gloss `to believe`,
count ~87 (2:3 surface exact); altKeys line prints the canonical key for الصلوة spellings.

- [ ] **Step 5: Commit (script + generated data + npm wiring)**

```bash
git add scripts/build-word-lookup.ts package.json public/data/word-lookup.json
git commit -m "feat(word-lookup): dataset build script and generated packed index"
```

---

### Task 6: Validator — all 77,429 words round-trip

**Files:**
- Create: `scripts/validate-word-lookup.ts`

- [ ] **Step 1: Write the validator**

```ts
// scripts/validate-word-lookup.ts
// Gate: every word in the Quran must find itself through the REAL lookup path
// (surface → normalize → words/altKeys → analysis matching its own stem).
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { parseCorpusRows, groupWords } from './lib/group-words.ts';
import { buildGlossMap, analysisFieldsForStem } from './lib/word-index.ts';
import { bwToArabicSurface } from './lib/bw-surface.ts';
import { normalizeArabic, foldLatin } from '../src/lib/arabic-normalize.ts';

const CORPUS = 'src/data/morphology/quranic-corpus-morphology-0.4.txt';
const INDEX = JSON.parse(readFileSync('public/data/word-lookup.json', 'utf8'));
const VERB_FORMS = JSON.parse(readFileSync('public/data/verb-forms.json', 'utf8'));
const glosses = buildGlossMap(VERB_FORMS);

let failures = 0;
const fail = (msg: string) => { failures++; if (failures <= 20) console.error(`FAIL ${msg}`); };

// 1. Full round-trip.
const words = groupWords(parseCorpusRows(readFileSync(CORPUS, 'utf8')));
for (const w of words) {
  const surfaceAr = bwToArabicSurface(w.surfaceBw);
  const k0 = normalizeArabic(surfaceAr);
  const key = INDEX.words[k0] ? k0 : INDEX.altKeys[k0];
  const list = key ? INDEX.words[key] : undefined;
  if (!list) { fail(`${w.key} ${surfaceAr}: no index entry`); continue; }
  for (const stem of w.stems) {
    const f = analysisFieldsForStem(stem, glosses);
    const hit = list.some((a: any[]) =>
      a[0] === surfaceAr && a[3] === f.lemma && a[4] === f.pos && a[5] === f.form);
    if (!hit) fail(`${w.key} ${surfaceAr}: no analysis for ${f.pos}/${f.lemma}`);
  }
}

// 2. Spot checks (spec).
const q = (s: string) => {
  const k = normalizeArabic(s);
  return INDEX.words[INDEX.words[k] ? k : INDEX.altKeys[k]];
};
if (!q('ٱلصَّلَوٰةَ')) fail('spot: uthmani paste الصلوة');
if (!q('الصلاة')) fail('spot: modern typed الصلاة');
if (q('الصلاة') !== q('ٱلصَّلَوٰةَ')) fail('spot: both spellings must resolve to one entry');
if (!q('انزل')?.some((a: any[]) => a[5] === 4 && a[9])) fail('spot: انزل → Form IV with gloss');
if (!(q('من')?.length >= 4)) fail('spot: من homographs');
if (!q('الم')?.some((a: any[]) => a[4] === 'INL')) fail('spot: الم muqattaat'); // key shared with أَلَمْ — INL is not row 0
if (!q('يؤمنون')?.some((a: any[]) => a[9] === 'to believe, have faith')) fail('spot: يؤمنون gloss'); // exact curated string from verb-forms.json

// 3. Every transliteration folds to plain ASCII (locks the LATIN_FOLD table).
for (const list of Object.values<any[]>(INDEX.words)) {
  for (const a of list) {
    const folded = foldLatin(a[1]);
    if (!/^[a-z0-9]*$/.test(folded)) fail(`translit unfoldable: "${a[1]}" → "${folded}"`);
  }
}

// 4. Size guard.
const gz = gzipSync(JSON.stringify(INDEX)).length;
if (gz > 800 * 1024) fail(`gzip ${gz} over budget`);

const glossless = Object.values<any[]>(INDEX.words).flat()
  .filter((a: any[]) => a[4] === 'V' && a[9] === null);
console.log(`round-trip words=${words.length} keys=${Object.keys(INDEX.words).length}`);
console.log(`verbs without gloss: ${glossless.length}`);
if (glossless.length) console.log(glossless.slice(0, 20)
  .map((a: any[]) => `  ${a[0]} (${a[2]} form ${a[5]})`).join('\n'));
console.log(failures ? `FAILURES: ${failures}` : 'OK');
process.exit(failures ? 1 : 0);
```

- [ ] **Step 2: Run it**

Run: `npm run validate:lookup`
Expected: `round-trip words=77429`, `verbs without gloss: <small number>`, `OK`, exit 0.
Investigate ANY failure — the most likely causes: a normalization rule differing between
build and validator (impossible if both import the shared module — check imports), or an
altKey collision shadowing a real word (fix ordering in `buildIndex`).

- [ ] **Step 3: Commit**

```bash
git add scripts/validate-word-lookup.ts
git commit -m "feat(word-lookup): full-corpus round-trip validator"
```

---

### Task 7: Grammar labels — `src/lib/grammar-labels.ts`

**Files:**
- Create: `src/lib/grammar-labels.ts`
- Test: `src/lib/grammar-labels.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/grammar-labels.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { posLabel, grammarLine, affixLabel, ROMAN_FORMS } from './grammar-labels.ts';

test('posLabel: known and unknown codes', () => {
  assert.equal(posLabel('V'), 'verb');
  assert.equal(posLabel('INL'), 'Quranic initials (muqattaat)');
  assert.equal(posLabel('XYZ'), 'XYZ'); // unknown → raw code, never dropped
});
test('grammarLine: verb with form, tense, person', () => {
  assert.equal(grammarLine('V', 4, 'IMPF|3MP'),
    'verb, Form IV — present (imperfect), 3rd person masculine plural');
});
test('grammarLine: passive + mood', () => {
  assert.equal(grammarLine('V', 4, 'PERF|PASS|3MS'),
    'verb, Form IV — past (perfect), passive, 3rd person masculine singular');
});
test('grammarLine: noun with case', () => {
  assert.equal(grammarLine('N', 0, 'M|GEN'), 'noun — masculine, genitive');
});
test('grammarLine: unknown token shown raw', () => {
  assert.equal(grammarLine('N', 0, 'M|WEIRD'), 'noun — masculine, WEIRD');
});
test('grammarLine: bare single-letter number token is NOT misread as plural', () => {
  assert.equal(grammarLine('T', 0, 'P'), 'time adverb — P');
});
test('affixLabel: prefixes and pronoun suffixes', () => {
  assert.equal(affixLabel('w:CONJ+'), 'wa- (and)');
  assert.equal(affixLabel('Al+'), 'al- (the)');
  assert.equal(affixLabel('PRON:3MS'), 'him / his / it');
  assert.equal(affixLabel('PRON:1P'), 'we / us / our');
  assert.equal(affixLabel('+n:EMPH'), 'emphasis -nna');
  assert.equal(affixLabel('??'), '??'); // unknown → raw
});
test('ROMAN_FORMS spans I..XII', () => {
  assert.equal(ROMAN_FORMS[0], 'I');
  assert.equal(ROMAN_FORMS[11], 'XII');
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx tsx --test src/lib/grammar-labels.test.ts` — FAIL, module not found.

- [ ] **Step 3: Implement** (label text is teaching content — full corpus tagset, verified
against corpus.quran.com/documentation/tagset.jsp; unknown codes always fall through raw)

```ts
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
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npx tsx --test src/lib/grammar-labels.test.ts` — all pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/grammar-labels.ts src/lib/grammar-labels.test.ts
git commit -m "feat(word-lookup): grammar label maps and humanizers"
```

---

### Task 8: Search engine — `src/lib/lookup-search.ts`

**Files:**
- Create: `src/lib/lookup-search.ts`
- Test: `src/lib/lookup-search.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/lookup-search.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepareIndex, search } from './lookup-search.ts';

const INDEX = {
  meta: { source: 't', words: 3, analyses: 4, version: 1 },
  words: {
    'يؤمنون': [['يُؤْمِنُونَ', 'yuʾminūna', 'ءمن', 'آمَنَ', 'V', 4, 'IMPF|3MP',
                [], ['ونَ|PRON:3MP'], 'to believe', 87, ['2:3']]],
    'يعلمون': [['يَعْلَمُونَ', 'yaʿlamūna', 'علم', 'عَلِمَ', 'V', 1, 'IMPF|3MP',
                [], ['ونَ|PRON:3MP'], 'to know', 85, ['2:13']]],
    'الصلوة': [['ٱلصَّلَوٰةَ', 'aṣ-ṣalāta', 'صلو', 'صَلَوٰة', 'N', 0, 'F|ACC',
                ['ٱل|Al+'], [], null, 55, ['2:3']]],
  },
  altKeys: { 'الصلاة': 'الصلوة' },
} as any;

const P = prepareIndex(INDEX);

test('arabic: exact vocalized paste', () => {
  const r = search(P, 'يُؤْمِنُونَ');
  assert.equal(r.kind, 'arabic');
  assert.equal(r.exact!.key, 'يؤمنون');
});
test('arabic: bare typed input matches', () => {
  assert.equal(search(P, 'يؤمنون').exact!.key, 'يؤمنون');
});
test('arabic: modern spelling resolves through altKeys', () => {
  assert.equal(search(P, 'الصلاة').exact!.key, 'الصلوة');
});
test('arabic: prefix suggestions when no exact hit', () => {
  const r = search(P, 'يؤم');
  assert.equal(r.exact, null);
  assert.deepEqual(r.suggestions.map(s => s.key), ['يؤمنون']);
});
test('arabic: did-you-mean on dead end', () => {
  const r = search(P, 'يؤمنونا');
  assert.equal(r.exact, null);
  assert.ok(r.didYouMean.some(s => s.key === 'يؤمنون'));
});
test('latin: sound matches fold macrons/hamza', () => {
  const r = search(P, 'yuminuna');
  assert.equal(r.kind, 'latin');
  assert.deepEqual(r.sound.map(s => s.key), ['يؤمنون']);
});
test('latin: sound prefix matches', () => {
  assert.ok(search(P, 'assal').sound.some(s => s.key === 'الصلوة'));
});
test('latin: meaning substring matches', () => {
  const r = search(P, 'believe');
  assert.deepEqual(r.meaning.map(m => m.key), ['يؤمنون']);
});
test('latin: a query can hit both groups without duplication inside one group', () => {
  const r = search(P, 'know');
  assert.deepEqual(r.meaning.map(m => m.key), ['يعلمون']);
});
test('suggestion entries expose display fields', () => {
  const s = search(P, 'يؤم').suggestions[0];
  assert.equal(s.surface, 'يُؤْمِنُونَ');
  assert.equal(s.total, 87);
  assert.equal(s.hint, 'to believe');
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx tsx --test src/lib/lookup-search.test.ts` — FAIL, module not found.

- [ ] **Step 3: Implement**

```ts
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
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `npx tsx --test src/lib/lookup-search.test.ts` — all pass.
Then run the whole suite so far: `npm run test:lookup` — all pass (all six test files now exist).

- [ ] **Step 5: Commit**

```bash
git add src/lib/lookup-search.ts src/lib/lookup-search.test.ts
git commit -m "feat(word-lookup): in-memory search engine (arabic, sound, meaning)"
```

---

### Task 9: The page — `src/pages/resources/word-lookup/index.astro`

**BEFORE writing any visual code: load the Phase-2 design skills (`taste-skill`,
`impeccable`, `emil-design-eng`) per CLAUDE.md.** The page inherits the generator's visual
rhythm (`vf-*` patterns → `wl-*`), Modern-Devotional dark aesthetic, CSS variables only.

**Files:**
- Create: `src/pages/resources/word-lookup/index.astro`

- [ ] **Step 1: Create the page — server shell + styles** (no client script yet; must build)

```astro
---
import { readFileSync } from 'node:fs';
import BaseLayout from '../../../layouts/BaseLayout.astro';
import Container from '../../../components/primitives/Container.astro';

// Build-time read for intro copy (SEO); the client fetches the same JSON on demand.
const meta = JSON.parse(readFileSync('public/data/word-lookup.json', 'utf8')).meta;

// Real Quranic surfaces (verified against the corpus) — never invent examples.
const EXAMPLES = [
  { q: 'يُؤْمِنُونَ', note: 'a conjugated verb' },
  { q: 'ٱلصَّلَوٰةَ', note: 'pasted from a mushaf' },
  { q: 'أَنزَلْنَٰهُ', note: 'verb + two pronouns' },
  { q: 'مَٰلِكِ', note: 'try bare ملك too' },
  { q: 'بِسْمِ', note: 'prefix + noun' },
  { q: 'الٓمٓ', note: 'the mysterious letters' },
];
---

<BaseLayout
  title="Word Lookup"
  description={`Type any word of the Quran — Arabic, transliteration, or English meaning — and see its root, part of speech, verb form, grammar, and morpheme breakdown. Covers all ${meta.words.toLocaleString('en-US')} written word forms.`}
>
  <Container size="md" class="wl-container">
    <header class="wl-header">
      <h1 class="wl-title">Word Lookup</h1>
      <p class="wl-intro">
        See a word in the Quran and want to understand it? Paste or type it —
        with or without vowel marks — or search by sound
        (<em>yuminuna</em>) or by meaning (<em>believe</em>). Every one of the
        Quran's <strong>{meta.words.toLocaleString('en-US')} written word forms</strong> is here,
        analyzed down to its root.
      </p>
    </header>

    <div class="wl-search-wrap">
      <label class="sr-only" for="wl-search">Search any Quranic word by Arabic, sound, or meaning</label>
      <input id="wl-search" class="wl-search" type="search" name="word-search"
        autocomplete="off" spellcheck="false" dir="auto"
        placeholder="يُؤْمِنُونَ · yuminuna · believe…" />
      <div id="wl-suggestions" class="wl-suggestions" role="listbox"
        aria-label="Matching words" hidden></div>
    </div>

    <div class="wl-chips" aria-label="Example words">
      {EXAMPLES.map(e => (
        <button class="wl-chip" data-q={e.q}>
          <span lang="ar" dir="rtl">{e.q}</span>
          <span class="wl-chip-note">{e.note}</span>
        </button>
      ))}
    </div>

    <section id="wl-result" class="wl-result" aria-live="polite" hidden></section>

    <noscript>
      <p class="wl-noscript">Word Lookup needs JavaScript to search. The
        <a href="/resources/verb-forms/">Verb Form Generator</a> and the other
        <a href="/resources/">reference resources</a> work without it.</p>
    </noscript>

    <footer class="wl-attribution">
      Morphological data: <a href="https://corpus.quran.com" rel="noopener">Quranic
      Arabic Corpus</a> (Kais Dukes, GNU GPL). English glosses © Quranic Grammar.
    </footer>
  </Container>
</BaseLayout>

<style>
  .wl-container { padding-block: var(--spacing-2xl) var(--spacing-3xl); }
  .wl-header { text-align: center; margin-block-end: var(--spacing-2xl); }
  .wl-title { font-size: 2.25rem; font-weight: 700; color: var(--color-text-primary);
    letter-spacing: -0.02em; margin-block-end: var(--spacing-md); text-wrap: balance; }
  .wl-intro { font-size: 1.125rem; line-height: 1.6; color: var(--color-text-secondary);
    max-inline-size: 620px; margin-inline: auto; }

  .wl-search-wrap { position: relative; max-inline-size: 520px; margin-inline: auto; }
  .wl-search { inline-size: 100%; padding: var(--spacing-sm) var(--spacing-md);
    font-size: 1.25rem; font-family: inherit;
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary); border-radius: var(--radius-md);
    color: var(--color-text-primary);
    transition: border-color 160ms var(--wl-ease); }
  .wl-search:focus { outline: 2px solid var(--color-border-focus); outline-offset: 1px; }
  .wl-suggestions { position: absolute; inset-inline: 0; top: calc(100% + 4px);
    background: var(--color-background-elevated);
    border: 1px solid var(--color-border-primary); border-radius: var(--radius-md);
    box-shadow: 0 8px 24px rgb(0 0 0 / 0.14); z-index: 20; overflow: hidden; }
  .wl-sug { display: flex; align-items: center; gap: var(--spacing-sm);
    inline-size: 100%; padding: var(--spacing-sm) var(--spacing-md);
    background: none; border: 0; cursor: pointer; font-family: inherit;
    color: var(--color-text-primary); font-size: 1rem; text-align: start; }
  .wl-sug:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: -2px; }
  .wl-sug [lang="ar"] { font-family: var(--font-arabic); font-size: 1.3rem; }
  .wl-sug-hint { color: var(--color-text-secondary); font-style: italic;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .wl-sug-count { margin-inline-start: auto; color: var(--color-text-tertiary);
    font-size: 0.85rem; flex-shrink: 0; }
  .wl-sug-none { padding: var(--spacing-sm) var(--spacing-md);
    color: var(--color-text-tertiary); margin: 0; font-size: 0.95rem; }
  .wl-group-label { margin: 0; padding: var(--spacing-xs) var(--spacing-md);
    font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--color-text-tertiary); background: var(--color-background-secondary); }

  .wl-chips { display: flex; flex-wrap: wrap; gap: var(--spacing-xs);
    justify-content: center; margin-block: var(--spacing-lg) var(--spacing-2xl); }
  .wl-chip { display: inline-flex; align-items: baseline; gap: 0.5em;
    padding: 0.35em 0.8em; background: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary); border-radius: var(--radius-full);
    cursor: pointer; color: var(--color-text-primary); font-family: var(--font-arabic);
    font-size: 1.05rem;
    transition: border-color 160ms var(--wl-ease), transform 160ms var(--wl-ease); }
  .wl-chip:active { transform: scale(0.97); }
  .wl-chip, .wl-sug { touch-action: manipulation; }
  .wl-chip:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 1px; }
  .wl-chip-note { font-family: var(--font-sans); font-size: 0.75rem;
    color: var(--color-text-tertiary); }

  .wl-result { margin-block-end: var(--spacing-3xl); scroll-margin-top: 90px;
    max-inline-size: 640px; margin-inline: auto; }
  .wl-load-error, .wl-empty { text-align: center; color: var(--color-text-secondary);
    border: 1px solid var(--color-border-primary); border-radius: var(--radius-md);
    padding: var(--spacing-lg); }
  .wl-empty-hint { font-size: 0.9rem; color: var(--color-text-tertiary);
    margin: var(--spacing-xs) 0 0; }

  .wl-cards { list-style: none; margin: 0; padding: 0; display: grid;
    gap: var(--spacing-md); }
  .wl-card { border: 1px solid var(--color-border-primary); border-radius: var(--radius-lg);
    background: var(--color-background-secondary); padding: var(--spacing-lg);
    animation: wl-card-in 260ms var(--wl-ease) both;
    animation-delay: calc(var(--i, 0) * 45ms); }
  .wl-word { font-family: var(--font-arabic); font-size: 2.4rem; line-height: 1.9;
    color: var(--color-text-primary); margin: 0; }
  .wl-translit { color: var(--color-text-secondary); font-style: italic;
    margin: 0 0 var(--spacing-sm); }
  .wl-analysis + .wl-analysis { border-block-start: 1px dashed var(--color-border-secondary);
    margin-block-start: var(--spacing-sm); padding-block-start: var(--spacing-sm); }
  .wl-grammar { color: var(--color-text-primary); font-size: 0.95rem;
    margin: 0 0 var(--spacing-xs); }
  .wl-badge { display: inline-grid; place-items: center; min-inline-size: 2.2em;
    padding: 0.15em 0.5em; margin-inline-end: 0.5em; border-radius: var(--radius-sm);
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.06em;
    background: color-mix(in oklab, var(--accent-gold) 16%, transparent);
    color: var(--accent-gold); }
  .wl-breakdown { display: flex; flex-wrap: wrap; gap: var(--spacing-xs);
    margin: 0 0 var(--spacing-xs); padding: 0; list-style: none; direction: rtl;
    justify-content: flex-end; }
  .wl-morpheme { display: inline-flex; flex-direction: column; align-items: center;
    gap: 0.1em; padding: 0.3em 0.6em; border: 1px solid var(--color-border-secondary);
    border-radius: var(--radius-sm); }
  .wl-morpheme [lang="ar"] { font-family: var(--font-arabic); font-size: 1.15rem;
    color: var(--color-text-primary); }
  .wl-morpheme-label { font-size: 0.7rem; color: var(--color-text-tertiary);
    direction: ltr; }
  .wl-morpheme-stem [lang="ar"] { color: var(--accent-gold); }
  .wl-meaning { color: var(--color-text-primary); font-size: 1.05rem;
    margin: 0 0 var(--spacing-xs); }
  .wl-meaning-soon { font-style: italic; color: var(--color-text-tertiary); }
  .wl-meta-line { display: flex; flex-wrap: wrap; gap: var(--spacing-md);
    align-items: baseline; margin: 0; font-size: 0.85rem; }
  .wl-root-chip { display: inline-flex; align-items: baseline; gap: 0.4em;
    padding: 0.15em 0.6em; border: 1px solid var(--color-border-secondary);
    border-radius: var(--radius-full); text-decoration: none;
    color: var(--color-text-primary); }
  .wl-root-chip[href] { border-color: color-mix(in oklab, var(--accent-gold) 45%, transparent); }
  .wl-root-chip [lang="ar"] { font-family: var(--font-arabic); font-size: 1.05rem; }
  .wl-root-chip-label { font-size: 0.75rem; color: var(--color-text-tertiary); }
  .wl-root-chip:focus-visible { outline: 2px solid var(--color-border-focus);
    outline-offset: 1px; }
  .wl-count { color: var(--color-text-tertiary); }
  .wl-example { color: var(--accent-gold); text-decoration: none; }
  .wl-result-heading { font-size: 0.85rem; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--color-text-tertiary);
    margin: var(--spacing-lg) 0 var(--spacing-sm); }

  .wl-noscript { text-align: center; color: var(--color-text-secondary);
    border: 1px solid var(--color-border-primary); border-radius: var(--radius-md);
    padding: var(--spacing-lg); }
  .wl-noscript a, .wl-attribution a { color: inherit; }
  .wl-attribution { margin-block-start: var(--spacing-3xl); text-align: center;
    font-size: 0.85rem; color: var(--color-text-tertiary); }

  .sr-only { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden;
    clip-path: inset(50%); white-space: nowrap; }

  :root { --wl-ease: cubic-bezier(0.23, 1, 0.32, 1); }

  @keyframes wl-card-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: none; }
  }
  @media (hover: hover) and (pointer: fine) {
    .wl-chip:hover { border-color: var(--accent-gold);
      background: var(--color-background-tertiary); }
    .wl-sug:hover { background: var(--color-background-tertiary); }
    .wl-root-chip[href]:hover { border-color: var(--accent-gold); }
    .wl-example:hover { text-decoration: underline; }
  }
  @media (prefers-reduced-motion: reduce) {
    .wl-card { animation-duration: 1ms; animation-delay: 0ms; }
    .wl-chip:active { transform: none; }
  }
  @media (max-width: 640px) {
    .wl-title { font-size: 1.85rem; }
    .wl-word { font-size: 1.9rem; }
  }
</style>
```

- [ ] **Step 2: Build check**

Run: `npm run build`
Expected: builds clean; `/resources/word-lookup/` emitted in `dist/`.

- [ ] **Step 3: Commit the shell**

```bash
git add src/pages/resources/word-lookup/index.astro
git commit -m "feat(word-lookup): page shell and styles"
```

- [ ] **Step 4: Add the client script** — append AFTER `</BaseLayout>`, BEFORE `<style>`:

```astro
<script>
  import { prepareIndex, search } from '../../../lib/lookup-search.ts';
  import type { Prepared } from '../../../lib/lookup-search.ts';
  import { grammarLine, affixLabel, posLabel } from '../../../lib/grammar-labels.ts';

  // DOM is built with real nodes only — the repo blocks innerHTML.
  type Kid = Node | string | null | undefined;
  function h(tag: string, attrs: Record<string, string> = {}, ...kids: Kid[]): HTMLElement {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    for (const kid of kids) {
      if (kid === null || kid === undefined) continue;
      node.append(typeof kid === 'string' ? document.createTextNode(kid) : kid);
    }
    return node;
  }

  const resultEl = document.getElementById('wl-result')!;
  const searchEl = document.getElementById('wl-search') as HTMLInputElement;
  const sugEl = document.getElementById('wl-suggestions')!;

  let PREP: Prepared | null = null;
  let loading: Promise<Prepared> | null = null;
  function loadData(): Promise<Prepared> {
    if (PREP) return Promise.resolve(PREP);
    loading ??= fetch('/data/word-lookup.json')
      .then(res => { if (!res.ok) throw new Error(String(res.status)); return res.json(); })
      .then(json => (PREP = prepareIndex(json)))
      .catch(err => {
        loading = null;
        resultEl.replaceChildren(h('p', { class: 'wl-load-error' },
          'The word data could not be loaded. Check your connection and try again.'));
        resultEl.hidden = false;
        throw err;
      });
    return loading;
  }
  // Warm the (~2 MB, cached) index as soon as the user shows intent.
  searchEl?.addEventListener('focus', () => { loadData().catch(() => {}); }, { once: true });

  function sugRow(ref: { key: string; surface: string; total: number; hint: string | null }) {
    return h('button', { class: 'wl-sug', role: 'option', 'data-key': ref.key },
      h('span', { lang: 'ar', dir: 'rtl' }, ref.surface),
      ref.hint ? h('span', { class: 'wl-sug-hint' }, ref.hint) : null,
      h('span', { class: 'wl-sug-count' }, `${ref.total}×`));
  }

  function morpheme(ar: string, label: string, extraClass = ''): HTMLElement {
    return h('li', { class: `wl-morpheme ${extraClass}`.trim() },
      ar ? h('span', { lang: 'ar', dir: 'rtl' }, ar) : null,
      h('span', { class: 'wl-morpheme-label' }, label));
  }

  function analysisNode(a: any[]): HTMLElement {
    const [surface, , root, lemma, pos, form, feat, prefixes, suffixes, gloss, count, refs] = a;
    const wrap = h('div', { class: 'wl-analysis' });
    const grammar = h('p', { class: 'wl-grammar' });
    if (form > 0) grammar.append(h('span', { class: 'wl-badge' },
      ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][form - 1] ?? String(form)));
    // The badge already carries the form — passing 0 keeps it out of the prose too.
    grammar.append(grammarLine(pos, 0, feat));
    wrap.append(grammar);

    if (prefixes.length || suffixes.length) {
      const bd = h('ul', { class: 'wl-breakdown', 'aria-label': 'word breakdown' });
      let stemAr = surface;
      for (const p of prefixes) {
        const [ar, code] = String(p).split('|');
        if (ar) stemAr = stemAr.startsWith(ar) ? stemAr.slice(ar.length) : stemAr;
        bd.append(morpheme(ar, affixLabel(code)));
      }
      let tail: HTMLElement[] = [];
      for (const s of [...suffixes].reverse()) {
        const [ar, code] = String(s).split('|');
        // 43 suffixes are the elided "my" (ي absorbed into the stem's kasra):
        // ar is '' — slicing with -0 would wipe the whole stem.
        if (ar && stemAr.endsWith(ar)) stemAr = stemAr.slice(0, -ar.length);
        tail.unshift(morpheme(ar, affixLabel(code)));
      }
      bd.append(morpheme(stemAr, lemma ? `stem of ${posLabel(pos)}` : posLabel(pos), 'wl-morpheme-stem'));
      for (const t of tail) bd.append(t);
      wrap.append(bd);
    }

    wrap.append(gloss
      ? h('p', { class: 'wl-meaning' }, String(gloss))
      : h('p', { class: 'wl-meaning wl-meaning-soon' }, 'meaning coming soon'));

    const metaLine = h('p', { class: 'wl-meta-line' });
    if (root) {
      const rootDots = [...String(root)].join(' · ');
      metaLine.append(pos === 'V'
        ? h('a', { class: 'wl-root-chip',
            href: `/resources/verb-forms/#root=${encodeURIComponent(String(root))}` },
            h('span', { lang: 'ar', dir: 'rtl' }, rootDots),
            h('span', { class: 'wl-root-chip-label' }, 'open in generator'))
        : h('span', { class: 'wl-root-chip' },
            h('span', { lang: 'ar', dir: 'rtl' }, rootDots),
            h('span', { class: 'wl-root-chip-label' }, 'root')));
    }
    metaLine.append(h('span', { class: 'wl-count' }, `${Number(count)}× in the Quran`));
    for (const r of refs) {
      metaLine.append(h('a', { class: 'wl-example', target: '_blank', rel: 'noopener',
        href: `https://quran.com/${encodeURIComponent(String(r).replace(':', '/'))}` },
        String(r)));
    }
    wrap.append(metaLine);
    return wrap;
  }

  function cardNode(i: number, surface: string, translit: string, analyses: any[][]): HTMLElement {
    return h('li', { class: 'wl-card', style: `--i:${i}` },
      h('p', { class: 'wl-word', lang: 'ar', dir: 'rtl' }, surface),
      h('p', { class: 'wl-translit', translate: 'no' }, translit),
      ...analyses.map(analysisNode));
  }

  function renderKey(key: string) {
    if (!PREP) return;
    const analyses = PREP.data.words[key];
    if (!analyses) return;
    // Group by vocalized variant — homographs each get a card.
    const byVariant = new Map<string, any[][]>();
    for (const a of analyses) {
      const list = byVariant.get(a[0]) ?? [];
      list.push(a);
      byVariant.set(a[0], list);
    }
    const cards = [...byVariant.entries()].map(([surface, list], i) =>
      cardNode(i, surface, String(list[0][1]), list));
    resultEl.replaceChildren(
      byVariant.size > 1
        ? h('p', { class: 'wl-result-heading' },
            `${byVariant.size} written forms match`)
        : h('p', { class: 'wl-result-heading' }, 'match'),
      h('ul', { class: 'wl-cards' }, ...cards));
    resultEl.hidden = false;
    sugEl.hidden = true;
    history.replaceState(null, '', `#q=${encodeURIComponent(searchEl.value.trim() || key)}`);
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderEmpty(didYouMean: any[]) {
    const empty = h('div', { class: 'wl-empty' },
      h('p', {}, 'No word in the Quran matches that exactly.'),
      h('p', { class: 'wl-empty-hint' },
        'Tip: paste the word straight from a digital mushaf — vowel marks are fine.'));
    if (didYouMean.length) {
      empty.append(h('p', { class: 'wl-result-heading' }, 'did you mean'),
        h('div', {}, ...didYouMean.map(sugRow)));
    }
    resultEl.replaceChildren(empty);
    resultEl.hidden = false;
  }

  async function runSearch(raw: string, { select = false } = {}) {
    const q = raw.trim();
    if (q.length < 2) { sugEl.hidden = true; return; }
    const p = await loadData().catch(() => null);
    if (!p) return;
    const r = search(p, q);
    if (r.kind === 'arabic') {
      if (r.exact) {
        if (select) { renderKey(r.exact.key); return; }
        sugEl.replaceChildren(sugRow(p.refs.get(r.exact.key)!), ...r.suggestions.map(sugRow));
        sugEl.hidden = false;
        return;
      }
      if (r.suggestions.length) {
        sugEl.replaceChildren(...r.suggestions.map(sugRow));
        sugEl.hidden = false;
      } else { sugEl.hidden = true; renderEmpty(r.didYouMean); }
      return;
    }
    const rows: HTMLElement[] = [];
    if (r.sound.length) {
      rows.push(h('p', { class: 'wl-group-label' }, 'matches by sound'),
        ...r.sound.slice(0, 8).map(sugRow));
    }
    if (r.meaning.length) {
      rows.push(h('p', { class: 'wl-group-label' }, 'matches by meaning'),
        ...r.meaning.slice(0, 8).map(sugRow));
    }
    if (!rows.length) rows.push(h('p', { class: 'wl-sug-none' },
      'nothing matches — try Arabic, a sound like "yuminuna", or a meaning like "believe"'));
    sugEl.replaceChildren(...rows);
    sugEl.hidden = false;
  }

  searchEl?.addEventListener('input', () => runSearch(searchEl.value));
  searchEl?.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      const first = sugEl.querySelector('[data-key]') as HTMLElement | null;
      if (first) first.click();
      else runSearch(searchEl.value, { select: true });
    }
    if (ev.key === 'Escape') sugEl.hidden = true;
    if (ev.key === 'ArrowDown') {
      (sugEl.querySelector('[data-key]') as HTMLElement | null)?.focus();
      ev.preventDefault();
    }
  });
  sugEl?.addEventListener('keydown', (ev) => {
    const items = [...sugEl.querySelectorAll('[data-key]')] as HTMLElement[];
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (ev.key === 'ArrowDown' && i < items.length - 1) { items[i + 1].focus(); ev.preventDefault(); }
    if (ev.key === 'ArrowUp') { (i > 0 ? items[i - 1] : searchEl).focus(); ev.preventDefault(); }
    if (ev.key === 'Escape') { sugEl.hidden = true; searchEl.focus(); }
  });
  document.addEventListener('click', async (ev) => {
    const sug = (ev.target as HTMLElement).closest('[data-key]') as HTMLElement | null;
    if (sug) { await loadData().catch(() => null); renderKey(sug.dataset.key!); return; }
    const chip = (ev.target as HTMLElement).closest('[data-q]') as HTMLElement | null;
    if (chip) {
      searchEl.value = chip.dataset.q!;
      await runSearch(chip.dataset.q!, { select: true });
      return;
    }
    if (!(ev.target as HTMLElement).closest('.wl-search-wrap')) sugEl.hidden = true;
  });

  const hash = new URLSearchParams(location.hash.slice(1));
  const initialQ = hash.get('q');
  if (initialQ) { searchEl.value = initialQ; runSearch(initialQ, { select: true }); }
</script>
```

- [ ] **Step 5: Manual smoke test**

Run: `npm run build && npm run preview` then open `http://localhost:4321/resources/word-lookup/`.
Check: chips work; typing `الصلاة` and pasting `ٱلصَّلَوٰةَ` reach the same card; `yuminuna`
shows a sound group; `believe` shows a meaning group; `ملك` lists multiple written forms;
the يُؤْمِنُونَ card shows breakdown chips `يُؤْمِنُ` + `ونَ (they / them / their)` and the root
chip navigates to the generator with the grid rendered.

- [ ] **Step 6: Commit**

```bash
git add src/pages/resources/word-lookup/index.astro
git commit -m "feat(word-lookup): interactive lookup client (arabic, sound, meaning)"
```

---

### Task 10: E2E + a11y + cross-links

**Files:**
- Create: `tests/word-lookup.spec.ts`
- Modify: `tests/accessibility.spec.ts` (append one test inside the existing describe or a new one)
- Modify: `src/pages/resources/index.astro` (add card after the generator's `</ResourceCard>`)
- Modify: `src/pages/resources/verb-forms/index.astro` (cross-link line before `</footer>` text — see step 3)

- [ ] **Step 1: Write the e2e spec** (all Arabic strings below are verified real surfaces)

```ts
// tests/word-lookup.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Word Lookup', () => {
  test('uthmani paste and modern typing reach the same word', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.fill('#wl-search', 'ٱلصَّلَوٰةَ');
    await page.press('#wl-search', 'Enter');
    const result = page.locator('#wl-result');
    await expect(result).toBeVisible();
    await expect(result.locator('.wl-word').first()).toContainText('لصَّلَو');
    await expect(result.locator('.wl-root-chip').first()).toContainText('ص · ل · و');

    await page.fill('#wl-search', 'الصلاة');
    await page.press('#wl-search', 'Enter');
    await expect(result.locator('.wl-word').first()).toContainText('لصَّلَو');
  });

  test('verb card: gloss, grammar, breakdown, generator deep link', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.fill('#wl-search', 'يؤمنون');
    await page.press('#wl-search', 'Enter');
    const result = page.locator('#wl-result');
    await expect(result).toBeVisible();
    await expect(result.locator('.wl-meaning').first()).toContainText('believe');
    await expect(result.locator('.wl-badge').first()).toHaveText('IV'); // bare Roman badge is the single form indicator
    await expect(result.locator('.wl-morpheme').first()).toBeVisible();
    await result.locator('a.wl-root-chip').first().click();
    await expect(page).toHaveURL(/\/resources\/verb-forms\/#root=/);
    await expect(page.locator('#vf-result .vf-row-attested').first()).toBeVisible();
  });

  test('homograph lists multiple written forms', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.fill('#wl-search', 'ملك');
    await page.press('#wl-search', 'Enter');
    const cards = page.locator('#wl-result .wl-card');
    await expect(cards.nth(1)).toBeVisible(); // auto-waits until at least two cards rendered
    expect(await cards.count()).toBeGreaterThanOrEqual(2);
  });

  test('latin input: sound and meaning groups', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.fill('#wl-search', 'yuminuna');
    await expect(page.locator('.wl-group-label').first()).toContainText('by sound');
    await page.fill('#wl-search', 'believe');
    await expect(page.locator('.wl-group-label', { hasText: 'by meaning' })).toBeVisible();
  });

  test('no match shows did-you-mean guidance', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.fill('#wl-search', 'يؤمنوننن');
    await page.press('#wl-search', 'Enter');
    await expect(page.locator('.wl-empty')).toBeVisible();
  });

  test('deep link #q= renders on load', async ({ page }) => {
    await page.goto('/resources/word-lookup/#q=' + encodeURIComponent('بسم'));
    await expect(page.locator('#wl-result .wl-word').first()).toContainText('بِسْمِ');
  });

  test('example chip renders a card without typing', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.locator('.wl-chip').first().click();
    await expect(page.locator('#wl-result .wl-card').first()).toBeVisible();
  });

  test('resources index card navigates here', async ({ page }) => {
    await page.goto('/resources/');
    await page.click('[data-testid="resource-word-lookup"]');
    await expect(page).toHaveURL(/\/resources\/word-lookup\/$/);
    await expect(page.locator('h1')).toContainText('Word Lookup');
  });
});
```

- [ ] **Step 2: Add the resources card** — in `src/pages/resources/index.astro`, directly
after the Verb Form Generator `</ResourceCard>`:

```astro
      <ResourceCard
        title="Word Lookup"
        description="Type any word of the Quran — Arabic, sound, or meaning — and see its root, verb form, grammar, and morpheme breakdown."
        href="/resources/word-lookup/"
        data-testid="resource-word-lookup"
      >
        <Fragment slot="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 21l-4.35-4.35" stroke-linecap="round"/>
            <path d="M8.5 11h5M11 8.5v5" stroke-linecap="round"/>
          </svg>
        </Fragment>
      </ResourceCard>
```

- [ ] **Step 3: Cross-link from the generator** — in
`src/pages/resources/verb-forms/index.astro`, inside `<footer class="vf-attribution">`,
add BEFORE the existing attribution text:

```astro
      <p class="vf-crosslink">Looking at a full word instead of a root?
        Try <a href="/resources/word-lookup/">Word Lookup</a>.</p>
```

and add to the generator's `<style>` block:

```css
  .vf-crosslink { margin: 0 0 var(--spacing-sm); }
```

- [ ] **Step 4: A11y test** — append to `tests/accessibility.spec.ts` (same pattern as the
existing page tests; note the interaction so axe sees rendered cards):

```ts
test('word lookup page passes contrast checks with results open', async ({ page }) => {
  await page.goto('/resources/word-lookup/#q=' + encodeURIComponent('بسم'));
  await page.waitForLoadState('networkidle');
  await page.locator('#wl-result .wl-card').first().waitFor();
  await enableDarkMode(page);
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2aaa', 'wcag21aaa'])
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

- [ ] **Step 5: Run the new tests**

Run: `npm run build && npx playwright test tests/word-lookup.spec.ts tests/accessibility.spec.ts`
Expected: all pass (Playwright preview server serves the fresh build). Fix real failures —
do not weaken assertions to pass.

- [ ] **Step 6: Commit**

```bash
git add tests/word-lookup.spec.ts tests/accessibility.spec.ts src/pages/resources/index.astro src/pages/resources/verb-forms/index.astro
git commit -m "feat(word-lookup): e2e coverage, a11y check, resources card, generator cross-link"
```

---

### Task 11: Final verification + design audit

- [ ] **Step 1: Full check battery**

```bash
npm run test:lookup        # all unit tests
npm run test:verbs         # regression: untouched generator libs still pass
npm run validate:lookup    # 77,429-word round-trip, exit 0
npm run lookup:build       # idempotent: git diff public/data/word-lookup.json is empty
npm run build              # site builds
npx playwright test tests/word-lookup.spec.ts tests/verb-forms.spec.ts tests/accessibility.spec.ts
```
Expected: everything green, `git status` shows no unexpected changes.
If you run `npx astro check`, afterwards run `git restore package.json package-lock.json`
if the check dirtied them (known @astrojs/check auto-install quirk).

- [ ] **Step 2: Design-guidelines audit (Phase 3, mandatory)**

Run the `web-design-guidelines` skill against `src/pages/resources/word-lookup/index.astro`.
Fix findings (focus-visible, touch targets, aria roles, contrast). Re-run the a11y e2e after fixes.

- [ ] **Step 3: Commit any audit fixes**

```bash
git add -A src/pages/resources/word-lookup/ tests/
git commit -m "polish(word-lookup): design-guidelines audit fixes"
```

- [ ] **Step 4: Verify before claiming done** — use superpowers:verification-before-completion,
then superpowers:finishing-a-development-branch (merge/PR decision belongs to the user).

## Known accepted limitations (documented, not bugs)

- Surface transliterations are draft quality (rare non-article "al…" hyphen, fully-voweled
  tanwin). Sound search folds hide most of it.
- Latin "alshams"-style queries (article typed literally against an assimilated
  transliteration) miss; "ashshams" and "ash-shams" match. Spec notes this as future work.
- Suffix pronouns are labeled role-neutrally ("they / them / their") because the corpus tags
  subject endings as PRON suffixes too; claiming subject vs object would require a
  form-level heuristic — deferred.
- Non-verb glosses are `meaning coming soon` until the Phase-2 curation effort.
