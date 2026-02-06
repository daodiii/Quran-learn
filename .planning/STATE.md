# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-06)

**Core value:** Make learning Quranic Arabic grammar accessible and engaging through beautiful, intuitive design
**Current focus:** Phase 10 complete — ready for Phase 11 (Reference Resources)

## Current Position

Phase: 11 of 17 (Reference Resources)
Plan: 2 of 6 complete
Status: In progress
Last activity: 2026-02-06 — Completed 11-02-PLAN.md (Case Endings Chart)

Progress: [████████░░░░░░░░░░] 61% (36/59 estimated total plans)

## Performance Metrics

**Velocity (updated):**
- Total plans completed: 36
- Average duration: 5.3 min
- Total execution time: 3.80 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1-8 | 28 | 3.1h | 5.6 min |
| 9 | 3 | 7.4min | 2.5 min |
| 10 | 3 | 17.3min | 5.8 min |
| 11 | 2 | 20.0min | 10.0 min |

**Recent Trend:**
- Last 5 plans: [10-02: 7min, 10-03: 5.3min, 11-01: 9min, 11-02: 11min]
- Trend: Content authoring (Phase 11) averaging 10min per plan

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.

Recent decisions affecting v1.1 work:
- Plain English + analogies — grammar content must be easy to understand
- Bilingual terminology — always show both English and Arabic terms
- Example-heavy pedagogy — show patterns before stating abstract rules
- One concept per lesson — avoid cognitive overload with 73 focused lessons
- Use glob() loaders for content collections (Astro v5 pattern)
- Position content.config.ts at src/ root (Astro v5 requirement)
- Arabic text must always have letter-spacing: 0 to prevent letter disconnection (09-02)
- Use 'rule' type instead of 'caution' for Callout — more relevant for grammar lessons (09-02)
- Inline SVG icons for consistent cross-platform rendering instead of emoji (09-02)
- Use data-label attributes for mobile responsive table card stacking (09-03)
- ExerciseBox is the only MDX component requiring client-side JavaScript (09-03)
- 73 lessons across 5 levels following classical nahw/sarf pedagogy (10-01)
- Progressive transliteration reduction: full (L1) → balanced (L2) → partial (L3) → minimal (L4-5) (10-01)
- Lesson ID format: L{level}.{order} with forward-only prerequisite dependencies (10-01)
- Use simplified ALA-LC transliteration (reader-friendly, not linguistic precision) (10-02)
- Graduated transliteration rules by level (full→partial→minimal) (10-02)
- Every Arabic letter must have tashkeel (validation enforced) (10-02)
- Verse reference format: [Surah Name Chapter:Verse] (10-02)
- First-mention bilingual format for all grammar terms (10-02)
- letter-spacing: 0 for all Arabic text (prevents disconnection) (10-02)
- Validation scripts use Node.js built-ins only for speed and portability (10-03)
- Diacritics threshold set at 70% ratio to allow natural Arabic orthography (10-03)
- Verse lookup is build-time helper, not runtime API (content frozen in MDX) (10-03)
- Arabic alphabetical ordering chosen for glossary (matches Arabic dictionary standards) (11-01)
- Single comprehensive glossary preferred over split basic/advanced (unified canonical source) (11-01)
- Progressive disclosure (details/summary) for advanced grammar topics in reference charts (11-02)
- Organize grammar references by pedagogical sequence (singular → dual → plurals) (11-02)
- Summary tables by case type for quick reference lookup (11-02)

### Pending Todos

None.

### Blockers/Concerns

**Carried from v1.0 (deferred to future milestones):**
- iOS device testing skipped — recommended before production
- auth.ts, progress.ts, capacitor-init.ts stubs need real implementation
- Supabase progress sync deferred (localStorage-only for now)

**New for v1.1:**
- Expert validation workflow needs establishment (Arabic linguist + Muslim educator required for content QA)
- Tanzil.net dataset needs download for verse text authoring (build-time helper created, awaiting data)
- Diacritics validation script needs refinement for naturally short words (currently flags correct vocalization on 2-3 letter terms)

## Session Continuity

Last session: 2026-02-06
Stopped at: Completed 11-02-PLAN.md (case endings chart) — continuing Phase 11
Resume file: None
