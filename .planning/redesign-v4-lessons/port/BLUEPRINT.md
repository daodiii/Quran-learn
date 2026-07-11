# BLUEPRINT: Anatomy Lab → 81 real lessons (feat/lesson-lab-v4)

Authored by the orchestrator (Fable) 2026-07-11. Read BRIEF.md (same dir) first — it has all codebase facts.
Reference spec = `.planning/redesign-v4-lessons/lesson-3-lab.html` (L1.06) + `lesson-5-lab-past.html` (L3.03). These ARE the design; port faithfully, don't redesign.

## Decisions (settled — do not reopen)

1. **Keep BaseLayout under LessonLayout; force always-night.** Do NOT rebuild standalone `<html>` ×81 — lesson pages carry schemas, audio, view-transition scripts, and 9 Playwright suites with selector contracts. Mechanism:
   - LessonLayout injects (via BaseLayout head slot) an early inline script that sets `document.documentElement.dataset.theme='dark'` before paint AND re-forces it on `astro:page-load` / `astro:after-swap`. Do not write to localStorage (rest of site keeps user's choice).
   - `import '../styles/night.css'` + new `src/styles/lesson-lab.css` (global, not scoped) in LessonLayout.
   - All lab styling is written against **night tokens** (`--bg-0`, `--gold`, `--hairline`…) + lab-only additions (`--bg-1`, `--bg-panel`, `--bg-cell`, `--copper`, `--silver`, `--teal`, `--err`, `--ok`, `--ease-out`, `--ease-io`) defined at the top of lesson-lab.css under a `.lab` scope or `:root` — so the header theme toggle can't break the lab look. Hide/omit the theme toggle within lesson pages if Header shows one.
   - Add the night Google-Fonts link (Marcellus, Geist, Geist Mono, Amiri, Amiri Quran — exact URL in BRIEF §5) to LessonLayout's head slot with the same non-blocking pattern BaseLayout uses.
   - Fallback (only if pilot proves theme-fighting unfixable): standalone night page per `standalone-night-pages-pattern` memory. Escalate in PROGRESS.md, don't silently switch.

2. **Skin-first, engines-second.** Everything except the per-topic centerpiece lands by re-skinning the layout + the 4 shared MDX components. That covers all 81 lessons with zero per-lesson authoring. Engines are additive MDX components applied to specific lessons afterwards.

3. **Arabic stays in MDX.** Never copy Arabic strings from mockup HTML into content. Engines receive data via props authored in the lesson MDX (L1.06/L3.03 engine data may be transcribed from the mockups ONLY for those two lessons' MDX, verified byte-exact against the existing MDX words where overlapping).

## Target anatomy of a ported lesson page

- Root: `.lesson-grid` gains class `lab` (scope hook for all lab CSS).
- **Blueprint grid** on the lesson main (body::before technique from BRIEF §5 — apply to a `.lab::before` fixed layer instead of body, since body is shared chrome).
- **Station rail** (left, sticky, ≥1280px; replaces the current TOC rail — keep `data-lesson-toc` attr on it so lesson-wayfinding.spec passes): stations = h2 `headings` already passed to LessonLayout, numbered 01..N, `.lit`/`.past` scrollspy, top hairline progress bar + % readout, telemetry counter "words touched" (increments on console word clicks — a custom event `lab:word-touched` dispatched by ArabicExample, listened by rail script). Station 00 = "Briefing" (the header). Clicking scrolls to heading.
- **CourseNavigator + mobile floating toggle: KEEP as-is functionally**; restyle chrome minimally via lesson-lab.css to not clash (night surfaces). `.navigator-toggle--floating` must survive.
- **Header block** = Lab briefing: level badge → `.pip`-style tag, "Lesson X of Y" (`data-lesson-position` preserved), h1 in Marcellus, Arabic title in Amiri, description as `.ink-dim` lede.
- **ArabicExample → verse console** (this is the highest-value automatic win, 679 instances):
  - With `words`: render `.console` — `.c-top` (dots + `reference` or "SPECIMEN" label), `.c-ar` with each word a focusable `.w` `<button>`/span carrying `data-tr`/`data-en` (+`data-st` optional), `.readout` 3 cells (word/translit/meaning; 3rd cell = translit since morphology data doesn't exist in WordEntry — do NOT invent a status field), `.c-foot` with `transliteration` + `translation` + existing `.ayah-play` Listen button (audio contract intact).
  - Without `words`: static console (`.c-ar` non-interactive, no readout). Keep `highlight`/`grammar-highlight` behavior.
  - Keep component class `arabic-example` on the outer element for test/style compat.
  - JS: one small module (e.g. `src/scripts/lab-console.ts` or inline component script with `astro:page-load` dedupe like ExerciseBox) — click/hover/focus populates readout, `.lit` word highlight, dispatches `lab:word-touched` (count unique per page). No innerHTML (Write-hook flags it) — createElement/textContent. Wrap Arabic in `<bdi>` when mixed with Latin.
- **Callout → lab variants**: `rule`→`.rulebox` gold gradient-border card; `warning`→`.rulebox.warn` copper; `tip`→`.frame.tipf` (teal label); `note`→`.frame.notef` (silver label). Keep `<aside class="callout callout-{type}">` classes, add lab classes/DOM as needed. `data-label` = existing title logic.
- **ExerciseBox → diagnostic accordion**: "DIAG 01…" numbering (auto-increment per page via CSS counter or script), `.exercise` accordion with max-height transition + 45° toggle. MUST keep `aria-expanded` + hidden-answer semantics and the astro:page-load re-clone pattern. No-JS: answers visible (html:not(.js) collapses to static).
- **GrammarTable → plate**: `.plate`/`.plate-scroll` skin on `.table-wrapper` + table styling for all three table patterns (props-table, slot-markdown-table, bare markdown table — bare tables styled via `.lab .lesson-content table` global rules).
- **VerbConjugation**: Phase B target; Phase A just makes it visually coherent on night (plate-style skin).
- **VocabList section → frame** labelled "SPECIMEN INVENTORY" (or similar); ReadingTrack restyled to night surface.
- **Completion** = `.done-btn` wired to existing progress.ts logic (keep current script/IDs).
- **Pager** = `.pager`/`.page-link` prev/next.
- **Reveal-on-scroll** `[data-reveal]` on major blocks; single IntersectionObserver; disabled under reduced-motion.
- **No #veil boot screen on real lesson pages** (works against reading flow + view transitions; the mockup veil was a demo flourish). 
- **No-JS + reduced-motion**: follow mockup pattern (`html.js` class added by early script; everything degrades to static readable prose).
- Breadcrumbs: keep, restyle to `.ink-faint` mono.

## Engine components (Phase B) — data-first contracts

Place in `src/components/mdx/lab/`. Props are the contract; validate shapes, fail loudly.

```ts
// MorphTransformer.astro — L1.06-style al- attachment demo
Props {
  specimens: Array<{
    id: string; base: string; result: string;      // كِتَابٌ → ٱلْكِتَابُ
    kind: 'moon'|'sun';
    log: string[];                                  // typed machine-log lines
  }>;
}

// SpecimenChips.astro — word-anatomy dissection
Props {
  specimens: Array<{
    word: string; tag: string;                      // chip label
    segments: Array<{ text: string; part: 'al'|'stem'|'end'|'gone'; label: string; note?: string }>;
    verdict: string;
  }>;
}

// ConjugationEngine.astro — past-tense paradigm engine
Props {
  roots: Array<{ id: string; letters: string; gloss: string; stem: string }>; // stem with combining suffixes preserved
  persons: Array<{ suffix: string; tr: string; pronoun: string; label: string; behaviour: 0|1|2 }>;
  // behaviour: 0 base / 1 third-person direct / 2 sukūn-then-suffix — narration templates in component
}
```

Phase B wiring: L1.06 gets MorphTransformer + SpecimenChips; L3.03 gets ConjugationEngine (data transcribed from mockups, Arabic verified). Then evaluate the 14 VerbConjugation lessons: if their existing props map cleanly onto ConjugationEngine, upgrade them; otherwise leave VerbConjugation skinned. Do NOT invent new engine types this session.

## Phases & verification

- **Phase A (skin)**: lesson-lab.css + LessonLayout rework + 4 component skins + console JS + rail. Pilot pages: `/learn/level-1/06-definite-article/`, `/learn/level-3/03-past-tense/`, `/learn/level-5/17-capstone-cold-read/` (the no-words edge case). Verify: `npm run build` clean; adapt shoot.mjs → `port/shoot-port.mjs` (preview server, not file://) and screenshot pilots top-to-bottom + interaction probes (console word click → readout, DIAG accordion, completion button, rail click); zero console errors.
- **Phase B (engines)**: components + L1.06/L3.03 wiring + VerbConjugation evaluation. Same verification + engine probes.
- **Phase C (sweep)**: full build; run test suites (`test:site`, playwright lesson-wayfinding/audio/a11y/components/table-scroll/vocab/navigation); screenshot-sample ≥2 lessons per level (10 total); fix all failures.
- **Phase D (audit)**: web-design-guidelines pass + code review; then PR.

Commit incrementally per milestone (conventional commits, no AI mentions). Update `port/PROGRESS.md` after every phase: what's done, errors hit, test evidence.

## Gotchas (from hard-won memory — respect these)

- Astro scoped CSS can't see runtime-created DOM or ancestor scope hooks → use `:global()` or the global lesson-lab.css for anything the console/rail scripts create. (astro-css-gotchas)
- `<bdi>` around Arabic mixed with Latin in one text node.
- No `innerHTML` — a Write-hook flags it; use createElement/textContent.
- Phantom build errors "Cannot find module dist/chunks" / UnknownContentCollectionError → `rm -rf node_modules/.astro .astro dist` and rebuild cold. (astro-stale-cache-build-failure)
- `fonts.css` is immutable; never rename font families.
- Playwright must use system Chrome channel; never download Chromium (disk).
- Tailwind preflight `[hidden]` display:none can fight custom accordion CSS — keep ExerciseBox's hidden-attribute semantics deliberate.
- Amiri Quran descenders overlap: `.c-ar`-type lines need generous line-height (mockups used 1.55+ and margin fixes).
