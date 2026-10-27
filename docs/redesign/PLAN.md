# Redesign plan (agreed 2026-10-27)

Quran Learn becomes a warm, friendly learning site with two tracks that run side by side: the Classical Grammar course (kept and improved) and a new Vocabulary course built around the most frequent Quran words.

## Who it is for

Learners who care about the Quran and know little Arabic. The course starts from zero (the alphabet is included). Finishing it means: they can read a verse, name the grammar role of its words, and follow the meaning of most verses without a translation.

## Rules for every part

- English at about B1 reading level. One concept per lesson. A gloss on the first use of each term.
- Examples come from a verse bank (`docs/audit/verse-bank.md` is the starting point). A verse is the main example in at most two lessons, except where Al-Fatiha or Al-Ikhlas are truly the best choice. Examples are short and tied to the lesson's one concept.
- Every lesson shows its sources, plus a "Found a mistake? Tell us" link to a form. There is no "unreviewed" label.
- One colour code for word types and cases, used the same way on every page.
- No decorative animation. Motion only when it explains something (for example, stepping through a parse). "Reduce motion" is respected.
- Warm, colourful, easy to read. Look chosen from 2-3 mockups shown side by side.
- Keep the tools (decoder, word lookup, verb generator), data, fonts, Supabase tables, e-books and the mobile build. Only their look changes.
- The 73-81 lessons stay as lessons. Each one gets more, shorter steps instead of being split. Target about 5-10 steps, with a step bar, and 600-900 words of teaching text per lesson (examples, tables and practice are extra).
- Mastery: each lesson ends with a 5-question check mixing new and earlier material. A quick check follows each step. The next lesson stays visible but says "Pass the check first", with a "skip anyway" link and a "test out" option. The pass mark is set per check (start near 70%, tune from learner tests).
- Level quizzes become level reviews, built from the lesson checks, in the same components and look as the lessons.

## Parts

| Part | What | Output |
|---|---|---|
| 1 | Audit (no code changes) | `docs/audit/AUDIT.md` |
| 2 | Sources and curriculum: ranked sources with licences, frequency data, grammar-order check, Vocabulary course outline | A report and an outline for approval |
| 3 | Template and look: 2-3 mockups of L2.01 side by side, then the chosen template built and tried on L2.01 and L3.03 | New template; before/after for learner testing |
| 4 | Navigation and learning path: home, learn dashboard, "what's next", the mastery gate | New site shell |
| 5 | Roll-out of Levels 1-5, one level per PR, fixing example repeats | Redone lessons |
| 6 | Tools, e-books and level reviews in the new look | Consistent site |

Order: 1, then 2 alongside the start of 3, then 4-6. No other lesson is touched until the template has been tried on L2.01 and L3.03. At the end of each part the work is shown with screenshots and approved before the next part starts.

## Measuring whether it teaches better

An end-of-lesson check, plus testing with 3-5 learners from the community on L2.01 and L3.03, old and new side by side. No heavy analytics.

## Decisions after Part 2 (2026-10-27)

1. **Reorder the grammar lessons** as set out in `docs/curriculum/CURRICULUM-REVIEW.md`: verb forms by use (II, IV, VIII, V, X, III, then one rare-forms lesson), a short "verbs that change shape" step in L3.03 and L3.04, little words taught early, and attached pronouns before L2.07. **Learners must be told.** Anyone partway through the course must not lose progress or be confused: keep old lesson addresses working (redirects), carry saved progress over to the matching lesson, and show a short "What changed" note (which lessons moved, why) on the learn dashboard and on each moved lesson until it has been seen.
2. **English under each verse:** our own plain-English meanings, written with the `humanizer` skill so they read easily at B1 level. Labelled as plain-English meanings, not as a translation. A named full translation may be linked for readers who want one. The meanings need checking by someone who knows the verses.
3. **Verse text** comes from Tanzil by reference (not typed in), and Tanzil is credited with a link in the footer of every page that shows Quran text. Constructed example phrases (not verses) are labelled as such.
4. **Nothing will be sold.** The e-book licence worry is dropped. Revisit if ads or paid products are ever added. The Corpus credit and link stay.
5. **Vocabulary course:** strict frequency order for the first version.
6. **Sources to cite** (owner's judgement, 2026-10-27):
   - Approved: the Quranic Arabic Corpus grammar pages, *al-Ajurrumiyyah* (the Arabic text), the Madinah course books, and Bayyinah.
   - Not approved (owner has doubts about grammars written in English by outsiders to the tradition): Wright, Ryding, Haywood and Nahmad. Do not cite them as a source for a claim.
   - Perowne's 1852 English translation of *al-Ajurrumiyyah* is not approved either, so cite the Arabic text, not the translation.

## Open items

- Who the test learners are (to be found by the owner).
- A qualified reviewer for the Arabic, if one becomes available.
- Which extra interface language comes first, if any (decide from real visitors).
- Where "Found a mistake?" reports go: a free form with the lesson name pre-filled (form to be created by the owner).
