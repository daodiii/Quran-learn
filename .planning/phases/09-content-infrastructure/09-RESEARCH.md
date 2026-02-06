# Phase 9: Content Infrastructure - Research

**Researched:** 2026-02-06
**Domain:** Astro Content Collections, MDX Components, Educational Content Architecture
**Confidence:** HIGH

## Summary

Phase 9 establishes the content infrastructure for authoring 73 educational lessons using Astro v5's Content Layer API with Zod schema validation and a reusable component library for educational content. The project is already on Astro v5.17.1, so it benefits from the new Content Layer API with 5x faster builds and improved memory efficiency.

The standard approach is to use Astro's content collections with `glob()` loader for MDX files, define strict Zod schemas for frontmatter validation at build time, and create a library of reusable Astro components specifically designed for educational content (Arabic examples, grammar tables, exercises, callouts). These components will be imported directly into MDX lesson files and mapped to standard markdown syntax where appropriate.

The project already has a component library from v1.0 (cards, progress, primitives, navigation) and uses CSS custom properties with logical properties for RTL support. The new educational components should follow these established patterns.

**Primary recommendation:** Use Astro v5 Content Layer API with glob() loader, Zod validation schemas, and build educational components as Astro components that are imported into MDX files. Organize lessons in a nested directory structure under `src/content/lessons/level-{1-5}/`.

## Standard Stack

The established libraries/tools for Astro content collections and MDX components:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro Content Layer API | 5.0+ | Content collections with validation | Official Astro v5 API, 5x faster builds than legacy |
| Zod | (via astro/zod) | Schema validation for frontmatter | Astro's built-in validation solution, TypeScript integration |
| @astrojs/mdx | 4.3.13+ | MDX support in Astro | Official Astro integration for MDX |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| glob() loader | Built-in | Load markdown/MDX from filesystem | Default for file-based content collections |
| file() loader | Built-in | Load structured data from JSON/YAML | For supplementary data files |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Content collections | Astro.glob() | Content collections provide type safety and validation; glob() is unstructured |
| Zod validation | Runtime validation | Zod catches errors at build time, preventing deployment of invalid content |
| Astro components | React/Vue components | Astro components are zero-JS by default, better performance for static educational content |

**Installation:**
Already installed. No additional packages needed.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── content/
│   ├── lessons/              # Main lesson content
│   │   ├── level-1/          # Beginner lessons
│   │   ├── level-2/          # Elementary lessons
│   │   ├── level-3/          # Intermediate lessons
│   │   ├── level-4/          # Advanced lessons
│   │   └── level-5/          # Expert lessons
│   └── resources/            # Existing resources (already exists)
├── content.config.ts         # Content collections configuration (NEW LOCATION in v5)
└── components/
    └── mdx/                  # MDX-specific educational components
        ├── ArabicExample.astro
        ├── GrammarTable.astro
        ├── VerbConjugation.astro
        ├── ExerciseBox.astro
        └── Callout.astro
```

### Pattern 1: Content Collection Definition with Glob Loader

**What:** Define content collections using the new Content Layer API with glob() loader and Zod schemas

**When to use:** For file-based content that needs type safety and validation

**Example:**
```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/lessons'
  }),
  schema: z.object({
    title: z.string(),
    level: z.number().int().min(1).max(5),
    order: z.number().int().positive(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { lessons };
```

### Pattern 2: MDX Component Import and Usage

**What:** Import Astro components directly into MDX files for educational content

**When to use:** For complex interactive or styled content that goes beyond standard markdown

**Example:**
```mdx
---
title: "Arabic Definite Article"
level: 1
order: 3
---

import ArabicExample from '../../components/mdx/ArabicExample.astro';
import Callout from '../../components/mdx/Callout.astro';

# The Definite Article (ال)

<Callout type="tip">
Arabic has only one article, which makes both masculine and feminine nouns definite.
</Callout>

<ArabicExample
  arabic="الْكِتَابُ"
  transliteration="al-kitābu"
  translation="the book"
  reference="Example"
/>
```

### Pattern 3: Component Mapping for Standard Markdown

**What:** Map standard markdown syntax to custom components for consistent styling

**When to use:** When you want markdown blockquotes, tables, or other elements to have custom styling

**Example:**
```astro
---
// In a layout file or when rendering content
import { getEntry, render } from 'astro:content';
import Callout from '../components/mdx/Callout.astro';

const entry = await getEntry('lessons', Astro.params.id);
const { Content } = await render(entry);
---
<Content components={{ blockquote: Callout }} />
```

### Pattern 4: RTL Support with Logical Properties

**What:** Use CSS logical properties (inline, block) instead of directional properties (left, right) for RTL compatibility

**When to use:** Always, for components that need to work with both LTR and RTL content

**Example:**
```css
/* Good - uses logical properties */
.component {
  padding-inline-start: var(--spacing-md);
  margin-block-end: var(--spacing-lg);
  text-align: start;
}

/* Bad - hardcoded LTR direction */
.component {
  padding-left: 1rem;
  margin-bottom: 2rem;
  text-align: left;
}
```

### Pattern 5: Accessible Show/Hide Component

**What:** Create accessible toggle/accordion components with proper ARIA attributes and keyboard support

**When to use:** For exercise answers, expandable explanations, or collapsible content

**Example:**
```astro
---
interface Props {
  question: string;
  answer: string;
}
const { question, answer } = Astro.props;
const id = `exercise-${Math.random().toString(36).substr(2, 9)}`;
---

<div class="exercise-box">
  <p class="question">{question}</p>
  <button
    type="button"
    id={`btn-${id}`}
    aria-expanded="false"
    aria-controls={`answer-${id}`}
    class="toggle-btn"
  >
    Show Answer
  </button>
  <div
    id={`answer-${id}`}
    aria-labelledby={`btn-${id}`}
    class="answer hidden"
  >
    {answer}
  </div>
</div>

<script>
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const answerId = btn.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', String(!isExpanded));
      btn.textContent = isExpanded ? 'Show Answer' : 'Hide Answer';
      answer?.classList.toggle('hidden');
    });
  });
</script>
```

### Anti-Patterns to Avoid

- **Using type: 'content' in collection definitions:** This is removed in Astro v5. Use loader instead.
- **Keeping config at src/content/config.ts:** Astro v5 expects src/content.config.ts (root of src/).
- **Using z.date() without z.coerce:** Frontmatter dates are strings; use `z.coerce.date()` to parse them.
- **Hardcoding left/right in CSS:** Use logical properties (inline-start/inline-end) for RTL compatibility.
- **Setting letter-spacing on Arabic text:** Arabic letters connect; letter-spacing breaks visual cohesion. Always set to 0.
- **Framework components for static content:** React/Vue add JS overhead. Use Astro components for zero-JS static content.
- **Underscore-prefixed files:** No longer supported in v5 for excluding files. Use glob patterns instead.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Frontmatter validation | Custom parsers with if/else checks | Zod schemas in content.config.ts | Catches errors at build time, generates TypeScript types, descriptive error messages |
| Markdown component mapping | String replacement or regex parsing | Astro's components prop on Content | Proper React/AST transformation, maintains component state and props |
| Content queries | File system globbing with fs.readdir | getCollection() from astro:content | Type-safe, respects schemas, integrated with Astro's build |
| Arabic text direction | JavaScript to detect and flip | CSS logical properties + dir="rtl" | Standards-based, no JS needed, works with SSR |
| Accessible accordions | DIV soup with jQuery | Semantic HTML + ARIA + native JS | Screen reader support, keyboard navigation, no dependencies |
| Date parsing in frontmatter | new Date() in runtime code | z.coerce.date() in schema | Build-time validation, catches bad dates before deploy |

**Key insight:** Astro's Content Layer API and Zod schemas handle the hard parts of content management (validation, type generation, querying). Custom solutions miss edge cases and don't integrate with TypeScript.

## Common Pitfalls

### Pitfall 1: Config File in Wrong Location

**What goes wrong:** After upgrading to Astro v5, content collections stop working or aren't recognized

**Why it happens:** Astro v5 changed the config location from `src/content/config.ts` to `src/content.config.ts` (at the root of src/)

**How to avoid:** Create the file at `src/content.config.ts` from the start. The new location enables content to live anywhere in the project, not just src/content/.

**Warning signs:**
- Build errors about missing collections
- TypeScript types not being generated for collections
- "Collection not defined" errors

### Pitfall 2: Using slug Instead of id

**What goes wrong:** Routes break or TypeScript errors appear when accessing collection entries

**Why it happens:** Astro v5 changed the identifier from `slug` to `id` for collection entries

**How to avoid:** Use `entry.id` (not `entry.slug`) when building routes or referencing entries

**Warning signs:**
- `Property 'slug' does not exist on type` TypeScript errors
- 404 errors on lesson pages
- getStaticPaths() returning undefined for params

### Pitfall 3: Date Format Validation Errors

**What goes wrong:** Build fails with "Expected date, received string" errors

**Why it happens:** Frontmatter dates are strings (YAML format), but `z.date()` expects Date objects

**How to avoid:** Use `z.coerce.date()` instead of `z.date()` in schemas to automatically parse string dates

**Warning signs:**
- Build errors mentioning date fields
- Valid YAML dates like "2024-01-15" being rejected
- TypeScript errors about string vs Date types

### Pitfall 4: Letter-Spacing on Arabic Text

**What goes wrong:** Arabic text looks broken with disconnected letters, destroying readability

**Why it happens:** Arabic letters connect to form words; letter-spacing breaks these connections

**How to avoid:** Always set `letter-spacing: 0` on elements containing Arabic text. Review inherited letter-spacing from design system components.

**Warning signs:**
- Arabic text with visible gaps between letters
- Words that look like individual letter blocks
- Reports from Arabic speakers about readability issues

### Pitfall 5: Collection Sort Order Assumptions

**What goes wrong:** Lessons appear in random order instead of the intended sequence

**Why it happens:** Astro v5 returns collection entries in non-deterministic order (platform-dependent)

**How to avoid:** Always explicitly sort collections when order matters:

```typescript
const lessons = await getCollection('lessons');
const sorted = lessons.sort((a, b) => a.data.order - b.data.order);
```

**Warning signs:**
- Lesson order changes between builds or deployments
- Level 3 lessons appearing before Level 1
- Order inconsistency between dev and production

### Pitfall 6: Missing Required Frontmatter Fields

**What goes wrong:** Build succeeds but pages render with undefined or missing data

**Why it happens:** Schema doesn't mark fields as required, or uses .optional() incorrectly

**How to avoid:** Be explicit about required vs optional fields. Use `.optional()` only for truly optional fields. Use `.default()` for fields with sensible defaults.

**Warning signs:**
- Pages showing "undefined" in titles
- Missing metadata in lesson cards
- Conditional rendering checking for field existence

### Pitfall 7: Render Function Location Error

**What goes wrong:** `entry.render()` is not a function error appears

**Why it happens:** Astro v5 moved render from being a method to a separate function

**How to avoid:** Import and use the standalone render function:

```typescript
// Old (Astro v4)
const { Content } = await entry.render();

// New (Astro v5)
import { render } from 'astro:content';
const { Content } = await render(entry);
```

**Warning signs:**
- TypeError: entry.render is not a function
- MDX content not rendering
- Pages showing raw frontmatter instead of content

## Code Examples

Verified patterns from official sources:

### Content Collection Schema with Zod Validation

```typescript
// src/content.config.ts
// Source: https://docs.astro.build/en/guides/content-collections/
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/lessons'
  }),
  schema: z.object({
    title: z.string(),
    level: z.number().int().min(1).max(5),
    order: z.number().int().positive(),
    description: z.string().optional(),
    pubDate: z.coerce.date(), // Use coerce for string-to-Date conversion
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const resources = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx,json}',
    base: './src/content/resources'
  }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['grammar', 'vocabulary', 'reading', 'reference']),
    description: z.string(),
  }),
});

export const collections = { lessons, resources };
```

### Querying and Rendering Collection Entries

```astro
---
// src/pages/lessons/[...id].astro
// Source: https://docs.astro.build/en/guides/content-collections/
import { getCollection, getEntry, render } from 'astro:content';
import LessonLayout from '../../layouts/LessonLayout.astro';

export async function getStaticPaths() {
  const lessons = await getCollection('lessons', ({ data }) => {
    return data.draft !== true; // Filter out drafts
  });

  return lessons
    .sort((a, b) => a.data.order - b.data.order)
    .map(lesson => ({
      params: { id: lesson.id },
      props: { lesson },
    }));
}

const { lesson } = Astro.props;
const { Content } = await render(lesson);
---

<LessonLayout title={lesson.data.title} level={lesson.data.level}>
  <Content />
</LessonLayout>
```

### Educational Callout Component

```astro
---
// src/components/mdx/Callout.astro
// Inspired by: https://starlight.astro.build/components/asides/
interface Props {
  type?: 'note' | 'tip' | 'caution' | 'warning';
  title?: string;
}

const { type = 'note', title } = Astro.props;

const icons = {
  note: '💡',
  tip: '✨',
  caution: '⚠️',
  warning: '🚨',
};

const titles = {
  note: title || 'Note',
  tip: title || 'Tip',
  caution: title || 'Caution',
  warning: title || 'Warning',
};
---

<aside class={`callout callout-${type}`} role="note">
  <p class="callout-title">
    <span class="callout-icon" aria-hidden="true">{icons[type]}</span>
    <strong>{titles[type]}</strong>
  </p>
  <div class="callout-content">
    <slot />
  </div>
</aside>

<style>
  .callout {
    padding: var(--spacing-md);
    border-inline-start: 4px solid;
    border-radius: var(--radius-md);
    margin-block: var(--spacing-lg);
  }

  .callout-note {
    background-color: rgba(59, 130, 246, 0.1);
    border-color: rgb(59, 130, 246);
  }

  .callout-tip {
    background-color: rgba(168, 85, 247, 0.1);
    border-color: rgb(168, 85, 247);
  }

  .callout-caution {
    background-color: rgba(245, 158, 11, 0.1);
    border-color: rgb(245, 158, 11);
  }

  .callout-warning {
    background-color: rgba(239, 68, 68, 0.1);
    border-color: rgb(239, 68, 68);
  }

  .callout-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-block-end: var(--spacing-sm);
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .callout-content {
    font-size: 0.9375rem;
    line-height: 1.6;
  }

  .callout-content :global(p:last-child) {
    margin-block-end: 0;
  }
</style>
```

### Arabic Example Component

```astro
---
// src/components/mdx/ArabicExample.astro
interface Props {
  arabic: string;
  transliteration?: string;
  translation: string;
  reference?: string;
  highlight?: string; // Words to highlight for grammar focus
}

const { arabic, transliteration, translation, reference, highlight } = Astro.props;
---

<div class="arabic-example" dir="rtl">
  <p class="arabic-text">{arabic}</p>
  {transliteration && (
    <p class="transliteration" dir="ltr">{transliteration}</p>
  )}
  <p class="translation" dir="ltr">{translation}</p>
  {reference && (
    <p class="reference" dir="ltr">— {reference}</p>
  )}
</div>

<style>
  .arabic-example {
    background-color: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    margin-block: var(--spacing-lg);
  }

  .arabic-text {
    font-family: 'Amiri Quran', 'Amiri', serif;
    font-size: 1.5rem;
    line-height: 2;
    color: var(--color-text-primary);
    margin-block-end: var(--spacing-md);
    letter-spacing: 0; /* Critical for Arabic - no letter spacing */
  }

  .transliteration {
    font-family: monospace;
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    margin-block-end: var(--spacing-sm);
    font-style: italic;
  }

  .translation {
    font-size: 1rem;
    color: var(--color-text-primary);
    margin-block-end: var(--spacing-xs);
  }

  .reference {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    font-style: italic;
    margin-block-end: 0;
  }
</style>
```

### Grammar Table Component (Responsive with RTL)

```astro
---
// src/components/mdx/GrammarTable.astro
// Source: https://flowbite.com/docs/components/tables/ (RTL support patterns)
interface Props {
  caption?: string;
  headers: string[];
  rows: string[][];
}

const { caption, headers, rows } = Astro.props;
---

<div class="table-wrapper">
  <table class="grammar-table" dir="rtl">
    {caption && <caption>{caption}</caption>}
    <thead>
      <tr>
        {headers.map(header => (
          <th scope="col">{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map(row => (
        <tr>
          {row.map((cell, idx) => (
            idx === 0
              ? <th scope="row">{cell}</th>
              : <td>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

<style>
  .table-wrapper {
    overflow-x: auto;
    margin-block: var(--spacing-lg);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-primary);
  }

  .grammar-table {
    inline-size: 100%;
    border-collapse: collapse;
    font-size: 0.9375rem;
  }

  caption {
    padding-block: var(--spacing-md);
    font-weight: 600;
    text-align: start;
    color: var(--color-text-primary);
    background-color: var(--color-background-secondary);
  }

  thead {
    background-color: var(--color-background-tertiary);
    border-block-end: 2px solid var(--color-border-primary);
  }

  th {
    padding: var(--spacing-md);
    text-align: start; /* Uses logical direction */
    font-weight: 600;
    color: var(--color-text-primary);
    letter-spacing: 0; /* Critical for Arabic headers */
  }

  td {
    padding: var(--spacing-md);
    text-align: start;
    color: var(--color-text-secondary);
    border-block-start: 1px solid var(--color-border-secondary);
    letter-spacing: 0; /* Critical for Arabic content */
  }

  tbody tr:hover {
    background-color: var(--color-background-secondary);
  }

  /* Responsive: Stack on mobile */
  @media (max-width: 640px) {
    .grammar-table thead {
      display: none;
    }

    .grammar-table tr {
      display: block;
      margin-block-end: var(--spacing-md);
      border: 1px solid var(--color-border-primary);
      border-radius: var(--radius-sm);
    }

    .grammar-table td {
      display: block;
      text-align: end;
      border: none;
      position: relative;
      padding-inline-start: 50%;
    }

    .grammar-table td::before {
      content: attr(data-label);
      position: absolute;
      inset-inline-start: var(--spacing-md);
      font-weight: 600;
      color: var(--color-text-primary);
    }
  }
</style>
```

### Exercise Box with Show/Hide Answer

```astro
---
// src/components/mdx/ExerciseBox.astro
// Inspired by: https://webreaper.dev/posts/astro-accessible-accordion/
interface Props {
  question: string;
  id?: string;
}

const { question, id = `exercise-${Math.random().toString(36).substr(2, 9)}` } = Astro.props;
---

<div class="exercise-box">
  <p class="exercise-question">{question}</p>
  <button
    type="button"
    id={`btn-${id}`}
    aria-expanded="false"
    aria-controls={`answer-${id}`}
    class="toggle-answer"
  >
    <span class="toggle-text">Show Answer</span>
    <span class="toggle-icon" aria-hidden="true">▼</span>
  </button>
  <div
    id={`answer-${id}`}
    aria-labelledby={`btn-${id}`}
    class="exercise-answer"
    hidden
  >
    <slot />
  </div>
</div>

<style>
  .exercise-box {
    background-color: var(--color-background-secondary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    margin-block: var(--spacing-lg);
  }

  .exercise-question {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-primary);
    margin-block-end: var(--spacing-md);
    line-height: 1.6;
  }

  .toggle-answer {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-accent-primary);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 200ms;
  }

  .toggle-answer:hover {
    background-color: var(--color-accent-hover);
  }

  .toggle-answer:focus-visible {
    outline: 2px solid var(--color-accent-primary);
    outline-offset: 2px;
  }

  .toggle-icon {
    display: inline-block;
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 0.75rem;
  }

  .toggle-answer[aria-expanded="true"] .toggle-icon {
    transform: rotate(180deg);
  }

  .exercise-answer {
    margin-block-start: var(--spacing-md);
    padding-block-start: var(--spacing-md);
    border-block-start: 1px solid var(--color-border-secondary);
  }

  .exercise-answer[hidden] {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-icon {
      transition: none;
    }
  }
</style>

<script>
  // Re-initialize after view transitions
  document.addEventListener('astro:page-load', initExercises);

  function initExercises() {
    document.querySelectorAll('.toggle-answer').forEach(btn => {
      btn.addEventListener('click', () => {
        const answerId = btn.getAttribute('aria-controls');
        const answer = document.getElementById(answerId);
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';

        btn.setAttribute('aria-expanded', String(!isExpanded));
        const textSpan = btn.querySelector('.toggle-text');
        if (textSpan) {
          textSpan.textContent = isExpanded ? 'Show Answer' : 'Hide Answer';
        }

        if (answer) {
          answer.hidden = isExpanded;
        }
      });
    });
  }

  // Initialize on first load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExercises);
  } else {
    initExercises();
  }
</script>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| src/content/config.ts | src/content.config.ts | Astro v5.0 (Dec 2025) | Config can now reference content anywhere in project |
| type: 'content' | loader: glob() | Astro v5.0 | More flexible, supports remote sources, 5x faster builds |
| entry.slug | entry.id | Astro v5.0 | Consistent naming across different content sources |
| await entry.render() | await render(entry) | Astro v5.0 | Separates concern, allows more flexibility |
| Astro.glob() | getCollection() | Astro v2.0 | Type-safe, validated, integrated with content layer |
| left/right CSS | inline-start/inline-end | CSS Logical Properties | RTL support without JS, W3C standard |

**Deprecated/outdated:**
- **type: 'content' and type: 'data'**: Removed in v5. Use loader property instead.
- **Underscore-prefixed files (_draft.md)**: No longer filters files. Use glob patterns or schema-based filtering.
- **entry.slug**: Changed to entry.id for consistency across content sources.
- **Layout field in frontmatter**: No longer supported. Handle layouts in page/route components.
- **Deterministic collection ordering**: getCollection() now returns entries in non-deterministic order. Always sort explicitly.

## Open Questions

Things that couldn't be fully resolved:

1. **Quran text source format**
   - What we know: Quranic text should be frozen in MDX (no runtime API dependency), proper Arabic typography critical
   - What's unclear: Best source format for Quranic Arabic (JSON, MDX data files, embedded in lessons?)
   - Recommendation: Use a structured JSON file loaded via file() loader with Quranic verses pre-formatted. This keeps lessons clean and enables reuse across multiple lessons.

2. **Verb conjugation table complexity**
   - What we know: Arabic has 13 grammatical persons and complex conjugation patterns
   - What's unclear: Should tables be data-driven (JSON) or hardcoded in MDX per lesson?
   - Recommendation: Start with hardcoded tables in MDX using GrammarTable component. If patterns emerge, extract to JSON with a VerbConjugation wrapper component that accepts structured data.

3. **Component global availability vs explicit imports**
   - What we know: Can map components globally via render() or import per-file
   - What's unclear: Which approach is better for 73 lessons?
   - Recommendation: Explicit imports in each MDX file. Makes dependencies clear, easier to track usage, no magic. The extra imports are worth the clarity for educational content.

4. **Bilingual terminology display pattern**
   - What we know: Must show both English and Arabic terms (e.g., "Definite Article (ال)")
   - What's unclear: Component-based solution or just markdown convention?
   - Recommendation: Start with markdown convention, create BilingualTerm component only if complex styling or hover states are needed.

## Sources

### Primary (HIGH confidence)
- [Astro Content Collections Guide](https://docs.astro.build/en/guides/content-collections/) - Official documentation for content layer API
- [Astro Content Collections API Reference](https://docs.astro.build/en/reference/modules/astro-content/) - API details for defineCollection, getCollection, render
- [Astro MDX Integration Guide](https://docs.astro.build/en/guides/integrations-guide/mdx/) - Official MDX component patterns
- [Astro v5 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v5/) - Breaking changes and migration steps
- [W3C Arabic & Persian Layout Requirements](https://www.w3.org/TR/alreq/) - Authoritative Arabic typography standards

### Secondary (MEDIUM confidence)
- [Astro Starlight Aside Component](https://starlight.astro.build/components/asides/) - Verified callout/aside patterns
- [Flowbite Tailwind CSS RTL Support](https://dev.to/themesberg/tailwind-rtl-support-for-ui-components-flowbite-9h) - RTL patterns for Tailwind
- [Accessible Accordion in Astro](https://webreaper.dev/posts/astro-accessible-accordion/) - ARIA patterns for show/hide
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/) - Best practices for right-to-left layouts

### Tertiary (LOW confidence)
- [Astro Content Collections Complete 2026 Guide](https://inhaq.com/blog/getting-started-with-astro-content-collections/) - Community guide (verify patterns with official docs)
- [Arabic Verb Conjugation Display](https://kalimah-center.com/arabic-verb-conjugation/) - Example of table structure for verb conjugation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Astro v5 API, project already on v5.17.1, verified with official documentation
- Architecture: HIGH - Patterns directly from Astro docs and W3C standards, verified with multiple authoritative sources
- Pitfalls: HIGH - Documented in official upgrade guide and observed in migration discussions

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days - stable domain, but Astro releases regularly)

**Project-specific notes:**
- Project is already on Astro v5.17.1 - no upgrade needed
- Existing component library uses CSS custom properties and logical properties - maintain consistency
- Project has working Quiz component as reference for interactive patterns
- @astrojs/mdx already installed and configured
- No CONTEXT.md exists - full freedom on implementation approach
