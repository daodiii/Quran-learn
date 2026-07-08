// Walk lessons in curriculum order; emit src/data/vocab/lessons.json.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { extractArabicProps, selectLessonVocab } from './lib/lesson-vocab.ts';

const INDEX = JSON.parse(readFileSync('public/data/word-lookup.json', 'utf8'));
const LESSONS_DIR = 'src/content/lessons';
const OUT = 'src/data/vocab/lessons.json';
const MAX_PER_LESSON = 10;

const lessonFiles: { id: string; level: number; order: number; path: string }[] = [];
for (const levelDir of readdirSync(LESSONS_DIR).filter(d => d.startsWith('level-'))) {
  const level = Number(levelDir.split('-')[1]);
  for (const f of readdirSync(`${LESSONS_DIR}/${levelDir}`)) {
    if (!f.endsWith('.mdx') || f.startsWith('_')) continue;
    const order = Number(f.split('-')[0]);
    lessonFiles.push({ id: `${levelDir}/${f.replace(/\.mdx$/, '')}`, level, order, path: `${LESSONS_DIR}/${levelDir}/${f}` });
  }
}
lessonFiles.sort((a, b) => a.level - b.level || a.order - b.order);

const registry = new Set<string>();
const out: Record<string, ReturnType<typeof selectLessonVocab>> = {};
let total = 0, empty = 0;
for (const lf of lessonFiles) {
  const vocab = selectLessonVocab(extractArabicProps(readFileSync(lf.path, 'utf8')), INDEX, registry, MAX_PER_LESSON);
  if (vocab.length) out[lf.id] = vocab; else empty++;
  total += vocab.length;
}
mkdirSync('src/data/vocab', { recursive: true });
writeFileSync(OUT, JSON.stringify(out) + '\n');
console.log(`lessons=${lessonFiles.length} withVocab=${lessonFiles.length - empty} words=${total} uniqueRegistry=${registry.size}`);
if (lessonFiles.length !== 80) { console.error(`FAIL: expected 80 lessons, saw ${lessonFiles.length}`); process.exit(1); }
if (total < 300) { console.error(`FAIL: implausibly few vocab words (${total}) — extraction regression?`); process.exit(1); }
console.log(`→ ${OUT}`);
