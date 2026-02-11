#!/usr/bin/env node
/**
 * Reformats old-style surah MDX files to use MDX components.
 *
 * Transformations:
 * 1. Adds MDX component imports after frontmatter
 * 2. Wraps word-by-word breakdown tables in <GrammarTable>
 * 3. Converts **Arabic:** and **Translation:** to <ArabicExample /> components
 * 4. Converts #### Grammar Notes bullet points to <Callout> components
 * 5. Wraps Key Vocabulary table in <GrammarTable>
 * 6. Wraps Grammar Summary content in <Callout type="note">
 * 7. Adds placeholder sections for Structural Overview, Nahw-Sarf-Balagha Synthesis, and Practice Exercises
 */

import { readFileSync, writeFileSync } from 'fs';
import { basename } from 'path';

const FILES = [
  'src/content/surahs/078-an-naba.mdx',
  'src/content/surahs/079-an-naziat.mdx',
  'src/content/surahs/080-abasa.mdx',
  'src/content/surahs/083-al-mutaffifin.mdx',
  'src/content/surahs/089-al-fajr.mdx',
];

// Surah metadata for ArabicExample references
const SURAH_META = {
  '078': { name: 'An-Naba', num: 78 },
  '079': { name: "An-Nazi'at", num: 79 },
  '080': { name: "'Abasa", num: 80 },
  '083': { name: 'Al-Mutaffifin', num: 83 },
  '089': { name: 'Al-Fajr', num: 89 },
};

function getSurahNum(filePath) {
  const match = basename(filePath).match(/^(\d{3})/);
  return match ? match[1] : null;
}

function addImports(content) {
  // Add imports after the closing --- of frontmatter
  const fmEnd = content.indexOf('---', content.indexOf('---') + 3);
  if (fmEnd === -1) return content;

  const imports = `\nimport ArabicExample from '@components/mdx/ArabicExample.astro';\nimport GrammarTable from '@components/mdx/GrammarTable.astro';\nimport Callout from '@components/mdx/Callout.astro';\nimport ExerciseBox from '@components/mdx/ExerciseBox.astro';\n`;

  return content.slice(0, fmEnd + 3) + imports + content.slice(fmEnd + 3);
}

function simpleTransliterate(arabic) {
  // Very simple transliteration - just for the component, not linguistically perfect
  return arabic
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove tashkeel for simpler transliteration
    .trim();
}

function extractHighlight(arabic) {
  // Pick the first significant word (skip particles/conjunctions that are 1-2 chars)
  const words = arabic.split(/\s+/).filter(w => w.replace(/[\u064B-\u065F\u0670]/g, '').length > 2);
  if (words.length >= 2) return words[0] + ',' + words[1];
  if (words.length === 1) return words[0];
  return arabic.split(/\s+/)[0] || '';
}

function transformVerses(content, surahMeta) {
  const lines = content.split('\n');
  const result = [];
  let i = 0;
  let currentVerse = 0;
  let inGrammarNotes = false;
  let grammarNotesLines = [];
  let inKeyVocab = false;
  let inGrammarSummary = false;
  let keyVocabStarted = false;
  let grammarSummaryStarted = false;
  let inTable = false;
  let tableLines = [];
  let isBreakdownTable = false;
  let isKeyVocabTable = false;

  while (i < lines.length) {
    const line = lines[i];
    const nextLine = i + 1 < lines.length ? lines[i + 1] : '';

    // Detect verse heading
    const verseMatch = line.match(/^### Verse (\d+)/);
    if (verseMatch) {
      currentVerse = parseInt(verseMatch[1]);
      // Flush any pending grammar notes
      if (grammarNotesLines.length > 0) {
        result.push(...flushGrammarNotes(grammarNotesLines));
        grammarNotesLines = [];
        inGrammarNotes = false;
      }
      result.push(line);
      i++;
      continue;
    }

    // Convert **Arabic:** line + **Translation:** line to <ArabicExample />
    if (line.startsWith('**Arabic:**')) {
      const arabicText = line.replace('**Arabic:**', '').trim();
      // Look for translation on next non-empty line
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;

      if (j < lines.length && lines[j].startsWith('**Translation:**')) {
        const translationText = lines[j]
          .replace('**Translation:**', '')
          .trim()
          .replace(/^"/, '').replace(/"$/, '');

        const highlight = extractHighlight(arabicText);

        result.push('');
        result.push('<ArabicExample');
        result.push(`  arabic="${arabicText}"`);
        result.push(`  transliteration="..."`);
        result.push(`  translation="${translationText}"`);
        result.push(`  reference="${surahMeta.name} ${surahMeta.num}:${currentVerse}"`);
        result.push(`  highlight="${highlight}"`);
        result.push('/>');
        result.push('');

        i = j + 1;
        continue;
      }
    }

    // Detect table start (| # | or | Arabic |)
    if (line.match(/^\|\s*#\s*\|/) || (line.match(/^\|\s*Arabic\s*\|/) && !line.includes('Sentence Type'))) {
      // This is a word-by-word breakdown table
      isBreakdownTable = true;
      inTable = true;
      tableLines = [line];
      i++;
      continue;
    }

    if (inTable) {
      if (line.startsWith('|')) {
        tableLines.push(line);
        i++;
        continue;
      } else {
        // Table ended
        inTable = false;
        if (isBreakdownTable) {
          result.push('<GrammarTable>');
          result.push(...tableLines);
          result.push('</GrammarTable>');
        } else {
          result.push(...tableLines);
        }
        tableLines = [];
        isBreakdownTable = false;
        // Don't increment i, process this line normally
        continue;
      }
    }

    // Convert #### Grammar Notes section to <Callout>
    if (line.match(/^####\s*Grammar Notes/)) {
      inGrammarNotes = true;
      grammarNotesLines = [];
      i++;
      continue;
    }

    if (inGrammarNotes) {
      if (line.startsWith('- ') || line.startsWith('  ') || line.trim() === '') {
        grammarNotesLines.push(line);
        i++;
        continue;
      } else {
        // Grammar notes section ended
        result.push(...flushGrammarNotes(grammarNotesLines));
        grammarNotesLines = [];
        inGrammarNotes = false;
        // Add Nahw-Sarf-Balagha Synthesis placeholder
        result.push('');
        result.push('#### Nahw-Sarf-Balagha Synthesis');
        result.push('');
        result.push('**Nahw (Syntax):** [Sentence structure analysis for this verse]');
        result.push('');
        result.push('**Sarf (Morphology):** [Word form/pattern analysis for this verse]');
        result.push('');
        result.push('**Balagha (Rhetoric):** [Rhetorical/literary analysis for this verse]');
        result.push('');
        // Don't increment, reprocess this line
        continue;
      }
    }

    // Detect ## Key Vocabulary section
    if (line.match(/^## Key Vocabulary/)) {
      // Flush any pending grammar notes
      if (grammarNotesLines.length > 0) {
        result.push(...flushGrammarNotes(grammarNotesLines));
        grammarNotesLines = [];
        inGrammarNotes = false;
        // Add last verse's synthesis
        result.push('');
        result.push('#### Nahw-Sarf-Balagha Synthesis');
        result.push('');
        result.push('**Nahw (Syntax):** [Sentence structure analysis for this verse]');
        result.push('');
        result.push('**Sarf (Morphology):** [Word form/pattern analysis for this verse]');
        result.push('');
        result.push('**Balagha (Rhetoric):** [Rhetorical/literary analysis for this verse]');
        result.push('');
      }

      // Add Practice Exercises placeholder before Key Vocabulary
      result.push('## Practice Exercises');
      result.push('');
      result.push('<ExerciseBox question="[Exercise question about a key grammar concept in this surah]">');
      result.push('');
      result.push('[Detailed answer explaining the grammar concept]');
      result.push('');
      result.push('</ExerciseBox>');
      result.push('');
      result.push('<ExerciseBox question="[Second exercise question about another grammar concept]">');
      result.push('');
      result.push('[Detailed answer]');
      result.push('');
      result.push('</ExerciseBox>');
      result.push('');

      result.push(line);
      result.push('');
      inKeyVocab = true;
      i++;
      continue;
    }

    // Wrap Key Vocabulary table
    if (inKeyVocab) {
      if (line.match(/^\|\s*Arabic\s*\|/)) {
        result.push('<GrammarTable>');
        result.push(line);
        // Continue collecting table lines
        i++;
        while (i < lines.length && lines[i].startsWith('|')) {
          result.push(lines[i]);
          i++;
        }
        result.push('</GrammarTable>');
        inKeyVocab = false;
        continue;
      }
    }

    // Detect ## Grammar Summary section
    if (line.match(/^## Grammar Summary/)) {
      result.push(line);
      result.push('');
      result.push('<Callout type="note" title="Key Grammar Concepts in This Surah">');
      inGrammarSummary = true;
      i++;
      continue;
    }

    if (inGrammarSummary) {
      // Check if we hit the end (next ## heading or end of file)
      if (line.match(/^## /) || i === lines.length - 1) {
        if (i === lines.length - 1 && line.trim()) result.push(line);
        result.push('</Callout>');
        inGrammarSummary = false;
        if (line.match(/^## /)) {
          result.push('');
          result.push(line);
        }
        i++;
        continue;
      }
      result.push(line);
      i++;
      continue;
    }

    // Default: pass through
    result.push(line);
    i++;
  }

  // Flush any remaining grammar notes
  if (grammarNotesLines.length > 0) {
    result.push(...flushGrammarNotes(grammarNotesLines));
  }

  // Close grammar summary if still open
  if (inGrammarSummary) {
    result.push('</Callout>');
  }

  // Flush any remaining table
  if (inTable && tableLines.length > 0) {
    if (isBreakdownTable) {
      result.push('<GrammarTable>');
      result.push(...tableLines);
      result.push('</GrammarTable>');
    } else {
      result.push(...tableLines);
    }
  }

  return result.join('\n');
}

function flushGrammarNotes(lines) {
  // Filter out empty trailing lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }
  if (lines.length === 0) return [];

  // Find the first bullet point to use as the title
  const firstBullet = lines.find(l => l.startsWith('- '));
  const title = firstBullet
    ? firstBullet.replace(/^- /, '').slice(0, 60).replace(/['"]/g, '') + (firstBullet.length > 60 ? '...' : '')
    : 'Grammar Note';

  const result = [];
  result.push('');
  result.push(`<Callout type="tip" title="Grammar Note">`);
  for (const line of lines) {
    if (line.trim()) result.push(line);
  }
  result.push('</Callout>');
  result.push('');

  return result;
}

function addStructuralOverview(content) {
  // Add a structural overview placeholder after the Overview section
  const overviewEnd = content.indexOf('## Verse-by-Verse Analysis');
  if (overviewEnd === -1) return content;

  const placeholder = `
### Structural Overview

<GrammarTable>
| Verse | Arabic | Sentence Type | Key Grammar | Message |
|-------|--------|---------------|-------------|---------|
| ... | ... | ... | ... | ... |
</GrammarTable>

<Callout type="tip" title="Surah Architecture">
[Insightful observation about the overall structure and grammar patterns of this surah]
</Callout>

`;

  return content.slice(0, overviewEnd) + placeholder + content.slice(overviewEnd);
}

// Main
for (const filePath of FILES) {
  const fullPath = `/Users/daodilyas/quran-learn/${filePath}`;
  console.log(`Processing ${filePath}...`);

  let content = readFileSync(fullPath, 'utf-8');
  const surahNum = getSurahNum(filePath);
  const meta = SURAH_META[surahNum];

  if (!meta) {
    console.log(`  Skipping - no metadata for ${surahNum}`);
    continue;
  }

  // Check if already reformatted
  if (content.includes('import ArabicExample')) {
    console.log(`  Already reformatted, skipping.`);
    continue;
  }

  // Step 1: Add imports
  content = addImports(content);

  // Step 2: Transform verses (tables, Arabic examples, grammar notes)
  content = transformVerses(content, meta);

  // Step 3: Add structural overview placeholder
  content = addStructuralOverview(content);

  writeFileSync(fullPath, content, 'utf-8');
  console.log(`  Done.`);
}

console.log('\nAll files processed. Placeholder sections marked with [...] need manual content.');
