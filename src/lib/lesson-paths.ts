/**
 * Static paths for the lesson pages, shared by the two lesson routes:
 *  - src/pages/learn/[...slug].astro        classic lessons (long page)
 *  - src/pages/learn/[level]/[lesson].astro stepped lessons (frontmatter `template: steps`)
 * They are separate routes so the classic layout's global styles never load on a stepped page.
 */
import { getCollection } from 'astro:content';

export async function lessonPaths() {
  const lessons = await getCollection('lessons');

  // Sort lessons by level and order for prev/next computation
  const sortedLessons = lessons.sort((a, b) => {
    if (a.data.level !== b.data.level) {
      return a.data.level - b.data.level;
    }
    return a.data.order - b.data.order;
  });

  // Group lessons by level to find last lesson of each level
  const lessonsByLevel: Record<number, typeof sortedLessons> = {};
  sortedLessons.forEach((l) => {
    if (!lessonsByLevel[l.data.level]) lessonsByLevel[l.data.level] = [];
    lessonsByLevel[l.data.level].push(l);
  });

  return sortedLessons.map((lesson, index) => {
    // Compute prev/next from collection order
    let prevLesson = index > 0 ? `/learn/${sortedLessons[index - 1].id}/` : undefined;
    let nextLesson = index < sortedLessons.length - 1 ? `/learn/${sortedLessons[index + 1].id}/` : undefined;

    const levelLessons = lessonsByLevel[lesson.data.level];

    // If this is the first lesson of its level (and not level 1), prev goes to previous level's quiz
    if (levelLessons && lesson === levelLessons[0] && lesson.data.level > 1) {
      prevLesson = `/learn/level-${lesson.data.level - 1}/quiz/`;
    }

    // If this is the last lesson of its level, next goes to the level quiz
    if (levelLessons && lesson === levelLessons[levelLessons.length - 1]) {
      nextLesson = `/learn/level-${lesson.data.level}/quiz/`;
    }

    return {
      lesson,
      // Use computed prev/next, fallback to frontmatter
      computedPrevLesson: prevLesson || lesson.data.prevLesson,
      computedNextLesson: nextLesson || lesson.data.nextLesson,
      positionInLevel: levelLessons ? { index: levelLessons.indexOf(lesson) + 1, total: levelLessons.length } : undefined,
    };
  });
}
