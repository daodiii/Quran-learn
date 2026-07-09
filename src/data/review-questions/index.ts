// Cumulative review quizzes: level-N review samples ONLY levels 1..N-1
// (interleaved retrieval practice). Every Arabic string is copied verbatim
// from the lesson cited in `source` — no generated Arabic, ever.
import { LEVEL_2_REVIEW } from './level-2.ts';
import { LEVEL_3_REVIEW } from './level-3.ts';
import { LEVEL_4_REVIEW } from './level-4.ts';
import { LEVEL_5_REVIEW } from './level-5.ts';

export interface ReviewQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  /** lesson id the Arabic + concept came from, e.g. "level-1/06-definite-article" */
  source: string;
}

export const REVIEW_QUESTIONS: Record<2 | 3 | 4 | 5, ReviewQuestion[]> = {
  2: LEVEL_2_REVIEW,
  3: LEVEL_3_REVIEW,
  4: LEVEL_4_REVIEW,
  5: LEVEL_5_REVIEW,
};
