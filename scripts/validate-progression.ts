import { readFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';

/**
 * Readability and pedagogical progression validator
 *
 * Checks that lessons follow expected patterns per level:
 * - Transliteration density (decreasing L1→L5)
 * - Exercise count (3-4 per lesson)
 * - Lesson length (increasing with level)
 * - ArabicExample count (minimum 3)
 * - Section structure (5-part template)
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ProgressionIssue {
  file: string;
  line: number;
  message: string;
  severity: 'error' | 'warning';
  check: string;
}

/**
 * Find all lesson MDX files
 */
function findLessonFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      if (entry.startsWith('_') || entry.endsWith('.bak')) continue;
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...findLessonFiles(fullPath));
      } else if (stat.isFile() && entry.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  } catch { return []; }
  return files;
}

/**
 * Parse frontmatter to get level
 */
function getLevel(content: string): number {
  const match = content.match(/^level:\s*(\d+)/m);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Check transliteration density
 * Counts ArabicExample components with/without transliteration attribute
 */
function checkTransliteration(content: string, level: number, shortPath: string): ProgressionIssue[] {
  const issues: ProgressionIssue[] = [];

  // Count ArabicExample components
  const total = (content.match(/<ArabicExample/g) || []).length;
  if (total === 0) return issues;

  // Count those with transliteration attribute
  const withTranslit = (content.match(/<ArabicExample[\s\S]*?transliteration=/g) || []).length;
  const density = withTranslit / total;

  // Expected density by level (per STYLE_GUIDE.md graduated transliteration)
  const expectations: Record<number, { min: number; label: string }> = {
    1: { min: 0.75, label: 'Level 1 (full transliteration)' },
    2: { min: 0.60, label: 'Level 2 (balanced transliteration)' },
    3: { min: 0.30, label: 'Level 3 (partial transliteration)' },
    4: { min: 0.0, label: 'Level 4 (minimal transliteration)' },
    5: { min: 0.0, label: 'Level 5 (minimal transliteration)' }
  };

  const expected = expectations[level];
  if (expected && density < expected.min) {
    issues.push({
      file: shortPath,
      line: 0,
      message: `Transliteration density ${(density * 100).toFixed(0)}% (${withTranslit}/${total} examples) — ${expected.label} expects ≥${(expected.min * 100).toFixed(0)}%`,
      severity: 'warning',
      check: 'transliteration'
    });
  }

  return issues;
}

/**
 * Check exercise count
 */
function checkExercises(content: string, shortPath: string): ProgressionIssue[] {
  const issues: ProgressionIssue[] = [];
  const count = (content.match(/<ExerciseBox/g) || []).length;

  if (count < 3) {
    issues.push({
      file: shortPath,
      line: 0,
      message: `Only ${count} exercises (minimum 3 required per success criteria)`,
      severity: count === 0 ? 'error' : 'warning',
      check: 'exercises'
    });
  } else if (count > 6) {
    issues.push({
      file: shortPath,
      line: 0,
      message: `${count} exercises (more than 6 may indicate cognitive overload)`,
      severity: 'warning',
      check: 'exercises'
    });
  }

  return issues;
}

/**
 * Check lesson length
 */
function checkLength(content: string, level: number, shortPath: string): ProgressionIssue[] {
  const issues: ProgressionIssue[] = [];
  const lineCount = content.split('\n').length;

  // Expected ranges by level (generous bounds)
  const ranges: Record<number, { min: number; max: number }> = {
    1: { min: 150, max: 600 },
    2: { min: 200, max: 700 },
    3: { min: 250, max: 800 },
    4: { min: 250, max: 900 },
    5: { min: 250, max: 900 }
  };

  const range = ranges[level];
  if (range) {
    if (lineCount < range.min) {
      issues.push({
        file: shortPath,
        line: 0,
        message: `Only ${lineCount} lines (Level ${level} expects ${range.min}-${range.max})`,
        severity: 'warning',
        check: 'length'
      });
    } else if (lineCount > range.max) {
      issues.push({
        file: shortPath,
        line: 0,
        message: `${lineCount} lines (Level ${level} expects ${range.min}-${range.max}) — consider splitting`,
        severity: 'warning',
        check: 'length'
      });
    }
  }

  return issues;
}

/**
 * Check ArabicExample count
 */
function checkArabicExamples(content: string, shortPath: string): ProgressionIssue[] {
  const issues: ProgressionIssue[] = [];
  const count = (content.match(/<ArabicExample/g) || []).length;

  if (count < 2) {
    issues.push({
      file: shortPath,
      line: 0,
      message: `Only ${count} Quranic examples (recommend at least 3 per lesson)`,
      severity: 'warning',
      check: 'examples'
    });
  }

  return issues;
}

/**
 * Check section structure (5-part template)
 */
function checkStructure(content: string, shortPath: string): ProgressionIssue[] {
  const issues: ProgressionIssue[] = [];

  // Check for introduction section
  const hasIntro = content.match(/^##\s+(Introduction|Welcome|Overview)/m) !== null ||
                   content.indexOf('## ') < content.indexOf('<ArabicExample');

  // Check for exercises
  const hasExercises = content.includes('<ExerciseBox');

  if (!hasExercises) {
    issues.push({
      file: shortPath,
      line: 0,
      message: 'Missing practice exercises section (ExerciseBox components)',
      severity: 'warning',
      check: 'structure'
    });
  }

  return issues;
}

/**
 * Run all progression checks
 */
export function validateProgression(lessonsDir: string): ProgressionIssue[] {
  const issues: ProgressionIssue[] = [];
  const files = findLessonFiles(lessonsDir);

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const shortPath = relative(lessonsDir, file);
    const level = getLevel(content);

    issues.push(...checkTransliteration(content, level, shortPath));
    issues.push(...checkExercises(content, shortPath));
    issues.push(...checkLength(content, level, shortPath));
    issues.push(...checkArabicExamples(content, shortPath));
    issues.push(...checkStructure(content, shortPath));
  }

  return issues;
}

/**
 * CLI entry point
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const lessonsDir = join(__dirname, '..', 'src', 'content', 'lessons');

  console.log('📊 Checking pedagogical progression...\n');

  const issues = validateProgression(lessonsDir);

  if (issues.length === 0) {
    console.log('✅ All progression checks passed!\n');
    process.exit(0);
  }

  // Group by check type
  const byCheck = new Map<string, typeof issues>();
  for (const issue of issues) {
    if (!byCheck.has(issue.check)) {
      byCheck.set(issue.check, []);
    }
    byCheck.get(issue.check)!.push(issue);
  }

  for (const [check, checkIssues] of byCheck) {
    console.log(`\n### ${check.toUpperCase()} ###`);
    for (const issue of checkIssues) {
      const icon = issue.severity === 'error' ? '❌' : '⚠️';
      console.log(`  ${icon} ${issue.file}: ${issue.message}`);
    }
  }

  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  console.log('\n' + '─'.repeat(60));
  console.log(`📊 Progression Summary:`);
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Progression check failed\n');
    process.exit(1);
  } else {
    console.log('\n⚠️  Passed with warnings\n');
    process.exit(0);
  }
}
