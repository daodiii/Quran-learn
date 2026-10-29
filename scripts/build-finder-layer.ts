// scripts/build-finder-layer.ts
// Merges the AI-written plain-English batches into src/data/finder/plain-layer.json
// (keyed "lemma|pos") and rejects anything that breaks the brief.
//   node scripts/build-finder-layer.ts
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';

const DIR = 'src/data/finder';
const KINDS = new Set(['action', 'thing', 'person or being', 'name', 'describing word', 'place or time', 'small word']);
const BANNED = /\b(stem|nominative|accusative|genitive|relative pronoun|particle|preposition|conjunction|pronoun|imperfect|verbal noun|participle|demonstrative|adverb|vocative)\b/i;

interface In { id: number; lemma: string; pos: string }
interface Out { id: number; easy: string; kind: string; type: string[]; note: string | null; check: boolean }
const read = <T>(f: string): T => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8'));

const problems: string[] = [];
const layer: Record<string, Omit<Out, 'id'>> = {};
let flagged = 0;

function take(ins: In[], outs: Out[], label: string) {
  const byId = new Map(outs.map(o => [o.id, o]));
  for (const i of ins) {
    const o = byId.get(i.id);
    if (o && o.note === undefined) o.note = null; // a missing note means no note
    const at = `${label} id ${i.id} (${i.lemma}|${i.pos})`;
    if (!o) { problems.push(`${at}: missing`); continue; }
    if (typeof o.easy !== 'string' || !o.easy.trim()) problems.push(`${at}: no easy`);
    else if (o.easy.split(/\s+/).length > 16) problems.push(`${at}: easy over 16 words`);
    if (BANNED.test(o.easy ?? '')) problems.push(`${at}: grammar jargon in easy: ${o.easy}`);
    if (!KINDS.has(o.kind)) problems.push(`${at}: bad kind ${o.kind}`);
    if (!Array.isArray(o.type) || o.type.length < 3 || o.type.length > 15) problems.push(`${at}: type count ${o.type?.length}`);
    if (o.type?.some(t => /[؀-ۿ]/.test(t) || t !== t.toLowerCase())) problems.push(`${at}: type has Arabic or capitals`);
    if (o.note !== null && typeof o.note !== 'string') problems.push(`${at}: bad note`);
    if (typeof o.check !== 'boolean') problems.push(`${at}: bad check`);
    const key = `${i.lemma}|${i.pos}`;
    if (layer[key]) problems.push(`${at}: duplicate key`);
    layer[key] = { easy: o.easy, kind: o.kind, type: [...new Set(o.type)], note: o.note, check: o.check };
    if (o.check) flagged++;
  }
  const extra = outs.filter(o => !ins.some(i => i.id === o.id));
  if (extra.length) problems.push(`${label}: ${extra.length} output ids not in input`);
}

take(read<In[]>('pilot-input.json'), read<Out[]>('pilot-output.json'), 'pilot');
for (const f of readdirSync(`${DIR}/batches`).filter(f => /^in-\d+\.json$/.test(f)).sort()) {
  const n = f.match(/\d+/)![0];
  const outFile = `batches/out-${n}.json`;
  if (!existsSync(`${DIR}/${outFile}`)) { problems.push(`batch ${n}: no output file`); continue; }
  take(read<In[]>(`batches/${f}`), read<Out[]>(outFile), `batch ${n}`);
}

console.log(`entries=${Object.keys(layer).length} check=${flagged} problems=${problems.length}`);
if (problems.length) { console.log(problems.slice(0, 60).join('\n')); process.exitCode = 1; }
else writeFileSync(`${DIR}/plain-layer.json`, JSON.stringify(layer));
