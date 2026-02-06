# Terminology Standards: Quranic Arabic Grammar

**Purpose:** This document establishes the canonical bilingual terminology for all Arabic grammar concepts used across the 73 lessons in the Quranic Arabic curriculum. It ensures consistency in how we introduce and reference Arabic grammatical terms throughout the learning journey.

Every Arabic grammar concept has three components:
1. **English term** - The accessible name learners will recognize
2. **Arabic term** - The traditional grammatical term used by scholars (with full tashkeel)
3. **Transliteration** - Romanized pronunciation using simplified ALA-LC

This tri-lingual approach (per PDGY-03) ensures learners build vocabulary in both English and Arabic while developing proper pronunciation.

## Usage Rules

### 1. First-Mention Rule
On first mention within each lesson, ALWAYS use the full bilingual format:

**Format:** `English term (transliteration / عَرَبِي)`

**Examples:**
- "Nominative case (rafʿ / رَفْع)"
- "Subject of nominal sentence (mubtadaʾ / مُبْتَدَأ)"
- "Definite article (al- / أَل)"

### 2. Subsequent Mentions
After the first mention, you may use:
- **English only:** "The nominative case indicates the subject..."
- **English (Arabic) shorthand:** "The subject (مُبْتَدَأ) comes first..."
- **NEVER** Arabic-only without English context

### 3. Glossary Links
On first mention, link to the glossary:

```markdown
[Nominative case](/resources/glossary#raf) (rafʿ / رَفْع)
```

### 4. Consistency Requirement
ALWAYS use the EXACT English and Arabic terms from this document. Never use synonyms or variant spellings. Validation scripts will enforce this standard.

---

## Grammar Terms (Nahw)

### Sentence Types

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Nominal sentence | جُمْلَة اِسْمِيَّة | jumlah ismiyyah | Sentence beginning with a noun | L2.01 |
| Verbal sentence | جُمْلَة فِعْلِيَّة | jumlah fiʿliyyah | Sentence beginning with a verb | L2.03 |
| Subject (nominal) | مُبْتَدَأ | mubtadaʾ | Subject of nominal sentence | L2.02 |
| Predicate (nominal) | خَبَر | khabar | Predicate of nominal sentence | L2.02 |

### Case System

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Grammatical analysis | إِعْرَاب | iʿrāb | System of case endings | L1.11 |
| Nominative case | رَفْع | rafʿ | Subject case marker | L2.04 |
| Accusative case | نَصْب | naṣb | Object case marker | L2.05 |
| Genitive case | جَرّ | jarr | Possessive/prepositional case marker | L2.06 |
| Nominative marker | ضَمَّة | ḍammah | ـُ vowel mark indicating nominative | L2.04 |
| Accusative marker | فَتْحَة | fatḥah | ـَ vowel mark indicating accusative | L2.05 |
| Genitive marker | كَسْرَة | kasrah | ـِ vowel mark indicating genitive | L2.06 |
| Case ending | تَنْوِين | tanwīn | Nunation (-an, -in, -un) | L1.09 |
| Indeclinable | مَبْنِي | mabnī | Word with fixed ending (not declined) | L2.12 |
| Declinable | مُعْرَب | muʿrab | Word with changing case endings | L2.12 |

### Word Types

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Noun | اِسْم | ism | A word that has meaning by itself, not bound to time | L1.06 |
| Verb | فِعْل | fiʿl | A word indicating action bound to time | L1.06 |
| Particle | حَرْف | ḥarf | A word with meaning only in context | L1.06 |
| Definite article | أَل | al- | The definite prefix in Arabic | L1.07 |
| Proper noun | اِسْم عَلَم | ism ʿalam | Name of a specific person, place, or thing | L1.08 |
| Common noun | اِسْم جِنْس | ism jins | General category noun | L1.08 |

### Sentence Components

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Subject (verbal) | فَاعِل | fāʿil | Doer of the action in verbal sentence | L2.03 |
| Object | مَفْعُول بِهِ | mafʿūl bihi | Direct object receiving the action | L2.05 |
| Preposition | حَرْف جَرّ | ḥarf jarr | Genitive-triggering particle | L2.07 |
| Possessive construction | إِضَافَة | iḍāfah | Noun-noun genitive construct (X of Y) | L2.08 |
| Adjective | نَعْت | naʿt | Modifier following and agreeing with noun | L2.09 |
| Described noun | مَنْعُوت | manʿūt | Noun being described by adjective | L2.09 |
| Adverb of time | ظَرْف زَمَان | ẓarf zamān | Time expression (yesterday, tomorrow) | L3.06 |
| Adverb of place | ظَرْف مَكَان | ẓarf makān | Place expression (here, above, below) | L3.06 |

### Inna and Kaana Families

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Inna and sisters | إِنَّ وَأَخَوَاتُهَا | inna wa akhawātuhā | Particles that modify nominal sentences (إِنَّ، أَنَّ، لَكِنَّ، etc.) | L2.10 |
| Kaana and sisters | كَانَ وَأَخَوَاتُهَا | kāna wa akhawātuhā | Defective verbs modifying nominal sentences (كَانَ، أَصْبَحَ، etc.) | L2.11 |
| Name of inna | اِسْم إِنَّ | ism inna | Subject of inna (in accusative) | L2.10 |
| Predicate of inna | خَبَر إِنَّ | khabar inna | Predicate of inna (remains nominative) | L2.10 |
| Name of kaana | اِسْم كَانَ | ism kāna | Subject of kaana (remains nominative) | L2.11 |
| Predicate of kaana | خَبَر كَانَ | khabar kāna | Predicate of kaana (in accusative) | L2.11 |

### Definiteness and Indefiniteness

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Definite | مَعْرِفَة | maʿrifah | Definite noun (specific referent) | L1.10 |
| Indefinite | نَكِرَة | nakirah | Indefinite noun (non-specific) | L1.10 |
| Proper noun definiteness | تَعْرِيف بِالعَلَمِيَّة | taʿrīf bi-l-ʿalamiyyah | Definiteness through being a proper name | L1.10 |
| Article definiteness | تَعْرِيف بِأَل | taʿrīf bi-al | Definiteness through the article ال | L1.10 |

### Advanced Syntax (Level 3-5)

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Root | جَذْر | jadhr | Three-letter root of Arabic words | L3.01 |
| Pattern | وَزْن | wazn | Morphological template applied to root | L3.02 |
| Conditional sentence | جُمْلَة شَرْطِيَّة | jumlah sharṭiyyah | If-then sentence structure | L3.08 |
| Conditional particle | أَدَاة الشَّرْط | adāt ash-sharṭ | Particle introducing condition (إِن، إِذَا) | L3.08 |
| Condition clause | جُمْلَة الشَّرْط | jumlat ash-sharṭ | The "if" clause | L3.08 |
| Result clause | جَوَاب الشَّرْط | jawāb ash-sharṭ | The "then" clause | L3.08 |
| Exception | اِسْتِثْنَاء | istithnāʾ | Exclusion using إِلَّا (except) | L3.09 |
| Excepted noun | مُسْتَثْنَى | mustathnā | Noun following إِلَّا | L3.09 |
| Emphasis | تَوْكِيد | tawkīd | Grammatical emphasis (repetition, particles) | L4.05 |
| Circumstantial clause | حَال | ḥāl | Clause describing state during action | L4.06 |
| Specification | تَمْيِيز | tamyīz | Clarifying noun after vague quantity | L4.07 |
| Absolute object | مَفْعُول مُطْلَق | mafʿūl muṭlaq | Verbal noun repeating verb meaning | L4.08 |
| Cognate accusative | مَصْدَر | maṣdar | Source/verbal noun | L3.05 |

### Rhetoric (Balagha)

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Rhetoric | بَلَاغَة | balāghah | Science of eloquent expression | L5.01 |
| Metaphor | اِسْتِعَارَة | istiʿārah | Implied comparison (metaphor) | L5.03 |
| Simile | تَشْبِيه | tashbīh | Explicit comparison (simile) | L5.02 |
| Ellipsis | حَذْف | ḥadhf | Omission of understood elements | L5.04 |
| Fronting | تَقْدِيم | taqdīm | Placing element before normal position | L5.05 |
| Postponing | تَأْخِير | taʾkhīr | Delaying element from normal position | L5.05 |

---

## Morphology Terms (Sarf)

### Root and Pattern System

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Root letters | حُرُوف الجَذْر | ḥurūf al-jadhr | The 3-4 consonants forming word root | L3.01 |
| Trilateral root | ثُلَاثِي | thulāthī | Three-letter root (most common) | L3.01 |
| Quadrilateral root | رُبَاعِي | rubāʿī | Four-letter root (less common) | L3.01 |
| First root letter | فَاء الفِعْل | fāʾ al-fiʿl | First radical (ف in فعل template) | L3.01 |
| Second root letter | عَيْن الفِعْل | ʿayn al-fiʿl | Second radical (ع in فعل template) | L3.01 |
| Third root letter | لَام الفِعْل | lām al-fiʿl | Third radical (ل in فعل template) | L3.01 |

### Verb Forms (Awzan)

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Verb Form I | الفِعْل الأَوَّل | al-fiʿl al-awwal | Basic verb form (فَعَلَ) | L3.03 |
| Verb Form II | الفِعْل الثَّانِي | al-fiʿl ath-thānī | Doubled middle letter (فَعَّلَ) - intensive/causative | L3.10 |
| Verb Form III | الفِعْل الثَّالِث | al-fiʿl ath-thālith | Long vowel after first letter (فَاعَلَ) - reciprocal | L3.11 |
| Verb Form IV | الفِعْل الرَّابِع | al-fiʿl ar-rābiʿ | Prefix أَ (أَفْعَلَ) - causative | L3.12 |
| Verb Form V | الفِعْل الخَامِس | al-fiʿl al-khāmis | تَفَعَّلَ - reflexive of Form II | L4.01 |
| Verb Form VI | الفِعْل السَّادِس | al-fiʿl as-sādis | تَفَاعَلَ - reciprocal of Form III | L4.02 |
| Verb Form VII | الفِعْل السَّابِع | al-fiʿl as-sābiʿ | اِنْفَعَلَ - passive/reflexive | L4.03 |
| Verb Form VIII | الفِعْل الثَّامِن | al-fiʿl ath-thāmin | اِفْتَعَلَ - reflexive | L4.04 |
| Verb Form IX | الفِعْل التَّاسِع | al-fiʿl at-tāsiʿ | اِفْعَلَّ - colors/defects (rare) | L4.09 |
| Verb Form X | الفِعْل العَاشِر | al-fiʿl al-ʿāshir | اِسْتَفْعَلَ - seeking/requesting | L4.10 |

### Tenses and Moods

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Past tense | الفِعْل المَاضِي | al-fiʿl al-māḍī | Completed action in past | L1.06 |
| Present tense | الفِعْل المُضَارِع | al-fiʿl al-muḍāriʿ | Ongoing or future action | L2.13 |
| Imperative | فِعْل الأَمْر | fiʿl al-amr | Command form | L2.14 |
| Indicative mood | مَرْفُوع | marfūʿ | Default mood (with ضَمَّة) | L2.13 |
| Subjunctive mood | مَنْصُوب | manṣūb | Subjunctive (with فَتْحَة) after أَن، لَن | L3.07 |
| Jussive mood | مَجْزُوم | majzūm | Jussive (shortened) after لَم، لَمّا | L3.07 |

### Derived Nouns

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Active participle | اِسْم الفَاعِل | ism al-fāʿil | Noun indicating doer (فَاعِل pattern) | L3.04 |
| Passive participle | اِسْم المَفْعُول | ism al-mafʿūl | Noun indicating recipient (مَفْعُول pattern) | L3.04 |
| Verbal noun | مَصْدَر | maṣdar | Abstract noun from verb (كِتَابَة from كَتَبَ) | L3.05 |
| Noun of place | اِسْم المَكَان | ism al-makān | Noun indicating place of action (مَكْتَب - office) | L3.13 |
| Noun of time | اِسْم الزَّمَان | ism az-zamān | Noun indicating time of action (مَوْعِد - appointment) | L3.13 |
| Noun of instrument | اِسْم الآلَة | ism al-ālah | Noun indicating tool (مِفْتَاح - key) | L3.14 |

### Pronouns

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Subject pronoun | ضَمِير مُنْفَصِل | ḍamīr munfaṣil | Independent/detached pronoun (أَنَا، هُوَ) | L1.12 |
| Attached pronoun | ضَمِير مُتَّصِل | ḍamīr muttaṣil | Suffix pronoun (-هُ، -كَ، -نَا) | L2.15 |
| Hidden pronoun | ضَمِير مُسْتَتِر | ḍamīr mustatir | Implied pronoun in verb conjugation | L2.16 |
| Demonstrative | اِسْم الإِشَارَة | ism al-ishārah | Demonstrative pronoun (هَذَا، تِلْكَ) | L2.17 |
| Relative pronoun | اِسْم المَوْصُول | ism al-mawṣūl | Relative pronoun (الَّذِي، الَّتِي) | L2.18 |

### Verb Classifications

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Sound verb | فِعْل صَحِيح | fiʿl ṣaḥīḥ | Verb with all strong consonants | L3.15 |
| Weak verb | فِعْل مُعْتَلّ | fiʿl muʿtall | Verb containing weak letter (و، ي، ا) | L3.16 |
| Hollow verb | فِعْل أَجْوَف | fiʿl ajwaf | Weak letter as middle radical (قَالَ) | L3.17 |
| Defective verb | فِعْل نَاقِص | fiʿl nāqiṣ | Weak letter as final radical (مَشَى) | L3.18 |
| Assimilated verb | فِعْل مِثَال | fiʿl mithāl | Weak letter as first radical (وَجَدَ) | L4.11 |
| Doubly weak verb | فِعْل لَفِيف | fiʿl lafīf | Two weak letters in same verb | L4.12 |

---

## Diacritics & Writing

### Vowel Marks (Harakat)

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Short vowel A | فَتْحَة | fatḥah | ـَ mark indicating "a" sound | L1.02 |
| Short vowel I | كَسْرَة | kasrah | ـِ mark indicating "i" sound | L1.02 |
| Short vowel U | ضَمَّة | ḍammah | ـُ mark indicating "u" sound | L1.02 |
| Vowelless | سُكُون | sukūn | ـْ mark indicating no vowel | L1.03 |
| Doubled consonant | شَدَّة | shaddah | ـّ mark indicating gemination | L1.04 |

### Nunation (Tanween)

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Nunation | تَنْوِين | tanwīn | Double vowel mark adding "-n" sound | L1.09 |
| Fathatain | فَتْحَتَيْن | fatḥatayn | ـً marking "-an" (accusative indefinite) | L1.09 |
| Kasratain | كَسْرَتَيْن | kasratayn | ـٍ marking "-in" (genitive indefinite) | L1.09 |
| Dammatain | ضَمَّتَيْن | ḍammatayn | ـٌ marking "-un" (nominative indefinite) | L1.09 |

### Special Characters

| English | Arabic | Transliteration | Definition | First Used |
|---------|--------|-----------------|------------|------------|
| Hamza | هَمْزَة | hamzah | ء glottal stop | L1.05 |
| Hamza above alif | أَ | ʾa | Hamza seated on alif (أَ) | L1.05 |
| Hamza below alif | إِ | ʾi | Hamza seated below alif (إِ) | L1.05 |
| Ta marbuta | تَاء مَرْبُوطَة | tāʾ marbūṭah | ة feminine ending | L1.11 |
| Alif maqsura | أَلِف مَقْصُورَة | alif maqṣūrah | ى final "a" sound (looks like ي) | L2.19 |
| Alif wasla | أَلِف الوَصْل | alif al-waṣl | Silent alif joined in pronunciation (ٱ) | L2.20 |
| Madda | مَدَّة | maddah | آ extended alif (hamza + long alif) | L1.05 |

---

## Notes on Usage

### Transliteration Conventions

This terminology document uses simplified ALA-LC transliteration:
- **ʾ** (hamza) = glottal stop ء
- **ʿ** (ayn) = pharyngeal sound ع
- **Underdots** (ḥ, ṣ, ḍ, ṭ, ẓ) = emphatic consonants
- **Long vowels** (ā, ī, ū) = extended sounds
- **Short vowels** (a, i, u) = brief sounds

See STYLE_GUIDE.md for complete transliteration tables.

### First-Used Lesson References

Lesson IDs follow the format `L[Level].[Lesson]`:
- **L1.01-L1.12**: Level 1 Foundation (12 lessons)
- **L2.01-L2.20**: Level 2 Core Grammar (20 lessons)
- **L3.01-L3.18**: Level 3 Morphology (18 lessons)
- **L4.01-L4.12**: Level 4 Advanced Syntax (12 lessons)
- **L5.01-L5.11**: Level 5 Rhetoric & Analysis (11 lessons)

Total: 73 lessons

---

**Version:** 1.0
**Last updated:** 2026-02-06
**Maintained by:** Curriculum Planning Team
**Validation:** Enforced by `scripts/validate-terminology.ts`
