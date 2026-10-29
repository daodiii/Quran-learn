// Level-3 cumulative review: sources exclusively level-2 lessons (the
// level-2 review already drills level-1 material).
// Verse quotes follow the Tanzil text (checked 2026-10-29); explanations follow the rewritten lessons.
import type { ReviewQuestion } from './index.ts';

export const LEVEL_3_REVIEW: ReviewQuestion[] = [
  {
    id: 1,
    question: 'In قُلْ هُوَ ٱللَّهُ أَحَدٌ (Al-Ikhlas 112:1), the phrase ٱللَّهُ أَحَدٌ is a nominal sentence. Which part is the mubtadaʾ (subject) and which is the khabar (predicate)?',
    options: [
      'ٱللَّهُ is the mubtadaʾ; أَحَدٌ is the khabar',
      'ٱللَّهُ is the khabar; أَحَدٌ is the mubtadaʾ',
      'قُلْ is the mubtadaʾ; هُوَ is the khabar',
      'أَحَدٌ is the mubtadaʾ; ٱللَّهُ is the khabar',
    ],
    correctAnswer: 0,
    explanation: 'In a nominal sentence the mubtadaʾ (subject) is the topic being spoken about; here ٱللَّهُ is the topic and أَحَدٌ ("One") is the khabar (predicate) that tells us something about it. (Lesson: Checkpoint: Reading Surah Al-Ikhlas.)',
    source: 'level-1/11-checkpoint-al-ikhlas',
  },
  {
    id: 2,
    question: 'In إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ (Al-Asr 103:2), ٱلْإِنسَٰنَ carries a fatha. Why does this noun take accusative case here?',
    options: [
      'It is the mafʿūl bihi (direct object) of a preceding verb',
      'It is the ism of إِنَّ — the particle inna puts its subject into accusative case',
      'It follows the preposition لَفِى which requires accusative',
      'It is the khabar of إِنَّ and predicates take accusative',
    ],
    correctAnswer: 1,
    explanation: 'إِنَّ and her sisters are particles that take a nominal sentence and shift the subject (ism inna) from nominative to accusative; ٱلْإِنسَٰنَ is the ism inna and therefore carries fatha. (Lesson: Six Words in Front of the Sentence.)',
    source: 'level-2/10-inna-sisters',
  },
  {
    id: 3,
    question: 'In قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ۝ مَلِكِ ٱلنَّاسِ ۝ إِلَٰهِ ٱلنَّاسِ (An-Nas 114:1-3), the three phrases رَبِّ ٱلنَّاسِ, مَلِكِ ٱلنَّاسِ, and إِلَٰهِ ٱلنَّاسِ each contain an idafah. What case must ٱلنَّاسِ take in each phrase and why?',
    options: [
      'Nominative, because it is the topic of the sentence',
      'Accusative, because it is the second term in a verbal construction',
      'Genitive, because the second term of an idafah is always genitive',
      'Nominative, because definite nouns are always in nominative',
    ],
    correctAnswer: 2,
    explanation: 'The second noun in an idafah construction (muḍāf ilayh) is always placed in the genitive case; ٱلنَّاسِ carries kasra throughout all three idafah phrases here. (Lesson: The Possessive Construction (Idafah).)',
    source: 'level-2/08-possessive-idafah',
  },
  {
    id: 4,
    question: 'In إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ (An-Nasr 110:1), both نَصْرُ and ٱلْفَتْحُ carry damma. What grammatical role assigns them the nominative case?',
    options: [
      'They are mafʿūl bihi (direct objects) of جَآءَ',
      'They are the fāʿil (subject/doer) of the verb جَآءَ — the subject of a verbal sentence takes nominative',
      'They are khabar of a nominal sentence, which takes nominative',
      'They are in idafah with ٱللَّهِ, and the first noun of idafah is nominative',
    ],
    correctAnswer: 1,
    explanation: 'The fāʿil (grammatical subject of a verb) always takes the nominative case; نَصْرُ is the fāʿil of جَآءَ and ٱلْفَتْحُ is coordinated with it, so both carry damma. (Lesson: The Nominative Case.)',
    source: 'level-2/04-nominative-case',
  },
  {
    id: 5,
    question: 'In وَكَانَ ٱللَّهُ عَلَىٰ كُلِّ شَىْءٍ مُّقِيتًا (An-Nisa 4:85, end), what case is مُّقِيتًا and why?',
    options: [
      'Nominative — it is the mubtadaʾ of a nominal sentence',
      'Genitive — it follows the preposition عَلَىٰ',
      'Accusative — it is the khabar of كَانَ; the sisters of kāna make their khabar accusative',
      'Accusative — it is the ism of كَانَ and kāna puts its ism in the accusative',
    ],
    correctAnswer: 2,
    explanation: 'Kāna keeps its ism in the nominative (ٱللَّهُ, -u) and puts its khabar in the accusative. مُّقِيتًا ends in -an, so it is the khabar of kāna. (Lesson: Verbs That Change the News.)',
    source: 'level-2/11-kaana-sisters',
  },
  {
    id: 6,
    question: 'In ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ (Al-Fatiha 1:6), the adjective ٱلْمُسْتَقِيمَ agrees with ٱلصِّرَٰطَ. Which of the following correctly states the agreement rule being applied?',
    options: [
      'The adjective matches only in case because both are accusative',
      'The adjective matches the noun only in definiteness',
      'The adjective matches the noun only in gender and number',
      'The adjective matches the noun in gender, number, case, and definiteness',
    ],
    correctAnswer: 3,
    explanation: 'Arabic adjectives must agree with their noun in all four categories: gender, number, case, and definiteness; ٱلْمُسْتَقِيمَ is masculine singular accusative definite, matching ٱلصِّرَٰطَ in every category. (Lesson: Adjectives and the Nouns They Describe.)',
    source: 'level-2/09-adjective-agreement',
  },
  {
    id: 7,
    question: 'In وَأَنزَلْنَا مِنَ ٱلسَّمَآءِ مَآءًۢ (Al-Mu\'minun 23:18), what causes ٱلسَّمَآءِ to take kasra here?',
    options: [
      'It is the mafʿūl bihi of أَنزَلْنَا',
      'It is the second noun in an idafah construction',
      'It is the predicate of a nominal sentence',
      'It follows the preposition مِنَ, which puts the noun after it in the genitive',
    ],
    correctAnswer: 3,
    explanation: 'A preposition (ḥarf jarr) such as مِنَ puts the noun after it in the genitive, so ٱلسَّمَآءِ takes kasra. (Lesson: Prepositions and the Noun After Them.)',
    source: 'level-2/07-prepositions-genitive',
  },
  {
    id: 8,
    question: 'In خَلَقَ ٱلْإِنسَٰنَ مِنْ عَلَقٍ (Al-Alaq 96:2), what case is ٱلْإِنسَٰنَ and why?',
    options: [
      'Nominative — it is the subject of خَلَقَ',
      'Genitive — it follows مِنْ in this verse',
      'Accusative — it is the direct object (mafʿūl bihi) of خَلَقَ',
      'Nominative — definite nouns always take nominative',
    ],
    correctAnswer: 2,
    explanation: 'ٱلْإِنسَٰنَ carries fatha and serves as the mafʿūl bihi (direct object) of the verb خَلَقَ; the accusative case marks the receiver of a transitive verb\'s action. (Lesson: The Receiver Case.)',
    source: 'level-2/05-accusative-case',
  },
  {
    id: 9,
    question: 'In لَعَلَّكُمْ تُفْلِحُونَ (Al-Baqarah 2:189), which particle from the inna-sisters family is لَعَلَّ and what meaning does it add?',
    options: [
      'It is equivalent to إِنَّ and adds emphasis',
      'It means "perhaps / may" and expresses hope or expectation',
      'It means "as if" and introduces a comparison',
      'It means "but / however" and introduces contrast',
    ],
    correctAnswer: 1,
    explanation: 'لَعَلَّ is one of the six sisters of إِنَّ; it conveys hope or expectation meaning "perhaps" or "so that you may," and like all inna-sisters it takes an accusative ism and nominative khabar. (Lesson: Six Words in Front of the Sentence.)',
    source: 'level-2/10-inna-sisters',
  },
  {
    id: 10,
    question: 'In مَٰلِكِ يَوْمِ ٱلدِّينِ (Al-Fatiha 1:4), يَوْمِ is the second word of one idafah and the first word of another. What case does it take, and why?',
    options: [
      'Nominative (damma) — it is the muḍāf, the first word of an idafah',
      'Accusative (fatha) — it is the object of مَٰلِكِ',
      'Genitive (kasra) — it is the second word (muḍāf ilayh) of مَٰلِكِ; being the first word of the next link gives it no extra case',
      'Genitive (kasra) — it follows a preposition dropped from the verse',
    ],
    correctAnswer: 2,
    explanation: 'يَوْمِ is genitive for one reason: it is the second word of the idafah مَٰلِكِ يَوْمِ. In a chain the middle word is also the first word of the next link, which only means it has no ٱلْ or tanwīn; it adds no case of its own. (Lesson: The Possessive Construction (Idafah).)',
    source: 'level-2/08-possessive-idafah',
  },
];
