// Noun/particle gloss validation (Phase-2 curation).
// Modes:
//   --batch NN     validate glosses-nouns/output/batch-NN.json against its input
//   --all-batches  validate every output batch present
import { readFileSync, readdirSync } from 'node:fs';

// English gloss register: senses comma-separated, parenthetical qualifiers OK.
// Unlike verb glosses there is no "to " requirement — prepositions may still
// legitimately contain "to" as a sense (e.g. إلى "to, toward").
const MEANING = /^[a-zA-Z0-9(),;:'’\- ]{2,90}$/;

let failures = 0;
const fail = (msg: string) => { failures++; console.error(`FAIL ${msg}`); };

function validateBatch(nn: string) {
  const before = failures;
  const input = JSON.parse(
    readFileSync(`src/data/morphology/glosses-nouns/input/batch-${nn}.input.json`, 'utf8'));
  const output = JSON.parse(
    readFileSync(`src/data/morphology/glosses-nouns/output/batch-${nn}.json`, 'utf8'));
  if (output.batch !== `batch-${nn}`) fail(`batch-${nn}: batch field says ${output.batch}`);

  const expect = new Set<string>();
  for (const e of input.entries) expect.add(`${e.lemma}|${e.pos}`);

  const got = new Set<string>();
  for (const g of output.glosses ?? []) {
    const key = `${g.lemma}|${g.pos}`;
    if (!expect.has(key)) fail(`batch-${nn}: unexpected entry ${key}`);
    if (got.has(key)) fail(`batch-${nn}: duplicate entry ${key}`);
    got.add(key);
    const meaning = String(g.meaning ?? '').normalize('NFC');
    if (!MEANING.test(meaning)) fail(`batch-${nn}: meaning malformed for ${key}: ${g.meaning}`);
    if (/[؀-ۿ]/.test(meaning)) fail(`batch-${nn}: Arabic in meaning for ${key}`);
  }
  for (const key of expect) if (!got.has(key)) fail(`batch-${nn}: missing entry ${key}`);

  console.log(`batch-${nn}: ${got.size}/${expect.size} entries, ` +
    (failures === before ? 'OK' : `${failures - before} failures`));
}

const args = process.argv.slice(2);
if (args[0] === '--batch') {
  validateBatch(args[1]);
} else if (args[0] === '--all-batches') {
  const outs = readdirSync('src/data/morphology/glosses-nouns/output')
    .filter(f => /^batch-\d+\.json$/.test(f))
    .map(f => f.match(/(\d+)/)![1])
    .sort();
  if (outs.length === 0) fail('no output batches found');
  for (const nn of outs) validateBatch(nn);
} else {
  console.error('usage: validate-noun-glosses.ts --batch NN | --all-batches');
  process.exit(2);
}

if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log('all good');
