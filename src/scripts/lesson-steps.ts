/**
 * Browser script for the stepped lesson template (LessonStepsLayout).
 * Shows one <Step> at a time, builds the progress bar, handles Back/Next, the arrow keys,
 * quick checks, "where was I" memory, and the complete button. Without this script every step
 * stays visible, so the lesson still reads top to bottom.
 */
import { clampStep, stepIndexFromHash, parseResume, serializeResume } from '../lib/lesson-steps';
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

function init() {
  const root = document.querySelector<HTMLElement>('[data-lx]');
  if (!root || root.dataset.lxReady) return;
  const steps = [...root.querySelectorAll<HTMLElement>('.lx-step')];
  if (steps.length === 0) return;
  root.dataset.lxReady = 'true';

  const slug = root.dataset.lessonSlug ?? '';
  const ids = steps.map((s) => s.dataset.stepId ?? '');
  const bar = root.querySelector<HTMLElement>('.lx-bar')!;
  const back = root.querySelector<HTMLButtonElement>('[data-lx-back]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-lx-next]')!;
  const count = root.querySelector<HTMLElement>('[data-lx-count]')!;
  const finish = root.querySelector<HTMLElement>('[data-lx-finish]')!;
  const nextHref = root.dataset.next;
  let current = 0;

  // Progress bar: one segment per step.
  steps.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lx-seg';
    b.title = s.dataset.stepLabel ?? `Step ${i + 1}`;
    b.setAttribute('aria-label', `Step ${i + 1} of ${steps.length}: ${s.dataset.stepLabel ?? ''}`);
    b.addEventListener('click', () => show(i, { focus: true }));
    bar.appendChild(b);
    const num = s.querySelector<HTMLElement>('.lx-num');
    const of = s.querySelector<HTMLElement>('.lx-of');
    if (num) num.textContent = String(i + 1).padStart(2, '0');
    if (of) of.textContent = `Step ${i + 1} of ${steps.length}`;
  });
  const segs = [...bar.children] as HTMLElement[];

  function show(index: number, opts: { focus?: boolean; scroll?: boolean } = {}) {
    current = clampStep(index, steps.length);
    steps.forEach((s, i) => (s.hidden = i !== current));
    segs.forEach((seg, i) => {
      seg.classList.toggle('on', i === current);
      seg.classList.toggle('done', i < current);
      if (i === current) seg.setAttribute('aria-current', 'step');
      else seg.removeAttribute('aria-current');
    });
    const last = current === steps.length - 1;
    count.textContent = `Step ${current + 1} of ${steps.length}`;
    back.disabled = current === 0;
    next.textContent = last ? (nextHref ? 'Next lesson' : 'Done') : current === 0 ? 'Start' : 'Next';
    next.disabled = last && !nextHref;
    finish.hidden = !last;
    history.replaceState(null, '', `#${ids[current]}`);
    writeResume(slug, ids[current]);
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
    if (t.closest('input, textarea, select, .lx-check') || e.metaKey || e.ctrlKey || e.altKey) return;
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
        const right = Number(o.dataset.k) === answer;
        opts.forEach((x) => x.classList.remove('wrong'));
        if (right) {
          o.classList.add('right');
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

  // Complete button (same storage as the classic lessons).
  const completeBtn = root.querySelector<HTMLButtonElement>('[data-lx-complete]')!;
  const completeText = root.querySelector<HTMLElement>('[data-lx-complete-text]')!;
  const completeStatus = root.querySelector<HTMLElement>('[data-lx-complete-status]')!;
  const markDone = () => {
    completeBtn.hidden = true;
    completeStatus.hidden = false;
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
  show(start < 0 ? 0 : start, { scroll: false });
}

init();
document.addEventListener('astro:page-load', init);
