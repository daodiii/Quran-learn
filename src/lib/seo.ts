/**
 * Meta text for search results. Google cuts a title near 60 characters and a description near 160, so every
 * layout runs its text through these two functions. Nothing is cut in the middle of a word, and a description
 * keeps whole sentences when it can.
 */
export const SITE_NAME = 'Quranic Grammar';
const TITLE_MAX = 60;
const DESC_MAX = 155;

const clean = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/[*_`#]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Cut at the last space that leaves room for the ellipsis, then drop trailing punctuation. */
function cutAtWord(s: string, max: number): string {
  if (s.length <= max) return s;
  const room = s.slice(0, max - 1);
  const space = room.lastIndexOf(' ');
  const head = (space > max * 0.5 ? room.slice(0, space) : room).replace(/[\s,;:(—–-]+$/u, '');
  return `${head}…`;
}

/** A page title of at most 60 characters. Drops the site name first, then shortens the page name. */
export function metaTitle(full: string): string {
  const t = clean(full);
  if (t.length <= TITLE_MAX) return t;
  const suffix = ` | ${SITE_NAME}`;
  const bare = t.endsWith(suffix) ? t.slice(0, -suffix.length) : t;
  return cutAtWord(bare, TITLE_MAX);
}

/** A description of at most 155 characters: whole sentences if the first one fits, else cut at a word. */
export function metaDescription(text: string, max: number = DESC_MAX): string {
  const t = clean(text);
  if (t.length <= max) return t;
  const sentences = t.split(/(?<=[.!?])\s+/);
  let out = '';
  for (const s of sentences) {
    const next = out ? `${out} ${s}` : s;
    if (next.length > max) break;
    out = next;
  }
  return out.length >= 60 ? out : cutAtWord(t, max);
}
