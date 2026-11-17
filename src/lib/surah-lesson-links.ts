/**
 * Links between surahs and the lessons that teach the grammar in them.
 *
 * Nothing here is hand-picked per surah. Each rule names a grammar term as the surah decoder writes it
 * (src/data/surah-decoder.ts: the "irab" text of all 2,791 words) and the lesson that teaches it. For every
 * surah we count the words that match each rule; the counts are real and are shown on the page. A surah lists
 * the rules where its count is high compared with the other surahs. A lesson lists the surahs where its
 * rule matches most.
 *
 * Checkpoint and analysis lessons that are about one surah are linked directly (DIRECT below).
 */
import decoder from '../data/surah-decoder';

export interface Rule {
  key: string;
  /** Lesson id in the lessons collection, e.g. level-2/08-possessive-idafah */
  lesson: string;
  /** What the reader sees: the grammar thing, in plain words. */
  label: string;
  /** Matches the word's normalized i'rab text (see norm). */
  test: RegExp;
}

/** Lowercase, drop diacritics, and write every apostrophe-like mark as '. */
export function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ʿʾ’‘ʼ`]/g, "'")
    .toLowerCase();
}

export const RULES: Rule[] = [
  { key: 'nominal', lesson: 'level-2/01-nominal-sentence', label: 'a sentence without a verb', test: /\((mubtada|khabar)(?! (al-)?(inna|kaa?na))[^)]*\)/ },
  { key: 'verbal', lesson: 'level-2/03-verbal-sentence', label: 'a sentence that starts with a verb (the doer)', test: /(?<!na{1,2}'ib )(?<!na{1,2}'ib al-)\bfa{1,2}'il\b/ },
  { key: 'object', lesson: 'level-2/05-accusative-case', label: 'the object of a verb (the receiver)', test: /maf'ul bihi/ },
  { key: 'preposition', lesson: 'level-2/07-prepositions-genitive', label: 'a preposition and its noun', test: /harf jarr|jarr wa-?majrur|majrur bi-?l-?harf/ },
  { key: 'idafah', lesson: 'level-2/08-possessive-idafah', label: 'the possessive construction (idāfah)', test: /mudaf ilay/ },
  { key: 'adjective', lesson: 'level-2/09-adjective-agreement', label: 'an adjective describing a noun', test: /\bna't\b/ },
  { key: 'inna', lesson: 'level-2/10-inna-sisters', label: 'inna and its sisters', test: /(ism|khabar) (al-)?inna/ },
  { key: 'kana', lesson: 'level-2/11-kaana-sisters', label: 'kāna and its sisters', test: /(ism|khabar) (al-)?kaa?na/ },
  { key: 'past', lesson: 'level-3/05-past-tense', label: 'the past tense', test: /fi'l madi/ },
  { key: 'present', lesson: 'level-3/06-present-tense', label: 'the present tense', test: /fi'l mudari/ },
  { key: 'jussive', lesson: 'level-3/07-subjunctive-jussive', label: 'the jussive', test: /majzum/ },
  { key: 'imperative', lesson: 'level-3/08-imperative', label: 'a command', test: /fi'l amr/ },
  { key: 'passive', lesson: 'level-3/09-passive-voice', label: 'the passive voice', test: /na{1,2}'ib (al-)?fa{1,2}'il/ },
  { key: 'relative', lesson: 'level-3/11-relative-pronouns', label: 'a relative pronoun (who, which)', test: /mawsul|\bsila\b/ },
  { key: 'hal', lesson: 'level-4/01-hal-clauses', label: 'a hāl clause (how it happened)', test: /\(hal\)|\bhal\b.*(state|circumstan)|(state|circumstan).*\(hal\)/ },
  { key: 'mutlaq', lesson: 'level-4/07-maf-ul-mutlaq', label: 'the absolute object (mafʿūl muṭlaq)', test: /maf'ul mutlaq/ },
  { key: 'negation', lesson: 'level-4/10-negation-particles', label: 'a negation particle', test: /harf nafy/ },
  { key: 'emphasis', lesson: 'level-4/06-emphasis-affirmation', label: 'emphasis (tawkīd)', test: /harf tawkid|lam al-tawkid|lam muzahlaqa/ },
  { key: 'conditional', lesson: 'level-4/03-conditional-sentences', label: 'a conditional sentence', test: /\bshart\b|jawab/ },
  { key: 'oath', lesson: 'level-5/08-oath-formulas', label: 'an oath formula', test: /muqsam bihi|\bqasam\b/ },
  { key: 'question', lesson: 'level-5/13-rhetorical-questions', label: 'a question word', test: /istifham/ },
];

/** Lessons that are about one surah (or its pair). Linked from that surah's page as "Its own lesson". */
export const DIRECT: Record<string, { lesson: string; label: string }[]> = {
  '001-al-fatiha': [{ lesson: 'level-5/02-surah-al-fatiha', label: 'Analyzing Surah Al-Fatiha' }],
  '112-al-ikhlas': [
    { lesson: 'level-1/11-checkpoint-al-ikhlas', label: 'Checkpoint: reading Surah Al-Ikhlas' },
    { lesson: 'level-5/04-surah-al-ikhlas', label: 'Analyzing Surah Al-Ikhlas' },
  ],
  '108-al-kawthar': [{ lesson: 'level-2/12-checkpoint-al-kawthar', label: 'Checkpoint: reading Surah Al-Kawthar' }],
  '103-al-asr': [{ lesson: 'level-3/22-checkpoint-al-asr', label: 'Checkpoint: Surah Al-ʿAsr' }],
  '093-ad-duha': [{ lesson: 'level-4/19-checkpoint-ad-duha', label: 'Analysis checkpoint: Surah Ad-Duha' }],
  '113-al-falaq': [{ lesson: 'level-5/05-surah-al-falaq-an-nas', label: 'Analyzing Surah Al-Falaq and An-Nas' }],
  '114-an-nas': [{ lesson: 'level-5/05-surah-al-falaq-an-nas', label: 'Analyzing Surah Al-Falaq and An-Nas' }],
};

export type Counts = Record<string, number>; // rule key -> number of words

const counts: Record<string, Counts> = {};
for (const [surah, verses] of Object.entries(decoder)) {
  const c: Counts = {};
  for (const r of RULES) c[r.key] = 0;
  for (const v of verses) {
    for (const w of v.words) {
      const text = norm(w.irab);
      for (const r of RULES) if (r.test.test(text)) c[r.key]++;
    }
  }
  counts[surah] = c;
}

const surahCount = Object.keys(counts).length;
/** In how many surahs does each rule match at least once? Rare rules say more about a surah than common ones. */
const spread: Counts = {};
for (const r of RULES) spread[r.key] = Object.values(counts).filter((c) => c[r.key] > 0).length;

export interface SurahLink { rule: Rule; count: number }

/** Up to `limit` rules for a surah, most characteristic first (count times how rare the rule is across surahs). */
export function rulesForSurah(surah: string, limit = 6, minCount = 2): SurahLink[] {
  const c = counts[surah];
  if (!c) return [];
  return RULES.map((rule) => ({ rule, count: c[rule.key] }))
    .filter((x) => x.count >= minCount)
    .sort((a, b) => b.count * Math.log(1 + surahCount / spread[b.rule.key]) - a.count * Math.log(1 + surahCount / spread[a.rule.key]))
    .slice(0, limit);
}

export interface LessonLink { surah: string; count: number }

/** The surahs where a lesson's rule matches most, for the "see it in the Quran" box on the lesson. */
export function surahsForLesson(lesson: string, limit = 3, minCount = 2): LessonLink[] {
  const rule = RULES.find((r) => r.lesson === lesson);
  if (!rule) return [];
  return Object.entries(counts)
    .map(([surah, c]) => ({ surah, count: c[rule.key] }))
    .filter((x) => x.count >= minCount)
    .sort((a, b) => b.count - a.count || a.surah.localeCompare(b.surah))
    .slice(0, limit);
}

export function ruleCountsForTesting(): Record<string, Counts> {
  return counts;
}
