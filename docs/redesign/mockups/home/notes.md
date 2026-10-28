# Home hero mockups: notes

Open `compare.html` for the side-by-side, or any `hero-*.html` for the working mockup. `node docs/redesign/mockups/home/shots.mjs a b c compare` rebuilds the screenshots in `shots/`.

## The final two: M3 made live (Opus)

Shared library: `tools.js` + `tools.css`. Each tool mounts into an element and returns `demo()`, `stop()`, `resume()`. A demo is a short scripted run; any pointer or key input inside the tool stops it for good.

- Lesson: three steps of L2.01 on Al-Hadid 57:3 (هُوَ ٱلْأَوَّلُ). Step 2 slides in the English-only "is"; step 3 asks which word is the mubtadaʾ (هُوَ, with ٱلْأَوَّلُ as khabar), with feedback for both answers.
- Word lookup: knowledge, mercy, guidance, book, with counts and families from `public/data/word-lookup.json`.
- Verse decoder: the dua, tap a word for type, job, root, meaning.
- Roots: 114-bar line from the Corpus (`hero-i-data.js`), four roots, hover a bar for the surah.

- **M4 Product tour** (`hero-m4.html`): window with vertical tabs. Starts when the window is in view; each tab plays its demo with a timer bar, the address bar changes per tool, then the next tab. Clicking a tab or touching a tool pauses the tour; "Play the tour again" restarts it. Arrow keys move between tabs.
- **M5 Bento** (`hero-m5.html`): headline left, actions right; six cards (lesson, lookup, decoder, roots, five-level path, a dark trust band). Each live card plays once when 55% visible and shows "Playing" while it does.

Phone (M4, checked at 390 px): the window runs nearly edge to edge, the tabs become a swipeable pill row that follows the tour, and each tool lays itself out by its own width (container queries in `tools.css`), so the same tools fit a bento card or a phone. Tapping a bar in the roots chart works like hovering.

Not done: phone layout of M5; the level descriptions in M5 are draft copy; lesson text is a sample of L2.01, not the rewritten lesson from the lessons window.

## Three outlooks with real pictures (Opus)

- **M1 Museum** (`hero-m1.html`): full-bleed Blue Qur'an page, a slow settle on the photograph, title "Understand every word.", a white card that reads the dua word by word (hover a word for its type), and a museum-style credit plate.
- **M2 Editorial** (`hero-m2.html`): parchment field, title "Every mark is a lesson.", an 8th–9th century Kufic page with three of its red vowel dots ringed, and a three-step control: Letters (no marks), Marks (as in a mushaf today), Meaning (the site's layer). It plays once on load.
- **M3 Product** (`hero-m3.html`): white, product-page style, title "Learn the language of the Quran.", the real L2.01 lesson step as the hero object, with two floating tool cards (word lookup: mercy, 114 times; root ع ل م: 854 times, a bar line from the Corpus data).

Images (all public domain, credits in `assets/credits.json`): "Blue Qur'an Page", North Africa or Southern Spain, 9th–10th century; "Folio from a Koran (8th–9th century)", Abbasid. Both via Wikimedia Commons. Web copies: `assets/blue-quran-2400.jpg` (1.4 MB) and `assets/red-dots-folio-2000.jpg` (446 KB); the build should serve AVIF/WebP at several widths. Not used: the 1307–8 page is a colophon (the calligrapher's note), not Quran text.

Claims to check: "red dots are vowels: above a, below i, beside u" follows the dot system attributed to Abu al-Aswad al-Duʾali; "more than a thousand years ago" rests on the folio's 8th–9th century date.

## Deep versions of F (Opus)

Desktop first; the phone composition is the next step.

- **F1 Dawn** (`hero-f1.html`): full-screen split. The recited layer is cloned from the understood one, so every element lines up exactly, header included; the line of light passes through the navigation. Headline dialogue: "You recite it." / "Understand the Holy Quran for Free." Dark side shows the sound (rab·bi, zid·nī, ʿil·mā), light side the root, meaning and word type. The intro sweeps the light in under 3 seconds and stops between the second and third word, so one word is left to discover. Drag the knob, use the arrow keys, or tap a word in the dark.
- **F2 Lamp** (`hero-f2.html`): centred and monumental. A soft-edged circle of light (CSS mask) visits rabbi, zidnī, ʿilman, then follows the pointer. Words are buttons, so keyboard focus moves the light. "Light up the whole verse" expands the circle to fill the screen; "Back to the lamp" returns it.

Shared: Instrument Serif for the English display lines (Google Fonts in the mockup; self-host it in the build), Geist for interface text, Hafs for the verse, Amiri for the root letters (Hafs draws an isolated ي without dots). New mark: a circle half night, half day, cut by the amber line. GSAP 3.15 runs the intros; reduced motion skips them and shows the resting state.

## Round three (free form, Opus)

| | Idea | The working part |
|---|---|---|
| G | Specimen | عِلْم set huge on a saffron field, with every mark labelled by a drawn leader line. Switch between ʿilm (knowledge), ʿalima (he knew) and ʿallama (he taught): the same three letters with different marks. |
| H | Sentence architecture | The dua as a dependency diagram. Arcs draw from the verb to "my Lord" (calls on), "me" (acts on) and "knowledge" (asks for). The hidden doer "you" sits under the verb. |
| I | The whole Quran in one line | 114 bars, surah 1 on the right. Pick a root (knowledge, mercy, guidance, patience, heart) and see where it appears. Hover or use the arrow keys for each surah's count and length. |

Data for I comes from the Corpus file: 77,429 words in total. ع ل م appears 854 times in 85 surahs, ر ح م 339 in 62, ه د ي 316 in 62, ق ل ب 168 in 48, ص ب ر 103 in 45 (`hero-i-data.js`). The arc labels in H avoid naming ʿilman's disputed role; "the doer hidden inside the verb" is the standard reading of an imperative (ḍamīr mustatir, "anta").

## Round two (built on Opus)

| | Idea | The working part |
|---|---|---|
| D | Lenses | One verse, four lenses: Meaning, Grammar, Roots, Sound. The field colour changes with each lens; one slow tour on load, then it stops. |
| E | First read | Three taps, each a real reading skill: right-to-left, the attached "me" (نِى), the -an ending. Ends with "You just read a verse word by word." |
| F | Recite, then understand | A dark "recited" side and a light "understood" side; drag the line (or use the arrow keys) to reveal meaning and word types. |

New facts used: root ز ي د occurs 61 times; ر ب ب 980; ع ل م 854 (word-lookup data). In D the attached pronoun نِى is coloured as a noun, because Arabic grammar counts pronouns as nouns (ism). At a stop, ʿilman is read ʿilmā (D, Sound lens).

Inspector flags left on D-F are the agreed exceptions (gradient fields, no photographs, hero-only motion), plus F's layered panel, which the inspector reads as "covered text" by design.

## Round one: the three options

| | Idea | Temperament | The working part |
|---|---|---|---|
| A | Exploded verse | Monumental, centred, lots of room | Tap a word. The verb splits into `zid` + `-nī`, the colour field follows your tap. |
| B | Root engine | Split, precise | Three root letters (ع ل م) plus a pattern make a word. Seven patterns, real counts. |
| C | Ask the Quran | A dark working tool inside the light page | Type an English word, get the Arabic, the root, the word family and counts. Four demo words. |

All three use the Oasis tokens from `lesson-steps.css`, the headline "Understand the Holy Quran for Free.", the two on-ramps, and the dua *rabbi zidnī ʿilmā*.

## Checks on the dua (rabbi zidnī ʿilman, 20:114)

Source: Quranic Arabic Corpus v0.4 in `src/data/morphology/` (Tanzil Uthmani text).

| Word | Corpus says | Hero says |
|---|---|---|
| رَبِّ | noun, root ر ب ب, accusative, with attached "my" (the dropped ya) | Noun. The one being called. "my Lord". |
| زِدْنِى | verb, imperative 2nd person masc. sing., root ز ي د, + attached pronoun 1st person singular | Verb, a command. `zid` + `-nī` (me). |
| عِلْمًا | noun, root ع ل م, indefinite, accusative | Noun. "knowledge". The ending -an marks the accusative. |

Decisions to confirm:

1. **Standalone dua.** In the verse the text is `وَقُل رَّبِّ`, with a doubled ر (a merged-letter mark). The mockups show `رَبِّ` without it, because the dua stands alone. The source line says it follows "And say". Decide at build whether to show the exact Tanzil letters.
2. **Role of ʿilman.** Sources differ on whether it is a second object or a "specification" (tamyīz) of the verb. The hero does not name the role, only the case. Check an iʿrāb book before the build names it.
3. **Plain-English meaning** "My Lord, increase me in knowledge" is ours, labelled as a meaning and not a translation. It needs a reader who knows the verse.

## Numbers (from `public/data/word-lookup.json`, Corpus v0.4)

Root ع ل م: 854 occurrences in 14 word families. Counts per family in hero B: ʿilm 105, ʿalima 382, ʿallama 41, ʿālim 18, ʿalīm 163, maʿlūm 11, aʿlam 49. Hero C's other demo words: mercy (root 339, 9 families), guidance (316, 12), book (319, 7). Family names with a leading doubled letter (for example رَّحِيم) are shown without it.

## Inspector (taste-skill, 1440 / 768 / 390)

Zero horizontal overflow at all three widths. Remaining flags, all defended:

- **Gradient** (A stage, B header band): the Oasis colour field. Agreed direction.
- **Thin rules**: real data rows and a table-like readout. They separate data, not decorate.
- **Few pictures, no footage**: no photographs by agreement.
- **Still page**: the mockups hold only the hero. The motion layer belongs to the full page.
- **Font-size count**: hero-only mockups. Tidy when the shared type scale is set in the build.
- **Eyebrow** (a small line above Arabic): a false positive on "Free. No sign-up. No ads." and the "Open the full entry" link.

## GSAP

None of the three needed it. Everything is CSS transitions, `@property` and a few lines of script. A real timeline would help in B (letters flying into the pattern slots) and A (a scripted "scan" of the three words). Decide after you pick.

## Not done yet

Returning-learner "Continue" state, the sections under the hero, the real Astro build, and a tablet-width review by eye (768 screenshots exist in `shots/`).
