---
phase: quick-002
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - scripts/validate-diacritics.ts
autonomous: true

must_haves:
  truths:
    - "Correctly vocalized Quranic Arabic words no longer trigger false positive warnings"
    - "Words with genuine missing diacritics are still caught by the validator"
    - "Diacritics warning count drops from 310 to near zero"
  artifacts:
    - path: "scripts/validate-diacritics.ts"
      provides: "Arabic-orthography-aware diacritics validation"
      contains: "checkDiacritics"
  key_links:
    - from: "scripts/validate-diacritics.ts"
      to: "scripts/validate-content.ts"
      via: "validateDiacritics export"
      pattern: "validateDiacritics"
---

<objective>
Fix the diacritics validator to understand Arabic orthographic conventions, eliminating ~310 false positive warnings on correctly written Quranic text.

Purpose: The Arabic content is correctly vocalized. The validator's naive letter-counting algorithm does not account for standard Arabic orthographic features (silent letters, long vowels, alif maddah). Fixing the validator eliminates false positives while preserving detection of genuinely unvocalized text.

Output: Updated `scripts/validate-diacritics.ts` with Arabic-orthography-aware counting that reduces diacritics warnings from 310 to near zero.
</objective>

<execution_context>
@/Users/daodilyas/.claude/get-shit-done/workflows/execute-plan.md
@/Users/daodilyas/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@scripts/validate-diacritics.ts
@scripts/validate-content.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update checkDiacritics to account for Arabic orthographic features</name>
  <files>scripts/validate-diacritics.ts</files>
  <action>
Rewrite the `checkDiacritics` function to use an orthography-aware counting algorithm instead of the naive letter-count vs diacritic-count ratio. The current approach counts all Arabic consonant letters (\u0621-\u063A, \u0641-\u064A) and compares against diacritical marks (\u064B-\u065F etc). This fails because Arabic has multiple categories of letters that legitimately do not carry tashkeel.

Implement an `adjustedCheckDiacritics` function that processes the word character-by-character and applies these adjustments:

**1. Silent alif in plural verb endings (وا at word end) -- ~140 false positives**
When a word ends with waw+alif (وا) or waw+alif+small-rounded-zero (وا۟), the final alif (and the small rounded zero if present) is alif al-wiqaya -- a silent orthographic letter. It NEVER carries tashkeel.
- Do NOT count final alif in وا ending as a letter needing diacritics.
- This covers: قَالُوا, ءَامَنُوا۟, تَعَاوَنُوا, جَاهِدُوا, قَاتِلُوا, etc.

**2. Long vowel letters (alif/waw/ya after corresponding short vowel) -- ~50 false positives**
Long vowels in Arabic are formed by a short vowel mark followed by a vowel carrier letter:
- Fatha (\u064E) + alif (ا) = long "aa" -- the alif IS the vowel, does not need its own mark
- Damma (\u064F) + waw (و) = long "uu" -- the waw IS the vowel, does not need its own mark
- Kasra (\u0650) + ya (ي) = long "ii" -- the ya IS the vowel, does not need its own mark

When scanning characters: if an alif/waw/ya is preceded (possibly through other diacritics) by the corresponding short vowel on the previous consonant, count that alif/waw/ya as "has diacritics" (it effectively does -- the preceding vowel serves as its mark).
- This covers: الْمَاضِي (alif after fatha is long vowel), كِتَاب (same), مُضَاف (same)

**3. Alif maddah (آ, \u0622) -- ~20 false positives**
Alif maddah represents hamza + fatha + alif. It is inherently vowelized. When the regex matches the decomposed form, alif maddah may appear as alif (\u0627) + maddah-above (\u0653). But the character آ (\u0622) is a single codepoint.
- Count آ as a letter that HAS diacritics (it's inherently vowelized).
- Also ensure maddah-above (\u0653) is in the ARABIC_DIACRITIC regex if not already.

**4. Alif in definite article ال -- ~30 false positives**
The alif in the definite article ال is alif al-wasl in connected speech -- it does not carry a visible tashkeel mark in standard Quranic typography.
- When a word starts with ال (alif+lam), do not count the initial alif as needing diacritics.
- This covers: النَّاس, الْمَاضِي, الْمُضَارِع, الوَسْوَاس, الفِعْل, اللَّه

**5. Tanween-fatha final alif -- ~20 false positives**
Words ending in tanween-fatha (e.g., مَالًا, احْتِرَامًا, نَارًا) have a final alif that is purely orthographic (written to "carry" the tanween visually). This alif never takes its own diacritical mark.
- When a word ends with tanween-fatha (\u064B) + alif, do not count that final alif as needing diacritics.

**6. Quranic small rounded zero (۟, \u06DF) -- minor**
This mark is already partially handled but ensure it is recognized. Add \u06DF to the ARABIC_DIACRITIC regex if not present. It appears in Uthmani script (e.g., ءَامَنُوا۟).

**7. Alif with hamza below (إ, \u0625) and hamza above (أ, \u0623)**
These are distinct from bare alif. They ARE consonants and DO need diacritics. Do NOT exempt them. The exemptions above apply only to bare alif (\u0627).

**Implementation approach:**

Replace the simple regex-count approach in `checkDiacritics` with a character-by-character scan:

```
function checkDiacritics(text: string): { ratio: number; letters: number; diacritics: number } {
  // Normalize to NFC to handle decomposed forms
  const normalized = text.normalize('NFC');
  const chars = [...normalized];

  let letterCount = 0;    // consonant letters that SHOULD have diacritics
  let diacriticCount = 0; // diacritical marks found

  // Build array of {char, isDiacritic, isLetter, type} for analysis
  // Then apply adjustments for each pattern

  // ... character-by-character logic ...

  return { ratio: letterCount > 0 ? diacriticCount / letterCount : 0, letters: letterCount, diacritics: diacriticCount };
}
```

Key implementation details:
- Process characters left-to-right, tracking "previous consonant" and "previous consonant's diacritics"
- When encountering bare alif (\u0627), check context:
  - If word starts with alif+lam: skip alif (definite article)
  - If preceded by fatha on previous consonant: it's a long vowel, count as diacriticized
  - If at end of word after waw: it's alif al-wiqaya, skip from count
  - If preceded by tanween-fatha at end of word: orthographic alif, skip
- When encountering bare waw (\u0648), check if preceded by damma: long vowel, count as diacriticized
- When encountering bare ya (\u064A), check if preceded by kasra: long vowel, count as diacriticized
- When encountering alif maddah (\u0622): count as a letter WITH diacritics

Keep the existing `ARABIC_LETTER` and `ARABIC_DIACRITIC` regexes for character classification but add \u0653 (maddah above) and \u06DF (small rounded zero) to ARABIC_DIACRITIC if missing.

Keep the existing `extractArabicSegments` function unchanged -- it correctly extracts Arabic text from MDX.

Keep the existing tiered threshold logic in `validateDiacritics` unchanged.

Keep the existing CLI section unchanged.

Update the file header comment to document the orthographic accommodations.
  </action>
  <verify>
Run `npx tsx scripts/validate-content.ts 2>&1 | grep '\[diacritics\]' | wc -l` and confirm count drops from 310 to under 20.

Run `npx tsx scripts/validate-content.ts 2>&1 | tail -10` and confirm 0 errors, drastically reduced warnings.

Spot-check that these specific words NO LONGER trigger warnings:
- قَالُوا (plural verb with silent alif)
- النَّاس (definite article alif)
- الْمَاضِي (long vowel alif + long vowel ya)
- مَالًا (tanween-fatha alif)
- آمَنُوا (alif maddah + plural ending)
- احْتِرَامًا (long vowel alif + tanween-fatha alif)

Spot-check that a genuinely unvocalized word (if one exists) STILL triggers a warning. Create a quick test by running: `echo 'كتب قال' | npx tsx scripts/validate-diacritics.ts /dev/stdin` (bare Arabic without any tashkeel should still be caught).
  </verify>
  <done>
Diacritics validator correctly handles Arabic orthographic features. Warning count drops from 310 to near zero. Correctly vocalized Quranic text passes validation. Genuinely unvocalized text is still flagged.
  </done>
</task>

<task type="auto">
  <name>Task 2: Run full validation and update STATE.md</name>
  <files>.planning/STATE.md</files>
  <action>
Run the full content validation suite: `npx tsx scripts/validate-content.ts`

Record the final counts (errors, warnings by type).

Update `.planning/STATE.md`:
- Update "Current focus" to mention Quick Task 002 complete
- Update the "Quick Tasks Completed" table to add entry 002
- Update the "Remaining for future milestones" bullet about diacritics errors to reflect resolution
- Update "Last activity" date
- Update "Stopped at" in Session Continuity section
  </action>
  <verify>
`npx tsx scripts/validate-content.ts` completes with 0 errors and significantly fewer warnings than before (ideally under ~260 total = ~245 terminology + a handful of genuine remaining diacritics).

STATE.md has updated Quick Tasks table with entry 002.
  </verify>
  <done>
Full validation passes. STATE.md reflects the completed quick task with accurate warning counts.
  </done>
</task>

</tasks>

<verification>
1. `npx tsx scripts/validate-content.ts 2>&1 | grep '\[diacritics\]' | wc -l` returns under 20 (down from 310)
2. `npx tsx scripts/validate-content.ts 2>&1 | grep 'Errors: 0'` confirms zero errors
3. No regression in other validators (terminology, links, verses still work)
4. The validator still catches genuinely unvocalized Arabic text
</verification>

<success_criteria>
- Diacritics false positives eliminated (310 -> near 0 warnings)
- Zero errors across all 79 content files
- Correctly vocalized Quranic text passes validation
- Genuinely unvocalized text is still flagged
- STATE.md updated with completion status
</success_criteria>

<output>
After completion, create `.planning/quick/002-fix-52-diacritics-errors/002-SUMMARY.md`
</output>
