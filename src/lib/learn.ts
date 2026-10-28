/**
 * Pure helpers for /learn: query matching and progress arithmetic.
 * No imports, so the page (at build) and src/scripts/learn.ts (in the browser) share one definition
 * and the search text the page writes is folded the same way the visitor's query is.
 */

/** Lower-case, drop accents and apostrophes, collapse spaces: "Raf'" and "raf" meet. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’'`ʿʾ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function queryWords(query: string): string[] {
  const n = normalize(query);
  return n ? n.split(' ') : [];
}

/** Every word of the query must appear somewhere in the (already normalized) text. */
export function matchesQuery(text: string, words: string[]): boolean {
  return words.every((w) => text.includes(w));
}

/** The first lesson, in course order, that is not done. A skipped lesson stays "next". */
export function nextLesson<T extends { id: string }>(ordered: T[], done: ReadonlySet<string>): T | null {
  return ordered.find((l) => !done.has(l.id)) ?? null;
}

/** Done and total per level. Ids that are not in the course are ignored. */
export function levelProgress(
  ordered: { id: string; level: number }[],
  done: ReadonlySet<string>,
): Map<number, { done: number; total: number }> {
  const out = new Map<number, { done: number; total: number }>();
  for (const l of ordered) {
    const p = out.get(l.level) ?? { done: 0, total: 0 };
    p.total++;
    if (done.has(l.id)) p.done++;
    out.set(l.level, p);
  }
  return out;
}
