// src/lib/finder-saved.ts
// "My words" for the finder: a saved list and a short, plain review. Kept on this device only.
// Spacing is a simple five-box ladder (Leitner): a word you knew moves up a box and comes back later; a word
// you did not know goes to the first box and comes back soon. No points, no streaks.

export interface Saved { k: string; box: number; due: number; added: number }

const DAY = 86_400_000;
export const GAPS = [10 * 60_000, 1 * DAY, 3 * DAY, 7 * DAY, 14 * DAY];   // wait before a word is due again, by box
export const KEY = 'qg-finder-words';

export function parse(raw: string | null): Saved[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    if (!v || v.v !== 1 || !Array.isArray(v.words)) return [];
    return v.words.filter((w: Saved) => typeof w?.k === 'string' && Number.isFinite(w.box) && Number.isFinite(w.due));
  } catch { return []; }
}
export const serialize = (list: Saved[]): string => JSON.stringify({ v: 1, words: list });

export function readList(): Saved[] {
  try { return parse(localStorage.getItem(KEY)); } catch { return []; }
}
export function writeList(list: Saved[]): boolean {
  try { localStorage.setItem(KEY, serialize(list)); return true; } catch { return false; }
}

export const has = (list: Saved[], k: string) => list.some(w => w.k === k);
export function add(list: Saved[], k: string, now: number): Saved[] {
  return has(list, k) ? list : [...list, { k, box: 0, due: now, added: now }];
}
export const remove = (list: Saved[], k: string): Saved[] => list.filter(w => w.k !== k);

export function due(list: Saved[], now: number, limit = 10): Saved[] {
  return list.filter(w => w.due <= now).sort((a, b) => a.due - b.due).slice(0, limit);
}
export function answer(list: Saved[], k: string, knew: boolean, now: number): Saved[] {
  return list.map(w => {
    if (w.k !== k) return w;
    const box = knew ? Math.min(w.box + 1, GAPS.length - 1) : 0;
    return { ...w, box, due: now + GAPS[box] };
  });
}
