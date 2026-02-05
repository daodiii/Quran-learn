# Architecture Research

**Domain:** Educational Platform UI/UX (Coursera-like)
**Researched:** 2026-02-05
**Confidence:** HIGH

## Standard Architecture

### System Overview

Coursera-like educational platforms follow a hierarchical component architecture with three main layers: Design Foundation (tokens/primitives), UI Components (navigation, progress, cards), and Page Compositions (layouts and views).

```
┌─────────────────────────────────────────────────────────────┐
│                   DESIGN FOUNDATION LAYER                    │
│  Design Tokens (Colors, Typography, Spacing, Shadows)       │
│  Base Styles (Resets, Utilities, Theme Variables)           │
└──────────────────────┬───────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                   UI COMPONENTS LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Progress │  │Navigation│  │   Card   │  │  Layout  │   │
│  │Components│  │Components│  │Components│  │Components│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│   ProgressBar   Breadcrumb     CourseCard     Sidebar      │
│   ProgressRing  NavMenu        LessonCard     Container    │
│   Checkmark     Header/Footer  SurahCard                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                 COMPOSITE COMPONENTS                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CourseNavigator (Sidebar + Progress + NavMenu)    │   │
│  │  Dashboard (Cards + Progress + Hero)                │   │
│  │  QuizInterface (Form + Feedback + Progress)         │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬───────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                       PAGE LAYOUTS                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │  Learn   │  │  Lesson  │  │   Quiz   │   │
│  │Dashboard │  │Dashboard │  │  Page    │  │   Page   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Design Tokens** | Define visual constants (colors, spacing, typography scales, shadows) | CSS custom properties in tokens file |
| **Progress Components** | Visualize learning progress and completion | ProgressBar (horizontal), ProgressRing (circular), Checkmark (boolean) |
| **Navigation Components** | User wayfinding and course structure | Breadcrumb, Header, Footer, Sidebar, CourseNavigator |
| **Card Components** | Display content modules in grid/list layouts | CourseCard, LessonCard, SurahCard, ResourceCard |
| **Layout Components** | Control page structure and content flow | Container, Sidebar wrapper, Grid system |
| **Composite Components** | Orchestrate multiple components for specific use cases | Dashboard grids, lesson views, quiz interfaces |
| **Page Layouts** | Compose components into full page experiences | BaseLayout, LessonLayout, QuizLayout |

## Recommended Project Structure

For Astro 5.x with the Quran Learn redesign, following token → component → composition pattern:

```
src/
├── styles/
│   ├── tokens.css           # Design tokens (CSS custom properties)
│   ├── base.css             # Resets, typography, base element styles
│   ├── utilities.css        # Custom Tailwind utilities
│   └── global.css           # Imports all styles, preserves Arabic fonts
│
├── components/
│   ├── foundation/          # Lowest-level reusable primitives
│   │   ├── Button.astro
│   │   ├── Badge.astro
│   │   ├── Card.astro
│   │   └── Container.astro
│   │
│   ├── progress/            # Progress visualization components
│   │   ├── ProgressBar.astro
│   │   ├── ProgressRing.astro
│   │   ├── LessonCheckmark.astro
│   │   └── LevelProgress.astro
│   │
│   ├── navigation/          # Navigation-specific components
│   │   ├── Header.astro         # (update existing)
│   │   ├── Footer.astro         # (update existing)
│   │   ├── Breadcrumb.astro
│   │   ├── Sidebar.astro        # (update existing)
│   │   └── CourseNavigator.astro
│   │
│   ├── cards/               # Card-based content display
│   │   ├── CourseCard.astro
│   │   ├── LessonCard.astro
│   │   ├── SurahCard.astro
│   │   └── ResourceCard.astro
│   │
│   ├── content/             # Content-specific components
│   │   ├── Hero.astro
│   │   ├── Quiz.astro           # (existing)
│   │   ├── QuizFeedback.astro
│   │   ├── AuthButton.astro     # (existing)
│   │   └── ArabicText.astro
│   │
│   └── composite/           # Multi-component compositions
│       ├── DashboardGrid.astro
│       ├── LessonView.astro
│       └── QuizInterface.astro
│
├── layouts/
│   ├── BaseLayout.astro     # Root layout (HTML shell, existing)
│   ├── LessonLayout.astro   # Sidebar + content layout (update)
│   ├── QuizLayout.astro     # Focused quiz layout (update)
│   └── SurahLayout.astro    # Surah analysis layout (update)
│
├── pages/
│   ├── index.astro          # Home dashboard (redesign)
│   ├── learn/
│   │   ├── index.astro      # Learn dashboard (redesign)
│   │   └── [...slug].astro  # Dynamic lesson pages
│   ├── surah/
│   │   └── [slug].astro     # Dynamic surah pages
│   ├── quiz/
│   │   └── [level].astro    # Quiz pages
│   └── resources/
│       └── index.astro      # Resources page (redesign)
│
├── lib/
│   ├── supabase.ts          # Database client
│   ├── progress.ts          # Progress tracking utilities
│   └── types.ts             # TypeScript types
│
└── content/
    ├── lessons/             # MDX lesson content (61 lessons)
    └── surahs/              # MDX surah content
```

### Structure Rationale

- **styles/tokens.css:** Foundation layer must be defined first. Design tokens are semantic (not just raw values) and follow a hierarchy: primitive tokens → semantic tokens → component tokens. This enables theming (light/dark) and ensures consistency.

- **components/foundation/:** Primitive components using design tokens directly. These are building blocks with single responsibilities (Button, Card, Badge) that other components compose.

- **components/ by domain:** Grouped by feature area (progress, navigation, cards) rather than by technical type. Makes related components easier to find and modify together.

- **components/composite/:** Higher-level compositions encoding common patterns. These reduce duplication in page layouts by capturing reusable multi-component arrangements.

- **layouts/ as templates:** Define page-level structure (sidebar positioning, header/footer, content width). Layouts consume components but delegate business logic to lib/ utilities.

- **Separation of concerns:** Content (MDX), data (lib/), presentation (components/), composition (layouts/) are cleanly separated for maintainability.

## Architectural Patterns

### Pattern 1: Token-Driven Design System

**What:** Three-tier token system: foundation tokens (primitives like color values), semantic tokens (purpose-driven like "primary color"), and component tokens (specific use cases like "button-background").

**When to use:** Always. This is the foundational pattern for scalable design systems.

**Trade-offs:** Requires upfront planning but enables theme switching, ensures consistency, and makes global style changes trivial.

**Example:**
```css
/* styles/tokens.css */
:root {
  /* Foundation tokens (primitives) */
  --color-blue-600: #0056d2;
  --color-blue-700: #004bb5;
  --color-gray-50: #f9fafb;
  --color-gray-900: #111827;

  /* Semantic tokens (purpose) */
  --color-primary: var(--color-blue-600);
  --color-primary-hover: var(--color-blue-700);
  --color-surface: var(--color-gray-50);
  --color-text: var(--color-gray-900);

  /* Spacing scale (8px base unit, Coursera-like generous whitespace) */
  --space-unit: 0.5rem; /* 8px base */
  --space-xs: calc(var(--space-unit) * 1);  /* 8px */
  --space-sm: calc(var(--space-unit) * 1.5); /* 12px */
  --space-md: calc(var(--space-unit) * 2);  /* 16px */
  --space-lg: calc(var(--space-unit) * 3);  /* 24px */
  --space-xl: calc(var(--space-unit) * 4);  /* 32px */
  --space-2xl: calc(var(--space-unit) * 6); /* 48px */
  --space-3xl: calc(var(--space-unit) * 8); /* 64px */

  /* Typography scale */
  --text-xs: 0.75rem;   /* 12px */
  --text-sm: 0.875rem;  /* 14px */
  --text-base: 1rem;    /* 16px */
  --text-lg: 1.125rem;  /* 18px */
  --text-xl: 1.25rem;   /* 20px */
  --text-2xl: 1.5rem;   /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem;  /* 36px */

  /* Component tokens (specific use cases) */
  --button-bg: var(--color-primary);
  --button-bg-hover: var(--color-primary-hover);
  --card-bg: var(--color-surface);
  --card-padding: var(--space-lg);
}

/* Dark mode semantic token overrides */
[data-theme="dark"] {
  --color-surface: #1f2937;
  --color-text: #f9fafb;
  /* Component tokens automatically adapt */
}

/* Component usage */
.lesson-card {
  background: var(--card-bg);
  padding: var(--card-padding);
  border-radius: var(--space-sm);
}
```

### Pattern 2: Responsive Grid Layout with CSS Grid

**What:** Card-based layouts using CSS Grid with `auto-fit` and `minmax` for responsive column counts without explicit breakpoints.

**When to use:** Dashboard pages, card grids, any multi-column content layout (Learn dashboard, Surah selector).

**Trade-offs:** Requires modern browser support (fine for 2026). Less explicit control than breakpoint-based layouts, but more resilient and maintainable.

**Example:**
```astro
---
// components/composite/DashboardGrid.astro
interface Props {
  minCardWidth?: string;
  gap?: string;
}
const { minCardWidth = '280px', gap = 'var(--space-lg)' } = Astro.props;
---
<div class="dashboard-grid" style={`--min-card-width: ${minCardWidth}; --grid-gap: ${gap}`}>
  <slot />
</div>

<style>
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(var(--min-card-width), 1fr)
    );
    gap: var(--grid-gap);
    padding: var(--space-xl) 0;
  }

  /* Adjust gap for smaller screens */
  @media (max-width: 640px) {
    .dashboard-grid {
      gap: var(--space-md);
      grid-template-columns: 1fr; /* Single column on mobile */
    }
  }
</style>

<!-- Usage -->
<DashboardGrid minCardWidth="300px">
  {levels.map(level => <LevelCard {...level} />)}
</DashboardGrid>
```

### Pattern 3: Sidebar Layout with Collapsible Navigation

**What:** Two-column layout with sticky sidebar for course navigation. CSS Grid for robust layout, JavaScript for collapse toggle on mobile.

**When to use:** Lesson pages, any long-form content with contextual navigation.

**Trade-offs:** More complex than simple flexbox but handles edge cases better (sticky positioning, content overflow, responsive collapse).

**Example:**
```astro
---
// layouts/LessonLayout.astro
interface Props {
  title: string;
  level: number;
}
const { title, level } = Astro.props;
---
<BaseLayout title={title}>
  <div class="lesson-layout">
    <aside class="lesson-sidebar" id="lesson-sidebar">
      <slot name="sidebar">
        <CourseNavigator level={level} />
      </slot>
    </aside>

    <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle sidebar">
      <span class="hamburger"></span>
    </button>

    <main class="lesson-content">
      <slot />
    </main>
  </div>
</BaseLayout>

<style>
  .lesson-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: var(--space-2xl);
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 var(--space-lg);
    position: relative;
  }

  .lesson-sidebar {
    position: sticky;
    top: var(--space-xl);
    height: fit-content;
    max-height: calc(100vh - var(--space-2xl));
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .lesson-content {
    max-width: 65ch; /* Optimal reading width for educational content */
    padding: var(--space-xl) 0;
  }

  .sidebar-toggle {
    display: none; /* Hidden on desktop */
  }

  /* Mobile: overlay sidebar */
  @media (max-width: 1024px) {
    .lesson-layout {
      grid-template-columns: 1fr;
    }

    .lesson-sidebar {
      position: fixed;
      top: 0;
      left: -320px; /* Hidden off-screen */
      width: 300px;
      height: 100vh;
      background: var(--color-surface);
      z-index: 100;
      transition: left 0.3s ease;
      box-shadow: var(--shadow-lg);
      padding: var(--space-lg);
    }

    .lesson-sidebar.open {
      left: 0;
    }

    .sidebar-toggle {
      display: block;
      position: fixed;
      top: var(--space-lg);
      left: var(--space-md);
      z-index: 101;
    }
  }
</style>

<script>
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('lesson-sidebar');

  toggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
  });
</script>
```

### Pattern 4: Compound Component Pattern

**What:** Related components that work together share implicit state through composition. Parent component provides context; child components access it naturally.

**When to use:** Components with parent-child relationships where children need shared state (navigation menus, tabs, accordions).

**Trade-offs:** More complex to implement but provides excellent developer experience and flexibility.

**Example:**
```typescript
// components/navigation/CourseNavigator.astro
---
interface Props {
  currentLevel: number;
  currentLesson?: string;
}
const { currentLevel, currentLesson } = Astro.props;

// Store context for child components (via data attributes or slots)
---
<nav class="course-navigator" data-current-level={currentLevel} data-current-lesson={currentLesson}>
  <slot /> <!-- Sections and Items render here -->
</nav>

<style>
  .course-navigator {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }
</style>

// components/navigation/CourseNavigator/Section.astro
---
interface Props {
  level: number;
  title: string;
  lessonCount: number;
  completedCount: number;
}
const { level, title, lessonCount, completedCount } = Astro.props;
---
<details class="nav-section" open={level === 1}>
  <summary class="nav-section-header">
    <span class="level-badge">Level {level}</span>
    <h3 class="section-title">{title}</h3>
    <span class="section-progress">{completedCount}/{lessonCount}</span>
  </summary>
  <ul class="nav-items">
    <slot />
  </ul>
</details>

// components/navigation/CourseNavigator/Item.astro
---
interface Props {
  href: string;
  completed?: boolean;
  active?: boolean;
  title: string;
}
const { href, completed = false, active = false, title } = Astro.props;
---
<li class:list={["nav-item", { active, completed }]}>
  <a href={href} class="nav-link">
    <span class="lesson-title">{title}</span>
    {completed && <CheckmarkIcon />}
    {active && <span class="active-indicator" aria-label="Current lesson"></span>}
  </a>
</li>

// Usage in LessonLayout
<CourseNavigator currentLevel={2} currentLesson="lesson-5">
  <CourseNavigator.Section level={1} title="Foundation" lessonCount={12} completedCount={12}>
    <CourseNavigator.Item href="/learn/level-1/intro" completed title="Introduction" />
    <CourseNavigator.Item href="/learn/level-1/alphabet" completed title="Arabic Alphabet" />
  </CourseNavigator.Section>

  <CourseNavigator.Section level={2} title="Grammar Basics" lessonCount={10} completedCount={5}>
    <CourseNavigator.Item href="/learn/level-2/nouns" completed title="Nouns" />
    <CourseNavigator.Item href="/learn/level-2/verbs" active title="Verbs" />
  </CourseNavigator.Section>
</CourseNavigator>
```

### Pattern 5: Progress Visualization Component Family

**What:** Consistent progress indicators using shared visual language. Three variants serve different contexts: horizontal bars (coarse 0-100%), circular rings (categorical X/Y), checkmarks (binary done/not done).

**When to use:** Progress tracking UI. Choose variant based on data type and context.

**Trade-offs:** SVG-based implementations (rings) are more flexible but slightly more complex than CSS-only (bars).

**Example:**
```astro
---
// components/progress/ProgressBar.astro
interface Props {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'primary' | 'success' | 'warning';
  height?: 'sm' | 'md' | 'lg';
}

const {
  current,
  total,
  label,
  showPercentage = true,
  variant = 'primary',
  height = 'md'
} = Astro.props;

const percentage = Math.min(100, Math.max(0, (current / total) * 100));
const heightMap = { sm: '4px', md: '8px', lg: '12px' };
---
<div class="progress-container">
  {label && (
    <div class="progress-header">
      <span class="progress-label">{label}</span>
      {showPercentage && <span class="progress-percent">{Math.round(percentage)}%</span>}
    </div>
  )}
  <div
    class="progress-track"
    style={`height: ${heightMap[height]}`}
    role="progressbar"
    aria-valuenow={percentage}
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label={label || `${current} of ${total} complete`}
  >
    <div
      class={`progress-fill progress-${variant}`}
      style={`width: ${percentage}%`}
    ></div>
  </div>
</div>

<style>
  .progress-container {
    width: 100%;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xs);
  }

  .progress-label {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-secondary);
  }

  .progress-percent {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .progress-track {
    width: 100%;
    background: var(--color-neutral-200);
    border-radius: 999px;
    overflow: hidden;
  }

  [data-theme="dark"] .progress-track {
    background: var(--color-neutral-700);
  }

  .progress-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .progress-primary {
    background: var(--color-primary);
  }

  .progress-success {
    background: var(--color-success);
  }

  .progress-warning {
    background: var(--color-warning);
  }
</style>

// Usage
<ProgressBar
  current={completedLessons}
  total={totalLessons}
  label="Level Progress"
  variant="primary"
/>
```

## Data Flow

### Request Flow

```
[User Loads Page]
    ↓
[Astro Page Component] → [Fetch Content Collections] → [MDX Lessons]
    ↓                         ↓
[Fetch User Progress] ← [Supabase Query]
    ↓
[Transform to Props]
    ↓
[Layout Component] → [Pass Data via Props]
    ↓
[UI Components] → [Render with Design Tokens]
    ↓
[Client-Side Hydration] (if interactive)
```

### State Management

For Astro static site with Supabase progress tracking:

```
[Page Load]
    ↓
[Server-Side Render] → [Supabase Fetch] → [Progress Data]
    ↓
[Pass Props to Components]
    ↓
[User Interaction] → [Client-Side Script]
    ↓
[Update Supabase] ← [API Call]
    ↓
[Optimistic UI Update] (immediate feedback)
    ↓
[Page Navigation] → [Refetch Fresh Data]
```

### Key Data Flows

1. **Lesson Content Flow:** Content Collections (MDX) → Layout queries with `getCollection()` → Transform to props → Component renders → Static HTML

2. **Progress Tracking Flow:** User completes lesson → Client script updates Supabase → Optimistic UI (checkmark appears) → Navigate to next page → Server fetches updated progress → Render with completion state

3. **Quiz Flow:** Quiz component renders questions → User submits answers → Client validates → POST to Supabase → Calculate score → Store result → Navigate to results with score

4. **Navigation State Flow:** Layout checks current URL → Match against lesson structure → Apply active styling → Fetch completion from Supabase → Render checkmarks for completed items

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-5k users | Current Astro static architecture is optimal. Pre-rendered pages, minimal JS, fast CDN delivery. No changes needed. |
| 5k-50k users | Add edge caching for Supabase queries (Cloudflare KV, Vercel Edge Config). Implement connection pooling. Consider incremental static regeneration for user dashboards. |
| 50k+ users | Migrate to Astro hybrid mode with SSR for authenticated pages. Add proper session management (Redis). Implement rate limiting. Database read replicas. |

### Scaling Priorities

1. **First bottleneck:** Supabase database connections (free tier: 500 concurrent). **Solution:** Upgrade to Pro tier ($25/mo supports 50k+ users) or implement Supabase connection pooling via Supavisor.

2. **Second bottleneck:** Static rebuild times if content updates frequently. **Solution:** Switch to hybrid rendering (SSR for dashboards/progress, static for lessons), or use on-demand ISR for specific routes.

3. **Not a bottleneck:** Component architecture. Token-driven design system and Astro's island architecture scale without changes. UI components remain static, only data fetching layer needs optimization.

## Anti-Patterns

### Anti-Pattern 1: Hardcoded Visual Values

**What people do:** Define colors, spacing, font sizes directly in component styles without design tokens.

**Why it's wrong:** Creates inconsistency across UI. Makes theme switching (light/dark) nearly impossible. Requires find-replace across dozens of files for style updates.

**Do this instead:** Define all visual constants in `styles/tokens.css` as CSS custom properties using semantic naming. Reference tokens in components: `var(--space-lg)` not `24px`, `var(--color-primary)` not `#0056d2`.

### Anti-Pattern 2: "Hide and Hover" Navigation Actions

**What people do:** Hide action buttons (edit, delete, mark complete) until user hovers over element.

**Why it's wrong:** Forces mouse exploration to discover actions. Terrible UX for touch devices (no hover state). Reduces accessibility (keyboard navigation, screen readers can't discover hidden elements).

**Do this instead:** Make primary actions visible by default. Use subtle styling (lower opacity, smaller size) for secondary actions, but keep visible. On cards, show "Continue" button always, not just on hover.

### Anti-Pattern 3: Carousel/Slideshow for Important Content

**What people do:** Put featured courses or lessons in auto-rotating carousel.

**Why it's wrong:** Users miss content that rotates away before they see it. Analytics show carousel engagement drops 90%+ after slide 1. Auto-rotation is annoying and breaks WCAG accessibility guidelines.

**Do this instead:** Use static grid of featured content cards. All items visible simultaneously. If more items than viewport, use explicit pagination or "Show More" button, not carousel.

### Anti-Pattern 4: Reading Width Exceeds 75 Characters

**What people do:** Let lesson content span full viewport width on large screens (100+ characters per line on widescreen monitors).

**Why it's wrong:** Reading comprehension drops significantly beyond 65-75 characters per line. Eyes lose position tracking to next line. Causes fatigue, especially for educational content requiring concentration.

**Do this instead:** Constrain content width to `max-width: 65ch` (approximately 65 characters). Use `ch` unit to adapt to font size. Apply to `.lesson-content`, `.article-body`, any long-form text.

### Anti-Pattern 5: Mobile Sidebar Without Collapse Strategy

**What people do:** Keep desktop sidebar layout on mobile, making it always visible and consuming half the screen.

**Why it's wrong:** Sidebar dominates mobile viewport, leaving insufficient space for lesson content. Users can't read effectively. Horizontal scrolling on small screens.

**Do this instead:** On mobile (<1024px), convert sidebar to:
- Fixed overlay that slides in from side (triggered by hamburger)
- Bottom sheet that slides up
- Collapsible accordion in header
Default to hidden on mobile, prioritize content.

### Anti-Pattern 6: Pattern Overuse

**What people do:** Apply every fancy UI pattern (parallax, animations, carousels, modals) to make interface "modern."

**Why it's wrong:** Educational platforms need clarity and focus, not distraction. Each pattern adds cognitive load. As noted in 2026 UI research: "UI design isn't about prettier screens—it's about reducing friction."

**Do this instead:** Use patterns sparingly and purposefully. For Quran Learn: focus on clean typography, clear hierarchy, subtle progress indicators. Avoid gratuitous animations. Let content be the hero.

### Anti-Pattern 7: Inconsistent Progress Visualization

**What people do:** Use different progress patterns randomly (bars in some places, percentages in others, fractions vs decimals).

**Why it's wrong:** Creates cognitive load. Users must relearn how to interpret progress in each context. Looks unprofessional.

**Do this instead:** Define clear rules:
- **ProgressBar:** Overall course/level progress (0-100%)
- **ProgressRing:** Module/section completion (X of Y lessons)
- **Checkmark:** Individual lesson completion (binary done/not done)
Apply consistently throughout UI.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Supabase Auth | Server-side session check in Astro middleware | Verify `Astro.locals.user` in layouts. Redirect unauthenticated users server-side for protected routes. |
| Supabase Database | Direct client via `src/lib/supabase.ts` | Use Supabase JS client for queries. Implement in page components or API routes. Enable row-level security (RLS) policies. |
| Tailwind CSS 4.x | PostCSS integration via Astro config | Import design tokens in `tailwind.config.js`. Extend with custom utilities. Use `@apply` sparingly (scoped styles preferred). |
| MDX Content | Astro Content Collections API | Define schemas in `content.config.ts`. Query with `getCollection()`. Type-safe frontmatter access. |
| Capacitor Mobile | Build from same Astro static output | No special integration. Ensure responsive design and touch-friendly interactions. Test on actual devices. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Layout ↔ Components | Astro slots and props | Layouts provide structure and pass data via props. Components render in named slots (`<slot name="sidebar">`). |
| Page ↔ Layout | Props and default slot | Pages fetch data (Content Collections, Supabase), pass to layout via props. Layout handles shell (Header/Footer), page supplies main content. |
| Component ↔ Design Tokens | CSS custom properties | Components reference tokens via `var()`, never hardcode. Enables theming without component changes. |
| Content (MDX) ↔ Components | Import in MDX files | MDX can import Astro components for interactive elements within lessons (quizzes, diagrams). |
| Client JS ↔ Supabase | Direct fetch via JS client | For user interactions (mark complete, submit quiz). Use optimistic UI updates for immediate feedback. |

## Build Order Recommendations

### Phase 1: Design Foundation (Build First)

**Why first:** All components depend on design tokens. Building components before foundation causes inconsistency and requires rework.

**What to build:**
1. Create/update `styles/tokens.css` with semantic token system (colors, spacing, typography, shadows)
2. Update `styles/base.css` with Coursera-inspired typography and spacing
3. Extend `tailwind.config.js` with custom design tokens
4. Update `styles/global.css` (preserve Arabic font config)

**Validation criteria:**
- Can apply tokens in plain HTML
- Light/dark mode switching works
- No hardcoded visual values anywhere
- Arabic fonts render correctly

**Dependencies:** None. Foundation is the root.

---

### Phase 2: Primitive Progress Components (Build Second)

**Why second:** Progress visualization is core to Coursera-like UI. Needed by cards, dashboards, navigation. Must exist before consuming components.

**What to build:**
1. `components/progress/ProgressBar.astro`
2. `components/progress/ProgressRing.astro`
3. `components/progress/LessonCheckmark.astro`

**Validation criteria:**
- Each renders correctly in isolation
- Uses only design tokens (no hardcoded colors)
- Accessible (ARIA labels, semantic HTML)
- All three visualization types work

**Dependencies:** Phase 1 (design tokens)

---

### Phase 3: Foundation Components (Build Third)

**Why third:** Primitive UI components (buttons, badges, cards) are building blocks for higher-level components.

**What to build:**
1. `components/foundation/Button.astro`
2. `components/foundation/Badge.astro`
3. `components/foundation/Card.astro`
4. `components/foundation/Container.astro`

**Validation criteria:**
- Each uses design tokens exclusively
- Can compose simple layouts
- Variants work (primary/secondary buttons, badge colors)
- Responsive on mobile

**Dependencies:** Phase 1 (design tokens)

---

### Phase 4: Card Components (Build Fourth)

**Why fourth:** Cards consume primitive components and progress components. Needed by all dashboard pages.

**What to build:**
1. `components/cards/CourseCard.astro` (uses Card, Badge, ProgressBar)
2. `components/cards/LessonCard.astro` (uses Card, Checkmark)
3. `components/cards/SurahCard.astro` (uses Card, Badge)
4. `components/cards/ResourceCard.astro` (uses Card)

**Validation criteria:**
- Cards display properly in grid layout
- Progress indicators work
- Hover states functional
- Mobile responsive
- Dark mode works

**Dependencies:** Phase 2 (progress), Phase 3 (foundation)

---

### Phase 5: Navigation Components (Build Fifth)

**Why fifth:** Navigation is complex and affects entire site. Requires understanding of page structure and user flows. Benefits from seeing cards/progress in context first.

**What to build:**
1. `components/navigation/Breadcrumb.astro`
2. `components/navigation/CourseNavigator.astro` (compound component)
3. Update `components/navigation/Header.astro` (cleaner, minimal)
4. Update `components/navigation/Footer.astro` (simplified)
5. Update `components/navigation/Sidebar.astro` (add progress indicators)

**Validation criteria:**
- Navigation works across all pages
- Breadcrumbs reflect hierarchy correctly
- Sidebar collapses on mobile (overlay pattern)
- Active states visible
- Keyboard navigation works

**Dependencies:** Phase 2 (progress for sidebar checkmarks), Phase 3 (button for mobile toggle)

---

### Phase 6: Composite Components (Build Sixth)

**Why sixth:** Composite components orchestrate multiple primitives. Should be built after all dependencies exist.

**What to build:**
1. `components/composite/DashboardGrid.astro`
2. `components/composite/LessonView.astro`
3. `components/composite/QuizInterface.astro` (update existing Quiz.astro)

**Validation criteria:**
- Grids adapt responsively
- Components compose cleanly
- No prop drilling issues
- Performance acceptable (minimal re-renders)

**Dependencies:** Phase 2-5 (uses all previous components)

---

### Phase 7: Layout Updates (Build Seventh)

**Why seventh:** Layouts compose all components. Must be built after components exist to avoid stubbing.

**What to update:**
1. `layouts/BaseLayout.astro` (use updated Header/Footer)
2. `layouts/LessonLayout.astro` (add CourseNavigator, Breadcrumb, constrain width)
3. `layouts/QuizLayout.astro` (clean, focused, progress indicator)
4. `layouts/SurahLayout.astro` (card layouts)

**Validation criteria:**
- All layouts render with new components
- Sidebar navigation functional
- Content width constrained (65ch max)
- Responsive breakpoints work
- Dark mode consistent

**Dependencies:** Phase 4 (cards), Phase 5 (navigation), Phase 6 (composites)

---

### Phase 8: Page Compositions (Build Last)

**Why last:** Pages consume layouts and components. Building last minimizes rework.

**What to update:**
1. `pages/index.astro` (Hero, featured content cards, dashboard grid)
2. `pages/learn/index.astro` (module-based dashboard with level cards)
3. `pages/surah/index.astro` (card-based surah selector)
4. `pages/resources/index.astro` (resource cards)
5. Quiz pages (clean interface with new QuizInterface composite)

**Validation criteria:**
- All pages match Coursera-like design
- User flows work end-to-end
- Progress tracking functions
- Performance acceptable (Lighthouse >90)
- Mobile experience smooth

**Dependencies:** Phase 7 (layouts) — all previous phases complete

---

### Critical Path Summary

```
Phase 1: Design Foundation
    ↓
Phase 2: Progress Components ←─┐
    ↓                          │
Phase 3: Foundation Components │
    ↓                          │
Phase 4: Card Components ←─────┘ (requires both Phase 2 & 3)
    ↓
Phase 5: Navigation Components (requires Phase 2 for progress indicators)
    ↓
Phase 6: Composite Components (requires Phase 2-5)
    ↓
Phase 7: Layout Updates (requires Phase 4-6)
    ↓
Phase 8: Page Compositions (requires Phase 7)
```

**Key insight:** Bottom-up build order (foundation → primitives → compositions → pages) minimizes rework. Top-down (pages first) requires stubbing components, then rebuilding pages when real components exist.

## Astro-Specific Patterns

### Islands Architecture

Astro renders components to static HTML by default, with opt-in client-side hydration. Perfect for educational content (mostly static) with selective interactivity.

**Apply islands (client-side JS) to:**
- Progress tracking (Supabase updates)
- Quiz interactions (validation, scoring)
- Sidebar toggle (collapse/expand state)
- Auth buttons (login/logout)

**Keep static (no JS):**
- Lesson content (MDX)
- Navigation menus (server-rendered with active states)
- Progress visualization (server-rendered with current state)
- Cards and layouts (purely presentational)

### Component Slots Pattern

Astro's named slots enable flexible composition without prop drilling:

```astro
<LessonLayout>
  <div slot="sidebar">
    <CourseNavigator level={2} />
  </div>

  <nav slot="breadcrumb">
    <Breadcrumb items={breadcrumbData} />
  </nav>

  <!-- Default slot for main content -->
  <article>
    <LessonContent />
  </article>
</LessonLayout>
```

**Use named slots for:**
- Sidebar content variations
- Breadcrumb navigation
- Page-specific header actions
- Footer content variations

### Content Collections Type Safety

Leverage Astro Content Collections for type-safe MDX:

```typescript
// content.config.ts
import { defineCollection, z } from 'astro:content';

const lessons = defineCollection({
  schema: z.object({
    title: z.string(),
    level: z.number().min(1).max(5),
    order: z.number(),
    description: z.string(),
    duration: z.string(),
  }),
});

export const collections = { lessons };

// In page: type-safe access
const lesson = await getEntry('lessons', params.slug);
lesson.data.level // TypeScript knows this is 1-5
```

## Sources

### Design System Foundations
- [Design tokens explained | Contentful](https://www.contentful.com/blog/design-token-system/)
- [How to Build a Design System? Part 2: Creating the Foundations | Figr](https://figr.design/blog/design-system-introducing-design-tokens)
- [Design tokens – Material Design 3](https://m3.material.io/foundations/design-tokens)

### Educational Platform Patterns
- [E-learning platform design guide | Justinmind](https://www.justinmind.com/ui-design/how-to-design-e-learning-platform)
- [Site architecture and system design for an e-learning platform | Fastpix](https://www.fastpix.io/blog/site-architecture-and-system-design-for-an-e-learning-platform)
- [Best Dashboard Design Examples & Inspirations for 2026 | Muzli](https://muz.li/blog/best-dashboard-design-examples-inspirations-for-2026/)

### UI Component Architecture
- [8+ Best Sidebar Menu Design Examples of 2025 | Navbar Gallery](https://www.navbar.gallery/blog/best-side-bar-navigation-menu-design-examples)
- [Best UX Practices for Sidebar Menu Design in 2025](https://uiuxdesigntrends.com/best-ux-practices-for-sidebar-menu-in-2025/)
- [Navigation sidebar | Pajamas Design System](https://design.gitlab.com/patterns/navigation-sidebar/)
- [Card-Based UI Design: Structure, Advantages, and Best Practices | Bootcamp](https://medium.com/design-bootcamp/spticard-based-ui-design-structure-advantages-and-best-practices-69042d1f0786)

### Astro Architecture
- [Astro](https://astro.build/)
- [Understanding Astro islands architecture | LogRocket](https://blog.logrocket.com/understanding-astro-islands-architecture/)
- [Astro Design System starter | GitHub](https://github.com/jordienr/astro-design-system)

### UI/UX Anti-Patterns
- [Top 10 UI/UX Design Trends 2026 | Zeka Design](https://www.zekagraphic.com/top-10-ui-ux-design-trends-2026/)
- [User Interface Anti-Patterns | UI Patterns](https://ui-patterns.com/blog/User-Interface-AntiPatterns)
- [UI Design Best Practices and Common Mistakes | Toptal](https://www.toptal.com/designers/ui/most-common-ui-design-mistakes)
- [The Ultimate Guide to UI Design in 2026 | Medium](https://medium.com/@WebdesignerDepot/the-ultimate-guide-to-ui-design-in-2026-d9a6ef5a93bd)

### Component Patterns
- [Compound Pattern | Patterns.dev](https://www.patterns.dev/react/compound-pattern/)
- [Mastering Compound Components | DEV](https://dev.to/gabrielduete/mastering-compound-components-building-flexible-and-reusable-react-components-3bnj)

---
*Architecture research for: Quran Learn UI/UX Redesign*
*Researched: 2026-02-05*
*Confidence: HIGH - Verified with authoritative sources, Astro documentation, and design system best practices*
