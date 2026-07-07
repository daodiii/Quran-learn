# Site Redesign: Curriculum Map & Readability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the three weakest surfaces (learn overview, lesson wayfinding, mobile tables/word-grids) and recompose the homepage, keeping the existing cream/gold/serif visual identity unchanged.

**Architecture:** No new dependencies. A build-time rehype plugin fixes table overflow globally; a single `curriculum-map.ts` data module drives the new `/learn` clustered-row layout and a shared `ResumeBand` component (client-rendered from the existing `quran-learn-progress` localStorage). Lesson wayfinding comes from data already available in `getStaticPaths` (`headings` from `render()`, position from level grouping).

**Tech Stack:** Astro 5, Tailwind v4 tokens (`--space-*` family, aliased as `--spacing-*`), scoped styles + `global.css`, Playwright e2e (port 4321, system Chrome), `tsx --test` unit tests.

**Design direction (Phase 1, locked):** Keep the existing identity — Cormorant display, Crimson Pro body, KFGQPC Uthmani Arabic, cream `--bg-primary` / gold `--accent-gold`, existing level colors. Density discipline anchor: Linear-style compact rows for the map. NO new fonts, NO new palette. Absolute bans apply: no side-stripe borders (remove the two existing ones), no gradient text, no new uppercase eyebrow labels.

**Execution model:** Fable (main loop) implements Tasks 4–8 (design-critical). Subagents (sonnet) may implement Tasks 1–3 and 9 (mechanical, deterministically verifiable) with main-loop review of every diff. Before the first visual task (Task 3), load `taste-skill` and `emil-design-eng` skills once (impeccable is already loaded this session).

**Verification baseline (from tonight's audit):** `npx impeccable detect --json --fast` on built pages currently reports: home 10, learn 10, lesson L3.14 24, surah 088 88, resources 3 findings. Task 10 re-runs this; counts must drop to near zero (remaining acceptable: `em-dash-overuse` in prose content, `numbered-section-markers` advisory — content-level, out of scope).

---

## Known facts (do not rediscover)

- Progress: `localStorage['quran-learn-progress']` → `{ completedLessons: string[] /* "level-1/01-arabic-script-vowels" */, lastUpdated: string }`. Helpers in `src/lib/progress.ts` (`getCompletedLessons()`, `markLessonComplete()`).
- Lesson collection ids look like `level-3/14-verb-form-iv`. Schema fields: `title, level (1-5), order, titleArabic?, description?, draft?`.
- `src/pages/learn/[...slug].astro` already computes prev/next (with quiz hops) in `getStaticPaths`; renders via `const { Content } = await render(lesson)` into `LessonLayout`.
- `GrammarTable.astro` already has a ≤640px stacked-card mode. The mobile clipping comes from RAW markdown pipe tables in surah/lesson MDX; `global.css:414-417` has inert `table { overflow-x: auto }` (tables are not scroll containers).
- Playwright: `npm run preview` on port 4321, `channel: 'chrome'`. Suites: components/cards/navigation/accessibility (+snapshots), word-lookup, verb-forms, font-verification.
- 80 lessons: L1=11, L2=12, L3=22, L4=19, L5=16. Checkpoints: L1.11, L2.12, L3.22, L4.19 (L5 ends with two synthesis lessons).
- Existing side-stripes to remove: `.lesson-essential .card` (learn page, `border-left: 4px solid`) and the gold left bar on `.arabic-example`.
- Dark mode: `--bg-primary: #000000`, text tokens `--text-primary/secondary/tertiary`, overrides at `global.css` ~lines 173–280.

---

### Task 0: Branch

- [ ] **Step 0.1:** From clean, up-to-date main:

```bash
git checkout main && git pull --ff-only && git checkout -b redesign/curriculum-map-readability
git add docs/superpowers/plans/2026-07-07-redesign-curriculum-map-readability.md
git commit -m "docs: redesign implementation plan (curriculum map + readability)"
```

---

### Task 1: Fix mobile table clipping site-wide (rehype wrapper)

**Files:**
- Create: `src/lib/rehype-table-scroll.mjs`
- Modify: `astro.config.mjs` (markdown.rehypePlugins), `src/styles/global.css:413-417`, `src/styles/ebook-print.css` (guard)
- Test: `tests/table-scroll.spec.ts`

- [ ] **Step 1.1: Write the failing e2e test**

```ts
// tests/table-scroll.spec.ts
import { test, expect } from '@playwright/test';

test.describe('mobile table overflow', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const path of ['/surahs/093-ad-duha/', '/learn/level-3/14-verb-form-iv/']) {
    test(`no page-level horizontal overflow on ${path}`, async ({ page }) => {
      await page.goto(path);
      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(docWidth).toBeLessThanOrEqual(390);
    });

    test(`markdown tables on ${path} are wrapped in scroll containers`, async ({ page }) => {
      await page.goto(path);
      // every markdown-emitted table must sit inside .table-scroll
      const bare = await page.locator('table').evaluateAll(tables =>
        tables.filter(t => !t.closest('.table-scroll') && !t.closest('.grammar-table-wrapper') && !t.closest('.grammar-table')).length);
      expect(bare).toBe(0);
    });
  }
});
```

- [ ] **Step 1.2: Run to verify it fails** — `npm run build && npx playwright test tests/table-scroll.spec.ts` → expect FAIL (bare tables > 0 and/or scrollWidth > 390).

- [ ] **Step 1.3: Implement the rehype plugin** (hand-rolled walk, no new deps)

```js
// src/lib/rehype-table-scroll.mjs
// Markdown pipe tables render as bare <table>; a table cannot be its own
// scroll container, so wide tables clip on narrow viewports. Wrap each
// top-level table in a scrollable div at build time.
export default function rehypeTableScroll() {
  return (tree) => {
    const visit = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-scroll'] },
            children: [child],
          };
        }
        visit(child);
        return child;
      });
    };
    visit(tree);
  };
}
```

- [ ] **Step 1.4: Register in `astro.config.mjs`** — add to the existing markdown config (create the `markdown` key if absent):

```js
import rehypeTableScroll from './src/lib/rehype-table-scroll.mjs';
// inside defineConfig:
markdown: {
  rehypePlugins: [rehypeTableScroll],
},
```
If a `markdown.rehypePlugins` array already exists, append to it instead.

- [ ] **Step 1.5: Replace the inert CSS** — in `src/styles/global.css`, replace the `table { overflow-x: auto; -webkit-overflow-scrolling: touch; }` block (~line 414) with:

```css
/* Rehype wraps every markdown table (src/lib/rehype-table-scroll.mjs) */
.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  max-inline-size: 100%;
}
.table-scroll > table { min-inline-size: max-content; }
```

- [ ] **Step 1.6: Ebook print guard** — append to `src/styles/ebook-print.css` (print context must never scroll or clip):

```css
.table-scroll { overflow: visible !important; }
```

- [ ] **Step 1.7: Verify** — `npm run build && npx playwright test tests/table-scroll.spec.ts` → PASS. Also `npx playwright test tests/font-verification.spec.ts` (ebook pages unaffected).

- [ ] **Step 1.8: Commit** — `git add -A && git commit -m "fix(tables): wrap markdown tables in scroll containers; kill inert overflow rule"`

---

### Task 2: Dark-mode contrast failures on surah pages (axe-driven)

**Files:**
- Modify: `tests/accessibility.spec.ts` (add dark-mode surah scan), `src/styles/global.css` (dark token block ~173–280)

- [ ] **Step 2.1: Write the failing test** — append to `tests/accessibility.spec.ts`, matching its existing AxeBuilder usage pattern:

```ts
test('surah page dark mode has no color-contrast violations', async ({ page }) => {
  await page.goto('/surahs/093-ad-duha/');
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark'); // match the site's theme persistence key — check Header.astro toggle script; adjust if the key differs
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
  const contrast = results.violations.filter(v => v.id === 'color-contrast');
  expect(contrast.map(v => v.nodes.map(n => n.html).slice(0, 3))).toEqual([]);
});
```

- [ ] **Step 2.2: Run to verify it fails** — `npx playwright test tests/accessibility.spec.ts -g "surah page dark"` → expect FAIL listing the ~7 known offending node pairs.

- [ ] **Step 2.3: Fix ONLY the failing pairs** by adjusting dark-mode token values in `global.css` (keep hue family, raise lightness). Likely offenders and candidate values (verify against axe output, don't apply blindly):
  - `--text-tertiary` (dark) → `#b7ab9d` (warm taupe, ≥ 7:1 on `#000`)
  - any `--accent-*-light` used as chip background with tertiary text → raise text token, not the background.
  Re-run the test after each token change until zero violations. Do NOT change light-mode tokens.

- [ ] **Step 2.4: Full a11y suite** — `npx playwright test tests/accessibility.spec.ts` → all PASS.

- [ ] **Step 2.5: Commit** — `git commit -am "fix(a11y): dark-mode contrast tokens pass axe on surah pages"`

---

### Task 3: Word-grid & component micro-typography

**Files:**
- Modify: `src/components/mdx/ArabicExample.astro`, `src/components/cards/CourseCard.astro`, `src/components/cards/SurahCard.astro`, `src/components/mdx/ExerciseBox.astro`

Load `taste-skill` and `emil-design-eng` skills before this task (Phase 2 of the design pipeline; impeccable already loaded).

- [ ] **Step 3.1: ArabicExample changes** (scoped styles; find current selectors in the component):
  - `.word-en`: `font-size: 0.75rem` → `0.8125rem`; ensure `line-height: 1.45`.
  - Each interlinear word unit (the element wrapping `.word-ar` + `.word-en`): add `padding: 0.375rem 0.5rem; border-radius: var(--radius-sm);` so text never sits flush against its background chip.
  - `.reference`: remove `text-transform: uppercase` and wide letter-spacing → `font-size: 0.8125rem; letter-spacing: 0.01em;` (sentence case comes from content).
  - Root `.arabic-example`: replace the gold `border-left`/`border-inline-start` accent bar with a full hairline: `border: 1px solid var(--border-primary); border-radius: var(--radius-md); background: var(--bg-secondary);` and a soft gold top rule only on the header row if one exists (`border-block-start: 2px solid var(--accent-gold)` on the inner header element, not the card edge).
- [ ] **Step 3.2: CourseCard** — `.course-card-progress`: add `padding: 0.5rem 0.625rem;` (children currently flush against border+bg). Keep the `role="progressbar"` markup identical (the learn page script queries it).
- [ ] **Step 3.3: SurahCard** — `.surah-card-footer`: add `padding-block-start: 0.625rem;` (children flush against its border-top).
- [ ] **Step 3.4: ExerciseBox** — confirm inner content has ≥ `var(--space-md)` inset from the box border on all sides; if the question row sits flush, add `padding` accordingly. Do not change props or toggle markup (tests depend on it).
- [ ] **Step 3.5: Verify** — `npm run build`, then:

```bash
npx impeccable detect --json --fast dist/learn/level-3/14-verb-form-iv/index.html "$(find dist/surahs -name index.html | head -1)" dist/index.html
```
Expected: `cramped-padding` count for word-unit/arabic-example/exercise-box/course-card-progress/surah-card-footer drops to 0; `tiny-text` 11px gone; `all-caps-body` from `.reference` gone.
- [ ] **Step 3.6: Update visual snapshots deliberately** — `npx playwright test tests/components.spec.ts tests/cards.spec.ts --update-snapshots`, then re-run without the flag → PASS. Eyeball the new snapshot PNGs before committing.
- [ ] **Step 3.7: Commit** — `git commit -am "polish(density): word-grid insets, 13px gloss floor, de-caps references, full hairline on examples"`

---

### Task 4: Curriculum map data module

**Files:**
- Create: `src/data/curriculum-map.ts`
- Test: `src/data/curriculum-map.test.ts` (add to a new `test:site` script)

- [ ] **Step 4.1: Write the failing test**

```ts
// src/data/curriculum-map.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CURRICULUM_MAP, clusterForLesson } from './curriculum-map.ts';

const LESSON_COUNTS: Record<number, number> = { 1: 11, 2: 12, 3: 22, 4: 19, 5: 16 };

test('every level covers exactly its lesson orders, no gaps or dupes', () => {
  for (const level of CURRICULUM_MAP) {
    const orders = level.clusters.flatMap(c => c.lessons);
    const expected = Array.from({ length: LESSON_COUNTS[level.level] }, (_, i) => i + 1);
    assert.deepEqual([...orders].sort((a, b) => a - b), expected, `level ${level.level}`);
    assert.equal(new Set(orders).size, orders.length, `level ${level.level} dupes`);
  }
});

test('clusters are contiguous ascending runs', () => {
  for (const level of CURRICULUM_MAP)
    for (const c of level.clusters)
      c.lessons.forEach((o, i) => i > 0 && assert.equal(o, c.lessons[i - 1] + 1, `${level.level}/${c.title}`));
});

test('each level with a checkpoint marks exactly one, as its last cluster', () => {
  for (const level of CURRICULUM_MAP) {
    const cps = level.clusters.filter(c => c.checkpoint);
    if (level.level === 5) { assert.equal(cps.length, 0); continue; }
    assert.equal(cps.length, 1, `level ${level.level}`);
    assert.equal(level.clusters.at(-1)?.checkpoint, true, `level ${level.level} checkpoint must be last`);
  }
});

test('clusterForLesson resolves and throws on unknown', () => {
  assert.equal(clusterForLesson(3, 14)?.title, 'Forms II–X');
  assert.throws(() => clusterForLesson(1, 99));
});
```

- [ ] **Step 4.2: Run to verify it fails** — `npx tsx --test src/data/curriculum-map.test.ts` → FAIL (module missing).

- [ ] **Step 4.3: Implement**

```ts
// src/data/curriculum-map.ts
// Single source of truth for how /learn groups lessons into thematic clusters.
// Orders reference the `order` frontmatter of src/content/lessons/level-N/*.
// The /learn page throws at build time if a lesson has no cluster (drift guard).
export interface LessonCluster {
  title: string;
  lessons: number[];        // contiguous `order` values
  checkpoint?: boolean;     // capstone surah analysis
  essential?: boolean;      // L1 reading essentials
  note?: string;            // one-line cluster description
}
export interface LevelMap { level: 1 | 2 | 3 | 4 | 5; clusters: LessonCluster[] }

export const CURRICULUM_MAP: LevelMap[] = [
  { level: 1, clusters: [
    { title: 'Reading essentials', lessons: [1, 2, 3], essential: true,
      note: 'Skip these only if you already read Arabic script.' },
    { title: 'Word basics', lessons: [4, 5, 6, 7, 8] },
    { title: 'Sentences & cases', lessons: [9, 10] },
    { title: 'Checkpoint', lessons: [11], checkpoint: true },
  ]},
  { level: 2, clusters: [
    { title: 'Sentence types', lessons: [1, 2, 3] },
    { title: 'The three cases', lessons: [4, 5, 6, 7] },
    { title: 'Possession & description', lessons: [8, 9] },
    { title: 'Sentence transformers', lessons: [10, 11] },
    { title: 'Checkpoint', lessons: [12], checkpoint: true },
  ]},
  { level: 3, clusters: [
    { title: 'Roots & Form I', lessons: [1, 2] },
    { title: 'Conjugation & moods', lessons: [3, 4, 5, 6, 7] },
    { title: 'Pronouns', lessons: [8, 9, 10, 11] },
    { title: 'Forms II–X', lessons: [12, 13, 14, 15, 16, 17, 18] },
    { title: 'Derived nouns', lessons: [19, 20, 21] },
    { title: 'Checkpoint', lessons: [22], checkpoint: true },
  ]},
  { level: 4, clusters: [
    { title: 'States & specification', lessons: [1, 2] },
    { title: 'Conditionals', lessons: [3, 4] },
    { title: 'Exception & emphasis', lessons: [5, 6] },
    { title: 'The mafʿul family', lessons: [7, 8, 9] },
    { title: 'Negation', lessons: [10] },
    { title: 'Weak verbs', lessons: [11, 12, 13, 14, 15] },
    { title: 'Numbers', lessons: [16] },
    { title: 'Rhetoric', lessons: [17, 18] },
    { title: 'Checkpoint', lessons: [19], checkpoint: true },
  ]},
  { level: 5, clusters: [
    { title: 'The method', lessons: [1] },
    { title: 'Applied analyses', lessons: [2, 3, 4, 5] },
    { title: 'Quranic patterns', lessons: [6, 7, 8] },
    { title: 'Narrative & dialogue', lessons: [9, 10, 11] },
    { title: 'Rhetoric in action', lessons: [12, 13, 14] },
    { title: 'Synthesis', lessons: [15, 16] },
  ]},
];

export function clusterForLesson(level: number, order: number): LessonCluster {
  const found = CURRICULUM_MAP.find(l => l.level === level)
    ?.clusters.find(c => c.lessons.includes(order));
  if (!found) throw new Error(`curriculum-map: no cluster for level ${level} lesson ${order}`);
  return found;
}
```

- [ ] **Step 4.4: Run tests** — `npx tsx --test src/data/curriculum-map.test.ts` → PASS.
- [ ] **Step 4.5: Add script** — in `package.json`: `"test:site": "tsx --test src/data/curriculum-map.test.ts"`.
- [ ] **Step 4.6: Commit** — `git commit -am "feat(learn): curriculum map data module with cluster validation"`

---

### Task 5: ResumeBand component (continue-where-you-left-off)

**Files:**
- Create: `src/components/ResumeBand.astro`
- Test: covered by Task 6 e2e (`tests/learn-map.spec.ts`)

- [ ] **Step 5.1: Implement.** Server renders a hidden container + JSON manifest; client fills it from localStorage. New users see nothing (homepage hero CTA already serves them); returning users get one quiet band.

```astro
---
// src/components/ResumeBand.astro
interface ManifestEntry { id: string; title: string; level: number; order: number }
interface Props { manifest: ManifestEntry[]; totals: Record<number, number> }
const { manifest, totals } = Astro.props;
---
<div class="resume-band" hidden data-resume-band>
  <div class="resume-copy">
    <p class="resume-label">Continue where you left off</p>
    <p class="resume-title" data-resume-title></p>
  </div>
  <a class="resume-cta" data-resume-link href="/learn/">Resume<span class="visually-hidden"> lesson</span> &rarr;</a>
</div>
<script type="application/json" data-resume-manifest set:html={JSON.stringify({ manifest, totals })} />
<script>
  const el = document.querySelector('[data-resume-band]') as HTMLElement | null;
  const dataEl = document.querySelector('[data-resume-manifest]');
  if (el && dataEl) {
    import('../lib/progress').then(({ getCompletedLessons }) => {
      const { manifest, totals } = JSON.parse(dataEl.textContent || '{}');
      const done = new Set(getCompletedLessons());
      if (done.size === 0) return;                       // new user: stay hidden
      const next = manifest.find((m: any) => !done.has(m.id));
      const title = el.querySelector('[data-resume-title]')!;
      const link = el.querySelector('[data-resume-link]') as HTMLAnchorElement;
      if (!next) { title.textContent = 'All 80 lessons complete. Revisit any time.'; }
      else {
        title.textContent = `Level ${next.level} · Lesson ${next.order} of ${totals[next.level]}: ${next.title}`;
        link.href = `/learn/${next.id}/`;
      }
      el.hidden = false;
    });
  }
</script>
<style>
  .resume-band {
    display: flex; align-items: center; justify-content: space-between; gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);
    border: 1px solid var(--accent-gold); border-radius: var(--radius-lg);
    background: var(--accent-gold-light);
    margin-block: var(--space-lg);
  }
  .resume-label { margin: 0; font-size: 0.8125rem; color: var(--text-secondary); }
  .resume-title { margin: 0; font-weight: 600; font-size: 1rem; color: var(--text-primary); }
  .resume-cta {
    flex-shrink: 0; font-weight: 700; color: var(--accent-gold);
    padding: 0.5rem 1rem; border-radius: var(--radius-full);
    border: 1px solid var(--accent-gold); text-decoration: none;
    transition: background var(--transition-fast);
  }
  .resume-cta:hover { background: var(--accent-gold); color: var(--text-inverse); }
  @media (max-width: 640px) {
    .resume-band { flex-direction: column; align-items: flex-start; }
  }
</style>
```
(If `.visually-hidden` doesn't exist in global.css, use the existing sr-only equivalent class; check and match.)

- [ ] **Step 5.2: Commit** — `git add src/components/ResumeBand.astro && git commit -m "feat(learn): ResumeBand continue affordance from localStorage progress"`

---

### Task 6: Rebuild `/learn` as the curriculum map

**Files:**
- Modify: `src/pages/learn/index.astro` (full rewrite of body; keep `courseSchema` JSON-LD and `levelNames` intact)
- Create: `src/components/LessonRow.astro`
- Test: `tests/learn-map.spec.ts`

- [ ] **Step 6.1: Write the failing e2e test**

```ts
// tests/learn-map.spec.ts
import { test, expect } from '@playwright/test';

test('renders all 80 lessons as rows grouped in 5 levels', async ({ page }) => {
  await page.goto('/learn/');
  await expect(page.locator('[data-lesson-row]')).toHaveCount(80);
  await expect(page.locator('section.level-section')).toHaveCount(5);
});

test('checkpoints are visually distinct rows', async ({ page }) => {
  await page.goto('/learn/');
  await expect(page.locator('[data-lesson-row][data-checkpoint]')).toHaveCount(4);
});

test('heading hierarchy has no skips', async ({ page }) => {
  await page.goto('/learn/');
  const levels = await page.locator('h1, h2, h3').evaluateAll(hs => hs.map(h => Number(h.tagName[1])));
  levels.reduce((prev, cur) => { expect(cur - prev).toBeLessThanOrEqual(1); return Math.max(prev, cur); }, 1);
});

test('resume band appears for a returning user and targets first incomplete lesson', async ({ page }) => {
  await page.goto('/learn/');
  await page.evaluate(() => localStorage.setItem('quran-learn-progress', JSON.stringify({
    completedLessons: ['level-1/01-arabic-script-vowels', 'level-1/02-reading-marks'],
    lastUpdated: new Date().toISOString(),
  })));
  await page.reload();
  const band = page.locator('[data-resume-band]');
  await expect(band).toBeVisible();
  await expect(band.locator('[data-resume-title]')).toContainText('Lesson 3 of 11');
  await expect(band.locator('[data-resume-link]')).toHaveAttribute('href', /03-reading-bismillah/);
});

test('completed lessons show state and rail reflects progress', async ({ page }) => {
  await page.goto('/learn/');
  await page.evaluate(() => localStorage.setItem('quran-learn-progress', JSON.stringify({
    completedLessons: ['level-1/01-arabic-script-vowels'], lastUpdated: new Date().toISOString(),
  })));
  await page.reload();
  await expect(page.locator('[data-lesson-row].completed')).toHaveCount(1);
  await expect(page.locator('[data-level-rail] [data-rail-level="1"] [role="progressbar"]'))
    .toHaveAttribute('aria-valuenow', '1');
});
```

- [ ] **Step 6.2: Run to verify it fails** — `npm run build && npx playwright test tests/learn-map.spec.ts` → FAIL (no `[data-lesson-row]`).

- [ ] **Step 6.3: Create `LessonRow.astro`**

```astro
---
// src/components/LessonRow.astro — one compact row in the curriculum map.
interface Props {
  id: string; title: string; description?: string;
  level: 1 | 2 | 3 | 4 | 5; order: number;
  checkpoint?: boolean; essential?: boolean;
}
const { id, title, description, level, order, checkpoint, essential } = Astro.props;
---
<a href={`/learn/${id}/`} class:list={['lesson-row', { checkpoint }]}
   data-lesson-row data-lesson-id={id} data-checkpoint={checkpoint ? '' : undefined}>
  <span class="row-number" style={`background: var(--level-${level}-bg); color: var(--level-${level}-text);`}>{order}</span>
  <span class="row-main">
    <span class="row-title">{title}{essential && <span class="row-tag">essential</span>}{checkpoint && <span class="row-tag row-tag-gold">checkpoint</span>}</span>
    {description && <span class="row-desc">{description}</span>}
  </span>
  <span class="row-state" aria-hidden="true">
    <svg class="row-check" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="var(--border-primary)" stroke-width="2" class="check-ring"/>
      <path d="M8 12.5l2.6 2.6L16 9.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="check-mark"/>
    </svg>
  </span>
</a>
<style>
  .lesson-row {
    display: flex; align-items: center; gap: var(--space-md);
    min-block-size: 3rem; padding: 0.5rem 0.75rem;
    border-radius: var(--radius-md); text-decoration: none;
    color: var(--text-primary); transition: background var(--transition-fast);
  }
  .lesson-row:hover { background: var(--bg-secondary); }
  .lesson-row.checkpoint {
    border: 1px solid var(--accent-gold); background: var(--accent-gold-light);
  }
  .row-number {
    flex-shrink: 0; inline-size: 1.75rem; block-size: 1.75rem;
    display: grid; place-items: center;
    border-radius: var(--radius-full);
    font-size: 0.8125rem; font-weight: 700; font-variant-numeric: tabular-nums;
  }
  .row-main { display: flex; flex-direction: column; gap: 0.125rem; min-inline-size: 0; }
  .row-title { font-size: 1rem; font-weight: 500; line-height: 1.35; }
  .row-desc {
    font-size: 0.875rem; color: var(--text-secondary);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  @media (max-width: 767px) { .row-desc { display: none; } }
  .row-tag {
    margin-inline-start: 0.5rem; font-size: 0.75rem; font-weight: 600;
    color: var(--accent-primary); border: 1px solid currentColor;
    border-radius: var(--radius-full); padding: 0 0.5rem;
  }
  .row-tag-gold { color: var(--accent-gold); }
  .row-state { margin-inline-start: auto; color: var(--accent-primary); }
  .check-mark { opacity: 0; }
  .lesson-row.completed .check-mark { opacity: 1; }
  .lesson-row.completed .check-ring { stroke: var(--accent-primary); }
  .lesson-row.completed .row-title { color: var(--text-secondary); }
</style>
```

- [ ] **Step 6.4: Rewrite `src/pages/learn/index.astro` body.** Keep frontmatter imports of `getCollection`, `levelNames`, `courseSchema`. Add imports: `CURRICULUM_MAP, clusterForLesson` from `../../data/curriculum-map`, `LessonRow`, `ResumeBand`. Build-time drift guard in frontmatter:

```ts
const byLevel = new Map<number, typeof allLessons>();
for (const l of allLessons) {
  byLevel.set(l.data.level, [...(byLevel.get(l.data.level) ?? []), l]);
}
for (const list of byLevel.values()) list.sort((a, b) => a.data.order - b.data.order);
// throws at build if any lesson is missing from the map:
for (const l of allLessons) clusterForLesson(l.data.level, l.data.order);
const manifest = [...byLevel.entries()].sort((a, b) => a[0] - b[0])
  .flatMap(([, list]) => list.map(l => ({ id: l.id, title: l.data.title, level: l.data.level, order: l.data.order })));
const totals = Object.fromEntries([...byLevel.entries()].map(([lv, list]) => [lv, list.length]));
```

Template structure (replaces the CardGrid + lessons-grid blocks):

```astro
<Container maxWidth="xl">
  <header class="page-header">
    <h1 class="page-title">Grammar Curriculum</h1>
    <p class="page-subtitle">80 lessons across 5 levels, from the Arabic alphabet to full Quranic analysis.</p>
  </header>
  <ResumeBand manifest={manifest} totals={totals} />
  <div class="map-layout">
    <nav class="level-rail" data-level-rail aria-label="Levels">
      {CURRICULUM_MAP.map(({ level }) => (
        <a href={`#level-${level}`} class="rail-item" data-rail-level={level}>
          <span class="rail-name">Level {level} · {levelNames[level].title}</span>
          <span class="rail-count" data-rail-count>0 of {totals[level]}</span>
          <span class="rail-bar" role="progressbar" aria-label={`Level ${level} progress`}
                aria-valuemin="0" aria-valuemax={totals[level]} aria-valuenow="0">
            <span class="progress-fill"></span>
          </span>
        </a>
      ))}
    </nav>
    <div class="map-main">
      {CURRICULUM_MAP.map(({ level, clusters }) => (
        <section id={`level-${level}`} class="level-section" data-level={level}>
          <div class="level-header">
            <h2 class="level-title"><span class="level-number">Level {level}</span>{levelNames[level].title}</h2>
            <span class="level-arabic" dir="rtl" lang="ar">{levelNames[level].titleAr}</span>
          </div>
          <p class="level-desc">{levelNames[level].desc}</p>
          {clusters.map(cluster => (
            <div class="cluster">
              {!cluster.checkpoint && <h3 class="cluster-title">{cluster.title}</h3>}
              {cluster.note && <p class="cluster-note">{cluster.note}</p>}
              <div class="cluster-rows">
                {cluster.lessons.map(order => {
                  const lesson = byLevel.get(level)!.find(l => l.data.order === order)!;
                  return <LessonRow id={lesson.id} title={lesson.data.title}
                    description={lesson.data.description} level={level} order={order}
                    checkpoint={cluster.checkpoint} essential={cluster.essential} />;
                })}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  </div>
</Container>
```

Scoped styles to add (replace `.lessons-grid`, `.mandatory-banner`, `.lesson-essential` blocks entirely):

```css
.map-layout { display: block; }
@media (min-width: 1024px) {
  .map-layout { display: grid; grid-template-columns: 15rem 1fr; gap: var(--space-2xl); align-items: start; }
  .level-rail { position: sticky; top: 5rem; display: flex; flex-direction: column; gap: var(--space-sm); }
}
.level-rail { display: flex; gap: var(--space-sm); overflow-x: auto; padding-block: var(--space-sm); }
@media (max-width: 1023px) {
  .level-rail { position: sticky; top: 0; background: var(--bg-primary); z-index: 10;
    border-block-end: 1px solid var(--border-primary); }
  .rail-item { min-inline-size: 9rem; }
}
.rail-item { display: flex; flex-direction: column; gap: 0.25rem; padding: 0.625rem 0.75rem;
  border-radius: var(--radius-md); text-decoration: none; }
.rail-item:hover { background: var(--bg-secondary); }
.rail-item.active { background: var(--bg-secondary); }
.rail-name { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); }
.rail-count { font-size: 0.8125rem; color: var(--text-secondary); font-variant-numeric: tabular-nums; }
.rail-bar { block-size: 3px; border-radius: var(--radius-full); background: var(--border-primary); overflow: hidden; }
.rail-bar .progress-fill { display: block; block-size: 100%; inline-size: 0; background: var(--accent-gold); }
.cluster { margin-block-start: var(--space-lg); }
.cluster-title { font-size: 0.9375rem; font-weight: 600; color: var(--text-secondary); margin-block-end: var(--space-xs); }
.cluster-note { font-size: 0.875rem; color: var(--text-tertiary); margin-block: 0 var(--space-xs); }
.cluster-rows { display: flex; flex-direction: column; }
.level-desc { color: var(--text-secondary); max-inline-size: 60ch; }
```

- [ ] **Step 6.5: Rewrite the client script** (replace the existing one wholesale — the checkmark-SVG-replacement block dies with LessonCard usage here):

```ts
import { getCompletedLessons } from '../../lib/progress';
const completed = new Set(getCompletedLessons());
document.querySelectorAll<HTMLElement>('[data-lesson-row]').forEach(row => {
  if (completed.has(row.dataset.lessonId!)) row.classList.add('completed');
});
document.querySelectorAll<HTMLElement>('[data-rail-level]').forEach(item => {
  const level = item.dataset.railLevel!;
  const rows = document.querySelectorAll(`[data-lesson-id^="level-${level}/"]`);
  const done = [...rows].filter(r => r.classList.contains('completed')).length;
  const bar = item.querySelector('[role="progressbar"]')!;
  bar.setAttribute('aria-valuenow', String(done));
  (bar.querySelector('.progress-fill') as HTMLElement).style.inlineSize =
    `${rows.length ? (done / rows.length) * 100 : 0}%`;
  item.querySelector('[data-rail-count]')!.textContent = `${done} of ${rows.length}`;
});
// scrollspy: highlight the rail item for the level in view
const sections = document.querySelectorAll('section.level-section');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const item = document.querySelector(`[data-rail-level="${(e.target as HTMLElement).dataset.level}"]`);
    if (e.isIntersecting) {
      document.querySelectorAll('.rail-item.active').forEach(a => a.classList.remove('active'));
      item?.classList.add('active');
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });
sections.forEach(s => io.observe(s));
```

- [ ] **Step 6.6: Verify** — `npm run build && npx playwright test tests/learn-map.spec.ts` → PASS. Then `npx playwright test tests/navigation.spec.ts tests/accessibility.spec.ts` → PASS (update navigation snapshots only if CourseNavigator markup was untouched but page context changed its screenshots; eyeball diffs).
- [ ] **Step 6.7: Commit** — `git commit -am "feat(learn): curriculum map — clustered rows, level rail, resume band, progress states"`

---

### Task 7: Lesson wayfinding

**Files:**
- Modify: `src/pages/learn/[...slug].astro` (pass `headings` + position), `src/layouts/LessonLayout.astro`, `src/components/navigation/NavigatorToggle.astro`
- Test: `tests/lesson-wayfinding.spec.ts`

- [ ] **Step 7.1: Failing test**

```ts
// tests/lesson-wayfinding.spec.ts
import { test, expect } from '@playwright/test';

test('lesson shows its position within the level', async ({ page }) => {
  await page.goto('/learn/level-3/14-verb-form-iv/');
  await expect(page.locator('[data-lesson-position]')).toHaveText(/Lesson 14 of 22/);
});

test('desktop lesson shows a mini TOC tracking h2 sections', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/learn/level-3/14-verb-form-iv/');
  const toc = page.locator('[data-lesson-toc]');
  await expect(toc).toBeVisible();
  expect(await toc.locator('a').count()).toBeGreaterThan(2);
});

test('mobile hides the TOC', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/learn/level-3/14-verb-form-iv/');
  await expect(page.locator('[data-lesson-toc]')).toBeHidden();
});

test('course navigator toggle is labeled', async ({ page }) => {
  await page.goto('/learn/level-3/14-verb-form-iv/');
  await expect(page.locator('.navigator-toggle, [data-navigator-toggle]')).toContainText(/lessons/i);
});
```

- [ ] **Step 7.2: Run to verify it fails.** `npm run build && npx playwright test tests/lesson-wayfinding.spec.ts`

- [ ] **Step 7.3: `[...slug].astro`** — change render destructure to `const { Content, headings } = await render(lesson);` and in `getStaticPaths` props add:

```ts
positionInLevel: { index: levelLessons.indexOf(lesson) + 1, total: levelLessons.length },
```
Pass `headings={headings}` and `positionInLevel={positionInLevel}` into `<LessonLayout>`.

- [ ] **Step 7.4: `LessonLayout.astro`** —
  - Props: add `headings?: { depth: number; slug: string; text: string }[]` and `positionInLevel?: { index: number; total: number }`.
  - Under the level badge, render: `<p class="lesson-position" data-lesson-position>Lesson {positionInLevel.index} of {positionInLevel.total}</p>` (styled `font-size: 0.875rem; color: var(--text-secondary); font-variant-numeric: tabular-nums;`).
  - Level badge: remove `text-transform: uppercase; letter-spacing: 0.08em` → render "Level 3" sentence case, same pill colors.
  - Add aside after `.lesson-article` inside `.lesson-main` wrapper:

```astro
{headings && headings.filter(h => h.depth === 2).length > 2 && (
  <aside class="lesson-toc" data-lesson-toc aria-label="On this page">
    <p class="toc-label">On this page</p>
    <ol>
      {headings.filter(h => h.depth === 2).map(h => (
        <li><a href={`#${h.slug}`} data-toc-link={h.slug}>{h.text}</a></li>
      ))}
    </ol>
  </aside>
)}
```

```css
.lesson-toc { display: none; }
@media (min-width: 1280px) {
  .lesson-main { display: grid; grid-template-columns: minmax(0, 85ch) 14rem; gap: var(--space-2xl); justify-content: center; }
  .lesson-toc { display: block; position: sticky; top: 6rem; align-self: start; font-size: 0.875rem; }
  .toc-label { font-weight: 600; color: var(--text-secondary); margin-block-end: var(--space-xs); }
  .lesson-toc ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.375rem; }
  .lesson-toc a { color: var(--text-tertiary); text-decoration: none; border-inline-start: 2px solid transparent; padding-inline-start: 0.625rem; display: block; line-height: 1.4; }
  .lesson-toc a:hover { color: var(--text-primary); }
  .lesson-toc a.active { color: var(--accent-gold); border-inline-start-color: var(--accent-gold); }
}
```
  (2px `border-inline-start` on the ACTIVE link is a scroll indicator, not a card accent — allowed.)
  - Scrollspy script (append to the layout's existing script or its own `<script>`): IntersectionObserver over `h2[id]`, toggling `.active` on `[data-toc-link]`, `rootMargin: '-10% 0px -80% 0px'`.
  - Soften h2 slabs: `.lesson-content :global(h2)` — replace `border-bottom: 2px solid var(--accent-gold)` with `border-bottom: 1px solid var(--border-primary)`, and add `position: relative` + `::after { content: ''; position: absolute; bottom: -1px; left: 0; inline-size: 2.5rem; block-size: 2px; background: var(--accent-gold); }`.

- [ ] **Step 7.5: `NavigatorToggle.astro`** — change the round icon-only FAB into a labeled pill: keep icon, add `<span class="toggle-label">Lessons</span>` (`font-size: 0.8125rem; font-weight: 600;`), `border-radius: var(--radius-full); padding: 0.625rem 1rem;`. Keep all aria wiring and ids identical (navigation tests depend on them).
- [ ] **Step 7.6: Verify** — `npm run build && npx playwright test tests/lesson-wayfinding.spec.ts tests/navigation.spec.ts` → PASS (update navigation snapshots deliberately if the labeled toggle changes them; eyeball first).
- [ ] **Step 7.7: Commit** — `git commit -am "feat(lessons): position indicator, sticky mini-TOC with scrollspy, labeled navigator, softened h2 rules"`

---

### Task 8: Homepage recomposition

**Files:**
- Modify: `src/pages/index.astro` (sections at ~150 hero, ~215 importance, ~279 learning path, ~353 features)
- Test: existing snapshot suites + `tests/table-scroll.spec.ts` unaffected; visual re-verify via detector

- [ ] **Step 8.1: Remove eyebrow kickers.** Delete the small uppercase label above "Why Quranic Grammar?" (the "THE DIVINE DISCLOSURE" element, ~line 216) and any sibling kicker elements in other sections (grep `text-transform: uppercase` within index.astro section headers; keep stat labels inside the hero band). Headline carries the section.
- [ ] **Step 8.2: Importance section (~215):** replace the 5 stacked icon cards with an editorial list next to the existing calligraphy panel. Two-column ≥768px (`grid-template-columns: 1fr minmax(16rem, 22rem)`). Left column: the same 5 items as a plain list, each: gold serif numeral (Cormorant, 1.75rem, `color: var(--accent-gold)`), item title 1.125rem/600, one-sentence body `color: var(--text-secondary)`. Separated by `1px solid var(--border-primary)` row rules, no boxes, no icons. Right column: keep the calligraphy card exactly as is.
- [ ] **Step 8.3: Learning path (~279):** replace the CourseCard grid with a journey band that communicates sequence:
  - Desktop: horizontal flex of 5 nodes on a continuous 1px gold line (`::before` on the container). Node = level-colored number circle (reuse `--level-N-bg/text`), name under it (0.9375rem/600), lesson count (0.8125rem, secondary). Whole node is a link to `/learn/#level-N`.
  - Mobile (<768px): vertical timeline, line on the left, nodes stacked.
  - Below the band: `<ResumeBand manifest={manifest} totals={totals} />` (import + compute manifest/totals in frontmatter exactly as in Task 6 Step 6.4 — reuse the same code).
  - Keep the "VIEW DETAILED CURRICULUM" button, retitle to "View the full curriculum" (sentence case).
- [ ] **Step 8.4: Features "What You'll Master" (~353):** strip the card/box chrome — plain 4-column grid (2-col <900px), each column: existing Arabic glyph enlarged to 2rem in `--accent-gold`, title, body. No borders, no backgrounds.
- [ ] **Step 8.5: Testimonials + FAQ + hero: unchanged** this round.
- [ ] **Step 8.6: Verify** — `npm run build`, then detector on `dist/index.html`: expect the 9 `cramped-padding` findings gone (Task 3 fixed components) and no `identical card grid` feel: hero → editorial → journey → surah cards (the one remaining card moment) → plain features → testimonials. Run `npx playwright test tests/components.spec.ts --update-snapshots` ONLY if the components page itself changed (it should not — homepage changes don't touch it). Full suite: `npx playwright test` → triage any homepage-dependent specs.
- [ ] **Step 8.7: Commit** — `git commit -am "redesign(home): editorial importance section, journey-band learning path, de-boxed features, resume band, no eyebrow kickers"`

---

### Task 9: Surah header + resources page fixes

**Files:**
- Modify: `src/layouts/SurahLayout.astro:47-66`, `src/pages/resources/index.astro`, `src/components/cards/ResourceCard.astro`

- [ ] **Step 9.1: SurahLayout header** — change the header wrapper (line 47) from `text-center` to left-aligned: remove `text-center`, keep the pills row inline (`inline-flex` stays, container left). Description `<p>` (line 64): remove `mx-auto`, keep `max-inline-size: 42rem`, `text-align: left`. Replace the four `onmouseenter`/`onmouseleave` inline handlers (lines 39-41, 75) with a scoped class + `:hover` CSS rule (`.surah-nav-link:hover { color: var(--accent-primary) }`).
- [ ] **Step 9.2: Resources heading skip** — in `src/pages/resources/index.astro`: if tool/resource groups exist, add an `h2` per group ("Interactive tools", "Reference library"); card titles inside become `h3` (fixing h1→h3 by inserting h2, not demoting content). In `ResourceCard.astro`, ensure description paragraphs use `font-family: var(--font-sans)` (Crimson Pro), not `--font-display` — fixes the single-font finding.
- [ ] **Step 9.3: Verify** — `npm run build`; detector on `dist/resources/index.html` (expect `skipped-heading` + `single-font` gone) and a fresh look at `dist/surahs/093-ad-duha/index.html`. Run `npx playwright test tests/accessibility.spec.ts`.
- [ ] **Step 9.4: Commit** — `git commit -am "polish(surah,resources): left-aligned surah header, CSS hovers, heading hierarchy, body font on resource cards"`

---

### Task 10: Final verification & PR

- [ ] **Step 10.1:** Full test matrix:

```bash
npm run test:site
npx playwright test          # all suites
npm run validate             # content validators
npm run test:lookup          # untouched but confirm
npm run build                # clean build, pagefind ok
```
- [ ] **Step 10.2:** Detector regression sweep (same 7 pages as baseline; counts near zero, see header note).
- [ ] **Step 10.3:** Run the `web-design-guidelines` skill review (Phase 3 of the design pipeline) against the changed surfaces; fix anything actionable it reports.
- [ ] **Step 10.4:** Visual pass: `npm run preview`, screenshot `/`, `/learn/`, one lesson, one surah at 1440 and 390 in both themes; eyeball against the design laws (no side-stripes anywhere: `grep -rn "border-left: 4px" src/ | grep -v node_modules` returns nothing).
- [ ] **Step 10.5:** Run `/code-review:code-review` skill, address findings.
- [ ] **Step 10.6:** Push branch, open PR titled `redesign: curriculum map, lesson wayfinding, mobile tables, homepage recomposition` with before/after screenshots.

---

## Self-review notes

- Spec coverage: learn map (T4-6), mobile tables (T1), word-grid typography (T3), homepage (T8), lesson wayfinding (T7), contrast (T2), surah header + resources (T9). All five critique priorities + minor findings covered.
- The per-verse card refactor for surah tables is deliberately OUT of scope (content-model change across 38 MDX files); the scroll wrapper resolves the P0 clipping. Recorded as future work.
- `levelNames` stays duplicated between `/learn` and homepage this round (pre-existing); consolidation is a refactor PR, not this one.
- Testimonials/FAQ/hero untouched — scope discipline.
