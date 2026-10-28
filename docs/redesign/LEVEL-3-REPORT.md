# Level 3: report

Written 2026-10-29. All 22 Level 3 lessons are in the stepped layout, in the new order, each with a content spec in `docs/redesign/specs/`. Committed on branch `claude/lessons-level-3-e27383` (it starts from the Level 1 and 2 branch), not pushed.

## The new order

You approved this map on 2026-10-28. Pronouns come first, and the verb forms follow how often they occur in the Quran.

| New | Lesson | Was |
|---|---|---|
| L3.01, L3.02 | Subject pronouns, attached pronouns | L3.08, L3.09 |
| L3.03 to L3.09 | Roots, Form I, past, present, subjunctive and jussive, commands, passive | L3.01 to L3.07 |
| L3.10, L3.11 | Demonstratives, relative pronouns | same |
| L3.12 | Form II | same |
| L3.13 | Form IV | L3.14 |
| L3.14 | Form VIII | L3.17 (its Form VII part moved to L3.18) |
| L3.15 | Form V | same |
| L3.16 | Form X | L3.18 (its Form IX part moved to L3.18) |
| L3.17 | Form III | L3.13 |
| L3.18 | The rare forms VI, VII and IX (new, from three old lessons) | L3.16 |
| L3.19 to L3.22 | Participles, verbal nouns, place and time, Al-ʿAsr | same |

What a learner sees:

- **Old addresses work.** The 14 old addresses redirect to the new ones (`src/data/lesson-moves.json`). No page on the site links to an old address.
- **Progress carries over.** A lesson marked complete under its old address counts as complete under the new one. I tested this in the browser with a saved old address.
- **A "What changed" note** shows once, on each moved lesson and on the learn page. It shows only to learners who have saved progress. It is the smallest version: one component, one line on the learn page.
- **Links were renumbered.** Levels 1 and 2 had 85 mentions of a Level 3 lesson by number; they now use the new numbers.

## Checks (all run after the last change)

- `check-verses.py`: mismatch=0 on all 22 lessons (709 verse quotes matched to the Tanzil text, diacritics included; 6 labelled made-up examples skipped).
- `npm run build`: passes.
- `qa.mjs` (axe-core and width at 390 and 1280 px, no-JavaScript render): no problems on all 45 lessons of Levels 1 to 3 after the font fix below. In one run of all 45, three Level 3 lessons (L3.07, L3.21, L3.22) failed late in the run and passed when run again on their own. Nothing changed in between, so this looks like `qa.mjs` being unreliable over a long run, not a lesson fault; I could not see what the three failures were.
- Verse ledger (Levels 1 to 3): 582 verses, 478 used as main examples, none in more than two lessons. Three verses went over and were moved: 2:24 (L3.09 now uses 3:131), 5:2 (L3.19 now uses 33:35) and 103:2 (L1.06 now uses 70:19, so the Al-ʿAsr checkpoint can use the whole surah).
- I read each lesson once and checked one to three of its parses again in al-Jadwal. I also checked every form in every conjugation table by hand: 37 tables. Each spec ends with an "Orchestrator review" section saying what I checked and changed.

## The lessons

"Old" is the old lesson's exercise count on `main`. Every lesson has 4 word-by-word panels except the checkpoint (3, one per verse).

| Lesson | Steps | Blocks | Quick checks | Exercises (old) | Conjugation tables |
|---|---|---|---|---|---|
| L3.01 Subject pronouns | 5 | 32 | 14 | 9 (4) | 1 |
| L3.02 Attached pronouns | 5 | 30 | 12 | 15 (4) | 2 |
| L3.03 The root system | 5 | 28 | 11 | 11 (7) | 0 |
| L3.04 Form I | 5 | 30 | 12 | 11 (6) | 0 |
| L3.05 The past tense | 5 | 27 | 12 | 10 (7) | 2 |
| L3.06 The present tense | 5 | 32 | 16 | 10 (7) | 1 |
| L3.07 Subjunctive and jussive | 5 | 34 | 18 | 11 (5) | 1 |
| L3.08 Commands | 5 | 24 | 13 | 11 (4) | 1 |
| L3.09 The passive | 5 | 34 | 16 | 10 (5) | 2 |
| L3.10 This and that | 5 | 29 | 12 | 10 (4) | 2 |
| L3.11 Who, which, what | 5 | 30 | 21 | 9 (4) | 1 |
| L3.12 Form II | 4 | 33 | 22 | 10 (4) | 3 |
| L3.13 Form IV | 5 | 28 | 17 | 12 (4) | 3 |
| L3.14 Form VIII | 5 | 25 | 17 | 12 (5) | 4 |
| L3.15 Form V | 5 | 28 | 13 | 11 (4) | 3 |
| L3.16 Form X | 5 | 29 | 17 | 11 (5) | 3 |
| L3.17 Form III | 5 | 25 | 13 | 12 (4) | 3 |
| L3.18 The rare forms VI, VII, IX | 5 | 36 | 11 | 10 (4) | 3 |
| L3.19 Participles | 5 | 31 | 11 | 12 (4) | 1 |
| L3.20 Verbal nouns | 5 | 29 | 17 | 7 (4) | 0 |
| L3.21 Nouns of place and time | 5 | 22 | 10 | 11 (4) | 0 |
| L3.22 Checkpoint: Al-ʿAsr | 5 | 30 | 13 | 9 (5) | 1 |

Totals: 646 blocks, 318 quick checks, 234 exercises, 87 word-by-word panels, 37 conjugation tables.

## What each lesson keeps, adds and fixes

Every old-checklist item is kept unless listed as moved or dropped. Full lists are in each spec.

- **L3.01 Subject pronouns.** Adds the twelve pronouns in al-Ajurrumiyyah's order, the pronoun as built (mabnī) in the place of a case, and a first look at إِيَّاكَ. Fixes: pronouns "take the nominative" (they show no ending), attached pronouns after inna taught as subject pronouns, 107:1 said to have a pronoun.
- **L3.02 Attached pronouns.** One set of twelve endings in three places (noun, preposition, verb), the protecting nūn, and the doer and object on one verb (ضَرَبْنَاهُ). Fixes: An-Nas said to have attached pronouns, "-nī on verbs and prepositions".
- **L3.03 The root system.** Adds dictionary order, the ten forms in the new lesson order, and hidden root letters. Fixes: 2:231 misquoted, a wrong letter order (ك before ع), "80% of roots" (Corpus: 1,602 of 1,642), مَغْفِرَة called a noun of instance.
- **L3.04 Form I.** Adds the six "doors" (vowel classes) with al-Jadwal's names, measured from the Corpus. Fixes: "remove the أَ" as a test for Form IV (أَكَلَ is Form I), سْتَ always meaning Form X (نَسْتَبِقُ is VIII).
- **L3.05 The past tense.** The full table of 13 forms, and the "verbs that change shape" step (hollow 26.7%, defective 18.0%, recognition only, Level 4 for the rules). Fixes all 8 errors in `CONTENT-INVENTORY.md`, including the sukūn on the middle letter (it is on the last).
- **L3.06 The present tense.** The full table, the five verbs with the nūn, the built -na, and the "verbs that change shape" step (يَقُولُ, يَدْعُو with its hidden -u). Fixes: a visible ḍamma on يَدْعُو (it is hidden), two wrong references (2:62, 31:26).
- **L3.07 Subjunctive and jussive.** al-Ajurrumiyyah's lists of the words that cause naṣb and jazm, لِ and لَا with the jussive, the hidden أَنْ after حَتَّىٰ and لِ. Fixes: unmeasured counts (لَمْ 353, لَن 106 from the Corpus), 106:3 misquoted, "لَنْ is emphatic".
- **L3.08 Commands.** How the command is built (al-Jadwal's three endings), commands of Forms II to X and of weak verbs. Fixes: كُلْ and خُذْ called hollow (they are hamzated), "four surahs begin with قُلْ" (five).
- **L3.09 The passive.** Past and present tables, the passive of Forms II to X, a stand-in that is a whole sentence (2:11, with the other reading named). Fixes: 36:26 misquoted, the -ū of أُوتُوا called hidden.
- **L3.10 This and that.** Near and far tables, the lām of distance and kāf of address (al-Jadwal), the badal after a pointing word. Fixes: ism inna called nominative, "the noun after a pointing word must be definite".
- **L3.11 Who, which, what.** The ṣila and the returning pronoun, مَن and مَا in their other jobs. Fixes: the ٱل of ٱلَّذِي called the article, 65:11 called relative (al-Jadwal: condition), "مَن for people, مَا for things" as a rule.
- **L3.12 to L3.18, the verb forms.** Each has past, present and command tables on a verb that occurs in the Quran, the Corpus tag, meanings shown with verse pairs (not as rules), look-alikes, and a preview of the participle and verbal noun. Fixes across them include example verbs that are not in the Quran (each spec lists them), ٱسْتَبَقَا and ٱسْتَوَىٰ called Form X (they are VIII), Form IV said to rank after Form II (it is far more common), and wrong roots (ٱسْتَعَاذَ, ٱسْتَجَابَ).
- **L3.19 Participles.** Form I and derived patterns, the participle as a noun and as a verb with an object. Fixes: ٱلرَّحْمَٰن, ٱلرَّحِيم and ٱلصَّمَد called participles, ٱلْمُسْتَقِيم called passive.
- **L3.20 Verbal nouns.** Heard (Form I) and regular (II to X) patterns with al-Jadwal's wording, أَنْ with a verb as a verbal noun. Fixes: invented Form III and VI words, مَعْرِفَة given the root ع ل م.
- **L3.21 Nouns of place and time.** The pattern chosen by the present vowel (al-Jadwal), not the past. Fixes: an opening "verse" that is not in the Quran, جَلَسَ called faʿila.
- **L3.22 Checkpoint: Al-ʿAsr.** Every word has a card naming the lesson that taught it, with the new numbers. Fixes: ٱلْعَصْر called a noun of time (al-Jadwal: a plain noun), theological claims with no source, wrong word counts.

## Template changes (yours to know about)

- **Conjugation table** (`src/components/lesson/Conjugation.astro`, in `LESSON-TEMPLATE.md`): who, pronoun, verb, the part that changes, and the sound, with group rows and a highlighted row. Five columns fit a phone.
- **Font fix for the mark ۟.** The site's Quran font draws Tanzil's small round mark (as in كَفَرُوا۟) as a dotted circle. That letter now comes from Amiri Quran inside stepped lessons. This affected every rewritten lesson in Levels 1 to 3, so the Level 1 and 2 screenshots show the circles; the lessons themselves are fixed.
- **Sound spellings.** Word tiles keep the plain spelling of the model lesson (huwa). Conjugation tables mark long vowels (katabā), because the long vowel is what tells the forms apart.

## Not verified

- No Arabic speaker has read the English meanings, the Arabic parse lines or the conjugation tables. I checked every table form myself.
- Some verses agree with al-Jadwal at sentence level only, where the online copy skips the word-level parse. Each spec lists them. Al-ʿAsr is one: its word cards follow al-Jadwal's parse of the same words in other verses, as Al-Kawthar's did in L2.12.
- Meanings of the verb forms are shown with verse pairs and called tendencies, not rules. No approved source states them as rules.
- Several counts come from writers' scripts over the Corpus file (each spec says how). The form totals match `CURRICULUM-REVIEW.md`. I did not re-run each script.
- Quotes from al-Ajurrumiyyah come from the Wikisource text, not a printed edition.
- The writers did not run the humanizer skill. They wrote to its rules, and I edited what I read.

## Screenshots

In `docs/redesign/screens/l3-rollout/`: for each lesson, `NN-desktop.png` (the first block with a conjugation table at 1280 px, or an example block where a lesson has none) and `NN-phone.png` (a word-by-word panel at 390 px).

## Questions

1. **Push and open PRs.** This branch holds Levels 1, 2 and 3. Recommended: open the Level 1 and 2 PR from `claude/lessons-rollout-da2c8f` first, then a Level 3 PR from this branch on top of it, once you have looked at the screenshots.
2. **The font fix site-wide.** Surah pages and old classic lessons still use the font that draws ۟ as a dotted circle. Recommended: the same one-line change in `src/styles/fonts.css`. It is outside my files and you are working on the front page, so I have not made it.
3. **Old lesson numbers in the glossary and the e-book.** Their links are right, but their labels still say the old numbers ("L3.17"). Recommended: fix the labels in a small follow-up. The Level 4 and 5 lessons get fixed when they are rewritten.
4. **Start Level 4**, the same way (one Sonnet writer per lesson, my review, checks, one commit per lesson)? Recommended: yes.
5. **A reviewer who knows Arabic.** Recommended: until there is one, every report says these are unreviewed.
