import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Validation script for canonical bilingual terminology enforcement
 *
 * Ensures consistent use of Arabic grammar terms per TERMINOLOGY.md (PDGY-03).
 * Checks that first-mention format is used: "English (transliteration / عَرَبِي)"
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ValidationIssue {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface CanonicalTerm {
  english: string;
  arabic: string;
  transliteration: string;
}

/**
 * Parse TERMINOLOGY.md to extract canonical terms
 */
export function loadTerminology(): CanonicalTerm[] {
  const terminologyPath = join(__dirname, '..', 'docs', 'TERMINOLOGY.md');

  try {
    const content = readFileSync(terminologyPath, 'utf-8');
    const terms: CanonicalTerm[] = [];

    const lines = content.split('\n');
    let inTable = false;

    for (const line of lines) {
      // Detect table rows (contain | separators)
      if (line.includes('|')) {
        const cells = line.split('|').map(cell => cell.trim());

        // Skip header and separator rows
        if (cells.length >= 4 && cells[1] !== 'English' && !cells[1].includes('---')) {
          const english = cells[1];
          const arabic = cells[2];
          const transliteration = cells[3];

          if (english && arabic && transliteration) {
            terms.push({ english, arabic, transliteration });
            inTable = true;
          }
        }
      } else {
        inTable = false;
      }
    }

    return terms;
  } catch (error) {
    console.error(`Warning: Could not load TERMINOLOGY.md: ${error}`);
    return [];
  }
}

/**
 * Validate terminology usage in MDX content
 * @param content - MDX file content
 * @param filename - File path for error reporting
 * @returns Array of validation issues
 */
export function validateTerminology(content: string, filename: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const terms = loadTerminology();

  if (terms.length === 0) {
    return [{
      line: 0,
      message: 'Warning: Could not load canonical terminology from TERMINOLOGY.md',
      severity: 'warning'
    }];
  }

  const lines = content.split('\n');

  // Track which terms have been introduced with bilingual format
  const introducedTerms = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Check each canonical term
    for (const term of terms) {
      // Check if Arabic term appears in this line
      if (line.includes(term.arabic)) {
        const termKey = term.arabic;

        // If this is the first mention, check for bilingual format
        if (!introducedTerms.has(termKey)) {
          // Expected formats:
          // 1. "English (transliteration / عَرَبِي)"
          // 2. "[English](/path) (transliteration / عَرَبِي)"

          const pattern1 = new RegExp(
            `${term.english}\\s*\\([^)]*${term.arabic}[^)]*\\)`
          );

          const pattern2 = new RegExp(
            `\\[${term.english}\\]\\([^)]+\\)\\s*\\([^)]*${term.arabic}[^)]*\\)`
          );

          if (pattern1.test(line) || pattern2.test(line)) {
            // Valid bilingual format found
            introducedTerms.add(termKey);
          } else {
            // Arabic term used without proper bilingual introduction
            issues.push({
              line: lineNumber,
              message: `First mention of "${term.arabic}" should use bilingual format: "${term.english} (${term.transliteration} / ${term.arabic})"`,
              severity: 'warning'
            });
            introducedTerms.add(termKey); // Mark as seen to avoid duplicate warnings
          }
        }
      }
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
    console.error('Usage: npx tsx scripts/validate-terminology.ts <file.mdx>');
    process.exit(1);
  }

  const filepath = args[0];

  try {
    const content = readFileSync(filepath, 'utf-8');
    const issues = validateTerminology(content, filepath);

    if (issues.length === 0) {
      console.log(`✓ ${filepath}: All terminology follows canonical format`);
      process.exit(0);
    } else {
      console.error(`✗ ${filepath}: Found ${issues.length} terminology issue(s):\n`);
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
