# Quran Learn UI/UX Redesign

## What This Is

A Coursera-inspired redesign of the Quran Learn educational website that teaches Quranic Arabic grammar. The platform features a complete design system, component library with RTL support, collapsible navigation, progress tracking, and WCAG AAA accessible dark mode — all built on Astro 5.x with TypeScript and Tailwind CSS 4.x.

## Core Value

**Make learning Quranic Arabic grammar accessible and engaging through beautiful, intuitive design.** If everything else fails, the Arabic text must render correctly and the learning content must remain clear and navigable.

## Requirements

### Validated

- DESIGN-01: Design system with Coursera-like spacing, typography, and visual hierarchy — v1
- DESIGN-02: Clean progress visualization (horizontal bars, circular rings, checkmarks) — v1
- NAV-01: Collapsible course navigator sidebar with lesson checkmarks — v1
- NAV-02: Breadcrumb navigation throughout the site — v1
- HOME-01: Hero section with inspiring value proposition — v1
- HOME-02: Featured content cards with progress indicators — v1
- LEARN-01: Module-based learn dashboard with level progress — v1
- LEARN-02: Lesson pages with proper reading width and floating navigator — v1
- SURAH-01: Card-based surah selector with difficulty badges — v1
- RESOURCE-01: Visual cards for reference materials — v1
- QUIZ-01: Clean, focused quiz experience with clear feedback — v1
- COMP-01: Updated Header component (cleaner, more minimal) — v1
- COMP-02: Updated Footer component (simplified) — v1
- RESP-01: Mobile-first responsive design across all pages — v1
- DARK-01: Polished dark mode with proper contrast (7:1 ratio for Arabic text) — v1

*Existing capabilities preserved:*
- Arabic font rendering (UthmanicHafs for Quranic text, Amiri family for general Arabic) — existing
- 73 grammar lessons across 5 progressive levels — existing
- Surah breakdowns with word-by-word grammatical analysis — existing
- 6 reference resources (glossary, verb tables, charts) — existing
- 5 level-based quizzes with scoring — existing
- User authentication via Supabase (email/password, Google OAuth) — existing
- Lesson completion and quiz score tracking — existing
- Dark mode support — existing
- Mobile app support via Capacitor — existing

### Active

**Current Milestone: v1.1 Lesson Content**

**Goal:** Fill all 73 lesson MDX files and 6 resource pages with real Arabic grammar content based on classical nahw/sarf, using Quranic verse examples.

**Target features:**
- 73 textbook-style grammar lessons across 5 levels (Foundation → Applied Study)
- Classical Arabic grammar (nahw/sarf) applied to Quranic verses
- Each lesson: concept explanation → Arabic examples with translation → grammar rule → exercises
- Claude-selected pedagogically appropriate Quranic verse examples
- 6 reference resources: glossary, verb tables, pronoun charts, case endings, root system, 200 common words
- Content collection schema (content.config.ts) for lesson/resource validation

### Out of Scope

- Gamification features (streaks, XP, badges, leaderboards) — user explicitly wants minimal tracking only
- New lesson content — focusing on UI/UX only, content stays as-is
- Backend changes — Supabase integration stays as-is
- Mobile app redesign — Capacitor builds from same web code
- i18n/localization — keeping English UI with Arabic content

## Context

**Current state:** Shipped v1 UI/UX redesign with ~10,771 LOC across Astro, TypeScript, CSS, and MDX.

**Tech stack:** Astro 5.x, Tailwind CSS 4.x, TypeScript, MDX, Supabase, Capacitor.

**Production metrics:** Lighthouse accessibility 100, performance 99-100, 14KB JS bundle.

**Known items for future work:**
- 73 lesson MDX files need actual Arabic grammar content (currently empty/placeholder)
- auth.ts, progress.ts, capacitor-init.ts are stubs needing real implementation
- Resource MDX content files are placeholders
- Real iOS device testing recommended before production
- Supabase progress sync (currently localStorage-only)

**Claude's role:** Act as a master linguist in the Quran and an experienced teacher with decades of experience. Ensure educational integrity while improving UX.

## Constraints

- **Tech stack**: Must remain Astro 5.x + Tailwind CSS + TypeScript — no framework changes
- **Content format**: MDX files must not be restructured — only styling changes
- **Arabic fonts**: Font files and CSS configuration must be preserved exactly
- **Supabase schema**: Database tables (user_progress, quiz_scores) must not change
- **Mobile compatibility**: Changes must work with Capacitor builds
- **Performance**: Static site generation must be maintained (no SSR requirements)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Minimal gamification | User prefers clean, educational focus over game-like elements | Good |
| All Coursera UX features | Progress viz, clean design, and navigation are all important | Good |
| Preserve existing content | Focus on UI/UX layer only, not content restructuring | Good |
| WCAG AAA (7:1 contrast) | Superior accessibility for Arabic text with diacritical marks | Good |
| CSS logical properties | Universal RTL support without separate RTL stylesheet | Good |
| Dark mode via data-theme | Avoids Tailwind dark: class proliferation, cleaner token system | Good |
| localStorage progress | Simple MVP approach, Supabase sync deferred | Good — sufficient for MVP |
| 70ch reading width | Optimal comprehension within 60-75ch research range | Good |
| aria-live="polite" only | Per Adrian Roselli 2026 research, never assertive | Good |
| Font preload critical only | Only Amiri Regular Arabic + UthmanicHafs, others on-demand | Good |
| 44px touch targets | Exceeds WCAG 2.5.8 minimum (24px), meets iOS HIG | Good |

---
*Last updated: 2026-02-06 after v1.1 milestone start*
