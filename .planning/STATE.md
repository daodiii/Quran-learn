# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-06)

**Core value:** Make learning Quranic Arabic grammar accessible and engaging through beautiful, intuitive design
**Current focus:** Phase 15 IN PROGRESS — Level 4 Advanced Lessons (9 plans created, 9/9 executed).

## Current Position

Phase: 15 of 17 (Level 4 Advanced Lessons)
Plan: 9 of 9 complete
Status: Phase complete - Level 4 finished (17/17 lessons)
Last activity: 2026-02-07 — Completed 15-09-PLAN.md (L4.16-17 Balagha/Rhetoric Pair)

Progress: [█████████████████░░] 106% (68/63 estimated total plans)

## Performance Metrics

**Velocity (updated):**
- Total plans completed: 68
- Average duration: 8.50 min
- Total execution time: 9.77 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1-8 | 28 | 3.1h | 5.6 min |
| 9 | 3 | 7.4min | 2.5 min |
| 10 | 3 | 17.3min | 5.8 min |
| 11 | 6 | 71.0min | 11.8 min |
| 12 | 5 | 39.0min | 7.8 min |
| 13 | 6 | 93.3min | 15.6 min |
| 14 | 8 | 90.4min | 11.3 min |
| 15 | 9 | 101.4min | 11.3 min |

**Recent Trend:**
- Last 5 plans: [15-04: 14min, 15-06: 15min, 15-08: 7min, 15-07: 10min, 15-09: 13.2min]
- Trend: Phase 15 complete at 11.3min average per plan. Balagha lessons (15-09) took 13.2min for L4.16-17 rhetoric pair (L4.16 already existed from 15-08, L4.17 created with 649 lines, completion milestone, five figures of speech).

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
- Standard sukūn (U+0652) recognized by validator, not U+06E1 (small high dotless head) - use standard for compliance (12-01)
- Quranic verse selection follows CURRICULUM_MAP.md designated surahs for pedagogically appropriate examples (12-01)
- 4 exercises per lesson (exceeds 3-4 minimum) with progressive difficulty pattern (12-01)
- Isolated morpheme diacritics <70% acceptable for pedagogical clarity when showing citation forms (12-03)
- Sun/moon letter naming mnemonic using الشمس and القمر as self-demonstrating examples (12-03)
- Terminology validator false positives on bilingual formats accepted as known bug (12-03)
- Sentence types taught with first-word identification method (L1.10 nominal vs verbal) (12-05)
- Case endings taught as RECOGNITION only in Level 1, mastery deferred to Level 2 (12-05)
- Al-Kafirun (109) chosen for sentence type examples (clear, repetitive structures) (12-05)
- Al-Ikhlas (112) chosen for case ending examples (short, powerful, familiar theology) (12-05)
- Level completion sections include milestone celebration and forward preview (12-05)
- Three-part i'rab analysis format adopted (Function + Case marker + Reason) for Level 2+ grammatical precision (13-01)
- Level 2 lessons emphasize WHEN and WHY (mastery) over WHAT (recognition) to build on Level 1 foundation (13-01)
- Al-Ikhlas chosen for L2.01 nominal sentence examples (theological precision) (13-01)
- An-Nasr chosen for L2.04 nominative case examples (demonstrates four functions clearly) (13-01)
- Three predicate types taught systematically: single word (mufrad), sentence (jumlah), semi-sentence (shibh jumlah) (13-02)
- Embedded subjects emphasized in verbal sentence structure to prevent learner confusion about "missing" subjects (13-02)
- VSO word order contrasted explicitly with English SVO for Arabic verbal sentence mastery (13-02)
- Al-Asr (103) chosen for L2.02 mubtada/khabar examples (compact surah with clear nominal structure) (13-02)
- Al-Kawthar (108) chosen for L2.03 verbal sentence examples (perfect VSO demonstrations) (13-02)
- Three-case system completion strategy: L2.06 completes nom→acc→gen with summary comparison table (13-04)
- Al-Fatiha chosen for genitive case and adjective agreement examples (familiar, pedagogically clear) (13-04)
- Adjective-predicate distinction taught via definiteness pattern (both definite = adjective, mixed = predicate) (13-04)
- Four-part adjective agreement framework: gender, number, case, definiteness as systematic checklist (13-04)
- Six inna sisters documented with before/after case change comparison pedagogy (13-05)
- Eight kaana sisters documented with temporal/modal meaning distinctions (13-05)
- Kaana vs inna comparison table shows mirror-image case modification patterns (13-05)
- Level 2 completion milestone celebration included in L2.11 with Level 3 preview (13-05)
- Morphological i'rab format extends Level 2's Function+Case+Reason with Root+Pattern+Form analysis for Level 3 (14-01)
- Al-Baqarah chosen for L3.01 root system examples (designated surah in CURRICULUM_MAP) (14-01)
- Root ك-ت-ب demonstrated as primary word family with 9 derived words (14-01)
- Five root families taught across L3.01 (ك-ت-ب, ع-ل-م, ح-م-د, س-ل-م, ء-م-ن) totaling 32 word relationships (14-01)
- Form I taught by contrast methodology: show augmented forms (II-X) to clarify Form I as "no augmentation" (14-02)
- Form identification checklist adopted: count letters → check augmentation → verify pattern (systematic method) (14-02)
- Three vowel classes (fa'ala, fa'ila, fa'ula) introduced as unpredictable patterns requiring dictionary consultation (14-02)
- Past tense conjugation taught with suffix-only system (14 persons, two suffix groups) (14-03)
- Sukūn rule for first/second-person past tense: middle root letter takes sukūn (14-03)
- Present tense conjugation taught with prefix+suffix system (four prefixes: أَنَيْتَ mnemonic) (14-03)
- Indicative mood (marfūʿ) with damma ending established as default present tense (subjunctive/jussive deferred) (14-03)
- Past vs present side-by-side comparison pedagogy adopted to show suffix→prefix relationship (14-03)
- Morphological i'rab extended to include Mood analysis for present tense verbs (14-03)
- Form IV causative meaning differentiated from Form II intensive causation (14-05)
- Participles taught with dual function emphasis: identity nouns vs descriptive adjectives (14-05)
- Al-Fatiha ٱلرَّحْمَٰنِ ٱلرَّحِيمِ analyzed as intensive active participle patterns (فَعْلَانُ and فَعِيلٌ) (14-05)
- Imperative derivation taught as 3-step mechanical process (remove prefix, add hamza if needed, conjugate) (14-06)
- Irregular imperatives identified: قُلْ (say), كُلْ (eat), خُذْ (take) must be memorized as exceptions (14-06)
- Explicit vs implicit pronoun distinction established as KEY CONCEPT for Arabic verb system (14-06)
- 12 independent subject pronouns organized systematically by person × gender × number grid (14-06)
- Al-Ikhlas هُوَ pronoun analyzed as emphasis on divine identity: "HE is Allah" (14-06)
- Form V/VI taught as systematic pair showing تَ prefix pattern: Form V = تَ + Form II (reflexive), Form VI = تَ + Form III (mutual) (14-07)
- Shadda vs alif distinction established as key Form V/VI differentiator: Form V has doubled middle, Form VI has alif after first (14-07)
- Three-stage derivation chains (Form I→parent→derived) consistently used to show semantic progression across verb forms (14-07)
- Two-ת present tense structure explained: present prefix + Form V/VI marker creates consecutive ת letters (14-07)
- Forms VII-X taught at recognition level only (not production) with identification markers emphasized over conjugation (14-09)
- Complete 10-form comparison table provides side-by-side reference for all Arabic verb forms (14-09)
- Form I masdars presented as irregular (multiple patterns, must memorize) vs Forms II-X regular (mechanical derivation) (14-09)
- Place/time noun pattern selection based on Form I verb vowel: kasra → mafʿil, fatha/damma → mafʿal (14-09)
- Complete derivation chain exercises reinforce morphological power: root generates verb, participles, masdar, and place/time noun (14-09)
- Level completion milestone sections include backward review and forward preview for learner progression clarity (14-09)
- Same-root requirement emphasized as CRITICAL distinguishing feature of maf'ul mutlaq vs direct object (15-04)
- Four-condition framework for maf'ul li-ajlih adopted (masdar, same agent, same time, heart action) as systematic checklist (15-04)
- Waw al-'atf vs waw al-ma'iyyah distinction taught via case marking as primary objective criterion (15-04)
- Six-function accusative comparison table created as comprehensive reference (direct object, hal, tamyiz, mutlaq, li-ajlih, ma'ah) (15-04)
- Progressive difficulty sequencing for maf'ul types: mutlaq → li-ajlih → ma'ah (concrete to abstract) (15-04)
- Three-rule exception case system adopted (complete affirmative, incomplete negative, disconnected) with decision tree pedagogy (15-03)
- Rule 2 (incomplete negative exception) emphasized as theologically critical: explains لَا إِلَٰهَ إِلَّا ٱللَّهُ nominative case (15-03)
- Emphasis particle strength hierarchy established: inna < qad < la- < la-qad, with stacking creating cumulative effects (15-03)
- Particle emphasis (grammatical tools) vs nominal emphasis (meaning-bearing nouns) taught as two distinct mechanisms (15-03)
- Repetition recognized as emphasis device: word, phrase refrain, and cognate accusative (root repetition) (15-03)
- Comparison tables with side-by-side feature grids effective for distinguishing similar grammatical constructs (hal vs na't, tamyiz vs hal) (15-01)
- Question-based grammatical tests provide systematic identification methods: "Can you make it definite?" for hal/na't, "What question answered?" for tamyiz/hal (15-01)
- Wāw al-ḥāl (وَاوُ ٱلْحَالِ) explicitly taught as marker for sentence hal, not simple conjunction "and" (15-01)
- 3-10 number exception (genitive plural tamyiz) explained as historical remnant of possessive (iḍāfah) construction for linguistic insight (15-01)
- Specialized accusative functions (hal, tamyiz) taught as extension of L2.05 foundation, showing accusative has multiple roles beyond direct object (15-01)
- Two-part conditional pedagogy: structure first (L4.03 shart/jawab), then particle nuances (L4.04) prevents cognitive overload on complex topic (15-02)
- Certainty scale (law-in-idha) as primary organizing framework for conditional particle pedagogy: impossible ← uncertain → expected spectrum (15-02)
- إِنْ vs إِذَا distinction emphasized as most common learner error: إِذَا fundamentally temporal "when" (expected), إِنْ uncertain "if" (15-02)
- Jussive mood markers (deleted nūn for plurals, sukūn for singulars) highlighted as key recognition features in conditional sentences (15-02)
- إِنْ vs إِنَّ distinction (conditional vs emphatic) taught early to prevent shadda confusion in reading conditionals (15-02)
- Isolated word diacritics handled via transliteration in table cells/exercises when 70% threshold cannot be met while maintaining full vocalization in ArabicExample components (15-05)
- Same-verb comparison pedagogy (all five negations of one root) demonstrates systematic grammar variation effectively (15-05)
- Decision tree format for particle selection reduces learner confusion on "which particle?" questions by providing algorithmic method (15-05)
- لَمْ (lam) uniqueness requires explicit three-feature emphasis: present form + past meaning + jussive mood combination makes it distinct (15-05)
- Four-category weak verb classification by position (hollow, defective, assimilated, hamzated) more systematic than traditional exception-based teaching (15-06)
- Principle-based hollow verb pedagogy (3 contraction rules) replaces conjugation memorization for hundreds of verbs (15-06)
- Hollow-waw vs hollow-ya subtype distinction critical for understanding why يَقُولُ has ū but يَبِيعُ has ī (vowel quality preservation) (15-06)
- Transliteration included in hollow verb reference tables despite Level 4 minimal guidelines - justified by learner pronunciation needs for contraction patterns (15-06)
- VerbConjugation component side-by-side tables effective for showing WHEN middle letter drops vs contracts (3rd person contraction vs 1st/2nd person dropping) (15-06)
- 4-step weak verb recognition strategy (find root → identify weak letter → determine position → apply rules) provides systematic approach applicable to any weak verb (15-06)
- Defective verb three transformation principles (past alif, present long vowel, mood interaction) match case/mood system complexity vs hollow verbs' purely phonological changes (15-07)
- Balagha positioned as GATEWAY (Level 4 introduces framework, Level 5 develops mastery through application) prevents overwhelm while establishing foundation (15-09)
- Three-branch balagha framework (ilm al-ma'ani, ilm al-bayan, ilm al-badi') organizes rhetoric into sentence structure, figurative language, and literary beautification (15-09)
- Five essential figures of speech selected (tashbih, isti'arah, kinayah, hadhf, taqdim) for frequency in Quran and branch coverage (2 bayan, 2 ma'ani, 1 badi') (15-09)
- Grammar + rhetoric combined analysis modeled as key skill for Level 5 synthesis (15-09)
- Level completion milestone sections (achievement summary, journey reflection, forward preview) provide psychological closure and readiness for next level (15-09)
- Defective-waw vs defective-ya subtype distinction by present tense vowel quality (ū vs ī) parallels hollow verb waw/ya patterns (15-07)
- Al-Fatiha ٱهْدِنَا chosen for defective verb example due to theological significance as central Islamic supplication recited in every prayer (15-07)
- Assimilated verbs emphasized as simplest weak verb category (one deletion rule) after mastering hollow (3 principles) and defective (mood interaction) for pedagogical momentum (15-07)
- Initial-waw deletion rule applies ONLY to present tense Form I; waw stays in past tense and derived forms II-X (15-07)
- Al-Duha وَجَدَكَ (93:6-8) provides perfect mixed-tense demonstration showing same root و-ج-د with waw present (past) vs deleted (present) in consecutive verses (15-07)
- Hamza seat rules taught via vowel hierarchy (kasra > damma > fatha > sukūn) determines carrier (ya, waw, alif, line) for systematic orthography (15-08)
- Position-based hamza categorization (initial/middle/final) aligns with other weak verb categories and determines conjugation stability patterns (15-08)
- Three irregular imperatives (khudh, kul, mur) documented as memorization exceptions from phonetic simplification (15-08)
- Hamzated verbs distinguished as orthographic irregularities (spelling changes) vs phonetic irregularities (pronunciation changes) in other weak categories (15-08)
- Madda (آ) Unicode validation limitation handled via transliteration in isolated contexts while preserving full Arabic in component/contextual usage (15-08)

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

Last session: 2026-02-07
Stopped at: Completed 15-09-PLAN.md (L4.16-17 Balagha/Rhetoric Pair) — Phase 15 COMPLETE: All 17 Level 4 lessons finished
Resume file: None
Next: Proceed to Phase 16 Level 5 Synthesis Lessons (applied surah analysis, balagha mastery through practice)
