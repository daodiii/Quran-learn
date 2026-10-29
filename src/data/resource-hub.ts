/**
 * The Resources hub (/resources/): which cards exist, how they are grouped, and the words and small
 * preview on each. The two tools are not in the content collection; every guide is, and the hub page
 * throws at build time if a guide in src/content/resources has no card here, or a card here has no guide.
 */
export interface HubCard {
  /** Guide id in the content collection, or the tool's route name. */
  id: string;
  kind: 'tool' | 'guide';
  href: string;
  title: string;
  blurb: string;
  /** Extra words the search box matches, beyond the title and blurb. */
  keys: string;
  /** A small picture of the real thing (static HTML, hidden from screen readers). */
  peek: string;
}
export interface HubGroup { id: string; title: string; line: string; hue: number; cards: HubCard[] }

const guide = (id: string, title: string, blurb: string, keys: string, peek: string): HubCard => ({ id, kind: 'guide', href: `/resources/${id}/`, title, blurb, keys, peek });

export const HUB_GROUPS: HubGroup[] = [
  {
    id: 'tools', title: 'Find', line: 'Type something and get an answer.', hue: 178,
    cards: [
      { id: 'find', kind: 'tool', href: '/resources/find/', title: 'Find a word or verb', blurb: 'Type English, a sound or Arabic. You get the plain meaning, how the word is built, its root family and all its verb forms.', keys: 'word lookup verb form generator find search arabic english sound meaning root forms grammar dictionary',
        peek: '<div class="pk-search"><div class="in"><span class="ar" lang="ar" dir="rtl">قَالَ</span><i>“he said”</i></div><div class="out"><span class="tag">Root ق و ل</span><span class="tag">Form I</span><span class="tag">1,618 times</span><span class="tag">10 verb forms</span></div></div>' },
    ],
  },
  {
    id: 'words', title: 'Words and terms', line: 'What a word means, and what a grammar term means.', hue: 250,
    cards: [
      guide('200-most-used-words', 'The 200 most common words', 'The words you meet again and again, counted from the Quran itself.', 'vocabulary frequency common words list',
        '<div class="pk-num">62%<small>of the Quran is built on them</small></div>'),
      guide('glossary', 'Grammar glossary', 'Every grammar term in Arabic and plain English, with a verse.', 'glossary terms definitions arabic english irab nasb',
        '<div class="pk-big"><span class="ar" lang="ar" dir="rtl">إِعْرَاب</span><small>iʿrāb: case analysis</small></div>'),
      guide('root-system', 'Root system', 'Three letters make a family of words. Learn how to see the family.', 'roots three letters family dictionary look up',
        '<div class="pk-big"><span class="ar" lang="ar" dir="rtl">ك ت ب</span><small>kitāb, kātib, maktab…</small></div>'),
    ],
  },
  {
    id: 'verbs', title: 'Verbs', line: 'Forms, tables and one sheet to keep open.', hue: 20,
    cards: [
      guide('verb-forms-master-reference', 'The ten verb forms on one sheet', 'The ten forms on one page, with what each one adds to the meaning.', 'verb forms master reference cheat sheet one page',
        '<div class="pk-dots"><b>I</b><b>II</b><b>III</b><b>IV</b><b>V</b><b>VI</b><b>VII</b><b>VIII</b><b>IX</b><b>X</b></div>'),
      guide('verb-conjugation-tables', 'Verb conjugation tables', 'Every person and tense, laid out so you can find the ending you need.', 'verb conjugation tables person tense past present command',
        '<div class="pk-grid"><span lang="ar">فَعَلَ</span><span lang="ar">فَعَلَتْ</span><span lang="ar">فَعَلُوا</span><span lang="ar">فَعَلْتَ</span><span lang="ar">فَعَلْتِ</span><span lang="ar">فَعَلْتُمْ</span></div>'),
    ],
  },
  {
    id: 'nouns', title: 'Nouns and pronouns', line: 'Endings and small words that change a sentence.', hue: 330,
    cards: [
      guide('case-endings-chart', 'Case endings, in one chart', 'One noun in three cases. See how the ending shows the job in the sentence.', 'case endings nominative accusative genitive raf nasb jarr irab',
        '<div class="pk-case"><span class="n" lang="ar">كِتَابٌ</span><span class="a" lang="ar">كِتَابًا</span><span class="g" lang="ar">كِتَابٍ</span></div>'),
      guide('pronoun-charts', 'Pronoun charts', 'Separate and attached pronouns: who is speaking, and who is spoken to.', 'pronouns detached attached he she you we demonstrative relative',
        '<div class="pk-big"><span class="ar" lang="ar" dir="rtl">هُوَ · هِيَ · أَنَا</span></div>'),
    ],
  },
  {
    id: 'start', title: 'Start and plan', line: 'Where to begin, and how long it takes.', hue: 95,
    cards: [
      guide('arabic-in-7-principles', 'Arabic in 7 principles', 'Seven ideas that explain most of the grammar. A good first read.', 'principles overview rules basics',
        '<div class="pk-steps"><b class="on">1</b><i></i><b>2</b><i></i><b>3</b><i></i><b>4</b><i></i><b>5</b><i></i><b>6</b><i></i><b>7</b></div>'),
      guide('quran-arabic-vs-msa', 'Quranic Arabic or MSA?', 'Two kinds of Arabic share one root system. Decide where to start.', 'msa modern standard which first register dialect',
        '<div class="pk-vs"><div><span class="ar" lang="ar" dir="rtl">قَالَ</span>Quranic</div><div><span class="ar" lang="ar" dir="rtl">قَالَ</span>Modern Standard</div></div>'),
      guide('learning-roadmap', 'Learning roadmap', 'The route from the alphabet to full analysis, with honest timelines.', 'roadmap timeline weekly plan beginner route',
        '<div class="pk-steps"><b class="on">1</b><i></i><b>2</b><i></i><b>3</b><i></i><b>4</b><i></i><b>5</b></div>'),
    ],
  },
];
