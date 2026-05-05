import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { getEntryDates } from '../lib/getEntryDates';

const SITE_TITLE = 'Quranic Grammar';
const SITE_DESCRIPTION =
  'Free structured lessons in Quranic Arabic grammar — from the alphabet through I\'rab, verb forms I–X, and word-by-word surah breakdowns.';

const levelNames: Record<number, string> = {
  1: 'Foundation',
  2: 'Core Grammar',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Applied Study',
};

export async function GET(context: APIContext) {
  const lessons = await getCollection('lessons', ({ data }) => !data.draft);
  const surahs = await getCollection('surahs');
  const resources = await getCollection('resources');

  const lessonItems = lessons.map((lesson) => {
    const dates = getEntryDates(`src/content/lessons/${lesson.id}.mdx`, lesson.data);
    return {
      title: `${lesson.data.title} (Level ${lesson.data.level}: ${levelNames[lesson.data.level]})`,
      link: `/learn/${lesson.id}/`,
      description:
        lesson.data.description ??
        `${levelNames[lesson.data.level]} lesson on ${lesson.data.title}.`,
      pubDate: dates.datePublished,
      categories: ['Lesson', `Level ${lesson.data.level}`, levelNames[lesson.data.level]],
    };
  });

  const surahItems = surahs.map((surah) => {
    const dates = getEntryDates(`src/content/surahs/${surah.id}.mdx`, {});
    return {
      title: `Surah ${surah.data.name} (${surah.data.surahNumber}) — Word-by-Word Breakdown`,
      link: `/surahs/${surah.id}/`,
      description: `Grammatical breakdown of Surah ${surah.data.name} — ${surah.data.verseCount} verses (${surah.data.difficulty}).`,
      pubDate: dates.datePublished,
      categories: ['Surah', surah.data.difficulty],
    };
  });

  const resourceItems = resources.map((resource) => {
    const dates = getEntryDates(`src/content/resources/${resource.id}.mdx`, {});
    return {
      title: resource.data.title,
      link: `/resources/${resource.id}/`,
      description: resource.data.description ?? resource.data.title,
      pubDate: dates.datePublished,
      categories: ['Resource'],
    };
  });

  const items = [...lessonItems, ...surahItems, ...resourceItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime(),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items,
    customData: '<language>en-us</language>',
    stylesheet: false,
  });
}
