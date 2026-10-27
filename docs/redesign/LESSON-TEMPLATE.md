# Stepped lesson template ("Stage" look)

Built in Part 3 from the mockup the owner chose (`docs/redesign/mockups/l2-01/i-stage.html`). First lesson in it: L2.01.

## What it is

A lesson is a run of short steps. One step shows at a time, with a progress bar, Back and Next, and the arrow keys. On a wide screen the Arabic example sits in a panel beside the text and stays in view while you read. On a phone the panel sits under the step title. Without JavaScript every step shows in order, so the lesson still reads top to bottom.

## How to make a lesson stepped

1. In the lesson's frontmatter add `template: steps`, a short plain-English `kicker`, and the usual `title`, `titleArabic`, `level`, `order`, `description`.
2. Import the components from `src/components/lesson/` and write the lesson as `<Step>` blocks. `src/content/lessons/level-2/01-nominal-sentence.mdx` is the model.
3. Keep the lesson file where it is: the lesson address and saved progress do not change.

| Component | Use |
|---|---|
| `Step` | One step. `id`, `label` (progress bar tooltip), `title`. `hero` on the first step makes the title the page `h1` |
| `Stage` | The example panel. Put `Sentence`, `Tiles` or `Formula` inside |
| `Sentence` | A Quran phrase as word tiles with word type, optional role bars (mubtadaʾ, khabar) and the English line with the missing word marked |
| `Tiles` | Big word tiles, with a dashed `ghost` tile for a word English needs and Arabic leaves out |
| `Formula` | "part + part = whole" card |
| `Legend` | The word-type colour key |
| `Note` | `tip`, `know` (good to know), `warn` (watch out), `remember`. Colour, icon and label all say the kind |
| `Check` | One quick question with instant feedback |
| `Start` | The first step's overview: goal, time, what to know first, new terms |
| `Sources` | "Where this comes from" and the "Found a mistake?" link |

Writing rules (from the plan): B1 English, one idea per step, example first then the rule, no em dashes.

## How it is wired

- `src/layouts/LessonStepsLayout.astro`, `src/styles/lesson-steps.css` (everything under `.lx` and `lx-` classes), `src/scripts/lesson-steps.ts`, pure helpers in `src/lib/lesson-steps.ts` (unit tested).
- **Separate route.** Stepped lessons are served by `src/pages/learn/[level]/[lesson].astro`; classic lessons by `src/pages/learn/[...slug].astro`. The URL is the same. They are separate routes because the classic layout's global night styles (a reset and a dark page) otherwise load on every lesson page. Both routes use `src/lib/lesson-paths.ts` for the lesson list and previous/next links.
- **Light on purpose.** The template ignores the site's theme toggle.
- **Where was I.** The current step is saved per lesson in `localStorage` (`quran-learn-lesson-step`). A step in the URL (`#rule`) wins over the saved one.
- **Completion** uses the same storage as the classic lessons (`quran-learn-progress`).

## Checked

Headless browser at 390 px and 1280 px: no horizontal scroll, Arabic and Geist fonts load, all nine steps show without JavaScript, Back/Next/arrow keys/resume/hash/quick checks/complete button work. axe-core finds no violations on five steps at both widths. `npm run test:site` and `npx tsc --noEmit` pass. Page count is unchanged (164 pages indexed).

## Not done yet (on purpose)

- **Mastery check and gate** (5-question check per lesson, "pass first" with a skip link). That is Part 4. The last step offers "Mark lesson complete" and "Next lesson" only.
- **Verse text from Tanzil.** The Arabic in `Sentence` is typed and was checked against the Corpus letters (`scripts/check-verse-text.ts` logic). Reading it from the Tanzil file by reference needs the file added (a download, to be approved).
- **Source lines** in `Sources` are placeholders until exact pages are confirmed.
- **"Found a mistake?"** links to the About page feedback form for now. The owner wants a pre-filled form per lesson.
- **Vocabulary list.** `scripts/build-lesson-vocab.ts` reads `<ArabicExample words=...>`, so a stepped lesson has no entry in `src/data/vocab/lessons.json` until that script also reads `<Sentence>`. The old L2.01 entry stays until the file is regenerated.
- **Content validators** (`npm run validate`) still ask for the old bilingual first-mention format and give 5 terminology warnings on L2.01, no errors. The new `Start` terms list is the intended pattern. The rule needs updating when more lessons move.
- **Lesson navigator.** The stepped layout has no course sidebar yet (Part 4: navigation and the learning path).
- **Lesson reorder notice** (agreed after Part 2) is Part 4/5.
- Only Geist 400 and 500 are self-hosted. The site body font elsewhere is unchanged.
