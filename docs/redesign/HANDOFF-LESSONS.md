# Handoff: roll out the lessons

Written 2026-10-27 for a fresh session. You orchestrate; subagents write the lessons. The owner (Daod) is working on the front page in another session at the same time, so keep to the files this brief names.

## The goal

Rewrite every lesson to the standard of the **model lesson**, L2.01 (`src/content/lessons/level-2/01-nominal-sentence.mdx`), in the same layout. A finished lesson is **complete** in the sense the owner agreed: the 7-point definition at the end of `docs/redesign/CONTENT-INVENTORY.md`. Read that definition before anything else; every gate below tests it.

80 lessons remain, on `main` under `src/content/lessons/` (L2.01 is done). Work level by level: Level 2 (L2.02 to L2.12) first, then Level 1, then Levels 3 to 5.

## Read first

1. `docs/redesign/CONTENT-INVENTORY.md`: the definition of complete, the shape of an old lesson, and errors found in L1.10, L2.01, L3.03, L4.01 and L5.01 (those four are already inventoried).
2. `docs/redesign/specs/L2.01-nominal-sentence.md`: the **model spec**. Every lesson gets a spec in this shape: verses table, parse table, check against al-Jadwal, step plan, exercises, old checklist ticked.
3. The model lesson itself, and `docs/redesign/LESSON-TEMPLATE.md` for the components (`Step`, `Block`, `Stage`, `Sentence`, `Parse`, `Exercise`, `Check`, `Note`).
4. `scripts/lesson-qa/README.md`: the check tools.
5. `docs/redesign/PLAN.md`, section "Decisions after Part 2", and `PRODUCT.md`.

## The owner's decisions

- **Layout:** 3 to 5 big steps per lesson, each a run of `Block`s with the example beside the text. The owner rejected 35 small steps ("never ending") and approved this layout after clicking through it.
- **Content:** keep everything the old lesson taught unless it is wrong; no word target; fix the old errors.
- **Parsing source:** al-Jadwal (Maḥmūd Ṣāfī) for every parse; al-Durr al-Maṣūn (al-Samīn al-Ḥalabī) where scholars differ. Cite them, paraphrase, and keep their wording out of the lessons. Grammar sources the owner approved: the Quranic Arabic Corpus, *al-Ajurrumiyyah* (Arabic text), the Madinah books, Bayyinah. Cite those and these two i'rab books only.
- **Verse text:** the Tanzil text in the repo's Corpus file, exact, diacritics included. A verse is the main example in at most two lessons; prefer fresh verses to Al-Fatiha and Al-Ikhlas.
- **English under verses:** our own plain-English meanings at B1, labelled "Meaning".
- **Words:** say "word by word", not "parse", in lesson text.
- **Models:** the owner approved Sonnet for the subagents that write lessons (2026-10-27).

## Per lesson: the steps

Give each lesson to one writer subagent (Sonnet), with this brief's path, the model lesson and the model spec. Lessons in one level can run in parallel; each writer touches only its own lesson file and its own spec file.

1. **Inventory.** List every concept, example, analysis, mistake and exercise of the old lesson (`git show main:<path>`), and mark each claim that looks wrong. Done when every section of the old file has a line in the list.
2. **Spec** in `docs/redesign/specs/<lesson-id>.md`, in the model spec's shape. Pick verses with `search-verses.py`; check each against `verse-ledger.md` (below). Read every parse in al-Jadwal with `jadwal.mjs` and record the result for each verse part (word level, sentence level only, or disagrees). Replace a verse whose parse al-Jadwal disputes. Done when every verse part has an al-Jadwal result and every old-checklist item has a place in the step plan.
3. **Write** the lesson in the model lesson's layout: 3 to 5 steps, at least as many worked exercises as the old lesson, quick checks, the old mistakes, four or so verses word by word with `Parse` where the topic allows it, sources at the end.
4. **Check.** `check-verses.py` prints `mismatch=0`; `npm run build` passes; `qa.mjs <lesson>` prints `no problems` (preview on port 4323: the `app-lessons` entry in `.claude/launch.json`, with `LESSON_PORT=4323`). Then a humanizer pass on the English.
5. **Tick** the old checklist against the written lesson in the spec, as the model spec does.

Then you, the orchestrator, **review** each lesson before accepting it: open the spec's al-Jadwal results, spot-check three parses yourself with `jadwal.mjs`, run the three checks again, and read the lesson once as a learner. A writer's report is a claim; verify it.

## Shared files: yours alone

Writers leave these to you, and you change them one at a time:

- `docs/redesign/verse-ledger.md`: one line per verse used as a main example, with its lessons. Create it from the model lesson's verses. Update it as you accept each lesson.
- The template (`src/components/lesson/`, `src/styles/lesson-steps.css`, `src/scripts/lesson-steps.ts`). When a lesson needs a new component (a conjugation table for Level 3, say), build it yourself, add it to `LESSON-TEMPLATE.md`, then let writers use it.

## Showing the owner

The owner wants short plain messages, numbers they can trust, and to see work before the next part. At the end of each level: screenshots (desktop and phone) of a few blocks per lesson, a list of what each lesson keeps, adds and fixes, and anything not verified. Commit on your branch as each lesson is accepted. Push or open a PR only when the owner says so (the plan is one PR per level).

Bring the owner any decision that changes the course rather than one lesson. Number your questions and give a recommended answer, so "yes" accepts it. Questions already waiting for them:

1. **Lesson order** (decision 1 in `PLAN.md`): verb forms by use, weak verbs and pronouns earlier. This moves lessons and their addresses. Raise it before Level 3; Level 2 can be written in its current order.
2. **A reviewer who knows Arabic** for the English meanings and the Arabic parse lines. Until there is one, every report says these are unreviewed.
3. **Old lessons that overlap** the new ones: L2.02 repeats much of L2.01. Plan L2.02 to build on L2.01 (deeper agreement, more practice) and tell the owner what moved.

## Rules of this machine

From the owner's global instructions, the ones that bite here:

- Work in your own worktree from this branch (`claude/content-restart-959504`), then `npm ci`. Stage files by explicit path.
- Run browsers headless or in the Browser pane; the scripts here already do. Verify a port is free after stopping a server.
- Report only numbers you counted in full, and say "at least N" when output may be cut.
- Before merging or deploying, list every recommendation you are holding.

## State at handoff

Branch `claude/content-restart-959504`, all committed. L2.01 is done in the 5-step layout and was approved by the owner on layout. Its English meanings and Arabic parse lines are unreviewed by an Arabic speaker. The al-Jadwal parse for 2:286 and 27:88 was confirmed at sentence level only.
