// Words on /learn that are not lesson data: the five level names, what each level assumes, and the page's own copy.
// Lesson titles, descriptions and grouping come from the lessons collection and curriculum-map.ts.
// The "needs" lines say what a learner must already be able to do, in plain English.

export interface LevelCopy {
  title: string;
  titleAr: string;
  /** One line on what the level teaches. */
  blurb: string;
  /** What the learner should already be able to do. */
  needs: string;
}

export const LEVEL_COPY: Record<1 | 2 | 3 | 4 | 5, LevelCopy> = {
  1: { title: 'Foundation', titleAr: 'الأساسيات', blurb: 'Letters, vowels, word types and the first sentences.', needs: 'Starts from zero. No Arabic needed.' },
  2: { title: 'Core Grammar', titleAr: 'القواعد الأساسية', blurb: 'The three cases, possession and how a sentence is built.', needs: 'Needs Level 1: reading the script and the three word types.' },
  3: { title: 'Intermediate', titleAr: 'القواعد المتوسطة', blurb: 'Verbs, roots, all ten forms and the pronouns.', needs: 'Needs Level 2: the three cases and both sentence types.' },
  4: { title: 'Advanced', titleAr: 'القواعد المتقدمة', blurb: 'Conditionals, exceptions, weak verbs and rhetoric.', needs: 'Needs Level 3: verb forms and conjugation.' },
  5: { title: 'Applied Study', titleAr: 'التطبيق القرآني', blurb: 'Read whole passages with everything you have learned.', needs: 'Needs Level 4: all the grammar before it.' },
};

export const LEARN_PAGE = {
  title: 'Grammar Lessons | Quranic Grammar',
  h1: 'Every lesson, in the order it is taught.',
  /** The reference tools linked once near the top (agreed in the 2026-10-28 grilling). */
  tools: [
    { href: '/learn/verb-forms/', label: 'Verb forms' },
    { href: '/learn/irab-cases/', label: 'I‘rab cases' },
  ],
};
