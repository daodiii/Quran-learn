# Surah page mockups: notes

Three working mockups of the page where a learner studies one surah, built with Al-Ikhlas (4 verses, 15 words). They use home's and Learn's tokens (Geist, the Oasis field, ink pill buttons, `oklch` colours), the same header, and the three word-type colours (noun blue, verb red, little word green, each with a text label). Light only. Links go nowhere, like the Learn and Surahs mockups.

All three keep what the old page had (the words with their grammar, the three layers of explanation, the exercises, the vocabulary, the summary) and add what it lacked: a plain-English line for every word, one question per verse, a sources line and a "Tell us" link. The old page is dark, has a 7-column table per verse and a decoder far above the analysis. Here the word table is gone; the words are the interface, and the table's columns sit in the box under the word you tapped.

## Where the content comes from

`node docs/redesign/mockups/surah-page/build-data.mjs` reads `src/content/surahs/112-al-ikhlas.mdx` and writes `ikhlas-data.js`. Everything in the three layers, the notes, the exercises, the vocabulary, the summary and the sources comes from the MDX, which was corrected in commit 55f364c (see below). Two things are mine and are drafts for you to read:

- **A plain-English role line for each of the 15 words** (for example "A command. The speaker is told: say.") and a short role label ("Subject (mubtadaʾ)"). The book's technical parse stays under it as "For the grammar book".
- **One question per verse** ("What does أَحَدٌ do in this sentence?") with three answers and a one-line reason.

Neither exists in the MDX yet. If you choose a direction, they become frontmatter or fields in the content files.

## Open them

```
python -I -X utf8 -m http.server 4330
```

`http://localhost:4330/docs/redesign/mockups/surah-page/a-sheet.html` (also `b-workbench.html`, `c-steps.html`). `CHR=<chrome-headless-shell.exe> node docs/redesign/mockups/surah-page/shots.mjs [a b c]` writes `shots/` (desktop 1440 and phone 390, first screen, full page, a state after use) and prints overflow, console errors, an axe scan (also after use) and touch targets under 44 px. `shots/` is not committed.

## The three

**A Study sheet** (`a-sheet.html`). One calm column you read down. Each verse is a sheet: the words in colour, the transliteration and meaning, the box for the word you tapped. Under it, "Why it is written this way" with three tabs (Syntax, Word forms, Style), the worth-knowing note, and "Try it". A rail on the left (a row of chips on a phone) jumps between verses, practice, vocabulary and sources and follows where you are. After verse 4: practice with answers that open, words to keep, grammar summary, sources.
- Best at: reading straight through, deep links to a verse, printing, and the phone. It is the closest to the old page, so the least change for current learners.
- Worst at: length (7,800 px on desktop, 9,600 on a phone) and the pull to skim.

**B Workbench** (`b-workbench.html`). The verse and its explanation share one screen (the stage ends at 860 px on a 900 px screen). Left: pick a verse, tap a word, read what it is. Right: five tabs (Syntax, Word forms, Style, Worth knowing, Try it). Arrow keys move between verses and, inside the verse, between words. Practice, vocabulary, summary and sources sit below the stage.
- Best at: the loop of tapping a word and checking the reason, which is the heart of studying a surah. Fast for someone coming back to one verse.
- Worst at: it hides most of the explanation behind tabs, so a skimmer sees less. On a phone the stage becomes a stack and loses the one-screen idea.

**C Steps** (`c-steps.html`). One idea per screen, like the stepped lessons. Each verse goes Read, Words, Why, Try, then Review after verse 4. Verse dots and the four steps show where you are; Back and Next sit at the bottom. Nothing is locked; the dots jump anywhere.
- Best at: beginners and short sittings on a phone (about 1,050 px tall on desktop and 1,100 on a phone), and it matches the lesson template learners already know.
- Worst at: a learner who wants to see the whole verse's analysis at once, and anyone returning to look something up. It is the most steps to build and test.

## My recommendation: C for the learner, B's loop inside it

The users are beginners reading on a phone in short sittings, and PRODUCT.md says one idea per screen. C fits that and the Stage lessons. Its weak spot is lookup, which a surah page needs: borrow B's verse switcher (it is the dots already) and let the Words step show Why in a side panel on a wide screen. If you want the least change and the least build, take A.

## What I checked

Desktop 1440 and phone 390, all three: no horizontal overflow, no console errors, no axe violations (first screen and after using the tabs, quiz, words and steps). Every touch target is at least 44 px except the inline "Tell us" link in the sources sentence (45 by 19 px), which sits inside running text. Shots were read, not just taken. Not checked: a screen reader pass, reduced motion by hand (the animations are off under the media query), keyboard order by hand.

## Content fixed alongside (commit 55f364c)

- The root of أَدْرَىٰكَ is د ر ي, not د ر ك, in surahs 82, 83, 86, 90 and 104, and the prose explaining the wrong root is rewritten. The word is now spelled as in the mushaf (Tanzil) in those files and in 97 and 101.
- Three roots held Cyrillic letters (78, 79). Kawthar is from ك ث ر.
- Al-Ikhlas now follows al-Jadwal: kufuwan is the khabar of yakun and lahu belongs to it; huwa is mubtadaʾ or the pronoun of the matter (no separation pronoun); lam is past negation, and the "never and will never" claim is gone; the first-root-و verb is explained; yakun is no longer called mabni; a Sources section and the "Tell us" link are added.

## Still open

1. **Which direction** (A, B or C), or C with B's switcher.
2. **The plain-English role lines and the questions** are drafts. Read them.
3. **The word-type rule** reads the type from the morph line (a preposition joined to a pronoun counts as a noun, so "لَهُ" is a noun here). You have not confirmed it.
4. **The Hafs fix.** The Quran font here is `Surah Hafs` (the same file without U+06DF). The built page needs that declaration in the page's CSS; `fonts.css` is not touched.
5. **Spelling.** 29 verses still differ from the Corpus text in spelling (down from 37 before the أَدْرَىٰكَ fix). I looked at nine; they are spellings, not wording. The rest I have not read one by one.
6. **Grammar beyond Al-Ikhlas.** Only Al-Ikhlas was read against al-Jadwal. 52 words still have a root the Corpus does not list for that verse. About 15 of them are particles given invented roots (فِي, مِن and so on); in the others, ي against و variants are common. I have not sorted every one by hand. The parses of the other 37 surahs are not yet checked.
