# Implementation Plan: Forty Hadith (42) with word-by-word grammar

Spec: `docs/superpowers/specs/2026-10-27-forty-hadith-design.md` (approved 2026-10-27,
revised the same day: light word table, no decoder, existing feedback form).
Tasks are tracked in `tasks/todo.md`.

## Overview
A `/hadith/` section with 42 pages, built like the surah pages but lighter: authored MDX
with a four-column word table (Arabic, transliteration, meaning, why it is written this
way). There is no tap-a-word decoder and no generated data file. A free PDF of the whole
collection is built last with the ebook pipeline.

## Architecture Decisions
- **Authored MDX is the only source.** A new `hadith` content collection mirrors
  `surahs`. The word table uses the existing `GrammarTable` component. No extractor, no
  generated data, no change to the surah decoder.
- **Layout.** Try `SurahLayout` with props renamed for hadith first. Make `HadithLayout`
  only if the surah-specific fields get in the way. Decided in Task 2.
- **Feedback.** Every hadith page and the index end with "Want to give feedback on this
  page?" linking to `/about/#feedback`, the existing Web3Forms form. No new form, no new
  key.
- **Vertical slices.** Hadith 1 goes end to end (content, route, nav, feedback link)
  before any other hadith is written, so the format is settled by the first checkpoint.
- **Content is the bulk of the work.** 42 hadith, a word table for each. Authoring runs in
  batches of about 9, each batch validated and built before the next starts.

## Phases
1. Research (no code): editions, Arabic source, tashkeel check method.
2. Foundation: collection, route, hadith 1, validator.
3. First review with the user: hadith 1-3, index, nav.
4. Content batches: 4-12, 13-21, 22-30, 31-42.
5. PDF, credits, final checks.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| Grammar errors in a religious text; no hadith corpus to check against | High | Read Nawawi's commentary and a second Arabic edition per hadith; validators catch missing fields; every page links to the feedback form |
| Copied translation wording from an edition that is not actually free | High | Task 1 records each edition's stated terms; only editions that are freely distributed are used; credit them |
| Tashkeel errors from the Arabic source | Medium | Compare two editions; extend `validate:diacritics` to the hadith folder |
| Long hadith (e.g. 2, 9, 19, 24) give a table too wide for a phone | Medium | Browser check at 390 px for the longest hadith at the first checkpoint |
| Four-column table is too thin for the "why" | Low | The user reviews hadith 1-3 first; columns can still change before the batches |
| Scope drift into memorisation tools | Low | Spec forbids them |

## Open Questions
1. **Free English editions.** Resolved in Task 1, reported before hadith 1 is drafted.
