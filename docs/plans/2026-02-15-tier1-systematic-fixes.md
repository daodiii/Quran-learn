# Tier 1 Systematic Fixes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix ~234 broken component instances (ExerciseBox props, Callout types, nested details/summary) across ~45 lesson files.

**Architecture:** Parallel subagents grouped by fix pattern. Each agent handles a non-overlapping set of files with clear transformation rules. Two waves — Wave 1 has no file overlap, Wave 2 handles files that might overlap with Wave 1 Callout fixes.

**Tech Stack:** Astro MDX content files, Edit tool for transformations, `npm run build` for verification.

---

## Wave 1 — Tasks 1-5 (all run in parallel)

### Task 1: Fix Invalid Callout Types (T1-02)

**Files to modify (22 files):**
- `src/content/lessons/level-3/12-verb-form-iv.mdx` (2 instances of `type="insight"`)
- `src/content/lessons/level-3/15-verb-forms-vii-x.mdx` (1 instance of `type="insight"`)
- `src/content/lessons/level-3/16-active-passive-participles.mdx` (2 instances of `type="insight"`)
- `src/content/lessons/level-3/17-verbal-nouns.mdx` (1 instance of `type="insight"`)
- `src/content/lessons/level-3/18-nouns-place-time.mdx` (1 instance of `type="insight"`)
- `src/content/lessons/level-4/05-exception-particles.mdx` (1 instance of `type="insight"`)
- `src/content/lessons/level-4/06-emphasis-affirmation.mdx` (2 instances of `type="insight"`)
- `src/content/lessons/level-4/07-maf-ul-mutlaq.mdx` (1 instance of `type="insight"`)
- `src/content/lessons/level-4/08-maf-ul-li-ajlih.mdx` (1 instance of `type="insight"`)
- `src/content/lessons/level-4/09-maf-ul-ma-ah.mdx` (2 instances of `type="insight"`)
- `src/content/lessons/level-4/11-weak-verbs-intro.mdx` (1 instance of `type="info"`)
- `src/content/lessons/level-4/12-hollow-verbs.mdx` (2 instances of `type="info"`)
- `src/content/lessons/level-4/13-defective-verbs.mdx` (2 instances of `type="info"`)
- `src/content/lessons/level-4/14-assimilated-verbs.mdx` (2 instances of `type="info"`)
- `src/content/lessons/level-4/15-hamzated-verbs.mdx` (1 instance of `type="info"`)
- `src/content/lessons/level-4/16-intro-balagha.mdx` (1 instance of `type="info"`)
- `src/content/lessons/level-5/02-surah-al-fatiha.mdx`
- `src/content/lessons/level-5/03-ayat-al-kursi.mdx`
- `src/content/lessons/level-5/04-surah-al-ikhlas.mdx`
- `src/content/lessons/level-5/05-surah-al-falaq-an-nas.mdx`
- `src/content/lessons/level-5/06-juz-amma-patterns.mdx`
- `src/content/lessons/level-5/08-oath-formulas.mdx`
- `src/content/lessons/level-5/11-dialogue-patterns.mdx`

**Transformation rules — exact string replacements using `replace_all: true`:**

```
type="info"     →  type="note"
type="insight"  →  type="tip"
type="advanced" →  type="warning"
type="context"  →  type="note"
type="milestone" → type="tip"
type="example"  →  type="tip"
```

**Step 1:** For each file, use Edit tool with `replace_all: true` to replace each invalid type string.

**Step 2:** Verify no invalid types remain: `grep -rn 'type="info"\|type="insight"\|type="advanced"\|type="context"\|type="milestone"\|type="example"' src/content/lessons/`

**Step 3:** Commit:
```bash
git add src/content/lessons/
git commit -m "fix(lessons): replace invalid Callout type props across L3-L5

Replace type=\"info\" → type=\"note\", type=\"insight\" → type=\"tip\",
and other invalid Callout types. The Callout component only accepts
note, tip, rule, and warning.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Fix Pattern B ExerciseBox — L1+L2 (title/difficulty + nested details)

**Files:**
- `src/content/lessons/level-1/10-simple-sentences.mdx` (4 exercises)
- `src/content/lessons/level-1/11-case-endings.mdx` (4 exercises)
- `src/content/lessons/level-2/10-inna-sisters.mdx` (4 exercises)
- `src/content/lessons/level-2/11-kaana-sisters.mdx` (4 exercises)

**Current pattern:**
```jsx
<ExerciseBox title="Exercise 1: Some Title" difficulty="beginner">
Content with exercise prompt...

<details>
<summary>Show Answer</summary>

Answer content here...

</details>
</ExerciseBox>
```

**Target pattern:**
```jsx
<ExerciseBox question="Exercise 1: Some Title">

Answer content here...

</ExerciseBox>
```

**Transformation for each ExerciseBox instance:**
1. Replace `<ExerciseBox title="..."` with `<ExerciseBox question="..."`
2. Remove ` difficulty="beginner"` (or `"intermediate"` etc.)
3. Move the content BEFORE `<details>` into the `question` prop value (append it)
4. Delete `<details>`, `<summary>Show Answer</summary>`, and `</details>` lines
5. Keep answer content in the slot

**IMPORTANT:** The exercise prompt text that's currently between the opening tag and `<details>` needs to become part of the `question` prop string, OR remain as slot content above the answer. Recommended: keep it as slot content since `question` is rendered as a heading and the prompt text may be long/formatted.

**Revised target:**
```jsx
<ExerciseBox question="Exercise 1: Some Title">

Content with exercise prompt...

**Answer:**

Answer content here...

</ExerciseBox>
```

**Step 1:** Read each file. For each ExerciseBox instance:
- Replace `title=` with `question=`
- Remove `difficulty="..."` prop
- Remove `<details>`, `</details>`, `<summary>Show Answer</summary>` lines
- Keep all content in the slot

**Step 2:** Verify with grep that no `title=` or `difficulty=` remain on ExerciseBox lines in these files.

**Step 3:** Commit:
```bash
git add src/content/lessons/level-1/10-simple-sentences.mdx src/content/lessons/level-1/11-case-endings.mdx src/content/lessons/level-2/10-inna-sisters.mdx src/content/lessons/level-2/11-kaana-sisters.mdx
git commit -m "fix(lessons): fix ExerciseBox props in L1.10-11, L2.10-11

Replace title→question, remove difficulty prop, strip nested
details/summary (ExerciseBox has its own toggle).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Fix Pattern C ExerciseBox — L3 Pronouns/Tenses (level prop)

**Files (7 files, 4 exercises each = 28 instances):**
- `src/content/lessons/level-3/03-past-tense.mdx`
- `src/content/lessons/level-3/04-present-tense.mdx`
- `src/content/lessons/level-3/05-imperative.mdx`
- `src/content/lessons/level-3/06-subject-pronouns.mdx`
- `src/content/lessons/level-3/07-attached-pronouns.mdx`
- `src/content/lessons/level-3/08-demonstrative-pronouns.mdx`
- `src/content/lessons/level-3/09-relative-pronouns.mdx`

**Current pattern:**
```jsx
<ExerciseBox level="beginner" id="past-suffix-identification">
**Exercise 1: Suffix Identification**

Identify the person, gender...
```

**Target pattern:**
```jsx
<ExerciseBox question="Exercise 1: Suffix Identification" id="past-suffix-identification">

Identify the person, gender...
```

**Transformation for each instance:**
1. Remove `level="beginner"` (or `"intermediate"`) prop
2. Extract the exercise title from the first bold line inside the slot (e.g., `**Exercise 1: Suffix Identification**`)
3. Add `question="Exercise 1: Suffix Identification"` prop
4. Remove the `**Exercise N: Title**` line from the slot content (it's now the question prop)
5. Keep the `id` prop

**Step 1:** Read each file. For each ExerciseBox:
- Remove `level="..."` prop
- Find the `**Exercise N: Title**` line in the slot
- Move its text to `question="Exercise N: Title"`
- Delete the bold title line from the slot

**Step 2:** Verify: `grep -n 'level=' src/content/lessons/level-3/0[3-9]*.mdx` returns nothing.

**Step 3:** Commit:
```bash
git add src/content/lessons/level-3/03-past-tense.mdx src/content/lessons/level-3/04-present-tense.mdx src/content/lessons/level-3/05-imperative.mdx src/content/lessons/level-3/06-subject-pronouns.mdx src/content/lessons/level-3/07-attached-pronouns.mdx src/content/lessons/level-3/08-demonstrative-pronouns.mdx src/content/lessons/level-3/09-relative-pronouns.mdx
git commit -m "fix(lessons): fix ExerciseBox props in L3.03-09

Remove invalid level prop, extract exercise title from slot content
into question prop.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Fix Pattern D ExerciseBox — L3 Verb Forms (questions array)

**Files (5 files):**
- `src/content/lessons/level-3/12-verb-form-iv.mdx`
- `src/content/lessons/level-3/15-verb-forms-vii-x.mdx`
- `src/content/lessons/level-3/16-active-passive-participles.mdx`
- `src/content/lessons/level-3/17-verbal-nouns.mdx`
- `src/content/lessons/level-3/18-nouns-place-time.mdx`

**Current pattern:**
```jsx
<ExerciseBox
  title="Exercise 1: Identify Form IV Pattern"
  instructions="For each word, identify whether it's Form IV."
  questions={[
    {
      prompt: "أَنْزَلْنَا (anzalnā) — from Surah Al-Qadr",
      answer: "Form IV. Root: ن-ز-ل."
    },
    {
      prompt: "كَتَبَ (kataba)",
      answer: "NOT Form IV. This is Form I."
    }
  ]}
/>
```

**Target pattern — split each question into its own ExerciseBox:**
```jsx
<ExerciseBox question="Exercise 1: Identify Form IV Pattern — أَنْزَلْنَا (anzalnā) — from Surah Al-Qadr">

For each word, identify whether it's Form IV.

**Answer:** Form IV. Root: ن-ز-ل.

</ExerciseBox>

<ExerciseBox question="Exercise 1 (continued): كَتَبَ (kataba)">

**Answer:** NOT Form IV. This is Form I.

</ExerciseBox>
```

**Alternative (recommended — simpler):** Combine all questions into a single ExerciseBox with the title as question and all Q&A as slot content:

```jsx
<ExerciseBox question="Exercise 1: Identify Form IV Pattern">

For each word, identify whether it's Form IV or not. If Form IV, extract the root.

**1. أَنْزَلْنَا (anzalnā) — from Surah Al-Qadr**

Form IV. Root: ن-ز-ل. Pattern: أَفْعَلْنَا (past, "we" subject). Meaning: "We sent down."

**2. كَتَبَ (kataba)**

NOT Form IV. This is Form I.

</ExerciseBox>
```

**Use the combined approach** — one ExerciseBox per exercise, with all sub-questions and answers in the slot. This is simpler and preserves the exercise grouping.

**Step 1:** Read each file. For each ExerciseBox with `questions={[...]}`:
- Extract `title` value → use as `question` prop
- Extract `instructions` value → place as first line in slot
- For each item in `questions` array: render `prompt` as bold sub-heading, `answer` as answer text
- Remove the entire `questions={[...]}` prop, `title`, and `instructions` props
- Replace self-closing `/>` with open/close tags containing the rendered content

**Step 2:** Verify: `grep -n 'questions={' src/content/lessons/level-3/1[2-8]*.mdx` returns nothing.

**Step 3:** Commit:
```bash
git add src/content/lessons/level-3/12-verb-form-iv.mdx src/content/lessons/level-3/15-verb-forms-vii-x.mdx src/content/lessons/level-3/16-active-passive-participles.mdx src/content/lessons/level-3/17-verbal-nouns.mdx src/content/lessons/level-3/18-nouns-place-time.mdx
git commit -m "fix(lessons): fix ExerciseBox props in L3.12, L3.15-18

Convert questions array pattern to single ExerciseBox with question
prop and all Q&A content in slot.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Fix Pattern D ExerciseBox — L4 Particles (questions array)

**Files (6 files):**
- `src/content/lessons/level-4/05-exception-particles.mdx`
- `src/content/lessons/level-4/06-emphasis-affirmation.mdx`
- `src/content/lessons/level-4/07-maf-ul-mutlaq.mdx`
- `src/content/lessons/level-4/08-maf-ul-li-ajlih.mdx`
- `src/content/lessons/level-4/09-maf-ul-ma-ah.mdx`
- `src/content/lessons/level-4/10-negation-particles.mdx`

**Same transformation as Task 4.** Convert `title`/`instructions`/`questions={[...]}` into `question` prop with all content in slot.

**Step 1:** Same as Task 4 but for L4 files.

**Step 2:** Verify: `grep -n 'questions={' src/content/lessons/level-4/0[5-9]*.mdx src/content/lessons/level-4/10*.mdx` returns nothing.

**Step 3:** Commit:
```bash
git add src/content/lessons/level-4/05-exception-particles.mdx src/content/lessons/level-4/06-emphasis-affirmation.mdx src/content/lessons/level-4/07-maf-ul-mutlaq.mdx src/content/lessons/level-4/08-maf-ul-li-ajlih.mdx src/content/lessons/level-4/09-maf-ul-ma-ah.mdx src/content/lessons/level-4/10-negation-particles.mdx
git commit -m "fix(lessons): fix ExerciseBox props in L4.05-10

Convert questions array pattern to single ExerciseBox with question
prop and all Q&A content in slot.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Wave 2 — Tasks 6-8 (run after Wave 1 completes)

### Task 6: Fix Pattern B ExerciseBox — L5 Set 1 (title/difficulty + nested details)

**Files (12 files):**
- `src/content/lessons/level-5/01-full-irab-analysis.mdx`
- `src/content/lessons/level-5/02-surah-al-fatiha.mdx`
- `src/content/lessons/level-5/03-ayat-al-kursi.mdx`
- `src/content/lessons/level-5/04-surah-al-ikhlas.mdx`
- `src/content/lessons/level-5/05-surah-al-falaq-an-nas.mdx`
- `src/content/lessons/level-5/06-juz-amma-patterns.mdx`
- `src/content/lessons/level-5/07-dua-patterns.mdx`
- `src/content/lessons/level-5/09-prophet-ibrahim-narrative.mdx`
- `src/content/lessons/level-5/10-prophet-musa-narrative.mdx`
- `src/content/lessons/level-5/12-parallelism-repetition.mdx`
- `src/content/lessons/level-5/14-word-order-emphasis.mdx`
- `src/content/lessons/level-5/15-nahw-synthesis.mdx`
- `src/content/lessons/level-5/16-sarf-synthesis.mdx`

**Same transformation as Task 2:** Replace `title`→`question`, remove `difficulty`, strip nested `<details>/<summary>`.

**Step 1-3:** Same process as Task 2.

**Commit:**
```bash
git add src/content/lessons/level-5/
git commit -m "fix(lessons): fix ExerciseBox props in L5.01-07, L5.09-10, L5.12, L5.14-16

Replace title→question, remove difficulty prop, strip nested
details/summary.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 7: Fix Patterns E+F ExerciseBox — L4 Remaining

**Files:**

**Pattern E (L4.03-04):**
- `src/content/lessons/level-4/03-conditional-sentences.mdx`
- `src/content/lessons/level-4/04-conditional-particles.mdx`

Pattern E current:
```jsx
<ExerciseBox
  difficulty="beginner"
  topic="conditional-structure"
  problem="Identify the three parts..."
/>
```

Pattern E target:
```jsx
<ExerciseBox question="Identify the three parts...">

*(No answer content — these exercises are question-only)*

</ExerciseBox>
```

Transformation: `problem`→`question`, remove `difficulty`/`topic`, change self-closing `/>` to open/close tags. NOTE: These have NO answer content (self-closing). The slot can be left empty or contain a brief placeholder.

**Pattern F (L4.11-17):**
- `src/content/lessons/level-4/11-weak-verbs-intro.mdx`
- `src/content/lessons/level-4/12-hollow-verbs.mdx`
- `src/content/lessons/level-4/13-defective-verbs.mdx`
- `src/content/lessons/level-4/14-assimilated-verbs.mdx`
- `src/content/lessons/level-4/15-hamzated-verbs.mdx`
- `src/content/lessons/level-4/16-intro-balagha.mdx`
- `src/content/lessons/level-4/17-figures-of-speech.mdx`

Pattern F current:
```jsx
<ExerciseBox
  title="Exercise 1: Identify Weak Letters"
  instructions="For each root, identify if it contains a weak letter."
>
1. **ن-ز-ل** (n-z-l) "descending"
...
</ExerciseBox>
```

Pattern F target:
```jsx
<ExerciseBox question="Exercise 1: Identify Weak Letters">

For each root, identify if it contains a weak letter.

1. **ن-ز-ل** (n-z-l) "descending"
...
</ExerciseBox>
```

Transformation: `title`→`question`, extract `instructions` value and place as first paragraph in slot, remove `instructions` prop.

**Step 1:** Fix Pattern E files (L4.03-04).
**Step 2:** Fix Pattern F files (L4.11-17).
**Step 3:** Verify no invalid props remain.

**Commit:**
```bash
git add src/content/lessons/level-4/03-conditional-sentences.mdx src/content/lessons/level-4/04-conditional-particles.mdx src/content/lessons/level-4/11-weak-verbs-intro.mdx src/content/lessons/level-4/12-hollow-verbs.mdx src/content/lessons/level-4/13-defective-verbs.mdx src/content/lessons/level-4/14-assimilated-verbs.mdx src/content/lessons/level-4/15-hamzated-verbs.mdx src/content/lessons/level-4/16-intro-balagha.mdx src/content/lessons/level-4/17-figures-of-speech.mdx
git commit -m "fix(lessons): fix ExerciseBox props in L4.03-04, L4.11-17

Pattern E: problem→question, remove difficulty/topic.
Pattern F: title→question, move instructions into slot.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 8: Fix Patterns G+H+I ExerciseBox — L5 Remaining

**Files:**

**Pattern G — L5.08:**
- `src/content/lessons/level-5/08-oath-formulas.mdx`

Current: `question` prop exists (good!) but also has `hint` and `answer` props (ignored).
```jsx
<ExerciseBox
  question="Identify the oath particle..."
  hint="Look for genitive markers..."
  answer="Oath particles: وَ (repeated)..."
/>
```

Target:
```jsx
<ExerciseBox question="Identify the oath particle...">

**Hint:** Look for genitive markers...

**Answer:** Oath particles: وَ (repeated)...

</ExerciseBox>
```

Transformation: Keep `question`, remove `hint`/`answer` props, move their values into slot content. Change `/>` to open/close tags.

**Pattern H — L5.11:**
- `src/content/lessons/level-5/11-dialogue-patterns.mdx`

Current: Many fabricated props, but `question` IS present.
```jsx
<ExerciseBox
  exerciseId="dialogue-patterns-ex1"
  level={5}
  skillType="analysis"
  question="Identify the dialogue type..."
  arabicText="قَالَ رَبِّ ٱجْعَل..."
  reference="Maryam 19:10"
  answerType="open"
  expectedElements={[...]}
/>
```

Target:
```jsx
<ExerciseBox question="Identify the dialogue type and speaker in the following verse: قَالَ رَبِّ ٱجْعَل... (Maryam 19:10)">

**Expected elements:**
- Dialogue type: Narrative (قَالَ appears twice)
- First قَالَ: Zakariyya addressing Allah
...

</ExerciseBox>
```

Transformation: Keep `question` (append arabicText and reference to it), remove ALL other props, move `expectedElements` array items into slot as bullet list.

**Pattern I — L5.13:**
- `src/content/lessons/level-5/13-rhetorical-questions.mdx`

Current:
```jsx
<ExerciseBox
  title="Exercise 1: Identify Interrogative Particles"
  difficulty="guided"
  answer="(a) أَلَمْ — hamza + lam..."
>
Identify the interrogative particle in each verse...
</ExerciseBox>
```

Target:
```jsx
<ExerciseBox question="Exercise 1: Identify Interrogative Particles">

Identify the interrogative particle in each verse...

**Answer:** (a) أَلَمْ — hamza + lam...

</ExerciseBox>
```

Transformation: `title`→`question`, remove `difficulty`, move `answer` prop value into slot at the end.

**Step 1:** Fix L5.08 (Pattern G).
**Step 2:** Fix L5.11 (Pattern H).
**Step 3:** Fix L5.13 (Pattern I).
**Step 4:** Verify no invalid props remain.

**Commit:**
```bash
git add src/content/lessons/level-5/08-oath-formulas.mdx src/content/lessons/level-5/11-dialogue-patterns.mdx src/content/lessons/level-5/13-rhetorical-questions.mdx
git commit -m "fix(lessons): fix ExerciseBox props in L5.08, L5.11, L5.13

Pattern G: remove hint/answer props, move to slot.
Pattern H: remove fabricated props, keep question, move content to slot.
Pattern I: title→question, remove difficulty/answer, move to slot.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Final Verification

**Step 1:** Run build:
```bash
npm run build
```
Expected: 128 pages, 0 errors.

**Step 2:** Verify no invalid ExerciseBox props remain:
```bash
grep -rn 'ExerciseBox' src/content/lessons/ | grep -v 'question=' | grep -v 'import' | grep -v 'id='
```
Expected: No results (every ExerciseBox should have `question=`).

**Step 3:** Verify no invalid Callout types remain:
```bash
grep -rn 'type="info"\|type="insight"\|type="advanced"\|type="context"\|type="milestone"\|type="example"' src/content/lessons/
```
Expected: No results.

**Step 4:** Verify no nested details/summary inside ExerciseBox:
```bash
grep -rn '<details>\|<summary>' src/content/lessons/
```
Expected: No results (or only non-ExerciseBox usage if any).
