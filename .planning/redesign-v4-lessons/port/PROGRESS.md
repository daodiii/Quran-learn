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

## Phase B — Engines (2026-07-11)

### What shipped
- `src/components/mdx/lab/MorphTransformer.astro`: al- attachment "run the machine" demo. Props `{ specimens: {id,base,result,kind:'moon'|'sun',log:string[]}[] }`. Data pulled from DOM `data-spec-*` attributes (JSON-encoded `log`) by a single delegated script — no `define:vars`, no per-instance inline data blobs, matching the rest of the codebase's convention (ArabicExample/lab-lesson.ts). Typed log narration with per-line hot/warn classification derived from line content + `kind` (not hardcoded indices), particle burst + word swap at the tanween-ejection line, reduced-motion-aware timers (350ms/0ms vs 780ms/360ms, ported verbatim from the mockup). No-JS: controls + log hidden, static "before" word/caption stay visible.
- `src/components/mdx/lab/SpecimenChips.astro`: word-anatomy dissection tray. Props `{ specimens: {word,tag,segments:{text,part,label,note?}[],verdict}[] }`. Chip click renders segments (createElement, no innerHTML) into the anatomy panel; verdict line goes through a `<bdi>` wrapper since it can mix Arabic letter-names with English narration in one sentence. No-JS: anatomy panel has no `.show` class by default so it stays hidden (same pattern as the readout hiding under no-JS in Phase A); chips themselves stay visible as static info.
- `src/components/mdx/lab/ConjugationEngine.astro`: past-tense (al-māḍī) paradigm engine. Props `{ roots: {id,letters,gloss,stem}[], persons: {suffix,tr,pronoun,label,behaviour:0|1|2}[] }`. Word = `root.stem + person.suffix` (combining marks preserved); three fixed narration templates keyed by `behaviour` (0 base / 1 third-person direct-attach / 2 sukūn-then-suffix) live in the component, not in data — matches the blueprint's explicit intent. Local coverage counter ("Persons run: N / total", deduped by person index) is separate from the document-level `lab:word-touched` dispatch (undeduped, feeds the shared rail counter like every other console) — the two serve different UI, both required by the verification checklist. Arabic pronoun/suffix/root-letters tokens are `<bdi>`-wrapped since they sit inside otherwise-English sentences. No-JS: persons/roots/note/readout/progress hidden (mirrors mockup exactly); the citation-form word/gloss stay visible as static content.
- `data-label` on the engine frame reads "Conjugation engine · past tense (al-māḍī)" (generic) rather than the mockup's hardcoded "· فَعَلَ Form I" — this component is reused across Forms I/II/III/IV/V and the label would otherwise misdescribe non-Form-I instances.

### Wiring
- `level-1/06-definite-article.mdx`: `SpecimenChips` (4 specimens — kitābun/al-kitābu, rajulun/ar-rajulu) placed right after the "Examples" bullet list and before "Notice:" (mirrors mockup station order: specimens before the summary table). `MorphTransformer` (2 specimens, same kitab/rajul pair) placed at the top of "Sun Letters and Moon Letters" section, right after the "why sun/moon" paragraph and before the detailed breakdown (run-it-yourself experience before the theory, mirroring mockup's Specimens → Transformer → Registry order). All Arabic strings verified byte-exact against both the mockup source and the lesson's own pre-existing text (Python substring check, not eyeballing).
- `level-3/03-past-tense.mdx`: the existing static `<VerbConjugation>` (13-person كتب/nasar/dhahab paradigm) was **replaced** by `<ConjugationEngine>` in place — this lesson IS the source the engine was designed from, so upgrading beats running both a static table and an interactive engine side by side. `VerbConjugation` import removed (no longer used in this file).

### VerbConjugation evaluation (14 files, ~20 usages)
Judged per-instance (not per-file) by decomposing every row into a common stem prefix and checking the suffix set was consistent (verified programmatically, not by eye — see the byte-level Python checks in this session's transcript).

**Upgraded to ConjugationEngine** (6 instances, all verified stem+suffix-clean):
- `level-3/12-verb-form-ii.mdx` (عَلَّمَ, Form II, 8 persons) — VerbConjugation import removed.
- `level-3/13-verb-form-iii.mdx` (قَاتَلَ, Form III, 8 persons) — VerbConjugation import removed.
- `level-3/15-verb-form-v.mdx` (تَعَلَّمَ, Form V, 8 persons) — VerbConjugation import removed.
- `level-3/14-verb-form-iv.mdx` instance 1 only (أَسْلَمَ past, 8 persons) — instance 2 (present tense) stays on VerbConjugation, import kept.
- `level-4/14-assimilated-verbs.mdx` instance 2 only (وَجَدَ past, 13 persons — assimilated verbs are only irregular in present tense; past tense is fully regular) — instance 1 (present-tense sound-vs-assimilated comparison) stays, import kept.
- `level-4/15-hamzated-verbs.mdx` instance 1 only (أَمَرَ past, 13 persons — initial hamza is a fixed root consonant here, not a variable person prefix) — instance 2 (سَأَلَ past+present comparison in one call) stays, import kept.

**Left on VerbConjugation, with reason** (documented per blueprint instruction):
- `level-3/04-present-tense.mdx`, `05-subjunctive-jussive.mdx`, `06-imperative.mdx` — present/subjunctive/jussive/imperative use a completely different morphology (variable prefix يَ/تَ/أَ/نَ + mood-ending suffix), not the past-tense stem+suffix model this engine encodes.
- `level-3/07-passive-voice.mdx` (both instances, incl. the past-tense one) — these are two-column Active/Passive **comparison** tables; ConjugationEngine only shows one word at a time, so upgrading would lose the side-by-side contrast that's the whole pedagogical point.
- `level-3/16-verb-form-vi.mdx` — otherwise a clean past-tense Form VI candidate, EXCEPT the "we" form تَعَاوَنَّا assimilates the root-final ن with the ـنَا suffix into a shadda (نَّا), not the standard sukūn+نَا pattern every other regular verb uses. The engine's fixed behaviour-2 narration ("middle letter takes sukūn…") would be factually wrong for that one cell, so left alone rather than risk a grammatically incorrect auto-generated explanation.
- `level-4/12-hollow-verbs.mdx`, `13-defective-verbs.mdx` (all instances) — hollow/defective verbs are weak-root verbs where the root letter itself (و or ي) mutates or drops per person (قَالَ → قُلْتَ, هَدَىٰ → هَدَوْا) — the "constant stem + variable suffix" model is fundamentally violated, that irregularity is the entire teaching point of these lessons.
- `level-4/14-assimilated-verbs.mdx` instance 1, `level-4/15-hamzated-verbs.mdx` instance 2 — present tense / mixed tense, as above.

**Out-of-scope bug found while evaluating (not fixed, flagged separately):** `VerbConjugation.astro` doesn't implement a `question`/`soundRoot`/`hollowRoot` prop API and has no `<slot/>`, but `level-4/12-hollow-verbs.mdx`, `13-defective-verbs.mdx`, and the non-upgraded instances of `14-assimilated-verbs.mdx`/`15-hamzated-verbs.mdx` call it with exactly that unsupported API + markdown-table children. Verified via built HTML: the table renders with an empty root and no rows — completely broken in production, pre-dating this branch, unrelated to the lab redesign. `level-4/03-conditional-sentences.mdx` also has a dead `VerbConjugation` import (0 usages). Spawned as a follow-up task (task_d6f60483) rather than fixed here — out of Phase B's scope (engine porting, not pre-existing content bugs).

### Commits
- ba03a79 feat(lessons): anatomy-lab engine components (transformer, chips, conjugation)
- fefaf14 feat(lessons): wire MorphTransformer + SpecimenChips into L1.06
- f68d787 feat(lessons): replace static VerbConjugation with ConjugationEngine in L3.03
- 05348c8 feat(lessons): upgrade 6 regular-stem VerbConjugation tables to ConjugationEngine

### Verification evidence
- `npm run build`: clean, 164 pages, twice (once after engine wiring, once after the VerbConjugation batch).
- `port/shoot-port.mjs` extended with engine probes (transformer run → word swap + `.hot` class + log lines; specimen chip click → anatomy segments + `.show` class; conjugation engine person/root click → word change + progress counter increments) and a 4th pilot page (`l3-12-verb-form-ii`, an upgraded VerbConjugation lesson). All 4 pages **OK, zero console errors, zero probe failures**.
- Screenshots (`port/shots/*-10-transformer.png`, `*-11-chips.png`, `*-12-engine.png`) visually compared against the mockup design language: gold-on-night machine log with hot/warn coloring, anatomy segments correctly classed (al/stem/end) in RTL row-reverse order, conjugation readout grid + person/root button grids + progress counter — all match.
- `npx tsc --noEmit`: 22 errors, all in the same 3 pre-existing files as Phase A's baseline (`capacitor.config.ts`, `scripts/lib/word-index.test.ts`, `src/lib/lookup-search.test.ts`) — zero in any touched file.
- `npx playwright test tests/lesson-wayfinding.spec.ts tests/audio.spec.ts tests/components.spec.ts` (system Chrome): lesson-wayfinding **4/4 passed**, audio **2/2 passed** — zero regressions. `components.spec.ts` failed 24/25: investigated and confirmed **pre-existing, unrelated to this branch** — `src/pages/test/components.astro` (the page under test) was deleted in commit 3c33190, long before `feat/lesson-lab-v4` branched off (`git merge-base --is-ancestor` confirms it's an ancestor of HEAD), and the Playwright spec was never removed to match. Every test hits a 404 page; the one test that "passes" (`full page snapshot in light mode`) does so only because its stored baseline PNG happens to match a blank/404 render. Not touched by Phase B; not a Phase B regression. Spawned as a follow-up (task_8bcac882).

### Deviations from blueprint
- ConjugationEngine's frame `data-label` is generic ("past tense (al-māḍī)") rather than form-specific, since the same component instance data spans Forms I/II/III/IV/V/hamzated across lessons.
- SpecimenChips' verdict is rendered as a single plain sentence (no selective bolding of the transliteration like the mockup's `[text,bold?]` tuple array) since the prop contract is a plain `string`, not a rich-text array — inventing a richer verdict shape wasn't in the settled contract.

### Landmines for Phase C
- The 3 engine components each own an independent delegated-listener script scoped by `querySelector`/`dataset` guards (`data-mt-bound`, `data-chips-bound`, `data-ce-bound`) keyed per root element, not per-page — safe if a lesson ever needs two instances of the same engine.
- `ConjugationEngine`'s `persons` array is authored per-lesson (not shared/imported) — each of the 7 lessons using it has its own literal suffix/pronoun/label data; there is no central "standard persons array" to keep in sync, by design (matches BRIEF §3: engine data lives in MDX, not in a shared module).
- The level-4 weak-verb lessons (`12-hollow-verbs.mdx`, `13-defective-verbs.mdx`) currently render broken/empty VerbConjugation tables (pre-existing bug, see above) — Phase C's full-site sweep and screenshot sampling will hit these pages; don't mistake the empty tables for a Phase C regression.
- `tests/components.spec.ts` will keep failing 24/25 in any future full-suite run until someone either restores `src/pages/test/components.astro` or deletes the stale spec — flagged as task_d6f60483's sibling issue, not actioned in Phase B/C.

## Phase C — Sweep (2026-07-11)

### Weak-verb table fix (the pre-existing VerbConjugation bug)
- **Approach chosen:** added the missing `<slot/>` fallback + the three unsupported props (`question`, `soundRoot`, `hollowRoot`) to `src/components/mdx/VerbConjugation.astro` — the lowest-risk fix, preserving every Arabic string byte-exact (MDX children are re-rendered verbatim, nothing edited in the 4 lesson files). Mirrors the pattern `GrammarTable.astro` already uses (props-API → own table; no props → `<slot/>`). `root` made optional. `question` renders as a caption, `soundRoot`/`hollowRoot` as a paired root header (`.verb-root-row`). Slotted markdown tables/prose are skinned via `.table-wrapper.slotted :global(...)` in the component + one `.lab .verb-question` rule in lesson-lab.css. Commit **8df58f2**.
- **Evidence (built HTML, `dist/learn/level-4/...`):** all 4 lessons now emit their comparison tables — hollow: `<table>`×5, defective ×7, assimilated ×4, hamzated ×6; every checked Arabic form present (قَالَ/قُلْتَ, هَدَىٰ/هَدَيْتَ, يَجِدُ/أَجِدُ, سَأَلَ/يَسْأَلُ = true); `verb-question` + `verb-root-row` present on all 4. Previously these `<slot/>`-less calls rendered an empty header and zero rows. Screenshot `l4-12-hollow-verbs-3-b.png` shows the full kataba/qāla side-by-side paradigm rendered on the lab skin.

### Build
- `npm run build` (cold, after `rm -rf node_modules/.astro .astro dist`): **clean, 164 pages, 185s**, Pagefind indexed 164 pages. Zero errors/warnings.

### Screenshot sweep (`port/shoot-sweep.mjs`, system Chrome, preview server — commit 866301c)
12 lessons (2+/level incl. all 4 fixed weak-verb lessons + dense-GrammarTable lessons), top + 4 scroll fractions each (60 PNGs in `port/shots-sweep/`). **Every page reported OK — zero console errors, zero page errors.**
| Level | Lessons sampled | Verdict (read subset) |
|---|---|---|
| 1 | 06-definite-article, 08-singular-dual-plural | Blueprint grid, station rail w/ pips+progress%, gold-on-night verse consoles + readout, Marcellus gold-tick headings — coherent |
| 2 | 06-genitive-case, 11-kaana-sisters | Dense GrammarTables render as night plates, consoles fine |
| 3 | 03-past-tense (ConjugationEngine), 14-verb-form-iv | Engine person/root grids + "Persons run" counter, gold table plates — coherent |
| 4 | 12/13/14/15 weak verbs | **Fixed** comparison tables + irregular-imperative plates render fully; briefing header, DIAG accordions, pager all correct |
| 5 | 17-capstone-cold-read (no-words), 14-word-order-emphasis | Static consoles (no readout) correct; DIAG "Show answer", taqdim comparison plate, footer/pager coherent |
Nothing broken/overlapping/unstyled across the read subset.

### Test matrix (system Chrome; node via tsx)
| Suite | Result | Notes |
|---|---|---|
| lesson-wayfinding.spec.ts | **4/4 pass** | real lesson pages |
| audio.spec.ts | **2/2 pass** | audio contract intact |
| table-scroll.spec.ts | **4/4 pass** | lesson + surah tables wrapped, no page overflow |
| vocab.spec.ts | **3/3 pass** | specimen inventory / no-vocab / review page |
| accessibility.spec.ts | 27 pass / **8 fail — all pre-existing** | 7 fails → deleted `/test/cards/` & `/test/components/` pages (404); 1 fail (line 47) → `/surahs/001-al-fatiha/` contrast, a surah page my branch never touches (see below). All real lesson/quiz/resources axe scans pass. |
| navigation.spec.ts | **0/35 — all pre-existing** | every test `goto('/test/navigation/')`, a page deleted on `main` before this branch. Suite also *hangs* the mobile-overlay tests against the 404 (run these in isolation / expect the stall). |
| cards.spec.ts | **0/20 — all pre-existing** | every test `goto('/test/cards/')`, deleted page; visual-regression baselines stale. |
| `npm run test:site` | **15/15 pass** | curriculum-map, lesson-vocab, ayah-ref, reading-track, review-questions |

### Pre-existing-failure confirmation (not regressions)
- `git diff --name-only main..HEAD` = **every changed file is lesson-scoped** (mdx components, LessonLayout, lab engines, lesson-lab.css, 9 lesson .mdx, planning docs). Zero surah/shared/global-token files.
- `/test/cards`, `/test/navigation`, `/test/components` were **already deleted on `main`** (`git cat-file -e main:src/pages/test/cards.astro` → absent; delete commit 3c33190 is an ancestor of HEAD). This branch never touched those pages or their specs → navigation/cards/`/test/*`-accessibility failures are the task_8bcac882 family, identical to baseline.
- The one surah-page accessibility failure (line 47) is provably baseline-identical: `lesson-lab.css` is imported **only** by `LessonLayout.astro`; surah pages use `SurahLayout.astro`, so the lab skin never ships to them, and no surah source changed — the built surah HTML is byte-identical to `main`.

### Open issues for Phase D
- **Stale `/test/*` specs (task_8bcac882):** `navigation.spec` (35), `cards.spec` (20), most of `accessibility.spec`'s failures, and `components.spec` all test pages deleted on `main`. Someone should either restore the `src/pages/test/*` pages or delete the four stale specs + their snapshot dirs. Out of Phase C scope (not a redesign regression). Note `navigation.spec` hangs the full-suite run on its mobile-overlay tests against the 404 — a reason to prune it.
- No redesign regressions found; nothing blocking the Phase D web-design-guidelines + code-review pass.

## Phase D — Audit + Code Review + PR (2026-07-12)

### Design audit (web-design-guidelines)
Applied HIGH-confidence, low-risk fixes only (no restyle away from the mockup):
- `transition: all` → explicit property lists on `.pip`, `.t-btn`, `.root-btn` (compositor-friendly, guideline anti-pattern).
- `aria-current="location"` on the active station rail item (rendered default + updated in the scrollspy).
- `aria-pressed` state on every toggle-style control: console word buttons (ArabicExample), specimen selector + chips (MorphTransformer/SpecimenChips), person/root groups (ConjugationEngine).
- `Saving…` ellipsis (typography) in the completion button.
- Callout note/tip title is a CSS `::before` (invisible to AT) → added `aria-label={displayTitle}` on the note/tip `<aside>`.

### Code review (8 finder angles → verify)
Real bugs fixed:
1. **ConjugationEngine "undefined" transliteration** (line-by-line + confirmed in built HTML). `RootEntry` had no `tr` field but the component reads `firstRoot.tr`, so L3.03 shipped `<b>undefineda</b> — to write` on load, and interaction dropped the root translit entirely (`data-root-tr` empty). Added `tr` to `RootEntry` + supplied stem romanizations for all 10 roots across the 7 engine lessons. Verified built HTML now renders `kataba`.
2. **Shared-component off-lesson regression** (cross-file tracer — highest severity, missed by A–C which only tested lesson pages). ArabicExample (38 surahs + 7 resources), Callout (38+9), ExerciseBox moved all chrome into `.lab`-scoped lesson-lab.css, which never ships to surah/resource pages → those components rendered completely unstyled there. Fixed by restoring self-contained base skins in the components, gated under `:global(.prose)` (the SurahLayout/ResourceLayout MDX wrapper). Verified: surah console now has light bg/border/radius; lesson console keeps the lab gradient/gold-hairline/14px (base did NOT leak — confirmed via computed styles).
3. **MorphTransformer uncancelled timers** (line-by-line). Switching specimen / resetting mid-narration left the previous run's `setTimeout` chain firing onto the new specimen. Tracked pending timers, cancel on load/reset/run.
4. **lab-lesson.ts scrollspy index misalignment** (line-by-line, latent). `targets` was filtered independently of `stations`; if a target id ever failed to resolve the two arrays desynced and the wrong station lit. Reworked to a single paired array so they can't drift.
5. **Empty catch on data-* JSON.parse** (CLAUDE.md conventions — "never silently swallow exceptions"). Added `console.error` with context in MorphTransformer + SpecimenChips (re-throw would break the handler; log-and-fallback is correct).

Deferred (documented, not fixed): shared-helper extraction across the 3 engines (reuse/simplification/altitude angles — a refactor that fights the faithful-port mandate); the always-night forcing + `#theme-toggle` hide + `.lab` token redeclaration (settled Phase-A architecture, "do not reopen", and the OS-theme-flip concern is neutralized because `.lab` redeclares all tokens regardless of `data-theme`); station rail `<ol>` list semantics + conditional render (medium-risk to the verified flex-layout rail); per-person English gloss / root-specific pattern notes dropped by the VerbConjugation→ConjugationEngine upgrades (deliberate Phase-B tradeoff, taught in surrounding prose). The L4.15 "2nd dual" row merge is correct (Arabic 2nd-dual is gender-invariant).

### Re-verification
- `npm run build`: clean, **164 pages**, Pagefind indexed 164.
- `npx tsc --noEmit`: 16 errors, ALL pre-existing (`lookup-search.test.ts`, `word-index.test.ts`, `capacitor.config.ts`) — **zero in any touched file** (.astro not type-checked by tsc regardless).
- `npx playwright test lesson-wayfinding + audio + table-scroll + vocab` (system Chrome): **13/13 passed** (table-scroll also exercises a surah page). Zero console errors on the surah + lesson verification shoot.

### PR
See PR link in the final report / branch feat/lesson-lab-v4.
