# Quranic Grammar Reference Companion — Design Spec

**Date:** 2026-05-28
**Status:** Approved, ready for implementation plan
**Product position:** Ebook #3 in the Quranic Grammar catalog (sibling of the Al-Fatiha Sampler and the future Foundation Book)
**Inherits visual system from:** `docs/superpowers/specs/2026-05-26-sampler-al-fatiha-walkthrough-design.md`

---

## 1. Product positioning

**Working title:** *Quranic Grammar Reference Companion — A Quick-Reference Kit for Classical Arabic*

**Etsy listing promise:** "Everything you need beside you while reading the Quran — verb tables, case endings, pronoun charts, the 200 most-used words, the root system, and a 120-term grammar dictionary. Designed as a desk-side reference, not a wall of text."

| Property | Value |
|---|---|
| Trim | 5.5 × 8.5 in (inherited from Sampler) |
| Length target | 100–120 pages |
| Etsy price | $7–9 |
| Audience | Buyers who already have Foundation Book or graduates of a beginner Arabic curriculum looking for a single-volume look-up companion |
| Build order in catalog | 3rd of 3 (Sampler ✅, Reference Companion, Foundation Book) |

The "Tabbed Quick-Reference Kit" framing was chosen over "Complete Reference Companion" (felt like a database printout) and "Trimmed Reference Essentials" (didn't justify the price). The kit framing supports the $7–9 price tier and lets the section-divider design carry a "polished thing, not a PDF dump" feel.

---

## 2. Book structure

```
COVER (Hairline Architecture v2: § ornament + "REFERENCE" sublabel)
TITLE PAGE
COPYRIGHT / COLOPHON
MASTER TOC                                     — page-numbered
ORIENTATION: Arabic in 7 Principles            — front-matter essay
  (no section number; reads as a primer)

SECTION 01 — VOCABULARY QUICKSTART             — divider spread
  200 Most-Used Quran Words

SECTION 02 — CHARTS                            — divider spread
  Case Endings
  Pronouns
  Verb Conjugations (all 10 forms)
  Verb Forms Master Reference
  The Root System

SECTION 03 — GLOSSARY                          — divider spread
  120+ entries, compact dictionary template
  Letter-tabbed running header (current letter big in margin)

BACK COVER (brand mark)
```

**Section divider spread:** every section opens on a two-page spread. Left page is intentionally blank (canvas dark only). Right page shows the section number (`01` / `02` / `03`) in large Geist Mono gold + the section name in Geist between two gold hairlines (reuses the Sampler's chapter-opener hairline pattern).

**Running headers** (everywhere after Orientation):

- Left page: `QURANIC GRAMMAR · REFERENCE COMPANION` in Geist Mono.
- Right page: current section name + page number in Geist Mono.
- **Glossary exception:** running header shows the current Arabic letter big (e.g., `ن`) plus its name in mono (`nūn`), dictionary-style. Letter changes drive the header value.

**Folio:** bottom-center, Geist Mono, `#d4a85f`.

---

## 3. Visual system

### Inherited from Sampler — locked, no changes

| Element | Value |
|---|---|
| Background canvas | `#0f1115` |
| Primary ink | `#efe7d4` |
| Gold accent | `#d4a85f` |
| Dim hairline | `#2a2c33` |
| Body / display font | Geist (latin) |
| Mono / label font | Geist Mono |
| Featured-verse font | Amiri Quran |
| Inline Arabic font | Amiri |
| Transliteration fallback for `ḍ ḥ ṣ ṭ ʿ ʾ` | Noto Sans via `@font-face` `unicode-range` |
| `<strong>` weight override | 500 (Geist doesn't ship 700) |
| Page size | 5.5 × 8.5 in via `@page` in `src/styles/ebook-print.css` |
| Renderer | Playwright headless system Chrome via `channel: 'chrome'` |

### New visual decisions

**3.1 Cover (`ReferenceCover.astro`)** — same hairline architecture as the Sampler, identical brand-label position (`QURANIC GRAMMAR` top, Geist Mono uppercase) — but:

- A small `REFERENCE` label in Geist Mono uppercase, tracked +0.3em, placed directly under the brand label.
- The Sampler's `◆ ◆ ◆` ornament is replaced with a **single `§` section sign** in Geist Mono gold at the same vertical position. The triplet → single-glyph shift breaks the rhythm enough to read as a distinct book at Etsy thumbnail scale while preserving family resemblance.
- No Arabic glyphs on the cover.
- Brand-only byline (no personal author name), same as Sampler.

**3.2 Density modes inside the same visual language.** Two CSS-variable-driven modes:

- `--mode-prose` (default — Sampler density): leading 1.6, body 11pt, generous margins. Used in Orientation, intros, narrative passages.
- `--mode-data` (new — denser): leading 1.35, body 10pt, internal table margins tightened, callout padding halved. Triggered on `.chart-block`, `.glossary-entry`, `.verb-table`, `.vocab-row` wrappers.

Both modes share fonts, color, hairline, gold accent. The reader sees the same book, denser in lookup zones.

**3.3 Section divider spread** — new layout. Right page only: section number (`01`) in Geist Mono ~120pt gold vertically centered; section name (`VOCABULARY QUICKSTART`) in Geist ~28pt below; both bracketed by the two gold hairlines (reuses `FeaturedVerse` hairline pattern).

**3.4 Glossary letter divider** — at each Arabic letter change inside the Glossary: a single h2 block showing huge Arabic letter (`ن`) in Amiri Quran ~96pt gold + Latin transliteration `Nūn` in Geist Mono small caps. Used to break the alphabetical run into visual chunks and to feed the running-header letter logic.

**3.5 Vocabulary row** (new component, for 200-most-used-words) — 4-column row: `[Rank] [Arabic] [Transliteration] [Gloss]` in mono/Amiri/mono/Geist, leading 1.3, hairline between rows. Projected ~10 rows per page in tight mode → 200 words ≈ 20 pages.

**3.6 Chart block frame** — wraps the existing `<GrammarTable>` and `<VerbConjugation>` components with a gold-hairline top border, a Geist Mono uppercase label (`CHART · CASE ENDINGS — SINGULAR NOUNS`), and bottom hairline. Gives every table a consistent "card" identity though they vary in column count.

**3.7 Tighter callouts inside data zones.** The Sampler's gold-bordered `<Callout>` keeps its gold left border but loses inner padding by ~40% when nested inside `.chart-block`.

**3.8 Glossary entry template (compact dictionary style)**:

```
NASB / Accusative Case                    L2.05
نَصْب  •  naṣb

The grammatical case used for direct objects,
predicates of inna and her sisters, and circumstantial
expressions. Marked by fatḥah on singular nouns.

  ◆ Quranic example:
  إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ
  innā aʿṭaynāka l-kawthara
  "Indeed, We have granted you al-Kawthar"
  — Al-Kawthar 108:1

The word الْكَوْثَرَ is accusative because it is the
direct object of أَعْطَيْنَا.
```

Lesson reference (`L2.05`) floats top-right in Geist Mono. If an entry has multiple lesson refs, they are comma-separated in the same slot (`L2.04, L2.05`); if more than 3, only the first 2 + ellipsis. If an entry has no Quranic example in the source MDX (a few short entries don't), the `◆ Quranic example` block is omitted and the entry collapses to title + transliteration row + definition only. The verbose `**Arabic:** / **Definition:** / **Quranic Example:** / **Learn more:**` labels from the source MDX are removed — the layout itself signals what each block is. Scans like Cambridge Dictionary of Arabic-English.

---

## 4. Content transformation per source file

The 8 source MDX files in `src/content/resources/` are not copied — they are **rewritten** into a single book MDX at `src/content/ebooks/reference-companion.mdx` with print-specific structure.

### Universal transforms (applied to every file)

- All `/learn/level-X/...` and `/resources/...` URLs stripped → replaced with bold text refs (e.g., `**L3.08 Subject Pronouns**`).
- All `[text](#anchor)` inline anchor links → unwrap to bold text (PDF can't navigate them meaningfully without page numbers).
- All web-only copy stripped: `Ctrl+F`, `Cmd+F`, "click the link below", "Use your browser's search function", "Click lesson links", the `Quick navigation by Arabic letter` block (replaced with a per-section TOC component).
- The "Quick Navigation" block at the top of each source file → replaced with a per-chapter TOC block (a bulleted list at the start of that chapter, no page numbers — rely on running headers + section dividers).
- All wrapper components updated to print equivalents where needed.

### Per-file transformation plan

| Source file | KB | Target treatment | Pages |
|---|---|---|---|
| `arabic-in-7-principles.mdx` | 12 | Orientation — front-matter essay using `OrientationChapter.astro` (sibling of `AyahChapter`). Each principle becomes a numbered moment with Geist Mono number `01 / 02 …`, Geist heading, prose body in `--mode-prose`. | ~10 |
| `200-most-used-words.mdx` | 27 | `VocabRow` repeating component. Group by Quranic frequency tier (already in source). 4 cols: rank · Arabic (Amiri) · transliteration (mono) · gloss (Geist). | ~20 |
| `case-endings-chart.mdx` | 21 | Wrap every `<GrammarTable>` in `<ChartBlock>`. Strip "Relationship to Lessons" Callouts that point to lesson URLs; rewrite as inline mono refs. Featured `<ArabicExample>` blocks kept. | ~12 |
| `pronoun-charts.mdx` | 16 | Same `<ChartBlock>` wrap. The 4 categories (independent / attached / demonstrative / relative) become 4 chapters in the section, each with a small chapter label. | ~10 |
| `verb-conjugation-tables.mdx` | 58 | Largest chart file. Each of 10 forms = its own chapter. `<VerbConjugation>` rendered in `--mode-data` (tighter leading 1.3, cell body 9pt). Past/Present/Imperative tables of each form on adjacent pages, never split across spread. Form chapter opener uses pattern + meaning in featured-verse style. | ~25 |
| `verb-forms-master-reference.mdx` | 13 | The "cheat sheet" — single `<ChartBlock>` with the master overview table of all 10 forms. | ~5 |
| `root-system.mdx` | 28 | Prose + tables hybrid. Body in `--mode-prose`; the example root-derivation tables in `--mode-data` `<ChartBlock>`. | ~10 |
| `glossary.mdx` | 97 | New `<GlossaryEntry>` component (§3.8 template). Alphabetical letter dividers as new `<GlossaryLetterDivider>` component (drives the running-header letter). 120+ entries. Master alphabet index at front of section. | ~30 |

**Projected total:** ~122 pages (~10 over the 100-page target). Acceptable — at $7–9 the value perception is the upside. Final length will land 105–115 after density tuning.

---

## 5. Components & files

### New components (`src/components/ebook/`)

- `OrientationChapter.astro` — sibling of `AyahChapter`, numbered-principle layout.
- `SectionDivider.astro` — section opener spread.
- `SectionToc.astro` — per-chapter bulleted TOC inserted at the top of each chapter, no page numbers.
- `MasterToc.astro` — single front-of-book TOC, page-numbered (post-render injected — see §6). Lists every chapter (not just the 3 sections), the Orientation, and the Arabic-letter dividers inside the Glossary.
- `VocabRow.astro` — 4-column vocab row.
- `ChartBlock.astro` — gold-bracketed wrapper for tables.
- `GlossaryEntry.astro` — compact dictionary entry (§3.8).
- `GlossaryLetterDivider.astro` — letter section break (drives running-header).
- `RunningHeader.astro` — print-only running header logic.
- `ReferenceCover.astro` — cover variant with `§` ornament + REFERENCE sublabel.

### Reused unchanged from Sampler

- `EbookPrint.astro` (layout)
- `FeaturedVerse.astro`
- `WordGrid.astro` (available though not used here)
- `GrammarMoment.astro`
- `BackCover.astro`
- `TitlePage.astro`
- `ebook-print.css` (extended with `--mode-data` block + new component rules — not replaced)

### New file layout

```
src/content/ebooks/reference-companion.mdx              ← book content
src/pages/ebooks/
  reference-companion.astro                             ← full book route
  reference-companion-preview-cover.astro               ← 1600×2400
  reference-companion-preview-spread-1.astro            ← 1200×1500
  reference-companion-preview-spread-2.astro            ← 1200×1500
  reference-companion-preview-spread-3.astro            ← 1200×1500
src/components/ebook/*.astro                            ← 10 new components above
src/styles/ebook-print.css                              ← extended, not replaced
scripts/render-ebook-pdf.ts                             ← refactored to config-driven
```

---

## 6. Build & render pipeline

### Renderer extension (`scripts/render-ebook-pdf.ts`)

Today the script has hard-coded targets for the Sampler. Refactor to a config-driven loop:

```ts
const EBOOKS = [
  { slug: 'al-fatiha-sampler',    /* existing */ },
  { slug: 'reference-companion',  /* new     */ },
];
```

`renderPdf()` and `renderListingImages()` iterate the array. Adding Foundation Book later = appending one entry.

### Two-pass render for page-numbered master TOC

The master TOC needs real page numbers (Sampler didn't). Chromium doesn't support CSS `target-counter()`, so a two-pass approach:

```
PASS 1: render PDF → extract per-anchor page numbers via Playwright JS
        (page.evaluate walks all [data-toc-anchor] elements, reads
         getBoundingClientRect().top, divides by @page height)
PASS 2: inject the {anchor: pageNum} map back into the Astro page as a
        query param or data attribute, re-render PDF
```

Implementation lives in `scripts/render-ebook-pdf.ts` as a `renderWithToc(slug)` helper. Adds ~30–45 seconds to render time. **Fallback:** if pass 1 fails, render TOC without page numbers (book still ships).

Per-section sub-TOCs do **not** use this — they render with bullets only. Cuts complexity in half.

### npm scripts

```
"ebook:sampler":   "...existing..."
"ebook:reference": "npm run build && tsx scripts/render-ebook-pdf.ts reference-companion"
"ebook:all":       "npm run build && tsx scripts/render-ebook-pdf.ts"
```

### Output artifacts

```
dist/ebooks/
  reference-companion.pdf
  reference-companion-listing-cover.png      (1600×2400)
  reference-companion-listing-spread-1.png   (1200×1500)
  reference-companion-listing-spread-2.png   (1200×1500)
  reference-companion-listing-spread-3.png   (1200×1500)
```

### File size budget

Etsy 20MB limit. Sampler is 170 KB at 14 pages. Reference Companion at ~115 pages with the same font subsets should land 1.5–3 MB. Comfortably under the cap.

### Listing image strategy

1. **Spread 1 — Cover + Orientation opener.** Sells the design identity. Shows the cover full-size and the first principle of the Orientation essay.
2. **Spread 2 — Glossary entry pair.** Two facing glossary entries showing the compact dictionary template. Proves design rigor on the densest part of the book.
3. **Spread 3 — Verb Conjugation chapter.** A Form II opener + its past-tense `<VerbConjugation>` table. Proves content density and chart polish.

Cover image is rendered separately at 1600×2400.

---

## 7. Acceptance criteria

The book is done when:

1. `npm run ebook:reference` produces all 5 artifacts in `dist/ebooks/` without errors.
2. PDF page count is 100–120 pages.
3. PDF file size < 5 MB.
4. Master TOC at front has real page numbers for: Orientation, Section 01, Section 02, Section 03, and every Section-02 sub-chapter (Case Endings, Pronouns, Verb Conjugations Forms I–X, Verb Forms Master, Root System) + the Arabic-letter dividers inside the Glossary.
5. Zero Helvetica/Times fallback — only Geist, Geist Mono, Amiri, Amiri Quran, and Noto Sans (transliteration chars only) appear in the rendered PDF. Verify via `pdffonts dist/ebooks/reference-companion.pdf`.
6. Zero URLs containing `/learn/`, `/resources/`, or `quranicgrammar.com/` appear in the rendered PDF. Verify via `pdftotext dist/ebooks/reference-companion.pdf - | grep -E '/learn|/resources|quranicgrammar'`.
7. Zero web-only copy strings (`Ctrl+F`, `Cmd+F`, `click`, `Click`, `browser`, `Quick navigation`) appear in the rendered PDF. Verify via `pdftotext | grep`.
8. Visual smoke: random sample of 5 pages opened in Preview — no orphaned headings, no charts split across spreads, no rivers in justified text, no glyph fallback boxes.
9. Listing images: cover thumbnail readable at 400×600 (Etsy thumbnail size); `§` mark and `REFERENCE` sublabel are visible.

---

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Two-pass TOC render is fragile (anchor coordinates depend on page-break stability) | If pass 1 fails, fall back to TOC without page numbers (book still ships). Treat as nice-to-have, not blocker. |
| Verb conjugation tables (13 rows × 3 cols, ×30 instances) split awkwardly across page breaks | Add `page-break-inside: avoid` on `.verb-conjugation` wrapper. If individual tables exceed page height, accept; manually `<br>`-control problem cases. |
| Glossary at 30 pages may exceed expectations or compress oddly when 120 entries hit `--mode-data` | After first full render, audit entry density. If too crowded, increase per-entry bottom margin by 4pt and re-render — accept 2-3 more pages. |
| Astro scoped CSS won't apply to raw MDX classes (existing memory pitfall) | All print rules go in `ebook-print.css`, not scoped component blocks. |
| ~270 KB of source MDX → rewritten by hand is a lot of work | Do per-file rewrites in separate commits so progress is incremental and reviewable. |
| Aggressive print rewrite means the book MDX diverges from web MDX over time | Treat the book MDX as a **derived artifact** — print version is the source of truth for the product, web version stays as-is. No two-way sync. |

---

## 9. Out of scope (explicit non-goals)

- No audio / QR codes linking back to the website.
- No personalisation; no author byline beyond the brand label.
- No interactive PDF form fields.
- No HTML/EPUB build target — PDF only.
- No multi-language editions.
- No syncing rewritten print content back to the website MDX files.

---

## 10. References

- Sampler design spec: `docs/superpowers/specs/2026-05-26-sampler-al-fatiha-walkthrough-design.md`
- Sampler implementation plan: `docs/superpowers/plans/2026-05-26-sampler-al-fatiha-walkthrough.md`
- Sampler renderer: `scripts/render-ebook-pdf.ts`
- Print stylesheet (to extend): `src/styles/ebook-print.css`
- Print layout (to reuse): `src/layouts/EbookPrint.astro`
- Source resources: `src/content/resources/*.mdx`
