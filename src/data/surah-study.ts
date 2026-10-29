// Plain-English teaching layer for the surah study page, one surah at a time. It sits on top of the word data
// (src/data/surah-decoder.ts) and the explanations in each surah's MDX; nothing here repeats them.
//
// A word's `role` is a short label ("Subject (mubtadaʾ)") and `say` is one or two B1 sentences about what the
// word does in its verse. `quiz` is one question per verse about one word. The page checks that a surah's entries
// match the decoder's word counts and fails the build if they do not. A surah with no entry here still renders:
// the box under a word then shows the meaning, the root and the grammar book's parse, and no question.
//
// Drafted 2026-10-29 for Al-Ikhlas only. Each line follows the parse the surah file gives (checked against
// al-Jadwal, 112:1-4). Someone who knows Arabic grammar should read these before they ship.

import { LEVEL_1 } from './surah-study-level1';
import { LEVEL_2 } from './surah-study-level2';
import { LEVEL_3 } from './surah-study-level3';
import { LEVEL_5 } from './surah-study-level5';

export interface WordNote { role: string; say: string }
export interface VerseQuiz { word: number; q: string; options: string[]; answer: number; why: string }
export interface VerseStudy { words: WordNote[]; quiz?: VerseQuiz }
export interface SurahStudy { verses: Record<number, VerseStudy> }

export const SURAH_STUDY: Record<string, SurahStudy> = {
  ...LEVEL_1,
  ...LEVEL_2,
  ...LEVEL_3,
  ...LEVEL_5,
  '112-al-ikhlas': {
    verses: {
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
    },
  },
};
