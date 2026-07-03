// Verb Form Generator data pipeline.
//   extract  corpus file → src/data/morphology/verb-skeleton.json
//   slice    skeleton → glosses/input/batch-NN.input.json (curation batches)
//   merge    skeleton + glosses/output/* → public/data/verb-forms.json
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { parseCorpus, groupVerbs } from './lib/extract-verbs.ts';
import { bwToArabic, bwToTranslit } from './lib/buckwalter.ts';
import { FORM_OVERRIDES } from './lib/form-overrides.ts';

const CORPUS = 'src/data/morphology/quranic-corpus-morphology-0.4.txt';
const SKELETON = 'src/data/morphology/verb-skeleton.json';
const GLOSS_IN = 'src/data/morphology/glosses/input';
const GLOSS_OUT = 'src/data/morphology/glosses/output';
const PUBLIC_JSON = 'public/data/verb-forms.json';
const BATCH_TARGET = 55; // entries per batch; roots never split across batches

// Roots: corpus writes hamza as A in ROOT: fields → display ء.
function rootToArabic(rootBw: string): string {
  return [...rootBw].map(c => (c === 'A' ? 'ء' : bwToArabic(c))).join('');
}
function rootTranslit(rootBw: string): string {
  return [...rootBw].map(c => (c === 'A' ? 'ʾ' : bwToTranslit(c + 'a').replace(/a$/, ''))).join('-');
}
function weakFlags(rootBw: string): string[] {
  const flags: string[] = [];
  const L = [...rootBw];
  if ('wy'.includes(L[0])) flags.push('assimilated');
  if ('wy'.includes(L[1] ?? '')) flags.push('hollow');
  if ('wy'.includes(L[L.length - 1])) flags.push('defective');
  if (L[0] === 'A') flags.push('hamzated-initial');
  if (L[1] === 'A') flags.push('hamzated-medial');
  if (L[L.length - 1] === 'A') flags.push('hamzated-final');
  if (L.length === 3 && L[1] === L[2]) flags.push('doubled');
  return flags;
}

function extract() {
  const tokens = parseCorpus(readFileSync(CORPUS, 'utf8'));
  const grouped = groupVerbs(tokens);
  // Forms XI/XII are rare but real (اِطْمَأَنَّ is tagged XII) — kept in the data;
  // the UI appends them as "rare form" rows after the I–X grid.
  const formXI = grouped.flatMap(r =>
    Object.keys(r.forms).filter(f => Number(f) > 10).map(f => `${r.root} form ${f}`));
  const skeleton = grouped.map(r => ({
    root: r.root,
    rootAr: rootToArabic(r.root),
    rootTranslit: rootTranslit(r.root),
    quad: r.quad,
    weak: weakFlags(r.root),
    totalCount: r.totalCount,
    forms: Object.fromEntries(
      Object.entries(r.forms)
        .filter(([f]) => Number(f) <= 12)
        .map(([f, entries]) => [f, entries.map(e => ({
          lemma: e.lemma,
          draftPast: bwToArabic(e.lemma),
          draftTranslit: bwToTranslit(e.lemma),
          // Voice ground truth from corpus PASS tags — corpus lemma
          // vocalization is NOT reliable (e.g. *uk~ira groups active tokens).
          voice: e.passCount === e.count ? 'passive-only'
               : e.passCount === 0 ? 'active' : 'mixed',
          count: e.count,
          example: e.example,
        }))]),
    ),
  }));
  const entryCount = skeleton.reduce(
    (n, r) => n + Object.values(r.forms).reduce((m, l) => m + l.length, 0), 0);
  const multiLemma = skeleton.flatMap(r =>
    Object.entries(r.forms).filter(([, l]) => l.length > 1).map(([f, l]) =>
      `${r.root}:${f} (${l.map((e: any) => e.lemma).join(' + ')})`));
  writeFileSync(SKELETON, JSON.stringify({
    meta: { verbTokens: tokens.length, roots: skeleton.length, entries: entryCount },
    roots: skeleton,
  }, null, 1));
  console.log(`roots=${skeleton.length} entries=${entryCount} tokens=${tokens.length}`);
  console.log(`multi-lemma slots (${multiLemma.length}):\n  ${multiLemma.join('\n  ')}`);
  console.log(`forms>X excluded: ${formXI.length ? formXI.join(', ') : 'none'}`);
}

function slice() {
  const skeleton = JSON.parse(readFileSync(SKELETON, 'utf8'));
  mkdirSync(GLOSS_IN, { recursive: true });
  let batch: any[] = [], size = 0, n = 1;
  const flush = () => {
    if (!batch.length) return;
    const name = `batch-${String(n).padStart(2, '0')}`;
    writeFileSync(`${GLOSS_IN}/${name}.input.json`,
      JSON.stringify({ batch: name, entries: batch }, null, 1));
    console.log(`${name}: ${size} entries, ${batch.length} roots`);
    n++; batch = []; size = 0;
  };
  for (const r of skeleton.roots) {
    const entries = Object.entries(r.forms).flatMap(([form, list]: [string, any]) =>
      list.map((e: any) => ({ form: Number(form), ...e })));
    batch.push({ root: r.root, rootAr: r.rootAr, rootTranslit: r.rootTranslit,
      quad: r.quad, weak: r.weak, entries });
    size += entries.length;
    if (size >= BATCH_TARGET) flush();
  }
  flush();
}

// Apply FORM_OVERRIDES to a skeleton root: move mislabeled entries to their
// true form (tracking the original gloss key), or merge them into the
// canonical lemma's entry (counts add; the canonical gloss wins).
function applyOverrides(r: any): any {
  const forms: Record<string, any[]> = {};
  for (const [form, list] of Object.entries<any>(r.forms))
    forms[form] = list.map((e: any) => ({ ...e, glossKey: `${r.root}|${form}|${e.lemma}` }));
  for (const [form, list] of Object.entries(forms)) {
    for (const e of [...list]) {
      const ov = FORM_OVERRIDES[`${r.root}|${form}|${e.lemma}`];
      if (!ov) continue;
      forms[form] = forms[form].filter(x => x !== e);
      const targetForm = String(ov.form);
      forms[targetForm] ??= [];
      if (ov.mergeInto) {
        const target = forms[targetForm].find(x => x.lemma === ov.mergeInto);
        if (!target) throw new Error(`override target missing: ${r.root}|${targetForm}|${ov.mergeInto}`);
        target.count += e.count;
        if (e.example < target.example) { /* keep target example: canonical citation context */ }
      } else {
        forms[targetForm].push(e);
      }
    }
    if (!forms[form].length) delete forms[form];
  }
  return { ...r, forms };
}

function merge() {
  const skeleton = JSON.parse(readFileSync(SKELETON, 'utf8'));
  const glossMap = new Map<string, any>();
  let files: string[] = [];
  try { files = readdirSync(GLOSS_OUT).filter(f => /^batch-\d+\.json$/.test(f)); } catch {}
  for (const f of files) {
    const b = JSON.parse(readFileSync(`${GLOSS_OUT}/${f}`, 'utf8'));
    for (const g of b.glosses) glossMap.set(`${g.root}|${g.form}|${g.lemma}`, g);
  }
  let missing = 0;
  const roots = skeleton.roots.map(applyOverrides).map((r: any) => ({
    root: r.rootAr,
    translit: r.rootTranslit,
    quad: r.quad,
    totalCount: r.totalCount,
    forms: Object.fromEntries(Object.entries(r.forms).map(([form, list]: [string, any]) => [
      form,
      list.map((e: any) => {
        const g = glossMap.get(e.glossKey);
        if (!g) missing++;
        return {
          past: (g?.past ?? e.draftPast).normalize('NFC'),
          present: g?.present ? String(g.present).normalize('NFC') : null,
          translit: g?.translit ?? e.draftTranslit,
          meaning: g?.meaning ?? null,
          count: e.count,
          example: e.example,
        };
      }),
    ])),
  }));
  const entryCount = roots.reduce(
    (n: number, r: any) => n + Object.values(r.forms).reduce((m: number, l: any) => m + l.length, 0), 0);
  mkdirSync('public/data', { recursive: true });
  writeFileSync(PUBLIC_JSON, JSON.stringify({
    meta: {
      roots: roots.length,
      entries: entryCount,
      source: 'Quranic Arabic Corpus v0.4 (Kais Dukes, GPL) — corpus.quran.com',
    },
    roots,
  }));
  console.log(`merged ${roots.length} roots, ${entryCount} entries, ${missing} missing glosses → ${PUBLIC_JSON}`);
}

const cmd = process.argv[2];
if (cmd === 'extract') extract();
else if (cmd === 'slice') slice();
else if (cmd === 'merge') merge();
else { console.error('usage: build-verb-dataset.ts extract|slice|merge'); process.exit(1); }
