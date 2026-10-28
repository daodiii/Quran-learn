# Learn page mockups: notes

Three working mockups of `/learn`, built from the 2026-10-28 grilling (see the decisions in the project memory `learn-page-decisions`). All three use the real 81 lessons, the 31 topic groups and the five levels from `src/data/curriculum-map.ts`, home's light tokens (Geist, Oasis field, pill buttons) and the same behaviour:

- A live filter over title, description, topic group and level, plus level chips (All, 1 to 5). While you filter, the page turns into the results: headline and resume band go away.
- Lessons stay in curriculum order. Nothing is locked. "Start here" marks lesson 1 on a first visit; "Up next" marks the next lesson for a returning visitor.
- Each level shows the one line of what it assumes, plain progress ("3 of 12 done") and one end line: Review, Vocabulary, surahs to read now.
- Phone: levels fold, and only the level holding the next lesson is open. Filtering shows every match.

## Open them

Serve the worktree root so the fonts load, then open any page:

```
python -I -X utf8 -m http.server 5199
```

`http://localhost:5199/docs/redesign/mockups/learn/a-syllabus.html` (also `b-route.html`, `c-index.html`). They also open straight from disk. Add `?progress=0` for a first visit; the default `?progress=14` is a returning learner (Level 1 done, three lessons into Level 2). Press `/` to focus the filter.

`node docs/redesign/mockups/learn/build-data.mjs` rebuilds `learn-data.js` from the lessons. `CHR=<chrome-headless-shell.exe> node docs/redesign/mockups/learn/shots.mjs a b c` rebuilds `shots/` (desktop 1440, phone 390; first screen, full page, mid page, first visit, filtered).

## The three

- **A Syllabus** (`a-syllabus.html`): a typeset table of contents. Large level numeral and the Arabic level name sit on the left and stay put while you read the level; topic groups and lessons run on the right with room for the full description. The most text-led and easiest to read.
- **B Route** (`b-route.html`): one line runs down the page. Each level is a banner on it, each topic group a ring, each lesson a dot. The line fills up to your next lesson, so the sequence is visible and skipping ahead looks like skipping ahead. The most visual.
- **C Index with rail** (`c-index.html`): a fixed rail with the filter, the five levels with progress, and the reference tools; the page beside it is a compact index with topic names in a left column and sticky level headings. Fastest for someone who knows the topic they want. On a phone the rail becomes a sticky filter bar with level pills.

## Differences from what we agreed

- **No level tag on each row.** Every row already sits under its level heading, so the tag only repeated it. `rowHTML(x, { level: true })` in `learn.js` brings it back if you want it; it would earn its place in a flat result list.
- **31 topic groups, not 32.** I said 32 earlier from a miscount; `curriculum-map.ts` has 31 (counted by the build script).

## Draft copy and data to confirm

- The one-line description under each level (`blurb`) and the "Needs Level N" line are my drafts in `build-data.mjs`. Check them against what each level really assumes.
- Lesson titles and descriptions are the ones on this branch. Most lessons are still the old versions; the lessons window is rewriting them, so titles and the one-line descriptions will change. The built page reads them from the collection, so nothing here needs redoing.
- Progress is simulated from `?progress=N`. The built page reads the existing saved progress (`src/lib/progress.ts`).
- "Read now" surah names come from `src/data/reading-track.ts`; links in the mockups go nowhere.
- Reference tools are linked once near the top: Verb forms and I'rab cases. The mockups do not yet link the Word lookup.

## Not in the mockups

The built page will render the full list as plain HTML, so it reads without JavaScript (the mockups render in the browser); the no-results state links to site search; an axe and Lighthouse pass comes with the build.
