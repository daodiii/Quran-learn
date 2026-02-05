# Roadmap: Quran Learn UI/UX Redesign

## Overview

This roadmap transforms the Quran Learn platform from functional to inspiring through a Coursera-inspired UI/UX redesign. Following a bottom-up build order, we establish design foundations and protect Arabic typography first, then build progress components, primitive UI elements, navigation system, and finally redesign all pages with responsive mobile optimization and accessibility polish. The journey delivers a clean, engaging learning experience while preserving the existing curriculum and Arabic font rendering that are critical to the platform's educational value.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Design Foundation & Font Protection** - Establish design tokens and protect Arabic fonts ✓
- [x] **Phase 2: Progress & Primitive Components** - Build progress visualization and RTL-ready primitives ✓
- [ ] **Phase 3: Card Components & Arabic Typography** - Create card layouts with proper Arabic text handling
- [ ] **Phase 4: Dark Mode Polish** - Ensure Arabic readability in dark mode with proper contrast
- [ ] **Phase 5: Navigation System** - Build collapsible sidebar and breadcrumb navigation
- [ ] **Phase 6: Page Redesigns** - Redesign all pages with new components and layouts
- [ ] **Phase 7: Mobile Optimization** - Optimize responsive design and iOS Arabic font sizing
- [ ] **Phase 8: Performance & Accessibility** - Final polish with font loading and screen reader support

## Phase Details

### Phase 1: Design Foundation & Font Protection
**Goal**: Establish design token system and protect critical Arabic fonts before any restructuring begins
**Depends on**: Nothing (first phase)
**Requirements**: DESIGN-01
**Success Criteria** (what must be TRUE):
  1. All 4 Arabic font families render correctly (UthmanicHafs, Amiri regular/bold)
  2. Design tokens apply consistently in light and dark modes
  3. CSS token system uses semantic naming (colors, spacing, typography, shadows)
  4. Font verification tests pass confirming fonts unchanged from original
  5. Tailwind 4 configuration integrates custom tokens
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Extract font declarations, capture checksums, install Playwright
- [x] 01-02-PLAN.md — Create modular @theme token files with semantic CTI naming
- [x] 01-03-PLAN.md — Build font verification tests and capture visual baselines

### Phase 2: Progress & Primitive Components
**Goal**: Build progress visualization components and RTL-ready primitive UI elements
**Depends on**: Phase 1
**Requirements**: DESIGN-02
**Success Criteria** (what must be TRUE):
  1. ProgressBar component renders 0-100% completion horizontally
  2. ProgressRing component displays X/Y lesson completion in circular format
  3. LessonCheckmark component shows binary completion state
  4. Button, Badge, Card, Container primitives exist using only design tokens
  5. All components work correctly in RTL mode with logical CSS properties
  6. Icons (arrows, chevrons) mirror correctly in RTL
  7. ARIA labels present for accessibility
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Create progress components (ProgressBar, ProgressRing, LessonCheckmark)
- [x] 02-02-PLAN.md — Create primitive components (Button, Badge, Card, Container)
- [x] 02-03-PLAN.md — Component testing and RTL/dark mode verification

### Phase 3: Card Components & Arabic Typography
**Goal**: Create card-based layouts that handle Arabic text overflow correctly
**Depends on**: Phase 2
**Requirements**: None directly (infrastructure for page redesigns)
**Success Criteria** (what must be TRUE):
  1. CourseCard, LessonCard, SurahCard, ResourceCard components exist
  2. Cards display in responsive grid layouts (1-3 columns based on viewport)
  3. Arabic lesson titles don't break mid-word on mobile
  4. Components use overflow-wrap instead of word-break for text handling
  5. All cards support hover states and dark mode
  6. Progress indicators integrate into cards correctly
**Plans**: 2 plans

Plans:
- [ ] 03-01-PLAN.md — Create CardGrid, CourseCard, LessonCard, SurahCard, ResourceCard components
- [ ] 03-02-PLAN.md — Card test page and Playwright tests for responsive/Arabic/dark mode

### Phase 4: Dark Mode Polish
**Goal**: Ensure Arabic typography remains readable in dark mode with proper contrast ratios
**Depends on**: Phase 3
**Requirements**: DARK-01
**Success Criteria** (what must be TRUE):
  1. WCAG AAA contrast ratio (7:1 minimum) achieved for Arabic body text in dark mode
  2. Arabic diacritical marks clearly visible in dark mode
  3. UthmanicHafs font readable without eye strain in dark mode
  4. Font weight adjusted for dark mode (500 vs 400 in light mode)
  5. All components (cards, progress indicators, navigation) work in dark mode
**Plans**: TBD

Plans:
- [ ] 04-01: [To be defined during planning]

### Phase 5: Navigation System
**Goal**: Build collapsible course navigator sidebar and breadcrumb navigation system
**Depends on**: Phase 4
**Requirements**: NAV-01, NAV-02, COMP-01, COMP-02
**Success Criteria** (what must be TRUE):
  1. CourseNavigator sidebar displays all 61 lessons with checkmarks
  2. Sidebar collapses on mobile (<1024px) to fixed overlay
  3. Active lesson visible in both collapsed and expanded sidebar states
  4. Breadcrumbs match sidebar structure for all pages
  5. Keyboard navigation works (Tab, Enter, Escape, Arrow keys)
  6. RTL mode breadcrumbs use correct separators (< not >)
  7. Header component cleaner and more minimal
  8. Footer component simplified
**Plans**: TBD

Plans:
- [ ] 05-01: [To be defined during planning]

### Phase 6: Page Redesigns
**Goal**: Redesign all pages using new components, layouts, and navigation system
**Depends on**: Phase 5
**Requirements**: HOME-01, HOME-02, LEARN-01, LEARN-02, SURAH-01, RESOURCE-01, QUIZ-01
**Success Criteria** (what must be TRUE):
  1. Homepage has inspiring hero section with clear value proposition
  2. Homepage displays featured content cards with progress indicators
  3. Learn dashboard shows module-based layout with level progress
  4. Lesson pages use proper reading width (60-75ch) with floating navigator
  5. Surah selector displays card-based layout with difficulty badges
  6. Resource section shows visual cards for all 6 reference materials
  7. Quiz experience is clean and focused with clear feedback
  8. All pages integrate navigation system (sidebar, breadcrumbs)
**Plans**: TBD

Plans:
- [ ] 06-01: [To be defined during planning]

### Phase 7: Mobile Optimization
**Goal**: Optimize responsive design with iOS-specific Arabic font sizing and touch interactions
**Depends on**: Phase 6
**Requirements**: RESP-01
**Success Criteria** (what must be TRUE):
  1. Arabic text readable at 18px+ on iOS devices (tested on real hardware)
  2. All touch targets meet 44px minimum size requirement
  3. Sidebar overlay works with swipe gestures on mobile
  4. No horizontal scrolling at 320px viewport width
  5. Images in MDX content are responsive
  6. Lighthouse mobile score above 90
  7. Mobile-first responsive design works across all pages
**Plans**: TBD

Plans:
- [ ] 07-01: [To be defined during planning]

### Phase 8: Performance & Accessibility
**Goal**: Final polish with font loading optimization and comprehensive accessibility support
**Depends on**: Phase 7
**Requirements**: None directly (quality polish)
**Success Criteria** (what must be TRUE):
  1. NVDA/JAWS screen readers announce all interactive elements correctly
  2. Progress state changes announced via aria-live regions
  3. RTL mode screen reader announcements work correctly
  4. Capacitor mobile app launches under 2 seconds
  5. No Flash of Invisible Text (FOIT) during font loading
  6. Lighthouse accessibility score is 100
  7. Total JavaScript bundle under 50KB
  8. Keyboard navigation complete for all interactive elements
**Plans**: TBD

Plans:
- [ ] 08-01: [To be defined during planning]

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design Foundation & Font Protection | 3/3 | Complete ✓ | 2026-02-05 |
| 2. Progress & Primitive Components | 3/3 | Complete ✓ | 2026-02-06 |
| 3. Card Components & Arabic Typography | 0/2 | Ready | - |
| 4. Dark Mode Polish | 0/TBD | Not started | - |
| 5. Navigation System | 0/TBD | Not started | - |
| 6. Page Redesigns | 0/TBD | Not started | - |
| 7. Mobile Optimization | 0/TBD | Not started | - |
| 8. Performance & Accessibility | 0/TBD | Not started | - |
