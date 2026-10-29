# Level 1: report

Written 2026-10-28. All 11 Level 1 lessons are in the stepped layout, each with a content spec in `docs/redesign/specs/`. Committed on branch `claude/lessons-rollout-da2c8f`, not pushed.

## Checks (all run after the last change)

- `check-verses.py`: mismatch=0 on all 11 lessons (257 verse quotes matched to the Tanzil text, diacritics included; 8 labelled made-up examples skipped).
- `npm run build`: passes.
- `qa.mjs` (axe-core and width at 390 and 1280 px, no-JavaScript render): no problems on all 11. L2.12 re-checked after the table change below: no problems.
- Verse ledger (Levels 1 and 2): 260 verses, 224 used as main examples, none in more than two lessons. 1:1 was in three (L1.03, L1.05, L1.10), so L1.05 now uses 2:163 instead.
- Each lesson was read once by me. Where it makes grammar claims, its al-Jadwal results were spot-checked. Each spec ends with an "Orchestrator review" section.

## The lessons

"Old" is the old lesson's exercise count on `main`.

| Lesson | Steps | Blocks | Quick checks | Exercises (old) | Word-by-word panels |
|---|---|---|---|---|---|
| L1.01 Letters and Short Vowels | 5 | 35 | 19 | 11 (5) | 0 (a reading lesson) |
| L1.02 Reading Marks | 5 | 26 | 13 | 12 (5) | 4 |
| L1.03 Reading the Bismillah | 5 | 25 | 10 | 9 (4) | 1 |
| L1.04 Three Kinds of Word | 5 | 27 | 14 | 10 (7) | 4 |
| L1.05 Roots and Patterns: A First Look | 5 | 23 | 10 | 8 (5) | 3 |
| L1.06 The Definite Article | 5 | 29 | 11 | 9 (4) | 4 |
| L1.07 Gender | 5 | 29 | 12 | 8 (4) | 4 |
| L1.08 Singular, Dual and Plural | 5 | 29 | 12 | 9 (4) | 4 |
| L1.09 Two Kinds of Sentence | 4 | 20 | 9 | 6 (4) | 4 |
| L1.10 Endings That Show the Job | 4 | 22 | 11 | 7 (4) | 4 |
| L1.11 Checkpoint: Al-Ikhlas | 5 | 25 | 12 | 7 (4) | 4 (one per verse) |

Level 1 previews and Level 2 teaches in full: each lesson names the Level 2 lesson for a point, and uses the same terms. L1.09 and L1.10 now teach exactly what L2.01, L2.03 and L2.04 to L2.06 point back to.

## Main fixes from the old lessons

Full lists are in each spec.

- **L1.01:** "five of the six non-joining letters have no dots" (four do not), "6 fewer shapes" (12), ḥāʾ called "emphatic".
- **L1.02:** a made-up word (ٱلْلَهَبِ), إِنَّآ explained as having a hamza, 111:2 put in the future, "tanwīn means indefinite" as a law.
- **L1.03:** the missing alif of ٱسْم blamed on the case, the kasra of ٱللَّهِ put down to the preposition, and an unsourced meaning for Raḥmān and Raḥīm.
- **L1.04:** 103:1 said to have all three word types, ٱلَّذِينَ called a noun "because it has al-", and a verse quoted under the wrong reference (71:28).
- **L1.05:** "500 roots cover 75%" (the Corpus count is 59.2%), a dead link, and invented roots for names.
- **L1.06:** the article written أَلْ instead of ٱلْ, two memory aids that were wrong, a wrong sun/moon count for Al-Fatiha.
- **L1.07:** "ends in ى or ا, so feminine" (مَوْلَىٰ and هُدًى are masculine), 108:1 cited as 108:2.
- **L1.08:** the "dual" example had no dual noun, 55:6 filed as a broken plural, and wrong lesson numbers.
- **L1.09:** "nominal describes what is, verbal what happens" (55:1-2 shows otherwise), and the "implied is".
- **L1.10:** the five errors in `CONTENT-INVENTORY.md`, including the inna claim.
- **L1.11:** the verse 4 spelling (أَحَدٌۢ), wrong word counts, هُوَ given one reading only, and the khabar of يَكُن.

## Template changes (yours to know about)

- `Tiles` has a plain grey type for letters, vowels and marks, so they are no longer coloured as nouns.
- On a phone, lesson tables use slightly smaller type and padding, so the 5- and 6-column letter charts fit without scrolling. Arabic is never broken inside a word.

## Not verified

- No Arabic speaker has read the English meanings, the Arabic parse lines or the letter-sound descriptions.
- Some points come from standard teaching rather than an approved source: tajwīd points (the stop at a verse end, the nūn blending into a lām, the small mīm), letter sounds, the ة said as -h at a stop. The specs list them.
- Corpus gender tags are not reliable on some plain nouns (قَلْب is tagged feminine). The lessons now check gender against an adjective or verb in the verse.
- Quotes from al-Ajurrumiyyah come from the Wikisource text, not a printed edition.
- There was no separate humanizer pass. The writers followed its rules, and I edited what I read.

## Screenshots

In `docs/redesign/screens/l1-rollout/`: `NN-desktop.png` (the first example block at 1280 px) and `NN-phone.png` (a word-by-word panel at 390 px; L1.01 has none, so it shows its first example).

## Questions

1. Start Level 3, with the pronoun lessons (L3.08, L3.09) moved to its start and the verb forms reordered as recorded in `PLAN.md`? Recommended: yes. Moving lessons needs redirects for the old addresses; I would build those as part of Level 3.
2. Push this branch and open the Level 1 and Level 2 PR (or two PRs)? Recommended: one PR per level, as the plan says, once you have looked at the screenshots.
