# Handoff: start the lesson content again

Written 2026-10-27 for a new session running on Opus 5.5. Read this whole file before anything else, then `docs/redesign/PLAN.md`.

## Why you are here

The owner (Daod) is not happy with how the redesign went. The previous session (Sonnet 5.5) rebuilt lesson L2.01 in a new look, and the owner then noticed it had become much shorter and taught far less. They are right. The new L2.01 has about 850 English words; the old one had about 2,900. The old lesson had word-by-word analysis of four verses, three kinds of khabar, three common mistakes and seven exercises. The new one has none of that depth.

The owner told me in the plan stage: "keep the same things but have more steps". I did not do that. I followed my own target of "600 to 900 words of teaching text per lesson" from the plan document, cut the content to fit it, and reported the lesson as finished without comparing it to what the old lesson taught.

The owner now says the problem is bigger than L2.01: "what you've thought was a good idea and not ... that's a huge, huge problem for me." They want the content approach redone, with a more capable model. They want to keep the look (the Stage template, the Oasis colours, the four colour-coded notes). They want the content changed completely.

Treat every content decision in the earlier docs as a proposal that was never fully approved on its merits. In particular, distrust: the word target per lesson, "one concept per lesson" as a reason to remove material, and the claim that fewer, shorter steps teach better. The owner's real goal is that a student who finishes the course can read the Quran with real grammatical understanding. Depth and accuracy matter more than speed to a finished page.

## What the owner wants, in their own words and order

- A redesign of Quran Learn (quranic-grammar.com) so learners can understand the Arabic of the Quran. Welcoming, educational, colourful, easy to read, B1 English because English is how learners understand Arabic. Learners come from many countries.
- Two tracks running together: Classical Grammar (kept and improved, if solid) and a new Vocabulary course built on the most frequent Quran words.
- Each lesson mastered before the next (soft gate, pass mark set per check, skip and test-out allowed). Quizzes must look like the rest of the site.
- Fresh examples, not the same few verses (Al-Fatiha and Al-Ikhlas make up about 19% of verse uses now).
- Honest sources on every lesson, plus a "Found a mistake? Tell us" link. No "unreviewed" label.
- Nothing will be sold.
- Make the work in small parts, each shown to the owner before the next. They want to look first ("show me first").
- They are tired of questions. Ask only what changes what you do. When you ask, number the questions and give a recommended answer so "yes" accepts it.

## What exists (all committed, nothing pushed, no PR)

Repo: `C:\Users\daodi\code\Quran-learn` (Astro 5, Tailwind 4, MDX, Supabase, Capacitor). The previous session worked in the worktree `.claude/worktrees/redesign-audit`. The branches stack on each other:

| Branch | What it holds |
|---|---|
| `docs/redesign-part-1-audit` | `docs/redesign/PLAN.md`, `docs/audit/` (AUDIT.md, verse-bank.md, lesson-stats.json, screenshots), `.claude/launch.json` |
| `docs/redesign-part-2-sources` | `docs/curriculum/` (SOURCES.md, CURRICULUM-REVIEW.md, vocabulary-outline.md, verse-text-check.md, frequency.json) and three scripts in `scripts/` |
| `design/redesign-part-3-mockups` | `PRODUCT.md`, `docs/redesign/mockups/l2-01/` (three rounds of mockups; round 3 "I, Stage" was chosen) |
| `feat/lesson-template-stage` | the real template and the rewritten L2.01. It contains everything above. **Start from this branch.** |

Read, in this order: `docs/redesign/PLAN.md` (the agreed plan and decisions), `docs/curriculum/CURRICULUM-REVIEW.md` and `SOURCES.md` (Part 2 findings), `docs/redesign/LESSON-TEMPLATE.md` (how the template works), `PRODUCT.md`.

The template (keep it) is in `src/components/lesson/`, `src/layouts/LessonStepsLayout.astro`, `src/styles/lesson-steps.css`, `src/scripts/lesson-steps.ts`, `src/lib/lesson-steps.ts`, with routes `src/pages/learn/[level]/[lesson].astro` (stepped) and `[...slug].astro` (classic). A lesson opts in with `template: steps` in its frontmatter. It had an independent code review and its findings are fixed.

The old L2.01 is in git on `main`: `git show main:src/content/lessons/level-2/01-nominal-sentence.mdx`. Use it as the baseline for what a lesson must teach. All 81 lesson files are on `main`.

## Decisions the owner made (still stand unless they change them)

1. Reorder the grammar lessons per `CURRICULUM-REVIEW.md` (verb forms by use, hollow and defective verbs earlier, little words early, attached pronouns earlier). Tell current learners: old addresses keep working, progress carries over, a "What changed" note.
2. English under each verse is our own plain-English meaning, written with the `humanizer` skill, labelled as a meaning and not a translation. Someone who knows the verses must check it.
3. Quran text comes from Tanzil by reference, with a Tanzil credit. The repo has no Tanzil file; downloading one needs the owner's yes.
4. Nothing will be sold.
5. Vocabulary course: strict frequency order first (`docs/curriculum/vocabulary-outline.md`).
6. Sources to cite: the Quranic Arabic Corpus grammar pages, *al-Ajurrumiyyah* (the Arabic text), the Madinah course books and Bayyinah. Not approved: Wright, Ryding, Haywood and Nahmad, and Perowne's English translation. The owner distrusts English-language grammars by outsiders to the tradition. The exact Madinah and Bayyinah titles are not yet found.

## What went wrong, so you do not repeat it

1. **I shortened the content and called it done.** I never compared the new lesson to the old one's coverage. Before you declare any lesson finished, list what the old lesson taught, tick each item against the new one, and show the owner the list.
2. **I put my own target above the owner's words.** When the plan document and the owner disagree, the owner's words win. Say so if you notice a conflict.
3. **I reported something that was not true.** I said "test:site passes, 16 tests" while a typo silently skipped two test files. Earlier I also reported a wrong source count. Count what you report, and say "at least N" when output may be cut.
4. **I treated model output as fact.** Two research agents gave the source and licence findings; I re-checked only three items. The rest is marked as reported. Verify anything the owner will rely on.
5. **I spent three mockup rounds on looks** before the content question was settled. The owner's trust problem is in the content, not the colours.
6. **All lesson copy and every Arabic example in my version was typed by me.** Nothing was checked by a person who knows Arabic. The verse-text check (`scripts/check-verse-text.ts`) matches letters only, found 39 of 679 old examples that do not match their verse, and ignores diacritics.

## How I would start (a suggestion, not an order)

1. Read the files above. Skim `docs/audit/AUDIT.md` for what the old pages looked like.
2. Before any code: make a **content inventory** of the old L2.01 (every concept, example, analysis, mistake, exercise) and of one lesson from each level. Show it to the owner and ask what "complete" means for a lesson here: depth of i'rab, number of exercises, how much classical terminology, how the sources are used. This is the conversation that was skipped.
3. Write a content specification for one lesson, agreed with the owner, then write that one lesson in full in the Stage template (more steps, not less). Show it. Only then continue.
4. Keep the owner informed in short plain messages. They read long reports as noise.

## Rules of this machine and this owner (from their global CLAUDE.md)

- One session per directory. Use your own worktree (the desktop app makes one), then `npm ci`.
- Run browser checks headless or in the built-in Browser pane. This machine's Playwright expects chromium build 1208, which is not installed; 1243 is. Launch with `executablePath` set to `%LOCALAPPDATA%\ms-playwright\chromium_headless_shell-1243\chrome-headless-shell-win64\chrome-headless-shell.exe`. Do not download a browser without asking.
- `.claude/launch.json` has `app` (port 4321, `npm run preview`) and `app-dev`. After stopping a server, check the port is free.
- Stage files explicitly (a hook blocks `git add -A`). Bracketed paths such as `[...slug].astro` need `GIT_LITERAL_PATHSPECS=1`.
- Skill priority from the owner's CLAUDE.md: Addy Osmani, Matt Pocock and Humanizer skills come first; say which skill you use. Run all subagents on the session's own model.
- Before merging or deploying, list every recommendation you are holding.
- Commit messages end with the co-author line the app gives you.

## State at handoff

Everything is committed. `feat/lesson-template-stage` is at the commit after this file. The app preview server was stopped. Open items from before: the exact Madinah and Bayyinah titles; who tests the first lesson; whether anyone can review the Arabic; the Tanzil download; where "Found a mistake?" reports go (the About page form for now).
