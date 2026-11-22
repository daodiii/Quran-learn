import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import rehypeArabicWrap from './src/plugins/rehype-arabic-wrap.mjs';
import rehypeTableScroll from './src/lib/rehype-table-scroll.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lessons that moved keep their old address: each old URL becomes a redirect page.
const lessonMoves = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'src/data/lesson-moves.json'), 'utf8')).moves;
const lessonRedirects = Object.fromEntries(
  Object.entries(lessonMoves).map(([from, to]) => [`/learn/${from}/`, `/learn/${to}/`]),
);

// Real last-modified dates: the last commit that touched each lesson, surah and hadith file, from the
// manifest scripts/build-entry-dates.mjs writes (it also works on Vercel's shallow clone).
// Pages without an entry there (home, hubs, resources, legal pages) get no lastmod rather than a made-up one.
const entryDates = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'src/data/entry-dates.json'), 'utf8'));
function sitemapLastmod(url) {
  const m = new URL(url).pathname.match(/^\/(learn|surahs|hadith)\/(.+?)\/$/);
  if (!m) return undefined;
  const dir = m[1] === 'learn' ? 'lessons' : m[1];
  const modified = entryDates[`src/content/${dir}/${m[2]}.mdx`]?.modified;
  return modified ? new Date(modified).toISOString() : undefined;
}

export default defineConfig({
  site: 'https://www.quranic-grammar.com',
  integrations: [
    mdx({ rehypePlugins: [rehypeArabicWrap, rehypeTableScroll] }),
    sitemap({
      // The retired tool pages only forward to /resources/find/. The ebook pages are print sources for the
      // PDFs (marked noindex), so they stay out of the sitemap. lastmod comes from sitemapLastmod above.
      serialize(item) {
        const lastmod = sitemapLastmod(item.url);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
      filter: (page) => !/\/resources\/(word-lookup|verb-forms)\/$/.test(page) && !/\/ebooks\//.test(page),
    }),
  ],
  trailingSlash: 'always',
  redirects: lessonRedirects,
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
      },
    },
  },
});
