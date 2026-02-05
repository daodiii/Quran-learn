# Requirements: Quran Learn UI/UX Redesign

**Defined:** 2026-02-05
**Core Value:** Make learning Quranic Arabic grammar accessible and engaging through beautiful, intuitive design

## v1 Requirements

Requirements for the Coursera-inspired redesign. Each maps to roadmap phases.

### Design Foundation

- [ ] **DESIGN-01**: Design system with Coursera-like spacing, typography, and visual hierarchy
- [ ] **DESIGN-02**: Clean progress visualization (horizontal bars, circular rings, checkmarks)

### Navigation

- [ ] **NAV-01**: Collapsible course navigator sidebar with lesson checkmarks
- [ ] **NAV-02**: Breadcrumb navigation throughout the site

### Home Page

- [ ] **HOME-01**: Hero section with inspiring value proposition
- [ ] **HOME-02**: Featured content cards with progress indicators

### Learn Section

- [ ] **LEARN-01**: Module-based learn dashboard with level progress
- [ ] **LEARN-02**: Lesson pages with proper reading width and floating navigator

### Surah Section

- [ ] **SURAH-01**: Card-based surah selector with difficulty badges

### Resources

- [ ] **RESOURCE-01**: Visual cards for reference materials

### Quiz

- [ ] **QUIZ-01**: Clean, focused quiz experience with clear feedback

### Components

- [ ] **COMP-01**: Updated Header component (cleaner, more minimal)
- [ ] **COMP-02**: Updated Footer component (simplified)

### Responsive & Polish

- [ ] **RESP-01**: Mobile-first responsive design across all pages
- [ ] **DARK-01**: Polished dark mode with proper contrast (7:1 ratio for Arabic text)

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

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DESIGN-01 | Phase 1 | Complete |
| DESIGN-02 | Phase 2 | Pending |
| NAV-01 | Phase 5 | Pending |
| NAV-02 | Phase 5 | Pending |
| HOME-01 | Phase 6 | Pending |
| HOME-02 | Phase 6 | Pending |
| LEARN-01 | Phase 6 | Pending |
| LEARN-02 | Phase 6 | Pending |
| SURAH-01 | Phase 6 | Pending |
| RESOURCE-01 | Phase 6 | Pending |
| QUIZ-01 | Phase 6 | Pending |
| COMP-01 | Phase 5 | Pending |
| COMP-02 | Phase 5 | Pending |
| RESP-01 | Phase 7 | Pending |
| DARK-01 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-05*
*Last updated: 2026-02-05 after roadmap creation*
