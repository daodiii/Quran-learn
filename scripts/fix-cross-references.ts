/**
 * Fix broken cross-reference links in MDX content files.
 *
 * The Astro glob loader generates IDs from filenames INCLUDING numeric prefixes,
 * so /learn/level-1/01-alphabet-letter-forms/ is valid but
 * /learn/level-1/alphabet-letter-forms is NOT.
 *
 * This script:
 * 1. Builds a map of all valid routes from actual filenames
 * 2. Scans all MDX files for internal links
 * 3. Resolves each broken link to the correct target
 * 4. Applies fixes in-place
 *
 * Usage: npx tsx scripts/fix-cross-references.ts [--dry-run]
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT_DIR = path.join(ROOT, "src/content");
const DRY_RUN = process.argv.includes("--dry-run");

// ── 1. Build valid route maps ──────────────────────────────────────────────

interface RouteInfo {
  /** Full URL path, e.g. /learn/level-1/01-alphabet-letter-forms */
  url: string;
  /** Slug without numeric prefix, e.g. alphabet-letter-forms */
  bareSlug: string;
}

function getFilesRecursive(dir: string, ext: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getFilesRecursive(full, ext));
    } else if (entry.name.endsWith(ext) && !entry.name.startsWith("_") && !entry.name.endsWith(".bak")) {
      results.push(full);
    }
  }
  return results;
}

/** Strip numeric prefix: "01-alphabet-letter-forms" → "alphabet-letter-forms" */
function stripNumericPrefix(slug: string): string {
  return slug.replace(/^\d+-/, "");
}

// Build lesson routes
const lessonFiles = getFilesRecursive(path.join(CONTENT_DIR, "lessons"), ".mdx");
const lessonRoutes: RouteInfo[] = lessonFiles.map((f) => {
  const rel = path.relative(path.join(CONTENT_DIR, "lessons"), f).replace(/\.mdx$/, "");
  // rel is like "level-1/01-alphabet-letter-forms"
  const parts = rel.split("/");
  const level = parts[0]; // "level-1"
  const fileSlug = parts[1]; // "01-alphabet-letter-forms"
  return {
    url: `/learn/${level}/${fileSlug}`,
    bareSlug: stripNumericPrefix(fileSlug),
  };
});

// Build resource routes
const resourceFiles = getFilesRecursive(path.join(CONTENT_DIR, "resources"), ".mdx");
const resourceRoutes: RouteInfo[] = resourceFiles.map((f) => {
  const slug = path.basename(f, ".mdx");
  return {
    url: `/resources/${slug}`,
    bareSlug: slug,
  };
});

// Build surah routes
const surahFiles = getFilesRecursive(path.join(CONTENT_DIR, "surahs"), ".mdx");
const surahRoutes: RouteInfo[] = surahFiles.map((f) => {
  const slug = path.basename(f, ".mdx");
  return {
    url: `/surahs/${slug}`,
    bareSlug: stripNumericPrefix(slug),
  };
});

const allRoutes = [...lessonRoutes, ...resourceRoutes, ...surahRoutes];

// ── 2. Build link resolution map ───────────────────────────────────────────

// Index routes by various keys for matching
const urlSet = new Set(allRoutes.map((r) => r.url));

// Map: "/learn/level-X/bare-slug" → correct URL
const bareLessonMap = new Map<string, string>();
for (const r of lessonRoutes) {
  const parts = r.url.split("/");
  const level = parts[2]; // "level-1"
  bareLessonMap.set(`/learn/${level}/${r.bareSlug}`, r.url);
}

// Map: "/resources/bare-slug" → correct URL
const bareResourceMap = new Map<string, string>();
for (const r of resourceRoutes) {
  bareResourceMap.set(`/resources/${r.bareSlug}`, r.url);
}

// Map: "/surahs/bare-slug" → correct URL
const bareSurahMap = new Map<string, string>();
for (const r of surahRoutes) {
  bareSurahMap.set(`/surahs/${r.bareSlug}`, r.url);
}

// ── 3. Manual alias map for alternate/shortened names ──────────────────────
// These handle cases where the link uses a completely different name

const manualAliases: Record<string, string> = {
  // Level 1 aliases
  "/learn/level-1/arabic-alphabet": "/learn/level-1/01-alphabet-letter-forms",
  "/learn/level-1/bismillah": "/learn/level-1/05-reading-bismillah",
  "/learn/level-1/definite-indefinite": "/learn/level-1/07-definite-article",
  "/learn/level-1/definiteness": "/learn/level-1/07-definite-article",
  "/learn/level-1/gender": "/learn/level-1/08-gender-masculine-feminine",
  "/learn/level-1/long-vowels": "/learn/level-1/03-long-vowels-diphthongs",
  "/learn/level-1/number": "/learn/level-1/09-singular-dual-plural",
  "/learn/level-1/proper-nouns": "/learn/level-1/06-three-word-types",
  "/learn/level-1/sentence-types": "/learn/level-1/10-simple-sentences",
  "/learn/level-1/subject-pronouns": "/learn/level-1/06-three-word-types",
  "/learn/level-1/sukun-shadda": "/learn/level-1/04-sukun-shadda-tanween",
  "/learn/level-1/tanween": "/learn/level-1/04-sukun-shadda-tanween",
  "/learn/level-1/word-types": "/learn/level-1/06-three-word-types",
  "/learn/level-1/grammatical-analysis": "/learn/level-1/11-case-endings",

  // Level 2 aliases
  "/learn/level-2/adjectives": "/learn/level-2/09-adjective-agreement",
  "/learn/level-2/adjectives-descriptive": "/learn/level-2/09-adjective-agreement",
  "/learn/level-2/alif-maqsura": "/learn/level-2/01-nominal-sentence",
  "/learn/level-2/alif-wasla": "/learn/level-2/01-nominal-sentence",
  "/learn/level-2/declinable": "/learn/level-2/04-nominative-case",
  "/learn/level-2/hidden-pronouns": "/learn/level-2/03-verbal-sentence",
  "/learn/level-2/idafah": "/learn/level-2/08-possessive-idafah",
  "/learn/level-2/idafah-possession": "/learn/level-2/08-possessive-idafah",
  "/learn/level-2/possessive-construction": "/learn/level-2/08-possessive-idafah",
  "/learn/level-2/prepositions": "/learn/level-2/07-prepositions-genitive",
  "/learn/level-2/present-tense": "/learn/level-3/04-present-tense",
  "/learn/level-2/relative-pronouns": "/learn/level-3/09-relative-pronouns",
  "/learn/level-2/sentence-types-review": "/learn/level-2/01-nominal-sentence",
  "/learn/level-2/simple-sentences": "/learn/level-1/10-simple-sentences",
  "/learn/level-2/verbal-sentences": "/learn/level-2/03-verbal-sentence",
  "/learn/level-2/demonstrative-pronouns": "/learn/level-3/08-demonstrative-pronouns",
  "/learn/level-2/attached-pronouns": "/learn/level-3/07-attached-pronouns",
  "/learn/level-2/imperative": "/learn/level-3/05-imperative",

  // Level 3 aliases
  "/learn/level-3/adverbs": "/learn/level-3/18-nouns-place-time",
  "/learn/level-3/circumstantial-expressions": "/learn/level-4/01-hal-clauses",
  "/learn/level-3/complex-idafah": "/learn/level-2/08-possessive-idafah",
  "/learn/level-3/conditional-sentences": "/learn/level-4/03-conditional-sentences",
  "/learn/level-3/defective-verbs": "/learn/level-4/13-defective-verbs",
  "/learn/level-3/exception": "/learn/level-4/05-exception-particles",
  "/learn/level-3/hollow-verbs": "/learn/level-4/12-hollow-verbs",
  "/learn/level-3/moods": "/learn/level-3/04-present-tense",
  "/learn/level-3/noun-of-instrument": "/learn/level-3/18-nouns-place-time",
  "/learn/level-3/noun-place-time": "/learn/level-3/18-nouns-place-time",
  "/learn/level-3/participles": "/learn/level-3/16-active-passive-participles",
  "/learn/level-3/past-present-tense": "/learn/level-3/03-past-tense",
  "/learn/level-3/place-time-nouns": "/learn/level-3/18-nouns-place-time",
  "/learn/level-3/roots-intro": "/learn/level-3/01-root-system",
  "/learn/level-3/sound-weak-verbs": "/learn/level-3/15-verb-forms-vii-x",
  "/learn/level-3/subjunctive-jussive": "/learn/level-3/04-present-tense",
  "/learn/level-3/subjunctive-mood": "/learn/level-3/04-present-tense",
  "/learn/level-3/verb-form-vii": "/learn/level-3/15-verb-forms-vii-x",
  "/learn/level-3/verb-form-viii": "/learn/level-3/15-verb-forms-vii-x",
  "/learn/level-3/verb-form-x": "/learn/level-3/15-verb-forms-vii-x",
  "/learn/level-3/verb-forms-ii-iii": "/learn/level-3/10-verb-form-ii",
  "/learn/level-3/verb-forms-rare": "/learn/level-3/15-verb-forms-vii-x",
  "/learn/level-3/verbal-noun": "/learn/level-3/17-verbal-nouns",
  "/learn/level-3/weak-verbs": "/learn/level-4/11-weak-verbs-intro",
  "/learn/level-3/weak-verbs-intro": "/learn/level-4/11-weak-verbs-intro",

  // Level 4 aliases
  "/learn/level-4/absolute-object": "/learn/level-4/07-maf-ul-mutlaq",
  "/learn/level-4/balagha-intro": "/learn/level-4/16-intro-balagha",
  "/learn/level-4/circumstantial-clause": "/learn/level-4/01-hal-clauses",
  "/learn/level-4/complex-sentences": "/learn/level-4/03-conditional-sentences",
  "/learn/level-4/conditional": "/learn/level-4/03-conditional-sentences",
  "/learn/level-4/conditionals": "/learn/level-4/03-conditional-sentences",
  "/learn/level-4/doubly-weak-verbs": "/learn/level-4/15-hamzated-verbs",
  "/learn/level-4/emphasis": "/learn/level-4/06-emphasis-affirmation",
  "/learn/level-4/emphasis-structures": "/learn/level-4/06-emphasis-affirmation",
  "/learn/level-4/exception-structures": "/learn/level-4/05-exception-particles",
  "/learn/level-4/introduction-balagha": "/learn/level-4/16-intro-balagha",
  "/learn/level-4/participles": "/learn/level-3/16-active-passive-participles",
  "/learn/level-4/prohibition": "/learn/level-4/10-negation-particles",
  "/learn/level-4/pronoun-agreement": "/learn/level-3/06-subject-pronouns",
  "/learn/level-4/pronoun-reference": "/learn/level-3/06-subject-pronouns",
  "/learn/level-4/relative-clauses": "/learn/level-3/09-relative-pronouns",
  "/learn/level-4/royal-plural": "/learn/level-1/09-singular-dual-plural",
  "/learn/level-4/specification": "/learn/level-4/02-tamyiz",
  "/learn/level-4/specification-tamyiz": "/learn/level-4/02-tamyiz",
  "/learn/level-4/verb-form-ix": "/learn/level-3/15-verb-forms-vii-x",
  "/learn/level-4/verb-form-v": "/learn/level-3/13-verb-form-v",
  "/learn/level-4/verb-form-vi": "/learn/level-3/14-verb-form-vi",
  "/learn/level-4/verb-form-vii": "/learn/level-3/15-verb-forms-vii-x",
  "/learn/level-4/verb-form-viii": "/learn/level-3/15-verb-forms-vii-x",
  "/learn/level-4/verb-form-x": "/learn/level-3/15-verb-forms-vii-x",
  "/learn/level-4/verbal-noun-usage": "/learn/level-3/17-verbal-nouns",

  // Level 5 aliases
  "/learn/level-5/advanced-morphology": "/learn/level-5/16-sarf-synthesis",
  "/learn/level-5/advanced-morphology-context": "/learn/level-5/16-sarf-synthesis",
  "/learn/level-5/ayat-al-kursi-analysis": "/learn/level-5/03-ayat-al-kursi",
  "/learn/level-5/complex-conditionals": "/learn/level-4/04-conditional-particles",
  "/learn/level-5/complex-sentences": "/learn/level-5/15-nahw-synthesis",
  "/learn/level-5/conditional-patterns": "/learn/level-4/03-conditional-sentences",
  "/learn/level-5/conditional-rhetoric": "/learn/level-4/04-conditional-particles",
  "/learn/level-5/ellipsis": "/learn/level-4/17-figures-of-speech",
  "/learn/level-5/embedded-clauses": "/learn/level-5/15-nahw-synthesis",
  "/learn/level-5/falaq-nas-analysis": "/learn/level-5/05-surah-al-falaq-an-nas",
  "/learn/level-5/fatiha-analysis": "/learn/level-5/02-surah-al-fatiha",
  "/learn/level-5/fronting-postponing": "/learn/level-5/14-word-order-emphasis",
  "/learn/level-5/introduction-balagha": "/learn/level-4/16-intro-balagha",
  "/learn/level-5/metaphor": "/learn/level-4/17-figures-of-speech",
  "/learn/level-5/negation-patterns": "/learn/level-4/10-negation-particles",
  "/learn/level-5/rhetoric-intro": "/learn/level-4/16-intro-balagha",
  "/learn/level-5/rhetorical-devices": "/learn/level-5/13-rhetorical-questions",
  "/learn/level-5/rhetorical-negation": "/learn/level-5/13-rhetorical-questions",
  "/learn/level-5/sentence-parsing-strategies": "/learn/level-5/01-full-irab-analysis",
  "/learn/level-5/simile": "/learn/level-4/17-figures-of-speech",
  "/learn/level-5/surah-al-fatiha-analysis": "/learn/level-5/02-surah-al-fatiha",
  "/learn/level-5/word-order": "/learn/level-5/14-word-order-emphasis",

  // Level index pages → learn index
  "/learn/level-2": "/learn/level-2/01-nominal-sentence",
  "/learn/level-3": "/learn/level-3/01-root-system",
  "/learn/level-4": "/learn/level-4/01-hal-clauses",
  "/learn/level-5": "/learn/level-5/01-full-irab-analysis",

  // Resource aliases
  "/resources/case-system": "/resources/case-endings-chart",
  "/resources/common-words": "/resources/200-most-used-words",
  "/resources/form-i-verbs": "/resources/verb-conjugation-tables",
  "/resources/grammar-charts": "/resources/case-endings-chart",
  "/resources/grammar-glossary": "/resources/glossary",
  "/resources/idafah-chart": "/resources/case-endings-chart",
  "/resources/numbers": "/resources/200-most-used-words",
  "/resources/prepositions-chart": "/resources/case-endings-chart",
  "/resources/quran-text": "/resources/200-most-used-words",
  "/resources/root-system-guide": "/resources/root-system",
  "/resources/verb-forms-chart": "/resources/verb-conjugation-tables",
  "/resources/verb-tables": "/resources/verb-conjugation-tables",
};

// ── 4. Link resolver ───────────────────────────────────────────────────────

function resolveLink(linkTarget: string): string | null {
  // Strip trailing slash for matching
  const target = linkTarget.replace(/\/$/, "");

  // Already a valid route?
  if (urlSet.has(target)) return null; // no change needed

  // Check manual aliases first (most specific)
  if (manualAliases[target]) return manualAliases[target];

  // Try bare slug match (link without numeric prefix → file with prefix)
  if (target.startsWith("/learn/")) {
    const match = bareLessonMap.get(target);
    if (match) return match;
  }
  if (target.startsWith("/resources/")) {
    const match = bareResourceMap.get(target);
    if (match) return match;
  }
  if (target.startsWith("/surahs/")) {
    const match = bareSurahMap.get(target);
    if (match) return match;
  }

  // No match found
  return undefined as unknown as null;
}

// ── 5. Scan and fix ────────────────────────────────────────────────────────

const allMdxFiles = getFilesRecursive(CONTENT_DIR, ".mdx");

let totalLinksFound = 0;
let totalLinksFixed = 0;
let totalLinksBroken = 0;
const unfixableLinks: { file: string; link: string }[] = [];
const fixedLinks: { file: string; from: string; to: string }[] = [];

// Match markdown links: [text](/learn/...) or [text](/resources/...) or [text](/surahs/...)
// Also capture optional fragment (#anchor) and trailing slash
const linkPattern = /\]\(\/(learn|resources|surahs)(\/[^)#\s]*?)(\/?)(#[^)\s]*)?\)/g;

for (const filePath of allMdxFiles) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(ROOT, filePath);
  let newContent = content;
  let fileChanged = false;

  // Process all links in the file
  const matches = [...content.matchAll(linkPattern)];
  for (const match of matches) {
    totalLinksFound++;
    const fullMatch = match[0]; // "](/learn/level-1/gender)"
    const prefix = match[1]; // "learn" | "resources" | "surahs"
    const pathPart = match[2]; // "/level-1/gender"
    const fragment = match[4] || ""; // "#anchor" | ""

    const linkTarget = `/${prefix}${pathPart}`;
    const resolved = resolveLink(linkTarget);

    if (resolved === null) {
      // Already valid, no change needed
      continue;
    }

    if (resolved === undefined || resolved === (undefined as unknown as null)) {
      // Couldn't resolve
      totalLinksBroken++;
      unfixableLinks.push({ file: relPath, link: linkTarget });
      continue;
    }

    // Build replacement
    const replacement = `](${resolved}${fragment})`;
    // We need to replace the specific occurrence
    // Use indexOf from the match position to be safe
    const idx = newContent.indexOf(fullMatch);
    if (idx !== -1) {
      newContent = newContent.slice(0, idx) + replacement + newContent.slice(idx + fullMatch.length);
      fileChanged = true;
      totalLinksFixed++;
      fixedLinks.push({ file: relPath, from: linkTarget, to: resolved });
    }
  }

  if (fileChanged && !DRY_RUN) {
    fs.writeFileSync(filePath, newContent, "utf-8");
  }
}

// ── 6. Report ──────────────────────────────────────────────────────────────

console.log(`\n${"═".repeat(60)}`);
console.log(`  Cross-Reference Link Fix Report${DRY_RUN ? " (DRY RUN)" : ""}`);
console.log(`${"═".repeat(60)}\n`);
console.log(`  Total internal links scanned:  ${totalLinksFound}`);
console.log(`  Already valid:                 ${totalLinksFound - totalLinksFixed - totalLinksBroken}`);
console.log(`  Fixed:                         ${totalLinksFixed}`);
console.log(`  Could not resolve:             ${totalLinksBroken}`);
console.log();

if (fixedLinks.length > 0) {
  console.log(`── Fixed Links ──────────────────────────────────────────────`);
  // Group by file
  const byFile = new Map<string, typeof fixedLinks>();
  for (const fix of fixedLinks) {
    if (!byFile.has(fix.file)) byFile.set(fix.file, []);
    byFile.get(fix.file)!.push(fix);
  }
  for (const [file, fixes] of byFile) {
    console.log(`\n  ${file}:`);
    for (const fix of fixes) {
      console.log(`    ${fix.from}`);
      console.log(`      → ${fix.to}`);
    }
  }
}

if (unfixableLinks.length > 0) {
  console.log(`\n── Unresolved Links (need manual review) ────────────────────`);
  for (const { file, link } of unfixableLinks) {
    console.log(`  ${file}: ${link}`);
  }
}

console.log(`\n${"═".repeat(60)}\n`);
