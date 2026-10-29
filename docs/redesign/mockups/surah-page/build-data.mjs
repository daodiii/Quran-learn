// Builds ikhlas-data.js for the surah-page mockups from the real Al-Ikhlas file (src/content/surahs/112-al-ikhlas.mdx).
//   node docs/redesign/mockups/surah-page/build-data.mjs
// Everything the learner reads as analysis comes from the MDX. The only authored layer is PLAIN below: a short
// plain-English role for each word and one practice question for each verse. Both are drafts for the owner to read.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..', '..');
const src = readFileSync(join(root, 'src/content/surahs/112-al-ikhlas.mdx'), 'utf8').replace(/\r\n/g, '\n');
const { READING_TRACK } = await import(pathToFileURL(join(root, 'src/data/reading-track.ts')).href);
const track = READING_TRACK.find((e) => e.slug === '112-al-ikhlas');

// Word type from the morph line, same rule as the Surahs mockups (the stem, after the last "+", decides).
function wordType(morph) {
  const stem = (morph.split(' - ')[0].toLowerCase().split('+').pop() || '').trim();
  if (/^verb/.test(stem)) return 'verb';
  if (/^(particle|preposition|conjunction)/.test(stem) || stem.includes('particle')) return 'little';
  return 'noun';
}
const attr = (block, name) => (block.match(new RegExp(name + '="([^"]*)"')) || [])[1] || '';
const tableRows = (block) => block.split('\n').filter((l) => /^\|\s*\d+\s*\|/.test(l)).map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));

// ---- authored plain layer: one entry per verse, one per word (same order as the table) ----
const PLAIN = {
  1: {
    words: [
      { role: 'Command', say: 'A command. The speaker is told: say.' },
      { role: 'Subject (mubtadaʾ)', say: 'The pronoun "He". It opens the sentence, so it is the subject, and the rest of the verse says who He is.' },
      { role: 'Second subject', say: 'The name Allah starts a new statement inside the sentence. It takes the next word as its predicate.' },
      { role: 'Predicate (khabar)', say: 'This word says something about Allah. It ends in tanwin because it is indefinite: One, with nothing like it.' },
    ],
    quiz: { word: 3, q: 'What does أَحَدٌ do in this sentence?', options: ['It is the subject', 'It is the predicate: it says something about Allah', 'It is a verb'], answer: 1, why: 'Allah is the subject of this statement. أَحَدٌ tells us what we are saying about Him: He is One.' },
  },
  2: {
    words: [
      { role: 'Subject (mubtadaʾ)', say: 'The subject again. This sentence has only two words.' },
      { role: 'Predicate (khabar)', say: 'It has al- in front, so it is definite. Two definite words side by side mean "Allah is the Ṣamad", not just "Allah is like a Ṣamad".' },
    ],
    quiz: { word: 1, q: 'Both words in this sentence are definite. What does that tell you?', options: ['The sentence describes Allah', 'The sentence says who Allah is: it identifies Him', 'The sentence is a question'], answer: 1, why: 'A definite predicate points to one exact thing. The verse does not say Allah has this quality; it says Allah is the one who has it.' },
  },
  3: {
    words: [
      { role: 'Negation', say: 'A little word that means "did not". It also puts the verb after it in the jussive.' },
      { role: 'Verb, jussive', say: 'He begets. After لَمْ the verb ends in sukun, the sign of the jussive. The first root letter و has dropped.' },
      { role: 'And + negation', say: 'wa- joins the second statement to the first, and لَمْ negates again.' },
      { role: 'Verb, passive, jussive', say: 'He is born. Same root as the verb before it, but passive: the one who is born receives the action.' },
    ],
    quiz: { word: 3, q: 'How is يُولَدْ different from يَلِدْ?', options: ['It is passive: he is born, not he begets', 'It is in the past tense', 'It has a different root'], answer: 0, why: 'Both come from و ل د. The vowels change from يَلِدْ to يُولَدْ to show that the subject receives the action.' },
  },
  4: {
    words: [
      { role: 'And + negation', say: 'Joins this to the verse before, and negates the verb that follows.' },
      { role: 'Verb kāna, jussive', say: 'The verb "to be", after لَمْ. It needs a subject and a predicate. The wāw has dropped before the sukun.' },
      { role: 'Phrase "for Him"', say: 'The preposition لِ with the pronoun هُ. It belongs to the next word and comes first for emphasis.' },
      { role: 'Predicate of kāna', say: 'The one who is equal. It is the predicate of كَانَ, so it takes the accusative ending.' },
      { role: 'Subject of kāna', say: 'Anyone. It is the subject of كَانَ, so it is nominative, and it comes last on purpose.' },
    ],
    quiz: { word: 4, q: 'Why is أَحَدٌ nominative, even though it comes at the end?', options: ['It is the subject of كَانَ', 'Because it follows لَهُ', 'It is the predicate'], answer: 0, why: 'The subject of كَانَ is always nominative. Its position at the end does not change its case; it only adds suspense.' },
  },
};

const out = { surah: { number: 112, slug: '112-al-ikhlas', name: 'Al-Ikhlas', ar: 'الإخلاص', title: 'The Sincerity', verses: 4, place: 'Meccan', level: track.afterLevel, note: track.note.replace(/\s+—\s+(\S)/g, (_, c) => '. ' + c.toUpperCase()) }, verses: [] };

const chunks = src.split(/^### Verse (\d+)\n/m);
for (let i = 1; i < chunks.length; i += 2) {
  const n = +chunks[i];
  const body = chunks[i + 1].split('\n## ')[0]; // the last verse runs to the end of the file; stop at the next section
  const ex = body.match(/<ArabicExample[\s\S]*?\/>/)[0];
  const rows = tableRows(body.match(/<GrammarTable>[\s\S]*?<\/GrammarTable>/)[0]);
  const callout = body.match(/<Callout type="(\w+)" title="([^"]*)">\n([\s\S]*?)\n<\/Callout>/);
  const nsb = body.match(/#### Nahw-Sarf-Balagha Synthesis\n\n([\s\S]*)$/)[1].trim();
  const layer = (label) => { const m = nsb.match(new RegExp('\\*\\*' + label + '[^*]*\\*\\*:? ?([\\s\\S]*?)(?=\\n\\n\\*\\*|$)')); return m ? m[1].trim() : ''; };
  const plain = PLAIN[n];
  if (!plain || plain.words.length !== rows.length) throw new Error(`verse ${n}: ${rows.length} words in the table, ${plain && plain.words.length} in PLAIN`);
  out.verses.push({
    n, ar: attr(ex, 'arabic'), tr: attr(ex, 'transliteration'), en: attr(ex, 'translation'),
    words: rows.map((r, k) => ({ ar: r[1], tr: r[2], root: r[3] === '-' ? '' : r[3], morph: r[4], irab: r[5], en: r[6], t: wordType(r[4]), role: plain.words[k].role, say: plain.words[k].say })),
    callout: callout ? { kind: callout[1], title: callout[2], body: callout[3].trim() } : null,
    why: { nahw: layer('Nahw'), sarf: layer('Sarf'), balagha: layer('Balagha') },
    quiz: plain.quiz,
  });
}
if (out.verses.length !== 4) throw new Error('expected 4 verses');

// exercises, vocabulary, summary
out.exercises = [...src.matchAll(/<ExerciseBox question="([^"]*)">\n([\s\S]*?)<\/ExerciseBox>/g)].map((m) => ({ q: m[1], a: m[2].trim() }));
const vocab = src.split('## Key Vocabulary')[1].split('## Grammar Summary')[0];
out.vocab = vocab.split('\n').filter((l) => l.startsWith('|') && !/^\|[-| ]+\|$/.test(l)).slice(1).map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
out.summary = src.split('## Grammar Summary')[1].match(/<Callout[^>]*>\n([\s\S]*?)<\/Callout>/)[1].split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2));
out.third = src.match(/<Callout type="tip" title="([^"]*)">\n([\s\S]*?)\n<\/Callout>/).slice(1);
out.sources = src.split('## Sources')[1].trim();

writeFileSync(join(here, 'ikhlas-data.js'), `// Generated by build-data.mjs from src/content/surahs/112-al-ikhlas.mdx. Do not edit.\nwindow.IK = ${JSON.stringify(out, null, 1)};\n`);
console.log(`verses ${out.verses.length}, words ${out.verses.reduce((a, v) => a + v.words.length, 0)}, exercises ${out.exercises.length}, vocab ${out.vocab.length}, summary ${out.summary.length}`);
