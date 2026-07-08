// Parse freeform verse references ("Surah Al-Fatiha 1:2", "93:1-3") to the
// FIRST cited ayah. Used to derive recitation audio URLs at build time.
export interface AyahRef { surah: number; ayah: number }

const REF_RE = /(\d{1,3}):(\d{1,3})/;

export function parseAyahRef(reference: string): AyahRef | null {
  const m = reference.match(REF_RE);
  if (!m) return null;
  const surah = Number(m[1]), ayah = Number(m[2]);
  if (surah < 1 || surah > 114 || ayah < 1) return null;
  return { surah, ayah };
}

export function ayahAudioUrl({ surah, ayah }: AyahRef): string {
  const pad = (n: number) => String(n).padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${pad(surah)}${pad(ayah)}.mp3`;
}
