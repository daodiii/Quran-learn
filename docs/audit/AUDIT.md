# Part 1 audit: the current learning experience

Date: 2026-10-27. Read-only audit; no site code was changed. Built from commit `140c745` (`main`) and viewed in a headless browser at 1440 px and 390 px.

Raw material in this folder:

- `screenshots/` - desktop and mobile captures, plus `metrics.json` (one row per page and viewport)
- `verse-bank.md` - every Quran example in the lessons, with the lessons that use it
- `lesson-stats.json` - per-lesson counts (words, examples, callouts, exercises, tables)

## What this audit did not cover

- It did not check whether the Arabic or the grammar is correct. That needs a person who knows the material (Part 2 sets up how).
- It did not click through the quizzes and exercises. It saw the quiz start screens only.
- It looked at the light colour scheme only, and at 15 pages. No other lessons were read in full.
- Reference strings in the verse bank are compared as written. Spelling variants of one surah name would count as separate verses.

## Findings

### 1. Lessons are very long single pages

| Page (sampled) | Words in page text | Height on a phone |
|---|---|---|
| L1.04 Three word types | 2,012 | about 22 screens |
| L2.01 Nominal sentence | 2,334 | about 25 screens |
| L3.03 Past tense | 2,986 | about 32 screens |
| L5.03 Ayat al-Kursi | 5,407 | about 60 screens |

"Screens" is page height divided by an 844 px phone viewport. Word counts come from the rendered `main` element, so they include examples, tables and callout text.

Across all 81 lesson files the median file is 3,876 words (this includes MDX markup and Arabic). The longest are L5.03 Ayat al-Kursi (7,695), L4.18 Figures of speech (6,224) and L3.05 Subjunctive and jussive (6,022).

A typical lesson has 7 sections, 7 Quran examples, 4 callout boxes, 4 exercise boxes and 2 tables. The 81 lessons together hold 359 callouts, 353 exercise boxes and 223 tables.

### 2. The opening of a lesson is filler, then a stack of boxes

L2.01 opens with "Welcome to Level 2! This is where your foundation transforms into mastery", with RECOGNIZE and ANALYZE in capitals. A verse example follows. After a list of what you will learn, a "connection to previous learning" paragraph and a "Key Level 2 transition" paragraph, three callouts follow back to back (a tip, a note called "Quick Win", and a "Plain-English key"). The plain-English definitions, the part a beginner needs most, are in the third box.

### 3. The examples repeat

- 679 example blocks use 370 distinct references (10 blocks have no reference).
- 31 references appear in three or more lessons, and 41 in exactly two.
- The most reused: Al-Fatiha 1:2 (14 lessons), Al-Ikhlas 112:1 (14), Al-Fatiha 1:6 (12), Al-Fatiha 1:1 (10), Al-Fatiha 1:5 (9). Verses from Al-Fatiha and Al-Ikhlas account for 102 of the 547 verse-per-lesson uses, about 19%.

So your impression holds in a particular way. The course is not built on three verses, but a small core of the shortest, best-known verses comes back in every level. Some reuse is on purpose: the checkpoint lessons are built around one surah each (L1.11 Al-Ikhlas, L2.12 Al-Kawthar). Part 2 decides where reuse is right.

### 4. Two different looks

| Dark, gold, monospace labels | Light, cream, serif |
|---|---|
| Home, Learn dashboard, every lesson, Surahs list, surah pages, Resources list | Quiz, review, vocabulary, word lookup, verb tool, About |

Measured on the page background: the dark pages are near black (relative luminance 0.002) and the light ones are cream (0.941). Moving from a lesson to its quiz switches the whole site's look. This is what you meant by the quizzes looking worse than the rest: they are a different, thinner design, not a worse version of the same one.

The dark pages are the "tech demo" feeling. Small details add to it: tiny monospace capitals for breadcrumbs, the sidebar and badges; a progress readout ("PROGRESS 0%", "WORDS TOUCHED 0"); a scrolling ticker at the top of the home page.

### 5. Decorative motion

- Home: 29 animations running right after load, GSAP loaded, a drifting particle field and a blur-in headline.
- Learn dashboard: a starfield with "Scroll to begin", a side dot-navigator, and a headline that overlaps a drifting "Foundation" label. The page is about 20,000 px tall at desktop width, and its intro is driven by scrolling.
- Resources: 46 animations running at load.
- Lesson pages: none at rest. The one active element, tap a word to see its breakdown, is functional and should stay.

### 6. Quizzes and review are thin

The level quiz start screen has 37 words of text: "10 questions", "You need 70% or higher to pass", Start Quiz. It does not say which lessons it covers, and it is not linked to the lesson you just finished. A pass mark of 70% already exists, which is close to what you asked for in Part 4. Review and vocabulary pages are the same light design.

### 7. Sources are almost absent from the lessons

Of 81 lessons, at most 3 mention anything that looks like a source in their text (L2.07 has a "Source:" line, L5.06 uses the word "source", L5.16 names Sibawayh). None cites a reference work for its grammar claims. The only visible credit is on the About page: the interactive tools use the Quranic Arabic Corpus (Kais Dukes, GNU GPL). `STATE.md` still lists Tanzil as "needed for verse text authoring".

### 8. Smaller things seen

- The cookie banner sits in the lower left of every page. On a phone it covers the first example.
- On a phone, L2.01's first Arabic example starts at the bottom of the first screen, partly under the cookie banner, because the title, description and introduction come first. I only checked this on L2.01.
- The word-lookup tool and verb tool use the light page background (measured), unlike the lessons. I did not review their layout in detail.
- The project's Playwright tests ask for a browser build that is not installed on this machine (1208; 1193 and 1243 are). I ran the audit with the 1243 build. The a11y and font tests will need `npx playwright install` before use.

## What this means for the plan

1. The new template should lead with a single plain statement of what the learner will be able to do, then the first example, then the rule. The "welcome" paragraphs and boxes of connections can go or move to the end.
2. Fixing the split between dark lessons and light quizzes is a design decision for Part 3. The light pages (tools, quiz) are closer to the target, so the mockups should start from them rather than from the dark lessons.
3. Reuse of Al-Fatiha and Al-Ikhlas should be reviewed lesson by lesson. The verse bank is the list to work from.
4. The sources report (Part 2) needs to give the lessons something to cite. Right now there is nothing in place to point to except the Corpus.
5. The existing 70% quiz mark is a useful starting point for the mastery gate.
