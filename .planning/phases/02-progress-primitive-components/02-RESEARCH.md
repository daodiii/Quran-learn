# Phase 2: Progress & Primitive Components - Research

**Researched:** 2026-02-05
**Domain:** React/Astro UI components, progress visualization, RTL support, accessibility (ARIA), design token integration
**Confidence:** HIGH

## Summary

Phase 2 builds reusable UI primitives and progress visualization components on top of the design token system established in Phase 1. The project uses Astro 5.17.1 with Tailwind 4.1.18, and already has token files (colors, spacing, typography, shadows) that reference CSS variables for theme switching. This phase creates three progress components (ProgressBar, ProgressRing, LessonCheckmark) and four primitive components (Button, Badge, Card, Container) that consume these tokens and work correctly in RTL mode.

The standard approach uses Astro's native component system (no React needed for static components), SVG for circular progress rings with stroke-dasharray/stroke-dashoffset mathematics, CSS logical properties for RTL support, and ARIA progressbar role for accessibility. All components should respect `prefers-reduced-motion` for accessible animations and use semantic HTML where possible.

**Key challenge:** Building components that seamlessly integrate with existing design tokens, support both LTR and RTL layouts without duplication, and provide proper ARIA attributes for screen readers while maintaining Astro's zero-JavaScript baseline for static elements.

**Primary recommendation:** Use native Astro components with TypeScript props for all static UI, add `<script>` tags only for interactive elements (progress animations), implement CSS logical properties universally, follow ARIA progressbar pattern with proper labeling, and create a `/components/primitives/` folder structure that mirrors design system organization.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.17.1 | Component framework | Already in use, renders to static HTML with optional islands of interactivity |
| Tailwind CSS | 4.1.18 | Design token utilities | Phase 1 established @theme tokens, components consume via utility classes |
| TypeScript | Latest | Type-safe props | Astro components support TypeScript interfaces for prop validation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Playwright | 1.58.1 | Visual regression testing | Already installed in Phase 1, use for component snapshot testing |
| @playwright/test | 1.58.1 | Component testing | For interactive components requiring event simulation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Astro components | React components | React adds unnecessary JavaScript for static progress bars/badges. Use Astro's native system. |
| Native `<progress>` | Custom SVG progress | Native element has styling limitations, custom SVG provides full design control for Coursera-like aesthetics |
| react-circular-progressbar | Hand-built SVG ring | Library adds 15KB+ dependency for simple math (stroke-dashoffset). Build custom component. |
| Framer Motion | CSS transitions | Framer Motion requires React and adds JavaScript overhead. Use CSS transitions with `prefers-reduced-motion`. |

**Installation:**
```bash
# All dependencies already installed
# No additional packages needed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── primitives/           # Reusable UI primitives
│   │   ├── Button.astro      # Button component with variants
│   │   ├── Badge.astro       # Badge component (level indicators)
│   │   ├── Card.astro        # Card container component
│   │   └── Container.astro   # Layout container with max-width
│   ├── progress/             # Progress visualization components
│   │   ├── ProgressBar.astro # Horizontal 0-100% bar
│   │   ├── ProgressRing.astro # Circular X/Y lesson counter
│   │   └── LessonCheckmark.astro # Binary completion state
│   ├── Header.astro          # Existing components
│   ├── Footer.astro
│   └── ...
└── styles/
    ├── tokens/               # Design tokens (from Phase 1)
    │   ├── colors.css
    │   ├── spacing.css
    │   └── ...
    └── global.css
```

### Pattern 1: Astro Component with TypeScript Props

**What:** Define component interface with TypeScript, destructure props with defaults, render static HTML.

**When to use:** All static components (badges, cards, static progress bars).

**Example:**
```astro
---
// Source: Astro official docs - https://docs.astro.build/en/basics/astro-components/
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

const { variant = 'primary', size = 'md' } = Astro.props;
---

<button class={`btn btn-${variant} btn-${size}`}>
  <slot />
</button>

<style>
  .btn {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    font-weight: 500;
    transition: all 150ms ease;
  }

  .btn-primary {
    background-color: var(--color-accent-primary);
    color: var(--color-text-inverse);
  }

  /* RTL support with logical properties */
  .btn {
    margin-inline-start: var(--spacing-sm);
  }

  /* Accessibility: reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .btn {
      transition: none;
    }
  }
</style>
```

### Pattern 2: ARIA Progressbar Implementation

**What:** Implement accessible progress indicators using the progressbar role with proper ARIA attributes.

**When to use:** All progress components (bars and rings) to ensure screen reader compatibility.

**Example:**
```astro
---
// Source: MDN ARIA progressbar - https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role
interface Props {
  value: number;      // Current progress (0-100)
  max?: number;       // Maximum value (default: 100)
  label: string;      // Accessible name (required)
  showLabel?: boolean; // Display visible label
}

const { value, max = 100, label, showLabel = true } = Astro.props;
const percentage = Math.min(100, Math.max(0, (value / max) * 100));
---

<div class="progress-wrapper">
  {showLabel && <span id="progress-label" class="progress-label">{label}</span>}

  <div
    role="progressbar"
    aria-labelledby={showLabel ? "progress-label" : undefined}
    aria-label={!showLabel ? label : undefined}
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={max}
    class="progress-track"
  >
    <div class="progress-fill" style={`width: ${percentage}%`}></div>
  </div>
</div>

<style>
  .progress-track {
    /* Use inline-size for RTL support */
    inline-size: 100%;
    block-size: 8px;
    background-color: var(--color-background-tertiary);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progress-fill {
    block-size: 100%;
    background-color: var(--color-accent-primary);
    transition: width 300ms ease;
  }

  /* Accessibility: reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .progress-fill {
      transition: none;
    }
  }
</style>
```

### Pattern 3: SVG Circular Progress Ring

**What:** Use SVG circle with stroke-dasharray and stroke-dashoffset to create circular progress indicators.

**When to use:** ProgressRing component showing X/Y lesson completion in circular format.

**Example:**
```astro
---
// Source: LogRocket - https://blog.logrocket.com/build-svg-circular-progress-component-react-hooks/
interface Props {
  current: number;    // Lessons completed
  total: number;      // Total lessons
  label: string;      // Accessible name
  size?: number;      // Circle diameter (default: 120)
}

const { current, total, label, size = 120 } = Astro.props;

// Circle mathematics
const strokeWidth = 8;
const radius = (size / 2) - strokeWidth;
const circumference = 2 * Math.PI * radius;
const progress = Math.min(100, (current / total) * 100);
const offset = circumference * ((100 - progress) / 100);
---

<div class="progress-ring" style={`width: ${size}px; height: ${size}px;`}>
  <svg width={size} height={size}>
    <!-- Background circle (track) -->
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      stroke="var(--color-background-tertiary)"
      stroke-width={strokeWidth}
      fill="transparent"
    />

    <!-- Progress circle -->
    <circle
      role="progressbar"
      aria-label={label}
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      cx={size / 2}
      cy={size / 2}
      r={radius}
      stroke="var(--color-accent-primary)"
      stroke-width={strokeWidth}
      fill="transparent"
      stroke-dasharray={circumference}
      stroke-dashoffset={offset}
      stroke-linecap="round"
      transform={`rotate(-90 ${size / 2} ${size / 2})`}
      style="transition: stroke-dashoffset 500ms ease;"
    />
  </svg>

  <!-- Center text -->
  <div class="ring-text">
    <span class="ring-current">{current}</span>
    <span class="ring-separator">/</span>
    <span class="ring-total">{total}</span>
  </div>
</div>

<style>
  .progress-ring {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .ring-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    font-weight: 600;
  }

  .ring-current {
    font-size: 1.5rem;
    color: var(--color-text-primary);
  }

  .ring-separator,
  .ring-total {
    font-size: 1rem;
    color: var(--color-text-secondary);
  }

  /* Accessibility: reduced motion */
  @media (prefers-reduced-motion: reduce) {
    circle {
      transition: none !important;
    }
  }
</style>
```

### Pattern 4: RTL Icon Mirroring

**What:** Mirror directional SVG icons (arrows, chevrons) in RTL mode using CSS transform.

**When to use:** Navigation icons, back/forward buttons, chevrons in lesson navigation.

**Example:**
```astro
---
// Source: Firefox RTL Guidelines - https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html
interface Props {
  direction: 'left' | 'right' | 'up' | 'down';
  size?: number;
}

const { direction, size = 24 } = Astro.props;
---

<svg
  class="icon icon-chevron"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  {direction === 'right' && <path d="M9 18l6-6-6-6" />}
  {direction === 'left' && <path d="M15 18l-6-6 6-6" />}
  {direction === 'up' && <path d="M18 15l-6-6-6 6" />}
  {direction === 'down' && <path d="M6 9l6 6 6-6" />}
</svg>

<style>
  .icon-chevron {
    /* Mirror horizontal icons in RTL */
    transform-origin: center;
    transition: transform 150ms ease;
  }

  /* RTL support: mirror left/right arrows */
  :global([dir="rtl"]) .icon-chevron {
    transform: scaleX(-1);
  }

  /* Accessibility: reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .icon-chevron {
      transition: none;
    }
  }
</style>
```

### Pattern 5: CSS Logical Properties for RTL Support

**What:** Use logical properties (inline-start/end, block-start/end) instead of physical directions (left/right, top/bottom).

**When to use:** All component styles to ensure automatic RTL support without duplication.

**Example:**
```css
/* Source: DEV Community - https://dev.to/web_dev-usman/stop-fighting-rtl-layouts-use-css-logical-properties-for-better-design-5g3m */

/* ❌ Physical properties (doesn't work in RTL) */
.card {
  margin-left: 1rem;
  padding-right: 2rem;
  border-left: 2px solid var(--color-border-primary);
}

/* ✅ Logical properties (automatic RTL support) */
.card {
  margin-inline-start: 1rem;        /* left in LTR, right in RTL */
  padding-inline-end: 2rem;         /* right in LTR, left in RTL */
  border-inline-start: 2px solid var(--color-border-primary);
}

/* Common replacements */
.component {
  /* Layout dimensions */
  inline-size: 100%;                /* width */
  block-size: 50px;                 /* height */

  /* Spacing */
  margin-inline: auto;              /* margin-left + margin-right */
  padding-block: 1rem;              /* padding-top + padding-bottom */

  /* Positioning */
  inset-inline-start: 0;            /* left */
  inset-inline-end: 0;              /* right */

  /* Text alignment */
  text-align: start;                /* left in LTR, right in RTL */
}
```

### Pattern 6: Design Token Integration

**What:** Reference design tokens via Tailwind utilities or CSS variables, never hardcode values.

**When to use:** All component styling to maintain consistency and enable theme switching.

**Example:**
```astro
---
interface Props {
  level: 1 | 2 | 3 | 4 | 5;
}

const { level } = Astro.props;
---

<!-- Option 1: Tailwind utilities (if tokens generate them) -->
<span class={`badge bg-level-${level}-bg text-level-${level}-text border-level-${level}-border`}>
  Level {level}
</span>

<!-- Option 2: CSS custom properties -->
<span class="badge" data-level={level}>
  Level {level}
</span>

<style>
  .badge {
    /* Reference token variables */
    padding-inline: var(--spacing-sm);
    padding-block: var(--spacing-xs);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    border: 1px solid;
  }

  /* Level-specific colors from tokens */
  .badge[data-level="1"] {
    background-color: var(--color-level-1-bg);
    color: var(--color-level-1-text);
    border-color: var(--color-level-1-border);
  }

  .badge[data-level="2"] {
    background-color: var(--color-level-2-bg);
    color: var(--color-level-2-text);
    border-color: var(--color-level-2-border);
  }

  /* ... levels 3-5 */
</style>
```

### Anti-Patterns to Avoid

- **Hardcoding colors/spacing:** Don't use `background: #0D7377` or `padding: 8px`. Always reference tokens: `var(--color-accent-primary)`, `var(--spacing-sm)`.

- **Physical CSS properties:** Avoid `margin-left`, `padding-right`, `border-left`. Use logical properties: `margin-inline-start`, `padding-inline-end`, `border-inline-start`.

- **Missing ARIA labels:** Progress components without `aria-label` or `aria-labelledby` fail accessibility. Every progressbar role requires an accessible name.

- **Ignoring prefers-reduced-motion:** Animations that don't respect user motion preferences violate WCAG 2.1 Success Criterion 2.3.3. Always provide reduced-motion fallback.

- **Overly specific Tailwind classes:** Don't use `ml-4 pr-8 border-l-2`. These break in RTL. Use logical utilities if available, or CSS logical properties.

- **React for static components:** Don't import React/Preact for components that don't need client-side interactivity. Astro components render to HTML with zero JavaScript.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| ARIA attribute management | Manual role/aria-* attributes | Follow MDN progressbar pattern exactly | Missing attributes (aria-valuemin, aria-valuemax) cause screen reader confusion. Pattern is well-defined. |
| SVG circle mathematics | Trial-and-error stroke calculations | Use formula: `circumference = 2 * π * radius`, `offset = circumference * ((100 - progress) / 100)` | Mathematical relationship is precise. Wrong calculations create visual glitches. |
| RTL icon mirroring logic | JavaScript to detect direction | CSS `:dir(rtl)` pseudo-class or `[dir="rtl"]` selector with `transform: scaleX(-1)` | Browser handles directionality detection. CSS solution is declarative and zero-JavaScript. |
| Color contrast checking | Eyeball test for readability | WebAIM Contrast Checker or automated tools | WCAG 7:1 ratio requirement for Arabic text requires precise calculation. Human perception is unreliable. |
| Component prop validation | Runtime checks or PropTypes | TypeScript interfaces in Astro components | Type errors caught at build time, not runtime. Better developer experience. |
| Animation easing curves | Custom cubic-bezier values | CSS keywords: `ease`, `ease-in`, `ease-out`, `ease-in-out` | Standard curves are browser-optimized and well-tested for perceived smoothness. |

**Key insight:** Accessibility isn't an add-on. ARIA patterns exist because experts have solved edge cases (indeterminate state, value ranges, labeling strategies). Follow established patterns rather than inventing custom solutions that seem simpler but fail in assistive technology.

## Common Pitfalls

### Pitfall 1: Missing aria-label or aria-labelledby

**What goes wrong:** Progress components render visually but screen readers announce them as "progressbar, unknown" without meaningful context.

**Why it happens:** Developers focus on visual design and forget that `role="progressbar"` requires an accessible name via `aria-label` or `aria-labelledby`.

**How to avoid:**
1. Always provide `aria-label` for programmatic labels: `aria-label="Lesson progress"`
2. Use `aria-labelledby` when a visible label exists: `<span id="label">Loading</span> ... <div role="progressbar" aria-labelledby="label">`
3. Never use both (aria-labelledby takes precedence)
4. Test with screen reader (VoiceOver, NVDA) to verify announcement

**Warning signs:**
- Accessibility audit flags "ARIA progressbar must have accessible name"
- Screen reader announces "progressbar" without context
- VoiceOver inspection shows empty label field

### Pitfall 2: Using width/height Instead of inline-size/block-size

**What goes wrong:** Components use physical CSS properties (`margin-left`, `width`, `height`) that don't adapt to RTL mode. Layouts break when switching to Arabic.

**Why it happens:** Developers aren't familiar with CSS logical properties or forget to use them consistently. Muscle memory defaults to `margin-left` instead of `margin-inline-start`.

**How to avoid:**
1. Establish logical property conventions in component guidelines
2. Use CSS linting rules to flag physical properties (stylelint-plugin-logical-properties)
3. Test every component in RTL mode: add `[dir="rtl"]` to `<html>` tag during development
4. Create visual regression snapshots for both LTR and RTL

**Warning signs:**
- Progress bars fill right-to-left in RTL instead of maintaining direction
- Margins/padding flip incorrectly
- Icons appear on wrong side of text
- Text alignment breaks in RTL

### Pitfall 3: Animations That Don't Respect prefers-reduced-motion

**What goes wrong:** Progress bar transitions and ring animations play for users who have enabled "Reduce Motion" in OS accessibility settings, causing vestibular disorders or distraction.

**Why it happens:** Developers test with default system settings and don't consider accessibility preferences. Animations are added without reduced-motion media query.

**How to avoid:**
1. Wrap all transitions/animations in standard pattern:
   ```css
   .progress {
     transition: width 300ms ease;
   }

   @media (prefers-reduced-motion: reduce) {
     .progress {
       transition: none;
     }
   }
   ```
2. Test with macOS System Preferences > Accessibility > Display > Reduce Motion enabled
3. Test with Windows Settings > Ease of Access > Display > Show animations disabled
4. Use Playwright to automate testing with `emulateMedia({ reducedMotion: 'reduce' })`

**Warning signs:**
- No `@media (prefers-reduced-motion)` blocks in component styles
- Accessibility audit flags "Motion animations may cause nausea"
- Users report discomfort with progress animations

### Pitfall 4: Incorrect stroke-dashoffset Calculation

**What goes wrong:** Circular progress rings show incorrect percentage (e.g., 50% displays as 75%) or animate in reverse direction.

**Why it happens:** Developers miscalculate circumference, forget to account for stroke-width in radius, or use wrong formula for offset.

**How to avoid:**
1. Use exact formula:
   ```javascript
   const strokeWidth = 8;
   const radius = (size / 2) - strokeWidth;  // NOT size / 2
   const circumference = 2 * Math.PI * radius;
   const offset = circumference * ((100 - progress) / 100);  // NOT (progress / 100)
   ```
2. Add rotation: `transform="rotate(-90 centerX centerY)"` to start at top
3. Use `stroke-linecap="round"` for smooth ends
4. Test with 0%, 25%, 50%, 75%, 100% values to verify accuracy

**Warning signs:**
- Progress ring fills counter-clockwise
- Percentages don't match visual fill
- Ring starts at 3 o'clock instead of 12 o'clock
- Small progress values show disproportionately large fill

### Pitfall 5: Not Testing Components in Dark Mode

**What goes wrong:** Components look perfect in light mode but have invisible borders, low contrast text, or wrong accent colors in dark mode.

**Why it happens:** Tokens reference CSS variables that change based on `[data-theme="dark"]`, but developers only test with default light theme.

**How to avoid:**
1. Test every component in both themes during development:
   ```javascript
   document.documentElement.setAttribute('data-theme', 'dark');
   ```
2. Use Playwright snapshots for both themes:
   ```javascript
   // Light mode snapshot
   await page.screenshot({ path: 'component-light.png' });

   // Switch to dark mode
   await page.evaluate(() => {
     document.documentElement.setAttribute('data-theme', 'dark');
   });

   // Dark mode snapshot
   await page.screenshot({ path: 'component-dark.png' });
   ```
3. Verify token variables resolve correctly:
   ```javascript
   const bgColor = await page.evaluate(() => {
     const el = document.querySelector('.progress-bar');
     return getComputedStyle(el).backgroundColor;
   });
   expect(bgColor).toBe('rgb(15, 15, 15)'); // Dark mode value
   ```
4. Check contrast ratios with dark mode backgrounds

**Warning signs:**
- Components invisible in dark mode
- Border colors too subtle (using light mode border on dark background)
- Progress bars hard to see
- Text contrast below 7:1 ratio for Arabic content

### Pitfall 6: Hardcoding Size Values Instead of Using Props

**What goes wrong:** Progress components have fixed sizes (always 120px ring, always 8px bar height) and can't adapt to different contexts (dashboard vs inline).

**Why it happens:** Developers build for single use case and don't anticipate reusability needs.

**How to avoid:**
1. Provide size props with sensible defaults:
   ```astro
   interface Props {
     size?: 'sm' | 'md' | 'lg' | number;  // Preset or custom
   }

   const sizes = { sm: 80, md: 120, lg: 160 };
   const actualSize = typeof size === 'number' ? size : sizes[size];
   ```
2. Use CSS custom properties for flexible styling:
   ```astro
   <div class="progress-ring" style={`--ring-size: ${actualSize}px;`}>
   ```
3. Document size variants in component comments
4. Create visual examples at different sizes

**Warning signs:**
- Magic numbers (`120`, `8px`) scattered throughout component
- Components don't fit in different layouts
- Need to create separate components for different sizes
- CSS overrides required to resize components

## Code Examples

Verified patterns from official sources:

### Complete ProgressBar Component

```astro
---
// Source: MDN ARIA progressbar pattern
interface Props {
  value: number;              // Current progress (0-max)
  max?: number;               // Maximum value (default: 100)
  label: string;              // Accessible name (required)
  showLabel?: boolean;        // Display visible label
  showPercentage?: boolean;   // Show percentage text
  height?: 'sm' | 'md' | 'lg'; // Bar height
}

const {
  value,
  max = 100,
  label,
  showLabel = true,
  showPercentage = false,
  height = 'md'
} = Astro.props;

const percentage = Math.min(100, Math.max(0, (value / max) * 100));
const percentageText = `${Math.round(percentage)}%`;
---

<div class="progress-bar-wrapper">
  <div class="progress-header">
    {showLabel && <span id="progress-label" class="progress-label">{label}</span>}
    {showPercentage && <span class="progress-percentage">{percentageText}</span>}
  </div>

  <div
    role="progressbar"
    aria-labelledby={showLabel ? "progress-label" : undefined}
    aria-label={!showLabel ? label : undefined}
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={max}
    class={`progress-track progress-track-${height}`}
  >
    <div
      class="progress-fill"
      style={`inline-size: ${percentage}%`}
    ></div>
  </div>
</div>

<style>
  .progress-bar-wrapper {
    inline-size: 100%;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: var(--spacing-xs);
  }

  .progress-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .progress-percentage {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-accent-primary);
    font-variant-numeric: tabular-nums;
  }

  .progress-track {
    inline-size: 100%;
    background-color: var(--color-background-tertiary);
    border-radius: var(--radius-full);
    overflow: hidden;
    position: relative;
  }

  .progress-track-sm {
    block-size: 4px;
  }

  .progress-track-md {
    block-size: 8px;
  }

  .progress-track-lg {
    block-size: 12px;
  }

  .progress-fill {
    block-size: 100%;
    background-color: var(--color-accent-primary);
    transition: inline-size 500ms cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: var(--radius-full);
  }

  /* Accessibility: reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .progress-fill {
      transition: none;
    }
  }

  /* Dark mode - tokens handle colors automatically */
</style>
```

### Complete ProgressRing Component

```astro
---
// Source: LogRocket SVG circular progress guide
interface Props {
  current: number;            // Completed count
  total: number;              // Total count
  label: string;              // Accessible name
  size?: number;              // Diameter in px
  strokeWidth?: number;       // Ring thickness
  showText?: boolean;         // Display center text
}

const {
  current,
  total,
  label,
  size = 120,
  strokeWidth = 8,
  showText = true
} = Astro.props;

// Circle mathematics
const center = size / 2;
const radius = center - strokeWidth;
const circumference = 2 * Math.PI * radius;
const progress = Math.min(100, (current / total) * 100);
const offset = circumference * ((100 - progress) / 100);
---

<div class="progress-ring" style={`inline-size: ${size}px; block-size: ${size}px;`}>
  <svg
    width={size}
    height={size}
    aria-hidden="true"
  >
    <!-- Background circle (track) -->
    <circle
      cx={center}
      cy={center}
      r={radius}
      stroke="var(--color-background-tertiary)"
      stroke-width={strokeWidth}
      fill="transparent"
    />

    <!-- Progress circle -->
    <circle
      cx={center}
      cy={center}
      r={radius}
      stroke="var(--color-accent-primary)"
      stroke-width={strokeWidth}
      fill="transparent"
      stroke-dasharray={circumference}
      stroke-dashoffset={offset}
      stroke-linecap="round"
      transform={`rotate(-90 ${center} ${center})`}
      class="progress-ring-circle"
    />
  </svg>

  <!-- ARIA progressbar for screen readers -->
  <div
    role="progressbar"
    aria-label={label}
    aria-valuenow={current}
    aria-valuemin={0}
    aria-valuemax={total}
    aria-valuetext={`${current} of ${total} completed`}
    class="sr-only"
  >
  </div>

  <!-- Center text (visual only) -->
  {showText && (
    <div class="ring-text" aria-hidden="true">
      <span class="ring-current">{current}</span>
      <span class="ring-separator">/</span>
      <span class="ring-total">{total}</span>
    </div>
  )}
</div>

<style>
  .progress-ring {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .progress-ring svg {
    transform: rotate(0deg); /* Reset for RTL */
  }

  .progress-ring-circle {
    transition: stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ring-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    font-weight: 600;
  }

  .ring-current {
    font-size: 1.5rem;
    color: var(--color-text-primary);
    line-height: 1;
  }

  .ring-separator,
  .ring-total {
    font-size: 1rem;
    color: var(--color-text-secondary);
    line-height: 1;
  }

  /* Screen reader only class */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Accessibility: reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .progress-ring-circle {
      transition: none;
    }
  }
</style>
```

### Complete LessonCheckmark Component

```astro
---
// Source: DEV Community - Custom checkbox accessibility
interface Props {
  completed: boolean;         // Completion state
  size?: number;              // Icon size in px
  label?: string;             // Accessible label
  showLabel?: boolean;        // Display label text
}

const {
  completed,
  size = 24,
  label = "Lesson complete",
  showLabel = false
} = Astro.props;
---

<div class="lesson-checkmark">
  <div
    class={`checkmark-circle ${completed ? 'completed' : 'incomplete'}`}
    role="img"
    aria-label={label}
    style={`inline-size: ${size}px; block-size: ${size}px;`}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {completed ? (
        <>
          <!-- Filled circle with checkmark -->
          <circle
            cx="12"
            cy="12"
            r="11"
            fill="var(--color-accent-primary)"
          />
          <path
            d="M7 12l3 3 7-7"
            stroke="white"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="checkmark-path"
          />
        </>
      ) : (
        <!-- Empty circle outline -->
        <circle
          cx="12"
          cy="12"
          r="10.5"
          stroke="var(--color-border-secondary)"
          stroke-width="1.5"
        />
      )}
    </svg>
  </div>

  {showLabel && <span class="checkmark-label">{label}</span>}
</div>

<style>
  .lesson-checkmark {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .checkmark-circle {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .checkmark-circle.completed svg {
    animation: checkmark-appear 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes checkmark-appear {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .checkmark-path {
    stroke-dasharray: 20;
    stroke-dashoffset: 20;
    animation: checkmark-draw 400ms 100ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes checkmark-draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  .checkmark-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .completed .checkmark-label {
    color: var(--color-accent-primary);
  }

  /* Accessibility: reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .checkmark-circle.completed svg {
      animation: none;
    }

    .checkmark-path {
      animation: none;
      stroke-dashoffset: 0;
    }
  }

  /* RTL: checkmark doesn't need mirroring (symmetric) */
</style>
```

### Primitive Button Component

```astro
---
// Source: Astro component patterns
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;              // Optional link mode
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  class?: string;             // Additional classes
}

const {
  variant = 'primary',
  size = 'md',
  href,
  disabled = false,
  type = 'button',
  class: className = ''
} = Astro.props;

const Tag = href ? 'a' : 'button';
const baseClass = `btn btn-${variant} btn-${size} ${className}`;
---

<Tag
  class={baseClass}
  href={href}
  type={!href ? type : undefined}
  disabled={!href && disabled}
  aria-disabled={disabled}
>
  <slot />
</Tag>

<style>
  .btn {
    /* Layout */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);

    /* Typography */
    font-weight: 600;
    text-decoration: none;
    line-height: 1;

    /* Interactive */
    cursor: pointer;
    transition: all 150ms ease;
    border: none;
    outline: none;

    /* Logical properties for RTL */
    padding-inline: var(--spacing-md);
    padding-block: var(--spacing-sm);

    /* Design tokens */
    border-radius: var(--radius-md);
  }

  /* Size variants */
  .btn-sm {
    padding-inline: var(--spacing-sm);
    padding-block: var(--spacing-xs);
    font-size: 0.875rem;
  }

  .btn-md {
    padding-inline: var(--spacing-md);
    padding-block: var(--spacing-sm);
    font-size: 1rem;
  }

  .btn-lg {
    padding-inline: var(--spacing-lg);
    padding-block: var(--spacing-md);
    font-size: 1.125rem;
  }

  /* Variant styles */
  .btn-primary {
    background-color: var(--color-accent-primary);
    color: var(--color-text-inverse);
  }

  .btn-primary:hover:not([disabled]) {
    background-color: var(--color-accent-primary-hover);
  }

  .btn-secondary {
    background-color: var(--color-accent-secondary);
    color: var(--color-text-inverse);
  }

  .btn-secondary:hover:not([disabled]) {
    background-color: var(--color-accent-secondary-hover);
  }

  .btn-outline {
    background-color: transparent;
    color: var(--color-accent-primary);
    border: 2px solid var(--color-accent-primary);
  }

  .btn-outline:hover:not([disabled]) {
    background-color: var(--color-accent-primary-light);
  }

  .btn-ghost {
    background-color: transparent;
    color: var(--color-text-primary);
  }

  .btn-ghost:hover:not([disabled]) {
    background-color: var(--color-background-secondary);
  }

  /* Disabled state */
  .btn[disabled],
  .btn[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Focus visible */
  .btn:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  /* Accessibility: reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .btn {
      transition: none;
    }
  }
</style>
```

### Primitive Badge Component

```astro
---
// Source: Design system primitive patterns
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  level?: 1 | 2 | 3 | 4 | 5;  // For level-specific badges
  size?: 'sm' | 'md';
}

const {
  variant = 'default',
  level,
  size = 'md'
} = Astro.props;

const badgeClass = level
  ? `badge badge-${size} badge-level-${level}`
  : `badge badge-${size} badge-${variant}`;
---

<span class={badgeClass}>
  <slot />
</span>

<style>
  .badge {
    /* Layout */
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);

    /* Typography */
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;

    /* Design tokens */
    border-radius: var(--radius-md);
    border: 1px solid;
  }

  /* Size variants */
  .badge-sm {
    padding-inline: var(--spacing-xs);
    padding-block: calc(var(--spacing-xs) * 0.5);
    font-size: 0.75rem;
  }

  .badge-md {
    padding-inline: var(--spacing-sm);
    padding-block: var(--spacing-xs);
    font-size: 0.875rem;
  }

  /* Variant styles */
  .badge-default {
    background-color: var(--color-background-secondary);
    color: var(--color-text-secondary);
    border-color: var(--color-border-primary);
  }

  .badge-success {
    background-color: var(--color-accent-primary-light);
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
  }

  .badge-warning {
    background-color: var(--color-accent-gold-light);
    color: var(--color-accent-gold);
    border-color: var(--color-accent-gold);
  }

  .badge-error {
    background-color: var(--color-accent-coral-light);
    color: var(--color-accent-coral);
    border-color: var(--color-accent-coral);
  }

  .badge-info {
    background-color: var(--color-accent-secondary-light);
    color: var(--color-accent-secondary);
    border-color: var(--color-accent-secondary);
  }

  /* Level-specific badges (from design tokens) */
  .badge-level-1 {
    background-color: var(--color-level-1-bg);
    color: var(--color-level-1-text);
    border-color: var(--color-level-1-border);
  }

  .badge-level-2 {
    background-color: var(--color-level-2-bg);
    color: var(--color-level-2-text);
    border-color: var(--color-level-2-border);
  }

  .badge-level-3 {
    background-color: var(--color-level-3-bg);
    color: var(--color-level-3-text);
    border-color: var(--color-level-3-border);
  }

  .badge-level-4 {
    background-color: var(--color-level-4-bg);
    color: var(--color-level-4-text);
    border-color: var(--color-level-4-border);
  }

  .badge-level-5 {
    background-color: var(--color-level-5-bg);
    color: var(--color-level-5-text);
    border-color: var(--color-level-5-border);
  }
</style>
```

### Primitive Card Component

```astro
---
interface Props {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  href?: string;
  class?: string;
}

const {
  variant = 'default',
  padding = 'md',
  clickable = false,
  href,
  class: className = ''
} = Astro.props;

const Tag = href ? 'a' : 'div';
const cardClass = `card card-${variant} card-padding-${padding} ${clickable ? 'card-clickable' : ''} ${className}`;
---

<Tag class={cardClass} href={href}>
  <slot />
</Tag>

<style>
  .card {
    /* Display */
    display: block;

    /* Design tokens */
    background-color: var(--color-background-primary);
    border-radius: var(--radius-lg);
    transition: all 200ms ease;
  }

  /* Variant styles */
  .card-default {
    border: 1px solid var(--color-border-primary);
  }

  .card-elevated {
    border: 1px solid transparent;
    box-shadow: var(--shadow-soft);
  }

  .card-outlined {
    border: 2px solid var(--color-border-primary);
  }

  /* Padding variants using logical properties */
  .card-padding-none {
    padding: 0;
  }

  .card-padding-sm {
    padding-inline: var(--spacing-md);
    padding-block: var(--spacing-sm);
  }

  .card-padding-md {
    padding-inline: var(--spacing-lg);
    padding-block: var(--spacing-md);
  }

  .card-padding-lg {
    padding-inline: var(--spacing-xl);
    padding-block: var(--spacing-lg);
  }

  /* Clickable state */
  .card-clickable {
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

  .card-clickable:hover {
    border-color: var(--color-border-secondary);
    box-shadow: var(--shadow-medium);
    transform: translateY(-2px);
  }

  .card-clickable:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  /* Accessibility: reduced motion */
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

### Primitive Container Component

```astro
---
interface Props {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  center?: boolean;
  class?: string;
}

const {
  maxWidth = 'lg',
  padding = true,
  center = true,
  class: className = ''
} = Astro.props;

const containerClass = `container container-${maxWidth} ${padding ? 'container-padding' : ''} ${center ? 'container-center' : ''} ${className}`;
---

<div class={containerClass}>
  <slot />
</div>

<style>
  .container {
    inline-size: 100%;
  }

  /* Max-width variants */
  .container-sm {
    max-inline-size: 40rem;  /* 640px */
  }

  .container-md {
    max-inline-size: 48rem;  /* 768px */
  }

  .container-lg {
    max-inline-size: 64rem;  /* 1024px */
  }

  .container-xl {
    max-inline-size: 80rem;  /* 1280px */
  }

  .container-2xl {
    max-inline-size: 96rem;  /* 1536px */
  }

  .container-full {
    max-inline-size: none;
  }

  /* Centering */
  .container-center {
    margin-inline: auto;
  }

  /* Padding using logical properties */
  .container-padding {
    padding-inline: var(--spacing-md);
  }

  @media (min-width: 640px) {
    .container-padding {
      padding-inline: var(--spacing-lg);
    }
  }

  @media (min-width: 1024px) {
    .container-padding {
      padding-inline: var(--spacing-xl);
    }
  }
</style>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Physical CSS (left/right) | Logical properties (inline-start/end) | CSS Logical Properties spec (2021+) | Single codebase supports both LTR and RTL without duplication |
| `<progress>` element | Custom styled components | Ongoing | Native element styling is limited, custom components provide full design control |
| JavaScript for RTL detection | CSS `:dir()` pseudo-class | CSS Selectors Level 4 (2022+) | Zero-JavaScript solution, browser handles directionality |
| React for all components | Astro native components | Astro 2.0+ (2023) | Static components ship zero JavaScript, better performance |
| Hardcoded animations | `prefers-reduced-motion` respect | WCAG 2.1 (2018) | Accessibility requirement, prevents vestibular disorders |
| PropTypes validation | TypeScript interfaces | Modern tooling (2020+) | Type errors caught at build time, better DX |
| Class-based dark mode | CSS variable scoping | Modern CSS (2020+) | Single source of truth, automatic theme propagation |

**Deprecated/outdated:**

- **PropTypes in Astro:** React's PropTypes don't work in Astro components. Use TypeScript interfaces instead.

- **Traditional RTL CSS (separate stylesheets):** Writing separate `style-rtl.css` files is outdated. Use CSS logical properties for automatic adaptation.

- **ARIA roles on native elements:** Don't add `role="progressbar"` to `<progress>` element. Native semantics already provide accessibility.

- **`animate.css` for component animations:** Heavy animation libraries are overkill for simple progress transitions. Use CSS transitions with easing functions.

## Open Questions

Things that couldn't be fully resolved:

1. **Interactive progress updates without client-side JavaScript**
   - What we know: Astro components render to static HTML. Progress values can be passed as props during build/SSR.
   - What's unclear: How to update progress dynamically (e.g., increment lesson completion) without adding client-side JavaScript. This may require Astro islands with lightweight state management.
   - Recommendation: For Phase 2, implement static progress components that accept current state as props. Phase 6 (Progress Tracking & localStorage) will add interactivity with `<script>` tags for state management.

2. **Testing RTL mode in Playwright**
   - What we know: Playwright supports setting document direction. Firefox RTL guidelines show `:dir(rtl)` and `[dir="rtl"]` approaches.
   - What's unclear: Whether to set `dir="rtl"` on `<html>` element or use JavaScript to toggle during tests. Best practice for snapshot testing both LTR and RTL.
   - Recommendation: Add `dir="rtl"` attribute to `<html>` via Playwright's `page.evaluate()`, capture snapshots for both directions. Document in test configuration which components require dual-direction testing.

3. **Level badge color definitions**
   - What we know: Phase 1 established token variables for 5 levels (`--color-level-1-bg`, etc.). Existing `colors.css` references these.
   - What's unclear: Actual color values for levels 1-5. Are they progressive (green to gold)? Theme-specific (different in dark mode)? Need design specification.
   - Recommendation: During planning, verify if level colors are defined in global.css `:root` block. If missing, propose semantic progression (teal → blue → gold → coral → purple) aligned with existing accent colors.

4. **Progress animation timing**
   - What we know: Examples show 300ms-600ms transitions. Reduced motion should disable animations completely.
   - What's unclear: Optimal timing for progress bar vs ring animations. Should rings animate slower due to larger visual change? User testing needed.
   - Recommendation: Start with 500ms for bars, 600ms for rings using `cubic-bezier(0.4, 0, 0.2, 1)` easing. Add CSS custom property `--progress-transition-duration` for easy tuning during user testing.

5. **Component testing strategy**
   - What we know: Playwright already installed for visual regression. Astro supports component testing.
   - What's unclear: Whether to test components in isolation (component tests) or integrated in pages (E2E tests). Playwright's experimental component testing support for Astro is unclear.
   - Recommendation: Use Playwright E2E tests with test pages rendering components in various states (0%, 50%, 100% progress; all button variants; LTR/RTL). Create `/src/pages/test/components.astro` for visual regression snapshots.

6. **Icon library vs inline SVG**
   - What we know: Existing Header.astro uses inline SVG for icons. No icon library dependency exists.
   - What's unclear: Whether to continue inline SVG pattern or introduce library like lucide-astro for consistency. Tradeoff: inline SVG is explicit but verbose, icon library adds dependency but reduces duplication.
   - Recommendation: Continue inline SVG pattern for directional icons (arrows, chevrons) to maintain zero dependencies and full RTL mirroring control. Document SVG icon component pattern for reusability.

## Sources

### Primary (HIGH confidence)
- [MDN ARIA progressbar role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role) - Official ARIA specification
- [Astro Components Documentation](https://docs.astro.build/en/basics/astro-components/) - Official Astro component patterns
- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/) - Client-side interactivity strategy
- [LogRocket: Build SVG Circular Progress Component](https://blog.logrocket.com/build-svg-circular-progress-component-react-hooks/) - SVG mathematics and implementation
- [Firefox RTL Guidelines](https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html) - Icon mirroring best practices
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Accessibility media query
- [W3C WCAG 2.1 - Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) - Accessibility standard

### Secondary (MEDIUM confidence)
- [React Aria useProgressBar](https://react-spectrum.adobe.com/react-aria/useProgressBar.html) - Adobe's accessibility patterns (React-specific but patterns applicable)
- [DEV Community: Stop Fighting RTL Layouts](https://dev.to/web_dev-usman/stop-fighting-rtl-layouts-use-css-logical-properties-for-better-design-5g3m) - CSS logical properties guide
- [Medium: Mastering RTL & LTR Layouts](https://medium.com/@dimuthupinsara/mastering-rtl-ltr-layouts-with-css-logical-properties-4bc0fccd2014) - Logical properties examples
- [shadcn/ui RTL Support Changelog](https://ui.shadcn.com/docs/changelog/2026-01-rtl) - Recent RTL implementation patterns
- [Cloudscape Design System - Bidirectionality](https://cloudscape.design/get-started/dev-guides/bidirectionality/) - Enterprise RTL patterns
- [Penpot: Design Tokens and CSS Variables](https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/) - Token integration patterns
- [BrowserStack: Playwright Snapshot Testing](https://www.browserstack.com/guide/playwright-snapshot-testing) - Visual regression testing
- [Josh W. Comeau: Accessible Animations with prefers-reduced-motion](https://www.joshwcomeau.com/react/prefers-reduced-motion/) - Animation accessibility

### Tertiary (LOW confidence - community patterns)
- [react-circular-progressbar npm](https://www.npmjs.com/package/react-circular-progressbar) - Library reference (not using but informative)
- [Atlassian Design Components](https://atlassian.design/components/) - Design system examples
- [Design System Primitives by Josh Cusick](https://joshcusick.substack.com/p/design-system-primitives) - Component organization philosophy
- [Medium: Component Library Folder Structure](https://medium.com/questra-digital/experimenting-with-folder-structure-for-react-components-library-75f72f9f658c) - Organization patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Astro/Tailwind already in use, no additional dependencies needed
- ARIA patterns: HIGH - MDN and W3C provide authoritative specifications
- RTL support: HIGH - Firefox guidelines and CSS specs are definitive
- SVG mathematics: HIGH - Geometric formulas verified from multiple sources
- Component patterns: MEDIUM-HIGH - Astro official docs supplemented with community patterns
- Testing strategy: MEDIUM - Playwright integration clear, but component testing approach requires validation

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable technologies, accessibility standards slow-moving)

**Key assumptions:**
- Design tokens from Phase 1 are complete and correct
- Level badge colors (1-5) are defined in global.css or will be specified during planning
- All components should work with existing `[data-theme="dark"]` attribute approach
- RTL support is required for all components (Arabic language support)
- No client-side state management needed in Phase 2 (static props only)
- Visual regression testing will use existing Playwright setup

**Next steps for planner:**
1. Verify level color token definitions exist in global.css
2. Create component folder structure (`/primitives/`, `/progress/`)
3. Define component API (props, variants, sizes) for each of 7 components
4. Plan Playwright test strategy (create test pages, LTR/RTL snapshots)
5. Document RTL testing approach and which icons require mirroring
6. Specify animation timings and reduced-motion fallbacks
