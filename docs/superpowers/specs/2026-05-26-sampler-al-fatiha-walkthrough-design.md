# Design Spec — *How to Understand Surah Al-Fatiha: A Grammatical Walkthrough*

**Status:** Brainstorm complete · ready for implementation planning
**Date:** 2026-05-26
**Author:** brainstorm output, pending user review
**Brand:** Quranic Grammar

---

## 1. Product

A self-contained ~30-page PDF ebook that walks a reader through Surah Al-Fatiha word by word, surfacing the Arabic grammar concepts inside the verses they already know. Sold on Etsy (or an equivalent digital marketplace) at **$4–5** as the first product in a three-part catalog.

This is the **Sampler** — the smallest and lowest-risk surface for proving the visual system, content workflow, and Etsy listing template that the Foundation Book (Levels 1–2) and Reference Companion will reuse.

## 2. Audience

Adults who can already decode Arabic script and have read a printed Quran, but have never formally studied its grammar. The book deliberately makes **no script primer**, **no alphabet teaching**, and **no transliteration crutch** — the reader is treated as someone whose eye recognises mushaf typography on sight.

The book is not for absolute beginners who cannot read Arabic letters; that audience is served by the future Foundation Book.

## 3. Three-product context

| # | Product | Status | Role |
|---|---------|--------|------|
| 1 | **Sampler — Al-Fatiha Walkthrough** | This spec | ~$4–5 entry product; locks the visual system |
| 2 | Foundation Book (Levels 1–2) | Future | $18–22 flagship; reuses everything established here |
| 3 | Reference Companion (verb tables, glossary, pronoun charts) | Future | $7–9 add-on |

Build order: 1 → 2 → 3. Each subsequent product inherits the visual system, layout components, and production pipeline established by this Sampler.

## 4. Scope

### In scope
- Single ~30-page PDF, fixed layout
- Cover + title page + introduction + 7 ayah chapters + glossary + "what next" page + colophon
- Embedded fonts (Geist, Geist Mono, Amiri Quran, Amiri) loaded from Google Fonts and inlined into the PDF
- 4 listing-image assets (cover thumbnail + 3 interior previews)
- ~400-word Etsy listing description with SEO tags

### Out of scope
- Exercises or quizzes (defer to the Foundation Book where they belong pedagogically)
- Audio recitation embedding
- EPUB or Kindle formats (PDF only for V1)
- Translations beyond English
- Multi-author or multi-volume infrastructure
- A free lead-magnet version on quranigrammar.com (Etsy-only distribution)
- An ISBN (Etsy doesn't require one; revisit if we ever expand to retail)

## 5. Content structure

### Table of contents

1. **Cover** — see §8
2. **Title page** — book title, brand, volume number, colophon
3. **Introduction** (2 pages) — "Why this book exists" + how to read each chapter
4. **Seven ayah chapters** — one per verse, ~3 pages each:
   1. Bismillāh
   2. Al-ḥamdu lillāhi rabbi l-ʿālamīn
   3. Ar-Raḥmāni r-Raḥīm
   4. Māliki yawmi d-dīn
   5. Iyyāka naʿbudu wa-iyyāka nastaʿīn
   6. Ihdina ṣ-ṣirāṭa l-mustaqīm
   7. Ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa-la ḍ-ḍāllīn
5. **Glossary** (2 pages) — every Arabic grammar term used, sorted alphabetically
6. **Where to go next** (1 page) — bridge to the Foundation Book
7. **Back cover / colophon**

Estimated total: **28–32 pages**.

### Per-chapter pattern (locked: Editorial Hybrid)

Each ayah chapter follows the same skeleton:

1. **Chapter header** — small `Geist Mono` label in soft gold (`Chapter 02`), then chapter title in Geist (an English summary of the verse's theme, not a translation)
2. **Featured verse** — centred, Amiri Quran, top and bottom hairline rules, generous line-height
3. **Transliteration** — Geist italic, centred under the verse
4. **English translation** — Geist regular, centred
5. **3-column word grid** — `Arabic | transliteration | gloss + role-tag`, one row per word, dashed hairline between rows
6. **Grammar Moment callout** — one soft-gold-bordered box per chapter surfacing the most important grammar concept that verse teaches
7. **Closing prose** (~150 words) — reflective paragraph on how the grammar shapes the meaning

The pattern is rigorous so every chapter feels familiar but the content stays varied — different concepts surface in different chapters.

## 6. Visual design system

### Colour tokens

| Role | Hex | Usage |
|------|-----|-------|
| Canvas | `#0f1115` | Page background |
| Canvas (deep) | `#0a0b0d` | Cover background, full-bleed sections |
| Ink primary | `#efe7d4` | Headings, featured Arabic, primary text |
| Ink secondary | `#c8c0ad` | Body text, gloss text |
| Ink muted | `#8a8275` | Transliteration, captions, secondary metadata |
| Ink mute (deep) | `#5c5a52` | Folio numbers, "Vol. 01" labels |
| Accent (gold) | `#d4a85f` | Chapter labels, hairlines, callout borders, brand label |
| Hairline | `#2a2c33` | Word-row dividers, subtle surfaces |
| Callout surface | `rgba(212, 168, 95, 0.06)` | Grammar Moment background |

### Typography stack

| Role | Family | Weights | Notes |
|------|--------|---------|-------|
| Latin display & body | **Geist** | 300, 400, 500, 600, 700 | Google Fonts |
| Latin labels & folios | **Geist Mono** | 400, 500 | Google Fonts |
| Featured Quranic verses | **Amiri Quran** | 400 | Google Fonts; designed for full Uthmanic Quran rendering |
| Word-grid Arabic (smaller) | **Amiri** | 400, 700 | Google Fonts; the lighter, smaller-text-optimised sibling |

All four families are loaded from Google Fonts via `<link>` tags at build time and embedded directly into the PDF. No external font dependencies at read time.

### Type scale (locked)

| Slot | Family | Size | Weight | Line-height | Tracking |
|------|--------|------|--------|-------------|----------|
| Cover title | Geist | 32 px | 500 | 1.12 | -0.02 em |
| Cover subtitle | Geist italic | 14 px | 400 | 1.4 | -0.005 em |
| Cover brand label | Geist Mono | 11 px | 500 | 1 | 0.28 em (uppercase) |
| Chapter number | Geist Mono | 11 px | 500 | 1 | 0.24 em (uppercase) |
| Chapter title | Geist | 24 px | 500 | 1.2 | -0.015 em |
| Featured Arabic verse | Amiri Quran | 38 px | 400 | 1.8 | — |
| Featured transliteration | Geist italic | 14 px | 400 | 1.4 | -0.005 em |
| Featured English | Geist | 14 px | 400 | 1.4 | -0.005 em |
| Word-grid Arabic | Amiri | 22 px | 400 | 1.4 | — |
| Word-grid transliteration | Geist italic | 13 px | 400 | 1.4 | -0.005 em |
| Word-grid gloss | Geist | 13 px | 400 | 1.4 | -0.005 em |
| Body prose | Geist | 13.5 px | 400 | 1.6 | -0.005 em |
| Grammar Moment label | Geist Mono | 10 px | 500 | 1 | 0.14 em (uppercase) |
| Grammar Moment body | Geist | 13.5 px | 400 | 1.6 | -0.005 em |
| Folio | Geist Mono | 11 px | 400 | 1 | 0.22 em |

### Page geometry

- **Trim size:** 5.5 × 8.5 inches (close to A5; well-suited to screen and tablet reading)
- **Margins:** top 56 px, outer 48 px, bottom 48 px (allow folio), inner 48 px
- **Featured-verse rules:** 1 px solid `#2a2c33`, padding 28 px top / 24 px bottom
- **Word-row dividers:** 1 px dashed `#2a2c33`
- **Grammar Moment border:** 2 px solid `#d4a85f` on left edge only

## 7. Cover (locked — variant B: Hairline Architecture)

- **Canvas:** `#0f1115`
- **Top:** "QURANIC GRAMMAR" — Geist Mono, soft gold, 0.28 em tracking, centred
- **Centre block** (vertically anchored between gold hairlines):
  - Top hairline: 1 px solid `#d4a85f`
  - Triple-diamond ornament `◆ ◆ ◆` — soft gold, 1 em letter-spacing
  - Title: "How to Understand / Surah Al-Fatiha" — Geist, 32 px, weight 500, two lines
  - Subtitle: "A grammatical walkthrough" — Geist italic, 14 px, muted ink
  - Bottom hairline: 1 px solid `#d4a85f`
- **Footer:**
  - Byline slot: **brand-only** (no author byline). May be filled later with a personal name if desired.
  - "Volume One" — Geist Mono, 0.22 em tracking, deep-muted ink
- **Aspect ratio:** 2:3 — render at 1600 × 2400 px for the Etsy listing hero image

## 8. Production pipeline (locked: Astro + Playwright PDF)

### Architectural overview

The book lives inside the existing Astro project as a *print-only route*. The same MDX content is the single source of truth for both the book and any future website embedding.

### File layout (proposed)

```
src/
  content/
    ebooks/
      sampler-al-fatiha.mdx            # full book content as MDX
  layouts/
    EbookPrint.astro                   # print-only layout (dark, fonts, @page, headers/footers)
  components/
    ebook/
      CoverPage.astro                  # cover block
      TitlePage.astro                  # title page + colophon
      AyahChapter.astro                # the locked per-chapter pattern
      FeaturedVerse.astro              # featured-verse block
      WordGrid.astro                   # 3-col word grid
      GrammarMoment.astro              # gold-bordered callout
      Glossary.astro                   # glossary table
  pages/
    ebooks/
      sampler.astro                    # renders sampler-al-fatiha.mdx through EbookPrint layout
  styles/
    ebook-print.css                    # @page rules, page-break controls, font embedding
scripts/
  render-ebook-pdf.ts                  # Playwright headless renderer → dist/ebooks/*.pdf
```

### Build commands

- `npm run dev` then visit `/ebooks/sampler` for live preview while writing/iterating
- `npm run ebook:sampler` runs `astro build` and then the Playwright script, producing `dist/ebooks/al-fatiha-sampler.pdf`

### Print-CSS rules

- `@page { size: 5.5in 8.5in; margin: 0; }` — Astro renders the full page (margins live inside the component for finer control)
- `break-inside: avoid` on `AyahChapter` so chapter content stays together
- `break-before: page` on each `AyahChapter` so every verse starts on a fresh page
- Embedded `@font-face` declarations for all four font families using woff2 from Google Fonts
- Folio number rendered as a positioned element inside the page layout, not via `@page` running elements (Chromium support for the latter is uneven)

### Renderer script outline

```ts
// scripts/render-ebook-pdf.ts
import { chromium } from 'playwright';

const PORT = 4321;
const ROUTE = `http://localhost:${PORT}/ebooks/sampler`;
const OUT   = 'dist/ebooks/al-fatiha-sampler.pdf';

// Assume `astro preview` running on PORT.
const browser = await chromium.launch();
const page = await browser.newPage();
await page.emulateMedia({ media: 'print' });
await page.goto(ROUTE, { waitUntil: 'networkidle' });
await page.pdf({
  path: OUT,
  width: '5.5in',
  height: '8.5in',
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
await browser.close();
```

### Acceptance criteria for the pipeline

- Final PDF ≤ 20 MB (Etsy's per-file limit)
- All fonts fully embedded; PDF renders identically on Mac Preview, Adobe Reader, and Chrome's built-in viewer
- No external font requests at read time
- Every page numbered (folio bottom-centre, except cover and title page)
- Every chapter starts on a fresh page; no orphaned word rows or callouts across page breaks

## 9. Etsy listing assets

In addition to the PDF itself, the listing requires four images and one block of listing copy.

### Image assets

| Asset | Size | Purpose |
|-------|------|---------|
| Cover thumbnail | 1600 × 2400 px (PNG) | Etsy listing hero image |
| Interior preview 1 | 1200 × 1500 px (PNG) | Sample featured-verse spread |
| Interior preview 2 | 1200 × 1500 px (PNG) | Sample word-grid + Grammar Moment spread |
| Interior preview 3 | 1200 × 1500 px (PNG) | Sample glossary spread |

All four are rendered by the same Playwright script that produces the PDF — distinct routes (`/ebooks/sampler/preview/cover`, `/ebooks/sampler/preview/spread-1`, etc.) emit them.

### Listing copy

A ~400-word description block written for Etsy SEO. Target tags include:

- `Quranic grammar`
- `Al-Fatiha`
- `Arabic learning PDF`
- `Quran tafseer`
- `Surah Al-Fatiha word by word`
- `Arabic grammar PDF download`
- `Quranic Arabic ebook`

The exact listing copy is **deferred to implementation** — it's a small writing task, not a design decision.

## 10. Distribution

- **Primary channel:** Etsy
- **Possible parallel channels:** Gumroad, Payhip, Lemonsqueezy — the same PDF file works on all of them
- **Price:** $4–5 (US)
- **Delivery:** Etsy auto-delivers the PDF after purchase; no manual fulfilment
- **No email gate.** No free lead-magnet version. The Sampler is a paid product end to end.

## 11. Open questions for the implementation plan

These remain unresolved and should be addressed in the next phase (writing-plans):

1. **Final author byline.** Currently brand-only. If a personal byline is wanted, where exactly does it sit and what is the exact string?
2. **Exact wording of the Introduction.** Two pages of copy — written during implementation, not design.
3. **Glossary entry list.** Every Arabic grammar term used in the seven chapters needs to be catalogued. Likely derived programmatically from the MDX (a script can extract `GrammarMoment` titles + key terms).
4. **"Where to go next" page copy.** Needs to point at Foundation Book (which doesn't yet exist) and quranigrammar.com.
5. **Featured-verse line-break logic.** Surah Al-Fatiha's longer verses (especially v7) need careful line-breaking in `Amiri Quran` to avoid awkward wraps. May require manual `<br>` placement per verse.
6. **PDF accessibility / tagged structure.** PDFs from Chromium are *not* properly tagged for screen readers. Out of scope for V1 but a known limitation; flag if a buyer ever asks.
7. **Colour-accurate proofing on iPad / Kindle Fire screens.** The dark canvas + cream ink combo should be tested on at least two physical reading devices before listing goes live.

## 12. Success criteria

The Sampler ships successfully when:

- A buyer searching "Quranic grammar" or "Al-Fatiha PDF" on Etsy can find the listing
- The cover thumbnail reads clearly at 200 px wide in an Etsy search grid
- Purchase → automatic PDF delivery works end-to-end (Etsy's standard flow)
- The PDF renders identically across Mac Preview, Adobe Reader, and mobile Chrome
- The seven ayah chapters each fit the locked per-chapter pattern with no broken page breaks
- The visual system established here is reusable for the Foundation Book without retooling

The Sampler is a *commercial* success if it earns back its design hours within 90 days and produces buyers who go on to purchase the Foundation Book when it launches.
