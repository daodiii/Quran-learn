// One-shot migration (2026-07-05): the noun-gloss store copied its lemma|pos
// keys from the pre-fix dataset, where Uthmani annotation marks were still raw
// extended-Buckwalter ASCII (سَمَا^ء). bwLemmaToArabic now renders them as real
// marks (سَمَآء); this rewrites every stored lemma to match, byte-exactly the
// way the rebuilt index renders it. Format-preserving (quoted-string
// replacement) and idempotent — a second run changes nothing.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { bwToArabic, bwLemmaToArabic, BW_ANNOTATION_MARKS } from './lib/buckwalter.ts';

const CORPUS = 'src/data/morphology/quranic-corpus-morphology-0.4.txt';
const STORE = 'src/data/morphology/glosses-nouns';
const ANN = new RegExp(`[${Object.keys(BW_ANNOTATION_MARKS).map(c => '\\' + c).join('')}]`);

// 1. Old→new rendering for every corpus lemma.
const lemmasBw = new Set<string>();
for (const line of readFileSync(CORPUS, 'utf8').split(/\r?\n/)) {
  const m = line.match(/LEM:([^|\s]+)/);
  if (m) lemmasBw.add(m[1]);
}
const substitute = (s: string) =>
  [...s].map(c => BW_ANNOTATION_MARKS[c] ?? c).join('').normalize('NFC');
const oldToNew = new Map<string, string>();
for (const bw of lemmasBw) {
  const oldAr = bwToArabic(bw);
  const newAr = bwLemmaToArabic(bw);
  if (oldAr === newAr) continue;
  // In-place substitution on the old rendering must agree with re-deriving
  // from BW — the guarantee that stored keys can be migrated textually.
  if (substitute(oldAr) !== newAr)
    throw new Error(`substitution/derivation divergence for ${bw}`);
  const prev = oldToNew.get(oldAr);
  if (prev !== undefined && prev !== newAr)
    throw new Error(`old rendering ${oldAr} maps to both ${prev} and ${newAr}`);
  oldToNew.set(oldAr, newAr);
}
console.log(`corpus lemmas: ${lemmasBw.size}, renderings changed: ${oldToNew.size}`);

// 2. Rewrite lemma fields in every batch file, preserving formatting. Old
// renderings contain raw ASCII annotation chars, which never occur in
// surface/translit/meaning fields — quoted-exact replacement is lemma-only.
let totalRepl = 0;
for (const [dir, field] of [['input', 'entries'], ['output', 'glosses']] as const) {
  for (const f of readdirSync(`${STORE}/${dir}`).sort()) {
    if (!f.endsWith('.json')) continue;
    const path = `${STORE}/${dir}/${f}`;
    const before = readFileSync(path, 'utf8');
    let after = before;
    let n = 0;
    for (const [oldAr, newAr] of oldToNew) {
      const quoted = JSON.stringify(oldAr);
      if (!after.includes(quoted)) continue;
      n += after.split(quoted).length - 1;
      after = after.split(quoted).join(JSON.stringify(newAr));
    }
    if (n === 0) { console.log(`${dir}/${f}: unchanged`); continue; }
    // Integrity: parse both — everything must match except lemma fields mapped.
    const a = JSON.parse(before), b = JSON.parse(after);
    if (a[field].length !== b[field].length) throw new Error(`${f}: entry count drift`);
    for (let i = 0; i < a[field].length; i++) {
      const ea = { ...a[field][i], lemma: oldToNew.get(a[field][i].lemma) ?? a[field][i].lemma };
      if (JSON.stringify(ea) !== JSON.stringify(b[field][i]))
        throw new Error(`${f}[${i}]: non-lemma field changed`);
      if (ANN.test(b[field][i].lemma)) throw new Error(`${f}[${i}]: lemma still contaminated`);
    }
    writeFileSync(path, after);
    totalRepl += n;
    console.log(`${dir}/${f}: ${n} lemma(s) migrated`);
  }
}

// 3. lemma|pos keys must stay unique across the whole store.
const keys = new Set<string>();
for (const f of readdirSync(`${STORE}/output`).sort()) {
  if (!/^batch-\d+\.json$/.test(f)) continue;
  for (const g of JSON.parse(readFileSync(`${STORE}/output/${f}`, 'utf8')).glosses) {
    const key = `${g.lemma}|${g.pos}`;
    if (keys.has(key)) throw new Error(`duplicate key after migration: ${key}`);
    keys.add(key);
  }
}
console.log(`migrated ${totalRepl} lemma field(s); ${keys.size} unique keys intact`);
