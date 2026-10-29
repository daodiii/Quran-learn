// Shared behaviour for the Surahs mockups: reads window.SURAH_DATA, builds search text, wires the filter box.
// Every count and name on the pages comes from the data, never from typing.
(function () {
  const D = window.SURAH_DATA;
  const S = D.surahs;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(3, '0');
  const fmt = n => n.toLocaleString('en-US');

  // Search text: lower case, no accents, no Arabic vowel marks, hamza forms folded, apostrophes dropped.
  const norm = s => String(s).toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[\u0623\u0625\u0622\u0671]/g, '\u0627').replace(/\u0649/g, '\u064A').replace(/\u0629/g, '\u0647')
    .replace(/[\u2019'`\u02BF\u02BE\u02BC]/g, '').replace(/[-\u2013]/g, ' ').replace(/\s+/g, ' ').trim();

  const blob = (s, withNote) => {
    const parts = [pad(s.num), s.num, s.name, s.ar, s.open, s.rev, s.diff, `level#${s.level}`, `level ${s.level}`, `${s.verses} verses`];
    if (withNote) parts.push(s.note);
    const t = norm(parts.join(' '));
    return t + ' ' + t.replace(/ /g, '');
  };
  S.forEach(s => { s._q = blob(s, false); s._qn = blob(s, true); });

  // Each word you type must be found. A bare number matches the start of a surah number; "level 3" matches level 3.
  function words(q) {
    return norm(q).replace(/level\s*(\d)/g, 'level#$1').split(' ').filter(Boolean);
  }
  function textMatch(s, ws, withNote) {
    const t = withNote ? s._qn : s._q;
    return ws.every(w => /^\d+$/.test(w) ? String(s.num).startsWith(w) : t.includes(w));
  }

  // Wrap each run of Arabic in a note so it gets the Arabic font and direction.
  const AR = '[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFC]';
  const AR_RUN = new RegExp(AR + '+(?:\\s+' + AR + '+)*', 'g');
  const withArabic = t => esc(t).replace(AR_RUN, m => `<span class="ar" lang="ar" dir="rtl">${m}</span>`);

  const ICON = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    sort: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3"/></svg>',
  };

  // Which numbers are covered. Al-Fatiha (1) and the unbroken run that ends at 114.
  const nums = S.map(s => s.num);
  let tailStart = D.quran.surahs;
  while (nums.includes(tailStart - 1)) tailStart--;
  const tail = S.filter(s => s.num >= tailStart);
  const head = S.filter(s => s.num < tailStart);
  const covers = {
    head, tail, tailStart,
    missing: D.quran.surahs - S.length,
    // "Al-Fatiha and the last 37 surahs, An-Naba to An-Nas"
    sentence: `${head.map(s => s.name).join(', ')} and the last ${tail.length} surahs, ${tail[0].name} to ${tail[tail.length - 1].name}`,
    short: `${head.map(s => `${s.name} (${s.num})`).join(', ')} and ${tailStart} to ${D.quran.surahs}`,
  };

  const levelOf = n => D.levels[n - 1];

  // The three word types, with the Arabic term the site teaches.
  const TYPES = { noun: { label: 'Noun', term: 'ism', ar: 'اسم' }, verb: { label: 'Verb', term: 'fiʿl', ar: 'فعل' }, little: { label: 'Little word', term: 'ḥarf', ar: 'حرف' } };
  // A thin bar of a surah's makeup. The counts are also in its accessible name, so colour is never the only signal.
  const compHTML = s => `<span class="comp" role="img" aria-label="${s.comp.noun} nouns, ${s.comp.verb} verbs, ${s.comp.little} little words">${['noun', 'verb', 'little'].map(t => `<i class="${t}" style="flex:${s.comp[t]}"></i>`).join('')}</span>`;
  const keyHTML = (counts) => `<ul class="key" aria-label="Word types">${Object.entries(TYPES).map(([k, t]) => `<li class="${k}"><b>${t.label}</b>${counts ? ` ${counts[k]}` : ''}</li>`).join('')}</ul>`;

  function findHTML(placeholder, controls) {
    return `<form class="find" role="search" onsubmit="return false">
      <label class="vh" for="q">Filter surahs</label>${ICON.search}
      <input id="q" type="search" autocomplete="off" placeholder="${esc(placeholder || 'Name, number or Arabic')}" aria-controls="${controls || 'list'}">
      <span class="hint" aria-hidden="true">/</span>
      <button type="button" class="clear" aria-label="Clear filter">${ICON.x}</button>
    </form>`;
  }

  function emptyHTML() {
    return `<div class="empty" id="empty" hidden><b>No surah matches that.</b><p>Only ${S.length} of the Quran's ${D.quran.surahs} surahs are analysed so far: ${esc(covers.short)}. Try a name such as “${esc(S[S.length - 1].name.replace(/^A[ln]-|^A[a-z]-/, ''))}” or a number in that range.</p><button type="button" class="btn quiet" id="reset">Show all ${S.length} surahs</button></div>`;
  }

  // Wires #q, its clear button, "/" and Escape. Calls onChange after every change.
  function wireFind(onChange) {
    const input = document.querySelector('#q');
    const form = input.closest('.find');
    const refresh = () => { form.classList.toggle('has', input.value.length > 0); onChange(); };
    input.addEventListener('input', refresh);
    form.querySelector('.clear').addEventListener('click', () => { input.value = ''; refresh(); input.focus(); });
    document.addEventListener('keydown', e => {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
      if (e.key === 'Escape' && document.activeElement === input && input.value) { input.value = ''; refresh(); }
    });
    return { get value() { return input.value; }, clear() { input.value = ''; refresh(); }, input };
  }

  // The mockups' links go nowhere on purpose; the built page links to s.href.
  const link = s => `#${s.slug}`;
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  window.SurahUI = { D, S, esc, pad, fmt, norm, words, textMatch, withArabic, ICON, covers, levelOf, TYPES, compHTML, keyHTML, findHTML, emptyHTML, wireFind, link, plural };
})();
