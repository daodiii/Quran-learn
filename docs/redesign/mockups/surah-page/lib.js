// Shared rendering for the surah-page mockups. Reads window.IK (ikhlas-data.js). Everything the learner reads comes from the data.
(function () {
  const D = window.IK;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const AR = '[؀-ۿݐ-ݿﭐ-﷿ﹰ-ﻼ]';
  const AR_RUN = new RegExp(AR + '+(?:\\s+' + AR + '+)*', 'g');
  const withArabic = (t) => esc(t).replace(AR_RUN, (m) => `<span class="ar" lang="ar" dir="rtl">${m}</span>`);
  const inline = (t) => withArabic(t).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  // The little Markdown the MDX uses: paragraphs, "- " lists, "1. " lists and **bold**.
  function md(src) {
    const out = []; let list = null;
    const close = () => { if (list) { out.push(`</${list}>`); list = null; } };
    for (const raw of String(src).split('\n')) {
      const l = raw.trim();
      if (!l) { close(); continue; }
      const ul = l.match(/^[-*] (.*)/), ol = l.match(/^\d+\. (.*)/);
      if (ul || ol) { const kind = ul ? 'ul' : 'ol'; if (list !== kind) { close(); out.push(`<${kind}>`); list = kind; } out.push(`<li>${inline((ul || ol)[1])}</li>`); }
      else { close(); out.push(`<p>${inline(l)}</p>`); }
    }
    close(); return out.join('');
  }
  const TYPES = { noun: { label: 'Noun', term: 'ism' }, verb: { label: 'Verb', term: 'fiʿl' }, little: { label: 'Little word', term: 'ḥarf' } };
  const sizeFor = (n, phone, compact) => { const f = (phone ? .66 : 1) * (compact ? .8 : 1); return [(n <= 4 ? 4 : n <= 6 ? 3.25 : n <= 9 ? 2.6 : 2.1) * f, (phone ? 56 : compact ? 70 : n <= 4 ? 96 : n <= 6 ? 80 : 64)]; };
  const wordsHTML = (v, sel = 0, compact = false) => {
    const [fs, mn] = sizeFor(v.words.length, matchMedia('(max-width:640px)').matches, compact && v.words.length > 4);
    return `<div class="verse" role="group" aria-label="Words of verse ${v.n}" style="--wfs:${fs}rem;--wmin:${mn}px">` + v.words.map((w, i) =>
      `<button class="w ${w.t}" type="button" data-i="${i}" aria-pressed="${i === sel}" aria-label="${esc(w.tr)}, ${esc(w.en)}, ${TYPES[w.t].label.toLowerCase()}"><span class="q wa" lang="ar" dir="rtl">${esc(w.ar)}</span><span class="wg">${esc(w.en)}</span><span class="wl">${TYPES[w.t].label}</span></button>`).join('') + '</div>';
  };
  const detailHTML = (w) => {
    const t = TYPES[w.t];
    return `<div class="top"><span class="ty ${w.t}" style="--c:var(--${w.t})">${t.label} <em>${t.term}</em></span><span class="role">${esc(w.role)}</span></div>
      <p class="say">${esc(w.tr)}: ${esc(w.en)}. ${esc(w.say)}</p>
      <p class="book">${w.root ? `<span>Root <span class="ar" lang="ar" dir="rtl">${esc(w.root)}</span></span>` : ''}<span>For the grammar book: ${withArabic(w.irab)}</span></p>`;
  };
  // Wires the word buttons inside `scope` to the `detail` element. Arrow keys walk the words (Arabic runs right to left).
  function wireWords(scope, detail, getVerse) {
    const set = (i) => {
      const v = getVerse(); const bs = [...scope.querySelectorAll('.w')];
      bs.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
      detail.className = 'detail ' + v.words[i].t; detail.style.setProperty('--c', `var(--${v.words[i].t})`);
      detail.innerHTML = detailHTML(v.words[i]);
    };
    scope.addEventListener('click', (e) => { const b = e.target.closest('.w'); if (b) set(+b.dataset.i); });
    scope.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const b = e.target.closest('.w'); if (!b) return; e.preventDefault();
      const bs = [...scope.querySelectorAll('.w')]; const n = Math.min(bs.length - 1, Math.max(0, +b.dataset.i + (e.key === 'ArrowLeft' ? 1 : -1)));
      set(n); bs[n].focus();
    });
    return set;
  }
  function tabsHTML(id, v) {
    const L = [['nahw', 'Syntax', 'Nahw'], ['sarf', 'Word forms', 'Sarf'], ['balagha', 'Style', 'Balagha']];
    return `<div class="tabs" role="tablist" aria-label="Why verse ${v.n} is written this way">` + L.map(([k, n, term], i) => `<button class="tab" role="tab" type="button" id="${id}-t-${k}" aria-controls="${id}-p" aria-selected="${i === 0}" data-k="${k}">${n} <span class="vh">(${term})</span></button>`).join('') + `</div><div class="tabpanel prose" role="tabpanel" id="${id}-p" aria-labelledby="${id}-t-nahw" tabindex="0">${md(v.why.nahw)}</div>`;
  }
  function wireTabs(root, id, getVerse) {
    root.addEventListener('click', (e) => {
      const t = e.target.closest('.tab'); if (!t || !root.contains(t)) return;
      root.querySelectorAll('.tab').forEach((x) => x.setAttribute('aria-selected', String(x === t)));
      const p = root.querySelector(`#${id}-p`); p.setAttribute('aria-labelledby', t.id); p.innerHTML = md(getVerse().why[t.dataset.k]);
    });
  }
  const noteHTML = (c) => `<div class="note"><h3>${withArabic(c.title)}</h3><div class="prose">${md(c.body)}</div></div>`;
  function quizHTML(id, v) {
    const q = v.quiz;
    return `<div class="try"><h3>Try it</h3><p class="qq" id="${id}-q">${withArabic(q.q)}</p><div class="opts" role="group" aria-labelledby="${id}-q">` +
      q.options.map((o, i) => `<button class="opt" type="button" data-i="${i}" aria-pressed="false"><span>${withArabic(o)}</span><span class="mark" aria-hidden="true"></span></button>`).join('') + `</div><p class="fb" id="${id}-fb" aria-live="polite"></p></div>`;
  }
  function wireQuiz(root, id, getVerse) {
    root.addEventListener('click', (e) => {
      const b = e.target.closest('.opt'); if (!b || !root.contains(b)) return;
      const q = getVerse().quiz, i = +b.dataset.i, ok = i === q.answer;
      root.querySelectorAll('.opt').forEach((x) => { x.setAttribute('aria-pressed', 'false'); x.classList.remove('right', 'wrong'); x.querySelector('.mark').textContent = ''; });
      b.setAttribute('aria-pressed', 'true'); b.classList.add(ok ? 'right' : 'wrong'); b.querySelector('.mark').textContent = ok ? 'Correct' : 'Not this one';
      root.querySelector(`#${id}-fb`).innerHTML = ok ? withArabic(q.why) : 'Look at the word again and read its role in the box above, then try another answer.';
    });
  }
  const exercisesHTML = () => D.exercises.map((x, i) => `<details class="ex"><summary><span>${withArabic(x.q)}</span></summary><div class="ans prose">${md(x.a)}</div></details>`).join('');
  const vocabHTML = () => `<table class="vocab"><thead><tr><th>Word</th><th>Root</th><th>Meaning</th></tr></thead><tbody>` + D.vocab.map((r) => `<tr><td class="q" lang="ar" dir="rtl">${esc(r[0])}</td><td class="ar" lang="ar" dir="rtl">${esc(r[1] === '-' ? '' : r[1])}</td><td>${esc(r[3])}</td></tr>`).join('') + `</tbody></table>`;
  const summaryHTML = () => `<ul class="sum">` + D.summary.map((s) => `<li>${inline(s)}</li>`).join('') + `</ul>`;
  const sourcesHTML = () => `<div class="sources"><h2>Where this comes from</h2><p>${D.sources.replace(/\[Tell us\]\(([^)]+)\)/, '<a href="$1">Tell us</a>').replace(/^(?!<)/, '')}</p></div>`;
  const keyHTML = () => `<ul class="key" aria-label="Word types">` + Object.entries(TYPES).map(([k, t]) => `<li class="${k}"><b>${t.label}</b></li>`).join('') + `</ul>`;
  const headerHTML = () => `<a class="skip" href="#main">Skip to the surah</a><header class="site"><a class="brand" href="#" aria-label="Quranic Grammar, home"><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="1" y="1" width="30" height="30" rx="9" fill="oklch(18% 0.03 240)"/><path d="M9 19h14" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="12" r="2.6" fill="oklch(79% 0.14 72)"/><circle cx="16" cy="24.5" r="1.6" fill="#fff"/></svg><span>Quranic Grammar</span></a><nav aria-label="Primary"><a href="#">Learn</a><a href="#" aria-current="page">Surahs</a><a href="#">Resources</a><a href="#">About</a></nav></header>`;
  const footHTML = () => `<footer class="foot"><span>Quranic Grammar</span><a href="#">Learn</a><a href="#">Surahs</a><a href="#">About and feedback</a></footer>`;
  const totalWords = D.verses.reduce((a, v) => a + v.words.length, 0);
  window.IKUI = { D, esc, md, withArabic, inline, TYPES, wordsHTML, detailHTML, wireWords, tabsHTML, wireTabs, noteHTML, quizHTML, wireQuiz, exercisesHTML, vocabHTML, summaryHTML, sourcesHTML, keyHTML, headerHTML, footHTML, totalWords };
})();
