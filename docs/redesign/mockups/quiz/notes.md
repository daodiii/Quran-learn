# Quiz and review mockups: notes

Three working mockups of the quiz and cumulative review pages in the new look. They use the real Level 5 quiz questions (six of the fourteen, built by `build-data.mjs` into `quiz-data.js`), the real scoring (percent of right answers against the pass mark, 70) and the stepped lessons' tokens, Geist and Arabic fonts (`quiz.css`).

## Open them

Open `compare.html` for all three side by side (desktop and phone), or any page on its own. They also open straight from disk. Add `?state=wrong` (question 3 answered wrongly), `?state=pass` (results, 5 of 6) or `?state=fail` (results, 3 of 6) to jump to a state. `node docs/redesign/mockups/quiz/shots.mjs` rebuilds `shots/` (headless).

## What all three share

- Same questions, answers, explanations, pass mark and scoring as today. The Arabic inside a question is wrapped in the lesson's inline Arabic style (Hafs, larger), so it reads like the lessons.
- The answer locks after one pick and the right answer shows at once, as today. Feedback never relies on colour: a right option has a solid green border, a tick and the words "Correct answer"; a wrong pick has a dashed red border, a cross and the words "Your answer"; the other options fade.
- The explanation shows under a "Correct." or "Not quite. The answer is D." line, with the lesson to open (read from the `L5.13` style reference in the explanation).
- The results screen says "You passed." or "Not yet.", the score and the pass mark, then "Lessons to revisit" (one card per lesson named in the questions you missed), then Try again, All lessons and the next step, then "Your answers" (every question, open to read the reason).
- No streaks, XP, badges or sounds. 44 px or larger controls. No horizontal scroll at 390 or 1280 px (checked by script on all 24 mockup screens).

## The three

- **A Stage** (recommended). One question at a time, laid out like a lesson step: segmented bar on top, the big amber "3 of 6", the question and its options on the left, and an answer panel on the right that stays in view (on a phone it sits under the options). Next sits in the same bottom bar as Back and Next in the lessons. Feels most like the lessons, so a learner moves from a lesson to its quiz without a change of room.
- **B Card.** One question in a centred white card on the Oasis colour field used on home and Learn. A row of numbered dots on top turns into a tick or a cross as you answer, so you see your run. Next sits in the card under the reason. Friendlier and more like home, but the reason can fall below the first screen on a laptop, and the dot row is a small scoreboard.
- **C Answer sheet.** Every question on one page, answered in any order, with a rail that tracks "3 of 6 answered" (a progress bar on a phone). The result appears at the bottom when all are answered. Works best without JavaScript (the page is already complete), and lets a learner skim and go back. Loses the one-idea-per-screen focus that PRODUCT.md asks for.

## Not in the mockups

The real pages will also: print the questions and answers when JavaScript is off (today the quiz shows only a button that does nothing), take the lesson to revisit from the review questions' `source` field, use the Next/Back of the level as the "next step" link, and respect reduced motion (the mockups use only a 150 ms colour change).
