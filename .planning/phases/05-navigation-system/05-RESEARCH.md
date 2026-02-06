# Phase 5: Navigation System - Research

**Researched:** 2026-02-06
**Domain:** Collapsible sidebar navigation, breadcrumb navigation, keyboard accessibility
**Confidence:** HIGH

## Summary

Phase 5 focuses on building a comprehensive navigation system for the educational platform with two primary components: a collapsible course navigator sidebar displaying all 61 lessons with progress checkmarks, and breadcrumb navigation showing hierarchical location. The existing codebase has a basic `Sidebar.astro` component that shows only the current level's lessons, which needs expansion to show all levels with collapsible sections. Research confirms the standard approach uses CSS logical properties for RTL support, focus trapping for mobile overlays, semantic HTML with ARIA landmarks, and localStorage for sidebar state persistence.

The navigation system must work across three viewport contexts: desktop with fixed sidebar (>1024px), tablet with toggleable sidebar (768-1023px), and mobile with overlay sidebar (<768px). The WCAG 2.2 standard requires keyboard navigation (Tab, Enter, Escape, Arrow keys), visible focus indicators, and proper ARIA labeling. Breadcrumbs require `<nav>` with `aria-label="Breadcrumbs"`, `<ol>` structure, and `aria-current="page"` on the current item. RTL mode requires flipped separators (< instead of >) using CSS logical properties or custom CSS variables.

**Primary recommendation:** Use CSS `transform` and `position: fixed` for performant mobile overlay, implement focus trapping with vanilla JavaScript, persist sidebar state with localStorage, use `scrollIntoView()` for active lesson visibility, and structure breadcrumbs with semantic HTML following W3C WAI-ARIA patterns.

## Standard Stack

The established libraries/tools for navigation system implementation:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JavaScript | ES2024+ | Sidebar state, focus trap, scroll management | Astro's default, no framework needed for DOM manipulation |
| CSS Logical Properties | Native CSS | RTL-aware positioning (inline-start, inline-end) | W3C standard for internationalization, Phase 1-4 already use this |
| localStorage API | Native Browser | Persist sidebar collapse/expand state | Browser-native, synchronous, perfect for UI preferences |
| Intersection Observer API | Native Browser | Detect active section for breadcrumb updates (optional) | Performant scroll detection, 97%+ browser support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| scrollIntoView() | Native DOM | Auto-scroll active lesson into viewport | When sidebar loads or active lesson changes |
| focus-trap | 7.x (optional) | Production-grade focus trapping | If vanilla implementation becomes complex, but Phase 5 scope is simple enough for vanilla |
| matchMedia API | Native Browser | Detect viewport breakpoints in JavaScript | For responsive sidebar behavior coordination |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| localStorage | sessionStorage | sessionStorage clears on tab close, worse for user preference persistence |
| CSS transform | CSS width transition | Width transitions force layout recalculation, transform uses GPU acceleration |
| Vanilla JS focus trap | focus-trap library | Library adds 5KB, vanilla sufficient for single overlay pattern |
| scrollIntoView() | Manual scroll calculation | Manual scrolling requires offset calculation and edge case handling |

**Installation:**
```bash
# No installation needed - all native browser APIs
```

## Architecture Patterns

### Recommended Component Structure
```
src/components/
├── navigation/
│   ├── CourseNavigator.astro    # Main sidebar with all 61 lessons
│   ├── Breadcrumbs.astro         # Breadcrumb navigation component
│   └── NavigatorToggle.astro     # Mobile menu toggle button
└── Sidebar.astro                 # [DEPRECATED] Replace with CourseNavigator
```

### Pattern 1: Fixed Sidebar with Mobile Overlay
**What:** Desktop shows fixed sidebar, mobile converts to overlay with backdrop
**When to use:** Standard educational platform pattern (Coursera, Udemy, Khan Academy)
**Example:**
```css
/* Desktop: fixed sidebar */
.course-navigator {
  position: sticky;
  top: 80px; /* Below header */
  inline-size: 280px;
  block-size: calc(100vh - 96px);
  overflow-y: auto;
}

/* Mobile: fixed overlay */
@media (max-width: 1023px) {
  .course-navigator {
    position: fixed;
    inset-block-start: 0;
    inset-inline-start: 0;
    inline-size: 280px;
    block-size: 100vh;
    z-index: 40;
    transform: translateX(-100%); /* Hidden by default */
    transition: transform 300ms ease;
  }

  [dir="rtl"] .course-navigator {
    inset-inline-start: auto;
    inset-inline-end: 0;
    transform: translateX(100%);
  }

  .course-navigator.open {
    transform: translateX(0);
  }

  /* Backdrop */
  .course-navigator-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 39;
    opacity: 0;
    pointer-events: none;
    transition: opacity 300ms ease;
  }

  .course-navigator-backdrop.visible {
    opacity: 1;
    pointer-events: auto;
  }
}
```

### Pattern 2: Collapsible Level Sections
**What:** Each level (1-5) is an expandable/collapsible section showing its lessons
**When to use:** Organizing 61 lessons into manageable groups prevents overwhelming sidebar
**Example:**
```astro
---
// CourseNavigator.astro
import { getCollection } from 'astro:content';

const allLessons = await getCollection('lessons');
const lessonsByLevel = {
  1: allLessons.filter(l => l.data.level === 1).sort((a, b) => a.data.order - b.data.order),
  2: allLessons.filter(l => l.data.level === 2).sort((a, b) => a.data.order - b.data.order),
  3: allLessons.filter(l => l.data.level === 3).sort((a, b) => a.data.order - b.data.order),
  4: allLessons.filter(l => l.data.level === 4).sort((a, b) => a.data.order - b.data.order),
  5: allLessons.filter(l => l.data.level === 5).sort((a, b) => a.data.order - b.data.order),
};

const currentPath = Astro.url.pathname;
---

<nav class="course-navigator" aria-label="Course navigation">
  {Object.entries(lessonsByLevel).map(([level, lessons]) => (
    <section class="level-section" data-level={level}>
      <button
        class="level-header"
        aria-expanded="false"
        aria-controls={`level-${level}-lessons`}
      >
        <span class="level-dot level-{level}"></span>
        <span class="level-title">Level {level}</span>
        <svg class="chevron" aria-hidden="true"><!-- chevron icon --></svg>
      </button>

      <ol id={`level-${level}-lessons`} class="lesson-list" hidden>
        {lessons.map(lesson => {
          const lessonPath = `/learn/${lesson.id}/`;
          const isActive = currentPath === lessonPath;
          return (
            <li>
              <a
                href={lessonPath}
                class:list={['lesson-item', { active: isActive }]}
                aria-current={isActive ? 'page' : undefined}
              >
                <span class="lesson-number">{lesson.data.order}</span>
                <span class="lesson-title">{lesson.data.title}</span>
                <!-- Checkmark if completed -->
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  ))}
</nav>
```

### Pattern 3: Semantic Breadcrumb Structure (W3C WAI-ARIA)
**What:** Breadcrumbs with proper ARIA labeling and semantic HTML
**When to use:** All pages except homepage
**Example:**
```astro
---
// Breadcrumbs.astro
interface Props {
  items: Array<{ label: string; href?: string }>;
}

const { items } = Astro.props;
---

<nav aria-label="Breadcrumbs" class="breadcrumbs">
  <ol>
    {items.map((item, index) => {
      const isLast = index === items.length - 1;
      return (
        <li>
          {isLast ? (
            <span aria-current="page">{item.label}</span>
          ) : (
            <>
              <a href={item.href}>{item.label}</a>
              <span class="separator" aria-hidden="true">/</span>
            </>
          )}
        </li>
      );
    })}
  </ol>
</nav>

<style>
  .breadcrumbs ol {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .breadcrumbs li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .separator {
    color: var(--text-tertiary);
  }

  /* RTL separator flip */
  [dir="rtl"] .separator::before {
    content: "<";
  }

  [dir="ltr"] .separator::before {
    content: "/";
  }
</style>
```

### Pattern 4: Focus Trap for Mobile Overlay
**What:** Trap keyboard focus within sidebar when open on mobile
**When to use:** Mobile overlay (<1024px) to meet WCAG keyboard navigation requirements
**Example:**
```typescript
// Source: Vanilla JS focus trap pattern
function trapFocus(element: HTMLElement) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const focusableElements = Array.from(
    element.querySelectorAll(focusableSelectors)
  ) as HTMLElement[];

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });

  // Focus first element when trap activates
  firstFocusable?.focus();
}
```

### Pattern 5: Scroll Active Lesson Into View
**What:** Auto-scroll sidebar to show active lesson when page loads
**When to use:** Ensures current lesson is visible without manual scrolling
**Example:**
```typescript
// Run after sidebar renders
function scrollActiveLessonIntoView() {
  const activeLesson = document.querySelector('.lesson-item.active');
  if (!activeLesson) return;

  // Expand the parent level section first
  const levelSection = activeLesson.closest('.level-section');
  const levelHeader = levelSection?.querySelector('.level-header');
  if (levelHeader && levelHeader.getAttribute('aria-expanded') === 'false') {
    levelHeader.click(); // Expand the section
  }

  // Wait for expansion animation, then scroll
  setTimeout(() => {
    activeLesson.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, 300); // Match CSS transition duration
}
```

### Pattern 6: localStorage State Persistence
**What:** Remember which level sections are expanded and sidebar open/closed state
**When to use:** Improve UX by persisting user preferences across sessions
**Example:**
```typescript
// Save sidebar state
function saveSidebarState(isOpen: boolean) {
  localStorage.setItem('sidebar-open', isOpen.toString());
}

// Save level section state
function saveLevelState(level: number, isExpanded: boolean) {
  const key = `level-${level}-expanded`;
  localStorage.setItem(key, isExpanded.toString());
}

// Restore on page load
function restoreSidebarState() {
  const isOpen = localStorage.getItem('sidebar-open') === 'true';
  if (isOpen) {
    document.querySelector('.course-navigator')?.classList.add('open');
  }

  // Restore level sections
  for (let level = 1; level <= 5; level++) {
    const isExpanded = localStorage.getItem(`level-${level}-expanded`) === 'true';
    const section = document.querySelector(`[data-level="${level}"]`);
    const header = section?.querySelector('.level-header');
    const list = section?.querySelector('.lesson-list');

    if (isExpanded && header && list) {
      header.setAttribute('aria-expanded', 'true');
      list.removeAttribute('hidden');
    }
  }
}
```

### Anti-Patterns to Avoid
- **Using width transitions for sidebar animation:** Width forces layout recalculation on every frame; use `transform: translateX()` for GPU acceleration
- **Forgetting RTL flipping:** Breadcrumb separators and sidebar slide direction must flip for Arabic; use CSS logical properties
- **Not trapping focus in mobile overlay:** WCAG 2.2 requires focus management for overlays; keyboard users can escape to main content otherwise
- **Hardcoded breakpoints in CSS only:** Use `matchMedia` in JavaScript to coordinate behavior when viewport changes
- **Showing all 61 lessons expanded by default:** Overwhelming for users; default to collapsed sections, expand only active level

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trap logic | Custom Tab key handler with edge cases | Vanilla JS focus trap pattern (or focus-trap library if needed) | Handles disabled elements, tabindex=-1, dynamically added elements, and browser inconsistencies |
| Scroll position management | Manual offsetTop calculation | `scrollIntoView({ block: 'center', behavior: 'smooth' })` | Handles scroll containers, safe areas, and provides smooth animation natively |
| Breadcrumb ARIA structure | Custom aria attributes | W3C WAI-ARIA breadcrumb pattern | Battle-tested structure used by gov sites, ensures screen reader compatibility |
| RTL layout flipping | Manual left/right swapping | CSS logical properties (inline-start, inline-end) | Automatic flipping based on `dir` attribute, Phase 1-4 already established this |
| Mobile overlay backdrop | Custom click handler for close | `<dialog>` element or backdrop div with event delegation | Browser handles Escape key, focus management, and backdrop clicks natively |

**Key insight:** Navigation is a solved problem in web accessibility. The W3C WAI-ARIA Authoring Practices Guide (APG) provides reference implementations for breadcrumbs and disclosure widgets (collapsible sections) that are battle-tested across assistive technologies. Don't deviate from these patterns unless user research demands it.

## Common Pitfalls

### Pitfall 1: Breadcrumb Separator Not Flipping in RTL
**What goes wrong:** Breadcrumbs show "Home / Learn / Lesson" with forward slash separator even in Arabic RTL mode, where "Lesson < Learn < Home" (with left-pointing chevron) is expected.
**Why it happens:** Separator is hardcoded in HTML or CSS without RTL consideration.
**How to avoid:** Use CSS logical properties or `dir` attribute selectors to flip separator. Bootstrap 5.3+ uses `--bs-breadcrumb-divider-flipped` CSS custom property. Alternative: use Unicode character U+003E (>) which auto-flips to U+003C (<) in RTL by browser.
**Warning signs:** User reports (or visual inspection) show breadcrumbs with wrong separator direction in Arabic mode.

### Pitfall 2: Sidebar Overlay Not Trapping Focus
**What goes wrong:** User opens mobile sidebar overlay, presses Tab, and focus escapes to main content behind the overlay. Keyboard users cannot navigate sidebar effectively.
**Why it happens:** No focus trap implemented; browser's natural tab order continues to background content.
**How to avoid:** Implement focus trap when sidebar opens on mobile (<1024px). Use vanilla JS pattern (Pattern 4 above) or focus-trap library. Trap activates when sidebar opens, deactivates when closed.
**Warning signs:** Keyboard testing reveals focus moves to hidden content, WCAG 2.2 automated tools flag focus order violations.

### Pitfall 3: Active Lesson Outside Visible Scroll Area
**What goes wrong:** User navigates to Lesson 45 (Level 4), but sidebar shows Levels 1-2 at top, requiring manual scroll to find active lesson.
**Why it happens:** No `scrollIntoView()` call on page load, or call happens before level section expands.
**How to avoid:** On page load, expand the active lesson's level section, wait for CSS transition to complete (300ms), then call `scrollIntoView({ block: 'center' })` on active lesson element.
**Warning signs:** User testing reveals users don't notice active lesson indicator, users manually scroll sidebar on every page load.

### Pitfall 4: Sidebar State Not Persisting
**What goes wrong:** User expands Level 3 to browse lessons, clicks a lesson, lesson loads but sidebar resets to all sections collapsed. User must re-expand Level 3 on every navigation.
**Why it happens:** No localStorage persistence; sidebar state is ephemeral per page load.
**How to avoid:** Save level section expand/collapse state to localStorage on toggle. Restore state on page load before rendering. Key: `level-{N}-expanded`.
**Warning signs:** User frustration reports about repetitive clicking, high bounce rate on lesson pages.

### Pitfall 5: Mobile Sidebar Using Width Transition
**What goes wrong:** Sidebar animation is janky on mobile, drops frames, feels sluggish.
**Why it happens:** CSS `transition: width 300ms` forces layout recalculation on every frame, triggering repaints.
**How to avoid:** Use `transform: translateX(-100%)` to `translateX(0)` for sidebar show/hide. Transform operations use GPU acceleration and don't trigger layout. Sidebar has fixed width; only position animates.
**Warning signs:** Lighthouse performance audit flags layout shift, mobile users report sluggish animations, 60fps not achieved during transition.

### Pitfall 6: Breadcrumbs Missing on Mobile
**What goes wrong:** Desktop shows breadcrumbs but mobile doesn't due to space constraints, leaving mobile users without hierarchical context.
**Why it happens:** Developer hides breadcrumbs on mobile assuming screen space is precious.
**How to avoid:** Keep breadcrumbs on mobile but truncate using ellipsis or show only direct parent (e.g., "Learn / ... / Current Lesson"). W3C USWDS design system recommends "showing only a page's direct parent" on mobile.
**Warning signs:** Mobile user testing reveals confusion about location in course hierarchy, high "back button" usage.

### Pitfall 7: Keyboard Navigation Not Tested with External Keyboard
**What goes wrong:** Desktop keyboard navigation works, but iPad with Bluetooth keyboard fails (focus indicators missing, Tab order wrong).
**Why it happens:** Only tested on desktop browser, never tested mobile browser with external keyboard.
**How to avoid:** Test iOS Safari and Android Chrome with external Bluetooth keyboard. WCAG guidance: "Connect a Bluetooth keyboard to test mobile browsers." Focus indicators and Tab order must work identically.
**Warning signs:** Accessibility audit flags mobile-specific keyboard issues, iPad user complaints about navigation difficulty.

## Code Examples

Verified patterns from official sources and research:

### Complete Breadcrumb Component (W3C WAI-ARIA Pattern)
```astro
---
// Breadcrumbs.astro
// Source: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

const { items } = Astro.props;
const currentPath = Astro.url.pathname;
---

<nav aria-label="Breadcrumbs" class="breadcrumbs">
  <ol>
    {items.map((item, index) => {
      const isLast = index === items.length - 1;
      return (
        <li>
          {isLast ? (
            <span class="current" aria-current="page">{item.label}</span>
          ) : (
            <>
              <a href={item.href}>{item.label}</a>
              <span class="separator" aria-hidden="true"></span>
            </>
          )}
        </li>
      );
    })}
  </ol>
</nav>

<style>
  .breadcrumbs {
    font-size: 0.875rem;
    color: var(--text-tertiary);
    margin-block-end: 1.5rem;
  }

  .breadcrumbs ol {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .breadcrumbs li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .breadcrumbs a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .breadcrumbs a:hover {
    color: var(--accent-primary);
  }

  .breadcrumbs .current {
    color: var(--text-primary);
    font-weight: 500;
  }

  /* RTL-aware separator */
  .separator::before {
    content: "/";
    color: var(--text-tertiary);
  }

  [dir="rtl"] .separator::before {
    content: "<";
  }

  /* Mobile: truncate long paths */
  @media (max-width: 767px) {
    .breadcrumbs li:not(:first-child):not(:last-child) {
      display: none;
    }

    /* Show ellipsis */
    .breadcrumbs li:not(:first-child):not(:last-child):first-of-type {
      display: flex;
    }

    .breadcrumbs li:not(:first-child):not(:last-child):first-of-type::before {
      content: "...";
    }
  }
</style>
```

### Collapsible Level Section with ARIA Disclosure
```typescript
// navigationSetup.ts
// Source: WAI-ARIA disclosure pattern + localStorage state management

function initializeLevelSections() {
  const sections = document.querySelectorAll('.level-section');

  sections.forEach((section) => {
    const header = section.querySelector('.level-header') as HTMLButtonElement;
    const list = section.querySelector('.lesson-list') as HTMLElement;
    const level = section.getAttribute('data-level');

    if (!header || !list || !level) return;

    // Restore state from localStorage
    const savedState = localStorage.getItem(`level-${level}-expanded`);
    const isExpanded = savedState === 'true';

    header.setAttribute('aria-expanded', isExpanded.toString());
    if (isExpanded) {
      list.removeAttribute('hidden');
    }

    // Toggle on click
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      const newState = !expanded;

      header.setAttribute('aria-expanded', newState.toString());

      if (newState) {
        list.removeAttribute('hidden');
      } else {
        list.setAttribute('hidden', '');
      }

      // Save state
      localStorage.setItem(`level-${level}-expanded`, newState.toString());
    });
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', initializeLevelSections);
```

### Mobile Sidebar Toggle with Focus Trap
```typescript
// sidebarToggle.ts
// Source: Focus trap pattern + mobile overlay best practices

let focusTrap: (() => void) | null = null;

function openSidebar() {
  const sidebar = document.querySelector('.course-navigator') as HTMLElement;
  const backdrop = document.querySelector('.course-navigator-backdrop') as HTMLElement;
  const toggle = document.querySelector('.sidebar-toggle') as HTMLButtonElement;

  if (!sidebar || !backdrop || !toggle) return;

  // Show sidebar and backdrop
  sidebar.classList.add('open');
  backdrop.classList.add('visible');
  toggle.setAttribute('aria-expanded', 'true');

  // Enable focus trap
  focusTrap = trapFocus(sidebar);

  // Close on backdrop click
  backdrop.addEventListener('click', closeSidebar, { once: true });

  // Close on Escape key
  document.addEventListener('keydown', handleEscape);

  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  const sidebar = document.querySelector('.course-navigator') as HTMLElement;
  const backdrop = document.querySelector('.course-navigator-backdrop') as HTMLElement;
  const toggle = document.querySelector('.sidebar-toggle') as HTMLButtonElement;

  if (!sidebar || !backdrop || !toggle) return;

  sidebar.classList.remove('open');
  backdrop.classList.remove('visible');
  toggle.setAttribute('aria-expanded', 'false');

  // Disable focus trap
  focusTrap?.();
  focusTrap = null;

  // Remove event listeners
  document.removeEventListener('keydown', handleEscape);

  // Restore body scroll
  document.body.style.overflow = '';

  // Return focus to toggle button
  toggle.focus();
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeSidebar();
  }
}

function trapFocus(container: HTMLElement): () => void {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const focusableElements = Array.from(
    container.querySelectorAll(focusableSelectors)
  ) as HTMLElement[];

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  container.addEventListener('keydown', handleTabKey);

  // Focus first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

// Initialize toggle button
document.querySelector('.sidebar-toggle')?.addEventListener('click', () => {
  const isOpen = document.querySelector('.course-navigator')?.classList.contains('open');
  if (isOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
});
```

### Scroll Active Lesson Into View
```typescript
// scrollActiveLesson.ts

function scrollActiveLessonIntoView() {
  const activeLesson = document.querySelector('.lesson-item[aria-current="page"]') as HTMLElement;
  if (!activeLesson) return;

  // Find parent level section
  const levelSection = activeLesson.closest('.level-section');
  const levelHeader = levelSection?.querySelector('.level-header') as HTMLButtonElement;

  // If section is collapsed, expand it first
  if (levelHeader && levelHeader.getAttribute('aria-expanded') === 'false') {
    levelHeader.click();

    // Wait for expansion animation to complete
    setTimeout(() => {
      scrollToLesson(activeLesson);
    }, 300); // Match CSS transition duration
  } else {
    scrollToLesson(activeLesson);
  }
}

function scrollToLesson(element: HTMLElement) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
}

// Run on page load and after navigation
document.addEventListener('DOMContentLoaded', scrollActiveLessonIntoView);
document.addEventListener('astro:page-load', scrollActiveLessonIntoView); // Astro view transitions
```

### Responsive Sidebar with CSS Logical Properties
```css
/* courseNavigator.css */
/* Desktop: sticky sidebar */
.course-navigator {
  position: sticky;
  inset-block-start: 80px; /* Below header */
  inline-size: 280px;
  block-size: calc(100vh - 96px);
  overflow-y: auto;
  background: var(--bg-elevated);
  border-inline-end: 1px solid var(--border-primary);
  padding: var(--space-md);
}

/* Mobile: fixed overlay */
@media (max-width: 1023px) {
  .course-navigator {
    position: fixed;
    inset-block-start: 0;
    inset-inline-start: 0;
    inline-size: 280px;
    block-size: 100vh;
    z-index: 40;
    transform: translateX(-100%);
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-xl);
  }

  [dir="rtl"] .course-navigator {
    inset-inline-start: auto;
    inset-inline-end: 0;
    transform: translateX(100%);
  }

  .course-navigator.open {
    transform: translateX(0);
  }

  /* Backdrop */
  .course-navigator-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 39;
    opacity: 0;
    pointer-events: none;
    transition: opacity 300ms ease;
  }

  .course-navigator-backdrop.visible {
    opacity: 1;
    pointer-events: auto;
  }
}

/* Level section header */
.level-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  inline-size: 100%;
  padding: 0.75rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.level-header:hover {
  background: var(--bg-secondary);
}

.level-header[aria-expanded="true"] .chevron {
  transform: rotate(90deg);
}

[dir="rtl"] .level-header[aria-expanded="true"] .chevron {
  transform: rotate(-90deg);
}

/* Lesson list */
.lesson-list {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-inline-start: 1.5rem;
  margin-block-start: 0.5rem;
}

.lesson-list[hidden] {
  display: none;
}

.lesson-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.lesson-item:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.lesson-item[aria-current="page"] {
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-weight: 500;
}

/* Focus indicators (WCAG 2.2) */
.level-header:focus-visible,
.lesson-item:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Sidebar per level only | Comprehensive navigator showing all levels | Coursera/Udemy pattern 2020+ | Better course overview, reduced navigation clicks |
| Width transition for sidebar | Transform translation with GPU acceleration | Performance best practices 2023+ | 60fps animations on mobile, no layout thrashing |
| Manual focus management | Focus trap libraries or standardized vanilla patterns | WCAG 2.1 (2018) keyboard requirements | Consistent keyboard navigation across assistive tech |
| Fixed breadcrumbs in all viewports | Truncated breadcrumbs on mobile ("...") | Mobile-first design 2024+ | Prevents overflow, maintains context on small screens |
| Physical properties (left/right) | Logical properties (inline-start/inline-end) | CSS Logical Properties Level 1 (2018) | Automatic RTL support without duplicate styles |
| sessionStorage for UI state | localStorage for persistent preferences | UX research 2023+ | User preferences persist across sessions, better UX |

**Deprecated/outdated:**
- **jQuery slideToggle for sidebars:** Modern approach uses CSS transitions with JavaScript class toggling, no jQuery dependency
- **Hamburger menu without focus trap:** WCAG 2.1+ requires focus management for overlays, unmaintained pattern pre-2018
- **Breadcrumb separators as images:** CSS pseudo-elements with Unicode or CSS logical properties handle RTL automatically
- **Fixed sidebar on mobile:** Mobile overlays with backdrop are standard, fixed sidebars consume too much screen real estate

## Open Questions

Things that couldn't be fully resolved:

1. **Total lesson count confirmation**
   - What we know: Success criteria states "61 lessons," but lesson content directory was empty during research (find returned 0 files)
   - What's unclear: Are lessons stored elsewhere, or is content pending? Do all 5 levels have lessons created?
   - Recommendation: Verify actual lesson count during planning. If <61 lessons exist, navigator must handle dynamic counts. Use `getCollection('lessons').length` to get actual count rather than hardcoding 61.

2. **Progress checkmark data source**
   - What we know: Success criteria requires "checkmarks" for completed lessons, LessonLayout.astro has `markLessonComplete()` function from Phase 2
   - What's unclear: Is progress data stored in Supabase, localStorage, or both? How to query completion status for all 61 lessons efficiently?
   - Recommendation: Research existing `src/lib/progress.ts` module (referenced in LessonLayout.astro line 443). Use same data source for consistency. If Supabase, consider caching in localStorage to avoid 61 API calls on sidebar render.

3. **Header simplification scope**
   - What we know: Success criteria says "Header component cleaner and more minimal" but doesn't specify what to remove
   - What's unclear: Current Header.astro has logo, desktop nav (4 links), auth button, theme toggle, mobile menu. Which elements are "not minimal"?
   - Recommendation: Header redesign is subjective. If no CONTEXT.md exists, apply standard e-learning platform pattern: keep logo, primary CTA (auth), utility buttons (theme, menu), move secondary nav into sidebar. Remove redundant desktop nav links if sidebar is always visible.

4. **Footer simplification scope**
   - What we know: Success criteria says "Footer component simplified" without specifics
   - What's unclear: Current Footer.astro has 4-column grid (brand, links, levels, CTA). What is "simplified"?
   - Recommendation: Standard simplification: reduce to 3 columns on desktop, 1 column on mobile, remove duplicate links already in sidebar/header. Keep brand identity, essential links (About, Privacy), and social links if they exist.

5. **Keyboard arrow key navigation**
   - What we know: Success criteria requires "Arrow keys" to work, but doesn't specify for what
   - What's unclear: Does "Arrow keys" mean Up/Down to navigate lesson list, or Left/Right to collapse/expand sections, or both?
   - Recommendation: Standard pattern: Up/Down arrows move focus between lessons within expanded section, Left/Right collapse/expand level sections, Enter activates focused link/button. This matches WAI-ARIA tree view pattern used by file explorers.

6. **Mobile breakpoint definition**
   - What we know: Success criteria says "<1024px" for mobile sidebar collapse
   - What's unclear: Does "mobile" mean overlay sidebar (fixed with backdrop), or just hidden sidebar requiring toggle button? What about 768-1023px tablets?
   - Recommendation: Industry standard for educational platforms: 1024px+ = persistent sticky sidebar, <1024px = overlay sidebar with backdrop and toggle button. No middle ground needed; 768-1023px tablets use same overlay pattern as phones for consistency.

## Sources

### Primary (HIGH confidence)
- [W3C WAI-ARIA Breadcrumb Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/) - Official ARIA specification for breadcrumb navigation
- [U.S. Web Design System - Breadcrumb Component](https://designsystem.digital.gov/components/breadcrumb/) - Government design system with accessibility tests passed
- [MDN CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values) - Official documentation for RTL support
- [MDN Keyboard Accessible Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Keyboard) - WCAG keyboard navigation requirements
- [Chrome Developers - Performant Expand & Collapse Animations](https://developer.chrome.com/blog/performant-expand-and-collapse) - Official performance guidance for UI animations

### Secondary (MEDIUM confidence)
- [Best UX Practices for Sidebar Menu Design in 2025](https://uiuxdesigntrends.com/best-ux-practices-for-sidebar-menu-in-2025/) - Industry best practices compilation
- [Accessible Breadcrumbs - Aditus](https://www.aditus.io/patterns/breadcrumbs/) - Accessibility implementation guide
- [Using JavaScript to Trap Focus in an Element](https://hidde.blog/using-javascript-to-trap-focus-in-an-element/) - Focus trap implementation pattern
- [State Management in Vanilla JS: 2026 Trends](https://medium.com/@chirag.dave/state-management-in-vanilla-js-2026-trends-f9baed7599de) - Modern localStorage patterns
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/) - RTL design patterns and best practices
- [Bootstrap RTL Documentation](https://getbootstrap.com/docs/5.3/getting-started/rtl/) - Framework approach to breadcrumb separator flipping

### Tertiary (LOW confidence - general guidance)
- [How to Make Your Online Course Navigation 10x Better](https://proofmango.com/make-online-course-navigation-better/) - Educational platform UX patterns
- [Sidebar Animation Performance](https://www.joshuawootonn.com/sidebar-animation-performance) - Performance optimization techniques
- [WCAG Keyboard Accessible Explained](https://www.getstark.co/wcag-explained/operable/keyboard-accessible/) - Accessibility requirement overview

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All native browser APIs, no external dependencies needed
- Architecture patterns: HIGH - W3C WAI-ARIA patterns are reference implementations, CSS logical properties documented by MDN
- Breadcrumb implementation: HIGH - Official W3C spec with working examples, government design system validation
- Sidebar responsive behavior: MEDIUM - Industry best practices from multiple sources, not a formal standard
- Focus trap implementation: MEDIUM - Pattern is well-established but implementation details vary across sources
- Progress checkmark integration: LOW - Existing codebase uses Supabase but data flow unclear without testing

**Research date:** 2026-02-06
**Valid until:** 30 days (stable domain - WCAG standards unchanged, browser APIs mature)

**Key gaps requiring validation:**
- Actual lesson count (claimed 61, found 0 markdown files)
- Progress data source and query efficiency (Supabase vs localStorage)
- Header/Footer simplification requirements (no specific guidance in success criteria)
- Arrow key navigation scope (lesson list, section toggle, or both)
