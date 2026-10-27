# Task list: Forty Hadith (42)

Work in a dedicated worktree, not the main checkout. Stage explicit paths only.

## Phase 1: Research (no code)

- [x] **Task 1: Pick the sources**
  - Acceptance: a short note in `docs/superpowers/specs/` lists (a) 2-3 free English
    editions with their stated terms and where they are shared, (b) the Arabic edition we
    take text from and the second edition used for checking.
  - Verify: each edition's terms are quoted from its own page; user reads the note.
  - Files: one note under `docs/superpowers/specs/`
  - Scope: XS

## Phase 2: Foundation (hadith 1 end to end)

- [x] **Task 2: Hadith collection and page for hadith 1**
  - Acceptance: `hadith` collection in `content.config.ts`; `src/content/hadith/01-*.mdx`
    with Arabic, translation, narrator, source, a four-column word table, and the
    "Want to give feedback on this page?" link to `/about/#feedback`; `/hadith/<slug>/`
    renders in the same style as a surah page.
  - Verify: `npm run build` passes; open the page in the hidden browser at 1440 and 390 px;
    the feedback link lands on the form.
  - Files: `src/content.config.ts`, `src/content/hadith/01-*.mdx`,
    `src/pages/hadith/[...slug].astro`, layout (reuse or new)
  - Depends on: 1. Scope: M

- [x] **Task 3: `validate:hadith`**
  - Acceptance: script checks file count, numbers 1-N with no gaps, all four word-row
    fields present, tashkeel present; `npm run validate:hadith` is added to `package.json`.
  - Verify: passes on hadith 1; fails when a field is deleted (run once to prove it);
    `tsx --test` for the checks.
  - Files: `scripts/validate-hadith.ts`, its test, `package.json`
  - Depends on: 2. Scope: S

### Checkpoint A: after Tasks 1-3
- [ ] Build clean, validators pass
- [ ] User looks at hadith 1 on desktop and phone

## Phase 3: First review set

- [x] **Task 4: Hadith 2 and 3, index page, nav**
  - Acceptance: hadith 2 and 3 complete; `/hadith/` lists all pages written so far and
    ends with the feedback link; "Hadith" is in the desktop and mobile nav; Pagefind finds
    a hadith by a word in its translation.
  - Verify: build; search for a hadith phrase; nav link works on both layouts.
  - Files: `src/content/hadith/02-*.mdx`, `03-*.mdx`, `src/pages/hadith/index.astro`,
    `src/components/Header.astro`
  - Depends on: 3. Scope: M

### Checkpoint B: first review set (hadith 1-3)
- [ ] User approves format, table depth, translation style and wording
- [ ] Changes from the review are applied to the template before batches start

## Phase 4: Content batches

Each batch: author the MDX, run `validate:hadith`, `validate:diacritics`, `build`. Check
the longest hadith in the batch at 390 px. On every page the whole hadith comes first as one
block; a hadith that is split into parts gets a "The Whole Hadith" block ahead of the parts.

- [x] **Task 5: Hadith 4-12**. Depends on B. Scope: L (nine content files; split into two
  sittings if needed)
- [x] **Task 6: Hadith 13-21**. Depends on 5.
- [x] **Task 7: Hadith 22-30**. Depends on 6.
- [x] **Task 8: Hadith 31-42** (41 and 42 flagged as Ibn Rajab's additions). Depends on 7.

### Checkpoint C: all 42 written
- [ ] `validate:hadith` reports 42, build clean, user spot-checks five random hadith

## Phase 5: Finish

- [ ] **Task 9: Extend existing validators**
  - Acceptance: `validate:diacritics`, `validate:terminology`, `validate:links` include
    `src/content/hadith`; all pass.
  - Files: the three scripts. Scope: S

- [ ] **Task 10: Free PDF**
  - Acceptance: `src/content/ebooks/forty-hadith.mdx` and `src/pages/ebooks/forty-hadith.astro`;
    `npm run ebook:hadith` outputs a PDF with all 42 hadith, matching the web text; a
    download link sits on the index page.
  - Verify: page count; visual check of the cover, one short and one long hadith.
  - Depends on: 8. Scope: M

- [ ] **Task 11: Credits and final checks**
  - Acceptance: translation edition(s) credited on the index and in the PDF;
    `npm run test:a11y` clean on the index and one hadith page; hidden-browser check at
    390 / 768 / 1440 px; no trapped scroll on mobile.
  - Depends on: 9, 10. Scope: S

### Checkpoint D: ready to ship
- [ ] All spec success criteria met
- [ ] List of held recommendations given to the user before any merge
