// Builds the three L2.01 mockups and the side-by-side page.
//   node docs/redesign/mockups/l2-01/build.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lesson, sentences, checks } from './content.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const FONTS = '../../../../public/fonts';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const TYPE = { n: ['noun', 'Noun'], v: ['verb', 'Verb'], p: ['little', 'Little word'] };
const ROLE = {
  mubtada: ['mubtada', 'mubtadaʾ', 'the starting point'],
  khabar: ['khabar', 'khabar', 'the news'],
};

function sentence(key, { roles = true, size = '' } = {}) {
  const s = sentences[key];
  const groups = s.groups
    .map((g) => {
      const chips = g.words
        .map(
          ([ar, en, t, say]) =>
            `<div class="w ${TYPE[t][0]}"><span class="ar">${ar}</span><span class="say">${say}</span><span class="en">${esc(en)}</span><span class="tag"><i class="shape"></i>${TYPE[t][1]}</span></div>`,
        )
        .join('');
      const role = roles && g.role ? `<div class="role ${ROLE[g.role][0]}"><b>${ROLE[g.role][1]}</b> <span>${ROLE[g.role][2]}</span></div>` : '';
      return `<div class="grp"><div class="chips">${chips}</div>${role}</div>`;
    })
    .join('');
  const en = s.en.map((p) => (Array.isArray(p) ? `<span class="gap">${p[0]}</span>` : esc(p))).join('');
  return `<figure class="sentence ${size}"><div class="sent" dir="rtl" lang="ar">${groups}</div><p class="trans">${en}</p><figcaption>${esc(s.ref)}</figcaption></figure>`;
}

const legend = `<p class="legend" aria-label="Colour key"><span class="k noun"><i class="shape"></i>Noun (ism)</span><span class="k verb"><i class="shape"></i>Verb (fiʿl)</span><span class="k little"><i class="shape"></i>Little word (ḥarf)</span></p>`;

const AR = '[\\u0600-\\u06FF\\u0750-\\u077F]';
const wrapAr = (s) => s.replace(new RegExp(`${AR}[\\u0600-\\u06FF\\u0750-\\u077F ]*${AR}`, 'g'), (m) => `<span class="ar-inline" lang="ar" dir="rtl">${m}</span>`);

function checkBlock(c, i) {
  return `<div class="check" data-answer="${c.answer}"><p class="q"><span class="qn">${i + 1}</span><span>${wrapAr(c.q)}</span></p><div class="opts" role="group">${c.options
    .map((o, k) => `<button type="button" class="opt" data-k="${k}">${wrapAr(o)}</button>`)
    .join('')}</div><p class="fb" role="status" aria-live="polite" hidden></p><p class="why" hidden>${wrapAr(c.why)}</p></div>`;
}

const steps = [
  // 0 start
  `<h1 class="lesson-title">${lesson.title}</h1>
   <p class="kicker-term">${lesson.term} <span class="ar-inline" lang="ar" dir="rtl">${lesson.termAr}</span></p>
   <div class="goal"><h2>By the end you can</h2><p>Find the two parts of a nominal sentence, and say why both of them end in <b>-u</b>.</p></div>
   <dl class="facts"><div><dt>Time</dt><dd>${lesson.minutes} minutes, ${lesson.steps.length} short steps</dd></div><div><dt>Before you start</dt><dd>Noun, verb and little word (L1.04). The -u ending (L1.10).</dd></div></dl>
   <div class="words-box"><h2>Four words you will meet</h2><ul>
     <li><b>Nominal sentence</b> <span class="ar-inline" lang="ar" dir="rtl">جُمْلَة اِسْمِيَّة</span> A sentence that starts with a noun.</li>
     <li><b>Mubtadaʾ</b> <span class="ar-inline" lang="ar" dir="rtl">مُبْتَدَأ</span> What the sentence is about.</li>
     <li><b>Khabar</b> <span class="ar-inline" lang="ar" dir="rtl">خَبَر</span> What the sentence says about it.</li>
     <li><b>Nominative</b> <span class="ar-inline" lang="ar" dir="rtl">رَفْع</span> The -u ending.</li></ul></div>`,
  // 1 see it
  `<h2 class="step-title">Look at this sentence</h2>
   <p>It is part of a verse about Allah. Read it from right to left.</p>
   ${sentence('awwal', { roles: false, size: 'big' })}
   ${legend}
   <p class="prompt"><b>Count the words.</b> The Arabic has two. The English has three. Which English word is extra?</p>`,
  // 2 no is
  `<h2 class="step-title">Arabic leaves out “is”</h2>
   <p>English needs a small word like <i>is</i>, <i>am</i> or <i>are</i>: “The sky <u>is</u> blue.” Arabic does not. It puts two words side by side, and you add “is” when you say it in English.</p>
   <div class="equation" aria-label="هُوَ plus ٱلْأَوَّلُ gives: He is the First"><span class="ar">هُوَ</span><span class="op">+</span><span class="ar">ٱلْأَوَّلُ</span><span class="op">=</span><span class="res">He <span class="gap">is</span> the First</span></div>
   <p>A sentence like this is called a <b>nominal sentence</b>, <span class="ar-inline" lang="ar" dir="rtl">جُمْلَة اِسْمِيَّة</span>. <i>Ism</i> means noun, so it is a sentence that starts with a noun. No verb is needed.</p>
   <aside class="note"><b>Remember</b> If you want to add “is”, say it in English only. Never look for a word for it in Arabic.</aside>`,
  // 3 parts
  `<h2 class="step-title">Every nominal sentence has two parts</h2>
   <div class="two"><div class="part m"><h3><span class="ar-inline" lang="ar" dir="rtl">مُبْتَدَأ</span> Mubtadaʾ</h3><p>The starting point. What the sentence is about.</p></div>
   <div class="part k"><h3><span class="ar-inline" lang="ar" dir="rtl">خَبَر</span> Khabar</h3><p>The news. What the sentence says about it.</p></div></div>
   ${sentence('awwal')}
   ${sentence('kitab')}
   <p>In the second sentence, <i>that</i> is the topic and <i>the Book</i> is the news about it.</p>`,
  // 4 rule
  `<h2 class="step-title">The rule: both end in -u</h2>
   <div class="rule"><p class="rule-line">The mubtadaʾ and the khabar both take the <b>nominative</b> case, <span class="ar-inline" lang="ar" dir="rtl">رَفْع</span>.</p>
   <p class="endings"><span><b class="ar" lang="ar">بُ</b> -u</span><span class="or">or</span><span><b class="ar" lang="ar">بٌ</b> -un</span></p></div>
   ${sentence('ghafur')}
   <p><span class="ar-inline" lang="ar" dir="rtl">ٱللَّهُ</span> ends in <b>-u</b>. <span class="ar-inline" lang="ar" dir="rtl">غَفُورٌ</span> and <span class="ar-inline" lang="ar" dir="rtl">رَّحِيمٌ</span> end in <b>-un</b>. The khabar can be more than one word. Both words say something about Allah.</p>
   <aside class="note"><b>Small exception</b> Words like <i>huwa</i> (he) and <i>dhalika</i> (that) never show an ending. They are still the mubtadaʾ.</aside>`,
  // 5 more
  `<h2 class="step-title">A longer one</h2>
   <p>The mubtadaʾ is a single word here, and the khabar is a group of words that belong together.</p>
   ${sentence('nur')}
   <p>Look for the -u ending to find where each part starts. <span class="ar-inline" lang="ar" dir="rtl">ٱللَّهُ</span> is the topic. <span class="ar-inline" lang="ar" dir="rtl">نُورُ</span> begins the news, and the words after it finish the idea.</p>`,
  // 6 reversed
  `<h2 class="step-title">Sometimes the news comes first</h2>
   <p>The khabar can be a little phrase such as “for you”. Then it often comes <b>before</b> the mubtadaʾ.</p>
   ${sentence('dinukum')}
   <p>Word for word: “For you <u>is</u> your religion.” The mubtadaʾ is still the word that ends in <b>-u</b>.</p>
   <aside class="note"><b>Tip</b> A phrase that starts with a little word like <i>li-</i> (for) is not the topic. The topic is the next word that ends in -u.</aside>`,
  // 7 try
  `<h2 class="step-title">Try it</h2><p>Three quick questions. Pick an answer to see if you are right.</p>
   ${checks.map(checkBlock).join('')}`,
  // 8 done
  `<h2 class="step-title">You have finished the lesson</h2>
   <ul class="keys"><li>A nominal sentence starts with a noun and needs no verb.</li><li>It has two parts: the <b>mubtadaʾ</b> (topic) and the <b>khabar</b> (news).</li><li>Both end in <b>-u</b> or <b>-un</b>. Add “is” in English only.</li></ul>
   <div class="cta"><a class="btn primary" href="#check">Take the 5-question check</a><p class="muted">Pass it to open L2.02. <a href="#skip">Skip anyway</a></p></div>
   <div class="sources"><h2>Where this comes from</h2><ul>
     <li>Quran text: <a href="https://tanzil.net">Tanzil</a></li>
     <li>Word-by-word analysis: <a href="https://corpus.quran.com">Quranic Arabic Corpus</a></li>
     <li>Grammar: Quranic Arabic Corpus, grammar documentation; <i>al-Ajurrumiyyah</i>, chapter on al-mubtadaʾ wa-l-khabar</li></ul>
     <p class="muted">Source lines are placeholders in this mockup. Exact pages are confirmed before publishing.</p>
     <p><a href="#report">Found a mistake? Tell us.</a></p></div>`,
];

const BASE = `
@font-face{font-family:'Geist';src:url('${FONTS}/geist-400.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'Geist';src:url('${FONTS}/geist-500.woff2') format('woff2');font-weight:500 700;font-display:swap}
@font-face{font-family:'KFGQPC Hafs Uthmani';src:url('${FONTS}/UthmanicHafs.woff2') format('woff2');font-weight:400;unicode-range:U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC}
@font-face{font-family:'Amiri';src:url('${FONTS}/amiri-regular-arabic.woff2') format('woff2');font-weight:400;unicode-range:U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC}
@font-face{font-family:'Amiri';src:url('${FONTS}/amiri-bold-arabic.woff2') format('woff2');font-weight:700;unicode-range:U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC}
@font-face{font-family:'Amiri';src:url('${FONTS}/amiri-regular-latin.woff2') format('woff2');font-weight:400;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'Amiri';src:url('${FONTS}/amiri-bold-latin.woff2') format('woff2');font-weight:700;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--body);font-size:var(--fs);line-height:1.65}
a{color:var(--link)}
.ar,.ar-inline{font-family:'KFGQPC Hafs Uthmani','Amiri','Traditional Arabic',serif;letter-spacing:0;font-weight:400}
.ar-inline{font-size:1.25em;line-height:1.5;margin-inline:.2em}
.step[hidden]{display:none!important}
.step{padding-block:var(--step-pad)}
h1,h2,h3{font-family:var(--head);font-weight:var(--head-w);line-height:1.2;margin:0 0 .5em}
p{margin:0 0 1em;max-width:62ch}
.muted{color:var(--muted);font-size:.95em}
button{font:inherit}
:focus-visible{outline:3px solid var(--focus);outline-offset:3px}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:.6em 1.4em;font-weight:500;text-decoration:none;border-radius:var(--r-btn);border:2px solid var(--accent);color:var(--accent);background:transparent;cursor:pointer}
.btn.primary{background:var(--accent);color:var(--on-accent)}
.btn[disabled]{opacity:.45;cursor:not-allowed}
/* word chips */
.sentence{margin:1.5em 0;padding:1.2em 1em 1em;background:var(--surface);border:1px solid var(--line);border-radius:var(--r)}
.sent{display:flex;flex-wrap:wrap;gap:1.4rem .9rem;justify-content:center;align-items:flex-start}
.grp{display:flex;flex-direction:column;gap:.5rem;align-items:stretch}
.chips{display:flex;gap:.5rem;direction:rtl;justify-content:center}
.w{direction:ltr;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.1rem;padding:.5rem .7rem .55rem;border-radius:calc(var(--r) * .7);background:color-mix(in oklab,var(--t) 10%,var(--surface));border:1.5px solid color-mix(in oklab,var(--t) 40%,var(--surface));min-width:5.2rem}
.w .ar{direction:rtl;unicode-bidi:isolate;font-size:2.15rem;line-height:1.9;color:var(--text)}
.sentence.big .w .ar{font-size:2.9rem}
.w .say{font-size:.86rem;color:var(--muted);font-style:italic}
.w .en{font-weight:500;font-size:.98rem;line-height:1.3}
.w .tag{display:inline-flex;align-items:center;gap:.35em;font-size:.78rem;color:var(--t);font-weight:500;margin-top:.2rem}
.shape{display:inline-block;width:.6em;height:.6em;background:currentColor}
.noun{--t:var(--c-noun)} .verb{--t:var(--c-verb)} .little{--t:var(--c-little)}
.noun .shape{border-radius:50%} .verb .shape{clip-path:polygon(50% 0,100% 100%,0 100%)} .little .shape{border-radius:1px}
.role{text-align:center;border-top:4px solid var(--rc);padding-top:.35rem;font-size:.88rem;line-height:1.3}
.role b{display:inline-block;padding:.1em .6em;border-radius:99px;margin-bottom:.15rem}
.role span{display:block;color:var(--muted)}
.role.mubtada{--rc:var(--accent)} .role.mubtada b{background:var(--accent);color:var(--on-accent)}
.role.khabar{--rc:var(--accent-2)} .role.khabar b{background:transparent;color:var(--accent-2-text);border:2px solid var(--accent-2)}
.role.khabar{border-top-style:dashed}
.trans{margin:1em 0 .2em;text-align:center;font-size:1.2rem;max-width:none}
.gap{border-bottom:2px dashed var(--accent-2);padding-inline:.15em;font-weight:500}
.sentence figcaption{text-align:center;color:var(--muted);font-size:.85rem}
.legend{display:flex;flex-wrap:wrap;gap:.5rem 1.2rem;font-size:.92rem;margin:0 0 1.2em}
.legend .k{display:inline-flex;align-items:center;gap:.4em;color:var(--t);font-weight:500}
.equation{display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;justify-content:center;margin:1.2em 0;padding:1em;background:var(--surface);border:1px solid var(--line);border-radius:var(--r)}
.equation .ar{font-size:2.4rem;line-height:1.8}.equation .op{font-size:1.6rem;color:var(--muted)}.equation .res{font-size:1.3rem;font-weight:500}
.note{margin:1.2em 0;padding:.9em 1.1em;background:var(--note-bg);border:1px solid var(--line);border-radius:var(--r);font-size:.98rem;max-width:62ch}
.note b{display:block;margin-bottom:.15em}
.two{display:grid;gap:.8rem;grid-template-columns:1fr 1fr;margin-bottom:.5rem}
.part{padding:.9em 1em;border-radius:var(--r);background:var(--surface);border:1px solid var(--line)}
.part h3{font-size:1.1rem;margin:0 0 .3em}.part p{margin:0;font-size:.98rem}
.part.m{border:2px solid var(--accent)}.part.k{border:2px dashed var(--accent-2)}
.rule{padding:1.1em 1.2em;background:var(--surface);border:2px solid var(--accent);border-radius:var(--r);margin-bottom:1em}
.rule-line{font-size:1.15rem;margin-bottom:.6em}
.endings{display:flex;align-items:center;gap:1rem;margin:0;font-size:1.3rem}.endings .ar{font-size:2.2rem;display:inline-block;margin-inline-end:.3em}.endings .or{color:var(--muted);font-size:1rem}
.goal{padding:1em 1.2em;background:var(--surface);border:1px solid var(--line);border-radius:var(--r)}
.goal h2,.words-box h2,.sources h2{font-size:1.05rem;margin-bottom:.3em}
.goal p{margin:0;font-size:1.2rem}
.facts{display:grid;gap:.6rem;margin:1.2em 0}.facts div{display:flex;gap:1rem}.facts dt{min-width:8.5rem;font-weight:500}.facts dd{margin:0}
.words-box ul{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}.words-box li{padding:.55em .8em;background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--r)*.6)}
.prompt{padding:.8em 1em;background:var(--note-bg);border-radius:var(--r)}
.check{padding:1em 0;border-top:1px solid var(--line)}
.q{display:flex;gap:.7rem;font-weight:500;font-size:1.08rem;margin-bottom:.6em}.qn{flex:none;display:grid;place-items:center;width:1.9rem;height:1.9rem;border-radius:50%;background:var(--accent);color:var(--on-accent);font-size:.9rem}
.q .ar,.opt .ar{font-size:1.3em}
.opts{display:flex;flex-wrap:wrap;gap:.5rem}
.opt{min-height:48px;padding:.4em 1.1em;border-radius:var(--r-btn);border:2px solid var(--line);background:var(--surface);color:var(--text);cursor:pointer;font-size:1.05rem}
.opt:hover{border-color:var(--accent)}
.opt.right{border-color:var(--good);background:color-mix(in oklab,var(--good) 14%,var(--surface))}
.opt.wrong{border-color:var(--bad);background:color-mix(in oklab,var(--bad) 12%,var(--surface))}
.fb{font-weight:500;margin:.7em 0 .2em}.why{margin:0;color:var(--muted)}
.keys{padding-inline-start:1.2em}.keys li{margin-bottom:.5em;font-size:1.1rem}
.cta{margin:1.6em 0}.cta .muted{margin:.6em 0 0}
.sources{padding-top:1em;border-top:1px solid var(--line)}.sources ul{margin:.3em 0 .8em;padding-inline-start:1.2em}
.top{position:sticky;top:0;z-index:5;background:var(--bar-bg)}
.pager{display:flex;align-items:center;justify-content:space-between;gap:1rem}
.pager .btn{min-width:6.5rem}.pager .count{white-space:nowrap}
.foot{color:var(--muted);font-size:.85rem;text-align:center;padding:1rem}
.visually-hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (max-width:560px){.two{grid-template-columns:1fr}.w{min-width:4.4rem;padding:.4rem .5rem}.w .ar{font-size:1.9rem}.sentence.big .w .ar{font-size:2.5rem}.facts div{flex-direction:column;gap:.1rem}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;

const THEMES = {
  a: {
    file: 'a-warm.html',
    name: 'A · Warm paper',
    css: `
:root{--bg:oklch(96.8% .014 85);--surface:oklch(99.2% .006 85);--text:oklch(24% .02 60);--muted:oklch(44% .02 60);--line:oklch(88% .02 80);--accent:oklch(47% .1 195);--on-accent:oklch(98.5% .01 195);--accent-2:oklch(60% .15 50);--accent-2-text:oklch(45% .13 45);--link:oklch(42% .11 195);--focus:oklch(55% .16 250);--note-bg:oklch(94.5% .03 85);--c-noun:oklch(43% .15 255);--c-verb:oklch(48% .17 30);--c-little:oklch(42% .11 150);--good:oklch(52% .13 150);--bad:oklch(54% .17 30);--bar-bg:oklch(96.8% .014 85);--r:18px;--r-btn:999px;--body:'Geist',system-ui,sans-serif;--head:'Geist',system-ui,sans-serif;--head-w:500;--fs:1.0625rem;--step-pad:1.6rem 0 2rem}
.top{border-bottom:1px solid var(--line)}
.top-in{max-width:44rem;margin:0 auto;padding:.8rem 1rem .6rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.logo{font-weight:500;letter-spacing:-.01em}.where{color:var(--muted);font-size:.9rem}
.bar{max-width:44rem;margin:0 auto;padding:0 1rem .8rem;display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:5px}
.bar button{height:8px;border:0;padding:0;border-radius:99px;background:var(--line);cursor:pointer;position:relative}
.bar button::before{content:'';position:absolute;inset:-18px 0}
.bar button.done{background:color-mix(in oklab,var(--accent) 55%,var(--line))}.bar button.on{background:var(--accent)}
main{max-width:44rem;margin:0 auto;padding:0 1rem 7rem}
.step-title{font-size:2rem;letter-spacing:-.02em;margin-bottom:.6em}
.step-count{color:var(--muted);font-size:.9rem;margin:0 0 .3rem}
.lesson-title{font-size:2.7rem;letter-spacing:-.03em;margin-bottom:.2em}.kicker-term{color:var(--muted);font-size:1.1rem}
.dock{position:fixed;left:0;right:0;bottom:0;background:var(--surface);border-top:1px solid var(--line);z-index:6}
.dock .pager{max-width:44rem;margin:0 auto;padding:.7rem 1rem}
.pager .count{color:var(--muted);font-size:.95rem}
.foot{padding-bottom:6rem}
@media (max-width:560px){.lesson-title{font-size:2.2rem}.step-title{font-size:1.65rem}}
`,
  },
  b: {
    file: 'b-scholarly.html',
    name: 'B · Classic scholarly',
    css: `
:root{--bg:oklch(95.6% .022 95);--surface:oklch(98.6% .011 95);--text:oklch(25% .03 150);--muted:oklch(42% .03 120);--line:oklch(80% .045 90);--accent:oklch(36% .085 160);--on-accent:oklch(97% .015 95);--accent-2:oklch(56% .12 78);--accent-2-text:oklch(38% .09 70);--link:oklch(36% .085 160);--focus:oklch(50% .15 250);--note-bg:oklch(93% .03 95);--c-noun:oklch(40% .1 258);--c-verb:oklch(42% .15 25);--c-little:oklch(40% .09 72);--good:oklch(42% .1 150);--bad:oklch(46% .15 25);--bar-bg:oklch(95.6% .022 95);--r:4px;--r-btn:3px;--body:Georgia,'Times New Roman',serif;--head:'Amiri',Georgia,serif;--head-w:700;--fs:1.125rem;--step-pad:1.4rem 0 2rem}
.top{border-bottom:3px double var(--line)}
.top-in{max-width:68rem;margin:0 auto;padding:1rem 1.2rem .4rem;text-align:center}
.logo{font-family:'Amiri',Georgia,serif;font-size:1.5rem;font-weight:700;color:var(--accent)}.where{display:block;color:var(--muted);font-size:.95rem;font-style:italic}
.bar{max-width:68rem;margin:0 auto;padding:.3rem 1.2rem .8rem;display:flex;justify-content:center;flex-wrap:wrap;gap:.15rem .35rem}
.bar button{min-width:2.4rem;height:2.1rem;padding:0 .4rem;border:1px solid transparent;border-radius:3px;background:transparent;color:var(--muted);font-family:'Amiri',Georgia,serif;font-size:1.1rem;cursor:pointer}
.bar button.done{color:var(--accent)}.bar button.on{border-color:var(--accent);color:var(--accent);background:var(--surface);font-weight:700}
main{max-width:68rem;margin:0 auto;padding:0 1.2rem 7rem;display:grid;grid-template-columns:minmax(0,40rem) minmax(0,15rem);gap:0 3.5rem;justify-content:center}
.stage{grid-column:1/-1;display:contents}
.step{display:grid;grid-template-columns:subgrid;grid-column:1/-1}
.step>*{grid-column:1}
.step>.note{grid-column:2;margin:0;align-self:start;background:transparent;border:0;border-top:1px solid var(--line);border-radius:0;padding:.7em 0 0;font-size:.95rem;color:var(--muted);font-style:italic}
.step>.note b{font-style:normal;color:var(--accent);font-variant:small-caps;letter-spacing:.04em}
.step-title{font-size:2.3rem;border-bottom:1px solid var(--line);padding-bottom:.25em;margin-bottom:.7em}
.step-count{font-family:'Amiri',Georgia,serif;color:var(--accent-2-text);font-size:1.05rem;margin:0 0 .2rem;font-variant:small-caps;letter-spacing:.06em}
.lesson-title{font-size:3rem}.kicker-term{font-style:italic;color:var(--muted)}
.sentence{border:1px solid var(--line);outline:1px solid var(--line);outline-offset:4px;margin-block:1.8em;background:var(--surface)}
.w{background:color-mix(in oklab,var(--t) 7%,var(--surface))}
.sentence .trans{font-style:italic}
.goal,.words-box li,.part,.rule,.equation{background:var(--surface)}
.dock{position:fixed;left:0;right:0;bottom:0;background:var(--bg);border-top:3px double var(--line);z-index:6}
.dock .pager{max-width:68rem;margin:0 auto;padding:.6rem 1.2rem}
.pager .count{font-style:italic;color:var(--muted)}
.btn{font-family:'Amiri',Georgia,serif;font-size:1.15rem;letter-spacing:.02em}
.opt{font-family:Georgia,serif}
.foot{padding-bottom:6rem;font-style:italic}
@media (max-width:560px){.bar{gap:0}.bar button{min-width:1.9rem;padding:0 .1rem;font-size:1rem}}
@media (max-width:900px){main{display:block;max-width:42rem}.step{display:block}.step>.note{margin:1.2em 0;border:1px solid var(--line);padding:.8em 1em;background:var(--note-bg);font-style:normal;color:var(--text)}.lesson-title{font-size:2.4rem}.step-title{font-size:1.9rem}}
`,
  },
  c: {
    file: 'c-bright.html',
    name: 'C · Bright and playful',
    css: `
:root{--bg:oklch(98.4% .008 100);--surface:oklch(100% 0 0);--text:oklch(20% .03 270);--muted:oklch(38% .03 270);--line:oklch(26% .03 270);--accent:oklch(48% .21 268);--on-accent:oklch(99% .005 268);--accent-2:oklch(56% .21 12);--accent-2-text:oklch(44% .2 12);--link:oklch(42% .2 268);--focus:oklch(48% .21 268);--note-bg:oklch(100% 0 0);--c-noun:oklch(44% .2 262);--c-verb:oklch(49% .22 15);--c-little:oklch(42% .13 155);--good:oklch(48% .14 155);--bad:oklch(52% .2 20);--bar-bg:oklch(98.4% .008 100);--r:24px;--r-btn:16px;--body:'Geist',system-ui,sans-serif;--head:'Geist',system-ui,sans-serif;--head-w:500;--fs:1.125rem;--step-pad:0;--p0:oklch(93% .11 96);--p1:oklch(91% .06 255);--p2:oklch(92% .07 12);--p3:oklch(92% .08 152);--p4:oklch(93% .09 96);--p5:oklch(91% .06 300);--p6:oklch(92% .07 40);--p7:oklch(91% .06 215);--p8:oklch(93% .11 96)}
.top{border-bottom:3px solid var(--line)}
.top-in{max-width:60rem;margin:0 auto;padding:.8rem 1rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.logo{font-weight:500;font-size:1.15rem}.where{font-size:.92rem;color:var(--muted)}
.bar{max-width:60rem;margin:0 auto;padding:0 1rem .8rem;display:flex;gap:.45rem;flex-wrap:wrap}
.bar button{width:2.1rem;height:2.1rem;border-radius:50%;border:2.5px solid var(--line);background:var(--surface);cursor:pointer;font-weight:500;font-size:.85rem;color:var(--text);padding:0}
.bar button.done{background:var(--text);color:var(--surface)}.bar button.on{background:var(--accent);border-color:var(--accent);color:var(--on-accent);transform:scale(1.12)}
main{padding:0 0 7rem}
.step{padding:2rem max(1rem,calc((100% - 46rem)/2)) 3rem;min-height:calc(100vh - 11rem)}
.step[data-step="0"]{background:var(--p0)}.step[data-step="1"]{background:var(--p1)}.step[data-step="2"]{background:var(--p2)}.step[data-step="3"]{background:var(--p3)}.step[data-step="4"]{background:var(--p4)}.step[data-step="5"]{background:var(--p5)}.step[data-step="6"]{background:var(--p6)}.step[data-step="7"]{background:var(--p7)}.step[data-step="8"]{background:var(--p8)}
.step-count{display:inline-grid;place-items:center;width:4.2rem;height:4.2rem;border-radius:50%;background:var(--text);color:var(--surface);font-size:0;margin-bottom:.8rem;max-width:none}
.step-count::before{content:attr(data-n);font-size:1.8rem;font-weight:500;line-height:1}
.step-title{font-size:2.6rem;letter-spacing:-.03em;line-height:1.1}
.lesson-title{font-size:3.4rem;letter-spacing:-.035em;line-height:1.05}.kicker-term{font-size:1.2rem}
.sentence,.goal,.words-box li,.part,.rule,.equation,.note,.opt,.sources{border:2.5px solid var(--line)}
.sentence{box-shadow:6px 6px 0 var(--line);border-radius:var(--r)}
.note{background:var(--surface);border-radius:var(--r);box-shadow:4px 4px 0 var(--line)}
.part.m{border:2.5px solid var(--accent)}.part.k{border:2.5px dashed var(--accent-2)}
.btn{border-width:3px;font-size:1.1rem;box-shadow:4px 4px 0 var(--line)}
.btn.primary{border-color:var(--line)}
.dock{position:fixed;left:0;right:0;bottom:0;background:var(--surface);border-top:3px solid var(--line);z-index:6}
.dock .pager{max-width:60rem;margin:0 auto;padding:.7rem 1rem}
.pager .count{font-weight:500}
.foot{padding-bottom:6rem}
@media (max-width:560px){.lesson-title{font-size:2.5rem}.step-title{font-size:2rem}.step{padding-top:1.4rem}.bar button{width:1.9rem;height:1.9rem}}
`,
  },
};

const SCRIPT = `
const steps=[...document.querySelectorAll('.step')],dots=[...document.querySelectorAll('.bar button')];
const nameOf=n=>steps[n].dataset.id;let cur=0;
const next=document.getElementById('next'),back=document.getElementById('back'),count=document.getElementById('count');
function show(n,scroll=true){cur=Math.max(0,Math.min(steps.length-1,n));
 if(new URLSearchParams(location.search).has('all')){steps.forEach(s=>s.hidden=false);return}
 steps.forEach((s,k)=>s.hidden=k!==cur);
 dots.forEach((d,k)=>{d.classList.toggle('on',k===cur);d.classList.toggle('done',k<cur);d.setAttribute('aria-current',k===cur?'step':'false')});
 count.textContent='Step '+(cur+1)+' of '+steps.length;
 back.disabled=cur===0;next.textContent=cur===steps.length-1?'Check':cur===0?'Start':'Next';
 next.disabled=false;history.replaceState(null,'','#'+nameOf(cur));if(scroll)window.scrollTo(0,0)}
next.onclick=()=>{if(cur<steps.length-1)show(cur+1)};back.onclick=()=>show(cur-1);
dots.forEach((d,k)=>d.onclick=()=>show(k));
document.addEventListener('keydown',e=>{if(e.target.closest('.check,input,textarea'))return;if(e.key==='ArrowRight')show(cur+1);if(e.key==='ArrowLeft')show(cur-1)});
document.querySelectorAll('.check').forEach(c=>{const ans=+c.dataset.answer,fb=c.querySelector('.fb'),why=c.querySelector('.why');
 c.querySelectorAll('.opt').forEach(o=>o.onclick=()=>{const ok=+o.dataset.k===ans;c.querySelectorAll('.opt').forEach(x=>x.classList.remove('wrong'));
  if(ok){o.classList.add('right');fb.textContent='Right.';why.hidden=false}else{o.classList.add('wrong');fb.textContent='Not quite. Try another.';why.hidden=true}fb.hidden=false})});
window.addEventListener('message',e=>{if(e.data&&e.data.type==='step')show(e.data.n,false)});
const fromHash=()=>{const h=location.hash.slice(1);const idx=steps.findIndex(s=>s.dataset.id===h);return idx>=0?idx:0};
window.addEventListener('hashchange',()=>{const k=fromHash();if(k!==cur)show(k,false)});
show(fromHash(),false);
`;

function page(key) {
  const t = THEMES[key];
  const stepHtml = steps
    .map((html, i) => {
      const lead = i === 0 ? '' : `<p class="step-count" data-n="${i + 1}">Step ${i + 1} of ${steps.length}</p>`;
      return `<section class="step" data-step="${i}" data-id="${lesson.steps[i].id}" ${i ? 'hidden' : ''}>${lead}${html}</section>`;
    })
    .join('\n');
  const dotLabels = key === 'b' ? ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'] : lesson.steps.map((_, i) => String(i + 1));
  const bar = lesson.steps.map((s, i) => `<button type="button" aria-label="Step ${i + 1}: ${s.label}" title="${s.label}">${key === 'a' ? '<span class="visually-hidden">' + s.label + '</span>' : dotLabels[i]}</button>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>L2.01 mockup · ${t.name}</title>
<style>${BASE}${t.css}</style></head>
<body class="theme-${key}">
<header class="top"><div class="top-in"><span class="logo">Quranic Grammar</span><span class="where">${lesson.kicker}</span></div><nav class="bar" aria-label="Lesson steps">${bar}</nav></header>
<main><div class="stage">${stepHtml}</div></main>
<div class="dock"><div class="pager"><button class="btn" id="back" type="button">Back</button><span class="count" id="count" role="status"></span><button class="btn primary" id="next" type="button">Start</button></div></div>
<p class="foot">Quran text: Tanzil · Word analysis: Quranic Arabic Corpus · Mockup, not final</p>
<script>${SCRIPT}</script></body></html>`;
}

for (const k of Object.keys(THEMES)) writeFileSync(join(here, THEMES[k].file), page(k));

const compare = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>L2.01 · three looks side by side</title>
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
<header><h1>L2.01 · three looks, same lesson</h1>
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
writeFileSync(join(here, 'compare.html'), compare);
console.log('built', Object.values(THEMES).map((t) => t.file).join(', '), 'compare.html');
