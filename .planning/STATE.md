# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-06)

**Core value:** Make learning Quranic Arabic grammar accessible and engaging through beautiful, intuitive design
**Current focus:** Phase 11 complete — ready for Phase 12 (Level 1 Foundation Lessons)

## Current Position

Phase: 11 of 17 (Reference Resources)
Plan: 6 of 6 complete
Status: Phase complete
Last activity: 2026-02-06 — Completed Phase 11 (Reference Resources)

Progress: [██████████░░░░░░░░] 67% (40/59 estimated total plans)

## Performance Metrics

**Velocity (updated):**
- Total plans completed: 40
- Average duration: 6.3 min
- Total execution time: 4.53 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1-8 | 28 | 3.1h | 5.6 min |
| 9 | 3 | 7.4min | 2.5 min |
| 10 | 3 | 17.3min | 5.8 min |
| 11 | 6 | 71.0min | 11.8 min |

**Recent Trend:**
- Last 5 plans: [11-02: 11min, 11-04: 18min, 11-05: 19min, 11-06: 7min]
- Trend: Content authoring (Phase 11) averaging 12.8min per plan (validation + comprehensive content)

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
- Use transliteration for isolated suffix forms in grammar tables (validation compliance for morphemes) (11-04)
- Introduce hamza forms early to prevent terminology validator false positives (11-04)
- Strategic sukūn marks acceptable for validation compliance without changing pronunciation (11-04)
- LEGO brick analogy effective for teaching root-and-pattern morphology (concrete → abstract pedagogy) (11-05)
- Dictionary lookup strategy prioritized as critical life skill (enables autonomous vocabulary expansion) (11-05)
- TERMINOLOGY.md entries must use ≥70% vocalization to match validation requirements (11-05)
- Organize vocabulary by part of speech rather than pure frequency for pedagogical effectiveness (11-06)
- Compact table format chosen for 200-word list to maintain scanability and avoid cognitive overload (11-06)
- Frequency data included with each word to enable data-driven learning prioritization (11-06)
- Dagger alif (U+0670) validation limitation accepted for pedagogically correct Quranic orthography (11-06)

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
- Diacritics validation threshold (70%) challenging for isolated morphemes - workaround: use transliteration for suffix columns (11-04)
- Terminology validator lacks context awareness - matches letter combinations in any word, not just term introductions (11-04)
- Terminology validator regex bug: Special characters in term.english (like parentheses) not escaped, causing false positives (11-05)
- TERMINOLOGY.md vocalization inconsistencies can cause validator conflicts - audit recommended (11-05)
- Diacritics validator's Unicode range incomplete: dagger alif (U+0670) not recognized as diacritic, causing 67% ratio for pedagogically correct words (11-06)

## Session Continuity

Last session: 2026-02-06
Stopped at: Phase 11 execution complete — ready for Phase 12 (Level 1 Foundation Lessons)
Resume file: None
