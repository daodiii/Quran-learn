# Surahs page mockups: notes

Six working mockups of `/surahs/` in two rounds. A, B and C (round 1) are plain and clear; D, E and F (round two, at the end) are one-screen designs built to make a visitor want to use the site. Round 1 text follows.

Three working mockups of `/surahs/`, built from the real data: the 38 surah files in `src/content/surahs`, the opening words and place of revelation in `src/data/surah-openings.ts`, and the reading level and "what to notice" line in `src/data/reading-track.ts`. They use Learn's tokens (Geist, the Oasis field, ink pill buttons, `oklch` colours) and the same header, with Surahs as the current page. Light theme only. The old astrolabe page is not reused; its facts are (38 surahs, Al-Fatiha plus Juz ʿAmma, level order).

All three share the same behaviour:

- A live filter over the English name, the Arabic name, the opening words (typed with or without vowel marks), the surah number and the level. "level 3" works. Mockup A also searches the "what to notice" lines, so "idafa" finds surahs.
- The empty state says only 38 of 114 surahs exist and names the range (Al-Fatiha (1) and 78 to 114), with a button to show all.
- Every count and name on the page comes from `surahs-data.js`. The dek ("Al-Fatiha and the last 37 surahs, An-Naba to An-Nas. The other 76 are not analysed yet.") is built from the data, so it changes if a surah is added.
- Press `/` to focus the filter, Escape to clear it.
- Arabic names use Amiri; opening words use the Quran font (see "Font" below). `letter-spacing: 0`. Arabic text is 8.2:1 or better on its background (measured for ink, body text and the teal accent).
- Links go nowhere (`#slug`), like the Learn mockups. The built page links to `/surahs/<slug>/`.

## Open them

Serve the worktree root so the fonts load, then open any page:

```
python -I -X utf8 -m http.server 5199
```

`http://localhost:5199/docs/redesign/mockups/surahs/a-reading.html` (also `b-map.html`, `c-index.html`, `d-reader.html`, `e-command.html`, `f-ladder.html`). They also open from disk.

`node docs/redesign/mockups/surahs/build-data.mjs` rebuilds `surahs-data.js` from the source files. `CHR=<chrome-headless-shell.exe> node docs/redesign/mockups/surahs/shots.mjs [a b c]` writes `shots/` (desktop 1440 and phone 390: first screen, full page, a filtered state, the empty state) and prints overflow, console errors, an axe scan and touch targets under 44 px. `shots/` is not committed.

## The three

**A Reading list** (`a-reading.html`). One job: tell a learner which surah to read next. Surahs are grouped by the level that prepares you for them (the reading track), in the order the course teaches. Each entry is bilingual and typeset: English name, verses and place on the left with the "what to notice" line under it; the large Arabic name and the opening words on the right. The level stays on the left while you read its surahs, as in Learn's syllabus. A "Start here" card (Al-Fatiha) sits in the Oasis header on desktop. Filter and level chips (All, 1 to 5).
- Best at: reading and choosing. Arabic is largest here; the notes make each surah feel approachable; it follows the course.
- Worst at: scanning for a surah by number or comparing lengths. It is the longest page (about 8,700 px on desktop), because each entry is generous.

**B Map** (`b-map.html`). One job: show where the 38 sit in the whole Quran, honestly. All 114 surahs in book order as squares, 19 by 6 on desktop. The 38 ready surahs are lit and coloured by level (and carry the level number as five small bars); the other 76 have dashed outlines and "not analysed yet" in the key. A strip below shows the 114 surahs as wide as their verse counts, and says the 38 hold 571 of the Quran's 6,236 verses. Hovering or selecting a square fills a panel with the Arabic name, opening words, note and an Open button. The list and filter are beside the map; hovering a list row previews it on the map, and filtering dims the squares that drop out. Arrow keys move between lit squares.
- Best at: the shape of the collection. It shows at once that this is Al-Fatiha plus the final stretch, and that most of the Quran is still to come. The most distinctive and "high-tech" of the three.
- Worst at: mobile and first-time guidance. 114 squares cannot be 44 px on a phone, so there the map is a picture (not interactive, hidden from screen readers) and the list does the work. The map itself does not say which surah to read first. On desktop the squares are 34 by 38 px.

**C Index** (`c-index.html`). One job: find a known surah fast. One dense table: number, English and Arabic name, opening words, verses (with a bar), level, difficulty, place of revelation. Click any column heading to sort (and again to reverse). Chip filters for level, place and difficulty narrow it. The whole row is the link. On a phone the table becomes one two-line row per surah with a sort menu and a Filters button; opening words are dropped there.
- Best at: lookup, sorting and comparing ("shortest first", "all the Medinan ones"). Shorter than A (about 3,100 px against 8,700 on desktop).
- Worst at: warmth and guidance. It reads like a tool; it does not say what to read first, and Arabic is smaller than in A.

## Recommendation: A

A answers the question most visitors arrive with, "which surah can I read now?", and it does it in the course's own order. The Arabic is the biggest thing on the screen, the "what to notice" line is the one thing no list or table has, and it sits closest to Learn's syllabus, so the two pages feel like one product. B is the most striking, but its main picture is mostly empty squares and its interaction does not work on a phone, where many readers are. C is a good tool for the few who already know the name.
Two things worth borrowing into A: the coverage strip from B (one line, "571 of 6,236 verses") if the owner wants the honest "this is a part of the Quran" message, and C's sort as a small option if the list grows.

## Assumptions I made

- **Level order is the reading track.** "Read after Level N" uses `afterLevel` from `reading-track.ts`. Order inside a level is surah number (which matches the track's own order).
- **Reading notes lose their long dashes.** The notes in `reading-track.ts` contain " — "; `build-data.mjs` turns each into a full stop. The source file is unchanged.
- **"Start here" is Al-Fatiha**, the first entry of Level 1 in the track.
- **Level and difficulty say nearly the same thing.** Difficulty follows level for 35 of the 38. The three that differ: Al-Asr (beginner, read after Level 3), and At-Tariq and Al-A'la (advanced, read after Level 4). C shows both because the brief asked for both; A and B show level only. I suggest the built page drops difficulty or derives it from level.
- **The map uses a 114-entry verse-count table** typed into `build-data.mjs` (needed for the 76 surahs that have no file). It is checked in the script: 114 entries, summing to 6,236, and each of the 38 matches its own file's `verseCount`.
- **The map is 19 columns on desktop, 12 on phone.** Surahs 78 to 114 are one unbroken run, so the lit area is one block at the end.
- **Phone nav** hides the other links (Learn, Resources, About), exactly as the Learn mockups do. That is a site-wide decision, not made here.
- **Names are as in the files.** They mix ʿ and ' (An-Naziʿat, Al-A'la, Al-'Alaq). Search ignores both.

## Font

The opening words use `'Surah Hafs'`: the same `UthmanicHafs.woff2` as `'KFGQPC Hafs Uthmani'` but with U+06DF left out of `unicode-range`, then Amiri. The Hafs font draws U+06DF as a dotted circle, and Surah 98 opens with it (كَفَرُوا۟). This is the same fix the stepped lessons use. `src/styles/fonts.css` is untouched. The exact `KFGQPC Hafs Uthmani` face is also declared in `surahs.css`, but nothing uses it.

## To confirm with the owner

1. **Which direction** (A, B or C), or a mix.
2. **The Hafs fix on surah pages.** The built page would need the same split font declaration, or the dotted circle shows on Surah 98's opening. This needs the owner's OK because `fonts.css` is protected.
3. **Draft copy.** H1s ("Read a surah, word by word.", "Where the surahs sit in the Quran.", "Every surah, at a glance."), the deks, "Read after Level N", "Start here", "Not analysed yet" and the empty-state text are mine.
4. **Level wording.** The old page said "Best begun after Level 3"; the reading track puts some surahs after Level 1. These mockups follow the track. Confirm that is the intended advice.
5. **Place of revelation.** Surahs 98, 99 and 110 are marked Medinan by `surah-openings.ts`; scholars differ on some of these. The mockups show the data as it is.
6. **Difficulty.** Keep it, or drop it as redundant with level (see above).

## Checked

Desktop 1440 and phone 390, all three: no horizontal overflow, no console errors, no axe violations (first screen and empty state), and every touch target at least 44 px, except the 114 map squares in B on desktop (34 by 38 px, mouse; on a phone the map is inert and the list is the control). Screenshots are in `shots/` (not committed).

Not in the mockups: the built page should render the full list as plain HTML so it works without JavaScript, link each surah to `/surahs/<slug>/`, and run Lighthouse.

---

# Round two: D, E and F

The owner liked A, B and C and asked for three more that are "super impressive", catch the essence of the page, and do not scroll much. The essence: **38 surahs you can read word by word (Al-Fatiha and 78 to 114), and which one fits your level.** Each mockup delivers that one idea on about one screen and has one memorable interaction. All use the real data. Open them at `d-reader.html`, `e-command.html` and `f-ladder.html`.

An earlier, longer attempt at D, E and F (a decoder sheet, a treemap wall, a staircase page) is in commit `24dd724`. It was replaced because it scrolled too much; the files were removed.

What the three share: the same header (Surahs current), tokens and fonts as A, B and C (`surahs.css`, `surahs.js`), including the `Surah Hafs` fix for U+06DF. The page is a single Oasis stage. Word-type colours are the site's (noun blue, verb red, little word green), deepened so coloured Arabic is at least 7:1, and each one has a text label. Motion is 200 to 250 ms, ease-out, uses transform and opacity only, and is off under reduced motion. `/` focuses the filter, and the empty state names the coverage honestly ("Only 38 of the Quran's 114 surahs are analysed: Al-Fatiha (1) and 78 to 114").

## D Reader (`d-reader.html`): one stage, one surah at a time

The selected surah fills the stage: its name very large, what to notice, and its first verse read word by word on a white sheet (Arabic, meaning, word type with a coloured bar and a label; tap a word for its type and grammar role). A strip of all 38 sits underneath in the order the course teaches them, with "After Level N" markers. Left and right arrow keys change surah (inside the verse they walk the words), swipe works on a phone, the buttons work, and every surah has a link (`#112-al-ikhlas`). The filter narrows the strip and Enter opens the first match. Words rise in over 240 ms when the surah changes.
- Best at: showing what you will get, at once. It also makes the Arabic the largest thing on the page.
- Worst at: comparing surahs, and finding one by topic (the filter searches names, numbers and Arabic only).

## E Command (`e-command.html`): the search field is the page

A large field is the hero. Type a name, a number, Arabic with or without vowels, or a topic such as "idafa" (it searches the reading notes). The list narrows as you type and the pane beside it previews the highlighted surah (name, opening words, what to notice, a bar of nouns, verbs and little words). Arrow keys move, Enter opens, level chips (1 to 5) act as shortcuts, and matches are highlighted. With nothing typed, the list shows all 38 by level. With no match, the page becomes the invitation: it explains the coverage and offers five things to try. The field and list follow the combobox and listbox pattern for screen readers.
- Best at: the visitor who knows what they want, and the fastest from landing to the right surah.
- Worst at: a visitor who does not know any surah names: the field is the main thing, and the level shortcuts are small.

## F Ladder (`f-ladder.html`): your level decides the page

Five rungs, "I have finished Level N". Climb a rung and the surahs it opens appear as large Arabic tiles in a fixed stage (new ones at that level, or everything open so far, with the new ones tinted). The rung line fills as you climb. It is a ladder on the left on desktop and a row of five on a phone. A small pill shows "38 of 114 surahs analysed". The filter searches every level. `?level=1` to `?level=5` picks the rung (the built page would start at the learner's own level). Nothing is locked, and there is no score or streak.
- Best at: answering "which surahs fit my level" directly, and giving a beginner a next step.
- Worst at: the Arabic is smaller than in D and E (tiles, not a single large name), and there is no word-level preview.

## How tall they are

Total page height in px, from `shots.mjs` (desktop 1440 by 900, phone 390 by 844):

| | Desktop | Phone |
|---|---|---|
| A Reading list | 8,697 | 10,208 |
| B Map | 1,390 | 3,573 |
| C Index | 3,101 | 4,422 |
| **D Reader** | **913** | **1,424** |
| **E Command** | **912** | **1,173** |
| **F Ladder** | **900** | **1,356** |

D, E and F are one screen on desktop and under two screens on a phone. The lists (the strip, the results, the tiles) scroll inside the page, not the page.

## Are they better than A, B and C?

For the owner's stated goal (essence, no long scrolling, impressive), yes. They are shorter by a factor of three to nine, each is one idea, and D and F put the real product (word-by-word grammar, levels) on the first screen, which A, B and C do not. A is still the best for reading: it has the only full "what to notice" line for every surah at once, and it is the calmest. B is still the best picture of the whole Quran and C the best for sorting. D, E and F are weaker at showing many surahs at once.

## Recommendation across all six: D

D is the most convincing: it shows the product doing its job in the first second, the Arabic is the hero, it works with a keyboard, a swipe and a link, and it already carries the level (the tag, and the strip in course order). To bring in F's strength, add level shortcuts to the strip. E is a close second for returning learners and would suit a search page. F is the best explanation of how the course and the surahs fit together and would also work as a section on the Learn page.

## Assumptions

- **Default surah** in D is Al-Ikhlas (four words, a verb and nouns); in E, Al-Fatiha is highlighted; in F the rung is Level 2.
- **Order** in D and E is the course order (the reading track), not surah number.
- **Grammar labels are not invented.** The word types and roles come from the site's own decoder data (`src/data/surah-decoder.ts`, the data behind each surah analysis). The type is read from each word's `morph` line by `wordType` in `build-data.mjs`: 1,321 nouns, 564 verbs, 906 little words over all 2,791 words. A preposition joined to a noun or pronoun counts as the noun.
- **First-verse teaser** uses verse 1 of the surah as in the decoder data; its translation is the site's own.
- **Swipe** changes surah only on touch, and not on the strip, the filter or the verse.

## To confirm with the owner

1. Which one (or D with F's level shortcuts).
2. **Word-type colours on a surah index.** The first time they leave the lessons.
3. **The word-type rule** (above). Please spot-check a few verses; a wrong type would be visible.
4. **Role text.** D shows the decoder's grammar line as written (for example "Command verb (fi'l amr) - mabni"). It uses Arabic grammar terms; the built page may want a plainer line.
5. **Performance.** The mockup loads all 571 verses (485 KB) for D. The built page should ship only the first verse of each surah.
6. **The Hafs fix** for U+06DF, as in round one: the built page needs the same split font declaration, and `fonts.css` is protected.
7. **Draft copy:** "Find any surah.", "Which surahs fit your level?", "I have finished", "New at this level", "Everything open", "What to notice", "Read it word by word", and the empty-state text.

## Checked

Desktop 1440 and phone 390, D, E and F: no horizontal overflow, no console errors, no axe violations (first screen, filtered state and empty state), and every touch target at least 44 px. Also exercised by script: D's arrow keys, surah change and word arrows; E's typing, arrow keys, level chip and the invitation state; F's rung clicks, `?level=4` and "Everything open". Screenshots are in `shots/` (not committed).
