// scripts/build-finder-phrases.ts
// Opening phrases for the finder (bismillah, alhamdulillah, ...). The Arabic is taken word by word from the
// corpus, never typed by hand; only the plain English in phrases.spec.json is written by us.
//   node scripts/build-finder-phrases.ts   → src/data/finder/phrases.json
import { readFileSync, writeFileSync } from 'node:fs';
import { parseCorpusRows, groupWords } from './lib/group-words.ts';
import { bwToArabicSurface, bwToTranslitSurface } from './lib/bw-surface.ts';

interface Spec { slug: string; ref: string; from: number; to: number; easy: string; note: string | null; type: string[]; parts: Array<{ w: [number, number]; say: string }> }
const specs: Spec[] = JSON.parse(readFileSync('src/data/finder/phrases.spec.json', 'utf8'));
const words = groupWords(parseCorpusRows(readFileSync('src/data/morphology/quranic-corpus-morphology-0.4.txt', 'utf8')));
const byKey = new Map(words.map(w => [w.key, w]));

const out: Record<string, unknown> = {};
for (const s of specs) {
  const [sur, ay] = s.ref.split(':');
  const get = (n: number) => {
    const w = byKey.get(`${sur}:${ay}:${n}`);
    if (!w) throw new Error(`phrase ${s.slug}: no word ${n} in ${s.ref}`);
    return w;
  };
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => get(a + i));
  const covered = s.parts.flatMap(p => range(...p.w).map(w => w.key));
  const all = range(s.from, s.to).map(w => w.key);
  if (covered.join() !== all.join()) throw new Error(`phrase ${s.slug}: parts do not cover words ${s.from}-${s.to} exactly`);
  out[`phrase|${s.slug}`] = {
    easy: s.easy, kind: 'phrase', type: s.type, note: s.note, check: false,
    n: 3000,                       // ranking weight only (a phrase is not counted in the Quran); the page never shows it
    r: [],
    ph: {
      ar: range(s.from, s.to).map(w => bwToArabicSurface(w.surfaceBw)).join(' '),
      translit: range(s.from, s.to).map(w => bwToTranslitSurface(w.surfaceBw)).join(' '),
      ref: s.ref,
      parts: s.parts.map(p => ({ ar: range(...p.w).map(w => bwToArabicSurface(w.surfaceBw)).join(' '), say: p.say })),
    },
  };
}
writeFileSync('src/data/finder/phrases.json', JSON.stringify(out));
console.log(`phrases=${Object.keys(out).length}`);
for (const [k, v] of Object.entries(out)) console.log(k, (v as any).ph.ar, '|', (v as any).ph.translit);
