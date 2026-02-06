/**
 * Announce progress changes to screen readers via ARIA live region.
 * Uses [data-progress-announcer] element rendered by AriaLiveRegion.astro.
 */
export function announceProgress(message: string): void {
  const announcer = document.querySelector('[data-progress-announcer]');
  if (!announcer) return;

  // Set announcement text
  announcer.textContent = message;

  // Clear after 1 second to allow re-announcement of same message
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
}
