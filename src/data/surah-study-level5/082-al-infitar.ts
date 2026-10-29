// Plain-English teaching layer for Surah 82, Al-Infitar. Same shape and rules as in surah-study.ts.
//
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Where al-Jadwal gives more than one reading, the line says which one it follows. Someone
// who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from '../surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Time word, “when”', say: 'It means “when”. al-Jadwal treats it as a word of time with an “if” feeling, and the whole clause after it is its muḍāf ilayhi (the second part of a possession). The answer comes in verse 5.' },
        { role: 'Subject of an unspoken verb', say: 'Nominative with ḍamma. al-Jadwal reads it as the doer of a verb that is not said out loud. The verb that is said explains it.' },
        { role: 'Verb, past, explains the unsaid verb', say: 'Form VII (انفَعَلَ) means “split by itself”. The تْ shows that السَّمَاءُ is feminine. This verb only explains the unsaid one, so it has no role of its own in the sentence.' },
      ],
      quiz: { word: 1, q: 'What is السَّمَاءُ in this verse, according to al-Jadwal?', options: ['The subject of an unspoken verb', 'The subject (mubtadaʾ) of a nominal sentence', 'The object of انفَطَرَتْ'], answer: 0, why: 'After إِذَا a noun like this is the doer of a verb that is left out. The verb that is said (انفَطَرَتْ) explains it.' },
    },
    2: {
      words: [
        { role: 'And', say: 'وَ joins this second clause to the first إِذَا clause.' },
        { role: 'Time word, “when”', say: 'Same as in verse 1: a word of time with an “if” feeling. The clause after it is its muḍāf ilayhi.' },
        { role: 'Subject of an unspoken verb', say: 'Nominative with ḍamma. It is the doer of a verb that is not said. The verb that is said explains it.' },
        { role: 'Verb, past, explains the unsaid verb', say: 'Form VIII (افْتَعَلَ), here meaning “scatter”. The تْ is the feminine ending. A plural of things takes a feminine verb. It has no role of its own in the sentence.' },
      ],
      quiz: { word: 3, q: 'What does انتَثَرَتْ do in the sentence?', options: ['It is the predicate (khabar) of الْكَوَاكِبُ', 'It is the answer to the condition', 'It explains an unspoken verb'], answer: 2, why: 'al-Jadwal reads the noun after إِذَا as the doer of an unspoken verb. The spoken verb explains it and has no place of its own. The answer to the condition is only in verse 5.' },
    },
    3: {
      words: [
        { role: 'And', say: 'وَ joins this third clause to the earlier ones.' },
        { role: 'Time word, “when”', say: 'The same word of time as before. The clause after it is its muḍāf ilayhi.' },
        { role: 'Subject of an unspoken verb', say: 'Nominative with ḍamma. al-Jadwal reads it as the doer of an unspoken verb. The spoken verb is passive, so in meaning the seas are the ones acted on.' },
        { role: 'Verb, passive, explains the unsaid verb', say: 'Form II (فَعَّلَ): the doubled جّ makes it strong, “burst out”. The ḍamma on the first letter and the kasra before the last letter show that it is passive. Nobody is named as the doer.' },
      ],
      quiz: { word: 3, q: 'How can you tell that فُجِّرَتْ is passive?', options: ['The ending تْ', 'ḍamma on the first letter and kasra before the last letter', 'The word إِذَا in front of it'], answer: 1, why: 'A past verb is passive when its first letter has ḍamma and the letter before the last has kasra: فُجِّرَ. The تْ only shows that the subject is feminine.' },
    },
    4: {
      words: [
        { role: 'And', say: 'وَ joins the fourth clause to the earlier ones.' },
        { role: 'Time word, “when”', say: 'The same word of time. The clause after it is its muḍāf ilayhi.' },
        { role: 'Subject of an unspoken verb', say: 'Nominative with ḍamma. al-Jadwal reads it as the doer of an unspoken verb, and the passive verb that follows explains it.' },
        { role: 'Verb, passive, four root letters', say: 'The root ب-ع-ث-ر has four letters, not three. It is passive: ḍamma on the first letter, kasra before the last. The unnamed doer is left out.' },
      ],
      quiz: { word: 2, q: 'Why is الْقُبُورُ nominative?', options: ['It follows a preposition', 'It is the second part of a possession', 'It is the subject of an unspoken verb'], answer: 2, why: 'A subject is nominative. al-Jadwal reads this noun as the doer of an unspoken verb, so it takes ḍamma.' },
    },
    5: {
      words: [
        { role: 'Verb, past, answer to the condition', say: 'This is the answer to the four إِذَا clauses. The تْ shows that the doer, نَفْسٌ, is feminine. al-Jadwal says this answer has no place in the grammar.' },
        { role: 'Subject (fāʿil)', say: 'The doer of عَلِمَتْ. It is nominative with tanwin ḍamma. It has no al-, so it means “any soul”.' },
        { role: 'Object, “what”', say: 'It means “what” and is the object of عَلِمَتْ. The small word that would point back to it, “it”, is left out after the verb.' },
        { role: 'Verb, past', say: 'This clause tells what مَا is. It explains the word before it and has no place of its own. Form II (فَعَّلَ), “put forward”.' },
        { role: 'And', say: 'وَ joins the second verb to the first.' },
        { role: 'Verb, past, joined to the first', say: 'Form II, “put off, held back”. It is joined to قَدَّمَتْ and has no place of its own either.' },
      ],
      quiz: { word: 2, q: 'What is مَا in this verse?', options: ['The object of عَلِمَتْ', 'A word of denial, “not”', 'The subject of عَلِمَتْ'], answer: 0, why: 'al-Jadwal reads مَا as a relative word, “what”, in the place of an object. The doer is نَفْسٌ.' },
    },
    6: {
      words: [
        { role: 'Calling word', say: 'It means “O”. It calls someone.' },
        { role: 'The one called (munādā)', say: 'The person called out. It never changes: it is built on ḍamma, and its place is accusative. A name with al- cannot come right after يَا, so أَيُّهَا stands in between.' },
        { role: 'Badal of أَيُّهَا', say: 'It says who is meant. It copies the ḍamma of أَيُّهَا. al-Jadwal also allows calling it ʿaṭf bayān.' },
        { role: 'Question word, subject (mubtadaʾ)', say: 'It means “what?”. It starts the sentence, so it is the subject. It is not asking for information: it scolds.' },
        { role: 'Verb, past, plus “you”', say: 'The whole clause is the predicate of مَا. The ending كَ is the object, “you”. The doubled ر comes from the root غ-ر-ر, “deceive”.' },
        { role: 'Preposition', say: 'It belongs to غَرَّكَ: deceived you about what concerns your Lord.' },
        { role: 'After a preposition', say: 'Genitive with kasra after بِ. The ending كَ means “your”.' },
        { role: 'Adjective (naʿt)', say: 'It describes رَبِّكَ, so it copies its genitive case.' },
      ],
      quiz: { word: 7, q: 'Which word does الْكَرِيمِ describe?', options: ['الْإِنسَانُ', 'رَبِّكَ', 'غَرَّكَ'], answer: 1, why: 'An adjective follows the word it describes and copies its case. الْكَرِيمِ is genitive like رَبِّكَ.' },
    },
    7: {
      words: [
        { role: 'Relative pronoun, second adjective', say: 'It means “who”. al-Jadwal reads it as a second adjective of رَبِّكَ in verse 6, after الْكَرِيمِ. It never changes its ending, so only its place is genitive.' },
        { role: 'Verb, past, plus “you”', say: 'This clause finishes الَّذِي. It says what He did. The ending كَ is the object, “you”.' },
        { role: 'And then', say: 'فَ joins the next verb to the first and shows that the steps come one after the other.' },
        { role: 'Verb, past, Form II, plus “you”', say: 'Form II (فَعَّلَ) adds care: He made you in good proportion. The ending كَ is the object, “you”. It is joined to the clause before it.' },
        { role: 'And then', say: 'Another فَ. It joins the third verb in the same way.' },
        { role: 'Verb, past, plus “you”', say: 'He made you balanced. The ending كَ is the object, “you”. It is joined to the clause before it.' },
      ],
      quiz: { word: 0, q: 'What does الَّذِي do in this verse?', options: ['It starts a new question', 'It is the subject of خَلَقَكَ', 'It is a second adjective of رَبِّكَ'], answer: 2, why: 'al-Jadwal reads الَّذِي as a second adjective of رَبِّكَ, after الْكَرِيمِ. The subject of خَلَقَكَ is “He”, hidden in the verb.' },
    },
    8: {
      words: [
        { role: 'Preposition', say: 'It means “in”. The whole phrase after it belongs to رَكَّبَكَ at the end of the verse.' },
        { role: 'Word of condition, “whatever”', say: 'al-Jadwal reads it as a conditional word, “whatever”. It is genitive after فِي and owns صُورَةٍ. al-Jadwal also allows a question of blame here.' },
        { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because أَيِّ owns it. Tanwin shows it is not one named form but any form.' },
        { role: 'Extra word', say: 'al-Jadwal calls this مَا extra. It adds strength to the condition and has no job of its own.' },
        { role: 'Verb of the condition, past', say: 'It means “He wished”. It is the “if” half of the condition. The doer “He” is hidden in the verb.' },
        { role: 'Answer of the condition, plus “you”', say: 'It is the answer, with no فَ. Form II (فَعَّلَ): He put you together. The ending كَ is the object, “you”.' },
      ],
      quiz: { word: 3, q: 'What is مَا in this verse?', options: ['An extra word that adds strength', 'A word of denial, “not”', 'The subject of شَاءَ'], answer: 0, why: 'al-Jadwal calls it extra after أَيِّ. The subject of شَاءَ is “He”, hidden in the verb.' },
    },
    9: {
      words: [
        { role: 'Rebuke, “no!”', say: 'It stops the listener and rejects what the verses before suggested. It never changes its ending.' },
        { role: 'Particle of moving on', say: 'It moves the speech to a new point: the real reason for the denial. al-Jadwal calls this moving on, not correcting.' },
        { role: 'Verb, present, Form II', say: 'Nominative: the ending ونَ stays. Form II (فَعَّلَ) adds force: you call it a lie again and again.' },
        { role: 'Preposition', say: 'This verb takes بِ. The phrase belongs to تُكَذِّبُونَ.' },
        { role: 'After a preposition', say: 'Genitive with kasra after بِ. Here “the Recompense” means the Day when deeds are paid back.' },
      ],
      quiz: { word: 1, q: 'What does بَلْ do in this verse?', options: ['It means “if”', 'It moves the speech on to a new point', 'It says “not”'], answer: 1, why: 'al-Jadwal reads بَلْ as a particle of moving on (iʿrāḍ intiqālī). It leaves the first point and turns to the real reason.' },
    },
    10: {
      words: [
        { role: 'Wa of the state (ḥāl)', say: 'al-Jadwal reads it as a ḥāl: you deny the Recompense while there are guardians over you. It also allows a new sentence.' },
        { role: 'Particle “indeed”', say: 'It adds strength and puts its noun in the accusative.' },
        { role: 'Phrase put first', say: 'It means “over you”. It is tied to the predicate of إِنَّ, which comes first in this sentence. كُمْ means “you” (plural).' },
        { role: 'Lām of emphasis', say: 'It adds strength. It sits on the noun that comes after the fronted phrase.' },
        { role: 'Noun of إِنَّ', say: 'It is accusative, and for a plural like this the accusative ends in ـينَ. It comes from the active participle حَافِظ, “one who guards”.' },
      ],
      quiz: { word: 4, q: 'Why does حَافِظِينَ end in ـينَ?', options: ['It is genitive after عَلَيْكُمْ', 'It is nominative, the subject', 'It is accusative, the noun of إِنَّ'], answer: 2, why: 'إِنَّ puts its noun in the accusative. For a sound masculine plural, the accusative ends in ـينَ.' },
    },
    11: {
      words: [
        { role: 'Adjective (naʿt)', say: 'It describes حَافِظِينَ in verse 10, so it copies its accusative case. The tanwin fatḥa shows it. كِرَامًا is a broken plural of كَرِيم.' },
        { role: 'Adjective (naʿt)', say: 'A second adjective of حَافِظِينَ. It is accusative, so it ends in ـينَ. It comes from the active participle كَاتِب, “one who writes”.' },
      ],
      quiz: { word: 1, q: 'Which word does كَاتِبِينَ describe?', options: ['حَافِظِينَ', 'عَلَيْكُمْ', 'إِنَّ'], answer: 0, why: 'Both words in this verse are adjectives of حَافِظِينَ, so they copy its accusative case.' },
    },
    12: {
      words: [
        { role: 'Verb, present', say: 'The doer is the ending وَ, “they”: the angels. The whole clause is another adjective of حَافِظِينَ. al-Jadwal also allows a ḥāl.' },
        { role: 'Particle that makes a verbal noun', say: 'al-Jadwal reads it as a masdar particle: مَا تَفْعَلُونَ means “your doing”, and that is what they know. It also allows reading مَا as “what”.' },
        { role: 'Verb, present', say: 'The ending ونَ shows “you” (plural). This clause completes مَا and has no place of its own.' },
      ],
      quiz: { word: 1, q: 'How does al-Jadwal read مَا here?', options: ['As a word of denial', 'As a masdar particle: “what you do” means “your doing”', 'As a question word'], answer: 1, why: 'al-Jadwal reads it as a masdar particle first, and says the clause then works as an object. It also allows the reading “what”.' },
    },
    13: {
      words: [
        { role: 'Particle “indeed”', say: 'It adds strength and puts its noun in the accusative. This starts a new sentence.' },
        { role: 'Noun of إِنَّ', say: 'Accusative with fatḥa, because إِنَّ stands in front of it. It is a broken plural of بَرّ, “the good”.' },
        { role: 'Lām of emphasis', say: 'It adds strength. It stands on the phrase فِي نَعِيمٍ, not on the predicate itself. This is the “moved” lām (lām muzaḥlaqa).' },
        { role: 'Preposition', say: 'It means “in”. The phrase belongs to the predicate of إِنَّ.' },
        { role: 'After a preposition', say: 'Genitive with tanwin kasra after فِي. Tanwin means joy that cannot be measured.' },
      ],
      quiz: { word: 2, q: 'What does لَ do in لَفِي?', options: ['It means “to”', 'It makes a verb past', 'It adds emphasis'], answer: 2, why: 'This is a lām of emphasis (tawkīd). It is the lām muzaḥlaqa: it moved from the predicate to the phrase that stands for it.' },
    },
    14: {
      words: [
        { role: 'And', say: 'وَ joins this sentence to the sentence of verse 13.' },
        { role: 'Particle “indeed”', say: 'It adds strength and puts its noun in the accusative.' },
        { role: 'Noun of إِنَّ', say: 'Accusative with fatḥa. It is a broken plural of فَاجِر, “the wicked”.' },
        { role: 'Lām of emphasis', say: 'The same lām as in verse 13. It stands on the phrase فِي جَحِيمٍ.' },
        { role: 'Preposition', say: 'It means “in”. The phrase belongs to the predicate of إِنَّ.' },
        { role: 'After a preposition', say: 'Genitive with tanwin kasra after فِي. It is a name for the burning fire.' },
      ],
      quiz: { word: 0, q: 'What does وَ do in this verse?', options: ['It joins this sentence to verse 13', 'It begins an oath, “by”', 'It means “while”'], answer: 0, why: 'al-Jadwal reads this sentence as joined (maʿṭūf) to the sentence of verse 13. The two are opposites.' },
    },
    15: {
      words: [
        { role: 'Verb, present, plus “it”', say: 'The ending وْنَ shows “they”: the wicked. The ending هَا is the object, “it”: the fire. This clause explains verse 14. al-Jadwal also allows it as an adjective of جَحِيمٍ.' },
        { role: 'Time word, first part of a possession', say: 'Accusative with fatḥa. It tells when, and it belongs to the verb. It owns الدِّينِ.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because يَوْمَ owns it. “The day of repayment”.' },
      ],
      quiz: { word: 1, q: 'Why is يَوْمَ accusative?', options: ['It is the subject', 'It is a word of time tied to the verb', 'It follows a preposition'], answer: 1, why: 'A noun of time that says when the action happens is accusative. Here it is tied to يَصْلَوْنَهَا.' },
    },
    16: {
      words: [
        { role: 'And', say: 'وَ joins this sentence to the clause of verse 15.' },
        { role: 'Denial, works like لَيْسَ', say: 'It means “not”. al-Jadwal says it works like لَيْسَ: its noun is nominative and its predicate is accusative in place.' },
        { role: 'Its noun (ism)', say: 'It means “they”. It is the noun of مَا. It never changes its ending.' },
        { role: 'Phrase of separation', say: 'It means “from it”. It belongs to غَائِبِينَ. The ending هَا is “it”: the fire.' },
        { role: 'Extra bāʾ', say: 'This بِ adds no meaning. It only makes the denial stronger.' },
        { role: 'Predicate (khabar) of مَا', say: 'It is genitive in form, because of the extra بِ, but accusative in place, as the predicate of مَا. It is an active participle of the root غ-ي-ب.' },
      ],
      quiz: { word: 5, q: 'Why does غَائِبِينَ end in ـينَ (genitive)?', options: ['Because عَنْهَا owns it', 'Because it is the subject', 'Because the extra بِ comes before it'], answer: 2, why: 'The extra بِ puts the word after it in the genitive in form. In place it is still the predicate of مَا, which is accusative.' },
    },
    17: {
      words: [
        { role: 'Wa that begins a new sentence', say: 'al-Jadwal calls this وَ a new start: it does not join two statements, it opens a question.' },
        { role: 'Question word, subject (mubtadaʾ)', say: 'It means “what?”. It starts the sentence, so it is the subject. Its predicate is the next word.' },
        { role: 'Verb, past, Form IV, plus “you”', say: 'Its clause is the predicate of the first مَا. The ending كَ is the first object, “you”. The next question fills the place of the second object.' },
        { role: 'Question word, subject (mubtadaʾ)', say: 'A second “what?”, in its own short sentence. That whole sentence fills the place of the second object of أَدْرَىٰكَ.' },
        { role: 'Predicate (khabar) of the second مَا', say: 'It says what the second مَا is about. It is nominative with ḍamma, and it owns الدِّينِ.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because يَوْمُ owns it.' },
      ],
      quiz: { word: 4, q: 'What is يَوْمُ in this verse?', options: ['The predicate (khabar) of the second مَا', 'The subject of أَدْرَىٰكَ', 'The object of أَدْرَىٰكَ'], answer: 0, why: 'The second مَا is the subject of its own short sentence, and يَوْمُ الدِّينِ says what it is. The whole sentence is the second object of أَدْرَىٰكَ.' },
    },
    18: {
      words: [
        { role: 'Then', say: 'ثُمَّ joins this question to the one before, with a pause between them.' },
        { role: 'Question word, subject (mubtadaʾ)', say: 'It means “what?”. It starts the sentence, so it is the subject. Its predicate is the next word.' },
        { role: 'Verb, past, Form IV, plus “you”', say: 'Its clause is the predicate of the first مَا. It comes from the root د-ر-ي (to know), not from د-ر-ك. The ending كَ is the first object, “you”.' },
        { role: 'Question word, subject (mubtadaʾ)', say: 'A second “what?”, in its own short sentence. That sentence fills the place of the second object of أَدْرَىٰكَ.' },
        { role: 'Predicate (khabar) of the second مَا', say: 'It says what the second مَا is about. It is nominative with ḍamma, and it owns الدِّينِ.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because يَوْمُ owns it.' },
      ],
      quiz: { word: 2, q: 'From which root does أَدْرَىٰكَ come?', options: ['د-ر-ك', 'د-ر-ي', 'د-ر-س'], answer: 1, why: 'أَدْرَى is Form IV of دَرَى, “know”, so it means “make someone know”. The ending كَ is only the pronoun.' },
    },
    19: {
      words: [
        { role: 'Time word, first part of a possession', say: 'Accusative with fatḥa. al-Jadwal ties it to an unspoken verb, for example “they will be repaid”. The clause after it is its muḍāf ilayhi.' },
        { role: 'Denial, “not”', say: 'It makes the verb negative: no soul can do this.' },
        { role: 'Verb, present', say: 'Nominative with ḍamma. The clause لَا تَمْلِكُ … is the second part of the possession that يَوْمَ begins. The تَ shows the doer is feminine.' },
        { role: 'Subject (fāʿil)', say: 'The doer of تَمْلِكُ. It is nominative with tanwin ḍamma. Without al-, it means “any soul”.' },
        { role: 'Preposition', say: 'It means “for”. The phrase belongs to تَمْلِكُ: have power for another.' },
        { role: 'After a preposition', say: 'Genitive with tanwin kasra. It is another soul, not the first one.' },
        { role: 'Object', say: 'It is accusative with tanwin fatḥa. “Anything”: the smallest thing, so the denial is complete.' },
        { role: 'Wa of the state (ḥāl)', say: 'al-Jadwal reads it as a ḥāl: it tells the state of things while no soul has power. It also allows a new sentence.' },
        { role: 'Subject (mubtadaʾ)', say: 'The command. It has al-, so it is complete: all command. It starts its sentence, so it is nominative.' },
        { role: 'Time word', say: 'It means “on that day”. It tells when the command belongs to Allah. al-Jadwal calls it a badal of the yawm before it.' },
        { role: 'Preposition', say: 'It means “belongs to”. The phrase is the predicate of الْأَمْرُ.' },
        { role: 'After a preposition', say: 'Genitive with kasra after لِ. The name of God.' },
      ],
      quiz: { word: 7, q: 'How does al-Jadwal read the وَ in وَالْأَمْرُ?', options: ['As an oath', 'As a plain “and” joining two verbs', 'As a wa of the state (ḥāl)'], answer: 2, why: 'al-Jadwal reads the clause الْأَمْرُ يَوْمَئِذٍ لِلَّهِ as a ḥāl: it tells the state while no soul can help another. It also allows a new sentence.' },
    },
  },
};
