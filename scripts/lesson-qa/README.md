# Lesson checks

Tools for writing and checking stepped lessons. Python runs as `python -I -X utf8`; the browser scripts use the Playwright headless shell already installed on this machine (chromium build 1243) and never open a window.

| Script | What it does |
|---|---|
| `verse.py <corpus> [-t] 3:68 2:10` | Prints the Tanzil text of verses from the Corpus file; `-t` adds each word's Corpus tags |
| `search-verses.py <corpus> "<phrase>" [max]` | Finds verses whose letters contain a phrase (diacritics ignored), to pick fresh examples |
| `check-verses.py <corpus> <lesson.mdx>` | Every `Sentence` and `Parse` with a verse reference, and every verse quoted in an `Exercise` question, must match the Tanzil text exactly, diacritics included. Must print `mismatch=0` |
| `jadwal.mjs [--book slug] 3:68` | Reads the i'rab of a verse from al-Jadwal on tafsir.app (or `--book aldur-almasoon` for al-Durr al-Masun) |
| `qa.mjs level-2/01-nominal-sentence` | With the preview server running: axe-core and a width check on every step at 390 and 1280 px, then a no-JavaScript render. Must print `no problems`. `LESSON_PORT=4323` for the `app-lessons` server |

The Corpus file is `src/data/morphology/quranic-corpus-morphology-0.4.txt`. Its Buckwalter text is converted with the full table of `scripts/lib/buckwalter.ts`; `,` is the small wāw (ۥ) and `.` the small yāʾ (ۦ), which are easy to swap.
