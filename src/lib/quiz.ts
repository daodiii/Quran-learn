/**
 * Pure helpers for the level quizzes and cumulative reviews (QuizLayout, src/scripts/quiz.ts).
 * The questions themselves are not touched here: this only scores them and finds the lessons to open again.
 */

export interface RawQuestion {
  id: number;
  question: string;
  options: string[];
  /** Index of the right option, from 0. */
  correctAnswer: number;
  explanation?: string;
  /** Review questions name the lesson the Arabic came from, e.g. "level-1/06-definite-article". */
  source?: string;
}

export interface LessonLink {
  href: string;
  /** For example "L5.13 Rhetorical Questions in the Quran". */
  label: string;
}

export interface QuizQuestion extends RawQuestion {
  /** Lessons that teach this question: its source, then every "L5.13" it names in the explanation. */
  lessons: LessonLink[];
}

export interface Revisit {
  /** null when no lesson is named for these questions. */
  lesson: LessonLink | null;
  /** Question numbers from 1. */
  questions: number[];
}

/** Every distinct lesson reference such as "L5.13" in a text, in order. */
export function lessonRefs(text: string | undefined): string[] {
  return [...new Set((text ?? '').match(/\bL[1-5]\.\d{2}\b/g) ?? [])];
}

export interface LessonInfo {
  id: string;
  level: number;
  order: number;
  title: string;
}

/** Looks lessons up by "L5.13" and by id, and says which lesson each question points to. */
export function makeLessonLookup(lessons: LessonInfo[]) {
  const byRef = new Map<string, LessonInfo>();
  const byId = new Map<string, LessonInfo>();
  for (const l of lessons) {
    byRef.set(`L${l.level}.${String(l.order).padStart(2, '0')}`, l);
    byId.set(l.id, l);
  }
  const link = (ref: string, l: LessonInfo): LessonLink => ({ href: `/learn/${l.id}/`, label: `${ref} ${l.title}` });
  const refOf = (l: LessonInfo) => `L${l.level}.${String(l.order).padStart(2, '0')}`;

  return function attach(questions: RawQuestion[]): QuizQuestion[] {
    return questions.map((q) => {
      const found: LessonLink[] = [];
      const seen = new Set<string>();
      const add = (l: LessonInfo | undefined, ref: string) => {
        if (!l || seen.has(l.id)) return;
        seen.add(l.id);
        found.push(link(ref, l));
      };
      if (q.source) {
        const s = byId.get(q.source);
        if (!s) throw new Error(`quiz question ${q.id}: source "${q.source}" is not a lesson`);
        add(s, refOf(s));
      }
      for (const ref of lessonRefs(q.explanation)) {
        const l = byRef.get(ref);
        if (!l) throw new Error(`quiz question ${q.id}: "${ref}" in the explanation is not a lesson`);
        add(l, ref);
      }
      return { ...q, lessons: found };
    });
  };
}

export function scoreOf(picks: (number | null)[], questions: Pick<RawQuestion, 'correctAnswer'>[]) {
  const total = questions.length;
  const right = questions.reduce((n, q, i) => n + (picks[i] === q.correctAnswer ? 1 : 0), 0);
  const percent = total === 0 ? 0 : Math.round((right / total) * 100);
  return { right, total, percent };
}

export function hasPassed(percent: number, passingScore: number): boolean {
  return percent >= passingScore;
}

/** The lessons to open again: one entry per lesson, with the missed questions that point to it. */
export function revisitList(picks: (number | null)[], questions: QuizQuestion[]): Revisit[] {
  const byHref = new Map<string, Revisit>();
  const none: Revisit = { lesson: null, questions: [] };
  questions.forEach((q, i) => {
    if (picks[i] === q.correctAnswer) return;
    if (q.lessons.length === 0) {
      none.questions.push(i + 1);
      return;
    }
    for (const lesson of q.lessons) {
      const entry = byHref.get(lesson.href) ?? { lesson, questions: [] };
      entry.questions.push(i + 1);
      byHref.set(lesson.href, entry);
    }
  });
  const list = [...byHref.values()];
  if (none.questions.length) list.push(none);
  return list;
}
