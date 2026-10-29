# Level 5: notes for writers

Written 2026-10-28 by the orchestrator. Read after `WRITER-BRIEF.md`. Level 5 is 17 lessons that apply Levels 1 to 4 to whole surahs, passages and patterns. L4.19 (`level-4/19-checkpoint-ad-duha.mdx` and `specs/L4.19-checkpoint-ad-duha.md`) is the closest model: a whole surah, one `Parse` panel per verse. `level-3/22-checkpoint-al-asr.mdx` is the short version.

## What Level 5 lessons are

- They teach reading a long text, not a new rule. A new rule is allowed only where the old lesson taught one that no earlier lesson has (for example a figure of speech, a type of dialogue). Where an earlier lesson already teaches a point, link to it and use it; do not teach it again.
- Every word-by-word panel follows al-Jadwal. Where al-Jadwal is silent on a word (many pages give sentence places only), say the standard formula, and list those lines in the spec under "Checked against al-Jadwal".
- Step plan for a whole-surah lesson: step 1 the text and the plan (hero, overview, see the whole text, the shape); the middle steps are the verses in groups; the last step is mistakes, practice and the summary with `Sources`. Use as many `Parse` panels as the text has verses (long verses may be split into two `Sentence`s plus one `Parse`).

## Sources, and what no source covers

- Parsing: al-Jadwal (Maḥmūd Ṣāfī), with al-Durr al-Maṣūn where scholars differ. Read every verse you use with `node scripts/lesson-qa/jadwal.mjs <ref>` (some pages cover several verses).
- Approved grammar sources: the Quranic Arabic Corpus, al-Ajurrumiyyah (Arabic text), the Madinah books and Bayyinah. The last two are not in this project: do not cite them as pages you read.
- **Balāgha (figures of speech, style).** Teach a figure only where al-Jadwal names it in the "البلاغة" paragraph of that verse. Give al-Jadwal's name and your plain-English description of what the figure is. Do not say what a verse "achieves" or "reveals" unless al-Jadwal says it. L4.17 and L4.18 are the Quran Learn lessons that define the figures; link to them and use their definitions.
- **Teaching summaries.** Anything the lesson says that no approved source states (a pattern across surahs, a count you made, a classification such as "types of dialogue", a review table in L5.15 or L5.16) is a teaching summary: say so in the lesson, in one plain sentence, and list it under "What is not checked" in the spec.
- Counts come from scripts over the Corpus file. The Corpus tags have errors; name the ones you hit.

## The ledger and verses

`verse-ledger.md` counts a verse as a main example when it is in a `Sentence` or `Parse` with a reference. A verse may be a main example in at most two lessons.

**Whole-surah exception (approved by the owner, 2026-10-28; L5.02 only).** L5.02 (Al-Fatiha) may be a third main use of 1:1, 1:5 and 1:6. No other Level 5 lesson may use verses of surah 1 as a main example; use them in `Exercise` questions only.

**Territories.** These verses belong to the lesson named; every other Level 5 lesson uses them in `Exercise` questions or quotes only (a `blockquote.lx-quote` or text), not in `Sentence` or `Parse`:

| Verses | Belongs to |
|---|---|
| 1:1 to 1:7 | L5.02 |
| 2:255 | L5.03 |
| 112:1 to 112:4 | L5.04 |
| 113:1 to 113:5, 114:1 to 114:6 | L5.05 |
| 31:12 to 31:19 | L5.17 |
| 91:1 to 91:8, 92:1 to 92:4, 93:1 to 93:3, 95:1 to 95:3, 100:1 to 100:5, 51:1 to 51:7, 85:1, 86:1, 89:1 to 89:4, 103:1 | L5.08 |
| 14:35 to 14:41, 20:25 to 20:28, 2:127 to 2:128, 2:201, 2:286, 3:8, 7:23, 71:26 | L5.07 |
| 26:69 to 26:82, 37:83 to 37:113 | L5.09 |
| 20:9 to 20:50, 28:7 to 28:12 (except 20:25 to 20:28) | L5.10 |
| 55:1 to 55:16, 90:8 to 90:10, 77:15, 54:17 | L5.12 |
| 105:1, 94:1, 95:8, 55:60, 78:6 (2 questions each lesson), 52:35, 2:28, 17:68 | L5.13 |
| 109:1 to 109:6, 35:28, 2:142, 2:284, 3:122, 2:10 | L5.14 |

L5.01, L5.06, L5.11, L5.15 and L5.16 pick from verses not in this table. Every lesson also reads `verse-ledger.md` and `ls docs/redesign/specs/L5.*` before picking, and reads other Level 5 specs' verse tables: other writers work at the same time. If a verse you need is already a main example twice, replace it.

Reviews (L5.15, L5.16) and L5.01 may use verses from earlier lessons as `Exercise` material, which does not count toward the two.

## Promises to Level 5 from earlier lessons

`grep -rn "L5\\.\\|Level 5" src/content/lessons/level-[1-4]` (done 2026-10-28). Keep each one:

| From | Promise | Kept by |
|---|---|---|
| L1.10 (Note on بِسْمِ) | L5.01 returns to the two views on the word بِسْمِ is tied to (a left-out noun "my beginning", or a left-out verb "I begin") | L5.01 (explain the method point: a phrase tied to a left-out word, and that books differ). The parse itself of 1:1 is in L5.02. L5.01 shows the Bismillah in a quote block, not a `Parse` |
| L1.11 | Level 5 comes back to Al-Ikhlas for its style (L5.04) | L5.04 |
| L2.01 | L5.14 looks at word order and weight (109:6, لَكُمْ دِينُكُمْ وَلِيَ دِينِ) | L5.14 |
| L4.10 | L5.13 teaches questions, which often come with لَمْ, as in أَلَمْ | L5.13 |
| L4.13, L4.14 | L5.16 pulls the word shapes together and "brings all the changes of the verb together" | L5.16 |
| L4.17, L4.18 | Level 5 reads whole passages; applies the figures to whole surahs | L5.02 to L5.05, L5.12 to L5.14 |
| L4.19 | Start Level 5 with L5.01 (Full I'rab analysis) | L5.01 |

L5.01 is the method lesson for the whole level: other Level 5 lessons link to it by number.

## What each lesson must also do

- **L5.01 Full i'rab method.** Fix the errors in `CONTENT-INVENTORY.md` (the Bismillah mixing two views; رَبِّ called a badal for a wrong reason; ٱلْعَٰلَمِينَ called an active participle; the unsourced "5-step method" with Arabic names; examples only from 1:1, 1:2, 112:1; wrong lesson links). Teach a method the lesson can defend: say plainly that the steps are Quran Learn's teaching order (a teaching summary), built from tools of Levels 1 to 4, not a classical method with a source. Use verses from outside surahs 1, 112 to 114 for the worked analysis, including a verb with an object and a verb with a preposition phrase.
- **L5.02 to L5.05 (surahs).** One `Parse` per verse. Say where each point was taught (L-number links). Do not claim a grammar choice "reveals" theology.
- **L5.15 and L5.16 (reviews of Levels 1 to 4).** Read the finished lessons they cite and use those lessons' numbers, rules and claims, not the old text. Each claim in the review table names the lesson that teaches it. If a finished lesson calls a rule a teaching summary, the review says so too. List in the spec every lesson you read.
- **L5.17 (cold read).** The learner does the work first. Do not explain the passage before the learner has tried it. Shape for each verse (or short group): a block whose `Stage` holds only the verse as a plain `blockquote.lx-quote` (no `Sentence` tiles, no role bars, nothing that gives the analysis away) and a task in the text ("find the verb, the doer, the object"); an `Exercise` with the model answer behind "Show the answer"; then a later block, "Check your work", with the `Parse` panel. Copy each quoted verse from `verse.py` output (the checker does not read quote blocks). Be honest about what was seen before: 31:16 is a main example in L1.10 and 31:17 in L4.13, so name them as verses with a word met earlier. Do not call the passage "never analysed" unless it is true. The old lesson's claim that this site never analysed these verses is wrong for those two.

## Ledger exception record

If the owner approves it, the orchestrator records it in `verse-ledger.md`. Writers do not edit that file.
