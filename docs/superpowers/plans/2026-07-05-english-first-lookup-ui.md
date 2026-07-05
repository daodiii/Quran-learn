# English-First Lookup UI Implementation Plan (Workstreams A + B)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make English/transliteration search visible and legible in both lookup tools (chips, meaning echo with highlight, stemmed matching) and restructure the Arabic display onto aligned grids with a 1.25rem vocalized-Arabic type floor.

**Architecture:** A new pure module `src/lib/latin-match.ts` (tokenize + light stem + tiered gloss matching) is consumed by `src/lib/lookup-search.ts` and a new `src/lib/verb-search.ts` (the verb page's inline matcher extracted). The two page files then change markup/CSS only: suggestion rows echo meanings, cards/rows become column grids. No data-file changes; payload unchanged.

**Tech Stack:** Astro pages with vanilla-TS island scripts (`h()` DOM builder, no innerHTML), node:test + tsx for unit tests, Playwright for e2e.

**Spec:** `docs/superpowers/specs/2026-07-05-english-first-lookup-redesign-design.md`
**Branch:** `feat/lookup-english-first` (already exists; spec committed). Companion data plan: `2026-07-05-gloss-tail.md` (independent branch).

**Verification commands** (used throughout):
- Unit: `npm run test:lookup`
- E2E: `npx playwright test tests/word-lookup.spec.ts tests/verb-forms.spec.ts`
- Full e2e (before PR): `npx playwright test`
- NEVER run `npx astro check` (it auto-installs typescript and dirties package.json — known repo gotcha).

---

### Task 1: `latin-match.ts` — stemmer

**Files:**
- Create: `src/lib/latin-match.ts`
- Create: `src/lib/latin-match.test.ts`
- Modify: `package.json` (add test file to `test:lookup`)

- [ ] **Step 1: Write the failing stemmer tests**

Create `src/lib/latin-match.test.ts`:

```ts
// src/lib/latin-match.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stem } from './latin-match.ts';

// The invariant that matters: query-form and gloss-form REDUCE TO THE SAME
// STEM. Absolute stem strings are internal; equality is the contract.
const EQUAL: [string, string][] = [
  ['believed', 'believe'], ['believes', 'believe'], ['believing', 'believe'],
  ['believers', 'believer'], ['merciful', 'mercy'], ['mercies', 'mercy'],
  ['sent', 'send'], ['sending', 'send'], ['gave', 'give'], ['made', 'make'],
  ['took', 'take'], ['sought', 'seek'], ['brought', 'bring'], ['said', 'say'],
  ['families', 'family'], ['stopped', 'stop'], ['stages', 'stage'],
  ['boxes', 'box'], ['guides', 'guide'], ['guided', 'guide'],
];
for (const [a, b] of EQUAL) {
  test(`stem: ${a} ≡ ${b}`, () => assert.equal(stem(a), stem(b)));
}

const NOT_EQUAL: [string, string][] = [
  ['guidance', 'guide'],   // documented limitation: -ance not stripped
  ['mercy', 'merciless'],  // -less not stripped
  ['sun', 'send'],
];
for (const [a, b] of NOT_EQUAL) {
  test(`stem: ${a} ≢ ${b}`, () => assert.notEqual(stem(a), stem(b)));
}

test('stem: short words survive un-mangled', () => {
  assert.equal(stem('go'), 'go');
  assert.equal(stem('is'), 'is');
  // -ss is not plural-stripped; the final double-s collapses to one.
  assert.equal(stem('bless'), 'bles');
});

test('stem: object-prototype property names are not irregulars', () => {
  assert.equal(stem('constructor'), 'constructor');
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx tsx --test src/lib/latin-match.test.ts`
Expected: FAIL — `Cannot find module './latin-match.ts'`

- [ ] **Step 3: Implement the stemmer**

Create `src/lib/latin-match.ts`:

```ts
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
// ies/ied → y, plural -es/-s, one suffix, trailing i → y,
// trailing e strip, doubled-final-letter collapse.
export function stem(word: string): string {
  let w = word.toLowerCase();
  // Irregulars REJOIN the pipeline (no early return): the canonical form must
  // reduce exactly like a directly-stemmed query ('gave'→'give'→'giv' ≡ 'give'→'giv').
  // hasOwn guard: bare index would hit Object.prototype ('constructor' etc.).
  const irr = Object.hasOwn(IRREGULAR, w) ? IRREGULAR[w] : undefined;
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
```

- [ ] **Step 4: Run to verify pass**

Run: `npx tsx --test src/lib/latin-match.test.ts`
Expected: PASS (all tests)

- [ ] **Step 5: Register the test file**

In `package.json`, change the `test:lookup` script value: after `src/lib/arabic-normalize.test.ts ` insert `src/lib/latin-match.test.ts ` (space-separated list, keep the rest verbatim).

Run: `npm run test:lookup`
Expected: PASS (existing 72 + new)

- [ ] **Step 6: Commit**

```bash
git add src/lib/latin-match.ts src/lib/latin-match.test.ts package.json
git commit -m "feat(lookup): light english stemmer for meaning search"
```

---

### Task 2: `latin-match.ts` — tokenized, tiered gloss matching

**Files:**
- Modify: `src/lib/latin-match.ts` (append)
- Modify: `src/lib/latin-match.test.ts` (append)

- [ ] **Step 1: Write the failing matcher tests (append to the test file)**

```ts
import { prepareGloss, prepareQuery, matchGloss } from './latin-match.ts';

const g = (s: string) => prepareGloss(s);
const q = (s: string) => prepareQuery(s);

test('match: whole-word is tier 1 with the token range', () => {
  const m = matchGloss(q('believe'), g('to believe'))!;
  assert.equal(m.tier, 1);
  assert.deepEqual(m.ranges, [[3, 10]]);
});
test('match: stem equality is tier 1 (believed → believe)', () => {
  assert.equal(matchGloss(q('believed'), g('to believe'))!.tier, 1);
});
test('match: prefix is tier 2 (bel → believe)', () => {
  assert.equal(matchGloss(q('bel'), g('to believe'))!.tier, 2);
});
test('match: substring is tier 3 (eliev → believe)', () => {
  const m = matchGloss(q('eliev'), g('to believe'))!;
  assert.equal(m.tier, 3);
  assert.deepEqual(m.ranges, [[4, 9]]); // 'to believe'.slice(4,9) === 'eliev'
});
test('match: multi-word requires every token; adjacent ranges merge', () => {
  const m = matchGloss(q('send down'), g('to send down gradually'))!;
  assert.equal(m.tier, 1);
  assert.deepEqual(m.ranges, [[3, 12]]); // "send down" as one merged range
  assert.equal(matchGloss(q('send up'), g('to send down gradually')), null);
});
test('match: worst token tier wins (send + gradu → tier 2)', () => {
  assert.equal(matchGloss(q('send gradu'), g('to send down gradually'))!.tier, 2);
});
test('match: 2-char tokens are exact-only', () => {
  assert.equal(matchGloss(q('go'), g('to go astray'))!.tier, 1);
  assert.equal(matchGloss(q('gr'), g('to send down gradually')), null); // no prefix at 2 chars
});
test('match: 1-char and empty queries never match', () => {
  assert.equal(matchGloss(q('a'), g('a name')), null);
  assert.equal(matchGloss(q('  ·'), g('a name')), null);
});
test('match: irregular verb reaches the gloss (sent → send)', () => {
  assert.equal(matchGloss(q('sent'), g('to send down, reveal'))!.tier, 1);
});
test('match: ranges index into RAW for mixed-case glosses', () => {
  const m = matchGloss(q('god'), g('Allah, God'))!;
  assert.deepEqual(m.ranges, [[7, 10]]); // 'Allah, God'.slice(7,10) === 'God'
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx tsx --test src/lib/latin-match.test.ts`
Expected: FAIL — `prepareGloss` is not exported

- [ ] **Step 3: Implement matcher (append to `latin-match.ts`)**

```ts
export interface GlossToken { text: string; stem: string; start: number; end: number }
export interface PreparedGloss { raw: string; lower: string; tokens: GlossToken[] }
export interface QueryToken { text: string; stem: string }
export interface GlossMatch { tier: 1 | 2 | 3; ranges: [number, number][] }

const WORD_RE = /[a-z0-9']+/g;

export function prepareGloss(raw: string): PreparedGloss {
  const lower = raw.toLowerCase();
  const tokens: GlossToken[] = [];
  for (const m of lower.matchAll(WORD_RE))
    tokens.push({ text: m[0], stem: stem(m[0]), start: m.index!, end: m.index! + m[0].length });
  return { raw, lower, tokens };
}

// 1-char tokens are noise ("a", "o") — dropped here so they can never match.
export function prepareQuery(rawQuery: string): QueryToken[] {
  const out: QueryToken[] = [];
  for (const m of rawQuery.toLowerCase().matchAll(WORD_RE))
    if (m[0].length >= 2) out.push({ text: m[0], stem: stem(m[0]) });
  return out;
}

function mergeRanges(ranges: [number, number][]): [number, number][] {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    // gap ≤1 (space, hyphen, any single separator) — mark adjacent words as one
    if (last && r[0] <= last[1] + 1) last[1] = Math.max(last[1], r[1]);
    else out.push([r[0], r[1]]);
  }
  return out;
}

// Tiers: 1 whole-word (token or stem equality) · 2 token-prefix (query ≥3
// chars) · 3 raw substring (query ≥3 chars). Every query token must match;
// the gloss ranks at its WORST token tier.
export function matchGloss(queryTokens: QueryToken[], gloss: PreparedGloss): GlossMatch | null {
  if (!queryTokens.length) return null;
  let worst: 1 | 2 | 3 = 1;
  const ranges: [number, number][] = [];
  for (const qt of queryTokens) {
    let hit: { tier: 1 | 2 | 3; range: [number, number] } | null = null;
    for (const t of gloss.tokens) {
      if (t.text === qt.text || t.stem === qt.stem) { hit = { tier: 1, range: [t.start, t.end] }; break; }
      if (!hit && qt.text.length >= 3 && t.text.startsWith(qt.text))
        hit = { tier: 2, range: [t.start, t.end] };
    }
    if (!hit && qt.text.length >= 3) {
      const i = gloss.lower.indexOf(qt.text);
      if (i >= 0) hit = { tier: 3, range: [i, i + qt.text.length] };
    }
    if (!hit) return null;
    if (hit.tier > worst) worst = hit.tier;
    ranges.push(hit.range);
  }
  return { tier: worst, ranges: mergeRanges(ranges) };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm run test:lookup`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/latin-match.ts src/lib/latin-match.test.ts
git commit -m "feat(lookup): tiered token matching with highlight ranges"
```

---

### Task 3: `lookup-search.ts` — meaning results carry gloss + ranges + tier

**Files:**
- Modify: `src/lib/lookup-search.ts`
- Modify: `src/lib/lookup-search.test.ts` (append)

- [ ] **Step 1: Write the failing tests (append to `lookup-search.test.ts`)**

```ts
test('latin: meaning result carries matched gloss, ranges, tier', () => {
  const r = search(P, 'believed');
  assert.equal(r.kind, 'latin');
  const m = (r as any).meaning[0];
  assert.equal(m.key, 'يؤمنون');
  assert.equal(m.gloss, 'to believe');
  assert.equal(m.tier, 1);
  assert.deepEqual(m.ranges, [[3, 10]]);
});
test('latin: tier ranks above frequency', () => {
  // 'know' whole-word-matches 'to know' (tier 1, total 85). The decoy gloss
  // must be TRUE tier 3: 'unknown' — stem stays 'unknown' (no irregular, no
  // suffix strip), doesn't start with 'know', so only the mid-token substring
  // hits. (NOT 'well-known': 'known' is an IRREGULAR entry stemming to 'know',
  // which would be tier 1 — caught during execution.)
  const p3 = prepareIndex({
    meta: { source: 't', words: 2, analyses: 2, version: 1 },
    words: {
      'يعلمون': [['يَعْلَمُونَ', 'yaʿlamūna', 'علم', 'عَلِمَ', 'V', 1, 'IMPF|3MP',
                  [], [], 'to know', 85, ['2:13']]],
      'مجهول': [['مَجْهُول', 'majhūl', 'جهل', 'مَجْهُول', 'N', 0, 'M',
                  [], [], 'unknown, obscure', 999, ['2:178']]],
    }, altKeys: {},
  } as any);
  const r = search(p3, 'know') as any;
  assert.equal(r.meaning[0].key, 'يعلمون');   // tier 1 beats total 999
  assert.equal(r.meaning[0].tier, 1);
  assert.equal(r.meaning[1].key, 'مجهول');    // tier 3 mid-token substring
  assert.equal(r.meaning[1].tier, 3);
});
test('latin: two-char whole-word query matches (go)', () => {
  const p4 = prepareIndex({
    meta: { source: 't', words: 1, analyses: 1, version: 1 },
    words: { 'ذهب': [['ذَهَبَ', 'dhahaba', 'ذهب', 'ذَهَبَ', 'V', 1, 'PERF',
                     [], [], 'to go, take away', 35, ['2:17']]] }, altKeys: {},
  } as any);
  assert.equal((search(p4, 'go') as any).meaning[0].key, 'ذهب');
});
test('suggestion refs expose translit + pos for row rendering', () => {
  const s = search(P, 'يؤم').suggestions[0];
  assert.equal((s as any).translit, 'yuʾminūna');
  assert.equal((s as any).pos, 'V');
  assert.equal((s as any).form, 4);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx tsx --test src/lib/lookup-search.test.ts`
Expected: FAIL — `m.gloss` undefined / `translit` undefined

- [ ] **Step 3: Implement**

In `src/lib/lookup-search.ts`:

a. Add import at top (after the existing import):
```ts
import { prepareGloss, prepareQuery, matchGloss } from './latin-match.ts';
import type { PreparedGloss } from './latin-match.ts';
```

b. Extend `KeyRef` (line 13) and the `Prepared.glossed` type (line 19):
```ts
export interface KeyRef {
  key: string; surface: string; translit: string; pos: string; form: number;
  total: number; hint: string | null;
}
```
and in `Prepared`: `glossed: Array<{ gloss: PreparedGloss; key: string }>;`

c. In `prepareIndex` (lines 26–35), build the richer ref and prepared glosses:
```ts
    refs.set(key, {
      key, surface: list[0][0], translit: list[0][1],
      pos: list[0][4], form: list[0][5],
      total, hint: list.find(a => a[9])?.[9] ?? null,
    });
    const seenFold = new Set<string>();
    const seenGloss = new Set<string>();
    for (const a of list) {
      const f = foldLatin(a[1]);
      if (f && !seenFold.has(f)) { seenFold.add(f); folds.push([f, key]); }
      if (a[9] && !seenGloss.has(a[9])) {
        seenGloss.add(a[9]);
        let pg = glossCache.get(a[9]);
        if (!pg) { pg = prepareGloss(a[9]); glossCache.set(a[9], pg); }
        glossed.push({ gloss: pg, key });
      }
    }
```
(also change the `glossed` local declaration to `const glossed: Array<{ gloss: PreparedGloss; key: string }> = [];` and declare beneath it `const glossCache = new Map<string, PreparedGloss>();` — gloss strings repeat ~5.7× across inflected families; sharing PreparedGloss cuts ~5.4 MB to ~1 MB)

d. Add the result type and rewrite the meaning half of `searchLatin` (lines 76–98):
```ts
export interface MeaningRef extends KeyRef {
  // The best-tier MATCHED gloss — meaning rows must render THIS (with ranges),
  // not the inherited `hint` (which is just the first glossed analysis).
  gloss: string; ranges: [number, number][]; tier: 1 | 2 | 3;
}
export interface LatinResult { kind: 'latin'; sound: KeyRef[]; meaning: MeaningRef[] }

function searchLatin(p: Prepared, q: string): LatinResult {
  const f = foldLatin(q);
  const sound: KeyRef[] = [];
  const seen = new Set<string>();
  if (f.length >= 2) {
    for (const [fold, key] of p.folds) {
      if (fold.startsWith(f) && !seen.has(key)) { seen.add(key); sound.push(p.refs.get(key)!); }
    }
  }
  const qTokens = prepareQuery(q);
  // Per key keep the BEST-tier gloss (a key can have several glossed analyses).
  const best = new Map<string, { gloss: PreparedGloss; tier: 1 | 2 | 3; ranges: [number, number][] }>();
  if (qTokens.length) {
    for (const { gloss, key } of p.glossed) {
      const m = matchGloss(qTokens, gloss);
      if (!m) continue;
      const prev = best.get(key);
      if (!prev || m.tier < prev.tier) best.set(key, { gloss, tier: m.tier, ranges: m.ranges });
    }
  }
  // Sort BEFORE capping (scan lists are insertion-ordered — see searchArabic
  // note); tier outranks frequency. Materialize refs only for the capped 20:
  // stop-word-shaped queries can match thousands of keys.
  const meaning: MeaningRef[] = [...best.entries()]
    .sort((a, b) => a[1].tier - b[1].tier
      || p.refs.get(b[0])!.total - p.refs.get(a[0])!.total)
    .slice(0, 20)
    .map(([key, b]) => ({ ...p.refs.get(key)!, gloss: b.gloss.raw, ranges: b.ranges, tier: b.tier }));
  sound.sort((a, b) => b.total - a.total);
  return { kind: 'latin', sound: sound.slice(0, 20), meaning };
}
```
Delete the old `LatinResult` interface (line 46) and old `searchLatin` body they replace.

- [ ] **Step 4: Run to verify pass**

Run: `npm run test:lookup`
Expected: PASS — including all pre-existing tests (the old `'believe'`/`'know'` substring tests must still pass: whole-word matches are a superset).

- [ ] **Step 5: Commit**

```bash
git add src/lib/lookup-search.ts src/lib/lookup-search.test.ts
git commit -m "feat(lookup): stemmed tiered meaning search with match ranges"
```

---

### Task 4: `verb-search.ts` — extract the generator's matcher into a tested lib

**Files:**
- Create: `src/lib/verb-search.ts`
- Create: `src/lib/verb-search.test.ts`
- Modify: `package.json` (`test:lookup` list)

- [ ] **Step 1: Write the failing tests**

Create `src/lib/verb-search.test.ts`:

```ts
// src/lib/verb-search.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepareVerbs, searchVerbs } from './verb-search.ts';

const ROOTS = [
  { root: 'نزل', translit: 'n-z-l', quad: false, totalCount: 293, forms: {
    '1': [{ past: 'نَزَلَ', present: 'يَنزِلُ', translit: 'nazala / yanzilu',
            meaning: 'to come down, descend', count: 25, example: '26:4' }],
    '4': [{ past: 'أَنزَلَ', present: 'يُنزِلُ', translit: 'anzala / yunzilu',
            meaning: 'to send down, reveal', count: 190, example: '2:22' }],
  } },
  { root: 'غفر', translit: 'gh-f-r', quad: false, totalCount: 234, forms: {
    '1': [{ past: 'غَفَرَ', present: 'يَغْفِرُ', translit: 'ghafara / yaghfiru',
            meaning: 'to forgive', count: 95, example: '2:58' }],
  } },
] as any;
const P = prepareVerbs(ROOTS);

test('arabic: root substring with hamza-variant collapse', () => {
  const m = searchVerbs(P, 'نز');
  assert.equal(m[0].root.root, 'نزل');
  assert.equal(m[0].reason, 'root');
  assert.equal(m[0].meaning, 'to send down, reveal'); // most frequent entry
});
test('latin: translit matches fold separators (gh-f-r ≡ ghfr)', () => {
  const m = searchVerbs(P, 'ghfr');
  assert.equal(m[0].root.root, 'غفر');
  assert.equal(m[0].reason, 'translit');
  assert.equal(m[0].meaning, 'to forgive'); // context meaning, no ranges
  assert.equal(m[0].ranges, null);
});
test('latin: meaning match carries matched gloss + ranges (stemmed)', () => {
  const m = searchVerbs(P, 'sent down');
  assert.equal(m[0].root.root, 'نزل');
  assert.equal(m[0].reason, 'meaning');
  assert.equal(m[0].meaning, 'to send down, reveal');
  assert.deepEqual(m[0].ranges, [[3, 12]]);
  assert.equal(m[0].formNo, '4');
});
test('latin: forgave finds forgive via irregular map', () => {
  assert.equal(searchVerbs(P, 'forgave')[0].root.root, 'غفر');
});
test('cap respected', () => {
  assert.ok(searchVerbs(P, 'a', 12).length <= 12);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx tsx --test src/lib/verb-search.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement**

Create `src/lib/verb-search.ts`:

```ts
// src/lib/verb-search.ts
// Pure matching over verb-forms.json roots — extracted from the generator
// page so behavior is unit-tested; the page is DOM glue only.
import { foldLatin } from './arabic-normalize.ts';
import { prepareGloss, prepareQuery, matchGloss } from './latin-match.ts';
import type { PreparedGloss } from './latin-match.ts';

export interface VerbEntry {
  past: string; present: string | null; translit: string;
  meaning: string | null; count: number; example: string;
}
export interface VerbRoot {
  root: string; translit: string; quad: boolean; totalCount: number;
  forms: Record<string, VerbEntry[]>;
}
interface Item {
  root: VerbRoot; rootNorm: string; rootFold: string;
  entries: Array<{ formNo: string; entry: VerbEntry; fold: string; gloss: PreparedGloss | null }>;
  top: { formNo: string; entry: VerbEntry };
}
export interface PreparedVerbs { items: Item[] }
export interface VerbMatch {
  root: VerbRoot; reason: 'root' | 'translit' | 'meaning';
  formNo: string; meaning: string | null; ranges: [number, number][] | null;
}

// Root-letter comparison collapses hamza carriers — a user typing ءمن or أمن
// must hit the same root. Different from normalizeArabic (which maps to ا).
const AR_DIACRITICS = /[ً-ْٰ]/g;
const normalizeRoot = (s: string) =>
  s.replace(AR_DIACRITICS, '').replace(/[أإآٱؤئ]/g, 'ء').replace(/[·\s\-]/g, '');

export function prepareVerbs(roots: VerbRoot[]): PreparedVerbs {
  const items: Item[] = roots.map((root) => {
    const entries = Object.entries(root.forms).flatMap(([formNo, list]) =>
      list.map((entry) => ({
        formNo, entry, fold: foldLatin(entry.translit),
        gloss: entry.meaning ? prepareGloss(entry.meaning) : null,
      })));
    const top = entries.reduce((a, b) => (b.entry.count > a.entry.count ? b : a), entries[0]);
    return { root, rootNorm: normalizeRoot(root.root), rootFold: foldLatin(root.translit),
             entries, top: { formNo: top.formNo, entry: top.entry } };
  });
  return { items };
}

export function searchVerbs(p: PreparedVerbs, rawQuery: string, cap = 12): VerbMatch[] {
  const q = rawQuery.trim();
  const out: Array<VerbMatch & { rank: number }> = [];
  if (/[؀-ۿ]/.test(q)) {
    const nq = normalizeRoot(q);
    if (!nq) return [];
    for (const it of p.items) {
      if (it.rootNorm.includes(nq)) out.push({
        root: it.root, reason: 'root', formNo: it.top.formNo,
        meaning: it.top.entry.meaning, ranges: null, rank: 2,
      });
    }
  } else {
    const fq = foldLatin(q);
    const qTokens = prepareQuery(q);
    for (const it of p.items) {
      const translitHit = fq.length >= 2 &&
        (it.rootFold.includes(fq) || it.entries.some(e => e.fold.includes(fq)));
      let bestGloss: { formNo: string; entry: VerbEntry; tier: number; ranges: [number, number][] } | null = null;
      if (qTokens.length) {
        for (const e of it.entries) {
          if (!e.gloss) continue;
          const m = matchGloss(qTokens, e.gloss);
          if (m && (!bestGloss || m.tier < bestGloss.tier))
            bestGloss = { formNo: e.formNo, entry: e.entry, tier: m.tier, ranges: m.ranges };
        }
      }
      if (bestGloss && (!translitHit || bestGloss.tier <= 2)) out.push({
        root: it.root, reason: 'meaning', formNo: bestGloss.formNo,
        meaning: bestGloss.entry.meaning, ranges: bestGloss.ranges, rank: bestGloss.tier,
      });
      else if (translitHit) out.push({
        root: it.root, reason: 'translit', formNo: it.top.formNo,
        meaning: it.top.entry.meaning, ranges: null, rank: 2,
      });
    }
  }
  // rank (meaning tier / translit=2) first, then corpus frequency.
  out.sort((a, b) => a.rank - b.rank || b.root.totalCount - a.root.totalCount);
  return out.slice(0, cap).map(({ rank, ...m }) => m);
}
```

- [ ] **Step 4: Run to verify pass, then register the test file**

Run: `npx tsx --test src/lib/verb-search.test.ts` → PASS.
In `package.json` `test:lookup`, insert `src/lib/verb-search.test.ts ` after `src/lib/latin-match.test.ts `.
Run: `npm run test:lookup` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/verb-search.ts src/lib/verb-search.test.ts package.json
git commit -m "feat(verb-forms): extract search into tested lib with meaning matches"
```

---

### Task 5: Word-lookup page — suggestion rows echo the matched meaning; mixed example chips

**Files:**
- Modify: `src/pages/resources/word-lookup/index.astro` (frontmatter EXAMPLES ~line 10; chips markup ~line 46; script `sugRow` ~line 114 and `runSearch` ~line 248; `<style>` sug/chip rules ~lines 320–349)
- Modify: `tests/word-lookup.spec.ts`

- [ ] **Step 1: Update e2e expectations first (they are the failing tests)**

In `tests/word-lookup.spec.ts` replace the test `'latin input: sound and meaning groups'` (lines 52–58) with:

```ts
  test('latin input: sound and meaning groups with highlighted meanings', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.fill('#wl-search', 'yuminuna');
    await expect(page.locator('.wl-group-label').first()).toContainText('by sound');
    await page.fill('#wl-search', 'believed');   // stemmed form
    const meaningRow = page.locator('.wl-sug').first();
    await expect(page.locator('.wl-group-label', { hasText: 'by meaning' })).toBeVisible();
    await expect(meaningRow.locator('mark')).toContainText('believe');
    await expect(meaningRow.locator('.wl-sug-sub')).toContainText('·');
  });
```

Replace the test `'example chip renders a card without typing'` (lines 72–76) with:

```ts
  test('english example chip opens the meaning group', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.locator('.wl-chip', { hasText: 'mercy' }).click();
    await expect(page.locator('.wl-group-label', { hasText: 'by meaning' })).toBeVisible();
  });
  test('arabic example chip still renders a card without typing', async ({ page }) => {
    await page.goto('/resources/word-lookup/');
    await page.locator('.wl-chip', { hasText: 'بِسْمِ' }).click();
    await expect(page.locator('#wl-result .wl-card').first()).toBeVisible();
  });
```

Run: `npx playwright test tests/word-lookup.spec.ts`
Expected: the three rewritten tests FAIL (no `mark`, no `mercy` chip yet); others PASS.

- [ ] **Step 2: Frontmatter — mixed EXAMPLES**

Replace the `EXAMPLES` array (lines 10–17) with:

```ts
// Real Quranic surfaces + real gloss vocabulary — never invent examples.
const EXAMPLES = [
  { q: 'mercy', note: 'search by meaning', latin: true },
  { q: 'believe', note: 'search by meaning', latin: true },
  { q: 'rahma', note: 'search by sound', latin: true },
  { q: 'يُؤْمِنُونَ', note: 'a conjugated verb' },
  { q: 'ٱلصَّلَوٰةَ', note: 'pasted from a mushaf' },
  { q: 'بِسْمِ', note: 'prefix + noun' },
];
```

Replace the chips markup (lines 46–53) with:

```astro
    <div class="wl-chips" aria-label="Example searches">
      <span class="wl-chips-label">Works with</span>
      {EXAMPLES.map(e => (
        <button class:list={['wl-chip', { 'wl-chip-latin': e.latin }]} data-q={e.q}>
          {e.latin ? <span>{e.q}</span> : <span lang="ar" dir="rtl">{e.q}</span>}
          <span class="wl-chip-note">{e.note}</span>
        </button>
      ))}
    </div>
```

- [ ] **Step 3: Script — meaning-aware suggestion rows**

a. Add a `marked` helper directly under the `h()` function definition (~line 84):

```ts
  // Wraps matched ranges in <mark>; real nodes only (repo blocks innerHTML).
  function marked(text: string, ranges: [number, number][] | null): HTMLElement {
    const span = h('span', {});
    if (!ranges?.length) { span.append(text); return span; }
    let pos = 0;
    for (const [s, e] of ranges) {
      if (s > pos) span.append(text.slice(pos, s));
      span.append(h('mark', {}, text.slice(s, e)));
      pos = e;
    }
    if (pos < text.length) span.append(text.slice(pos));
    return span;
  }
```

b. Replace `sugRow` (lines 114–119) with a two-line row — English block left, Arabic right (approved mockup):

```ts
  type SugRef = { key: string; surface: string; translit: string; total: number;
                  hint: string | null; gloss?: string; ranges?: [number, number][] | null };
  function sugRow(ref: SugRef) {
    const glossText = ref.gloss ?? ref.hint;
    return h('button', { class: 'wl-sug', role: 'option', 'data-key': ref.key },
      h('span', { class: 'wl-sug-en' },
        glossText
          ? h('p', { class: 'wl-sug-gloss' }, marked(glossText, ref.ranges ?? null))
          : h('p', { class: 'wl-sug-gloss wl-sug-gloss-soon' }, 'meaning coming soon'),
        h('p', { class: 'wl-sug-sub', translate: 'no' }, `${ref.translit} · ${ref.total}×`)),
      h('span', { lang: 'ar', dir: 'rtl' }, ref.surface));
  }
```

c. In `runSearch` (lines 248–256), pass the matched gloss through for the meaning group — replace the two `rows.push` blocks with:

```ts
    if (r.sound.length) {
      rows.push(h('p', { class: 'wl-group-label' }, 'matches by sound'),
        ...r.sound.slice(0, 8).map(sugRow));
    }
    if (r.meaning.length) {
      rows.push(h('p', { class: 'wl-group-label' }, 'matches by meaning'),
        ...r.meaning.slice(0, 8).map(sugRow));
    }
```
(no code change needed beyond `sugRow` — `MeaningRef` objects already carry `gloss`/`ranges`, and plain `KeyRef`s fall back to `hint`.)

- [ ] **Step 4: Styles — new sug anatomy, chip variants, mark**

In the `<style>` block: replace the `.wl-sug [lang="ar"]` / `.wl-sug-hint` / `.wl-sug-count` rules (lines 325–330) with:

```css
  .wl-sug { justify-content: space-between; }
  .wl-sug [lang="ar"] { font-family: var(--font-arabic); font-size: 1.5rem;
    line-height: 1.8; flex-shrink: 0; }
  .wl-sug-en { min-inline-size: 0; }
  .wl-sug-gloss { margin: 0; color: var(--color-text-primary);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .wl-sug-gloss-soon { font-style: italic; color: var(--color-text-tertiary); }
  .wl-sug-sub { margin: 0; font-size: 0.8rem; color: var(--color-text-tertiary);
    font-variant-numeric: tabular-nums; font-style: italic; }
  mark { background: color-mix(in oklab, var(--accent-gold) 30%, transparent);
    color: inherit; border-radius: 2px; padding: 0 0.08em; }
```

Add after the `.wl-chip-note` rule (line 349):

```css
  .wl-chips-label { align-self: center; font-size: 0.8rem; letter-spacing: 0.06em;
    text-transform: uppercase; color: var(--color-text-tertiary); }
  .wl-chip { font-size: 1.25rem; }
  .wl-chip-latin { font-family: var(--font-sans); font-size: 1rem; }
```
(the `font-size: 1.25rem` line replaces the `1.05rem` inside the existing `.wl-chip` rule — edit in place rather than duplicating the selector.)

Append to the dark-mode AAA override selector list (lines 423–433): `.wl-sug-sub` (same `color: var(--color-text-secondary)` group).

- [ ] **Step 5: Verify**

Run: `npx playwright test tests/word-lookup.spec.ts`
Expected: PASS (all, including the three rewritten tests)
Run: `npm run test:lookup` → PASS (unchanged libs)

- [ ] **Step 6: Commit**

```bash
git add src/pages/resources/word-lookup/index.astro tests/word-lookup.spec.ts
git commit -m "feat(word-lookup): meaning-echo suggestions and english example chips"
```

---

### Task 6: Verb-forms page — adopt `verb-search`, meaning-echo rows, query chips

**Files:**
- Modify: `src/pages/resources/verb-forms/index.astro` (frontmatter ~line 33; markup after `.vf-search-wrap` ~line 57; script lines 152–170 and 263–277; `<style>` sug/chip rules)
- Modify: `tests/verb-forms.spec.ts`

- [ ] **Step 1: Failing e2e first**

Append inside the `test.describe` block of `tests/verb-forms.spec.ts`:

```ts
  test('english meaning search echoes the matched meaning', async ({ page }) => {
    await page.goto('/resources/verb-forms/');
    await page.fill('#vf-search', 'sent down');   // stemmed + multi-word
    const row = page.locator('.vf-sug').first();
    await expect(row.locator('.vf-sug-meaning mark')).toContainText('send down');
    await row.click();
    await expect(page.locator('#vf-result .vf-row-attested').first()).toBeVisible();
  });
  test('query example chip fills the box and opens suggestions', async ({ page }) => {
    await page.goto('/resources/verb-forms/');
    await page.locator('.vf-qchip', { hasText: 'guide' }).click();
    await expect(page.locator('.vf-sug .vf-sug-meaning').first()).toBeVisible();
    await expect(page.locator('#vf-search')).toHaveValue('guide');
  });
```

Run: `npx playwright test tests/verb-forms.spec.ts` → the two new tests FAIL, all others PASS.

- [ ] **Step 2: Frontmatter + markup — query-example chips row**

In the frontmatter after the `ROMAN` constant (line 33) add:

```ts
const QUERY_EXAMPLES = [
  { q: 'guide', note: 'by meaning', latin: true },
  { q: 'send down', note: 'by meaning', latin: true },
  { q: 'nzl', note: 'by sound', latin: true },
  { q: 'نصر', note: 'Arabic root' },
];
```

Directly after the closing `</div>` of `.vf-search-wrap` (line 57), insert:

```astro
    <div class="vf-qchips" aria-label="Example searches">
      <span class="vf-qchips-label">Works with</span>
      {QUERY_EXAMPLES.map(e => (
        <button class:list={['vf-qchip', { 'vf-qchip-latin': e.latin }]} data-q={e.q}>
          {e.latin ? <span>{e.q}</span> : <span lang="ar" dir="rtl">{e.q}</span>}
          <span class="vf-qchip-note">{e.note}</span>
        </button>
      ))}
    </div>
```

- [ ] **Step 3: Script — swap the inline matcher for the lib**

a. Add imports at the top of the `<script>` (line 116, before the FORMS parse):

```ts
  import { prepareVerbs, searchVerbs } from '../../../lib/verb-search.ts';
  import type { PreparedVerbs } from '../../../lib/verb-search.ts';
```

b. Delete lines 152–170 (`AR_DIACRITICS`, `normalizeAr`, `normalizeLatin`, `findMatches`) — the lib replaces them.

c. Cache the prepared index next to `DATA` (line 135): add `let VPREP: PreparedVerbs | null = null;` and in `loadData()`'s `.then(json => (DATA = json))` change to `.then(json => { DATA = json; VPREP = prepareVerbs(json.roots); return DATA; })`.

d. Add the `marked` helper under `h()` (identical to Task 5 Step 3a — pages duplicate tiny DOM helpers by design, same as `h()` itself).

e. Replace the input handler's row construction (lines 263–277) with:

```ts
  async function runSearch(q: string) {
    if (q.length < 2) { setSugHidden(true); return; }
    const data = await loadData().catch(() => null);
    if (!data || !VPREP) return;
    const matches = searchVerbs(VPREP, q, 12);
    sugEl.replaceChildren(...(matches.length
      ? matches.map((m) =>
          h('button', { class: 'vf-sug', role: 'option', 'data-root': m.root.root },
            h('span', { class: 'vf-sug-en' },
              h('p', { class: 'vf-sug-meaning' },
                marked(m.meaning ?? '', m.reason === 'meaning' ? m.ranges : null)),
              h('p', { class: 'vf-sug-sub', translate: 'no' },
                `${m.root.translit} · form ${ROMAN[Number(m.formNo) - 1] ?? m.formNo} · ${m.root.totalCount}×`)),
            h('span', { lang: 'ar', dir: 'rtl' }, [...m.root.root].join(' · '))))
      : [h('p', { class: 'vf-sug-none' },
          'no roots match; try ktb, نصر, or a meaning like guide')]));
    setSugHidden(false);
  }
  searchEl?.addEventListener('input', () => runSearch(searchEl.value.trim()));
```

f. Extend the document click handler (line 252–255) to cover query chips:

```ts
  document.addEventListener('click', (ev) => {
    const btn = (ev.target as HTMLElement).closest('[data-root]') as HTMLElement | null;
    if (btn) { selectRoot(btn.dataset.root!); return; }
    const qchip = (ev.target as HTMLElement).closest('[data-q]') as HTMLElement | null;
    if (qchip) { searchEl.value = qchip.dataset.q!; searchEl.focus(); runSearch(qchip.dataset.q!); }
  });
```

- [ ] **Step 4: Styles**

Replace `.vf-sug [lang="ar"]` / `.vf-sug-tl` (lines 327–328) with:

```css
  .vf-sug { justify-content: space-between; }
  .vf-sug [lang="ar"] { font-family: var(--font-arabic); font-size: 1.5rem;
    line-height: 1.8; flex-shrink: 0; }
  .vf-sug-en { min-inline-size: 0; }
  .vf-sug-meaning { margin: 0; color: var(--color-text-primary);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .vf-sug-sub { margin: 0; font-size: 0.8rem; color: var(--color-text-tertiary);
    font-variant-numeric: tabular-nums; font-style: italic; }
  mark { background: color-mix(in oklab, var(--accent-gold) 30%, transparent);
    color: inherit; border-radius: 2px; padding: 0 0.08em; }
```

Add after the `.vf-chip-count` rule (line 347) — query chips mirror the wl chips:

```css
  .vf-qchips { display: flex; flex-wrap: wrap; gap: var(--spacing-xs);
    justify-content: center; margin-block: var(--spacing-md) 0; }
  .vf-qchips-label { align-self: center; font-size: 0.8rem; letter-spacing: 0.06em;
    text-transform: uppercase; color: var(--color-text-tertiary); }
  .vf-qchip { display: inline-flex; align-items: baseline; gap: 0.5em;
    padding: 0.35em 0.8em; background: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary); border-radius: var(--radius-full);
    cursor: pointer; color: var(--color-text-primary);
    font-family: var(--font-arabic); font-size: 1.25rem;
    transition: border-color 160ms var(--vf-ease), transform 160ms var(--vf-ease); }
  .vf-qchip-latin { font-family: var(--font-sans); font-size: 1rem; }
  .vf-qchip:active { transform: scale(0.97); }
  .vf-qchip:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 1px; }
  .vf-qchip-note { font-family: var(--font-sans); font-size: 0.75rem;
    color: var(--color-text-tertiary); }
```

Also: change `.vf-chip` `font-size: 1.05rem` → `1.25rem` (line 340); add `.vf-qchip:hover` next to the existing `.vf-chip:hover` inside the `@media (hover)` block; append `.vf-sug-sub` and `.vf-qchip-note` to the dark-mode AAA selector list (lines 418–427); add `.vf-qchip { touch-action: manipulation; }` to the existing grouped rule (line 343).

- [ ] **Step 5: Verify**

Run: `npx playwright test tests/verb-forms.spec.ts` → PASS (new + all existing, incl. combobox/arrow-key tests — row is still a `button.vf-sug[data-root]`).

- [ ] **Step 6: Commit**

```bash
git add src/pages/resources/verb-forms/index.astro tests/verb-forms.spec.ts
git commit -m "feat(verb-forms): lib-backed search with meaning echo and query chips"
```

---

### Task 7: Word-lookup card restructure — meaning promoted, morpheme grid, type floor

**Files:**
- Modify: `src/pages/resources/word-lookup/index.astro` (script `analysisNode` lines 127–182; `<style>` card rules lines 365–400 and 450–453)
- Modify: `tests/word-lookup.spec.ts`

- [ ] **Step 1: Failing e2e — structural assertions**

Append to `tests/word-lookup.spec.ts` inside the describe block:

```ts
  test('card order: meaning precedes breakdown; morpheme grid is aligned', async ({ page }) => {
    await page.goto('/resources/word-lookup/#q=' + encodeURIComponent('بسم'));
    const analysis = page.locator('#wl-result .wl-analysis').first();
    await expect(analysis).toBeVisible();
    const first = analysis.locator('.wl-meaning, .wl-breakdown').first();
    await expect(first).toHaveClass(/wl-meaning/);   // meaning now renders first
    const morpheme = analysis.locator('.wl-morpheme').first();
    await expect(morpheme.locator('.wl-morpheme-label')).toBeVisible();
    await expect(morpheme.locator('[lang="ar"]')).toBeVisible();
  });
```

Run: `npx playwright test tests/word-lookup.spec.ts` → new test FAILS (breakdown currently renders before meaning).

- [ ] **Step 2: Script — reorder + restructure morpheme rows**

In `analysisNode` (lines 127–182):

a. Move the meaning append ABOVE the breakdown block — i.e. immediately after `wrap.append(grammar);` (line 135) insert:

```ts
    wrap.append(gloss
      ? h('p', { class: 'wl-meaning' }, String(gloss))
      : h('p', { class: 'wl-meaning wl-meaning-soon' }, 'meaning coming soon'));
```
and DELETE the identical two-line append at its old position (lines 158–160).

b. Replace the `morpheme` helper (lines 121–125) — label left, Arabic right, one grid row per morpheme:

```ts
  function morpheme(ar: string, label: string, extraClass = ''): HTMLElement {
    return h('li', { class: `wl-morpheme ${extraClass}`.trim() },
      h('span', { class: 'wl-morpheme-label' }, label),
      ar ? h('span', { lang: 'ar', dir: 'rtl' }, ar) : h('span', {}, ''));
  }
```
(DOM order stays prefix → stem → suffix — top-to-bottom equals Arabic reading order.)

- [ ] **Step 3: Styles — grid breakdown, promoted meaning, floor sizes**

Replace `.wl-breakdown`, `.wl-morpheme`, `.wl-morpheme [lang="ar"]`, `.wl-morpheme-label` (lines 378–387) with:

```css
  .wl-breakdown { margin: 0 0 var(--spacing-sm); padding: 0; list-style: none;
    border: 1px solid var(--color-border-secondary); border-radius: var(--radius-md);
    overflow: hidden; }
  .wl-morpheme { display: grid; grid-template-columns: minmax(0, 1fr) auto;
    gap: var(--spacing-md); align-items: center;
    padding: 0.35em var(--spacing-md); }
  .wl-morpheme + .wl-morpheme { border-block-start: 1px solid var(--color-border-secondary); }
  .wl-morpheme [lang="ar"] { font-family: var(--font-arabic); font-size: 1.4rem;
    line-height: 1.8; color: var(--color-text-primary); }
  .wl-morpheme-label { font-size: 0.8rem; color: var(--color-text-tertiary); }
  .wl-morpheme-stem [lang="ar"] { color: var(--accent-gold); }
  .wl-morpheme-stem .wl-morpheme-label { color: var(--color-text-secondary);
    font-weight: 500; }
```

Edit in place:
- `.wl-meaning` (line 389): `font-size: 1.05rem` → `font-size: 1.0625rem; font-weight: 500;` and margin `0 0 var(--spacing-xs)` → `0 0 var(--spacing-sm)`.
- `.wl-grammar` (line 371): add `color: var(--color-text-tertiary);` replacing `color: var(--color-text-primary);` (grammar becomes the quiet line; keep size).
- `.wl-root-chip [lang="ar"]` (line 399): `1.05rem` → `1.25rem`.
- Mobile block (lines 450–453): `.wl-word { font-size: 1.9rem; }` → `2rem`, and add `.wl-morpheme [lang="ar"] { font-size: 1.3rem; }`.
- Dark-mode AAA list: add `.wl-grammar` to the selector group.

- [ ] **Step 4: Verify**

Run: `npx playwright test tests/word-lookup.spec.ts` → PASS.
Visual smoke: `npm run dev`, open `/resources/word-lookup/#q=بسم` and `#q=فسيكفيكهم` — meaning above an aligned bordered morpheme table, Arabic on the right edge; check light + dark and a 320px viewport (no horizontal scroll).

- [ ] **Step 5: Commit**

```bash
git add src/pages/resources/word-lookup/index.astro tests/word-lookup.spec.ts
git commit -m "feat(word-lookup): promote meaning and align morpheme breakdown grid"
```

---

### Task 8: Verb-forms row restructure — badge | English | Arabic spine

**Files:**
- Modify: `src/pages/resources/verb-forms/index.astro` (script `entryNode`/`rowNode`/`renderRoot` lines 172–243; `<style>` rows lines 349–390 and 461–465)
- Modify: `tests/verb-forms.spec.ts`

- [ ] **Step 1: Failing e2e**

Append:

```ts
  test('attested row exposes english block and arabic spine with wazn echo', async ({ page }) => {
    await page.goto('/resources/verb-forms/#root=' + encodeURIComponent('نزل'));
    const row = page.locator('#vf-result .vf-row-attested').first();
    await expect(row.locator('.vf-entry-en .vf-meaning')).toBeVisible();
    await expect(row.locator('.vf-entry-ar .vf-verb')).toBeVisible();
    await expect(row.locator('.vf-wazn').first()).toBeVisible();
    await expect(page.locator('#vf-result .vf-row')).toHaveCount(10);
  });
```

Run: `npx playwright test tests/verb-forms.spec.ts` → new test FAILS.

- [ ] **Step 2: Script — new row anatomy**

Replace `entryNode` (lines 172–185) with (adds English/Arabic blocks; `pattern` echo only on the first entry of a form):

```ts
  function entryNode(e: any, pattern?: string): HTMLElement {
    const pair = e.present ? `${e.past} / ${e.present}` : String(e.past);
    const exampleHref = `https://quran.com/${encodeURIComponent(String(e.example).replace(':', '/'))}`;
    return h('div', { class: 'vf-entry' },
      h('div', { class: 'vf-entry-en' },
        e.meaning === null
          ? h('p', { class: 'vf-meaning' }, h('em', {}, 'meaning coming soon'))
          : h('p', { class: 'vf-meaning' }, String(e.meaning)),
        h('p', { class: 'vf-translit', translate: 'no' }, String(e.translit ?? '')),
        h('p', { class: 'vf-meta-line' },
          h('span', { class: 'vf-count' }, `${Number(e.count)}× in the Quran`),
          h('a', { class: 'vf-example', href: exampleHref, target: '_blank', rel: 'noopener' },
            `e.g. ${e.example}`))),
      h('div', { class: 'vf-entry-ar' },
        h('p', { class: 'vf-verb', lang: 'ar', dir: 'rtl' }, pair),
        pattern ? h('p', { class: 'vf-wazn', lang: 'ar', dir: 'rtl' }, pattern) : null));
  }
```

Replace `rowNode` (lines 187–192) with:

```ts
  function rowNode(i: number, cls: string, head: Kid[], body: Kid[]): HTMLElement {
    const row = h('li', { class: `vf-row ${cls}`, style: `--i:${i}` }, ...head);
    if (body.length) row.append(h('div', { class: 'vf-row-body' }, ...body));
    return row;
  }
```

In `renderRoot` (lines 194–231) update the three attested/empty call sites:

```ts
    if (root.quad) {
      for (const [f, list] of Object.entries<any>(root.forms)) {
        rows.push(rowNode(i++, 'vf-row-attested',
          [h('span', { class: 'vf-badge vf-badge-gold' }, `Q${f}`)],
          (list as any[]).map((e) => entryNode(e))));
      }
    } else {
      for (const fm of FORMS) {
        const list = root.forms[String(fm.n)];
        if (!list) {
          rows.push(rowNode(i++, 'vf-row-empty',
            [h('span', { class: 'vf-badge' }, ROMAN[fm.n - 1]),
             h('p', { class: 'vf-empty-note' }, 'not used in the Quran for this root'),
             h('span', { class: 'vf-pattern', lang: 'ar', dir: 'rtl' }, `${fm.past} / ${fm.present}`)],
            []));
        } else {
          rows.push(rowNode(i++, 'vf-row-attested',
            [h('span', { class: 'vf-badge vf-badge-gold' }, ROMAN[fm.n - 1]),
             h('p', { class: 'vf-shift' }, fm.shift)],
            (list as any[]).map((e, j) => entryNode(e, j === 0 ? fm.past : undefined))));
        }
      }
      for (const f of rareKeys) {
        rows.push(rowNode(i++, 'vf-row-attested',
          [h('span', { class: 'vf-badge vf-badge-gold' }, ROMAN[Number(f) - 1] ?? f),
           h('p', { class: 'vf-shift' }, 'rare form, beyond the classical ten')],
          (root.forms[f] as any[]).map((e) => entryNode(e))));
      }
    }
```
(the `.vf-row-head` wrapper div is gone — badge and shift land directly in the row grid.)

- [ ] **Step 3: Styles — the grid**

Replace the row/entry rules (lines 361–390: `.vf-row` padding, `.vf-row-head`, `.vf-pattern`, `.vf-shift`, `.vf-empty-note`, `.vf-entry*`, `.vf-verb`) with:

```css
  .vf-row { padding: var(--spacing-md) var(--spacing-lg);
    display: grid; grid-template-columns: 3.2em minmax(0, 1fr);
    column-gap: var(--spacing-md); align-items: start; }
  .vf-badge { margin-block-start: 0.3em; }
  .vf-shift { font-size: 0.85rem; color: var(--color-text-tertiary);
    font-style: italic; margin: 0; align-self: center; }
  .vf-row-body { grid-column: 2; }
  .vf-row-empty { grid-template-columns: 3.2em minmax(0, 1fr) auto;
    align-items: center; }
  .vf-empty-note { margin: 0; font-size: 0.9rem; color: var(--color-text-tertiary); }
  .vf-pattern { font-family: var(--font-arabic); font-size: 1.25rem;
    line-height: 1.8; color: var(--color-text-tertiary); }
  .vf-entry { display: grid; grid-template-columns: minmax(0, 1fr) auto;
    column-gap: var(--spacing-lg); align-items: center;
    margin-block-start: var(--spacing-sm); }
  .vf-entry + .vf-entry { border-block-start: 1px dashed var(--color-border-secondary);
    padding-block-start: var(--spacing-sm); }
  .vf-entry-ar { text-align: end; }
  .vf-verb { font-family: var(--font-arabic); font-size: 2.125rem; line-height: 1.9;
    color: var(--color-text-primary); margin: 0; }
  .vf-wazn { font-family: var(--font-arabic); font-size: 1.25rem; line-height: 1.8;
    color: var(--color-text-tertiary); margin: 0; }
  .vf-meaning { color: var(--color-text-primary); font-size: 1.0625rem;
    font-weight: 500; margin: 0; }
  .vf-translit { color: var(--color-text-secondary); font-style: italic;
    margin: 0.15em 0 0; font-size: 0.9rem; }
  .vf-meta-line { display: flex; gap: var(--spacing-md); align-items: baseline;
    margin: 0.25em 0 0; font-size: 0.85rem; }
```

Edit in place:
- `.vf-root-letters` (line 354): `2.5rem` → `2.75rem`.
- `.vf-root-link` (line 403): `1.1rem` → `1.3rem`.
- Dark-mode AAA list: add `.vf-wazn`.
- Mobile block (lines 461–465): replace with

```css
  @media (max-width: 640px) {
    .vf-title { font-size: 1.85rem; }
    .vf-row { grid-template-columns: 2.6em minmax(0, 1fr); }
    .vf-entry { grid-template-columns: 1fr; }
    .vf-entry-ar { text-align: start; order: -1; margin-block-end: 0.25em; }
    .vf-verb { font-size: 1.8rem; }
    .vf-row-empty { grid-template-columns: 2.6em minmax(0, 1fr); }
    .vf-row-empty .vf-pattern { grid-column: 2; }
  }
```

- [ ] **Step 4: Verify**

Run: `npx playwright test tests/verb-forms.spec.ts` → PASS (row count 10 / 11 preserved; `.vf-verb` selectors intact).
Visual smoke: `/resources/verb-forms/#root=نزل` — Arabic pairs on one right spine, wazn echo under the first pair, empty rows one-line; check dark mode and 320px.

- [ ] **Step 5: Commit**

```bash
git add src/pages/resources/verb-forms/index.astro tests/verb-forms.spec.ts
git commit -m "feat(verb-forms): aligned form-row grid with arabic spine and type floor"
```

---

### Task 9: Design-pipeline polish + audit (mandated by CLAUDE.md)

**Files:**
- Modify: both page files (CSS fine-tuning only — no structural or size-floor regressions)

- [ ] **Step 1:** Invoke the Skill tool for `taste-skill`, then `impeccable`, then `emil-design-eng` (Phase 2 build skills). With them loaded, review the two pages' diff and fine-tune ONLY: spacing rhythm, hover/focus states on new elements (`.wl-chip-latin`, `.vf-qchip`, sug rows), the `mark` tint intensity, and motion (respect existing `--i` stagger + reduced-motion). The 1.25rem floor and the approved grid anatomy are non-negotiable constraints from the spec.
- [ ] **Step 2:** Invoke `web-design-guidelines` (Phase 3 audit) against the two modified pages. Fix findings that touch changed code; log (don't fix) pre-existing findings elsewhere.
- [ ] **Step 3:** Re-run both e2e suites: `npx playwright test tests/word-lookup.spec.ts tests/verb-forms.spec.ts` → PASS.
- [ ] **Step 4: Commit**

```bash
git add src/pages/resources/word-lookup/index.astro src/pages/resources/verb-forms/index.astro
git commit -m "polish(lookup): spacing, states and audit fixes on redesigned rows"
```

---

### Task 10: Full verification + PR

- [ ] **Step 1:** `npm run test:lookup` → PASS (all unit files).
- [ ] **Step 2:** `npx playwright test` → full suite PASS (incl. `tests/accessibility.spec.ts`, `tests/font-verification.spec.ts` — the type-size changes must not break font snapshots; if `test:fonts` diffs are size-only and correct, run `npm run test:fonts:update` and commit the snapshots).
- [ ] **Step 3:** `npm run build` → succeeds. If a stale-cache prerender error appears (`Cannot find module dist/chunks…`), run `rm -rf node_modules/.astro .astro dist` and rebuild cold (known repo issue).
- [ ] **Step 4:** `git status` — confirm ONLY intended files changed (`package.json` diff = test list lines only; no package-lock churn).
- [ ] **Step 5:** Invoke the Skill tool for `code-review:code-review` (mandated pre-PR), address findings, then push and open the PR:

```bash
git push -u origin feat/lookup-english-first
gh pr create --title "feat: english-first lookup search + structured arabic display" \
  --body "Implements docs/superpowers/specs/2026-07-05-english-first-lookup-redesign-design.md (workstreams A+B). Meaning-echo suggestions with stemmed tiered matching, example query chips, aligned Arabic grids with a 1.25rem vocalized-Arabic floor. Unit + e2e suites extended and green."
```

---

## Plan self-review notes (already applied)

- Spec coverage: A1 → Tasks 5/6 chips; A2 → Tasks 5/6 rows (word-lookup meaning rows show the *matched* gloss via `MeaningRef.gloss`, others fall back to `hint`); A3 → Tasks 1–4 (module, tiers, stemmer, caps, verb extraction, perf via `prepareGloss`/`prepareVerbs` precompute); B type table → Tasks 5–8 (every selector from the spec table appears in exactly one task); B verb grid/morpheme grid/meaning promotion → Tasks 7/8; B constraints (ARIA, dir/lang, `--i`, reduced-motion, 320px) → preserved markup contracts + mobile blocks in Tasks 5–8; design pipeline → Task 9; testing → every task carries its failing-test step; rollout → Task 10.
- Type consistency: `KeyRef` gains `translit/pos/form` in Task 3 and is consumed in Task 5; `MeaningRef` fields (`gloss/ranges/tier`) match between Tasks 3 and 5; `VerbMatch` fields (`reason/formNo/meaning/ranges`) match between Tasks 4 and 6; `marked()` signature identical in Tasks 5d and 6.
- Known accepted limitations (documented in tests): `-ance`/`-less` not stemmed; muqatta'at unglossed by design.
