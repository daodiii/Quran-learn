# Technology Stack: Lesson Content Creation

**Project:** Quran Learn - Arabic Grammar Lesson Content (v1.1)
**Researched:** 2026-02-06
**Confidence:** HIGH (Astro 5 + MDX patterns), MEDIUM (Arabic grammar pedagogy)

## Executive Summary

This is a **content creation milestone**, not a feature milestone. The platform (Astro 5.x + MDX) is already shipping. We need minimal stack additions focused on:

1. **Content schema validation** (content.config.ts) to prevent authoring errors
2. **MDX components for grammar display** (example blocks, conjugation tables, exercises)
3. **NO new integrations or plugins** - keep it simple

**Philosophy: Semantic HTML + CSS over complex components.** Arabic text rendering already works. Tables and blockquotes are already styled. Most content can be authored with standard Markdown + a few specialized components.

---

## Required: Content Collection Schema

### What's Missing

The project uses `getCollection('lessons')` and `getCollection('resources')` but has **no content.config.ts file** to define the schema. This needs to be created.

### Technology

| Item | Version | Purpose | Why |
|------|---------|---------|-----|
| Astro Content Collections | Built-in (Astro 5.17.1) | Type-safe frontmatter validation | Prevents authoring errors (missing title, wrong level, etc.) |
| Zod | Bundled with Astro | Schema definition | Astro's official schema validator |

### Implementation

**File:** `/Users/daodilyas/quran-learn/src/content.config.mjs`

**Schema requirements from existing code analysis:**

```javascript
// Lessons collection (73 MDX files)
{
  title: string,              // Required: "Introduction to Arabic Nouns"
  titleArabic?: string,       // Optional: "مقدمة إلى الأسماء العربية"
  level: 1 | 2 | 3 | 4 | 5, // Required: Foundation to Applied Study
  order: number,              // Required: for sorting within level
  description?: string,       // Optional: SEO and preview text
  prevLesson?: string,        // Optional: manual prev/next override
  nextLesson?: string         // Optional: computed automatically if missing
}

// Resources collection (6 MDX files)
{
  title: string,              // Required: "Arabic Grammar Glossary"
  order: number,              // Required: for display order
  description?: string        // Optional: preview text
}
```

**Why Zod:** Already included in Astro 5.x, no additional dependency. Provides TypeScript types automatically.

**Why NOT to add:**
- ❌ Remark/Rehype plugins for Arabic processing - text already renders correctly
- ❌ MDX plugins for syntax extensions - keep content portable
- ❌ External validation libraries - Zod is sufficient

---

## Required: MDX Components for Grammar Display

### What's Missing

Standard Markdown supports paragraphs, headings, lists, tables. But Arabic grammar lessons need:

1. **Example blocks** - Quranic verses with translation and grammar notes
2. **Conjugation tables** - Verb forms across tenses
3. **Exercise blocks** - Practice questions with answer reveals
4. **Grammar rule callouts** - Highlighted rule statements
5. **Root analysis displays** - Breaking down trilateral roots

### Recommended Components

All components should be **Astro components** (not React/Vue) for simplicity and performance.

#### 1. ExampleBlock.astro

**Purpose:** Display Quranic verse examples with translation and grammar annotation.

**Usage in MDX:**
```mdx
<ExampleBlock
  arabic="إِنَّ ٱللَّهَ غَفُورٌ رَّحِيمٌ"
  transliteration="Inna Allāha ghafūrun raḥīm"
  translation="Indeed, Allah is Forgiving and Merciful."
  surah="2:173"
  grammar="إِنَّ is an inna particle that causes the subject to be in the accusative case (manṣūb)."
/>
```

**Why:** Quranic examples are central to every lesson. Needs consistent styling for Arabic (UthmanicHafs font), transliteration, translation, and grammar notes.

**Implementation notes:**
- RTL for Arabic, LTR for English
- UthmanicHafs font for Quranic text (already loaded)
- Color-coded grammar terms (link to glossary)
- Surah reference badge

#### 2. ConjugationTable.astro

**Purpose:** Display verb conjugations across tenses, persons, and forms.

**Usage in MDX:**
```mdx
<ConjugationTable
  root="ك-ت-ب"
  form="I"
  rows={[
    { person: "3rd masculine", past: "كَتَبَ", present: "يَكْتُبُ", meaning: "he writes" },
    { person: "3rd feminine", past: "كَتَبَتْ", present: "تَكْتُبُ", meaning: "she writes" },
    // ...
  ]}
/>
```

**Why:** Conjugation tables are a staple of sarf (morphology) lessons. Standard HTML tables work but need consistent styling and RTL handling.

**Implementation notes:**
- Could be a styled `<table>` wrapper with props
- Amiri font for Arabic in tables (already loaded)
- Responsive: stack columns on mobile

#### 3. ExerciseBlock.astro

**Purpose:** Practice exercises with answer reveals (client-side only, no grading).

**Usage in MDX:**
```mdx
<ExerciseBlock
  question="Identify the i'rab (case ending) of the word 'الله' in the sentence: 'إِنَّ ٱللَّهَ غَفُورٌ'"
  answer="Accusative (manṣūb) because it follows the inna particle."
  hint="Remember: inna and its sisters cause the subject to be accusative."
/>
```

**Why:** Each lesson should include practice. Simple show/hide interaction for self-study.

**Implementation notes:**
- "Show Answer" button (client-side script)
- Optional "Hint" reveal
- No server-side grading (out of scope)

#### 4. RuleCallout.astro

**Purpose:** Highlight grammar rules as distinct from explanatory text.

**Usage in MDX:**
```mdx
<RuleCallout>
  **Rule:** The inna particle (إِنَّ) and its sisters cause the subject to be in the accusative case (manṣūb) and the predicate to remain in the nominative case (marfūʿ).
</RuleCallout>
```

**Why:** Pedagogically important to distinguish rules from examples and explanations.

**Implementation notes:**
- Styled similar to existing blockquote but distinct
- Icon or label ("Rule" badge)
- Accent color from design system

#### 5. RootDiagram.astro

**Purpose:** Visual breakdown of Arabic root letters and derived forms.

**Usage in MDX:**
```mdx
<RootDiagram
  root="ك-ت-ب"
  meaning="writing"
  examples={[
    { word: "كِتَاب", meaning: "book", form: "noun" },
    { word: "مَكْتَب", meaning: "desk/office", form: "place noun" },
    { word: "كَاتِب", meaning: "writer", form: "active participle" }
  ]}
/>
```

**Why:** Root system is fundamental to Arabic morphology. Visual display helps learners see patterns.

**Implementation notes:**
- Could be a styled list or grid
- Color-code root letters vs. additions
- Amiri font for Arabic

---

## Optional: Content Authoring Helpers

### Frontmatter Snippets (VS Code)

**File:** `.vscode/lesson.code-snippets`

Autocomplete for lesson frontmatter to reduce errors.

```json
{
  "Lesson Frontmatter": {
    "prefix": "lesson-fm",
    "body": [
      "---",
      "title: \"$1\"",
      "titleArabic: \"$2\"",
      "level: $3",
      "order: $4",
      "description: \"$5\"",
      "---"
    ]
  }
}
```

**Why:** Reduces copy-paste errors and speeds up authoring. Optional but high ROI.

### MDX Linting (Optional)

**Tool:** `eslint-plugin-mdx` (dev dependency only)

**Why NOT recommended:** Adds complexity, slows dev server, and MDX syntax is simple enough to catch errors at build time.

**Alternative:** Rely on Astro's build errors and TypeScript types from content.config.ts.

---

## What NOT to Add

### ❌ Remark/Rehype Plugins

**Common temptation:** Add plugins for:
- Automatic Arabic text direction detection
- Arabic diacritic normalization
- Verse number auto-linking

**Why avoid:**
- Arabic rendering already works (fonts loaded, RTL supported)
- Adds build complexity and fragility
- Content becomes less portable (what if you export to PDF later?)

**Instead:** Use explicit MDX components where needed. Manual control > magic.

### ❌ External MDX Component Libraries

**Examples:** `@mdx-js/react`, `mdx-deck`, `mdx-embed`

**Why avoid:**
- Brings React as a dependency (Astro site is mostly static)
- Most components aren't designed for RTL or Arabic text
- Bloats bundle size

**Instead:** Build 5 custom Astro components (above). Total effort: ~2-4 hours. Total bundle cost: <1KB.

### ❌ CMS Integration

**Examples:** Contentful, Sanity, Strapi

**Why avoid:**
- Adds deployment complexity
- MDX files in Git are simpler for version control
- Claude can author MDX directly (no GUI needed)
- Single author (no collaboration workflows needed)

**When to add:** Only if multiple non-technical authors join later.

### ❌ Quran API Integration

**Temptation:** Auto-fetch verses from Quran.com API based on surah:ayah reference.

**Why avoid:**
- Content should be frozen (lessons shouldn't change if API changes)
- Network dependency breaks static build
- Lesson authors need to select pedagogically appropriate verses (not all verses are good grammar examples)

**Instead:** Copy-paste Quranic text into MDX. Attribute properly. Static is better.

---

## Installation

### Core Schema (Required)

```bash
# No installation needed - Zod is bundled with Astro 5.x
# Just create the file: src/content.config.mjs
```

### MDX Components (Required)

```bash
# No installation needed - create .astro files in src/components/mdx/
# Components:
#   - src/components/mdx/ExampleBlock.astro
#   - src/components/mdx/ConjugationTable.astro
#   - src/components/mdx/ExerciseBlock.astro
#   - src/components/mdx/RuleCallout.astro
#   - src/components/mdx/RootDiagram.astro
```

### Optional Authoring Helpers

```bash
# VS Code snippets - no installation, just create file
# .vscode/lesson.code-snippets
```

---

## Content Authoring Workflow

### Step 1: Define Schema

Create `src/content.config.mjs` with Zod schemas for lessons and resources. This gives TypeScript autocomplete and build-time validation.

### Step 2: Create MDX Components

Build the 5 grammar-specific components in `src/components/mdx/`. Export them so they can be imported in MDX files.

### Step 3: Author Lesson Content

For each of 73 lessons:

1. Add proper frontmatter (title, level, order)
2. Structure content: introduction → examples → rule → exercises
3. Use MDX components for Arabic examples, tables, exercises
4. Use standard Markdown for paragraphs, headings, lists

### Step 4: Test Incrementally

Run `npm run dev` and check:
- Frontmatter validates (no build errors)
- Arabic text renders correctly (fonts load)
- RTL layout works (direction: rtl on Arabic blocks)
- Components display properly
- Prev/next navigation works

---

## Pedagogical Structure Notes

### Classical Arabic Grammar Lesson Template

Based on traditional nahw/sarf pedagogy, each lesson should follow:

1. **Introduction (مقدمة)** - What concept this lesson teaches
2. **Examples (أمثلة)** - Quranic verses demonstrating the concept
3. **Explanation (شرح)** - How the grammar rule works
4. **Rule Statement (القاعدة)** - Formal statement of the rule
5. **Exercises (تمارين)** - Practice identifying the concept

### Content Selection Criteria

**Quranic verse examples should be:**
- Short (1-3 words ideal, max one ayah)
- Clear instances of the grammar point (not ambiguous)
- Pedagogically sequenced (simple → complex)
- Appropriate level for the lesson (Level 1 = very simple, Level 5 = complex)

**Avoid:**
- Long verses (cognitive overload)
- Verses with multiple grammar points (confusing)
- Controversial interpretations (focus on grammar, not theology)

### Arabic Grammar Coverage

**Nahw (syntax) topics:**
- i'rab (case endings): nominative, accusative, genitive
- Sentence types: verbal vs. nominal
- Particles: inna and its sisters, kana and its sisters
- Agreement: gender, number, definiteness

**Sarf (morphology) topics:**
- Root system (trilateral roots)
- Verb forms (I-X)
- Derived nouns: active/passive participles, verbal nouns
- Weak roots: hollow, defective, assimilated

### Level Progression

| Level | Name | Grammar Scope | Example Topics |
|-------|------|---------------|----------------|
| 1 | Foundation | Basic concepts | Noun vs. verb, definiteness, gender |
| 2 | Core Grammar | Case system | i'rab basics, prepositions, simple sentences |
| 3 | Intermediate | Particles | inna/kana sisters, complex sentences |
| 4 | Advanced | Morphology | Verb forms, derived nouns, weak roots |
| 5 | Applied Study | Synthesis | Applying all concepts to full ayat |

---

## Alternatives Considered

### Alternative 1: Plain Markdown (No MDX)

**Pros:** Simpler, no component complexity
**Cons:** Can't display grammar examples with proper structure, would need to use images (bad for accessibility, text selection, copy-paste)

**Verdict:** ❌ Insufficient. Arabic grammar needs structured data display.

### Alternative 2: React Components in MDX

**Pros:** Access to React ecosystem, more component libraries
**Cons:** Adds React runtime, breaks Astro's static-first approach, heavier bundle

**Verdict:** ❌ Over-engineered. Astro components are sufficient.

### Alternative 3: Custom Markdown Syntax

**Example:** `:::example` blocks with custom syntax for Arabic, translation, etc.

**Pros:** Looks cleaner in raw Markdown
**Cons:** Requires remark plugin, harder to maintain, less explicit than JSX

**Verdict:** ❌ MDX components are more maintainable and explicit.

### Alternative 4: Separate Content Format (JSON/YAML)

**Pros:** Easier to parse programmatically, could generate lessons from structured data
**Cons:** Loses Markdown's readability, harder to author prose sections

**Verdict:** ❌ MDX is the right balance of structure and authoring DX.

---

## Source Confidence

| Area | Confidence | Source |
|------|------------|--------|
| Astro 5 content collections | HIGH | Official Astro docs (v5 as of Jan 2025), existing codebase evidence |
| Zod schema patterns | HIGH | Bundled with Astro, standard approach |
| MDX component patterns | HIGH | Astro's official MDX integration approach |
| Arabic grammar pedagogy | MEDIUM | Training knowledge of classical nahw/sarf structure |
| Lesson structure template | MEDIUM | Based on traditional Arabic grammar textbooks (not specific to Quranic Arabic) |
| Quranic verse selection criteria | LOW | Requires subject matter expertise, should validate with user |

**Verification recommended:**
- User should review pedagogical structure (introduction → examples → rule → exercises)
- User should validate grammar topic coverage (nahw/sarf breakdown)
- User should confirm Quranic verse selection approach

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Content schema missing required fields | Medium | Create content.config.mjs in Phase 1, test with 1-2 sample lessons |
| MDX components don't handle RTL properly | Low | Already validated: Amiri font loads, RTL works in existing layouts |
| Components too complex to maintain | Low | Keep components simple (semantic HTML + CSS), no client JS except ExerciseBlock |
| Content authoring too slow | Medium | Create component usage docs, provide 1-2 complete lesson examples |
| Grammar content inaccurate | High | User is master linguist - let user author/review content |
| Inconsistent lesson structure | Medium | Document template, create VS Code snippet for frontmatter |

---

## Next Steps for Roadmap

Based on this research, the roadmap should structure phases as:

1. **Phase 1: Schema + Component Library** - Create content.config.mjs and 5 MDX components
2. **Phase 2: Sample Lessons** - Author 2-3 complete lessons (one per level 1-3) to validate structure
3. **Phase 3: Content Authoring** - Fill remaining 70 lessons using validated template
4. **Phase 4: Resources** - Fill 6 resource pages (glossary, tables, charts)
5. **Phase 5: Content QA** - Review for consistency, test all links/navigation

**Estimated effort:**
- Phase 1: 4-6 hours (schema + components)
- Phase 2: 3-4 hours (sample lessons)
- Phase 3: 30-40 hours (70 lessons × ~30min each)
- Phase 4: 4-6 hours (6 resources)
- Phase 5: 2-3 hours (QA pass)

**Total: ~45-60 hours of content authoring**

---

## Final Recommendation

**Stack additions needed:**

✅ **Add:** `src/content.config.mjs` (content schema with Zod)
✅ **Add:** 5 MDX components in `src/components/mdx/` (ExampleBlock, ConjugationTable, ExerciseBlock, RuleCallout, RootDiagram)
✅ **Add:** Optional VS Code snippets for frontmatter

❌ **Do NOT add:**
- Remark/rehype plugins
- External component libraries
- CMS integration
- Quran API integration
- MDX linting

**Keep it simple.** The platform is solid. Focus on creating great content with minimal tooling overhead.

---

*Research completed: 2026-02-06*
*Confidence: HIGH for stack, MEDIUM for pedagogy (user validation recommended)*
