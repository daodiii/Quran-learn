# Quran Learn UI/UX Redesign

## What This Is

A Coursera-inspired redesign of the Quran Learn educational website that teaches Quranic Arabic grammar. The redesign focuses on creating a clean, engaging, and distraction-free learning experience while preserving the existing curriculum content (61 lessons, surahs, and resources) and Arabic typography.

## Core Value

**Make learning Quranic Arabic grammar accessible and engaging through beautiful, intuitive design.** If everything else fails, the Arabic text must render correctly and the learning content must remain clear and navigable.

## Requirements

### Validated

*Existing capabilities that must be preserved:*

- Arabic font rendering (UthmanicHafs for Quranic text, Amiri family for general Arabic) — existing
- 61 grammar lessons across 5 progressive levels — existing
- Surah breakdowns with word-by-word grammatical analysis — existing
- 6 reference resources (glossary, verb tables, charts) — existing
- 5 level-based quizzes with scoring — existing
- User authentication via Supabase (email/password, Google OAuth) — existing
- Lesson completion and quiz score tracking — existing
- Dark mode support — existing
- Mobile app support via Capacitor — existing

### Active

*UI/UX redesign requirements:*

- [ ] **DESIGN-01**: Design system with Coursera-like spacing, typography, and visual hierarchy
- [ ] **DESIGN-02**: Clean progress visualization (horizontal bars, circular rings, checkmarks)
- [ ] **NAV-01**: Collapsible course navigator sidebar with lesson checkmarks
- [ ] **NAV-02**: Breadcrumb navigation throughout the site
- [ ] **HOME-01**: Hero section with inspiring value proposition
- [ ] **HOME-02**: Featured content cards with progress indicators
- [ ] **LEARN-01**: Module-based learn dashboard with level progress
- [ ] **LEARN-02**: Lesson pages with proper reading width and floating navigator
- [ ] **SURAH-01**: Card-based surah selector with difficulty badges
- [ ] **RESOURCE-01**: Visual cards for reference materials
- [ ] **QUIZ-01**: Clean, focused quiz experience with clear feedback
- [ ] **COMP-01**: Updated Header component (cleaner, more minimal)
- [ ] **COMP-02**: Updated Footer component (simplified)
- [ ] **RESP-01**: Mobile-first responsive design across all pages
- [ ] **DARK-01**: Polished dark mode with proper contrast

### Out of Scope

- Gamification features (streaks, XP, badges, leaderboards) — user explicitly wants minimal tracking only
- New lesson content — focusing on UI/UX only, content stays as-is
- Backend changes — Supabase integration stays as-is
- Mobile app redesign — Capacitor builds from same web code
- i18n/localization — keeping English UI with Arabic content

## Context

**Existing codebase:** Astro 5.x static site with TypeScript, Tailwind CSS 4.x, and MDX content. See `.planning/codebase/` for detailed analysis.

**Target inspiration:** Coursera's course interface — clean visual hierarchy, progress bars, module cards, collapsible navigation, ample whitespace.

**User context:** Learning Quranic Arabic grammar is challenging. The current UI works but doesn't inspire or engage. The redesign should make the journey feel achievable and pleasant.

**Arabic typography:** Critical to preserve exactly. Fonts are self-hosted in `/public/fonts/` with CSS configuration in `src/styles/global.css` lines 201-243. Unicode ranges cover U+0600-06FF and extended Arabic blocks.

**Claude's role:** Act as a master linguist in the Quran and an experienced teacher with decades of experience. Ensure educational integrity while improving UX. Make complex grammar accessible and engaging.

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
| Minimal gamification | User prefers clean, educational focus over game-like elements | — Pending |
| All Coursera UX features | Progress viz, clean design, and navigation are all important | — Pending |
| Preserve existing content | Focus on UI/UX layer only, not content restructuring | — Pending |

---
*Last updated: 2026-02-05 after initialization*
