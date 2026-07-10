/*
 * One-shot assembler: generates src/pages/index.astro from the verified
 * mockup (landing-final.html), so the Arabic text and the animation engine
 * are carried over byte-exact instead of retyped.
 *
 * Transforms applied on the way:
 *  - hardcoded SURAHS array  -> JSON injected from the content collection
 *  - slug() guesser          -> href map from real collection ids
 *  - GSAP CDN tags           -> npm imports (works offline in the Capacitor app)
 *  - adds GA4 + Ahrefs, canonical/OG meta, favicon, RSS, skip link,
 *    and initCapacitor() from the old landing page
 */
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(DIR, '../..');
const src = fs.readFileSync(path.join(DIR, 'landing-final.html'), 'utf8');

function must(m, what) {
  if (!m) { console.error('EXTRACTION FAILED: ' + what); process.exit(1); }
  return m;
}

/* ── extract the three parts of the mockup ── */
const css = must(src.match(/<style>\n([\s\S]*?)\n<\/style>\n<\/head>/), 'css')[1];
const bodyInner = must(src.match(/<body>\n([\s\S]*?)\n<script src="https:\/\/cdn\.jsdelivr/), 'body')[1];
const engineRaw = must(src.match(/<script>\n(\/\* ═[\s\S]*?)\n<\/script>\n<\/body>/), 'engine')[1];

/* ── engine transforms ── */
let engine = engineRaw;

// 1. surah data comes from the content collection at build time
const surahArrayRe = /  \/\* \[number, name, arabicName, verseCount\] — harvested byte-exact from content frontmatter \*\/\n  const SURAHS = \[[\s\S]*?\n  \];/;
must(engine.match(surahArrayRe), 'SURAHS array');
engine = engine.replace(
  surahArrayRe,
  "  /* [number, name, arabicName, verseCount, href] — injected from the content collection */\n" +
  "  const SURAHS = JSON.parse(document.getElementById('surah-data').textContent);"
);

// 2. hrefs come from real collection ids, not name-mangling guesses
const slugRe = /  const slug = \(n, name\) => '\/surahs\/' \+ String\(n\)\.padStart\(3, '0'\) \+ '-' \+\n    name\.toLowerCase\(\)\.replace\(\/\[ʿ''\]\/g, ''\)\.replace\(\/\\s\+\/g, '-'\) \+ '\/';/;
must(engine.match(slugRe), 'slug fn');
engine = engine.replace(
  slugRe,
  "  const HREFS = new Map(SURAHS.map(s => [s[0], s[4]]));\n" +
  "  const slug = n => HREFS.get(n) || '/surahs/';"
);

/* ── body transforms: skip link + main landmark ── */
let body = bodyInner
  .replace('<main>', '<main id="main-content">')
  .replace(
    '<div id="veil" aria-hidden="true">',
    '<a href="#main-content" class="skip-link">Skip to main content</a>\n\n<div id="veil" aria-hidden="true">'
  );
if (!body.includes('id="main-content"') || !body.includes('skip-link')) {
  console.error('body transform failed'); process.exit(1);
}

/* Astro treats {…} in templates as expressions — the markup must not contain any */
const braces = body.match(/[{}]/g);
if (braces) { console.error('body contains ' + braces.length + ' brace(s) — would break Astro template'); process.exit(1); }

/* ── skip-link styles (site global.css is intentionally not loaded here) ── */
const skipCss = `
/* accessibility: skip link (visually hidden until focused) */
.skip-link{position:fixed;left:16px;top:-60px;z-index:300;background:var(--gold);color:var(--btn-ink);font-size:14px;font-weight:500;padding:10px 18px;border-radius:8px;transition:top .2s}
.skip-link:focus{top:14px}`;

/* ── assemble ── */
const out = `---
import { getCollection } from 'astro:content';
// [number, name, arabicName, verseCount, href] for the tree of Juz ʿAmma —
// byte-exact Arabic and real routes, straight from the content collection.
const surahData = (await getCollection('surahs'))
  .sort((a, b) => a.data.surahNumber - b.data.surahNumber)
  .map(s => [s.data.surahNumber, s.data.name, s.data.nameArabic, s.data.verseCount, \`/surahs/\${s.id}/\`]);

const title = 'Quranic Grammar · Understand every word you recite';
const description =
  'Free, complete lessons in Quranic Arabic grammar. Five levels, 81 lessons, 38 surah analyses. Learn the cases, the verb forms, and the sentence patterns of the Quran.';
const canonicalURL = new URL('/', Astro.site);
const ogImageURL = new URL('/images/og-default.jpg', Astro.site);
---

<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <!-- Google Analytics (GA4) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-1MSBYYQT5Z" is:inline></script>
  <script is:inline>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-1MSBYYQT5Z');
  </script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="description" content={description} />
  <meta name="theme-color" content="#05070e" />
  <title>{title}</title>
  <link rel="canonical" href={canonicalURL.href} />
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalURL.href} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImageURL.href} />
  <meta property="og:site_name" content="Quranic Grammar" />
  <meta property="og:locale" content="en_US" />
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImageURL.href} />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="alternate" type="application/rss+xml" title="Quranic Grammar RSS" href="/rss.xml" />
  <!-- Fonts: loaded eagerly — the hero formation samples Amiri Quran on the canvas -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:ital,wght@0,400;0,700;1,400&family=Marcellus&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <!-- Keep the stored theme in sync for the rest of the site (this page is always night) -->
  <script is:inline>
    (function() {
      const theme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  <script src="https://analytics.ahrefs.com/analytics.js" data-key="sW/uZfxMauSpqoKnSL6i6g" async is:inline></script>
  <style is:global>
${css}
${skipCss}
  </style>
</head>
<body>

${body}

<script type="application/json" id="surah-data" is:inline set:html={JSON.stringify(surahData)}></script>
<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { initCapacitor } from '../scripts/capacitor-init';

  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
  initCapacitor();

${engine}
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'src/pages/index.astro'), out);

/* parity check: every Arabic codepoint sequence in the mockup body must appear in the output */
const arChunks = [...new Set((bodyInner.match(/[؀-ۿ][؀-ۿ\sـ]*[؀-ۿ]/g) || []))];
const missing = arChunks.filter(c => !out.includes(c));
if (missing.length) { console.error('ARABIC PARITY FAILED:', missing); process.exit(1); }

console.log('written src/pages/index.astro');
console.log('  css: ' + css.length + ' chars, body: ' + body.length + ', engine: ' + engine.length);
console.log('  arabic chunks verified: ' + arChunks.length);
