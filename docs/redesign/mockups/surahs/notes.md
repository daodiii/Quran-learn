# Surahs page mockups: notes

Six working mockups of `/surahs/` in two rounds. A, B and C (round 1) are plain and clear; D, E and F (round 2, at the end) are built to make a visitor want to use the site. Round 1 text follows.

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

`http://localhost:5199/docs/redesign/mockups/surahs/a-reading.html` (also `b-map.html`, `c-index.html`, `d-decode.html`, `e-wall.html`, `f-path.html`). They also open from disk.

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

# Round 2: D, E and F

Same brief, higher bar: more striking, and the page itself should make someone want to start. The key find was in `src/data/surah-decoder.ts`: it holds every word of all 571 verses (2,791 words) with meaning, root and grammar role. Round 1 ignored it. Round 2 uses it, so each mockup can show the real product, not only a list of names. `build-data.mjs` now also counts each surah's nouns, verbs and little words (into `surahs-data.js`) and writes every verse to `surahs-words.js` (485 KB, used only by D).

**Word types.** Noun, verb and little word keep the same three colours as home (`--noun` blue, `--verb` red, `--little` green), deepened a little so coloured Arabic is at least 7:1 on white and on the tints. Every colour has its text label (the key, the label under each word, and the counts in each accessible name). The type of each word comes from the first part of its `morph` line (for example "Preposition + noun" counts as a noun, because the noun is the stem); see "To confirm".

All three use the same header, filter (name, number, Arabic, with or without vowel marks) and empty state as round 1, and respect reduced motion.

## D Decode (`d-decode.html`): the page is the product

A rail lists the 38 surahs in the order the course prepares you for them; each row has a thin bar of its makeup (nouns, verbs, little words). Pick one and its verses open on the right as a live word-by-word reading: large Arabic, transliteration, meaning, a coloured bar and a text label for each word. Tap a word for its meaning, type, root and grammar role. Step through every verse (the verse menu, or the arrows), turn the colours off and on, and open the full breakdown from the foot of the sheet. Words rise in and the colours settle in when a verse loads. Arrow keys move between words (left is next, since Arabic runs right to left).
- Best at: showing, in ten seconds and with no explanation, what the site does. The first screen on a phone is already a decoded verse.
- Worst at: scanning many surahs at once (the rail shows about nine at a time on desktop), and it asks the browser to hold more data than the other five.

## E Wall (`e-wall.html`): all 38 on one poster

A treemap: each surah is a tile as big as its length, and the Arabic name is as large as the tile allows. Colour the wall by level (the five-step teal to amber ramp, with the level in each caption) or by word types (plain tiles with a stripe of nouns, verbs and little words at the foot). Larger tiles also show the English name, verses and opening words. Point at a tile and a caption shows its details and counts; filtering quiets the tiles that drop out. Short surahs get a minimum size so every name stays readable, which the page says. On a phone the wall is three tiles across and every tile is a tap target.
- Best at: the shape of the whole collection at a glance, and the most colourful, poster-like first impression. Levels read as colour: the long surahs are the last ones taught.
- Worst at: order. Tiles are arranged by size, not by number or level, so it is not the page to use for finding "the next one".

## F Path (`f-path.html`): the page starts from you

The headline asks "Which surahs can you read today?" and the answer is a staircase: one step per stage of the course (just starting, then Level 1 to 5), each as tall as the number of surahs it opens (0, 5, 12, 20, 29, 38, all counted from the data). Tap your step. The page then shows the surah the course has just opened for you as a large feature (Arabic name, opening words, the "what to notice" line, a makeup bar), the rest you can read, a "next goal" panel ("Finish Level 3 to open 8 more surahs", with their Arabic names), and the levels further ahead. Nothing is locked, and the page says so. There is no streak, score or badge: only plain progress. `?done=0` to `?done=5` sets the stage; it is also remembered in the browser. The built page would read the learner's saved lesson progress instead.
- Best at: giving a beginner a reason and a first step, and turning the course into the way into the surahs. A returning learner sees where they are.
- Worst at: a visitor who just wants to browse: the surahs sit below the staircase, and a first-time visitor sees "0 surahs" first.

## Recommendation for round 2: D, with F's idea added

D is the most convincing: it does the thing instead of describing it, and it works on a phone. F has the best marketing idea (your level decides the page). The built page could be D, with F's logic inside it: if there is saved progress, the rail opens at the learner's level and marks the surahs they can read now. E is the most eye-catching and could be a strong choice for the home page or a "browse everything" view, but it is the weakest for choosing what to read next.
Overall, across all six: D if the goal is to make people want to try the site, A if the goal is the calmest list.

## Round 2: assumptions

- **Default demo is Al-Ikhlas, verse 1** (it shows both a verb and nouns in four words). A hash such as `d-decode.html#078-an-naba` picks another surah.
- **F's default stage is Level 2 finished** (a returning learner), like Learn's mockups. "Ready" means the surah's reading level is at or below the finished level.
- **E's tile size is verses plus a floor of 14** (so a 3-verse surah is not a speck); sizes are not exactly proportional.
- **Translation lines** are the ones in the decoder data (the site's own).
- **Nothing is locked.** This follows the Learn page's stance, and F says it on the page.

## Round 2: to confirm with the owner

1. **Which direction**, or the D plus F mix.
2. **Word-type colours on a surah index.** They are the site's colours, but this is the first time they appear outside lessons. OK to show them on this page?
3. **The word-type rule.** The decoder data has no type field, so the type is read from the `morph` text (details in `build-data.mjs`, `wordType`). It gives 1,321 nouns, 564 verbs and 906 little words over the 2,791 words. A word that joins a preposition to a pronoun (for example the ending of Al-Fatiha 1:7, alayhim) counts as a noun. Please spot-check a few verses; a wrong type would be a visible mistake.
4. **Grammar role text.** D shows the decoder's `irab` line as written (for example "Command verb (fi'l amr) - mabni"). It uses Arabic grammar terms; the built page may want a plainer line for beginners.
5. **Performance.** The mockup loads all 571 verses (485 KB). The built page should ship only the first verse per surah, and load the rest when a learner steps forward.
6. **Draft copy:** "Every word of 38 surahs, explained.", "All 38 surahs on one wall.", "Which surahs can you read today?", "Just opened by Level 2", "Finish Level 3 to open 8 more surahs", "Further ahead", the stage names, and the staircase labels.
7. **Surah-name styling** is as in the files (mixed ʿ and ' marks, shown as written).

## Round 2: checked

Desktop 1440 and phone 390, D, E and F: no horizontal overflow, no console errors, no axe violations (first screen and empty state), and every touch target at least 44 px. Also exercised by script: D's colour switch, word arrows and surah change; F's stage clicks and `?done=5` (all open, no goal panel); E's filter and word-type mode. Screenshots are in `shots/` (not committed).
