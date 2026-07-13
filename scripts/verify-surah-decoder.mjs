import data from '../src/data/surah-decoder.ts';
const ids = Object.keys(data);
let problems = 0;
if (ids.length !== 38) { console.error(`Expected 38 surahs, got ${ids.length}`); problems++; }
for (const id of ids) {
  const verses = data[id];
  if (!verses.length) { console.error(`${id}: no verses`); problems++; continue; }
  for (const v of verses) {
    if (!v.arabic || !v.words.length) { console.error(`${id} ${v.ref}: empty verse/words`); problems++; }
    for (const w of v.words) {
      if (!w.ar || !w.morph || !w.irab) { console.error(`${id} ${v.ref}: word "${w.ar}" missing morph/irab`); problems++; }
      if (/Ã|Â|�/.test(w.ar + w.en)) { console.error(`${id}: mojibake in "${w.ar}"`); problems++; }
    }
  }
}
// --- Classification assertions (guard against POS/case-mislabel regressions) ---
const wordCs = (id, ar) => {
  const verses = data[id] || [];
  for (const v of verses) for (const w of v.words) if (w.ar === ar) return w.cs;
  return undefined;
};
const golden = [
  ['001-al-fatiha', 'بِسْمِ', 'gen'],
  ['103-al-asr', 'إِنَّ', 'mabni'],
  ['103-al-asr', 'الْإِنسَانَ', 'acc'],
  ['103-al-asr', 'خُسْرٍ', 'gen'],
  ['089-al-fajr', 'رَبُّكَ', 'nom'],
];
for (const [id, ar, want] of golden) {
  const got = wordCs(id, ar);
  if (got !== want) { console.error(`${id} "${ar}": expected cs="${want}", got cs="${got}"`); problems++; }
}
// Structural invariants across ALL words.
for (const id of ids) {
  for (const v of data[id]) {
    for (const w of v.words) {
      // Adverbs/nouns must never be classified as a verb.
      if ((/\bnoun\b/.test(w.morph) || /\badverb\b/.test(w.morph)) && w.cs === 'verb') {
        console.error(`${id} ${v.ref} "${w.ar}": noun/adverb morph but cs="verb"`); problems++;
      }
      // A word tagged with the particle lens (and no noun component) must be mabnī.
      if (w.lens.includes('particle') && !/\bnoun\b/.test(w.morph) && w.cs !== 'mabni') {
        console.error(`${id} ${v.ref} "${w.ar}": particle lens but cs="${w.cs}" (expected mabni)`); problems++;
      }
    }
  }
}

console.log(problems ? `FAIL: ${problems} problems` : `OK: 38 surahs, morph+irab present, no mojibake, classification assertions pass`);
process.exit(problems ? 1 : 0);
