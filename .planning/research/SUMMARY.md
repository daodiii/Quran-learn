# Project Research Summary

**Project:** Quran Learn v1.1 — Lesson Content Milestone
**Domain:** Educational content creation (Quranic Arabic grammar)
**Researched:** 2026-02-06
**Confidence:** MEDIUM-HIGH

## Executive Summary

This milestone is about filling 73 lesson MDX files and 6 resource pages with classical Arabic grammar content for Quranic comprehension. Unlike the v1.0 UI/UX redesign, v1.1 is a content authoring challenge, not a feature build. The existing Astro 5.x platform with MDX content collections already ships successfully. The primary task is systematic, pedagogically sound content generation with rigorous validation protocols.

**The recommended approach:** Treat this as a content production pipeline with quality gates, not a software feature build. Create validation infrastructure first (content schema, MDX components, verification scripts), establish curriculum map and terminology standards before ANY content generation, then author lessons in batches by level with expert validation at every step. The biggest risk is AI-generated content containing incorrect Quranic text or hallucinated Arabic grammar rules. Prevention requires explicit API integration for Quranic verses, reference grammar anchoring for rules, and mandatory expert linguist review of all grammar rules and exercise answer keys (250-340 hours of expert validation budget required).

**Key risks and mitigation:** (1) Theological disaster if Quranic text has errors — fetch all verses from authoritative API, never let AI generate Quranic text from memory. (2) Pedagogical failure if grammar rules are incorrect — anchor all rules to classical grammar texts, require Arabic linguist validation. (3) Progression breaks if prerequisites aren't met — create comprehensive curriculum map with dependency graph before generating any lessons. (4) Scale challenges with 73 lessons — build automated validation scripts for diacritics, terminology consistency, and verse references to catch errors before they propagate.

## Key Findings

### Recommended Stack

This is a content milestone, not a technology milestone. The stack is already complete (Astro 5.17.1 + MDX). Only two small additions are needed for content authoring: content schema validation and custom MDX components for educational display.

**Stack additions required:**
- **Content Collections Schema** (src/content.config.ts with Zod) — Type-safe frontmatter validation to prevent authoring errors (missing title, wrong level, invalid order)
- **5 Custom MDX Components** (Astro components for educational content) — ArabicExample, GrammarTable, VerbConjugation, ExerciseBox, Callout for structured grammar display
- **NO new integrations, plugins, or external libraries** — Keep it simple, semantic HTML + CSS over complex components

**Philosophy:** The platform works. Focus on creating great content with minimal tooling overhead. Avoid remark/rehype plugins, external MDX component libraries, CMS integration, or Quran API integration at runtime (copy-paste verses into MDX, keep content frozen and static).

### Expected Features

Research focused on CONTENT features (what goes inside each lesson), not UI features (those shipped in v1).

**Must have (table stakes):**
- Fully vocalized Arabic text with proper diacritics (tashkeel) — critical for beginners
- Quranic verse examples with surah:ayah references, translation, and grammatical analysis
- I'rab analysis (case/state/function) for every example
- Clear grammar rule statements with both Arabic and English terminology
- Progressive difficulty (Level 1 Foundation → Level 5 Applied Study)
- Practice exercises with answer reveals (3-5 per lesson)
- Consistent transliteration system across all 73 lessons
- Glossary linkage for technical terms

**Should have (differentiators):**
- Pedagogically selected verses (clarity over randomness)
- Word-by-word morphological breakdown showing root, form, pattern, affixes
- Visual i'rab indicators (color-coding or formatting)
- Common mistake alerts for typical learner errors
- Etymology and root meanings to deepen vocabulary understanding
- Graduated transliteration (extensive at Level 1, minimal by Level 4-5)
- Pattern recognition training exercises
- Frequency indicators for grammatical patterns

**Defer (anti-features to avoid):**
- Comprehensive grammatical tables upfront (overwhelming, defeats progressive learning)
- Multiple i'rab opinions without guidance (confuses beginners)
- Overuse of technical terminology without definitions
- Grammar-only focus without connecting to meaning
- Advanced concepts too early in curriculum

### Architecture Approach

Content integration leverages Astro's built-in content collections with Zod schema validation and custom MDX component injection. The architecture is file-based with static generation, scaling easily to 73 lessons without runtime overhead.

**Major components:**
1. **Content Schema** (src/content.config.ts) — Validates frontmatter (title, titleArabic, level, order, description) at build time using Zod, provides TypeScript autocomplete for authors
2. **Custom MDX Components** (src/components/mdx/) — Five grammar-specific Astro components (ArabicExample for verse display with RTL and UthmanicHafs font, GrammarTable for responsive case ending tables, VerbConjugation for morphology displays, ExerciseBox for structured practice, Callout for rule highlights)
3. **Lesson MDX Files** (src/content/lessons/level-{1-5}/) — 73 files organized by level subdirectories, named `{order}-{slug}.mdx`, follow consistent pedagogical template (intro → examples → rule → exercises → summary)
4. **Dynamic Lesson Router** (src/pages/learn/[...slug].astro) — Already exists, needs minor update to pass MDX components to render()
5. **Resource Pages** (src/content/resources/) — 6 MDX files for reference materials (glossary, verb tables, pronoun charts, case endings, root system, 200 common words)

**Data flow:** Build time reads MDX files, validates against schema, compiles with custom components injected, generates static routes. No runtime dependencies, all content pre-rendered.

### Critical Pitfalls

From PITFALLS.md, the top risks for this content authoring milestone:

1. **AI generating incorrect Quranic text from memory** — Introduces theological errors (unacceptable to Muslim learners), causes community backlash and project abandonment. Prevention: NEVER ask Claude to write Quranic text, fetch ALL verses from authoritative API (Quran.com or Tanzil.net), implement automated validation against canonical database, human review every verse against physical mushaf.

2. **Hallucinated Arabic grammar rules** — AI invents plausible but incorrect grammar rules, fake terminology, wrong case ending patterns. Students learn incorrect Arabic (pedagogical disaster). Prevention: Anchor every prompt with excerpts from authoritative grammar texts (Ajrumiyyah, Hidayat al-Nahw), create TERMINOLOGY.md database before generation, require citation of classical sources for every rule, expert Arabic linguist validation pass (non-negotiable).

3. **Pedagogical progression breaks** — Lesson 20 uses concepts not taught until Lesson 45, students hit cognitive walls and abandon course. Prevention: Create comprehensive CURRICULUM_MAP.md with dependency graph BEFORE generating any lessons, include prerequisite context in every prompt ("student knows X, Y, Z so far"), validation script to verify lesson N only uses concepts from lessons 1 through N-1, expert curriculum review before generation starts.

4. **Inconsistent or missing harakat (diacritics)** — Some lessons fully vocalized, others partially, making content unusable for beginners. Prevention: Mandatory full vocalization policy ("kamil al-tashkil" in every prompt), automated diacritics validation script checking for Unicode combining characters, consistency checker verifies same words have same vocalization across lessons, visual diff review before committing.

5. **Exercise answer keys generated incorrectly** — Grammar parsing with incorrect i'rab, case ending exercises with wrong answers, students learn errors and can't verify self-study work. Prevention: Double-generation validation (generate exercise, separately generate solution, check consistency), expert Arabic linguist MUST review all 365-730 exercise answer keys (non-negotiable quality gate), student beta testing before publication.

## Implications for Roadmap

Based on research, content authoring requires infrastructure before generation, validation throughout, and expert gates before shipping. Suggested phase structure:

### Phase 1: Foundation Infrastructure
**Rationale:** Must establish validation infrastructure and component library before authoring any content. Without schema, components, and validation scripts, content authoring will produce low-quality output that requires expensive rework.

**Delivers:**
- Content schema (src/content.config.ts with Zod validation for lessons and resources)
- 5 custom MDX components (ArabicExample, GrammarTable, VerbConjugation, ExerciseBox, Callout)
- Test lesson file (level-1/01-arabic-alphabet.mdx) to verify architecture
- VS Code snippets for frontmatter autocomplete (optional but high ROI)

**Addresses:** Stack additions from STACK.md, architecture components from ARCHITECTURE.md

**Avoids:** Pitfall of generating content without validation infrastructure (leads to inconsistency at scale)

**Research needs:** None — standard Astro patterns, well-documented

---

### Phase 2: Curriculum Planning & Standards
**Rationale:** Creating a curriculum map and standards BEFORE content generation is critical to avoid pedagogical progression breaks, terminology inconsistency, and transliteration chaos across 73 lessons. This upfront planning prevents expensive rework.

**Delivers:**
- CURRICULUM_MAP.md with all 73 lesson topics, prerequisites, dependency graph, concepts introduced per lesson
- TERMINOLOGY.md with canonical English transliteration for all Arabic grammar terms, approved vocalization
- STYLE_GUIDE.md with transliteration scheme (DIN 31635 vs simplified), MDX formatting standards, lesson template structure, vocabulary level guidelines
- Automated validation scripts (diacritics checker, Unicode NFC validator, terminology consistency checker, verse reference validator)
- Quranic text API integration (helper functions to fetch verses from Quran.com or Tanzil.net)

**Addresses:** Critical pitfalls 1, 2, 3, 4, 7 from PITFALLS.md (Quranic text accuracy, grammar rule hallucination, progression breaks, diacritics, transliteration consistency)

**Avoids:** Generating lessons independently without curriculum context, allowing terminology drift, mixing transliteration schemes

**Research needs:** Medium — Requires reviewing classical Arabic grammar curriculum patterns (Madinah Book series, Bayyinah approach), validating pedagogical topic sequence with Arabic educator

---

### Phase 3: Reference Resources First
**Rationale:** The 6 resource files (glossary, verb tables, pronoun charts, case endings, root system, 200 common words) should be created BEFORE lessons so lessons can reference them during generation. Lessons will link to glossary terms and reference verb tables, so resources must exist first.

**Delivers:**
- Glossary (100-150 Arabic grammar terms with definitions, examples, lesson cross-references)
- Verb conjugation tables (Forms I-X, all tenses, active/passive voice)
- Pronoun charts (independent, attached, demonstrative, relative, interrogative)
- Case endings chart (raf'/nasb/jarr with tanween, definiteness, number variations)
- Root system guide (trilateral/quadrilateral roots, pattern derivations, dictionary lookup strategy)
- 200 most common Quranic words (with frequency, root, grammatical category, example verse)

**Addresses:** Features from FEATURES.md (glossary linkage, reference materials), prevents Pitfall 14 (resources misaligned with lessons)

**Avoids:** Generating lessons that reference non-existent glossary terms or verb forms

**Research needs:** Low — Structured reference content with clear data requirements, can generate with validated sources (Hans Wehr, Lane's Lexicon)

---

### Phase 4: Level 1 Foundation Lessons (11 lessons)
**Rationale:** Start with Level 1 to validate the entire content generation workflow with expert feedback before scaling to 73 lessons. Level 1 is highest priority pedagogically (students can't progress without solid foundation) and simplest to generate (basic concepts, extensive transliteration). Learn and refine process with first batch.

**Delivers:**
- 11 Foundation level lessons (alphabet, vowels, word types, sentence types, case system introduction)
- Validated content generation protocol (fetch verses from API, anchor grammar rules to references, full vocalization, double-check exercises)
- Expert review feedback loop established (Arabic linguist validates grammar, Muslim educator checks cultural sensitivity)
- Refinement of prompts based on first-batch learnings

**Addresses:** Features from FEATURES.md (table stakes like Arabic text rendering, Quranic examples, i'rab basics, exercises), validates architecture from ARCHITECTURE.md

**Avoids:** Critical pitfalls 1, 2, 4, 5, 8 through validated generation protocol and expert review

**Research needs:** High — First batch needs careful expert validation to establish quality baseline, refine prompt engineering, validate pedagogical approach before scaling

---

### Phase 5: Level 2 Core Grammar Lessons (11 lessons)
**Rationale:** Level 2 covers core grammatical structures (case system mastery, sentence analysis, basic verb conjugation). This is critical curriculum content. Generate as second batch using refined process from Level 1 learnings.

**Delivers:**
- 11 Core Grammar lessons (three cases, nominal/verbal sentences, idafah, inna/kana sisters)
- Case endings chart resource (supports Level 2 content)
- Continued refinement of generation process

**Addresses:** Core features from FEATURES.md (case endings, i'rab analysis, grammar rule statements, exercises)

**Avoids:** Pedagogical progression breaks (Level 2 only uses Level 1 prerequisites)

**Research needs:** Medium — Case system pedagogy is well-established but inna/kana particles need careful grammatical accuracy validation

---

### Phase 6: Level 3 Intermediate Lessons (18 lessons)
**Rationale:** Level 3 covers verb system and morphology (Forms I-X, derived nouns, pronouns). This is the largest level by lesson count (18) and most complex grammatically. Requires deep morphological accuracy.

**Delivers:**
- 18 Intermediate lessons (root system, verb forms I-X, active/passive participles, verbal nouns, pronouns)
- Verb conjugation tables and root system resources already exist from Phase 3

**Addresses:** Features from FEATURES.md (morphological breakdown, root analysis, verb forms, pattern recognition)

**Avoids:** Pitfall 5 (fake Arabic words or misused roots) through dictionary verification and root validation

**Research needs:** High — Verb morphology is complex, requires expert validation of all conjugations and derived forms, high risk for hallucinated patterns

---

### Phase 7: Levels 4-5 Advanced & Applied (33 lessons)
**Rationale:** Final batch covers advanced constructions (Level 4: conditionals, exceptions, special nouns, complex particles) and applied analysis (Level 5: full verse parsing, synthesis of all concepts). Can be deprioritized if time constrained since these serve advanced learners only.

**Delivers:**
- 17 Advanced lessons (Level 4)
- 16 Applied Study lessons (Level 5)
- Complete 73-lesson curriculum

**Addresses:** Features from FEATURES.md (complex grammatical constructions, full verse analysis, pattern recognition across surahs)

**Avoids:** Advanced concepts appearing too early (Level 4-5 students have solid foundation from Levels 1-3)

**Research needs:** Medium-High — Advanced topics have multiple valid pedagogical approaches, rhetoric elements need cultural sensitivity validation

---

### Phase 8: Quality Assurance & Expert Validation
**Rationale:** After all 73 lessons generated, comprehensive validation pass to catch cross-lesson inconsistencies, verify exercise answer keys, check cultural sensitivity, and ensure curriculum flows correctly. Expert validation is the critical quality gate before shipping.

**Delivers:**
- Cross-lesson terminology consistency audit (find and fix transliteration variants, term definition conflicts)
- Exercise answer key validation by expert Arabic linguist (ALL 365-730 exercises verified correct)
- Cultural sensitivity review by Muslim educator (appropriate Quranic text treatment, theological accuracy)
- Readability and difficulty progression review
- Glossary linkage verification (all term links resolve correctly)
- Final technical validation (Unicode NFC, broken links, formatting consistency)

**Addresses:** Pitfalls 8 (exercise answers), 9 (content duplication), 11 (glossary linkage), 13 (terminology inconsistency), 15 (cultural sensitivity)

**Avoids:** Shipping incorrect grammar content or theologically insensitive material

**Research needs:** None — Validation checklists already defined, requires expert time not research

---

### Phase Ordering Rationale

**Dependencies drive order:**
- Phase 1 must precede all others (need components and schema to author content)
- Phase 2 must precede content generation (need curriculum map and standards to generate correctly)
- Phase 3 must precede Phase 4+ (lessons reference resources, resources must exist first)
- Phases 4-7 are sequential by level (each level builds on previous)
- Phase 8 must be last (validates complete curriculum)

**Batch generation mitigates risk:**
- Don't generate all 73 lessons at once — generate in level batches (11, 11, 18, 17, 16)
- Validate each batch with expert feedback before proceeding
- Learn and refine prompts between batches
- Fail fast with Level 1 if approach is fundamentally flawed

**Expert validation as quality gate:**
- Arabic linguist reviews grammar rules and exercise answers (250-340 hours budgeted)
- Muslim educator reviews cultural sensitivity and Quranic text treatment
- No phase proceeds without expert sign-off
- AI cannot self-validate Arabic grammar accuracy

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 2:** Classical Arabic curriculum sequencing — Need expert Arabic educator to validate lesson topic ordering, prerequisite dependencies, and pedagogical progression (consult Madinah Book series structure, Bayyinah program, Al-Kitaab methodology adapted for Quranic focus)
- **Phase 4:** Level 1 content generation protocol — First batch needs careful prompt engineering experimentation, validation of Quranic text API integration, establishment of expert review workflow (pilot before scaling)
- **Phase 6:** Verb morphology accuracy — Forms I-X have complex derivation patterns, high risk for AI hallucination, need reference grammar anchoring strategy (Ajrumiyyah, Hidayat al-Nahw excerpts)

**Phases with standard patterns (skip research-phase):**
- **Phase 1:** Infrastructure setup — Standard Astro content collections + Zod + MDX components, well-documented official patterns
- **Phase 3:** Reference resources — Structured data generation from verified sources (Hans Wehr, Lane's Lexicon), straightforward tabular content
- **Phase 8:** Quality assurance — Validation checklists and expert review, execution not research

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Astro 5.x content collections + Zod + MDX components — official patterns, existing codebase uses these successfully |
| Features | HIGH | Classical Arabic pedagogy patterns well-established (Madinah Books, Bayyinah, university curricula), table stakes clear |
| Architecture | HIGH | File-based content collections with static generation, standard Astro approach, scales to 1000+ lessons trivially |
| Pitfalls | MEDIUM | AI content generation risks known (hallucination patterns), Arabic-specific pitfalls based on training knowledge (not field-tested) |

**Overall confidence:** MEDIUM-HIGH

Research findings are solid for technical stack and architecture (verified against official Astro docs and existing codebase). Pedagogical patterns are well-established in classical Arabic education. The main uncertainty is in AI-generated content quality control — pitfalls are based on known LLM limitations and Arabic grammar complexity, but haven't been validated through pilot generation. Recommend generating 3-5 sample lessons to test assumptions before committing to full 73-lesson production.

### Gaps to Address

**Gap 1: Expert availability and validation workflow**
- Research assumes 250-340 hours of expert validation (Arabic linguist + Muslim educator + pedagogy expert) is available
- Need to recruit experts and establish validation workflow BEFORE Phase 4 content generation
- If experts unavailable, project timeline extends significantly or quality suffers

**Gap 2: Quranic text API reliability**
- Research recommends Quran.com or Tanzil.net for authoritative verse data
- Need to validate these APIs still provide Uthmanic Hafs text with full diacritics in 2026
- If APIs changed or deprecated, need fallback to local canonical mushaf database

**Gap 3: Classical grammar reference access**
- Prevention strategies rely on anchoring prompts with excerpts from Ajrumiyyah, Hidayat al-Nahw, Qatr al-Nada
- Need to verify access to these classical texts in digital form for prompt inclusion
- If unavailable, need to source alternative authoritative grammar references

**Gap 4: AI prompt engineering for Arabic accuracy**
- Research assumes explicit prompts can prevent Quranic text generation and grammar hallucination
- Need to pilot test with 3-5 lessons to validate prompt strategies actually work
- If prompts insufficient, may need human-first authoring with AI assistance (slower but more accurate)

**Gap 5: Content authoring timeline estimation**
- Research estimates 30-40 hours for 70 lessons (30 min each) but this assumes AI generation efficiency
- If expert validation reveals high error rates requiring extensive rework, timeline could double
- Recommend pilot Phase 4 (11 lessons) to get realistic velocity before committing to full scope

## Sources

### Primary (HIGH confidence)
- **Astro 5.x Official Documentation** — Content collections, MDX integration, Zod schema validation (verified current as of v5.17.1)
- **Existing Quran Learn Codebase** — Lesson routing patterns (src/pages/learn/[...slug].astro), LessonLayout.astro structure, CourseNavigator.astro collection iteration (analyzed directly)
- **Zod Official Documentation** — Schema definition patterns, type inference (bundled with Astro 5.x)

### Secondary (MEDIUM confidence)
- **Classical Arabic Pedagogy Patterns** — Training knowledge of Madinah Book series structure, Bayyinah Dream program approach, university Arabic curricula (nahw/sarf progression standard across sources)
- **Arabic Grammar Textbook Structure** — Traditional pedagogical flow (alphabet → cases → verbs → complex constructions) consistent across Ajrumiyyah, Hidayat al-Nahw, Qatr al-Nada approaches
- **AI Content Generation Risks** — Training knowledge of LLM hallucination patterns, Arabic-specific generation challenges (diacritics, root systems, grammatical complexity)

### Tertiary (LOW confidence, needs validation)
- **Quranic Text APIs** — Assumption that Quran.com and Tanzil.net still provide authoritative Uthmanic Hafs text in 2026 (knowledge cutoff January 2025, should verify current status)
- **Expert Validation Time Estimates** — 250-340 hours estimated based on scope (73 lessons × grammar review + 365-730 exercises × validation + cultural sensitivity pass), but actual time may vary with expert efficiency and error rates discovered
- **Specific Lesson Topic Ordering** — Level 1-5 topic suggestions based on typical Arabic curriculum progression, but exact ordering may benefit from expert Arabic pedagogy review before finalizing

---

*Research completed: 2026-02-06*
*Ready for roadmap: yes*
*Next step: Roadmapper agent structures phases with implementation tasks*
