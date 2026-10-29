# Forty Hadith (Nawawi, 42 with Ibn Rajab) — word-by-word grammar — design spec

**Date:** 2026-10-27
**Status:** Approved by user (2026-10-27) after the open questions were answered
**Decided in:** grilling session, 2026-10-27

## Objective

Add a `/hadith/` section that teaches the 42 hadith of Imam al-Nawawi's *Forty Hadith*
(the 40, plus the two Ibn Rajab added) so a reader can memorise them **and** understand
why every word is written the way it is.

Reader: beginner to intermediate, the same level as the surah pages. Grammar terms are
short and link to the existing glossary and lessons.

Each hadith page has:

1. Arabic with full tashkeel (the main text).
2. An English translation beside it.
3. Narrator and who recorded it (e.g. "Bukhari and Muslim").
4. A light word-by-word table with four columns: Arabic, transliteration, meaning, and a
   short "why it is written this way" (the form, case ending or grammar point, in plain
   words). Hadith words carry less weight than Quranic words, so there is no root,
   morphology column, or tap-a-word decoder. This is deliberately lighter than the surah
   pages.
5. A line at the bottom: "Want to give feedback on this page?" linking to the existing
   feedback form on the About page (`/about/#feedback`).

Plus one downloadable PDF of the whole collection, built with the existing ebook
pipeline. The web pages are the main experience.

Success looks like: all 42 pages live, each with a complete word table, and a PDF that
matches the web content.

### Decisions already made

| Topic | Decision |
|---|---|
| Count | All 42. Hadith 41 and 42 are marked as Ibn Rajab's additions. |
| Translation | Own translation written from the Arabic, closely reliant on the published editions for meaning (user, 2026-10-27, after Task 1 found no edition licensed for reuse; see `2026-10-27-forty-hadith-sources.md`). No sentence copied. Credit the editions consulted on the site and in the PDF. |
| Nawawi's commentary | Read it to get meaning and grammar right. It is not translated and not shown as a page section. |
| Memorisation tools | None. No hide mode, no quiz, no audio. |
| Review labels | None per page. |
| Page order | The whole hadith (Arabic, transliteration, translation) comes first on every page, as one piece. Long hadith are then explained part by part, each part with its own Arabic, translation and word table (user, 2026-10-27). |
| Word table depth | Light: Arabic, transliteration, meaning, why. No root or morphology columns, no decoder (user, 2026-10-27). |
| Feedback | Reuse the existing Web3Forms feedback form at `/about/#feedback`. Each hadith page and the index end with "Want to give feedback on this page?" linking there. No new form. |
| Build order | Template plus hadith 1–3 first, user reviews, then the rest in batches, PDF last. |

## Assumptions

1. Same stack as the rest of the site: Astro, MDX content collections, Playwright for the
   PDF, hosted the same way as today.
2. Arabic text comes from an openly available edition (e.g. Arabic Wikisource or Shamela)
   and is checked against another edition. Sunnah.com is a cross-check only, because its
   terms forbid mass reproduction.
3. Grammar is drafted by me from the Arabic. There is no hadith equivalent of the Quranic
   Corpus to check against.
4. The surah decoder is not reused. The word table is plain content, rendered with the
   existing `GrammarTable` component.
5. Transliteration uses the same scheme as the surah pages.

## Tech Stack

Astro 5-style content collections (`src/content.config.ts`), MDX, TypeScript scripts run
with `tsx`, Playwright for PDF rendering, Pagefind for search. No new dependencies
planned.

## Commands

```
Dev:            npm run dev
Build:          npm run build            # astro build && pagefind --site dist
Validate:       npm run validate         # plus the validate:* scripts
Site tests:     npm run test:site
Ebook PDF:      npm run ebook:all        # builds, then renders PDFs
New (proposed): npm run validate:hadith                   # checks counts, diacritics, fields
New (proposed): npm run ebook:hadith                      # builds and renders the hadith PDF
```

## Project Structure

```
src/content/hadith/NN-<slug>.mdx        → one authored page per hadith (42 files)
src/content.config.ts                   → new `hadith` collection
src/pages/hadith/index.astro            → index of all 42 + feedback line + PDF link
src/pages/hadith/[...slug].astro        → one page per hadith
src/layouts/HadithLayout.astro          → or reuse SurahLayout (decided in Task 2)
scripts/validate-hadith.ts              → count = 42, tashkeel present, every word row has all 4 fields
src/content/ebooks/forty-hadith.mdx     → PDF source
src/pages/ebooks/forty-hadith.astro     → PDF route
src/components/Header.astro             → add "Hadith" nav link (desktop + mobile)
```

## Code Style

Content is authored the same way as `src/content/surahs/112-al-ikhlas.mdx`: frontmatter,
an `ArabicExample` with a `words` array, then a lighter `GrammarTable` word breakdown. Frontmatter
for the new collection:

```yaml
---
title: "Actions Are by Intentions"
titleArabic: "إنما الأعمال بالنيات"
number: 1
narrator: "Umar ibn al-Khattab"
recordedBy: "Bukhari and Muslim"
ibnRajabAddition: false
description: "..."
---
```

Arabic is never retyped from memory: it is copied from the source edition and checked by
`validate:diacritics`. Word-table columns:
`# | Arabic | Transliteration | Meaning | Why it is written this way`.

## Testing Strategy

- `validate:hadith` (new): exactly 42 files, numbers 1–42 with no gaps, hadith 41–42
  flagged as additions, every word row has all four fields, Arabic carries tashkeel.
- Existing `validate:diacritics`, `validate:terminology` and `validate:links` are extended
  to include `src/content/hadith`.
- Unit test (`tsx --test`) for the `validate:hadith` checks.
- Build: `npm run build` passes, Pagefind indexes the 42 pages.
- Browser check, hidden: pages render at 390 / 768 / 1440 px, the word table is readable
  on a phone, the feedback link reaches `/about/#feedback`, no horizontal scroll on
  mobile. Mobile scroll must not be trapped (the bug fixed in PR #21).
- Accessibility: run `npm run test:a11y` on the index and one hadith page.
- PDF: page count and a visual check of the first pages and one long hadith.

## Boundaries

- **Always:** work in its own git worktree; stage explicit paths; run validators and the
  build before a commit; keep generated files generated.
- **Ask first:** adding dependencies; changing the shared MDX components; changing CI.
- **Never:** copy text from a commercial translation; touch the surah decoder or the
  surah and lesson content; add memorisation features; show a review badge on pages.

## Success Criteria

1. `/hadith/` lists 42 hadith, and each links to a working page.
2. Every page has Arabic with tashkeel, English, narrator, source, and a word table in
   which every word has all four fields.
3. The word table is readable on a 390 px phone.
4. `validate:hadith`, the three extended validators, `test:site` and `build` all pass.
5. The PDF contains all 42 hadith and matches the web text.
6. The translation edition(s) followed are credited on the site and in the PDF.
7. Every page and the index link to the feedback form with "Want to give feedback on this
   page?".

## Rollout

1. Template plus hadith 1–3, shown to the user.
2. After sign-off, hadith 4–42 in batches, each batch validated and built.
3. PDF last.

## Open Questions

1. **Which free English editions** do we follow, and under what terms are they shared?
   I will list candidates with their licence or stated terms before drafting hadith 1.
2. ~~Decoder reuse~~ **Settled:** no decoder, a light word table instead.
3. ~~"Report a mistake" target~~ **Settled:** the existing feedback form at `/about/#feedback`.
4. ~~PDF distribution~~ **Settled:** free download.
5. ~~Nav and URL naming~~ **Settled:** `/hadith/`, nav label "Hadith".

Question 1 is mine to resolve in the first task (listing the free editions), and I will
report it before hadith 1 is drafted.
