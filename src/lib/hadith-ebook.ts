/**
 * Reads a hadith page's MDX body into plain data for the PDF book, so the PDF is
 * built from the same files as the website and cannot drift from them.
 *
 * A page is a few `## ` sections. Each section has one <ArabicExample> and, unless
 * it is the "The Whole Hadith" block, one <GrammarTable> word table.
 */

export interface WordRow {
  ar: string;
  tr: string;
  en: string;
  why: string;
}

export interface Section {
  heading: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  rows: WordRow[];
}

export interface HadithDoc {
  /** Prose between the imports and the first section, if any. */
  intro: string;
  sections: Section[];
  /** The block shown first: "The Whole Hadith" if the page has one, else the first section. */
  whole: Section;
  /** True when the page has its own "The Whole Hadith" block ahead of the parts. */
  hasSeparateWhole: boolean;
  /** Sections that carry a word table, in page order. */
  parts: Section[];
}

const WHOLE_HEADING = 'The Whole Hadith';

function attributes(source: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of source.matchAll(/(\w+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}

function parseRows(table: string): WordRow[] {
  return table
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'))
    .slice(2) // header and separator
    .map((line) => {
      const cells = line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      return { ar: cells[1] ?? '', tr: cells[2] ?? '', en: cells[3] ?? '', why: cells[4] ?? '' };
    });
}

export function parseHadithBody(rawBody: string): HadithDoc {
  const body = rawBody.replace(/\r\n/g, '\n').replace(/^import .*$/gm, '');
  const chunks = body.split(/^## /m);
  const intro = chunks[0].trim();

  const sections: Section[] = [];
  for (const chunk of chunks.slice(1)) {
    const newline = chunk.indexOf('\n');
    const heading = chunk.slice(0, newline).trim().replace(/^\d+\.\s*/, '');
    const example = chunk.match(/<ArabicExample\s+([\s\S]*?)\/>/);
    const table = chunk.match(/<GrammarTable>([\s\S]*?)<\/GrammarTable>/)?.[1];
    if (!example) {
      // Some pages put the word table under its own "## Word by Word" heading.
      const previous = sections[sections.length - 1];
      if (table && previous && previous.rows.length === 0) previous.rows = parseRows(table);
      continue;
    }
    const a = attributes(example[1]);
    sections.push({
      heading,
      arabic: a.arabic ?? '',
      transliteration: a.transliteration ?? '',
      translation: a.translation ?? '',
      reference: a.reference ?? '',
      rows: table ? parseRows(table) : [],
    });
  }

  if (sections.length === 0) throw new Error('hadith body has no <ArabicExample> section');
  const separate = sections.find((s) => s.heading === WHOLE_HEADING);
  return {
    intro,
    sections,
    whole: separate ?? sections[0],
    hasSeparateWhole: Boolean(separate),
    parts: sections.filter((s) => s.rows.length > 0),
  };
}

const ARABIC_RUN = /([؀-ۿݐ-ݿ]+(?:\s+[؀-ۿݐ-ݿ]+)*)/;

/** Splits text into Arabic and non-Arabic runs, so the Arabic can get its own font. */
export function splitArabicRuns(text: string): Array<{ text: string; arabic: boolean }> {
  return text
    .split(ARABIC_RUN)
    .filter((s) => s !== '')
    .map((s) => ({ text: s, arabic: ARABIC_RUN.test(s) }));
}
