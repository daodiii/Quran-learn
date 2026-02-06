# Style Guide: Quranic Arabic Grammar Lessons

**Purpose:** This document defines the formatting standards, lesson template structure, and writing conventions for all 73 Quranic Arabic grammar lessons. Every lesson author must follow these standards to ensure consistency, accessibility, and pedagogical effectiveness.

This style guide is the single source of truth for:
- Lesson structure and organization
- Arabic text formatting and transliteration
- MDX component usage
- Verse reference formatting
- Cross-referencing between lessons

All standards documented here are enforced programmatically by validation scripts in the `scripts/` directory.

---

## 1. Lesson Template Structure

Every lesson MUST follow this 5-part structure (per LSSN-06):

### Part 1: Introduction (1-2 paragraphs)

**Purpose:** Hook the learner and set clear expectations

**Components:**
- **Hook:** Start with a real Quranic example showing the concept in action
  - Use an ArabicExample component with a familiar verse
  - Highlight the grammatical feature being introduced
  - Make it immediately relevant to Quranic reading

- **Learning Objectives:** 2-3 bullet points stating what learners will master
  - Start each with an action verb: "Recognize...", "Identify...", "Apply..."
  - Be specific and measurable
  - Connect to prior knowledge when applicable

- **Connection to Previous Lesson:** Explicit link showing learning progression (per PDGY-06)
  - Reference the specific prior lesson: "In [Lesson X](/learn/level-N/slug), we learned..."
  - Explain how this lesson builds on that foundation
  - Preview how concepts connect forward

**Example:**
```markdown
In Surah Al-Fatiha, the opening verse begins with a noun phrase that establishes the subject before making a statement about it:

<ArabicExample
  arabic="ٱلْحَمْدُ لِلَّهِ"
  transliteration="al-ḥamdu li-llāhi"
  translation="All praise is for Allah"
  reference="Al-Fatiha 1:2"
  highlight="ٱلْحَمْدُ"
/>

This structure — where a noun comes first — is called a **nominal sentence**. In this lesson, you'll learn:

- How to recognize nominal sentences in Quranic verses
- The two essential parts: subject (mubtadaʾ) and predicate (khabar)
- How word order affects meaning and emphasis

In [Lesson 1.11](/learn/level-1/grammatical-analysis), we learned about iʿrāb (grammatical analysis) and case endings. Now we'll apply that knowledge to understand how nominal sentences use the nominative case for both their parts.
```

### Part 2: Concept Explanation (2-3 paragraphs)

**Purpose:** Build understanding from familiar to unfamiliar

**Sequence (CRITICAL - follow this exact order):**

1. **Plain English explanation FIRST** (per PDGY-01)
   - No Arabic terminology yet
   - Use everyday language
   - Focus on the grammatical function
   - Make it relatable

2. **English analogy** (per PDGY-02)
   - "Think of X like English Y..."
   - Bridge from known grammar (English) to new concept (Arabic)
   - Acknowledge differences after establishing similarity

3. **Introduce Arabic terminology LAST** (per PDGY-03)
   - Use full bilingual format on first mention: "English (transliteration / عَرَبِي)"
   - Link to glossary: `[Subject](/resources/glossary#mubtada) (mubtadaʾ / مُبْتَدَأ)`
   - Use EXACT terms from TERMINOLOGY.md (validation enforced)

4. **One major concept only** (per PDGY-08)
   - Resist the urge to explain related concepts
   - Keep focus narrow and deep
   - Reference other lessons for tangential topics

**Example:**
```markdown
A nominal sentence makes a statement by starting with a noun and then saying something about that noun. It's like saying "The book is new" in English — you name something first, then describe it or state where it is.

Think of it like English sentences that begin with "The X is..." or "My Y has...". In both languages, you're establishing what you're talking about before making your point. The key difference is that Arabic doesn't need the word "is" — the two nouns placed side-by-side create the meaning automatically.

In Arabic grammar, this structure is called [nominal sentence](/resources/glossary#jumlah-ismiyyah) (jumlah ismiyyah / جُمْلَة اِسْمِيَّة). It has two essential parts:

1. The [subject](/resources/glossary#mubtada) (mubtadaʾ / مُبْتَدَأ) — what you're talking about
2. The [predicate](/resources/glossary#khabar) (khabar / خَبَر) — what you're saying about it

Both parts take the nominative case (rafʿ / رَفْع), marked with dammah (ـُ).
```

### Part 3: Examples Section (3-5 examples)

**Purpose:** Show patterns before stating abstract rules (per PDGY-04)

**Requirements:**
- Use `<ArabicExample>` component for all Quranic verses
- Show pattern progression: simple → complex
- Include word-by-word breakdown for key examples (per PDGY-07)
- All Arabic text MUST be fully vocalized with tashkeel (per LSSN-07)
- Highlight the grammatical feature being taught
- Provide transliteration according to level (see Section 3 below)

**Example:**
```markdown
Let's examine nominal sentences from the Quran:

**Example 1: Simple subject-predicate**

<ArabicExample
  arabic="ٱللَّهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ"
  transliteration="Allāhu nūru s-samāwāti wa-l-arḍi"
  translation="Allah is the Light of the heavens and the earth"
  reference="An-Nur 24:35"
  highlight="ٱللَّهُ نُورُ"
/>

**Breakdown:**
- **Subject (mubtadaʾ):** ٱللَّهُ (Allāhu) - "Allah" - nominative with dammah
- **Predicate (khabar):** نُورُ (nūru) - "light" - nominative with dammah

Notice how both parts end with dammah (ـُ), the nominative case marker.

**Example 2: Definite subject and predicate**

<ArabicExample
  arabic="ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ"
  transliteration="al-ḥamdu li-llāhi rabbi l-ʿālamīna"
  translation="All praise is for Allah, Lord of all worlds"
  reference="Al-Fatiha 1:2"
  highlight="ٱلْحَمْدُ"
/>

**Breakdown:**
- **Subject:** ٱلْحَمْدُ (al-ḥamdu) - "the praise" - definite with ال
- **Predicate:** لِلَّهِ (li-llāhi) - "for Allah" - prepositional phrase acting as predicate
```

### Part 4: Grammar Rule (Callout component, type="rule")

**Purpose:** Concise statement of the pattern just demonstrated

**Requirements:**
- Use `<Callout type="rule">` component
- State rule clearly in 1-3 sentences
- Reference related lessons (per PDGY-06)
- Include "Common Mistakes" section (per PDGY-05)

**Example:**
```markdown
<Callout type="rule" title="Nominal Sentence Structure">

A nominal sentence (جُمْلَة اِسْمِيَّة) consists of two parts, both in the nominative case:

1. **Subject (mubtadaʾ / مُبْتَدَأ)** - the topic being discussed
2. **Predicate (khabar / خَبَر)** - information about the topic

The predicate can be a noun, adjective, or prepositional phrase. No "is" verb is needed.

**Related:** [Lesson 2.04: Nominative Case](/learn/level-2/nominative-case)

</Callout>

<Callout type="warning" title="Common Mistakes">

**Don't assume word order is flexible.** While Arabic allows some variation, the standard nominal sentence begins with the subject. Changing order changes emphasis (see [Lesson 5.05: Fronting & Postponing](/learn/level-5/word-order)).

**Don't add a verb.** English speakers often want to insert "is" — resist this! In Arabic, ٱللَّهُ نُورُ literally means "Allah light" and the relationship is understood.

</Callout>
```

### Part 5: Practice Exercises (3-4 exercises per LSSN-10)

**Purpose:** Active recall and application

**Requirements:**
- Use `<ExerciseBox>` component for each exercise
- Progressive difficulty within the set
- Provide answer **explanations**, not just answers
- Include iʿrāb analysis for key exercises (per LSSN-09)
- Mix question types: identification, analysis, production

**Example:**
```markdown
<ExerciseBox question="Identify the subject (mubtadaʾ) and predicate (khabar) in this verse: ٱللَّهُ سَمِيعٌ عَلِيمٌ">

**Answer:**

- **Subject (mubtadaʾ):** ٱللَّهُ (Allāhu) — "Allah"
- **Predicate (khabar):** سَمِيعٌ عَلِيمٌ (samīʿun ʿalīmun) — "All-Hearing, All-Knowing"

**Analysis:** Both parts are nominative (rafʿ). The subject is definite (proper name), while the predicate consists of two indefinite adjectives with tanween (-un).

</ExerciseBox>

<ExerciseBox question="Why does this sentence use the nominative case for both parts?">

**Answer:**

Nominal sentences follow the rule that both the subject and predicate take the nominative case (rafʿ / رَفْع). This is because:

1. The subject (mubtadaʾ) is always nominative — it's the default case for the topic
2. The predicate (khabar) agrees with the subject in case

This differs from verbal sentences, where the subject is nominative but the object is accusative.

**Related:** See [Lesson 2.04: Nominative Case](/learn/level-2/nominative-case) for the full case system.

</ExerciseBox>
```

### Complete MDX Template

Every lesson file should start with this structure:

```mdx
---
title: "Lesson Title"
level: 2
order: 1
description: "Brief lesson description for SEO"
keywords: ["keyword1", "keyword2", "keyword3"]
---

import ArabicExample from '@components/mdx/ArabicExample.astro';
import GrammarTable from '@components/mdx/GrammarTable.astro';
import VerbConjugation from '@components/mdx/VerbConjugation.astro';
import Callout from '@components/mdx/Callout.astro';
import ExerciseBox from '@components/mdx/ExerciseBox.astro';

## Introduction

[Hook with Quranic example...]

[Learning objectives...]

[Connection to previous lesson...]

## Understanding [Concept Name]

[Plain English explanation...]

[English analogy...]

[Arabic terminology introduction...]

## Examples from the Quran

[3-5 examples using ArabicExample component...]

## The Rule

<Callout type="rule" title="...">
[Concise rule statement...]
</Callout>

<Callout type="warning" title="Common Mistakes">
[Typical errors to avoid...]
</Callout>

## Practice

<ExerciseBox question="...">
[Answer with explanation...]
</ExerciseBox>

[3-4 total exercises...]

## Related Lessons

- [Previous lesson title](/learn/level-N/slug)
- [Next lesson title](/learn/level-N/slug)
- [Related advanced topic](/learn/level-N/slug)
```

---

## 2. Transliteration Scheme

We use **simplified ALA-LC romanization** — designed for reader accessibility, not linguistic precision.

### Consonants

| Letter | Name | Transliteration | Notes |
|--------|------|-----------------|-------|
| ء | hamza | ʾ | Apostrophe-like mark (not regular apostrophe) |
| ا | alif | ā (long), a (short) | Long vowel when has maddah/sukun |
| ب | ba | b | |
| ت | ta | t | |
| ث | tha | th | Like "th" in "think" |
| ج | jim | j | |
| ح | ha (emphatic) | ḥ | **h with underdot** — distinct from ه |
| خ | kha | kh | Like "ch" in German "Bach" |
| د | dal | d | |
| ذ | dhal | dh | Like "th" in "this" |
| ر | ra | r | Rolled r |
| ز | zay | z | |
| س | sin | s | |
| ش | shin | sh | Like "sh" in "shoe" |
| ص | sad | ṣ | **s with underdot** — emphatic s |
| ض | dad | ḍ | **d with underdot** — emphatic d |
| ط | ta (emphatic) | ṭ | **t with underdot** — emphatic t |
| ظ | za (emphatic) | ẓ | **z with underdot** — emphatic z |
| ع | ayn | ʿ | Pharyngeal sound (distinct from ʾ hamza) |
| غ | ghayn | gh | Like French "r" |
| ف | fa | f | |
| ق | qaf | q | Deep "k" sound from throat |
| ك | kaf | k | |
| ل | lam | l | |
| م | mim | m | |
| ن | nun | n | |
| ه | ha | h | Regular h (distinct from ḥ) |
| و | waw | w, ū (long) | Consonant w or long vowel ū |
| ي | ya | y, ī (long) | Consonant y or long vowel ī |

**Special characters needed:**
- **Underdot** (ḥ, ṣ, ḍ, ṭ, ẓ) — for emphatic consonants
- **Macron** (ā, ī, ū) — for long vowels
- **Modifier letters** (ʾ for hamza, ʿ for ayn)

**Note on hamza vs ayn:**
- **ʾ** (U+02BE MODIFIER LETTER RIGHT HALF RING) = hamza ء
- **ʿ** (U+02BF MODIFIER LETTER LEFT HALF RING) = ayn ع

Do NOT use regular apostrophe (') for either — use the proper Unicode characters.

### Vowels

| Haraka | Name | Short | Long | Example (Short) | Example (Long) |
|--------|------|-------|------|-----------------|----------------|
| ـَ | fatha | a | ā | كَتَبَ (kataba) | كَاتِب (kātib) |
| ـِ | kasra | i | ī | عِلْم (ʿilm) | دِين (dīn) |
| ـُ | damma | u | ū | نُور (nūr) | نُوح (Nūḥ) |

**Long vowels** occur when:
- Fatha + alif = ā (كَا)
- Kasra + ya = ī (كِي)
- Damma + waw = ū (كُو)

### Special Marks

| Mark | Name | Transliteration | Example |
|------|------|-----------------|---------|
| ـْ | sukun | (omit) | مَكْتَب = maktab (not makotab) |
| ـّ | shadda | double letter | مُحَمَّد = Muḥammad |
| ـً | fathatain | -an | كِتَابًا = kitāban |
| ـٍ | kasratain | -in | كِتَابٍ = kitābin |
| ـٌ | dammatain | -un | كِتَابٌ = kitābun |

### Definite Article (al-)

The definite article ال is ALWAYS transliterated as **al-** (lowercase, hyphenated), even before sun letters where it assimilates in pronunciation.

**Written:**
- الشَّمْس (the sun) → **al-shams** (not ash-shams)
- الْقَمَر (the moon) → **al-qamar**

**Rationale:** Transliteration shows written form, not pronunciation. This keeps it simple and consistent.

**Exception:** When al- appears mid-word after a preposition:
- لِلَّهِ → li-llāhi (preposition + assimilated al-)

---

## 3. Graduated Transliteration Rules

Transliteration decreases as learners progress (per LSSN-11):

### Level 1-2: Full Transliteration

**Rule:** Transliterate ALL Arabic text

**Rationale:** Learners are still mastering reading. Full transliteration supports pronunciation and builds confidence.

**Example:**
```markdown
<ArabicExample
  arabic="ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ"
  transliteration="al-ḥamdu li-llāhi rabbi l-ʿālamīna"
  translation="All praise is for Allah, Lord of all worlds"
  reference="Al-Fatiha 1:2"
/>
```

### Level 3: Partial Transliteration

**Rule:** Transliterate only NEW or DIFFICULT words. Familiar terms can be Arabic-only.

**"Familiar" definition:** Any word/phrase that appeared in Level 1-2 lessons.

**Examples of familiar (no transliteration needed):**
- بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ (basmala)
- ٱلْحَمْدُ لِلَّهِ (alhamdulillah)
- Common particles: وَ، فَ، لِ، بِ
- Pronouns: أَنَا، هُوَ، نَحْنُ

**Example:**
```markdown
<ArabicExample
  arabic="وَمَا تَشَاءُونَ إِلَّا أَن يَشَاءَ ٱللَّهُ"
  transliteration="wa-mā tashāʾūna illā an yashāʾa llāhu"
  translation="But you cannot will ˹to do so˺ unless Allah wills"
  reference="Al-Insan 76:30"
/>
```

Mark only the new difficult word in the transliteration field, or provide selective transliteration in lesson text.

### Level 4-5: Minimal Transliteration

**Rule:** Transliterate only TECHNICAL GRAMMAR TERMS. Quranic verses in Arabic only.

**Rationale:** Advanced learners can read Arabic fluently. Transliteration is now distracting rather than helpful.

**Example:**
```markdown
<ArabicExample
  arabic="قُلْ هُوَ ٱللَّهُ أَحَدٌ"
  translation="Say: He is Allah, the One"
  reference="Al-Ikhlas 112:1"
/>
```

No transliteration property provided.

**But still transliterate grammar terms in lesson text:**
```markdown
The subject (fāʿil / فَاعِل) always takes the nominative case (rafʿ / رَفْع).
```

---

## 4. Verse Reference Format

**Standard format:** `[Surah Name Chapter:Verse]`

### Rules

1. **Always include surah name AND chapter number**
   - ✅ `[Al-Fatiha 1:2]`
   - ❌ `[Surah 1:2]` — missing name
   - ❌ `[Al-Fatiha 2]` — missing colon separator

2. **Use colon separator** for chapter:verse
   - ✅ `[Al-Baqarah 2:255]`
   - ❌ `[Al-Baqarah 2.255]` — wrong separator
   - ❌ `[Al-Baqarah, verse 255]` — verbose

3. **For verse ranges**, use hyphen
   - ✅ `[Al-Fatiha 1:1-7]`
   - ✅ `[Al-Baqarah 2:255-256]`

4. **Surah names** use standard English transliteration
   - Use hyphens: Al-Baqarah, An-Nas, Al-ʿAsr
   - Capitalize after hyphens
   - Include "Al-" prefix where applicable

### Common Surah Names (Examples)

Full list in `data/quran/surah-names.json`. Examples:

| Number | English Name | Arabic Name |
|--------|--------------|-------------|
| 1 | Al-Fatiha | ٱلْفَاتِحَة |
| 2 | Al-Baqarah | ٱلْبَقَرَة |
| 3 | Al-ʿImran | آل عِمْرَان |
| 4 | An-Nisa | ٱلنِّسَاء |
| 5 | Al-Maʾidah | ٱلْمَائِدَة |
| 6 | Al-Anʿam | ٱلْأَنْعَام |
| 18 | Al-Kahf | ٱلْكَهْف |
| 24 | An-Nur | ٱلنُّور |
| 36 | Ya-Sin | يٰسٓ |
| 55 | Ar-Rahman | ٱلرَّحْمَٰن |
| 67 | Al-Mulk | ٱلْمُلْك |
| 112 | Al-Ikhlas | ٱلْإِخْلَاص |
| 113 | Al-Falaq | ٱلْفَلَق |
| 114 | An-Nas | ٱلنَّاس |

**Note:** See `data/quran/surah-names.json` for the complete list of all 114 surahs with standard transliterations.

---

## 5. Arabic Text Formatting

### Typography Standards

| Property | Value | Rationale |
|----------|-------|-----------|
| **Font family (grammar text)** | `'Amiri', 'Traditional Arabic', serif` | Amiri: scholarly, readable, good diacritics support |
| **Font family (Quranic text)** | `'Uthmanic Hafs', 'Amiri', serif` | Uthmanic: matches printed Mushaf style |
| **Letter spacing** | `letter-spacing: 0` | **CRITICAL** — prevents Arabic letter disconnection |
| **Line height** | `line-height: 1.8` (minimum) | Clearance for diacritics above/below letters |
| **Font size** | `1.25rem` minimum (22.5px @ 18px base) | Legibility for complex diacritics |
| **Direction** | `dir="rtl"` | Right-to-left text flow |
| **Language** | `lang="ar"` | Screen reader pronunciation |

### Diacritics Requirement

**Every Arabic letter MUST have a diacritical mark** (per LSSN-07).

**Required marks:**
- Fatha (ـَ), kasra (ـِ), damma (ـُ) on voweled letters
- Sukun (ـْ) on vowelless letters
- Shadda (ـّ) on doubled consonants
- Tanween (ـً، ـٍ، ـٌ) on nunated endings

**No exceptions.** Quranic Arabic without full tashkeel is ambiguous. Validation scripts will flag incomplete diacritics.

### CSS Implementation

Applied automatically by MDX components, but for reference:

```css
[lang="ar"] {
  font-family: var(--font-arabic); /* Amiri */
  letter-spacing: 0; /* NEVER override this */
  line-height: 1.8;
  font-size: 1.25rem;
  direction: rtl;
}

.quran-text {
  font-family: 'Uthmanic Hafs', var(--font-arabic);
  font-size: 1.5rem;
  line-height: 2;
}
```

---

## 6. MDX Component Usage Reference

### ArabicExample

**When to use:** Displaying Quranic verses or Arabic example sentences

**Props:**
- `arabic` (required) — Fully vocalized Arabic text
- `translation` (required) — English meaning
- `transliteration` (optional) — Romanized text (per graduated rules)
- `reference` (optional) — Verse reference in standard format
- `highlight` (optional) — Comma-separated Arabic words to highlight

**Example:**
```mdx
<ArabicExample
  arabic="قُلْ هُوَ ٱللَّهُ أَحَدٌ"
  transliteration="qul huwa llāhu aḥadun"
  translation="Say: He is Allah, the One"
  reference="Al-Ikhlas 112:1"
  highlight="ٱللَّهُ"
/>
```

### GrammarTable

**When to use:** Paradigm tables (case endings, pronoun charts, declension patterns)

**Props:**
- `headers` (required) — Array of column headers
- `rows` (required) — Array of arrays (each inner array is a row)
- `caption` (optional) — Table title
- `rtl` (optional) — Direction (default: true)

**Example:**
```mdx
<GrammarTable
  caption="Case Markers"
  headers={["Case", "Arabic", "Transliteration", "Marker"]}
  rows={[
    ["Nominative", "رَفْع", "rafʿ", "ـُ (dammah)"],
    ["Accusative", "نَصْب", "naṣb", "ـَ (fathah)"],
    ["Genitive", "جَرّ", "jarr", "ـِ (kasrah)"],
  ]}
/>
```

### VerbConjugation

**When to use:** Displaying verb paradigms with morphological information

**Props:**
- `root` (required) — Arabic root letters (e.g., "ك ت ب")
- `headers` (required) — Column headers
- `rows` (required) — Conjugation data
- `form` (optional) — Verb form (e.g., "Form I", "Form II")
- `pattern` (optional) — Morphological pattern (e.g., "فَعَلَ")

**Example:**
```mdx
<VerbConjugation
  root="ك ت ب"
  form="Form I"
  pattern="فَعَلَ"
  headers={["Person", "Past", "Present"]}
  rows={[
    ["He", "كَتَبَ", "يَكْتُبُ"],
    ["She", "كَتَبَتْ", "تَكْتُبُ"],
    ["They (m)", "كَتَبُوا", "يَكْتُبُونَ"],
  ]}
/>
```

### Callout

**When to use:** Highlighted information boxes (rules, tips, warnings, notes)

**Types:**
- `type="rule"` — Grammar rules (amber border, default title: "Grammar Rule")
- `type="tip"` — Helpful hints (purple border, default title: "Tip")
- `type="note"` — Additional information (blue border, default title: "Note")
- `type="warning"` — Common mistakes (red border, default title: "Common Mistake")

**Props:**
- `type` (optional) — One of: note, tip, rule, warning (default: note)
- `title` (optional) — Custom title (overrides default)

**Example:**
```mdx
<Callout type="rule" title="Subject-Verb Agreement">
In verbal sentences, the verb agrees with the subject in gender, but not always in number. When the verb comes BEFORE the subject, it stays singular even if the subject is plural.
</Callout>

<Callout type="warning">
Don't confuse the accusative marker (fathah ـَ) with the nominative (dammah ـُ). They look similar when handwritten but are distinct vowel sounds.
</Callout>
```

### ExerciseBox

**When to use:** All practice exercises (the ONLY interactive MDX component)

**Props:**
- `question` (required) — Exercise question/prompt
- `id` (optional) — Unique ID (auto-generated if omitted)

**Content:** Answer explanation goes in the slot (between tags). Use markdown formatting, nested components (ArabicExample, Callout) are supported.

**Example:**
```mdx
<ExerciseBox question="What case is the word ٱللَّهُ in this verse: ٱلْحَمْدُ لِلَّهِ">

**Answer:** Genitive (jarr / جَرّ)

**Explanation:** The word ٱللَّهُ (Allah) is preceded by the preposition لِ (li-), which always triggers the genitive case. You can see the kasrah (ـِ) ending: لِلَّهِ (li-llāhi).

<ArabicExample
  arabic="ٱلْحَمْدُ لِلَّهِ"
  translation="All praise is for Allah"
  reference="Al-Fatiha 1:2"
  highlight="لِلَّهِ"
/>

The preposition لِ (li-) means "for" or "to" and is one of the genitive particles (حُرُوف الجَرّ).

</ExerciseBox>
```

---

## 7. Cross-Reference Format

### Inline References

**Format:** `As we learned in [Lesson Title](/learn/level-N/slug), ...`

**Example:**
```markdown
As we learned in [Lesson 1.11: Grammatical Analysis](/learn/level-1/grammatical-analysis), Arabic uses case endings to show grammatical function.
```

### "See Also" Section

Add at the end of the lesson before practice exercises:

```markdown
## Related Lessons

**Prerequisites:**
- [Lesson 1.10: Definite and Indefinite](/learn/level-1/definite-indefinite) — Understanding maʿrifah vs nakirah
- [Lesson 2.04: Nominative Case](/learn/level-2/nominative-case) — The rafʿ case marker

**Build on this:**
- [Lesson 2.10: Inna and Sisters](/learn/level-2/inna-sisters) — Particles that modify nominal sentences
- [Lesson 5.05: Fronting & Postponing](/learn/level-5/word-order) — How word order changes emphasis
```

### Link Format

All lesson links follow this structure:
```
/learn/level-{N}/{slug}
```

Where:
- `{N}` = Level number (1-5)
- `{slug}` = URL-friendly lesson identifier (kebab-case)

**Examples:**
- `/learn/level-1/arabic-alphabet`
- `/learn/level-2/nominal-sentences`
- `/learn/level-3/verb-forms`

---

## 8. Validation & Quality Assurance

All lessons will be validated by automated scripts before publication:

### Validation Checks

1. **Diacritics completeness** (`scripts/validate-diacritics.ts`)
   - Every Arabic letter has a haraka mark
   - Ratio of diacritics to letters ≥ 0.7

2. **Terminology consistency** (`scripts/validate-terminology.ts`)
   - First-mention format used: "English (transliteration / عَرَبِي)"
   - Terms match TERMINOLOGY.md exactly
   - Glossary links on first mention

3. **Verse reference format** (`scripts/validate-verses.ts`)
   - Format: `[Surah Name Chapter:Verse]`
   - Valid surah numbers (1-114)
   - Valid verse ranges

4. **Component usage** (`scripts/validate-components.ts`)
   - All required imports present
   - Props match component interfaces
   - No deprecated components

5. **Markdown structure** (markdownlint)
   - Frontmatter present and valid
   - Headings hierarchical (no skipped levels)
   - Code blocks properly fenced
   - No trailing whitespace

### Running Validation

```bash
# Validate all lessons
npm run validate

# Validate specific lesson
npm run validate -- src/content/lessons/level-1/01-alphabet.mdx

# Auto-fix formatting issues
npm run validate:fix
```

All validation must pass before a lesson can be merged to main.

---

## 9. Writing Tips

### Do's

✅ **Start with a Quranic example** — Make every concept immediately relevant
✅ **Use everyday language** — "The word that does the action" before "fāʿil"
✅ **Show patterns first** — 3 examples before stating the rule
✅ **Provide word-by-word breakdowns** — Help learners see the structure
✅ **Reference related lessons** — Build the learning network
✅ **Include common mistakes** — Prevent predictable errors

### Don'ts

❌ **Don't use Arabic-only without English** — Always provide English context
❌ **Don't skip transliteration at L1-2** — Learners are still building fluency
❌ **Don't introduce multiple concepts** — One lesson, one major idea
❌ **Don't assume prior knowledge** — Link to prerequisite lessons explicitly
❌ **Don't use inconsistent terminology** — Stick to TERMINOLOGY.md
❌ **Don't omit diacritics** — Every letter needs full tashkeel

### Tone & Voice

- **Encouraging, not intimidating** — "You'll learn..." not "You must master..."
- **Clear, not academic** — Plain English explanations before technical terms
- **Practical, not theoretical** — Always ground in Quranic examples
- **Progressive, not overwhelming** — Small steps, frequent reinforcement

---

## Appendix: Example Lesson

See `docs/examples/lesson-template-complete.mdx` for a full example lesson following all standards in this guide.

---

**Version:** 1.0
**Last updated:** 2026-02-06
**Maintained by:** Curriculum Planning Team
**Validation:** Enforced by scripts in `scripts/validate-*.ts`
