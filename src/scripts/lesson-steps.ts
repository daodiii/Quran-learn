/**
 * Browser script for the stepped lesson template (LessonStepsLayout).
 * Shows one <Step> at a time, builds the progress bar, handles Back/Next, the arrow keys,
 * quick checks, "where was I" memory, and the complete button. Without this script every step
 * stays visible, so the lesson still reads top to bottom.
 */
import { clampStep, stepIndexFromHash, parseResume, serializeResume, omitResume, groupParts, partOf } from '../lib/lesson-steps';
import { markLessonComplete, isLessonComplete } from '../lib/progress';

const RESUME_KEY = 'quran-learn-lesson-step';

function readResume(): Record<string, string> {
  try {
    return parseResume(localStorage.getItem(RESUME_KEY));
  } catch {
    return {};
  }
}

function writeResume(slug: string, stepId: string) {
  try {
    localStorage.setItem(RESUME_KEY, serializeResume(readResume(), slug, stepId));
  } catch {
    /* storage can be blocked; the lesson still works */
  }
}

function clearResume(slug: string) {
  try {
    localStorage.setItem(RESUME_KEY, omitResume(readResume(), slug));
  } catch {
    /* storage can be blocked */
  }
}

function init() {
  const root = document.querySelector<HTMLElement>('[data-lx]');
  if (!root || root.dataset.lxReady) return;
  const steps = [...root.querySelectorAll<HTMLElement>('.lx-step')];
  if (steps.length === 0) return;
  root.dataset.lxReady = 'true';

  const slug = root.dataset.lessonSlug ?? '';
  const ids = steps.map((s) => s.dataset.stepId ?? '');
  // Authoring mistakes that would break the hash, the saved step or the page outline.
  if (new Set(ids).size !== ids.length) console.warn('[lesson-steps] duplicate <Step id> values:', ids);
  if (root.querySelectorAll('h1').length !== 1) console.warn('[lesson-steps] a stepped lesson needs exactly one <Step hero>');
  const stepCountNote = root.querySelector<HTMLElement>('[data-lx-step-count]');
  if (stepCountNote) stepCountNote.textContent = `, ${steps.length} steps`;
  // Big steps: number the blocks inside each step ("3 of 8").
  steps.forEach((s) => {
    const blocks = [...s.querySelectorAll<HTMLElement>('.lx-block[data-block]')];
    blocks.forEach((b, k) => {
      const n = b.querySelector<HTMLElement>('.lx-block-n');
      if (n) n.textContent = `${k + 1} of ${blocks.length}`;
    });
    // A step with several blocks gets a short "On this page" list that the reader can hide.
    if (blocks.length >= 3) {
      let open = true;
      try { open = localStorage.getItem('lx-toc') !== 'closed'; } catch { /* storage blocked: stay open */ }
      const toc = document.createElement('details');
      toc.className = 'lx-toc';
      toc.open = open;
      const sum = document.createElement('summary');
      sum.textContent = 'On this page';
      const list = document.createElement('ol');
      blocks.forEach((b) => {
        const h = b.querySelector<HTMLElement>('.lx-block-h');
        const t = h?.querySelector<HTMLElement>(':scope > span:not(.lx-block-n)')?.textContent?.trim();
        if (!t || !b.id) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${b.id}`;
        a.textContent = t;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          b.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        li.appendChild(a);
        list.appendChild(li);
      });
      toc.append(sum, list);
      toc.addEventListener('toggle', () => {
        try { localStorage.setItem('lx-toc', toc.open ? 'open' : 'closed'); } catch { /* ignore */ }
        document.querySelectorAll<HTMLDetailsElement>('.lx-toc').forEach((o) => { if (o !== toc) o.open = toc.open; });
      });
      s.querySelector('.lx-head')?.after(toc);
    }
  });
  const bar = root.querySelector<HTMLElement>('.lx-bar')!;
  const back = root.querySelector<HTMLButtonElement>('[data-lx-back]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-lx-next]')!;
  const count = root.querySelector<HTMLElement>('[data-lx-count]')!;
  const finish = root.querySelector<HTMLElement>('[data-lx-finish]')!;
  const nextHref = root.dataset.next;
  let current = 0;
  let finished = false; // lesson already marked complete: stop remembering the step

  // Progress bar: one segment per step. A lesson that names its parts gets one segment per part,
  // and only the current part opens up into its steps (34 step segments do not fit on a phone).
  const parts = groupParts(steps.map((s) => s.dataset.stepPart));
  const partEls: HTMLElement[] = [];
  const segs: HTMLElement[] = [];
  let partName: HTMLElement | null = null;
  const holders: HTMLElement[] = parts.length
    ? parts.map((p, pi) => {
        const wrap = document.createElement('div');
        wrap.className = 'lx-part';
        const pb = document.createElement('button');
        pb.type = 'button';
        pb.className = 'lx-part-btn';
        pb.title = p.name;
        pb.setAttribute('aria-label', `Part ${pi + 1} of ${parts.length}: ${p.name}`);
        pb.addEventListener('click', () => show(p.start, { focus: true }));
        const inner = document.createElement('div');
        inner.className = 'lx-part-steps';
        wrap.append(pb, inner);
        bar.appendChild(wrap);
        partEls.push(wrap);
        return inner;
      })
    : [bar];
  if (parts.length) {
    bar.classList.add('lx-bar-parts');
    partName = document.createElement('p');
    partName.className = 'lx-partname';
    bar.appendChild(partName);
  }
  steps.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lx-seg';
    b.title = s.dataset.stepLabel ?? `Step ${i + 1}`;
    b.setAttribute('aria-label', `Step ${i + 1} of ${steps.length}: ${s.dataset.stepLabel ?? ''}`);
    b.addEventListener('click', () => show(i, { focus: true }));
    holders[parts.length ? partOf(parts, i) : 0].appendChild(b);
    segs.push(b);
  });

  function show(index: number, opts: { focus?: boolean; scroll?: boolean; force?: boolean } = {}) {
    const target = clampStep(index, steps.length);
    if (target === current && !opts.force) return; // already there (for example an arrow key at the first or last step)
    current = target;
    steps.forEach((s, i) => (s.hidden = i !== current));
    segs.forEach((seg, i) => {
      seg.classList.toggle('on', i === current);
      seg.classList.toggle('done', i < current);
      if (i === current) seg.setAttribute('aria-current', 'step');
      else seg.removeAttribute('aria-current');
    });
    if (parts.length) {
      const cp = partOf(parts, current);
      partEls.forEach((el, pi) => {
        el.classList.toggle('on', pi === cp);
        el.classList.toggle('done', pi < cp);
      });
      if (partName) partName.textContent = `Part ${cp + 1} of ${parts.length}: ${parts[cp].name}`;
    }
    const last = current === steps.length - 1;
    count.textContent = `Step ${current + 1} of ${steps.length}`;
    back.disabled = current === 0;
    next.textContent = last ? (nextHref ? 'Next lesson' : 'Done') : 'Next';
    next.disabled = last && !nextHref;
    finish.hidden = !last;
    history.replaceState(null, '', `#${ids[current]}`);
    if (!finished) writeResume(slug, ids[current]);
    if (opts.scroll !== false) window.scrollTo({ top: 0 });
    if (opts.focus) steps[current].querySelector<HTMLElement>('.lx-title')?.focus({ preventScroll: true });
  }

  back.addEventListener('click', () => show(current - 1, { focus: true }));
  next.addEventListener('click', () => {
    if (current === steps.length - 1) {
      if (nextHref) location.href = nextHref;
      return;
    }
    show(current + 1, { focus: true });
  });
  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea, select, summary, [contenteditable], [role="dialog"], .lx-check, .lx-parse') || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    if (e.key === 'ArrowRight') show(current + 1, { focus: true });
    if (e.key === 'ArrowLeft') show(current - 1, { focus: true });
  });
  window.addEventListener('hashchange', () => {
    const i = stepIndexFromHash(location.hash, ids);
    if (i >= 0 && i !== current) show(i, { focus: true });
  });

  // Quick checks.
  root.querySelectorAll<HTMLElement>('.lx-check').forEach((check) => {
    const answer = Number(check.dataset.answer);
    const fb = check.querySelector<HTMLElement>('.lx-fb')!;
    const why = check.querySelector<HTMLElement>('.lx-why')!;
    const opts = [...check.querySelectorAll<HTMLButtonElement>('.lx-opt')];
    opts.forEach((o) =>
      o.addEventListener('click', () => {
        if (check.classList.contains('solved')) return; // a right answer locks the question
        const right = Number(o.dataset.k) === answer;
        opts.forEach((x) => x.classList.remove('wrong'));
        if (right) {
          o.classList.add('right');
          check.classList.add('solved');
          opts.forEach((x) => x.setAttribute('aria-disabled', x === o ? 'false' : 'true'));
          fb.textContent = 'Right.';
          why.hidden = false;
        } else {
          o.classList.add('wrong');
          fb.textContent = 'Not quite. Try another.';
          why.hidden = true;
        }
        fb.hidden = false;
      }),
    );
  });

  // Parse panels: one card at a time, with its word (or words) lit in the verse.
  // Without this script every card is listed under the verse.
  root.querySelectorAll<HTMLElement>('.lx-parse').forEach((parse) => {
    const words = [...parse.querySelectorAll<HTMLElement>('.lx-pw')];
    const cards = [...parse.querySelectorAll<HTMLElement>('.lx-pcard')];
    const prev = parse.querySelector<HTMLButtonElement>('[data-lx-pprev]');
    const fwd = parse.querySelector<HTMLButtonElement>('[data-lx-pnext]');
    const pos = parse.querySelector<HTMLElement>('[data-lx-ppos]');
    if (!cards.length || !prev || !fwd || !pos) return;
    let k = 0;
    const go = (n: number) => {
      k = clampStep(n, cards.length);
      cards.forEach((c, i) => (c.hidden = i !== k));
      const lit = (cards[k].dataset.at ?? '').split(',').map(Number);
      words.forEach((w, i) => w.classList.toggle('lit', lit.includes(i)));
      prev.disabled = k === 0;
      fwd.disabled = k === cards.length - 1;
      pos.textContent = `${k + 1} of ${cards.length}`;
    };
    prev.addEventListener('click', () => go(k - 1));
    fwd.addEventListener('click', () => go(k + 1));
    parse.classList.add('lx-parse-js');
    go(0);
  });

  // Complete button (same storage as the classic lessons).
  const completeBtn = root.querySelector<HTMLButtonElement>('[data-lx-complete]')!;
  const completeText = root.querySelector<HTMLElement>('[data-lx-complete-text]')!;
  const completeStatus = root.querySelector<HTMLElement>('[data-lx-complete-status]')!;
  const markDone = () => {
    completeBtn.hidden = true;
    completeStatus.hidden = false;
    finished = true;
    clearResume(slug); // a finished lesson reopens at its start
  };
  isLessonComplete(slug).then((done) => done && markDone());
  completeBtn.addEventListener('click', async () => {
    completeBtn.disabled = true;
    completeText.textContent = 'Saving…';
    if (await markLessonComplete(slug)) markDone();
    else {
      completeBtn.disabled = false;
      completeText.textContent = 'Mark lesson complete';
    }
  });

  // Start where the URL says, else where the learner left off, else at the start.
  root.classList.add('lx-js');
  let start = stepIndexFromHash(location.hash, ids);
  if (start < 0) start = ids.indexOf(readResume()[slug]);
  show(start < 0 ? 0 : start, { scroll: false, force: true });
  document.documentElement.classList.remove('lx-pending');
}

// The site does not use view transitions, so the page loads fresh each time and init runs once.
// (Back leaves the lesson rather than going to the previous step, because steps use replaceState.)
init();
