# Writer brief: one lesson, stepped layout

For the subagent that rewrites **one** lesson. The orchestrator gives you the lesson id (for example L4.03). Levels 1 to 3 were written this way; Level 4 is written the same way, to the same standard. Work in the worktree you were given. Do not use any other directory.

## What you produce

Two files, and only these two:

1. `src/content/lessons/level-N/NN-<slug>.mdx`: the lesson, replacing the old one in place (same file name, so the address and saved progress do not change).
2. `docs/redesign/specs/L<N>.<NN>-<slug>.md`: the content spec, in the shape of `docs/redesign/specs/L3.05-past-tense.md` (read that one; L2.01's is the original model).

You do not touch the template (`src/components/lesson/`, `src/styles/`, `src/scripts/`), `verse-ledger.md`, `lesson-moves.json`, `package.json`, or another lesson. If the lesson needs a component that does not exist, say so in your report; do not build it. Do not run `git add`, `git commit`, `npm run build`, the preview server or `qa.mjs`: several writers share this worktree and the orchestrator runs those centrally.

## Read first, in this order

1. `docs/redesign/CONTENT-INVENTORY.md`: the 7-point definition of a **complete lesson** at the end, and the error patterns found in the old lessons (L4.01 is inventoried there).
2. `docs/redesign/LESSON-TEMPLATE.md`: the components and what each is for.
3. `docs/redesign/specs/L3.05-past-tense.md` and `src/content/lessons/level-3/05-past-tense.mdx`: a finished lesson and its spec. Copy their layout and rigor. For a grammar-rule lesson also look at `src/content/lessons/level-2/10-inna-sisters.mdx`.
4. The old lesson: `git show main:src/content/lessons/level-N/NN-<slug>.mdx` (the file in your worktree is the same old text until you replace it).
5. `docs/redesign/verse-ledger.md` and `docs/redesign/PLAN.md` ("Rules for every part" and "Decisions after Part 2").
6. `scripts/lesson-qa/README.md`: the check tools.

## The standard (decided by the owner, do not reopen)

- **Layout:** 3 to 5 big steps, each a run of `Block`s with its own example beside the text. Not many small steps. The first step has `hero`, an overview block and a `Start` card. The last step has practice and a final block with the summary, "what next", links and `Sources`.
- **Content:** keep everything the old lesson taught, unless it is wrong. No word target. Fix the old errors. Drop an item only with a stated reason, in the spec.
- **Practice:** at least as many worked `Exercise`s as the old lesson, plus a `Check` after most blocks.
- **Mistakes:** keep the old lesson's common mistakes, add any new ones you find.
- **Word by word:** each lesson has about four `Parse` panels for verses where the topic allows it. In lesson text say "word by word", not "parse".
- **Terms:** keep the classical terms (with Arabic), each glossed in plain English on first use, in the `Start` terms list.
- **English:** B1 level, short sentences, one idea per block, example first and then the rule, no em dashes. Write to the rules of the `humanizer` skill: no "not X but Y" reveals, no one-line closers, no staged openers, no forced triads, no inflated claims, no filler. Our own plain-English meanings under verses, labelled "Meaning", never called a translation.
- **Verse text:** typed exactly as in the Tanzil text in the Corpus file, diacritics included. Print it with `python -I -X utf8 scripts/lesson-qa/verse.py src/data/morphology/quranic-corpus-morphology-0.4.txt 4:28` (add `-t` for each word's Corpus tags). Never type a verse from memory. A sentence that is not a verse is labelled "Made-up example".
- **Verses are not worn out:** a verse is a main example (a `Sentence` or `Parse` with a verse reference) in at most **two** lessons across the course. Read `verse-ledger.md` before picking. Prefer fresh verses over Al-Fatiha and Al-Ikhlas. Find verses by phrase with `search-verses.py`. Other writers work at the same time as you: write your verse table into the spec early, and do not use a verse that is already in the ledger twice.
- **Parsing source:** al-Jadwal (Maḥmūd Ṣāfī) for every parse, read with `node scripts/lesson-qa/jadwal.mjs 4:28` (add `--book aldur-almasoon` where scholars differ). Read al-Jadwal for every verse you parse, and record the result per verse part: word level, sentence level only, or disagrees. Replace a verse whose parse al-Jadwal disputes. al-Jadwal's text is copyrighted: cite the book, paraphrase, keep its wording out of the lesson.
- **Other sources you may cite:** the Quranic Arabic Corpus grammar pages, *al-Ajurrumiyyah* (the Arabic text, not Perowne's translation), the Madinah course books, Bayyinah. Do not cite Wright, Ryding, Haywood, Nahmad or Perowne. **Never invent a citation.** If you cannot confirm that an approved source says something, teach the rule from verses, say in the lesson that it is a tendency or a teaching summary, and list it under "What is not checked" in the spec. Some Level 4 topics (the figures of speech in L4.17 and L4.18, the numbers in L4.16) have no approved source in this project: be honest about that.
- **Teaching forms (tables of verb or noun forms):** use `Conjugation` or `Tiles`. Check every vowel; where the Quran has the form, check it with `verse.py -t`. The orchestrator re-checks every table by hand, so list each table in the spec.
- **Links:** link to other lessons by the **current** numbers. Levels 1 to 3 are done and use these numbers; Level 4 keeps its numbers (L4.01 to L4.19). Weak verbs are taught at L4.11 to L4.15. L3.05 and L3.04 already give a short "verbs that change shape" step, so L4.11 to L4.15 build on it and do not repeat it. Run `grep -rn "L4.NN" src/content/lessons/level-1 src/content/lessons/level-2 src/content/lessons/level-3` for your lesson number: every place that promises something to this lesson must be kept (a table "What earlier lessons promise this lesson" goes into the spec, as in L3.05).

## The steps, in order

1. **Inventory** the old lesson: every concept, example, analysis, mistake and exercise, and each claim that looks wrong. Done when every section of the old file has a line. (The inventory goes at the top of the spec's checklist.)
2. **Spec** with these parts: what the learner can do at the end; what earlier lessons promise; the verse table (ref, words used, ledger before, used for); how each verse is parsed with al-Jadwal results; the step plan (steps and blocks); exercises (old count and new count); the old checklist ticked against the lesson; errors fixed from the old lesson; what moved to or from another lesson; what is not checked. Done when every verse part has an al-Jadwal result and every old-checklist item has a place in the step plan.
3. **Write** the lesson in the layout of L3.05. Frontmatter: `title`, `kicker` (a short plain-English line), `titleArabic`, `level`, `order`, `template: steps`, `description`, `draft: false`. Keep the old `title`, `titleArabic`, `level`, `order`.
4. **Check** (the only checks you run):
   - `python -I -X utf8 scripts/lesson-qa/check-verses.py src/data/morphology/quranic-corpus-morphology-0.4.txt <lesson.mdx>` must print `mismatch=0`.
   - `node scripts/lesson-qa/mdx-check.mjs <lesson.mdx>` must print `ok`.
   Then read your lesson once as a learner and fix what is clumsy.
5. **Tick** the old checklist against the written lesson in the spec.

## Slips from the first Level 4 batch (do not repeat)

- **`template: steps` in the frontmatter.** L4.01 left it out, so the site served it in the old layout and the ledger skipped it. Check it before you report.
- **No work files in the lessons folder.** A draft such as `02-tamyiz.new.mdx` would be built as a lesson. Draft in place, or in your scratchpad.
- **Empty table header cells.** `| | A | B |` fails the accessibility check. Give the first header a word.
- **Roles.** `Sentence` has no `tamyiz` or `mustathna` role. Use `maful` with a `label` override, as L2.05 and L4.02 do.
- **Tiles and tables with verse fragments** are not read by `check-verses.py`. Copy each fragment from `verse.py` output, not from memory.
- Finished Level 4 lessons you can read for the same kind of topic: `level-4/01-hal-clauses.mdx` and `02-tamyiz.mdx` (a role in the sentence), `04-conditional-particles.mdx` (a list of particles with Corpus counts), `05-exception-particles.mdx`.

## Report back (short, plain, numbers you counted)

- Files written; steps and blocks; verses in `Sentence`/`Parse`; exercises (old and new); `Check`s; `Parse` panels and their card counts.
- The output of both checks.
- Old-lesson errors fixed (count and one line each) and anything dropped, with the reason.
- Every claim you could not confirm against an approved source or al-Jadwal.
- Verses shared with the ledger (a verse you used that is already a main example once).
- Anything you needed and did not have (a component, a source).

Count with commands, not by eye. If you say "N", you counted N. A claim in your report will be checked by the orchestrator.
