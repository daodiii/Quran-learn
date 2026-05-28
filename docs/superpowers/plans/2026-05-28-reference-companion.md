# Reference Companion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a ~110-page paid PDF ebook ("Quranic Grammar Reference Companion") that compiles the 8 source MDX resource files into a single designed reference book using the Sampler's locked visual system, plus 4 Etsy listing images.

**Architecture:** Astro static site builds a print-only route that uses 10 new components on top of the existing Sampler infrastructure. A Playwright script renders the route to PDF and PNG using system Chrome. A two-pass render injects real page numbers into the master TOC. Source resource MDX is rewritten (not imported) into a single book MDX with all web-only language stripped.

**Tech Stack:** Astro 4 (existing), TypeScript, MDX, Playwright (channel: 'chrome'), Geist + Geist Mono + Amiri + Amiri Quran fonts (already self-hosted in `public/fonts/`), CSS Paged Media, system Chrome via `channel: 'chrome'`.

**Spec:** `docs/superpowers/specs/2026-05-28-reference-companion-design.md`

**Current branch:** `feat/reference-companion` (already created off the Sampler branch).

---

## File structure

### New files

```
docs/superpowers/plans/2026-05-28-reference-companion.md           ← this file
src/content/ebooks/reference-companion.mdx                          ← all book content
src/pages/ebooks/
  reference-companion.astro                                         ← full-book route
  reference-companion-preview-cover.astro                           ← 1600×2400 cover
  reference-companion-preview-spread-1.astro                        ← 1200×1500
  reference-companion-preview-spread-2.astro                        ← 1200×1500
  reference-companion-preview-spread-3.astro                        ← 1200×1500
src/components/ebook/
  ReferenceCover.astro                                              ← § cover variant
  SectionDivider.astro                                              ← section opener spread
  RunningHeader.astro                                               ← per-page header
  MasterToc.astro                                                   ← front TOC w/ page nums
  OrientationChapter.astro                                          ← 7 Principles layout
  SectionToc.astro                                                  ← per-chapter bullet TOC
  VocabRow.astro                                                    ← 4-col vocab row
  VocabGrid.astro                                                   ← wrapper for VocabRow set
  ChartBlock.astro                                                  ← gold-bracketed table wrap
  GlossaryEntry.astro                                               ← compact dictionary entry
  GlossaryLetterDivider.astro                                       ← Arabic letter break
scripts/
  extract-toc-pages.ts                                              ← pass-1 helper (extracted)
```

### Modified files

```
src/styles/ebook-print.css                                          ← + --mode-data + new comp rules
scripts/render-ebook-pdf.ts                                         ← config-driven; two-pass TOC
package.json                                                        ← + ebook:reference, ebook:all scripts
```

### Source files read but not modified

```
src/content/resources/*.mdx                                         ← 8 source files (read-only)
src/components/ebook/AyahChapter.astro                              ← inherited; not modified
src/components/ebook/CoverPage.astro                                ← inherited; not modified
src/components/ebook/FeaturedVerse.astro                            ← inherited; not modified
src/components/ebook/TitlePage.astro                                ← inherited; not modified
src/components/ebook/BackCover.astro                                ← inherited; not modified
src/components/ebook/Glossary.astro                                 ← Sampler glossary; not used here
src/layouts/EbookPrint.astro                                        ← inherited; not modified
```

---

## Conventions

- Commit message style: Conventional Commits, scope `ebooks` (matches Sampler history). Example: `feat(ebooks): add ReferenceCover with § ornament`. Never reference Claude or AI authorship.
- Each task ends with `git status` clean.
- After each rewrite task, run the smoke check (build + render + open PDF in Preview), then commit.
- All new print-only CSS goes in `src/styles/ebook-print.css` (NOT in scoped component `<style>` blocks) — this avoids the well-known scoped-CSS-vs-raw-MDX-class pitfall recorded in memory.
- All Arabic strings in TypeScript/JSX use direct UTF-8 (no `\u` escapes).
- Test before claiming done — run `npm run ebook:reference` and `pdffonts dist/ebooks/reference-companion.pdf` to confirm before committing the AC task.
- **Page numbering**: the Reference Companion uses auto-folio via `class="ebook-page-folio"` on body pages (Task 2 CSS defines the named page `refbody` with `@bottom-center { content: counter(page); }`). Do NOT add manual `<div class="ebook-folio">N</div>` on body pages — the named-page rule handles it. Cover, ReferenceCover, TitlePage, section dividers, and BackCover do NOT use `ebook-page-folio` (no folio appears on them). Numbering is absolute from the cover (cover = page 1) — there is no Roman/Arabic split.

---

## Task 1: Refactor renderer to config-driven multi-ebook

**Why:** Today's `scripts/render-ebook-pdf.ts` hard-codes the Sampler's slug. The Reference Companion needs to be added without duplicating the script.

**Files:**
- Modify: `scripts/render-ebook-pdf.ts`
- Modify: `package.json:scripts`

- [ ] **Step 1: Verify current sampler render still works (baseline)**

```bash
npm run ebook:sampler
```

Expected: produces `dist/ebooks/al-fatiha-sampler.pdf` (~170 KB, 14 pages) and 4 listing PNGs without errors. If this fails, stop and triage — the refactor needs a working baseline.

- [ ] **Step 2: Add EBOOKS config at top of `scripts/render-ebook-pdf.ts`**

Insert after the `PORT = 4322;` line:

```ts
interface EbookTarget {
  slug: string;          // route slug under /ebooks/
  pdfName: string;       // output filename in dist/ebooks/
  listingPrefix: string; // prefix for listing PNGs
}

const EBOOKS: EbookTarget[] = [
  {
    slug: 'sampler',
    pdfName: 'al-fatiha-sampler.pdf',
    listingPrefix: 'listing',  // matches existing sampler-preview-* routes via /sampler-preview-<n>/
  },
  {
    slug: 'reference-companion',
    pdfName: 'reference-companion.pdf',
    listingPrefix: 'reference-companion-listing',
  },
];
```

- [ ] **Step 3: Rewrite `renderPdf()` to take an EbookTarget**

Replace the existing `renderPdf(page)` signature and body with:

```ts
async function renderPdf(page: Page, target: EbookTarget) {
  await page.emulateMedia({ media: 'print' });
  await page.goto(`http://localhost:${PORT}/ebooks/${target.slug}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(OUT_DIR, target.pdfName);
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
```

- [ ] **Step 4: Rewrite `renderListingImages()` to take an EbookTarget**

Replace the existing function with:

```ts
async function renderListingImages(page: Page, target: EbookTarget) {
  const sizes = [
    { suffix: 'cover',    out: `${target.listingPrefix}-cover.png`,    width: 1600, height: 2400 },
    { suffix: 'spread-1', out: `${target.listingPrefix}-spread-1.png`, width: 1200, height: 1500 },
    { suffix: 'spread-2', out: `${target.listingPrefix}-spread-2.png`, width: 1200, height: 1500 },
    { suffix: 'spread-3', out: `${target.listingPrefix}-spread-3.png`, width: 1200, height: 1500 },
  ];
  for (const s of sizes) {
    await page.setViewportSize({ width: s.width, height: s.height });
    await page.goto(
      `http://localhost:${PORT}/ebooks/${target.slug}-preview-${s.suffix}/`,
      { waitUntil: 'networkidle' }
    );
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(OUT_DIR, s.out);
    await page.screenshot({ path: out, fullPage: false, omitBackground: false });
    console.log(`Image written: ${out}`);
  }
}
```

Note: This **renames** the sampler listing images from `listing-cover.png` → `listing-cover.png` (sampler slug listingPrefix=`listing` keeps original names) but the route URL changes from `/ebooks/sampler-preview-cover/` to that same path. The new pattern `${target.slug}-preview-${s.suffix}` happens to be already what the sampler uses. ✓ No regression.

- [ ] **Step 5: Update `main()` to loop EBOOKS and accept optional CLI slug filter**

Replace the existing `main()` body with:

```ts
async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const slugFilter = process.argv[2]; // optional: only render this slug

  const targets = slugFilter
    ? EBOOKS.filter(e => e.slug === slugFilter)
    : EBOOKS;

  if (targets.length === 0) {
    throw new Error(`No ebook target matches slug "${slugFilter}". Known: ${EBOOKS.map(e => e.slug).join(', ')}`);
  }

  const srv = await startServer();
  let browser: Browser | null = null;
  try {
    browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage();
    for (const t of targets) {
      console.log(`\n=== Rendering: ${t.slug} ===`);
      await renderPdf(page, t);
      await renderListingImages(page, t);
    }
  } finally {
    if (browser) await browser.close();
    srv.close();
  }
}
```

- [ ] **Step 6: Add npm scripts to `package.json`**

Find the `"scripts": { ... }` block. Add (or replace existing `ebook:sampler` to match the new CLI):

```json
"ebook:sampler": "npm run build && tsx scripts/render-ebook-pdf.ts sampler",
"ebook:reference": "npm run build && tsx scripts/render-ebook-pdf.ts reference-companion",
"ebook:all": "npm run build && tsx scripts/render-ebook-pdf.ts"
```

- [ ] **Step 7: Run sampler-only via the new CLI — verify no regression**

```bash
npm run ebook:sampler
ls -la dist/ebooks/al-fatiha-sampler.pdf dist/ebooks/listing-cover.png
```

Expected: sampler PDF and 4 listing PNGs produced. Note: at this point `reference-companion` route doesn't exist yet — running `npm run ebook:reference` will 404 (correctly). That's fine; we wire it up in Task 3.

- [ ] **Step 8: Commit**

```bash
git add scripts/render-ebook-pdf.ts package.json
git commit -m "refactor(ebooks): make renderer config-driven for multi-ebook output"
```

---

## Task 2: Extend `ebook-print.css` with `--mode-data` density + new structural styles

**Why:** New components in later tasks expect `--mode-data` CSS variables, `.section-divider` page layout, running-header positioning, master-TOC styling, and glossary-entry typography. Pre-stage these so component tasks don't need to touch the stylesheet.

**Files:**
- Modify: `src/styles/ebook-print.css` (append, do not replace existing)

- [ ] **Step 1: Add `--mode-data` variables in the `:root` block**

Find the `:root { --eb-canvas: ... }` block (around line 110). Append inside the block, before the closing `}`:

```css
  /* Density modes (set per-block via wrapper class) */
  --eb-body-size: 13.5px;
  --eb-body-leading: 1.6;
  --eb-margin-top: 0.6in;
  --eb-margin-side: 0.5in;
  --eb-margin-bottom: 0.5in;
```

- [ ] **Step 2: Append data-mode block at end of file**

Add at the very end of `src/styles/ebook-print.css`:

```css
/* ============================================
   AUTO-FOLIO (Reference Companion only) — opt-in
   via .ebook-page-folio class. Uses a named page
   so the Sampler's hand-numbered folio behavior
   is unchanged. Chromium supports @page named pages
   and the @bottom-center margin box for paged media.
   ============================================ */
.ebook-page-folio { page: refbody; }
@page refbody {
  @bottom-center {
    content: counter(page);
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.22em;
    color: #5c5a52;
  }
}

/* ============================================
   DATA MODE — denser typography for charts,
   glossary, vocab rows. Toggled via .mode-data
   wrapper class. Keeps fonts/colors identical.
   ============================================ */
.mode-data {
  --eb-body-size: 10px;
  --eb-body-leading: 1.35;
}
.mode-data .chart-block,
.mode-data table {
  font-size: var(--eb-body-size);
  line-height: var(--eb-body-leading);
}
.mode-data .callout { padding: 8px 12px; }

/* ============================================
   RUNNING HEADERS — top of every page except
   cover/title/section dividers. Driven by
   <RunningHeader> component placed at top of
   each .ebook-page.
   ============================================ */
.eb-running {
  position: absolute;
  top: 0.28in;
  left: 0.5in;
  right: 0.5in;
  display: flex;
  justify-content: space-between;
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.22em;
  color: var(--eb-ink-mute-deep);
  text-transform: uppercase;
}
.eb-running-letter {
  font-family: 'Amiri Quran', serif;
  font-size: 28px;
  color: var(--eb-accent);
  letter-spacing: 0;
  text-transform: none;
  line-height: 1;
}
.eb-running-letter-name {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.22em;
  color: var(--eb-ink-mute-deep);
  margin-left: 8px;
  align-self: center;
}

/* ============================================
   SECTION DIVIDER spread — section number large,
   section name below, gold hairlines bracket.
   ============================================ */
.section-divider {
  background: var(--eb-canvas);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.2in 0.6in;
  text-align: center;
}
.section-divider-rule-top,
.section-divider-rule-bottom {
  width: 70%;
  height: 1px;
  background: var(--eb-accent);
}
.section-divider-inner {
  padding: 38px 0;
}
.section-divider-number {
  font-family: 'Geist Mono', monospace;
  font-size: 90px;
  font-weight: 400;
  color: var(--eb-accent);
  letter-spacing: 0.05em;
  line-height: 1;
  margin-bottom: 22px;
}
.section-divider-name {
  font-family: 'Geist', sans-serif;
  font-weight: 500;
  font-size: 22px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--eb-ink-primary);
}
.section-divider-blank {
  background: var(--eb-canvas);
}

/* ============================================
   MASTER TOC — front-of-book contents list,
   page-numbered (numbers injected post-render).
   ============================================ */
.master-toc {
  padding: 0.9in 0.6in 0.6in;
}
.master-toc-title {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--eb-accent);
  margin-bottom: 8px;
}
.master-toc-h {
  font-family: 'Geist', sans-serif;
  font-weight: 500;
  font-size: 22px;
  color: var(--eb-ink-primary);
  letter-spacing: -0.015em;
  margin: 0 0 28px;
}
.master-toc ol {
  list-style: none;
  margin: 0;
  padding: 0;
}
.master-toc li {
  display: flex;
  align-items: baseline;
  font-family: 'Geist', sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: var(--eb-ink-secondary);
  margin: 0 0 6px;
}
.master-toc li.section {
  font-family: 'Geist Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 10px;
  color: var(--eb-accent);
  margin-top: 18px;
  margin-bottom: 8px;
}
.master-toc li .toc-label { flex: 0 0 auto; }
.master-toc li .toc-dots {
  flex: 1 1 auto;
  border-bottom: 1px dotted var(--eb-hairline);
  margin: 0 8px;
  transform: translateY(-3px);
}
.master-toc li .toc-page {
  flex: 0 0 auto;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--eb-ink-muted);
}

/* ============================================
   SECTION TOC — per-chapter bulleted list,
   no page numbers; placed at top of chapters.
   ============================================ */
.section-toc {
  margin: 0 0 28px;
  padding: 12px 16px;
  border-left: 2px solid var(--eb-accent);
  background: var(--eb-callout-surface);
}
.section-toc-label {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--eb-accent);
  margin-bottom: 6px;
}
.section-toc ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.section-toc li {
  font-family: 'Geist', sans-serif;
  font-size: 11px;
  line-height: 1.5;
  color: var(--eb-ink-secondary);
  margin: 0 0 3px;
}

/* ============================================
   VOCAB GRID — 4-col rows (rank/arabic/translit/gloss)
   for the 200-most-used-words section.
   ============================================ */
.vocab-grid { width: 100%; }
.vocab-row {
  display: grid;
  grid-template-columns: 28px 1fr 1fr 1.6fr;
  column-gap: 12px;
  align-items: baseline;
  padding: 6px 0;
  border-bottom: 1px solid var(--eb-hairline);
}
.vocab-rank {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  color: var(--eb-ink-mute-deep);
  text-align: right;
}
.vocab-arabic {
  font-family: 'Amiri', serif;
  font-size: 16px;
  direction: rtl;
  text-align: right;
  color: var(--eb-ink-primary);
}
.vocab-translit {
  font-family: 'Geist Mono', monospace;
  font-size: 9.5px;
  color: var(--eb-ink-secondary);
  letter-spacing: 0.02em;
}
.vocab-gloss {
  font-family: 'Geist', sans-serif;
  font-size: 10.5px;
  color: var(--eb-ink-primary);
}

/* ============================================
   CHART BLOCK — wraps GrammarTable / VerbConjugation
   with gold-hairline brackets and Geist Mono label.
   ============================================ */
.chart-block {
  margin: 18px 0 22px;
  padding: 12px 0 0;
  border-top: 1px solid var(--eb-accent);
}
.chart-block-label {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--eb-accent);
  margin-bottom: 10px;
}
.chart-block-end {
  margin-top: 10px;
  height: 1px;
  background: var(--eb-hairline);
}
.chart-block table { width: 100%; border-collapse: collapse; }
.chart-block th,
.chart-block td {
  padding: 4px 8px;
  text-align: left;
  font-size: 10px;
  line-height: 1.35;
  border-bottom: 1px solid var(--eb-hairline);
  vertical-align: top;
}
.chart-block th {
  font-family: 'Geist Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--eb-ink-muted);
}
.chart-block { page-break-inside: avoid; }
.chart-block.verb-table { page-break-inside: auto; }

/* ============================================
   GLOSSARY — compact dictionary entry template.
   ============================================ */
.glossary-letter {
  display: flex;
  align-items: baseline;
  gap: 18px;
  padding: 28px 0 14px;
  border-bottom: 1px solid var(--eb-accent);
  margin: 16px 0 18px;
}
.glossary-letter-ar {
  font-family: 'Amiri Quran', serif;
  font-size: 84px;
  color: var(--eb-accent);
  line-height: 0.9;
}
.glossary-letter-name {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--eb-ink-muted);
}
.glossary-entry {
  margin: 0 0 22px;
  page-break-inside: avoid;
}
.glossary-entry-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2px;
}
.glossary-entry-term {
  font-family: 'Geist', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: var(--eb-ink-primary);
  letter-spacing: -0.005em;
}
.glossary-entry-term-mono {
  font-family: 'Geist Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--eb-accent);
  margin-right: 8px;
}
.glossary-entry-refs {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--eb-ink-muted);
}
.glossary-entry-translit {
  font-family: 'Geist', sans-serif;
  font-size: 11px;
  color: var(--eb-ink-muted);
  margin: 0 0 8px;
}
.glossary-entry-translit-ar {
  font-family: 'Amiri', serif;
  font-size: 14px;
  color: var(--eb-ink-primary);
  margin-right: 8px;
}
.glossary-entry-def {
  font-family: 'Geist', sans-serif;
  font-size: 11px;
  line-height: 1.5;
  color: var(--eb-ink-secondary);
  margin: 0 0 8px;
}
.glossary-entry-example {
  border-left: 1px solid var(--eb-accent);
  padding: 4px 12px;
  margin: 0 0 6px;
}
.glossary-entry-example-label {
  font-family: 'Geist Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--eb-accent);
  margin-bottom: 4px;
}
.glossary-entry-example-ar {
  font-family: 'Amiri Quran', serif;
  font-size: 14px;
  direction: rtl;
  text-align: right;
  color: var(--eb-ink-primary);
}
.glossary-entry-example-translit {
  font-family: 'Geist Mono', monospace;
  font-size: 9.5px;
  color: var(--eb-ink-muted);
  margin: 2px 0;
}
.glossary-entry-example-trans {
  font-family: 'Geist', sans-serif;
  font-style: italic;
  font-size: 10.5px;
  color: var(--eb-ink-secondary);
}
.glossary-entry-example-ref {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--eb-ink-mute-deep);
  margin-top: 2px;
}
.glossary-entry-note {
  font-family: 'Geist', sans-serif;
  font-size: 10.5px;
  line-height: 1.5;
  color: var(--eb-ink-secondary);
  margin: 6px 0 0;
}

/* ============================================
   ORIENTATION CHAPTER — numbered principle layout.
   ============================================ */
.orient-chapter { padding: 0.6in 0.5in 0.5in; }
.orient-number {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.24em;
  color: var(--eb-accent);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.orient-title {
  font-family: 'Geist', sans-serif;
  font-weight: 500;
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: var(--eb-ink-primary);
  margin: 0 0 24px;
}
.orient-body {
  font-family: 'Geist', sans-serif;
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--eb-ink-secondary);
  letter-spacing: -0.005em;
}
.orient-body p { margin: 0 0 14px; }
.orient-body em { font-style: italic; }
```

- [ ] **Step 3: Run sampler render — verify no visual regression**

```bash
npm run ebook:sampler
```

Expected: PDF identical to before (the new CSS rules use classes the Sampler doesn't have; nothing should change visually). Open the PDF in Preview and spot-check 3 pages.

- [ ] **Step 4: Commit**

```bash
git add src/styles/ebook-print.css
git commit -m "feat(ebooks): add data-mode density + ref-companion print styles"
```

---

## Task 3: Scaffold reference-companion route + empty MDX + listing routes (smoke-rendering baseline)

**Why:** Stand up the routing skeleton first so every later task can be smoke-rendered immediately. The MDX starts empty (just frontmatter + a placeholder paragraph) so the build doesn't fail.

**Files:**
- Create: `src/content/ebooks/reference-companion.mdx`
- Create: `src/pages/ebooks/reference-companion.astro`
- Create: `src/pages/ebooks/reference-companion-preview-cover.astro`
- Create: `src/pages/ebooks/reference-companion-preview-spread-1.astro`
- Create: `src/pages/ebooks/reference-companion-preview-spread-2.astro`
- Create: `src/pages/ebooks/reference-companion-preview-spread-3.astro`

- [ ] **Step 1: Check existing ebook content schema**

```bash
cat src/content/config.ts 2>/dev/null || cat src/content.config.ts 2>/dev/null
```

Expected: shows the `ebooks` collection schema (likely Zod with `title`, `subtitle`, `brand`, `volume`, `byline`, `description`). Confirm the frontmatter fields supported. If not present, look at `src/content/ebooks/sampler-al-fatiha.mdx` frontmatter and mirror exactly.

- [ ] **Step 2: Create `src/content/ebooks/reference-companion.mdx`**

```mdx
---
title: "Quranic Grammar Reference Companion"
subtitle: "A Quick-Reference Kit for Classical Arabic"
brand: "Quranic Grammar"
volume: "Volume Three"
byline: ""
description: "Verb tables, case endings, pronoun charts, the 200 most-used Quran words, the root system, and a 120-term grammar dictionary — designed as a desk-side reference."
---

{/* Content lands here in Tasks 13-20. Keep this placeholder so the route builds. */}

<div class="ebook-page">
  <p style="padding:1in;font-family:'Geist',sans-serif;color:#efe7d4;">
    Reference Companion — content in progress.
  </p>
  <div class="ebook-folio">1</div>
</div>
```

- [ ] **Step 3: Create `src/pages/ebooks/reference-companion.astro`**

```astro
---
import { getEntry, render } from 'astro:content';
import EbookPrint from '../../layouts/EbookPrint.astro';
import CoverPage from '../../components/ebook/CoverPage.astro';
import TitlePage from '../../components/ebook/TitlePage.astro';
import BackCover from '../../components/ebook/BackCover.astro';

const entry = await getEntry('ebooks', 'reference-companion');
if (!entry) throw new Error('Ebook content not found: reference-companion');
const { Content } = await render(entry);
const { title, subtitle, brand, volume, byline, description } = entry.data;
---
<EbookPrint title={title} description={description}>
  <CoverPage title={title} subtitle={subtitle} brand={brand} volume={volume} byline={byline} />
  <TitlePage title={title} subtitle={subtitle} brand={brand} volume={volume} />
  <Content />
  <BackCover brand={brand} />
</EbookPrint>
```

Note: This uses `CoverPage` temporarily — Task 4 swaps it for `ReferenceCover`.

- [ ] **Step 4: Create the 4 preview routes (stubs)**

For each of `cover`, `spread-1`, `spread-2`, `spread-3`, create a minimal route. Example for `reference-companion-preview-cover.astro`:

```astro
---
import EbookPrint from '../../layouts/EbookPrint.astro';
import CoverPage from '../../components/ebook/CoverPage.astro';
---
<EbookPrint title="Reference Companion — Cover Preview">
  <CoverPage
    title="Quranic Grammar Reference Companion"
    subtitle="A Quick-Reference Kit for Classical Arabic"
    brand="Quranic Grammar"
    volume="Volume Three"
  />
</EbookPrint>
```

For `spread-1`, `spread-2`, `spread-3`: same shell with a placeholder `<div class="ebook-page"><p style="padding:1in">Spread N preview — TBD</p></div>` body. (Real spread content lands in Task 23.)

- [ ] **Step 5: Build the site and smoke-run the renderer end-to-end**

```bash
npm run ebook:reference
```

Expected: `dist/ebooks/reference-companion.pdf` exists (probably 2-3 pages: cover, title, placeholder, back cover) and 4 PNGs at `dist/ebooks/reference-companion-listing-*.png`. Open the PDF — should show the Sampler-style cover with the new title.

- [ ] **Step 6: Commit**

```bash
git add src/content/ebooks/reference-companion.mdx src/pages/ebooks/reference-companion*.astro
git commit -m "feat(ebooks): scaffold reference-companion routes and empty MDX shell"
```

---

## Task 4: `ReferenceCover.astro` — § ornament + REFERENCE sublabel cover variant

**Why:** Replace the placeholder `CoverPage` with the Reference Companion's distinct cover (Sampler family resemblance + `§` mark + small `REFERENCE` label below the brand line).

**Files:**
- Create: `src/components/ebook/ReferenceCover.astro`
- Modify: `src/pages/ebooks/reference-companion.astro` (swap CoverPage → ReferenceCover)
- Modify: `src/pages/ebooks/reference-companion-preview-cover.astro` (same swap)

- [ ] **Step 1: Create `src/components/ebook/ReferenceCover.astro`**

Adapt from `CoverPage.astro` — replace the ornament with `§` and add a `cover-sublabel` element below `cover-brand`:

```astro
---
interface Props {
  title: string;
  subtitle?: string;
  brand?: string;
  volume?: string;
  byline?: string;
  sublabel?: string;
}

const {
  title,
  subtitle = 'A Quick-Reference Kit for Classical Arabic',
  brand = 'Quranic Grammar',
  volume = 'Volume Three',
  byline,
  sublabel = 'Reference',
} = Astro.props;
---
<section class="cover">
  <div class="cover-brand">{brand}</div>
  <div class="cover-sublabel">{sublabel}</div>
  <div class="cover-center">
    <div class="cover-ornament">§</div>
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
  .cover-sublabel {
    font-family: 'Geist Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.32em;
    color: #8a8275;
    text-transform: uppercase;
    text-align: center;
    margin-top: 6px;
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
    font-family: 'Geist Mono', monospace;
    color: #d4a85f;
    font-size: 36px;
    line-height: 1;
    margin-bottom: 22px;
  }
  .cover-title {
    font-family: 'Geist', sans-serif;
    font-weight: 500;
    font-size: 30px;
    line-height: 1.12;
    letter-spacing: -0.02em;
    color: #efe7d4;
    margin: 0 0 14px;
  }
  .cover-subtitle {
    font-family: 'Geist', sans-serif;
    font-style: italic;
    font-weight: 400;
    font-size: 13px;
    color: #8a8275;
    letter-spacing: -0.005em;
    margin: 0;
  }
  .cover-footer { text-align: center; }
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

- [ ] **Step 2: Wire it into the book route**

In `src/pages/ebooks/reference-companion.astro`:

Replace `import CoverPage from '../../components/ebook/CoverPage.astro';` with `import ReferenceCover from '../../components/ebook/ReferenceCover.astro';`.

Replace the `<CoverPage ... />` JSX with `<ReferenceCover title={title} subtitle={subtitle} brand={brand} volume={volume} byline={byline} />`.

- [ ] **Step 3: Wire it into the cover preview route**

Same swap in `src/pages/ebooks/reference-companion-preview-cover.astro`.

- [ ] **Step 4: Render and check the cover**

```bash
npm run ebook:reference
open dist/ebooks/reference-companion-listing-cover.png
```

Expected: dark canvas, `QURANIC GRAMMAR` in gold mono at top, `REFERENCE` in muted mono below it, two gold hairlines bracketing the centered `§` mark + title + italic subtitle, `VOLUME THREE` at bottom in muted mono. Reads as the Sampler's sibling at thumbnail scale.

- [ ] **Step 5: Commit**

```bash
git add src/components/ebook/ReferenceCover.astro src/pages/ebooks/reference-companion.astro src/pages/ebooks/reference-companion-preview-cover.astro
git commit -m "feat(ebooks): add ReferenceCover (§ ornament, REFERENCE sublabel)"
```

---

## Task 5: `SectionDivider.astro` — section opener spread

**Why:** Each of the 3 sections needs a divider spread. Component takes `number` and `name`, renders one blank page + one centered hairline-bracketed page.

**Files:**
- Create: `src/components/ebook/SectionDivider.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props {
  number: string;   // e.g. "01"
  name: string;     // e.g. "Vocabulary Quickstart"
  anchor?: string;  // e.g. "section-01" — used by MasterToc page-number injection
}
const { number, name, anchor } = Astro.props;
---
<section class="ebook-page section-divider-blank"></section>
<section
  class="ebook-page section-divider"
  data-toc-anchor={anchor}
>
  <div class="section-divider-rule-top"></div>
  <div class="section-divider-inner">
    <div class="section-divider-number">{number}</div>
    <div class="section-divider-name">{name}</div>
  </div>
  <div class="section-divider-rule-bottom"></div>
</section>
```

All CSS already in `ebook-print.css` (Task 2).

- [ ] **Step 2: Smoke-test by temporarily inserting in `reference-companion.mdx`**

Edit the MDX placeholder block to:

```mdx
import SectionDivider from '../../components/ebook/SectionDivider.astro';

<SectionDivider number="01" name="Vocabulary Quickstart" anchor="section-01" />
<SectionDivider number="02" name="Charts" anchor="section-02" />
<SectionDivider number="03" name="Glossary" anchor="section-03" />
```

- [ ] **Step 3: Render and visually verify**

```bash
npm run ebook:reference
open dist/ebooks/reference-companion.pdf
```

Expected: 3 section-divider spreads (each a blank left page + the gold-bracketed right page). Numbers `01 / 02 / 03` in huge mono gold, section names in caps below.

- [ ] **Step 4: Leave the dividers in the MDX**

The dividers stay — they'll be re-positioned and surrounded by content in Tasks 13-22.

- [ ] **Step 5: Commit**

```bash
git add src/components/ebook/SectionDivider.astro src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): add SectionDivider component + smoke-test 3 dividers"
```

---

## Task 6: `RunningHeader.astro` + integration

**Why:** Pages after Orientation need running headers (left page: book brand; right page: section + page number; glossary special-case: current letter big). Component renders the header markup; the parent page passes context.

**Files:**
- Create: `src/components/ebook/RunningHeader.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props {
  section?: string;        // e.g. "Charts", "Glossary"
  letter?: string;         // glossary mode: current Arabic letter (e.g. "ن")
  letterName?: string;     // glossary mode: latin name (e.g. "Nūn")
  page?: number;           // optional folio. If omitted, .ebook-folio handles it.
}
const { section, letter, letterName, page } = Astro.props;
const isGlossary = !!letter;
---
<header class="eb-running">
  <span class="eb-running-left">Quranic Grammar · Reference Companion</span>
  {isGlossary ? (
    <span class="eb-running-right">
      <span class="eb-running-letter">{letter}</span>
      <span class="eb-running-letter-name">{letterName}</span>
    </span>
  ) : (
    <span class="eb-running-right">
      {section}{page != null ? ` · ${page}` : ''}
    </span>
  )}
</header>
```

All CSS in `ebook-print.css` (Task 2: `.eb-running`, `.eb-running-letter`, `.eb-running-letter-name`).

- [ ] **Step 2: Smoke-test by adding to a section divider temporarily**

In `src/components/ebook/SectionDivider.astro`, add `<RunningHeader section={name} />` inside the right-page `<section>` (above the rule-top). After verifying, **remove it** — dividers don't use running headers. The point is to confirm the component renders without errors.

- [ ] **Step 3: Render and verify the header markup appears**

```bash
npm run ebook:reference
```

Open PDF — header should appear at top of section divider pages. Remove the temporary `<RunningHeader>` from SectionDivider.astro afterwards.

- [ ] **Step 4: Commit**

```bash
git add src/components/ebook/RunningHeader.astro
git commit -m "feat(ebooks): add RunningHeader (book/section + glossary letter modes)"
```

---

## Task 7: `MasterToc.astro` — front-of-book table of contents (page-number slots)

**Why:** The master TOC needs to render with empty page-number slots that get filled by the post-render pass (Task 21). This task stands up the markup and the empty-slot structure.

**Files:**
- Create: `src/components/ebook/MasterToc.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface TocItem {
  label: string;     // visible text
  anchor: string;    // matches data-toc-anchor on the target element
  kind?: 'section' | 'chapter' | 'subsection'; // styling tier
}
interface Props {
  items: TocItem[];
}
const { items } = Astro.props;
---
<section class="ebook-page ebook-page-folio master-toc">
  <div class="master-toc-title">Contents</div>
  <h2 class="master-toc-h">Quranic Grammar Reference Companion</h2>
  <ol>
    {items.map(item => (
      <li class={item.kind ?? 'chapter'}>
        <span class="toc-label">{item.label}</span>
        <span class="toc-dots"></span>
        <span class="toc-page" data-toc-page-for={item.anchor}>—</span>
      </li>
    ))}
  </ol>
</section>
```

The `data-toc-page-for` attribute is what the post-render script (Task 21) will find and overwrite with computed page numbers.

- [ ] **Step 2: Smoke-test by adding to the MDX**

In `src/content/ebooks/reference-companion.mdx`, above the SectionDividers, add:

```mdx
import MasterToc from '../../components/ebook/MasterToc.astro';

<MasterToc items={[
  { label: 'Orientation', anchor: 'orientation', kind: 'chapter' },
  { label: 'Section 01 — Vocabulary Quickstart', anchor: 'section-01', kind: 'section' },
  { label: 'Section 02 — Charts', anchor: 'section-02', kind: 'section' },
  { label: 'Section 03 — Glossary', anchor: 'section-03', kind: 'section' },
]} />
```

- [ ] **Step 3: Render and verify TOC structure**

```bash
npm run ebook:reference
open dist/ebooks/reference-companion.pdf
```

Expected: TOC page with `CONTENTS` mono label, big title, 4 entries with dot-leaders and `—` placeholders where page numbers will go. Section entries appear in gold mono caps; chapter entries in plain Geist.

- [ ] **Step 4: Commit**

```bash
git add src/components/ebook/MasterToc.astro src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): add MasterToc with page-number slot placeholders"
```

---

## Task 8: `OrientationChapter.astro` — numbered-principle layout

**Why:** Each of the 7 principles is a chapter-like block: mono number `01 / 02 / …`, Geist title, prose body. Sibling of `AyahChapter` but lighter-weight (no chapter-folio styling, no centered featured-verse).

**Files:**
- Create: `src/components/ebook/OrientationChapter.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props {
  number: string;   // e.g. "01"
  title: string;
  folio?: number;
  anchor?: string;
}
const { number, title, folio, anchor } = Astro.props;
---
<section class="ebook-page orient-chapter" data-toc-anchor={anchor}>
  <div class="orient-number">Principle {number}</div>
  <h2 class="orient-title">{title}</h2>
  <div class="orient-body"><slot /></div>
  {folio != null && <div class="ebook-folio">{folio}</div>}
</section>
```

All CSS in `ebook-print.css` (Task 2: `.orient-chapter`, `.orient-number`, `.orient-title`, `.orient-body`).

- [ ] **Step 2: Smoke-test with one principle in MDX**

In `src/content/ebooks/reference-companion.mdx`, above the MasterToc, add a test instance:

```mdx
import OrientationChapter from '../../components/ebook/OrientationChapter.astro';

<OrientationChapter number="01" title="Arabic is a system, not a vocabulary list" anchor="orient-01">
Arabic builds meaning out of three-letter roots applied to a small set
of patterns. Once you internalise the patterns, you can read words you
have never seen before.
</OrientationChapter>
```

- [ ] **Step 3: Render and verify**

```bash
npm run ebook:reference
```

Open PDF — should show the orientation page with mono `PRINCIPLE 01` label, Geist title, body text in secondary ink.

- [ ] **Step 4: Remove the smoke-test instance** (the real content lands in Task 14).

- [ ] **Step 5: Commit**

```bash
git add src/components/ebook/OrientationChapter.astro src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): add OrientationChapter component"
```

---

## Task 9: `SectionToc.astro` — per-chapter bulleted TOC

**Why:** Replaces every source-file "Quick Navigation" block. Bulleted list, no page numbers. Sits at the top of a chapter.

**Files:**
- Create: `src/components/ebook/SectionToc.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props {
  label?: string;     // e.g. "In this chapter"
  items: string[];    // bullet text (already-formatted markdown strings rendered as text)
}
const { label = 'In this chapter', items } = Astro.props;
---
<aside class="section-toc">
  <div class="section-toc-label">{label}</div>
  <ul>
    {items.map(text => <li>{text}</li>)}
  </ul>
</aside>
```

CSS already in `ebook-print.css` Task 2.

- [ ] **Step 2: Smoke-test in MDX**

Briefly add to the MDX:

```mdx
import SectionToc from '../../components/ebook/SectionToc.astro';

<SectionToc items={[
  "Overview: the three cases",
  "Singular nouns",
  "Dual nouns",
  "Sound masculine plural",
  "Sound feminine plural",
  "Broken plurals",
  "The five nouns",
]} />
```

- [ ] **Step 3: Render and verify, then remove the smoke-test**

```bash
npm run ebook:reference
```

Expected: a gold-bordered bullet block. Remove the test instance after verifying.

- [ ] **Step 4: Commit**

```bash
git add src/components/ebook/SectionToc.astro src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): add SectionToc component"
```

---

## Task 10: `VocabGrid.astro` + `VocabRow.astro` — 200-most-used-words layout

**Why:** Section 01 is 200 vocab rows. Grid wrapper + row component lets the source MDX pass an array and get a tight 4-column repeating layout.

**Files:**
- Create: `src/components/ebook/VocabRow.astro`
- Create: `src/components/ebook/VocabGrid.astro`

- [ ] **Step 1: Create `VocabRow.astro`**

```astro
---
interface Props {
  rank: number | string;
  arabic: string;
  translit: string;
  gloss: string;
}
const { rank, arabic, translit, gloss } = Astro.props;
---
<div class="vocab-row">
  <span class="vocab-rank">{rank}</span>
  <span class="vocab-arabic">{arabic}</span>
  <span class="vocab-translit">{translit}</span>
  <span class="vocab-gloss">{gloss}</span>
</div>
```

- [ ] **Step 2: Create `VocabGrid.astro`**

```astro
---
interface VocabEntry { rank: number | string; arabic: string; translit: string; gloss: string; }
interface Props { rows: VocabEntry[]; }
import VocabRow from './VocabRow.astro';
const { rows } = Astro.props;
---
<div class="vocab-grid mode-data">
  {rows.map(r => <VocabRow rank={r.rank} arabic={r.arabic} translit={r.translit} gloss={r.gloss} />)}
</div>
```

CSS already in `ebook-print.css` Task 2.

- [ ] **Step 3: Smoke-test with 5 rows in MDX**

```mdx
import VocabGrid from '../../components/ebook/VocabGrid.astro';

<VocabGrid rows={[
  { rank: 1, arabic: "اللّٰه", translit: "Allāh", gloss: "Allah / God" },
  { rank: 2, arabic: "قَالَ", translit: "qāla", gloss: "he said" },
  { rank: 3, arabic: "كَانَ", translit: "kāna", gloss: "he was" },
  { rank: 4, arabic: "إِنَّ", translit: "inna", gloss: "indeed (emphatic)" },
  { rank: 5, arabic: "مِنْ", translit: "min", gloss: "from / of" },
]} />
```

- [ ] **Step 4: Render and verify, then remove the smoke-test**

```bash
npm run ebook:reference
```

Expected: 5 rows with rank right-aligned in mono, big Amiri Arabic right-aligned, mono transliteration, Geist gloss. Hairlines between rows. Remove the test rows after verifying.

- [ ] **Step 5: Commit**

```bash
git add src/components/ebook/VocabRow.astro src/components/ebook/VocabGrid.astro src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): add VocabRow + VocabGrid for 200-words section"
```

---

## Task 11: `ChartBlock.astro` — gold-bracketed wrapper for tables

**Why:** Wraps every `<GrammarTable>` and `<VerbConjugation>` from the source MDX with a consistent gold-rule + mono-label frame.

**Files:**
- Create: `src/components/ebook/ChartBlock.astro`

- [ ] **Step 1: Create the component**

```astro
---
interface Props {
  label: string;        // e.g. "CHART · CASE ENDINGS — SINGULAR NOUNS"
  verbTable?: boolean;  // if true, allow page-break-inside (large verb tables)
}
const { label, verbTable = false } = Astro.props;
---
<div class={`chart-block mode-data ${verbTable ? 'verb-table' : ''}`}>
  <div class="chart-block-label">{label}</div>
  <slot />
  <div class="chart-block-end"></div>
</div>
```

CSS already in `ebook-print.css` Task 2.

- [ ] **Step 2: Smoke-test in MDX with the existing GrammarTable**

```mdx
import ChartBlock from '../../components/ebook/ChartBlock.astro';
import GrammarTable from '../../components/mdx/GrammarTable.astro';

<ChartBlock label="Chart · Test — Singular Nouns">
  <GrammarTable
    caption="The Three Cases"
    headers={["Case (English)", "Arabic Name", "Primary Function", "Typical Marker"]}
    rows={[
      ["Nominative", "الرَّفْعُ (ar-rafʿu)", "Subject of verb or sentence", "ـُ (ḍammah)"],
      ["Accusative", "النَّصْبُ (an-naṣbu)", "Direct object, adverb", "ـَ (fatḥah)"],
      ["Genitive", "الجَرُّ (al-jarru)", "After preposition, possessed noun", "ـِ (kasrah)"],
    ]}
    rtl={false}
  />
</ChartBlock>
```

- [ ] **Step 3: Render and verify, then remove the smoke-test**

```bash
npm run ebook:reference
```

Expected: gold top rule, mono uppercase label, then the table rendered in dense `--mode-data` typography (10px body, tight rows, 1px hairlines between rows), gold-muted hairline at bottom. Remove test content after verifying.

- [ ] **Step 4: Commit**

```bash
git add src/components/ebook/ChartBlock.astro src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): add ChartBlock wrapper for tables"
```

---

## Task 12: `GlossaryEntry.astro` + `GlossaryLetterDivider.astro`

**Why:** The compact dictionary-style entry template (spec §3.8) and the per-letter divider that drives the running header.

**Files:**
- Create: `src/components/ebook/GlossaryEntry.astro`
- Create: `src/components/ebook/GlossaryLetterDivider.astro`

- [ ] **Step 1: Create `GlossaryLetterDivider.astro`**

```astro
---
interface Props {
  letter: string;       // Arabic letter (e.g. "ن")
  letterName: string;   // Latin name (e.g. "Nūn")
  anchor?: string;      // e.g. "gloss-n"
}
const { letter, letterName, anchor } = Astro.props;
---
<div class="glossary-letter" data-toc-anchor={anchor} data-glossary-letter={letter} data-glossary-letter-name={letterName}>
  <span class="glossary-letter-ar">{letter}</span>
  <span class="glossary-letter-name">{letterName}</span>
</div>
```

The `data-glossary-letter` attribute is consumed by client-side running-header logic (Task 21 step) — though for v1 we'll just leave the running header static per page; the data attributes are forward-compat.

- [ ] **Step 2: Create `GlossaryEntry.astro`**

```astro
---
interface Example {
  arabic: string;
  translit: string;
  trans: string;
  ref: string;
}
interface Props {
  termMono: string;     // e.g. "NASB"
  term: string;         // e.g. "Accusative Case"
  arabic: string;       // e.g. "نَصْب"
  translit: string;     // e.g. "naṣb"
  refs?: string;        // e.g. "L2.05" or "L2.04, L2.05"
  def: string;          // plain definition text
  example?: Example;
  note?: string;        // optional commentary paragraph after example
}
const { termMono, term, arabic, translit, refs, def, example, note } = Astro.props;
---
<article class="glossary-entry">
  <header class="glossary-entry-head">
    <div>
      <span class="glossary-entry-term-mono">{termMono}</span>
      <span class="glossary-entry-term">{term}</span>
    </div>
    {refs && <span class="glossary-entry-refs">{refs}</span>}
  </header>
  <div class="glossary-entry-translit">
    <span class="glossary-entry-translit-ar">{arabic}</span>
    <span>{translit}</span>
  </div>
  <p class="glossary-entry-def">{def}</p>
  {example && (
    <div class="glossary-entry-example">
      <div class="glossary-entry-example-label">◆ Quranic example</div>
      <div class="glossary-entry-example-ar">{example.arabic}</div>
      <div class="glossary-entry-example-translit">{example.translit}</div>
      <div class="glossary-entry-example-trans">"{example.trans}"</div>
      <div class="glossary-entry-example-ref">— {example.ref}</div>
    </div>
  )}
  {note && <p class="glossary-entry-note">{note}</p>}
</article>
```

CSS already in `ebook-print.css` Task 2.

- [ ] **Step 3: Smoke-test in MDX**

```mdx
import GlossaryLetterDivider from '../../components/ebook/GlossaryLetterDivider.astro';
import GlossaryEntry from '../../components/ebook/GlossaryEntry.astro';

<div class="ebook-page mode-data" style="padding:0.6in 0.5in 0.5in;">
<GlossaryLetterDivider letter="ن" letterName="Nūn" anchor="gloss-n" />
<GlossaryEntry
  termMono="NASB"
  term="Accusative Case"
  arabic="نَصْب"
  translit="naṣb"
  refs="L2.05"
  def="The grammatical case used for direct objects, predicates of inna and her sisters, and circumstantial expressions. Marked by fatḥah on singular nouns."
  example={{
    arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
    translit: "innā aʿṭaynāka l-kawthara",
    trans: "Indeed, We have granted you al-Kawthar",
    ref: "Al-Kawthar 108:1",
  }}
  note="The word الْكَوْثَرَ is accusative because it is the direct object of أَعْطَيْنَا."
/>
<div class="ebook-folio">1</div>
</div>
```

- [ ] **Step 4: Render and verify**

```bash
npm run ebook:reference
```

Expected: page with big `ن` + `NŪN` divider on top, then the entry below: gold mono `NASB` + Geist `Accusative Case` + `L2.05` floated right, Amiri `نَصْب` + transliteration on next line, definition paragraph, then gold-left-border example block with `◆ QURANIC EXAMPLE` label, Arabic, transliteration, italic English, em-dash reference. Italic note below.

- [ ] **Step 5: Remove the smoke-test instance, then commit**

```bash
git add src/components/ebook/GlossaryEntry.astro src/components/ebook/GlossaryLetterDivider.astro src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): add GlossaryEntry + GlossaryLetterDivider (dictionary template)"
```

---

## Task 13: Build front matter (cover + title + copyright + MasterToc with full chapter list)

**Why:** With all components in place, assemble the book's front matter as the first real content. After this task the MDX should have: cover (via the page route) + title page + copyright + populated MasterToc + 3 section dividers + back cover. No body content yet.

**Files:**
- Modify: `src/content/ebooks/reference-companion.mdx`

- [ ] **Step 1: Add the copyright/colophon page after TitlePage**

The cover and TitlePage come from the page route. The MDX starts with the copyright page. Replace the entire MDX body (everything after frontmatter) with:

```mdx
import MasterToc from '../../components/ebook/MasterToc.astro';
import SectionDivider from '../../components/ebook/SectionDivider.astro';

{/* COPYRIGHT / COLOPHON */}
<section class="ebook-page ebook-page-folio" style="padding:1in 0.7in;">
  <p style="font-family:'Geist Mono',monospace;font-size:9px;letter-spacing:0.22em;color:#8a8275;text-transform:uppercase;margin:0 0 8px;">Quranic Grammar</p>
  <h1 style="font-family:'Geist',sans-serif;font-weight:500;font-size:22px;color:#efe7d4;margin:0 0 14px;">Reference Companion — Volume Three</h1>
  <p style="font-family:'Geist',sans-serif;font-size:11px;color:#c8c0ad;line-height:1.6;margin:0 0 14px;">A quick-reference kit for Classical Arabic. Verb tables, case endings, pronouns, the 200 most-used Quran words, the root system, and a 120-term grammar dictionary.</p>
  <p style="font-family:'Geist',sans-serif;font-size:10px;color:#8a8275;line-height:1.6;margin:0 0 14px;">First edition, 2026. Designed and typeset using Geist, Geist Mono, Amiri, and Amiri Quran.</p>
  <p style="font-family:'Geist Mono',monospace;font-size:9px;letter-spacing:0.22em;color:#5c5a52;text-transform:uppercase;margin:0;">© Quranic Grammar · All rights reserved</p>
</section>

{/* MASTER TOC */}
<MasterToc items={[
  { label: 'Orientation — Arabic in 7 Principles', anchor: 'orientation', kind: 'chapter' },
  { label: 'Section 01 — Vocabulary Quickstart', anchor: 'section-01', kind: 'section' },
  { label: '200 Most-Used Quran Words', anchor: 'vocab-200', kind: 'chapter' },
  { label: 'Section 02 — Charts', anchor: 'section-02', kind: 'section' },
  { label: 'Case Endings', anchor: 'ch-case-endings', kind: 'chapter' },
  { label: 'Pronoun Charts', anchor: 'ch-pronouns', kind: 'chapter' },
  { label: 'Verb Conjugations (Forms I–X)', anchor: 'ch-verb-conjugations', kind: 'chapter' },
  { label: 'Verb Forms Master Reference', anchor: 'ch-verb-forms', kind: 'chapter' },
  { label: 'The Root System', anchor: 'ch-root-system', kind: 'chapter' },
  { label: 'Section 03 — Glossary', anchor: 'section-03', kind: 'section' },
  { label: 'A · أ — ي  (alphabetical entries)', anchor: 'gloss-start', kind: 'chapter' },
]} />

{/* === FRONT-MATTER ESSAY: ORIENTATION === */}
{/* Filled in Task 14 */}
<section class="ebook-page ebook-page-folio" data-toc-anchor="orientation" style="padding:1in 0.7in;">
  <p style="font-family:'Geist Mono',monospace;color:#d4a85f;">Orientation placeholder — content in Task 14</p>
</section>

{/* === SECTION 01 === */}
<SectionDivider number="01" name="Vocabulary Quickstart" anchor="section-01" />
<section class="ebook-page ebook-page-folio" data-toc-anchor="vocab-200" style="padding:1in 0.7in;">
  <p>200 Most-Used Words placeholder — Task 15</p>
</section>

{/* === SECTION 02 === */}
<SectionDivider number="02" name="Charts" anchor="section-02" />
<section class="ebook-page ebook-page-folio" data-toc-anchor="ch-case-endings" style="padding:1in 0.7in;">
  <p>Case Endings placeholder — Task 16</p>
</section>
<section class="ebook-page ebook-page-folio" data-toc-anchor="ch-pronouns" style="padding:1in 0.7in;">
  <p>Pronouns placeholder — Task 17</p>
</section>
<section class="ebook-page ebook-page-folio" data-toc-anchor="ch-verb-conjugations" style="padding:1in 0.7in;">
  <p>Verb Conjugations placeholder — Task 18</p>
</section>
<section class="ebook-page ebook-page-folio" data-toc-anchor="ch-verb-forms" style="padding:1in 0.7in;">
  <p>Verb Forms Master placeholder — Task 19</p>
</section>
<section class="ebook-page ebook-page-folio" data-toc-anchor="ch-root-system" style="padding:1in 0.7in;">
  <p>Root System placeholder — Task 19</p>
</section>

{/* === SECTION 03 === */}
<SectionDivider number="03" name="Glossary" anchor="section-03" />
<section class="ebook-page ebook-page-folio" data-toc-anchor="gloss-start" style="padding:1in 0.7in;">
  <p>Glossary placeholder — Task 20</p>
</section>
```

- [ ] **Step 2: Render and verify the scaffold**

```bash
npm run ebook:reference
open dist/ebooks/reference-companion.pdf
```

Expected: cover → title → copyright → MasterToc (with `—` placeholders for all page numbers) → 3 section dividers and ~7 placeholder chapters interspersed → back cover. Should be ~13 pages.

- [ ] **Step 3: Commit**

```bash
git add src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): scaffold front matter + section structure with placeholders"
```

---

## Task 14: Rewrite Orientation — Arabic in 7 Principles

**Why:** First real content. Front-matter essay using `OrientationChapter` for each of the 7 principles.

**Files:**
- Read: `src/content/resources/arabic-in-7-principles.mdx`
- Modify: `src/content/ebooks/reference-companion.mdx`

- [ ] **Step 1: Read the source file**

```bash
cat src/content/resources/arabic-in-7-principles.mdx
```

Identify the 7 principles (each section header `## Principle N`). Note any `/learn/...` URLs to strip and any web-only language to rewrite.

- [ ] **Step 2: Replace the Orientation placeholder with 7 OrientationChapters**

In `src/content/ebooks/reference-companion.mdx`, replace the placeholder `<section ... data-toc-anchor="orientation">` block with:

```mdx
import OrientationChapter from '../../components/ebook/OrientationChapter.astro';

<OrientationChapter number="01" title="<Principle 01 title from source>" anchor="orientation" folio={1}>
<principle 01 body, with /learn/ URLs converted to bold text refs (e.g. **L2.04 Nominative Case**), Ctrl+F mentions removed, anchor links unwrapped to bold text>
</OrientationChapter>

<OrientationChapter number="02" title="<Principle 02 title>" folio={2}>...</OrientationChapter>
{/* … 03 through 07 … */}
```

Only the *first* OrientationChapter gets `anchor="orientation"` — that's the MasterToc target.

- [ ] **Step 3: Render and verify**

```bash
npm run ebook:reference
open dist/ebooks/reference-companion.pdf
```

Expected: 7 orientation pages, each with mono `PRINCIPLE N` label, Geist title, prose body. Page count rises to ~20.

- [ ] **Step 4: Verify URL/web-copy strip on this chapter**

```bash
pdftotext dist/ebooks/reference-companion.pdf - | grep -nE '/learn|/resources|Ctrl\+F|Cmd\+F|click|Click' | head -20
```

Expected: zero hits. If hits found, find them in the MDX and fix.

- [ ] **Step 5: Commit**

```bash
git add src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): rewrite Orientation (Arabic in 7 Principles)"
```

---

## Task 15: Rewrite Section 01 — 200 Most-Used Quran Words

**Why:** The vocab section becomes a `VocabGrid` driven by an array of 200 entries.

**Files:**
- Read: `src/content/resources/200-most-used-words.mdx`
- Modify: `src/content/ebooks/reference-companion.mdx`

- [ ] **Step 1: Read the source file and identify the row structure**

```bash
head -100 src/content/resources/200-most-used-words.mdx
```

Determine how the 200 entries are grouped (likely by frequency tier — top 50, 51-100, etc.).

- [ ] **Step 2: Decide row data format**

Each row needs `{ rank, arabic, translit, gloss }`. If the source uses a table format, transcribe it directly into a JS array inside MDX. If the source uses inline prose with embedded data, extract into the array.

- [ ] **Step 3: Replace the Section 01 placeholder with VocabGrid block(s)**

In `src/content/ebooks/reference-companion.mdx`, replace the `<section ... data-toc-anchor="vocab-200">` placeholder with:

```mdx
import VocabGrid from '../../components/ebook/VocabGrid.astro';
import SectionToc from '../../components/ebook/SectionToc.astro';

<section class="ebook-page ebook-page-folio" data-toc-anchor="vocab-200" style="padding:0.6in 0.5in;">
  <div class="orient-number" style="margin-bottom:6px;">Section 01 · Chapter</div>
  <h2 class="orient-title" style="margin-bottom:14px;">200 Most-Used Quran Words</h2>
  <p class="orient-body" style="margin-bottom:18px;">The 200 most frequent vocabulary words in the Quran, ranked by occurrence. Memorising the top 100 covers roughly half of all Quranic word tokens. Source: Zipf-style frequency analysis of the entire Quran corpus.</p>
  <SectionToc items={[
    "Tier 1 — words 1 to 50",
    "Tier 2 — words 51 to 100",
    "Tier 3 — words 101 to 150",
    "Tier 4 — words 151 to 200",
  ]} />
</section>

{/* Tier 1 */}
<section class="ebook-page ebook-page-folio" style="padding:0.6in 0.5in 0.5in;">
  <div class="chart-block-label" style="margin-bottom:10px;">Tier 1 · Words 1–50</div>
  <VocabGrid rows={[
    { rank: 1, arabic: "<arabic>", translit: "<translit>", gloss: "<gloss>" },
    /* ... 50 rows ... */
  ]} />
</section>

{/* Tier 2, 3, 4 — same pattern */}
```

If 50 rows overflows one page (~10 rows per page tight) split tier across multiple `<section class="ebook-page">` blocks of ~25 rows each.

- [ ] **Step 4: Render and audit page breaks**

```bash
npm run ebook:reference
open dist/ebooks/reference-companion.pdf
```

Expected: ~20 pages of vocab. If rows are clipped by page breaks, adjust the per-page row count and re-render until each page is full but un-clipped.

- [ ] **Step 5: Verify URL/web-copy strip**

```bash
pdftotext dist/ebooks/reference-companion.pdf - | grep -nE '/learn|/resources|Ctrl\+F' | head -10
```

Expected: zero hits.

- [ ] **Step 6: Commit**

```bash
git add src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): rewrite Section 01 — 200 Most-Used Quran Words"
```

---

## Task 16: Rewrite Case Endings Chart

**Why:** First chart-chapter inside Section 02. Establishes the pattern for the next 4 chart chapters (Pronouns, Verb Conjugations, Verb Forms Master, Root System).

**Files:**
- Read: `src/content/resources/case-endings-chart.mdx`
- Modify: `src/content/ebooks/reference-companion.mdx`

- [ ] **Step 1: Read source**

```bash
cat src/content/resources/case-endings-chart.mdx
```

Identify every `<GrammarTable>` and `<ArabicExample>` instance. List section headings.

- [ ] **Step 2: Replace the case-endings placeholder**

Use the following template for every chart chapter (this Task and the next 3):

```mdx
import ChartBlock from '../../components/ebook/ChartBlock.astro';
import SectionToc from '../../components/ebook/SectionToc.astro';
import GrammarTable from '../../components/mdx/GrammarTable.astro';
import ArabicExample from '../../components/mdx/ArabicExample.astro';
import Callout from '../../components/mdx/Callout.astro';

<section class="ebook-page ebook-page-folio" data-toc-anchor="ch-case-endings" style="padding:0.6in 0.5in;">
  <div class="orient-number">Section 02 · Chapter</div>
  <h2 class="orient-title">Case Endings (Iʿrāb)</h2>
  <p class="orient-body">
    <intro paragraph from source, web-isms stripped>
  </p>
  <SectionToc items={[
    "Overview — the three cases",
    "Singular nouns (triptote)",
    "Dual nouns",
    "Sound masculine plural",
    "Sound feminine plural",
    "Broken plurals",
    "The five nouns",
  ]} />
</section>

<section class="ebook-page ebook-page-folio" style="padding:0.6in 0.5in 0.5in;">
  <ChartBlock label="Chart · The Three Cases">
    <GrammarTable ... />
  </ChartBlock>
  <Callout type="note" title="Relationship to other chapters">
    Covered in <strong>L2.04 Nominative Case</strong>, <strong>L2.05 Accusative Case</strong>, and <strong>L2.06 Genitive Case</strong>.
  </Callout>
</section>

{/* … one ebook-page per chart subsection … */}
```

Rules for the rewrite:

- Every `<GrammarTable>` and `<VerbConjugation>` gets wrapped in `<ChartBlock label="Chart · <Section Name>">`.
- Source `<Callout>` blocks pointing to lessons → keep the callout, but replace the markdown link `[L2.04 ...](/learn/...)` with bold text `**L2.04 Nominative Case**`.
- Source `## Heading` and `### Heading` blocks → keep `<h2>`/`<h3>` markup; do not wrap headings in ChartBlock.
- Source intro/explanation paragraphs → keep as plain markdown but wrap them in `<p class="orient-body">` for typography (or skip the wrapper to use default `.ebook-page` body styling — try both, pick what looks right).
- Each ~ChartBlock-or-pair-of-tables should live in its own `<section class="ebook-page">` so page breaks are deterministic.

- [ ] **Step 3: Render and audit**

```bash
npm run ebook:reference
open dist/ebooks/reference-companion.pdf
```

Expected: ~10-12 pages for case endings, each chart wrapped in gold rule + mono label. If tables overflow, either split across pages or shrink with `mode-data` density (already enabled by ChartBlock).

- [ ] **Step 4: Verify URL/web-copy strip**

```bash
pdftotext dist/ebooks/reference-companion.pdf - | grep -nE '/learn|/resources|Ctrl\+F|Cmd\+F' | head -10
```

Expected: zero hits.

- [ ] **Step 5: Commit**

```bash
git add src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): rewrite Case Endings chapter for Section 02"
```

---

## Task 17: Rewrite Pronoun Charts

**Why:** Apply the chart-chapter template (Task 16) to the pronoun source file.

**Files:**
- Read: `src/content/resources/pronoun-charts.mdx`
- Modify: `src/content/ebooks/reference-companion.mdx`

- [ ] **Step 1: Read source, list the 4 pronoun categories**

```bash
cat src/content/resources/pronoun-charts.mdx
```

Identify the 4 category sections (Independent, Attached, Demonstrative, Relative).

- [ ] **Step 2: Replace the pronouns placeholder with 4 sub-chapter pages**

Each pronoun category gets one `<section class="ebook-page">` containing its `<ChartBlock>` + `<GrammarTable>` instances + any `<ArabicExample>` + `<Callout>`. Apply universal transforms: strip URLs, scrub web-only copy.

Anchor `data-toc-anchor="ch-pronouns"` goes only on the chapter-opener page (with intro + SectionToc).

- [ ] **Step 3: Render, audit, commit**

```bash
npm run ebook:reference
pdftotext dist/ebooks/reference-companion.pdf - | grep -nE '/learn|/resources|Ctrl\+F' | head -10
git add src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): rewrite Pronoun Charts chapter"
```

---

## Task 18: Rewrite Verb Conjugation Tables (Forms I–X)

**Why:** Largest chart file. Each form gets its own chapter spread with pattern label, meaning, and 3 tense tables (Past, Present, Imperative).

**Files:**
- Read: `src/content/resources/verb-conjugation-tables.mdx`
- Modify: `src/content/ebooks/reference-companion.mdx`

- [ ] **Step 1: Read source and list the 10 forms**

```bash
cat src/content/resources/verb-conjugation-tables.mdx
```

Each form has: pattern, meaning, example root, and 3 tables (Past, Present, Imperative).

- [ ] **Step 2: Replace the verb-conjugations placeholder**

Use this per-form template:

```mdx
{/* === FORM I === */}
<section class="ebook-page ebook-page-folio" data-toc-anchor="ch-verb-conjugations" style="padding:0.6in 0.5in;">
  <div class="orient-number">Section 02 · Chapter</div>
  <h2 class="orient-title">Verb Conjugations (Forms I–X)</h2>
  <p class="orient-body">
    <chapter intro from source — drop "Forms I-III: Basic" etc. table if too verbose, keep core sentence>
  </p>
  <SectionToc items={[
    "Form I (فَعَلَ)", "Form II (فَعَّلَ)", "Form III (فَاعَلَ)",
    "Form IV (أَفْعَلَ)", "Form V (تَفَعَّلَ)", "Form VI (تَفَاعَلَ)",
    "Form VII (اِنْفَعَلَ)", "Form VIII (اِفْتَعَلَ)",
    "Form IX (اِفْعَلَّ)", "Form X (اِسْتَفْعَلَ)",
  ]} />
</section>

<section class="ebook-page ebook-page-folio" style="padding:0.6in 0.5in;">
  <div class="orient-number">Form I</div>
  <h3 class="orient-title">فَعَلَ — Basic action</h3>
  <p class="orient-body"><Form I description from source></p>
  <ChartBlock label="Chart · Form I — Past Tense (al-māḍī)" verbTable>
    <VerbConjugation ... />
  </ChartBlock>
</section>

<section class="ebook-page ebook-page-folio" style="padding:0.6in 0.5in;">
  <ChartBlock label="Chart · Form I — Present Tense (al-muḍāriʿ)" verbTable>
    <VerbConjugation ... />
  </ChartBlock>
  <ChartBlock label="Chart · Form I — Imperative (al-amr)" verbTable>
    <VerbConjugation ... />
  </ChartBlock>
</section>

{/* === FORM II === */}
{/* … repeat for Forms II through X … */}
```

The `verbTable` prop on ChartBlock allows the table to break across pages if needed (its 13 rows × 3 cols won't typically fit in a single column on a 5.5" page when dense).

Add `import VerbConjugation from '../../components/mdx/VerbConjugation.astro';` at the top of the imports block.

- [ ] **Step 3: Render and audit page breaks**

```bash
npm run ebook:reference
open dist/ebooks/reference-companion.pdf
```

Expected: ~25 pages for verb conjugations (1 chapter intro + ~2-3 pages per form). Each form opener should not orphan its table to a different spread.

- [ ] **Step 4: Verify URL/web-copy strip + commit**

```bash
pdftotext dist/ebooks/reference-companion.pdf - | grep -nE '/learn|/resources|Ctrl\+F|Cmd\+F' | head -10
git add src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): rewrite Verb Conjugation Tables (Forms I-X)"
```

---

## Task 19: Rewrite Verb Forms Master Reference + Root System

**Why:** Two smaller chart-chapters. Bundled because both are concise.

**Files:**
- Read: `src/content/resources/verb-forms-master-reference.mdx`
- Read: `src/content/resources/root-system.mdx`
- Modify: `src/content/ebooks/reference-companion.mdx`

- [ ] **Step 1: Rewrite Verb Forms Master**

Replace the verb-forms placeholder. This is a single overview table — wrap in one `<ChartBlock label="Chart · Verb Forms Master — Overview">`. Add intro paragraph + SectionToc with the table headings.

- [ ] **Step 2: Rewrite Root System**

Replace the root-system placeholder. This chapter mixes prose (introduction, why roots matter) with tables (example root derivations). Use `--mode-prose` defaults for the prose body, wrap each derivation table in `<ChartBlock>`.

Both chapters should each take one section-opener page + 2-3 body pages.

- [ ] **Step 3: Render, audit, commit**

```bash
npm run ebook:reference
pdftotext dist/ebooks/reference-companion.pdf - | grep -nE '/learn|/resources|Ctrl\+F' | head -10
git add src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): rewrite Verb Forms Master + Root System chapters"
```

---

## Task 20: Rewrite Glossary (120+ entries, dictionary template)

**Why:** Largest single chapter. ~30 pages of compact GlossaryEntry components, organised by Arabic letter with GlossaryLetterDivider between letter groups.

**Files:**
- Read: `src/content/resources/glossary.mdx`
- Modify: `src/content/ebooks/reference-companion.mdx`

- [ ] **Step 1: Read the source glossary**

```bash
wc -l src/content/resources/glossary.mdx
head -200 src/content/resources/glossary.mdx
```

Identify the per-letter sections (the file already groups by Arabic letter with `## أ (Alif)` etc.) and the per-entry structure (h3 + Arabic + Definition + ArabicExample + Learn more).

- [ ] **Step 2: Replace the glossary placeholder with letter-grouped GlossaryEntry blocks**

For each Arabic letter section:

```mdx
import GlossaryLetterDivider from '../../components/ebook/GlossaryLetterDivider.astro';
import GlossaryEntry from '../../components/ebook/GlossaryEntry.astro';

{/* === Letter: أ (Alif) === */}
<section class="ebook-page mode-data" data-toc-anchor="gloss-start" style="padding:0.6in 0.5in 0.5in;">
  <GlossaryLetterDivider letter="أ" letterName="Alif" anchor="gloss-alif" />

  <GlossaryEntry
    termMono="JADHR"
    term="Root"
    arabic="جَذْر"
    translit="jadhr"
    refs="L3.01"
    def="The three (or sometimes four) core consonants that form the semantic foundation of Arabic words. All Arabic words are built by applying vowel patterns to these root letters."
    example={{
      arabic: "قَالَ رَبِّ اشْرَحْ لِي صَدْرِي",
      translit: "qāla rabbi shraḥ lī ṣadrī",
      trans: "He said: My Lord, expand for me my breast",
      ref: "Ta-Ha 20:25",
    }}
    note="The word قَالَ comes from the root ق و ل (q-w-l), meaning 'to say/speak.'"
  />
  {/* … further entries for letter أ … */}
</section>

{/* === Letter: ب (Ba) === */}
{/* same pattern */}
```

The `data-toc-anchor="gloss-start"` only on the first glossary page; only the first GlossaryLetterDivider gets `anchor="gloss-alif"`. Subsequent letter dividers can omit the anchor (or add per-letter anchors if the MasterToc is later expanded).

Per-entry rules:

- `termMono` = the transliteration ALL CAPS (e.g. `JADHR`, `NASB`).
- `term` = the English equivalent (e.g. `Root`, `Accusative Case`).
- `refs` = comma-separated lesson refs (e.g. `L2.04, L2.05`); omit if source has none. If more than 3, keep first 2 + ellipsis.
- `def` = the source `**Definition:**` paragraph stripped of label and any inline URLs.
- `example` = the source `<ArabicExample>` props transcribed; omit the whole prop if source has no example.
- `note` = the source's after-example commentary paragraph; omit if absent.
- If source has a `<Callout>` after the entry, append its content to `note=` with a leading "Note: ".

Page splits: try to fit 3-4 entries per page. Split pages on letter dividers when possible.

- [ ] **Step 3: Build incrementally — one letter group at a time, render between letters**

This task is the biggest. Recommend committing per letter group or per 3-letter chunk:

```bash
# after letter ت:
git add src/content/ebooks/reference-companion.mdx
git commit -m "feat(ebooks): glossary letters أ ب ت"
# render midway:
npm run ebook:reference
```

- [ ] **Step 4: After all entries written — render and audit**

```bash
npm run ebook:reference
open dist/ebooks/reference-companion.pdf
```

Expected: ~30 pages of glossary, ~120 entries, letter dividers visible. Page count should be roughly 100-115 total.

- [ ] **Step 5: Density audit**

If entries feel cramped, find the `.glossary-entry` rule in `src/styles/ebook-print.css` and increase `margin: 0 0 22px;` to `28px`. Re-render — accept the extra 2-3 pages.

- [ ] **Step 6: URL/web-copy/font verification + commit**

```bash
pdftotext dist/ebooks/reference-companion.pdf - | grep -cE '/learn|/resources|Ctrl\+F|Cmd\+F|Quick navigation'
# expected: 0
pdffonts dist/ebooks/reference-companion.pdf | awk 'NR>2 {print $1}' | sort -u
# expected: only Geist, GeistMono, Amiri, AmiriQuran, NotoSans (subset names)

git add src/content/ebooks/reference-companion.mdx src/styles/ebook-print.css
git commit -m "feat(ebooks): rewrite Glossary (120+ entries, dictionary template)"
```

---

## Task 21: Implement two-pass page-number injection for MasterToc

**Why:** MasterToc currently shows `—` for every entry. Replace with real page numbers by rendering once, extracting per-anchor page positions via Playwright, injecting the map back into the rendered HTML, and re-rendering.

**Files:**
- Modify: `scripts/render-ebook-pdf.ts`

- [ ] **Step 1: Add an `extractPageNumbers()` helper**

In `scripts/render-ebook-pdf.ts`, above `renderPdf()`, add:

```ts
async function extractPageNumbers(page: Page, target: EbookTarget): Promise<Record<string, number>> {
  // Re-navigate in print emulation so layout matches the PDF pass exactly.
  await page.emulateMedia({ media: 'print' });
  await page.goto(`http://localhost:${PORT}/ebooks/${target.slug}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  // 5.5" x 8.5" at 96dpi = 528 x 816 CSS pixels per page.
  return await page.evaluate(() => {
    const PAGE_HEIGHT_PX = 816; // 8.5in * 96
    const map: Record<string, number> = {};
    const anchors = document.querySelectorAll('[data-toc-anchor]');
    anchors.forEach(el => {
      const anchor = el.getAttribute('data-toc-anchor');
      if (!anchor) return;
      const rect = (el as HTMLElement).getBoundingClientRect();
      // body's top is 0 in print emulation; the cumulative offset is just rect.top.
      // We use the element's offsetTop relative to body (more reliable than rect across pages).
      const top = (el as HTMLElement).offsetTop;
      const pageNumber = Math.floor(top / PAGE_HEIGHT_PX) + 1;
      map[anchor] = pageNumber;
    });
    return map;
  });
}
```

- [ ] **Step 2: Add a `renderPdfWithToc()` helper that wraps the two passes**

Above `renderPdf()`, add:

```ts
async function renderPdfWithToc(page: Page, target: EbookTarget) {
  // PASS 1: extract page-number map.
  let pageMap: Record<string, number> = {};
  try {
    pageMap = await extractPageNumbers(page, target);
    console.log(`Extracted ${Object.keys(pageMap).length} TOC anchors for ${target.slug}`);
  } catch (err) {
    console.warn(`Pass 1 (TOC extraction) failed for ${target.slug}; rendering without TOC page numbers.`, err);
  }

  // PASS 2: navigate + inject page numbers via DOM manipulation + render PDF.
  await page.emulateMedia({ media: 'print' });
  await page.goto(`http://localhost:${PORT}/ebooks/${target.slug}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  if (Object.keys(pageMap).length > 0) {
    await page.evaluate((map) => {
      const slots = document.querySelectorAll('[data-toc-page-for]');
      slots.forEach(s => {
        const anchor = s.getAttribute('data-toc-page-for');
        if (!anchor) return;
        const num = map[anchor];
        if (num != null) s.textContent = String(num);
      });
    }, pageMap);
  }

  const out = path.join(OUT_DIR, target.pdfName);
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
```

- [ ] **Step 3: Update `main()` to use `renderPdfWithToc()` for the reference companion**

Find the loop in `main()` that calls `renderPdf(page, t)`. Replace with:

```ts
for (const t of targets) {
  console.log(`\n=== Rendering: ${t.slug} ===`);
  if (t.slug === 'sampler') {
    await renderPdf(page, t);              // sampler has no MasterToc
  } else {
    await renderPdfWithToc(page, t);       // ref companion + future ebooks
  }
  await renderListingImages(page, t);
}
```

- [ ] **Step 4: Render and verify TOC page numbers populate**

```bash
npm run ebook:reference
open dist/ebooks/reference-companion.pdf
```

Open to the TOC page (page 3). Expected: every entry's `—` placeholder replaced with a real page number, dot leaders visible between label and number.

- [ ] **Step 5: Spot-check accuracy**

Pick 3 TOC entries. Navigate to their listed page in the PDF and verify the matching chapter actually starts there.

If a page number is off by 1-2 (possible due to page-break-inside avoid rules causing element offsetTop ≠ visible page top), accept ±1 as good enough for v1. If a number is wildly off (5+ pages), investigate by logging `pageMap` in the script and tweaking the calculation (consider using `getBoundingClientRect` with cumulative scroll offset instead of offsetTop).

- [ ] **Step 6: Verify fallback works**

Temporarily break the extraction (e.g. add `throw new Error('test');` inside `extractPageNumbers`). Render — should still produce a PDF with `—` placeholders in the TOC and a warning logged. Remove the test throw, re-render, verify.

- [ ] **Step 7: Commit**

```bash
git add scripts/render-ebook-pdf.ts
git commit -m "feat(ebooks): two-pass TOC render to inject real page numbers"
```

---

## Task 22: Add per-letter glossary anchors to MasterToc (optional, page-number-dependent)

**Why:** With Task 21 working, the MasterToc can show every Arabic-letter glossary divider as a sub-entry with page numbers. Improves the dictionary's findability.

**Files:**
- Modify: `src/content/ebooks/reference-companion.mdx`

- [ ] **Step 1: Add per-letter anchors to each `<GlossaryLetterDivider>`**

Find every `<GlossaryLetterDivider letter="X" letterName="..." />` in the MDX. Add `anchor="gloss-<latin-name>"` to each — e.g. `anchor="gloss-alif"`, `anchor="gloss-ba"`, etc.

- [ ] **Step 2: Extend the MasterToc items list**

In the MDX MasterToc instantiation, replace the single `gloss-start` entry with multiple per-letter entries:

```mdx
<MasterToc items={[
  /* … all previous chapter/section entries … */
  { label: 'Section 03 — Glossary', anchor: 'section-03', kind: 'section' },
  { label: '  أ — Alif', anchor: 'gloss-alif', kind: 'subsection' },
  { label: '  ب — Ba', anchor: 'gloss-ba', kind: 'subsection' },
  /* … all letters that actually appear … */
]} />
```

The `kind: 'subsection'` uses the same `.chapter` styling as Task 7 — but you can add a `.master-toc li.subsection { padding-left: 18px; font-size: 11px; color: var(--eb-ink-muted); }` rule to `src/styles/ebook-print.css` for indented styling. Do that if it looks better.

- [ ] **Step 3: Render and verify**

```bash
npm run ebook:reference
open dist/ebooks/reference-companion.pdf
```

Expected: MasterToc now lists Section 03 followed by an indented letter list with page numbers per Arabic letter.

- [ ] **Step 4: Commit**

```bash
git add src/content/ebooks/reference-companion.mdx src/styles/ebook-print.css
git commit -m "feat(ebooks): expand MasterToc with per-letter glossary entries"
```

---

## Task 23: Build the 3 listing preview spreads (real content)

**Why:** Replace the stub `spread-1/2/3` preview routes with rendered content matching the spec §6 listing strategy.

**Files:**
- Modify: `src/pages/ebooks/reference-companion-preview-spread-1.astro`
- Modify: `src/pages/ebooks/reference-companion-preview-spread-2.astro`
- Modify: `src/pages/ebooks/reference-companion-preview-spread-3.astro`

- [ ] **Step 1: Spread 1 — Cover + Orientation opener side by side**

Replace `reference-companion-preview-spread-1.astro` body with two stacked `.ebook-page` blocks: one rendering `<ReferenceCover ... />`, one rendering the OrientationChapter for Principle 01 (copy a brief excerpt from the rewritten MDX).

Use CSS to display them side-by-side in the listing image only:

```astro
---
import EbookPrint from '../../layouts/EbookPrint.astro';
import ReferenceCover from '../../components/ebook/ReferenceCover.astro';
import OrientationChapter from '../../components/ebook/OrientationChapter.astro';
---
<EbookPrint title="Reference Companion — Spread 1">
  <div style="display:flex;width:11in;height:8.5in;background:#0a0b0d;">
    <ReferenceCover
      title="Quranic Grammar Reference Companion"
      subtitle="A Quick-Reference Kit for Classical Arabic"
      brand="Quranic Grammar"
      volume="Volume Three"
    />
    <OrientationChapter number="01" title="<Principle 01 title from MDX>">
      <excerpt copied from MDX>
    </OrientationChapter>
  </div>
</EbookPrint>
```

The renderer in Task 1 sets viewport to 1200×1500 for spread images — but the spread is 11" wide. Override viewport in the script by using a custom width *for spread routes* OR set explicit CSS dimensions on the spread div + use `fullPage: true` on the screenshot. Simpler: change `renderListingImages` to use `fullPage: true` for spread routes — add per-target screenshot flag if needed. For v1, just set the spread container width to 1200px and accept some scaling.

- [ ] **Step 2: Spread 2 — Two facing glossary entries**

`reference-companion-preview-spread-2.astro`: two `<GlossaryEntry>` instances side by side (or stacked with `display:flex;flex-direction:row;`). Pick two visually-different entries: e.g. one short (`Jadhr / Root`) and one long with note (`Nasb / Accusative Case`).

- [ ] **Step 3: Spread 3 — Verb Conjugation chapter**

`reference-companion-preview-spread-3.astro`: one Form II chapter opener page + one Form II past-tense `<VerbConjugation>` table page side by side. Copy the same component instances used in the MDX.

- [ ] **Step 4: Render and review**

```bash
npm run ebook:reference
open dist/ebooks/reference-companion-listing-spread-1.png
open dist/ebooks/reference-companion-listing-spread-2.png
open dist/ebooks/reference-companion-listing-spread-3.png
```

Verify each PNG looks like a polished marketing spread, not a debug screenshot. Tweak spread layout / cropping until satisfied.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ebooks/reference-companion-preview-spread-*.astro
git commit -m "feat(ebooks): build 3 listing preview spreads (cover, glossary, conjugation)"
```

---

## Task 24: Acceptance verification + final commit

**Why:** Run every acceptance criterion from spec §7. Block release if any fail.

**Files:**
- (Read-only verification — no file edits unless issues found)

- [ ] **Step 1: Clean render**

```bash
rm -rf dist/ebooks/reference-companion*.{pdf,png}
npm run ebook:reference
```

Expected: 5 artifacts produced without errors.

- [ ] **Step 2: AC §7.2 — page count check**

```bash
pdfinfo dist/ebooks/reference-companion.pdf | grep Pages
```

Expected: 100-120 (acceptable range). If <100, content was over-trimmed. If >120, audit which chapter overflowed.

- [ ] **Step 3: AC §7.3 — file size check**

```bash
ls -la dist/ebooks/reference-companion.pdf
```

Expected: < 5 MB (5,000,000 bytes).

- [ ] **Step 4: AC §7.5 — font check (zero fallback)**

```bash
pdffonts dist/ebooks/reference-companion.pdf | awk 'NR>2 {print $1}' | sort -u
```

Expected output (subset names only):

```
+Amiri
+AmiriQuran
+Geist-...
+GeistMono-...
+NotoSans-...
```

NO `Helvetica`, NO `Times`. If any of those appear, find the offending text and fix the styling.

- [ ] **Step 5: AC §7.6 — URL strip check**

```bash
pdftotext dist/ebooks/reference-companion.pdf - | grep -nE '/learn|/resources|quranicgrammar\.com|http://|https://'
```

Expected: zero matches.

- [ ] **Step 6: AC §7.7 — web-only copy strip check**

```bash
pdftotext dist/ebooks/reference-companion.pdf - | grep -nE 'Ctrl\+F|Cmd\+F|Quick navigation|click the link|Click the link|browser'
```

Expected: zero matches. Note: bare "click" or "browser" might appear in legitimate definitional context (e.g., explaining a verb root meaning "to click"); use judgement. Required-zero applies to the phrases listed.

- [ ] **Step 7: AC §7.4 — TOC page numbers populated**

```bash
pdftotext dist/ebooks/reference-companion.pdf - | sed -n '/CONTENTS/,/PRINCIPLE 01/p' | head -40
```

Expected: every TOC entry has a numeric page number, not `—`.

- [ ] **Step 8: AC §7.8 — visual smoke (5 random pages)**

```bash
open dist/ebooks/reference-companion.pdf
```

Page through. Check for: orphaned headings (heading at bottom of page, body on next), charts split across spreads weirdly, glyph fallback boxes (▯), justified-text rivers, missing diacritics. If found, identify the chapter and fix.

- [ ] **Step 9: AC §7.9 — listing image readability**

```bash
sips -Z 400 dist/ebooks/reference-companion-listing-cover.png --out /tmp/cover-thumb.png
open /tmp/cover-thumb.png
```

At 400×600, the `§` ornament, brand label, and title must still be readable. If too small, increase font sizes in `ReferenceCover.astro` and re-render.

- [ ] **Step 10: Update MEMORY.md with the new shipped product**

Edit `/Users/daodilyas/.claude/projects/-Users-daodilyas-quran-learn/memory/MEMORY.md`. In the product slate table, update row #2:

```
| 2 | **Reference Companion** (8 resource files compiled) | ✅ SHIPPED on branch `feat/reference-companion` (2026-XX-XX) | ~$7–9 | ~110 |
```

(use actual completion date and actual page count). Add any new pitfalls discovered during the build to the "Pitfalls" section.

- [ ] **Step 11: Final commit**

```bash
git add /Users/daodilyas/.claude/projects/-Users-daodilyas-quran-learn/memory/MEMORY.md
git commit -m "docs: mark Reference Companion shipped in project memory"
git log --oneline feat/sampler-al-fatiha-pdf..HEAD
```

Expected: a clean list of all task commits on the `feat/reference-companion` branch.

---

## Done criteria

- All 9 acceptance criteria in spec §7 pass.
- 5 artifacts present in `dist/ebooks/reference-companion*`.
- Branch `feat/reference-companion` has clean commits per task, no WIP, no uncommitted changes.
- MEMORY.md updated.
