// Deterministic per-lesson vocabulary selection. Words come ONLY from Arabic
// the lesson actually displays (ArabicExample arabic props); glosses/counts
// come from the shipped word-lookup index. No generated Arabic, ever.
import { normalizeArabic } from '../../src/lib/arabic-normalize.ts';

export interface VocabEntry {
  arabic: string; translit: string; gloss: string;
  root: string | null; count: number;
}
interface LookupIndex {
  words: Record<string, any[][]>;
  altKeys: Record<string, string>;
}

const ARABIC_PROP_RE = /<ArabicExample[^>]*?\barabic=(?:"([^"]+)"|\{`([^`]+)`\})/gs;

export function extractArabicProps(mdx: string): string[] {
  const out: string[] = [];
  for (const m of mdx.matchAll(ARABIC_PROP_RE)) out.push((m[1] ?? m[2]).trim());
  return out;
}

export function selectLessonVocab(
  arabicStrings: string[], index: LookupIndex,
  registry: Set<string>, max: number,
): VocabEntry[] {
  const seen = new Map<string, VocabEntry>();
  for (const s of arabicStrings) {
    for (const token of s.split(/\s+/)) {
      const stripped = token.replace(/[۝۞].*$/u, '').trim(); // drop ayah markers
      if (!stripped) continue;
      const norm = normalizeArabic(stripped);
      if (!norm) continue;
      const key = index.words[norm] ? norm : index.altKeys[norm];
      if (!key || registry.has(key)) continue;
      const analyses = index.words[key];
      const best = analyses
        .filter(a => a[9])                                  // glossed only
        .sort((x, y) => y[10] - x[10])[0];
      if (!best) continue;
      const existing = seen.get(key);
      if (!existing || best[10] > existing.count) {
        seen.set(key, {
          arabic: best[0], translit: best[1], gloss: best[9],
          root: best[2], count: best[10],
        });
      }
    }
  }
  const picked = [...seen.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, max);
  for (const [key] of picked) registry.add(key);
  return picked.map(([, v]) => v);
}
