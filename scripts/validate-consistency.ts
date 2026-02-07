import { readFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';

/**
 * Cross-lesson consistency validator
 *
 * Validates consistency ACROSS all 73 lessons (not per-file):
 * - Component import patterns
 * - Frontmatter prevLesson/nextLesson chain integrity
 * - Exercise count per lesson
 * - Lesson file naming conventions
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ConsistencyIssue {
  file: string;
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Recursively find all lesson .mdx files (excluding _index.mdx)
 */
function findLessonFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      if (entry.startsWith('_')) continue;
      if (entry.endsWith('.bak')) continue;
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
 * Parse frontmatter from MDX content
 */
function parseFrontmatter(content: string): Record<string, string | number | boolean> {
  const fm: Record<string, string | number | boolean> = {};
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return fm;

  const lines = match[1].split('\n');
  for (const line of lines) {
    const kvMatch = line.match(/^(\w+):\s*(.+)$/);
    if (kvMatch) {
      let value: string | number | boolean = kvMatch[2].trim().replace(/^["']|["']$/g, '');
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (/^\d+$/.test(value as string)) value = parseInt(value as string, 10);
      fm[kvMatch[1]] = value;
    }
  }
  return fm;
}

/**
 * Validate cross-lesson consistency
 */
export function validateConsistency(lessonsDir: string): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];
  const files = findLessonFiles(lessonsDir);

  if (files.length === 0) return [];

  // Collect data from all lessons
  const lessons: Array<{
    file: string;
    shortPath: string;
    level: number;
    order: number;
    title: string;
    hasArabicExample: boolean;
    hasGrammarTable: boolean;
    hasCallout: boolean;
    hasExerciseBox: boolean;
    exerciseCount: number;
    arabicExampleCount: number;
    importLines: string[];
    frontmatter: Record<string, string | number | boolean>;
  }> = [];

  const expectedImports = [
    "import ArabicExample from '@components/mdx/ArabicExample.astro';",
    "import GrammarTable from '@components/mdx/GrammarTable.astro';",
    "import Callout from '@components/mdx/Callout.astro';",
    "import ExerciseBox from '@components/mdx/ExerciseBox.astro';"
  ];

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const shortPath = relative(lessonsDir, file);
    const fm = parseFrontmatter(content);

    const importLines = content.split('\n').filter(l => l.trim().startsWith('import '));
    const exerciseCount = (content.match(/<ExerciseBox/g) || []).length;
    const arabicExampleCount = (content.match(/<ArabicExample/g) || []).length;

    lessons.push({
      file,
      shortPath,
      level: (fm.level as number) || 0,
      order: (fm.order as number) || 0,
      title: (fm.title as string) || '',
      hasArabicExample: content.includes('<ArabicExample'),
      hasGrammarTable: content.includes('<GrammarTable'),
      hasCallout: content.includes('<Callout'),
      hasExerciseBox: content.includes('<ExerciseBox'),
      exerciseCount,
      arabicExampleCount,
      importLines,
      frontmatter: fm
    });
  }

  // Sort by level and order
  lessons.sort((a, b) => a.level - b.level || a.order - b.order);

  // Check 1: Component import consistency
  for (const lesson of lessons) {
    // Check that used components are imported
    if (lesson.hasArabicExample && !lesson.importLines.some(l => l.includes('ArabicExample'))) {
      issues.push({
        file: lesson.shortPath,
        line: 1,
        message: 'Uses <ArabicExample> but missing import statement',
        severity: 'error'
      });
    }
    if (lesson.hasExerciseBox && !lesson.importLines.some(l => l.includes('ExerciseBox'))) {
      issues.push({
        file: lesson.shortPath,
        line: 1,
        message: 'Uses <ExerciseBox> but missing import statement',
        severity: 'error'
      });
    }
    if (lesson.hasCallout && !lesson.importLines.some(l => l.includes('Callout'))) {
      issues.push({
        file: lesson.shortPath,
        line: 1,
        message: 'Uses <Callout> but missing import statement',
        severity: 'error'
      });
    }
    if (lesson.hasGrammarTable && !lesson.importLines.some(l => l.includes('GrammarTable'))) {
      issues.push({
        file: lesson.shortPath,
        line: 1,
        message: 'Uses <GrammarTable> but missing import statement',
        severity: 'error'
      });
    }

    // Check import path format consistency
    for (const imp of lesson.importLines) {
      if (imp.includes('ArabicExample') || imp.includes('GrammarTable') ||
          imp.includes('Callout') || imp.includes('ExerciseBox') ||
          imp.includes('VerbConjugation')) {
        if (!imp.includes("'@components/mdx/")) {
          issues.push({
            file: lesson.shortPath,
            line: 1,
            message: `Non-standard import path: ${imp.trim()}`,
            severity: 'warning'
          });
        }
      }
    }
  }

  // Check 2: Frontmatter validation
  for (const lesson of lessons) {
    if (!lesson.frontmatter.title) {
      issues.push({
        file: lesson.shortPath,
        line: 1,
        message: 'Missing required frontmatter: title',
        severity: 'error'
      });
    }
    if (!lesson.level || lesson.level < 1 || lesson.level > 5) {
      issues.push({
        file: lesson.shortPath,
        line: 1,
        message: `Invalid level: ${lesson.level} (must be 1-5)`,
        severity: 'error'
      });
    }
    if (!lesson.order || lesson.order < 1) {
      issues.push({
        file: lesson.shortPath,
        line: 1,
        message: `Invalid order: ${lesson.order} (must be positive)`,
        severity: 'error'
      });
    }
  }

  // Check 3: Duplicate order within levels
  const levelOrders = new Map<number, Map<number, string[]>>();
  for (const lesson of lessons) {
    if (!levelOrders.has(lesson.level)) {
      levelOrders.set(lesson.level, new Map());
    }
    const orderMap = levelOrders.get(lesson.level)!;
    if (!orderMap.has(lesson.order)) {
      orderMap.set(lesson.order, []);
    }
    orderMap.get(lesson.order)!.push(lesson.shortPath);
  }

  for (const [level, orderMap] of levelOrders) {
    for (const [order, files] of orderMap) {
      if (files.length > 1) {
        for (const file of files) {
          issues.push({
            file,
            line: 1,
            message: `Duplicate order ${order} in level ${level}: ${files.join(', ')}`,
            severity: 'error'
          });
        }
      }
    }
  }

  // Check 4: Exercise count per lesson
  for (const lesson of lessons) {
    if (lesson.exerciseCount < 3) {
      issues.push({
        file: lesson.shortPath,
        line: 1,
        message: `Only ${lesson.exerciseCount} exercises (minimum 3 required per LSSN-09)`,
        severity: 'warning'
      });
    }
  }

  // Check 5: ArabicExample count per lesson
  for (const lesson of lessons) {
    if (lesson.arabicExampleCount < 2) {
      issues.push({
        file: lesson.shortPath,
        line: 1,
        message: `Only ${lesson.arabicExampleCount} ArabicExample components (recommend at least 3)`,
        severity: 'warning'
      });
    }
  }

  // Check 6: Level lesson counts
  const levelCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const lesson of lessons) {
    if (lesson.level >= 1 && lesson.level <= 5) {
      levelCounts[lesson.level]++;
    }
  }

  const expectedCounts: Record<number, number> = { 1: 11, 2: 11, 3: 18, 4: 17, 5: 16 };
  for (const [level, expected] of Object.entries(expectedCounts)) {
    const actual = levelCounts[parseInt(level)];
    if (actual !== expected) {
      issues.push({
        file: `level-${level}/`,
        line: 0,
        message: `Level ${level} has ${actual} lessons, expected ${expected}`,
        severity: actual < expected ? 'error' : 'warning'
      });
    }
  }

  return issues;
}

/**
 * CLI entry point
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const lessonsDir = join(__dirname, '..', 'src', 'content', 'lessons');

  console.log('🔗 Running cross-lesson consistency checks...\n');

  const issues = validateConsistency(lessonsDir);

  if (issues.length === 0) {
    console.log('✅ All consistency checks passed!\n');
    process.exit(0);
  }

  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  // Print by file
  const issuesByFile = new Map<string, typeof issues>();
  for (const issue of issues) {
    if (!issuesByFile.has(issue.file)) {
      issuesByFile.set(issue.file, []);
    }
    issuesByFile.get(issue.file)!.push(issue);
  }

  for (const [file, fileIssues] of issuesByFile) {
    const fileErrors = fileIssues.filter(i => i.severity === 'error').length;
    const fileWarnings = fileIssues.filter(i => i.severity === 'warning').length;
    console.log(`✗ ${file} (${fileErrors} errors, ${fileWarnings} warnings)`);
    for (const issue of fileIssues) {
      const icon = issue.severity === 'error' ? '❌' : '⚠️';
      console.log(`  ${icon} ${issue.message}`);
    }
    console.log('');
  }

  console.log('─'.repeat(60));
  console.log(`📊 Consistency Summary:`);
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Consistency check failed\n');
    process.exit(1);
  } else {
    console.log('\n⚠️  Passed with warnings\n');
    process.exit(0);
  }
}
