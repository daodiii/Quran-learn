# Sampler — *How to Understand Surah Al-Fatiha* Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a ~30-page dark-mode PDF ebook (cover + 7 ayah chapters + glossary + next-page) of Surah Al-Fatiha, generated from MDX through Astro and Playwright, ready to upload to Etsy as a paid digital download.

**Architecture:** Add an `ebooks` content collection. Author the book as a single MDX file. A new `EbookPrint` Astro layout wraps the content in a print-only dark-mode shell with embedded fonts and `@page` rules. A Playwright script opens the rendered Astro page in headless Chromium and saves it as a PDF. The same Playwright runner also captures listing images for the Etsy product page.

**Tech Stack:** Astro 5 (existing), MDX, Tailwind v4 (existing — but ebook uses scoped CSS, not Tailwind), Playwright (new), Google Fonts via self-hosted woff2 (Geist, Geist Mono, Amiri, Amiri Quran).

**Source spec:** [docs/superpowers/specs/2026-05-26-sampler-al-fatiha-walkthrough-design.md](../specs/2026-05-26-sampler-al-fatiha-walkthrough-design.md)

---

## File map

Files to create (all paths relative to project root):

```
public/
  fonts/
    geist-400.woff2                   # Self-hosted font files
    geist-500.woff2
    geist-italic-400.woff2
    geist-mono-400.woff2
    geist-mono-500.woff2
    amiri-400.woff2
    amiri-700.woff2
    amiri-quran-400.woff2

src/
  content/
    ebooks/
      sampler-al-fatiha.mdx           # The book's content
  layouts/
    EbookPrint.astro                  # Print-only dark layout
  components/
    ebook/
      CoverPage.astro
      TitlePage.astro
      FeaturedVerse.astro
      WordGrid.astro
      GrammarMoment.astro
      AyahChapter.astro
      Glossary.astro
      BackCover.astro
  pages/
    ebooks/
      sampler.astro                   # Main book route
      sampler-preview-cover.astro     # Listing image: cover only
      sampler-preview-spread-1.astro  # Listing image: featured verse spread
      sampler-preview-spread-2.astro  # Listing image: word grid + grammar moment
      sampler-preview-spread-3.astro  # Listing image: glossary spread
  styles/
    ebook-print.css                   # @page rules, font-face, ebook-only resets

scripts/
  render-ebook-pdf.ts                 # Playwright runner for PDF + listing images
```

Files to modify:

```
src/content.config.ts                 # Add `ebooks` collection
package.json                          # Add Playwright dep + npm scripts
```

---

## Task 1: Create feature branch

**Files:** None modified — branch only.

- [ ] **Step 1: Verify clean working tree (or stash uncommitted work)**

Run: `git status`

If `M src/components/Footer.astro` or other unrelated changes are present, decide with the user whether to stash them or include them. For this plan, **stash unrelated work**:

```bash
git stash push -u -m "wip: pre-sampler work" -- src/components/Footer.astro
```

(Adjust file list to match actual unrelated edits.)

- [ ] **Step 2: Create and switch to the feature branch**

```bash
git checkout -b feat/sampler-al-fatiha-pdf
```

- [ ] **Step 3: Verify branch**

Run: `git branch --show-current`
Expected: `feat/sampler-al-fatiha-pdf`

---

## Task 2: Add ebooks content collection schema

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Add the `ebooks` collection schema**

Edit `src/content.config.ts`. Add after the existing `resources` definition (before the `collections` export):

```ts
const ebooks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ebooks' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    brand: z.string().default('Quranic Grammar'),
    volume: z.string().optional(),
    byline: z.string().optional(),
    price: z.string().optional(),
    description: z.string().optional(),
  }),
});
```

Update the `collections` export:

```ts
export const collections = {
  lessons,
  surahs,
  resources,
  ebooks,
};
```

- [ ] **Step 2: Create the empty content directory**

```bash
mkdir -p src/content/ebooks
```

- [ ] **Step 3: Type-check**

Run: `npx astro check`
Expected: no new errors. (Pre-existing errors are acceptable; the new collection should add zero errors.)

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/ebooks
git commit -m "feat(ebooks): add ebooks content collection schema"
```

---

## Task 3: Download self-hosted fonts

Self-hosting avoids Chromium racing against Google Fonts at PDF-render time.

**Files:**
- Create: `public/fonts/geist-400.woff2`
- Create: `public/fonts/geist-500.woff2`
- Create: `public/fonts/geist-italic-400.woff2`
- Create: `public/fonts/geist-mono-400.woff2`
- Create: `public/fonts/geist-mono-500.woff2`
- Create: `public/fonts/amiri-400.woff2`
- Create: `public/fonts/amiri-700.woff2`
- Create: `public/fonts/amiri-quran-400.woff2`

- [ ] **Step 1: Create the fonts directory**

```bash
mkdir -p public/fonts
```

- [ ] **Step 2: Download each font file**

The simplest path is the `google-webfonts-helper` API or downloading directly from `fonts.gstatic.com`. Either is fine; the requirement is that each file in the list above ends up at the right path as a valid woff2.

For Geist: open https://fonts.google.com/specimen/Geist → Download family → extract → take the woff2 / convert ttf → woff2 if needed (using https://google-webfonts-helper.herokuapp.com/fonts/geist for a one-stop woff2 zip).

Repeat for Geist Mono, Amiri (regular + bold), and Amiri Quran (regular only).

Move the files into `public/fonts/` with the exact filenames listed above.

- [ ] **Step 3: Verify files exist and have non-trivial size**

```bash
ls -lh public/fonts/
```

Expected: 8 woff2 files, each between 30 KB and 300 KB.

- [ ] **Step 4: Commit**

```bash
git add public/fonts
git commit -m "feat(ebooks): add self-hosted woff2 fonts (Geist, Amiri, Amiri Quran)"
```

---

## Task 4: Create the print stylesheet

**Files:**
- Create: `src/styles/ebook-print.css`

This stylesheet is loaded only by `EbookPrint.astro`. It defines `@font-face` for the 8 woff2 files, `@page` size, ebook design tokens, and the base ebook resets.

- [ ] **Step 1: Create the file**

```css
/* ============================================
   EBOOK PRINT STYLESHEET
   For PDF-rendered books only. Not used by the website.
   ============================================ */

/* Self-hosted fonts */
@font-face {
  font-family: 'Geist';
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url('/fonts/geist-400.woff2') format('woff2');
}
@font-face {
  font-family: 'Geist';
  font-style: normal;
  font-weight: 500;
  font-display: block;
  src: url('/fonts/geist-500.woff2') format('woff2');
}
@font-face {
  font-family: 'Geist';
  font-style: italic;
  font-weight: 400;
  font-display: block;
  src: url('/fonts/geist-italic-400.woff2') format('woff2');
}
@font-face {
  font-family: 'Geist Mono';
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url('/fonts/geist-mono-400.woff2') format('woff2');
}
@font-face {
  font-family: 'Geist Mono';
  font-style: normal;
  font-weight: 500;
  font-display: block;
  src: url('/fonts/geist-mono-500.woff2') format('woff2');
}
@font-face {
  font-family: 'Amiri';
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url('/fonts/amiri-400.woff2') format('woff2');
}
@font-face {
  font-family: 'Amiri';
  font-style: normal;
  font-weight: 700;
  font-display: block;
  src: url('/fonts/amiri-700.woff2') format('woff2');
}
@font-face {
  font-family: 'Amiri Quran';
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url('/fonts/amiri-quran-400.woff2') format('woff2');
}

/* Design tokens */
:root {
  --eb-canvas: #0f1115;
  --eb-canvas-deep: #0a0b0d;
  --eb-ink-primary: #efe7d4;
  --eb-ink-secondary: #c8c0ad;
  --eb-ink-muted: #8a8275;
  --eb-ink-mute-deep: #5c5a52;
  --eb-accent: #d4a85f;
  --eb-hairline: #2a2c33;
  --eb-callout-surface: rgba(212, 168, 95, 0.06);
}

/* Page geometry */
@page {
  size: 5.5in 8.5in;
  margin: 0;
}

html, body {
  margin: 0;
  padding: 0;
  background: var(--eb-canvas);
  color: var(--eb-ink-primary);
  font-family: 'Geist', sans-serif;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.ebook-page {
  width: 5.5in;
  height: 8.5in;
  padding: 0.6in 0.5in 0.5in;
  position: relative;
  page-break-after: always;
  break-after: page;
  overflow: hidden;
  box-sizing: border-box;
}

.ebook-page:last-child {
  page-break-after: auto;
  break-after: auto;
}

.ebook-folio {
  position: absolute;
  bottom: 0.25in;
  left: 0;
  right: 0;
  text-align: center;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  color: var(--eb-ink-mute-deep);
}

/* Helpers */
.eb-arabic { direction: rtl; }
.eb-uppercase { text-transform: uppercase; }
```

- [ ] **Step 2: Verify the file lints (no syntax errors)**

Run: `npx astro check`
Expected: no new CSS-related warnings.

- [ ] **Step 3: Commit**

```bash
git add src/styles/ebook-print.css
git commit -m "feat(ebooks): add print stylesheet with @font-face and @page rules"
```

---

## Task 5: Create the EbookPrint layout

**Files:**
- Create: `src/layouts/EbookPrint.astro`

The layout loads the print stylesheet, applies the dark background, and yields a slot for the page contents (which are usually a sequence of `<CoverPage>`, `<TitlePage>`, MDX content, `<BackCover>`).

- [ ] **Step 1: Create the file**

```astro
---
import '../styles/ebook-print.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <link rel="preload" href="/fonts/geist-400.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/geist-mono-400.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/amiri-400.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/amiri-quran-400.woff2" as="font" type="font/woff2" crossorigin />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/EbookPrint.astro
git commit -m "feat(ebooks): add EbookPrint layout with font preload"
```

---

## Task 6: Build the CoverPage component

**Files:**
- Create: `src/components/ebook/CoverPage.astro`

Implements the locked Cover B — Hairline Architecture: dark canvas, "QURANIC GRAMMAR" label at top in soft gold, title block between two gold hairlines with triple-diamond ornament, brand-only byline (volume label) at bottom.

- [ ] **Step 1: Create the file**

```astro
---
interface Props {
  title: string;
  subtitle?: string;
  brand?: string;
  volume?: string;
  byline?: string;
}

const {
  title,
  subtitle = 'A grammatical walkthrough',
  brand = 'Quranic Grammar',
  volume = 'Volume One',
  byline,
} = Astro.props;
---
<section class="cover">
  <div class="cover-brand">{brand}</div>
  <div class="cover-center">
    <div class="cover-ornament">◆ ◆ ◆</div>
    <h1 class="cover-title">{title}</h1>
    <p class="cover-subtitle">{subtitle}</p>
  </div>
  <div class="cover-footer">
    {byline && <div class="cover-byline">{byline}</div>}
    <div class="cover-volume">{volume}</div>
  </div>
</section>

<style>
  .cover {
    width: 5.5in;
    height: 8.5in;
    padding: 11% 10% 9%;
    background: #0f1115;
    color: #efe7d4;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    page-break-after: always;
    break-after: page;
  }
  .cover-brand {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.28em;
    color: #d4a85f;
    text-transform: uppercase;
    text-align: center;
  }
  .cover-center {
    margin-top: auto;
    margin-bottom: auto;
    padding: 38px 0 32px;
    border-top: 1px solid #d4a85f;
    border-bottom: 1px solid #d4a85f;
    text-align: center;
  }
  .cover-ornament {
    color: #d4a85f;
    font-size: 14px;
    letter-spacing: 1em;
    margin-bottom: 22px;
    padding-left: 1em;
  }
  .cover-title {
    font-family: 'Geist', sans-serif;
    font-weight: 500;
    font-size: 32px;
    line-height: 1.12;
    letter-spacing: -0.02em;
    color: #efe7d4;
    margin: 0 0 14px;
  }
  .cover-subtitle {
    font-family: 'Geist', sans-serif;
    font-style: italic;
    font-weight: 400;
    font-size: 14px;
    color: #8a8275;
    letter-spacing: -0.005em;
    margin: 0;
  }
  .cover-footer {
    text-align: center;
  }
  .cover-byline {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.2em;
    color: #8a8275;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .cover-volume {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.22em;
    color: #5c5a52;
    text-transform: uppercase;
  }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ebook/CoverPage.astro
git commit -m "feat(ebooks): add CoverPage component (Cover B layout)"
```

---

## Task 7: Build the TitlePage component

**Files:**
- Create: `src/components/ebook/TitlePage.astro`

A minimal interior title page that restates the title, brand, and volume, plus a small colophon block at the bottom (printing year + brand again). No folio number on this page.

- [ ] **Step 1: Create the file**

```astro
---
interface Props {
  title: string;
  subtitle?: string;
  brand?: string;
  volume?: string;
}

const {
  title,
  subtitle = 'A grammatical walkthrough',
  brand = 'Quranic Grammar',
  volume = 'Volume One',
} = Astro.props;

const year = new Date().getFullYear();
---
<section class="ebook-page title-page">
  <div class="tp-brand">{brand}</div>
  <div class="tp-block">
    <h1 class="tp-title">{title}</h1>
    <p class="tp-subtitle">{subtitle}</p>
  </div>
  <div class="tp-colophon">
    <div class="tp-volume">{volume}</div>
    <div class="tp-year">© {year} {brand}</div>
  </div>
</section>

<style>
  .title-page {
    display: flex;
    flex-direction: column;
    background: var(--eb-canvas);
  }
  .tp-brand {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.28em;
    color: var(--eb-accent);
    text-transform: uppercase;
  }
  .tp-block {
    margin-top: auto;
    margin-bottom: auto;
    padding: 28px 0;
    border-top: 1px solid var(--eb-accent);
    border-bottom: 1px solid var(--eb-accent);
  }
  .tp-title {
    font-family: 'Geist', sans-serif;
    font-weight: 500;
    font-size: 28px;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--eb-ink-primary);
    margin: 0 0 12px;
  }
  .tp-subtitle {
    font-family: 'Geist', sans-serif;
    font-style: italic;
    font-weight: 400;
    font-size: 14px;
    color: var(--eb-ink-muted);
    margin: 0;
  }
  .tp-colophon {
    font-family: 'Geist Mono', monospace;
    color: var(--eb-ink-mute-deep);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
  }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ebook/TitlePage.astro
git commit -m "feat(ebooks): add TitlePage component"
```

---

## Task 8: Build the FeaturedVerse component

**Files:**
- Create: `src/components/ebook/FeaturedVerse.astro`

The centred Arabic verse with hairlines, transliteration, and English translation underneath. Used once per ayah chapter.

- [ ] **Step 1: Create the file**

```astro
---
interface Props {
  arabic: string;
  transliteration: string;
  translation: string;
}

const { arabic, transliteration, translation } = Astro.props;
---
<div class="featured">
  <div class="fv-arabic eb-arabic">{arabic}</div>
  <div class="fv-trans">{transliteration}</div>
  <div class="fv-english">{translation}</div>
</div>

<style>
  .featured {
    text-align: center;
    padding: 28px 0 24px;
    border-top: 1px solid var(--eb-hairline);
    border-bottom: 1px solid var(--eb-hairline);
    margin-bottom: 28px;
  }
  .fv-arabic {
    font-family: 'Amiri Quran', 'Amiri', serif;
    font-size: 38px;
    line-height: 1.8;
    color: var(--eb-ink-primary);
    margin-bottom: 16px;
  }
  .fv-trans {
    font-family: 'Geist', sans-serif;
    font-style: italic;
    font-size: 14px;
    color: var(--eb-ink-muted);
    margin-bottom: 6px;
    letter-spacing: -0.005em;
  }
  .fv-english {
    font-family: 'Geist', sans-serif;
    font-size: 14px;
    color: var(--eb-ink-secondary);
    letter-spacing: -0.005em;
  }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ebook/FeaturedVerse.astro
git commit -m "feat(ebooks): add FeaturedVerse component"
```

---

## Task 9: Build the WordGrid component

**Files:**
- Create: `src/components/ebook/WordGrid.astro`

The 3-column word-by-word breakdown table (Arabic / transliteration / gloss with role tag). Accepts a `words` prop — an array of `{ ar, tr, gloss }`.

- [ ] **Step 1: Create the file**

```astro
---
interface WordEntry {
  ar: string;
  tr: string;
  gloss: string;
}

interface Props {
  words: WordEntry[];
}

const { words } = Astro.props;
---
<div class="word-grid">
  {words.map((w) => (
    <div class="wg-row">
      <div class="wg-ar eb-arabic">{w.ar}</div>
      <div class="wg-tr">{w.tr}</div>
      <div class="wg-gloss">{w.gloss}</div>
    </div>
  ))}
</div>

<style>
  .word-grid {
    margin-bottom: 24px;
  }
  .wg-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1.6fr;
    gap: 14px;
    padding: 9px 0;
    border-bottom: 1px dashed var(--eb-hairline);
    align-items: baseline;
  }
  .wg-ar {
    font-family: 'Amiri', serif;
    font-size: 22px;
    line-height: 1.4;
    text-align: right;
    color: var(--eb-ink-primary);
  }
  .wg-tr {
    font-family: 'Geist', sans-serif;
    font-style: italic;
    font-size: 13px;
    color: var(--eb-ink-muted);
    letter-spacing: -0.005em;
  }
  .wg-gloss {
    font-family: 'Geist', sans-serif;
    font-size: 13px;
    color: var(--eb-ink-secondary);
    letter-spacing: -0.005em;
  }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ebook/WordGrid.astro
git commit -m "feat(ebooks): add WordGrid component"
```

---

## Task 10: Build the GrammarMoment component

**Files:**
- Create: `src/components/ebook/GrammarMoment.astro`

A gold-bordered callout box with a small uppercase label ("GRAMMAR MOMENT") and body content. The body is a slot so callers can embed inline Arabic spans.

- [ ] **Step 1: Create the file**

```astro
---
interface Props {
  label?: string;
}

const { label = 'Grammar moment' } = Astro.props;
---
<aside class="grammar-moment">
  <span class="gm-label">{label}</span>
  <div class="gm-body"><slot /></div>
</aside>

<style>
  .grammar-moment {
    margin: 24px 0;
    padding: 18px 20px;
    background: var(--eb-callout-surface);
    border-left: 2px solid var(--eb-accent);
  }
  .gm-label {
    display: block;
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--eb-accent);
    margin-bottom: 7px;
    font-weight: 500;
  }
  .gm-body {
    font-family: 'Geist', sans-serif;
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--eb-ink-secondary);
    letter-spacing: -0.005em;
  }
  .gm-body :global(em) {
    font-family: 'Amiri', serif;
    font-style: normal;
    font-size: 15px;
    color: var(--eb-ink-primary);
    padding: 0 2px;
  }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ebook/GrammarMoment.astro
git commit -m "feat(ebooks): add GrammarMoment callout component"
```

---

## Task 11: Build the AyahChapter wrapper

**Files:**
- Create: `src/components/ebook/AyahChapter.astro`

Wraps a single ayah-chapter page: chapter number label, chapter title, then a slot for the inner content (FeaturedVerse + WordGrid + GrammarMoment + closing prose), then folio.

- [ ] **Step 1: Create the file**

```astro
---
interface Props {
  number: string;            // e.g. "Chapter 02"
  title: string;             // e.g. "All praise belongs to the Lord"
  folio: number;             // page number
}

const { number, title, folio } = Astro.props;
---
<section class="ebook-page ayah-chapter">
  <div class="ac-number">{number}</div>
  <h2 class="ac-title">{title}</h2>
  <div class="ac-body"><slot /></div>
  <div class="ebook-folio">{folio}</div>
</section>

<style>
  .ayah-chapter {
    background: var(--eb-canvas);
    color: var(--eb-ink-primary);
  }
  .ac-number {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.24em;
    color: var(--eb-accent);
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .ac-title {
    font-family: 'Geist', sans-serif;
    font-weight: 500;
    font-size: 24px;
    line-height: 1.2;
    letter-spacing: -0.015em;
    color: var(--eb-ink-primary);
    margin: 0 0 32px;
  }
  .ac-body {
    font-family: 'Geist', sans-serif;
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--eb-ink-secondary);
    letter-spacing: -0.005em;
  }
  .ac-body :global(p) {
    margin: 0 0 14px;
  }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ebook/AyahChapter.astro
git commit -m "feat(ebooks): add AyahChapter wrapper component"
```

---

## Task 12: Build the Glossary component

**Files:**
- Create: `src/components/ebook/Glossary.astro`

A two-column glossary spanning 1–2 pages. Each entry: term (Arabic + transliteration) + short English definition.

- [ ] **Step 1: Create the file**

```astro
---
interface Entry {
  ar: string;
  tr: string;
  def: string;
}

interface Props {
  entries: Entry[];
  folio: number;
}

const { entries, folio } = Astro.props;
---
<section class="ebook-page glossary">
  <div class="gl-label">Glossary</div>
  <h2 class="gl-title">Arabic grammar terms used in this book</h2>
  <div class="gl-grid">
    {entries.map((e) => (
      <div class="gl-entry">
        <div class="gl-term">
          <span class="gl-ar eb-arabic">{e.ar}</span>
          <span class="gl-tr">{e.tr}</span>
        </div>
        <div class="gl-def">{e.def}</div>
      </div>
    ))}
  </div>
  <div class="ebook-folio">{folio}</div>
</section>

<style>
  .glossary { background: var(--eb-canvas); }
  .gl-label {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.24em;
    color: var(--eb-accent);
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .gl-title {
    font-family: 'Geist', sans-serif;
    font-weight: 500;
    font-size: 24px;
    line-height: 1.2;
    letter-spacing: -0.015em;
    color: var(--eb-ink-primary);
    margin: 0 0 28px;
  }
  .gl-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 28px;
    row-gap: 16px;
  }
  .gl-entry {
    border-bottom: 1px dashed var(--eb-hairline);
    padding-bottom: 12px;
  }
  .gl-term {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 4px;
  }
  .gl-ar {
    font-family: 'Amiri', serif;
    font-size: 18px;
    color: var(--eb-ink-primary);
  }
  .gl-tr {
    font-family: 'Geist', sans-serif;
    font-style: italic;
    font-size: 11px;
    color: var(--eb-ink-muted);
  }
  .gl-def {
    font-family: 'Geist', sans-serif;
    font-size: 12px;
    line-height: 1.5;
    color: var(--eb-ink-secondary);
  }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ebook/Glossary.astro
git commit -m "feat(ebooks): add Glossary component"
```

---

## Task 13: Build the BackCover component

**Files:**
- Create: `src/components/ebook/BackCover.astro`

A minimal back cover with the brand label and a short tagline.

- [ ] **Step 1: Create the file**

```astro
---
interface Props {
  brand?: string;
  tagline?: string;
}

const {
  brand = 'Quranic Grammar',
  tagline = 'A small library of books that teach the language of the Quran.',
} = Astro.props;
---
<section class="back-cover">
  <div class="bc-block">
    <div class="bc-ornament">◆</div>
    <div class="bc-brand">{brand}</div>
    <p class="bc-tagline">{tagline}</p>
  </div>
  <div class="bc-footer">quranic-grammar.com</div>
</section>

<style>
  .back-cover {
    width: 5.5in;
    height: 8.5in;
    padding: 11% 10% 9%;
    background: #0f1115;
    color: #efe7d4;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    page-break-before: always;
    break-before: page;
  }
  .bc-block {
    margin: auto;
    text-align: center;
  }
  .bc-ornament {
    color: #d4a85f;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .bc-brand {
    font-family: 'Geist Mono', monospace;
    font-size: 14px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #efe7d4;
    margin-bottom: 14px;
  }
  .bc-tagline {
    font-family: 'Geist', sans-serif;
    font-style: italic;
    font-size: 12px;
    color: #8a8275;
    line-height: 1.55;
    max-width: 280px;
    margin: 0 auto;
  }
  .bc-footer {
    text-align: center;
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    color: #5c5a52;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
</style>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ebook/BackCover.astro
git commit -m "feat(ebooks): add BackCover component"
```

---

## Task 14: Create the sampler MDX scaffold

**Files:**
- Create: `src/content/ebooks/sampler-al-fatiha.mdx`

Scaffold with frontmatter and component imports plus one placeholder chapter. Real content is filled in later tasks. Having a scaffold first lets us wire the page route and verify build before pouring in content.

- [ ] **Step 1: Create the file with imports + frontmatter + intro placeholder + Chapter 1**

```mdx
---
title: How to Understand Surah Al-Fatiha
subtitle: A grammatical walkthrough
brand: Quranic Grammar
volume: Volume One
description: A self-contained word-by-word grammatical walkthrough of Surah Al-Fatiha for readers who know the Quran but have never studied Arabic grammar.
---

import AyahChapter from '../../components/ebook/AyahChapter.astro';
import FeaturedVerse from '../../components/ebook/FeaturedVerse.astro';
import WordGrid from '../../components/ebook/WordGrid.astro';
import GrammarMoment from '../../components/ebook/GrammarMoment.astro';

{/* INTRODUCTION — to be written in Task 23 */}

<section class="ebook-page intro-page">
  <div class="ac-number">Introduction</div>
  <h2 class="ac-title">Reading the Quran with grammatical eyes</h2>
  <div class="ac-body">
    <p>Placeholder introduction text. Replaced in Task 23.</p>
  </div>
  <div class="ebook-folio">3</div>
</section>

{/* CHAPTER 1 — BISMILLAH (placeholder; filled in Task 16) */}

<AyahChapter number="Chapter 01" title="In the name of the All-Merciful" folio={4}>
  <FeaturedVerse
    arabic="بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
    transliteration="bismi llāhi r-raḥmāni r-raḥīm"
    translation="In the name of Allah, the All-Merciful, the Especially Merciful."
  />
  <WordGrid words={[
    { ar: "بِسْمِ", tr: "bismi", gloss: "in the name of · genitive" },
    { ar: "ٱللَّهِ", tr: "llāhi", gloss: "Allah · genitive" },
    { ar: "ٱلرَّحْمَٰنِ", tr: "r-raḥmāni", gloss: "the All-Merciful · adjective" },
    { ar: "ٱلرَّحِيمِ", tr: "r-raḥīmi", gloss: "the Especially Merciful · adjective" },
  ]} />
  <GrammarMoment>
    Placeholder grammar moment. Replaced in Task 16.
  </GrammarMoment>
  <p>Placeholder reflective prose. Replaced in Task 16.</p>
</AyahChapter>
```

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: no new errors. (If the MDX import paths are wrong, fix them now.)

- [ ] **Step 3: Commit**

```bash
git add src/content/ebooks/sampler-al-fatiha.mdx
git commit -m "feat(ebooks): scaffold sampler MDX with imports and first placeholder chapter"
```

---

## Task 15: Create the sampler page route

**Files:**
- Create: `src/pages/ebooks/sampler.astro`

The Astro route that assembles cover + title page + MDX content + back cover, inside the `EbookPrint` layout.

- [ ] **Step 1: Create the file**

```astro
---
import { getEntry, render } from 'astro:content';
import EbookPrint from '../../layouts/EbookPrint.astro';
import CoverPage from '../../components/ebook/CoverPage.astro';
import TitlePage from '../../components/ebook/TitlePage.astro';
import BackCover from '../../components/ebook/BackCover.astro';

const entry = await getEntry('ebooks', 'sampler-al-fatiha');
if (!entry) throw new Error('Ebook content not found: sampler-al-fatiha');
const { Content } = await render(entry);
const { title, subtitle, brand, volume, byline, description } = entry.data;
---
<EbookPrint title={title} description={description}>
  <CoverPage
    title={title}
    subtitle={subtitle}
    brand={brand}
    volume={volume}
    byline={byline}
  />
  <TitlePage
    title={title}
    subtitle={subtitle}
    brand={brand}
    volume={volume}
  />
  <Content />
  <BackCover brand={brand} />
</EbookPrint>
```

- [ ] **Step 2: Run the dev server**

```bash
npm run dev
```

Visit http://localhost:4321/ebooks/sampler/ — verify:
1. The cover renders correctly (dark, gold hairlines, title between them)
2. The title page renders correctly
3. The placeholder introduction renders
4. The placeholder Chapter 01 renders with featured Bismillah, word grid, and grammar moment box
5. The back cover renders at the bottom

If anything is wrong, fix it now before adding content.

- [ ] **Step 3: Stop the dev server (Ctrl-C) and run the build**

```bash
npm run build
```

Expected: build succeeds with no errors. The route should be statically generated to `dist/ebooks/sampler/index.html`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ebooks/sampler.astro
git commit -m "feat(ebooks): add sampler page route assembling cover, content, back cover"
```

---

## Task 16: Write Chapter 1 — Bismillah

**Files:**
- Modify: `src/content/ebooks/sampler-al-fatiha.mdx`

Replace the placeholder Chapter 01 with finished content: ~150-word closing prose, a substantive Grammar Moment.

- [ ] **Step 1: Replace the Chapter 01 block**

Locate the existing `{/* CHAPTER 1 — BISMILLAH */}` block in `sampler-al-fatiha.mdx` and replace it with:

```mdx
<AyahChapter number="Chapter 01" title="In the name of the All-Merciful" folio={4}>
  <FeaturedVerse
    arabic="بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
    transliteration="bismi llāhi r-raḥmāni r-raḥīm"
    translation="In the name of Allah, the All-Merciful, the Especially Merciful."
  />
  <WordGrid words={[
    { ar: "بِسْمِ", tr: "bismi", gloss: "in the name · genitive" },
    { ar: "ٱللَّهِ", tr: "llāhi", gloss: "Allah · genitive" },
    { ar: "ٱلرَّحْمَٰنِ", tr: "r-raḥmāni", gloss: "the All-Merciful · adjective" },
    { ar: "ٱلرَّحِيمِ", tr: "r-raḥīmi", gloss: "the Especially Merciful · adjective" },
  ]} />
  <GrammarMoment>
    <em>بِسْمِ</em> is two pieces glued together: the preposition <em>بِـ</em> (with, in) and the noun <em>اِسْم</em> (name). Whenever a preposition attaches to a noun, the noun takes the genitive case — that's why the word ends in a <em>kasrah</em> (the small dash beneath the letter). The same case ending then ripples down through every word that follows, because each of them describes <em>اللَّهِ</em>.
  </GrammarMoment>
  <p>The whole verse is a single prepositional phrase, not a complete sentence. Arabic readers feel the suspense in this — *in the name of God, the All-Merciful, the Especially Merciful…* waits, leaning forward, for the act that the next verse will declare. The grammar itself is reverent. Before any verb of praise or supplication, the speaker first names the One in whose name the action is being undertaken.</p>
  <p>This sets the pattern for the entire surah: every grammatical choice here is doing theological work. The two divine names that close the verse aren't adjectives stacked for poetic emphasis — they are precisely calibrated. <em>الرَّحْمَن</em> denotes encompassing, structural mercy (the kind that gives existence). <em>الرَّحِيم</em> denotes intentional, addressed mercy (the kind that responds to a worshipper).</p>
</AyahChapter>
```

- [ ] **Step 2: Preview**

```bash
npm run dev
```

Visit http://localhost:4321/ebooks/sampler/ and verify Chapter 01 reads correctly with the new content.

- [ ] **Step 3: Commit**

```bash
git add src/content/ebooks/sampler-al-fatiha.mdx
git commit -m "feat(ebooks): write Chapter 01 (Bismillah)"
```

---

## Task 17: Write Chapter 2 — Al-ḥamdu lillāhi rabbi l-ʿālamīn

**Files:**
- Modify: `src/content/ebooks/sampler-al-fatiha.mdx`

Add Chapter 02 immediately after Chapter 01.

- [ ] **Step 1: Append Chapter 02 block**

After the `</AyahChapter>` closing tag of Chapter 01, add:

```mdx
<AyahChapter number="Chapter 02" title="All praise belongs to the Lord" folio={6}>
  <FeaturedVerse
    arabic="ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ"
    transliteration="al-ḥamdu lillāhi rabbi l-ʿālamīn"
    translation="All praise belongs to Allah, Lord of all the worlds."
  />
  <WordGrid words={[
    { ar: "ٱلْحَمْدُ", tr: "al-ḥamdu", gloss: "the praise · subject (nom.)" },
    { ar: "لِلَّهِ", tr: "lillāhi", gloss: "to / for Allah · genitive" },
    { ar: "رَبِّ", tr: "rabbi", gloss: "Lord of · iḍāfah" },
    { ar: "ٱلْعَٰلَمِينَ", tr: "l-ʿālamīn", gloss: "the worlds · plural, genitive" },
  ]} />
  <GrammarMoment>
    <em>رَبِّ ٱلْعَٰلَمِينَ</em> is an <em>iḍāfah</em> — a possessive chain. The first word ("Lord of") is the possessed; the second ("the worlds") is the possessor. In every Arabic iḍāfah, the possessor takes the genitive case, which is why <em>ٱلْعَٰلَمِينَ</em> ends in <em>-īn</em> (the sound masculine plural genitive ending) rather than <em>-ūn</em> (its nominative form).
  </GrammarMoment>
  <p>The sentence opens with the definite article <em>al-</em> on <em>ḥamdu</em>. This is the article doing work most translations cannot convey: not "praise belongs to Allah" but *the* praise — every instance of it, in every world, by every being capable of it. The definite article in Arabic, when applied to an abstract noun, generalises rather than specifies.</p>
  <p>The verb is invisible. There is no "is" or "belongs" in the Arabic. Two nominal phrases sit beside each other and let the reader supply the relationship. This is the bedrock pattern of nominal sentences in Arabic — equivalence by adjacency.</p>
</AyahChapter>
```

- [ ] **Step 2: Preview the chapter**

Reload http://localhost:4321/ebooks/sampler/ and verify Chapter 02 renders cleanly.

- [ ] **Step 3: Commit**

```bash
git add src/content/ebooks/sampler-al-fatiha.mdx
git commit -m "feat(ebooks): write Chapter 02 (al-ḥamdu lillāhi rabbi l-ʿālamīn)"
```

---

## Task 18: Write Chapter 3 — Ar-Raḥmāni r-Raḥīm

**Files:**
- Modify: `src/content/ebooks/sampler-al-fatiha.mdx`

Append Chapter 03 after Chapter 02.

- [ ] **Step 1: Append Chapter 03 block**

```mdx
<AyahChapter number="Chapter 03" title="The two names of mercy, again" folio={8}>
  <FeaturedVerse
    arabic="ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
    transliteration="ar-raḥmāni r-raḥīm"
    translation="The All-Merciful, the Especially Merciful."
  />
  <WordGrid words={[
    { ar: "ٱلرَّحْمَٰنِ", tr: "ar-raḥmāni", gloss: "the All-Merciful · adjective (gen.)" },
    { ar: "ٱلرَّحِيمِ", tr: "r-raḥīmi", gloss: "the Especially Merciful · adjective (gen.)" },
  ]} />
  <GrammarMoment>
    These are not new words — they returned. In Arabic grammar an adjective must agree with the noun it describes in four ways: gender, number, definiteness, and case. <em>ٱلرَّحْمَٰنِ</em> and <em>ٱلرَّحِيمِ</em> both end in a kasrah because they continue describing <em>اللَّهِ</em> from verse 1 (and <em>رَبِّ ٱلْعَٰلَمِينَ</em> from verse 2), both of which are genitive.
  </GrammarMoment>
  <p>Verse 3 is the shortest in the surah — two words. After the broad theological claim of verse 2 (*Lord of all the worlds*), the grammar pulls back to the intimate. Mercy. Mercy. Said twice, in slightly different forms, because Arabic distinguishes between mercy as a universal property of the cosmos and mercy as a personal attention paid to a single person at a single moment.</p>
  <p>You have already met these two words — once in the bismillāh, and now again here. The repetition is intentional. Arabic literature often binds passages together by recalling earlier words; the Quran does this systematically.</p>
</AyahChapter>
```

- [ ] **Step 2: Preview the chapter**

Reload and verify.

- [ ] **Step 3: Commit**

```bash
git add src/content/ebooks/sampler-al-fatiha.mdx
git commit -m "feat(ebooks): write Chapter 03 (ar-raḥmāni r-raḥīm)"
```

---

## Task 19: Write Chapter 4 — Māliki yawmi d-dīn

**Files:**
- Modify: `src/content/ebooks/sampler-al-fatiha.mdx`

- [ ] **Step 1: Append Chapter 04 block**

```mdx
<AyahChapter number="Chapter 04" title="Master of the day of reckoning" folio={10}>
  <FeaturedVerse
    arabic="مَٰلِكِ يَوْمِ ٱلدِّينِ"
    transliteration="māliki yawmi d-dīn"
    translation="Master of the day of recompense."
  />
  <WordGrid words={[
    { ar: "مَٰلِكِ", tr: "māliki", gloss: "Master of · iḍāfah (gen.)" },
    { ar: "يَوْمِ", tr: "yawmi", gloss: "day of · iḍāfah (gen.)" },
    { ar: "ٱلدِّينِ", tr: "d-dīn", gloss: "the recompense · gen." },
  ]} />
  <GrammarMoment>
    This verse contains an <em>iḍāfah</em> chain three terms long: <em>مَٰلِكِ</em> owns <em>يَوْمِ</em>, which in turn owns <em>ٱلدِّين</em>. In a chain like this only the very last word receives the definite article; every word in the middle gets its definiteness from being possessed by something definite at the end. That's why <em>مَٰلِكِ</em> and <em>يَوْمِ</em> have no <em>al-</em> on them but still translate as "the Master" and "the day".
  </GrammarMoment>
  <p>Verse 4 is the structural pivot of Surah Al-Fatiha. The first three verses described who God is: a Lord, a Mercy, a Mercy again. This verse names what He does: He governs the day of reckoning. The grammar matches the shift — the previous chain of adjectives ends, and a new genitive structure begins.</p>
  <p>The word <em>dīn</em> often gets translated as "religion" in modern usage, but its grammatical and Quranic register here is "judgment, recompense, the consequences that follow from a moral account." The day named here is the day those accounts are settled.</p>
</AyahChapter>
```

- [ ] **Step 2: Preview and commit**

```bash
git add src/content/ebooks/sampler-al-fatiha.mdx
git commit -m "feat(ebooks): write Chapter 04 (māliki yawmi d-dīn)"
```

---

## Task 20: Write Chapter 5 — Iyyāka naʿbudu wa-iyyāka nastaʿīn

**Files:**
- Modify: `src/content/ebooks/sampler-al-fatiha.mdx`

- [ ] **Step 1: Append Chapter 05 block**

```mdx
<AyahChapter number="Chapter 05" title="You alone we worship; You alone we ask" folio={12}>
  <FeaturedVerse
    arabic="إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"
    transliteration="iyyāka naʿbudu wa-iyyāka nastaʿīn"
    translation="You alone we worship, and from You alone we ask for help."
  />
  <WordGrid words={[
    { ar: "إِيَّاكَ", tr: "iyyāka", gloss: "You (alone) · object pronoun" },
    { ar: "نَعْبُدُ", tr: "naʿbudu", gloss: "we worship · present verb" },
    { ar: "وَإِيَّاكَ", tr: "wa-iyyāka", gloss: "and You (alone)" },
    { ar: "نَسْتَعِينُ", tr: "nastaʿīn", gloss: "we seek help · present verb" },
  ]} />
  <GrammarMoment>
    Word order matters in Arabic. The normal order is verb–subject–object. But this verse fronts the object: <em>إِيَّاكَ</em> ("you") comes *before* the verb. In Arabic, putting an object before its verb is a way of saying "only this, nothing else" — what grammarians call <em>ḥaṣr</em> (restriction). The translation has to add the word "alone" to convey what the Arabic conveys with pure word order.
  </GrammarMoment>
  <p>This verse is the hinge of the surah. The first four verses spoke *about* God in the third person — *He is the Lord, the Merciful, the Master*. From this verse onward the surah speaks *to* God in the second person — *You we worship, You we ask*. The grammar marks the shift cleanly: a new pronoun, a new direction of address.</p>
  <p>The verbs are first-person plural — *we worship, we ask*. Not *I*. Even a person reciting this surah alone is invited to speak in the plural, joining a vast invisible congregation of worshippers across time and place.</p>
</AyahChapter>
```

- [ ] **Step 2: Preview and commit**

```bash
git add src/content/ebooks/sampler-al-fatiha.mdx
git commit -m "feat(ebooks): write Chapter 05 (iyyāka naʿbudu wa-iyyāka nastaʿīn)"
```

---

## Task 21: Write Chapter 6 — Ihdina ṣ-ṣirāṭa l-mustaqīm

**Files:**
- Modify: `src/content/ebooks/sampler-al-fatiha.mdx`

- [ ] **Step 1: Append Chapter 06 block**

```mdx
<AyahChapter number="Chapter 06" title="Guide us to the straight path" folio={14}>
  <FeaturedVerse
    arabic="ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ"
    transliteration="ihdinā ṣ-ṣirāṭa l-mustaqīm"
    translation="Guide us to the straight path."
  />
  <WordGrid words={[
    { ar: "ٱهْدِ", tr: "ihdi", gloss: "guide · imperative" },
    { ar: "نَا", tr: "nā", gloss: "us · object pronoun" },
    { ar: "ٱلصِّرَٰطَ", tr: "ṣ-ṣirāṭa", gloss: "the path · object (acc.)" },
    { ar: "ٱلْمُسْتَقِيمَ", tr: "l-mustaqīm", gloss: "the straight · adjective (acc.)" },
  ]} />
  <GrammarMoment>
    <em>ٱهْدِنَا</em> is the first imperative verb in the surah — a command, but a command spoken upward, to God. In Arabic grammar this is still the imperative form; the politeness lives in the speaker's posture, not in any softening of the verb itself. The attached pronoun <em>نَا</em> ("us") is the direct object of the verb. Then <em>ٱلصِّرَٰطَ</em> is a second direct object — the path being requested. Arabic verbs of guidance and giving routinely take two objects like this.
  </GrammarMoment>
  <p>Notice the adjective. <em>ٱلْمُسْتَقِيمَ</em> ("the straight") agrees with <em>ٱلصِّرَٰط</em> in every dimension: masculine, singular, definite, accusative. All four boxes ticked. This is the deepest rule of Arabic adjective agreement, and the Quran follows it without exception.</p>
  <p>Up to this point the surah has been declarative — describing, naming, addressing. This verse turns to supplication. The fundamental need of the human being, the verse implies, is not knowledge or wealth or rescue from danger, but direction.</p>
</AyahChapter>
```

- [ ] **Step 2: Preview and commit**

```bash
git add src/content/ebooks/sampler-al-fatiha.mdx
git commit -m "feat(ebooks): write Chapter 06 (ihdinā ṣ-ṣirāṭa l-mustaqīm)"
```

---

## Task 22: Write Chapter 7 — Ṣirāṭa lladhīna anʿamta…

**Files:**
- Modify: `src/content/ebooks/sampler-al-fatiha.mdx`

- [ ] **Step 1: Append Chapter 07 block**

```mdx
<AyahChapter number="Chapter 07" title="The path of those You have favoured" folio={16}>
  <FeaturedVerse
    arabic="صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ"
    transliteration="ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa-la ḍ-ḍāllīn"
    translation="The path of those You have favoured — not of those who incurred wrath, nor of those who went astray."
  />
  <WordGrid words={[
    { ar: "صِرَٰطَ", tr: "ṣirāṭa", gloss: "the path of · iḍāfah" },
    { ar: "ٱلَّذِينَ", tr: "lladhīna", gloss: "those who · relative pronoun" },
    { ar: "أَنْعَمْتَ", tr: "anʿamta", gloss: "You favoured · past verb" },
    { ar: "عَلَيْهِمْ", tr: "ʿalayhim", gloss: "upon them" },
    { ar: "غَيْرِ", tr: "ghayri", gloss: "not of · exception" },
    { ar: "ٱلْمَغْضُوبِ", tr: "l-maghḍūbi", gloss: "those wrath fell on" },
    { ar: "وَلَا", tr: "wa-lā", gloss: "and not" },
    { ar: "ٱلضَّآلِّينَ", tr: "ḍ-ḍāllīn", gloss: "those astray" },
  ]} />
  <GrammarMoment>
    <em>ٱلَّذِينَ</em> is a relative pronoun — "those who." A relative pronoun in Arabic introduces a clause that describes the noun before it. Here, <em>صِرَٰطَ</em> ("the path of") is followed by <em>ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ</em> ("those upon whom You have bestowed favour"). The whole clause works as a single grammatical unit describing the path.
  </GrammarMoment>
  <p>This is the longest verse of the surah, and grammatically the densest. It contains an iḍāfah (<em>ṣirāṭa lladhīna</em>), a past-tense verb with an attached pronoun (<em>anʿamta</em>), a prepositional phrase (<em>ʿalayhim</em>), and a long exception structure (<em>ghayri… wa-lā…</em>) that names what the path is *not*.</p>
  <p>The surah ends with two negatives. After six verses of declaration and request, the final breath is a definition by exclusion. The path is the one *those who were favoured* walked. It is not the path *those who incurred wrath* walked. It is not the path *those who lost their way* walked. The grammar makes the request precise: not just any path, this exact one, named by its travellers.</p>
</AyahChapter>
```

- [ ] **Step 2: Preview the page and check for line-break problems**

Reload http://localhost:4321/ebooks/sampler/ and look closely at Verse 7 — it's the longest. Watch for the Arabic line wrapping at an awkward place. If it does, either:
- Reduce the featured-verse font-size for this verse specifically (add a chapter-local style override), or
- Insert a manual `<br>` mid-verse to control the wrap

- [ ] **Step 3: Commit**

```bash
git add src/content/ebooks/sampler-al-fatiha.mdx
git commit -m "feat(ebooks): write Chapter 07 (ṣirāṭa lladhīna anʿamta…)"
```

---

## Task 23: Write the Introduction

**Files:**
- Modify: `src/content/ebooks/sampler-al-fatiha.mdx`

Replace the placeholder introduction block at the top of the MDX with two pages of real content.

- [ ] **Step 1: Replace the Introduction block**

Find the `{/* INTRODUCTION */}` block and replace its content with:

```mdx
<section class="ebook-page intro-page">
  <div class="ac-number">Introduction</div>
  <h2 class="ac-title">Reading the Quran with grammatical eyes</h2>
  <div class="ac-body">
    <p>If you have ever read Surah Al-Fatiha — recited it in prayer, listened to a reciter on a phone, found it printed at the front of a mushaf — then this book is for you. It assumes you can sound the words out. It does not assume you know what they do.</p>
    <p>Most translations of the Quran are honest about what each verse <em>means</em>. Very few translations explain what the Arabic <em>is</em>. There is a difference. The meaning is what a translator landed on. The grammar is the engine that produced it.</p>
    <p>This short book walks through Surah Al-Fatiha one verse at a time. Each chapter takes a single verse, breaks it into its words, and surfaces the one or two grammatical concepts that shape its meaning. The goal is not for you to memorise rules. The goal is for you to read a verse you have heard a thousand times and, for the first time, see what is actually holding it together.</p>
    <p>Surah Al-Fatiha is short, but it touches almost every basic grammatical concept Arabic has: the definite article, the genitive case, possessive chains, adjective agreement, restriction through word order, the imperative, relative pronouns. By the end of these seven chapters you will have met all of them — not as items in a textbook, but as living parts of a surah you already know.</p>
  </div>
</section>

<section class="ebook-page intro-page">
  <div class="ac-number">How to read each chapter</div>
  <h2 class="ac-title">The shape of every page</h2>
  <div class="ac-body">
    <p>Each chapter follows the same rhythm. First, the verse appears in full — Arabic, transliteration, English. Sit with it for a moment.</p>
    <p>Then comes a four-column breakdown: each word, its sound, its meaning, and a short note about the grammatical role it plays. Read this slowly. The grammar notes are intentionally compact; they are meant to be returned to, not absorbed at first pass.</p>
    <p>After the breakdown, you will find a <em>Grammar moment</em> — a short box that names the single most important concept that verse is teaching. These add up. By the time you reach verse 7 you will have encountered seven foundational ideas, each anchored to a moment in the surah where the idea actually does something.</p>
    <p>Each chapter closes with a short reflective paragraph — what the grammar reveals about the meaning. This is where the book treats the surah as something to be understood, not just decoded.</p>
    <p>At the end of the book there is a glossary of every Arabic grammar term used, and a note on where to go next if you want to take this further.</p>
  </div>
</section>
```

- [ ] **Step 2: Preview**

Reload http://localhost:4321/ebooks/sampler/. Verify the introduction now reads as a two-page spread.

- [ ] **Step 3: Commit**

```bash
git add src/content/ebooks/sampler-al-fatiha.mdx
git commit -m "feat(ebooks): write Introduction (2 pages)"
```

---

## Task 24: Write the Glossary

**Files:**
- Modify: `src/content/ebooks/sampler-al-fatiha.mdx`

After the last chapter (Chapter 07), add a `<Glossary />` block listing every grammar term used in the seven chapters.

- [ ] **Step 1: Add the Glossary import to the top of the MDX**

In the imports block at the top of the file, add:

```mdx
import Glossary from '../../components/ebook/Glossary.astro';
```

- [ ] **Step 2: Append a Glossary block after Chapter 07**

After `</AyahChapter>` of Chapter 07, add:

```mdx
<Glossary folio={18} entries={[
  { ar: "إِضَافَة", tr: "iḍāfah", def: "A possessive chain: noun A 'of' noun B. The second noun is always genitive." },
  { ar: "اسْم", tr: "ism", def: "A noun. The category covers nouns proper, adjectives, and most pronouns." },
  { ar: "اسْم مَوْصُول", tr: "ism mawṣūl", def: "A relative pronoun: 'who, which, that' — introduces a clause that describes a noun." },
  { ar: "أَمْر", tr: "amr", def: "The imperative form of a verb — a command." },
  { ar: "جَرّ", tr: "jarr", def: "The genitive case. Marked by a kasrah ending; used after prepositions and in iḍāfah." },
  { ar: "حَرْف", tr: "ḥarf", def: "A particle. The category covers prepositions, conjunctions, and other small grammatical words." },
  { ar: "حَصْر", tr: "ḥaṣr", def: "Restriction. A grammatical technique — often via word order — that means 'only this, nothing else'." },
  { ar: "صِفَة", tr: "ṣifah", def: "An adjective. Must agree with its noun in gender, number, definiteness, and case." },
  { ar: "ضَمِير", tr: "ḍamīr", def: "A pronoun, attached or independent." },
  { ar: "فِعْل", tr: "fiʿl", def: "A verb." },
  { ar: "كَسْرَة", tr: "kasrah", def: "The short 'i' vowel — a small diagonal stroke beneath a letter. Marks the genitive case on a noun." },
  { ar: "مُبْتَدَأ", tr: "mubtadaʾ", def: "The subject of a nominal sentence (one beginning with a noun rather than a verb)." },
  { ar: "نَصْب", tr: "naṣb", def: "The accusative case. Marked by a fatḥah ending; used on direct objects, among other roles." },
  { ar: "هَمْزَة الْوَصْل", tr: "hamzat al-waṣl", def: "A 'connecting alif' written as ا that drops out when preceded by another vowel." },
]} />
```

- [ ] **Step 3: Preview and commit**

```bash
git add src/content/ebooks/sampler-al-fatiha.mdx
git commit -m "feat(ebooks): write Glossary (14 grammar terms)"
```

---

## Task 25: Write the "Where to go next" page

**Files:**
- Modify: `src/content/ebooks/sampler-al-fatiha.mdx`

A single page after the glossary that points the reader to the upcoming Foundation Book and quranic-grammar.com.

- [ ] **Step 1: Append the next-page block**

After the `<Glossary />` block, add:

```mdx
<section class="ebook-page intro-page">
  <div class="ac-number">Where to go next</div>
  <h2 class="ac-title">If this opened a door</h2>
  <div class="ac-body">
    <p>Surah Al-Fatiha is seven verses. The Quran has six thousand more. Every one of them is built from the same grammatical pieces you have just met — multiplied, varied, combined in ways the Fatiha barely hints at.</p>
    <p>If reading this book made you want to keep going, two next steps:</p>
    <p><strong>The Foundation Book</strong> — also from Quranic Grammar — takes the eleven foundation lessons of Quranic Arabic (alphabet, vowels, word types, the three-case system, sentence shapes) and walks you through them at the same pace as this book. It is the natural next read.</p>
    <p><strong>quranic-grammar.com</strong> — the free companion website to this book. The same content presented as an interactive curriculum, with exercises and quizzes the printed page cannot offer.</p>
    <p>Whichever path you choose, the rule is the same: slow down, read what is in front of you, and trust that the grammar will gradually become invisible. When it does, what remains is the Quran itself, in the voice it was written in.</p>
  </div>
  <div class="ebook-folio">20</div>
</section>
```

- [ ] **Step 2: Preview the full book**

```bash
npm run dev
```

Visit http://localhost:4321/ebooks/sampler/ and scroll through every page top-to-bottom. Verify:
- Cover renders correctly
- Title page renders correctly
- Two introduction pages render
- Seven ayah chapters render in order
- Glossary renders with two columns of terms
- "Where to go next" page renders
- Back cover renders

- [ ] **Step 3: Commit**

```bash
git add src/content/ebooks/sampler-al-fatiha.mdx
git commit -m "feat(ebooks): write 'Where to go next' page"
```

---

## Task 26: Install Playwright as a dev dependency

**Files:**
- Modify: `package.json`

Playwright is already a devDependency for the existing accessibility tests (`@playwright/test`). We need to ensure Chromium is installed locally.

- [ ] **Step 1: Verify Playwright is installed**

```bash
npx playwright --version
```

Expected: a version string like `Version 1.58.x`. If not, run `npm install`.

- [ ] **Step 2: Install Chromium**

```bash
npx playwright install chromium
```

Expected: download + install completes with no errors.

- [ ] **Step 3: Commit** (only if `package-lock.json` changed)

```bash
git add package-lock.json package.json
git diff --cached --quiet || git commit -m "chore(ebooks): ensure Playwright Chromium is installed"
```

---

## Task 27: Write the PDF renderer script

**Files:**
- Create: `scripts/render-ebook-pdf.ts`

Spawns a static-file server pointing at `dist/` (built earlier), opens the sampler route in headless Chromium, and saves a PDF.

- [ ] **Step 1: Create the file**

```ts
/**
 * scripts/render-ebook-pdf.ts
 *
 * Renders the sampler ebook (and listing preview images) to PDF/PNG
 * by serving the built static site locally and using Playwright.
 *
 * Usage:
 *   npm run build            # produce dist/
 *   npx tsx scripts/render-ebook-pdf.ts
 */

import { chromium, type Browser, type Page } from 'playwright';
import { createServer } from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const OUT_DIR = path.resolve(__dirname, '..', 'dist', 'ebooks');
const PORT = 4322;

// ---------- mini static file server ----------
async function startServer(): Promise<{ close: () => void }> {
  const types: Record<string, string> = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.woff2': 'font/woff2',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
  };
  const server = createServer(async (req, res) => {
    let url = req.url || '/';
    if (url.endsWith('/')) url += 'index.html';
    const filePath = path.join(DIST, decodeURIComponent(url));
    try {
      const data = await fs.readFile(filePath);
      res.setHeader('Content-Type', types[path.extname(filePath)] ?? 'application/octet-stream');
      res.end(data);
    } catch {
      res.statusCode = 404;
      res.end('Not found');
    }
  });
  await new Promise<void>((resolve) => server.listen(PORT, resolve));
  return { close: () => server.close() };
}

// ---------- render targets ----------
async function renderPdf(page: Page) {
  await page.emulateMedia({ media: 'print' });
  await page.goto(`http://localhost:${PORT}/ebooks/sampler/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(OUT_DIR, 'al-fatiha-sampler.pdf');
  await page.pdf({
    path: out,
    width: '5.5in',
    height: '8.5in',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log(`PDF written: ${out}`);
}

// ---------- main ----------
async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const srv = await startServer();
  let browser: Browser | null = null;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await renderPdf(page);
  } finally {
    if (browser) await browser.close();
    srv.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add the script command to package.json**

In `package.json` under `scripts`, add:

```json
"ebook:sampler": "npm run build && tsx scripts/render-ebook-pdf.ts"
```

- [ ] **Step 3: Run the script**

```bash
npm run ebook:sampler
```

Expected output:
- `npm run build` completes
- `PDF written: .../dist/ebooks/al-fatiha-sampler.pdf` printed to console
- No errors

- [ ] **Step 4: Verify the PDF**

```bash
ls -lh dist/ebooks/al-fatiha-sampler.pdf
```

Expected: file exists, size between 200 KB and 10 MB.

Open the file in a viewer (Mac Preview, or `open dist/ebooks/al-fatiha-sampler.pdf` on macOS). Walk through every page. Verify:
- Cover renders correctly with dark background, gold hairlines, title
- Title page renders correctly
- Introduction (2 pages) renders correctly
- 7 ayah chapters render in order, each on its own page with proper folios
- Featured verses use Amiri Quran (calligraphic Naskh)
- Word grids use Amiri (lighter Naskh)
- Grammar Moment callouts have soft-gold left border
- Glossary renders in two columns
- "Where to go next" renders correctly
- Back cover at the end

If any page is broken or fonts fall back to system defaults, fix and re-run.

- [ ] **Step 5: Commit**

```bash
git add scripts/render-ebook-pdf.ts package.json
git commit -m "feat(ebooks): add Playwright PDF renderer + npm script"
```

---

## Task 28: Create listing-preview routes

**Files:**
- Create: `src/pages/ebooks/sampler-preview-cover.astro`
- Create: `src/pages/ebooks/sampler-preview-spread-1.astro`
- Create: `src/pages/ebooks/sampler-preview-spread-2.astro`
- Create: `src/pages/ebooks/sampler-preview-spread-3.astro`

Each is a single-screen "marketing" preview — one image's worth of content, sized to match Etsy's listing image specs. These are not pages of the PDF; they are dedicated marketing thumbnails the Playwright runner screenshots.

- [ ] **Step 1: Create `sampler-preview-cover.astro`**

```astro
---
import { getEntry } from 'astro:content';
import EbookPrint from '../../layouts/EbookPrint.astro';
import CoverPage from '../../components/ebook/CoverPage.astro';

const entry = await getEntry('ebooks', 'sampler-al-fatiha');
if (!entry) throw new Error('Ebook content not found');
const { title, subtitle, brand, volume, byline } = entry.data;
---
<EbookPrint title={`${title} — cover preview`}>
  <CoverPage
    title={title}
    subtitle={subtitle}
    brand={brand}
    volume={volume}
    byline={byline}
  />
</EbookPrint>
```

- [ ] **Step 2: Create `sampler-preview-spread-1.astro`**

A single ayah chapter (Chapter 02) rendered alone for the listing.

```astro
---
import EbookPrint from '../../layouts/EbookPrint.astro';
import AyahChapter from '../../components/ebook/AyahChapter.astro';
import FeaturedVerse from '../../components/ebook/FeaturedVerse.astro';
import WordGrid from '../../components/ebook/WordGrid.astro';
import GrammarMoment from '../../components/ebook/GrammarMoment.astro';
---
<EbookPrint title="Sample — Chapter 02">
  <AyahChapter number="Chapter 02" title="All praise belongs to the Lord" folio={6}>
    <FeaturedVerse
      arabic="ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ"
      transliteration="al-ḥamdu lillāhi rabbi l-ʿālamīn"
      translation="All praise belongs to Allah, Lord of all the worlds."
    />
    <WordGrid words={[
      { ar: "ٱلْحَمْدُ", tr: "al-ḥamdu", gloss: "the praise · subject (nom.)" },
      { ar: "لِلَّهِ", tr: "lillāhi", gloss: "to / for Allah · genitive" },
      { ar: "رَبِّ", tr: "rabbi", gloss: "Lord of · iḍāfah" },
      { ar: "ٱلْعَٰلَمِينَ", tr: "l-ʿālamīn", gloss: "the worlds · plural, genitive" },
    ]} />
    <GrammarMoment>
      <em>رَبِّ ٱلْعَٰلَمِينَ</em> is an <em>iḍāfah</em> — a possessive chain. The second word is always genitive.
    </GrammarMoment>
  </AyahChapter>
</EbookPrint>
```

- [ ] **Step 3: Create `sampler-preview-spread-2.astro`**

A glossary preview.

```astro
---
import EbookPrint from '../../layouts/EbookPrint.astro';
import Glossary from '../../components/ebook/Glossary.astro';
---
<EbookPrint title="Sample — Glossary">
  <Glossary folio={18} entries={[
    { ar: "إِضَافَة", tr: "iḍāfah", def: "A possessive chain: noun A 'of' noun B. The second noun is always genitive." },
    { ar: "اسْم مَوْصُول", tr: "ism mawṣūl", def: "A relative pronoun: 'who, which, that'." },
    { ar: "حَصْر", tr: "ḥaṣr", def: "Restriction. A grammatical technique that means 'only this, nothing else'." },
    { ar: "صِفَة", tr: "ṣifah", def: "An adjective. Must agree with its noun in gender, number, definiteness, and case." },
    { ar: "كَسْرَة", tr: "kasrah", def: "The short 'i' vowel — marks the genitive case on a noun." },
    { ar: "مُبْتَدَأ", tr: "mubtadaʾ", def: "The subject of a nominal sentence." },
  ]} />
</EbookPrint>
```

- [ ] **Step 4: Create `sampler-preview-spread-3.astro`**

A featured-verse-only large preview — Verse 5 (the most visually striking).

```astro
---
import EbookPrint from '../../layouts/EbookPrint.astro';
import AyahChapter from '../../components/ebook/AyahChapter.astro';
import FeaturedVerse from '../../components/ebook/FeaturedVerse.astro';
import WordGrid from '../../components/ebook/WordGrid.astro';
---
<EbookPrint title="Sample — Chapter 05">
  <AyahChapter number="Chapter 05" title="You alone we worship; You alone we ask" folio={12}>
    <FeaturedVerse
      arabic="إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"
      transliteration="iyyāka naʿbudu wa-iyyāka nastaʿīn"
      translation="You alone we worship, and from You alone we ask for help."
    />
    <WordGrid words={[
      { ar: "إِيَّاكَ", tr: "iyyāka", gloss: "You (alone) · object pronoun" },
      { ar: "نَعْبُدُ", tr: "naʿbudu", gloss: "we worship · present verb" },
      { ar: "وَإِيَّاكَ", tr: "wa-iyyāka", gloss: "and You (alone)" },
      { ar: "نَسْتَعِينُ", tr: "nastaʿīn", gloss: "we seek help · present verb" },
    ]} />
  </AyahChapter>
</EbookPrint>
```

- [ ] **Step 5: Type-check + build**

```bash
npx astro check
npm run build
```

Expected: no errors. The four new pages should appear under `dist/ebooks/`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/ebooks/sampler-preview-cover.astro src/pages/ebooks/sampler-preview-spread-1.astro src/pages/ebooks/sampler-preview-spread-2.astro src/pages/ebooks/sampler-preview-spread-3.astro
git commit -m "feat(ebooks): add 4 listing preview routes (cover + 3 spreads)"
```

---

## Task 29: Extend the renderer to capture listing images

**Files:**
- Modify: `scripts/render-ebook-pdf.ts`

Add a `renderListingImages()` function that screenshots the four preview routes at Etsy-recommended sizes.

- [ ] **Step 1: Add the screenshot function and wire it into `main()`**

Add this function above `main()`:

```ts
async function renderListingImages(page: Page) {
  const targets = [
    { route: '/ebooks/sampler-preview-cover/',    out: 'listing-cover.png',    width: 1600, height: 2400 },
    { route: '/ebooks/sampler-preview-spread-1/', out: 'listing-spread-1.png', width: 1200, height: 1500 },
    { route: '/ebooks/sampler-preview-spread-2/', out: 'listing-spread-2.png', width: 1200, height: 1500 },
    { route: '/ebooks/sampler-preview-spread-3/', out: 'listing-spread-3.png', width: 1200, height: 1500 },
  ];
  for (const t of targets) {
    await page.setViewportSize({ width: t.width, height: t.height });
    await page.goto(`http://localhost:${PORT}${t.route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(OUT_DIR, t.out);
    await page.screenshot({ path: out, fullPage: false, omitBackground: false });
    console.log(`Image written: ${out}`);
  }
}
```

Then update `main()`:

```ts
async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const srv = await startServer();
  let browser: Browser | null = null;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await renderPdf(page);
    await renderListingImages(page);
  } finally {
    if (browser) await browser.close();
    srv.close();
  }
}
```

- [ ] **Step 2: Run the renderer**

```bash
npm run ebook:sampler
```

Expected: PDF + 4 PNG files written to `dist/ebooks/`.

- [ ] **Step 3: Verify the image sizes**

```bash
ls -lh dist/ebooks/
```

Each PNG should be under 5 MB (Etsy's per-image limit). The cover should be exactly 1600×2400; the spreads exactly 1200×1500. Confirm with:

```bash
file dist/ebooks/listing-cover.png
```

Expected: PNG, 1600 x 2400 dimensions.

If a spread image looks zoomed-in (because its content only fills part of the viewport), the route's content is shorter than the viewport — that's OK, the screenshot captures the visible region only. If a spread looks crowded (cropped at the bottom), reduce the content or increase the height.

- [ ] **Step 4: Commit**

```bash
git add scripts/render-ebook-pdf.ts
git commit -m "feat(ebooks): capture listing image assets (cover + 3 spread previews)"
```

---

## Task 30: Cross-reader verification + final QA

**Files:** None modified — verification only.

- [ ] **Step 1: Open the PDF in Mac Preview**

```bash
open dist/ebooks/al-fatiha-sampler.pdf
```

Page through every page. Check:
- Fonts are rendering as Geist + Amiri Quran + Amiri (not falling back to Times or system defaults)
- Page count is 18–22 (cover + title + 2 intro + 7 chapters + 2 glossary spread + 1 next-page + back cover; some chapters may run to 2 pages if content overflows)
- Folios appear on every page from the introduction onward
- Page-break boundaries are clean — no orphaned word rows, no callouts split across pages

- [ ] **Step 2: Open the PDF in Chrome's built-in viewer**

```bash
open -a "Google Chrome" dist/ebooks/al-fatiha-sampler.pdf
```

Re-check the same items. Chrome and Preview occasionally disagree on font fallback — if they do, increase the font preload list in `EbookPrint.astro`.

- [ ] **Step 3: Check file size**

```bash
ls -lh dist/ebooks/al-fatiha-sampler.pdf
```

Must be ≤ 20 MB (Etsy's limit). Typical expected size for this book: 1–4 MB.

- [ ] **Step 4: Verify fonts embedded**

```bash
# macOS: requires Homebrew's poppler
brew install poppler 2>/dev/null
pdffonts dist/ebooks/al-fatiha-sampler.pdf
```

Expected: a table listing Geist, Geist Mono, Amiri, Amiri Quran. Each row's `emb` column should read `yes`.

If a row reads `no`, the font wasn't embedded — likely because Chromium didn't load it before generating the PDF. Fix by adding it to the `<link rel="preload">` list in `EbookPrint.astro`.

- [ ] **Step 5: Open the four listing images and visually verify**

```bash
open dist/ebooks/listing-cover.png
open dist/ebooks/listing-spread-1.png
open dist/ebooks/listing-spread-2.png
open dist/ebooks/listing-spread-3.png
```

Each should look like a clean, well-cropped marketing image at the dimensions stated. No font fallback, no cropped text.

- [ ] **Step 6: Final commit summarising verification**

```bash
git commit --allow-empty -m "chore(ebooks): verify final PDF and listing images render correctly"
```

---

## Out of scope (deferred from spec §11)

These are intentionally not implemented by this plan. They are explicit spec deferrals or future work:

1. **Final author byline.** Currently brand-only. To swap in a personal name later, add `byline` to the MDX frontmatter.
2. **Etsy listing copy.** ~400 words of SEO-optimised description text. Written separately when uploading to Etsy.
3. **PDF accessibility / tagged structure.** Chromium does not produce tagged PDFs; out of scope for V1.
4. **EPUB / Kindle versions.** PDF only for V1.
5. **iPad / Kindle Fire colour-accurate proofing.** Recommended before listing goes live; not part of code.

---

## Done criteria

- [ ] Feature branch `feat/sampler-al-fatiha-pdf` exists with all task commits
- [ ] `dist/ebooks/al-fatiha-sampler.pdf` renders with all 7 chapters, intro, glossary, next-page, cover, back cover
- [ ] `dist/ebooks/listing-cover.png` (1600×2400) and three `listing-spread-N.png` (1200×1500) files exist
- [ ] All 4 fonts (Geist, Geist Mono, Amiri, Amiri Quran) embedded in the PDF
- [ ] PDF file size ≤ 20 MB
- [ ] PDF visually verified in Mac Preview and Chrome
- [ ] `npm run build` passes
- [ ] `npx astro check` shows no new errors introduced by ebook code
