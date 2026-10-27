// Lesson copy for the L2.01 mockups. One source, three looks.
// Verse text is typed for the mockup (checked against the Corpus letters by scripts/check-verse-text.ts).
// In production it comes from the Tanzil file by reference.

export const lesson = {
  kicker: 'Level 2 · Lesson 1 of 12',
  title: 'Sentences without a verb',
  term: 'The nominal sentence',
  termAr: 'جُمْلَة اِسْمِيَّة',
  minutes: 15,
  steps: [
    { id: 'start', label: 'Start' },
    { id: 'see', label: 'See it' },
    { id: 'no-is', label: 'No “is”' },
    { id: 'parts', label: 'Two parts' },
    { id: 'rule', label: 'The rule' },
    { id: 'more', label: 'More' },
    { id: 'first', label: 'Reversed' },
    { id: 'try', label: 'Try it' },
    { id: 'done', label: 'Done' },
  ],
};

// word = [arabic, meaning, type ('n' noun, 'v' verb, 'p' little word), spoken form]
// group = { role: 'mubtada' | 'khabar' | null, words: [...] }
export const sentences = {
  awwal: {
    ref: 'Al-Hadid 57:3 (part)',
    groups: [
      { role: 'mubtada', words: [['هُوَ', 'he', 'n', 'huwa']] },
      { role: 'khabar', words: [['ٱلْأَوَّلُ', 'the First', 'n', 'al-awwalu']] },
    ],
    en: ['He ', ['is'], ' the First.'],
  },
  kitab: {
    ref: 'Al-Baqarah 2:2 (part)',
    groups: [
      { role: 'mubtada', words: [['ذَٰلِكَ', 'that', 'n', 'dhalika']] },
      { role: 'khabar', words: [['ٱلْكِتَٰبُ', 'the Book', 'n', 'al-kitabu']] },
    ],
    en: ['That ', ['is'], ' the Book.'],
  },
  ghafur: {
    ref: 'Al-Baqarah 2:218 (end)',
    groups: [
      { role: 'mubtada', words: [['وَٱللَّهُ', 'and Allah', 'n', 'wa-llahu']] },
      { role: 'khabar', words: [['غَفُورٌ', 'Forgiving', 'n', 'ghafurun'], ['رَّحِيمٌ', 'Merciful', 'n', 'rahimun']] },
    ],
    en: ['And Allah ', ['is'], ' Forgiving, Merciful.'],
  },
  dinukum: {
    ref: 'Al-Kafirun 109:6',
    groups: [
      { role: 'khabar', words: [['لَكُمْ', 'for you', 'p', 'lakum']] },
      { role: 'mubtada', words: [['دِينُكُمْ', 'your religion', 'n', 'dinukum']] },
    ],
    en: ['For you ', ['is'], ' your religion.'],
  },
  nur: {
    ref: 'An-Nur 24:35 (part)',
    groups: [
      { role: 'mubtada', words: [['ٱللَّهُ', 'Allah', 'n', 'allahu']] },
      { role: 'khabar', words: [['نُورُ', 'light of', 'n', 'nuru'], ['ٱلسَّمَٰوَٰتِ', 'the heavens', 'n', 'as-samawati'], ['وَٱلْأَرْضِ', 'and the earth', 'n', 'wa-l-ardi']] },
    ],
    en: ['Allah ', ['is'], ' the light of the heavens and the earth.'],
  },
};

export const checks = [
  {
    q: 'In ٱللَّهُ غَفُورٌ رَّحِيمٌ, which word is the mubtadaʾ (the starting point)?',
    options: ['ٱللَّهُ', 'غَفُورٌ', 'رَّحِيمٌ'],
    answer: 0,
    why: 'ٱللَّهُ is what the sentence is about. The other two words say something about Allah, so they are the khabar.',
  },
  {
    q: 'In هُوَ ٱلْأَوَّلُ, which English word has no Arabic word?',
    options: ['He', 'is', 'the First'],
    answer: 1,
    why: 'Arabic puts the two words side by side. You add “is” when you say it in English.',
  },
  {
    q: 'Which ending do the mubtadaʾ and the khabar both take?',
    options: ['-u or -un (damma)', '-a or -an (fatha)', '-i or -in (kasra)'],
    answer: 0,
    why: 'Both parts are in the nominative case (rafʿ). That is the -u family.',
  },
];
