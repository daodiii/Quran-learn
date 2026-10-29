/**
 * The surah study page reads each surah's MDX as data, not as rendered MDX: the explanation layers, notes,
 * exercises, vocabulary and summary are pulled out of the file's body, and the words come from the decoder data.
 * Pure functions, no imports, so the page (at build), the browser script and the tests share them.
 *
 * The 38 files share one shape (checked by surah-study.test.ts): "## Overview", "## Verse-by-Verse Analysis" with one
 * "### Verse N" per verse, "## Practice Exercises", "## Key Vocabulary", "## Grammar Summary" and, in some, "## Sources".
 */

export type WordType = 'noun' | 'verb' | 'little';

/**
 * The site teaches three word types: noun (ism), verb (fiʿl), little word (ḥarf). The decoder data has no
 * word-type field, so it is read from the morph line, for example "Preposition + noun - masculine singular":
 * the stem (the last part before " - ") decides. A preposition joined to a noun or pronoun counts as the noun.
 */
export function wordType(morph: string): WordType {
  const stem = (morph.split(' - ')[0].toLowerCase().split('+').pop() ?? '').trim();
  if (/^verb/.test(stem)) return 'verb';
  if (/^(particle|preposition|conjunction)/.test(stem) || stem.includes('particle')) return 'little';
  return 'noun';
}

export const WORD_TYPES: Record<WordType, { label: string; term: string }> = {
  noun: { label: 'Noun', term: 'ism' },
  verb: { label: 'Verb', term: 'fiʿl' },
  little: { label: 'Little word', term: 'ḥarf' },
};

/** Font size (rem) and minimum width (px) of one word in the verse box: fewer words, bigger type. */
export function wordSize(count: number): { size: number; min: number } {
  return count <= 4 ? { size: 4, min: 96 } : count <= 6 ? { size: 3.25, min: 80 } : count <= 9 ? { size: 2.6, min: 64 } : { size: 2.1, min: 64 };
}

export interface Callout { kind: string; title: string; body: string }
export interface Layer { key: 'nahw' | 'sarf' | 'balagha'; label: string; body: string }
export interface VerseText { n: number; layers: Layer[]; callouts: Callout[] }
export interface Exercise { q: string; a: string }
export interface StudyText {
  overview: { label: string; text: string }[];
  /** The overview's table of every verse (markdown) and its notes, shown as "the surah at a glance". */
  glance: { table: string; notes: Callout[] };
  verses: VerseText[];
  /** Only one file (080) has a synthesis for the whole surah. */
  surahLayers: Layer[];
  exercises: Exercise[];
  vocab: string[][];
  /** Markdown: a bullet list in most files, a numbered list with nested bullets in others. */
  summary: string;
  sources: string;
}

const LAYER_LABEL: Record<Layer['key'], string> = { nahw: 'Syntax', sarf: 'Word forms', balagha: 'Style' };

/** The text of "## Heading" up to the next "## " heading (not "### "). Empty when the heading is absent. */
function section(body: string, heading: string): string {
  const m = new RegExp(`^## ${heading}[^\\n]*\\n`, 'm').exec(body);
  if (!m) return '';
  const rest = body.slice(m.index + m[0].length);
  const end = rest.search(/^## /m);
  return (end < 0 ? rest : rest.slice(0, end)).trim();
}

function parseLayers(text: string): Layer[] {
  const out: Layer[] = [];
  const parts = text.split(/^\*\*(Nahw|Sarf|Balagha)[^*\n]*\*\*:?[ \t]*/m);
  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i].toLowerCase() as Layer['key'];
    const body = parts[i + 1].trim();
    if (body) out.push({ key, label: LAYER_LABEL[key], body });
  }
  return out;
}

function tableRows(text: string): string[][] {
  return text
    .split('\n')
    .filter((l) => l.startsWith('|') && !/^\|[\s:|-]+\|$/.test(l))
    .map((l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
}

export function parseSurahBody(raw: string): StudyText {
  const body = raw.replace(/\r\n/g, '\n');

  const overview = section(body, 'Overview')
    .split('\n')
    .map((l) => /^- \*\*([^*]+?):\*\*\s*(.*)$/.exec(l))
    .filter((m): m is RegExpExecArray => !!m)
    .map((m) => ({ label: m[1], text: m[2] }));

  const ov = section(body, 'Overview');
  const glance = {
    table: ov.split('\n').filter((l) => l.startsWith('|')).join('\n'),
    notes: [...ov.matchAll(/<Callout type="(\w+)" title="([^"]*)">\n([\s\S]*?)\n<\/Callout>/g)].map((m) => ({ kind: m[1], title: m[2], body: m[3].trim() })),
  };

  const analysis = section(body, 'Verse-by-Verse Analysis');
  const chunks = analysis.split(/^### Verse (\d+)[^\n]*\n/m);
  const verses: VerseText[] = [];
  let surahLayers: Layer[] = [];
  for (let i = 1; i < chunks.length; i += 2) {
    let chunk = chunks[i + 1];
    const whole = chunk.search(/^#### Surah-Level Nahw-Sarf-Balagha Synthesis[^\n]*\n/m);
    if (whole >= 0) {
      surahLayers = parseLayers(chunk.slice(whole).replace(/^#### [^\n]*\n/, ''));
      chunk = chunk.slice(0, whole);
    }
    const callouts = [...chunk.matchAll(/<Callout type="(\w+)" title="([^"]*)">\n([\s\S]*?)\n<\/Callout>/g)].map((m) => ({ kind: m[1], title: m[2], body: m[3].trim() }));
    const synth = /^#### Nahw-Sarf-Balagha Synthesis[^\n]*\n/m.exec(chunk);
    verses.push({ n: +chunks[i], callouts, layers: synth ? parseLayers(chunk.slice(synth.index + synth[0].length)) : [] });
  }

  const exercises = [...section(body, 'Practice Exercises').matchAll(/<ExerciseBox question="([^"]*)">\n([\s\S]*?)<\/ExerciseBox>/g)].map((m) => ({ q: m[1], a: m[2].trim() }));
  const vocab = tableRows(section(body, 'Key Vocabulary')).slice(1);
  const summary = section(body, 'Grammar Summary').replace(/^<\/?Callout[^>]*>[ \t]*$/gm, '').trim();
  return { overview, glance, verses, surahLayers, exercises, vocab, summary, sources: section(body, 'Sources') };
}

// ---- text to HTML (the little Markdown the surah files use), always escaped ----

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const AR = '[؀-ۿݐ-ݿﭐ-﷿ﹰ-ﻼ]';
const AR_RUN = new RegExp(AR + '+(?:\\s+' + AR + '+)*', 'g');

/** Escapes the text and wraps each run of Arabic so it gets the Arabic font and direction. Returns HTML. */
export function withArabic(text: string): string {
  return esc(text).replace(AR_RUN, (m) => `<span class="ar" lang="ar" dir="rtl">${m}</span>`);
}

/** Inline: Arabic runs, **bold** and [text](/path or https://...) links. Returns HTML. */
export function inline(text: string): string {
  return withArabic(text)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\[([^\]]+)\]\(((?:\/|https:\/\/)[^)\s]*)\)/g, '<a href="$2">$1</a>');
}

/** Paragraphs, "- " and "1. " lists, tables and bold, as HTML. */
export function md(src: string): string {
  const out: string[] = [];
  let list: 'ul' | 'ol' | null = null;
  let rows: string[][] = [];
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  const closeTable = () => {
    if (!rows.length) return;
    const [head, ...rest] = rows;
    out.push(`<div class="tbl"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rest.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
    rows = [];
  };
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l.startsWith('|')) {
      closeList();
      if (!/^\|[\s:|-]+\|$/.test(l)) rows.push(l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
      continue;
    }
    closeTable();
    if (!l) { closeList(); continue; }
    const ul = /^[-*] (.*)/.exec(l);
    const ol = /^\d+\. (.*)/.exec(l);
    if (ul || ol) {
      const kind = ul ? 'ul' : 'ol';
      if (list !== kind) { closeList(); out.push(`<${kind}>`); list = kind; }
      out.push(`<li>${inline((ul ?? ol)![1])}</li>`);
    } else { closeList(); out.push(`<p>${inline(l)}</p>`); }
  }
  closeList(); closeTable();
  return out.join('');
}

/** The reading note uses long dashes; the site does not. Each one becomes a full stop. */
export function plainNote(s: string): string {
  return s.replace(/\s+—\s+(\S)/g, (_, c: string) => '. ' + c.toUpperCase());
}

// ---- the box under a tapped word ----

export interface StudyWord {
  ar: string;
  tr: string;
  en: string;
  /** "ق و ل", or "-" / "" for a word with no root. */
  root: string;
  /** The grammar book's parse, in the book's terms. */
  irab: string;
  t: WordType;
  /** Plain-English role label and one or two sentences; absent for surahs without a teaching layer yet. */
  role?: string;
  say?: string;
}

/** Inner HTML of the word box: type, role, meaning, plain sentence, root and the book's parse. */
export function detailHTML(w: StudyWord): string {
  const t = WORD_TYPES[w.t];
  const root = w.root && w.root !== '-' ? `<span>Root <span class="ar" lang="ar" dir="rtl">${esc(w.root)}</span></span>` : '';
  return `<div class="top2"><span class="ty ${w.t}">${t.label} <em>${t.term}</em></span>${w.role ? `<span class="role">${esc(w.role)}</span>` : ''}</div>`
    + `<p class="say">${esc(w.tr)}: ${esc(w.en)}.${w.say ? ' ' + withArabic(w.say) : ''}</p>`
    + `<p class="book">${root}<span>${w.role ? 'For the grammar book' : 'Grammar'}: ${withArabic(w.irab)}</span></p>`;
}
