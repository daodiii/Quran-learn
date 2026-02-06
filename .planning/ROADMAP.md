# Roadmap: Quran Learn v1.1 Lesson Content

## Milestones

- ✅ **v1.0 UI/UX Redesign** - Phases 1-8 (shipped 2026-02-06)
- 🚧 **v1.1 Lesson Content** - Phases 9-17 (in progress)

## Phases

<details>
<summary>✅ v1.0 UI/UX Redesign (Phases 1-8) - SHIPPED 2026-02-06</summary>

Complete Coursera-inspired UI/UX redesign with design system, component library, navigation, page redesigns, mobile optimization, and WCAG AAA accessibility. 152 files created/modified, ~10,771 LOC, Lighthouse accessibility 100, performance 99-100.

**Phases 1-8 completed with 28 plans total.**

</details>

### 🚧 v1.1 Lesson Content (In Progress)

**Milestone Goal:** Fill all 73 lesson MDX files and 6 resource pages with real Arabic grammar content based on classical nahw/sarf, using Quranic verse examples.

#### ✅ Phase 9: Content Infrastructure

**Goal:** Establish validation infrastructure and component library for authoring 73 lessons with type-safe schemas and reusable educational components.

**Depends on:** Phase 8 (v1.0 UI/UX complete)

**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07

**Success Criteria** (what must be TRUE):
1. ✅ Content schema validates lesson frontmatter at build time (title, level, order)
2. ✅ ArabicExample component displays Quranic verses with translation and grammar highlights
3. ✅ GrammarTable component renders responsive paradigm tables with RTL support
4. ✅ VerbConjugation component shows verb forms with root, person, tense columns
5. ✅ ExerciseBox component provides practice exercises with show/hide answer reveals
6. ✅ Callout component highlights rules, tips, notes, and warnings
7. ✅ Lesson directory structure exists with level-1 through level-5 subdirectories

**Plans:** 3 plans

Plans:
- [x] 09-01-PLAN.md -- Content collection schema and lesson directory structure
- [x] 09-02-PLAN.md -- ArabicExample and Callout educational components
- [x] 09-03-PLAN.md -- GrammarTable, VerbConjugation, and ExerciseBox components

---

#### ✅ Phase 10: Curriculum Planning & Standards

**Goal:** Establish curriculum map, terminology standards, and validation tooling to prevent progression breaks, terminology drift, and diacritics inconsistency across 73 lessons.

**Depends on:** Phase 9

**Requirements:** LSSN-06, LSSN-07, LSSN-11, PDGY-03, PDGY-06

**Success Criteria** (what must be TRUE):
1. ✅ CURRICULUM_MAP.md defines all 73 lesson topics with prerequisite dependencies
2. ✅ TERMINOLOGY.md provides canonical bilingual terms for all Arabic grammar concepts
3. ✅ STYLE_GUIDE.md documents lesson template structure, transliteration scheme, and formatting standards
4. ✅ Automated validation scripts check diacritics, terminology consistency, and verse references
5. ✅ Quranic text API integration functions fetch authoritative verses with full harakat

**Plans:** 3 plans

Plans:
- [x] 10-01-PLAN.md -- Curriculum map with 73 lesson definitions and prerequisites
- [x] 10-02-PLAN.md -- Terminology standards and style guide
- [x] 10-03-PLAN.md -- Validation scripts and build-time Quran text helper

---

#### ✅ Phase 11: Reference Resources

**Goal:** Create 6 reference resources that lessons can link to during content generation (glossary, verb tables, pronoun charts, case endings, root system, 200 common words).

**Depends on:** Phase 10

**Requirements:** RSRC-01, RSRC-02, RSRC-03, RSRC-04, RSRC-05, RSRC-06, PDGY-01, PDGY-02, PDGY-03, PDGY-04, PDGY-05, PDGY-06, PDGY-07, PDGY-08

**Success Criteria** (what must be TRUE):
1. ✅ Glossary contains 100-150 Arabic grammar terms with bilingual definitions and lesson cross-references
2. ✅ Verb conjugation tables show Forms I-X across all tenses, persons, and genders
3. ✅ Pronoun charts document independent, attached, demonstrative, and relative pronouns
4. ✅ Case endings chart shows raf'/nasb/jarr patterns across singular/dual/plural with examples
5. ✅ Root system guide explains trilateral roots, derivation patterns, and dictionary lookup strategy
6. ✅ 200 most common Quranic words resource lists frequency, root, meaning, and example verse

**Plans:** 6 plans

Plans:
- [x] 11-01-PLAN.md — Glossary with 100-150 bilingual grammar terms
- [x] 11-02-PLAN.md — Case endings chart (raf'/nasb/jarr across noun types)
- [x] 11-03-PLAN.md — Verb conjugation tables (Forms I-X, all tenses)
- [x] 11-04-PLAN.md — Pronoun charts (independent/attached/demonstrative/relative)
- [x] 11-05-PLAN.md — Root system guide with dictionary lookup strategy
- [x] 11-06-PLAN.md — 200 most common Quranic words list

---

#### ✅ Phase 12: Level 1 Foundation Lessons

**Goal:** Create 11 Foundation level lessons teaching alphabet, vowels, word types, sentence types, and case system introduction with extensive transliteration and simple examples.

**Depends on:** Phase 11

**Requirements:** LSSN-01, LSSN-06, LSSN-07, LSSN-08, LSSN-09, LSSN-10, LSSN-11, PDGY-01, PDGY-02, PDGY-03, PDGY-04, PDGY-05, PDGY-06, PDGY-07, PDGY-08

**Success Criteria** (what must be TRUE):
1. ✅ 11 Level 1 lessons exist covering alphabet, vowels, word types, basic sentences, and case introduction
2. ✅ All Arabic text is fully vocalized with diacritics on every letter
3. ✅ Each lesson includes pedagogically appropriate Quranic verse examples with surah:ayah references
4. ✅ Each lesson provides 3-4 practice exercises with answer reveals
5. ✅ All lessons use plain English explanations with English analogies before introducing Arabic terminology

**Plans:** 5 plans

Plans:
- [x] 12-01-PLAN.md — Alphabet, short vowels, long vowels (L1.01-L1.03) + remove placeholder
- [x] 12-02-PLAN.md — Sukun/shadda/tanween and Bismillah reading practice (L1.04-L1.05)
- [x] 12-03-PLAN.md — Three word types and definite article (L1.06-L1.07)
- [x] 12-04-PLAN.md — Gender and singular/dual/plural (L1.08-L1.09)
- [x] 12-05-PLAN.md — Simple sentences and case endings introduction (L1.10-L1.11)

---

#### Phase 13: Level 2 Core Grammar Lessons

**Goal:** Create 11 Core Grammar lessons teaching three cases, sentence structures, idafah, and inna/kaana sisters with balanced transliteration and structured examples.

**Depends on:** Phase 12

**Requirements:** LSSN-02, LSSN-06, LSSN-07, LSSN-08, LSSN-09, LSSN-10, LSSN-11, PDGY-01, PDGY-02, PDGY-03, PDGY-04, PDGY-05, PDGY-06, PDGY-07, PDGY-08

**Success Criteria** (what must be TRUE):
1. 11 Level 2 lessons exist covering three cases, sentence structures, idafah, and inna/kaana sisters
2. All Arabic text is fully vocalized with complete tashkeel
3. Each lesson includes Quranic verse examples with grammatical parsing (i'rab) analysis
4. Each lesson provides 3-4 practice exercises with answer reveals
5. All lessons follow textbook structure: introduction -> concept -> examples -> rule -> exercises

**Plans:** TBD

Plans:
- [ ] TBD during planning

---

#### Phase 14: Level 3 Intermediate Lessons

**Goal:** Create 18 Intermediate lessons teaching root system, verb forms I-X, derived nouns, and pronouns with partial transliteration and morphological analysis.

**Depends on:** Phase 13

**Requirements:** LSSN-03, LSSN-06, LSSN-07, LSSN-08, LSSN-09, LSSN-10, LSSN-11, PDGY-01, PDGY-02, PDGY-03, PDGY-04, PDGY-05, PDGY-06, PDGY-07, PDGY-08

**Success Criteria** (what must be TRUE):
1. 18 Level 3 lessons exist covering root system, verb forms I-X, derived nouns, and pronouns
2. All Arabic text is fully vocalized with diacritics
3. Each lesson includes word-by-word morphological breakdown for key Quranic examples
4. Each lesson provides 3-4 practice exercises with answer reveals
5. All lessons show patterns before stating abstract rules (example-heavy approach)

**Plans:** TBD

Plans:
- [ ] TBD during planning

---

#### Phase 15: Level 4 Advanced Lessons

**Goal:** Create 17 Advanced lessons teaching conditionals, exceptions, emphasis, rhetoric, and weak verbs with minimal transliteration and complex grammatical analysis.

**Depends on:** Phase 14

**Requirements:** LSSN-04, LSSN-06, LSSN-07, LSSN-08, LSSN-09, LSSN-10, LSSN-11, PDGY-01, PDGY-02, PDGY-03, PDGY-04, PDGY-05, PDGY-06, PDGY-07, PDGY-08

**Success Criteria** (what must be TRUE):
1. 17 Level 4 lessons exist covering conditionals, exceptions, emphasis, rhetoric, and weak verbs
2. All Arabic text is fully vocalized with complete harakat
3. Each lesson includes Quranic verse examples with full grammatical parsing
4. Each lesson provides 3-4 practice exercises with answer reveals
5. All lessons include common mistake alerts to prevent typical learner errors

**Plans:** TBD

Plans:
- [ ] TBD during planning

---

#### Phase 16: Level 5 Applied Study Lessons

**Goal:** Create 16 Applied Study lessons teaching full verse analysis, pattern recognition, and surah analysis with minimal transliteration and synthesis of all concepts.

**Depends on:** Phase 15

**Requirements:** LSSN-05, LSSN-06, LSSN-07, LSSN-08, LSSN-09, LSSN-10, LSSN-11, PDGY-01, PDGY-02, PDGY-03, PDGY-04, PDGY-05, PDGY-06, PDGY-07, PDGY-08

**Success Criteria** (what must be TRUE):
1. 16 Level 5 lessons exist covering full verse analysis, pattern recognition, and surah analysis
2. All Arabic text is fully vocalized with diacritics
3. Each lesson demonstrates synthesis of grammar concepts across entire verses or passages
4. Each lesson provides 3-4 practice exercises with answer reveals
5. All lessons focus on one major concept to avoid cognitive overload

**Plans:** TBD

Plans:
- [ ] TBD during planning

---

#### Phase 17: Quality Assurance & Validation

**Goal:** Validate all 73 lessons and 6 resources for terminology consistency, exercise accuracy, cultural sensitivity, and pedagogical integrity before shipping content milestone.

**Depends on:** Phase 16

**Requirements:** (Cross-validation of all LSSN and PDGY requirements)

**Success Criteria** (what must be TRUE):
1. Cross-lesson terminology audit confirms consistent bilingual terms across all lessons
2. Exercise answer keys validated by expert Arabic linguist for grammatical accuracy
3. Cultural sensitivity review confirms appropriate Quranic text treatment
4. Readability and difficulty progression verified across all 5 levels
5. All glossary links resolve correctly to reference resources

**Plans:** TBD

Plans:
- [ ] TBD during planning

---

## Progress

**Execution Order:** Phases execute sequentially: 9 -> 10 -> 11 -> 12 -> 13 -> 14 -> 15 -> 16 -> 17

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Design Foundation | v1.0 | 4/4 | Complete | 2026-02-05 |
| 2. Component Library | v1.0 | 3/3 | Complete | 2026-02-05 |
| 3. Navigation System | v1.0 | 4/4 | Complete | 2026-02-06 |
| 4. Homepage Redesign | v1.0 | 3/3 | Complete | 2026-02-06 |
| 5. Learn Dashboard | v1.0 | 3/3 | Complete | 2026-02-06 |
| 6. Lesson Pages | v1.0 | 3/3 | Complete | 2026-02-06 |
| 7. Supporting Pages | v1.0 | 5/5 | Complete | 2026-02-06 |
| 8. Mobile & Accessibility | v1.0 | 3/3 | Complete | 2026-02-06 |
| 9. Content Infrastructure | v1.1 | 3/3 | Complete | 2026-02-06 |
| 10. Curriculum Planning | v1.1 | 3/3 | Complete | 2026-02-06 |
| 11. Reference Resources | v1.1 | 6/6 | Complete | 2026-02-06 |
| 12. Level 1 Foundation | v1.1 | 5/5 | Complete | 2026-02-06 |
| 13. Level 2 Core Grammar | v1.1 | 0/TBD | Not started | - |
| 14. Level 3 Intermediate | v1.1 | 0/TBD | Not started | - |
| 15. Level 4 Advanced | v1.1 | 0/TBD | Not started | - |
| 16. Level 5 Applied Study | v1.1 | 0/TBD | Not started | - |
| 17. QA & Validation | v1.1 | 0/TBD | Not started | - |

---

*Last updated: 2026-02-06 after Phase 12 execution complete*
