# Quranic Verb Form Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Interactive `/resources/verb-forms/` page: pick any Quranic verbal root → see the real Form I–X behavior (past/present pair, transliteration, meaning, count, example verse), unattested forms greyed as pattern-only.

**Architecture:** Two-layer data pipeline (mechanical corpus extraction + batched curated glosses) merged into one static JSON consumed by a vanilla-JS Astro page. Spec: `docs/superpowers/specs/2026-07-03-verb-form-generator-design.md`.

**Tech Stack:** Astro (no framework), TypeScript scripts run via `tsx`, `node:test` for unit tests, Playwright for e2e. No new dependencies.

**Orchestration note (user requirement):** Fable 5 authors/validates; mechanical execution (gloss batches especially) is dispatched to lower-model subagents (`model: "sonnet"`). Gloss batches are content work — dispatch them with the prompt template from Task 6, validate every batch with the Task 7 script, spot-review before commit.

**Security note:** all client-side rendering of dataset strings goes through the `esc()` helper (HTML-escape) before `innerHTML` insertion — the dataset is our own validated artifact, but escape anyway.

**Contract refinements vs. spec (approved direction, recorded here):**
1. `forms` values are **arrays** of lemma entries — a few (root, form) slots may hold two distinct lemmas; UI renders each.
2. Quadriliteral roots (زلزل, وسوس…) are included, flagged `"quad": true`, and shown in a separate "Four-letter roots" appendix list (attested rows only, no I–X frame).
3. Merged JSON lives at `public/data/verb-forms.json` (runtime-fetched, Capacitor-bundled).

---

### Task 1: Obtain corpus morphology data

**Files:**
- Create: `src/data/morphology/quranic-corpus-morphology-0.4.txt` (downloaded, committed)
- Create: `src/data/morphology/README.md`

- [ ] **Step 1: Locate the file** — use the firecrawl skill (`firecrawl-search`, query: `"quranic-corpus-morphology-0.4.txt" raw github`) to find a raw mirror of the **original v0.4** file from corpus.quran.com (Kais Dukes). Prefer files whose header block reads `Quranic Arabic Corpus (morphology, version 0.4)` with the GPL notice. Do NOT use altered forks (e.g. mustafa0x/quran-morphology changes tags).

- [ ] **Step 2: Download with curl** (raw URL from step 1):

```bash
curl -sL "<RAW_URL>" -o src/data/morphology/quranic-corpus-morphology-0.4.txt
wc -l src/data/morphology/quranic-corpus-morphology-0.4.txt
head -60 src/data/morphology/quranic-corpus-morphology-0.4.txt
```

Expected: ~125,000–132,000 lines; header comment naming the corpus, version 0.4, Kais Dukes, GPL. If the header is absent or format differs from `(1:1:1:1)\tbi\tP\tPREFIX|bi+`, STOP and find another mirror.

- [ ] **Step 3: Record verb-token ground truth:**

```bash
awk -F'\t' '$3=="V"' src/data/morphology/quranic-corpus-morphology-0.4.txt | wc -l
```

Expected: ≈19,000–19,500. Record the exact number in `src/data/morphology/README.md`.

- [ ] **Step 4: Write `src/data/morphology/README.md`:**

```markdown
# Morphology data

`quranic-corpus-morphology-0.4.txt` — Quranic Arabic Corpus morphological
annotation v0.4, © Kais Dukes 2011, GNU GPL. Source: https://corpus.quran.com
Downloaded: 2026-07-03 from <RAW_URL>. Verb tokens (TAG=V): <N>.

Derived files here are build artifacts of `scripts/build-verb-dataset.ts`;
curated glosses live in `glosses/`. The site page credits the corpus (GPL).
```

- [ ] **Step 5: Commit**

```bash
git add src/data/morphology/
git commit -m "feat(verb-forms): add Quranic Arabic Corpus morphology data (GPL, attributed)"
```

---

### Task 2: Buckwalter conversion module (TDD)

**Files:**
- Create: `scripts/lib/buckwalter.ts`
- Test: `scripts/lib/buckwalter.test.ts`

- [ ] **Step 1: Write the failing tests:**

```typescript
// scripts/lib/buckwalter.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bwToArabic, bwToTranslit } from './buckwalter.ts';

test('bwToArabic: sound Form I', () => {
  assert.equal(bwToArabic('kataba'), 'كَتَبَ');
});
test('bwToArabic: hollow root', () => {
  assert.equal(bwToArabic('qaAla'), 'قَالَ');
});
test('bwToArabic: Form IV hamza prefix', () => {
  assert.equal(bwToArabic('>anzala'), 'أَنْزَلَ');
});
test('bwToArabic: Form X with wasla', () => {
  assert.equal(bwToArabic('{isotagofara'), 'اِسْتَغْفَرَ');
});
test('bwToArabic: shadda', () => {
  assert.equal(bwToArabic('Eal~ama'), 'عَلَّمَ');
});
test('bwToArabic: madda', () => {
  assert.equal(bwToArabic('|mana'), 'آمَنَ');
});
test('bwToTranslit: sound', () => {
  assert.equal(bwToTranslit('kataba'), 'kataba');
});
test('bwToTranslit: long vowel', () => {
  assert.equal(bwToTranslit('qaAla'), 'qāla');
});
test('bwToTranslit: initial hamza dropped, emphatics kept', () => {
  assert.equal(bwToTranslit('>anzala'), 'anzala');
  assert.equal(bwToTranslit('{isotagofara'), 'istaghfara');
});
test('bwToTranslit: shadda doubles, ʿayn mapped', () => {
  assert.equal(bwToTranslit('Eal~ama'), 'ʿallama');
});
test('bwToTranslit: iy/uw collapse to ī/ū', () => {
  assert.equal(bwToTranslit('yaquwlu'), 'yaqūlu');
  assert.equal(bwToTranslit('yastaEiynu'), 'yastaʿīnu');
});
```

- [ ] **Step 2: Run to verify failure:** `npx tsx --test scripts/lib/buckwalter.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 3: Implement `scripts/lib/buckwalter.ts`:**

```typescript
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

// Display convention: dictionary-style wasla shown as bare alif + short vowel
// (اِسْتَغْفَرَ), matching the site's verb-forms master reference.
export function bwToArabic(bw: string): string {
  let out = '';
  for (const ch of bw) out += BW_TO_AR[ch] ?? ch;
  return out.replace(/^ٱ/, 'ا');
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
    if (ch === 'o') { i++; continue; }           // sukun
    if (ch === '~') { out += prev; i++; continue; } // shadda doubles consonant
    if (ch === 'A') { out += 'ā'; i++; continue; }  // bare alif (defective spellings)
    const tl = BW_CONSONANT_TL[ch];
    if (tl !== undefined) { prev = tl; out += tl; i++; continue; }
    i++; // unknown marker: skip in draft
  }
  return out.replace(/^ʾ/, '');
}
```

- [ ] **Step 4: Run tests:** `npx tsx --test scripts/lib/buckwalter.test.ts` — Expected: ALL PASS. If a case fails, fix the converter, not the test.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/buckwalter.ts scripts/lib/buckwalter.test.ts
git commit -m "feat(verb-forms): Buckwalter to Arabic/transliteration converters"
```

---

### Task 3: Corpus verb extraction (TDD)

**Files:**
- Create: `scripts/lib/extract-verbs.ts`
- Create: `tests/fixtures/corpus-verbs-sample.txt` (real lines from the corpus file)
- Test: `scripts/lib/extract-verbs.test.ts`

- [ ] **Step 1: Build the fixture from the real corpus file** (real data, deterministic):

```bash
{ grep -m 12 'ROOT:qwl' src/data/morphology/quranic-corpus-morphology-0.4.txt;
  grep -m 6 'ROOT:nzl' src/data/morphology/quranic-corpus-morphology-0.4.txt;
  grep -m 6 '(IV)|LEM:>anzal' src/data/morphology/quranic-corpus-morphology-0.4.txt;
  grep -m 4 'ROOT:gfr' src/data/morphology/quranic-corpus-morphology-0.4.txt;
  grep -m 3 'ROOT:zlzl' src/data/morphology/quranic-corpus-morphology-0.4.txt; } \
  > tests/fixtures/corpus-verbs-sample.txt
wc -l tests/fixtures/corpus-verbs-sample.txt
```

(If a grep pattern returns nothing, inspect the actual feature spelling with `grep -m3 'nzl' …` and adjust — the test asserts real facts, so the fixture must contain V-tagged rows for roots qwl, nzl, gfr and at least one Form IV nzl row. Note `grep -F` may be needed since `(IV)|LEM` contains regex metacharacters.)

- [ ] **Step 2: Write the failing test:**

```typescript
// scripts/lib/extract-verbs.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCorpus, groupVerbs } from './extract-verbs.ts';

const raw = readFileSync('tests/fixtures/corpus-verbs-sample.txt', 'utf8');

test('parseCorpus keeps only V-tagged tokens with root/form/lemma/location', () => {
  const tokens = parseCorpus(raw);
  assert.ok(tokens.length > 0);
  for (const t of tokens) {
    assert.match(t.location, /^\d+:\d+$/);
    assert.ok(t.root.length >= 2);
    assert.ok(t.form >= 1 && t.form <= 12);
    assert.ok(t.lemma.length > 0);
  }
});

test('groupVerbs aggregates count and first occurrence per root/form/lemma', () => {
  const grouped = groupVerbs(parseCorpus(raw));
  const qwl = grouped.find(r => r.root === 'qwl');
  assert.ok(qwl, 'root qwl present');
  const f1 = qwl!.forms['1'];
  assert.ok(f1 && f1.some(e => e.lemma === 'qaAla'), 'qwl form I lemma qaAla');
  const nzl = grouped.find(r => r.root === 'nzl');
  assert.ok(nzl!.forms['4']?.some(e => e.lemma === '>anzala' || e.lemma === '>anzal'),
    'nzl form IV lemma anzala');
  for (const r of grouped) for (const list of Object.values(r.forms))
    for (const e of list) {
      assert.ok(e.count >= 1);
      assert.match(e.example, /^\d+:\d+$/);
    }
});

test('quadriliteral roots are flagged', () => {
  const grouped = groupVerbs(parseCorpus(raw));
  const zlzl = grouped.find(r => r.root === 'zlzl');
  assert.ok(zlzl?.quad === true);
});
```

- [ ] **Step 3: Run to verify failure:** `npx tsx --test scripts/lib/extract-verbs.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 4: Implement `scripts/lib/extract-verbs.ts`:**

```typescript
export interface VerbToken {
  location: string; // "surah:ayah"
  form: number;     // 1–12 (corpus roman numerals; 1 when absent)
  lemma: string;    // Buckwalter
  root: string;     // Buckwalter
}
export interface LemmaEntry { lemma: string; count: number; example: string; }
export interface RootGroup {
  root: string;
  quad: boolean;
  totalCount: number;
  forms: Record<string, LemmaEntry[]>;
}

const ROMAN: Record<string, number> = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12,
};

export function parseCorpus(text: string): VerbToken[] {
  const tokens: VerbToken[] = [];
  for (const line of text.split('\n')) {
    if (!line || line.startsWith('#') || line.startsWith('LOCATION')) continue;
    const cols = line.split('\t');
    if (cols.length < 4 || cols[2] !== 'V') continue;
    const loc = cols[0].match(/^\((\d+):(\d+):\d+:\d+\)$/);
    if (!loc) continue;
    const features = cols[3].split('|');
    let form = 1, lemma = '', root = '';
    for (const f of features) {
      const roman = f.match(/^\((XI{0,2}|IX|IV|VI{0,3}|I{1,3}|V)\)$/);
      if (roman) form = ROMAN[roman[1]] ?? 1;
      else if (f.startsWith('LEM:')) lemma = f.slice(4);
      else if (f.startsWith('ROOT:')) root = f.slice(5);
    }
    if (!lemma || !root) continue; // rare untagged tokens: counted in caller's stats
    tokens.push({ location: `${loc[1]}:${loc[2]}`, form, lemma, root });
  }
  return tokens;
}

export function groupVerbs(tokens: VerbToken[]): RootGroup[] {
  const byRoot = new Map<string, RootGroup>();
  for (const t of tokens) {
    let rg = byRoot.get(t.root);
    if (!rg) {
      rg = { root: t.root, quad: t.root.length >= 4, totalCount: 0, forms: {} };
      byRoot.set(t.root, rg);
    }
    rg.totalCount++;
    const key = String(t.form);
    rg.forms[key] ??= [];
    let entry = rg.forms[key].find(e => e.lemma === t.lemma);
    if (!entry) {
      entry = { lemma: t.lemma, count: 0, example: t.location };
      rg.forms[key].push(entry);
    }
    entry.count++;
  }
  return [...byRoot.values()].sort((a, b) => b.totalCount - a.totalCount);
}
```

- [ ] **Step 5: Run tests:** `npx tsx --test scripts/lib/extract-verbs.test.ts` — Expected: ALL PASS. (The roman-numeral alternation is order-sensitive — `XI` before `IX` before `IV` before `VI` before `I` — verify against real fixture lines like `(IV)` and `(VIII)`.)

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/extract-verbs.ts scripts/lib/extract-verbs.test.ts tests/fixtures/corpus-verbs-sample.txt
git commit -m "feat(verb-forms): corpus verb extraction and grouping"
```

---

### Task 4: `extract` CLI → skeleton dataset

**Files:**
- Create: `scripts/build-verb-dataset.ts`
- Create (generated, committed): `src/data/morphology/verb-skeleton.json`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Implement the CLI (extract command now; slice/merge added in Tasks 5/8):**

```typescript
// scripts/build-verb-dataset.ts
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { parseCorpus, groupVerbs } from './lib/extract-verbs.ts';
import { bwToArabic, bwToTranslit } from './lib/buckwalter.ts';

const CORPUS = 'src/data/morphology/quranic-corpus-morphology-0.4.txt';
const SKELETON = 'src/data/morphology/verb-skeleton.json';

// Roots: corpus writes hamza as A in ROOT: fields → display ء; letters joined bare.
function rootToArabic(rootBw: string): string {
  return [...rootBw].map(c => (c === 'A' ? 'ء' : bwToArabic(c))).join('');
}
function rootTranslit(rootBw: string): string {
  return [...rootBw].map(c => (c === 'A' ? 'ʾ' : bwToTranslit(c + 'a').replace(/a$/, ''))).join('-');
}
function weakFlags(rootBw: string): string[] {
  const flags: string[] = [];
  const L = [...rootBw];
  if ('wy'.includes(L[0])) flags.push('assimilated');
  if ('wy'.includes(L[1] ?? '')) flags.push('hollow');
  if ('wyA'.includes(L[L.length - 1])) flags.push(L[L.length - 1] === 'A' ? 'hamzated-final' : 'defective');
  if (L[0] === 'A') flags.push('hamzated-initial');
  if (L[1] === 'A') flags.push('hamzated-medial');
  if (L.length === 3 && L[1] === L[2]) flags.push('doubled');
  return flags;
}

function extract() {
  const tokens = parseCorpus(readFileSync(CORPUS, 'utf8'));
  const grouped = groupVerbs(tokens);
  const formXI = grouped.flatMap(r =>
    Object.keys(r.forms).filter(f => Number(f) > 10).map(f => `${r.root} form ${f}`));
  const skeleton = grouped.map(r => ({
    root: r.root,
    rootAr: rootToArabic(r.root),
    rootTranslit: rootTranslit(r.root),
    quad: r.quad,
    weak: weakFlags(r.root),
    totalCount: r.totalCount,
    forms: Object.fromEntries(
      Object.entries(r.forms)
        .filter(([f]) => Number(f) <= 10)
        .map(([f, entries]) => [f, entries.map(e => ({
          lemma: e.lemma,
          draftPast: bwToArabic(e.lemma),
          draftTranslit: bwToTranslit(e.lemma),
          count: e.count,
          example: e.example,
        }))]),
    ),
  }));
  const entryCount = skeleton.reduce(
    (n, r) => n + Object.values(r.forms).reduce((m, l) => m + l.length, 0), 0);
  const multiLemma = skeleton.flatMap(r =>
    Object.entries(r.forms).filter(([, l]) => l.length > 1).map(([f]) => `${r.root}:${f}`));
  writeFileSync(SKELETON, JSON.stringify({
    meta: { verbTokens: tokens.length, roots: skeleton.length, entries: entryCount },
    roots: skeleton,
  }, null, 1));
  console.log(`roots=${skeleton.length} entries=${entryCount} tokens=${tokens.length}`);
  console.log(`multi-lemma slots (${multiLemma.length}): ${multiLemma.join(', ')}`);
  console.log(`forms>X excluded: ${formXI.length ? formXI.join(', ') : 'none'}`);
}

function slice() { throw new Error('not implemented — Task 5'); }
function merge() { throw new Error('not implemented — Task 8'); }

const cmd = process.argv[2];
if (cmd === 'extract') extract();
else if (cmd === 'slice') slice();
else if (cmd === 'merge') merge();
else { console.error('usage: build-verb-dataset.ts extract|slice|merge'); process.exit(1); }
```

- [ ] **Step 2: Add npm scripts to `package.json`** (in `"scripts"`, after the `validate:*` block):

```json
"verbs:extract": "tsx scripts/build-verb-dataset.ts extract",
"verbs:slice": "tsx scripts/build-verb-dataset.ts slice",
"verbs:merge": "tsx scripts/build-verb-dataset.ts merge",
"validate:verbs": "tsx scripts/validate-verb-glosses.ts --merged",
"test:verbs": "tsx --test scripts/lib/buckwalter.test.ts scripts/lib/extract-verbs.test.ts"
```

- [ ] **Step 3: Run:** `npm run verbs:extract` — Expected: prints real counts (roots ≈ 900–1,000, entries ≈ 1,300–1,600). **Record the exact numbers in the plan-execution notes and in `src/data/morphology/README.md`.** Eyeball `verb-skeleton.json`: top root should be قول (qwl), and `qwl.forms["1"][0].draftPast` should be `قَالَ`.

- [ ] **Step 4: Spot-verify known facts** against the skeleton: `gfr` should have forms 1 and 10 (غَفَرَ / اِسْتَغْفَرَ); `nzl` should include forms 1, 2, 4, 5; `slm` should include form 4 (أَسْلَمَ). Any surprise → investigate before continuing.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-verb-dataset.ts package.json src/data/morphology/verb-skeleton.json src/data/morphology/README.md
git commit -m "feat(verb-forms): extraction CLI and committed verb skeleton dataset"
```

---

### Task 5: `slice` command → gloss batch inputs

**Files:**
- Modify: `scripts/build-verb-dataset.ts` (replace `slice` stub)
- Create (generated, committed): `src/data/morphology/glosses/input/batch-NN.input.json`

- [ ] **Step 1: Implement `slice` (replace the stub):**

```typescript
const GLOSS_IN = 'src/data/morphology/glosses/input';
const BATCH_TARGET = 55; // entries per batch; roots never split across batches

function slice() {
  const skeleton = JSON.parse(readFileSync(SKELETON, 'utf8'));
  mkdirSync(GLOSS_IN, { recursive: true });
  let batch: any[] = [], size = 0, n = 1;
  const flush = () => {
    if (!batch.length) return;
    const name = `batch-${String(n).padStart(2, '0')}`;
    writeFileSync(`${GLOSS_IN}/${name}.input.json`,
      JSON.stringify({ batch: name, entries: batch }, null, 1));
    console.log(`${name}: ${size} entries, ${batch.length} roots`);
    n++; batch = []; size = 0;
  };
  for (const r of skeleton.roots) {
    const entries = Object.entries(r.forms).flatMap(([form, list]: [string, any]) =>
      list.map((e: any) => ({ form: Number(form), ...e })));
    batch.push({ root: r.root, rootAr: r.rootAr, rootTranslit: r.rootTranslit,
      quad: r.quad, weak: r.weak, entries });
    size += entries.length;
    if (size >= BATCH_TARGET) flush();
  }
  flush();
}
```

- [ ] **Step 2: Run:** `npm run verbs:slice` — Expected: ~25–30 batch files; first batch holds the highest-frequency roots (قول، كون، علم…). Record batch count.

- [ ] **Step 3: Commit**

```bash
git add scripts/build-verb-dataset.ts src/data/morphology/glosses/input/
git commit -m "feat(verb-forms): gloss batch slicing (frequency-ordered)"
```

---

### Task 6: Gloss batch prompt template

**Files:**
- Create: `docs/superpowers/plans/verb-gloss-batch-prompt.md`

- [ ] **Step 1: Write the template.** This is the exact prompt dispatched (with the batch input JSON appended) to each `model: sonnet` subagent:

````markdown
# Verb gloss batch task

You are curating dictionary entries for Quranic verbs on a Quranic Arabic
learning site. Input (below) is a JSON batch: roots with attested
(root, form) lemma entries extracted from the Quranic Arabic Corpus.

For EVERY entry in every root, produce an output object:

```json
{ "root": "<root field verbatim>", "form": 3, "lemma": "<lemma field verbatim>",
  "past": "أَنْزَلَ", "present": "يُنْزِلُ",
  "translit": "anzala / yunzilu",
  "meaning": "to send down, reveal" }
```

Rules — violations fail validation:
1. `root`, `form`, `lemma` copied verbatim from input (join keys).
2. `past`: the classical dictionary citation form (3rd masc. sing. perfect),
   fully vocalized. Start from `draftPast` (mechanical conversion) and fix
   orthography to dictionary convention (e.g. ءَامَنَ → آمَنَ). Every consonant
   must carry a diacritic (fatha/kasra/damma/sukun/shadda+vowel).
3. `present`: matching 3rd masc. sing. imperfect, fully vocalized, correct
   for the verb's ACTUAL behavior:
   - Forms II–X sound roots: pattern-regular (يُفَعِّلُ يُفَاعِلُ يُفْعِلُ يَتَفَعَّلُ
     يَتَفَاعَلُ يَنْفَعِلُ يَفْتَعِلُ يَفْعَلُّ يَسْتَفْعِلُ).
   - Form I: you must supply the correct middle vowel (يَفْعَلُ/يَفْعِلُ/يَفْعُلُ)
     as established in classical dictionaries for THIS verb.
   - Weak roots (`weak` flags in input): apply the correct weak conjugation
     (hollow: قَالَ/يَقُولُ، بَاعَ/يَبِيعُ، خَافَ/يَخَافُ; defective: دَعَا/يَدْعُو،
     هَدَى/يَهْدِي، رَضِيَ/يَرْضَى; assimilated: وَعَدَ/يَعِدُ; doubled: ظَنَّ/يَظُنُّ;
     hamzated: أَكَلَ/يَأْكُلُ، سَأَلَ/يَسْأَلُ).
   - Quadriliteral roots (`quad: true`): quad patterns (زَلْزَلَ/يُزَلْزِلُ;
     اِطْمَأَنَّ/يَطْمَئِنُّ).
4. `translit`: scholarly transliteration of BOTH forms, `"past / present"`,
   using exactly: ā ī ū ḥ ṣ ḍ ṭ ẓ ʿ ʾ gh kh sh th dh. No initial ʾ.
   Doubled letters written twice (ʿallama). Correct the draft if wrong.
5. `meaning`: 2–8 word English infinitive gloss ("to …") reflecting how the
   Quran uses this verb (its dominant Quranic sense(s), not rare classical
   senses). Up to two senses separated by a comma. No trailing period.
6. NEVER invent forms not in the input. NEVER drop an entry. Output count
   must equal input entry count.
7. If a lemma is a passive-only usage, gloss the passive meaning and keep
   the lemma's citation as given.

Write your output to `src/data/morphology/glosses/output/<batch>.json` as
ONLY a JSON document, no prose:

```json
{ "batch": "batch-NN", "glosses": [ …one object per entry… ] }
```
````

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/plans/verb-gloss-batch-prompt.md
git commit -m "docs(verb-forms): gloss batch subagent prompt template"
```

---

### Task 7: Batch validation script

**Files:**
- Create: `scripts/validate-verb-glosses.ts`

- [ ] **Step 1: Implement:**

```typescript
// scripts/validate-verb-glosses.ts
// Modes:
//   --batch NN     validate glosses/output/batch-NN.json against its input
//   --all-batches  validate every output batch
//   --merged       validate public/data/verb-forms.json against the skeleton
import { readFileSync, readdirSync } from 'node:fs';

const AR_VOCALIZED = /^[ء-يٰٱـً-ْ]+$/;
const TL = /^[a-zāīūḥṣḍṭẓʿʾ'’\- \/]+$/;
const MEANING = /^[a-zA-Z0-9(),;'’\- ]{3,80}$/;

let failures = 0;
const fail = (msg: string) => { failures++; console.error(`FAIL ${msg}`); };

function diacriticDensity(s: string): number {
  const marks = (s.match(/[ً-ْٰ]/g) ?? []).length;
  const letters = (s.match(/[ء-ي]/g) ?? []).length;
  return letters ? marks / letters : 0;
}

function validateGloss(g: any, where: string) {
  for (const k of ['past', 'present'] as const) {
    if (!AR_VOCALIZED.test(g[k] ?? '')) fail(`${where}: ${k} bad charset: ${g[k]}`);
    else if (diacriticDensity(g[k]) < 0.5) fail(`${where}: ${k} under-vocalized: ${g[k]}`);
  }
  if (!TL.test(g.translit ?? '') || !(g.translit ?? '').includes(' / '))
    fail(`${where}: translit malformed: ${g.translit}`);
  if (!MEANING.test(g.meaning ?? '') || !/^to /.test(g.meaning ?? ''))
    fail(`${where}: meaning malformed: ${g.meaning}`);
}

function validateBatch(nn: string) {
  const input = JSON.parse(readFileSync(`src/data/morphology/glosses/input/batch-${nn}.input.json`, 'utf8'));
  const output = JSON.parse(readFileSync(`src/data/morphology/glosses/output/batch-${nn}.json`, 'utf8'));
  const expect = new Set<string>();
  for (const r of input.entries)
    for (const e of r.entries) expect.add(`${r.root}|${e.form}|${e.lemma}`);
  const got = new Set<string>();
  for (const g of output.glosses ?? []) {
    const key = `${g.root}|${g.form}|${g.lemma}`;
    if (!expect.has(key)) fail(`batch-${nn}: unexpected entry ${key}`);
    if (got.has(key)) fail(`batch-${nn}: duplicate entry ${key}`);
    got.add(key);
    validateGloss(g, `batch-${nn} ${key}`);
  }
  for (const key of expect) if (!got.has(key)) fail(`batch-${nn}: missing entry ${key}`);
  console.log(`batch-${nn}: ${got.size}/${expect.size} entries, ${failures} failures`);
}

function validateMerged() {
  const skeleton = JSON.parse(readFileSync('src/data/morphology/verb-skeleton.json', 'utf8'));
  const data = JSON.parse(readFileSync('public/data/verb-forms.json', 'utf8'));
  // Ayah counts derived from the corpus itself (max ayah seen per surah).
  const corpus = readFileSync('src/data/morphology/quranic-corpus-morphology-0.4.txt', 'utf8');
  const maxAyah = new Map<number, number>();
  for (const m of corpus.matchAll(/^\((\d+):(\d+):\d+:\d+\)/gm)) {
    const s = +m[1], a = +m[2];
    if ((maxAyah.get(s) ?? 0) < a) maxAyah.set(s, a);
  }
  let entries = 0, missing = 0;
  for (const r of data.roots) {
    for (const [form, list] of Object.entries<any>(r.forms)) {
      if (+form < 1 || +form > 10) fail(`${r.root}: form out of range ${form}`);
      for (const e of list) {
        entries++;
        if (e.meaning === null) { missing++; continue; }
        validateGloss(e, `${r.root}:${form}`);
        const [s, a] = String(e.example).split(':').map(Number);
        if (!maxAyah.has(s) || a < 1 || a > (maxAyah.get(s) ?? 0))
          fail(`${r.root}:${form} bad example ref ${e.example}`);
      }
    }
  }
  if (entries !== skeleton.meta.entries)
    fail(`entry count drift: merged ${entries} vs skeleton ${skeleton.meta.entries}`);
  console.log(`merged: ${entries} entries, ${missing} missing glosses, ${failures} failures`);
  if (missing > 0) console.warn(`WARN: ${missing} entries awaiting glosses (allowed pre-ship, not at ship)`);
}

const mode = process.argv[2];
if (mode === '--batch') validateBatch(process.argv[3]);
else if (mode === '--merged') validateMerged();
else if (mode === '--all-batches') {
  for (const f of readdirSync('src/data/morphology/glosses/output/'))
    if (/^batch-\d+\.json$/.test(f)) validateBatch(f.match(/\d+/)![0]);
} else { console.error('usage: --batch NN | --all-batches | --merged'); process.exit(1); }
process.exit(failures ? 1 : 0);
```

- [ ] **Step 2: Prove it can fail.** Hand-write `src/data/morphology/glosses/output/batch-01.json` containing ONE deliberately bad entry (`"meaning": "writing"` — no "to", and an unvocalized `"past": "كتب"`), run `npx tsx scripts/validate-verb-glosses.ts --batch 01` — Expected: exits 1 with both failures AND "missing entry" lines for the rest. Delete the fake file after.

- [ ] **Step 3: Commit**

```bash
git add scripts/validate-verb-glosses.ts
git commit -m "feat(verb-forms): gloss batch and merged-dataset validators"
```

---

### Task 8: `merge` command → shipped JSON

**Files:**
- Modify: `scripts/build-verb-dataset.ts` (replace `merge` stub)
- Create (generated): `public/data/verb-forms.json`

- [ ] **Step 1: Implement `merge` (replace the stub):**

```typescript
const GLOSS_OUT = 'src/data/morphology/glosses/output';
const PUBLIC_JSON = 'public/data/verb-forms.json';

function merge() {
  const skeleton = JSON.parse(readFileSync(SKELETON, 'utf8'));
  const glossMap = new Map<string, any>();
  let files: string[] = [];
  try { files = readdirSync(GLOSS_OUT).filter(f => /^batch-\d+\.json$/.test(f)); } catch {}
  for (const f of files) {
    const b = JSON.parse(readFileSync(`${GLOSS_OUT}/${f}`, 'utf8'));
    for (const g of b.glosses) glossMap.set(`${g.root}|${g.form}|${g.lemma}`, g);
  }
  let missing = 0;
  const roots = skeleton.roots.map((r: any) => ({
    root: r.rootAr,
    translit: r.rootTranslit,
    quad: r.quad,
    totalCount: r.totalCount,
    forms: Object.fromEntries(Object.entries(r.forms).map(([form, list]: [string, any]) => [
      form,
      list.map((e: any) => {
        const g = glossMap.get(`${r.root}|${form}|${e.lemma}`);
        if (!g) missing++;
        return {
          past: g?.past ?? e.draftPast,
          present: g?.present ?? null,
          translit: g?.translit ?? e.draftTranslit,
          meaning: g?.meaning ?? null,
          count: e.count,
          example: e.example,
        };
      }),
    ])),
  }));
  mkdirSync('public/data', { recursive: true });
  writeFileSync(PUBLIC_JSON, JSON.stringify({
    meta: {
      roots: roots.length,
      entries: skeleton.meta.entries,
      source: 'Quranic Arabic Corpus v0.4 (Kais Dukes, GPL) — corpus.quran.com',
    },
    roots,
  }));
  console.log(`merged ${roots.length} roots, ${skeleton.meta.entries} entries, ${missing} missing glosses → ${PUBLIC_JSON}`);
}
```

- [ ] **Step 2: Run merge with zero batches present:** `npm run verbs:merge` then `npm run validate:verbs` — Expected: merge reports all entries missing glosses; validator exits 0 with a WARN (missing allowed pre-ship). Check file size: `du -h public/data/verb-forms.json` (expect 200–400 KB).

- [ ] **Step 3: Commit**

```bash
git add scripts/build-verb-dataset.ts public/data/verb-forms.json
git commit -m "feat(verb-forms): merge command producing shipped verb-forms.json"
```

---

### Task 9: Pilot gloss batch (batch-01) — calibration

**Files:**
- Create: `src/data/morphology/glosses/output/batch-01.json` (subagent-authored)

- [ ] **Step 1: Dispatch ONE subagent** (`model: "sonnet"`): prompt = full text of `verb-gloss-batch-prompt.md` + contents of `glosses/input/batch-01.input.json`. Instruct it to WRITE the output file itself at the exact path.
- [ ] **Step 2: Validate:** `npx tsx scripts/validate-verb-glosses.ts --batch 01` — Expected: 0 failures (else: fix systematic issues by improving the PROMPT, re-dispatch; one-off errors fix inline).
- [ ] **Step 3: Fable review (quality gate):** batch-01 holds the Quran's most frequent verbs — review EVERY entry (meanings against known Quranic usage: qāla/yaqūlu "to say", āmana/yuʾminu "to believe", kāna/yakūnu "to be"…, correct Form I present vowels, correct weak conjugations). Record corrections; if >10% needed correction, amend the prompt template before Task 10 and note the pattern.
- [ ] **Step 4: Merge + eyeball in data:** `npm run verbs:merge && npm run validate:verbs`.
- [ ] **Step 5: Commit** — `git add src/data/morphology/glosses/output/batch-01.json public/data/verb-forms.json && git commit -m "feat(verb-forms): gloss batch 01 (top-frequency roots), reviewed"`

---

### Task 10: Remaining gloss batches (waves)

**Files:**
- Create: `src/data/morphology/glosses/output/batch-{02..NN}.json`

- [ ] **Step 1: Dispatch in parallel waves of 4–5 subagents** (`model: "sonnet"`, one batch each, same prompt mechanics as Task 9). Use the dispatching-parallel-agents skill.
- [ ] **Step 2: After each wave:** `npx tsx scripts/validate-verb-glosses.ts --all-batches` → 0 failures; Fable spot-review per batch: every weak/quad root + 5 random sound entries. Re-dispatch a batch wholesale if systematic problems appear.
- [ ] **Step 3: Commit per wave:** `git add src/data/morphology/glosses/output/ && git commit -m "feat(verb-forms): gloss batches NN–MM, validated + spot-reviewed"`
- [ ] **Step 4: When all batches done:** `npm run verbs:merge && npm run validate:verbs` — Expected: **0 missing glosses, 0 failures.** Commit regenerated JSON.

---

### Task 11: Generator page UI

**Files:**
- Create: `src/pages/resources/verb-forms/index.astro`

**MANDATORY per CLAUDE.md:** before writing/editing this file, load Phase-2 design skills (`taste-skill`, `impeccable`, `emil-design-eng`); after it renders, run the `web-design-guidelines` audit (Task 13 covers verification). Direction (Phase 1) is fixed: the site's existing token system.

- [ ] **Step 1: Create the page** — complete implementation. All dataset strings pass through `esc()` before `innerHTML`:

```astro
---
import { readFileSync } from 'node:fs';
import BaseLayout from '../../../layouts/BaseLayout.astro';
import Container from '../../../components/primitives/Container.astro';

// Build-time read of the shipped dataset: prerender root index + chips (SEO,
// graceful no-JS); the client script re-fetches the same JSON for interaction.
const data = JSON.parse(readFileSync('public/data/verb-forms.json', 'utf8'));
const triRoots = data.roots.filter((r: any) => !r.quad);
const quadRoots = data.roots.filter((r: any) => r.quad);
const topRoots = triRoots.slice(0, 18);

const LETTER_ORDER = [...'ءبتثجحخدذرزسشصضطظعغفقكلمنهوي'];
const byLetter = LETTER_ORDER.map(letter => ({
  letter,
  roots: triRoots
    .filter((r: any) => r.root.startsWith(letter))
    .sort((a: any, b: any) => a.root.localeCompare(b.root, 'ar')),
})).filter(g => g.roots.length > 0);

const FORMS = [
  { n: 1,  past: 'فَعَلَ',       present: 'يَفْعَلُ',      shift: 'basic action' },
  { n: 2,  past: 'فَعَّلَ',      present: 'يُفَعِّلُ',     shift: 'intensify / cause' },
  { n: 3,  past: 'فَاعَلَ',      present: 'يُفَاعِلُ',     shift: 'do with / toward someone' },
  { n: 4,  past: 'أَفْعَلَ',     present: 'يُفْعِلُ',      shift: 'cause something' },
  { n: 5,  past: 'تَفَعَّلَ',     present: 'يَتَفَعَّلُ',    shift: 'reflexive of II' },
  { n: 6,  past: 'تَفَاعَلَ',     present: 'يَتَفَاعَلُ',    shift: 'mutual / gradual' },
  { n: 7,  past: 'اِنْفَعَلَ',    present: 'يَنْفَعِلُ',     shift: 'passive result' },
  { n: 8,  past: 'اِفْتَعَلَ',    present: 'يَفْتَعِلُ',     shift: 'do for oneself' },
  { n: 9,  past: 'اِفْعَلَّ',     present: 'يَفْعَلُّ',      shift: 'colors & defects' },
  { n: 10, past: 'اِسْتَفْعَلَ',  present: 'يَسْتَفْعِلُ',   shift: 'seek / request' },
];
const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
---

<BaseLayout
  title="Verb Form Generator"
  description={`Explore all ${data.meta.roots} verbal roots of the Quran across the ten Arabic verb forms — real attested verbs with meanings, counts, and verse references.`}
>
  <Container size="md" class="vf-container">
    <header class="vf-header">
      <h1 class="vf-title">Verb Form Generator</h1>
      <p class="vf-intro">
        Pick any of the <strong>{data.meta.roots} verbal roots</strong> used in the
        Quran and see how it moves through the ten verb forms — every word shown is
        a real Quranic verb. Greyed forms are not used in the Quran for that root.
      </p>
    </header>

    <div class="vf-search-wrap">
      <label class="sr-only" for="vf-search">Search roots</label>
      <input id="vf-search" class="vf-search" type="search" autocomplete="off"
        placeholder="Search: نزل · nzl · ‘send down’" />
      <div id="vf-suggestions" class="vf-suggestions" role="listbox" hidden></div>
    </div>

    <div class="vf-chips" aria-label="Most frequent roots">
      {topRoots.map((r: any) => (
        <button class="vf-chip" data-root={r.root}>
          <span lang="ar" dir="rtl">{[...r.root].join(' · ')}</span>
          <span class="vf-chip-count">{r.totalCount}×</span>
        </button>
      ))}
    </div>

    <section id="vf-result" class="vf-result" hidden aria-live="polite"></section>

    <section class="vf-index">
      <h2 class="vf-index-title">All roots</h2>
      {byLetter.map(group => (
        <details class="vf-letter">
          <summary>
            <span lang="ar" dir="rtl" class="vf-letter-ar">{group.letter}</span>
            <span class="vf-letter-count">{group.roots.length} roots</span>
          </summary>
          <div class="vf-letter-roots">
            {group.roots.map((r: any) => (
              <button class="vf-root-link" data-root={r.root} lang="ar" dir="rtl">
                {[...r.root].join('·')}
              </button>
            ))}
          </div>
        </details>
      ))}
      {quadRoots.length > 0 && (
        <details class="vf-letter">
          <summary>
            <span class="vf-letter-ar" lang="ar" dir="rtl">رباعي</span>
            <span class="vf-letter-count">Four-letter roots · {quadRoots.length}</span>
          </summary>
          <div class="vf-letter-roots">
            {quadRoots.map((r: any) => (
              <button class="vf-root-link" data-root={r.root} lang="ar" dir="rtl">
                {[...r.root].join('·')}
              </button>
            ))}
          </div>
        </details>
      )}
    </section>

    <footer class="vf-attribution">
      Morphological data: <a href="https://corpus.quran.com" rel="noopener">Quranic
      Arabic Corpus</a> (Kais Dukes, GNU GPL). English glosses © Quranic Grammar.
    </footer>
  </Container>
</BaseLayout>

<script id="vf-forms-meta" type="application/json" set:html={JSON.stringify({ FORMS, ROMAN })} />

<script>
  const { FORMS, ROMAN } = JSON.parse(
    document.getElementById('vf-forms-meta')?.textContent || '{}');

  // HTML-escape every dataset string before innerHTML insertion.
  const esc = (s: unknown) => String(s ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

  let DATA: any = null;
  async function loadData() {
    if (DATA) return DATA;
    const res = await fetch('/data/verb-forms.json');
    DATA = await res.json();
    return DATA;
  }

  const AR_DIACRITICS = /[ً-ْٰ]/g;
  const normalizeAr = (s: string) =>
    s.replace(AR_DIACRITICS, '').replace(/[أإآٱؤئ]/g, 'ء').replace(/[·\s\-]/g, '');
  const normalizeLatin = (s: string) => s.toLowerCase().replace(/[\s\-'ʼ’]/g, '');

  function findMatches(q: string, roots: any[]) {
    const isArabic = /[؀-ۿ]/.test(q);
    if (isArabic) {
      const nq = normalizeAr(q);
      return roots.filter(r => normalizeAr(r.root).includes(nq));
    }
    const nq = normalizeLatin(q);
    return roots.filter(r =>
      normalizeLatin(r.translit).includes(nq) ||
      Object.values(r.forms).some((list: any) => list.some((e: any) =>
        (e.meaning ?? '').toLowerCase().includes(q.toLowerCase()) ||
        normalizeLatin(e.translit).includes(nq))));
  }

  function entryHtml(e: any) {
    const pair = e.present ? `${esc(e.past)} / ${esc(e.present)}` : esc(e.past);
    const exampleHref = `https://quran.com/${encodeURIComponent(String(e.example).replace(':', '/'))}`;
    return `
      <div class="vf-entry">
        <p class="vf-verb" lang="ar" dir="rtl">${pair}</p>
        <p class="vf-translit">${esc(e.translit)}</p>
        <p class="vf-meaning">${e.meaning === null ? '<em>meaning coming soon</em>' : esc(e.meaning)}</p>
        <p class="vf-meta-line">
          <span class="vf-count">${Number(e.count)}× in the Quran</span>
          <a class="vf-example" href="${exampleHref}" target="_blank" rel="noopener">e.g. ${esc(e.example)}</a>
        </p>
      </div>`;
  }

  function renderRoot(root: any) {
    const el = document.getElementById('vf-result')!;
    const formsUsed = Object.keys(root.forms).length;
    const rows = root.quad
      ? Object.entries(root.forms).map(([f, list]: [string, any]) => `
          <li class="vf-row vf-row-attested">
            <div class="vf-row-head"><span class="vf-badge vf-badge-gold">Q${esc(f)}</span></div>
            <div class="vf-row-body">${list.map(entryHtml).join('')}</div>
          </li>`).join('')
      : FORMS.map((fm: any) => {
          const list = root.forms[String(fm.n)];
          if (!list) return `
            <li class="vf-row vf-row-empty">
              <div class="vf-row-head">
                <span class="vf-badge">${ROMAN[fm.n - 1]}</span>
                <span class="vf-pattern" lang="ar" dir="rtl">${fm.past} / ${fm.present}</span>
              </div>
              <p class="vf-empty-note">not used in the Quran for this root</p>
            </li>`;
          return `
            <li class="vf-row vf-row-attested">
              <div class="vf-row-head">
                <span class="vf-badge vf-badge-gold">${ROMAN[fm.n - 1]}</span>
                <span class="vf-pattern" lang="ar" dir="rtl">${fm.past}</span>
                <span class="vf-shift">${fm.shift}</span>
              </div>
              <div class="vf-row-body">${list.map(entryHtml).join('')}</div>
            </li>`;
        }).join('');
    el.innerHTML = `
      <div class="vf-root-header">
        <p class="vf-root-letters" lang="ar" dir="rtl">${esc([...root.root].join(' · '))}</p>
        <p class="vf-root-stats">${esc(root.translit)} —
          ${root.quad ? 'four-letter root' : `${formsUsed} of 10 forms`} ·
          ${Number(root.totalCount)}× in the Quran</p>
      </div>
      <ol class="vf-grid">${rows}</ol>`;
    el.hidden = false;
    history.replaceState(null, '', `#root=${encodeURIComponent(root.root)}`);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function selectRoot(rootStr: string) {
    const data = await loadData();
    const root = data.roots.find((r: any) => r.root === rootStr);
    if (root) renderRoot(root);
  }

  document.addEventListener('click', (ev) => {
    const btn = (ev.target as HTMLElement).closest('[data-root]') as HTMLElement | null;
    if (btn) selectRoot(btn.dataset.root!);
  });

  const searchEl = document.getElementById('vf-search') as HTMLInputElement;
  const sugEl = document.getElementById('vf-suggestions')!;
  searchEl?.addEventListener('input', async () => {
    const q = searchEl.value.trim();
    if (q.length < 2) { sugEl.hidden = true; return; }
    const data = await loadData();
    const matches = findMatches(q, data.roots).slice(0, 12);
    sugEl.innerHTML = matches.map((r: any) => `
      <button class="vf-sug" role="option" data-root="${esc(r.root)}">
        <span lang="ar" dir="rtl">${esc([...r.root].join(' · '))}</span>
        <span class="vf-sug-tl">${esc(r.translit)}</span>
        <span class="vf-sug-count">${Number(r.totalCount)}×</span>
      </button>`).join('') || `<p class="vf-sug-none">no roots match</p>`;
    sugEl.hidden = false;
  });
  searchEl?.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') (sugEl.querySelector('[data-root]') as HTMLElement)?.click();
    if (ev.key === 'Escape') sugEl.hidden = true;
  });
  document.addEventListener('click', (ev) => {
    if (!(ev.target as HTMLElement).closest('.vf-search-wrap')) sugEl.hidden = true;
  });

  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.get('root')) selectRoot(hash.get('root')!);
</script>

<style>
  .vf-container { padding-block: var(--spacing-2xl) var(--spacing-3xl); }
  .vf-header { text-align: center; margin-block-end: var(--spacing-2xl); }
  .vf-title { font-size: 2.25rem; font-weight: 700; color: var(--color-text-primary);
    letter-spacing: -0.02em; margin-block-end: var(--spacing-md); }
  .vf-intro { font-size: 1.125rem; line-height: 1.6; color: var(--color-text-secondary);
    max-inline-size: 620px; margin-inline: auto; }

  .vf-search-wrap { position: relative; max-inline-size: 480px; margin-inline: auto; }
  .vf-search { inline-size: 100%; padding: var(--spacing-sm) var(--spacing-md);
    font-size: 1.125rem; font-family: inherit;
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary); border-radius: var(--radius-md);
    color: var(--color-text-primary); }
  .vf-search:focus { outline: 2px solid var(--color-border-focus); outline-offset: 1px; }
  .vf-suggestions { position: absolute; inset-inline: 0; top: calc(100% + 4px);
    background: var(--color-background-elevated);
    border: 1px solid var(--color-border-primary); border-radius: var(--radius-md);
    box-shadow: 0 12px 32px rgb(0 0 0 / 0.25); z-index: 20; overflow: hidden; }
  .vf-sug { display: flex; align-items: center; gap: var(--spacing-sm);
    inline-size: 100%; padding: var(--spacing-sm) var(--spacing-md);
    background: none; border: 0; cursor: pointer; font-family: inherit;
    color: var(--color-text-primary); font-size: 1rem; }
  .vf-sug:hover, .vf-sug:focus-visible { background: var(--color-background-tertiary); }
  .vf-sug [lang="ar"] { font-family: var(--font-arabic); font-size: 1.25rem; }
  .vf-sug-tl { color: var(--color-text-secondary); }
  .vf-sug-count { margin-inline-start: auto; color: var(--color-text-tertiary); font-size: 0.85rem; }
  .vf-sug-none { padding: var(--spacing-sm) var(--spacing-md);
    color: var(--color-text-tertiary); margin: 0; }

  .vf-chips { display: flex; flex-wrap: wrap; gap: var(--spacing-xs);
    justify-content: center; margin-block: var(--spacing-lg) var(--spacing-2xl); }
  .vf-chip { display: inline-flex; align-items: baseline; gap: 0.4em;
    padding: 0.35em 0.8em; background: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary); border-radius: var(--radius-full);
    cursor: pointer; color: var(--color-text-primary); font-family: var(--font-arabic);
    font-size: 1.05rem; transition: border-color 150ms ease, background 150ms ease; }
  .vf-chip:hover { border-color: var(--accent-gold); background: var(--color-background-tertiary); }
  .vf-chip-count { font-family: var(--font-sans); font-size: 0.75rem;
    color: var(--color-text-tertiary); }

  .vf-result { margin-block-end: var(--spacing-3xl); scroll-margin-top: 90px; }
  .vf-root-header { text-align: center; margin-block-end: var(--spacing-xl); }
  .vf-root-letters { font-family: var(--font-arabic); font-size: 2.5rem;
    color: var(--color-text-primary); margin: 0 0 var(--spacing-xs); }
  .vf-root-stats { color: var(--color-text-secondary); margin: 0; }

  .vf-grid { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--spacing-sm); }
  .vf-row { border: 1px solid var(--color-border-primary); border-radius: var(--radius-md);
    padding: var(--spacing-md); background: var(--color-background-secondary); }
  .vf-row-empty { opacity: 0.55; background: transparent; }
  .vf-row-head { display: flex; align-items: center; gap: var(--spacing-sm); flex-wrap: wrap; }
  .vf-badge { display: inline-grid; place-items: center; min-inline-size: 2.4em;
    padding: 0.15em 0.5em; border-radius: var(--radius-sm); font-size: 0.85rem;
    font-weight: 700; letter-spacing: 0.06em;
    background: var(--color-background-tertiary); color: var(--color-text-secondary); }
  .vf-badge-gold { background: color-mix(in oklab, var(--accent-gold) 18%, transparent);
    color: var(--accent-gold); }
  .vf-pattern { font-family: var(--font-arabic); font-size: 1.15rem;
    color: var(--color-text-tertiary); }
  .vf-shift { margin-inline-start: auto; font-size: 0.85rem;
    color: var(--color-text-tertiary); font-style: italic; }
  .vf-empty-note { margin: var(--spacing-xs) 0 0; font-size: 0.9rem;
    color: var(--color-text-tertiary); }

  .vf-entry { margin-block-start: var(--spacing-sm); }
  .vf-entry + .vf-entry { border-block-start: 1px dashed var(--color-border-secondary);
    padding-block-start: var(--spacing-sm); }
  .vf-verb { font-family: var(--font-arabic); font-size: 1.9rem; line-height: 1.9;
    color: var(--color-text-primary); margin: 0; }
  .vf-translit { color: var(--color-text-secondary); font-style: italic;
    margin: 0 0 var(--spacing-xs); }
  .vf-meaning { color: var(--color-text-primary); font-size: 1.05rem; margin: 0; }
  .vf-meta-line { display: flex; gap: var(--spacing-md); align-items: baseline;
    margin: var(--spacing-xs) 0 0; font-size: 0.85rem; }
  .vf-count { color: var(--color-text-tertiary); }
  .vf-example { color: var(--accent-gold); text-decoration: none; }
  .vf-example:hover { text-decoration: underline; }

  .vf-index-title { font-size: 1.35rem; color: var(--color-text-primary);
    margin-block-end: var(--spacing-md); }
  .vf-letter { border-block-end: 1px solid var(--color-border-secondary); }
  .vf-letter summary { display: flex; align-items: baseline; gap: var(--spacing-md);
    padding: var(--spacing-sm) 0; cursor: pointer; list-style: none; }
  .vf-letter summary::-webkit-details-marker { display: none; }
  .vf-letter-ar { font-family: var(--font-arabic); font-size: 1.5rem;
    color: var(--color-text-primary); }
  .vf-letter-count { color: var(--color-text-tertiary); font-size: 0.9rem; }
  .vf-letter-roots { display: flex; flex-wrap: wrap; gap: var(--spacing-xs);
    padding-block: 0 var(--spacing-md); }
  .vf-root-link { font-family: var(--font-arabic); font-size: 1.1rem; cursor: pointer;
    background: none; border: 1px solid transparent; border-radius: var(--radius-sm);
    padding: 0.15em 0.45em; color: var(--color-text-secondary); }
  .vf-root-link:hover { color: var(--color-text-primary);
    border-color: var(--color-border-primary); }

  .vf-attribution { margin-block-start: var(--spacing-3xl); text-align: center;
    font-size: 0.85rem; color: var(--color-text-tertiary); }
  .vf-attribution a { color: inherit; }

  .sr-only { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden;
    clip-path: inset(50%); white-space: nowrap; }

  @media (max-width: 640px) {
    .vf-title { font-size: 1.85rem; }
    .vf-shift { margin-inline-start: 0; inline-size: 100%; }
    .vf-verb { font-size: 1.6rem; }
  }
</style>
```

- [ ] **Step 2: Build check:** `npm run dev` (or `npm run build`) and open `/resources/verb-forms/`. Verify: page renders, chips work, searching `نزل`, `nzl`, and `send down` all surface the root, grid shows attested gold rows + greyed rows, hash deep-link `#root=نزل` restores on reload.
- [ ] **Step 3: Commit** — `git add src/pages/resources/verb-forms/index.astro && git commit -m "feat(verb-forms): interactive generator page"`

---

### Task 12: Resources index card

**Files:**
- Modify: `src/pages/resources/index.astro`

- [ ] **Step 1: Add a hand-placed tool card.** In `src/pages/resources/index.astro`, inside `<CardGrid>` BEFORE the `{sorted.map(…)}` expression, insert:

```astro
      <ResourceCard
        title="Verb Form Generator"
        description="Pick any Quranic root and watch it move through the ten verb forms — real attested verbs with meanings, counts, and verse references."
        href="/resources/verb-forms/"
        data-testid="resource-verb-forms"
      >
        <Fragment slot="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 3v18" stroke-linecap="round"/>
            <path d="M5 8c2.5-3 4.5-3 7 0s4.5 3 7 0" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 16c2.5-3 4.5-3 7 0s4.5 3 7 0" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </Fragment>
      </ResourceCard>
```

- [ ] **Step 2: Verify** the card renders on `/resources/` and navigates.
- [ ] **Step 3: Commit** — `git add src/pages/resources/index.astro && git commit -m "feat(verb-forms): resources index card"`

---

### Task 13: E2E test + full verification

**Files:**
- Create: `tests/verb-forms.spec.ts`

- [ ] **Step 1: Write the Playwright spec** (mirror config/style of `tests/accessibility.spec.ts`):

```typescript
import { test, expect } from '@playwright/test';

test.describe('Verb Form Generator', () => {
  test('search + grid render real corpus data', async ({ page }) => {
    await page.goto('/resources/verb-forms/');
    await page.fill('#vf-search', 'نزل');
    await page.click('.vf-sug');
    const result = page.locator('#vf-result');
    await expect(result).toBeVisible();
    await expect(result.locator('.vf-row')).toHaveCount(10);
    await expect(result.locator('.vf-row-attested .vf-verb').first()).toContainText('نَزَ');
    await expect(result.locator('.vf-row-empty').first()).toContainText('not used in the Quran');
    await expect(result.locator('.vf-count').first()).toContainText('× in the Quran');
  });

  test('latin transliteration search and deep link', async ({ page }) => {
    await page.goto('/resources/verb-forms/');
    await page.fill('#vf-search', 'ghfr');
    await page.click('.vf-sug');
    await expect(page).toHaveURL(/#root=/);
    await page.reload();
    await expect(page.locator('#vf-result')).toBeVisible();
  });

  test('quick chips work without search', async ({ page }) => {
    await page.goto('/resources/verb-forms/');
    await page.click('.vf-chip >> nth=0');
    await expect(page.locator('#vf-result .vf-row-attested').first()).toBeVisible();
  });
});
```

- [ ] **Step 2: Run:** `npx playwright test tests/verb-forms.spec.ts` — Expected: PASS (against dev/preview server per existing playwright config; check `playwright.config.ts` for the webServer setting and match how existing specs run).
- [ ] **Step 3: Full verification suite (verification-before-completion skill):**

```bash
npm run test:verbs && npm run validate:verbs && npm run build && npx playwright test tests/verb-forms.spec.ts tests/accessibility.spec.ts
```

All green. Run the `web-design-guidelines` audit on the new page code and fix findings.
- [ ] **Step 4: Commit** — `git add tests/verb-forms.spec.ts && git commit -m "test(verb-forms): e2e coverage for generator page"`

---

## Execution order & parallelism

Sequential: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9. Then Task 11/12 (UI) may interleave with Task 10 waves (dataset with partial glosses renders "meaning coming soon"). Task 13 last. Ship gate: Task 10 Step 4 (zero missing glosses) + Task 13 all green.

## Verification checklist (ship gate)

- [ ] `npm run test:verbs` — unit tests pass
- [ ] `npm run validate:verbs` — 0 failures, 0 missing glosses
- [ ] `npm run build` — clean
- [ ] Playwright: verb-forms + accessibility specs pass
- [ ] Manual: نزل ، قول ، كتب ، زلزل render correctly; attribution visible
- [ ] web-design-guidelines audit run on the page
