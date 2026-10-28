/**
 * Pure helpers for the stepped lesson template (see docs/redesign/PLAN.md).
 * The browser script in src/scripts/lesson-steps.ts and the Astro components use these.
 */

const AR = '\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF';
const ARABIC_RUN = new RegExp(`[${AR}](?:[${AR} ]*[${AR}])?`, 'g');

/** Wrap each run of Arabic in an inline span so it gets the Arabic font and bidi isolation. */
export function wrapArabic(text: string): string {
  return text.replace(ARABIC_RUN, (run) => `<span class="ar-inline" lang="ar" dir="rtl">${run}</span>`);
}

/**
 * Escape `&`, `<` and `>` so a stray character in a title, option or answer cannot break the page,
 * and keep only the plain inline tags authors use on purpose: <b>, <i>, <u>, <em>, <strong> (no attributes).
 */
export function safeInline(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;(\/?)(b|i|u|em|strong)&gt;/g, '<$1$2>');
}

/** Text from a prop or frontmatter, made safe and with its Arabic wrapped, ready for set:html. */
export function inlineHtml(text: string): string {
  return wrapArabic(safeInline(text));
}

/** Use a non-breaking hyphen for a leading "-u" style ending so a title never breaks after the dash. */
export function tightHyphens(text: string): string {
  return text.replace(/(^|\s)-(?=[A-Za-z])/g, '$1‑');
}

/** Keep a step index inside 0..count-1. */
export function clampStep(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.max(0, Math.min(count - 1, index));
}

/** Index of the step named by a URL hash (#rule or #step-rule), or -1. */
export function stepIndexFromHash(hash: string, ids: string[]): number {
  const id = hash.replace(/^#/, '').replace(/^step-/, '');
  return id ? ids.indexOf(id) : -1;
}

/** Read the saved "where was I" map ({ lessonSlug: stepId }) and ignore anything malformed. */
export function parseResume(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(data)) if (typeof v === 'string') out[k] = v;
    return out;
  } catch {
    return {};
  }
}

/** The saved map without one lesson (used when it is finished), as a string for localStorage. */
export function omitResume(current: Record<string, string>, slug: string): string {
  const { [slug]: _gone, ...rest } = current;
  return JSON.stringify(rest);
}

/**
 * The saved map with one lesson's current step replaced, as a string for localStorage.
 * The lesson moves to the end, so the map runs from least to most recently opened.
 */
export function serializeResume(current: Record<string, string>, slug: string, stepId: string): string {
  const { [slug]: _old, ...rest } = current;
  return JSON.stringify({ ...rest, [slug]: stepId });
}
