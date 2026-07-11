# Lab v4 Port — Progress

## Phase A — Skin (2026-07-11)

### What shipped
- `src/styles/lesson-lab.css` (new, global, imported only by LessonLayout): full lab token set redeclared under `.lab` (defensive against global.css/night.css collisions), blueprint grid (`.lab::before` fixed layer), station rail, briefing header, frame/rulebox/console/plate/DIAG chrome, done-btn, pager, CourseNavigator + floating-toggle night restyle, no-JS + reduced-motion rules. `#theme-toggle` hidden on lesson pages (would silently write the user's site-wide theme pref while looking at a forced-dark page).
- `src/layouts/LessonLayout.astro`: always-night via head-slot inline script setting `data-theme=dark` before paint + re-forcing on `astro:page-load`/`astro:after-swap`; NO localStorage writes. Imports night.css + lesson-lab.css + night Google-Fonts link (print/onload swap + noscript). Station rail built from `headings` (h2s), station 00 = Briefing; rail keeps `data-lesson-toc`, header keeps `data-lesson-position`. Rail stations are real `<a href="#slug">` anchors (no-JS works), progress % + words-touched telemetry. Completion = `.done-btn` wired to the untouched progress.ts script. Pager `.page-link` cards now resolve real prev/next lesson titles from the collection (quiz URLs → "Level Quiz"). Vocab section wrapped in a `frame` labelled "Specimen inventory". Breadcrumbs/CourseNavigator/NavigatorToggle/ReadingTrack/schemas untouched functionally.
- `src/scripts/lab-lesson.ts` (new): adds `html.js`, single IntersectionObserver for `[data-reveal]`, rail scrollspy (`.lit`/`.past`, 38%-viewport line), progress bar/%, `lab:word-touched` counter. Dedupe-safe across view transitions (module-level `scrollBound` guard); no innerHTML.
- `src/components/mdx/ArabicExample.astro`: renders `.console` — c-top (dots + reference), `.c-ar` of focusable `.w` `<button>`s (`<bdi>`-wrapped Arabic) with data-tr/data-en, 3-cell readout (Word/Meaning/Transliteration — no invented morphology field), c-foot with translit + translation + reference + `.ayah-play` (audio contract byte-identical). Highlighted words get `.al` gold. No-words → static `.c-ar`, no readout. Outer element keeps `arabic-example` class. Delegated click/focus handlers populate readout + dispatch `lab:word-touched`.
- `src/components/mdx/Callout.astro`: rule → `.rulebox` (gold gradient border), warning → `.rulebox.warn` (copper), tip → `.frame.tipf` (teal label), note → `.frame.notef` (silver label). `callout callout-{type}` classes preserved.
- `src/components/mdx/ExerciseBox.astro`: DIAG accordion — auto numbering via CSS counter (`counter-reset: diag` on `.lesson-content`, `::before` on question), "Result" kicker via `::after`-style ::before on the answer, aria-expanded + hidden semantics + astro:page-load re-clone untouched, `.open` class toggled for border accent.
- `GrammarTable` / `VerbConjugation`: untouched markup; skinned entirely via lesson-lab.css global table rules (covers all 3 table patterns: props-table, slot markdown table, bare markdown `.table-scroll` tables).

### Commits
- 323ed74 feat(lessons): anatomy-lab global stylesheet with night tokens and lab chrome
- 80c6cdd feat(lessons): rework LessonLayout as always-night lab with station rail, briefing header, pager
- 3b99b8b feat(lessons): ArabicExample renders as interactive verse console with readout
- 893547b feat(lessons): Callout rulebox/frame variants; ExerciseBox as DIAG accordion
- 695483a fix(lessons): unwrap invalid :global() in plain css, unblock blueprint grid, real pager titles
- 8ac6d51 docs(lessons): phase A progress notes and pilot screenshot harness

### Bugs found during verification (and fixed)
1. **`:global()` in a plain .css file is invalid** — 50 rules (all typography/table/heading skins) silently dropped; h2s rendered in Geist instead of Marcellus. Fixed by unwrapping all `:global(...)` — lesson-lab.css is ordinary global CSS, `:global()` only exists inside Astro scoped `<style>`.
2. **Blueprint grid invisible inside the column** — `.lab { background: var(--bg-0) }` painted above its own z-index:-1 fixed ::before. Fixed: background moved to `body { … !important }` (file only ships on lesson pages), `.lab` transparent.
3. **`data-reveal` on the whole `.lesson-content`** — a viewport-tall element can never hit the 5% intersection threshold reliably; content invisible on load. Removed (individual components carry their own data-reveal).
4. Toggle button (Show Answer) needed explicit flex layout after the old scoped styles were removed.

### Verification evidence
- `npm run build`: clean, 164 pages (multiple runs).
- `.planning/redesign-v4-lessons/port/shoot-port.mjs` (system Chrome, preview server): all 3 pilots OK, **zero console errors**, probes green:
  - rail station click scrolls ✓ (scrollY asserted)
  - console word click → readout populates + words-touched increments ✓ (l1/l3)
  - DIAG accordion expands (aria-expanded + visibility asserted) ✓
  - completion button → "Completed — lab signed off" status ✓
  - l5-17 capstone (no `words` anywhere) renders static consoles, no readout ✓
- Screenshots in `port/shots/` visually compared against `../shots/lesson-3-lab-*.png`: blueprint grid, gold-on-night, Marcellus headings with gold tick, labelled frames, consoles with dots+readout, station rail with pips/progress — recognizably the same design.
- `npx playwright test tests/lesson-wayfinding.spec.ts tests/audio.spec.ts` (system Chrome): **6/6 passed**, zero spec modifications needed.
- `npx tsc --noEmit`: 22 errors before AND after — all pre-existing (capacitor.config.ts, scripts/lib/word-index.test.ts), none in touched files.

### Deviations from blueprint
- Readout 3rd cell = Transliteration (blueprint explicitly allows; WordEntry has no morphology data).
- Rail stations are `<a>` not `<button>` — degrades to native anchor jumps with no JS; JS intercepts for smooth scroll.
- Mockup hero extras (spec-strip animation, hint chips, "Lab open" live dot, rel-grid related-lesson cards) are mockup *content*, not layout — real headers come from frontmatter. Rel-grid could be derived from curriculum-map later if wanted.
- No #veil (per blueprint).

### Landmines for Phase B
- **lesson-lab.css is plain CSS — never use `:global()` in it** (it silently drops the rule; see bug 1).
- The blueprint grid relies on `.lab` having NO background; if an engine needs an opaque section bg, put it on the section, not `.lab`.
- DIAG numbering is a pure CSS counter on `.lesson-content` — an engine that adds its own `.exercise-box` outside `.lesson-content` won't get a number.
- `lab:word-touched` is a document-level CustomEvent; engines should dispatch the same event to feed the rail counter.
- Engine components go in `src/components/mdx/lab/`; import them per-lesson in MDX (no global component map — see BRIEF §2).
- ExerciseBox's astro:page-load re-clone wipes listeners other scripts attach to `.toggle-answer` — attach engine listeners elsewhere.
- The always-night forcing script lives in LessonLayout's head slot; Phase B pages get it for free. Header theme toggle is display:none'd on lesson pages only.
