// Shared behaviour for the Learn mockups: renders rows from window.LEARN, simulates saved progress,
// and wires the filter, the level chips and the phone fold. ?progress=0 shows a first visit, ?progress=14 (default) a returning one.
(function () {
  const L = window.LEARN;
  const params = new URLSearchParams(location.search);
  const doneN = params.has('progress') ? Math.max(0, +params.get('progress')) : 14;

  const flat = [];
  L.levels.forEach(l => l.clusters.forEach(c => c.lessons.forEach(x => flat.push({ ...x, level: l.n, group: c.title, essential: c.essential, checkpoint: c.checkpoint }))));
  flat.forEach((x, i) => { x.idx = i; x.done = i < doneN; });
  const next = flat[doneN] || null;
  const byId = Object.fromEntries(flat.map(x => [x.id, x]));

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`ʿʾ]/g, '');

  const ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  };

  function stats(n) {
    const rows = flat.filter(x => x.level === n);
    return { done: rows.filter(x => x.done).length, total: rows.length };
  }

  function rowHTML(x, opt = {}) {
    const cls = ['row', x.done && 'done', next && x.id === next.id && 'next'].filter(Boolean).join(' ');
    const tags = [
      doneN === 0 && x.idx === 0 ? '<span class="tag next">Start here</span>' : '',
      next && x.id === next.id && doneN > 0 ? '<span class="tag next">Up next</span>' : '',
      x.essential ? '<span class="tag ess">Essential</span>' : '',
      x.checkpoint ? '<span class="tag chk">Checkpoint</span>' : '',
      opt.level ? `<span class="tag lvtag">Level ${x.level}</span>` : '',
    ].join('');
    const q = norm(`${x.title} ${x.desc} ${x.group} ${x.kicker} level ${x.level}`);
    return `<a class="${cls}" href="#${esc(x.id)}" data-q="${esc(q)}" data-level="${x.level}">
      <span class="n" aria-hidden="true">${x.order}</span>
      <span class="t"><b>${esc(x.title)}</b>${x.desc ? `<span class="d">${esc(x.desc)}</span>` : ''}</span>
      <span class="tags">${tags}</span>
      <span class="tick">${ICON.check}<span class="vh">${x.done ? 'Done' : 'Not done yet'}</span></span>
    </a>`;
  }

  function moreHTML(l) {
    const read = l.reading.length
      ? `<span class="read">Read now: ${l.reading.slice(0, 3).map(r => `<a href="#">${esc(r.name)}</a>`).join(', ')}${l.reading.length > 3 ? `, and ${l.reading.length - 3} more` : ''}</span>`
      : '';
    return `<div class="more">
      ${l.reviewHref ? `<a href="#">Level ${l.n} review ${ICON.arrow}</a>` : ''}
      <a href="#">Vocabulary ${ICON.arrow}</a>
      ${read}
    </div>`;
  }

  function resumeHTML() {
    if (!doneN || !next) return '';
    const total = L.levels[next.level - 1].clusters.reduce((a, c) => a + c.lessons.length, 0);
    return `<div class="resume"><div><small>Continue where you left off</small><b>Level ${next.level} · Lesson ${next.order} of ${total}: ${esc(next.title)}</b></div><a class="btn" href="#${esc(next.id)}" aria-label="Continue: ${esc(next.title)}"><span class="btxt">Continue</span>${ICON.arrow}</a></div>`;
  }

  function findHTML() {
    return `<form class="find" role="search" onsubmit="return false">
      <label class="vh" for="q">Filter lessons</label>${ICON.search}
      <input id="q" type="search" autocomplete="off" placeholder="Filter lessons" aria-controls="list">
      <span class="hint" aria-hidden="true">/</span>
      <button type="button" class="clear" aria-label="Clear filter">${ICON.x}</button>
    </form>`;
  }

  function chipsHTML() {
    return `<div class="chips" role="group" aria-label="Show level">
      <span class="chips-l" aria-hidden="true">Level</span>
      <button class="chip" type="button" data-lv="0" aria-pressed="true" aria-label="All levels">All</button>
      ${L.levels.map(l => `<button class="chip" type="button" data-lv="${l.n}" aria-pressed="false" aria-label="Level ${l.n}">${l.n}</button>`).join('')}
    </div>`;
  }

  function emptyHTML() {
    return `<div class="empty" id="empty" hidden><b>No lesson matches that.</b><p>Try one word, such as “verb”, “case” or “sentence”. For anything else, <a href="#">search the whole site</a>.</p></div>`;
  }

  // Filter + fold. onChange(filtering) runs after every refresh so a layout can re-measure itself.
  function wire(onChange) {
    const root = document.querySelector('#list');
    const input = document.querySelector('#q');
    const form = input.closest('.find');
    const count = document.querySelector('#count');
    const empty = document.querySelector('#empty');
    const chips = [...document.querySelectorAll('.chip[data-lv]')];
    let lv = 0;

    function refresh() {
      const words = norm(input.value).split(/\s+/).filter(Boolean);
      const filtering = words.length > 0 || lv !== 0;
      root.classList.toggle('filtering', filtering);
      document.body.classList.toggle('filtering', filtering);
      form.classList.toggle('has', input.value.length > 0);
      let shown = 0;
      root.querySelectorAll('.row').forEach(r => {
        const ok = (lv === 0 || +r.dataset.level === lv) && words.every(w => r.dataset.q.includes(w));
        r.hidden = !ok;
        if (ok) shown++;
      });
      root.querySelectorAll('.grp').forEach(g => { g.hidden = !g.querySelector('.row:not([hidden])'); });
      root.querySelectorAll('.lvl').forEach(s => { s.hidden = !s.querySelector('.row:not([hidden])'); });
      count.textContent = filtering ? `${shown} of ${L.total} lessons` : `${L.total} lessons in ${L.levels.length} levels`;
      empty.hidden = shown !== 0;
      if (onChange) onChange(filtering);
    }

    input.addEventListener('input', refresh);
    form.querySelector('.clear').addEventListener('click', () => { input.value = ''; refresh(); input.focus(); });
    chips.forEach(c => c.addEventListener('click', () => {
      lv = +c.dataset.lv;
      chips.forEach(o => o.setAttribute('aria-pressed', String(o === c)));
      refresh();
    }));
    document.addEventListener('keydown', e => {
      if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
      if (e.key === 'Escape' && document.activeElement === input) { input.value = ''; refresh(); }
    });

    // Phone: fold every level except the one holding the next lesson.
    const current = next ? next.level : 1;
    const phone = matchMedia('(max-width:760px)');
    root.querySelectorAll('.lvl').forEach(s => {
      const btn = s.querySelector('.fold');
      const set = open => { s.dataset.collapsed = String(!open); btn.setAttribute('aria-expanded', String(open)); if (onChange) onChange(root.classList.contains('filtering')); };
      btn.addEventListener('click', () => set(s.dataset.collapsed === 'true'));
      set(!phone.matches || +s.dataset.level === current);
    });
    refresh();
  }

  window.LearnUI = { L, flat, next, doneN, byId, esc, ICON, stats, rowHTML, moreHTML, resumeHTML, findHTML, chipsHTML, emptyHTML, wire };
})();
