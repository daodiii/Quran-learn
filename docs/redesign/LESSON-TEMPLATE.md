# Stepped lesson template ("Stage" look)

Built in Part 3 from the mockup the owner chose (`docs/redesign/mockups/l2-01/i-stage.html`). First lesson in it: L2.01.

## What it is

A lesson is a run of short steps. One step shows at a time, with a progress bar, Back and Next, and the arrow keys. On a wide screen the Arabic example sits in a panel beside the text and stays in view while you read. On a phone the panel sits under the step title. Without JavaScript every step shows in order, so the lesson still reads top to bottom.

## How to make a lesson stepped

1. In the lesson's frontmatter add `template: steps`, a short plain-English `kicker`, and the usual `title`, `titleArabic`, `level`, `order`, `description`.
2. Import the components from `src/components/lesson/` and write the lesson as `<Step>` blocks. `src/content/lessons/level-2/01-nominal-sentence.mdx` is the model.
3. Keep the lesson file where it is: the lesson address and saved progress do not change. To move a lesson, add its old and new id to `src/data/lesson-moves.json`: the old address then redirects, saved progress moves with it, and a "What changed" note shows once to learners with saved progress (`src/components/LessonMovedNote.astro`, on the lesson and on the learn page). Level 3 was reordered this way on 2026-10-28.

| Component | Use |
|---|---|
| `Step` | One step. `id`, `label` (progress bar tooltip), `title`. `hero` on the first step makes the title the page `h1`. `part="..."` on the first step of each part groups a long lesson into parts (see below) |
| `Block` | One section of a big step: `id`, `title`, its own `Stage` and text. The script numbers the blocks in a step ("3 of 8"). `uncounted` leaves an overview out of the count; `level={2}` for blocks in the hero step |
| `Stage` | The example panel. Put `Sentence`, `Tiles`, `Formula`, `Parse` or a `blockquote.lx-quote` inside |
| `Sentence` | A Quran phrase as word tiles with word type, optional role bars and the English line (labelled "Meaning") with the missing word marked. Roles: first part of a pair, solid bar: `mubtada`, `mubtadaLater`, `ismKana`, `ismInna`, `fail`, `naibFail`, `mudaf`, `manut`; second part, dashed: `khabar`, `khabar2`, `khabarFirst`, `khabarKana`, `khabarInna`, `maful`, `mudafIlayh`, `naat`, `matuf`, `hal`, `majrur`; the verb, solid in the verb colour: `fiil`; dotted grey: `tied` (a phrase that belongs to another word), `jar` (a preposition), `jarMajrur` (a preposition with its noun in one tile), `zarf` (a place or time word). `label` and `hint` on a group override the text (added for Level 2 on 2026-10-27) |
| `Parse` | Word-by-word iʿrāb of one verse: word tiles, then one card at a time (role, case, mark, why, and the parse as the Arabic grammar books word it). Back and Next light each word. Without JavaScript all cards are listed |
| `Exercise` | A worked exercise: question in `q`, the answer inside, behind a "Show the answer" button (`<details>`, works without JavaScript). Write the answer as markdown with blank lines around it |
| `Tiles` | Big word tiles, with a dashed `ghost` tile for a word English needs and Arabic leaves out. `type: 'x'` is a plain grey tile for a letter, vowel or mark (no word-type colour; added for Level 1) |
| `Formula` | "part + part = whole" card |
| `Conjugation` | A conjugation table inside a `Stage`: one verb or pattern across persons. `caption` (required) names the verb and tense; each row has `who` (plain English: "he", "you all (women)"), `pr` (the pronoun, optional), `ar` (the form), `end` (the part that changes, shown alone, e.g. `ـْتُ`; header from `endLabel`, default "Ending", use "Prefix and ending" for the present), `say` (sound) and `hi: true` for the row the text is about. `{ group: 'Singular' }` is a sub-heading row. Five columns fit a phone at 390 px. The forms are teaching forms, not verse quotes, so `check-verses.py` does not read them: put the verse itself in a `Sentence` or `Parse`. Added for Level 3 on 2026-10-28 |
| `Legend` | The word-type colour key |
| `Note` | `tip`, `know` (good to know), `warn` (watch out), `remember`. Colour, icon and label all say the kind |
| `Check` | One quick question with instant feedback |
| `Start` | The first step's overview: goal, time, what to know first, new terms |
| `Sources` | "Where this comes from" and the "Found a mistake?" link |

Writing rules (from the plan): B1 English, one idea per step, example first then the rule, no em dashes.

**Big steps (the owner's decision, 2026-10-27).** A lesson has 3 to 5 steps. Each step is a run of `Block`s, and each block has its own example beside its text (above it on a phone). The step counter reads "1 of 5". L2.01 is the model: 5 steps of 8, 7, 8, 8 and 3 blocks.

**Parts** (kept in the template, not used by L2.01 now). A lesson with many small steps can name its parts. The progress bar then shows one segment per part, opens the current part into its steps, and prints "Part 3 of 9: …" under the bar. Without parts it keeps one segment per step.

**Checking the Arabic.** Every `Sentence` and `Parse` with a verse reference, and every verse quoted in an `Exercise` question, should match the Tanzil text in `src/data/morphology/quranic-corpus-morphology-0.4.txt` exactly, diacritics included. Convert the Corpus Buckwalter with the full table in `scripts/lib/buckwalter.ts` (`BW_ANNOTATION_MARKS`): the small wāw (`,`) and small yāʾ (`.`) are easy to swap.

## How it is wired

- `src/layouts/LessonStepsLayout.astro`, `src/styles/lesson-steps.css` (everything under `.lx` and `lx-` classes), `src/scripts/lesson-steps.ts`, pure helpers in `src/lib/lesson-steps.ts` (unit tested).
- **Separate route.** Stepped lessons are served by `src/pages/learn/[level]/[lesson].astro`; classic lessons by `src/pages/learn/[...slug].astro`. The URL is the same. They are separate routes because the classic layout's global night styles (a reset and a dark page) otherwise load on every lesson page. Both routes use `src/lib/lesson-paths.ts` for the lesson list and previous/next links.
- **Light on purpose.** The template ignores the site's theme toggle.
- **Where was I.** The current step is saved per lesson in `localStorage` (`quran-learn-lesson-step`). A step in the URL (`#rule`) wins over the saved one.
- **Completion** uses the same storage as the classic lessons (`quran-learn-progress`).

## Checked

Headless browser at 390 px and 1280 px: no horizontal scroll, Arabic and Geist fonts load, Back/Next/arrow keys/resume/hash/quick checks/complete button work. axe-core finds no violations on five steps at both widths. `npm run test:site` (26 tests, including the helper tests in `src/lib/lesson-steps.test.ts`) and `npx tsc --noEmit` pass. Page count is unchanged (164 pages indexed), and the classic lessons still render as before.

An independent code review found 12 points; all but the two "unsure" ones are fixed:

- `test:site` had a missing space that silently skipped two test files. Fixed; the suite went from 16 to 23 tests with them back (26 with the new helper tests).
- Two note labels (Watch out, Remember) were under 4.5:1 contrast. Darkened to 5.8:1 and 6.2:1 (measured from the OKLCH values). The orange accent, the inactive bar and the control borders were raised to at least 3:1.
- Arrow keys no longer act at the first or last step, with Shift, or inside editable or dialog elements. The bottom bar no longer hides a focused control (`scroll-padding`).
- No-JavaScript readers get plain Previous and Next links and see the quick-check answers printed. With JavaScript, only the first step shows until the script takes over (no flash of the long page).
- A quick check locks after the right answer. Its answer group is labelled by its question. A `<Check>` whose answer is out of range fails the build.
- Text passed to components is escaped, keeping only `<b>`, `<i>`, `<u>`, `<em>`, `<strong>` (`safeInline`).
- A finished lesson forgets its saved step, so it reopens at the start. The step count in `Start` is read from the page. The script warns in the console about duplicate step ids or a missing or doubled `hero` step.

Known behaviour: Back leaves the lesson, not the previous step, because steps use `replaceState`. The Back button inside the page goes to the previous step.

## Not done yet (on purpose)

- **Mastery check and gate** (5-question check per lesson, "pass first" with a skip link). That is Part 4. The last step offers "Mark lesson complete" and "Next lesson" only.
- **Verse text from Tanzil.** The Arabic in `Sentence` is typed and was checked against the Corpus letters (`scripts/check-verse-text.ts` logic). Reading it from the Tanzil file by reference needs the file added (a download, to be approved).
- **Source lines** in `Sources` are placeholders until exact pages are confirmed.
- **"Found a mistake?"** links to the About page feedback form for now. The owner wants a pre-filled form per lesson.
- **Vocabulary list.** `scripts/build-lesson-vocab.ts` reads `<ArabicExample words=...>`, so a stepped lesson has no entry in `src/data/vocab/lessons.json` until that script also reads `<Sentence>`. The old L2.01 entry stays until the file is regenerated.
- **Content validators** (`npm run validate`) still ask for the old bilingual first-mention format and give 5 terminology warnings on L2.01, no errors. The new `Start` terms list is the intended pattern. The rule needs updating when more lessons move.
- **Things the classic layout has that this one does not:** the "Words from this lesson" list, the reading track on the last lesson of a level, tap-a-word details on examples, and the table of contents. Word tiles here are not interactive. Whether any of these should come across is a Part 4/5 decision.
- **Lesson navigator.** The stepped layout has no course sidebar yet (Part 4: navigation and the learning path).
- Only Geist 400 and 500 are self-hosted. The site body font elsewhere is unchanged.
