# Part 2: curriculum review

Date: 2026-10-27. Everything numeric here comes from scripts in `scripts/` run on the Corpus v0.4 file in the repo (77,429 words), so it can be re-run:

- `analyze-corpus-frequency.ts` writes `frequency.json` (counts, top 500 lemmas, grammar topics)
- `build-vocab-outline.ts` writes `vocabulary-outline.md`
- `check-verse-text.ts` writes `verse-text-check.md`

Counts are per word (one word = one place in the text, with prefixes such as wa-, bi-, al- counted as part of their word). A "verb" means a word whose stem is a verb. The weak-verb groups overlap, because a root can be weak in more than one place.

## Verdict on the grammar course

The classical order is sound. The first two levels follow the usual route: alphabet, word types, sentences, the three cases, idafah, inna and kaana. Frequency supports the order of Level 2. I would keep the course and improve it, as you suggested. The data points to five changes.

### 1. Teach the verb forms in order of use, not in numerical order

Level 3 teaches Forms II, III, IV, V, VI, VII and VIII, IX and X, in that order. Words in the Quran:

| Form | Verbs | Where it is taught now |
|---|---|---|
| I | 12,356 (64% of verbs) | L3.02 |
| IV | 3,487 | L3.14 |
| II | 1,300 | L3.12 |
| VIII | 963 | L3.17 (with VII) |
| V | 414 | L3.15 |
| X | 369 | L3.18 (with IX) |
| III | 334 | L3.13 |
| VI | 77 | L3.16 |
| VII | 51 | L3.17 |
| IX | 5 | L3.18 |

Form IV is by far the most common after Form I but comes after III, which is about a tenth as common. Form IX appears five times in the whole Quran and shares a lesson with Form X. Suggestion: **II, IV, VIII, V, X, III, then one short lesson on the rare forms (VI, VII, IX).** Same number of lessons, a better order. (Form IV also matters because *amana*, "to believe", is Form IV, and it is the 18th most common word.)

### 2. Bring hollow and defective verbs forward

Weak verbs are taught in Level 4 (L4.11 to L4.15), after all the verb forms. In the text:

| Kind of verb | Verbs | Share of all verbs |
|---|---|---|
| Hollow (2nd root letter w or y) | 5,162 | 26.7% |
| Defective (3rd root letter w or y) | 3,481 | 18.0% |
| Hamzated | 2,955 | 15.3% |
| Assimilated (1st root letter w or y) | 999 | 5.2% |
| Doubled | 945 | 4.9% |

*qala* "he said" (1,618 words, the 7th most common word) and *kana* "he was" (1,358, 10th) are both hollow verbs. Learners meet them in Level 1 reading and then see them "break" the conjugation rules from L3.03 on. Suggestion: add a short, plain "verbs that change shape" step to L3.03 and L3.04 (recognise hollow and defective verbs by their root), and keep the full lessons in Level 4.

### 3. Teach the most common little words early

The six most common prepositions (*min, fi, 'ala, ila, 'an, hatta*) are 10.0% of all words in the Quran. *ma*, *alladhi*, *man* are 5.8%. *la, lam, lan* are 2.8%. In the current course, prepositions come in L2.07 and negation in L4.10, though *la* is the 5th most common word. These do not need a full grammar lesson each. They are the "Unit 0" of the Vocabulary course (below), taught beside the grammar lessons.

### 4. Consider moving the pronouns earlier

26.0% of all words (20,146) carry an attached pronoun segment, and 11,258 of those are verbs, mostly the subject endings (-uu, -naa and so on). Idafah (L2.08), prepositions with pronouns (L2.07) and verbs with endings all need them, but pronouns are taught in L3.08 and L3.09. Moving the attached pronouns before L2.07 would remove a lot of "we haven't covered that yet" in Level 2 examples.

### 5. Things that look right

Inna and its sisters (L2.10, 2,283 words) and kaana (L2.11) are early enough. Cases (genitive 12,628, accusative 10,331, nominative 8,954 words) are in Level 2. Participles (active 2,956, passive 550), verbal nouns (668), the imperative (1,876), the passive (1,140), subjunctive (1,330) and jussive (1,418) are all in Level 3 and each is common enough to deserve its place. Conditionals (1,048), exceptions (558) and emphasis (1,244) in Level 4 are fine.

Not testable from this data: hal clauses, tamyiz, the maf'ul types, numbers, balagha, and the Level 5 analysis lessons. Their order has to be judged by a teacher, not by counts.

## Quran text check

`check-verse-text.ts` compares the Arabic inside every `<ArabicExample>` block with the verse in the Corpus file, on letters only. It ignores diacritics, marks, hamza carriers and every alef and yaa, because the lessons and Tanzil spell some long vowels differently.

- Examples checked: 679
- Letters match the cited verse: **612**
- Letters do not match: **39**
- Reference could not be read or the verse is not found: 18
- No reference at all: 10

The 39 are a to-check list, not 39 errors. I looked at two. In L3.01 and L4.06 the line "wa-llahu bi-kulli shay'in 'alim" is cited as Al-Baqarah 2:231, but 2:231 has "wa'lamu anna llaha bi-kulli shay'in 'alim", so that example is wrongly cited or altered. In L5.06 and L5.08 "wa'l-layl" is written with a doubled lam, while Tanzil writes it with one lam and a shadda: a spelling difference, not a wrong verse. Several of the 39 are probably of the second kind (Surahs 91 to 93 appear often), so each needs a person's look.

**The finding that matters more than the count:** the repo has no Quran text file, and the verse validator checks only that a reference is formatted correctly and the verse number exists. The Arabic in the lessons was typed in. So 612 of 679 matching is reassuring, but nothing in the project guarantees the rest of the text, and this check does not look at diacritics, which is where a learner can be misled. Suggestion for Part 3 or 5: have each verse example take its text from the Tanzil data by reference, so it cannot drift, and fall back to a typed phrase only for constructed examples, labelled as such.

## Vocabulary course: draft outline

The full list is in `vocabulary-outline.md`. Shape:

- **Unit 0, little words:** 56 function-word lemmas from the top 500 (pronouns left out, they belong to grammar lessons L3.08 and L3.09). Together they are **30.3% of all words in the Quran**. Grouped by class: prepositions, relatives, inna and sisters, negation, this and that, if, time words, place words, question words and so on. Taught beside the grammar lessons that need them.
- **Units 1 to 35, content words:** 418 nouns, verbs, adjectives and names from the top 500, 12 per lesson, in order of frequency. After Unit 0 and all 35 lessons, the learner would know words making up **76.6%** of the text, and about 80.7% with the pronouns.
- Each lesson would show every word in a real verse, in the shared colour code, with a short review at the end.

What the draft does not yet do, and what a person needs to decide: pick the English meaning of each word (the repo's existing verb and noun glosses can seed this), choose the example verse, and group words by root family or theme instead of strict frequency if that teaches better. Strict frequency is the safest start, because it is the one claim we can defend with numbers.

## Decisions needed from you

1. **Reorder the grammar lessons** as in sections 1 to 4 above? (Forms, weak verbs, little words, pronouns.)
2. **The translation** under each verse (see `SOURCES.md`): our own plain-English meanings, Pickthall, or ask for permission for a modern translation.
3. **Verse text:** take it from Tanzil by reference, and credit Tanzil, as part of the new template?
4. **E-books:** are they going to be sold? If yes, a lawyer should look at the Corpus licence first.
5. **Vocabulary course:** is strict frequency order acceptable for the first version?
