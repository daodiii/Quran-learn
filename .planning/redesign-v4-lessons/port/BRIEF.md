# BRIEF: Lesson Lab v4 Port — codebase facts (scouted 2026-07-11)

Single source of truth for implementation agents. Do NOT re-explore what's documented here.

## 1. src/layouts/LessonLayout.astro (692 lines)

**Props**: `title`, `titleArabic?`, `level`, `description?`, `nextLesson?`, `prevLesson?`, `datePublished?`, `dateModified?`, `headings?: {depth,slug,text}[]`, `positionInLevel?: {index,total}`.

**Renders in order**: `<BaseLayout title description type="article">` (head slot gets BreadcrumbSchema + ArticleSchema JSON-LD + rel=prev/next links) → `#navigator-backdrop` (mobile dimmer, toggled by `scripts/navigation.ts`) → `.lesson-grid` → `aside.lesson-sidebar` (display:contents) with `<CourseNavigator currentLessonSlug>` (fixed-position) + `main.lesson-main` → `<Breadcrumbs>` → `.lesson-body` grid (85ch content + 13rem sticky TOC rail ≥1280px; TOC rendered only if >2 h2 headings) → `article.lesson-article`: header (level badge, "Lesson X of Y" via `positionInLevel`, h1, Arabic title, description) → `.lesson-content` slot (MDX) → conditional VocabList (from `src/data/vocab/lessons.json` keyed by lesson id) → conditional `<ReadingTrack level>` (last lesson of level only) → Mark Complete button block → prev/next `nav.lesson-nav` → `<NavigatorToggle variant="floating"/>`.

**Landmine**: CourseNavigator re-fetches full `getCollection('lessons')` and path-string-matches `currentLessonSlug`.

**Theming**: LessonLayout has NO dark/light forcing — inherits BaseLayout's `data-theme` (localStorage/system). Uses `[data-theme="dark"]` overrides only for `.complete-status`.

**How section pages force night** (`src/pages/learn/index.astro`, `surahs/index.astro`, `resources/index.astro`): they bypass BaseLayout entirely — own `<html>`, `import '../../styles/night.css'`, own font `<link>`s, `theme-color` hardcoded `#05070e`, still run BaseLayout's stored-theme sync inline script (for the rest of the site) but their CSS is written directly against night.css tokens (`--bg-0`, `--ink`, `--gold`), ignoring `data-theme`. Each has a huge page-specific `<style is:global>` block.

## 2. Lesson content collection

`src/content.config.ts` (lines 12-33), collection `lessons`, glob `'**/[^_]*.{md,mdx}'` base `./src/content/lessons` (excludes `_index.mdx` placeholders — 85 files on disk, 81 in collection):

```
title: string (req), level: int 1-5 (req), order: positive int (req),
titleArabic?, description?, draft: bool=false, datePublished?, dateModified?,
prevLesson?, nextLesson?  // fallbacks only
```

**Page gen** — `src/pages/learn/[...slug].astro`: sorts by (level, order), prev/next computed from collection order (frontmatter is fallback: `computedPrevLesson || lesson.data.prevLesson`). First lesson of level>1: prev → `/learn/level-{n-1}/quiz/`; last of level: next → `/learn/level-{n}/quiz/`. `positionInLevel` computed there. `render(lesson)` with `components={{ img: ResponsiveImage }}` only — MDX components are imported per-lesson-file (relative `../../../components/mdx/X.astro`), no global map. Dates from `src/lib/getEntryDates.ts` (git-derived).

## 3. Shared MDX components (src/components/mdx/)

### ArabicExample.astro — 679 uses in 81/81 files
```
WordEntry { ar: string; tr: string; en: string }
Props { arabic: string; transliteration?: string; translation: string;
        reference?: string; highlight?: string; words?: WordEntry[] }
```
- `words` present → `.interlinear` (flex-wrap, dir=rtl) of `.word-unit` (arabic + en gloss stacked). Highlight = matching `word.ar` against comma-split `highlight` prop.
- No `words` → single `.arabic-text` p with `set:html` marking highlights as `<mark class="grammar-highlight">`.
- Always `.translation` p; if `reference` parses via `src/lib/ayah-ref.ts` `parseAyahRef` → "Listen" `<button class="ayah-play" data-audio-src=...>` wired by page-level delegated handler creating `Audio()` on demand.
- Scoped `<style>` against global.css vars (`--bg-secondary`, `--font-arabic`, `--accent-gold`...) + `:global([data-theme="dark"])` overrides.

### Callout.astro — 293 uses in 81/81
`Props { type?: 'note'|'tip'|'rule'|'warning'; title?: string }` → `<aside class="callout callout-{type}">`, inline SVG icon, default titles (Note/Tip/Grammar Rule/Common Mistake), slot body. Frosted glass + left accent bar via `::after`.

### ExerciseBox.astro — 353 uses in 81/81
`Props { question: string; id?: string }`. Question + Show/Hide Answer toggle (`aria-expanded`) revealing `<div class="exercise-answer" hidden>`. Script re-clones buttons on `astro:page-load` to dedupe listeners across view transitions. The one MDX component with client JS.

### GrammarTable.astro — 223 uses in 79/81 (276 lines)
`Props { caption?, headers?: string[], rows?: string[][], rtl? = true }`. With props → real `<table>` (first col `<th scope="row">`, rest `<td data-label>` for mobile card-stacking). Without props → `<slot/>` (raw markdown pipe-tables nested inside). `.table-wrapper` = frosted scrollable container. **75/81 files also contain bare markdown pipe-tables** — three coexisting table patterns.

### VerbConjugation.astro — 20 uses in 14 files (L3/L4 verb lessons, 308 lines)
### Quiz.astro / VocabList / ResponsiveImage — never used inside lesson MDX bodies.

## 4. Census

| Level | Lessons | ArabicExample | Callout | ExerciseBox | GrammarTable |
|---|---|---|---|---|---|
| 1 | 11 | 73 | 41 | 50 | 23 |
| 2 | 12 | 73 | 35 | 51 | 18 |
| 3 | 22 | 159 | 91 | 104 | 77 |
| 4 | 19 | 162 | 45 | 76 | 58 |
| 5 | 17 | 212 | 81 | 72 | 47 |

`words=` interlinear arrays present in 80/81 files (exception: `level-5/17-capstone-cold-read.mdx`, deliberate). No raw HTML in any lesson body.

## 5. Reference mockups (.planning/redesign-v4-lessons/lesson-3-lab.html + lesson-5-lab-past.html)

**Tokens** (`:root`, both files — superset of night.css):
```css
--bg-0:#05070e; --bg-1:#070a14; --bg-panel:#0a0e1c; --bg-cell:#0d1224;
--ink:#f4edda; --ink-dim:rgba(244,237,218,.74); --ink-faint:rgba(244,237,218,.55);
--gold:#e3b35c; --gold-bright:#f4d68f; --gold-deep:#a97e35; --gold-glow:rgba(227,179,92,.5);
--copper:#c98a4b; --copper-bright:#e8b58a;
--silver:#cdd8ec; --teal:#8fd0c2; --err:#d98a6a; --ok:#9ed9a8;
--hairline:rgba(228,209,164,.15); --hairline-soft:rgba(228,209,164,.07);
--ease-out:cubic-bezier(.23,1,.32,1); --ease-io:cubic-bezier(.77,0,.175,1);
--font-display:'Marcellus',serif; --font-body:'Geist',sans-serif;
--font-mono:'Geist Mono',monospace; --font-quran:'Amiri Quran','Amiri',serif; --font-ar:'Amiri',serif;
```
**Fonts**: Google Fonts — Amiri+Quran, Amiri (400/700/italic), Marcellus, Geist 300-600, Geist Mono 400/500.

**Class inventory**:
- `.frame`/`.frame-in` — bordered gradient panel, `data-label` rendered by `::before{content:attr(data-label)}` as tab label cut into top border.
- `.rulebox`/`.rulebox-in`/`.rulebox.warn` — gradient-border rule card (outer div = gradient bg, inner = solid #0a0d1a); `.warn` = copper.
- Rail: `.rail` (sticky 250px sidebar, hidden <980px) → `.station` buttons with `.pip` numbered badge, `.lit`/`.past` from scrollspy.
- Console: `.console` → `.c-top` titlebar w/ `.dots` traffic lights, `.c-ar` clickable word-by-word Amiri Quran line, `.readout` 3-col grid (Word/Meaning/status of last-clicked word), `.c-foot` translit+translation.
- Specimen chips: `.spec-chip` (+`.c-tag` corner label) → populate `.anatomy` panel of `.a-seg` boxes classed `.al`/`.stem`/`.end`/`.gone`.
- Engine markup: `#transformer`/`#engine`, `#t-word`/`#e-word` big Arabic display, `.t-controls`/`.persons`+`.roots` buttons, `.t-log`/`.e-note` narration log, `.t-particles` burst.
- Exercises: `.exercise.open` accordion via max-height transition, `.ex-q`/`.ex-a`/`.ex-toggle` (rotates 45°).
- Misc: `.plate`/`.plate-scroll` table wrapper, `.reg-grid`/`.reg.sunr`/`.moonr` sun-moon letter grid, `.pager`/`.page-link`, `.done-btn`.

**Blueprint grid**:
```css
body::before{content:'';position:fixed;inset:0;z-index:-1;pointer-events:none;
  background-image:linear-gradient(rgba(228,209,164,.033) 1px,transparent 1px),
    linear-gradient(90deg,rgba(228,209,164,.033) 1px,transparent 1px);
  background-size:64px 64px;
  -webkit-mask-image:radial-gradient(120% 100% at 50% 0%,#000 30%,transparent 80%);
  mask-image:radial-gradient(120% 100% at 50% 0%,#000 30%,transparent 80%)}
```

**No-JS/reduced-motion**: `documentElement.classList.add('js')` first; CSS keys `html:not(.js)` to hide JS-dependent chrome (readout, controls, veil; `.ex-a` max-height:none) → degrades to static prose. `matchMedia('(prefers-reduced-motion: reduce)')` checked before every timer; global reduced-motion rules zero `[data-reveal]`, veil, pulses. `#veil` boot screen dropped on `document.fonts.ready` + 2400ms fallback.

**JS mechanisms (lesson-3-lab)**: (1) shared IntersectionObserver for `[data-reveal]` → `.on` once; (2) rail scrollspy: percent = scrollY/(scrollHeight-innerHeight), current station = last section top above scrollY+38%vh, click → scrollIntoView; (3) SPECS array `[arabicText, class, label, note][]` + verdict per chip → renders `.a-seg`s into `#a-word`, counts "words touched"; (4) Transformer: `T` object keyed A/B with ordered `log` lines, `runTransform()` steps with timers, word swap + particle burst at tanween-eject; (5) consoles: `.w` spans carry `data-tr`/`data-en`/`data-st`, click/hover/focus copies into `.readout` + `.lit` highlight; (6) accordion toggle `.exercise.open`; (7) done-btn → localStorage (mockup key; port must wire progress.ts instead).

**lesson-5-lab-past difference**: Conjugation Engine — `PERSONS` (14: suffix, translit, Arabic pronoun, label, stem-behaviour 0/1/2) × `ROOTS` (كتب/نصر/ذهب); `.p-btn`/`.root-btn` → render() recomputes stem+suffix (combining-suffix strings preserve joining), updates `#e-word` + readout, narrates rule into `.e-note`; tracks unique persons "N / 13". **Bidi gotcha: wrap Arabic in `<bdi>` when mixing with Latin in one text node.**

## 6. progress.ts

`src/lib/progress.ts` — pure client localStorage, key `'quran-learn-progress'`, shape `{completedLessons: string[], lastUpdated}`. API: `isLessonComplete(slug): Promise<boolean>`, `markLessonComplete(slug): Promise<boolean>` (announces via `src/scripts/progress-announcer.ts`), `getCompletedLessons()`, `getLevelCompletionCount(level)` (prefix `level-{n}/`), `clearProgress()`. LessonLayout inline script (lines 636-675) derives slug from pathname (e.g. `level-3/14-verb-form-iv`), shows Completed status or wires button. **CourseNavigator hardcodes `completed={false}`** (line 95) — never reads progress.

## 7. Theme/tokens

- Themed pages: `src/styles/global.css` via BaseLayout — Tailwind + token partials, `:root` light (line ~14) + `[data-theme="dark"]` (~173). Key vars components use: `--bg-primary/secondary`, `--text-primary/secondary`, `--accent-gold`, `--border-primary`, `--font-arabic:'KFGQPC Hafs Uthmani','Amiri',...`, `--font-sans:'Crimson Pro'...`.
- Night pages: `src/styles/night.css` (61 lines) — shared always-dark chrome for the 3 section index pages: tokens above + `.nav`/`.brand`/`.nav-links`, `#veil`, `.btn-solid`/`.btn-ghost`, footer, `.skip-link`, `[data-reveal]`, `--pad-x:clamp(20px,5vw,72px)`, `color-scheme:dark`.
- `src/styles/fonts.css` is **PROTECTED/IMMUTABLE** — don't rename font-family strings; Arabic woff2s preloaded in BaseLayout head (lines 62-64), Google fonts loaded with media="print" onload swap (68-79).

## 8. Build & test

- `npm run dev` / `npm run build` (astro build && pagefind --site dist) / `npm run preview`.
- Node tests via tsx: `npm run test:site`, `test:lookup`, `test:verbs`.
- Playwright (`testDir: ./tests`, baseURL http://localhost:4321, webServer = `npm run preview`, **system Chrome channel** — never download Chromium, disk-constrained): `npm run test:fonts`, `npm run test:a11y`, others via `npx playwright test tests/<name>.spec.ts`.
- Lesson-touching specs: `lesson-wayfinding.spec.ts` (checks `[data-lesson-position]` "Lesson N of M", `[data-lesson-toc]` visible ≥1280px / hidden mobile, `.navigator-toggle--floating`; hits `/learn/level-3/14-verb-form-iv/`), plus `accessibility`, `audio` (ayah-play), `cards`, `components`, `font-verification`, `navigation`, `review-quiz`, `table-scroll`, `vocab`.
- **Selector contracts to preserve (or update specs deliberately)**: `data-lesson-position`, `data-lesson-toc`, `.navigator-toggle--floating`, `.ayah-play`.
- `shoot.mjs` harness in `.planning/redesign-v4-lessons/` — Playwright w/ system Chrome, file:// URLs, scroll-fraction screenshots + interaction probes → `./shots/`; adapt with baseURL/preview server for real pages.
