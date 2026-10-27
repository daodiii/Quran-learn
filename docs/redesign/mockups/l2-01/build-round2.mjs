// Round 2: three bolder looks with colour-coded callouts (tip, good to know, watch out, remember).
//   node docs/redesign/mockups/l2-01/build-round2.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lesson, checks } from './content.mjs';
import { BASE, SCRIPT, sentence, legend, checkBlock } from './build.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const AR = (s) => `<span class="ar-inline" lang="ar" dir="rtl">${s}</span>`;

const ICONS = {
  tip: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  know: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
  warn: '<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18v.01"/>',
  rem: '<path d="M6 3h12v18l-6-4-6 4V3z"/>',
};
const TITLES = { tip: 'Tip', know: 'Good to know', warn: 'Watch out', rem: 'Remember' };
const callout = (kind, html) =>
  `<aside class="callout ${kind}"><span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[kind]}</svg></span><div><b>${TITLES[kind]}</b><p>${html}</p></div></aside>`;

const tiles = `<div class="tiles" aria-label="هُوَ, then nothing, then ٱلْأَوَّلُ: He is the First">
  <div class="tile noun"><span class="ar">هُوَ</span><span class="en">he</span></div>
  <div class="tile ghost"><span class="g">is</span><small>English only</small></div>
  <div class="tile noun"><span class="ar">ٱلْأَوَّلُ</span><span class="en">the First</span></div></div>`;

const steps = [
  `<h1 class="lesson-title">${lesson.title}</h1>
   <p class="kicker-term">${lesson.term} ${AR(lesson.termAr)}</p>
   ~~
   <div class="goal"><h2>By the end you can</h2><p>Find the two parts of a nominal sentence, and say why both of them end in <b>-u</b>.</p></div>
   <dl class="facts"><div><dt>Time</dt><dd>${lesson.minutes} minutes, ${lesson.steps.length} short steps</dd></div><div><dt>Before you start</dt><dd>Noun, verb and little word (L1.04). The -u ending (L1.10).</dd></div></dl>
   <div class="words-box"><h2>Four words you will meet</h2><ul>
     <li><b>Nominal sentence</b> ${AR('جُمْلَة اِسْمِيَّة')} A sentence that starts with a noun.</li>
     <li><b>Mubtadaʾ</b> ${AR('مُبْتَدَأ')} What the sentence is about.</li>
     <li><b>Khabar</b> ${AR('خَبَر')} What the sentence says about it.</li>
     <li><b>Nominative</b> ${AR('رَفْع')} The -u ending.</li></ul></div>`,
  `<h2 class="step-title">Look at this sentence</h2>
   ~~
   <p>It is part of a verse about Allah. Read it from right to left.</p>
   ${sentence('awwal', { roles: false, size: 'big' })}
   ${legend}
   <p class="prompt"><b>Count the words.</b> The Arabic has two. The English has three. Which English word is extra?</p>`,
  `<h2 class="step-title">Arabic leaves out “is”</h2>
   ~~
   <p>English needs a small word like <i>is</i>, <i>am</i> or <i>are</i>: “The sky <u>is</u> blue.” Arabic does not. It puts two words side by side.</p>
   ${tiles}
   <p>A sentence like this is called a <b>nominal sentence</b>, ${AR('جُمْلَة اِسْمِيَّة')}. <i>Ism</i> means noun, so it is a sentence that starts with a noun. No verb is needed.</p>
   ${callout('rem', 'You add “is” when you say it in English. There is no Arabic word for it.')}`,
  `<h2 class="step-title">Every nominal sentence has two parts</h2>
   ~~
   <div class="two"><div class="part m"><h3>${AR('مُبْتَدَأ')} Mubtadaʾ</h3><p>The starting point. What the sentence is about.</p></div>
   <div class="part k"><h3>${AR('خَبَر')} Khabar</h3><p>The news. What the sentence says about it.</p></div></div>
   ${sentence('awwal')}
   ${sentence('kitab')}
   <p>In the second sentence, <i>that</i> is the topic and <i>the Book</i> is the news about it.</p>
   ${callout('know', 'Many grammar books say <b>subject</b> and <b>predicate</b>. They mean roughly the same as mubtadaʾ and khabar.')}`,
  `<h2 class="step-title">The rule: both end in -u</h2>
   ~~
   <div class="rule"><p class="rule-line">The mubtadaʾ and the khabar both take the <b>nominative</b> case, ${AR('رَفْع')}.</p>
   <p class="endings"><span><b class="ar" lang="ar">بُ</b> -u</span><span class="or">or</span><span><b class="ar" lang="ar">بٌ</b> -un</span></p></div>
   ${sentence('ghafur')}
   <p>${AR('ٱللَّهُ')} ends in <b>-u</b>. ${AR('غَفُورٌ')} and ${AR('رَّحِيمٌ')} end in <b>-un</b>. The khabar can be more than one word. Both words say something about Allah.</p>
   ${callout('know', 'Words like <i>huwa</i> (he) and <i>dhalika</i> (that) never show an ending. They are still the mubtadaʾ.')}
   ${callout('warn', 'The mubtadaʾ is not the doer of a verb (the <i>fāʿil</i>). Both end in -u, but they belong to different sentence types. You will meet the fāʿil in L2.03.')}`,
  `<h2 class="step-title">A longer one</h2>
   ~~
   <p>The mubtadaʾ is a single word here, and the khabar is a group of words that belong together.</p>
   ${sentence('nur')}
   <p>Look for the -u ending to find where each part starts. ${AR('ٱللَّهُ')} is the topic. ${AR('نُورُ')} begins the news, and the words after it finish the idea.</p>
   ${callout('tip', 'To find the end of the khabar, say the whole phrase out loud. Stop when the idea is finished.')}`,
  `<h2 class="step-title">Sometimes the news comes first</h2>
   ~~
   <p>The khabar can be a little phrase such as “for you”. Then it often comes <b>before</b> the mubtadaʾ.</p>
   ${sentence('dinukum')}
   <p>Word for word: “For you <u>is</u> your religion.” The mubtadaʾ is still the word that ends in <b>-u</b>.</p>
   ${callout('tip', 'A phrase that starts with a little word like <i>li-</i> (for) is not the topic. The topic is the next word that ends in -u.')}`,
  `<h2 class="step-title">Try it</h2>
   ~~
   <p>Three quick questions. Pick an answer to see if you are right.</p>
   ${checks.map(checkBlock).join('')}`,
  `<h2 class="step-title">You have finished the lesson</h2>
   ~~
   <ul class="keys"><li>A nominal sentence starts with a noun and needs no verb.</li><li>It has two parts: the <b>mubtadaʾ</b> (topic) and the <b>khabar</b> (news).</li><li>Both end in <b>-u</b> or <b>-un</b>. Add “is” in English only.</li></ul>
   <div class="cta"><a class="btn primary" href="#check">Take the 5-question check</a><p class="muted">Pass it to open L2.02. <a href="#skip">Skip anyway</a></p></div>
   <div class="sources"><h2>Where this comes from</h2><ul>
     <li>Quran text: <a href="https://tanzil.net">Tanzil</a></li>
     <li>Word-by-word analysis: <a href="https://corpus.quran.com">Quranic Arabic Corpus</a></li>
     <li>Grammar: Quranic Arabic Corpus, grammar documentation; <i>al-Ajurrumiyyah</i>, chapter on al-mubtadaʾ wa-l-khabar</li></ul>
     <p class="muted">Source lines are placeholders in this mockup. Exact pages are confirmed before publishing.</p>
     <p><a href="#report">Found a mistake? Tell us.</a></p></div>`,
];

const ROUND2 = `
.callout{display:flex;gap:.85rem;align-items:flex-start;margin:1.3em 0;padding:1rem 1.1rem;border-radius:var(--r);background:color-mix(in oklab,var(--ck) 14%,var(--surface));border:2px solid color-mix(in oklab,var(--ck) 75%,var(--surface));max-width:62ch}
.callout .ico{flex:none;display:grid;place-items:center;width:2.4rem;height:2.4rem;border-radius:50%;background:var(--ck);color:var(--ci)}
.callout svg{width:1.35rem;height:1.35rem;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.callout b{display:block;color:color-mix(in oklab,var(--ck) 45%,black);margin-bottom:.1em}
.callout p{margin:0;max-width:none}
.callout.tip{--ck:var(--c-tip);--ci:var(--i-tip)}.callout.know{--ck:var(--c-know);--ci:var(--i-know)}.callout.warn{--ck:var(--c-warn);--ci:var(--i-warn)}.callout.rem{--ck:var(--c-rem);--ci:var(--i-rem)}
.tiles{display:flex;flex-wrap:wrap;gap:.8rem;justify-content:center;align-items:stretch;direction:rtl;margin:1.4em 0}
.tile{direction:ltr;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.1rem;min-width:7rem;padding:1rem 1.1rem;border-radius:var(--r);background:color-mix(in oklab,var(--t) 13%,var(--surface));border:2px solid color-mix(in oklab,var(--t) 50%,var(--surface))}
.tile .ar{font-size:2.6rem;line-height:1.7;direction:rtl;unicode-bidi:isolate}.tile .en{font-weight:500}
.tile.ghost{background:transparent;border:2.5px dashed var(--accent-2);color:var(--accent-2-text);min-width:5.5rem}
.tile.ghost .g{font-size:2rem;font-weight:500;line-height:1.5}.tile.ghost small{font-size:.8rem}
.step-head{position:relative}
.step-body>*:first-child{margin-top:0}
.step{padding:0}
p b,li b{white-space:nowrap}
@media (max-width:560px){.tile{min-width:5.2rem;padding:.7rem .6rem}.tile .ar{font-size:2.1rem}.tiles{gap:.5rem}
.sentence{padding:1em .4rem .8em}.sent{gap:1rem .45rem}.chips{gap:.3rem}.w{min-width:4rem;padding:.4rem .3rem}.w .ar{font-size:1.7rem}.sentence.big .w .ar{font-size:2.2rem}.w .en{font-size:.9rem}.w .say{font-size:.8rem}}
`;

const star = 'polygon(50% 0%,63.8% 16.7%,85.4% 14.6%,83.3% 36.2%,100% 50%,83.3% 63.8%,85.4% 85.4%,63.8% 83.3%,50% 100%,36.2% 83.3%,14.6% 85.4%,16.7% 63.8%,0% 50%,16.7% 36.2%,14.6% 14.6%,36.2% 16.7%)';
const tile = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><g fill="none" stroke="white" stroke-opacity=".28" stroke-width="1.6"><rect x="14" y="14" width="36" height="36"/><rect x="14" y="14" width="36" height="36" transform="rotate(45 32 32)"/><circle cx="32" cy="32" r="7"/></g></svg>`);

const THEMES = {
  d: {
    file: 'd-mosaic.html',
    name: 'D · Mosaic',
    css: `
:root{--bg:oklch(97.6% .016 88);--surface:oklch(99.5% .005 88);--text:oklch(23% .04 275);--muted:oklch(42% .03 275);--line:oklch(88% .03 88);--accent:oklch(46% .12 195);--on-accent:oklch(99% .01 195);--accent-2:oklch(58% .2 8);--accent-2-text:oklch(45% .18 8);--link:oklch(40% .12 195);--focus:oklch(48% .2 275);--note-bg:oklch(95% .03 88);--c-noun:oklch(40% .16 275);--c-verb:oklch(48% .2 20);--c-little:oklch(40% .12 160);--good:oklch(46% .13 160);--bad:oklch(52% .2 15);--r:20px;--r-btn:14px;--body:'Geist',system-ui,sans-serif;--head:'Amiri',Georgia,serif;--head-w:700;--fs:1.0625rem;--step-pad:0;
--c-tip:oklch(84% .16 88);--i-tip:oklch(25% .05 80);--c-know:oklch(66% .12 205);--i-know:oklch(18% .04 205);--c-warn:oklch(62% .21 12);--i-warn:oklch(99% .01 12);--c-rem:oklch(52% .17 285);--i-rem:oklch(99% .01 285)}
.top{background:linear-gradient(oklch(46% .12 195 / .78),oklch(46% .12 195 / .78)),oklch(46% .12 195) url("data:image/svg+xml,${tile}");color:var(--on-accent)}
.top-in{max-width:46rem;margin:0 auto;padding:.9rem 1rem .5rem;display:flex;justify-content:space-between;align-items:center;gap:1rem}
.logo{font-family:'Amiri',Georgia,serif;font-size:1.45rem;font-weight:700}.where{font-size:.9rem;opacity:.95}
.bar{max-width:46rem;margin:0 auto;padding:0 1rem .9rem;display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:.4rem}
.bar button{height:12px;border:0;padding:0;border-radius:3px;background:oklch(100% 0 0 / .3);cursor:pointer;position:relative}
.bar button::before{content:'';position:absolute;inset:-14px 0}
.bar button.done{background:var(--c-tip)}.bar button.on{background:oklch(99% .01 90)}
main{max-width:46rem;margin:0 auto;padding:1.3rem 1rem 8rem}
.step-head{padding:1.4rem 1.4rem 1.2rem;border-radius:var(--r) var(--r) 0 0;background:var(--hc) url("data:image/svg+xml,${tile}");color:var(--hi);overflow:hidden}
.step-body{padding:1.5rem 1.4rem 2rem;background:var(--surface);border:2.5px solid var(--hc);border-top:0;border-radius:0 0 var(--r) var(--r)}
.step[data-step="0"]{--hc:oklch(46% .12 195);--hi:oklch(99% .01 195)}.step[data-step="1"]{--hc:oklch(50% .17 285);--hi:oklch(99% .01 285)}.step[data-step="2"]{--hc:oklch(56% .21 12);--hi:oklch(99% .01 12)}.step[data-step="3"]{--hc:oklch(46% .13 160);--hi:oklch(99% .01 160)}.step[data-step="4"]{--hc:oklch(84% .16 88);--hi:oklch(22% .05 80)}.step[data-step="5"]{--hc:oklch(46% .12 195);--hi:oklch(99% .01 195)}.step[data-step="6"]{--hc:oklch(50% .17 285);--hi:oklch(99% .01 285)}.step[data-step="7"]{--hc:oklch(56% .21 12);--hi:oklch(99% .01 12)}.step[data-step="8"]{--hc:oklch(46% .13 160);--hi:oklch(99% .01 160)}
.step[data-step="4"] .step-head{background-color:var(--hc)}
.step-count{display:grid;place-items:center;width:3.6rem;height:3.6rem;margin:0 0 .6rem;font-size:0;background:var(--hi);color:var(--hc);clip-path:${star};max-width:none}
.step-count::before{content:attr(data-n);font-size:1.5rem;font-weight:500;line-height:1;font-family:'Geist',sans-serif}
.step-title,.lesson-title{color:var(--hi);margin:0;font-size:2.3rem;line-height:1.15}.lesson-title{font-size:2.9rem}
.kicker-term{margin:.4rem 0 0;color:var(--hi);opacity:.95;font-size:1.1rem}
.sentence{border:2px solid var(--line);box-shadow:0 3px 0 var(--line)}
.part.m{border:2.5px solid var(--accent)}
.dock{position:fixed;left:0;right:0;bottom:0;background:var(--surface);border-top:3px solid var(--accent);z-index:6}
.dock .pager{max-width:46rem;margin:0 auto;padding:.7rem 1rem}
.pager .count{color:var(--muted);font-size:.95rem}
.foot{padding-bottom:6rem}
@media (max-width:560px){.step-title{font-size:1.8rem}.lesson-title{font-size:2.3rem}.step-head{padding:1.1rem 1rem}.step-body{padding:1.2rem 1rem 1.6rem}}
`,
  },
  e: {
    file: 'e-studio.html',
    name: 'E · Studio',
    css: `
:root{--bg:oklch(98.6% .008 95);--surface:oklch(99.7% .003 95);--text:oklch(21% .04 270);--muted:oklch(40% .03 270);--line:oklch(88% .02 95);--accent:oklch(48% .22 275);--on-accent:oklch(99% .01 275);--accent-2:oklch(58% .22 30);--accent-2-text:oklch(46% .19 30);--link:oklch(42% .2 275);--focus:oklch(48% .22 275);--note-bg:oklch(95% .03 95);--c-noun:oklch(42% .2 262);--c-verb:oklch(50% .22 25);--c-little:oklch(42% .14 160);--good:oklch(46% .14 160);--bad:oklch(52% .21 25);--r:22px;--r-btn:999px;--body:'Geist',system-ui,sans-serif;--head:'Geist',system-ui,sans-serif;--head-w:500;--fs:1.0625rem;--step-pad:0;
--c-tip:oklch(86% .17 95);--i-tip:oklch(22% .05 90);--c-know:oklch(72% .13 235);--i-know:oklch(18% .04 235);--c-warn:oklch(64% .22 30);--i-warn:oklch(99% .01 30);--c-rem:oklch(56% .22 310);--i-rem:oklch(99% .01 310)}
.top{background:var(--bg);border-bottom:3px solid var(--text)}
.top-in{max-width:60rem;margin:0 auto;padding:.8rem 1rem;display:flex;justify-content:space-between;align-items:center;gap:1rem}
.logo{font-weight:500;font-size:1.15rem;letter-spacing:-.02em}.where{font-size:.9rem;color:var(--muted)}
.bar{max-width:60rem;margin:0 auto;padding:0 1rem .8rem;display:flex;gap:.4rem}
.bar button{flex:1;height:14px;border:2px solid var(--text);border-radius:99px;background:var(--surface);padding:0;cursor:pointer;position:relative}
.bar button::before{content:'';position:absolute;inset:-12px 0}
.bar button.done{background:var(--text)}.bar button.on{background:var(--accent);border-color:var(--accent)}
main{padding:0 0 8rem}
.step-head{position:relative;overflow:hidden;padding:2.2rem max(1.2rem,calc((100% - 46rem)/2)) 2.4rem;background:var(--hc);color:var(--hi)}
.step-head::before{content:'';position:absolute;width:22rem;height:22rem;border-radius:50%;background:var(--hd);right:-6rem;top:-11rem}
.step-head::after{content:attr(data-n);position:absolute;right:max(1rem,calc((100% - 52rem)/2));bottom:-2.6rem;font-size:11rem;font-weight:500;line-height:1;color:var(--hd);opacity:.9;pointer-events:none}
.step-head>*{position:relative;z-index:1}
.step-body{padding:2rem max(1.2rem,calc((100% - 46rem)/2)) 2.5rem}
.step[data-step="0"]{--hc:oklch(46% .21 275);--hi:oklch(99% .01 275);--hd:oklch(55% .21 275)}
.step[data-step="1"]{--hc:oklch(52% .21 28);--hi:oklch(99% .01 28);--hd:oklch(60% .21 28)}
.step[data-step="2"]{--hc:oklch(48% .13 190);--hi:oklch(99% .01 190);--hd:oklch(56% .13 190)}
.step[data-step="3"]{--hc:oklch(50% .21 310);--hi:oklch(99% .01 310);--hd:oklch(58% .21 310)}
.step[data-step="4"]{--hc:oklch(86% .17 95);--hi:oklch(21% .05 90);--hd:oklch(92% .15 95)}
.step[data-step="5"]{--hc:oklch(46% .2 255);--hi:oklch(99% .01 255);--hd:oklch(54% .2 255)}
.step[data-step="6"]{--hc:oklch(52% .22 5);--hi:oklch(99% .01 5);--hd:oklch(60% .22 5)}
.step[data-step="7"]{--hc:oklch(46% .14 160);--hi:oklch(99% .01 160);--hd:oklch(54% .14 160)}
.step[data-step="8"]{--hc:oklch(50% .2 275);--hi:oklch(99% .01 275);--hd:oklch(58% .2 275)}
.step-count{display:inline-block;margin:0 0 .8rem;padding:.2em .9em;border-radius:99px;background:var(--hi);color:var(--hc);font-weight:500;font-size:.9rem;max-width:none}
.step-title,.lesson-title{color:var(--hi);margin:0;font-size:3rem;letter-spacing:-.035em;line-height:1.05;max-width:16ch}.lesson-title{font-size:3.6rem}
.kicker-term{margin:.7rem 0 0;color:var(--hi);font-size:1.15rem}
.sentence{border:2.5px solid var(--text);box-shadow:6px 6px 0 var(--text)}
.part.m{border:2.5px solid var(--accent)}
.dock{position:fixed;left:0;right:0;bottom:0;background:var(--bg);border-top:3px solid var(--text);z-index:6}
.dock .pager{max-width:60rem;margin:0 auto;padding:.7rem 1rem}
.pager .count{font-weight:500}
.foot{padding-bottom:6rem}
@media (max-width:700px){.step-title{font-size:2.2rem}.lesson-title{font-size:2.6rem}.step-head{padding-top:1.5rem;padding-bottom:1.6rem}.step-head::after{font-size:7rem;bottom:-1.6rem}.step-head::before{width:14rem;height:14rem;top:-7rem}}
`,
  },
  f: {
    file: 'f-oasis.html',
    name: 'F · Oasis',
    css: `
:root{--bg:oklch(96.5% .02 200);--surface:oklch(99.6% .004 200);--text:oklch(24% .045 220);--muted:oklch(42% .035 220);--line:oklch(89% .025 210);--accent:oklch(44% .1 205);--on-accent:oklch(99% .01 205);--accent-2:oklch(62% .18 38);--accent-2-text:oklch(46% .16 38);--link:oklch(40% .1 205);--focus:oklch(48% .16 255);--note-bg:oklch(95% .03 200);--c-noun:oklch(42% .15 255);--c-verb:oklch(50% .19 30);--c-little:oklch(40% .12 150);--good:oklch(46% .13 150);--bad:oklch(52% .19 30);--r:24px;--r-btn:999px;--body:'Geist',system-ui,sans-serif;--head:'Geist',system-ui,sans-serif;--head-w:500;--fs:1.0625rem;--step-pad:0;
--c-tip:oklch(87% .16 100);--i-tip:oklch(24% .05 90);--c-know:oklch(78% .1 235);--i-know:oklch(20% .04 235);--c-warn:oklch(70% .17 35);--i-warn:oklch(20% .05 35);--c-rem:oklch(70% .15 150);--i-rem:oklch(20% .05 150)}
body{background:radial-gradient(48rem 26rem at 0% 0%,oklch(92% .07 200),transparent 65%),radial-gradient(44rem 26rem at 100% 8%,oklch(95% .09 100),transparent 65%),radial-gradient(52rem 34rem at 50% 100%,oklch(94% .07 30),transparent 65%),var(--bg);background-attachment:fixed}
.top{background:transparent}
.top-in{max-width:46rem;margin:0 auto;padding:.9rem 1rem .5rem;display:flex;justify-content:space-between;align-items:center}
.logo{font-weight:500;font-size:1.1rem}.where{font-size:.9rem;color:var(--muted)}
.bar{max-width:46rem;margin:0 auto;padding:0 1rem .8rem;display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:.4rem}
.bar button{height:12px;border:0;padding:0;border-radius:99px;background:oklch(100% 0 0 / .7);cursor:pointer;position:relative}
.bar button::before{content:'';position:absolute;inset:-14px 0}
.bar button:nth-child(5n+1).done,.bar button:nth-child(5n+1).on{background:oklch(70% .15 150)}
.bar button:nth-child(5n+2).done,.bar button:nth-child(5n+2).on{background:oklch(72% .11 235)}
.bar button:nth-child(5n+3).done,.bar button:nth-child(5n+3).on{background:oklch(84% .16 100)}
.bar button:nth-child(5n+4).done,.bar button:nth-child(5n+4).on{background:oklch(70% .17 35)}
.bar button:nth-child(5n+5).done,.bar button:nth-child(5n+5).on{background:oklch(66% .15 310)}
.bar button.on{height:16px;margin-top:-2px;box-shadow:0 0 0 3px var(--surface)}
main{max-width:46rem;margin:0 auto;padding:.6rem 1rem 8rem}
.step{background:var(--surface);border-radius:32px;overflow:hidden;box-shadow:0 14px 40px oklch(40% .08 220 / .14)}
.step-head{position:relative;padding:1.6rem 1.6rem .4rem;overflow:hidden}
.step-head::after{content:'';position:absolute;right:-3rem;top:-3.5rem;width:12rem;height:12rem;border-radius:50%;background:var(--pc);opacity:.55}
.step-head>*{position:relative;z-index:1}
.step-body{padding:.6rem 1.6rem 2rem}
.step[data-step="0"]{--pc:oklch(90% .08 200)}.step[data-step="1"]{--pc:oklch(92% .11 100)}.step[data-step="2"]{--pc:oklch(90% .08 35)}.step[data-step="3"]{--pc:oklch(90% .09 150)}.step[data-step="4"]{--pc:oklch(90% .07 235)}.step[data-step="5"]{--pc:oklch(91% .08 310)}.step[data-step="6"]{--pc:oklch(92% .11 100)}.step[data-step="7"]{--pc:oklch(90% .08 35)}.step[data-step="8"]{--pc:oklch(90% .09 150)}
.step-count{display:inline-block;margin:0 0 .7rem;padding:.25em 1em;border-radius:99px;background:var(--accent);color:var(--on-accent);font-weight:500;font-size:.88rem;max-width:none}
.step-title,.lesson-title{margin:0;font-size:2.3rem;letter-spacing:-.025em;line-height:1.12;max-width:18ch}.lesson-title{font-size:2.9rem}
.kicker-term{margin:.5rem 0 0;color:var(--muted)}
.sentence{background:oklch(98% .012 200);border:0;box-shadow:inset 0 0 0 2px oklch(88% .04 210)}
.dock{position:fixed;left:50%;transform:translateX(-50%);bottom:.8rem;width:min(44rem,calc(100% - 1.2rem));background:var(--surface);border-radius:999px;box-shadow:0 8px 28px oklch(40% .08 220 / .25);z-index:6}
.dock .pager{padding:.45rem .5rem .45rem .6rem}
.pager .count{color:var(--muted);font-size:.95rem}
.foot{padding-bottom:6rem}
@media (max-width:560px){.step-title{font-size:1.8rem}.lesson-title{font-size:2.3rem}.step-head{padding:1.2rem 1.1rem .3rem}.step-body{padding:.5rem 1.1rem 1.6rem}.step{border-radius:26px}}
`,
  },
};

function split(html) {
  const [head, body] = html.split('~~');
  return [head.trim(), (body ?? '').trim()];
}

function page(key) {
  const t = THEMES[key];
  const stepHtml = steps
    .map((html, i) => {
      const [head, body] = split(html);
      const lead = i === 0 ? '' : `<p class="step-count" data-n="${i + 1}">Step ${i + 1} of ${steps.length}</p>`;
      return `<section class="step" data-step="${i}" data-id="${lesson.steps[i].id}" ${i ? 'hidden' : ''}><header class="step-head" data-n="${i + 1}">${lead}${head}</header><div class="step-body">${body}</div></section>`;
    })
    .join('\n');
  const bar = lesson.steps.map((s, i) => `<button type="button" aria-label="Step ${i + 1}: ${s.label}" title="${s.label}"><span class="visually-hidden">${s.label}</span></button>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>L2.01 round 2 · ${t.name}</title>
<style>${BASE}${ROUND2}${t.css}</style></head>
<body class="theme-${key}">
<header class="top"><div class="top-in"><span class="logo">Quranic Grammar</span><span class="where">${lesson.kicker}</span></div><nav class="bar" aria-label="Lesson steps">${bar}</nav></header>
<main><div class="stage">${stepHtml}</div></main>
<div class="dock"><div class="pager"><button class="btn" id="back" type="button">Back</button><span class="count" id="count" role="status"></span><button class="btn primary" id="next" type="button">Start</button></div></div>
<p class="foot">Quran text: Tanzil · Word analysis: Quranic Arabic Corpus · Mockup, not final</p>
<script>${SCRIPT}</script></body></html>`;
}

for (const k of Object.keys(THEMES)) writeFileSync(join(here, THEMES[k].file), page(k));

const compare = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>L2.01 round 2 · side by side</title>
<style>
*{box-sizing:border-box}body{margin:0;font:16px/1.5 system-ui,sans-serif;background:oklch(94% .005 260);color:oklch(22% .02 260)}
header{position:sticky;top:0;z-index:5;background:oklch(99% .003 260);border-bottom:1px solid oklch(85% .01 260);padding:.7rem 1rem;display:flex;flex-wrap:wrap;gap:.6rem 1.2rem;align-items:center}
h1{font-size:1.05rem;margin:0 1rem 0 0}
.grp{display:flex;gap:.3rem;align-items:center}.grp span{font-size:.85rem;color:oklch(42% .02 260);margin-right:.2rem}
button{min-height:36px;padding:.2em .8em;border:1px solid oklch(70% .02 260);background:white;border-radius:8px;cursor:pointer;font:inherit}
button[aria-pressed=true]{background:oklch(30% .05 260);color:white;border-color:oklch(30% .05 260)}
.row{display:flex;gap:1.2rem;padding:1.2rem;overflow-x:auto;align-items:flex-start}
.col{flex:none}.col h2{font-size:1rem;margin:0 0 .5rem}.col a{font-size:.85rem;margin-left:.6rem}
.frame{border:1px solid oklch(70% .02 260);border-radius:12px;overflow:hidden;background:white;box-shadow:0 2px 8px oklch(20% .02 260 / .12)}
iframe{border:0;display:block;width:390px;height:780px}
.desk iframe{width:1280px;height:900px;transform-origin:0 0}
.desk{flex-direction:column}.desk .frame{width:960px;height:675px}.desk iframe{transform:scale(.75)}
</style></head><body>
<header><h1>L2.01 · round 2, three bolder looks</h1>
<div class="grp"><span>View</span><button id="vp" aria-pressed="true">Phone</button><button id="vd" aria-pressed="false">Desktop (stacked)</button></div>
<div class="grp"><span>Step</span><button id="prev">←</button><b id="st">1 / 9</b><button id="nx">→</button></div></header>
<div class="row" id="row">
${Object.keys(THEMES).map((k) => `<div class="col"><h2>${THEMES[k].name}<a href="${THEMES[k].file}" target="_blank">open full size</a></h2><div class="frame"><iframe src="${THEMES[k].file}" title="${THEMES[k].name}" loading="eager"></iframe></div></div>`).join('\n')}
</div>
<script>
let n=0;const N=${steps.length},fr=[...document.querySelectorAll('iframe')],row=document.getElementById('row');
function go(k){n=Math.max(0,Math.min(N-1,k));document.getElementById('st').textContent=(n+1)+' / '+N;fr.forEach(f=>f.contentWindow.postMessage({type:'step',n},'*'))}
document.getElementById('prev').onclick=()=>go(n-1);document.getElementById('nx').onclick=()=>go(n+1);
fr.forEach(f=>f.addEventListener('load',()=>go(n)));
function mode(d){row.classList.toggle('desk',d);vp.setAttribute('aria-pressed',!d);vd.setAttribute('aria-pressed',d)}
vp.onclick=()=>mode(false);vd.onclick=()=>mode(true);
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(n+1);if(e.key==='ArrowLeft')go(n-1)});
</script></body></html>`;
writeFileSync(join(here, 'compare-round2.html'), compare);
console.log('built', Object.values(THEMES).map((t) => t.file).join(', '), 'compare-round2.html');
