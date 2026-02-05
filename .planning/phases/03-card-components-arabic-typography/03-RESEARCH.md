# Phase 3: Card Components & Arabic Typography - Research

**Researched:** 2026-02-06
**Domain:** Astro component composition, CSS Grid responsive layouts, Arabic text line-breaking
**Confidence:** HIGH

## Summary

Phase 3 requires creating four specialized card components (CourseCard, LessonCard, SurahCard, ResourceCard) that handle Arabic text overflow correctly within responsive grid layouts. The research reveals three critical technical domains:

1. **Arabic Typography**: Arabic text must use `overflow-wrap: break-word` (not `word-break: break-all`) and must never use hyphenation or letter-spacing, as these properties break visual connections between Arabic characters.

2. **Responsive Grid Pattern**: CSS Grid with `repeat(auto-fit, minmax(300px, 1fr))` provides the 1-3 column responsive behavior. The `auto-fit` value collapses empty tracks and distributes width, while `minmax()` ensures cards don't shrink below 300px before wrapping.

3. **Component Composition**: Astro's named slots (`header`, `default`, `footer`) enable flexible card composition. The existing primitive `Card.astro` provides the foundation; specialized cards compose it with domain-specific layouts.

**Primary recommendation:** Build specialized cards as composition layers over the existing `Card.astro` primitive, use CSS logical properties universally for RTL support, and apply `overflow-wrap: break-word` to all Arabic text containers.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro Components | 5.x | Component framework | Already in use; native slot support |
| CSS Grid | Native | Responsive layouts | Modern, no dependencies, excellent browser support |
| CSS Logical Properties | Native | RTL/LTR adaptation | W3C recommended for bidirectional text |
| CSS clamp() | Native | Fluid spacing/typography | Reduces media query complexity for responsive scaling |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Playwright | Latest | Visual regression testing | Verify Arabic text rendering and card layouts |
| data-testid attributes | N/A | Test targeting | Already established in Phase 2 patterns |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Grid | Flexbox with flex-wrap | Grid is more declarative for 2D layouts; Flexbox better for 1D |
| Named slots | Prop-based composition | Slots better for HTML/component injection; props better for data |
| overflow-wrap | word-break: break-all | word-break breaks mid-word aggressively; overflow-wrap prefers natural breaks |

**Installation:**
```bash
# No new dependencies required - using native CSS and Astro features
```

## Architecture Patterns

### Recommended Project Structure
```
src/components/
├── cards/               # Specialized card components
│   ├── CourseCard.astro
│   ├── LessonCard.astro
│   ├── SurahCard.astro
│   └── ResourceCard.astro
├── primitives/          # Foundation components (already exists)
│   └── Card.astro       # Base card primitive
└── progress/            # Progress indicators (already exists)
```

### Pattern 1: Card Composition with Named Slots
**What:** Specialized cards compose the primitive `Card.astro` and provide structured slots for content zones
**When to use:** When multiple card types share foundation (borders, padding, hover states) but differ in content layout

**Example:**
```astro
---
// src/components/cards/LessonCard.astro
import Card from '../primitives/Card.astro';
import Badge from '../primitives/Badge.astro';
import LessonCheckmark from '../progress/LessonCheckmark.astro';

interface Props {
  title: string;
  titleArabic?: string;
  level: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
  href: string;
  class?: string;
}

const { title, titleArabic, level, completed, href, class: className } = Astro.props;
---

<Card variant="elevated" clickable={true} href={href} class={`lesson-card ${className || ''}`}>
  <div class="lesson-card-header">
    <LessonCheckmark completed={completed} />
    <Badge level={level}>Level {level}</Badge>
  </div>

  <div class="lesson-card-content">
    <h3 class="lesson-title">{title}</h3>
    {titleArabic && (
      <p class="lesson-title-arabic" dir="rtl" lang="ar">{titleArabic}</p>
    )}
    <slot name="description" />
  </div>

  <slot name="footer" />
</Card>

<style>
  .lesson-card {
    container-type: inline-size;
  }

  .lesson-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: var(--spacing-md);
  }

  .lesson-card-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .lesson-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .lesson-title-arabic {
    font-family: 'Amiri', serif;
    font-size: var(--font-size-xl);
    color: var(--color-text-secondary);
    direction: rtl;
    text-align: start;

    /* Critical for Arabic text wrapping */
    overflow-wrap: break-word;
    word-wrap: break-word; /* Fallback for older browsers */
    hyphens: none;
    letter-spacing: 0; /* Never use letter-spacing with Arabic */
  }
</style>
```

### Pattern 2: Responsive Card Grid with CSS Grid
**What:** Single-line CSS Grid pattern that adapts from 1 to 3 columns based on viewport
**When to use:** For displaying collections of cards (lessons, courses, resources)

**Example:**
```css
/* Source: MDN, CSS-Tricks Grid Guide */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
  inline-size: 100%;
}

/* For tighter mobile layouts */
@container (max-width: 400px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
```

**How it works:**
- `auto-fit`: Collapses empty columns and distributes space to existing cards
- `minmax(300px, 1fr)`: Cards never shrink below 300px; excess space distributed equally
- `clamp(1rem, 3vw, 2rem)`: Fluid gap scales from 16px to 32px without media queries
- Result: 3 columns on desktop (>900px), 2 on tablet (600-900px), 1 on mobile (<600px)

### Pattern 3: Progress Indicators in Cards
**What:** Integrate existing `ProgressBar`, `ProgressRing`, or `LessonCheckmark` into card layouts
**When to use:** CourseCard and LessonCard need to show completion status

**Example:**
```astro
<Card variant="elevated" href={`/learn/level-${level}`} clickable>
  <div class="course-card-header">
    <h3>{courseName}</h3>
    <ProgressRing current={lessonsCompleted} total={totalLessons} size={60} />
  </div>
  <ProgressBar value={progressPercent} height="sm" />
  <p class="course-description"><slot /></p>
</Card>

<style>
  .course-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-md);
    margin-block-end: var(--spacing-sm);
  }
</style>
```

### Pattern 4: Whole Card Clickability (Accessible)
**What:** Make entire card clickable without wrapping all content in `<a>`, preserving semantics
**When to use:** Cards that link to detail pages (lessons, courses, surahs)

**Already implemented in `Card.astro`:**
```astro
---
const Tag = href ? 'a' : 'div';
---
<Tag class={cardClass} href={href}>
  <slot />
</Tag>
```

This approach is superior to:
- ❌ Wrapping all content in `<a>` (breaks heading hierarchy)
- ❌ JavaScript click delegation (breaks without JS)
- ✅ Dynamic tag rendering based on `href` prop (semantic, accessible, progressive)

### Anti-Patterns to Avoid

- **Don't nest interactive elements**: Never put `<button>` inside a clickable card's `<a>` tag
- **Don't use pixel-based breakpoints for cards**: Use CSS Grid `auto-fit` instead
- **Don't apply word-break to Arabic text**: Use `overflow-wrap` only
- **Don't use equal-height tricks**: CSS Grid handles this automatically with `grid-auto-rows`
- **Don't hardcode card dimensions**: Use `minmax()` with flexible maximum (1fr)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive card grids | Custom breakpoint logic | `repeat(auto-fit, minmax())` | Handles all viewport sizes with one line; no JS needed |
| Fluid spacing/typography | Multiple media queries | `clamp(min, preferred, max)` | Scales continuously; reduces breakpoint count |
| RTL/LTR layout switching | Separate stylesheets | CSS logical properties | Single codebase; automatic adaptation |
| Accessible card links | JavaScript click handlers | Native `<a>` with CSS styling | Works without JS; keyboard accessible by default |
| Dark mode card styles | Manual color overrides | CSS custom properties | Theme switches via `data-theme` attribute |
| Card skeleton loading | Custom placeholder HTML | Native CSS Grid with consistent sizing | Grid maintains layout; placeholders fill cells |

**Key insight:** CSS Grid and logical properties eliminate 90% of custom responsive card code. The remaining 10% is semantic HTML structure and design token application.

## Common Pitfalls

### Pitfall 1: Arabic Text Breaking Mid-Word on Mobile
**What goes wrong:** Using `word-break: break-all` causes Arabic text to break between connected letters, visually severing words.

**Why it happens:** `word-break: break-all` breaks at any character to prevent overflow, ignoring script-specific rules. Arabic letters connect visually, so mid-word breaks destroy readability.

**How to avoid:**
```css
/* ❌ WRONG - breaks Arabic text */
.arabic-text {
  word-break: break-all;
}

/* ✅ CORRECT - respects word boundaries */
.arabic-text {
  overflow-wrap: break-word;
  word-wrap: break-word; /* Fallback */
  hyphens: none; /* Arabic doesn't use hyphens */
  letter-spacing: 0; /* Never add letter-spacing to Arabic */
}
```

**Warning signs:**
- Arabic letters appear disconnected on mobile
- Text looks "choppy" at narrow widths
- Users report readability issues with Arabic titles

**Source:** [W3C Internationalization - Arabic Line Breaking](https://w3c.github.io/i18n-drafts/articles/typography/linebreak.en)

### Pitfall 2: Card Grid Gaps Inconsistent Across Breakpoints
**What goes wrong:** Using fixed `gap` values (e.g., `gap: 24px`) causes cards to feel cramped on mobile and too spaced on desktop.

**Why it happens:** Fixed spacing doesn't scale with viewport size; requires multiple media queries to feel natural.

**How to avoid:**
```css
/* ❌ WRONG - requires breakpoint tuning */
.card-grid {
  gap: 24px;
}
@media (max-width: 768px) {
  .card-grid { gap: 16px; }
}

/* ✅ CORRECT - fluid scaling */
.card-grid {
  gap: clamp(1rem, 3vw, 2rem);
}
```

**Warning signs:**
- Cards feel too tight on mobile or too spread on desktop
- Need to add multiple breakpoints just for spacing
- Design requires "in-between" breakpoints at unusual widths

### Pitfall 3: Progress Indicators Misaligned in Cards
**What goes wrong:** `ProgressRing` or `ProgressBar` components don't align properly with card content, especially when Arabic text is present.

**Why it happens:** Mixing block-level and inline-level layout without explicit alignment rules.

**How to avoid:**
```css
/* Use Flexbox for header alignment */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Not center - allows Arabic text to flow */
  gap: var(--spacing-md);
}

/* Ensure progress ring doesn't shrink */
.progress-ring {
  flex-shrink: 0;
}
```

**Warning signs:**
- Progress indicators shift vertically when text wraps
- Arabic titles push progress ring out of alignment
- Header layout breaks at intermediate widths

### Pitfall 4: Hover States Invisible in Dark Mode
**What goes wrong:** Card hover effects use fixed colors (e.g., `box-shadow: 0 4px 8px rgba(0,0,0,0.1)`) that don't adapt to dark mode.

**Why it happens:** Hardcoded RGBA values don't reference theme-aware CSS variables.

**How to avoid:**
```css
/* ❌ WRONG - same shadow in light and dark */
.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* ✅ CORRECT - uses design token */
.card:hover {
  box-shadow: var(--shadow-medium);
}
```

**Already handled in `Card.astro`:** Primitive card uses `var(--shadow-medium)` which adapts to `data-theme="dark"` via global.css definitions.

**Warning signs:**
- Hover effects barely visible in dark mode
- Cards don't appear interactive in dark theme
- Users miss clickable cards in dark mode

### Pitfall 5: Card Content Overflows on Small Containers
**What goes wrong:** Long English words or Arabic text overflow card boundaries on mobile, breaking the grid layout.

**Why it happens:** Not setting `overflow-wrap` on all text containers; using fixed widths instead of logical constraints.

**How to avoid:**
```css
.card {
  /* Use logical property for width constraint */
  inline-size: 100%;
  min-inline-size: 0; /* Allow grid to shrink card below content width */
  overflow: hidden; /* Prevent overflow breaking grid */
}

.card-content {
  overflow-wrap: break-word;
  word-wrap: break-word;
  min-inline-size: 0;
}
```

**Warning signs:**
- Cards wider than grid columns on mobile
- Horizontal scroll appears in card grids
- Text overflows card borders at narrow widths

## Code Examples

Verified patterns from official sources:

### Responsive Card Grid Layout
```css
/* Source: CSS-Tricks, MDN Grid Guide */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
  padding-inline: var(--spacing-md);
  padding-block: var(--spacing-lg);
}

/* Optional: Limit maximum columns on ultra-wide screens */
@media (min-width: 1400px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Arabic Text Typography (Safe Line Breaking)
```css
/* Source: W3C Internationalization, MDN Text Wrapping */
.arabic-text {
  font-family: 'Amiri', serif;
  direction: rtl;
  text-align: start; /* Not 'right' - use logical value */

  /* Safe line breaking for Arabic */
  overflow-wrap: break-word;
  word-wrap: break-word; /* IE/Edge fallback */
  hyphens: none; /* Arabic doesn't hyphenate */

  /* Never use these with Arabic */
  letter-spacing: 0; /* Breaks character connections */
  word-break: normal; /* Don't use break-all */
}
```

### Fluid Card Spacing with clamp()
```css
/* Source: Smashing Magazine, CSS clamp() guide */
.card {
  /* Fluid padding: 16px mobile → 24px desktop */
  padding-inline: clamp(1rem, 2vw, 1.5rem);
  padding-block: clamp(1rem, 2vw, 1.5rem);

  /* Fluid title size: 18px → 24px */
  & .card-title {
    font-size: clamp(1.125rem, 1.5vw, 1.5rem);
  }

  /* Fluid gap between card sections */
  & .card-content {
    display: flex;
    flex-direction: column;
    gap: clamp(0.5rem, 1.5vw, 1rem);
  }
}
```

### Accessible Clickable Card
```astro
---
// Source: Inclusive Components - Cards
// Already implemented in Card.astro
interface Props {
  href?: string;
  clickable?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

const { href, clickable, variant = 'default' } = Astro.props;
const Tag = href ? 'a' : 'div';
---

<Tag
  class={`card card-${variant} ${clickable || href ? 'card-clickable' : ''}`}
  href={href}
>
  <slot />
</Tag>

<style>
  .card {
    display: block;
    text-decoration: none;
    color: inherit;
    transition: all 200ms ease;
  }

  .card-clickable {
    cursor: pointer;
  }

  .card-clickable:hover {
    box-shadow: var(--shadow-medium);
    transform: translateY(-2px);
  }

  .card-clickable:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .card {
      transition: none;
    }
    .card-clickable:hover {
      transform: none;
    }
  }
</style>
```

### Progress Indicator Integration
```astro
---
// CourseCard with ProgressBar integration
import Card from '../primitives/Card.astro';
import ProgressBar from '../progress/ProgressBar.astro';
import Badge from '../primitives/Badge.astro';

interface Props {
  title: string;
  level: 1 | 2 | 3 | 4 | 5;
  lessonsCompleted: number;
  totalLessons: number;
  href: string;
}

const { title, level, lessonsCompleted, totalLessons, href } = Astro.props;
const progress = Math.round((lessonsCompleted / totalLessons) * 100);
---

<Card variant="elevated" href={href} clickable>
  <div class="course-card-layout">
    <div class="course-header">
      <h3 class="course-title">{title}</h3>
      <Badge level={level}>Level {level}</Badge>
    </div>

    <div class="course-progress">
      <span class="progress-text">{lessonsCompleted} of {totalLessons} lessons</span>
      <ProgressBar value={progress} height="sm" label={`${progress}% complete`} />
    </div>

    <div class="course-description">
      <slot />
    </div>
  </div>
</Card>

<style>
  .course-card-layout {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .course-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-md);
  }

  .course-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }

  .course-progress {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .progress-text {
    font-size: var(--font-size-sm);
    color: var(--color-text-tertiary);
  }

  .course-description {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
</style>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Flexbox with media queries | CSS Grid with auto-fit | ~2020 | Single-line responsive grids |
| Fixed spacing with breakpoints | clamp() for fluid spacing | ~2021 | Reduces media query count by 50-70% |
| Separate RTL stylesheets | CSS logical properties | ~2022 | Single codebase for bidirectional layouts |
| word-wrap: break-word | overflow-wrap: break-word | 2023 | `word-wrap` now alias; `overflow-wrap` is standard |
| container queries @media | @container queries | 2023 | Component-based responsive design |
| :focus + JavaScript | :focus-within | 2022 | Native focus state for card children |

**Deprecated/outdated:**
- `word-wrap`: Now an alias for `overflow-wrap`; prefer `overflow-wrap` in new code
- Fixed breakpoint grids: `@media (min-width: 768px)` replaced by `auto-fit` pattern
- Separate RTL CSS: Modern logical properties eliminate need for `[dir=rtl]` overrides
- Pixel-based spacing: Design tokens with `clamp()` replace fixed pixel values

## Open Questions

Things that couldn't be fully resolved:

1. **Card aspect ratio consistency**
   - What we know: CSS Grid handles equal heights automatically
   - What's unclear: Whether variable-height cards (due to Arabic text wrapping) should be normalized or accepted
   - Recommendation: Allow natural height variation; use `align-items: start` in grid to prevent stretching

2. **Progress indicator placement preference**
   - What we know: Material Design and PatternFly place progress at card bottom
   - What's unclear: User preference between header (Coursera-style) vs footer placement
   - Recommendation: Test both during `/gsd:discuss-phase` if needed; header placement more prominent

3. **Container query adoption timing**
   - What we know: `@container` queries are well-supported (Chrome 105+, Firefox 110+, Safari 16+)
   - What's unclear: Whether Tailwind CSS 4.x in this project supports container queries
   - Recommendation: Use standard `@container` in component styles; fallback to media queries if unsupported

## Sources

### Primary (HIGH confidence)
- [MDN - Wrapping and breaking text](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Text/Wrapping_breaking_text) - overflow-wrap vs word-break
- [W3C Internationalization - Arabic Line Breaking](https://w3c.github.io/i18n-drafts/articles/typography/linebreak.en) - Arabic text wrapping rules
- [Astro Docs - Components](https://docs.astro.build/en/basics/astro-components/) - Slot composition patterns
- [Inclusive Components - Cards](https://inclusive-components.design/cards/) - Accessible card patterns
- [MDN - CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Auto-placement) - auto-fit and minmax()

### Secondary (MEDIUM confidence)
- [CSS-Tricks - Grid Layout Guide](https://css-tricks.com/css-grid-layout-guide/) - Grid patterns
- [Smashing Magazine - Fluid Typography with clamp()](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/) - Responsive spacing
- [LogRocket - Card Interface Design](https://blog.logrocket.com/ux-design/ui-card-design/) - Card best practices
- [Material Design - Progress Indicators](https://m2.material.io/components/progress-indicators) - Progress in cards
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/) - RTL common mistakes

### Tertiary (LOW confidence - marked for validation)
- [Dev.to - Responsive Card Layout with CSS Grid](https://dev.to/m97chahboun/responsive-card-layout-with-css-grid-a-step-by-step-guide-3ej1) - Basic patterns only
- [Medium - Cards and Composability](https://medium.com/eightshapes-llc/cards-and-composability-in-design-systems-8845ecbee50e) - Design philosophy

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native CSS and Astro features; no external dependencies
- Architecture: HIGH - Astro slot patterns official; CSS Grid well-documented
- Arabic typography: HIGH - W3C and MDN official guidance verified
- Pitfalls: MEDIUM - Based on WebSearch + official docs cross-reference

**Research date:** 2026-02-06
**Valid until:** ~60 days (CSS and component patterns stable; Arabic typography rules unchanged)
