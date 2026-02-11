// src/scripts/navigation.ts

// Constants
const SIDEBAR_ID = 'course-navigator';
const BACKDROP_ID = 'navigator-backdrop';
const TOGGLE_ID = 'navigator-toggle';
const CLOSE_ID = 'close-navigator';
const MOBILE_BREAKPOINT = 1024;

// State
let focusTrapCleanup: (() => void) | null = null;
let sidebarInitialized = false;

// Swipe gesture state
let touchStartX = 0;
let touchStartY = 0;

// Initialize on DOM ready
export function initNavigation(): void {
  initSidebarToggle();
  initLevelSections();
  initSwipeGesture();
  restoreLevelStates();
  scrollActiveLessonIntoView();
}

// Sidebar toggle functionality
function initSidebarToggle(): void {
  if (sidebarInitialized) return;
  sidebarInitialized = true;

  // Toggle click and backdrop click are handled by NavigatorToggle component's inline script
  const closeBtn = document.getElementById(CLOSE_ID);
  closeBtn?.addEventListener('click', closeSidebar);

  // Handle Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isSidebarOpen()) {
      closeSidebar();
    }
  });

  // Handle resize - close sidebar if going to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= MOBILE_BREAKPOINT && isSidebarOpen()) {
      closeSidebar();
    }
  });
}

function isSidebarOpen(): boolean {
  return document.getElementById(SIDEBAR_ID)?.classList.contains('open') ?? false;
}

function toggleSidebar(): void {
  if (isSidebarOpen()) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function openSidebar(): void {
  const sidebar = document.getElementById(SIDEBAR_ID);
  const backdrop = document.getElementById(BACKDROP_ID);
  const toggle = document.getElementById(TOGGLE_ID);

  if (!sidebar) return;

  sidebar.classList.add('open');
  backdrop?.classList.add('visible');
  toggle?.setAttribute('aria-expanded', 'true');

  // Prevent body scroll on mobile
  document.body.style.overflow = 'hidden';

  // Enable focus trap
  focusTrapCleanup = trapFocus(sidebar);

  // Scroll active lesson into view after a brief delay for animation
  setTimeout(() => scrollActiveLessonIntoView(), 300);
}

function closeSidebar(): void {
  const sidebar = document.getElementById(SIDEBAR_ID);
  const backdrop = document.getElementById(BACKDROP_ID);
  const toggle = document.getElementById(TOGGLE_ID);

  if (!sidebar) return;

  sidebar.classList.remove('open');
  backdrop?.classList.remove('visible');
  toggle?.setAttribute('aria-expanded', 'false');

  // Restore body scroll
  document.body.style.overflow = '';

  // Disable focus trap
  focusTrapCleanup?.();
  focusTrapCleanup = null;

  // Return focus to toggle button
  toggle?.focus();
}

// Focus trap for mobile overlay
function trapFocus(container: HTMLElement): () => void {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const focusableElements = Array.from(
    container.querySelectorAll(focusableSelectors)
  ) as HTMLElement[];

  if (focusableElements.length === 0) return () => {};

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleTabKey(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  container.addEventListener('keydown', handleTabKey);
  firstFocusable?.focus();

  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

// Level section expand/collapse
function initLevelSections(): void {
  const headers = document.querySelectorAll('.level-header');

  headers.forEach((header) => {
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      const targetId = header.getAttribute('aria-controls');
      const target = targetId ? document.getElementById(targetId) : null;
      const level = header.closest('.level-section')?.getAttribute('data-level');

      if (!target || !level) return;

      const newState = !isExpanded;
      header.setAttribute('aria-expanded', String(newState));

      if (newState) {
        target.removeAttribute('hidden');
      } else {
        target.setAttribute('hidden', '');
      }

      // Persist state
      saveLevelState(Number(level), newState);
    });

    // Arrow key navigation within level
    header.addEventListener('keydown', (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      if (keyEvent.key === 'ArrowLeft' || keyEvent.key === 'ArrowRight') {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        const isRtl = document.dir === 'rtl';

        // ArrowRight expands (LTR), ArrowLeft expands (RTL)
        const shouldExpand = isRtl
          ? keyEvent.key === 'ArrowLeft'
          : keyEvent.key === 'ArrowRight';

        if (shouldExpand && !isExpanded) {
          (header as HTMLButtonElement).click();
        } else if (!shouldExpand && isExpanded) {
          (header as HTMLButtonElement).click();
        }
      }
    });
  });
}

// localStorage persistence
function saveLevelState(level: number, isExpanded: boolean): void {
  try {
    localStorage.setItem(`nav-level-${level}-expanded`, String(isExpanded));
  } catch {
    // localStorage not available, ignore
  }
}

function restoreLevelStates(): void {
  for (let level = 1; level <= 5; level++) {
    try {
      const saved = localStorage.getItem(`nav-level-${level}-expanded`);
      if (saved === 'true') {
        const section = document.querySelector(`[data-level="${level}"]`);
        const header = section?.querySelector('.level-header') as HTMLButtonElement;
        const list = section?.querySelector('.lesson-list');

        if (header && list) {
          header.setAttribute('aria-expanded', 'true');
          list.removeAttribute('hidden');
        }
      }
    } catch {
      // localStorage not available, ignore
    }
  }
}

// Scroll active lesson into view
function scrollActiveLessonIntoView(): void {
  const activeLesson = document.querySelector('.lesson-item[aria-current="page"]') as HTMLElement;
  if (!activeLesson) return;

  // Expand parent level if collapsed
  const levelSection = activeLesson.closest('.level-section');
  const levelHeader = levelSection?.querySelector('.level-header') as HTMLButtonElement;

  if (levelHeader && levelHeader.getAttribute('aria-expanded') === 'false') {
    levelHeader.click();
    // Wait for expansion animation
    setTimeout(() => {
      activeLesson.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  } else {
    activeLesson.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Swipe gesture for mobile sidebar close
function initSwipeGesture(): void {
  const sidebar = document.getElementById(SIDEBAR_ID);
  if (!sidebar) return;

  sidebar.addEventListener('touchstart', handleTouchStart, { passive: true });
  sidebar.addEventListener('touchend', handleTouchEnd, { passive: true });
}

function handleTouchStart(e: TouchEvent): void {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e: TouchEvent): void {
  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const threshold = 50; // minimum swipe distance in pixels

  // Only register horizontal swipe if it's more horizontal than vertical
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
    const isRtl = document.dir === 'rtl';

    // Swipe left in LTR closes sidebar, swipe right in RTL closes sidebar
    if ((!isRtl && deltaX < 0) || (isRtl && deltaX > 0)) {
      closeSidebar();
    }
  }
}

