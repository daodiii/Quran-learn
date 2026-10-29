// scripts/build-finder-words.ts
// A slimmer copy of word-lookup.json for the finder page: no English gloss (the plain-English layer
// replaces it) and only the first verse reference per row. About 30% smaller when compressed.
//   node scripts/build-finder-words.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const src = JSON.parse(readFileSync('public/data/word-lookup.json', 'utf8'));
const words: Record<string, unknown[]> = {};
for (const [k, list] of Object.entries(src.words as Record<string, any[][]>))
  words[k] = list.map(a => [...a.slice(0, 9), null, a[10], a[11].slice(0, 1)]);
const out = JSON.stringify({ meta: src.meta, altKeys: src.altKeys, words });
writeFileSync('public/data/finder-words.json', out);
console.log(`finder-words.json raw=${(out.length / 1024).toFixed(0)}KB gzip=${(gzipSync(out).length / 1024).toFixed(0)}KB`);
