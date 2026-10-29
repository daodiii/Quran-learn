// Plain-English teaching layer for Ad-Duha (93). Same shape and rules as in surah-study.ts.
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Someone who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from './surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Oath wa', say: 'It means “by”. It stands in for بِ, so the noun after it is genitive. al-Jadwal ties the phrase to an unspoken verb: “I swear”.' },
        { role: 'Thing sworn by, genitive', say: 'Genitive, because the oath wa works like بِ. The last letter is an alif maqṣūra, so the genitive ending is hidden and does not show.' },
      ],
      quiz: { word: 0, q: 'What does the وَ at the start of this verse mean?', options: ['“and”: it joins two sentences', '“by”: it begins an oath', 'It is part of the noun'], answer: 1, why: 'This wa joins nothing. It is the oath wa and takes the place of بِ “by”, so the next word is genitive.' },
    },
    2: {
      words: [
        { role: 'And', say: 'It joins this oath to the first one. The noun after it is genitive again.' },
        { role: 'Thing sworn by, genitive', say: 'Genitive with kasra. It is the second thing sworn by, joined to the forenoon.' },
        { role: 'Time word', say: 'It means “when”. al-Jadwal reads it as a time word with no “if” in it, tied to the unspoken “I swear”. The clause after it is the word it owns.' },
        { role: 'Verb, past', say: 'Past tense, Form I. The subject “it” (the night) is hidden. The clause sits in the genitive position, because إِذَا owns it. The root is س-ج-و.' },
      ],
      quiz: { word: 2, q: 'Does إِذَا start an “if” sentence here?', options: ['No: it is a time word with no “if” in it', 'Yes: the verb after it is jussive', 'Yes: its answer is in verse 3'], answer: 0, why: 'al-Jadwal reads إِذَا as a time word, “at the time when”, tied to the unspoken “I swear”. The clause سَجَىٰ is the word it owns, in the genitive position.' },
    },
    3: {
      words: [
        { role: 'Negation', say: 'It means “not” and stands in front of a past tense verb without changing it. al-Jadwal reads it as a negation in both clauses.' },
        { role: 'Verb, past, Form II, plus “you”', say: 'Form II (فَعَّلَ) has a doubled middle letter: “to say goodbye to”. The ending كَ is the object “you”. This clause is the answer to the oath.' },
        { role: 'Subject (fāʿil)', say: 'Your Lord. It is nominative with ḍamma, because it is the doer of the verb. The ending كَ means “your”.' },
        { role: 'And + negation', say: 'وَ joins this clause to the answer of the oath, and مَا negates again.' },
        { role: 'Verb, past', say: 'Past tense, Form I. The subject “He” is hidden inside the verb and points back to رَبُّكَ. The object “you” is left out.' },
      ],
      quiz: { word: 3, q: 'What is the job of the وَ in وَمَا?', options: ['It starts a new oath', 'It means “by”', 'It joins this clause to the answer of the oath'], answer: 2, why: 'al-Jadwal reads the second clause as joined to the answer of the oath. Both clauses are negated with مَا.' },
    },
    4: {
      words: [
        { role: 'And', say: 'It joins this sentence to the answer of the oath in verse 3.' },
        { role: 'Lām of the oath', say: 'al-Jadwal reads this لَ as the lam of the oath. It is used because a positive statement now follows the negative one in verse 3.' },
        { role: 'Subject (mubtadaʾ)', say: 'The Hereafter. It starts the sentence, so it is nominative with ḍamma. It is feminine singular.' },
        { role: 'Predicate (khabar)', say: 'It says what the Hereafter is: better. It is nominative with tanwin. It is a word of comparison (ism tafḍīl) and takes مِنْ for “than”.' },
        { role: 'Phrase “for you”', say: 'The preposition لِ with the pronoun كَ. al-Jadwal ties it to خَيْرٌۭ: for whom it is better.' },
        { role: 'Preposition “than”', say: 'It begins the second half of the comparison. The phrase belongs to خَيْرٌۭ.' },
        { role: 'After a preposition', say: 'Genitive after مِنَ. The ending is hidden, because the word ends in alif maqṣūra. It means the first life.' },
      ],
      quiz: { word: 1, q: 'What is the job of the لَ in this verse?', options: ['It means “for”', 'It is the lam of the oath', 'It makes the noun definite'], answer: 1, why: 'al-Jadwal reads it as the lam of the oath, and says it is used because a positive statement follows the negative answer of verse 3.' },
    },
    5: {
      words: [
        { role: 'And', say: 'It joins this sentence to the answer of the oath.' },
        { role: 'Lām of the oath', say: 'The lam of the oath again, for the same reason as in verse 4.' },
        { role: 'Future particle', say: 'It points to the future: “will”. It stands in front of the present verb and does not change its ending.' },
        { role: 'Verb, present, Form IV, plus “you”', say: 'Present tense, indicative. Form IV (أَفْعَلَ) means “to give”. The ending كَ is the first object, “you”. The second object, the gift, is left out.' },
        { role: 'Subject (fāʿil)', say: 'The one who gives. Nominative with ḍamma. The ending كَ means “your”.' },
        { role: 'Joining fa', say: 'al-Jadwal calls this فَ a joining fa: it adds one more clause, “and then”.' },
        { role: 'Verb, present', say: 'Present tense, indicative. The subject “you” is hidden. The ending is an alif maqṣūra, so the ḍamma is hidden. The clause is joined to يُعْطِيكَ.' },
      ],
      quiz: { word: 5, q: 'Which kind of فَ comes before تَرْضَىٰ?', options: ['A joining fa', 'The fa of an answer to a condition', 'A fa that begins a new oath'], answer: 0, why: 'al-Jadwal reads the clause فَتَرْضَىٰ as joined to يُعْطِيكَ. There is no “if” in the verse.' },
    },
    6: {
      words: [
        { role: 'Question + negation', say: 'أَ asks a question that makes the listener agree: “Did He not…?” means “He did”. لَمْ negates and puts the verb in the jussive.' },
        { role: 'Verb, present, jussive, plus “you”', say: 'The sukun on the last letter shows the jussive after لَمْ. The subject “He” is hidden. The ending كَ is the first object, “you”.' },
        { role: 'Second object', say: 'al-Jadwal reads it as the second object of the verb: “He found you an orphan”. It is accusative with tanwin fatḥa.' },
        { role: 'Joining fa + verb, past, Form IV', say: 'The فَ joins this clause to the opening statement. آوَىٰ is Form IV: “to give shelter”. The object “you” is left out.' },
      ],
      quiz: { word: 2, q: 'What is يَتِيمًۭا in this sentence?', options: ['A ḥāl: it tells the state of the doer', 'The subject of the verb', 'The second object of the verb: He found you an orphan'], answer: 2, why: 'In al-Jadwal the verb takes two objects here. The first is كَ and the second is يَتِيمًۭا. The same frame comes back in verses 7 and 8.' },
    },
    7: {
      words: [
        { role: 'And', say: 'It joins this sentence to the opening statement of verse 6.' },
        { role: 'Verb, past, plus “you”', say: 'Past tense, Form I, from و-ج-د. The subject “He” is hidden. The ending كَ is the first object, “you”.' },
        { role: 'Second object', say: 'Accusative with tanwin fatḥa. It is the second object of the verb, as in verse 6. al-Jadwal reads “lost” as a metaphor for not yet having the law.' },
        { role: 'Joining fa', say: 'It joins the next act, “so”. The clause that follows is joined to وَجَدَكَ.' },
        { role: 'Verb, past', say: 'Past tense, Form I. The subject “He” is hidden. The object “you” is left out. The last letter is an alif maqṣūra, so the fatḥa is hidden.' },
      ],
      quiz: { word: 2, q: 'How does al-Jadwal explain the word ضَآلًّۭا as an image?', options: ['A metaphor: not yet having the way is called being “lost”', 'A plain report that the Prophet was sinful', 'A verb that means “he went astray”'], answer: 0, why: 'al-Jadwal names a direct metaphor. The law of Islam is compared to guidance, and not having it yet is called being lost.' },
    },
    8: {
      words: [
        { role: 'And', say: 'It joins this sentence to the opening statement of verse 6.' },
        { role: 'Verb, past, plus “you”', say: 'The second وَجَدَكَ of the frame. The subject “He” is hidden. The ending كَ is the first object, “you”.' },
        { role: 'Second object', say: 'The poor one. It is an active participle of عَالَ يَعِيلُ. al-Jadwal says the yā turned into hamza after the alif. Accusative with tanwin fatḥa, the second object.' },
        { role: 'Joining fa', say: 'It joins the next act, “so”. The clause that follows is joined to this وَجَدَكَ.' },
        { role: 'Verb, past, Form IV', say: 'Form IV (أَفْعَلَ) makes someone else rich: “to enrich”. The subject “He” is hidden, and the object “you” is left out.' },
      ],
      quiz: { word: 4, q: 'What does Form IV add in أَغْنَىٰ, compared with غَنِيَ “he was rich”?', options: ['It makes the verb passive', 'It makes the verb a command', 'It makes someone else rich: the verb is causative'], answer: 2, why: 'Form IV (أَفْعَلَ) often adds a causative meaning. غَنِيَ is “he was rich”; أَغْنَىٰ is “He made him rich”.' },
    },
    9: {
      words: [
        { role: 'Fa of an unspoken condition', say: 'al-Jadwal: this فَ links to a condition that is not said. “If your state was like that, orphan, lost and poor, then…”.' },
        { role: 'Particle “as for”', say: 'A particle of condition and detail. Its answer needs فَ. al-Jadwal explains it as “whatever the matter may be”.' },
        { role: 'Object, brought forward', say: 'It is the object of تَقْهَرْ, put in front of its verb. That is why it is accusative with fatḥa.' },
        { role: 'Fa of the answer', say: 'It joins the answer to أَمَّا.' },
        { role: 'Prohibition lā', say: 'The “do not” lā. It puts the verb after it in the jussive.' },
        { role: 'Verb, present, jussive', say: 'The sukun on the last letter shows the jussive. The subject “you” is hidden. The verb means to overpower or oppress. The clause is the answer of أَمَّا.' },
      ],
      quiz: { word: 2, q: 'Why is ٱلْيَتِيمَ accusative?', options: ['Because أَمَّا puts the next noun in the accusative', 'It is the object of تَقْهَرْ, put in front of its verb', 'It follows a preposition'], answer: 1, why: 'al-Jadwal reads it as an object that was brought in front of its verb. أَمَّا itself does not give it the accusative.' },
    },
    10: {
      words: [
        { role: 'And', say: 'al-Jadwal calls this وَ a joining wa: it adds this second “as for” to the first.' },
        { role: 'Particle “as for”', say: 'The same as in verse 9: a particle of condition and detail.' },
        { role: 'Object, brought forward', say: 'The one who asks, an active participle (فَاعِل pattern). Accusative with fatḥa, because it is the object of تَنْهَرْ, put in front.' },
        { role: 'Fa of the answer', say: 'It joins the answer to أَمَّا.' },
        { role: 'Prohibition lā', say: 'The “do not” lā. It puts the verb after it in the jussive.' },
        { role: 'Verb, present, jussive', say: 'The sukun on the last letter shows the jussive. The subject “you” is hidden. The verb means to drive away with harsh words.' },
      ],
      quiz: { word: 4, q: 'What is the job of لَا in this verse?', options: ['It makes a prohibition and puts the verb in the jussive', 'It is a plain negation that leaves the verb unchanged', 'It means “no” in an answer'], answer: 0, why: 'al-Jadwal calls it the prohibitive lā that puts the verb in the jussive. That is why تَنْهَرْ ends in sukun.' },
    },
    11: {
      words: [
        { role: 'And', say: 'al-Jadwal calls this وَ a joining wa: it adds the third “as for” to the first.' },
        { role: 'Particle “as for”', say: 'The same particle as in verses 9 and 10.' },
        { role: 'Preposition', say: 'The phrase بِنِعْمَةِ رَبِّكَ belongs to حَدِّثْ: “tell about”. al-Jadwal says the فَ in between does not stop that.' },
        { role: 'After a preposition, first part of a possession', say: 'Genitive with kasra after بِ. It owns رَبِّكَ, so it has no al-.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because نِعْمَةِ owns it. The ending كَ means “your”.' },
        { role: 'Fa of the answer', say: 'It joins the answer to أَمَّا.' },
        { role: 'Verb, imperative, Form II', say: 'A command. The sukun on the last letter marks the imperative. Form II (doubled middle letter) turns “to happen” into “to tell”. The subject “you” is hidden.' },
      ],
      quiz: { word: 2, q: 'Which word does the phrase that begins with بِ belong to?', options: ['أَمَّا', 'رَبِّكَ', 'حَدِّثْ'], answer: 2, why: 'al-Jadwal ties the phrase to حَدِّثْ: “tell about the favor”. The فَ between them does not stop this.' },
    },
  },
};
