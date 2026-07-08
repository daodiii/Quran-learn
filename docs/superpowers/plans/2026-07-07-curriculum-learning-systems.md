# Curriculum Learning Systems Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the three missing legs of comprehension — a vocabulary strand, recitation audio, and a graded reading track — plus cumulative review quizzes and a cold-read capstone, on top of the merged redesign.

**Architecture:** Everything data-first and deterministic where possible. Vocabulary is EXTRACTED from the Arabic the learner already saw (each lesson's `ArabicExample` `arabic` props), joined to glosses/frequency in `public/data/word-lookup.json`, emitted as committed JSON, and auto-rendered by `LessonLayout` — zero edits to the 80 lesson MDX files. Audio derives per-ayah URLs by parsing existing `reference` props. The reading track and review questions are typed data modules with build-time validation. No accounts, no backend; progress stays in localStorage.

**Tech Stack:** Astro 5, `tsx --test` unit tests, Playwright e2e, everyayah.com per-ayah MP3 CDN (Alafasy 128kbps, attribution in About/footer), existing `Quiz.astro` + `quran-learn-progress` localStorage.

**Sequencing:** Execute AFTER the redesign branch (`redesign/curriculum-map-readability`) is merged — Tasks here touch `LessonLayout.astro`, `/learn`, and `curriculum-map.ts` from that branch. New branch: `feat/curriculum-learning-systems`.

**Execution model:** Fable implements Tasks 1–3 and 6 (pipeline correctness, component design, capstone content verification). Subagents: Task 4 question drafting (sonnet, strict sourcing rules, Fable reviews every question), Task 5 reading-notes drafting is Fable-written (38 one-liners, cheap). No fabricated Arabic anywhere: every Arabic string must come from lesson MDX, the corpus dataset, or the fetched Quran text.

---

## Known facts (do not rediscover)

- `public/data/word-lookup.json`: `words: Record<normKey, PackedAnalysis[]>` where `PackedAnalysis = [surfaceAr, translit, root, lemma, pos, form, feat, prefixes, suffixes, gloss, count, refs]` (indexes 0,1,2,4,9,10 relevant here). `altKeys` maps alternate spellings → canonical. `normalizeArabic` lives in `src/lib/arabic-normalize.ts` (browser-safe, also used by build scripts).
- `ArabicExample.astro` props: `arabic`, `transliteration?`, `translation`, `reference?` (freeform, e.g. "Surah Al-Fatiha 1:2", sometimes ranges "93:1-3"), `highlight?`, `words?`.
- Lesson ids: `level-1/03-reading-bismillah`. 80 lessons; curriculum order = level asc, order asc (manifest logic exists in `/learn` + homepage from the redesign).
- Surah collection: 38 entries, ids like `093-ad-duha`, frontmatter has `difficulty: beginner|intermediate|advanced`, `surahNumber`, `name`.
- Quiz component: `Quiz.astro` takes `{ title, questions: {id, question, options, correctAnswer, explanation?}[], passingScore?, level }`; quiz pages at `src/pages/learn/level-N/quiz.astro` hardcode arrays.
- Checkpoint lessons: L1.11, L2.12, L3.22, L4.19. `positionInLevel` prop exists on LessonLayout (redesign Task 7).
- everyayah URL shape: `https://everyayah.com/data/Alafasy_128kbps/{SSS}{AAA}.mp3` (zero-padded 3+3, e.g. `001002.mp3` = 1:2).
- Build/test: `npm run build` (astro + pagefind), `tsx --test` for unit, Playwright on port 4321, one runner at a time.

---

### Task 0: Branch

- [ ] **Step 0.1:**

```bash
git checkout main && git pull --ff-only && git checkout -b feat/curriculum-learning-systems
git add docs/superpowers/plans/2026-07-07-curriculum-learning-systems.md
git commit -m "docs: curriculum learning systems implementation plan"
```

---

### Task 1: Vocabulary extraction pipeline

**Files:**
- Create: `scripts/build-lesson-vocab.ts`, `scripts/lib/lesson-vocab.ts`, `scripts/lib/lesson-vocab.test.ts`
- Output artifact (committed): `src/data/vocab/lessons.json`
- Modify: `package.json` (scripts `vocab:build`, `validate:vocab`, extend `test:site`)

**Selection rules (the contract):** For each lesson in curriculum order: collect every whitespace-separated token from every `arabic="…"` prop of `<ArabicExample` tags in its MDX → normalize (`normalizeArabic`, resolve via `altKeys`) → look up in `word-lookup.json` → keep analyses with a non-null gloss (index 9) → for duplicate keys keep the highest-count analysis (index 10) → EXCLUDE words already selected by any earlier lesson (first-taught-wins registry) → rank by corpus count desc → take top 10 (keep all if <10; a lesson may legitimately yield few or zero new words).

- [ ] **Step 1.1: Write the failing unit tests**

```ts
// scripts/lib/lesson-vocab.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractArabicProps, selectLessonVocab } from './lesson-vocab.ts';

test('extractArabicProps pulls every ArabicExample arabic prop', () => {
  const mdx = `
intro text
<ArabicExample arabic="بِسْمِ اللَّهِ" translation="In the name of Allah" reference="1:1" />
<ArabicExample
  arabic="الْحَمْدُ لِلَّهِ"
  translation="Praise be to Allah"
/>
<Callout type="note">not this</Callout>`;
  assert.deepEqual(extractArabicProps(mdx), ['بِسْمِ اللَّهِ', 'الْحَمْدُ لِلَّهِ']);
});

test('selectLessonVocab joins glosses, dedupes, respects registry and cap', () => {
  // minimal fake index: two glossed words, one glossless, one repeated
  const index = {
    words: {
      'كتاب': [['كِتَابٌ', 'kitābun', 'كتب', '', 'N', 0, '', [], [], 'book, scripture', 250, ['2:2']]],
      'قلم': [['قَلَمٌ', 'qalamun', 'قلم', '', 'N', 0, '', [], [], 'pen', 4, ['68:1']]],
      'الم': [['الم', 'alif-lām-mīm', null, '', 'INL', 0, '', [], [], null, 6, ['2:1']]],
    },
    altKeys: {},
  } as any;
  const registry = new Set<string>(['قلم']); // taught earlier
  const picked = selectLessonVocab(['كِتَابٌ قَلَمٌ الم كِتَابٌ'], index, registry, 10);
  assert.equal(picked.length, 1);            // qalam in registry, alm glossless, kitab deduped
  assert.equal(picked[0].gloss, 'book, scripture');
  assert.equal(picked[0].arabic, 'كِتَابٌ');
  assert.ok(registry.has('كتاب'));           // registry updated in place
});

test('selectLessonVocab ranks by count and caps at max', () => {
  const mk = (surface: string, gloss: string, count: number) =>
    [[surface, 't', null, '', 'N', 0, '', [], [], gloss, count, ['1:1']]];
  const index = { words: { 'ا': mk('ا', 'g1', 5), 'ب': mk('ب', 'g2', 50), 'ت': mk('ت', 'g3', 20) }, altKeys: {} } as any;
  const picked = selectLessonVocab(['ا ب ت'], index, new Set(), 2);
  assert.deepEqual(picked.map(p => p.gloss), ['g2', 'g3']);
});
```

- [ ] **Step 1.2: Run to verify failure** — `npx tsx --test scripts/lib/lesson-vocab.test.ts` → FAIL (module missing).

- [ ] **Step 1.3: Implement the library**

```ts
// scripts/lib/lesson-vocab.ts
// Deterministic per-lesson vocabulary selection. Words come ONLY from Arabic
// the lesson actually displays (ArabicExample arabic props); glosses/counts
// come from the shipped word-lookup index. No generated Arabic, ever.
import { normalizeArabic } from '../../src/lib/arabic-normalize.ts';

export interface VocabEntry {
  arabic: string; translit: string; gloss: string;
  root: string | null; count: number;
}
interface LookupIndex {
  words: Record<string, any[][]>;
  altKeys: Record<string, string>;
}

const ARABIC_PROP_RE = /<ArabicExample[^>]*?\barabic=(?:"([^"]+)"|\{`([^`]+)`\})/gs;

export function extractArabicProps(mdx: string): string[] {
  const out: string[] = [];
  for (const m of mdx.matchAll(ARABIC_PROP_RE)) out.push((m[1] ?? m[2]).trim());
  return out;
}

export function selectLessonVocab(
  arabicStrings: string[], index: LookupIndex,
  registry: Set<string>, max: number,
): VocabEntry[] {
  const seen = new Map<string, VocabEntry>();
  for (const s of arabicStrings) {
    for (const token of s.split(/\s+/)) {
      const stripped = token.replace(/[۝۝].*$/u, '').trim(); // drop ayah markers
      if (!stripped) continue;
      const norm = normalizeArabic(stripped);
      if (!norm) continue;
      const key = index.words[norm] ? norm : index.altKeys[norm];
      if (!key || registry.has(key)) continue;
      const analyses = index.words[key];
      const best = analyses
        .filter(a => a[9])                                  // glossed only
        .sort((x, y) => y[10] - x[10])[0];
      if (!best) continue;
      const existing = seen.get(key);
      if (!existing || best[10] > existing.count) {
        seen.set(key, {
          arabic: best[0], translit: best[1], gloss: best[9],
          root: best[2], count: best[10],
        });
      }
    }
  }
  const picked = [...seen.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, max);
  for (const [key] of picked) registry.add(key);
  return picked.map(([, v]) => v);
}
```

- [ ] **Step 1.4: Run unit tests** — `npx tsx --test scripts/lib/lesson-vocab.test.ts` → PASS. (If the fake-index test fails on `normalizeArabic` specifics, adjust the FAKE DATA keys to the real normalized forms — print `normalizeArabic('كِتَابٌ')` — never adjust the library to fit the fake.)

- [ ] **Step 1.5: Build script**

```ts
// scripts/build-lesson-vocab.ts
// Walk lessons in curriculum order; emit src/data/vocab/lessons.json.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { extractArabicProps, selectLessonVocab } from './lib/lesson-vocab.ts';

const INDEX = JSON.parse(readFileSync('public/data/word-lookup.json', 'utf8'));
const LESSONS_DIR = 'src/content/lessons';
const OUT = 'src/data/vocab/lessons.json';
const MAX_PER_LESSON = 10;

const lessonFiles: { id: string; level: number; order: number; path: string }[] = [];
for (const levelDir of readdirSync(LESSONS_DIR).filter(d => d.startsWith('level-'))) {
  const level = Number(levelDir.split('-')[1]);
  for (const f of readdirSync(`${LESSONS_DIR}/${levelDir}`)) {
    if (!f.endsWith('.mdx') || f.startsWith('_')) continue;
    const order = Number(f.split('-')[0]);
    lessonFiles.push({ id: `${levelDir}/${f.replace(/\.mdx$/, '')}`, level, order, path: `${LESSONS_DIR}/${levelDir}/${f}` });
  }
}
lessonFiles.sort((a, b) => a.level - b.level || a.order - b.order);

const registry = new Set<string>();
const out: Record<string, ReturnType<typeof selectLessonVocab>> = {};
let total = 0, empty = 0;
for (const lf of lessonFiles) {
  const vocab = selectLessonVocab(extractArabicProps(readFileSync(lf.path, 'utf8')), INDEX, registry, MAX_PER_LESSON);
  if (vocab.length) out[lf.id] = vocab; else empty++;
  total += vocab.length;
}
mkdirSync('src/data/vocab', { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 0) + '\n');
console.log(`lessons=${lessonFiles.length} withVocab=${lessonFiles.length - empty} words=${total} uniqueRegistry=${registry.size}`);
if (lessonFiles.length !== 80) { console.error(`FAIL: expected 80 lessons, saw ${lessonFiles.length}`); process.exit(1); }
if (total < 300) { console.error(`FAIL: implausibly few vocab words (${total}) — extraction regression?`); process.exit(1); }
console.log(`→ ${OUT}`);
```

- [ ] **Step 1.6: Run it, inspect, commit rerun-idempotency** — `npx tsx scripts/build-lesson-vocab.ts` → expect roughly 500–800 total words. Spot-check 5 entries against their lessons (words must actually appear in that lesson's examples; glosses sane). Run twice, `shasum src/data/vocab/lessons.json` identical.
- [ ] **Step 1.7: package.json scripts** — `"vocab:build": "tsx scripts/build-lesson-vocab.ts"`, extend `"test:site"` to include `scripts/lib/lesson-vocab.test.ts`.
- [ ] **Step 1.8: Commit** — `git add -A && git commit -m "feat(vocab): deterministic per-lesson vocabulary extraction from lesson examples"`

---

### Task 2: Vocabulary UI (lesson section + level review page)

**Files:**
- Create: `src/components/VocabList.astro`, `src/pages/learn/[level]/vocabulary.astro` (or `src/pages/learn/level-[n]/vocabulary.astro` matching existing quiz page routing style)
- Modify: `src/layouts/LessonLayout.astro` (auto-render VocabList before prev/next footer)
- Test: `tests/vocab.spec.ts`

- [ ] **Step 2.1: Failing e2e**

```ts
// tests/vocab.spec.ts
import { test, expect } from '@playwright/test';

test('lesson with vocab shows the words section with glosses hidden until reveal', async ({ page }) => {
  await page.goto('/learn/level-1/03-reading-bismillah/');
  const section = page.locator('[data-vocab-section]');
  await expect(section).toBeVisible();
  const rows = section.locator('[data-vocab-row]');
  expect(await rows.count()).toBeGreaterThan(0);
  await expect(section.locator('h2')).toContainText(/words from this lesson/i);
});

test('level vocabulary review page lists cumulative words with recall toggle', async ({ page }) => {
  await page.goto('/learn/level-1/vocabulary/');
  const rows = page.locator('[data-vocab-row]');
  expect(await rows.count()).toBeGreaterThan(10);
  // recall mode: glosses hidden until the row is toggled
  await page.locator('[data-recall-toggle]').click();
  const first = rows.first();
  await expect(first.locator('[data-vocab-gloss]')).toBeHidden();
  await first.click();
  await expect(first.locator('[data-vocab-gloss]')).toBeVisible();
});
```

- [ ] **Step 2.2: Verify fail**, then implement `VocabList.astro`:

```astro
---
// src/components/VocabList.astro
import vocabData from '../data/vocab/lessons.json';
interface Props { lessonId: string }
const { lessonId } = Astro.props;
const vocab = (vocabData as Record<string, any[]>)[lessonId] ?? [];
---
{vocab.length > 0 && (
  <section class="vocab-section" data-vocab-section aria-labelledby="vocab-heading">
    <h2 id="vocab-heading">Words from this lesson</h2>
    <p class="vocab-sub">High-frequency Quran vocabulary you just saw in context. Corpus count shown per word.</p>
    <ul class="vocab-list">
      {vocab.map(w => (
        <li class="vocab-row" data-vocab-row>
          <span class="vocab-ar" lang="ar" dir="rtl">{w.arabic}</span>
          <span class="vocab-mid">
            <span class="vocab-translit">{w.translit}</span>
            <span class="vocab-gloss" data-vocab-gloss>{w.gloss}</span>
          </span>
          <span class="vocab-meta">
            {w.root && <a href={`/resources/word-lookup/?q=${encodeURIComponent(w.arabic)}`} class="vocab-lookup">analyze</a>}
            <span class="vocab-count">×{w.count}</span>
          </span>
        </li>
      ))}
    </ul>
  </section>
)}
<style>
  .vocab-section { margin-block-start: var(--space-2xl); }
  .vocab-sub { color: var(--text-secondary); font-size: 0.9375rem; margin-block: 0.25rem var(--space-md); }
  .vocab-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
  .vocab-row {
    display: flex; align-items: baseline; gap: var(--space-md);
    padding: 0.625rem 0.5rem; border-block-end: 1px solid var(--border-primary);
  }
  .vocab-ar { font-family: var(--font-arabic); font-size: 1.5rem; min-inline-size: 7rem; }
  .vocab-mid { display: flex; flex-direction: column; gap: 0.125rem; min-inline-size: 0; flex: 1; }
  .vocab-translit { font-size: 0.875rem; color: var(--text-tertiary); }
  .vocab-gloss { font-size: 1rem; color: var(--text-primary); }
  .vocab-meta { display: flex; align-items: baseline; gap: var(--space-sm); }
  .vocab-count { font-size: 0.8125rem; color: var(--text-tertiary); font-variant-numeric: tabular-nums; }
  .vocab-lookup { font-size: 0.8125rem; color: var(--accent-primary); }
</style>
```

- [ ] **Step 2.3: LessonLayout integration** — import VocabList, render `<VocabList lessonId={lessonSlug} />` immediately before the prev/next footer block (the layout already receives the lesson slug for progress tracking; reuse that prop).
- [ ] **Step 2.4: Level review page** — `src/pages/learn/level-[n]/vocabulary.astro` following the quiz page's `getStaticPaths` pattern (5 static paths). Frontmatter: import vocab JSON + lesson collection; cumulative = all entries for lessons of this level, grouped by lesson title in curriculum order. Body: same row markup as VocabList (extract shared row into VocabList via a `compact` prop OR duplicate the row partial — prefer a `entries` prop on VocabList so both pages reuse it). Add a "Recall mode" toggle button (`data-recall-toggle`): a small script toggles `.recall` on the list; CSS `.recall [data-vocab-gloss] { visibility: hidden; }`, row click toggles `.revealed` (`.recall .revealed [data-vocab-gloss] { visibility: visible; }`). Keyboard: rows get `tabindex="0"` and Enter/Space handler when recall mode is on; `aria-pressed` on the toggle.
- [ ] **Step 2.5: Link it** — on `/learn`, each level section header gets a quiet link row: `Vocabulary · Quiz` (text links to `/learn/level-N/vocabulary/` and the existing quiz). One line in the redesigned level-header markup.
- [ ] **Step 2.6: Verify** — `npm run build && npx playwright test tests/vocab.spec.ts` → PASS; `npm run test:site` → PASS.
- [ ] **Step 2.7: Commit** — `git commit -am "feat(vocab): lesson vocab section + per-level cumulative review with recall mode"`

---

### Task 3: Recitation audio on ArabicExample

**Files:**
- Create: `src/lib/ayah-ref.ts`, `src/lib/ayah-ref.test.ts`
- Modify: `src/components/mdx/ArabicExample.astro`, `src/pages/about/index.astro` (attribution line; find the exact about page path first)
- Test: `tests/audio.spec.ts` + unit

- [ ] **Step 3.1: Failing unit tests for the reference parser**

```ts
// src/lib/ayah-ref.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAyahRef, ayahAudioUrl } from './ayah-ref.ts';

test('parses common reference shapes to first ayah', () => {
  assert.deepEqual(parseAyahRef('Surah Al-Fatiha 1:2'), { surah: 1, ayah: 2 });
  assert.deepEqual(parseAyahRef('Ad-Duha 93:1-3'), { surah: 93, ayah: 1 });
  assert.deepEqual(parseAyahRef('2:255'), { surah: 2, ayah: 255 });
  assert.deepEqual(parseAyahRef('Al-Baqarah 2:286, also 3:1'), { surah: 2, ayah: 286 });
});

test('rejects garbage and out-of-range', () => {
  assert.equal(parseAyahRef('no verse here'), null);
  assert.equal(parseAyahRef('115:1'), null);
  assert.equal(parseAyahRef('0:3'), null);
});

test('builds zero-padded everyayah url', () => {
  assert.equal(ayahAudioUrl({ surah: 1, ayah: 2 }),
    'https://everyayah.com/data/Alafasy_128kbps/001002.mp3');
});
```

- [ ] **Step 3.2: Verify fail, implement**

```ts
// src/lib/ayah-ref.ts
// Parse freeform verse references ("Surah Al-Fatiha 1:2", "93:1-3") to the
// FIRST cited ayah. Used to derive recitation audio URLs at build time.
export interface AyahRef { surah: number; ayah: number }

const REF_RE = /(\d{1,3}):(\d{1,3})/;

export function parseAyahRef(reference: string): AyahRef | null {
  const m = reference.match(REF_RE);
  if (!m) return null;
  const surah = Number(m[1]), ayah = Number(m[2]);
  if (surah < 1 || surah > 114 || ayah < 1) return null;
  return { surah, ayah };
}

export function ayahAudioUrl({ surah, ayah }: AyahRef): string {
  const pad = (n: number) => String(n).padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${pad(surah)}${pad(ayah)}.mp3`;
}
```

- [ ] **Step 3.3: ArabicExample integration** — in the component frontmatter: `import { parseAyahRef, ayahAudioUrl } from '../../lib/ayah-ref';` then `const ayah = reference ? parseAyahRef(reference) : null;`. In the template, next to the reference line render (only when `ayah`):

```astro
<button class="ayah-play" type="button" data-audio-src={ayahAudioUrl(ayah)}
        aria-label={`Play recitation of verse ${ayah.surah}:${ayah.ayah}`}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
  <span class="ayah-play-label">Listen</span>
</button>
```

Component script (module-level, once per page — guard against duplicate binding since the component repeats):

```ts
<script>
  if (!(window as any).__ayahAudioBound) {
    (window as any).__ayahAudioBound = true;
    let current: HTMLAudioElement | null = null;
    let currentBtn: HTMLElement | null = null;
    document.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.ayah-play') as HTMLElement | null;
      if (!btn) return;
      const src = btn.dataset.audioSrc!;
      if (current && currentBtn === btn) {
        current.paused ? current.play() : current.pause();
        return;
      }
      current?.pause();
      currentBtn?.classList.remove('playing');
      current = new Audio(src);            // no preload until asked
      currentBtn = btn;
      btn.classList.add('playing');
      current.play();
      current.addEventListener('ended', () => btn.classList.remove('playing'));
      current.addEventListener('error', () => { btn.classList.add('unavailable'); btn.setAttribute('disabled', ''); });
    });
  }
</script>
```

Styles (scoped): `.ayah-play { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.8125rem; color: var(--accent-primary); background: none; border: 1px solid var(--border-primary); border-radius: var(--radius-full); padding: 0.125rem 0.625rem; cursor: pointer; } .ayah-play.playing { color: var(--accent-gold); border-color: var(--accent-gold); } .ayah-play.unavailable { opacity: 0.4; cursor: default; }`

- [ ] **Step 3.4: e2e**

```ts
// tests/audio.spec.ts
import { test, expect } from '@playwright/test';

test('examples with verse references get a listen button with a valid CDN url', async ({ page }) => {
  await page.goto('/learn/level-1/03-reading-bismillah/');
  const btn = page.locator('.ayah-play').first();
  await expect(btn).toBeVisible();
  const src = await btn.getAttribute('data-audio-src');
  expect(src).toMatch(/^https:\/\/everyayah\.com\/data\/Alafasy_128kbps\/\d{6}\.mp3$/);
});

test('examples without references get no button', async ({ page }) => {
  await page.goto('/learn/level-1/04-three-word-types/');
  const counts = await page.evaluate(() => ({
    examples: document.querySelectorAll('.arabic-example').length,
    buttons: document.querySelectorAll('.ayah-play').length,
    refs: document.querySelectorAll('.arabic-example .reference').length,
  }));
  expect(counts.buttons).toBeLessThanOrEqual(counts.refs);
});
```

- [ ] **Step 3.5: Attribution** — add to the About page credits block: "Recitation audio: Mishary Rashid Alafasy, served by everyayah.com." Match the existing corpus-attribution sentence style.
- [ ] **Step 3.6: Verify** — `npx tsx --test src/lib/ayah-ref.test.ts && npm run build && npx playwright test tests/audio.spec.ts` → PASS. Manual: preview one lesson, click Listen, confirm playback and single-audio-at-a-time.
- [ ] **Step 3.7: Commit** — `git commit -am "feat(audio): per-ayah recitation on examples via reference parsing (Alafasy, everyayah)"`

---

### Task 4: Cumulative review quizzes (levels 2–5)

**Files:**
- Create: `src/data/review-questions/level-2.ts` … `level-5.ts`, `src/data/review-questions/index.test.ts`, `src/pages/learn/level-[n]/review.astro`
- Test: `tests/review-quiz.spec.ts`

**Content rules (for the drafting subagent, enforced by Fable review):** 10 questions per level-N review, sampling ONLY topics from levels 1..N-1 (interleaving). Every Arabic string in a question must be copied verbatim from an existing lesson's MDX (cite source lesson id in a `source` field). No new Arabic. Explanations ≤ 2 sentences, reference the concept's lesson.

- [ ] **Step 4.1: Failing structural test**

```ts
// src/data/review-questions/index.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REVIEW_QUESTIONS } from './index.ts';

test('each review level has 10 well-formed questions sourced from earlier levels', () => {
  for (const [level, questions] of Object.entries(REVIEW_QUESTIONS)) {
    assert.equal(questions.length, 10, `level ${level}`);
    for (const q of questions) {
      assert.ok(q.question.length > 10);
      assert.equal(q.options.length, 4);
      assert.ok(q.correctAnswer >= 0 && q.correctAnswer < 4);
      assert.ok(q.explanation && q.explanation.length > 0);
      const srcLevel = Number(q.source.split('/')[0].replace('level-', ''));
      assert.ok(srcLevel < Number(level), `${q.source} must be from an earlier level than ${level}`);
    }
  }
});
```

- [ ] **Step 4.2: Create `src/data/review-questions/index.ts`** exporting `REVIEW_QUESTIONS: Record<2|3|4|5, ReviewQuestion[]>` re-exporting the four level files; `interface ReviewQuestion { id: number; question: string; options: string[]; correctAnswer: number; explanation: string; source: string }` (superset of Quiz.astro's shape — pass through minus `source`).
- [ ] **Step 4.3: Draft questions (subagent, sonnet)** — one subagent drafts all 40 questions following the content rules, reading the actual lesson files for Arabic snippets and topic coverage. It must output the four data files and cite `source` per question.
- [ ] **Step 4.4: Fable review pass** — verify every Arabic string appears verbatim in its cited source file (scriptable: for each question's Arabic substrings ≥ 4 chars, `grep -F` in the source lesson); verify answer correctness by reading each question; fix or reject bad ones. Run the structural test → PASS.
- [ ] **Step 4.5: Page** — `src/pages/learn/level-[n]/review.astro` with `getStaticPaths` for n=2..5, renders `<Quiz title={\`Level ${n} cumulative review\`} questions={...} level={n} />` (strip `source` before passing). Add a `Review` link next to `Vocabulary · Quiz` in the `/learn` level headers (levels 2–5 only).
- [ ] **Step 4.6: e2e**

```ts
// tests/review-quiz.spec.ts
import { test, expect } from '@playwright/test';
test('cumulative review page renders 10-question quiz', async ({ page }) => {
  await page.goto('/learn/level-3/review/');
  await expect(page.locator('#quiz-data')).toHaveCount(1);
  const data = JSON.parse(await page.locator('#quiz-data').textContent() ?? '[]');
  expect(data.questions?.length ?? data.length).toBe(10);
});
```
(Adjust the JSON shape assertion to Quiz.astro's actual serialization after reading it.)
- [ ] **Step 4.7: Verify + commit** — unit + e2e green → `git commit -am "feat(review): cumulative interleaved review quizzes for levels 2-5"`

---

### Task 5: Graded reading track (weave the 38 surah analyses in)

**Files:**
- Create: `src/data/reading-track.ts`, `src/data/reading-track.test.ts`, `src/components/ReadingTrack.astro`
- Modify: `src/pages/learn/index.astro` (render under each level section), `src/layouts/LessonLayout.astro` (render on checkpoint lessons: when `positionInLevel.index === positionInLevel.total` and level < 5)

- [ ] **Step 5.1: Failing test**

```ts
// src/data/reading-track.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { READING_TRACK } from './reading-track.ts';

test('every entry has a slug, note, and valid level; no surah assigned twice', () => {
  const seen = new Set<string>();
  for (const entry of READING_TRACK) {
    assert.match(entry.slug, /^\d{3}-[a-z-]+$/);
    assert.ok(entry.afterLevel >= 1 && entry.afterLevel <= 5);
    assert.ok(entry.note.length > 15 && entry.note.length < 160);
    assert.ok(!seen.has(entry.slug), `${entry.slug} assigned twice`);
    seen.add(entry.slug);
  }
  assert.equal(seen.size, 38, 'all 38 analyses are placed');
});
```

- [ ] **Step 5.2: Implement `reading-track.ts`.** Fable writes it: list the 38 surah collection ids (`ls src/content/surahs/`), assign `afterLevel` primarily by frontmatter `difficulty` (beginner → 1–2, intermediate → 3, advanced → 4–5), balancing counts (roughly 5–8 per level), and write a one-line `note` per surah telling the learner what grammar to notice, grounded in that surah's actual analysis content (skim each file's overview section; ~38 skims, batch-read 10 at a time). Shape:

```ts
export interface ReadingEntry { slug: string; afterLevel: 1 | 2 | 3 | 4 | 5; note: string }
export const READING_TRACK: ReadingEntry[] = [
  { slug: '112-al-ikhlas', afterLevel: 1, note: 'Four short nominal sentences — spot every definite noun and case ending you just learned.' },
  // …37 more, written from the actual surah analyses
];
```

Build-time guard in the pages that consume it: every `slug` must exist in the surahs collection (throw otherwise).
- [ ] **Step 5.3: `ReadingTrack.astro`** — props `{ level: number }`; renders "Apply it: read with the analysis open" + compact link rows (surah name, Arabic name, verse count from the collection, the note). Same row idiom as LessonRow, no cards.
- [ ] **Step 5.4: Wire into `/learn`** (after each level's clusters) and into checkpoint lesson pages (LessonLayout, after VocabList, only when checkpoint per the condition above).
- [ ] **Step 5.5: e2e** — extend `tests/learn-map.spec.ts`: `/learn/` shows 5 reading-track blocks; `[data-reading-row]` total equals 38.
- [ ] **Step 5.6: Verify + commit** — `git commit -am "feat(reading): graded reading track weaving surah analyses into the curriculum"`

---

### Task 6: Cold-read capstone (Level 5, lesson 17)

**Files:**
- Create: `src/content/lessons/level-5/17-capstone-cold-read.mdx`
- Modify: `src/data/curriculum-map.ts` (L5 gains `{ title: 'Capstone', lessons: [17], checkpoint: true }`), `src/data/curriculum-map.test.ts` (counts: L5=17; checkpoint rule: allow L5's checkpoint), `tests/learn-map.spec.ts` (80→81 rows, 4→5 checkpoints), "80 lessons" copy strings (grep `80 lessons` + `80 LESSONS` in src/pages/ + learn subtitle + courseSchema description), homepage stat.

**Content approach (no fabricated Arabic):** Passage: **Surah Luqman 31:12–19** (wisdom passage; rich in vocatives, prohibitions, inna, idafah, weak verbs — squarely L5-appropriate and NOT covered by the site's 38 Juz-ʿAmma analyses). Fetch exact text with the existing `npm run quran:lookup` script (`scripts/fetch-quran-text.ts`); morphology verified word-by-word against `public/data/word-lookup.json` (the corpus). Fable writes the analysis personally; each verse becomes: bare verse (ArabicExample with reference + audio) → "do the 5-step method" prompt → ExerciseBox per verse whose slot contains the full model iʿrab. Frontmatter: `title: "Capstone: Cold Read — Luqman's Counsel"`, `level: 5`, `order: 17`, description noting it is unseen text.

- [ ] **Step 6.1:** Update `curriculum-map.test.ts` expectations (L5 count 17, L5 checkpoint allowed as last cluster) → run → FAIL.
- [ ] **Step 6.2:** Update `curriculum-map.ts` L5 clusters → test PASS.
- [ ] **Step 6.3:** Fetch Luqman 31:12–19 text via `npm run quran:lookup` (check the script's CLI args first); write the lesson MDX verse-by-verse; verify EVERY morphological claim against word-lookup (use `/resources/word-lookup/` data directly: `node -e` lookups against the JSON for each stem's pos/form/root).
- [ ] **Step 6.4:** Update copy strings (81 lessons) + learn-map e2e counts; `npm run validate` (content validators: diacritics, verses, links) → PASS.
- [ ] **Step 6.5:** Full build + suites → PASS.
- [ ] **Step 6.6: Commit** — `git commit -am "feat(capstone): cold-read final on Luqman 31:12-19 with model i'rab"`

---

### Task 7: Final verification & PR

- [ ] **Step 7.1:** `npm run test:site && npm run validate && npm run test:lookup && npx playwright test && npm run build`
- [ ] **Step 7.2:** Manual pass: one lesson with vocab+audio, level-1 vocabulary page in recall mode, level-3 review quiz to completion (pass and fail paths), reading track links from /learn, capstone lesson end-to-end.
- [ ] **Step 7.3:** `web-design-guidelines` skill pass over the new components (VocabList, ReadingTrack, ayah-play, review page).
- [ ] **Step 7.4:** `/code-review:code-review`, address findings, push, PR titled `feat: curriculum learning systems — vocabulary strand, recitation audio, reading track, reviews, capstone`.

---

## Self-review notes

- Coverage vs. approved recommendations: vocab strand (T1–2), audio (T3), reading track (T5), retention/interleaving (T4), cold-read final (T6). Spaced repetition proper (SRS scheduling) is deliberately future work — the recall-mode page is the v1; noted for a later plan.
- Vocab words come only from Arabic already displayed in lessons; capstone Arabic comes only from the fetched Quran text; review-quiz Arabic only verbatim from lessons — the no-fabrication rule holds everywhere.
- The `words` prop interlinear data in some ArabicExamples is ignored by extraction v1 (arabic prop only) — acceptable; refine later if coverage looks thin.
- everyayah dependency is external; the audio button degrades (error → disabled state) if the CDN is unreachable, and pages remain fully usable without it.
