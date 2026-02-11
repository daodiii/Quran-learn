import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';

/**
 * Link validator for lesson and resource MDX files
 *
 * Validates that all internal links resolve correctly:
 * - Glossary anchor links: [text](/resources/glossary#anchor)
 * - Lesson cross-references: [text](/learn/level-N/slug)
 * - Resource links: [text](/resources/slug)
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ValidationIssue {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Extract glossary anchor IDs from glossary.mdx
 */
function loadGlossaryAnchors(resourcesDir: string): Set<string> {
  const anchors = new Set<string>();
  const glossaryPath = join(resourcesDir, 'glossary.mdx');

  if (!existsSync(glossaryPath)) return anchors;

  const content = readFileSync(glossaryPath, 'utf-8');

  // Match <h2 id="anchor"> and <h3 id="anchor"> patterns
  const idMatches = content.matchAll(/id="([^"]+)"/g);
  for (const match of idMatches) {
    anchors.add(match[1]);
  }

  // Match ### Heading patterns (auto-generated anchors)
  const headingMatches = content.matchAll(/^###?\s+(.+)$/gm);
  for (const match of headingMatches) {
    // Generate anchor from heading text (lowercase, hyphenated)
    const anchor = match[1]
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    if (anchor) anchors.add(anchor);
  }

  return anchors;
}

/**
 * Get available lesson slugs from the filesystem
 */
function loadLessonSlugs(lessonsDir: string): Set<string> {
  const slugs = new Set<string>();

  for (let level = 1; level <= 5; level++) {
    const levelDir = join(lessonsDir, `level-${level}`);
    if (!existsSync(levelDir)) continue;

    try {
      const entries = readdirSync(levelDir);
      for (const entry of entries) {
        if (entry.startsWith('_')) continue;
        if (entry.endsWith('.bak')) continue;
        if (entry.endsWith('.mdx') || entry.endsWith('.md')) {
          const slug = entry.replace(/\.(mdx?|md)$/, '');
          // Add full filename slug
          slugs.add(`level-${level}/${slug}`);
          // Also add slug without numeric prefix (e.g., "01-alphabet-letter-forms" → "alphabet-letter-forms")
          // Astro routes may strip numeric prefixes
          const withoutPrefix = slug.replace(/^\d+-/, '');
          if (withoutPrefix !== slug) {
            slugs.add(`level-${level}/${withoutPrefix}`);
          }
        }
      }
    } catch { /* ignore */ }
  }

  return slugs;
}

/**
 * Get available resource slugs (with known aliases)
 */
function loadResourceSlugs(resourcesDir: string): Set<string> {
  const slugs = new Set<string>();

  if (!existsSync(resourcesDir)) return slugs;

  try {
    const entries = readdirSync(resourcesDir);
    for (const entry of entries) {
      if (entry.startsWith('_')) continue;
      if (entry.endsWith('.mdx') || entry.endsWith('.md')) {
        const slug = entry.replace(/\.(mdx?|md)$/, '');
        slugs.add(slug);
      }
    }
  } catch { /* ignore */ }

  // Known slug aliases (content uses shorter/different names)
  const aliases: Record<string, string> = {
    'verb-tables': 'verb-conjugation-tables',
    'verb-forms-chart': 'verb-conjugation-tables',
    'root-system-guide': 'root-system',
    'common-words': '200-most-used-words',
    'grammar-glossary': 'glossary',
    'case-system': 'case-endings-chart',
  };

  for (const alias of Object.keys(aliases)) {
    if (slugs.has(aliases[alias])) {
      slugs.add(alias);
    }
  }

  return slugs;
}

/**
 * Validate internal links in MDX content
 */
export function validateLinks(content: string, filepath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const projectRoot = join(__dirname, '..');
  const lessonsDir = join(projectRoot, 'src', 'content', 'lessons');
  const resourcesDir = join(projectRoot, 'src', 'content', 'resources');

  const glossaryAnchors = loadGlossaryAnchors(resourcesDir);
  const lessonSlugs = loadLessonSlugs(lessonsDir);
  const resourceSlugs = loadResourceSlugs(resourcesDir);

  const lines = content.split('\n');

  // Markdown link pattern: [text](url)
  const linkPattern = /\[([^\]]*)\]\(([^)]+)\)/g;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    let match;
    linkPattern.lastIndex = 0;

    while ((match = linkPattern.exec(line)) !== null) {
      const linkText = match[1];
      const url = match[2];

      // Skip external links
      if (url.startsWith('http://') || url.startsWith('https://')) continue;
      // Skip anchor-only links
      if (url.startsWith('#')) continue;

      // Normalize: strip trailing slashes for comparison
      const normalizedUrl = url.replace(/\/(?=#|\?|$)/g, '');

      // Check glossary links: /resources/glossary#anchor
      if (normalizedUrl.startsWith('/resources/glossary#')) {
        const anchor = normalizedUrl.split('#')[1];
        if (anchor && !glossaryAnchors.has(anchor)) {
          issues.push({
            line: lineNumber,
            message: `Glossary anchor "#${anchor}" not found in glossary.mdx`,
            severity: 'warning'
          });
        }
      }
      // Check lesson cross-references: /learn/level-N/slug
      else if (normalizedUrl.startsWith('/learn/level-')) {
        const pathPart = normalizedUrl.replace('/learn/', '').replace(/\/$/, '');
        if (!lessonSlugs.has(pathPart)) {
          issues.push({
            line: lineNumber,
            message: `Lesson link "${url}" - no matching file found`,
            severity: 'warning'
          });
        }
      }
      // Check bare /learn/level-N links (directory links)
      else if (normalizedUrl.match(/^\/learn\/level-\d+$/)) {
        // Directory links are valid (index pages)
        continue;
      }
      // Check resource links: /resources/slug
      else if (normalizedUrl.startsWith('/resources/')) {
        const slug = normalizedUrl.replace('/resources/', '').split('#')[0].replace(/\/$/, '');
        if (slug && !resourceSlugs.has(slug)) {
          issues.push({
            line: lineNumber,
            message: `Resource link "${url}" - no matching file (available: glossary, verb-conjugation-tables, case-endings-chart, pronoun-charts, root-system, 200-most-used-words)`,
            severity: 'warning'
          });
        }
      }
    }
  }

  return issues;
}

/**
 * CLI entry point
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const lessonsDir = join(__dirname, '..', 'src', 'content', 'lessons');
  const resourcesDir = join(__dirname, '..', 'src', 'content', 'resources');

  console.log('🔗 Validating internal links...\n');

  function findMdxFiles(dir: string): string[] {
    const files: string[] = [];
    try {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        if (entry.startsWith('_')) continue;
        if (entry.endsWith('.bak')) continue;
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

  const allFiles = [...findMdxFiles(lessonsDir), ...findMdxFiles(resourcesDir)];
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of allFiles) {
    const content = readFileSync(file, 'utf-8');
    const shortPath = relative(join(__dirname, '..', 'src', 'content'), file);
    const issues = validateLinks(content, file);

    if (issues.length === 0) {
      console.log(`✓ ${shortPath}`);
    } else {
      const errors = issues.filter(i => i.severity === 'error').length;
      const warnings = issues.filter(i => i.severity === 'warning').length;
      totalErrors += errors;
      totalWarnings += warnings;

      console.log(`✗ ${shortPath} (${errors} errors, ${warnings} warnings)`);
      for (const issue of issues) {
        const icon = issue.severity === 'error' ? '❌' : '⚠️';
        console.log(`  ${icon} Line ${issue.line}: ${issue.message}`);
      }
      console.log('');
    }
  }

  console.log('─'.repeat(60));
  console.log(`📊 Link Validation Summary: ${allFiles.length} files checked`);
  console.log(`   Errors: ${totalErrors}`);
  console.log(`   Warnings: ${totalWarnings}`);

  if (totalErrors > 0) {
    console.log('\n❌ Link validation failed\n');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n⚠️  Passed with warnings\n');
    process.exit(0);
  } else {
    console.log('\n✅ All links valid!\n');
    process.exit(0);
  }
}
