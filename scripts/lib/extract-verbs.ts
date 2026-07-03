export interface VerbToken {
  location: string; // "surah:ayah"
  form: number;     // 1–12 (corpus roman numerals; 1 when absent)
  lemma: string;    // Buckwalter
  root: string;     // Buckwalter
  passive: boolean; // PASS feature present
}
export interface LemmaEntry { lemma: string; count: number; passCount: number; example: string; }
export interface RootGroup {
  root: string;
  quad: boolean;
  totalCount: number;
  forms: Record<string, LemmaEntry[]>;
}

const ROMAN: Record<string, number> = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12,
};

export function parseCorpus(text: string): VerbToken[] {
  const tokens: VerbToken[] = [];
  for (const line of text.split('\n')) {
    if (!line || line.startsWith('#') || line.startsWith('LOCATION')) continue;
    const cols = line.split('\t');
    if (cols.length < 4 || cols[2] !== 'V') continue;
    const loc = cols[0].match(/^\((\d+):(\d+):\d+:\d+\)$/);
    if (!loc) continue;
    const features = cols[3].split('|');
    let form = 1, lemma = '', root = '';
    for (const f of features) {
      const roman = f.match(/^\((XI{0,2}|IX|IV|VI{0,3}|I{1,3}|V)\)$/);
      if (roman) form = ROMAN[roman[1]] ?? 1;
      else if (f.startsWith('LEM:')) lemma = f.slice(4);
      else if (f.startsWith('ROOT:')) root = f.slice(5);
    }
    if (!lemma || !root) continue; // rare untagged tokens: counted in caller's stats
    tokens.push({ location: `${loc[1]}:${loc[2]}`, form, lemma, root,
      passive: features.includes('PASS') });
  }
  return tokens;
}

export function groupVerbs(tokens: VerbToken[]): RootGroup[] {
  const byRoot = new Map<string, RootGroup>();
  for (const t of tokens) {
    let rg = byRoot.get(t.root);
    if (!rg) {
      rg = { root: t.root, quad: t.root.length >= 4, totalCount: 0, forms: {} };
      byRoot.set(t.root, rg);
    }
    rg.totalCount++;
    const key = String(t.form);
    rg.forms[key] ??= [];
    let entry = rg.forms[key].find(e => e.lemma === t.lemma);
    if (!entry) {
      entry = { lemma: t.lemma, count: 0, passCount: 0, example: t.location };
      rg.forms[key].push(entry);
    }
    entry.count++;
    if (t.passive) entry.passCount++;
  }
  return [...byRoot.values()].sort((a, b) => b.totalCount - a.totalCount);
}
