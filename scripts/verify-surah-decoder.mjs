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
console.log(problems ? `FAIL: ${problems} problems` : `OK: 38 surahs, all words carry morph+irab, no mojibake`);
process.exit(problems ? 1 : 0);
