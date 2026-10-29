// Shared by the three quiz mockups. Real questions (quiz-data.js), real scoring (percent >= passingScore).
// Demo states: ?state=wrong (question 3 answered wrongly), ?state=pass (results, 5 of 6), ?state=fail (results, 3 of 6).
(function () {
  const D = window.QUIZ;
  const Q = D.questions;
  const picks = new Array(Q.length).fill(null);
  const ICON_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const ICON_NO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // Arabic runs get the lesson's inline Arabic style (Hafs, larger, right to left).
  const AR = /[؀-ۿݐ-ݿ][؀-ۿݐ-ݿ‌-‎]*(?:[\s ]+[؀-ۿݐ-ݿ][؀-ۿݐ-ݿ‌-‎]*)*/g;
  const rich = (s) => esc(s).replace(AR, (m) => `<span class="ar-inline" lang="ar" dir="rtl">${m}</span>`);
  const refsOf = (q) => [...new Set(q.explanation.match(/L[1-5]\.\d{2}/g) || [])];
  const lessonLink = (ref) => {
    const l = D.lessons[ref];
    return l ? `<a href="/learn/${l.id}/">${ref} ${esc(l.title)}</a>` : esc(ref);
  };
  const isRight = (i) => picks[i] === Q[i].correctAnswer;
  const answered = () => picks.filter((p) => p !== null).length;
  const score = () => Q.reduce((n, _, i) => n + (isRight(i) ? 1 : 0), 0);
  const percent = () => Math.round((score() / Q.length) * 100);
  const passed = () => percent() >= D.passingScore;
  const letter = (k) => String.fromCharCode(65 + k);

  // One answer option, before and after the answer.
  function optHTML(q, k, state) {
    const cls = ['opt'];
    let mark = letter(k), tag = '';
    if (state) {
      cls.push(...state.cls);
      if (state.mark) mark = state.mark;
      tag = state.tag || '';
    }
    return `<button type="button" class="${cls.join(' ')}" data-k="${k}"${state ? ' aria-disabled="true"' : ''}><span class="ol" aria-hidden="true">${mark}</span><span class="ot">${rich(q.options[k])}</span><span class="otag">${tag}</span></button>`;
  }
  function optsHTML(i) {
    const q = Q[i], p = picks[i];
    return q.options.map((_, k) => {
      if (p === null) return optHTML(q, k, null);
      if (k === q.correctAnswer) return optHTML(q, k, { cls: ['right'], mark: ICON_OK, tag: p === k ? 'Your answer, correct' : 'Correct answer' });
      if (k === p) return optHTML(q, k, { cls: ['wrong'], mark: ICON_NO, tag: 'Your answer' });
      return optHTML(q, k, { cls: ['dim'] });
    }).join('');
  }
  function feedbackHTML(i) {
    const q = Q[i], right = isRight(i);
    const refs = refsOf(q);
    return `<span class="fb-i" aria-hidden="true">${right ? ICON_OK : ICON_NO}</span>
      <p class="fb-h">${right ? 'Correct.' : `Not quite. The answer is ${letter(q.correctAnswer)}.`}</p>
      <p class="fb-w">${rich(q.explanation)}</p>
      ${refs.length ? `<p class="fb-l">Lesson: ${refs.map(lessonLink).join(' · ')}</p>` : ''}`;
  }

  // Results: the lessons to open again, built from the missed questions' lesson references.
  function revisitHTML() {
    const missed = Q.map((q, i) => i).filter((i) => !isRight(i));
    if (!missed.length) return '<h2>Nothing to revisit</h2><p class="fb-w">You answered every question correctly.</p>';
    const byRef = new Map();
    missed.forEach((i) => {
      const refs = refsOf(Q[i]);
      (refs.length ? refs : ['']).forEach((r) => byRef.set(r, [...(byRef.get(r) || []), i]));
    });
    const items = [...byRef.entries()].map(([ref, idx]) => {
      const qs = idx.map((i) => `question ${i + 1}`).join(', ');
      return ref
        ? `<li><a href="/learn/${D.lessons[ref]?.id}/">${ref} ${esc(D.lessons[ref]?.title || '')}</a><p>Missed: ${qs}</p></li>`
        : `<li><a href="/learn/#level-5">All Level 5 lessons</a><p>Missed: ${qs} (no single lesson named)</p></li>`;
    });
    return `<h2>Lessons to revisit</h2><ul>${items.join('')}</ul>`;
  }
  function allAnswersHTML() {
    return `<div class="all"><h2 style="font-size:1.2rem;font-weight:500;margin-bottom:.4rem">Your answers</h2>${Q.map((q, i) => {
      const r = isRight(i);
      return `<details><summary><span class="mk ${r ? 'r' : 'w'}" aria-hidden="true">${r ? ICON_OK : ICON_NO}</span><span class="qt">${i + 1}. ${rich(q.question)}</span><span class="st">${r ? 'Right' : 'Wrong'}</span></summary>
      <div class="body"><p>Your answer: ${rich(q.options[picks[i]])}</p>${r ? '' : `<p>Correct answer: ${rich(q.options[q.correctAnswer])}</p>`}<p>${rich(q.explanation)}</p></div></details>`;
    }).join('')}</div>`;
  }
  function resultHTML(extra) {
    const ok = passed();
    return `<h1 class="res-h">${ok ? 'You passed.' : 'Not yet.'}</h1>
      <p class="res-score"><b>${score()} of ${Q.length}</b> right (${percent()}%). The pass mark is ${D.passingScore}%.</p>
      <div class="res-bar" role="img" aria-label="${percent()} percent, pass mark ${D.passingScore} percent"><i style="width:${percent()}%"></i><u style="left:${D.passingScore}%"></u></div>
      <p class="res-mark">Line = pass mark</p>
      <div class="rev" style="margin-top:2rem">${revisitHTML()}</div>
      <div class="acts">
        ${ok ? `<a class="btn btn-primary" href="/surahs/">Read a surah now</a><button type="button" class="btn" data-retry>Try again</button>` : `<button type="button" class="btn btn-primary" data-retry>Try again</button>`}
        <a class="btn" href="/learn/#level-5">All lessons</a>
      </div>
      ${allAnswersHTML()}${extra || ''}`;
  }

  // The states used by ?state=
  function preset(name) {
    const wrongPick = (i) => (Q[i].correctAnswer + 1) % Q[i].options.length;
    if (name === 'wrong') { for (let i = 0; i < 2; i++) picks[i] = Q[i].correctAnswer; picks[2] = wrongPick(2); }
    if (name === 'pass' || name === 'fail') {
      const wrongs = name === 'pass' ? [2] : [1, 2, 4];
      Q.forEach((q, i) => { picks[i] = wrongs.includes(i) ? wrongPick(i) : q.correctAnswer; });
    }
    return name;
  }
  window.QZ = { D, Q, picks, esc, rich, refsOf, isRight, answered, score, percent, passed, letter, optsHTML, feedbackHTML, resultHTML, preset, ICON_OK, ICON_NO,
    state: new URLSearchParams(location.search).get('state') };
})();
