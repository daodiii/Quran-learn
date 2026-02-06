# Architecture Patterns: Lesson Content Integration

**Domain:** Quranic Arabic grammar lesson content management
**Researched:** 2026-02-06

## Recommended Architecture

This architecture integrates 73 lesson MDX files and 6 resource MDX files into the existing Astro 5.x content collections system. The design leverages Astro's built-in content layer, Zod schema validation, and custom MDX components for educational content rendering.

### High-Level Overview

```
src/
├── content/
│   ├── config.ts                    # Zod schemas for lessons/resources
│   ├── lessons/                     # 73 lesson MDX files
│   │   ├── level-1/                # 11 foundation lessons
│   │   ├── level-2/                # 11 core grammar lessons
│   │   ├── level-3/                # 18 intermediate lessons
│   │   ├── level-4/                # 17 advanced lessons
│   │   └── level-5/                # 16 applied study lessons
│   └── resources/                   # 6 resource MDX files (existing)
│       ├── glossary.mdx
│       ├── verb-conjugation-tables.mdx
│       ├── pronoun-charts.mdx
│       ├── case-endings-chart.mdx
│       ├── root-system.mdx
│       └── 200-most-used-words.mdx
├── components/
│   └── mdx/                        # Custom MDX components
│       ├── ArabicExample.astro     # Verse display with translation
│       ├── GrammarTable.astro      # Grammar paradigm tables
│       ├── VerbConjugation.astro   # Verb conjugation displays
│       ├── ExerciseBox.astro       # Practice exercises
│       ├── Callout.astro           # Tips/notes/warnings
│       └── ResponsiveImage.astro   # (existing) Image handling
├── pages/
│   └── learn/
│       └── [...slug].astro         # (existing) Dynamic lesson router
└── layouts/
    └── LessonLayout.astro          # (existing) Lesson page layout
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `content.config.ts` | Define and validate lesson/resource schemas | Astro Content Collections API |
| Lesson MDX files | Store educational content with frontmatter | Content Collections, MDX custom components |
| Custom MDX components | Render specialized educational content (Arabic, tables, exercises) | Lesson MDX files, global styles |
| `[...slug].astro` | Route to lessons, fetch from collections, pass to layout | Content Collections, LessonLayout |
| `LessonLayout.astro` | Wrap lesson content with header, navigation, progress tracking | MDX content, CourseNavigator |
| `CourseNavigator.astro` | Display all lessons with completion state | Content Collections, progress.ts |

### Data Flow

```
1. Build time:
   - Astro reads src/content/lessons/**/*.mdx
   - content.config.ts validates frontmatter against Zod schema
   - MDX compiled to HTML with custom components injected
   - getStaticPaths() generates routes for all lessons

2. Runtime (browser):
   - User navigates to /learn/level-2/marfu-nouns/
   - [...slug].astro retrieves lesson via getCollection('lessons')
   - Lesson rendered via render(lesson) with custom MDX components
   - LessonLayout wraps content with navigation and progress UI
   - Client-side script enables "Mark Complete" interaction
   - Progress saved to Supabase via markLessonComplete()
```

## Directory Structure

### Lesson File Organization

**Pattern:** `src/content/lessons/level-{1-5}/{order}-{slug}.mdx`

**Naming convention:**
- `{order}`: Two-digit zero-padded number (01, 02, ... 18)
- `{slug}`: Kebab-case lesson identifier matching title

**Examples:**
```
src/content/lessons/level-1/01-arabic-alphabet.mdx
src/content/lessons/level-1/02-vowel-marks.mdx
src/content/lessons/level-2/01-marfu-nouns.mdx
src/content/lessons/level-3/05-verb-form-iii.mdx
```

**Rationale:**
- Order prefix ensures consistent alphabetical sorting
- Slug matches URL structure (/learn/level-2/marfu-nouns/)
- Level subdirectories organize by difficulty
- Easy to identify gaps (missing numbers)

### Level Distribution

| Level | Name | Lesson Count | File Pattern |
|-------|------|--------------|--------------|
| 1 | Foundation | 11 | `level-1/01-*.mdx` through `level-1/11-*.mdx` |
| 2 | Core Grammar | 11 | `level-2/01-*.mdx` through `level-2/11-*.mdx` |
| 3 | Intermediate | 18 | `level-3/01-*.mdx` through `level-3/18-*.mdx` |
| 4 | Advanced | 17 | `level-4/01-*.mdx` through `level-4/17-*.mdx` |
| 5 | Applied Study | 16 | `level-5/01-*.mdx` through `level-5/16-*.mdx` |

**Total:** 73 lesson files

## Content Schema (content.config.ts)

### Schema Design

Create `src/content/config.ts` with Zod schemas for type-safe content validation:

```typescript
import { defineCollection, z } from 'astro:content';

const lessons = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleArabic: z.string().optional(),
    level: z.number().int().min(1).max(5),
    order: z.number().int().positive(),
    description: z.string(),
    objectives: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    estimatedTime: z.number().optional(), // minutes
    prevLesson: z.string().optional(),    // URL path
    nextLesson: z.string().optional(),    // URL path
  }),
});

const resources = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number().int().positive(),
    description: z.string(),
    category: z.enum(['reference', 'chart', 'vocabulary']).optional(),
  }),
});

export const collections = { lessons, resources };
```

**Schema rationale:**
- `level` and `order` are integers with validation ranges
- `titleArabic` optional (not all lessons need Arabic titles)
- `objectives` and `keywords` optional for SEO and learning goals
- `estimatedTime` optional for future time tracking feature
- `prevLesson`/`nextLesson` optional (can be computed from order)

### Frontmatter Example

```yaml
---
title: "The Marfu' (Nominative) Case"
titleArabic: "المرفوع"
level: 2
order: 1
description: "Learn the Marfu' case marking for subjects, predicates, and their grammatical roles in Arabic sentences."
objectives:
  - "Identify Marfu' case endings on nouns and verbs"
  - "Recognize subjects (mubtada) and predicates (khabar)"
  - "Apply Marfu' rules to Quranic verses"
keywords: ["marfu", "nominative", "raf", "dammah", "subject", "mubtada", "khabar"]
estimatedTime: 15
---
```

## MDX File Template

### Standard Lesson Structure

All lessons follow this pedagogical pattern:

```markdown
---
title: "[Lesson Title]"
titleArabic: "[Arabic Title]"
level: [1-5]
order: [1-N]
description: "[One-sentence summary]"
objectives:
  - "[Learning objective 1]"
  - "[Learning objective 2]"
keywords: ["keyword1", "keyword2"]
estimatedTime: [minutes]
---

## Introduction

[2-3 sentences introducing the concept and why it matters for Quranic understanding]

## The Concept

[Detailed explanation of the grammatical concept]

<ArabicExample
  verse="[Quranic verse in Arabic]"
  translation="[English translation]"
  reference="[Surah:Ayah]"
  highlight="[word to highlight]"
  explanation="[Grammatical analysis of highlighted word]"
/>

## The Rule

<Callout type="rule">
**[Grammar rule title]**

[Statement of the rule in clear, simple language]
</Callout>

### Examples from the Quran

<ArabicExample
  verse="..."
  translation="..."
  reference="..."
  highlight="..."
  explanation="..."
/>

<ArabicExample
  verse="..."
  translation="..."
  reference="..."
  highlight="..."
  explanation="..."
/>

## Key Terminology

<GrammarTable
  columns={["Arabic", "Transliteration", "English", "Example"]}
  rows={[
    ["[Arabic term]", "[Roman]", "[Definition]", "[Example]"],
    // ...
  ]}
/>

## Practice

<ExerciseBox title="Identify the Pattern">

1. [Exercise question]
2. [Exercise question]
3. [Exercise question]

<details>
<summary>Show Answers</summary>

1. [Answer with explanation]
2. [Answer with explanation]
3. [Answer with explanation]

</details>

</ExerciseBox>

## Summary

[Recap of key points in 3-5 bullet points]

- **[Point 1]**: [Brief explanation]
- **[Point 2]**: [Brief explanation]
- **[Point 3]**: [Brief explanation]

## Next Steps

[1-2 sentences connecting to next lesson or suggesting practice]
```

### Template Rationale

**Pedagogical flow:**
1. **Introduction** → Hook and context
2. **The Concept** → Detailed explanation with Quranic example
3. **The Rule** → Explicit statement in callout for emphasis
4. **Examples** → Multiple Quranic verses demonstrating rule
5. **Key Terminology** → Vocabulary table for reference
6. **Practice** → Active learning exercises
7. **Summary** → Reinforcement of key points
8. **Next Steps** → Connection to curriculum

**Design decisions:**
- Custom components (`<ArabicExample>`, `<GrammarTable>`, etc.) keep MDX clean
- Callout boxes highlight important rules
- Details/summary for answer reveals (progressive disclosure)
- Consistent H2 headings for section navigation

## Custom MDX Components

### 1. ArabicExample.astro

**Purpose:** Display Quranic verses with translation, reference, and grammatical highlighting.

**Props:**
```typescript
interface Props {
  verse: string;        // Arabic verse text
  translation: string;  // English translation
  reference: string;    // e.g., "2:255" (Surah:Ayah)
  highlight?: string;   // Word to highlight (optional)
  explanation?: string; // Grammatical explanation (optional)
}
```

**Usage:**
```markdown
<ArabicExample
  verse="إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ"
  translation="Indeed, Allah is over all things competent."
  reference="2:20"
  highlight="قَدِيرٌ"
  explanation="Predicate (khabar) in the Marfu' case, ending with tanwin dammah (un)."
/>
```

**Design:**
- Arabic text in large font with RTL direction
- Translation in smaller font below
- Reference badge (surah:ayah) in accent color
- Highlighted word with subtle background color
- Explanation in callout below if provided

**Implementation sketch:**
```astro
---
interface Props {
  verse: string;
  translation: string;
  reference: string;
  highlight?: string;
  explanation?: string;
}

const { verse, translation, reference, highlight, explanation } = Astro.props;
---

<div class="arabic-example">
  <div class="verse-container">
    <p class="arabic-text" dir="rtl" lang="ar">
      {highlight ? (
        verse.split(highlight).map((part, i, arr) => (
          <>
            {part}
            {i < arr.length - 1 && <mark class="highlight">{highlight}</mark>}
          </>
        ))
      ) : verse}
    </p>
    <span class="reference">{reference}</span>
  </div>
  <p class="translation">{translation}</p>
  {explanation && (
    <div class="explanation">
      <strong>Analysis:</strong> {explanation}
    </div>
  )}
</div>

<style>
  .arabic-example {
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-primary);
  }

  .verse-container {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .arabic-text {
    font-family: var(--font-arabic);
    font-size: 1.5rem;
    line-height: 2;
    color: var(--text-primary);
    flex: 1;
    margin: 0;
  }

  .highlight {
    background: var(--accent-primary-light);
    color: var(--accent-primary);
    padding: 0.125rem 0.25rem;
    border-radius: var(--radius-sm);
  }

  .reference {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--accent-primary);
    white-space: nowrap;
  }

  .translation {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  .explanation {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-primary);
    font-size: 0.9375rem;
    color: var(--text-secondary);
  }
</style>
```

### 2. GrammarTable.astro

**Purpose:** Display grammar paradigms, conjugation tables, or terminology charts.

**Props:**
```typescript
interface Props {
  columns: string[];      // Column headers
  rows: string[][];       // Table data (2D array)
  caption?: string;       // Table caption (optional)
  highlightColumn?: number; // 0-indexed column to accent
}
```

**Usage:**
```markdown
<GrammarTable
  caption="Marfu' Case Endings"
  columns={["Type", "Indefinite", "Definite", "Example"]}
  rows={[
    ["Singular", "un (ٌ)", "u (ُ)", "رَجُلٌ / الرَّجُلُ"],
    ["Dual", "āni (ان)", "āni (ان)", "رَجُلَانِ"],
    ["Plural", "ūna (ون)", "ūna (ون)", "مُسْلِمُونَ"],
  ]}
/>
```

**Design:**
- Responsive table with sticky header
- Even/odd row striping for readability
- Highlight column (optional) with accent background
- Mobile: horizontal scroll container

### 3. VerbConjugation.astro

**Purpose:** Display verb conjugation tables with Arabic text alignment.

**Props:**
```typescript
interface Props {
  root: string;           // Trilateral root (e.g., "ك ت ب")
  form: string;           // Form number (I, II, III, etc.)
  meaning: string;        // Base meaning
  conjugations: {
    person: string;       // e.g., "3rd masc. sing."
    perfect: string;      // Past tense
    imperfect: string;    // Present tense
    imperative?: string;  // Command (if applicable)
  }[];
}
```

**Usage:**
```markdown
<VerbConjugation
  root="ك ت ب"
  form="I"
  meaning="to write"
  conjugations={[
    { person: "3rd masc. sing.", perfect: "كَتَبَ", imperfect: "يَكْتُبُ" },
    { person: "3rd fem. sing.", perfect: "كَتَبَتْ", imperfect: "تَكْتُبُ" },
    // ...
  ]}
/>
```

**Design:**
- Root displayed prominently at top
- Three-column table: Person | Perfect | Imperfect (| Imperative)
- Arabic columns RTL, English column LTR
- Accent color for root letters

### 4. ExerciseBox.astro

**Purpose:** Container for practice exercises with consistent styling.

**Props:**
```typescript
interface Props {
  title: string;          // Exercise title
  type?: 'practice' | 'quiz' | 'challenge'; // Visual variant
}
```

**Usage:**
```markdown
<ExerciseBox title="Identify the Pattern" type="practice">

[Exercise content in MDX]

</ExerciseBox>
```

**Design:**
- Border with accent color
- Title bar with icon
- Padded content area
- Support for nested details/summary for answers

### 5. Callout.astro

**Purpose:** Highlight important information (rules, tips, warnings).

**Props:**
```typescript
interface Props {
  type?: 'rule' | 'tip' | 'note' | 'warning'; // Visual variant
  title?: string; // Optional title
}
```

**Usage:**
```markdown
<Callout type="rule" title="The Marfu' Rule">

Subjects and predicates take the Marfu' case, marked by dammah (ُ) or its variants.

</Callout>
```

**Design:**
- Color-coded by type (rule=blue, tip=green, note=yellow, warning=red)
- Icon in top-left corner
- Title bolded if provided
- Subtle background and border

### 6. ResponsiveImage.astro

**Purpose:** (Already exists) Handle images with responsive sizing.

**Note:** Preserve existing implementation. No changes needed.

## Integration Points

### Existing Components

**Modified components:**

| Component | Modification Type | Changes Needed |
|-----------|------------------|----------------|
| `[...slug].astro` | **Minor update** | Add custom MDX components to `render()` call |
| `LessonLayout.astro` | **No changes** | Already handles lesson frontmatter correctly |
| `CourseNavigator.astro` | **No changes** | Already fetches lessons via `getCollection('lessons')` |

### [...slug].astro Integration

**Current implementation:**
```astro
const { Content } = await render(lesson);
---
<LessonLayout ...>
  <Content components={{ img: ResponsiveImage }} />
</LessonLayout>
```

**Updated implementation:**
```astro
import ArabicExample from '../../components/mdx/ArabicExample.astro';
import GrammarTable from '../../components/mdx/GrammarTable.astro';
import VerbConjugation from '../../components/mdx/VerbConjugation.astro';
import ExerciseBox from '../../components/mdx/ExerciseBox.astro';
import Callout from '../../components/mdx/Callout.astro';
import ResponsiveImage from '../../components/mdx/ResponsiveImage.astro';

const { Content } = await render(lesson);
---
<LessonLayout ...>
  <Content components={{
    img: ResponsiveImage,
    ArabicExample,
    GrammarTable,
    VerbConjugation,
    ExerciseBox,
    Callout,
  }} />
</LessonLayout>
```

**Rationale:** Astro's `render()` function accepts `components` prop to override MDX component rendering. This allows custom components without global MDX configuration.

### New vs Modified Components

**New components to create:**
1. `src/content/config.ts` — Content schema definition
2. `src/components/mdx/ArabicExample.astro` — Verse display
3. `src/components/mdx/GrammarTable.astro` — Table renderer
4. `src/components/mdx/VerbConjugation.astro` — Verb conjugation display
5. `src/components/mdx/ExerciseBox.astro` — Exercise container
6. `src/components/mdx/Callout.astro` — Callout boxes

**Modified components:**
1. `src/pages/learn/[...slug].astro` — Add MDX component mappings

**Unmodified components:**
- `src/layouts/LessonLayout.astro` — Works as-is
- `src/components/navigation/CourseNavigator.astro` — Works as-is
- `src/components/mdx/ResponsiveImage.astro` — Works as-is

## Build Order

### Phase 1: Schema and Structure (Foundation)

**Goal:** Establish content validation and directory structure.

**Tasks:**
1. Create `src/content/config.ts` with Zod schemas
2. Create `src/content/lessons/level-1/` through `level-5/` directories
3. Create one test lesson file (`level-1/01-arabic-alphabet.mdx`) with complete frontmatter
4. Run `npm run build` to verify schema validation
5. Verify lesson appears at `/learn/level-1/01-arabic-alphabet/`

**Success criteria:**
- Build passes without schema errors
- Test lesson renders with correct frontmatter
- CourseNavigator displays test lesson

**Why first:** Schema must be defined before content creation. Validates architecture before investing in components.

### Phase 2: Custom MDX Components (Tooling)

**Goal:** Build reusable components for educational content.

**Tasks:**
1. Create `src/components/mdx/Callout.astro` (simplest component)
2. Create `src/components/mdx/ArabicExample.astro` (core component)
3. Create `src/components/mdx/GrammarTable.astro`
4. Create `src/components/mdx/VerbConjugation.astro`
5. Create `src/components/mdx/ExerciseBox.astro`
6. Update `[...slug].astro` to pass components to `render()`
7. Test each component in test lesson file

**Success criteria:**
- All components render without errors
- Arabic text displays correctly (RTL, font family)
- Tables are responsive
- Callouts use correct colors by type

**Why second:** Components needed before authoring real lesson content. Test with one lesson before mass authoring.

### Phase 3: Content Creation (Bulk Work)

**Goal:** Author all 73 lesson MDX files with real content.

**Tasks:**
1. Create lesson files for Level 1 (Foundation, 11 lessons)
2. Create lesson files for Level 2 (Core Grammar, 11 lessons)
3. Create lesson files for Level 3 (Intermediate, 18 lessons)
4. Create lesson files for Level 4 (Advanced, 17 lessons)
5. Create lesson files for Level 5 (Applied Study, 16 lessons)
6. Update 6 resource MDX files in `src/content/resources/`

**Success criteria:**
- All 73 lesson files created with complete frontmatter
- All lessons follow template structure
- Each lesson has 2-3 Quranic examples with `<ArabicExample>`
- All lessons use at least one custom component
- Build passes without errors

**Why third:** Components must exist before authoring content. This is the longest phase (content authoring).

### Phase 4: Quality Assurance (Polish)

**Goal:** Verify all content displays correctly and curriculum flows logically.

**Tasks:**
1. Walk through all 73 lessons in sequence
2. Verify prev/next navigation works
3. Verify CourseNavigator shows all lessons
4. Check Arabic text rendering (diacritics, RTL)
5. Test responsive layout on mobile
6. Verify dark mode rendering for all custom components
7. Run accessibility audit with axe-core
8. Test mark-as-complete functionality
9. Verify quiz links work for all 5 levels

**Success criteria:**
- No broken navigation links
- Arabic text renders clearly at all screen sizes
- Dark mode has sufficient contrast
- No accessibility violations
- All 73 lessons accessible via CourseNavigator

**Why last:** QA requires complete content. Catches integration issues after bulk authoring.

### Build Order Rationale

**Dependencies:**
- Phase 2 depends on Phase 1 (components need schema for prop types)
- Phase 3 depends on Phase 2 (content needs components to render)
- Phase 4 depends on Phase 3 (QA needs complete content)

**Risk mitigation:**
- Test schema early (Phase 1) to catch validation issues
- Build one component at a time (Phase 2) to isolate bugs
- Author content level-by-level (Phase 3) for incremental validation
- QA at end (Phase 4) to catch integration issues

**Parallel work opportunities:**
- Phase 3 can be split: one person per level (5 parallel work streams)
- Phase 2 components can be built in parallel after Callout and ArabicExample done

## Patterns

### Pattern: Content Collection File IDs

Astro content collections use file paths as IDs. Understanding this pattern is critical for navigation.

**Pattern:**
```
File path: src/content/lessons/level-2/01-marfu-nouns.mdx
Collection ID: "level-2/01-marfu-nouns"  (no .mdx extension)
URL: /learn/level-2/01-marfu-nouns/
```

**Implications:**
1. `getCollection('lessons')` returns entries with `id` property
2. `[...slug].astro` matches `params.slug` to `lesson.id`
3. Navigation links use `/learn/${lesson.id}/` format
4. CourseNavigator filters by `lesson.id.startsWith('level-1/')`

**Example:**
```typescript
const allLessons = await getCollection('lessons');
const level1Lessons = allLessons.filter(l => l.id.startsWith('level-1/'));
// => [{ id: "level-1/01-arabic-alphabet", data: {...} }, ...]
```

### Pattern: Custom Components in MDX

Astro MDX integration allows custom components via `components` prop in `render()`.

**Without custom components:**
```astro
const { Content } = await render(lesson);
<Content />  <!-- Only standard HTML tags available -->
```

**With custom components:**
```astro
const { Content } = await render(lesson);
<Content components={{ ArabicExample }} />
<!-- Now <ArabicExample /> works in MDX -->
```

**Global vs Local:**
- **Local (recommended)**: Pass components to `render()` — explicit, no magic
- **Global (avoid)**: Configure in `astro.config.mjs` — harder to trace

**Rationale:** Local component passing makes dependencies explicit and easier to debug.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Inline Arabic Text Without Components

**What:**
```markdown
Here's a verse: إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ (2:20)
```

**Why bad:**
- No RTL direction applied
- No font size consistency
- No semantic structure for verse vs translation
- Hard to style globally

**Instead:**
```markdown
<ArabicExample
  verse="إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ"
  translation="Indeed, Allah is over all things competent."
  reference="2:20"
/>
```

### Anti-Pattern 2: HTML Tables Instead of GrammarTable

**What:**
```markdown
| Arabic | English | Example |
|--------|---------|---------|
| رَجُلٌ | man | ... |
```

**Why bad:**
- No control over Arabic column alignment (RTL)
- Limited styling options
- No responsive behavior
- Can't highlight columns

**Instead:**
```markdown
<GrammarTable
  columns={["Arabic", "English", "Example"]}
  rows={[["رَجُلٌ", "man", "..."]]}
/>
```

### Anti-Pattern 3: Hardcoded prevLesson/nextLesson

**What:**
```yaml
---
prevLesson: "/learn/level-1/01-arabic-alphabet/"
nextLesson: "/learn/level-1/03-word-types/"
---
```

**Why bad:**
- Brittle (breaks if lesson order changes)
- Duplicates information (order already in frontmatter)
- Hard to maintain (must update manually)

**Instead:**
Omit `prevLesson`/`nextLesson` from frontmatter. Let `[...slug].astro` compute from collection order:

```astro
const sortedLessons = lessons.sort((a, b) => {
  if (a.data.level !== b.data.level) return a.data.level - b.data.level;
  return a.data.order - b.data.order;
});

const prevLesson = index > 0 ? `/learn/${sortedLessons[index - 1].id}/` : undefined;
const nextLesson = index < sortedLessons.length - 1 ? `/learn/${sortedLessons[index + 1].id}/` : undefined;
```

**Rationale:** Computed navigation is DRY and self-healing.

### Anti-Pattern 4: Mixing Content and Presentation in MDX

**What:**
```markdown
<div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
**Rule:** Subjects take the Marfu' case.
</div>
```

**Why bad:**
- Inline styles bypass design system
- Breaks dark mode (hardcoded colors)
- Not reusable
- Hard to maintain

**Instead:**
```markdown
<Callout type="rule">

**Rule:** Subjects take the Marfu' case.

</Callout>
```

**Rationale:** Semantic components use design tokens and respect theme.

### Anti-Pattern 5: Large Frontmatter Arrays

**What:**
```yaml
---
examples:
  - verse: "..."
    translation: "..."
    reference: "..."
  - verse: "..."
    # 20 more examples...
---
```

**Why bad:**
- Frontmatter is for metadata, not content
- Hard to read and edit
- Breaks syntax highlighting in many editors
- No type safety for nested structures

**Instead:**
Put examples in MDX body using components:

```markdown
<ArabicExample verse="..." translation="..." reference="..." />
<ArabicExample verse="..." translation="..." reference="..." />
```

**Rationale:** MDX body is designed for content, frontmatter for metadata.

## Scalability Considerations

| Concern | At 73 lessons | At 200 lessons | At 500 lessons |
|---------|---------------|----------------|----------------|
| Build time | ~5-10 seconds | ~15-30 seconds | ~1-2 minutes |
| File organization | Level subdirectories sufficient | Consider topic-based subdirs within levels | Consider topic-based collections |
| Navigation | Single CourseNavigator works | Consider level-specific navigators | Consider search + filters |
| Search | Browser find sufficient | Consider client-side search | Consider full-text search index |
| Content validation | Zod schema sufficient | Consider custom validators | Consider CI/CD validation |

**Current architecture decisions:**
- **Content Collections**: Astro's built-in system scales to 1000s of files
- **Static generation**: All lessons pre-rendered at build time (no runtime cost)
- **Zod validation**: Runs once at build, catches errors early
- **File-based routing**: No manual route registration needed

**Future optimizations (if needed):**
- Paginated navigation (if navigator becomes too long)
- Lazy-loaded lessons (if JS bundle grows too large)
- Search index (if users need to find specific topics)
- Content CDN (if build times become excessive)

**Current recommendation:** No optimizations needed for 73 lessons. Architecture handles this scale trivially.

## Sources

**Astro documentation (official):**
- Content Collections: https://docs.astro.build/en/guides/content-collections/
- MDX integration: https://docs.astro.build/en/guides/integrations-guide/mdx/
- Dynamic routing: https://docs.astro.build/en/core-concepts/routing/

**Zod (schema validation):**
- Official docs: https://zod.dev/
- Astro integration: Built-in via `astro:content`

**Existing codebase analysis:**
- `src/pages/learn/[...slug].astro` — Pattern for dynamic lesson routing
- `src/layouts/LessonLayout.astro` — Pattern for lesson page structure
- `src/components/navigation/CourseNavigator.astro` — Pattern for collection iteration
- `src/content/resources/*.mdx` — Pattern for resource MDX files

**Confidence:** HIGH

All architecture decisions based on:
1. Official Astro 5.x documentation (verified current)
2. Existing codebase patterns (analyzed from source)
3. Zod schema validation (standard in Astro content collections)
4. Educational content design patterns (industry standard)

No WebSearch-only findings. All patterns verified against official docs or existing code.
