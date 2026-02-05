# Project Research Summary

**Project:** Quran Learn UI/UX Redesign
**Domain:** Educational Platform (Coursera-inspired, Arabic/RTL content)
**Researched:** 2026-02-05
**Confidence:** HIGH

## Executive Summary

Quran Learn is a Quranic Arabic learning platform requiring a Coursera-inspired UI/UX redesign. Research reveals this is a well-trodden domain with established patterns: card-based layouts, hierarchical navigation with progress tracking, and mobile-first responsive design. The existing stack (Astro 5.x, Tailwind CSS 4, TypeScript) is optimal and requires minimal additions—primarily daisyUI for zero-JS components and Motion for subtle animations.

The critical differentiator is Arabic/RTL support. Unlike typical educational platforms, this project requires careful handling of Arabic typography, bidirectional text, and RTL layout patterns. Research identified 10 critical pitfalls specific to Arabic content—ranging from font file corruption to dark mode contrast failures—that must be systematically addressed. The existing custom fonts (UthmanicHafs, Amiri) are irreplaceable assets requiring protection throughout the redesign.

The recommended approach follows a strict bottom-up build order: design foundation (tokens, typography) → progress components → primitive UI components → cards → navigation → composite components → layouts → pages. This minimizes rework and ensures RTL support is baked in from the start, not bolted on later. Key risks include breaking existing Arabic fonts, RTL layout edge cases on mobile, and progress tracking state loss. All are mitigated through phase-specific validation criteria and comprehensive testing protocols.

## Key Findings

### Recommended Stack

The current stack (Astro 5.17.1+, Tailwind CSS 4.1.18+, TypeScript) requires only strategic additions, not replacement. Research confirms this is the optimal architecture for static educational content with selective interactivity.

**Core technologies:**
- **Astro 5.x**: Static site generator with built-in View Transitions API for smooth page navigation—critical for Coursera-like UX. Islands architecture keeps JavaScript minimal (target <50KB total).
- **Tailwind CSS 4**: Container queries built-in (no plugin), CSS-first configuration approach. Perfectly suited for responsive educational layouts.
- **daisyUI 5.5.14+**: Zero-JavaScript, Tailwind-based component library. Version 5 built specifically for Tailwind 4 compatibility. Includes radial progress, progress bars, collapse/accordion, cards—all needed for educational UI.
- **Motion 12.26.2**: Micro-interactions library using Web Animations API. Only 6KB (vs Framer Motion's 30KB+). For progress bar animations, hover effects, completion celebrations.
- **Lucide Astro**: Tree-shakeable icon components. Official Astro package, inline SVG rendering for performance and accessibility.

**Critical additions:**
- `@tailwindcss/typography`: For lesson content prose styling (reading width, line height)
- `@tailwindcss/forms`: Consistent cross-browser form styling for quizzes, search
- `clsx` + `tailwind-merge`: Dynamic class composition for component variants

**What NOT to use:**
- Headless UI/Radix with Astro (React-dependent, breaks static-first architecture)
- shadcn/ui (requires React islands, unnecessary JavaScript overhead)
- AOS (jQuery-era library, conflicts with View Transitions API)
- Container queries plugin (built into Tailwind 4 core)

### Expected Features

Research reveals clear feature tiers for educational platforms, with specific recommendations for this project.

**Must have (table stakes):**
- Progress visualization (horizontal bars for modules, circular rings for overall completion)
- Clear course structure (Course → Modules → Lessons hierarchy)
- Persistent navigation (collapsible sidebar OR sticky breadcrumbs, must work on mobile)
- Lesson completion tracking (checkmarks, "Mark complete" buttons, automatic tracking)
- Clean typography hierarchy (60-75ch reading width, 1.6-1.8 line height, proper contrast)
- Responsive mobile design (mobile-first, sidebar becomes overlay, 44px touch targets)
- Next lesson navigation (prominent "Next Lesson" button at content end)
- Clean card-based layouts (lessons, modules, resources with consistent styling)

**Should have (differentiators):**
- Estimated time remaining ("15 min left in this module", "3 lessons remaining")
- Visual learning path (linear progression with milestones, past/current/future states)
- Collapsible module sections (accordion-style with smooth animations)
- Completion animations (subtle checkmark, progress bar fill animation—NO confetti)
- Continue where you left off (homepage "resume" widget)
- Contextual navigation (floating TOC for long lessons, breadcrumbs, "you are here" indicators)
- Smart defaults (auto-open current section, remember position, default to next action)

**Explicitly reject (anti-features):**
- Heavy gamification (user rejected XP, badges, leaderboards, streaks)
- Social features (no comments, forums, sharing—single-player focused)
- Notification spam (only critical: quiz results, major achievements)
- Auto-play content (user-initiated navigation only)
- Distracting animations (no auto-playing, spinning, bouncing elements)

### Architecture Approach

Standard hierarchical component architecture with three layers: Design Foundation (tokens/primitives), UI Components (navigation, progress, cards), and Page Compositions. This is the established pattern for educational platforms and scales well.

**Major components:**
1. **Design Foundation** — CSS custom properties (tokens) for colors, spacing, typography, shadows. Semantic naming enables light/dark theming without component changes. 8px base unit (Coursera-like generous whitespace).
2. **Progress Components** — Three variants for different data types: ProgressBar (0-100% for courses), ProgressRing (X/Y lessons for modules), Checkmark (binary done/not done for lessons). Uses ARIA labels and live regions for accessibility.
3. **Navigation Components** — Compound component pattern for CourseNavigator (sidebar + progress + checkmarks). Breadcrumb for mobile. Collapsible sidebar with desktop sticky positioning, mobile fixed overlay. Active state visible in both collapsed/expanded modes.
4. **Card Components** — CourseCard, LessonCard, SurahCard, ResourceCard. All consume foundation components (Card, Badge) and progress components. CSS Grid with auto-fit/minmax for responsive layouts without explicit breakpoints.
5. **Composite Components** — DashboardGrid, LessonView, QuizInterface. Orchestrate multiple primitives. Encode common patterns to reduce duplication in page layouts.
6. **Layouts** — BaseLayout (HTML shell), LessonLayout (sidebar + content), QuizLayout (focused), SurahLayout (cards). Two-column CSS Grid for desktop, single-column for mobile with sidebar overlay.

**Critical pattern: Token-driven design system**
Three-tier token hierarchy (foundation → semantic → component) enables theme switching and ensures consistency. All visual values flow from tokens—no hardcoded colors/spacing in components.

**Critical pattern: Bottom-up build order**
Foundation → Progress → Primitives → Cards → Navigation → Composites → Layouts → Pages. This minimizes rework by building dependencies before consumers. Top-down (pages first) requires stubbing and rebuilding.

### Critical Pitfalls

Research identified 10 critical pitfalls specific to Arabic/RTL educational content. Top 5 by severity:

1. **Font file corruption during redesign** — Custom Arabic fonts (UthmanicHafs, Amiri) accidentally deleted or CSS references broken during restructuring. Prevention: Protected `/public/fonts/` directory, pre-commit hooks verifying font files, font verification test suite. Address in Phase 1 (Foundation).

2. **RTL layout breaking with CSS Flexbox/Grid** — New card layouts and sidebar fail to mirror in RTL mode. Elements remain left-aligned. Prevention: Use CSS logical properties (`margin-inline-start` not `margin-left`), test every component in RTL from start, PostCSS RTL plugin. Address in Phase 2 (Component Foundation).

3. **Arabic text word-break on responsive cards** — `word-break: break-word` destroys Arabic readability by breaking connected letters mid-word. Prevention: Use `overflow-wrap: break-word` instead, scope `word-break` to `[lang="en"]` only, test with actual Arabic content. Address in Phase 3 (Card Layout).

4. **Dark mode contrast failure with Arabic typography** — Arabic fonts lose readability in dark mode due to intricate letterforms requiring higher contrast. Prevention: Increase font weight in dark mode (500 vs 400), ensure 7:1 contrast ratio (WCAG AAA), increase line-height by 0.1-0.2em. Address in Phase 4 (Dark Mode).

5. **Progress tracking state loss during navigation** — Progress bars reset when navigating between lessons. Prevention: Centralized state management (Zustand, Nanostores), stable lesson identifiers (not index-based), persist on every state change, handle localStorage quota errors. Address in Phase 5 (Progress System).

**Additional critical pitfalls:**
- Mobile font size too small for Arabic on iOS (18px minimum required)
- Breadcrumb navigation breaking lesson hierarchy (61 lessons need correct paths)
- Collapsible sidebar hiding active lesson indicator (must be visible in both states)
- Font loading performance in Capacitor mobile app (2-5 second FOIT)
- Screen reader announcing progress bars incorrectly (ARIA labels and live regions required)

## Implications for Roadmap

Based on combined research, recommended 8-phase structure with clear dependencies:

### Phase 1: Design Foundation & Font Protection
**Rationale:** All components depend on design tokens. Arabic font preservation is critical—must be protected before any restructuring begins.

**Delivers:**
- CSS token system (colors, spacing, typography, shadows) with semantic naming
- Tailwind 4 configuration with custom tokens
- Protected font files with verification test suite
- Base typography styles preserving UthmanicHafs and Amiri fonts
- Light/dark theme foundation

**Addresses:**
- Pitfall #1 (font corruption) — pre-commit hooks, protected directories
- Foundation for all future phases — no hardcoded visual values

**Validation criteria:**
- All 4 font families render correctly (UthmanicHafs, Amiri regular/bold)
- Design tokens apply in plain HTML
- Light/dark mode switching works
- Arabic fonts unchanged from original

**Research flag:** SKIP RESEARCH — design tokens are well-documented patterns (Material Design 3, Contentful guides)

---

### Phase 2: Progress & Primitive Components (RTL-first)
**Rationale:** Progress visualization is core to Coursera-like UI. Primitive components (Button, Badge, Card, Container) are building blocks. Must implement RTL support from the start, not retrofit later.

**Delivers:**
- ProgressBar component (horizontal, 0-100%)
- ProgressRing component (circular, X/Y format)
- LessonCheckmark component (boolean completion)
- Button, Badge, Card, Container primitives
- All components using CSS logical properties for RTL

**Addresses:**
- Progress tracking (table stakes feature from FEATURES.md)
- Pitfall #2 (RTL layout) — logical properties, tested in both LTR/RTL

**Validation criteria:**
- Each component renders in isolation
- Uses only design tokens (no hardcoded colors)
- ARIA labels for accessibility
- All components work correctly in `dir="rtl"` mode
- Icons (arrows, chevrons) mirror correctly in RTL

**Research flag:** SKIP RESEARCH — standard component patterns with RTL considerations documented in 7 sources

---

### Phase 3: Card Components & Arabic Typography
**Rationale:** Cards consume primitives and progress components. Needed by all dashboard pages. Must handle Arabic text overflow correctly.

**Delivers:**
- CourseCard (uses Card, Badge, ProgressBar)
- LessonCard (uses Card, Checkmark)
- SurahCard (uses Card, Badge)
- ResourceCard (uses Card)
- DashboardGrid composite for responsive layouts

**Addresses:**
- Card-based layouts (table stakes feature)
- Pitfall #3 (Arabic word-break) — correct overflow handling
- Module overview cards (differentiator feature)

**Validation criteria:**
- Cards display in responsive grid (1-3 columns)
- Arabic lesson titles don't break mid-word on mobile
- `overflow-wrap` used instead of `word-break`
- Hover states functional
- Dark mode works

**Research flag:** SKIP RESEARCH — card patterns established, Arabic overflow solutions documented

---

### Phase 4: Dark Mode Polish & Arabic Contrast
**Rationale:** Basic dark mode exists, but research shows Arabic typography requires special treatment. Must ensure readability before building navigation (which shows Arabic lesson titles).

**Delivers:**
- Dark mode refinement for all components
- Arabic font weight adjustments in dark mode
- 7:1 contrast ratio for Arabic text (WCAG AAA)
- Line-height increases for Arabic in dark mode
- Color token overrides for dark theme

**Addresses:**
- Pitfall #4 (dark mode contrast) — font weight, contrast, line-height adjustments
- Dark mode polish (differentiator feature)

**Validation criteria:**
- WCAG AAA contrast for Arabic body text (7:1 minimum)
- Arabic diacritical marks visible in dark mode
- Uthmanichafs font readable without eye strain
- All cards, progress indicators, navigation work in dark mode

**Research flag:** SKIP RESEARCH — dark mode typography documented, WCAG guidelines clear

---

### Phase 5: Navigation System & Breadcrumbs
**Rationale:** Navigation is complex and affects entire site. Requires understanding of lesson hierarchy (all 61 lessons). Benefits from seeing cards/progress in context first.

**Delivers:**
- CourseNavigator sidebar (compound component with progress, checkmarks)
- Collapsible sidebar (desktop sticky, mobile overlay)
- Breadcrumb component with correct hierarchy for all 61 lessons
- Header/Footer updates (cleaner, minimal)
- Active lesson indicators for both collapsed/expanded sidebar states

**Addresses:**
- Persistent navigation (table stakes)
- Collapsible module sections (differentiator)
- Contextual navigation (differentiator)
- Pitfall #7 (breadcrumb hierarchy) — correct paths from lesson metadata
- Pitfall #8 (collapsed sidebar UX) — active indicators in both states

**Validation criteria:**
- Navigation works across all pages
- Breadcrumbs match sidebar structure exactly
- Sidebar collapses on mobile (<1024px) to fixed overlay
- Active lesson visible in both collapsed/expanded states
- Keyboard navigation works (Tab, Enter, Escape, Arrow keys)
- RTL mode breadcrumbs reverse correctly (< not >)

**Research flag:** MAY NEED RESEARCH — need to verify lesson hierarchy structure in existing 61 MDX files. If complex, run `/gsd:research-phase 5` to audit lesson relationships.

---

### Phase 6: Progress Tracking & State Management
**Rationale:** Progress features depend on navigation existing (can't track what you can't navigate). State management prevents data loss discovered in pitfall research.

**Delivers:**
- Centralized state management (Zustand or Nanostores)
- Progress persistence to localStorage with quota error handling
- Lesson completion tracking with optimistic UI updates
- "Continue where you left off" widget
- Estimated time remaining calculations
- Visual progress indicators integrated into navigation

**Addresses:**
- Lesson completion tracking (table stakes)
- Continue where you left off (differentiator)
- Estimated time remaining (differentiator)
- Pitfall #5 (progress state loss) — stable identifiers, centralized state

**Validation criteria:**
- Progress survives page refresh
- Browser back/forward don't reset progress
- Progress syncs across multiple tabs
- localStorage quota exceeded handled gracefully
- Completion checkmarks persist in sidebar
- "Mark complete" button shows immediate feedback

**Research flag:** SKIP RESEARCH — state management patterns well-documented, localStorage APIs standard

---

### Phase 7: Mobile Optimization & Font Sizing
**Rationale:** Desktop experience complete, now optimize for mobile. Arabic text requires special font sizing on iOS (research shows 18px minimum).

**Delivers:**
- Mobile-first responsive refinements
- iOS-specific Arabic font sizing (18px base minimum)
- Touch-friendly interactions (44px minimum targets)
- Mobile sidebar overlay with swipe gestures
- Responsive images in MDX content
- Mobile-optimized quiz interface

**Addresses:**
- Responsive mobile design (table stakes)
- Pitfall #6 (mobile font size) — iOS-specific adjustments, test on devices
- Smart defaults (differentiator) — remember sidebar state, resume position

**Validation criteria:**
- Arabic text readable at 18px+ on iOS devices (test on iPhone, not simulator)
- All touch targets 44px minimum
- Sidebar overlay works with swipe gestures
- No horizontal scrolling on 320px width
- Images responsive in MDX content
- Lighthouse mobile score >90

**Research flag:** SKIP RESEARCH — responsive design patterns established, iOS font rendering documented

---

### Phase 8: Performance & Accessibility Audit
**Rationale:** All features complete, final polish for production readiness. Font loading performance critical for Capacitor mobile app.

**Delivers:**
- Font loading optimization (preload, subset, bundle with Capacitor)
- Screen reader support (NVDA, JAWS, VoiceOver)
- ARIA labels and live regions for all interactive elements
- Keyboard navigation complete (Tab, Escape, Arrow keys)
- Completion animations (subtle, purposeful)
- Performance optimization (target <50KB JS, <2s mobile launch)

**Addresses:**
- Accessibility features (differentiator)
- Completion animations (differentiator)
- Pitfall #9 (font loading performance) — bundle fonts, preload critical fonts
- Pitfall #10 (screen reader issues) — ARIA labels, live regions, test with NVDA

**Validation criteria:**
- NVDA/JAWS announce all interactive elements correctly
- Progress state changes announced via aria-live
- RTL mode screen reader announcements correct
- Capacitor app launches <2s on mobile
- No FOIT (Flash of Invisible Text)
- Lighthouse accessibility score 100
- Total JavaScript <50KB

**Research flag:** SKIP RESEARCH — accessibility standards (WCAG 2.1 AA) well-documented, performance metrics clear

---

### Phase Ordering Rationale

**Why this order:**
1. Foundation first because all components depend on tokens
2. Progress/primitives before cards because cards consume them
3. Cards before navigation because navigation displays cards
4. Dark mode before navigation to ensure Arabic readability in lesson titles
5. Navigation before progress tracking because tracking needs navigation context
6. Mobile optimization after desktop because it's refinement, not new features
7. Performance/accessibility last because it's polish on complete features

**Dependency chain:**
```
Foundation (tokens)
    ↓
Progress + Primitives (building blocks)
    ↓
Cards (consume primitives + progress)
    ↓
Dark Mode (ensure readability before showing lots of text)
    ↓
Navigation (shows cards + progress, requires dark mode tested)
    ↓
Progress Tracking (requires navigation to exist)
    ↓
Mobile Optimization (refinement of existing features)
    ↓
Performance/Accessibility (final polish)
```

**How this avoids pitfalls:**
- Font protection in Phase 1 prevents Pitfall #1 throughout project
- RTL-first in Phase 2 prevents Pitfall #2 from ever occurring
- Arabic overflow handling in Phase 3 prevents Pitfall #3
- Dark mode testing in Phase 4 prevents Pitfall #4
- State management in Phase 6 prevents Pitfall #5
- Mobile testing in Phase 7 catches Pitfall #6
- Navigation audit in Phase 5 prevents Pitfall #7 and #8
- Performance focus in Phase 8 prevents Pitfall #9 and #10

### Research Flags

**Phases needing potential research:**
- **Phase 5 (Navigation):** May need `/gsd:research-phase 5` if lesson hierarchy is complex. Research required to audit all 61 MDX files and extract parent-child relationships for breadcrumb generation. If lessons have explicit `parent` frontmatter, skip research. If hierarchy must be inferred, research needed.

**Phases with standard patterns (skip research):**
- **Phase 1:** Design tokens are well-documented (Material Design 3, Contentful guides)
- **Phase 2:** Component patterns established, RTL considerations documented in 7 sources
- **Phase 3:** Card layouts standard, Arabic overflow solutions documented
- **Phase 4:** Dark mode typography documented, WCAG guidelines clear
- **Phase 6:** State management patterns (Zustand/Nanostores) well-documented
- **Phase 7:** Responsive design established, iOS font rendering documented
- **Phase 8:** Accessibility standards (WCAG 2.1 AA) and performance metrics clear

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Current stack (Astro 5, Tailwind 4, TS) optimal. Additions (daisyUI, Motion) verified with official docs. Version numbers confirmed via WebSearch. Architecture validated against 2025 best practices. |
| Features | MEDIUM | Feature tiers based on training knowledge of MOOCs (Coursera, edX, Udacity, Khan Academy) as of Jan 2025. Patterns are universal and stable (2018-2025), but exact Coursera specifications would require live inspection (not available Feb 2026). Recommendations reflect industry standard, not Coursera-specific. |
| Architecture | HIGH | Component architecture verified with authoritative sources (Astro docs, design system guides, educational platform case studies). Token-driven design, compound components, islands architecture all documented patterns. Bottom-up build order validated against design system best practices. |
| Pitfalls | HIGH (Arabic/RTL), MEDIUM (Educational patterns) | Arabic/RTL pitfalls sourced from 9+ specialized guides (Reffine, Hapy, RTLStyling, W3C). Font corruption, word-break, dark mode contrast all documented issues. Educational UX pitfalls based on training knowledge of established patterns (progressive disclosure, breadcrumb best practices, screen reader support). Coursera-specific patterns inferred from industry standard. |

**Overall confidence:** HIGH

Research synthesized from 80+ authoritative sources across 4 domains:
- Stack recommendations verified with official documentation (Astro, Tailwind, daisyUI)
- Arabic/RTL patterns sourced from W3C standards and specialized guides
- Accessibility requirements based on WCAG 2.1 AA and screen reader testing guides
- Educational UI patterns reflect industry consensus (MOOCs, e-learning platforms)

### Gaps to Address

**During Phase 5 (Navigation):**
- Verify actual lesson hierarchy in existing 61 MDX files. If frontmatter lacks explicit `parent` or `category` fields, will need to audit and add metadata before building breadcrumbs. Consider running `/gsd:research-phase 5` to extract and document hierarchy structure.

**During Phase 6 (Progress Tracking):**
- Determine if progress should sync to Supabase database or remain localStorage-only. Research focused on localStorage patterns; if backend sync required, will need to design Supabase schema and API during phase planning.

**During Phase 7 (Mobile):**
- Test on actual iOS devices (iPhone, iPad) early in phase. iOS Safari and WKWebView render Arabic fonts differently than Android. Simulator testing insufficient—must validate 18px minimum font size on real hardware.

**During Phase 8 (Accessibility):**
- Test with NVDA screen reader (free, most popular) in addition to VoiceOver (Mac/iOS default). NVDA adheres strictly to DOM and accessibility tree, catching structural issues VoiceOver may miss. Both required for comprehensive accessibility audit.

**If requirements change:**
- Research assumed no social features, no gamification (per user preferences). If requirements add forums, leaderboards, badges, etc., will need additional research for those specific features.
- Research assumed Capacitor mobile app deployment. If deploying as PWA instead, will need to research service worker strategies and offline font caching.

## Sources

### Primary (HIGH confidence)

**Stack & Frameworks:**
- [Astro 5.x Official Documentation](https://docs.astro.build/) — View Transitions, Islands architecture
- [Tailwind CSS v4 Official Blog](https://tailwindcss.com/blog/tailwindcss-v4) — Container queries, CSS-first config
- [daisyUI Astro Component Library](https://daisyui.com/astro-component-library/) — Tailwind 4 compatibility
- [Motion - JavaScript Animation Library](https://motion.dev) — Web Animations API, React wrapper
- [Lucide Astro Documentation](https://lucide.dev/guide/packages/lucide-astro) — Official Astro icons

**Arabic/RTL Design:**
- [W3C: Structural markup and right-to-left text in HTML](https://www.w3.org/International/questions/qa-html-dir) — Official HTML `dir` attribute guidance
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/) — CSS logical properties for RTL
- [Right-to-left development: Tips and tricks](https://globaldev.tech/blog/right-left-development-tips-and-tricks) — Practical RTL implementation
- [Reffine: RTL websites design and development best practices](https://www.reffine.com/en/blog/rtl-website-design-and-development-mistakes-best-practices) — Arabic word-break, punctuation
- [Hapy: Arabic Website Design Basics](https://hapy.co/journal/arabic-website-design-basics/) — Font sizing, mobile considerations

**Design System Foundations:**
- [Design tokens – Material Design 3](https://m3.material.io/foundations/design-tokens) — Three-tier token system
- [Contentful: Design token system](https://www.contentful.com/blog/design-token-system/) — Semantic naming patterns
- [Figr: Creating the Foundations with Design Tokens](https://figr.design/blog/design-system-introducing-design-tokens) — Token hierarchy

**Accessibility:**
- [WCAG 2.1 Level AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) — Contrast ratios, ARIA requirements
- [WebAIM: Screen Reader User Survey #10](https://webaim.org/projects/screenreadersurvey10/) — NVDA usage statistics
- [UXPin: NVDA vs JAWS Screen Reader Testing](https://www.uxpin.com/studio/blog/nvda-vs-jaws-screen-reader-testing-comparison/) — Testing strategies

### Secondary (MEDIUM confidence)

**Educational UI Patterns:**
- [Coursera UX Case Study](https://medium.com/@gretus/ui-ux-case-study-coursera-app-redesign-to-enhance-learner-retention-0b24386039d0) — Card layouts, progress visualization
- [Compass: Tailwind course starter kit](https://tailwindcss.com/blog/2025-05-14-compass-course-starter-kit) — Educational layout patterns
- [Justinmind: E-learning platform design guide](https://www.justinmind.com/ui-design/how-to-design-e-learning-platform) — Dashboard architecture
- [Eleken: eLearning Interface Design Examples](https://www.eleken.co/blog-posts/elearning-interface-design-examples) — Navigation patterns

**Arabic Typography:**
- [HackerNoon: Font trends across 73 Arabic websites](https://hackernoon.com/results-font-image-usage-and-performance-trends-across-73-arabic-websites) — Font file optimization
- [Code Guru: Best Arabic Script for the web](https://codeguru.ae/blog/fonts-and-readability-best-arabic-script-for-the-web/) — Font selection
- [Arabic for Nerds: Enlarge Arabic Fonts in Browser](https://arabic-for-nerds.com/tools/arabic-letters-too-small-in-browser/) — iOS rendering issues

**Performance & Mobile:**
- [Next Native: Improve Mobile App Performance in Capacitor](https://nextnative.dev/blog/improve-mobile-app-performance) — Font bundling, memory optimization
- [Capgo: Build Next.js Mobile App with Capacitor](https://capgo.app/blog/nextjs-mobile-app-capacitor-from-scratch/) — WKWebView considerations

**Navigation & UX:**
- [Smashing Magazine: Breadcrumbs Best Practices](https://www.smashingmagazine.com/2009/03/breadcrumbs-in-web-design-examples-and-best-practices/) — Hierarchy visualization
- [NN/g: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) — Collapsible navigation patterns
- [Navbar Gallery: Best Sidebar Menu Design 2025](https://www.navbar.gallery/blog/best-side-bar-navigation-menu-design-examples) — Sidebar UX

### Tertiary (LOW confidence, needs validation)

**Dark Mode Typography:**
- [Design Shack: Typography in Dark Mode](https://designshack.net/articles/typography/dark-mode-typography/) — Font weight recommendations (not Arabic-specific, applied by inference)

**Coursera-Specific Patterns:**
- Training knowledge of Coursera interface (as of Jan 2025) — Spacing scales (8px base unit), color palette (#0056D2 primary), typography scales (2.5-3rem H1). Exact specifications may have changed since training cutoff. Recommend visual inspection during implementation.

---

*Research completed: 2026-02-05*
*Ready for roadmap: YES*
*Next step: Requirements definition → Roadmap creation*
