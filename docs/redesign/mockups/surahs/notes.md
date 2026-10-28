# Surahs page mockups: notes

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

`http://localhost:5199/docs/redesign/mockups/surahs/a-reading.html` (also `b-map.html`, `c-index.html`). They also open from disk.

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
