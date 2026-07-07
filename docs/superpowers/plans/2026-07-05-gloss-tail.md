# Gloss Tail Implementation Plan (Workstream C — data only)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gloss the remaining ~3,376 non-verb lemmas plus ~187 lemmaless (surface-level) particles so English meaning search covers every glossable entry in `word-lookup.json`, staying under the 800 KB gzip gate.

**Architecture:** Reuse the shipped batch pipeline: `build-noun-gloss-batches.ts` emits input batches → subagent waves write output batches → `validate-noun-glosses.ts` gates each → `build-word-lookup.ts` joins and rebuilds. Two small extensions: a numbering `--offset` (so reruns don't overwrite committed batches 01–06) and a `--surface-pass` mode + surface-keyed join for lemmaless particles (muqatta'at excluded).

**Tech Stack:** tsx scripts, node:test, delegated subagents (cheap model) for batch curation.

**Spec:** `docs/superpowers/specs/2026-07-05-english-first-lookup-redesign-design.md` (Workstream C)
**Branch:** `feat/gloss-tail` — create from `main`: `git checkout main && git checkout -b feat/gloss-tail`
**Independent of** `feat/lookup-english-first` (no shared files: this branch touches `scripts/`, `scripts/lib/word-index.*`, `src/data/`, `public/data/`, `docs/`).

---

### Task 1: Extractor — `--offset` numbering + `--surface-pass` mode

**Files:**
- Modify: `scripts/build-noun-gloss-batches.ts`

- [ ] **Step 1: Implement both flags**

Replace the flag block (lines 14–20) with:

```ts
const args = process.argv.slice(2);
const flag = (name: string, dflt: number) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : dflt;
};
const TOP = flag('top', 305);
const PER_BATCH = flag('per-batch', 55);
const OFFSET = flag('offset', 0);          // continue numbering after committed batches
const SURFACE_PASS = args.includes('--surface-pass');
```

Replace the collection loop (lines 27–42) with a mode-aware version:

```ts
interface SurfaceEntry {
  surface: string; pos: string; feat: string; translit: string;
  count: number; refs: string[];
}

const index = JSON.parse(readFileSync(INDEX, 'utf8'));

if (SURFACE_PASS) {
  // Lemmaless analyses can't be keyed lemma|pos (see header comment).
  // Keyed by the VERBATIM vocalized surface + pos instead. Muqatta'at (INL)
  // are deliberately unglossable — excluded (spec: out of scope).
  const byKey = new Map<string, SurfaceEntry>();
  for (const list of Object.values<any[]>(index.words)) {
    for (const a of list) {
      if (a[4] === 'V' || a[9] !== null || a[3] || a[4] === 'INL') continue;
      const key = `${a[0]}|${a[4]}`;
      let e = byKey.get(key);
      if (!e) {
        e = { surface: a[0], pos: a[4], feat: a[6], translit: a[1], count: 0, refs: [] };
        byKey.set(key, e);
      }
      e.count += a[10];
      for (const r of a[11]) if (e.refs.length < 2 && !e.refs.includes(r)) e.refs.push(r);
    }
  }
  const sorted = [...byKey.values()].sort((a, b) => b.count - a.count);
  mkdirSync(OUT_DIR, { recursive: true });
  let batchNo = 0;
  for (let i = 0; i < sorted.length; i += PER_BATCH) {
    batchNo++;
    const nn = `s${String(batchNo).padStart(2, '0')}`;
    writeFileSync(`${OUT_DIR}/batch-${nn}.input.json`,
      JSON.stringify({ batch: `batch-${nn}`, entries: sorted.slice(i, i + PER_BATCH) }, null, 1));
  }
  console.log(`lemmaless glossless analyses: ${sorted.length} → ${batchNo} surface batches`);
  process.exit(0);
}
```

(The existing lemma-keyed collection code stays below, unchanged, and runs when `--surface-pass` is absent.)

In the lemma-path batch writer (lines 50–56), apply the offset:

```ts
let batchNo = OFFSET;
for (let i = 0; i < picked.length; i += PER_BATCH) {
  batchNo++;
  const nn = String(batchNo).padStart(2, '0');
  writeFileSync(`${OUT_DIR}/batch-${nn}.input.json`,
    JSON.stringify({ batch: `batch-${nn}`, entries: picked.slice(i, i + PER_BATCH) }, null, 1));
}
```
Also update the header usage comment (line 5) to `[--top 305] [--per-batch 55] [--offset 0] [--surface-pass]`.

- [ ] **Step 2: Sanity-run both modes (writes inputs; nothing consumed yet)**

Run: `npx tsx scripts/build-noun-gloss-batches.ts --top 9999 --offset 6`
Expected output: `glossless non-verb lemmas: ~3376 …` and `picked top 3376 → 62 batches of ≤55` (first new file `batch-07.input.json`; `git status` must show batch-01…06 inputs UNTOUCHED).

Run: `npx tsx scripts/build-noun-gloss-batches.ts --surface-pass`
Expected output: `lemmaless glossless analyses: ~187 → 4 surface batches` (files `batch-s01…s04.input.json`).

If the real counts differ from ~3376/~187, trust the script output — the memory numbers are estimates.

- [ ] **Step 3: Commit (scripts + generated inputs)**

```bash
git add scripts/build-noun-gloss-batches.ts src/data/morphology/glosses-nouns/input
git commit -m "feat(glosses): batch extractor offset + surface-pass for lemmaless particles"
```

---

### Task 2: Validator — accept surface-keyed batches

**Files:**
- Modify: `scripts/validate-noun-glosses.ts`

- [ ] **Step 1: Key on lemma OR surface; include `batch-sNN` files**

In `validateBatch` replace the two key-building lines (lines 24 and 28):

```ts
  const keyOf = (x: any) => `${x.lemma ?? x.surface}|${x.pos}`;
  // …
  for (const e of input.entries) expect.add(keyOf(e));
  // …
    const key = keyOf(g);
```

In the `--all-batches` branch (lines 46–49), widen the filename filter and id capture:

```ts
  const outs = readdirSync('src/data/morphology/glosses-nouns/output')
    .filter(f => /^batch-s?\d+\.json$/.test(f))
    .map(f => f.match(/^batch-(s?\d+)\.json$/)![1])
    .sort();
```

- [ ] **Step 2: Verify against the six existing batches (regression)**

Run: `npx tsx scripts/validate-noun-glosses.ts --all-batches`
Expected: `batch-01…06: 55/55 … OK` lines ending `all good` (no failures — proves the keying change is backward-compatible).

- [ ] **Step 3: Commit**

```bash
git add scripts/validate-noun-glosses.ts
git commit -m "feat(glosses): validate surface-keyed particle batches"
```

---

### Task 3: Join — surface glosses into the index (TDD)

**Files:**
- Modify: `scripts/lib/word-index.ts`
- Modify: `scripts/lib/word-index.test.ts`
- Modify: `scripts/build-word-lookup.ts`

- [ ] **Step 1: Write the failing tests (append to `scripts/lib/word-index.test.ts`)**

The file already contains corpus-row fixtures (see the INL fixture around lines 34 and 103–111 for the format — reuse its helpers/constants). Append:

```ts
test('buildSurfaceGlossMap keys surface|pos, NFC-normalized', () => {
  const map = buildSurfaceGlossMap([
    { batch: 'batch-s01', glosses: [{ surface: 'وَيْكَأَنَّ', pos: 'INT', meaning: 'ah, as if' }] },
  ] as any);
  assert.equal(map.get('وَيْكَأَنَّ'.normalize('NFC') + '|INT'), 'ah, as if');
});
test('buildIndex: surface gloss fills lemmaless non-INL analyses only', () => {
  // Setup: copy the corpus-row fixture from the existing INL test (lines
  // ~103–111) VERBATIM — same parseCorpusRows input — and add one lemmaless
  // non-INL row from this file's existing fixture rows (any row whose stem
  // has no LEM: feature and POS !== INL; grep "POS:" in the fixtures above).
  // Then, with `inl` = the built INL analysis and `prt` = the built
  // lemmaless-particle analysis:
  const surfaceMap = new Map([
    [`${inl[0].normalize('NFC')}|INL`, 'SHOULD NEVER JOIN'],
    [`${prt[0].normalize('NFC')}|${prt[4]}`, 'test gloss'],
  ]);
  // …rebuild the index passing surfaceMap as buildIndex's 4th argument…
  assert.equal(inlRebuilt[9], null);        // INL immune even when mapped
  assert.equal(prtRebuilt[9], 'test gloss'); // lemmaless particle glossed
});
```
The fixture rows and the `parseCorpusRows`/`buildIndex` call pattern must be copied from the existing tests in this file — do not invent new corpus rows (repo rule: no fabricated corpus data, and hand-written Buckwalter rows are easy to get wrong).

Run: `npx tsx --test scripts/lib/word-index.test.ts`
Expected: FAIL — `buildSurfaceGlossMap` not exported.

- [ ] **Step 2: Implement**

In `scripts/lib/word-index.ts`:

a. After `buildNounGlossMap` (line 57) add:

```ts
// Lemmaless particles are curated per vocalized surface (batch-sNN files):
// keyed surface|pos. INL (muqatta'at) is never glossed — spec: out of scope.
export interface SurfaceGlossBatch {
  batch: string;
  glosses: { surface: string; pos: string; meaning: string }[];
}
export function buildSurfaceGlossMap(batches: SurfaceGlossBatch[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const b of batches)
    for (const g of b.glosses)
      if (g.meaning)
        map.set(`${g.surface.normalize('NFC')}|${g.pos}`, g.meaning.normalize('NFC'));
  return map;
}
```

b. Extend `buildIndex` (line 65) with a fourth parameter and the fallback. Signature:

```ts
export function buildIndex(
  words: WordOccurrence[], verbForms: VerbFormsData,
  nounGlosses: Map<string, string> = new Map(),
  surfaceGlosses: Map<string, string> = new Map(),
): LookupIndex {
```

Inside the stems loop, right after `const a = analysisFieldsForStem(stem, glosses, nounGlosses);` (line 77) insert:

```ts
      if (a.gloss === null && !a.lemma && a.pos !== 'INL') {
        a.gloss = surfaceGlosses.get(`${surfaceAr.normalize('NFC')}|${a.pos}`) ?? null;
      }
```

c. In `scripts/build-word-lookup.ts`, partition batches by filename and pass the new map. Replace the batch-loading block (lines 17–20) with:

```ts
const batchFiles = readdirSync(NOUN_GLOSSES_DIR)
  .filter(f => /^batch-s?\d+\.json$/.test(f)).sort();
const load = (f: string) => JSON.parse(readFileSync(`${NOUN_GLOSSES_DIR}/${f}`, 'utf8'));
const nounGlosses = buildNounGlossMap(
  batchFiles.filter(f => !f.startsWith('batch-s')).map(load));
const surfaceGlosses = buildSurfaceGlossMap(
  batchFiles.filter(f => f.startsWith('batch-s')).map(load));
```
Update the `buildIndex` call (line 23) to pass `surfaceGlosses` as the 4th argument, import `buildSurfaceGlossMap` alongside `buildNounGlossMap`, and extend the summary log (line 33) with `surface-glosses=${surfaceGlosses.size}`.

- [ ] **Step 3: Verify**

Run: `npx tsx --test scripts/lib/word-index.test.ts` → PASS (new + all existing).
Run: `npm run lookup:build` → succeeds; log shows `surface-glosses=0` (no output batches yet); gzip unchanged (~716 KB); `git checkout public/data/word-lookup.json` afterwards to discard the no-op rebuild artifact.

- [ ] **Step 4: Commit**

```bash
git add scripts/lib/word-index.ts scripts/lib/word-index.test.ts scripts/build-word-lookup.ts
git commit -m "feat(glosses): surface-keyed gloss join for lemmaless particles"
```

---

### Task 4: Noun-gloss batch prompt document

**Files:**
- Create: `docs/superpowers/plans/noun-gloss-batch-prompt.md`

- [ ] **Step 1: Write the prompt** (modeled on `verb-gloss-batch-prompt.md`; the register rules mirror `validate-noun-glosses.ts` — regex `^[a-zA-Z0-9(),;:''\- ]{2,90}$`):

````markdown
# Noun/particle gloss batch task

You are curating English glosses for Quranic vocabulary on a Quranic Arabic
learning site. The input JSON batch (path given below) contains non-verb
entries extracted from the Quranic Arabic Corpus, each with lemma (or
vocalized surface), POS tag, root, occurrence count, and sample
surfaces/verse refs.

For EVERY entry produce an output object copying the join keys VERBATIM:

- lemma-keyed batches (`batch-NN`): `{ "lemma": "<verbatim>", "pos": "<verbatim>", "meaning": "…" }`
- surface-keyed batches (`batch-sNN`): `{ "surface": "<verbatim>", "pos": "<verbatim>", "meaning": "…" }`

Rules — violations fail validation:

1. `meaning`: 1–6 words per sense, up to three senses comma-separated,
   ≤90 characters total. ASCII letters/digits/`(),;:'- ` only — NO Arabic
   script, NO trailing period, NO markdown.
2. Register by POS: nouns → bare noun gloss ("name", "mercy", "day of
   judgment"); adjectives → adjective ("merciful, compassionate"); proper
   nouns → capitalized name ("Allah, God", "Moses"); particles/prepositions/
   conjunctions → function gloss, parenthetical qualifier allowed
   ("indeed, truly", "O (vocative)", "from, of, out of").
3. Gloss the QURANIC sense(s) — the dominant usage in the Quran, not rare
   classical senses. Use the sample surfaces + verse refs to disambiguate.
4. Surface-keyed entries (`batch-sNN`): gloss the function of that EXACT
   vocalized form (they are function words — vocatives, interjections,
   compound particles).
5. NEVER drop or invent entries: output count must equal input count.
6. English words in glosses should be findable search terms — prefer common
   vocabulary ("mercy") over rarefied synonyms ("clemency") for the primary
   sense.

Write your output with the Write tool to
`src/data/morphology/glosses-nouns/output/<batch>.json` (the `<batch>` name
is in the input's `batch` field) as ONLY this JSON document, no prose, no
markdown fence, valid JSON:

```json
{ "batch": "batch-NN", "glosses": [ … one object per input entry … ] }
```

Your final message: one line — the batch name, entry count written, and any
entries you were uncertain about (lemma|pos keys), or "none uncertain".
````

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/plans/noun-gloss-batch-prompt.md
git commit -m "docs(glosses): noun/particle batch curation prompt"
```

---

### Task 5: Curation waves (repeat until batches 07–68 + s01–s04 are done)

Per the user's standing orchestration preference: subagents on a cheap model do the batch work; the orchestrator validates every batch.

- [ ] **Step 1: Dispatch a wave** — 6 batches per wave, parallel Agent calls (`model: sonnet` — NOT haiku; gloss accuracy needs it), each with this prompt (substitute NN):

> Read `/Users/daodilyas/quran-learn/docs/superpowers/plans/noun-gloss-batch-prompt.md` and follow it exactly for the input batch `/Users/daodilyas/quran-learn/src/data/morphology/glosses-nouns/input/batch-NN.input.json`.

- [ ] **Step 2: Gate each batch** — for every batch in the wave:
  1. `npx tsx scripts/validate-noun-glosses.ts --batch NN` → must print `OK`. On FAIL: fix mechanically if trivial (e.g. stray period), else re-dispatch that batch with the failure appended to the prompt.
  2. Spot-check ≥6 entries (top-frequency first): open the output, judge gloss accuracy against the lemma/surface + samples. Reject the batch on any WRONG meaning (not style) and re-dispatch with a correction note; wrong glosses poison English search silently.
  3. Record uncertain-flagged keys; resolve them yourself before accepting.

- [ ] **Step 3: Commit the wave**

```bash
git add src/data/morphology/glosses-nouns
git commit -m "data(glosses): noun tail batches NN-MM"
```

- [ ] **Step 4:** Repeat (≈11 waves: 62 lemma batches + 4 surface batches).

---

### Task 6: Rebuild, verify, ship

- [ ] **Step 1:** `npx tsx scripts/validate-noun-glosses.ts --all-batches` → `all good` across 01–68 + s01–s04.
- [ ] **Step 2:** `npm run lookup:build` → log must show `noun-glosses=~3681 lemmas`, `surface-glosses=~187`, `…still pending` near 0, and `gzip=` UNDER 800 KB (spec estimate ≤ ~741 KB). If the gate trips, stop and surface it — letter-sharding is the spec'd fallback, a separate decision.
- [ ] **Step 3:** `npm run validate:lookup` → PASS. `npm run test:lookup` → PASS.
- [ ] **Step 4:** `npm run build` then `npx playwright test tests/word-lookup.spec.ts tests/verb-forms.spec.ts` → PASS (cold-cache rebuild `rm -rf node_modules/.astro .astro dist` if the known stale-cache error appears).
- [ ] **Step 5:** Manual smoke: dev server → search "indeed" (particle, from surface pass), "mercy", and one tail-lemma gloss from batch-40 — all should return meaning matches.
- [ ] **Step 6: Commit artifact + PR**

```bash
git add public/data/word-lookup.json
git commit -m "data(lookup): rebuild index with full noun/particle gloss coverage"
git push -u origin feat/gloss-tail
gh pr create --title "data: complete english gloss coverage (noun tail + particles)" \
  --body "Implements workstream C of docs/superpowers/specs/2026-07-05-english-first-lookup-redesign-design.md. ~3,376 tail lemmas + surface-level particle glosses, per-batch validation, gzip gate green."
```

- [ ] **Step 7:** Update auto-memory: the `verb-form-generator-project` memory's NEXT-step note is now done — rewrite it to reflect shipped coverage.

---

## Plan self-review notes (already applied)

- Spec coverage: extractor rerun + auto-skip (Task 1, `--top 9999`), no-overwrite numbering (Task 1 `--offset` — a gap the spec didn't call out, caught during planning), surface pass excl. INL (Tasks 1–3), prompt + register (Task 4, regex-aligned with the validator), waves + gates (Task 5), 800 KB hard gate + fallback pointer (Task 6).
- Type consistency: `SurfaceGlossBatch.glosses[].surface/pos/meaning` shape identical across extractor output (Task 1), prompt (Task 4), validator keying (Task 2), and `buildSurfaceGlossMap` (Task 3). Batch filename convention `batch-sNN` consistent in all four.
- Deliberate scope cuts: no README/docs beyond the prompt; no new npm scripts (existing `validate:*`/`lookup:build` cover it).
