// Level-4 cumulative review: sources exclusively level-3 lessons — the
// morphology block whose retention matters most entering level 4 (levels
// 1–2 stay in rotation via the earlier reviews).
// Verse quotes follow the Tanzil text (checked 2026-10-29); explanations follow the rewritten lessons.
import type { ReviewQuestion } from './index.ts';

export const LEVEL_4_REVIEW: ReviewQuestion[] = [
  {
    id: 1,
    question: 'In كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ (Al-Baqarah 2:183), what voice is كُتِبَ and how can you identify it from its vowel pattern?',
    options: [
      'Active voice — the fatha-fatha pattern on the first two root letters is the active marker',
      'Passive voice — the damma on the first root letter and kasra on the second (ku-ti-ba) mark the past passive',
      'Active voice — it ends with fatha which signals active past tense',
      'Passive voice — it begins with the prefix يُـ which is the passive marker',
    ],
    correctAnswer: 1,
    explanation: 'Past passive voice in Arabic is formed by placing damma on the first root letter and kasra on the second; كُتِبَ follows the fuʿila pattern (ك receives damma, ت receives kasra), identifying it as "it was written/prescribed." (Lesson: Passive Voice (al-Majhūl).)',
    source: 'level-3/09-passive-voice',
  },
  {
    id: 2,
    question: 'In إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ (Al-Kawthar 108:1), the ending نَٰكَ on أَعْطَيْنَٰكَ carries two pieces of information. What are they?',
    options: [
      'نَا marks third person plural subject; كَ marks third person singular object',
      'نَا marks first person plural subject ("we"); كَ marks second person singular object ("you")',
      'نَا marks dual subject; كَ marks the direct object of the following noun',
      'نَا marks feminine plural subject; كَ marks a genitive attached pronoun',
    ],
    correctAnswer: 1,
    explanation: 'In the past tense, نَا joined to a verb is the doer "we"; كَ after it is the object pronoun "you" (one man). Together أَعْطَيْنَٰكَ means "We gave you." (Lesson: Attached Pronouns.)',
    source: 'level-3/02-attached-pronouns',
  },
  {
    id: 3,
    question: 'In إِنَّا نَعْلَمُ مَا يُسِرُّونَ وَمَا يُعْلِنُونَ (Ya-Sin 36:76), what person and number does نَعْلَمُ indicate, and which prefix signals this?',
    options: [
      'First person plural ("we") — prefix نَ',
      'Third person masculine plural — prefix يَ',
      'Second person masculine singular — prefix تَ',
      'First person singular ("I") — prefix أَ',
    ],
    correctAnswer: 0,
    explanation: 'In the present tense the prefix نَـ marks first person plural ("we"). نَعْلَمُ means "we know". (Lesson: The Present Tense.)',
    source: 'level-3/06-present-tense',
  },
  {
    id: 4,
    question: 'In لَمْ يَلِدْ وَلَمْ يُولَدْ (Al-Ikhlas 112:3), يَلِدْ is active and يُولَدْ is passive. The presence of damma on the first letter of يُولَدْ distinguishes passive. Which of the following correctly explains the present passive pattern?',
    options: [
      'The first prefix takes damma and the last syllable before the suffix takes fatha',
      'The second root letter carries damma in present passive',
      'The prefix takes damma and the vowel before the final root letter becomes fatha (the yufʿalu pattern)',
      'Only the final root letter changes to mark passive voice in present tense',
    ],
    correctAnswer: 2,
    explanation: 'The present passive (al-muḍāriʿ al-majhūl) puts damma on the prefix and fatha on the syllable before the last root consonant; يُولَدُ shows this pattern. (Lesson: Passive Voice (al-Majhūl).)',
    source: 'level-3/09-passive-voice',
  },
  {
    id: 5,
    question: 'In وَعِبَادُ ٱلرَّحْمَٰنِ ٱلَّذِينَ يَمْشُونَ عَلَى ٱلْأَرْضِ (Al-Furqan 25:63), ٱلَّذِينَ is a joining (relative) noun. Which form is it, and what decides the form?',
    options: [
      'Masculine singular — relative pronouns never change form',
      'Feminine singular — it agrees only with the verb inside the relative clause',
      'Masculine plural — it matches the noun before it (عِبَادُ is masculine plural), or the people it means',
      'Masculine dual — it agrees with the case of the following clause',
    ],
    correctAnswer: 2,
    explanation: 'ٱلَّذِينَ is the form for people in the plural. The form fits the noun before it, or the people meant when there is no such noun. (Lesson: Who, Which, What.)',
    source: 'level-3/11-relative-pronouns',
  },
  {
    id: 6,
    question: 'In ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ (Al-Baqarah 2:2), ذَٰلِكَ is a demonstrative pronoun. Which category is it, and how can you tell?',
    options: [
      'Near demonstrative masculine singular — هَ at the start signals nearness',
      'Far demonstrative masculine singular — far words end in ـكَ',
      'Far demonstrative feminine singular — تِلْكَ is the feminine counterpart',
      'Near demonstrative plural — the alif in the middle signals plurality',
    ],
    correctAnswer: 1,
    explanation: 'ذَٰلِكَ is "that" for one male. Far words end in ـكَ and near words start with هَـ. Al-Jadwal takes it apart as ذَا + ل (distance) + ك (a letter of address, not the pronoun "you"). (Lesson: This and That.)',
    source: 'level-3/10-demonstrative-pronouns',
  },
  {
    id: 7,
    question: 'In نَزَّلَ عَلَيْكَ ٱلْكِتَٰبَ (Al-Imran 3:3), the verb نَزَّلَ has a doubled middle root letter (زّ). This is characteristic of which verb form?',
    options: [
      'Form I (faʿala) — the basic unaugmented pattern',
      'Form IV (afʿala) — characterised by adding a hamza prefix',
      'Form III (fāʿala) — characterised by lengthening the vowel after the first root letter',
      'Form II (faʿʿala) — characterised by doubling the second root letter',
    ],
    correctAnswer: 3,
    explanation: 'A shadda on the middle root letter of a verb with nothing in front is Form II (فَعَّلَ). From ن ز ل, Form I نَزَلَ "came down" gives Form II نَزَّلَ "sent down". The doubling can add a doer, but the meaning is not one rule. (Lesson: Verb Form II (Faʿʿala).)',
    source: 'level-3/12-verb-form-ii',
  },
  {
    id: 8,
    question: 'In صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ (Al-Fatiha 1:7), the word عَلَيْهِمْ ends with the suffix هِمْ. What kind of pronoun is هِمْ and what does it indicate?',
    options: [
      'An independent subject pronoun meaning "they"',
      'An attached (muttaṣil) object pronoun meaning "them" (third person masculine plural)',
      'A demonstrative pronoun pointing to a distant group',
      'A relative pronoun introducing a subordinate clause',
    ],
    correctAnswer: 1,
    explanation: 'هِمْ is an attached pronoun (ḍamīr muttaṣil) for third person masculine plural; when attached after a preposition (عَلَيْ + هِمْ) it means "upon them." (Lesson: Attached Pronouns.)',
    source: 'level-3/02-attached-pronouns',
  },
  {
    id: 9,
    question: 'In وَمِمَّا رَزَقْنَٰهُمْ يُنفِقُونَ (Al-Baqarah 2:3), the single word رَزَقْنَٰهُمْ contains two attached pronouns. Which two pronouns are they and what role does each play?',
    options: [
      'ـنَا is the object suffix ("us"); ـهُمْ is the subject suffix ("they")',
      'ـنَا is the subject suffix meaning "we" (doer); ـهُمْ is the object suffix meaning "them" (receiver)',
      'Both ـنَا and ـهُمْ are possessive suffixes modifying the root',
      'ـنَا marks feminine plural subject; ـهُمْ marks masculine plural object',
    ],
    correctAnswer: 1,
    explanation: 'Attached pronouns on verbs serve as either subjects or objects; in رَزَقْنَٰهُمْ the suffix ـنَا is the first-person plural subject ("we provided") and ـهُمْ is the third-person masculine plural object ("them"), both attached to the same verb. (Lesson: Attached Pronouns.)',
    source: 'level-3/02-attached-pronouns',
  },
  {
    id: 10,
    question: 'In قُلْ هُوَ ٱللَّهُ أَحَدٌ (Al-Ikhlas 112:1), what is the grammatical word type of هُوَ?',
    options: [
      'Particle (ḥarf) — it functions as a conjunction',
      'Verb (fiʿl) — it indicates a state of being',
      'Noun (ism) — specifically a personal independent pronoun (ḍamīr munfaṣil) for third person masculine singular',
      'Noun (ism) — it is a proper name for Allah',
    ],
    correctAnswer: 2,
    explanation: 'هُوَ is an independent personal pronoun (ḍamīr munfaṣil), a subcategory of ism; it stands for third person masculine singular ("he") and here functions as a mubtadaʾ whose khabar is the sentence ٱللَّهُ أَحَدٌ. (Lesson: Subject Pronouns.)',
    source: 'level-3/01-subject-pronouns',
  },
];
