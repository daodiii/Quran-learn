// scripts/lib/group-words.ts
// Whole-word reconstruction: one corpus row per SEGMENT; a written word is all
// rows sharing (surah:ayah:word). Unlike extract-verbs.ts (verbs only, verse-
// level locations), this parser keeps every row and full segment locations.

export interface CorpusRow {
  surah: number; ayah: number; word: number; segment: number;
  formBw: string; tag: string; features: string[];
}
export interface Affix { formBw: string; feature: string }
export interface WordStem {
  lemmaBw: string;          // '' when the corpus row has no LEM (muqattaat, some particles)
  rootBw: string;           // '' when rootless
  pos: string;              // POS:x value (falls back to the row TAG)
  formNo: number;           // verb form 1–12; 0 for non-verbs
  featureTokens: string[];  // everything except STEM/POS:/LEM:/ROOT:/(roman)
}
export interface WordOccurrence {
  key: string;       // "s:a:w"
  location: string;  // "s:a" (verse ref)
  surfaceBw: string; // concatenation of all segment FORMs
  prefixes: Affix[];
  stems: WordStem[];
  suffixes: Affix[];
}

const ROMAN: Record<string, number> = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12,
};

export function parseCorpusRows(text: string): CorpusRow[] {
  const rows: CorpusRow[] = [];
  for (const line of text.split('\n')) {
    if (!line || line.startsWith('#') || line.startsWith('LOCATION')) continue;
    const cols = line.split('\t');
    if (cols.length < 4) continue;
    const loc = cols[0].match(/^\((\d+):(\d+):(\d+):(\d+)\)$/);
    if (!loc) continue;
    rows.push({
      surah: +loc[1], ayah: +loc[2], word: +loc[3], segment: +loc[4],
      formBw: cols[1], tag: cols[2], features: cols[3].split('|'),
    });
  }
  return rows;
}

export function groupWords(rows: CorpusRow[]): WordOccurrence[] {
  const words: WordOccurrence[] = [];
  let cur: WordOccurrence | null = null;
  for (const r of rows) {
    const key = `${r.surah}:${r.ayah}:${r.word}`;
    if (!cur || cur.key !== key) {
      cur = { key, location: `${r.surah}:${r.ayah}`, surfaceBw: '',
              prefixes: [], stems: [], suffixes: [] };
      words.push(cur);
    }
    cur.surfaceBw += r.formBw;
    const kind = r.features[0];
    if (kind === 'PREFIX') {
      cur.prefixes.push({ formBw: r.formBw, feature: r.features[1] ?? '' });
    } else if (kind === 'SUFFIX') {
      cur.suffixes.push({ formBw: r.formBw, feature: r.features[1] ?? '' });
    } else if (kind === 'STEM') {
      let lemmaBw = '', rootBw = '', pos = r.tag, formNo = 0;
      const featureTokens: string[] = [];
      for (const f of r.features.slice(1)) {
        if (f.startsWith('POS:')) pos = f.slice(4);
        else if (f.startsWith('LEM:')) lemmaBw = f.slice(4);
        else if (f.startsWith('ROOT:')) rootBw = f.slice(5);
        else {
          const roman = f.match(/^\(([IVX]+)\)$/);
          if (roman && ROMAN[roman[1]]) formNo = ROMAN[roman[1]];
          else featureTokens.push(f);
        }
      }
      if (pos === 'V' && formNo === 0) formNo = 1; // corpus omits (I)
      cur.stems.push({ lemmaBw, rootBw, pos, formNo, featureTokens });
    } else {
      throw new Error(`unknown segment kind "${kind}" at ${key}`);
    }
  }
  return words;
}
