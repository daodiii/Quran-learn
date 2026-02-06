# Requirements: Quran Learn v1.1 Lesson Content

**Defined:** 2026-02-06
**Core Value:** Make learning Quranic Arabic grammar accessible and engaging — Arabic text must render correctly and learning content must remain clear and navigable.

## v1.1 Requirements

Requirements for the Lesson Content milestone. Each maps to roadmap phases.

### Infrastructure

- [x] **INFRA-01**: Content collection schema (`content.config.ts`) with Zod validation for lessons and resources
- [x] **INFRA-02**: ArabicExample component — Quranic verse display with translation, reference, grammar highlight
- [x] **INFRA-03**: GrammarTable component — responsive grammar paradigm tables with RTL support
- [x] **INFRA-04**: VerbConjugation component — verb form tables with root, person, tense columns
- [x] **INFRA-05**: ExerciseBox component — practice exercises with show/hide answer reveals
- [x] **INFRA-06**: Callout component — highlighted rule/tip/note/warning boxes
- [x] **INFRA-07**: Lesson directory structure (`src/content/lessons/level-{1-5}/`)

### Lesson Content

- [ ] **LSSN-01**: 11 Level 1 Foundation lessons (alphabet, vowels, word types, basic sentences, case intro)
- [ ] **LSSN-02**: 11 Level 2 Core Grammar lessons (three cases, sentence structures, idafah, inna/kaana sisters)
- [ ] **LSSN-03**: 18 Level 3 Intermediate lessons (root system, verb forms I-X, derived nouns, pronouns)
- [ ] **LSSN-04**: 17 Level 4 Advanced lessons (conditionals, exceptions, emphasis, rhetoric, weak verbs)
- [ ] **LSSN-05**: 16 Level 5 Applied Study lessons (full verse analysis, pattern recognition, surah analysis)
- [ ] **LSSN-06**: Each lesson follows textbook structure: introduction → concept → examples → rule → exercises
- [ ] **LSSN-07**: All Arabic text fully vocalized with tashkeel (diacritics on every letter)
- [ ] **LSSN-08**: Quranic verse examples with surah:ayah references (Claude-selected, pedagogically appropriate)
- [ ] **LSSN-09**: I'rab (grammatical parsing) analysis for key examples
- [ ] **LSSN-10**: 3-4 practice exercises per lesson with answer reveals
- [ ] **LSSN-11**: Graduated transliteration (full at Level 1-2, partial at Level 3, minimal at Level 4-5)

### Pedagogy

- [ ] **PDGY-01**: Plain English explanations before Arabic terminology — simple, jargon-free language
- [ ] **PDGY-02**: English analogies for Arabic grammar concepts ("Think of idafah like English 'of'")
- [ ] **PDGY-03**: Bilingual terminology always — "Accusative case (mansub / مَنْصُوب)"
- [ ] **PDGY-04**: Example-heavy approach — show patterns before stating rules
- [ ] **PDGY-05**: Common mistake alerts ("Students often confuse X with Y because...")
- [ ] **PDGY-06**: Cross-references between related lessons
- [ ] **PDGY-07**: Word-by-word morphological breakdown for key Quranic examples
- [ ] **PDGY-08**: One major concept per lesson — no cognitive overload

### Reference Resources

- [ ] **RSRC-01**: Glossary — 100-150 Arabic grammar terms with bilingual definitions
- [ ] **RSRC-02**: Verb conjugation tables — Forms I-X across tenses, persons, genders
- [ ] **RSRC-03**: Pronoun charts — independent, attached, demonstrative, relative
- [ ] **RSRC-04**: Case endings chart — raf'/nasb/jarr across singular/dual/plural with examples
- [ ] **RSRC-05**: Root system guide — trilateral roots, derivation patterns, dictionary lookup strategy
- [ ] **RSRC-06**: 200 most common Quranic words — frequency, root, meaning, example verse

## Future Requirements

Deferred to later milestones. Tracked but not in current roadmap.

### Interactive Features

- **INTV-01**: Audio pronunciation for Arabic examples
- **INTV-02**: Interactive drag-and-drop i'rab exercises
- **INTV-03**: Spaced repetition vocabulary review system

### Assessment

- **ASMT-01**: Updated quiz content aligned with new lesson content
- **ASMT-02**: Level completion assessments with detailed feedback

### Backend Integration

- **BACK-01**: Real Supabase auth implementation (replace auth.ts stub)
- **BACK-02**: Supabase progress sync (replace localStorage-only tracking)
- **BACK-03**: Real iOS device testing and Capacitor production build

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Gamification (streaks, XP, badges) | User explicitly wants minimal tracking only |
| Video/audio lessons | Adds complexity and hosting costs; text-first approach |
| Multiple i'rab opinions | Confuses learners; present standard analysis, save scholarly debate for future |
| Non-Quranic Arabic examples | Students came for Quranic Arabic; stay focused |
| CMS integration | Single author, MDX in Git is simpler |
| Quran API integration | Content should be frozen in MDX; no runtime dependencies |
| Classical poetry examples | Outside scope of Quranic Arabic grammar |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 9 | Complete |
| INFRA-02 | Phase 9 | Complete |
| INFRA-03 | Phase 9 | Complete |
| INFRA-04 | Phase 9 | Complete |
| INFRA-05 | Phase 9 | Complete |
| INFRA-06 | Phase 9 | Complete |
| INFRA-07 | Phase 9 | Complete |
| LSSN-01 | Phase 12 | Pending |
| LSSN-02 | Phase 13 | Pending |
| LSSN-03 | Phase 14 | Pending |
| LSSN-04 | Phase 15 | Pending |
| LSSN-05 | Phase 16 | Pending |
| LSSN-06 | Phases 10, 12-16 | Pending |
| LSSN-07 | Phases 12-16 | Pending |
| LSSN-08 | Phases 12-16 | Pending |
| LSSN-09 | Phases 12-16 | Pending |
| LSSN-10 | Phases 12-16 | Pending |
| LSSN-11 | Phases 10, 12-16 | Pending |
| PDGY-01 | Phases 11-16 | Pending |
| PDGY-02 | Phases 11-16 | Pending |
| PDGY-03 | Phases 10, 11-16 | Pending |
| PDGY-04 | Phases 11-16 | Pending |
| PDGY-05 | Phases 11-16 | Pending |
| PDGY-06 | Phases 10, 11-16 | Pending |
| PDGY-07 | Phases 11-16 | Pending |
| PDGY-08 | Phases 11-16 | Pending |
| RSRC-01 | Phase 11 | Pending |
| RSRC-02 | Phase 11 | Pending |
| RSRC-03 | Phase 11 | Pending |
| RSRC-04 | Phase 11 | Pending |
| RSRC-05 | Phase 11 | Pending |
| RSRC-06 | Phase 11 | Pending |

**Coverage:**
- v1.1 requirements: 32 total
- Mapped to phases: 32
- Unmapped: 0

**Notes:**
- LSSN-06 through LSSN-11 are cross-cutting quality standards that apply to all lesson content phases (12-16)
- PDGY-01 through PDGY-08 are cross-cutting pedagogy principles that apply to all content creation (reference resources and lessons, phases 11-16)
- Phase 10 (Curriculum Planning) addresses standards that enable LSSN-06, LSSN-11, and PDGY-03, PDGY-06
- Phase 17 (QA & Validation) validates all requirements across the entire content corpus

---
*Requirements defined: 2026-02-06*
*Last updated: 2026-02-06 after Phase 9 execution (INFRA-01 through INFRA-07 Complete)*
