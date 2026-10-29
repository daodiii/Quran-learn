# Content inventory: five old lessons

Written 2026-10-27. This lists what five lessons on `main` teach, item by item, and the errors found in them. It is for one decision: what a complete lesson must contain. No lesson has been written or changed.

Lessons: L2.01 The Nominal Sentence (the baseline), and one from each other level: L1.10 Case Endings, L3.03 Past Tense, L4.01 Hal, L5.01 Full I'rab Method. L3.03 was picked because the plan names it as the second lesson for the new template.

**How things were checked.**
- *Verse text:* every verse cited below was compared with the Tanzil text inside the repo's Corpus file (`src/data/morphology/quranic-corpus-morphology-0.4.txt`), with diacritics, by eye. "Checked" means that.
- *Word types:* checked against the Corpus tags in the same file.
- *Grammar (i'rab):* the Corpus file has no sentence roles, so grammar points are my own reading of the standard i'rab. Each is marked **certain** (the lesson contradicts itself, or the rule is basic) or **needs a source** (scholars differ, or a reviewer should confirm).

## The shape of an old lesson

All five follow the same pattern, so this is what "keep the same things" covers:

| Part | L2.01 | L1.10 | L3.03 | L4.01 | L5.01 |
|---|---|---|---|---|---|
| Opening verse, goals, link back to earlier lessons | yes | yes | yes | yes | yes |
| Plain-English key of terms | yes | no | yes | yes | yes |
| Explanation with an English comparison | yes | yes | yes | yes | yes |
| Grammar tables | 1 | 1 | 2 | 1 | 1 |
| Verse examples (`ArabicExample`) | 5 | 6 | 9 | 6 | 7 |
| Word-by-word analysis of each example | full i'rab | case only | root, form, person | role, type, owner | nahw, sarf, balagha |
| "The rule" box | yes | yes | yes | yes | yes |
| Common mistakes | 3 | 0 | 5 | 5 | 4 |
| Exercises with worked answers | 7 | 4 | 7 | 4 | 4 |
| Interactive tool | no | no | conjugation engine | no | no |

## L2.01 The Nominal Sentence: old against new

What the old lesson taught, and whether the stepped version on this branch still teaches it.

| # | Item in the old lesson | In the stepped L2.01? |
|---|---|---|
| 1 | Definition: a sentence that starts with a noun | Yes |
| 2 | No word for "is" in the present tense | Yes |
| 3 | Two parts: mubtadaʾ (topic) and khabar (news), with literal meanings of the terms | Yes, shorter |
| 4 | Both parts are nominative (-u, -un) | Yes |
| 5 | Pronouns show no ending but can be the mubtadaʾ | Yes |
| 6 | Kind of khabar 1: a single word | Yes |
| 7 | Kind of khabar 2: a phrase with a preposition (li-llāhi) | Yes, as "the news comes first" |
| 8 | Kind of khabar 3: a whole sentence (Allāhu yaʿlamu) | **No** |
| 9 | One mubtadaʾ with two khabars (khabar thānin) | Partly (2:218 shown, the term not named) |
| 10 | Fronted khabar, delayed mubtadaʾ (khabar muqaddam, mubtadaʾ muʾakhkhar) with 109:6, both halves | One half, the terms not named |
| 11 | Definite mubtadaʾ with indefinite khabar is the normal pattern, and how it differs from noun plus adjective | **No** |
| 12 | The khabar agrees with the mubtadaʾ in gender (sky/sea exercise) | **No** |
| 13 | A first look at kāna: its khabar becomes accusative (112:4) | **No** |
| 14 | A word ending in alif maqṣūra (hudan) hides its case ending | **No** |
| 15 | Idafah inside a khabar (nūru s-samāwāti) | Shown, not explained |
| 16 | Full i'rab of 4 verses: every word's role, case marker and reason | **No** (role colours only) |
| 17 | Root and pattern of Allāh and aṣ-ṣamad | **No** |
| 18 | Mistake: word order is not free; changing it changes emphasis | **No** |
| 19 | Mistake: do not add a verb for "is" | Yes, as a note |
| 20 | Mistake: mubtadaʾ is not the fāʿil | Yes, as a note |
| 21 | 7 exercises with worked answers, including 2 full i'rab exercises and one "build a sentence" | **No** (3 multiple-choice checks) |
| 22 | Why this matters for prayer and Quran reading (Allāhu akbar) | **No** |
| 23 | Links to related lessons, case chart and glossary | **No** |

Count: of 23 items, the stepped lesson keeps 7 in full, 5 in part, and drops 11.

## Errors found in the old lessons

These were in the lessons learners use now. A rewrite should keep the items above but not these.

### L2.01 The Nominal Sentence
1. Exercise 2 quotes "ٱلْقُرْآنُ هُدًى" as Al-Baqarah 2:2. The verse reads ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ. The phrase is made up. *Checked.*
2. Exercise 6 quotes "وَٱلْأَرْضُ قَبْضَتُهُۥ" as 39:67. The verse has وَٱلْأَرْضُ جَمِيعًا قَبْضَتُهُۥ, so a word is missing without a mark. *Checked.*
3. Example 3 (112:4): the Arabic leaves out the opening وَ, but the transliteration has it. *Checked.* Its i'rab calls both لَّهُۥ and كُفُوًا the khabar, and it sits under the heading "nominal sentence with negation" although it is a kāna sentence. *Certain* (it contradicts itself).
4. Example 4 (109:6) explains the word as دِينِي. The verse has دِينِ. *Checked.*
5. Example 1 (112:1) presents one i'rab as fact: هُوَ mubtadaʾ, ٱللَّهُ khabar, أَحَدٌ second khabar. Many i'rab books read هُوَ as the pronoun of the matter (ḍamīr al-shaʾn), with ٱللَّهُ أَحَدٌ as a sentence that is its khabar. *Needs a source.*
6. "The khabar is nominative to match the subject." In the tradition the khabar is nominative because of the mubtadaʾ, not by agreement. *Needs a source* for the wording.
7. "The Quran begins with nominal sentences: ٱللَّهُ ٱلصَّمَدُ, ذَٰلِكَ ٱلْكِتَابُ". Neither is where the Quran begins. *Certain.*
8. Three made-up sentences (ٱلْعِلْمُ نُورٌ, ٱلسَّمَاءُ عَالِيَةٌ, ٱلْبَحْرُ عَمِيقٌ) are not labelled as made up.

### L1.10 Case Endings
1. Exercise 4 says an accusative ٱلصَّمَدَ "might signal a particle like إِنَّ". After inna the mubtadaʾ becomes accusative and the khabar stays nominative, so inna would not make the second word accusative. *Certain.*
2. "Every Arabic noun takes one of three case endings": this ignores words that never change (huwa, which the lesson itself shows). *Certain.*
3. Four of its six examples are Al-Ikhlas, two of them the same verse. The Bismillah example says "from earlier in the lesson" but it was not used earlier.
4. The example قَرَأَ ٱلطَّالِبُ ٱلْكِتَابَ is made up and not labelled.
5. It says "Level 1 complete", but L1.11 follows it.

### L3.03 Past Tense
1. It says the first and second person endings put a sukūn on the **middle** root letter (repeated in the rule box and in "common mistakes"). The sukūn falls on the **last** root letter: in كَتَبْتُ it is on the ب. *Certain.* This is the lesson's central rule.
2. It calls the -at ending (كَتَبَتْ) a tāʾ marbūṭa. It is an ordinary tāʾ (tāʾ al-taʾnīth al-sākina). *Certain.*
3. It promises 14 forms, then lists 13 and calls them "13 suffixes". It says all first and second person endings begin with ت, then lists ـْنَا among them. *Certain.*
4. It says the shadda in ءَامَنَّا "comes from the pattern, not the conjugation". It comes from the root's last letter ن meeting the ending ـنَا. *Certain.*
5. The "treasure hunt" answer gives كَذَّبُوا in Al-Baqarah 2:10. That verse has يَكْذِبُونَ, not كَذَّبُوا. *Checked.*
6. Three examples (108:2, 108:3, 58:1) contain no past tense verb of the kind being taught, and the text says so before moving on.
7. It teaches regular endings with hollow verbs (قَالُوا, كَانَتْ, أَطَعْنَا) without saying they change shape. The curriculum review asks for exactly this step here.
8. Two lesson links have the wrong number or title ("L3.10 Weak Verbs" points to L4.11, "L4.11 Verbal Noun" points to L3.20).

### L4.01 Hal
1. In 20 places the Arabic word was replaced by bold transliteration (for example `****jāʾa** مُحَمَّدٌ **ḍāḥikan****`), so most made-up examples show a mix of Latin and Arabic. *Checked:* this file is the only lesson on `main` with this break.
2. Example 2 (12:19) calls قَالَ يَٰبُشْرَىٰ a hal. It starts a new sentence. *Certain.*
3. Example 3 (12:63) calls قَالُوا a hal. It is the answer of فَلَمَّا ("when they returned, they said"). *Certain.*
4. Its "semi-sentence" example جَلَسَ ٱلطَّالِبُ فِي ٱلْفَصْلِ is a place phrase tied to the verb, the very case the lesson later says is not hal. *Certain* (it contradicts itself).
5. "Hal must be a temporary state." Classical grammar also has fixed hal, as in وَخُلِقَ ٱلْإِنسَٰنُ ضَعِيفًا (4:28). *Certain*; verse *checked.*
6. It gives the pattern of يَبْكُونَ as يَفْعُلُونَ. The root is b-k-y, and the yāʾ drops: يَفْعُونَ. *Needs a source* for the exact wording.
7. Exercise 3 says the hal in 28:15 describes "him" (Musa), the body text says it describes the city's people.

### L5.01 Full I'rab Method
1. It calls the Bismillah "a nominal sentence with ellipsis", then rebuilds it with a verb, أَبْدَأُ, which makes it verbal. Grammarians differ here (an omitted verb, or an omitted noun such as ٱبْتِدَائِي). The lesson mixes the two views. *Certain* (it contradicts itself); the two views *need a source.*
2. It says رَبِّ is a badal and not an adjective "because an adjective cannot begin an idafah". An adjective can be the first word of an idafah, and many i'rab books read رَبِّ as an adjective (naʿt) of ٱللَّهِ. L2.01 says "badal or ṣifah". *Certain* about the reason; the reading *needs a source.*
3. It says ٱلْعَٰلَمِينَ is an active participle (fāʿil) meaning "the knowing ones". The Corpus tags it as a plain noun (lemma ʿālamīn), and ʿālam is not a participle. *Checked.*
4. Exercise 1 says أَحَدٌ could be an adjective of ٱللَّهُ. An indefinite word cannot describe a definite one. *Certain.*
5. The "5-step method" is given Arabic names (التَّقْطِيعُ and so on) and called the method "classical scholars developed". It cites no source, and I know of none naming these five steps. *Needs a source.*
6. All examples are Al-Fatiha 1:1, 1:2 and Al-Ikhlas 112:1. A lesson about full i'rab never fully parses a verb with an object.
7. Four lesson links have the wrong number or title.

## What this shows

- The old lessons are long because they explain, analyse and practise, not because of filler. The stepped L2.01 lost most of the analysis and practice, which is where learning happens.
- The old lessons are also not reliable enough to copy. All five had errors; three (L3.03, L4.01, L5.01) have errors in their central rule or main examples. Some are grammar errors no checker in the repo can catch.
- Several errors come from one lesson disagreeing with another (the parse of رَبِّ, of أَحَدٌ). A complete lesson needs one agreed i'rab per verse, with its source, used the same way everywhere.

## Proposed definition of a complete lesson (for the owner to accept or change)

1. **Coverage.** It teaches every item on the old lesson's checklist, unless the item is wrong. Anything dropped or moved is listed and shown to the owner. No word target.
2. **Correctness.** Every verse is quoted exactly from the Tanzil text, with the part used marked. Made-up sentences are labelled. Each i'rab follows a named source; where scholars differ, the lesson gives the common reading and names the other in a "Good to know" note.
3. **Analysis.** Each main verse example gets full word-by-word i'rab: role, case, the mark that shows it, and the reason. In the Stage template this is a run of steps, one word or phrase at a time. Root and pattern appear where the lesson needs them.
4. **Mistakes.** The old lesson's common mistakes are kept, plus any new ones found.
5. **Practice.** At least as many exercises as the old lesson, with worked answers ("try it, then see the answer"), plus quick checks after steps and the 5-question end check.
6. **Terms.** Classical terms are kept (mubtadaʾ, khabar muqaddam, ḍamīr al-shaʾn and so on), each glossed in plain English on first use.
7. **Before it is called done.** The old checklist is ticked item by item against the new lesson and shown to the owner, and every verse is checked against the Tanzil text.
