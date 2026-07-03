// Verb gloss validation.
// Modes:
//   --batch NN     validate glosses/output/batch-NN.json against its input
//   --all-batches  validate every output batch present
//   --merged       validate public/data/verb-forms.json against the skeleton
import { readFileSync, readdirSync } from 'node:fs';

const AR_VOCALIZED = /^[ء-يٰٱـً-ْ]+$/; // letters + harakat
const TL = /^[a-zāīūḥṣḍṭẓʿʾ'’\- \/]+$/;
const MEANING = /^[a-zA-Z0-9(),;'’\- ]{3,80}$/;

let failures = 0;
const fail = (msg: string) => { failures++; console.error(`FAIL ${msg}`); };

// Full vocalization: every letter carries a mark except inherently unmarked
// carriers (آ ا ى ٱ) and long-vowel و/ي (preceded by damma/kasra).
function isFullyVocalized(s: string): boolean {
  const chars = [...s];
  let required = 0, marks = 0;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (/[ً-ْٰ]/.test(c)) { marks++; continue; }
    if (!/[ء-يآ]/.test(c)) continue;
    if ('اآىٱ'.includes(c)) continue;
    const prev = chars[i - 1];
    if (c === 'و' && prev === 'ُ') continue;
    if (c === 'ي' && prev === 'ِ') continue;
    required++;
  }
  return marks >= required && required > 0;
}

function validateGloss(g: any, where: string) {
  for (const k of ['past', 'present'] as const) {
    const v = String(g[k] ?? '').normalize('NFC');
    if (!AR_VOCALIZED.test(v)) fail(`${where}: ${k} bad charset: ${g[k]}`);
    else if (!isFullyVocalized(v)) fail(`${where}: ${k} under-vocalized: ${g[k]}`);
  }
  if (!TL.test(g.translit ?? '') || !(g.translit ?? '').includes(' / '))
    fail(`${where}: translit malformed: ${g.translit}`);
  if (!MEANING.test(g.meaning ?? '') || !/^to /.test(g.meaning ?? ''))
    fail(`${where}: meaning malformed: ${g.meaning}`);
}

function validateBatch(nn: string) {
  const before = failures;
  const input = JSON.parse(readFileSync(`src/data/morphology/glosses/input/batch-${nn}.input.json`, 'utf8'));
  const output = JSON.parse(readFileSync(`src/data/morphology/glosses/output/batch-${nn}.json`, 'utf8'));
  const expect = new Set<string>();
  for (const r of input.entries)
    for (const e of r.entries) expect.add(`${r.root}|${e.form}|${e.lemma}`);
  const got = new Set<string>();
  for (const g of output.glosses ?? []) {
    const key = `${g.root}|${g.form}|${g.lemma}`;
    if (!expect.has(key)) fail(`batch-${nn}: unexpected entry ${key}`);
    if (got.has(key)) fail(`batch-${nn}: duplicate entry ${key}`);
    got.add(key);
    validateGloss(g, `batch-${nn} ${key}`);
  }
  for (const key of expect) if (!got.has(key)) fail(`batch-${nn}: missing entry ${key}`);
  console.log(`batch-${nn}: ${got.size}/${expect.size} entries, ${failures - before} failures`);
}

function validateMerged() {
  const skeleton = JSON.parse(readFileSync('src/data/morphology/verb-skeleton.json', 'utf8'));
  const data = JSON.parse(readFileSync('public/data/verb-forms.json', 'utf8'));
  // Ayah counts derived from the corpus itself (max ayah seen per surah).
  const corpus = readFileSync('src/data/morphology/quranic-corpus-morphology-0.4.txt', 'utf8');
  const maxAyah = new Map<number, number>();
  for (const m of corpus.matchAll(/^\((\d+):(\d+):\d+:\d+\)/gm)) {
    const s = +m[1], a = +m[2];
    if ((maxAyah.get(s) ?? 0) < a) maxAyah.set(s, a);
  }
  let entries = 0, missing = 0;
  for (const r of data.roots) {
    for (const [form, list] of Object.entries<any>(r.forms)) {
      if (+form < 1 || +form > 12) fail(`${r.root}: form out of range ${form}`);
      for (const e of list) {
        entries++;
        const [s, a] = String(e.example).split(':').map(Number);
        if (!maxAyah.has(s) || a < 1 || a > (maxAyah.get(s) ?? 0))
          fail(`${r.root}:${form} bad example ref ${e.example}`);
        if (e.meaning === null) { missing++; continue; }
        validateGloss(e, `${r.root}:${form}`);
      }
    }
  }
  if (entries !== skeleton.meta.entries)
    fail(`entry count drift: merged ${entries} vs skeleton ${skeleton.meta.entries}`);
  console.log(`merged: ${entries} entries, ${missing} missing glosses, ${failures} failures`);
  if (missing > 0) console.warn(`WARN: ${missing} entries awaiting glosses (allowed pre-ship, not at ship)`);
}

const mode = process.argv[2];
if (mode === '--batch') validateBatch(process.argv[3]);
else if (mode === '--merged') validateMerged();
else if (mode === '--all-batches') {
  for (const f of readdirSync('src/data/morphology/glosses/output/').sort())
    if (/^batch-\d+\.json$/.test(f)) validateBatch(f.match(/\d+/)![0]);
} else { console.error('usage: --batch NN | --all-batches | --merged'); process.exit(1); }
process.exit(failures ? 1 : 0);
