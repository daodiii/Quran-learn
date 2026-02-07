---
phase: quick
plan: 001
type: execute
wave: 1
depends_on: []
files_modified:
  - src/content/resources/glossary.mdx
autonomous: true

must_haves:
  truths:
    - "All 1196 internal cross-reference links resolve to valid routes"
    - "All glossary anchor references from lessons resolve to actual anchor IDs in glossary.mdx"
    - "Link validator reports 0 errors and 0 warnings"
  artifacts:
    - path: "src/content/resources/glossary.mdx"
      provides: "Glossary with explicit anchor IDs matching lesson references"
      contains: "id=\"mubtada\""
  key_links:
    - from: "src/content/lessons/**/*.mdx"
      to: "src/content/resources/glossary.mdx"
      via: "markdown links with #anchor fragments"
      pattern: "/resources/glossary#[a-z-]+"
---

<objective>
Fix 247 broken glossary anchor warnings by adding explicit `id` attributes to glossary.mdx headings, then verify all cross-reference links and commit the complete fix (84 already-modified lesson files + glossary fix).

Purpose: Eliminate all link validation warnings so the QA report shows 0 link issues.
Output: Zero-warning link validation across all 79 content files.
</objective>

<execution_context>
@/Users/daodilyas/.claude/get-shit-done/workflows/execute-plan.md
@/Users/daodilyas/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/content/resources/glossary.mdx
@scripts/validate-links.ts
@scripts/fix-cross-references.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add explicit anchor IDs to all glossary headings</name>
  <files>src/content/resources/glossary.mdx</files>
  <action>
The glossary has ~90 `### Heading` entries. Lessons reference these via Arabic transliteration anchors (e.g., `/resources/glossary#mubtada`) but the headings generate English auto-anchors (e.g., `#subject-nominal`). Fix by converting each `### Heading` to `<h3 id="arabic-anchor">Heading</h3>`.

There are 125 unique missing anchor IDs referenced 247 times across lesson files. Each anchor maps to a specific glossary heading based on the Arabic transliteration in the `**Arabic:**` line below each heading.

**Complete mapping of anchor IDs to glossary headings:**

Headings under `<h2 id="alif">` (already h2 with id):
- `### Root` -> `<h3 id="jadhr">Root</h3>`
- `### Accusative Case` -> `<h3 id="nasb">Accusative Case</h3>`
- `### Active Participle` -> `<h3 id="ism-fail">Active Participle</h3>`
- `### Demonstrative Pronoun` -> `<h3 id="ism-isharah">Demonstrative Pronoun</h3>`
- `### Noun of Instrument` -> leave as `### Noun of Instrument` (not referenced by any missing anchor)
- `### Noun of Place` -> `<h3 id="ism-makan">Noun of Place</h3>`
- `### Noun of Time` -> `<h3 id="ism-zaman">Noun of Time</h3>`
- `### Grammatical Analysis` -> `<h3 id="irab">Grammatical Analysis</h3>`
- `### Relative Pronoun` -> `<h3 id="ism-mawsul">Relative Pronoun</h3>`
- `### Proper Noun` -> leave as is (not referenced)
- `### Common Noun` -> leave as is (not referenced)
- `### Alif Maqsura` -> leave as is (not referenced)
- `### Alif Wasla` -> `<h3 id="hamza-wasl">Alif Wasla</h3>`

Under `<h2 id="ba">`:
- `### Rhetoric` -> `<h3 id="balaghah">Rhetoric</h3>`

Under `<h2 id="ta">`:
- `### Specification` -> `<h3 id="tamyiz">Specification</h3>`
- `### Emphasis` -> `<h3 id="tawkid">Emphasis</h3>`
- `### Postponing` -> leave as is (not referenced by missing anchor)
- `### Fronting` -> `<h3 id="taqdim">Fronting</h3>`
- `### Simile` -> `<h3 id="tashbih">Simile</h3>`
- `### Case Ending` -> `<h3 id="tanween">Case Ending</h3>`

Under `<h2 id="tha">`:
- `### Trilateral Root` -> `<h3 id="thulathi">Trilateral Root</h3>`

Under `<h2 id="jim">`:
- `### Genitive Case` -> `<h3 id="jarr">Genitive Case</h3>`
- `### Result Clause` -> `<h3 id="jawab-ash-shart">Result Clause</h3>`
- `### Condition Clause` -> `<h3 id="jumlat-ash-shart">Condition Clause</h3>`
- `### Conditional Sentence` -> leave as is (not in missing list)
- `### Nominal Sentence` -> `<h3 id="jumlah-ismiyyah">Nominal Sentence</h3>`
- `### Verbal Sentence` -> `<h3 id="jumlah-filiyyah">Verbal Sentence</h3>`

Under `<h2 id="ha-emphatic">`:
- `### Circumstantial Clause` -> `<h3 id="hal">Circumstantial Clause</h3>`
- `### Genitive Particle` -> `<h3 id="harf-jarr">Genitive Particle</h3>`
- `### Particle` -> `<h3 id="harf">Particle</h3>`
- `### First Root Letter` -> leave as is (not referenced)
- `### Root Letters` -> `<h3 id="huruf-al-jadhr">Root Letters</h3>`

Under `<h2 id="kha">`:
- `### Predicate` -> `<h3 id="khabar">Predicate</h3>`
- `### Predicate of Inna` -> `<h3 id="khabar-inna">Predicate of Inna</h3>`
- `### Predicate of Kaana` -> `<h3 id="khabar-kaana">Predicate of Kaana</h3>`
- `### Elision` -> `<h3 id="hadhf">Elision</h3>`

Under `<h2 id="dal">`:
- `### Short Vowel U` -> `<h3 id="damma">Short Vowel U</h3>`
- `### Dammatain` -> leave as is (not referenced)
- `### Attached Pronoun` -> `<h3 id="damir-muttasil">Attached Pronoun</h3>`
- `### Subject Pronoun` -> `<h3 id="damir-munfasil">Subject Pronoun</h3>`
- `### Hidden Pronoun` -> `<h3 id="damir-raf">Hidden Pronoun</h3>`

Under `<h2 id="ra">`:
- `### Nominative Case` -> `<h3 id="raf">Nominative Case</h3>`
- `### Quadrilateral Root` -> `<h3 id="rubai">Quadrilateral Root</h3>`
- `### Lord (Context-specific usage)` -> leave as is (not referenced)

Under `<h2 id="zay">`:
- `### Pattern` -> `<h3 id="wazn">Pattern</h3>` (Note: wazn is under zay because of Arabic letter ordering; the heading is at line 1133 which is in the zay section)

Under `<h2 id="sin">`:
- `### Past Tense` -> `<h3 id="madi">Past Tense</h3>`
- `### Vowelless` -> `<h3 id="sukun">Vowelless</h3>`

Under `<h2 id="shin">`:
- `### Conditional Particle` -> `<h3 id="adat-ash-shart">Conditional Particle</h3>`
- `### Doubled Consonant` -> `<h3 id="shadda">Doubled Consonant</h3>` (also add anchor `shaddah` as alias)

Under `<h2 id="sad">`:
- `### Sound Verb` -> `<h3 id="fil-sahih">Sound Verb</h3>`
- `### Nominative Marker` -> leave as is (duplicate of damma)

Under `<h2 id="ta-emphatic">`:
- `### Adverb of Time` -> leave as is (not referenced)
- `### Adverb of Place` -> leave as is (not referenced)

Under `<h2 id="ayn">`:
- `### Second Root Letter` -> leave as is (not referenced)

Under `<h2 id="fa">`:
- `### Subject (Verbal)` -> `<h3 id="fail">Subject (Verbal)</h3>`
- `### Short Vowel A` -> `<h3 id="fatha">Short Vowel A</h3>`
- `### Fathatain` -> leave as is (not referenced)
- `### Verb` -> `<h3 id="fil">Verb</h3>`
- `### Verb Form I` -> `<h3 id="fil-mujarrad">Verb Form I</h3>`
- `### Weak Verb` -> `<h3 id="fil-mutall">Weak Verb</h3>`
- `### Hollow Verb` -> `<h3 id="fil-ajwaf">Hollow Verb</h3>`
- `### Defective Verb` -> `<h3 id="fil-naqis">Defective Verb</h3>`
- `### Assimilated Verb` -> `<h3 id="fil-mithal">Assimilated Verb</h3>`
- `### Doubly Weak Verb` -> `<h3 id="fil-lafif">Doubly Weak Verb</h3>`
- `### Imperative` -> `<h3 id="amr">Imperative</h3>`
- `### Verb Form II` -> `<h3 id="tafil">Verb Form II</h3>` (taf'il pattern)
- `### Verb Form III` -> `<h3 id="mufalah">Verb Form III</h3>` (mufa'alah pattern)
- `### Verb Form IV` -> `<h3 id="ifal">Verb Form IV</h3>` (if'al pattern)
- `### Verb Form V` -> `<h3 id="form-v">Verb Form V</h3>`
- `### Verb Form VI` -> `<h3 id="form-vi">Verb Form VI</h3>`
- `### Verb Form VII` -> `<h3 id="mutawa">Verb Form VII</h3>` (mutawa pattern - infi'al)
- `### Verb Form VIII` -> `<h3 id="musharakah">Verb Form VIII</h3>` (ifti'al - sharing/participation)
- `### Verb Form IX` -> leave as is (not referenced)
- `### Verb Form X` -> leave as is (not referenced by missing anchor)

Under `<h2 id="qaf">`:
- (no entries referenced)

Under `<h2 id="kaf">`:
- `### Kaana and Sisters` -> `<h3 id="kaana-sisters">Kaana and Sisters</h3>` (also add `kana-sisters` alias)
- `### Short Vowel I` -> `<h3 id="kasra">Short Vowel I</h3>`
- `### Kasratain` -> leave as is (not referenced)

Under `<h2 id="lam">`:
- `### Third Root Letter` -> leave as is (not referenced)

Under `<h2 id="mim">`:
- `### Object` -> `<h3 id="mafool">Object</h3>` (also add aliases: `maful-bih`, `maful-bihi`)
- `### Absolute Object` -> `<h3 id="mafool-mutlaq">Absolute Object</h3>`
- `### Passive Participle` -> `<h3 id="ism-mafool">Passive Participle</h3>`
- `### Verbal Noun` -> `<h3 id="masdar">Verbal Noun</h3>`
- `### Indicative Mood` -> `<h3 id="marfu">Indicative Mood</h3>`
- `### Subjunctive Mood` -> `<h3 id="manut">Subjunctive Mood</h3>` (also add `nasb` as secondary... wait, nasb is Accusative Case)
- `### Jussive Mood` -> `<h3 id="majzum">Jussive Mood</h3>` (also add `jussive` alias)
- `### Indeclinable` -> leave as is (not referenced)
- `### Subject (Nominal)` -> `<h3 id="mubtada">Subject (Nominal)</h3>`
- `### Present Tense` -> `<h3 id="mudari">Present Tense</h3>`
- `### Excepted Noun` -> `<h3 id="mustathna">Excepted Noun</h3>`
- `### Declinable` -> leave as is (not referenced)
- `### Definite` -> `<h3 id="marifah">Definite</h3>`
- `### Described Noun` -> `<h3 id="manut">Described Noun</h3>` -- WAIT. "manut" appears for BOTH Subjunctive Mood and Described Noun. Let me re-check.

Actually, re-checking: `manut` maps to `### Described Noun` (Arabic: man'ut) meaning the noun being described. The Subjunctive Mood's Arabic is `mansub`, and lessons reference it differently. Let me correct:
- `### Subjunctive Mood` -> `<h3 id="mansub">Subjunctive Mood</h3>` -- but `mansub` is NOT in the missing list. Looking again at missing list: `manut` IS in the missing list. And `### Described Noun` has Arabic: مَنْعُوت (man'ut). So `manut` -> `### Described Noun`.

Under `<h2 id="nun">`:
- `### Indefinite` -> leave as is (not referenced by missing anchor)
- `### Adjective` -> `<h3 id="nat">Adjective</h3>`

Under `<h2 id="ha">`:
- `### Hamza` -> leave as is (not referenced)

Advanced Terms section:
- `### Exception` -> `<h3 id="istithna">Exception</h3>`
- `### Metaphor` -> `<h3 id="istiarah">Metaphor</h3>`
- `### Possessive Construction` -> `<h3 id="idafah">Possessive Construction</h3>`
- `### Inna and Sisters` -> `<h3 id="inna-sisters">Inna and Sisters</h3>`
- `### Name of Inna` -> `<h3 id="ism-inna">Name of Inna</h3>`
- `### Name of Kaana` -> `<h3 id="ism-kaana">Name of Kaana</h3>`
- `### Noun` -> `<h3 id="ism">Noun</h3>`
- `### Definite Article` -> `<h3 id="al">Definite Article</h3>`
- `### Ta Marbuta` -> `<h3 id="taa-marbuta">Ta Marbuta</h3>`
- `### Madda` -> leave as is (not referenced)

**Anchors that need NEW glossary entries** (no existing heading matches):

These 30+ anchors reference terms that have no dedicated glossary section. For each, add a short anchor-only entry near the most relevant existing entry, using an invisible anchor pattern: `<span id="anchor-id"></span>` placed before the most relevant existing heading. Group by concept:

**Phonology/Script terms (add before Root entry under Alif section):**
Add a new section at the TOP of the Alif section (after `<h2 id="alif">`):

```
<span id="huruf-al-hija"></span>
<span id="harakat"></span>
<span id="huruf-qamariyyah"></span>
<span id="huruf-shamsiyyah"></span>
<span id="hurufu-l-illah"></span>
<span id="bismillah"></span>
```

**Negation terms (add before Conditional Particle):**
```
<span id="adawat-al-nafy"></span>
```

**Verb-related terms (add before Verb Form I):**
```
<span id="fil-rubai-mazid"></span>
<span id="fil-mahmuz"></span>
```

**Grammar terms missing standalone entries:**
For these, add `<span id="..."></span>` anchors before the most semantically related heading:

- `exception-particle` -> before Exception entry
- `badal` -> before Described Noun entry
- `mafool-li-ajlih` -> before Absolute Object entry
- `mafool-maah` -> before Absolute Object entry
- `muannath` -> before Ta Marbuta entry (feminine marker)
- `mudhakkar` -> before Ta Marbuta entry
- `mufrad` -> before Subject (Nominal) entry
- `muthanna` -> before Subject (Nominal) entry
- `jam` -> before Subject (Nominal) entry (collective for plural types below)
- `jam-muannath-salim` -> before Subject (Nominal) entry
- `jam-mudhakkar-salim` -> before Subject (Nominal) entry
- `jam-taksir` -> before Subject (Nominal) entry
- `mudaf` -> before Possessive Construction entry
- `mudaf-ilayh` -> before Possessive Construction entry
- `sahib-al-hal` -> before Circumstantial Clause entry
- `silah` -> before Relative Pronoun entry
- `munada` -> before Noun entry (vocative)
- `kinayah` -> before Metaphor entry (metonymy)
- `ijaz` -> before Rhetoric entry (conciseness)
- `ilm-al-badi` -> before Rhetoric entry
- `ilm-al-bayan` -> before Rhetoric entry
- `ilm-al-maani` -> before Rhetoric entry
- `qasam` -> before Result Clause entry (oath)
- `jawab-al-qasam` -> before Result Clause entry
- `mubalagha` -> before Active Participle entry (intensive form)
- `aid` -> leave as is if not matchable (might be a typo in content)
- `tadif` -> before Verb Form II entry (causative)
- `tadiya` -> before Verb Form IV entry (transitivization)
- `tasharuk` -> before Verb Form VI entry (mutual action)

**Implementation approach:**
1. Read the entire glossary.mdx file
2. For each `### Heading` that maps to a missing anchor, replace `### Heading` with `<h3 id="anchor-id">Heading</h3>`
3. For headings that need multiple anchor aliases, prepend `<span id="alias"></span>` before the `<h3>` tag
4. For anchors with no matching heading, insert `<span id="anchor"></span>` before the most semantically related heading
5. Write the updated file

**Important:** The validate-links.ts script looks for `id="..."` patterns in the glossary to build its anchor set. Both `<h3 id="...">` and `<span id="...">` will be detected.

**Do NOT:**
- Change any existing content text
- Add new full glossary entries (too much content to generate)
- Modify any lesson files (those are already fixed)
- Break existing `<h2 id="...">` letter section headers
  </action>
  <verify>
Run `npx tsx scripts/validate-links.ts 2>&1 | grep -c "Glossary anchor"` and confirm the count is 0 (or drastically reduced from 247).
  </verify>
  <done>All 125 unique glossary anchor IDs referenced by lessons exist in glossary.mdx, eliminating 247 warnings.</done>
</task>

<task type="auto">
  <name>Task 2: Validate zero warnings and commit all fixes</name>
  <files>src/content/resources/glossary.mdx, src/content/lessons/**/*.mdx</files>
  <action>
1. Run the full link validator: `npx tsx scripts/validate-links.ts`
2. Confirm output shows 0 errors AND 0 warnings
3. If any warnings remain, fix them (likely a few anchor ID typos or missed entries)
4. Run the cross-reference fix script in dry-run to confirm no regressions: `npx tsx scripts/fix-cross-references.ts --dry-run`
5. Confirm it reports 0 fixes needed (all already valid)
6. Stage and commit all changes:
   - 84 already-modified lesson/config/script files (cross-reference link fixes)
   - glossary.mdx (anchor ID additions)
   - Commit message: "fix: resolve ~870 broken cross-reference links and 247 glossary anchor warnings"
  </action>
  <verify>
- `npx tsx scripts/validate-links.ts` shows "Errors: 0" and "Warnings: 0"
- `npx tsx scripts/fix-cross-references.ts --dry-run` shows "Fixed: 0" and "Could not resolve: 0"
- `git log -1 --oneline` shows the commit
  </verify>
  <done>All link validation passes with 0 errors and 0 warnings. All changes committed in a single atomic commit.</done>
</task>

</tasks>

<verification>
- `npx tsx scripts/validate-links.ts` reports 0 errors, 0 warnings across all 79 files
- `npx tsx scripts/fix-cross-references.ts --dry-run` reports all 1196 links already valid
- Git shows clean working tree after commit
</verification>

<success_criteria>
- Link validator: 0 errors, 0 warnings (down from 0 errors, 247 warnings)
- Cross-reference validator: 1196/1196 links valid (down from ~326 broken)
- Single commit containing all 85+ file changes
</success_criteria>

<output>
After completion, create `.planning/quick/001-fix-cross-references-glossary-anchors/001-SUMMARY.md`
</output>
