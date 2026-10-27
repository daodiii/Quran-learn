# Part 2: sources report

Date: 2026-10-27. This is research, not legal advice.

**How facts were checked.** Two research agents searched the web and reported back. I re-checked three findings myself against primary pages or the repo (marked **checked**). Everything else is as reported by the agents: "seen" means they said they read a primary page, "not verified" means they only saw a search result or a secondary source. Anything marked "terms not found" should be treated as all rights reserved until someone checks.

## Recommendation: one source per need

| Need | Recommended | Why | Open question |
|---|---|---|---|
| Arabic verse text | **Tanzil Uthmani** (CC BY-ND 3.0) | Clear terms; it is the text underneath the Corpus data we already use | The site does not credit Tanzil anywhere yet (**checked**: no mention outside the data file) |
| Word-by-word analysis | **Quranic Arabic Corpus v0.4** (GPL plus terms) | The only free full morphology; no newer version exists (seen) | Paid products built on it, see Risk 1 |
| English for verses | **Decide, see below** | Lessons show English translations with no named source | Needs your decision |
| Meanings of words | **Our own glosses**, seeded from the Corpus glosses | Hans Wehr and Almaany are link-only; Lane is too wordy for glosses | Someone must check the glosses |
| Word frequency | **Our own counts** from the Corpus (script in the repo) | Reproducible; no published figure could be traced | None |
| Audio (if added later) | **Stream from the Quran Foundation API** | The only source with written developer terms | Not planned |

### The translation question

The lessons put an English translation under each verse, and none of the lesson files name which translation it is (**checked**: no mention of Sahih International, Pickthall or Yusuf Ali anywhere in `src/content`). That is a gap for a site that wants honest sources, and possibly a copyright problem. Options:

1. **Write our own plain-English meaning for each example** and say so ("meaning in plain English, by Quran Learn"). Fits the B1 goal and has no licence problem. The cost: every line needs a check by someone who knows the verse, and it must not pass as an official translation.
2. **Pickthall (1930).** Public domain in most countries, but the research found only secondary sources on its US status, and the English is old ("Lo!", "verily"), which clashes with the B1 goal.
3. **Ask Dar Abul-Qasim for written permission for Sahih International.** Best modern English, but it is copyrighted and no public licence was found. Tanzil lists it as non-commercial only.
4. **Clear Quran, Abdel Haleem, Asad:** copyrighted. Do not use without written consent.

My recommendation is option 1 for the short example lines, with a named full translation linked for readers who want one. Your call, and it can wait until Part 3.

## What each source requires of the site

### Tanzil (Arabic text) and the Corpus: checked in the repo's own file header

The header block in `src/data/morphology/quranic-corpus-morphology-0.4.txt` says, for the Tanzil text, "License: Creative Commons BY-ND 3.0 Unported" and, for the Corpus, "License: GNU General Public License". Both blocks say:

- verbatim copies may be distributed, but "CHANGING IT IS NOT ALLOWED";
- the text or annotation may be used "in any website or application, provided its source … is clearly indicated, and a link is made to" tanzil.info or corpus.quran.com;
- the copyright notice must be "reproduced appropriately in all works derived from or containing substantial portion of" the file.

What the site must do:

- Credit and link **Tanzil** wherever Quran text is shown, and the **Corpus** wherever its data is used. Today the Corpus is credited on four pages (About, word lookup, verb tool, the data README). Tanzil is not credited at all.
- Keep the original text unchanged. Search indexes or reformatted copies are "derived files" and should be labelled as derived.
- Corpus licence page, **checked**: names GNU GPL version 3 and states "Copyright © Kais Dukes, 2009-2017. Maintained by the quran.com team." The page does not repeat the Corpus's own terms. Those are in the file header and on the download page.

### Tanzil's translations: **checked** on tanzil.net/trans

"The translations provided at this page are for non-commercial purposes only." For other uses you "need to obtain necessary permission from the translator or the publisher." Using more than three of them on a site needs a link to Tanzil's translation page. Sahih International, Yusuf Ali and Pickthall are all offered there.

### Quran Foundation API (Quran.com)

Seen by an agent: commercial use is allowed for apps using the live API. Caching or storing its content for longer than a week is not, unless done through its Content Sync APIs, and it does not allow shipping a prepackaged database. A static site that bundles text in its build should not use it as the text source. Tanzil is the right one for bundling.

### QUL (Tarteel's Quranic Universal Library)

Licence is stated per resource, if at all. Its own docs say datasets can be used in "your own app or research workflow" but state no licence (seen). Check each resource before use.

### Dictionaries

- **Lane's Lexicon** (1863 to 1893): public domain by age (not verified). The Perseus digital copy is reported as CC BY-SA, which would require share-alike if copied. Use for lookup and links, not for glosses.
- **Hans Wehr:** assume it is still in copyright. Link only.
- **Corpus glosses:** described by the Corpus as "brief glosses intended as a guide to meaning" (seen), and under the same GPL terms as the rest of the Corpus.

### Audio

No verified licence for bundling files from EveryAyah or elsewhere. If audio is ever added, stream it from the Quran Foundation API under its terms and do not host files.

## Sources the lessons can cite for grammar

Ranked by how well they fit a Quran-focused beginner site. Each lesson should name one or two.

| For | Source | Notes |
|---|---|---|
| Nahw | **Quranic Arabic Corpus grammar pages and syntax treebank** (corpus.quran.com) | Analyses the real verses with traditional i'rab. Written for annotators, so link to it and paraphrase. The treebank covers 30,895 of 77,429 words (about 40%), chapters 1 to 8 and 59 to 114, per the agent (not verified by me). |
| Nahw and sarf | **Wright, *A Grammar of the Arabic Language*** (Caspari's German work, Cambridge, 3rd ed. 1896-98) | Public domain; volume 1 (1896) seen on archive.org. The standard classical reference. Its English is Victorian and the grammar is 19th-century Western philology, so paraphrase and do not quote. |
| Nahw (beginner text) | ***al-Ajurrumiyyah*, in J. J. S. Perowne's 1852 English translation** | Free on archive.org. A very short text, useful as "this rule appears in the traditional first text". The rights statement on the PDF itself was not seen. |
| Sarf | **Corpus morphology pages and dictionary** (roots, lemmas, forms I to X for every word) | Same terms as the rest of the Corpus. |
| Classical backing | *Qatr al-Nada*, *Alfiyyah* of Ibn Malik, *Shadha al-Arf* | No English edition could be verified for the Alfiyyah or *Shadha al-Arf*. Cite by title as the Arabic origin of a rule only. |
| Modern courses | Madinah course, Bayyinah, Ryding, Haywood and Nahmad | Paid or terms not found. "For further study" links only, never a source for a claim. Ryding and Haywood and Nahmad describe Modern Standard Arabic, not Quranic usage. The Madinah books come from a Saudi state university and Bayyinah is a commercial product; the owner should know that. |

### What the research could not find

- **No study** comparing vocabulary-first with grammar-first teaching for adult Quran learners. The closest is one small qualitative class study (an Indonesian journal) on teaching clusters of frequent words. So the course must not claim its order is research-backed.
- **The "300 words cover 70 to 80%" claim** has no traceable origin. Blog posts repeat it without data. The only concrete figure found was a commercial booklet claiming 82.6% for its own lists.
- **We can state our own numbers instead**, measured from the Corpus file by `scripts/analyze-corpus-frequency.ts`, counting each word by its lemma with prefixes removed:

| Most frequent lemmas | Share of all 77,429 words |
|---|---|
| 100 | 56.5% |
| 300 | 73.2% |
| 500 | 80.7% |
| 1,000 | 88.9% |

The 300-lemma figure is 73.2% when pronouns that have no lemma in the Corpus are counted by their spelling, and 70.4% when only words that carry a lemma are counted (one agent's recount, which matches my earlier run). Counting spelled forms instead of lemmas is much lower: 500 forms cover about 50% (agent's figure, not re-run). So "a few hundred words" is true for lemmas and false for forms, and any page should say which.

## Licence risks, most serious first

1. **Paid e-books built on the Corpus.** The repo already has two e-books. The Corpus is GPL v3 with an added "changing is not allowed" line, and the two sit awkwardly together. Whether tables or word lists derived from it can be sold is unclear. Get a lawyer's view before selling anything that contains Corpus-derived data.
2. **Unnamed translations in the lessons.** If they are copied or lightly changed from Sahih International or another modern translation, that is a copyright problem. Nobody has recorded where they came from.
3. **No Tanzil credit.** The Tanzil terms ask for a credit and link wherever its text is used. The lesson verses were typed in (the repo has no Quran text file, see the verse-text check in `CURRICULUM-REVIEW.md`), so it is not even clear whether they count as Tanzil's text. Either way the safe fix is a credit plus replacing typed verses with text taken from the verified file.
4. **Tanzil BY-ND.** Normalising or reformatting the text counts as a derivative. Keep the original intact and mark search indexes as derived.
5. **Pickthall and Yusuf Ali** in the US rest on secondary sources.
6. **Audio and QUL data:** no verified licence for bundling.

## Open items from this report

- Decide the translation option (above).
- Decide whether the e-books will be sold, and if so get legal advice (Risk 1).
- Add Tanzil credit and Corpus credit as part of the new template footer (Part 3 or 4).
