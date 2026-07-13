# Surah Lab + I'rab Decoder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring all 38 surah analysis pages up to the Anatomy Lab standard and add an auto-generated "I'rab Decoder" reading console as the centerpiece.

**Architecture:** A build-time generator reads the uniform "Word-by-Word Breakdown" tables already in every surah MDX and emits a typed dataset. A new `SurahDecoder.astro` renders that dataset as an interactive console. `SurahLayout.astro` is reworked to mirror `LessonLayout.astro`'s always-night Lab shell (station rail, telemetry, shared-component Lab skins) and auto-injects the decoder — no edits to individual surah `.mdx` files.

**Tech Stack:** Astro content collections, TypeScript, Node ESM generator scripts, vanilla client scripts (createElement/textContent only — the repo's Write-hook rejects `innerHTML`), existing `lesson-lab.css` design system.

**Reference implementation:** the approved, fully-interactive mockup at
`.superpowers/brainstorm/76696-1783969607/content/surah-lab.html` (Surah Al-ʿAsr). It is the visual + behavioral source of truth for the decoder. The design spec is `docs/superpowers/specs/2026-07-13-surah-lab-decoder-design.md`.

**Reference patterns in-repo:**
- Shell to mirror: `src/layouts/LessonLayout.astro` + `src/styles/lesson-lab.css` + `src/scripts/lab-lesson.ts`.
- Generator precedent (generated file, byte-verified, never hand-edited): `scripts/extract-surah-openings.mjs` → `src/data/surah-openings.ts`.
- Shared MDX component that already emits `lab:word-touched`: `src/components/mdx/ArabicExample.astro`.

---

## File Structure

- **Create** `scripts/extract-surah-decoder.mjs` — parses 38 surah MDX files → decoder dataset.
- **Create** `src/data/surah-decoder.ts` — GENERATED. Never hand-edit.
- **Create** `src/components/mdx/lab/SurahDecoder.astro` — the centerpiece component (markup + client script).
- **Create** `src/styles/surah-decoder.css` — decoder-only styles, scoped under `.lab`.
- **Modify** `src/layouts/SurahLayout.astro` — Lab shell conversion + auto-inject decoder + rail + completion/pager.
- **Create** `scripts/verify-surah-decoder.mjs` — build-gate: 38/38 parse, non-empty fields, byte sanity.
- **Test** `tests/surah-decoder.spec.ts` — Playwright interaction coverage.

---

## Task 1: Decoder data generator + dataset

**Files:**
- Create: `scripts/extract-surah-decoder.mjs`
- Create (generated): `src/data/surah-decoder.ts`

- [ ] **Step 1: Write the generator**

Create `scripts/extract-surah-decoder.mjs`:

```js
// Generates src/data/surah-decoder.ts from the "Word-by-Word Breakdown"
// GrammarTables already present in every surah MDX. The breakdown table is the
// AUTHORITATIVE per-word list for the decoder; the <ArabicExample> only supplies
// verse-level fields (arabic string, transliteration, translation, ayah ref).
// Mirrors scripts/extract-surah-openings.mjs: generated output, never hand-edited.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SURAH_DIR = 'src/content/surahs';
const OUT = 'src/data/surah-decoder.ts';

// --- lens / case classifier from the Morphology + I'rab columns ---
function classify(morph, irab) {
  const s = `${morph} ${irab}`.toLowerCase();
  const lens = [];
  let cs = 'none';
  const has = (...xs) => xs.some((x) => s.includes(x));
  if (has('particle', 'harf', 'ḥarf', 'preposition')) lens.push('particle');
  if (has('verb', 'fiʿl', "fi'l", 'fi‘l')) lens.push('verb');
  if (has('genitive', 'majrur', 'majrūr')) { cs = 'gen'; lens.push('gen'); }
  else if (has('accusative', 'mansub', 'manṣūb')) { cs = 'acc'; lens.push('acc'); }
  else if (has('nominative', 'marfu', 'marfūʿ', "marfu'")) { cs = 'nom'; lens.push('nom'); }
  else if (has('mabni', 'mabnī', 'indeclinable', 'not declinable')) cs = 'mabni';
  if (cs === 'none' && lens.includes('verb')) cs = 'verb';
  return { cs, lens: [...new Set(lens)] };
}

// Parse a markdown table body (array of {cells}) from raw lines between <GrammarTable> tags.
function parseBreakdownRows(block) {
  const lines = block.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('|'));
  if (lines.length < 2) return null;
  const header = lines[0].toLowerCase();
  // Only the word-by-word breakdown table has these columns together.
  if (!(header.includes('root') && header.includes('morphology') && header.includes("i'rab"))) return null;
  const rows = [];
  for (const line of lines.slice(2)) { // skip header + separator
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 7) continue;
    const [, ar, tr, root, morph, irab, en] = cells; // [#, Arabic, Translit, Root, Morphology, I'rab, Meaning]
    if (!ar) continue;
    const { cs, lens } = classify(morph, irab);
    rows.push({ ar, tr, root, morph, irab, en, cs, lens });
  }
  return rows.length ? rows : null;
}

function attr(chunk, name) {
  const m = chunk.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : '';
}

function processSurah(file) {
  const id = file.replace(/\.mdx?$/, '');
  const src = readFileSync(join(SURAH_DIR, file), 'utf8');
  // Split into verse chunks at each <ArabicExample; each chunk holds one verse
  // + its following breakdown table (if any).
  const parts = src.split(/<ArabicExample/);
  const verses = [];
  for (let i = 1; i < parts.length; i++) {
    const chunk = '<ArabicExample' + parts[i];
    const arabic = attr(chunk, 'arabic');
    if (!arabic) continue;
    const reference = attr(chunk, 'reference');
    const ayahMatch = reference.match(/(\d+):(\d+)/);
    const ayah = ayahMatch ? Number(ayahMatch[2]) : verses.length + 1;
    const tables = chunk.match(/<GrammarTable>([\s\S]*?)<\/GrammarTable>/g) || [];
    let words = null;
    for (const t of tables) { words = parseBreakdownRows(t); if (words) break; }
    if (!words) continue; // verse without a breakdown table — not decodable
    verses.push({
      ayah, ref: reference, arabic,
      transliteration: attr(chunk, 'transliteration'),
      translation: attr(chunk, 'translation'),
      words,
    });
  }
  return { id, verses };
}

const files = readdirSync(SURAH_DIR).filter((f) => f.endsWith('.mdx')).sort();
const data = {};
const report = [];
for (const f of files) {
  const { id, verses } = processSurah(f);
  const wordCount = verses.reduce((n, v) => n + v.words.length, 0);
  data[id] = verses;
  report.push(`${id}: ${verses.length} verses, ${wordCount} words`);
}

const banner = `// GENERATED by scripts/extract-surah-decoder.mjs — DO NOT EDIT BY HAND.\n// Regenerate: node scripts/extract-surah-decoder.mjs\n`;
const types = `export type DecoderCase = 'gen' | 'acc' | 'nom' | 'mabni' | 'verb' | 'none';
export type DecoderLens = 'particle' | 'verb' | 'gen' | 'acc' | 'nom';
export interface DecoderWord { ar: string; tr: string; root: string; morph: string; irab: string; en: string; cs: DecoderCase; lens: DecoderLens[]; }
export interface DecoderVerse { ayah: number; ref: string; arabic: string; transliteration: string; translation: string; words: DecoderWord[]; }
export type SurahDecoderData = Record<string, DecoderVerse[]>;\n`;
const body = `const data: SurahDecoderData = ${JSON.stringify(data, null, 2)};\nexport default data;\n`;
writeFileSync(OUT, banner + '\n' + types + '\n' + body);
console.log(report.join('\n'));
console.log(`\nWrote ${OUT} — ${files.length} surahs.`);
```

- [ ] **Step 2: Run the generator**

Run: `node scripts/extract-surah-decoder.mjs`
Expected: prints one line per surah (e.g. `103-al-asr: 3 verses, 14 words`) and `Wrote src/data/surah-decoder.ts — 38 surahs.` for all 38.

- [ ] **Step 3: Verify the dataset (byte + completeness gate)**

Create `scripts/verify-surah-decoder.mjs`:

```js
import data from '../src/data/surah-decoder.ts';
// NOTE: run via `npx tsx scripts/verify-surah-decoder.mjs` (tsx resolves the .ts import).
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
```

Run: `npx tsx scripts/verify-surah-decoder.mjs`
Expected: `OK: 38 surahs, all words carry morph+irab, no mojibake`. If any surah fails (e.g. `001-al-fatiha` structured differently), fix the generator's chunking for that case and rerun — do NOT hand-edit the dataset.

- [ ] **Step 4: Spot-check Al-ʿAsr against the source**

Run: `node -e "import('./src/data/surah-decoder.ts').then(m=>{const v=m.default['103-al-asr']; console.log(JSON.stringify(v[0].words,null,1))})" 2>/dev/null || npx tsx -e "import d from './src/data/surah-decoder.ts'; console.log(JSON.stringify(d['103-al-asr'][0].words,null,1))"`
Expected: word 1 `الْعَصْرِ` with `root: "ع ص ر"`, `cs: "gen"`, `lens` including `"gen"`; the oath particle `وَ` with `cs: "mabni"`, `lens: ["particle"]`. Confirm Arabic harakat match `src/content/surahs/103-al-asr.mdx` exactly.

- [ ] **Step 5: Commit**

```bash
git add scripts/extract-surah-decoder.mjs scripts/verify-surah-decoder.mjs src/data/surah-decoder.ts
git commit -m "feat(surahs): generate I'rab Decoder dataset from breakdown tables

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: SurahDecoder component + styles

**Files:**
- Create: `src/components/mdx/lab/SurahDecoder.astro`
- Create: `src/styles/surah-decoder.css`

- [ ] **Step 1: Write the decoder stylesheet**

Create `src/styles/surah-decoder.css`. Port the decoder CSS from the mockup's `<style>` block (`.decoder`, `.lens`, `.recite`, `.d-readout`, `.tag.*`), scoping every selector under `.lab` and using the night/gold tokens already declared on `.lab` in `lesson-lab.css`. Critical rules (readability fixes locked with the user — keep these exactly):

```css
/* Surah I'rab Decoder — loaded by SurahLayout, scoped under .lab. */
.lab .decoder { border:1px solid rgba(227,179,92,.32); border-radius:16px; background:linear-gradient(170deg,var(--bg-panel),var(--bg-1)); margin:26px 0 32px; overflow:hidden; box-shadow:0 24px 70px -30px rgba(0,0,0,.8); }
.lab .decoder .d-top { display:flex; align-items:center; gap:10px; padding:13px 20px; border-bottom:1px solid var(--hairline-soft); font-family:var(--font-mono); font-size:9.5px; letter-spacing:.26em; text-transform:uppercase; color:var(--gold); }
.lab .decoder .d-top .dots { display:flex; gap:5px; margin-right:4px; }
.lab .decoder .d-top .dots i { width:7px; height:7px; border-radius:50%; border:1px solid var(--hairline); }
.lab .decoder .d-top .dots i:first-child { background:rgba(227,179,92,.6); border-color:transparent; }
.lab .decoder .d-top .d-count { margin-left:auto; color:var(--ink-faint); letter-spacing:.16em; }
.lab .decoder .d-top .d-count b { color:var(--gold-bright); font-weight:500; }
.lab .lens { display:flex; gap:8px; flex-wrap:wrap; padding:14px 18px 6px; }
.lab .lens .chip { font-family:var(--font-mono); font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; border:1px solid var(--hairline); border-radius:999px; padding:7px 14px; color:var(--ink-dim); background:none; cursor:pointer; transition:.25s; }
.lab .lens .chip:hover { color:var(--gold-bright); border-color:rgba(227,179,92,.5); }
.lab .lens .chip.on { background:var(--gold-bright); color:#221503; border-color:var(--gold-bright); }
.lab .lens .chip .k { opacity:.6; margin-left:6px; font-family:var(--font-ar); }
.lab .recite { font-family:var(--font-quran); direction:rtl; text-align:center; padding:clamp(22px,3.4vw,38px) clamp(16px,3vw,32px) 12px; line-height:2.35; }
.lab .recite .ayah { display:inline; }
/* Words are <button>s — reset UA chrome or they render a gray button-face fill. */
.lab .recite .w { display:inline-block; padding:.02em .12em; border-radius:8px; cursor:pointer; color:var(--ink); font:inherit; font-size:clamp(26px,3.7vw,38px); background:none; border:none; -webkit-appearance:none; appearance:none; transition:color .3s,text-shadow .3s,box-shadow .3s,opacity .3s; }
.lab .recite .w:hover { text-shadow:0 0 26px rgba(244,214,143,.6); }
.lab .recite .w.done { color:var(--ink); border-bottom:2px solid rgba(227,179,92,.5); }
.lab .recite .w.sel { color:var(--ink); box-shadow:inset 0 0 0 1px var(--gold); text-shadow:0 0 26px rgba(244,214,143,.6); }
.lab .recite .w.dim { opacity:.28; }
.lab .recite .w.match { color:var(--ink); text-shadow:0 0 24px rgba(244,214,143,.6); }
.lab .recite .ayah-no { font-family:var(--font-mono); direction:ltr; font-size:12px; color:var(--gold); border:1px solid var(--hairline); border-radius:50%; width:26px; height:26px; display:inline-grid; place-items:center; vertical-align:middle; margin:0 .3em; }
.lab .d-readout { display:grid; grid-template-columns:1.1fr 1fr 1fr; gap:1px; background:var(--hairline-soft); border-top:1px solid var(--hairline-soft); font-family:var(--font-mono); }
.lab .d-readout > div { background:var(--bg-1); padding:14px 16px; min-height:74px; }
.lab .d-readout .r-k { font-size:8.5px; letter-spacing:.26em; text-transform:uppercase; color:var(--ink-faint); display:block; margin-bottom:5px; }
.lab .d-readout .r-v { font-size:12.5px; color:var(--ink); letter-spacing:.03em; line-height:1.6; overflow-wrap:break-word; }
.lab .d-readout .r-v .big { font-family:var(--font-ar); font-size:1.6rem; color:var(--gold-bright); direction:rtl; display:inline-block; }
.lab .d-readout .r-v .root { font-family:var(--font-ar); font-size:1.2rem; color:var(--ink); letter-spacing:.2em; direction:rtl; }
.lab .d-readout .wide { grid-column:1/-1; border-top:1px solid var(--hairline-soft); }
.lab .d-readout .r-v .tag { display:inline-block; font-size:8.5px; letter-spacing:.14em; text-transform:uppercase; padding:2px 8px; border-radius:5px; border:1px solid; margin-bottom:5px; }
.lab .tag.gen { color:var(--gold-bright); border-color:rgba(227,179,92,.5); }
.lab .tag.acc { color:var(--copper-bright); border-color:rgba(201,138,75,.5); }
.lab .tag.nom, .lab .tag.verb { color:var(--teal); border-color:rgba(143,208,194,.5); }
.lab .tag.mabni { color:var(--silver); border-color:rgba(205,216,236,.4); }
@media (max-width:640px) { .lab .d-readout { grid-template-columns:1fr; } }
.lab .d-empty { padding:22px 16px; text-align:center; font-family:var(--font-mono); font-size:11px; letter-spacing:.1em; color:var(--ink-faint); border-top:1px solid var(--hairline-soft); }
/* no-JS / reduced-motion degrade */
html:not(.js) .lab .lens, html:not(.js) .lab .d-readout, html:not(.js) .lab .d-empty { display:none; }
html:not(.js) .lab .recite .w { cursor:text; }
@media (prefers-reduced-motion:reduce) { .lab .recite .w { transition:none; } }
```

- [ ] **Step 2: Write the component**

Create `src/components/mdx/lab/SurahDecoder.astro`. Markup mirrors the mockup; per-word grammar data rides on `data-*` attributes so the client script builds the readout without `innerHTML`. A global word index (`data-i`) supports the pre-select affordance and telemetry.

```astro
---
import decoderData from '../../../data/surah-decoder';
interface Props { surahId: string; }
const { surahId } = Astro.props;
const verses = decoderData[surahId] ?? [];
const total = verses.reduce((n, v) => n + v.words.length, 0);
// Only show a lens chip if at least one word in this surah matches it.
const LENSES = [
  { f: 'particle', label: 'Particles', k: 'حرف' },
  { f: 'gen', label: 'Genitive', k: 'مجرور' },
  { f: 'acc', label: 'Accusative', k: 'منصوب' },
  { f: 'verb', label: 'Verbs', k: 'فعل' },
] as const;
const present = new Set(verses.flatMap((v) => v.words.flatMap((w) => w.lens)));
const chips = LENSES.filter((l) => present.has(l.f as any));
let gi = -1; // running global index
---
{verses.length > 0 && (
  <section class="decoder" data-surah-decoder data-total={total} aria-label="I'rab decoder">
    <div class="d-top">
      <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
      I'rab Decoder · تحليل الإعراب
      <span class="d-count">Decoded <b><span data-dec-count>0</span>/{total}</b></span>
    </div>
    <div class="lens">
      <button class="chip on" data-f="all" type="button">All words</button>
      {chips.map((l) => (
        <button class="chip" data-f={l.f} type="button">{l.label} <span class="k">{l.k}</span></button>
      ))}
    </div>
    <p class="recite" dir="rtl">
      {verses.map((v) => (
        <span class="ayah">
          {v.words.map((w) => { gi++; return (
            <><button
              type="button" class="w" data-i={gi}
              data-root={w.root} data-morph={w.morph} data-irab={w.irab}
              data-en={w.en} data-cs={w.cs} data-lens={w.lens.join(' ')}
              aria-pressed="false"
            >{w.ar}</button>{' '}</>
          ); })}
          <span class="ayah-no" aria-hidden="true">{v.ayah}</span>{' '}
        </span>
      ))}
    </p>
    <div data-dec-panel>
      <div class="d-empty">▸ Tap a word above to open its breakdown</div>
    </div>
  </section>
)}

<script>
  const CASE_NAME: Record<string, string> = {
    gen: 'Genitive · majrūr', acc: 'Accusative · manṣūb', nom: 'Nominative · marfūʿ',
    mabni: 'Indeclinable · mabnī', verb: 'Verb · fiʿl', none: '',
  };
  function initDecoder() {
    const root = document.querySelector<HTMLElement>('.lab [data-surah-decoder]');
    if (!root) return;
    const recite = root.querySelector<HTMLElement>('.recite')!;
    const panel = root.querySelector<HTMLElement>('[data-dec-panel]')!;
    const countEl = root.querySelector<HTMLElement>('[data-dec-count]')!;
    const words = Array.from(recite.querySelectorAll<HTMLButtonElement>('.w'));
    const decoded = new Set<string>();
    let filter = 'all';

    function cell(k: string, wide?: boolean) {
      const d = document.createElement('div'); if (wide) d.className = 'wide';
      const kk = document.createElement('span'); kk.className = 'r-k'; kk.textContent = k;
      const vv = document.createElement('span'); vv.className = 'r-v';
      d.append(kk, vv); return { d, vv };
    }
    function selectWord(el: HTMLButtonElement) {
      words.forEach((w) => { w.classList.remove('sel'); w.setAttribute('aria-pressed', 'false'); });
      el.classList.add('sel'); el.setAttribute('aria-pressed', 'true');
      const g = document.createElement('div'); g.className = 'd-readout';
      let c = cell('Word'); c.vv.classList.add('gold');
      const big = document.createElement('span'); big.className = 'big'; big.textContent = el.textContent ?? ''; c.vv.appendChild(big); g.appendChild(c.d);
      c = cell('Root'); const rt = document.createElement('span'); rt.className = 'root'; rt.textContent = el.dataset.root ?? ''; c.vv.appendChild(rt); g.appendChild(c.d);
      c = cell('Meaning'); c.vv.textContent = el.dataset.en ?? ''; g.appendChild(c.d);
      c = cell('Morphology · ṣarf', true); c.vv.textContent = el.dataset.morph ?? ''; g.appendChild(c.d);
      c = cell('Iʿrāb · case'); const cs = el.dataset.cs ?? 'none';
      if (cs !== 'none') { const tag = document.createElement('span'); tag.className = 'tag ' + cs; tag.textContent = CASE_NAME[cs]; c.vv.append(tag, document.createElement('br')); }
      c.vv.appendChild(document.createTextNode(el.dataset.irab ?? '')); g.appendChild(c.d);
      c = cell('Function · naḥw'); c.vv.textContent = el.dataset.irab ?? ''; g.appendChild(c.d);
      panel.replaceChildren(g);
    }
    function decode(el: HTMLButtonElement) {
      selectWord(el); el.classList.add('done');
      const id = el.dataset.i!;
      if (!decoded.has(id)) { decoded.add(id); countEl.textContent = String(decoded.size); document.dispatchEvent(new CustomEvent('lab:word-touched')); }
    }
    recite.addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.w'); if (b) decode(b); });
    root.querySelector('.lens')!.addEventListener('click', (e) => {
      const chip = (e.target as HTMLElement).closest<HTMLElement>('.chip'); if (!chip) return;
      root.querySelectorAll('.lens .chip').forEach((x) => x.classList.remove('on'));
      chip.classList.add('on'); filter = chip.dataset.f!;
      words.forEach((w) => {
        const m = filter === 'all' || (w.dataset.lens ?? '').split(' ').includes(filter);
        w.classList.toggle('dim', filter !== 'all' && !m);
        w.classList.toggle('match', filter !== 'all' && m);
      });
    });
    // Affordance: pre-select the first substantive word (has a triliteral root),
    // WITHOUT counting it toward the tally.
    const firstSub = words.find((w) => (w.dataset.root ?? '—') !== '—') ?? words[0];
    if (firstSub) selectWord(firstSub);
  }
  initDecoder();
  document.addEventListener('astro:page-load', initDecoder);
</script>
```

- [ ] **Step 3: Typecheck**

Run: `npx astro check 2>&1 | tail -20`
Expected: no new errors referencing `SurahDecoder.astro` or `surah-decoder.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/components/mdx/lab/SurahDecoder.astro src/styles/surah-decoder.css
git commit -m "feat(surahs): I'rab Decoder component + styles

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: SurahLayout → Lab shell

**Files:**
- Modify: `src/layouts/SurahLayout.astro` (full rewrite of the template)

Use `src/layouts/LessonLayout.astro` as the pattern. Keep BaseLayout + the existing SEO (`BreadcrumbSchema`, `ArticleSchema`).

- [ ] **Step 1: Compute surah ordering for the pager**

In the frontmatter, load all surahs and find prev/next by `surahNumber` ascending:

```astro
---
import BaseLayout from './BaseLayout.astro';
import BreadcrumbSchema from '../components/seo/BreadcrumbSchema.astro';
import ArticleSchema from '../components/seo/ArticleSchema.astro';
import SurahDecoder from '../components/mdx/lab/SurahDecoder.astro';
import { getCollection } from 'astro:content';
import '../styles/night.css';
import '../styles/lesson-lab.css';
import '../styles/surah-decoder.css';

interface Props {
  name: string; nameArabic: string; surahNumber: number; verseCount: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced'; revelation?: string;
  description?: string; headings?: { depth: number; slug: string; text: string }[];
}
const { name, nameArabic, surahNumber, verseCount, difficulty, revelation, description, headings } = Astro.props;

const all = (await getCollection('surahs')).sort((a, b) => a.data.surahNumber - b.data.surahNumber);
const idx = all.findIndex((s) => s.data.surahNumber === surahNumber);
const prev = idx > 0 ? all[idx - 1] : null;
const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
const surahId = all[idx]?.id.replace(/\.mdx?$/, '') ?? '';
const hrefFor = (e: typeof all[number] | null) => e ? `/surahs/${e.id.replace(/\.mdx?$/, '')}/` : null;

const difficultyLabel = difficulty ? `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}-level ` : '';
const surahDescription = description || `${difficultyLabel}word-by-word I'rab and grammatical breakdown of Surah ${name} (${nameArabic}), Surah ${surahNumber} of the Quran. Covers all ${verseCount} verses with Arabic syntax analysis.`;
const breadcrumbItems = [ { label: 'Home', href: '/' }, { label: 'Surahs', href: '/surahs/' }, { label: `Surah ${name}` } ];

// Station rail: 00 Briefing, 01 the injected Decoder, then one per h2.
const tocHeadings = (headings ?? []).filter((h) => h.depth === 2);
const stations = [
  { target: 'surah-brief', pip: '00', label: 'Briefing' },
  { target: 'surah-decoder', pip: '01', label: "I'rab Decoder" },
  ...tocHeadings.map((h, i) => ({ target: h.slug, pip: String(i + 2).padStart(2, '0'), label: h.text })),
];
const fontsHref = "https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:ital,wght@0,400;0,700;1,400&family=Marcellus&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap";
---
```

- [ ] **Step 2: Write the Lab template**

Replace the `<BaseLayout>...</BaseLayout>` body. Copy the always-night inline script + font preload block verbatim from `LessonLayout.astro` (lines ~108–133). Then:

```astro
<BaseLayout title={`Surah ${name}`} description={surahDescription} type="article">
  <Fragment slot="head">
    <BreadcrumbSchema items={breadcrumbItems} />
    <ArticleSchema title={`Surah ${name} - Grammatical Breakdown`} description={surahDescription} url={Astro.url.pathname} />
    <script is:inline>
      (function () {
        document.documentElement.dataset.theme = 'dark';
        document.addEventListener('astro:page-load', function () { document.documentElement.dataset.theme = 'dark'; });
        document.addEventListener('astro:after-swap', function () { document.documentElement.dataset.theme = 'dark'; });
      })();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href={fontsHref} media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href={fontsHref} /></noscript>
  </Fragment>

  <div class="lesson-page">
    <div class="lesson-grid lab">
      <main class="lesson-main">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li><a class="breadcrumb-link" href="/">Home</a></li>
            <li><span class="separator">/</span><a class="breadcrumb-link" href="/surahs/">Surahs</a></li>
            <li><span class="separator">/</span><span class="breadcrumb-current">Surah {name}</span></li>
          </ol>
        </nav>

        <div class="lab-body">
          <aside class="rail" data-lesson-toc aria-label="Surah stations">
            <p class="r-head">Surah {surahNumber} · {verseCount} verses<b>Surah {name}</b></p>
            {stations.map((s, i) => (
              <a class="station" href={`#${s.target}`} data-station-target={s.target} aria-current={i === 0 ? 'location' : undefined}>
                <span class="pip">{s.pip}</span>{s.label}
              </a>
            ))}
            <div class="r-stat">
              Progress <b data-rail-pct>0%</b>
              <span class="r-bar"><i data-rail-fill></i></span>
              Words decoded <b data-rail-touch>0</b>
            </div>
          </aside>

          <article class="lesson-article">
            <header class="lesson-header" id="surah-brief">
              <p class="sess">
                <span class="level-badge">Surah {surahNumber}</span>
                {revelation && <span class="lesson-position" style="text-transform:capitalize">{revelation}</span>}
                <span class="lesson-position">{verseCount} verses</span>
              </p>
              <h1 class="lesson-title">Surah {name}</h1>
              <p class="lesson-arabic" lang="ar" dir="rtl">{nameArabic}</p>
              {description && <p class="lesson-description">{description}</p>}
            </header>

            <div id="surah-decoder" style="scroll-margin-top:6.5rem">
              <SurahDecoder surahId={surahId} />
            </div>

            <div class="lesson-content">
              <slot />
            </div>

            <div class="debrief">
              <div class="complete-section" id="complete-section" data-lesson-slug={`surah/${surahId}`} data-reveal>
                <button id="complete-btn" class="done-btn">
                  <svg viewBox="0 0 15 15" aria-hidden="true"><path d="M2 8l4 4 7-9" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span id="complete-btn-text">Mark surah studied</span>
                </button>
                <p id="complete-status" class="complete-status done-btn done" style="display:none;">
                  <svg viewBox="0 0 15 15" aria-hidden="true"><path d="M2 8l4 4 7-9" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Studied — signed off
                </p>
              </div>
            </div>

            <nav class="pager" aria-label="Surah navigation">
              {prev ? (
                <a href={hrefFor(prev)} class="page-link prev"><span class="dir">&larr; Previous</span><span class="pt">Surah {prev.data.name}</span></a>
              ) : <div></div>}
              {next ? (
                <a href={hrefFor(next)} class="page-link next"><span class="dir">Next &rarr;</span><span class="pt">Surah {next.data.name}</span></a>
              ) : <div></div>}
            </nav>
          </article>
        </div>
      </main>
    </div>
  </div>
</BaseLayout>

<script>
  import { markLessonComplete, isLessonComplete } from '../lib/progress';
  async function initCompleteButton() {
    const section = document.getElementById('complete-section');
    const btn = document.getElementById('complete-btn') as HTMLButtonElement;
    const btnText = document.getElementById('complete-btn-text');
    const status = document.getElementById('complete-status');
    if (!section || !btn || !btnText || !status) return;
    const slug = section.dataset.lessonSlug || '';
    if (await isLessonComplete(slug)) { btn.style.display = 'none'; status.style.display = 'inline-flex'; return; }
    btn.addEventListener('click', async () => {
      btn.disabled = true; btnText.textContent = 'Saving…';
      if (await markLessonComplete(slug)) { btn.style.display = 'none'; status.style.display = 'inline-flex'; }
      else { btn.disabled = false; btnText.textContent = 'Mark surah studied'; }
    });
  }
  initCompleteButton();
  document.addEventListener('astro:page-load', initCompleteButton);
</script>

<script>
  import '../scripts/lab-lesson';
</script>
```

Notes for the implementer:
- Delete the old `<style>` block and the old `.max-w-4xl` template entirely — the Lab CSS now owns all chrome.
- The `data-lesson-slug` for surahs is namespaced `surah/<id>` so surah completion never collides with lesson progress ids. Confirm `progress.ts` treats it as an opaque string (it does — ids are opaque keys).
- The rail telemetry label is "Words decoded"; it is fed by the same `lab:word-touched` event the decoder + verse consoles dispatch, via `scripts/lab-lesson.ts` (already handles `[data-rail-touch]`).

- [ ] **Step 3: Confirm the surah page route passes `headings`**

Check the surah page route (e.g. `src/pages/surahs/[...slug].astro` or similar). It must pass `headings={render's headings}` into `SurahLayout` (LessonLayout's route does this). Run:
`grep -rn "SurahLayout" src/pages/`
Then open that route file and ensure `const { headings } = await render(entry)` (or `entry.render()`) is destructured and passed as `<SurahLayout ... headings={headings}>`. If missing, add it. Without it the rail shows only Briefing + Decoder.

- [ ] **Step 4: Build**

Run: `npm run build 2>&1 | tail -25`
Expected: builds clean; total page count unchanged from `main` (spot it in the output). No unresolved-import or Astro errors.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/SurahLayout.astro src/pages/surahs/
git commit -m "feat(surahs): convert SurahLayout to Anatomy Lab shell + inject decoder

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Verification sweep

**Files:**
- Create: `tests/surah-decoder.spec.ts`

- [ ] **Step 1: Write Playwright coverage**

Create `tests/surah-decoder.spec.ts` (match the repo's existing Playwright config/patterns in `tests/`):

```ts
import { test, expect } from '@playwright/test';

const SURAH = '/surahs/103-al-asr/';

test('decoder pre-selects a word and shows a readout on load', async ({ page }) => {
  await page.goto(SURAH);
  const sel = page.locator('[data-surah-decoder] .recite .w.sel');
  await expect(sel).toHaveCount(1);
  await expect(page.locator('[data-surah-decoder] .d-readout')).toBeVisible();
  await expect(page.locator('[data-dec-count]')).toHaveText('0'); // affordance doesn't count
});

test('tapping a word decodes it, fills the readout, and increments telemetry', async ({ page }) => {
  await page.goto(SURAH);
  await page.locator('[data-surah-decoder] .recite .w').nth(3).click();
  await expect(page.locator('[data-dec-count]')).toHaveText('1');
  await expect(page.locator('[data-rail-touch]')).toHaveText('1'); // rail telemetry wired
  await expect(page.locator('[data-surah-decoder] .d-readout .r-k')).toHaveCount(6);
});

test('genitive lens dims non-matching words', async ({ page }) => {
  await page.goto(SURAH);
  const genChip = page.locator('.lens .chip[data-f="gen"]');
  await expect(genChip).toBeVisible();
  await genChip.click();
  await expect(page.locator('[data-surah-decoder] .recite .w.match').first()).toBeVisible();
  await expect(page.locator('[data-surah-decoder] .recite .w.dim').first()).toBeVisible();
});

test('station rail tracks scroll and shows Words decoded stat', async ({ page }) => {
  await page.goto(SURAH);
  await expect(page.locator('.rail [data-rail-pct]')).toBeVisible();
  await expect(page.locator('.rail')).toContainText('Words decoded');
});
```

- [ ] **Step 2: Run the decoder tests**

Run: `npx playwright test tests/surah-decoder.spec.ts` (start the preview/build first per repo convention, e.g. `npm run build && npm run preview` in another shell, or the project's `webServer` config).
Expected: 4/4 pass.

- [ ] **Step 3: Cross-surface regression — resources + lessons unchanged**

The decoder/rail CSS ships via `surah-decoder.css`/`lesson-lab.css` imported only by SurahLayout/LessonLayout, and the shared MDX components keep their `:global(.prose)` base skins. Verify no bleed:
- Run the existing suite: `npx playwright test` — expect no NEW failures vs the `main` baseline (pre-existing `/test/*` fixture failures noted in prior PRs are not ours).
- Manually load a resource page and a lesson page in the browser; confirm resource pages remain in their normal theme (NOT forced night) and lessons are visually unchanged.

- [ ] **Step 4: Browser screenshot sweep (2+ surahs per difficulty)**

Using the preview server + browser tools: load `103-al-asr` (beginner), a `intermediate`, and an `advanced` surah, plus `001-al-fatiha` (the structural outlier). For each: screenshot the decoder, tap a word (readout fills), flip a lens, scroll (rail lights), confirm no console errors (`read_console_messages` onlyErrors). Check mobile width + `prefers-reduced-motion`.

- [ ] **Step 5: Commit**

```bash
git add tests/surah-decoder.spec.ts
git commit -m "test(surahs): decoder interaction + telemetry coverage

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Design audit + code review + PR

- [ ] **Step 1: Design audit** — run the `web-design-guidelines` skill against the new decoder component, CSS, and reworked SurahLayout. Fix accessibility/UX findings (focus-visible on word buttons, lens chips keyboard-operable, readout `aria-live`, contrast on cream/navy + gold marks) in-branch.

- [ ] **Step 2: Code review** — run `/code-review:code-review` on the branch diff. Fix confirmed findings. Watch specifically for: generator parsing edge cases (verses without breakdown tables silently dropped — confirm the report shows expected counts), `innerHTML` accidentally reintroduced, and the `surah/<id>` progress-id namespacing.

- [ ] **Step 3: Open the PR**

```bash
git push -u origin feat/surah-lab-decoder
gh pr create --title "feat(surahs): Anatomy Lab redesign + I'rab Decoder across all 38 surahs" --body "$(cat <<'EOF'
Ports the merged lesson Anatomy Lab (PR #13) to the 38 surah analysis pages and adds a new auto-generated **I'rab Decoder** centerpiece.

## What
- `SurahLayout` reworked to the always-night Lab shell: station rail + "Words decoded" telemetry, blueprint backdrop, verse-console / rulebox / DIAG / plate skins, completion button + surah pager.
- New **I'rab Decoder** on every surah — tap any word for full iʿrāb (root · morphology · case · function · meaning); lens chips (Particles/Genitive/Accusative/Verbs).
- Decoder data GENERATED from the 571 uniform "Word-by-Word Breakdown" table rows already in the MDX (`scripts/extract-surah-decoder.mjs` → `src/data/surah-decoder.ts`), byte-verified 38/38. No per-surah MDX edits; Arabic stays byte-exact.

## Verification
- 38/38 dataset gate passes; full build clean; 4/4 decoder Playwright tests; cross-surface regression (resources/lessons unchanged); screenshot sweep across difficulties + Al-Fatiha, mobile + reduced-motion.

Spec: docs/superpowers/specs/2026-07-13-surah-lab-decoder-design.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review notes (author)

- **Spec coverage:** shell (Task 3) ✓, decoder component (Task 2) ✓, generated data (Task 1) ✓, always-night (Task 3 inline script) ✓, station rail from h2 (Task 3) ✓, readability fixes (Task 2 CSS — cream/navy, button reset, affordance-not-counted) ✓, cross-surface safety (Task 4 Step 3) ✓, verification gate (Task 1 Step 3, Task 4) ✓, no `/surahs` index change (not touched) ✓.
- **Type consistency:** `DecoderWord`/`DecoderVerse` fields (`ar,tr,root,morph,irab,en,cs,lens`) match between generator output (Task 1), the component's `data-*` reads (Task 2), and the readout builder. `data-dec-count`/`data-rail-touch`/`data-station-target`/`data-lesson-toc` names match `lab-lesson.ts`'s selectors.
- **Known edge case:** `001-al-fatiha` may differ structurally; Task 1 Step 3 gate + Task 4 Step 4 explicitly cover it. Verses lacking a breakdown table are dropped from the decoder by design (still render in prose) — generator report surfaces the counts.
