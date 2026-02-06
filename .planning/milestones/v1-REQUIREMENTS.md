# Requirements Archive: v1 UI/UX Redesign

**Archived:** 2026-02-06
**Status:** SHIPPED

This is the archived requirements specification for v1.
For current requirements, see `.planning/REQUIREMENTS.md` (created for next milestone).

---

# Requirements: Quran Learn UI/UX Redesign

**Defined:** 2026-02-05
**Core Value:** Make learning Quranic Arabic grammar accessible and engaging through beautiful, intuitive design

## v1 Requirements

Requirements for the Coursera-inspired redesign. Each maps to roadmap phases.

### Design Foundation

- [x] **DESIGN-01**: Design system with Coursera-like spacing, typography, and visual hierarchy — *Validated v1, Phase 1*
- [x] **DESIGN-02**: Clean progress visualization (horizontal bars, circular rings, checkmarks) — *Validated v1, Phase 2*

### Navigation

- [x] **NAV-01**: Collapsible course navigator sidebar with lesson checkmarks — *Validated v1, Phase 5*
- [x] **NAV-02**: Breadcrumb navigation throughout the site — *Validated v1, Phase 5*

### Home Page

- [x] **HOME-01**: Hero section with inspiring value proposition — *Validated v1, Phase 6*
- [x] **HOME-02**: Featured content cards with progress indicators — *Validated v1, Phase 6*

### Learn Section

- [x] **LEARN-01**: Module-based learn dashboard with level progress — *Validated v1, Phase 6*
- [x] **LEARN-02**: Lesson pages with proper reading width and floating navigator — *Validated v1, Phase 6*

### Surah Section

- [x] **SURAH-01**: Card-based surah selector with difficulty badges — *Validated v1, Phase 6*

### Resources

- [x] **RESOURCE-01**: Visual cards for reference materials — *Validated v1, Phase 6*

### Quiz

- [x] **QUIZ-01**: Clean, focused quiz experience with clear feedback — *Validated v1, Phase 6*

### Components

- [x] **COMP-01**: Updated Header component (cleaner, more minimal) — *Validated v1, Phase 5*
- [x] **COMP-02**: Updated Footer component (simplified) — *Validated v1, Phase 5*

### Responsive & Polish

- [x] **RESP-01**: Mobile-first responsive design across all pages — *Validated v1, Phase 7*
- [x] **DARK-01**: Polished dark mode with proper contrast (7:1 ratio for Arabic text) — *Validated v1, Phase 4*

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Features

- **SEARCH-01**: Search across lesson titles and content
- **TIME-01**: Estimated time remaining per module/lesson
- **ANIM-01**: Completion animations (checkmark, progress bar fill)

### Advanced Analytics

- **DASH-01**: Detailed progress analytics dashboard
- **QUIZ-02**: Quiz review with detailed explanations

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Gamification (XP, badges, streaks, leaderboards) | User explicitly wants minimal tracking, educational focus |
| Social features (comments, forums, sharing) | Not requested, adds complexity |
| New lesson content | Focusing on UI/UX only, content stays as-is |
| Backend changes | Supabase integration stays as-is |
| Mobile app redesign | Capacitor builds from same web code |
| i18n/localization | Keeping English UI with Arabic content |
| Video content | Storage/bandwidth costs, text-based learning focus |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DESIGN-01 | Phase 1 | Complete |
| DESIGN-02 | Phase 2 | Complete |
| NAV-01 | Phase 5 | Complete |
| NAV-02 | Phase 5 | Complete |
| HOME-01 | Phase 6 | Complete |
| HOME-02 | Phase 6 | Complete |
| LEARN-01 | Phase 6 | Complete |
| LEARN-02 | Phase 6 | Complete |
| SURAH-01 | Phase 6 | Complete |
| RESOURCE-01 | Phase 6 | Complete |
| QUIZ-01 | Phase 6 | Complete |
| COMP-01 | Phase 5 | Complete |
| COMP-02 | Phase 5 | Complete |
| RESP-01 | Phase 7 | Complete |
| DARK-01 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 15 total
- Shipped: 15
- Unmapped: 0

---

## Milestone Summary

**Shipped:** 15 of 15 v1 requirements
**Adjusted:** None — all requirements shipped as originally specified
**Dropped:** None

---
*Archived: 2026-02-06 as part of v1 milestone completion*
