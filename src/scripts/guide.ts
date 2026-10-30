// @ts-nocheck
/*
 * Behaviour for the resource guides (src/layouts/GuideLayout.astro). The page reads without it; this adds:
 * Arabic runs set in the Arabic font, the contents rail that follows your scroll, the progress bar, and
 * (on guides that ask for it) a search over table rows or glossary entries and section tabs.
 */
const AR = /[؀-ۿݐ-ݿ][؀-ۿݐ-ݿ‌‍\s]*[؀-ۿݐ-ݿ]|[؀-ۿݐ-ݿ]/g;

function arabize(root) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentNode;
      if (!p || /^(SCRIPT|STYLE)$/.test(p.nodeName) || p.closest('.ar,[lang=ar],.c-ar')) return NodeFilter.FILTER_REJECT;
      AR.lastIndex = 0;
      return AR.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes = [];
  while (w.nextNode()) nodes.push(w.currentNode);
  for (const n of nodes) {
    const s = n.nodeValue;
    const f = document.createDocumentFragment();
    let last = 0, m;
    AR.lastIndex = 0;
    while ((m = AR.exec(s))) {
      if (m.index > last) f.appendChild(document.createTextNode(s.slice(last, m.index)));
      const sp = document.createElement('span');
      sp.className = 'ar'; sp.lang = 'ar'; sp.dir = 'rtl'; sp.textContent = m[0];
      f.appendChild(sp);
      last = m.index + m[0].length;
    }
    if (last < s.length) f.appendChild(document.createTextNode(s.slice(last)));
    n.parentNode.replaceChild(f, n);
  }
  root.querySelectorAll('td').forEach((td) => {
    const t = td.textContent.trim();
    const a = td.querySelectorAll('.ar');
    if (a.length === 1 && a[0].textContent.trim() === t) td.classList.add('cell-ar');
  });
}

const prose = document.querySelector('.prose');
const mainEl = document.querySelector('main');
if (mainEl) arabize(mainEl);

// "On this page" can be hidden; the choice is remembered
const tocBtn = document.querySelector('[data-toc-toggle]');
const body = document.querySelector('.g-body');
if (tocBtn && body) {
  const set = (open) => {
    body.classList.toggle('rail-off', !open);
    tocBtn.setAttribute('aria-expanded', String(open));
  };
  try { set(localStorage.getItem('g-toc') !== 'closed'); } catch (e) { /* storage blocked: stay open */ }
  tocBtn.addEventListener('click', () => {
    const open = body.classList.contains('rail-off');
    set(open);
    try { localStorage.setItem('g-toc', open ? 'open' : 'closed'); } catch (e) { /* ignore */ }
  });
}

// contents rail follows the scroll
const links = [...document.querySelectorAll('[data-toc] a')];
if (links.length && 'IntersectionObserver' in window) {
  const map = {};
  links.forEach((a) => { map[a.getAttribute('href').slice(1)] = a; });
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      const a = map[e.target.id];
      if (a) { a.setAttribute('aria-current', 'true'); a.scrollIntoView?.({ block: 'nearest' }); }
    });
  }, { rootMargin: '-96px 0px -70% 0px' });
  Object.keys(map).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
}

// reading progress
const bar = document.querySelector('[data-progress]');
if (bar) {
  const up = () => {
    const h = document.documentElement;
    const p = h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1);
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
  };
  addEventListener('scroll', up, { passive: true });
  up();
}

// search (and tabs) over the guide text
const tool = document.querySelector('[data-tool]');
if (tool && prose) {
  const q = tool.querySelector('input[type=search]');
  const count = tool.querySelector('[data-count]');
  const tabsHost = tool.querySelector('[data-tabs]');
  const hasTables = !!prose.querySelector('tbody tr');

  // sections: the intro before the first h2, then one per h2
  const secs = [];
  let cur = null;
  [...prose.children].forEach((el) => {
    if (el.tagName === 'H2') { cur = { title: el.textContent.trim(), els: [el] }; secs.push(cur); }
    else if (cur) cur.els.push(el);
    else { cur = { title: 'Start here', els: [el] }; secs.push(cur); }
  });

  // glossary: no tables, so a search hit is a whole entry (an h3 and what follows it)
  const entries = [];
  if (!hasTables) {
    secs.forEach((s) => {
      let e = null;
      s.els.forEach((el) => {
        if (el.tagName === 'H3') { e = { sec: s, els: [el] }; entries.push(e); }
        else if (el.tagName !== 'H2' && e) e.els.push(el);
        else if (el.tagName === 'H2') e = null;
      });
    });
  }

  let active = -1;
  const show = (i) => {
    active = i;
    secs.forEach((s, k) => s.els.forEach((el) => { el.hidden = i !== -1 && k !== i; }));
    if (tabsHost) [...tabsHost.children].forEach((b, k) => b.setAttribute('aria-pressed', String(k === (i === -1 ? secs.length : i))));
  };

  if (tabsHost) {
    secs.forEach((s, k) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'tab';
      b.textContent = s.title.replace(/^Part \d+: /, '').replace(/\s*\(.*\)$/, '');
      b.addEventListener('click', () => { q.value = ''; filter(''); show(k); });
      tabsHost.appendChild(b);
    });
    const all = document.createElement('button');
    all.type = 'button'; all.className = 'tab'; all.textContent = 'Everything';
    all.addEventListener('click', () => { q.value = ''; filter(''); show(-1); });
    tabsHost.appendChild(all);
  }

  const filter = (raw) => {
    const v = raw.trim().toLowerCase();
    let n = 0;
    prose.querySelectorAll('tbody tr').forEach((tr) => {
      const hit = !v || tr.textContent.toLowerCase().includes(v);
      tr.hidden = !hit;
      if (hit && v) n++;
    });
    entries.forEach((e) => {
      const hit = !v || e.els.map((x) => x.textContent).join(' ').toLowerCase().includes(v);
      e.hidden = !hit;
      if (hit && v) n++;
    });
    if (!v) {
      secs.forEach((s) => s.els.forEach((el) => { el.hidden = false; }));
      entries.forEach((e) => e.els.forEach((el) => { el.hidden = false; }));
      if (tabsHost && active !== -1) show(active);
      count.textContent = '';
      return;
    }
    // while searching: only the tables with a matching row, or the matching entries, under their headings
    secs.forEach((s) => {
      let any = false;
      s.els.forEach((el) => {
        if (el.tagName === 'H2') return;
        const isTable = el.classList && el.classList.contains('table-wrapper');
        const inEntry = entries.find((e) => e.els.includes(el));
        if (inEntry) el.hidden = inEntry.hidden;
        else if (isTable) el.hidden = !el.querySelector('tbody tr:not([hidden])');
        else el.hidden = true;
        if (!el.hidden) any = true;
      });
      s.els[0].hidden = !any;
    });
    if (tabsHost) [...tabsHost.children].forEach((b) => b.setAttribute('aria-pressed', 'false'));
    count.textContent = n ? `${n} ${hasTables ? (n === 1 ? 'matching row' : 'matching rows') : (n === 1 ? 'matching term' : 'matching terms')}` : 'Nothing matches. Try another word.';
  };
  q.addEventListener('input', () => filter(q.value));
  // "/" jumps to the search box
  addEventListener('keydown', (e) => {
    if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) { e.preventDefault(); q.focus(); }
  });

  if (tabsHost) {
    const firstTable = secs.findIndex((s) => s.els.some((el) => el.querySelector && (el.classList.contains('table-wrapper') || el.querySelector('table'))));
    show(firstTable === -1 ? 0 : firstTable);
  }
}
