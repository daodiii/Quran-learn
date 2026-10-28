// Live tools for the product mockups (M4, M5). Each mount returns { demo(done), stop() }.
// demo() plays a short scripted run; any real input from the visitor stops it for good.
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function runner() {
    let ids = [], off = false;
    return {
      at(ms, fn) { if (off) return; ids.push(setTimeout(() => { if (!off) fn(); }, reduce ? 0 : ms)); },
      stop() { off = true; ids.forEach(clearTimeout); ids = []; },
      reset() { ids.forEach(clearTimeout); ids = []; },
      resume() { off = false; },
      get off() { return off; },
    };
  }
  const shape = (t) => `<i class="shape ${t}"></i>`;

  // ---------- lesson: three steps of L2.01 ----------
  function lesson(el) {
    el.classList.add('tool');
    el.innerHTML = `<div class="ls">
      <div class="ls-bar" aria-hidden="true"><i></i><i></i><i></i></div>
      <p class="ls-crumb">Level 2 · The nominal sentence</p>
      <div class="ls-body">
        <div><p class="ls-step"></p><h3 class="ls-h"></h3><p class="ls-p"></p><p class="ls-fb" aria-live="polite"></p></div>
        <div class="ls-stage"><div class="ls-tiles" dir="rtl" lang="ar">
          <button class="tile" type="button" data-k="he" tabindex="-1"><span class="ar">هُوَ</span><span class="en">he</span></button>
          <span class="tile ghost" aria-hidden="true"><b dir="ltr">is</b><span class="en">English only</span></span>
          <button class="tile" type="button" data-k="first" tabindex="-1"><span class="ar">ٱلْأَوَّلُ</span><span class="en">the First</span></button>
        </div><p class="ls-ref">Al-Hadid 57:3</p></div>
      </div>
      <div class="ls-nav"><button class="ls-back" type="button">Back</button><span class="ls-count"></span><button class="ls-next" type="button">Next</button></div></div>`;
    const S = [
      { h: 'Two words, one sentence', p: 'These two words come from Al-Hadid 57:3. One means “he”, the other “the First”.' },
      { h: 'Arabic leaves out “is”', p: 'English needs “is”: “He is the First.” Arabic puts the two words side by side. This is a nominal sentence, a <i>jumlah ismiyyah</i>.', ghost: 1 },
      { h: 'Check yourself', p: 'Which word is the starting point of the sentence, the <i>mubtadaʾ</i>? Tap it.', ghost: 1, check: 1 },
    ];
    const ls = el.querySelector('.ls'), bars = [...el.querySelectorAll('.ls-bar i')], fb = el.querySelector('.ls-fb');
    const back = el.querySelector('.ls-back'), next = el.querySelector('.ls-next'), tiles = [...el.querySelectorAll('button.tile')];
    let i = 0, done = false;
    function show(n) {
      i = Math.max(0, Math.min(S.length - 1, n)); const s = S[i];
      el.querySelector('.ls-step').textContent = `Step ${i + 1} of ${S.length}`;
      el.querySelector('.ls-h').textContent = s.h; el.querySelector('.ls-p').innerHTML = s.p;
      el.querySelector('.ls-count').textContent = `${i + 1} / ${S.length}`;
      bars.forEach((b, k) => { b.className = k < i ? 'done' : k === i ? 'now' : ''; });
      ls.toggleAttribute('data-ghost', !!s.ghost); ls.toggleAttribute('data-check', !!s.check);
      tiles.forEach((t) => { t.tabIndex = s.check ? 0 : -1; t.classList.remove('right', 'wrong'); });
      fb.textContent = ''; fb.className = 'ls-fb'; done = false;
      back.disabled = i === 0; next.disabled = i === S.length - 1;
    }
    function answer(k) {
      if (!S[i].check || done) return;
      const t = tiles.find((x) => x.dataset.k === k);
      if (k === 'he') { t.classList.add('right'); fb.className = 'ls-fb ok'; fb.innerHTML = 'Right. <b>هُوَ</b>, “he”, is the starting point. <b>ٱلْأَوَّلُ</b>, “the First”, is the news about it, the <i>khabar</i>.'; done = true; }
      else { t.classList.remove('wrong'); void t.offsetWidth; t.classList.add('wrong'); fb.className = 'ls-fb no'; fb.textContent = 'Not this one. “The First” is what we learn about the starting point. Try the other word.'; }
    }
    const r = runner();
    const user = () => r.stop();
    back.addEventListener('click', () => { user(); show(i - 1); });
    next.addEventListener('click', () => { user(); show(i + 1); });
    tiles.forEach((t) => t.addEventListener('click', () => { user(); answer(t.dataset.k); }));
    show(0);
    return {
      demo(cb) { r.reset(); show(0); r.at(2200, () => show(1)); r.at(4800, () => show(2)); r.at(6600, () => answer('first')); r.at(8000, () => answer('he')); r.at(10200, () => cb && cb()); },
      stop: () => r.stop(), resume: () => r.resume(), get stopped() { return r.off; },
    };
  }

  // ---------- word lookup ----------
  const LK = {
    knowledge: { ar: 'عِلْم', tr: 'ʿilm', g: 'knowledge', root: 'ع ل م', n: 105, rt: 854, fam: [['عَلِمَ', 'to know', 382], ['عَلِيم', 'all-knowing', 163], ['عِلْم', 'knowledge', 105], ['عَلَّمَ', 'to teach', 41]] },
    mercy: { ar: 'رَحْمَة', tr: 'raḥma', g: 'mercy', root: 'ر ح م', n: 114, rt: 339, fam: [['رَحِيم', 'most merciful', 116], ['رَحْمَة', 'mercy', 114], ['رَحْمَٰن', 'the Most Gracious', 57], ['رَحِمَ', 'to show mercy', 28]] },
    guidance: { ar: 'هُدًى', tr: 'hudā', g: 'guidance', root: 'ه د ي', n: 85, rt: 316, fam: [['هَدَى', 'to guide', 144], ['هُدًى', 'guidance', 85], ['اهْتَدَىٰ', 'to be guided', 40], ['مُهْتَدُون', 'the guided', 17]] },
    book: { ar: 'كِتَٰب', tr: 'kitāb', g: 'book', root: 'ك ت ب', n: 260, rt: 319, fam: [['كِتَٰب', 'book, scripture', 260], ['كَتَبَ', 'to write', 49], ['كَاتِب', 'scribe', 6], ['مَكْتُوب', 'written', 1]] },
  };
  function lookup(el, { compact = false } = {}) {
    el.classList.add('tool');
    el.innerHTML = `<label class="vh" for="lk-${el.id}">Search the Quran by an English word</label>
      <div class="lk-bar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input id="lk-${el.id}" type="search" autocomplete="off" spellcheck="false" placeholder="Type an English word"></div>
      <div class="lk-chips" role="group" aria-label="Try a word">${Object.keys(LK).map((k) => `<button class="chip" type="button" aria-pressed="false">${k}</button>`).join('')}</div>
      <div class="lk-out" aria-live="polite"></div>`;
    const inp = el.querySelector('input'), out = el.querySelector('.lk-out'), chips = [...el.querySelectorAll('.chip')];
    let last = null;
    function go(v) {
      const q = v.trim().toLowerCase(), k = q && Object.keys(LK).find((x) => x.startsWith(q));
      if (k && k === last) return; last = k || null;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.textContent === k)));
      if (!k) { out.innerHTML = q ? `<p class="lk-none">Not in this preview. The real lookup covers every word of the Quran.</p>` : ''; return; }
      const d = LK[k], max = d.fam[0][2];
      out.innerHTML = `<div class="lk-res pop"><div class="lk-word"><span class="ar big" lang="ar" dir="rtl">${d.ar}</span><span class="gl">${d.g}</span> <span class="tr">${d.tr}</span>
        <p class="ct"><b>${d.n} times</b> in the Quran · root <bdi lang="ar" dir="rtl" style="font-family:Amiri,serif;font-size:1.15em;white-space:nowrap">${d.root}</bdi></p></div>
        ${compact ? '' : `<div class="lk-fam"><h4>Same root, ${d.rt} times in all</h4><ul>${d.fam.map((f) => `<li><span class="ar" lang="ar" dir="rtl">${f[0]}</span><span class="g">${f[1]}<i style="width:${(f[2] / max * 100).toFixed(0)}%"></i></span><span class="n">${f[2]}</span></li>`).join('')}</ul></div>`}</div>`;
    }
    const r = runner();
    inp.addEventListener('input', () => { r.stop(); go(inp.value); });
    chips.forEach((c) => c.addEventListener('click', () => { r.stop(); inp.value = c.textContent; go(c.textContent); }));
    function type(word, start) { [...word].forEach((_, j) => r.at(start + j * 90, () => { inp.value = word.slice(0, j + 1); go(inp.value); })); return start + word.length * 90; }
    return {
      demo(cb) { r.reset(); inp.value = ''; go(''); let t = type('mercy', 500); t = type('knowledge', t + 2200); r.at(t + 2200, () => cb && cb()); },
      show(k) { inp.value = k; go(k); },
      stop: () => r.stop(), resume: () => r.resume(), get stopped() { return r.off; },
    };
  }

  // ---------- verse decoder ----------
  const DC = [
    { ar: 'رَبِّ', t: 'noun', type: 'Noun', job: 'The one called on', root: 'ر ب ب', m: 'my Lord' },
    { ar: '<span style="color:var(--verb)">زِدْ</span><span style="color:var(--noun)">نِى</span>', t: 'verb', type: 'Verb, a command', job: 'A request, with “me” attached', root: 'ز ي د', m: 'increase me' },
    { ar: 'عِلْمًا', t: 'noun', type: 'Noun', job: 'What is asked for, ends in -an', root: 'ع ل م', m: 'in knowledge' },
  ];
  function decoder(el) {
    el.classList.add('tool');
    el.innerHTML = `<div class="dc-v" lang="ar" role="group" aria-label="Taha 20:114, tap a word">${DC.map((w, i) => `<button class="dc-w ${w.t}" type="button" aria-pressed="false" data-i="${i}"><span class="ar">${w.ar}</span></button>`).join('')}</div>
      <dl class="dc-out" aria-live="polite"></dl><p class="dc-note">“My Lord, increase me in knowledge.” Taha 20:114. Tap a word.</p>`;
    const ws = [...el.querySelectorAll('.dc-w')], out = el.querySelector('.dc-out');
    function pick(i) {
      ws.forEach((w, k) => w.setAttribute('aria-pressed', String(k === i)));
      const d = DC[i];
      out.innerHTML = `<div class="pop"><dt>Word type</dt><dd><span class="tag-s ${d.t}">${shape(d.t)}${d.type}</span></dd></div><div class="pop"><dt>Its job</dt><dd>${d.job}</dd></div><div class="pop"><dt>Root</dt><dd><span class="ar" lang="ar" dir="rtl">${d.root}</span></dd></div><div class="pop"><dt>Meaning</dt><dd>${d.m}</dd></div>`;
    }
    const r = runner();
    ws.forEach((w, i) => w.addEventListener('click', () => { r.stop(); pick(i); }));
    pick(0);
    return {
      demo(cb) { r.reset(); pick(0); r.at(1600, () => pick(1)); r.at(3400, () => pick(2)); r.at(5400, () => cb && cb()); },
      stop: () => r.stop(), resume: () => r.resume(), get stopped() { return r.off; },
    };
  }

  // ---------- one root across the Quran (needs hero-i-data.js) ----------
  const RT = [
    { k: 'knowledge', ar: 'ع ل م', gl: 'to know' }, { k: 'mercy', ar: 'ر ح م', gl: 'mercy' },
    { k: 'guidance', ar: 'ه د ي', gl: 'to guide' }, { k: 'patience', ar: 'ص ب ر', gl: 'patience' },
  ];
  function roots(el, { height } = {}) {
    el.classList.add('tool');
    const Q = window.QURAN;
    el.innerHTML = `<div class="rt-head"><div class="rt-big"><span class="rt-n"></span><small class="rt-s"></small></div><span class="rt-root" lang="ar" dir="rtl"></span></div>
      <div class="rt-rib" role="img"${height ? ` style="height:${height}px"` : ''}>${Array.from({ length: 114 }, (_, i) => `<i style="--i:${i}" data-s="${i}"></i>`).join('')}</div>
      <div class="rt-ends" aria-hidden="true"><span>Surah 1</span><span>Surah 114</span></div>
      <p class="rt-read" aria-live="polite"></p>
      <div class="lk-chips" role="group" aria-label="Choose a root">${RT.map((x) => `<button class="chip" type="button" aria-pressed="false">${x.k}</button>`).join('')}</div>`;
    const bars = [...el.querySelectorAll('.rt-rib i')], chips = [...el.querySelectorAll('.chip')], read = el.querySelector('.rt-read');
    let cur = 0, sel = 1;
    function count(n) { const node = el.querySelector('.rt-n'), from = +node.dataset.v || 0; node.dataset.v = n; if (reduce) { node.textContent = n; return; } const t0 = performance.now(); (function f(t) { const p = Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - p, 3); node.textContent = Math.round(from + (n - from) * e); if (p < 1) requestAnimationFrame(f); })(t0); }
    function pick(i) {
      cur = i; const x = RT[i], per = Q.roots[x.k], max = Math.max(...per), tot = per.reduce((a, b) => a + b, 0), sur = per.filter(Boolean).length;
      chips.forEach((c, k) => c.setAttribute('aria-pressed', String(k === i)));
      el.querySelector('.rt-root').textContent = x.ar; el.querySelector('.rt-s').textContent = `times · ${x.gl} · in ${sur} of 114 surahs`; count(tot);
      bars.forEach((b, s) => { const c = per[s]; b.classList.toggle('z', !c); b.style.setProperty('--h', c ? Math.max(5, c / max * 100) + '%' : '3px'); });
      el.querySelector('.rt-rib').setAttribute('aria-label', `Where the root ${x.k} appears, surah by surah`);
      focus(sel);
    }
    function focus(s) { sel = s; bars.forEach((b, j) => b.classList.toggle('sel', j === s)); const c = Q.roots[RT[cur].k][s]; read.innerHTML = `<b>${s + 1}. ${Q.names[s]}</b>: ${c ? c + (c === 1 ? ' time' : ' times') : 'not in this surah'}`; }
    const r = runner();
    chips.forEach((c, i) => c.addEventListener('click', () => { r.stop(); pick(i); }));
    const rib = el.querySelector('.rt-rib');
    const pickBar = (e) => { const t = e.target.closest('i'); if (t) { r.stop(); focus(+t.dataset.s); } };
    rib.addEventListener('pointermove', pickBar); rib.addEventListener('click', pickBar);
    pick(0);
    return {
      demo(cb) { r.reset(); pick(0); r.at(1800, () => pick(1)); r.at(3600, () => pick(2)); r.at(5400, () => pick(0)); r.at(6600, () => cb && cb()); },
      stop: () => r.stop(), resume: () => r.resume(), get stopped() { return r.off; },
    };
  }

  window.QG = { lesson, lookup, decoder, roots };
})();
