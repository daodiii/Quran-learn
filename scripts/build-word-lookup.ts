// scripts/build-word-lookup.ts
// Word Lookup dataset: corpus + curated verb/noun glosses → public/data/word-lookup.json
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { parseCorpusRows, groupWords } from './lib/group-words.ts';
import { buildIndex, buildNounGlossMap } from './lib/word-index.ts';

const CORPUS = 'src/data/morphology/quranic-corpus-morphology-0.4.txt';
const VERB_FORMS = 'public/data/verb-forms.json';
const NOUN_GLOSSES_DIR = 'src/data/morphology/glosses-nouns/output';
const OUT = 'public/data/word-lookup.json';
const GZIP_BUDGET = 800 * 1024; // spec guard (actual output ~716 KB; plan estimate was 600 KB)

if (!existsSync(NOUN_GLOSSES_DIR))
  throw new Error(`noun gloss dir missing: ${NOUN_GLOSSES_DIR} — the curated batches are ` +
    `committed to the repo; regenerate inputs with scripts/build-noun-gloss-batches.ts`);
const nounBatches = readdirSync(NOUN_GLOSSES_DIR)
  .filter(f => /^batch-\d+\.json$/.test(f)).sort()
  .map(f => JSON.parse(readFileSync(`${NOUN_GLOSSES_DIR}/${f}`, 'utf8')));
const nounGlosses = buildNounGlossMap(nounBatches);

const words = groupWords(parseCorpusRows(readFileSync(CORPUS, 'utf8')));
const index = buildIndex(words, JSON.parse(readFileSync(VERB_FORMS, 'utf8')), nounGlosses);
const json = JSON.stringify(index);
const gz = gzipSync(json).length;

const all = Object.values(index.words).flat();
const glossless = all.filter(a => a[4] === 'V' && a[9] === null);
const nounGlossed = all.filter(a => a[4] !== 'V' && a[9] !== null);
const nounGlossless = all.filter(a => a[4] !== 'V' && a[9] === null);
console.log(`words=${words.length} keys=${index.meta.words} analyses=${index.meta.analyses}`);
console.log(`altKeys=${Object.keys(index.altKeys).length} verbs-without-gloss=${glossless.length}`);
console.log(`noun-glosses=${nounGlosses.size} lemmas → ${nounGlossed.length} analyses glossed, ` +
  `${nounGlossless.length} non-verb analyses still pending`);
console.log(`raw=${(json.length / 1024).toFixed(0)}KB gzip=${(gz / 1024).toFixed(0)}KB`);
if (gz > GZIP_BUDGET) {
  console.error(`FAIL: gzip ${gz} exceeds ${GZIP_BUDGET} budget (spec: trim refs or shard)`);
  process.exit(1);
}
mkdirSync('public/data', { recursive: true });
writeFileSync(OUT, json);
console.log(`→ ${OUT}`);
