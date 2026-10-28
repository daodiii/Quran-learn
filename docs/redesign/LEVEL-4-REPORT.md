# Level 4: report

Written 2026-10-28. All 19 Level 4 lessons are in the stepped layout, each with a content spec in `docs/redesign/specs/`. Committed on branch `claude/lessons-level-4` (it starts from the Level 3 branch, which starts from the Level 1 and 2 branch), not pushed. The method is the one used for Levels 1 to 3: one Sonnet writer per lesson, the writer brief in `docs/redesign/WRITER-BRIEF.md`, my review of each lesson, then the checks.

## What a learner sees

- No lesson moved. Level 4 keeps its numbers (L4.01 to L4.19), so no redirect or "What changed" note was needed.
- Every lesson has 5 steps, each a run of blocks with the example beside the text, a quick check after most blocks, worked exercises and a "word by word" panel for several verses.
- Everything the old lessons taught is kept, except what was wrong. Each spec has the old checklist ticked item by item, and a list of the errors found in the old lesson.

## Checks (run on the final build)

- `check-verses.py`: `mismatch=0` on all 19 lessons (each spec lists how many verse quotes it matched). Verses are the Tanzil text, diacritics included.
- `mdx-check.mjs`: `ok` on all 19. `template: steps` is in every lesson. No em dashes.
- `npm run build`: passes.
- `qa.mjs` (axe-core, width at 390 and 1280 px, no-JavaScript render): no problems on all 19 lessons. This needed reruns, see "What was flaky".
- `npm run test:site`: 29 tests pass.
- Links: 226 internal links in the Level 4 lessons, none broken (checked against the built pages).
- Verse ledger (Levels 1 to 4): 888 verses, 735 used as main examples, none in more than two lessons.
- I checked by hand every conjugation table and number table that a script cannot read: 13-form tables of قَالَ (long and short stem), دَعَا, رَمَىٰ, نَسِيَ, وَجَدَ, أَخَذَ, لَيْسَ, and the present tenses of يَقُولُ, يَدْعُو, يَجِدُ, يَأْخُذُ, plus the command, mood and passive tables and the number tables of L4.16. Every form was correct.
- I re-read at least two parses per lesson in al-Jadwal. All agreed with the lessons.

## What was found and fixed during review

- L4.01 had no `template: steps` line. The site served it in the old layout and the ledger skipped it. Fixed.
- L4.02 had an empty table header cell (axe finding). Fixed.
- L4.08 had a bold phrase that ran off a phone screen. The template does not let bold text wrap. I shortened the phrase and added the rule to the writer brief. I did not change the shared stylesheet.
- L4.18 had two long word groups that did not fit at 390 px. Split into one-word groups.
- L4.19 had ten word-by-word cards with no "why" line. This broke the build (the check scripts do not catch it). Fixed.
- L4.11 and L4.15 gave the hamzated verb count as 15.3% and 15.2%. The difference is four forms of هَاتُوا۟, which the Corpus tags as hamzated although the word has no hamza. L4.15 now states both figures.
- 93:5 would have been a main example in three lessons (L1.04, L3.06, L4.19). I moved L3.06's panel to 26:49 (فَلَسَوْفَ تَعْلَمُونَ), which shows the same سَوْفَ. This changes a Level 3 lesson and its spec, as the Level 3 rollout did for 103:2.

## What was flaky

`qa.mjs` is unreliable over a long run, as the Level 3 report said. In this level it failed with a browser timeout at page load on L4.08 once and on L4.18 once, both during long sweeps. It also reported width findings at 1280 px on L4.18 once, which a direct probe could not reproduce. Every one of these passed on rerun with nothing changed, and none showed a content problem. (L4.18 also had a real width problem at 390 px earlier. That one repeated on every run and I fixed it.) In one full sweep L4.07 reported 2 problems, but my log kept only its last lines, so I do not know what they were. L4.07 then passed on two direct runs. Treat `qa.mjs` results as "no problem found", not as proof.

## The lessons

| Lesson | Title | Steps | Blocks | Word-by-word panels | Exercises | Checks |
|---|---|---|---|---|---|---|
| L4.01 | Hal clauses | 5 | 26 | 4 | 12 | 13 |
| L4.02 | Tamyiz | 5 | 29 | 4 | 10 | 19 |
| L4.03 | Conditional sentences | 5 | 31 | 4 | 10 | 21 |
| L4.04 | Conditional particles | 5 | 27 | 4 | 10 | 14 |
| L4.05 | Exception particles | 5 | 30 | 4 | 10 | 17 |
| L4.06 | Emphasis and affirmation | 5 | 29 | 4 | 10 | 20 |
| L4.07 | The absolute object | 5 | 26 | 4 | 11 | 18 |
| L4.08 | The object of purpose | 5 | 24 | 4 | 10 | 16 |
| L4.09 | The object of accompaniment | 5 | 29 | 4 | 9 | 17 |
| L4.10 | Negation particles | 5 | 31 | 4 | 10 | 18 |
| L4.11 | Weak verbs, the map | 5 | 27 | 4 | 11 | 15 |
| L4.12 | Hollow verbs | 5 | 31 | 4 | 12 | 18 |
| L4.13 | Defective verbs | 5 | 36 | 4 | 13 | 28 |
| L4.14 | Assimilated verbs | 5 | 27 | 4 | 11 | 15 |
| L4.15 | Hamzated verbs | 5 | 32 | 4 | 11 | 20 |
| L4.16 | Numbers and counting | 5 | 34 | 4 | 10 | 26 |
| L4.17 | Introduction to balagha | 5 | 27 | 4 | 11 | 19 |
| L4.18 | Figures of speech | 5 | 33 | 4 | 10 | 28 |
| L4.19 | Checkpoint: Ad-Duha | 5 | 31 | 11 | 8 | 20 |

Counts are from the lesson files (grep for the components). L4.19 has one panel per verse of Surah Ad-Duha.

Examples of old errors the writers found and fixed (each spec lists them all, with the writer's own count): a verse quoted that is not in the cited verse (L4.04, L4.10, L4.15, L4.18); a verse text that differs from Tanzil (about half the quotes in the old L4.04, L4.16 and L4.18); wrong readings of what al-Jadwal says (a ḥāl, tamyiz or object where al-Jadwal reads something else: L4.01, L4.02, L4.07, L4.08, L4.19); rules stated as absolute that the Quran breaks (L4.03, L4.04, L4.06, L4.10, L4.12, L4.16); claims about what a verse "achieves" with no source (L4.05, L4.17, L4.18, L4.19).

## Not verified

- **No Arabic speaker has read** the English meanings, the Arabic parse lines or the tables. This is true of Levels 1 to 3 too.
- **L4.16, L4.17, L4.18 have no approved book behind them.** They cite al-Jadwal (its notes on the forms and its rhetoric paragraph for each verse), the Corpus and the Quran. Definitions of the number rules and of each figure are teaching summaries, and the lessons say so.
- **L4.11 to L4.15 (weak verbs):** no approved book in the project states the word-shape rules. Each rule is marked a teaching summary where it is one. Corpus counts come from scripts over the Corpus file, whose tags have errors (each lesson names the ones found).
- **Sentence level only in al-Jadwal.** Where the online copy has gaps, the lesson gives the standard formula for the word. Each spec lists which lines were completed this way.
- **Quotes from al-Ajurrumiyyah** come from the Wikisource text, with vowel marks added by Quran Learn, not from a printed edition.
- **The writers did not run the humanizer skill.** They wrote to its rules and I scanned for the usual patterns. I read samples of the lessons and every table, not every word of the roughly 85,000.
- Each spec's "What is not checked" section lists the rest.

## Screenshots

In `docs/redesign/screens/l4-rollout/`: for each lesson, `NN-desktop.png` (the first block with a conjugation table at 1280 px, or the second step where there is none) and `NN-phone.png` (a word-by-word panel at 390 px). The cookie banner was declined for the shots.

## Notes for Level 5 and for later

- Old Level 5 lessons link to Level 4: L5.03 (line 359) sends "gradation" to L4.18, which does not teach it; L5.14 (lines 40 and 471) says "five essential rhetorical figures", while L4.17 and L4.18 promise no number. These wait for the Level 5 rewrite.
- `Conjugation` has a fixed first column header "Who". It fits the number tables of L4.16 badly. A table component with free headers would be cleaner.
- `Sentence` has no `tamyiz`, `mustathna` or `mafʿūl maʿah` role. The lessons use `maful` with a `label`, as Level 2 did.
- The stepped template lets no bold text wrap inside a paragraph or list item. Level 5 writers should keep bold short (the brief says so).

## Questions

1. **Push and open PRs.** This branch holds Levels 1 to 4. Recommended: open the Level 4 PR from `claude/lessons-level-4` after the Level 1 and 2 PR (#23) and the Level 3 PR (#24), once you have looked at the screenshots.
2. **A reviewer who knows Arabic.** Recommended: yes, before any of this is called final. Start with L4.16 to L4.18, then L4.11 to L4.15.
3. **A ranked list of unbacked claims for the reviewer**, for Levels 1 to 4, built from the specs. Recommended: yes.
4. **Start Level 5**, the same way (one Sonnet writer per lesson, my review, checks, one commit per lesson)? Recommended: yes, after question 2 is settled or in parallel with it.
