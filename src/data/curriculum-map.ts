// Single source of truth for how /learn groups lessons into thematic clusters.
// Orders reference the `order` frontmatter of src/content/lessons/level-N/*.
// The /learn page throws at build time if a lesson has no cluster (drift guard).
export interface LessonCluster {
  title: string;
  lessons: number[];        // contiguous `order` values
  checkpoint?: boolean;     // capstone surah analysis
  essential?: boolean;      // L1 reading essentials
  note?: string;            // one-line cluster description
}
export interface LevelMap { level: 1 | 2 | 3 | 4 | 5; clusters: LessonCluster[] }

export const CURRICULUM_MAP: LevelMap[] = [
  { level: 1, clusters: [
    { title: 'Reading essentials', lessons: [1, 2, 3], essential: true,
      note: 'Skip these only if you already read Arabic script.' },
    { title: 'Word basics', lessons: [4, 5, 6, 7, 8] },
    { title: 'Sentences & cases', lessons: [9, 10] },
    { title: 'Checkpoint', lessons: [11], checkpoint: true },
  ]},
  { level: 2, clusters: [
    { title: 'Sentence types', lessons: [1, 2, 3] },
    { title: 'The three cases', lessons: [4, 5, 6, 7] },
    { title: 'Possession & description', lessons: [8, 9] },
    { title: 'Sentence transformers', lessons: [10, 11] },
    { title: 'Checkpoint', lessons: [12], checkpoint: true },
  ]},
  { level: 3, clusters: [
    { title: 'Roots & Form I', lessons: [1, 2] },
    { title: 'Conjugation & moods', lessons: [3, 4, 5, 6, 7] },
    { title: 'Pronouns', lessons: [8, 9, 10, 11] },
    { title: 'Forms II–X', lessons: [12, 13, 14, 15, 16, 17, 18] },
    { title: 'Derived nouns', lessons: [19, 20, 21] },
    { title: 'Checkpoint', lessons: [22], checkpoint: true },
  ]},
  { level: 4, clusters: [
    { title: 'States & specification', lessons: [1, 2] },
    { title: 'Conditionals', lessons: [3, 4] },
    { title: 'Exception & emphasis', lessons: [5, 6] },
    { title: 'The mafʿul family', lessons: [7, 8, 9] },
    { title: 'Negation', lessons: [10] },
    { title: 'Weak verbs', lessons: [11, 12, 13, 14, 15] },
    { title: 'Numbers', lessons: [16] },
    { title: 'Rhetoric', lessons: [17, 18] },
    { title: 'Checkpoint', lessons: [19], checkpoint: true },
  ]},
  { level: 5, clusters: [
    { title: 'The method', lessons: [1] },
    { title: 'Applied analyses', lessons: [2, 3, 4, 5] },
    { title: 'Quranic patterns', lessons: [6, 7, 8] },
    { title: 'Narrative & dialogue', lessons: [9, 10, 11] },
    { title: 'Rhetoric in action', lessons: [12, 13, 14] },
    { title: 'Synthesis', lessons: [15, 16] },
  ]},
];

export function clusterForLesson(level: number, order: number): LessonCluster {
  const found = CURRICULUM_MAP.find(l => l.level === level)
    ?.clusters.find(c => c.lessons.includes(order));
  if (!found) throw new Error(`curriculum-map: no cluster for level ${level} lesson ${order}`);
  return found;
}
