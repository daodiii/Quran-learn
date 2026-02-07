import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';
import { validateDiacritics } from './validate-diacritics.js';
import { validateTerminology } from './validate-terminology.js';
import { validateVerses } from './validate-verses.js';
import { validateLinks } from './validate-links.js';
import { validateConsistency } from './validate-consistency.js';
import { validateProgression } from './validate-progression.js';

/**
 * QA Report Generator
 *
 * Runs ALL validators and produces a comprehensive Markdown report
 * at docs/QA_REPORT.md with per-file results and summary statistics.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface FileResult {
  file: string;
  diacritics: { errors: number; warnings: number };
  terminology: { errors: number; warnings: number };
  verses: { errors: number; warnings: number };
  links: { errors: number; warnings: number };
  total: { errors: number; warnings: number };
}

function findMdxFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      if (entry.startsWith('_') || entry.endsWith('.bak')) continue;
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...findMdxFiles(fullPath));
      } else if (stat.isFile() && entry.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  } catch { return []; }
  return files;
}

function generateReport(): string {
  const projectRoot = join(__dirname, '..');
  const lessonsDir = join(projectRoot, 'src', 'content', 'lessons');
  const resourcesDir = join(projectRoot, 'src', 'content', 'resources');
  const contentDir = join(projectRoot, 'src', 'content');

  const lessonFiles = findMdxFiles(lessonsDir);
  const resourceFiles = findMdxFiles(resourcesDir);
  const allFiles = [...lessonFiles, ...resourceFiles];

  const now = new Date().toISOString().split('T')[0];

  let report = `# QA Validation Report\n\n`;
  report += `**Generated:** ${now}\n`;
  report += `**Files checked:** ${allFiles.length} (${lessonFiles.length} lessons, ${resourceFiles.length} resources)\n\n`;
  report += `---\n\n`;

  // Per-file validation
  report += `## Per-File Validation Results\n\n`;

  const results: FileResult[] = [];
  let grandErrors = 0;
  let grandWarnings = 0;

  const levelStats: Record<string, { files: number; errors: number; warnings: number; clean: number }> = {};

  for (const file of allFiles) {
    const content = readFileSync(file, 'utf-8');
    const shortPath = relative(contentDir, file);

    // Determine level bucket
    const levelMatch = shortPath.match(/level-(\d)/);
    const bucket = levelMatch ? `Level ${levelMatch[1]}` : 'Resources';
    if (!levelStats[bucket]) {
      levelStats[bucket] = { files: 0, errors: 0, warnings: 0, clean: 0 };
    }
    levelStats[bucket].files++;

    const diacIssues = validateDiacritics(content, file);
    const termIssues = validateTerminology(content, file);
    const verseIssues = validateVerses(content, file);
    const linkIssues = validateLinks(content, file);

    const diacErrors = diacIssues.filter(i => i.severity === 'error').length;
    const diacWarnings = diacIssues.filter(i => i.severity === 'warning').length;
    const termErrors = termIssues.filter(i => i.severity === 'error').length;
    const termWarnings = termIssues.filter(i => i.severity === 'warning').length;
    const verseErrors = verseIssues.filter(i => i.severity === 'error').length;
    const verseWarnings = verseIssues.filter(i => i.severity === 'warning').length;
    const linkErrors = linkIssues.filter(i => i.severity === 'error').length;
    const linkWarnings = linkIssues.filter(i => i.severity === 'warning').length;

    const totalErrors = diacErrors + termErrors + verseErrors + linkErrors;
    const totalWarnings = diacWarnings + termWarnings + verseWarnings + linkWarnings;

    grandErrors += totalErrors;
    grandWarnings += totalWarnings;
    levelStats[bucket].errors += totalErrors;
    levelStats[bucket].warnings += totalWarnings;
    if (totalErrors === 0 && totalWarnings === 0) levelStats[bucket].clean++;

    results.push({
      file: shortPath,
      diacritics: { errors: diacErrors, warnings: diacWarnings },
      terminology: { errors: termErrors, warnings: termWarnings },
      verses: { errors: verseErrors, warnings: verseWarnings },
      links: { errors: linkErrors, warnings: linkWarnings },
      total: { errors: totalErrors, warnings: totalWarnings }
    });
  }

  // Summary table
  report += `### Summary by Level\n\n`;
  report += `| Level | Files | Clean | Errors | Warnings |\n`;
  report += `|-------|-------|-------|--------|----------|\n`;

  for (const [bucket, stats] of Object.entries(levelStats)) {
    const status = stats.errors === 0 ? '✅' : '❌';
    report += `| ${status} ${bucket} | ${stats.files} | ${stats.clean}/${stats.files} | ${stats.errors} | ${stats.warnings} |\n`;
  }

  report += `| **Total** | **${allFiles.length}** | **${results.filter(r => r.total.errors === 0 && r.total.warnings === 0).length}/${allFiles.length}** | **${grandErrors}** | **${grandWarnings}** |\n`;
  report += `\n`;

  // Detailed per-file table
  report += `### Per-File Detail\n\n`;
  report += `| File | Diacritics | Terminology | Verses | Links | Total |\n`;
  report += `|------|-----------|-------------|--------|-------|-------|\n`;

  for (const r of results) {
    const formatCell = (e: number, w: number) => {
      if (e === 0 && w === 0) return '✅';
      const parts = [];
      if (e > 0) parts.push(`${e}E`);
      if (w > 0) parts.push(`${w}W`);
      return parts.join(' ');
    };

    report += `| ${r.file} | ${formatCell(r.diacritics.errors, r.diacritics.warnings)} | ${formatCell(r.terminology.errors, r.terminology.warnings)} | ${formatCell(r.verses.errors, r.verses.warnings)} | ${formatCell(r.links.errors, r.links.warnings)} | ${formatCell(r.total.errors, r.total.warnings)} |\n`;
  }

  report += `\n`;

  // Cross-lesson consistency
  report += `## Cross-Lesson Consistency\n\n`;
  const consistencyIssues = validateConsistency(lessonsDir);
  const consErrors = consistencyIssues.filter(i => i.severity === 'error');
  const consWarnings = consistencyIssues.filter(i => i.severity === 'warning');

  if (consistencyIssues.length === 0) {
    report += `✅ All consistency checks passed.\n\n`;
  } else {
    report += `Found ${consErrors.length} errors and ${consWarnings.length} warnings:\n\n`;
    for (const issue of consistencyIssues) {
      const icon = issue.severity === 'error' ? '❌' : '⚠️';
      report += `- ${icon} **${issue.file}**: ${issue.message}\n`;
    }
    report += `\n`;
  }

  grandErrors += consErrors.length;
  grandWarnings += consWarnings.length;

  // Pedagogical progression
  report += `## Pedagogical Progression\n\n`;
  const progressionIssues = validateProgression(lessonsDir);
  const progErrors = progressionIssues.filter(i => i.severity === 'error');
  const progWarnings = progressionIssues.filter(i => i.severity === 'warning');

  if (progressionIssues.length === 0) {
    report += `✅ All progression checks passed.\n\n`;
  } else {
    // Group by check type
    const byCheck = new Map<string, typeof progressionIssues>();
    for (const issue of progressionIssues) {
      if (!byCheck.has(issue.check)) {
        byCheck.set(issue.check, []);
      }
      byCheck.get(issue.check)!.push(issue);
    }

    for (const [check, checkIssues] of byCheck) {
      report += `### ${check.charAt(0).toUpperCase() + check.slice(1)}\n\n`;
      for (const issue of checkIssues) {
        const icon = issue.severity === 'error' ? '❌' : '⚠️';
        report += `- ${icon} **${issue.file}**: ${issue.message}\n`;
      }
      report += `\n`;
    }
  }

  grandErrors += progErrors.length;
  grandWarnings += progWarnings.length;

  // Final summary
  report += `---\n\n`;
  report += `## Final Summary\n\n`;
  report += `| Metric | Count |\n`;
  report += `|--------|-------|\n`;
  report += `| Total files checked | ${allFiles.length} |\n`;
  report += `| Total errors | ${grandErrors} |\n`;
  report += `| Total warnings | ${grandWarnings} |\n`;
  report += `| Clean files (no issues) | ${results.filter(r => r.total.errors === 0 && r.total.warnings === 0).length} |\n`;
  report += `\n`;

  if (grandErrors === 0) {
    report += `### ✅ VALIDATION PASSED\n\n`;
    report += `All content meets quality standards. ${grandWarnings > 0 ? `${grandWarnings} warnings should be reviewed but are non-blocking.` : 'No issues found.'}\n`;
  } else {
    report += `### ❌ VALIDATION FAILED\n\n`;
    report += `${grandErrors} errors must be resolved before shipping. ${grandWarnings} warnings should also be reviewed.\n`;
  }

  report += `\n---\n*Report generated by scripts/generate-qa-report.ts*\n`;

  return report;
}

// Main
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('📋 Generating QA report...\n');

  const report = generateReport();

  const outputPath = join(__dirname, '..', 'docs', 'QA_REPORT.md');
  writeFileSync(outputPath, report);

  console.log(`✅ Report written to docs/QA_REPORT.md\n`);

  // Also print summary to console
  const errorMatch = report.match(/Total errors \| (\d+)/);
  const warningMatch = report.match(/Total warnings \| (\d+)/);
  console.log(`   Errors: ${errorMatch?.[1] || '?'}`);
  console.log(`   Warnings: ${warningMatch?.[1] || '?'}`);
}
