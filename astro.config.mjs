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

export default defineConfig({
  site: 'https://www.quranic-grammar.com',
  integrations: [
    mdx({ rehypePlugins: [rehypeArabicWrap, rehypeTableScroll] }),
    sitemap({
      // The retired tool pages only forward to /resources/find/. The ebook pages are print sources for the
      // PDFs (marked noindex), so they stay out of the sitemap. Pages carry no lastmod: stamping every URL with
      // the build time says nothing true, and search engines learn to ignore it.
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
