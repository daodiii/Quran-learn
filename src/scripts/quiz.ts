/**
 * Browser script for the level quizzes and cumulative reviews (QuizLayout).
 * One question at a time: pick an answer, see at once whether it is right and why, then Next.
 * The answer locks after one pick. The score is the share of right answers; the pass mark comes from the page.
 * Without this script the page prints every question with its answer instead (a <noscript> block).
 */
import { inlineHtml } from '../lib/lesson-steps';
import { scoreOf, hasPassed, revisitList, type QuizQuestion } from '../lib/quiz';

interface Link {
  href: string;
  label: string;
}
interface QuizData {
  title: string;
  kind: 'quiz' | 'review';
  level: number;
  totalQuestions: number;
  passingScore: number;
  next: Link;
  allLessons: Link;
  questions: QuizQuestion[];
}

const TICK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const CROSS =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

const letter = (k: number) => String.fromCharCode(65 + k);
const html = (text: string) => inlineHtml(text);
const attr = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function init() {
  const card = document.getElementById('qz-card');
  const dataEl = document.getElementById('quiz-data');
  if (!card || !dataEl || card.dataset.ready) return;
  card.dataset.ready = 'true';
  const data: QuizData = JSON.parse(dataEl.textContent || '{}');
  const { questions, passingScore } = data;
  const total = questions.length;
  const label = data.kind === 'quiz' ? 'Quiz' : 'Review';

  let cur = 0;
  const picks: (number | null)[] = new Array(total).fill(null);
  const isRight = (i: number) => picks[i] === questions[i].correctAnswer;

  function dotsHTML(i: number, finished: boolean) {
    const items = questions.map((_, k) => {
      const answered = picks[k] !== null;
      const cls = answered ? (isRight(k) ? 'r' : 'w') : k === i && !finished ? 'on' : '';
      const state = answered ? (isRight(k) ? 'right' : 'wrong') : k === i && !finished ? 'current question' : 'not answered';
      return `<li class="${cls}"${k === i && !finished ? ' aria-current="step"' : ''}><span aria-hidden="true">${
        answered ? (isRight(k) ? TICK : CROSS) : k + 1
      }</span><span class="qz-vh">Question ${k + 1}, ${state}</span></li>`;
    });
    return `<ol class="qz-dots" aria-label="Questions">${items.join('')}</ol>`;
  }

  function feedbackHTML(i: number) {
    const q = questions[i];
    const right = isRight(i);
    return `<div class="qz-fb ${right ? 'is-right' : 'is-wrong'}">
      <span class="qz-fb-i" aria-hidden="true">${right ? TICK : CROSS}</span>
      <p class="qz-fb-h">${right ? 'Correct.' : `Not quite. The answer is ${letter(q.correctAnswer)}.`}</p>
      ${q.explanation ? `<p class="qz-fb-w">${html(q.explanation)}</p>` : ''}
      ${
        q.lessons.length
          ? `<p class="qz-fb-l">Lesson: ${q.lessons.map((l) => `<a href="${attr(l.href)}">${html(l.label)}</a>`).join(' · ')}</p>`
          : ''
      }
    </div>`;
  }

  function renderQuestion(focusQuestion: boolean) {
    const q = questions[cur];
    const long = q.options.some((o) => o.length > 34);
    card!.innerHTML = `
      <div class="qz-top"><span class="qz-top-label">${attr(data.title)}</span>${dotsHTML(cur, false)}</div>
      <p class="qz-n">Question ${cur + 1} of ${total}</p>
      <h2 class="qz-q" id="qz-qh" tabindex="-1" data-testid="quiz-question">${html(q.question)}</h2>
      <div class="qz-opts${long ? ' one' : ''}" role="group" aria-labelledby="qz-qh">
        ${q.options
          .map(
            (o, k) =>
              `<button type="button" class="qz-opt" data-k="${k}" data-testid="quiz-option-${k}"><span class="qz-ol" aria-hidden="true">${letter(k)}</span><span class="qz-ot">${html(o)}</span><span class="qz-otag"></span></button>`
          )
          .join('')}
      </div>
      <div class="qz-foot">
        <div class="qz-idle" id="qz-status" role="status">Pick one answer. You see why straight away.</div>
        <button type="button" class="qz-btn qz-btn-primary" id="qz-next" data-testid="next-btn" disabled>${cur === total - 1 ? 'See results' : 'Next question'}</button>
      </div>`;
    card!.querySelectorAll<HTMLButtonElement>('.qz-opt').forEach((b) => b.addEventListener('click', () => pick(+b.dataset.k!, b)));
    card!.querySelector('#qz-next')!.addEventListener('click', onNext);
    if (focusQuestion) {
      // preventScroll: the focus call would otherwise scroll the page to about 10 px from the top, where the site
      // header changes size and the page bounces. Scroll the card to the top of the screen ourselves instead.
      card!.querySelector<HTMLElement>('#qz-qh')!.focus({ preventScroll: true });
      card!.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
    }
  }

  // Lock the options, mark them, show the reason, and turn the Next button on. The DOM is changed in place so focus stays put.
  function pick(k: number, button: HTMLButtonElement) {
    if (picks[cur] !== null) return;
    picks[cur] = k;
    const q = questions[cur];
    card!.querySelectorAll<HTMLButtonElement>('.qz-opt').forEach((b) => {
      const j = +b.dataset.k!;
      b.setAttribute('aria-disabled', 'true');
      if (b !== button) b.tabIndex = -1;
      const mark = b.querySelector('.qz-ol')!;
      const tag = b.querySelector('.qz-otag')!;
      if (j === q.correctAnswer) {
        b.classList.add('right');
        mark.innerHTML = TICK;
        tag.textContent = k === j ? 'Your answer, correct' : 'Correct answer';
      } else if (j === k) {
        b.classList.add('wrong');
        mark.innerHTML = CROSS;
        tag.textContent = 'Your answer';
      } else {
        b.classList.add('dim');
      }
    });
    card!.querySelector('.qz-dots')!.outerHTML = dotsHTML(cur, false);
    const status = card!.querySelector<HTMLElement>('#qz-status')!;
    status.className = 'qz-idle qz-live';
    status.innerHTML = feedbackHTML(cur);
    const nextBtn = card!.querySelector<HTMLButtonElement>('#qz-next')!;
    nextBtn.disabled = false;
    // Bring the reason into view if it is below the fold. Never park the page between 1 and 47 px from the top: the
    // site header (src/components/Header.astro) changes size at 10 px of scroll, and a page parked there bounces.
    const below = status.getBoundingClientRect().bottom + 16 - window.innerHeight;
    if (below > 0) {
      window.scrollTo({ top: Math.max(window.scrollY + below, 48), behavior: reduced() ? 'auto' : 'smooth' });
    }
  }

  function onNext() {
    if (picks[cur] === null) return;
    if (cur === total - 1) {
      renderResults();
    } else {
      cur++;
      renderQuestion(true);
    }
  }

  function renderResults() {
    const { right, percent } = scoreOf(picks, questions);
    const ok = hasPassed(percent, passingScore);
    const revisit = revisitList(picks, questions);
    const plural = (n: number[]) => (n.length === 1 ? `question ${n[0]}` : `questions ${n.join(', ')}`);
    const revisitHTML = revisit.length
      ? `<h2>Lessons to revisit</h2><ul>${revisit
          .map((r) =>
            r.lesson
              ? `<li><a href="${attr(r.lesson.href)}">${html(r.lesson.label)}</a><p>You missed ${plural(r.questions)}.</p></li>`
              : `<li><a href="${attr(data.allLessons.href)}">All Level ${data.level} lessons</a><p>You missed ${plural(r.questions)}. No single lesson is named for ${r.questions.length === 1 ? 'it' : 'them'}.</p></li>`
          )
          .join('')}</ul>`
      : `<h2>Nothing to revisit</h2><p class="qz-fb-w">You answered every question correctly.</p>`;
    const answersHTML = questions
      .map((q, i) => {
        const r = isRight(i);
        return `<details><summary><span class="qz-mk ${r ? 'r' : 'w'}" aria-hidden="true">${r ? TICK : CROSS}</span><span class="qz-qt">${i + 1}. ${html(q.question)}</span><span class="qz-st">${r ? 'Right' : 'Wrong'}</span></summary>
        <div class="qz-body"><p>Your answer: ${html(q.options[picks[i] as number])}</p>${r ? '' : `<p>Correct answer: ${html(q.options[q.correctAnswer])}</p>`}${q.explanation ? `<p>${html(q.explanation)}</p>` : ''}${
          q.lessons.length ? `<p>Lesson: ${q.lessons.map((l) => `<a href="${attr(l.href)}">${html(l.label)}</a>`).join(' · ')}</p>` : ''
        }</div></details>`;
      })
      .join('');
    const nextLink = (primary: boolean) => `<a class="qz-btn${primary ? ' qz-btn-primary' : ''}" href="${attr(data.next.href)}">${html(data.next.label)}</a>`;
    const retry = (primary: boolean) => `<button type="button" class="qz-btn${primary ? ' qz-btn-primary' : ''}" id="qz-retry" data-testid="retry-btn">Try again</button>`;
    card!.innerHTML = `
      <div class="qz-top"><span class="qz-top-label">${attr(data.title)} · results</span>${dotsHTML(0, true)}</div>
      <div data-testid="quiz-results">
        <h2 class="qz-res-h" id="qz-res-h" tabindex="-1">${ok ? 'You passed.' : 'Not yet.'}</h2>
        <p class="qz-score"><b data-testid="quiz-score">${right} of ${total}</b> right (${percent}%). The pass mark is ${passingScore}%.</p>
        <div class="qz-meter" role="img" aria-label="${percent} percent. The pass mark is ${passingScore} percent."><i style="inline-size:${percent}%"></i><u style="inset-inline-start:${passingScore}%"></u></div>
        <p class="qz-meter-note">The line marks the pass mark.</p>
        <div class="qz-rev">${revisitHTML}</div>
        <div class="qz-acts">
          ${ok ? `${nextLink(true)}${retry(false)}` : `${retry(true)}${nextLink(false)}`}
          <a class="qz-btn" href="${attr(data.allLessons.href)}">${html(data.allLessons.label)}</a>
        </div>
        <div class="qz-all"><h2>Your answers</h2>${answersHTML}</div>
      </div>`;
    card!.querySelector('#qz-retry')!.addEventListener('click', () => {
      picks.fill(null);
      cur = 0;
      renderQuestion(true);
    });
    const heading = card!.querySelector<HTMLElement>('#qz-res-h')!;
    heading.focus({ preventScroll: true });
    card!.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
  }

  card.hidden = false;
  card.setAttribute('aria-label', `${label}: ${data.title}`);
  renderQuestion(false);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
