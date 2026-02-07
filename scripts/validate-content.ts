import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { validateDiacritics } from './validate-diacritics.js';
import { validateTerminology } from './validate-terminology.js';
import { validateVerses } from './validate-verses.js';
import { validateLinks } from './validate-links.js';

/**
 * Main validation orchestrator
 *
 * Runs all validation checks (diacritics, terminology, verses, links) on all
 * lesson and resource MDX files. Exits with code 1 if any errors found, 0 if clean.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ValidationResult {
  file: string;
  errors: number;
  warnings: number;
  issues: Array<{
    line: number;
    message: string;
    severity: 'error' | 'warning';
    validator: string;
  }>;
}

/**
 * Recursively find all .mdx files in a directory
 */
function findMdxFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);

      // Skip files/directories starting with underscore (index files, drafts)
      if (entry.startsWith('_')) continue;
      // Skip backup files
      if (entry.endsWith('.bak')) continue;

      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...findMdxFiles(fullPath));
      } else if (stat.isFile() && entry.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    return [];
  }

  return files;
}

/**
 * Validate a single MDX file
 */
function validateFile(filepath: string): ValidationResult {
  const content = readFileSync(filepath, 'utf-8');

  const result: ValidationResult = {
    file: filepath,
    errors: 0,
    warnings: 0,
    issues: []
  };

  // Run diacritics validation
  const diacriticsIssues = validateDiacritics(content, filepath);
  for (const issue of diacriticsIssues) {
    result.issues.push({ ...issue, validator: 'diacritics' });
    if (issue.severity === 'error') result.errors++;
    else result.warnings++;
  }

  // Run terminology validation
  const terminologyIssues = validateTerminology(content, filepath);
  for (const issue of terminologyIssues) {
    result.issues.push({ ...issue, validator: 'terminology' });
    if (issue.severity === 'error') result.errors++;
    else result.warnings++;
  }

  // Run verse reference validation
  const verseIssues = validateVerses(content, filepath);
  for (const issue of verseIssues) {
    result.issues.push({ ...issue, validator: 'verses' });
    if (issue.severity === 'error') result.errors++;
    else result.warnings++;
  }

  // Run link validation
  const linkIssues = validateLinks(content, filepath);
  for (const issue of linkIssues) {
    result.issues.push({ ...issue, validator: 'links' });
    if (issue.severity === 'error') result.errors++;
    else result.warnings++;
  }

  return result;
}

/**
 * Main validation function
 */
function validateContent() {
  const lessonsDir = join(__dirname, '..', 'src', 'content', 'lessons');
  const resourcesDir = join(__dirname, '..', 'src', 'content', 'resources');

  console.log('🔍 Validating lesson and resource content...\n');

  const lessonFiles = findMdxFiles(lessonsDir);
  const resourceFiles = findMdxFiles(resourcesDir);
  const mdxFiles = [...lessonFiles, ...resourceFiles];

  if (mdxFiles.length === 0) {
    console.log('ℹ️  No content files found');
    process.exit(0);
  }

  const results: ValidationResult[] = [];
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of mdxFiles) {
    const result = validateFile(file);
    results.push(result);

    totalErrors += result.errors;
    totalWarnings += result.warnings;
  }

  // Print results
  const contentBase = join(__dirname, '..', 'src', 'content');
  for (const result of results) {
    const shortPath = result.file.replace(contentBase + '/', '');

    if (result.issues.length === 0) {
      console.log(`✓ ${shortPath}`);
    } else {
      console.log(`✗ ${shortPath} (${result.errors} errors, ${result.warnings} warnings)`);

      // Group issues by line
      const issuesByLine = new Map<number, typeof result.issues>();
      for (const issue of result.issues) {
        if (!issuesByLine.has(issue.line)) {
          issuesByLine.set(issue.line, []);
        }
        issuesByLine.get(issue.line)!.push(issue);
      }

      // Print issues sorted by line
      const sortedLines = Array.from(issuesByLine.keys()).sort((a, b) => a - b);
      for (const line of sortedLines) {
        const lineIssues = issuesByLine.get(line)!;
        for (const issue of lineIssues) {
          const icon = issue.severity === 'error' ? '❌' : '⚠️';
          console.log(`  ${icon} Line ${issue.line} [${issue.validator}]: ${issue.message}`);
        }
      }

      console.log('');
    }
  }

  // Print summary
  console.log('─'.repeat(60));
  console.log(`📊 Summary: ${mdxFiles.length} files checked (${lessonFiles.length} lessons, ${resourceFiles.length} resources)`);
  console.log(`   Errors: ${totalErrors}`);
  console.log(`   Warnings: ${totalWarnings}`);

  if (totalErrors > 0) {
    console.log('\n❌ Validation failed\n');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n⚠️  Validation passed with warnings\n');
    process.exit(0);
  } else {
    console.log('\n✅ All checks passed!\n');
    process.exit(0);
  }
}

// Run validation
validateContent();
