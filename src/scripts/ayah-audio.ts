// Plays the recitation behind any `.ayah-play` button. One delegated click handler for the page;
// Astro loads this module once however many components import it.
let current: HTMLAudioElement | null = null;
let currentBtn: HTMLElement | null = null;

document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest('.ayah-play') as HTMLElement | null;
  if (!btn || btn.hasAttribute('disabled')) return;
  if (currentBtn === btn && current) {
    if (current.paused) {
      current.play();
      btn.classList.add('playing');
    } else {
      current.pause();
      btn.classList.remove('playing');
    }
    return;
  }
  current?.pause();
  currentBtn?.classList.remove('playing');
  current = new Audio(btn.dataset.audioSrc!); // fetched on demand, never preloaded
  currentBtn = btn;
  btn.classList.add('playing');
  current.play().catch(() => {
    btn.classList.add('unavailable');
    btn.setAttribute('disabled', '');
  });
  current.addEventListener('ended', () => btn.classList.remove('playing'));
  current.addEventListener('error', () => {
    btn.classList.add('unavailable');
    btn.setAttribute('disabled', '');
    btn.classList.remove('playing');
  });
});
