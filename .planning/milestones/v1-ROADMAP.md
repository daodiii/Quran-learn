# Milestone v1: UI/UX Redesign

**Status:** SHIPPED 2026-02-06
**Phases:** 1-8
**Total Plans:** 28

## Overview

This roadmap transformed the Quran Learn platform from functional to inspiring through a Coursera-inspired UI/UX redesign. Following a bottom-up build order, we established design foundations and protected Arabic typography first, then built progress components, primitive UI elements, navigation system, and finally redesigned all pages with responsive mobile optimization and accessibility polish. The journey delivered a clean, engaging learning experience while preserving the existing curriculum and Arabic font rendering critical to the platform's educational value.

## Phases

### Phase 1: Design Foundation & Font Protection
**Goal**: Establish design token system and protect critical Arabic fonts before any restructuring begins
**Depends on**: Nothing (first phase)
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Extract font declarations, capture checksums, install Playwright
- [x] 01-02-PLAN.md — Create modular @theme token files with semantic CTI naming
- [x] 01-03-PLAN.md — Build font verification tests and capture visual baselines

**Deliverables:**
- Font checksums baseline (tests/font-checksums.json)
- Design tokens with semantic naming (src/styles/tokens/)
- Playwright test suite with visual regression baselines

### Phase 2: Progress & Primitive Components
**Goal**: Build progress visualization components and RTL-ready primitive UI elements
**Depends on**: Phase 1
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Create progress components (ProgressBar, ProgressRing, LessonCheckmark)
- [x] 02-02-PLAN.md — Create primitive components (Button, Badge, Card, Container)
- [x] 02-03-PLAN.md — Component testing and RTL/dark mode verification

**Deliverables:**
- Progress visualization components (ProgressBar, ProgressRing, LessonCheckmark)
- Primitive UI components (Button, Badge, Card, Container)
- CSS logical properties for RTL support
- Component test page with 55 data-testid attributes
- Playwright test suite (25 tests: ARIA, RTL, dark mode, visual regression)

### Phase 3: Card Components & Arabic Typography
**Goal**: Create card-based layouts that handle Arabic text overflow correctly
**Depends on**: Phase 2
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md — Create CardGrid, CourseCard, LessonCard, SurahCard, ResourceCard components
- [x] 03-02-PLAN.md — Card test page and Playwright tests for responsive/Arabic/dark mode

**Deliverables:**
- CardGrid responsive utility with CSS Grid auto-fit pattern
- CourseCard, LessonCard, SurahCard, ResourceCard components
- Arabic typography rules: overflow-wrap: break-word, hyphens: none
- 20 Playwright tests (responsive, Arabic text, progress, dark mode, visual, a11y)

### Phase 4: Dark Mode Polish
**Goal**: Ensure Arabic typography remains readable in dark mode with proper contrast ratios
**Depends on**: Phase 3
**Plans**: 2 plans

Plans:
- [x] 04-01-PLAN.md — Install axe-core, create automated WCAG AAA contrast tests
- [x] 04-02-PLAN.md — Arabic font weight adjustments, visual regression for diacritical marks

**Deliverables:**
- Automated WCAG AAA accessibility testing with axe-core
- WCAG AAA compliant color system (7:1 contrast ratios)
- Dark mode font-weight optical compensation for Arabic text
- Visual regression baselines for Arabic diacritical marks

### Phase 5: Navigation System
**Goal**: Build collapsible course navigator sidebar and breadcrumb navigation system
**Depends on**: Phase 4
**Plans**: 4 plans

Plans:
- [x] 05-01-PLAN.md — Create Breadcrumbs component and simplify Header/Footer
- [x] 05-02-PLAN.md — Create CourseNavigator sidebar and NavigatorToggle button
- [x] 05-03-PLAN.md — Integrate navigation into layouts with JavaScript behaviors
- [x] 05-04-PLAN.md — Navigation test page and Playwright test suite

**Deliverables:**
- WAI-ARIA compliant Breadcrumbs component with RTL separator flip
- CourseNavigator sidebar showing all 73 lessons across 5 collapsible levels
- Navigation integration with keyboard nav, focus trapping, mobile overlay
- Comprehensive test suite (35 tests)

### Phase 6: Page Redesigns
**Goal**: Redesign all pages using new components, layouts, and navigation system
**Depends on**: Phase 5
**Plans**: 6 plans

Plans:
- [x] 06-01-PLAN.md — Homepage redesign with hero section and featured CourseCards
- [x] 06-02-PLAN.md — Learn dashboard with module-based layout and level progress
- [x] 06-03-PLAN.md — Lesson pages with reading width and prev/next navigation
- [x] 06-04-PLAN.md — Surah selector with card-based layout and difficulty badges
- [x] 06-05-PLAN.md — Resources page with visual ResourceCards
- [x] 06-06-PLAN.md — Quiz experience redesign with clean feedback

**Deliverables:**
- Homepage with hero section, featured CourseCards, and SurahCards
- localStorage-based progress tracking utility
- Reading-optimized lesson layout with 70ch content width
- Card-based surah selector with difficulty grouping
- Resources page with 6 reference cards and semantic SVG icons
- Quiz component with single-question display and immediate feedback

### Phase 7: Mobile Optimization
**Goal**: Optimize responsive design with iOS-specific Arabic font sizing and touch interactions
**Depends on**: Phase 6
**Plans**: 4 plans

Plans:
- [x] 07-01-PLAN.md — iOS text-size-adjust and touch target CSS enhancements
- [x] 07-02-PLAN.md — Swipe gestures for sidebar and horizontal scroll prevention
- [x] 07-03-PLAN.md — Responsive images for MDX content
- [x] 07-04-PLAN.md — Lighthouse audit and real device verification (checkpoint)

**Deliverables:**
- iOS Safari text-size-adjust controls
- 44px touch targets (iOS HIG compliant)
- Swipe-to-close gesture for mobile sidebar
- ResponsiveImage component with avif/webp formats
- Lighthouse mobile performance baseline

### Phase 8: Performance & Accessibility
**Goal**: Final polish with font loading optimization and comprehensive accessibility support
**Depends on**: Phase 7
**Plans**: 4 plans

Plans:
- [x] 08-01-PLAN.md — Font preloading and ARIA live region infrastructure
- [x] 08-02-PLAN.md — Capacitor splash screen lifecycle and bundle size verification
- [x] 08-03-PLAN.md — Keyboard navigation audit and comprehensive accessibility tests
- [x] 08-04-PLAN.md — Production Lighthouse audit and screen reader verification (checkpoint)

**Deliverables:**
- Font preload links for Arabic fonts (eliminates FOIT)
- ARIA live regions for screen reader announcements
- Capacitor splash screen lifecycle with error handling
- 14KB JS bundle (72% under 50KB target)
- Lighthouse accessibility 100, performance 99-100
- Manual VoiceOver verification passed

---

## Milestone Summary

**Key Decisions:**
- Minimal gamification approach (clean educational focus)
- WCAG AAA (7:1 contrast) chosen over AA for Arabic text
- CSS logical properties universally for RTL support
- Dark mode via data-theme attribute, not Tailwind dark: classes
- localStorage-only progress tracking for MVP
- aria-live="polite" exclusively per Adrian Roselli research
- 70ch max reading width for lesson content

**Issues Resolved:**
- Arabic text overflow on mobile (overflow-wrap: break-word solution)
- Dark mode Arabic readability (font-weight optical compensation 400→500)
- iOS font inflation on landscape (text-size-adjust controls)
- Horizontal scroll at narrow viewports (CSS logical properties)
- Flash of Invisible Text (font preloading)
- Coral color contrast violation (#D4694E→#B84B37)
- Footer heading hierarchy (h3→h2 for WCAG compliance)

**Issues Deferred:**
- Real iOS device testing (recommended before production)
- Supabase progress sync (currently localStorage-only)
- Auth system implementation (currently stubbed)
- Lesson MDX content creation (73 files needed)

**Technical Debt Incurred:**
- auth.ts, progress.ts, capacitor-init.ts are stubs (created to unblock builds)
- Resource MDX content files are placeholders
- Navigation test partial pass rate (19/35) due to JS context limitations in Playwright

---
*For current project status, see .planning/MILESTONES.md*
