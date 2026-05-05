import { execFileSync } from 'node:child_process';

export interface EntryDates {
  datePublished: Date;
  dateModified: Date;
}

interface FrontmatterDates {
  datePublished?: Date | string;
  dateModified?: Date | string;
}

const cache = new Map<string, EntryDates>();
const fallback = new Date();

function gitDate(file: string, mode: 'first' | 'last'): Date | undefined {
  try {
    const args =
      mode === 'first'
        ? ['log', '--diff-filter=A', '--follow', '--format=%aI', '--', file]
        : ['log', '-1', '--format=%aI', '--', file];
    const out = execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (!out) return undefined;
    const line = mode === 'first' ? out.split('\n').pop()?.trim() : out;
    if (!line) return undefined;
    const date = new Date(line);
    return Number.isNaN(date.getTime()) ? undefined : date;
  } catch {
    return undefined;
  }
}

function coerce(value: Date | string | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function getEntryDates(filePath: string, frontmatter: FrontmatterDates): EntryDates {
  const cached = cache.get(filePath);
  if (cached) return cached;

  const datePublished =
    coerce(frontmatter.datePublished) ?? gitDate(filePath, 'first') ?? fallback;
  const dateModified =
    coerce(frontmatter.dateModified) ?? gitDate(filePath, 'last') ?? datePublished;

  const result: EntryDates = { datePublished, dateModified };
  cache.set(filePath, result);
  return result;
}
