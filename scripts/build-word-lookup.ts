// scripts/build-word-lookup.ts
// Word Lookup dataset: corpus + curated verb glosses → public/data/word-lookup.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { parseCorpusRows, groupWords } from './lib/group-words.ts';
import { buildIndex } from './lib/word-index.ts';

const CORPUS = 'src/data/morphology/quranic-corpus-morphology-0.4.txt';
const VERB_FORMS = 'public/data/verb-forms.json';
const OUT = 'public/data/word-lookup.json';
const GZIP_BUDGET = 800 * 1024; // spec guard (actual output ~716 KB; plan estimate was 600 KB)

const words = groupWords(parseCorpusRows(readFileSync(CORPUS, 'utf8')));
const index = buildIndex(words, JSON.parse(readFileSync(VERB_FORMS, 'utf8')));
const json = JSON.stringify(index);
const gz = gzipSync(json).length;

const glossless = Object.values(index.words).flat()
  .filter(a => a[4] === 'V' && a[9] === null);
console.log(`words=${words.length} keys=${index.meta.words} analyses=${index.meta.analyses}`);
console.log(`altKeys=${Object.keys(index.altKeys).length} verbs-without-gloss=${glossless.length}`);
console.log(`raw=${(json.length / 1024).toFixed(0)}KB gzip=${(gz / 1024).toFixed(0)}KB`);
if (gz > GZIP_BUDGET) {
  console.error(`FAIL: gzip ${gz} exceeds ${GZIP_BUDGET} budget (spec: trim refs or shard)`);
  process.exit(1);
}
mkdirSync('public/data', { recursive: true });
writeFileSync(OUT, json);
console.log(`→ ${OUT}`);
