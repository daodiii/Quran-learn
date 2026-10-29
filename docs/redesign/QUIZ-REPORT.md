# Quiz and review pages: report

Written 2026-10-29. The five level quizzes and the four cumulative reviews are in the new look. Branch `claude/quiz-redesign-ab7c2f`, started from local `main` (04a0981), not pushed.

## Who chose the look

The owner saw three mockups side by side before anything was built (`docs/redesign/mockups/quiz/`: A Stage, B Card, C Answer sheet, with notes and screenshots) and picked **B Card**. They also asked for the mockups on localhost, which I served on port 4330.

## What a learner sees

- One question at a time in a white card on the Oasis colour field used on home and Learn. A row of numbered dots on top turns into a tick or a cross as you answer. Light only, like the lessons (Geist, same tokens, same Arabic fonts).
- The Arabic inside a question and its answers is wrapped in the lessons' inline Arabic style (Hafs, larger, right to left). The question text itself is unchanged.
- Feedback never relies on colour. A right option has a solid green border, a tick and the words "Correct answer". A wrong pick has a dashed red border, a cross and the words "Your answer". The other options fade. The answer locks after one pick, as before.
- Under the options: "Correct." or "Not quite. The answer is D.", the explanation, and the lesson to open.
- Results: "You passed." or "Not yet.", the score, a bar with the pass mark marked by a line, then **Lessons to revisit** (one card per lesson that teaches a missed question), then Try again, the next step and All lessons, then every answer (open to read the reason). If the learner passed, the next step is the main button; if not, Try again is.
- The next step is the first lesson of the next level (quiz), "Read a surah now" (Level 5 quiz) or the first lesson of the level (review). Nothing is locked: a failed result still links onward.
- Below the card: a link back to the last lesson of the level (quiz) or the previous level's quiz (review), All lessons, and the next step.
- No streaks, XP, badges or sounds. Motion: a 150 ms colour change on options, and smooth scrolling that is switched off with reduced motion.

## What I kept and what changed

| Kept | Changed |
|---|---|
| Every question, option, answer and explanation (the arrays in the five quiz pages are byte-identical to before; I compared them by script). The review data files are untouched. | The look, all of it. |
| Pass mark 70, scoring (right answers / total, rounded), inclusive pass. | Question text no longer drops into the page as raw HTML (it is escaped; `<b>`, `<i>`, `<u>`, `<em>`, `<strong>` still work, as in the lessons). |
| `#quiz-data` JSON on the page, `data-testid` values (`quiz-container`, `quiz-option-N`, `next-btn`, `quiz-results`, `quiz-score`, `retry-btn`). | The JSON now also carries each question's `lessons` (the page no longer sends `source`). |
| Page addresses and titles. | With JavaScript off the page now prints every question with its answer and reason. Before, it showed a "Start Quiz" button that did nothing. |

The old start screen is gone: question 1 shows at once, and the pass mark is in the heading text.

## Files

- New: `src/layouts/QuizLayout.astro`, `src/styles/quiz.css`, `src/scripts/quiz.ts`, `src/lib/quiz.ts` (+ `quiz.test.ts`, 6 tests), `tests/quiz.spec.ts` (7 browser tests), `scripts/lesson-qa/quiz-qa.mjs`, `scripts/lesson-qa/quiz-shots.mjs`, the mockups folder, the screenshots.
- Changed: `src/pages/learn/level-1/quiz.astro` to `level-5/quiz.astro` and `src/pages/learn/[level]/review.astro` (now thin pages that use the layout), `package.json` (`test:site` runs the new unit test).
- Deleted: `src/components/Quiz.astro`.

## Checks (run on the final code unless noted)

- `npm run build`: passes (exit 0). A question that names a lesson that does not exist fails the build.
- `npm run test:site`: 41 of 41 pass (the 6 new tests included).
- Playwright `tests/quiz.spec.ts` and `tests/review-quiz.spec.ts`: 10 of 10 pass. They cover a wrong answer, a full pass, a full fail with Try again, the 70% line (7 of 10 passes, 6 does not), the review's lesson links, the no-JavaScript print, and no sideways scroll at 390 px.
- `scripts/lesson-qa/quiz-qa.mjs` (headless Chromium): Level 5 quiz, Level 3 review and Level 1 quiz each report "no problems". For each page it checks four states (first question, a wrong answer, passed, failed) at 390 and 1280 px: axe-core on the quiz part of the page (no violations), nothing wider than the screen or poking out of the card, no touch target under 44 px, and the no-JavaScript print. The Level 5 quiz and Level 3 review passed on two runs in a row after the last fix.
- Screenshots: `docs/redesign/screens/quiz-redesign/` (20 files: Level 5 quiz and Level 3 review in four states at 1280 and 390 px, plus Level 1 quiz first and wrong). I looked at two of them (Level 5 phone, Level 3 review failed result at desktop).

## Found and fixed on the way

- **The 14 progress dots poked out of the card by 6 px at 390 px** (inside the screen, so a screen-width check missed it). They now have a fixed size and wrap to a second row. The check now tests against the card.
- **Sideways scroll of 2 to 8 px:** `BaseLayout`'s `body.mesh-bg::before` is a decorative layer that drifts for 25 seconds and grows the page a few pixels past the edge. It is switched off on the quiz pages (the card field covers it).
- **Scroll bounce:** `Header.astro` adds a `scrolled` class above 10 px of scroll and shrinks the header by about 9 px. A page parked at 10 to 11 px then bounces without end, and clicks fail as "not stable". My answer-reveal scroll landed there. The quiz now never stops between 1 and 47 px from the top.

## Not changed on purpose, for the owner to decide

- **The lesson pages' sideways scroll.** I did not touch the lessons. On an unchanged Level 5 lesson page I measured `scrollWidth` growing from 390 to 395 over 15 seconds, the same layer. I did not test whether that lesson page can actually scroll sideways by hand, so this is unconfirmed for lessons. It probably shows up in the lesson QA as an occasional random "WIDE" result.
- **The header bounce** affects every page that uses `BaseLayout`. A small gap between the two thresholds would fix it.
- **`.footer-heading` contrast.** Once the drifting layer was off, axe flagged the footer heading (gold text) as low contrast. The footer is not part of this work and axe in `quiz-qa.mjs` is limited to the quiz. I did not measure the ratio myself.

## Content findings (listed, not changed)

- **10 of the 66 level-quiz questions name no lesson in their explanation**, so a missed one points to "All Level N lessons" and its feedback has no lesson line: Level 1 question 1; Level 2 question 7; Level 3 questions 7 and 10; Level 4 question 6; Level 5 questions 1, 2, 3, 7 and 8. Adding a lesson reference to those explanations (or a `source` to the question) would complete the "lessons to revisit" list. Every review question has a `source`, so every review question links to a lesson.
- The Level 5 quiz question texts use plain apostrophes around Arabic words (for example `'ٱلْحَمْدُ'`) and some English words are in Latin transliteration style that varies between questions. I did not change them.

## Hook for the later mastery gate

The result is plain numbers inside `src/scripts/quiz.ts` (`scoreOf`, `hasPassed` from `src/lib/quiz.ts`). Nothing is saved or sent anywhere. To build "Pass the check first" later, read the score where `renderResults()` runs, or dispatch a `CustomEvent` there, and store it with the progress helpers in `src/lib/progress.ts`. I did not build the gate.

## Not verified

- No keyboard or screen-reader walk-through by hand. Focus moves to the question heading on Next and to the result heading on the results screen; the reason sits in a `role="status"` region. I read the code, not a screen reader.
- No real phone. The 390 px results come from headless Chromium.
- axe and the width check ran on the Level 5 quiz, Level 3 review and Level 1 quiz only. The Level 2, 3 and 4 quizzes and the Level 2, 4 and 5 reviews build and the review pages return 200, but were not run through axe.
- Dark mode: the quiz is light only, like the lessons, and I did not test it with the site's dark theme on.
- The Arabic in the questions was not re-read: the page shows the text as it was.
