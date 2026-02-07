---
phase: quick-002
plan: 01
subsystem: validation
tags: [arabic, diacritics, validation, unicode, orthography]

# Dependency graph
requires:
  - phase: 17-04
    provides: Initial diacritics validator with tiered thresholds
provides:
  - Arabic-orthography-aware diacritics validation
  - Character-by-character analysis handling long vowels, plural endings, definite article
  - 84% reduction in false positive warnings (329→51)
affects: [future content validation, Arabic text quality assurance]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Character-by-character Arabic text analysis with context awareness
    - Orthographic rule handling (long vowels, silent letters, vowel carriers)

key-files:
  created: []
  modified:
    - scripts/validate-diacritics.ts

key-decisions:
  - "Rewrote checkDiacritics() from regex-based counting to character-by-character analysis"
  - "Added support for 6 Arabic orthographic rules (silent alif, long vowels, maddah, definite article, tanween carrier, alif wasla)"
  - "Remaining 51 warnings are genuine missing diacritics (case endings, sukun marks)"

patterns-established:
  - "Arabic text validation must account for orthographic conventions, not just character counts"
  - "Long vowel detection via preceding short vowel + matching carrier (fatha+alif, damma+waw, kasra+ya)"
  - "Definite article alif (ا and ٱ) excluded from diacritic requirements"

# Metrics
duration: 6min
completed: 2026-02-07
---

# Quick Task 002: Fix Diacritics Validator Summary

**Arabic-orthography-aware diacritics validator reduces false positives by 84% (329→51 warnings) while still catching genuinely unvocalized text**

## Performance

- **Duration:** 6 min
- **Started:** 2026-02-07T21:28:21Z
- **Completed:** 2026-02-07T21:34:28Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Rewrote checkDiacritics() with character-by-character analysis instead of naive regex counting
- Implemented 6 Arabic orthographic rules (silent alif in وا, long vowels, alif maddah, definite article, tanween carrier, alif wasla)
- Reduced diacritics warnings from 329 to 51 (84% reduction)
- Remaining 51 warnings are genuine issues (missing case endings, sukun marks)
- Validation errors reduced from 2 to 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Update checkDiacritics to account for Arabic orthographic features** - `984979c` (feat)
2. **Task 2: Run full validation and update STATE.md** - `dbab076` (docs)

## Files Created/Modified

- `scripts/validate-diacritics.ts` - Rewrote checkDiacritics() to use character-by-character analysis with Arabic orthographic awareness
- `.planning/STATE.md` - Updated validation results, quick tasks table, blockers/concerns

## Decisions Made

**1. Character-by-character analysis approach**
- Replaced simple regex counting with letter-by-letter context-aware analysis
- Enables detection of long vowels, silent letters, and orthographic patterns
- More accurate representation of Arabic vocalization rules

**2. Orthographic rules implemented**
- Silent alif in وا plural verb endings (e.g., قَالُوا, آمَنُوا)
- Long vowel carriers after matching short vowels (fatha+alif, damma+waw, kasra+ya)
- Alif maddah (آ) treated as inherently vowelized
- Definite article alif (both ا and ٱ) excluded from count
- Tanween-fatha carrier alif excluded
- Small rounded zero (۟) added to diacritics regex

**3. Remaining warnings are genuine**
- 51 remaining warnings are real missing diacritics (case endings, sukun on lam in ال, etc.)
- Words like "النَّاس" correctly flagged as needing "النَّاسِ" or "النَّاسُ" with case ending
- Validator still catches genuinely unvocalized text (verified with test)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Initial logic bug with previous consonant tracking**
- First implementation used a "previous consonant" approach that didn't properly count diacritics
- Solution: Switched to building array of letter info objects first, then processing with full context
- This allowed proper handling of last letter, lookahead/lookbehind patterns

**Alif wasla (ٱ U+0671) not initially recognized**
- Definite article can use either bare alif (ا) or alif wasla (ٱ)
- Added explicit handling for alif wasla character
- Both forms now correctly excluded from diacritic requirements

## Validation Results

**Before Quick Task 002:**
- Errors: 2
- Warnings: ~1,040 (329 diacritics + ~700 other types)
- Diacritics false positives: High (words like قَالُوا, النَّاس, الْمَاضِي all flagged)

**After Quick Task 002:**
- Errors: 0 (100% reduction)
- Warnings: 312 (260 terminology + 51 diacritics + 1 other)
- Diacritics warnings: 51 genuine issues (84% reduction from 329)

**Common words now passing:**
- ✅ قَالُوا (plural verb with silent alif)
- ✅ آمَنُوا (alif maddah + plural ending)
- ✅ تَعَاوَنُوا (Form VI verb plural)
- ✅ الْمَاضِي (definite article + long vowels)
- ✅ الْمُضَارِع (definite article + long vowels)
- ✅ مَالًا (tanween-fatha carrier alif)
- ✅ احْتِرَامًا (tanween-fatha carrier alif)
- ✅ آلَاءِ (alif maddah)

**Still correctly flagged:**
- ⚠️ النَّاس (missing case ending on seen, sukun on lam)
- ⚠️ الفِعْل (missing case ending)
- ⚠️ عِندِى (missing case ending)

## Next Phase Readiness

- Diacritics validator now production-ready for orthographically correct Arabic text
- 51 remaining warnings are genuine content issues that should be fixed manually
- No blockers for v1.2 milestone
- Validator can be used as-is for future content authoring

## Technical Details

**Orthographic rules implemented:**

1. **Silent alif in وا plural verb endings**: When word ends with waw+alif (وا) or waw+alif+small-rounded-zero (وا۟), the final alif is alif al-wiqaya (silent orthographic marker). Not counted.

2. **Long vowel letters**:
   - Fatha (َ) + alif (ا) = long "aa"
   - Damma (ُ) + waw (و) = long "uu"
   - Kasra (ِ) + ya (ي) = long "ii"
   - The vowel carrier letter is counted as diacriticized (the preceding vowel serves as its mark)

3. **Alif maddah (آ)**: Represents hamza + fatha + alif. Inherently vowelized. Counted as having diacritics.

4. **Definite article alif**: Both ا (bare alif) and ٱ (alif wasla) at word start followed by lam (ل) are definite article markers. Not counted.

5. **Tanween-fatha carrier alif**: Word-final alif after tanween-fatha (ً) is purely orthographic. Not counted.

6. **Small rounded zero (۟)**: Quranic orthographic mark added to diacritics regex.

---
*Phase: quick-002*
*Completed: 2026-02-07*
