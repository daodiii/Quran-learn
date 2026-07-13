# Surah pages → Anatomy Lab + I'rab Decoder — design spec

**Date:** 2026-07-13
**Status:** Approved (design + mockup signed off by user)
**Reference mockup:** `.superpowers/brainstorm/76696-1783969607/content/surah-lab.html` (Surah Al-ʿAsr, fully interactive)

## Summary

Bring the 38 surah analysis pages up to the same visual + interactive standard as the
81 lessons, which shipped the **Anatomy Lab** treatment in PR #13 (merged). Surah pages
currently use the plain, themed `SurahLayout.astro` — basic prose, a small header, a
back link — and got none of the Lab. This is the last major learning surface still on
the old look.

Two deliverables:

1. **Lab shell** on all 38 surahs — always-night, blueprint-grid backdrop, sticky
   station rail with progress % + telemetry, and the automatic Lab skins for the shared
   MDX components (`ArabicExample` → verse console, `Callout` → rulebox/frame,
   `ExerciseBox` → DIAG accordion, `GrammarTable` → engraved plate). These come almost
   entirely free once the surah grid carries the `.lab` hook and loads the lab CSS +
   script — because those components already ship Lab skins.

2. **The I'rab Decoder** — a bespoke, surah-native centerpiece. One unified reading
   console that stitches the whole surah together; tap any word to decode its full
   *iʿrāb* (root · morphology · case · function · meaning), or flip a lens to light up
   every word of one grammatical kind (particles / genitive / accusative / verbs) at
   once. Generated automatically for all 38 surahs from data that already exists in the
   MDX. This is the "same brain power as the lesson engines," aimed at reading
   comprehension rather than one grammar topic.

## Goals

- Every surah page feels like the merged lesson Lab: always-night, station rail, verse
  consoles, DIAG diagnostics, completion + pager.
- A signature I'rab Decoder on every surah, driven by generated data — **zero
  per-surah hand-authoring** of the decoder.
- Byte-exact Arabic preserved (never re-typed; sourced from the real MDX).
- No regression to the shipped `/surahs` **index** page (Astrolabe Royale) or to the
  lessons/resources surfaces that share the same MDX components.

## Non-goals

- Do **not** touch the `/surahs` index (Astrolabe) — that shipped in PR #12.
- Do **not** re-author or restructure surah prose content. The generator reads existing
  content; it does not rewrite it.
- No new per-surah bespoke engines (rejected in scoping — 38× authoring, no payoff).
- No light-mode variant of the surah Lab (surahs go always-night, matching lessons).

## Design decisions locked in the mockup

Word-state readability (from live iteration with the user):

- Arabic in the decoder stays **cream on navy** at all times — never inverts to a gold
  fill (that killed legibility of the harakat).
- State is shown with marks, not recolors: **gold ring** = selected, **thin gold
  underline** = already decoded, **soft glow** = lens match, reduced opacity = filtered
  out. (Recitation words are `<button>`s — the skin MUST reset UA button chrome:
  `background:none;border:none;appearance:none;font:inherit`, or they show a gray
  button-face fill.)
- **Affordance from load:** the first substantive word (the opening noun) is
  pre-selected with the gold ring and its readout is pre-filled, so it's obvious the
  words are tappable. This preview does **not** count toward the "words decoded" tally —
  that starts climbing on the first real tap.

## Architecture

### 1. Data (data-first) — the decoder dataset

**Source of truth already in the MDX, uniform across all 38 surahs:**

- Each verse has an `<ArabicExample>` with `arabic`, `transliteration`, `translation`,
  `reference` (→ ayah number via `lib/ayah-ref`), and `words={[{ar,tr,en}]}`.
- Each verse has a "Word-by-Word Breakdown" `<GrammarTable>` whose 571 rows across all
  surahs share one identical header:
  `# | Arabic | Transliteration | Root | Morphology | I'rab | Meaning`.

**Generator:** `scripts/extract-surah-decoder.mjs` (new), following the
`extract-surah-openings.mjs` precedent (generated file, never hand-edited, byte-verified
38/38). For each surah it parses, per verse:

- verse metadata from `<ArabicExample>` (full arabic, transliteration, translation,
  ayah ref);
- per-word rows from the adjacent breakdown table (arabic, translit, root, morphology,
  iʿrāb, meaning);
- a derived **lens class** per word from keyword-matching Morphology + I'rab
  (`Particle`→particle, `Verb`→verb, `genitive/majrūr`→gen, `accusative/manṣūb`→acc,
  `nominative/marfūʿ`→nom). Unmatched → no lens class (still tappable).

**Output:** `src/data/surah-decoder.ts` (or per-id files under `src/data/surah-decoder/`),
typed:

```ts
type DecoderCase = 'gen' | 'acc' | 'nom' | 'mabni' | 'verb' | 'none';
interface DecoderWord {
  ar: string; tr: string; root: string;      // "—" when no triliteral root
  morph: string; irab: string; en: string;
  cs: DecoderCase; lens: ('particle'|'verb'|'gen'|'acc'|'nom')[];
}
interface DecoderVerse { ayah: number; ref: string; arabic: string;
  transliteration: string; translation: string; words: DecoderWord[]; }
type SurahDecoder = Record<string /*surahId*/, DecoderVerse[]>;
```

**Row↔word alignment risk (main implementation risk):** the breakdown table rows are the
canonical word list for the decoder (they carry the grammar data). The `<ArabicExample>`
`words[]` may tokenize slightly differently (e.g. splitting `وَ` off). Decision: the
**breakdown table is authoritative** for the decoder's word list and grouping; the
`<ArabicExample>` supplies only verse-level fields. Generator emits a per-surah word
count and a sample; a verification gate confirms 38/38 parse cleanly with non-empty
root/morph/irab, mirroring the surah-openings byte-check. Any surah that fails to parse
is reported, not silently dropped.

### 2. Layout — `SurahLayout.astro` → Lab shell

Rework `SurahLayout.astro` to mirror `LessonLayout.astro`'s Lab structure (keep BaseLayout
underneath — same approach as lessons, NOT the standalone night-page pattern):

- Force always-night via the same early inline script (sets `data-theme="dark"`, never
  writes localStorage, re-forces on `astro:page-load`/`after-swap`).
- Import `src/styles/lesson-lab.css` + the decoder stylesheet, and the lab script.
- Wrap content in the `.lab` grid so shared-component Lab skins activate.
- **Station rail** derived from the page's `h2` headings (Astro `headings`), same as
  LessonLayout: `00 Briefing` (header) + one station per `h2`. Surah h2s are
  `Overview / Verse-by-Verse Analysis / Practice Exercises / Key Vocabulary / Grammar
  Summary`, plus a synthetic `I'rab Decoder` station for the injected centerpiece.
  Telemetry counter reads **"Words decoded"** (fed by the same `lab:word-touched`
  mechanism the verse consoles already dispatch, plus the decoder's own taps).
- Preserve existing SEO (`BreadcrumbSchema`, `ArticleSchema`), breadcrumb, and add a
  completion button (wire to `progress.ts`) + prev/next pager across surahs in order.
- Auto-inject `<SurahDecoder surahId={…} />` right after the header (before the MDX
  `<slot />`), reading the generated dataset for the current surah. No per-file MDX edits.

### 3. Component — `src/components/mdx/lab/SurahDecoder.astro` (new)

- Props: `surahId` (resolves its verses from the generated dataset).
- Renders: dotted console header with live `Decoded n/total`; **lens chip row**
  (All / Particles / Genitive / Accusative / Verbs — only render a chip if ≥1 word
  matches in this surah); the **recitation surface** (all verses stitched, each word a
  `<button class="w">`, ayah-number markers between verses); the **readout panel**
  (6 fields: Word · Root · Meaning · Morphology · Iʿrāb+case-tag · Function).
- Behavior (client script, `createElement`/`textContent` only — no `innerHTML`, matching
  the repo's Write-hook constraint): tap → select + build readout + increment decoded
  telemetry + dispatch `lab:word-touched`; lens click → toggle dim/glow across words;
  pre-select first substantive word on load as a non-counting affordance.
- No-JS / reduced-motion degrade: recitation renders as readable static verses;
  readout/lens hidden without JS (same pattern as the lesson engines).

### 4. Styling — `src/styles/surah-decoder.css` (new)

Decoder-specific classes (`.decoder`, `.lens`, `.recite`, `.d-readout`, case tags),
written against the same night/gold tokens, scoped under `.lab`. The shell/console/
frame/rulebox/DIAG/plate skins are reused from `lesson-lab.css` unchanged. (Consider
renaming `lesson-lab.css` → `lab.css` since it now serves both surfaces; optional, can
defer.)

## Cross-surface safety

The Lab lesson port previously broke surah/resource pages by moving shared component
chrome into `.lab` scope; that was fixed by self-contained `:global(.prose)` base skins.
Adding `.lab` to surah pages now gives them the FULL lab skin (intended). Verification
must confirm **resource pages** (still `.prose`, no `.lab`) and **lessons** remain
visually intact after any shared-CSS change. Test all three surfaces on every shared-file
edit.

## Verification plan

- Generator: 38/38 surahs parse; every decoder word has non-empty root/morph/irab;
  spot byte-check Arabic against source MDX (no mojibake, harakat preserved).
- Build: full site builds clean (page count unchanged apart from expected).
- Playwright + screenshot sweep: 2+ surahs per difficulty; decoder tap → readout, lens
  filter, station scrollspy, telemetry, DIAG accordion, completion, pager, audio
  (`ayah-play` contract intact), no-JS render, mobile + reduced-motion.
- Regression: resource pages and a sample of lessons unchanged.
- Accessibility: readout `aria-live`, word buttons `aria-pressed`, lens chips
  keyboard-operable, contrast on cream/navy + gold marks.

## Rollout

Single branch `feat/surah-lab-decoder`. Order: (1) generator + dataset + byte-verify,
(2) `SurahDecoder` component + CSS against the generated Al-ʿAsr data (match the
approved mockup), (3) `SurahLayout` Lab conversion + auto-inject + rail, (4) full
verification sweep across surfaces, (5) design audit (web-design-guidelines) + code
review, (6) PR. Subagent-driven per the overnight orchestration pattern.
