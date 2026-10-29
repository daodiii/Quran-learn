// Plain-English teaching layer for the surahs read after Level 4: At-Tariq, Al-Ala, Al-Fajr, Al-Balad, Ash-Shams,
// Al-Layl, Ad-Duha, Al-Alaq and Al-Bayyinah. Same shape and rules as in surah-study.ts.
//
// Each surah has its own file (surah-study-level4-<slug>.ts). Every line follows the parse in the surah's file, which
// was checked verse by verse against al-Jadwal (Mahmud Safi). Someone who knows Arabic grammar should read these
// before they ship.
import type { SurahStudy } from './surah-study';
import { STUDY as S086 } from './surah-study-level4-086-at-tariq';
import { STUDY as S087 } from './surah-study-level4-087-al-ala';
import { STUDY as S089 } from './surah-study-level4-089-al-fajr';
import { STUDY as S090 } from './surah-study-level4-090-al-balad';
import { STUDY as S091 } from './surah-study-level4-091-ash-shams';
import { STUDY as S092 } from './surah-study-level4-092-al-layl';
import { STUDY as S093 } from './surah-study-level4-093-ad-duha';
import { STUDY as S096 } from './surah-study-level4-096-al-alaq';
import { STUDY as S098 } from './surah-study-level4-098-al-bayyinah';

export const LEVEL_4: Record<string, SurahStudy> = {
  '086-at-tariq': S086,
  '087-al-ala': S087,
  '089-al-fajr': S089,
  '090-al-balad': S090,
  '091-ash-shams': S091,
  '092-al-layl': S092,
  '093-ad-duha': S093,
  '096-al-alaq': S096,
  '098-al-bayyinah': S098,
};
