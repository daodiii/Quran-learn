// scripts/build-noun-gloss-batches.ts
// Phase-2 workload extraction: glossless non-verb lemmas from the shipped
// lookup index, frequency-sorted, chunked into curation batch inputs.
//
//   tsx scripts/build-noun-gloss-batches.ts [--top 305] [--per-batch 55]
//
// Rootless/lemmaless analyses (e.g. muqatta'at, some particles) are excluded:
// they cannot be keyed by lemma|pos and need a separate surface-level pass.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const INDEX = 'public/data/word-lookup.json';
const OUT_DIR = 'src/data/morphology/glosses-nouns/input';

const args = process.argv.slice(2);
const flag = (name: string, dflt: number) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : dflt;
};
const TOP = flag('top', 305);
const PER_BATCH = flag('per-batch', 55);

interface Entry {
  lemma: string; pos: string; root: string | null;
  count: number; samples: { surface: string; translit: string; ref: string }[];
}

const index = JSON.parse(readFileSync(INDEX, 'utf8'));
const byKey = new Map<string, Entry>();
for (const list of Object.values<any[]>(index.words)) {
  for (const a of list) {
    if (a[4] === 'V' || a[9] !== null || !a[3]) continue;
    const key = `${a[3]}|${a[4]}`;
    let e = byKey.get(key);
    if (!e) {
      e = { lemma: a[3], pos: a[4], root: a[2], count: 0, samples: [] };
      byKey.set(key, e);
    }
    e.count += a[10];
    if (e.samples.length < 2)
      e.samples.push({ surface: a[0], translit: a[1], ref: a[11][0] });
  }
}

const sorted = [...byKey.values()].sort((a, b) => b.count - a.count);
const picked = sorted.slice(0, TOP);
const totalOcc = sorted.reduce((n, e) => n + e.count, 0);
const pickedOcc = picked.reduce((n, e) => n + e.count, 0);

mkdirSync(OUT_DIR, { recursive: true });
let batchNo = 0;
for (let i = 0; i < picked.length; i += PER_BATCH) {
  batchNo++;
  const nn = String(batchNo).padStart(2, '0');
  writeFileSync(`${OUT_DIR}/batch-${nn}.input.json`,
    JSON.stringify({ batch: `batch-${nn}`, entries: picked.slice(i, i + PER_BATCH) }, null, 1));
}

console.log(`glossless non-verb lemmas: ${sorted.length} (${totalOcc} occurrences)`);
console.log(`picked top ${picked.length} → ${batchNo} batches of ≤${PER_BATCH}`);
console.log(`occurrence coverage: ${(100 * pickedOcc / totalOcc).toFixed(1)}%`);
