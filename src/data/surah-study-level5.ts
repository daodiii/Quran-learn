// Plain-English teaching layer for the surahs read after Level 5: An-Naba, An-Naziat, Abasa, At-Takwir, Al-Infitar,
// Al-Mutaffifin, Al-Inshiqaq, Al-Buruj and Al-Ghashiyah. Same shape and rules as in surah-study.ts. Each surah is in
// its own file in surah-study-level5/ because together they hold 285 verses.
//
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Where al-Jadwal gives more than one reading, the line says which one it follows. Someone
// who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from './surah-study';
import { STUDY as S078 } from './surah-study-level5/078-an-naba';
import { STUDY as S079 } from './surah-study-level5/079-an-naziat';
import { STUDY as S080 } from './surah-study-level5/080-abasa';
import { STUDY as S081 } from './surah-study-level5/081-at-takwir';
import { STUDY as S082 } from './surah-study-level5/082-al-infitar';
import { STUDY as S083 } from './surah-study-level5/083-al-mutaffifin';
import { STUDY as S084 } from './surah-study-level5/084-al-inshiqaq';
import { STUDY as S085 } from './surah-study-level5/085-al-buruj';
import { STUDY as S088 } from './surah-study-level5/088-al-ghashiyah';

export const LEVEL_5: Record<string, SurahStudy> = {
  '078-an-naba': S078,
  '079-an-naziat': S079,
  '080-abasa': S080,
  '081-at-takwir': S081,
  '082-al-infitar': S082,
  '083-al-mutaffifin': S083,
  '084-al-inshiqaq': S084,
  '085-al-buruj': S085,
  '088-al-ghashiyah': S088,
};
