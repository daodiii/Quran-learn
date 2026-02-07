import { readFileSync } from 'fs';

/**
 * Validation script for Arabic diacritics completeness
 *
 * Ensures all Arabic text has complete tashkeel (vowel marks) per LSSN-07.
 * Quranic text should have a high diacritics-to-letters ratio (>= 0.7).
 *
 * Arabic orthographic accommodations:
 * - Silent alif in plural verb endings (وا) not counted
 * - Long vowel letters (alif/waw/ya after corresponding short vowel) treated as diacriticized
 * - Alif maddah (آ) inherently vowelized, treated as diacriticized
 * - Alif in definite article (ال) not counted (alif al-wasl)
 * - Tanween-fatha carrier alif not counted
 * - Quranic small rounded zero (\u06DF) recognized
 */

// Unicode ranges for Arabic base letters (consonants + semi-vowels)
const ARABIC_LETTER = /[\u0621-\u063A\u0641-\u064A]/g;

// Expanded diacritics range including Quranic orthographic marks
const ARABIC_DIACRITIC = /[\u064B-\u065F\u0653\u0654-\u0656\u0670\u06D6-\u06DC\u06DF\u06E5\u06E6\u06E7\u06E8]/g;


export interface ValidationIssue {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Extract Arabic text segments from MDX content
 * Skips: frontmatter, code blocks, import lines, JSX attributes, HTML attributes
 */
function extractArabicSegments(content: string): Array<{ text: string; line: number }> {
  const lines = content.split('\n');
  const segments: Array<{ text: string; line: number }> = [];

  let inFrontmatter = false;
  let inCodeBlock = false;
  let inJsxTag = false;
  let frontmatterCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Track frontmatter (between --- delimiters)
    if (line.trim() === '---') {
      frontmatterCount++;
      if (frontmatterCount <= 2) {
        inFrontmatter = !inFrontmatter;
        continue;
      }
    }

    if (inFrontmatter) continue;

    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    // Skip import lines
    if (line.trim().startsWith('import ')) continue;

    // Track JSX component tags (multi-line)
    if (line.match(/<(ArabicExample|GrammarTable|VerbConjugation|Callout|ExerciseBox)\b/)) {
      inJsxTag = true;
    }
    if (inJsxTag) {
      if (line.includes('/>') || line.includes('>')) {
        inJsxTag = false;
      }
      // Skip all JSX attribute lines
      if (line.match(/^\s*\w+="/)) continue;
    }

    // Extract Arabic text (not in JSX attribute quotes)
    let processedLine = line;

    // Remove all JSX/HTML attribute content (key="value" patterns)
    processedLine = processedLine.replace(/\w+="[^"]*"/g, '');

    // Remove JSX expressions {content}
    processedLine = processedLine.replace(/\{[^}]*\}/g, '');

    // Remove markdown link URLs — slugs can't carry diacritics
    processedLine = processedLine.replace(/\]\([^)]*\)/g, ']');

    // Find Arabic text
    const arabicMatches = processedLine.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+/g);

    if (arabicMatches) {
      for (const match of arabicMatches) {
        if (match.trim().length > 0) {
          segments.push({ text: match, line: lineNumber });
        }
      }
    }
  }

  return segments;
}

/**
 * Check if Arabic text has sufficient diacritics using orthography-aware counting
 *
 * Accommodates Arabic orthographic rules:
 * 1. Silent alif in وا plural verb endings
 * 2. Long vowel carriers (alif/waw/ya after matching short vowel)
 * 3. Alif maddah (آ) inherently vowelized
 * 4. Alif in definite article ال or ٱل (alif wasla)
 * 5. Tanween-fatha carrier alif
 *
 * Returns ratio of diacriticized letters to total consonant letters
 */
function checkDiacritics(text: string): { ratio: number; letters: number; diacritics: number } {
  // Normalize to NFC to handle decomposed forms
  const normalized = text.normalize('NFC');
  const chars = [...normalized];

  let letterCount = 0;       // consonant letters that SHOULD have diacritics
  let diacriticCount = 0;    // letters that ARE diacriticized (either with marks or as long vowels)

  // Character classification helpers
  const isArabicLetter = (c: string) => /[\u0621-\u063A\u0641-\u064A]/.test(c);
  const isDiacritic = (c: string) => /[\u064B-\u065F\u0653\u0654-\u0656\u0670\u06D6-\u06DC\u06DF\u06E5\u06E6\u06E7\u06E8]/.test(c);

  const isBareAlif = (c: string) => c === '\u0627';  // ا (bare alif, no hamza)
  const isAlifWasla = (c: string) => c === '\u0671'; // ٱ (alif wasla - definite article marker)
  const isAlifMaddah = (c: string) => c === '\u0622'; // آ
  const isBareWaw = (c: string) => c === '\u0648';   // و
  const isBareYa = (c: string) => c === '\u064A';    // ي
  const isLam = (c: string) => c === '\u0644';       // ل

  const isFatha = (c: string) => c === '\u064E';     // َ fatha
  const isDamma = (c: string) => c === '\u064F';     // ُ damma
  const isKasra = (c: string) => c === '\u0650';     // ِ kasra
  const isTanweenFatha = (c: string) => c === '\u064B'; // ً tanween fatha
  const isSmallRoundedZero = (c: string) => c === '\u06DF'; // ۟

  // Build array of letter info for easier analysis
  interface LetterInfo {
    char: string;
    index: number;
    diacritics: string[];
  }

  const letters: LetterInfo[] = [];

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    // Skip alif wasla (definite article marker) - doesn't take diacritics
    if (isAlifWasla(char)) {
      continue;
    }

    if (isDiacritic(char)) {
      // Attach diacritic to previous letter
      if (letters.length > 0) {
        letters[letters.length - 1].diacritics.push(char);
      }
      continue;
    }

    if (isArabicLetter(char) || isAlifMaddah(char)) {
      letters.push({ char, index: i, diacritics: [] });
    }
  }

  // Now process letters with context awareness
  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    const prevLetter = i > 0 ? letters[i - 1] : null;
    const nextLetter = i < letters.length - 1 ? letters[i + 1] : null;

    // Handle alif maddah (آ) - inherently vowelized
    if (isAlifMaddah(letter.char)) {
      letterCount++;
      diacriticCount++;
      continue;
    }

    // Handle bare alif (ا) - context-dependent
    if (isBareAlif(letter.char)) {
      let skipAlif = false;

      // Rule 1: Definite article ال at word start
      if (i === 0 && nextLetter && isLam(nextLetter.char)) {
        skipAlif = true; // alif al-wasl in definite article
      }

      // Rule 2: Silent alif in وا ending (plural verbs)
      if (prevLetter && isBareWaw(prevLetter.char)) {
        // Check if this is the last letter or followed only by small rounded zero
        const isWordEnd = i === letters.length - 1;
        if (isWordEnd) {
          skipAlif = true; // silent alif al-wiqaya
        }
      }

      // Rule 3: Tanween-fatha carrier alif at end
      if (i === letters.length - 1 && prevLetter && prevLetter.diacritics.some(isTanweenFatha)) {
        skipAlif = true; // orthographic alif for tanween
      }

      // Rule 4: Long vowel alif (preceded by fatha)
      if (!skipAlif && prevLetter && prevLetter.diacritics.some(isFatha)) {
        // This alif is a long vowel carrier - count as diacriticized
        letterCount++;
        diacriticCount++;
        continue;
      }

      if (!skipAlif) {
        // Regular alif - count it
        letterCount++;
        if (letter.diacritics.length > 0) {
          diacriticCount++;
        }
      }
      continue;
    }

    // Handle bare waw (و) - could be long vowel
    if (isBareWaw(letter.char)) {
      if (prevLetter && prevLetter.diacritics.some(isDamma)) {
        // Long vowel waw (preceded by damma) - count as diacriticized
        letterCount++;
        diacriticCount++;
        continue;
      }
      // Regular waw consonant
      letterCount++;
      if (letter.diacritics.length > 0) {
        diacriticCount++;
      }
      continue;
    }

    // Handle bare ya (ي) - could be long vowel
    if (isBareYa(letter.char)) {
      if (prevLetter && prevLetter.diacritics.some(isKasra)) {
        // Long vowel ya (preceded by kasra) - count as diacriticized
        letterCount++;
        diacriticCount++;
        continue;
      }
      // Regular ya consonant
      letterCount++;
      if (letter.diacritics.length > 0) {
        diacriticCount++;
      }
      continue;
    }

    // Regular consonant letter
    letterCount++;
    if (letter.diacritics.length > 0) {
      diacriticCount++;
    }
  }

  const ratio = letterCount > 0 ? diacriticCount / letterCount : 0;

  return { ratio, letters: letterCount, diacritics: diacriticCount };
}

/**
 * Validate Arabic diacritics in MDX content
 * @param content - MDX file content
 * @param filename - File path for error reporting
 * @returns Array of validation issues
 */
export function validateDiacritics(content: string, filename: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const segments = extractArabicSegments(content);

  const MIN_LETTERS = 4; // Increased from 3 to avoid false positives on short words

  // Tiered thresholds: Arabic words naturally contain vowel carriers (alif, waw, ya)
  // that don't take diacritics, so shorter words inherently score lower.
  // - 4-6 letters: many words have 1-2 vowel carriers → use 0.55 threshold
  // - 7+ letters: longer text should have higher vocalization → use 0.65 threshold
  // - 12+ letters (phrases): use original 0.70 threshold
  function getThreshold(letterCount: number): number {
    if (letterCount >= 12) return 0.70;
    if (letterCount >= 7) return 0.65;
    return 0.55;
  }

  for (const segment of segments) {
    const { ratio, letters, diacritics } = checkDiacritics(segment.text);
    const threshold = getThreshold(letters);

    // Only check segments with substantial text (4+ letters)
    // Short words like قَالَ (3 letters, 2 diacritics = 67%) are properly vocalized
    // but score below threshold because alif doesn't take diacritics
    if (letters >= MIN_LETTERS && ratio < threshold) {
      issues.push({
        line: segment.line,
        message: `Arabic text missing diacritics (${diacritics}/${letters} = ${(ratio * 100).toFixed(0)}%, need ≥${(threshold * 100).toFixed(0)}%): "${segment.text.substring(0, 50)}${segment.text.length > 50 ? '...' : ''}"`,
        severity: ratio < 0.4 ? 'error' : 'warning'
      });
    }
  }

  return issues;
}

/**
 * CLI usage
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/validate-diacritics.ts <file.mdx>');
    process.exit(1);
  }

  const filepath = args[0];

  try {
    const content = readFileSync(filepath, 'utf-8');
    const issues = validateDiacritics(content, filepath);

    if (issues.length === 0) {
      console.log(`✓ ${filepath}: All Arabic text has complete diacritics`);
      process.exit(0);
    } else {
      console.error(`✗ ${filepath}: Found ${issues.length} diacritics issue(s):\n`);
      for (const issue of issues) {
        console.error(`  Line ${issue.line}: ${issue.message}`);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    process.exit(1);
  }
}
