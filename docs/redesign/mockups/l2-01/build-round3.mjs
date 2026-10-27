// Round 3: three refined, more mature directions based on the Oasis look you chose.
//   node docs/redesign/mockups/l2-01/build-round3.mjs
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

const MARK = `<svg class="mark" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7"><rect x="5.5" y="5.5" width="13" height="13"/><rect x="5.5" y="5.5" width="13" height="13" transform="rotate(45 12 12)"/></g></svg>`;

const tiles = `<div class="tiles" aria-label="هُوَ, then nothing, then ٱلْأَوَّلُ: He is the First">
  <div class="tile noun"><span class="ar">هُوَ</span><span class="en">he</span></div>
  <div class="tile ghost"><span class="g">is</span><small>English only</small></div>
  <div class="tile noun"><span class="ar">ٱلْأَوَّلُ</span><span class="en">the First</span></div></div>`;

const formula = `<div class="formula" aria-label="mubtadaʾ plus khabar equals a nominal sentence">
  <span class="f m">mubtadaʾ<small>the topic</small></span><span class="op">+</span><span class="f k">khabar<small>the news</small></span><span class="op">=</span><span class="f s">nominal sentence<small>جُمْلَة اِسْمِيَّة</small></span></div>`;

// Each step: head (title block), intro (text before the example), visual (the example), after (text, callouts, checks).
const steps = [
  {
    head: `<h1 class="lesson-title">${lesson.title}</h1><p class="kicker-term">${lesson.term} ${AR(lesson.termAr)}</p>`,
    intro: `<div class="goal"><h2>By the end you can</h2><p>Find the two parts of a nominal sentence, and say why both of them end in <b>-u</b>.</p></div>
   <dl class="facts"><div><dt>Time</dt><dd>${lesson.minutes} minutes, ${lesson.steps.length} short steps</dd></div><div><dt>Before you start</dt><dd>Noun, verb and little word (L1.04). The -u ending (L1.10).</dd></div></dl>`,
    visual: formula,
    after: `<div class="words-box"><h2>Four words you will meet</h2><ul>
     <li><b>Nominal sentence</b> ${AR('جُمْلَة اِسْمِيَّة')} A sentence that starts with a noun.</li>
     <li><b>Mubtadaʾ</b> ${AR('مُبْتَدَأ')} What the sentence is about.</li>
     <li><b>Khabar</b> ${AR('خَبَر')} What the sentence says about it.</li>
     <li><b>Nominative</b> ${AR('رَفْع')} The -u ending.</li></ul></div>`,
  },
  {
    head: `<h2 class="step-title">Look at this sentence</h2>`,
    intro: `<p>It is part of a verse about Allah. Read it from right to left.</p>`,
    visual: sentence('awwal', { roles: false, size: 'big' }) + legend,
    after: `<p class="prompt"><b>Count the words.</b> The Arabic has two. The English has three. Which English word is extra?</p>`,
  },
  {
    head: `<h2 class="step-title">Arabic leaves out “is”</h2>`,
    intro: `<p>English needs a small word like <i>is</i>, <i>am</i> or <i>are</i>: “The sky <u>is</u> blue.” Arabic does not. It puts two words side by side.</p>`,
    visual: tiles,
    after: `<p>A sentence like this is called a <b>nominal sentence</b>, ${AR('جُمْلَة اِسْمِيَّة')}. <i>Ism</i> means noun, so it is a sentence that starts with a noun. No verb is needed.</p>
   ${callout('rem', 'You add “is” when you say it in English. There is no Arabic word for it.')}`,
  },
  {
    head: `<h2 class="step-title">Every nominal sentence has two parts</h2>`,
    intro: `<div class="two"><div class="part m"><h3>${AR('مُبْتَدَأ')} Mubtadaʾ</h3><p>The starting point. What the sentence is about.</p></div>
   <div class="part k"><h3>${AR('خَبَر')} Khabar</h3><p>The news. What the sentence says about it.</p></div></div>`,
    visual: sentence('awwal') + sentence('kitab'),
    after: `<p>In the second sentence, <i>that</i> is the topic and <i>the Book</i> is the news about it.</p>
   ${callout('know', 'Many grammar books say <b>subject</b> and <b>predicate</b>. They mean roughly the same as mubtadaʾ and khabar.')}`,
  },
  {
    head: `<h2 class="step-title">The rule: both end in <span class="nb">-u</span></h2>`,
    intro: `<div class="rule"><p class="rule-line">The mubtadaʾ and the khabar both take the <b>nominative</b> case, ${AR('رَفْع')}.</p>
   <p class="endings"><span><b class="ar" lang="ar">بُ</b> -u</span><span class="or">or</span><span><b class="ar" lang="ar">بٌ</b> -un</span></p></div>`,
    visual: sentence('ghafur'),
    after: `<p>${AR('ٱللَّهُ')} ends in <b>-u</b>. ${AR('غَفُورٌ')} and ${AR('رَّحِيمٌ')} end in <b>-un</b>. The khabar can be more than one word. Both words say something about Allah.</p>
   ${callout('know', 'Words like <i>huwa</i> (he) and <i>dhalika</i> (that) never show an ending. They are still the mubtadaʾ.')}
   ${callout('warn', 'The mubtadaʾ is not the doer of a verb (the <i>fāʿil</i>). Both end in -u, but they belong to different sentence types. You will meet the fāʿil in L2.03.')}`,
  },
  {
    head: `<h2 class="step-title">A longer one</h2>`,
    intro: `<p>The mubtadaʾ is a single word here, and the khabar is a group of words that belong together.</p>`,
    visual: sentence('nur'),
    after: `<p>Look for the -u ending to find where each part starts. ${AR('ٱللَّهُ')} is the topic. ${AR('نُورُ')} begins the news, and the words after it finish the idea.</p>
   ${callout('tip', 'To find the end of the khabar, say the whole phrase out loud. Stop when the idea is finished.')}`,
  },
  {
    head: `<h2 class="step-title">Sometimes the news comes first</h2>`,
    intro: `<p>The khabar can be a little phrase such as “for you”. Then it often comes <b>before</b> the mubtadaʾ.</p>`,
    visual: sentence('dinukum'),
    after: `<p>Word for word: “For you <u>is</u> your religion.” The mubtadaʾ is still the word that ends in <b>-u</b>.</p>
   ${callout('tip', 'A phrase that starts with a little word like <i>li-</i> (for) is not the topic. The topic is the next word that ends in -u.')}`,
  },
  {
    head: `<h2 class="step-title">Try it</h2>`,
    intro: `<p>Three quick questions. Pick an answer to see if you are right.</p>`,
    visual: sentence('ghafur', { roles: false }) + sentence('awwal', { roles: false }),
    after: checks.map(checkBlock).join(''),
  },
  {
    head: `<h2 class="step-title">You have finished the lesson</h2>`,
    intro: `<ul class="keys"><li>A nominal sentence starts with a noun and needs no verb.</li><li>It has two parts: the <b>mubtadaʾ</b> (topic) and the <b>khabar</b> (news).</li><li>Both end in <b>-u</b> or <b>-un</b>. Add “is” in English only.</li></ul>
   <div class="cta"><a class="btn primary" href="#check">Take the 5-question check</a><p class="muted">Pass it to open L2.02. <a href="#skip">Skip anyway</a></p></div>`,
    visual: formula,
    after: `<div class="sources"><h2>Where this comes from</h2><ul>
     <li>Quran text: <a href="https://tanzil.net">Tanzil</a></li>
     <li>Word-by-word analysis: <a href="https://corpus.quran.com">Quranic Arabic Corpus</a></li>
     <li>Grammar: Quranic Arabic Corpus, grammar documentation; <i>al-Ajurrumiyyah</i>, chapter on al-mubtadaʾ wa-l-khabar</li></ul>
     <p class="muted">Source lines are placeholders in this mockup. Exact pages are confirmed before publishing.</p>
     <p><a href="#report">Found a mistake? Tell us.</a></p></div>`,
  },
];

const COMMON = `
.mark{flex:none}
.callout{display:flex;gap:.85rem;align-items:flex-start;margin:1.4em 0;max-width:62ch;background:color-mix(in oklab,var(--ck) 11%,var(--surface))}
.callout .ico{flex:none;display:grid;place-items:center;background:var(--ck);color:var(--ci)}
.callout svg{fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.callout b{display:block;color:color-mix(in oklab,var(--ck) 42%,black)}
.callout p{margin:0;max-width:none}
.callout.tip{--ck:var(--c-tip);--ci:var(--i-tip)}.callout.know{--ck:var(--c-know);--ci:var(--i-know)}.callout.warn{--ck:var(--c-warn);--ci:var(--i-warn)}.callout.rem{--ck:var(--c-rem);--ci:var(--i-rem)}
.tiles{display:flex;flex-wrap:wrap;gap:.8rem;justify-content:center;align-items:stretch;direction:rtl;margin:1.2em 0}
.tile{direction:ltr;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.1rem;min-width:7rem;padding:1rem 1.1rem;border-radius:var(--r);background:color-mix(in oklab,var(--t) 8%,var(--surface));border:1px solid color-mix(in oklab,var(--t) 35%,var(--surface))}
.tile .ar{font-size:2.6rem;line-height:1.7;direction:rtl;unicode-bidi:isolate}.tile .en{font-weight:500}
.tile.ghost{background:transparent;border:1.5px dashed var(--accent-2);color:var(--accent-2-text);min-width:5.5rem}
.tile.ghost .g{font-size:2rem;font-weight:500;line-height:1.5}.tile.ghost small{font-size:.8rem}
.formula{display:flex;flex-wrap:wrap;gap:.7rem;align-items:center;justify-content:center;margin:1.2em 0}
.formula .f{display:flex;flex-direction:column;align-items:center;padding:.7rem 1.1rem;border-radius:var(--r);font-weight:500;line-height:1.3}
.formula small{font-weight:400;font-size:.82rem;opacity:.9}
.formula .f.m{background:var(--accent);color:var(--on-accent)}
.formula .f.k{border:1.5px dashed var(--accent-2);color:var(--accent-2-text)}
.formula .f.s{background:color-mix(in oklab,var(--accent) 9%,var(--surface));border:1px solid color-mix(in oklab,var(--accent) 35%,var(--surface))}
.formula .op{font-size:1.4rem;color:var(--muted)}
p b,li b,.nb{white-space:nowrap}
.step{padding:0}
.stage-label{font-size:.82rem;color:var(--muted);margin:0 0 .6rem}
@media (max-width:560px){.tile{min-width:5.2rem;padding:.7rem .6rem}.tile .ar{font-size:2.1rem}.tiles{gap:.5rem}
.sentence{padding:1em .4rem .8em}.sent{gap:1rem .45rem}.chips{gap:.3rem}.w{min-width:4rem;padding:.4rem .3rem}.w .ar{font-size:1.7rem}.sentence.big .w .ar{font-size:2.2rem}.w .en{font-size:.9rem}.w .say{font-size:.8rem}.formula .f{padding:.5rem .8rem}}
`;

const THEMES = {
  g: {
    file: 'g-atelier.html',
    name: 'G · Atelier',
    css: `
:root{--bg:oklch(97.4% .012 85);--surface:oklch(99.5% .004 85);--text:oklch(22% .03 240);--muted:oklch(43% .02 240);--line:oklch(90% .014 85);--line-2:oklch(78% .03 85);--accent:oklch(37% .07 205);--on-accent:oklch(98.5% .01 205);--accent-2:oklch(62% .15 55);--accent-2-text:oklch(43% .12 50);--link:oklch(37% .08 205);--focus:oklch(50% .16 255);--note-bg:oklch(95% .02 85);--c-noun:oklch(40% .13 262);--c-verb:oklch(47% .17 28);--c-little:oklch(40% .1 160);--good:oklch(44% .11 160);--bad:oklch(50% .17 30);--r:14px;--r-btn:12px;--body:'Geist',system-ui,sans-serif;--head:'Amiri',Georgia,serif;--head-w:700;--fs:1.0625rem;--step-pad:0;
--c-tip:oklch(80% .15 88);--i-tip:oklch(24% .05 80);--c-know:oklch(66% .1 228);--i-know:oklch(18% .04 228);--c-warn:oklch(62% .17 35);--i-warn:oklch(99% .01 35);--c-rem:oklch(52% .13 295);--i-rem:oklch(99% .01 295)}
body{background:radial-gradient(62rem 30rem at 6% -6rem,oklch(91% .05 175 / .9),transparent 70%),radial-gradient(52rem 28rem at 98% -3rem,oklch(93.5% .06 70 / .9),transparent 70%),var(--bg);background-repeat:no-repeat}
.top{background:transparent}
.top-in{max-width:62rem;margin:0 auto;padding:1rem 1.2rem;display:flex;justify-content:space-between;align-items:center;gap:1rem}
.logo{display:inline-flex;gap:.55rem;align-items:center;font-family:'Amiri',Georgia,serif;font-size:1.4rem;font-weight:700;color:var(--accent)}
.where{font-size:.9rem;color:var(--muted)}
.shell{max-width:62rem;margin:0 auto;padding:1.6rem 1.2rem 3rem;display:grid;grid-template-columns:14.5rem minmax(0,40rem);gap:4rem;justify-content:center}
.bar{position:sticky;top:1.5rem;align-self:start;display:flex;flex-direction:column}
.rail-title{margin:0 0 1.1rem;padding-bottom:1rem;border-bottom:1px solid var(--line-2);font-family:'Amiri',Georgia,serif;font-size:1.25rem;line-height:1.25;font-weight:700}
.rail-title small{display:block;margin-top:.3rem;font-family:'Geist',sans-serif;font-weight:400;font-size:.85rem;color:var(--muted)}
.bar button{display:flex;gap:.85rem;align-items:baseline;padding:.5rem 0;background:none;border:0;text-align:left;color:var(--muted);cursor:pointer;font-size:.97rem;position:relative}
.bar button .n{font-family:'Amiri',Georgia,serif;font-size:1.05rem;color:var(--line-2);min-width:1.4rem;font-variant-numeric:lining-nums}
.bar button.done{color:var(--text)}.bar button.done .n{color:var(--accent-2)}
.bar button.on{color:var(--text);font-weight:500}.bar button.on .n{color:var(--accent);font-weight:700}
.bar button.on::before{content:'';position:absolute;left:-1rem;top:50%;width:.4rem;height:.4rem;margin-top:-.2rem;border-radius:50%;background:var(--accent)}
main{min-width:0}
.step-count{display:block;margin:0 0 .6rem;font-size:.8rem;letter-spacing:.09em;text-transform:uppercase;color:var(--accent-2-text);font-weight:500;max-width:none}
.step-title,.lesson-title{font-family:'Amiri',Georgia,serif;font-weight:700;margin:0;letter-spacing:-.005em}
.step-title{font-size:2.9rem;line-height:1.08;max-width:19ch}.lesson-title{font-size:3.7rem;line-height:1.02;max-width:12ch}
.step-head::after{content:'';display:block;width:2.8rem;height:2px;background:var(--accent-2);margin:1.2rem 0 0}
.kicker-term{margin:.9rem 0 0;color:var(--muted);font-size:1.1rem}
.step-body{padding-top:1.6rem;padding-bottom:1rem}
.sentence{background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:0 1px 0 oklch(20% .02 240 / .04),0 18px 40px -22px oklch(30% .06 240 / .3);padding:1.7rem 1.2rem 1.2rem}
.w{background:color-mix(in oklab,var(--t) 6%,var(--surface));border-radius:12px;padding:.65rem .85rem .7rem}
.w .ar{font-size:2.4rem}
.callout{padding:1rem 1.1rem;border-radius:12px;border:1px solid color-mix(in oklab,var(--ck) 45%,var(--surface))}
.callout .ico{width:1.9rem;height:1.9rem;border-radius:8px}.callout svg{width:1.1rem;height:1.1rem}
.callout b{font-size:.78rem;letter-spacing:.09em;text-transform:uppercase;margin-bottom:.15rem}
.part,.rule,.goal,.equation,.words-box li{border-radius:12px;border:1px solid var(--line);background:var(--surface)}
.part.m{border:1.5px solid var(--accent)}.part.k{border:1.5px dashed var(--accent-2)}
.rule{border:1.5px solid var(--accent)}
.btn{border-radius:12px;border-width:1.5px}
.opt{border:1px solid var(--line-2);border-radius:12px;background:var(--surface)}.opt:hover{border-color:var(--accent)}
.dock{position:sticky;bottom:0;margin-top:2rem;padding:.9rem 0;background:linear-gradient(to top,var(--bg) 70%,transparent);z-index:6}
.dock .pager{border-top:1px solid var(--line-2);padding-top:.9rem}
.pager .count{color:var(--muted);font-size:.92rem}
.foot{padding-bottom:3rem}
@media (max-width:860px){
 .shell{display:block;padding-top:.6rem}
 .bar{position:sticky;top:0;z-index:5;flex-direction:row;gap:.35rem;padding:.7rem 0;background:var(--bg);margin-bottom:.8rem}
 .rail-title,.bar button .t,.bar button .n{display:none}
 .bar button{flex:1;height:4px;padding:0;border-radius:2px;background:var(--line-2)}
 .bar button::after{content:'';position:absolute;inset:-14px 0}
 .bar button.done{background:var(--accent-2)}.bar button.on{background:var(--accent);height:6px;margin-top:-1px}.bar button.on::before{display:none}
 .step-title{font-size:2.3rem}.lesson-title{font-size:2.9rem}
}
@media (max-width:560px){.where{display:none}.logo{white-space:nowrap}.shell{padding-inline:1rem}}
`,
  },
  h: {
    file: 'h-aurora.html',
    name: 'H · Aurora',
    css: `
:root{--bg:oklch(97.6% .007 270);--surface:oklch(99.6% .003 270);--text:oklch(22% .04 275);--muted:oklch(43% .03 275);--line:oklch(90% .014 275);--line-2:oklch(80% .03 275);--accent:oklch(40% .15 285);--on-accent:oklch(98.5% .01 285);--accent-2:oklch(60% .19 28);--accent-2-text:oklch(45% .17 28);--link:oklch(40% .15 285);--focus:oklch(50% .2 265);--note-bg:oklch(95% .02 275);--c-noun:oklch(40% .16 268);--c-verb:oklch(48% .2 22);--c-little:oklch(40% .12 170);--good:oklch(44% .12 165);--bad:oklch(50% .19 25);--r:16px;--r-btn:12px;--body:'Geist',system-ui,sans-serif;--head:'Amiri',Georgia,serif;--head-w:700;--fs:1.0625rem;--step-pad:0;
--c-tip:oklch(82% .16 92);--i-tip:oklch(24% .05 85);--c-know:oklch(64% .15 235);--i-know:oklch(99% .01 235);--c-warn:oklch(62% .2 22);--i-warn:oklch(99% .01 22);--c-rem:oklch(54% .19 300);--i-rem:oklch(99% .01 300)}
.top{background:var(--bg)}
.top-in{max-width:46rem;margin:0 auto;padding:.8rem 1rem .55rem;display:flex;justify-content:space-between;align-items:center}
.logo{display:inline-flex;gap:.5rem;align-items:center;font-family:'Amiri',Georgia,serif;font-size:1.35rem;font-weight:700;color:var(--accent)}
.where{font-size:.9rem;color:var(--muted)}
.bar{max-width:46rem;margin:0 auto;padding:0 1rem .7rem;display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:.3rem}
.bar button{height:4px;border:0;padding:0;border-radius:2px;background:var(--line);cursor:pointer;position:relative}
.bar button::before{content:'';position:absolute;inset:-14px 0}
.bar button:nth-child(1).done,.bar button:nth-child(1).on{background:oklch(62% .15 195)}.bar button:nth-child(2).done,.bar button:nth-child(2).on{background:oklch(60% .15 225)}.bar button:nth-child(3).done,.bar button:nth-child(3).on{background:oklch(56% .17 255)}.bar button:nth-child(4).done,.bar button:nth-child(4).on{background:oklch(53% .2 280)}.bar button:nth-child(5).done,.bar button:nth-child(5).on{background:oklch(56% .21 305)}.bar button:nth-child(6).done,.bar button:nth-child(6).on{background:oklch(60% .2 335)}.bar button:nth-child(7).done,.bar button:nth-child(7).on{background:oklch(63% .19 5)}.bar button:nth-child(8).done,.bar button:nth-child(8).on{background:oklch(68% .17 35)}.bar button:nth-child(9).done,.bar button:nth-child(9).on{background:oklch(76% .16 70)}
.bar button.on{height:6px;margin-top:-1px}
main{padding:0 0 7rem}
.step-head{position:relative;overflow:hidden;color:oklch(99% .005 270);padding:2.4rem max(1.2rem,calc((100% - 44rem)/2)) 5.4rem;border-radius:0 0 34px 34px;background:radial-gradient(34rem 20rem at 108% 4%,oklch(62% .19 var(--h2)),transparent 62%),radial-gradient(30rem 20rem at 70% 130%,oklch(68% .17 var(--h3)),transparent 64%),radial-gradient(26rem 16rem at -10% 120%,oklch(52% .15 var(--h1)),transparent 66%),oklch(26% .085 var(--h1))}
.step[data-step="0"]{--h1:265;--h2:300;--h3:30}.step[data-step="1"]{--h1:255;--h2:200;--h3:330}.step[data-step="2"]{--h1:300;--h2:30;--h3:250}.step[data-step="3"]{--h1:200;--h2:150;--h3:280}.step[data-step="4"]{--h1:280;--h2:330;--h3:60}.step[data-step="5"]{--h1:230;--h2:290;--h3:20}.step[data-step="6"]{--h1:20;--h2:330;--h3:260}.step[data-step="7"]{--h1:190;--h2:240;--h3:100}.step[data-step="8"]{--h1:270;--h2:310;--h3:60}
.step-count{display:inline-block;margin:0 0 .9rem;padding:.25em .85em;border-radius:99px;background:oklch(100% 0 0 / .16);color:oklch(99% .005 270);font-size:.82rem;font-weight:500;max-width:none;box-shadow:inset 0 0 0 1px oklch(100% 0 0 / .22)}
.step-title,.lesson-title{margin:0;color:oklch(99% .005 270);font-family:'Amiri',Georgia,serif;font-weight:700;letter-spacing:-.005em}
.step-title{font-size:3rem;line-height:1.08;max-width:19ch}.lesson-title{font-size:3.5rem;line-height:1.04;max-width:13ch}
.kicker-term{margin:.8rem 0 0;color:oklch(96% .02 270);font-size:1.1rem}
.step-body{position:relative;z-index:2;margin:-3.2rem auto 0;width:min(46rem,calc(100% - 1.6rem));background:var(--surface);border-radius:22px;padding:1.9rem 1.9rem 2.2rem;box-shadow:0 1px 0 oklch(20% .02 270 / .05),0 30px 70px -28px oklch(30% .12 285 / .45)}
.step-body>*:first-child{margin-top:0}
.sentence{background:oklch(98.2% .01 270);border:1px solid var(--line);border-radius:16px;padding:1.6rem 1.1rem 1.1rem}
.w{border-radius:12px;background:color-mix(in oklab,var(--t) 7%,var(--surface))}
.callout{padding:1rem 1.1rem;border-radius:14px;box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--ck) 40%,var(--surface))}
.callout .ico{width:2.1rem;height:2.1rem;border-radius:10px}.callout svg{width:1.2rem;height:1.2rem}
.callout b{font-size:.95rem}
.part,.rule,.goal,.equation,.words-box li{border-radius:14px;border:1px solid var(--line);background:var(--surface)}
.part.m{border:1.5px solid var(--accent)}.part.k{border:1.5px dashed var(--accent-2)}.rule{border:1.5px solid var(--accent)}
.btn{border-radius:12px;border-width:1.5px}
.opt{border:1px solid var(--line-2);border-radius:12px}.opt:hover{border-color:var(--accent)}
.dock{position:fixed;left:0;right:0;bottom:0;background:oklch(99.5% .003 270 / .97);border-top:1px solid var(--line);z-index:6}
.dock .pager{max-width:46rem;margin:0 auto;padding:.7rem 1rem}
.pager .count{color:var(--muted);font-size:.92rem}
@media (max-width:560px){.step-head{padding:1.7rem 1.1rem 4.8rem;border-radius:0 0 26px 26px}.step-title{font-size:2.3rem}.lesson-title{font-size:2.7rem}.step-body{padding:1.4rem 1.1rem 1.8rem;margin-top:-2.8rem}}
`,
  },
  i: {
    file: 'i-stage.html',
    name: 'I · Stage',
    css: `
:root{--bg:oklch(98.6% .006 215);--surface:oklch(99.7% .003 215);--text:oklch(22% .035 230);--muted:oklch(43% .025 230);--line:oklch(90% .014 215);--line-2:oklch(80% .03 215);--accent:oklch(40% .1 178);--on-accent:oklch(98.5% .01 178);--accent-2:oklch(68% .16 62);--accent-2-text:oklch(46% .13 55);--link:oklch(38% .1 178);--focus:oklch(50% .16 255);--note-bg:oklch(95.5% .015 215);--c-noun:oklch(41% .14 258);--c-verb:oklch(48% .18 25);--c-little:oklch(40% .11 160);--good:oklch(44% .12 160);--bad:oklch(50% .18 28);--r:14px;--r-btn:12px;--body:'Geist',system-ui,sans-serif;--head:'Geist',system-ui,sans-serif;--head-w:500;--fs:1.0625rem;--step-pad:0;
--c-tip:oklch(84% .15 92);--i-tip:oklch(24% .05 85);--c-know:oklch(70% .11 230);--i-know:oklch(18% .04 230);--c-warn:oklch(66% .17 32);--i-warn:oklch(99% .01 32);--c-rem:oklch(60% .14 305);--i-rem:oklch(99% .01 305)}
.top{background:var(--bg);border-bottom:1px solid var(--line)}
.top-in{max-width:74rem;margin:0 auto;padding:.8rem 1.4rem .55rem;display:flex;justify-content:space-between;align-items:center}
.logo{display:inline-flex;gap:.5rem;align-items:center;font-weight:500;letter-spacing:-.01em;color:var(--accent)}
.where{font-size:.9rem;color:var(--muted)}
.bar{max-width:74rem;margin:0 auto;padding:0 1.4rem .75rem;display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:.35rem}
.bar button{height:3px;border:0;padding:0;border-radius:2px;background:var(--line);cursor:pointer;position:relative}
.bar button::before{content:'';position:absolute;inset:-14px 0}
.bar button.done{background:var(--accent)}.bar button.on{background:var(--accent-2);height:5px;margin-top:-1px}
main{max-width:74rem;margin:0 auto;padding:0 1.4rem 7rem}
.step{display:grid;grid-template-columns:minmax(0,34rem) minmax(0,1fr);grid-template-areas:"head stage" "body stage";gap:0 3.5rem;align-items:start;padding:2.4rem 0 0}
.step-head{grid-area:head}.step-body{grid-area:body}.stage{grid-area:stage;position:sticky;top:1.4rem}
.step-count{display:flex;align-items:baseline;gap:.6rem;margin:0 0 .8rem;font-size:.9rem;color:var(--muted);max-width:none}
.step-count::before{content:attr(data-n);font-size:2.6rem;font-weight:400;color:var(--accent-2);letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
.step-title,.lesson-title{margin:0;letter-spacing:-.035em;line-height:1.08}.step-title{font-size:2.6rem;max-width:17ch}.lesson-title{font-size:3.3rem;max-width:12ch}
.kicker-term{margin:.8rem 0 0;color:var(--muted);font-size:1.1rem}
.step-body{padding-top:1.4rem}
.stage{min-height:26rem;border-radius:22px;padding:1.3rem;background:radial-gradient(22rem 16rem at 0% 0%,oklch(93.5% .06 175),transparent 70%),radial-gradient(22rem 18rem at 100% 8%,oklch(95% .06 235),transparent 70%),radial-gradient(24rem 16rem at 60% 110%,oklch(95% .06 70),transparent 70%),oklch(98% .01 215);border:1px solid oklch(90% .025 205);display:flex;flex-direction:column;justify-content:center;gap:.2rem}
.stage .sentence{background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:0 1px 0 oklch(20% .02 230 / .04),0 18px 40px -24px oklch(30% .06 220 / .35);margin:.5rem 0}
.stage .tiles,.stage .formula{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:1.4rem 1rem;margin:.5rem 0;box-shadow:0 18px 40px -24px oklch(30% .06 220 / .35)}
.stage-label{display:inline-flex;align-self:flex-start;padding:.2em .8em;border-radius:99px;background:var(--surface);border:1px solid var(--line);font-size:.8rem;color:var(--muted);margin-bottom:.5rem}
.w{border-radius:12px;background:color-mix(in oklab,var(--t) 7%,var(--surface))}
.callout{padding:.9rem 1rem 1rem;border-radius:14px;border:1px solid color-mix(in oklab,var(--ck) 45%,var(--surface));flex-direction:column;gap:.3rem}
.callout .ico{display:none}
.callout b{display:inline-flex;align-items:center;gap:.45rem;margin-bottom:.45rem;padding:.15em .7em .15em .5em;border-radius:99px;background:var(--ck);color:var(--ci);font-size:.82rem}
.callout b::before{content:'';width:.95rem;height:.95rem;background:currentColor;mask:var(--ic) center/contain no-repeat;-webkit-mask:var(--ic) center/contain no-repeat}
.callout.tip{--ic:url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>')}")}
.callout.know{--ic:url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>')}")}
.callout.warn{--ic:url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18v.01"/></svg>')}")}
.callout.rem{--ic:url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4V3z"/></svg>')}")}
.part,.rule,.goal,.equation,.words-box li{border-radius:14px;border:1px solid var(--line);background:var(--surface)}
.part.m{border:1.5px solid var(--accent)}.part.k{border:1.5px dashed var(--accent-2)}.rule{border:1.5px solid var(--accent)}
.btn{border-radius:12px;border-width:1.5px}
.opt{border:1px solid var(--line-2);border-radius:12px}.opt:hover{border-color:var(--accent)}
.dock{position:fixed;left:0;right:0;bottom:0;background:oklch(99.5% .003 215 / .97);border-top:1px solid var(--line);z-index:6}
.dock .pager{max-width:74rem;margin:0 auto;padding:.7rem 1.4rem}
.pager .count{color:var(--muted);font-size:.92rem}
@media (max-width:900px){.step{grid-template-columns:minmax(0,1fr);grid-template-areas:"head" "stage" "body";gap:0;padding-top:1.4rem}.stage{position:static;min-height:0;margin-top:1.2rem;padding:1rem}.step-title{font-size:2.2rem}.lesson-title{font-size:2.7rem}main{padding:0 1rem 7rem}.top-in,.bar{padding-inline:1rem}.dock .pager{padding-inline:1rem}}
`,
  },
};

const bar = (withLabels) =>
  lesson.steps
    .map((s, i) => `<button type="button" aria-label="Step ${i + 1}: ${s.label}" title="${s.label}">${withLabels ? `<span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${s.label}</span>` : `<span class="visually-hidden">${s.label}</span>`}</button>`)
    .join('');

function stepHtml(key) {
  return steps
    .map((s, i) => {
      const lead = i === 0 ? '' : `<p class="step-count" data-n="${String(i + 1).padStart(2, '0')}">Step ${i + 1} of ${steps.length}</p>`;
      const head = `<header class="step-head" data-n="${i + 1}">${lead}${s.head}</header>`;
      const sec = (inner) => `<section class="step" data-step="${i}" data-id="${lesson.steps[i].id}" ${i ? 'hidden' : ''}>${inner}</section>`;
      if (key === 'i') {
        return sec(`${head}<div class="step-body">${s.intro}${s.after}</div><aside class="stage" aria-label="Example"><span class="stage-label">${i === 8 || i === 0 ? 'The idea' : 'Example'}</span>${s.visual}</aside>`);
      }
      return sec(`${head}<div class="step-body">${s.intro}${s.visual}${s.after}</div>`);
    })
    .join('\n');
}

const DOCK = `<div class="dock"><div class="pager"><button class="btn" id="back" type="button">Back</button><span class="count" id="count" role="status"></span><button class="btn primary" id="next" type="button">Start</button></div></div>`;
const FOOT = `<p class="foot">Quran text: Tanzil · Word analysis: Quranic Arabic Corpus · Mockup, not final</p>`;
const HEADER = `<header class="top"><div class="top-in"><span class="logo">${MARK}Quranic Grammar</span><span class="where">${lesson.kicker}</span></div>`;

function page(key) {
  const t = THEMES[key];
  let body;
  if (key === 'g') {
    body = `${HEADER}</header><div class="shell"><nav class="bar" aria-label="Lesson steps"><p class="rail-title">${lesson.title}<small>${lesson.term}</small></p>${bar(true)}</nav><main>${stepHtml(key)}${DOCK}${FOOT}</main></div>`;
  } else {
    body = `${HEADER}<nav class="bar" aria-label="Lesson steps">${bar(false)}</nav></header><main>${stepHtml(key)}</main>${DOCK}${FOOT}`;
  }
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>L2.01 round 3 · ${t.name}</title>
<style>${BASE}${COMMON}${t.css}</style></head>
<body class="theme-${key}">${body}
<script>${SCRIPT}</script></body></html>`;
}

for (const k of Object.keys(THEMES)) writeFileSync(join(here, THEMES[k].file), page(k));

const compare = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>L2.01 round 3 · side by side</title>
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
<header><h1>L2.01 · round 3, three refined looks</h1>
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
writeFileSync(join(here, 'compare-round3.html'), compare);
console.log('built', Object.values(THEMES).map((t) => t.file).join(', '), 'compare-round3.html');
