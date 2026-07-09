// Graded reading track: every surah analysis assigned to the curriculum level
// after which it becomes readable, with a one-line "what to notice" note
// grounded in that analysis's own overview. Checkpoint surahs sit at their
// checkpoint's level so the full analysis follows the guided reading.
export interface ReadingEntry {
  slug: string;
  afterLevel: 1 | 2 | 3 | 4 | 5;
  note: string;
}

export const READING_TRACK: ReadingEntry[] = [
  // ── After Level 1: nominal, short, definite-noun territory ──
  {
    slug: '001-al-fatiha',
    afterLevel: 1,
    note: 'Seven verses of nominal sentences and idafa chains — track every definite noun and its case ending as the analysis walks the i’rab.',
  },
  {
    slug: '106-quraysh',
    afterLevel: 1,
    note: 'Idafah everywhere: watch لِإِيلَافِ chain cause and possession through the genitive case you just met.',
  },
  {
    slug: '112-al-ikhlas',
    afterLevel: 1,
    note: 'Four short nominal sentences — spot every definite noun, and watch هُوَ add emphasis before the analysis names it.',
  },
  {
    slug: '113-al-falaq',
    afterLevel: 1,
    note: 'Count the repeated مِن phrases — each one pulls its noun into the genitive, exactly as the case-endings lesson promised.',
  },
  {
    slug: '114-an-nas',
    afterLevel: 1,
    note: 'One long triple idafah chain around النَّاسِ — notice how every link after the first sits in the genitive.',
  },

  // ── After Level 2: verbal sentences, inna, agreement ──
  {
    slug: '104-al-humazah',
    afterLevel: 2,
    note: 'Find both إِنَّ sentences and name their ism and khabar — then enjoy the intensive fu’alah noun patterns.',
  },
  {
    slug: '105-al-fil',
    afterLevel: 2,
    note: 'A past-tense narrative in verbal sentences — mark each verb, subject, and object before checking the i’rab.',
  },
  {
    slug: '107-al-maun',
    afterLevel: 2,
    note: 'Spot أَرَأَيْتَ and the الَّذِي clauses that follow — relative pronouns arrive properly in Level 3, so read with the analysis open.',
  },
  {
    slug: '108-al-kawthar',
    afterLevel: 2,
    note: 'You met this at the Level 2 checkpoint — now read the full i’rab and name the ism and khabar of إِنَّا.',
  },
  {
    slug: '109-al-kafirun',
    afterLevel: 2,
    note: 'Repetition with a purpose: contrast verb against active participle, and watch the inverted nominal sentences.',
  },
  {
    slug: '110-an-nasr',
    afterLevel: 2,
    note: 'Past-tense narrative, then imperatives — and check the noun-adjective agreement the analysis highlights.',
  },
  {
    slug: '111-al-masad',
    afterLevel: 2,
    note: 'Watch feminine verb agreement and the dual forms — then the double idafah that seals the condemnation.',
  },

  // ── After Level 3: verb forms, moods, participles ──
  {
    slug: '094-ash-sharh',
    afterLevel: 3,
    note: 'Three parallel past-tense blessings after أَلَمْ — conjugation practice straight from the madi lessons.',
  },
  {
    slug: '095-at-tin',
    afterLevel: 3,
    note: 'An oath answered by لَقَدْ, then elatives and an إِلَّا exception — note the badal apposition inside the oath series.',
  },
  {
    slug: '097-al-qadr',
    afterLevel: 3,
    note: 'Pick out the Form IV and Form V verbs, and the stacked idafah chains under إِنَّ emphasis.',
  },
  {
    slug: '099-az-zalzalah',
    afterLevel: 3,
    note: 'Passive verbs and man + jussive conditionals in perfectly parallel verses — your mood lessons applied.',
  },
  {
    slug: '100-al-adiyat',
    afterLevel: 3,
    note: 'An oath series carried by active participles — name each ism fa’il and its root before reading the i’rab.',
  },
  {
    slug: '101-al-qariah',
    afterLevel: 3,
    note: 'Interrogative ma, similes with ka-, and bare idafa structures — light morphology, heavy atmosphere.',
  },
  {
    slug: '102-at-takathur',
    afterLevel: 3,
    note: 'Form IV أَلْهَاكُمُ versus Form VI التَّكَاثُرُ in the first verse alone — then كَلَّا three times and سَوْفَ futures.',
  },
  {
    slug: '103-al-asr',
    afterLevel: 3,
    note: 'The morphology checkpoint surah in full: one nominal sentence, an إِلَّا exception, and الَّذِينَ relative clauses.',
  },

  // ── After Level 4: conditionals, emphasis, advanced structures ──
  {
    slug: '086-at-tariq',
    afterLevel: 4,
    note: 'A compact in-conditional, the ma adraka formula, and kull as universal quantifier — small surah, dense particles.',
  },
  {
    slug: '087-al-ala',
    afterLevel: 4,
    note: 'Track the opening imperative, the future-tense constructions, and the adversative bal steering the argument.',
  },
  {
    slug: '089-al-fajr',
    afterLevel: 4,
    note: 'Oath series, then هَلْ and إِذَا conditionals with كَلَّا rebukes — every emphasis particle you studied, live.',
  },
  {
    slug: '090-al-balad',
    afterLevel: 4,
    note: 'The لَا أُقْسِمُ oath formula, then relative clauses stacking the steep path — spot each الَّذِي and its clause.',
  },
  {
    slug: '091-ash-shams',
    afterLevel: 4,
    note: 'Seven wa- oaths in a row with قَدْ emphasis on the payoff — then passive voice in the Thamud narrative.',
  },
  {
    slug: '092-al-layl',
    afterLevel: 4,
    note: 'amma...fa- conditionals sorting two kinds of people — watch Form II and Form IV verbs carry the contrast.',
  },
  {
    slug: '093-ad-duha',
    afterLevel: 4,
    note: 'The Level 4 checkpoint surah in full — أَلَمْ questions, the triple wajadaka parallel, and imperative versus prohibitive closings.',
  },
  {
    slug: '096-al-alaq',
    afterLevel: 4,
    note: 'The first revelation: iqra’ imperatives, كَلَّا rebukes, and a la’in conditional — prohibition grammar at full strength.',
  },
  {
    slug: '098-al-bayyinah',
    afterLevel: 4,
    note: 'lam yakun negation, dual number, and ism fa’il as substantives — longer verses that reward slow parsing.',
  },

  // ── After Level 5: full i'rab method on the long openers ──
  {
    slug: '078-an-naba',
    afterLevel: 5,
    note: 'Forty verses of judgment scenes — amma interrogatives, ja’ala with double accusative, and yawma temporal frames.',
  },
  {
    slug: '079-an-naziat',
    afterLevel: 5,
    note: 'Oaths built on active participles, then narrative past chains and إِذَا conditionals — full i’rab method territory.',
  },
  {
    slug: '080-abasa',
    afterLevel: 5,
    note: 'Narrative that shifts person mid-stream — follow the ma interrogatives, fa-/thumma sequencing, and Forms I through V.',
  },
  {
    slug: '081-at-takwir',
    afterLevel: 5,
    note: 'Twelve consecutive إِذَا clauses before the answer lands — the longest conditional chain you will parse on this site.',
  },
  {
    slug: '082-al-infitar',
    afterLevel: 5,
    note: 'إِذَا conditionals and passive voice with attached pronouns throughout — parse each verse before peeking.',
  },
  {
    slug: '083-al-mutaffifin',
    afterLevel: 5,
    note: 'وَيْلٌ exclamations, كَلَّا and إِنَّ emphasis, and active participles as substantives — commercial fraud in full i’rab.',
  },
  {
    slug: '084-al-inshiqaq',
    afterLevel: 5,
    note: 'إِذَا with fa- result clauses, the لَا أُقْسِمُ formula, and a ya ayyuha vocative — apply the five-step method verse by verse.',
  },
  {
    slug: '085-al-buruj',
    afterLevel: 5,
    note: 'wa- oaths, the passive qutila, and الَّذِينَ chains under إِنَّ — the People of the Trench in layered emphasis.',
  },
  {
    slug: '088-al-ghashiyah',
    afterLevel: 5,
    note: 'A هَلْ interrogative opening, descriptive nominal sentences with strict adjective agreement, and a-fa-la reflection commands.',
  },
];
