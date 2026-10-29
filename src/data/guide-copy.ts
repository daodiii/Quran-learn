/**
 * The words around each resource guide: the page title, one line under it, a hue for its colours,
 * which tools it gets, and (for the reading guides) a short summary. The guide text itself lives in
 * src/content/resources/*.mdx. Every id here must exist in that collection, and every entry in the
 * collection must have a line here (the guide page throws at build time otherwise).
 */
export interface GuideCopy {
  id: string;
  /** Short name for breadcrumbs and "next resource" cards. */
  short: string;
  /** Small label above the title. */
  eyebrow: string;
  title: string;
  dek: string;
  /** Colour hue (oklch) for this guide's gradients. */
  hue: number;
  /** A search box over the tables (and glossary entries). */
  search?: string;
  /** Section tabs: one section at a time. */
  tabs?: boolean;
  /** "In 30 seconds" card for guides that are read rather than looked up. */
  summary?: string[];
}

export const GUIDES: GuideCopy[] = [
  {
    id: 'quran-arabic-vs-msa', short: 'Quranic vs MSA', eyebrow: 'Start here', hue: 95,
    title: 'Quranic Arabic or Modern Standard Arabic?',
    dek: 'You do not need Modern Standard Arabic first. Here is what you would and would not be skipping.',
    summary: [
      'To read the Quran, start with Quranic Arabic. The alphabet, the root system and the case system are shared with MSA.',
      'The real differences are printed case endings, religious vocabulary, how often each verb form is used, and Quranic rhetoric such as iltifāt and oaths.',
      'Choose by goal: the Quran means Quranic Arabic, the news means MSA, and talking to people means a dialect.',
    ],
  },
  {
    id: 'learning-roadmap', short: 'Learning Roadmap', eyebrow: 'Roadmap', hue: 40,
    title: 'From the alphabet to a full verse breakdown',
    dek: 'A plan in five stages over 81 lessons. The baseline is 30 minutes a day, five days a week.',
    summary: [
      'Five stages: Foundation, Core grammar, Intermediate, Advanced and Applied study. At 30 minutes a day the whole course takes about 9 to 11 months.',
      'Study less or more and the time scales with it: about 18 to 22 months at 15 minutes a day, 5 to 6 months at an hour.',
      'Three habits carry you through: read a verse or two every day, practise the 200 most common words, and review each week.',
    ],
  },
  {
    id: 'arabic-in-7-principles', short: '7 Principles', eyebrow: 'Quick reference', hue: 295,
    title: 'Arabic in 7 principles',
    dek: 'Seven rules that explain most of what you meet on a page of the Quran. Keep this one open while you study.',
    summary: [
      'Every word is a noun, a verb or a particle. Every verb comes from a three-letter root.',
      'The ending of a verb tells you who did it, and the ending of a noun tells you its job in the sentence.',
      'Masculine is the default, feminine is marked, the article ال and tanwīn never appear together, and word order shows emphasis, not roles.',
    ],
  },
  { id: 'case-endings-chart', short: 'Case Endings', eyebrow: 'Reference', hue: 160,
    title: 'Case endings, in one chart',
    dek: 'Arabic nouns change their last sound to show their job in the sentence. This is called iʿrāb.',
    search: 'Search the tables: try “genitive” or “dual”' },
  { id: 'pronoun-charts', short: 'Pronoun Charts', eyebrow: 'Reference', hue: 330,
    title: 'Pronoun charts',
    dek: 'Independent, attached, demonstrative and relative pronouns, with a verse for each.',
    search: 'Search the tables: try “hum” or “this”' },
  { id: 'verb-forms-master-reference', short: 'Verb Forms Master', eyebrow: 'Reference', hue: 140,
    title: 'The ten verb forms on one sheet',
    dek: 'Each form has a pattern, a sign that identifies it, a shift in meaning and a Quran example.',
    search: 'Search the forms: try “shadda” or “teach”' },
  { id: 'verb-conjugation-tables', short: 'Conjugation Tables', eyebrow: 'Reference', hue: 20,
    title: 'Verb conjugation tables',
    dek: 'All ten forms with every person, in the past, present and command.',
    search: 'Search the tables: try “they” or a verb', tabs: true },
  { id: 'root-system', short: 'Root System', eyebrow: 'Guide', hue: 200,
    title: 'How Arabic words grow from roots',
    dek: 'Three letters carry the meaning. Patterns turn them into verbs, nouns and names. Learn to find the root and look it up.',
    search: 'Search the tables: try “writer” or “place”' },
  { id: '200-most-used-words', short: '200 Common Words', eyebrow: 'Vocabulary', hue: 175,
    title: 'The 200 most common words in the Quran',
    dek: 'About six words in every ten of the Quran are built on one of these 200.',
    search: 'Search the words: Arabic, sound or meaning', tabs: true },
  { id: 'glossary', short: 'Glossary', eyebrow: 'Reference', hue: 250,
    title: 'Arabic grammar glossary',
    dek: '105 grammar terms in Arabic and plain English, each with a verse.',
    search: 'Search a term: try “nasb” or “verb”' },
];
