# Level 2: report

Written 2026-10-27. All 12 Level 2 lessons are now in the stepped layout of L2.01, each with a content spec in `docs/redesign/specs/`. Committed on branch `claude/lessons-rollout-da2c8f`, not pushed.

## Checks (all run after the last change)

- `check-verses.py`: mismatch=0 on all 12 lessons (417 verse quotes matched to the Tanzil text, diacritics included; 23 labelled made-up examples skipped).
- `npm run build`: passes.
- `qa.mjs` (axe-core and width at 390 and 1280 px, no-JavaScript render): no problems on all 12.
- Verse ledger: 170 verses, 148 used as main examples, none in more than two lessons.
- Each lesson was read once by me, and 2 to 5 of its parses were checked again in al-Jadwal (`jadwal.mjs`). The specs end with an "Orchestrator review" section saying what I checked and changed.

## The lessons

Every lesson has 5 steps. "Old" is the old lesson's count on `main`.

| Lesson | Blocks | Quick checks | Exercises (old) | Word-by-word panels |
|---|---|---|---|---|
| L2.02 Mubtadaʾ and khabar, further | 35 | 25 | 12 (4) | 4 |
| L2.03 The verbal sentence | 31 | 13 | 8 (4) | 4 |
| L2.04 The nominative | 27 | 10 | 10 (4) | 4 |
| L2.05 The accusative | 32 | 20 | 9 (4) | 4 |
| L2.06 The genitive | 28 | 9 | 8 (4) | 4 |
| L2.07 Prepositions | 34 | 10 | 10 (4) | 4 |
| L2.08 The idafah | 25 | 11 | 9 (4) | 4 |
| L2.09 Adjectives | 32 | 13 | 8 (4) | 4 |
| L2.10 Inna and her sisters | 28 | 14 | 9 (4) | 4 |
| L2.11 Kāna and her sisters | 32 | 9 | 11 (4) | 4 |
| L2.12 Checkpoint: Al-Kawthar | 28 | 14 | 8 (4) | 3 (one per verse) |

## What each lesson keeps, adds and fixes

Every old-checklist item is kept unless listed as moved or dropped. Full lists are in each spec.

- **L2.02.** Builds on L2.01 instead of repeating it: the "What moved" section of its spec lists the old items now taught in L2.01. Adds agreement in number (dual, plurals of people and of things), when an indefinite mubtadaʾ is allowed, the definite khabar, and the link word in a sentence khabar. Fixes: the old rule that the khabar must match in definiteness, and 2:3 read as a mubtadaʾ (al-Jadwal: an adjective). Moved: the 103:1-3 examples, to L2.10 and later lessons.
- **L2.03.** Adds written, attached and hidden doers, two objects, and the object put first. Fixes: endings like -tu called "signals" (they are the doer), "the doer comes right after the verb", and a nominal sentence called "present tense". Moved: the ḥāl of 110:2 to L4.01; the Al-Kawthar examples to L2.12.
- **L2.04.** Adds the nominative of ism kāna, khabar inna and the stand-in for the doer, the five nouns, the hidden ḍamma, and the dropped nūn. Fixes: "exactly four nominative roles", and a ḍamma called hidden that is written.
- **L2.05.** Adds the dual, plurals, five nouns and hidden fatḥa as accusative marks, and time and place words. Fixes: a time word called a ḥāl, and كَانَ glossed "is". Dropped: one meaning of naṣb with no approved source.
- **L2.06.** Adds the third cause (a following word), the diptote's -a, and the hidden kasra. Fixes: "exactly two causes", and "genitive for two reasons".
- **L2.07.** Adds what a phrase is tied to, pronouns after prepositions (bihim, ʿalayhim), the oath letters, and the extra bi-. Fixes: five misquoted or made-up verse phrases, and a wrong sun-letter rule.
- **L2.08.** Adds the nūn dropping, chains, and al-Ajurrumiyyah's two kinds of idafah. Fixes: "the first word never has al-" (22:35), and a made-up phrase cited as a verse.
- **L2.09.** Adds plurals of things, several adjectives, the badal, and adjective or khabar. Fixes: "both have al-, so it is an adjective".
- **L2.10.** Adds the lām of emphasis on the khabar or the ism, the khabar put first, and innamā and light lākin. Fixes: four unlabelled made-up lines, and a wrong reading of 103:3. Dropped: a "1,500 times" count nobody measured.
- **L2.11.** Adds the sisters with a verse each, the hidden ism, and kāna tāmma. Fixes: 4:33 and 22:55 misquoted, and مَا دَامَتِ in 11:107 given as a sister (al-Jadwal: tāmma). Moved: the end-of-level summary, to L2.12.
- **L2.12.** Every word of Al-Kawthar has a card, with the lesson that taught it. Fixes: "two accusatives" in verse 1 (three), and هُوَ in 108:3 given one reading only (al-Jadwal gives two; al-Durr al-Maṣūn rejects a third).

## Template changes (yours to know about)

- New role bars for `Sentence`: verb, doer, stand-in doer, object, idafah, adjective, inna, ḥāl, time and place word, joined word, preposition. Listed in `LESSON-TEMPLATE.md`.
- Tables that are wider than a phone can now be scrolled with the keyboard. This is the site-wide table wrapper, so it also changes classic lessons and surah pages.
- `jadwal.mjs` printed only the verse heading for long verses; fixed. New: `mdx-check.mjs` and `ledger.py`.

## Not verified

- No Arabic speaker has read the English meanings or the Arabic parse lines (question 2 below).
- Some verses agree with al-Jadwal at sentence level only, where the online copy skips the word-level parse. Each spec lists them. Al-Kawthar is one: its word cards follow al-Jadwal's parse of the same patterns in other verses.
- Quotes from al-Ajurrumiyyah come from the Wikisource text, not a printed edition.
- A few rules are taught from verses rather than from a named page (for example the hum/him spelling in L2.07, and verbs that never take a khabar in the Quran, in L2.11). The specs say which.
- The writers did not run the humanizer skill file. They wrote to its rules, and I edited what I read, but there was no separate pass.
- Links to Level 3 and 4 lessons use today's numbers. If the lesson order changes (question 1), they need updating.

## Screenshots

In `docs/redesign/screens/l2-rollout/`: for each lesson, `NN-desktop.png` (the first example block at 1280 px) and `NN-phone.png` (a word-by-word panel at 390 px).

## Questions

1. **Lesson order** (decision 1 in `PLAN.md`): move the verb forms, weak verbs and pronouns earlier before I start Level 3? Recommended: yes, decided before Level 3. Level 1 can be written in its current order.
2. **A reviewer who knows Arabic** for the meanings and parse lines. Recommended: until there is one, every report says these are unreviewed.
3. **Start Level 1 now**, in the same way (one Sonnet writer per lesson, my review, checks, commit per lesson)? Recommended: yes.
