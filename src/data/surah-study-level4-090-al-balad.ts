// Plain-English teaching layer for Al-Balad (90). Same shape and rules as in surah-study.ts.
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Someone who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from './surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Extra particle (zāʾida)', say: 'al-Jadwal reads this لَا as an extra word that stresses the oath. It does not mean “no”. al-Jadwal also notes that some read it as a real “no”.' },
        { role: 'Verb, present, Form IV', say: 'I swear. Form IV (أَفْعَلَ) gives the prefix أُ. The ending is ḍamma, the normal present ending. The subject “I” is hidden.' },
        { role: 'Preposition of the oath', say: 'It means “by”. The phrase it starts belongs to أُقْسِمُ: I swear by this city.' },
        { role: 'After a preposition', say: 'This. It never changes its ending, so only its position is genitive, after بِ.' },
        { role: 'Apposition (badal)', say: 'The city. It says which “this” is meant, so it copies the genitive position. Genitive with kasra.' },
      ],
      quiz: { word: 0, q: 'What does لَا do in لَا أُقْسِمُ?', options: ['It means “no”: I do not swear', 'It is an extra word that stresses the oath', 'It makes the verb jussive'], answer: 1, why: 'al-Jadwal reads لَا as extra. The verb keeps its ordinary ḍamma ending, and the verse is a real oath. al-Jadwal also notes that some read it as a real “no”.' },
    },
    2: {
      words: [
        { role: 'Aside (parenthetical) wa', say: 'al-Jadwal calls this وَ parenthetical: it breaks into the oath with a remark. It does not join two statements.' },
        { role: 'Subject (mubtadaʾ)', say: 'You. It starts a sentence, so it is the subject. It never changes its ending.' },
        { role: 'Predicate (khabar)', say: 'Free, lawful. It says what you are. Nominative with tanwin ḍamma.' },
        { role: 'Preposition', say: 'It belongs to حِلٌّ: free in this city.' },
        { role: 'After a preposition', say: 'This. It never changes its ending, so only its position is genitive, after بِ.' },
        { role: 'Apposition (badal)', say: 'The city. Genitive with kasra. It says which “this” is meant.' },
      ],
      quiz: { word: 0, q: 'What kind of وَ opens this verse?', options: ['A parenthetical wa: it breaks into the oath with a remark', 'A wa that swears a new oath', 'A wa that joins two equal statements'], answer: 0, why: 'al-Jadwal calls the sentence أَنتَ حِلٌّ a remark that breaks in, so its وَ is parenthetical. The oath continues in verse 3.' },
    },
    3: {
      words: [
        { role: 'Joining wa', say: 'al-Jadwal joins وَالِدٍ to the first هَٰذَا of verse 1. So this wa joins; it is not a new oath word.' },
        { role: 'Joined word, genitive', say: 'A father, one who begets. Genitive with tanwin kasra, because it is joined to هَٰذَا, which follows بِ. An active participle on the pattern فَاعِل.' },
        { role: 'Joining wa', say: 'It joins مَا to وَالِدٍ.' },
        { role: 'Relative pronoun', say: 'What, that which. It never changes its ending. Its position is genitive, because it is joined to وَالِدٍ.' },
        { role: 'Verb, past', say: 'He begot. This clause completes مَا and has no place of its own in the grammar. The subject “he” is hidden.' },
      ],
      quiz: { word: 1, q: 'Why is وَالِدٍ genitive?', options: ['A hidden oath verb makes it genitive', 'It is the second part of a possession', 'It is joined to هَٰذَا in verse 1, which follows بِ'], answer: 2, why: 'al-Jadwal reads this وَ as a joining wa. It joins وَالِدٍ to the first هَٰذَا, so وَالِدٍ takes the same genitive position.' },
    },
    4: {
      words: [
        { role: 'Lām of the oath', say: 'This لَ answers the oath of verses 1-3. It stresses the sentence that follows.' },
        { role: 'Particle of certainty', say: 'It stresses that the past verb really happened. al-Jadwal calls it a particle of taḥqīq (making certain).' },
        { role: 'Verb, past, plus “We”', say: 'We created. The ending نَا is the subject, “We”. This clause is the answer to the oath.' },
        { role: 'Object', say: 'Man. It is what was created, so it is accusative with fatḥa.' },
        { role: 'Preposition', say: 'In. The phrase فِي كَبَدٍ is tied to an unspoken ḥāl: man was created while in hardship.' },
        { role: 'After a preposition', say: 'Hardship, toil. Genitive with tanwin kasra after فِي. al-Jadwal also reads it as the verbal noun of كَبِدَ, “his liver hurt him”.' },
      ],
      quiz: { word: 0, q: 'What is the لَ in لَقَدْ?', options: ['The lām of the oath: it starts the answer', 'The lām of command', 'The word “not”'], answer: 0, why: 'al-Jadwal calls it the lām of the oath. The clause لَقَدْ خَلَقْنَا is the answer to the oath of verses 1-3.' },
    },
    5: {
      words: [
        { role: 'Question', say: 'The أَ asks a question. al-Jadwal calls it a question of warning: it threatens the man who thinks this.' },
        { role: 'Verb, present', say: 'He thinks. The subject “he” is hidden. It needs two objects, and the whole أَن clause stands in their place.' },
        { role: 'Lightened “that”', say: 'The short form of أَنَّ. Its noun is a hidden pronoun, and the clause after it is its predicate.' },
        { role: 'Negation, future', say: 'Never. It puts the verb after it in the subjunctive.' },
        { role: 'Verb, present, subjunctive', say: 'Will have power. The fatḥa on the last letter is the subjunctive ending after لَّن. This clause is the predicate of أَنْ.' },
        { role: 'Phrase “over him”', say: 'The preposition عَلَى with the pronoun هِ. It belongs to يَقْدِرَ: have power over him.' },
        { role: 'Subject (fāʿil)', say: 'Anyone. It does the verb يَقْدِرَ, so it is nominative with tanwin ḍamma. It comes last.' },
      ],
      quiz: { word: 2, q: 'What is أَن in this verse?', options: ['The lightened أَنَّ: a hidden pronoun is its noun', 'A particle that makes the next verb subjunctive', 'The word “if”'], answer: 0, why: 'al-Jadwal reads it as the short form of أَنَّ. Its noun is a hidden pronoun, and the clause لَّن يَقْدِرَ عَلَيْهِ أَحَدٌ is its predicate. The subjunctive comes from لَّن.' },
    },
    6: {
      words: [
        { role: 'Verb, present', say: 'He says. al-Jadwal says the hidden “he” is one particular man. This starts a new sentence.' },
        { role: 'Verb, past, Form IV, plus “I”', say: 'I destroyed, I used up. The ending تُ is the subject, “I”. This speech stands in the place of the accusative, as what he says.' },
        { role: 'Object', say: 'Wealth. It is what he used up, so it is accusative with tanwin fatḥatayn.' },
        { role: 'Adjective (naʿt)', say: 'Heaped up, a lot. It describes مَالًا, so it copies its accusative case. It is a plural form, from the singular لُبْدَة.' },
      ],
      quiz: { word: 3, q: 'Which word does لُّبَدًا describe?', options: ['يَقُولُ', 'أَهْلَكْتُ', 'مَالًا'], answer: 2, why: 'An adjective follows the word it describes and copies its case. Both لُّبَدًا and مَالًا are accusative with tanwin fatḥatayn.' },
    },
    7: {
      words: [
        { role: 'Question', say: 'al-Jadwal says the sentence parses like verse 5, but this question is one of denial: he should not think so.' },
        { role: 'Verb, present', say: 'He thinks. The subject “he” is hidden. The أَن clause stands in the place of its two objects.' },
        { role: 'Lightened “that”', say: 'The same as in verse 5: the short form of أَنَّ, with a hidden pronoun as its noun.' },
        { role: 'Negation, jussive', say: 'Did not. It puts the verb after it in the jussive.' },
        { role: 'Verb, present, jussive, plus “him”', say: 'See. The last letter of يَرَى dropped, the sign of the jussive after لَمْ. The ending هُ is the object, “him”.' },
        { role: 'Subject (fāʿil)', say: 'Anyone. It does the seeing, so it is nominative with tanwin ḍamma.' },
      ],
      quiz: { word: 4, q: 'Why does يَرَهُ lose the last letter of يَرَى?', options: ['It is passive', 'It is a command', 'It is jussive after لَّمْ, so the last long vowel drops'], answer: 2, why: 'After لَمْ a present verb is jussive. A verb that ends in a long vowel loses it in the jussive.' },
    },
    8: {
      words: [
        { role: 'Question', say: 'A question of reproach (al-Jadwal): it reminds the man of what he was given. The answer is “yes”.' },
        { role: 'Negation, jussive', say: 'Did not. It puts the verb after it in the jussive.' },
        { role: 'Verb, present, jussive', say: 'We make. The sukun on the last letter is the sign of the jussive after لَمْ. The subject “We” is hidden.' },
        { role: 'Phrase “for him”', say: 'The preposition لَ with the pronoun هُ. al-Jadwal ties it to a second object that is left unsaid.' },
        { role: 'First object, dual', say: 'Two eyes. A dual noun with the ending ـَيْنِ, accusative as the first object of نَجْعَل.' },
      ],
      quiz: { word: 4, q: 'What is عَيْنَيْنِ?', options: ['A plural noun in the genitive', 'A dual noun in the accusative', 'A singular noun with tanwin'], answer: 1, why: 'The ending ـَيْنِ marks a dual noun. For the accusative and the genitive it is the same ending. Here it is accusative, because it is the object of نَجْعَل.' },
    },
    9: {
      words: [
        { role: 'Joining wa', say: 'al-Jadwal calls this a joining wa. It joins لِسَانًا to عَيْنَيْنِ of verse 8.' },
        { role: 'Joined object', say: 'A tongue. Joined to عَيْنَيْنِ, so it is also an object of نَجْعَل. Accusative with tanwin fatḥatayn.' },
        { role: 'Joining wa', say: 'It joins شَفَتَيْنِ to the objects before it.' },
        { role: 'Joined object, dual', say: 'Two lips. A dual noun, accusative, with ـَيْنِ. The singular شَفَة lost its last root letter ه.' },
      ],
      quiz: { word: 1, q: 'What is لِسَانًا joined to by وَ?', options: ['عَيْنَيْنِ', 'نَجْعَل', 'لَّهُ'], answer: 0, why: 'A joined word takes the same case as the word it is joined to. عَيْنَيْنِ is an accusative object, so لِسَانًا is accusative too.' },
    },
    10: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the clause أَلَمْ نَجْعَل of verse 8.' },
        { role: 'Verb, past, plus “We” and “him”', say: 'We guided him. The ending نَا is the subject, “We”. The ending هُ is the first object, “him”.' },
        { role: 'Second object, dual', say: 'The two ways. Dual and definite, accusative as the second object. al-Jadwal reads it as a picture: the roads of good and of evil.' },
      ],
      quiz: { word: 1, q: 'How many objects does هَدَيْنَاهُ have here?', options: ['One: the pronoun هُ', 'Two: هُ and النَّجْدَيْنِ', 'None: it takes no object'], answer: 1, why: 'The verb هَدَى can take two objects. هُ is the first (“him”) and النَّجْدَيْنِ is the second (“the two ways”).' },
    },
    11: {
      words: [
        { role: 'Joining fa', say: 'al-Jadwal calls this فَ a joining fa. It joins the clause to هَدَيْنَاهُ of verse 10.' },
        { role: 'Negation', say: 'Not. It negates a past verb. It is said only once here, but the end of the passage shows the repeated meaning (al-Jadwal).' },
        { role: 'Verb, past, Form VIII', say: 'He plunged into, he climbed. Form VIII (افْتَعَلَ) has a ت after the first letter. The subject “he” is hidden.' },
        { role: 'Object', say: 'The steep pass. Accusative with fatḥa. al-Jadwal reads it as a picture of hard acts of obedience.' },
      ],
      quiz: { word: 1, q: 'What is notable about لَا in this verse?', options: ['It is repeated twice', 'It is said once before a past verb, though it usually repeats', 'It makes the verb jussive'], answer: 1, why: 'لَا before a past verb is usually repeated: “he neither ... nor ...”. al-Jadwal says the end of the passage shows the repeated meaning, so it is not said again.' },
    },
    12: {
      words: [
        { role: 'Aside (parenthetical) wa', say: 'al-Jadwal calls this وَ parenthetical: it breaks in with a question.' },
        { role: 'Question word, subject', say: 'What? It starts a sentence, so it is the subject. Its predicate is the clause أَدْرَىٰكَ. It is a noun, not a particle.' },
        { role: 'Verb, past, Form IV, plus “you”', say: 'It made you know. Its clause is the predicate of the first مَا. The ending كَ is the first object, “you”.' },
        { role: 'Question word, subject', say: 'A second subject, in its own short sentence. That sentence stands in the place of the second object of أَدْرَىٰكَ.' },
        { role: 'Predicate', say: 'The steep pass. It says what the second مَا is about. Nominative with ḍamma. al-Jadwal reads an unspoken “the climbing of” before it.' },
      ],
      quiz: { word: 4, q: 'What is الْعَقَبَةُ in this verse?', options: ['The object of أَدْرَىٰكَ', 'The subject of أَدْرَىٰكَ', 'The predicate of the second مَا'], answer: 2, why: 'The second مَا is a subject and الْعَقَبَةُ is its predicate. Together they make the short sentence مَا الْعَقَبَةُ, which fills the place of the second object of أَدْرَىٰكَ.' },
    },
    13: {
      words: [
        { role: 'Predicate (khabar) of an unspoken “it”', say: 'Freeing. The subject هِيَ (“it is”) is left out. It is nominative with ḍamma, and has no tanwin because it is the first part of a possession.' },
        { role: 'Second part of a possession', say: 'A neck, meaning a slave. Genitive with tanwin kasra, because فَكُّ owns it.' },
      ],
      quiz: { word: 0, q: 'Why does فَكُّ have no tanwin?', options: ['It is the first part of a possession', 'It has al- in front', 'It is a verb'], answer: 0, why: 'The first part of a possession never takes tanwin or al-. It loses tanwin because رَقَبَةٍ follows it as its owner.' },
    },
    14: {
      words: [
        { role: 'Or', say: 'A joining word. It joins إِطْعَامٌ to فَكُّ of verse 13.' },
        { role: 'Joined word, verbal noun', say: 'Feeding. Joined to فَكُّ, so it is nominative with tanwin ḍamma. al-Jadwal also allows a second unspoken subject. It is a Form IV verbal noun and can take an object (verse 15).' },
        { role: 'Preposition', say: 'It belongs to إِطْعَامٌ: feeding on a day.' },
        { role: 'After a preposition', say: 'A day. Genitive with tanwin kasra after فِي.' },
        { role: 'Adjective (naʿt), one of the five nouns', say: 'Having. One of the five nouns: ذُو, ذَا, ذِي. Here ذِي is genitive, because it describes يَوْمٍ. It owns the next word.' },
        { role: 'Second part of a possession', say: 'Hunger. Genitive with tanwin kasra, because ذِي owns it. al-Jadwal calls it a verbal noun with a mim, on the pattern مَفْعَلَة.' },
      ],
      quiz: { word: 4, q: 'Why is it ذِي here, and not ذُو or ذَا?', options: ['It is the subject of the phrase', 'It describes يَوْمٍ, which is genitive after فِي', 'It is the object of إِطْعَامٌ'], answer: 1, why: 'The five nouns show case with long vowels: ذُو nominative, ذَا accusative, ذِي genitive. ذِي describes يَوْمٍ, so it copies its genitive case.' },
    },
    15: {
      words: [
        { role: 'Object of a verbal noun', say: 'An orphan. The verbal noun إِطْعَامٌ works like its verb, so it takes an object. Accusative with tanwin fatḥa.' },
        { role: 'Adjective (naʿt), one of the five nouns', say: 'Having. It describes يَتِيمًا, so it is accusative: ذَا. It owns the next word.' },
        { role: 'Second part of a possession', say: 'Nearness, kinship. Genitive with tanwin kasra, because ذَا owns it. A verbal noun with a mim, like مَسْغَبَةٍ.' },
      ],
      quiz: { word: 0, q: 'Why is يَتِيمًا accusative?', options: ['It follows a preposition', 'It is the subject of a sentence', 'It is the object of the verbal noun إِطْعَامٌ'], answer: 2, why: 'al-Jadwal explains that a verbal noun can work like its verb. Here “or that you feed an orphan” could take its place, so إِطْعَامٌ takes an object.' },
    },
    16: {
      words: [
        { role: 'Or', say: 'A joining word. It joins مِسْكِينًا to يَتِيمًا.' },
        { role: 'Joined object', say: 'A poor person. Joined to يَتِيمًا, so it is also an object of إِطْعَامٌ, accusative with tanwin fatḥa.' },
        { role: 'Adjective (naʿt), one of the five nouns', say: 'Having. It describes مِسْكِينًا, so it is accusative: ذَا. It owns the next word.' },
        { role: 'Second part of a possession', say: 'Dust, being poor. Genitive with tanwin kasra, because ذَا owns it. al-Jadwal derives it from تَرِبَ, “dust touched him”.' },
      ],
      quiz: { word: 1, q: 'What is مِسْكِينًا joined to by أَوْ?', options: ['فَكُّ', 'يَتِيمًا', 'يَوْمٍ'], answer: 1, why: 'مِسْكِينًا is joined to يَتِيمًا, the other object of إِطْعَامٌ. That is why it is accusative too.' },
    },
    17: {
      words: [
        { role: 'Joining word', say: 'Then. al-Jadwal joins this clause to لَا اقْتَحَمَ of verse 11.' },
        { role: 'Verb kāna, past', say: 'He was. The subject “he” is hidden.' },
        { role: 'Preposition', say: 'Among. The phrase it starts is tied to the predicate of كَانَ.' },
        { role: 'Relative pronoun', say: 'Those who. It never changes its ending. Its position is genitive after مِنَ. The next clause completes it.' },
        { role: 'Verb, past, Form IV', say: 'They believed. The ending وا is the subject. This clause completes الَّذِينَ and has no place of its own in the grammar.' },
        { role: 'And', say: 'It joins the next clause to آمَنُوا.' },
        { role: 'Verb, past, Form VI', say: 'They urged one another. Form VI (تَفَاعَلَ) means doing it to each other. The ending وا is the subject. It is joined to آمَنُوا.' },
        { role: 'Preposition', say: 'It belongs to the first تَوَاصَوْا: urged one another to something.' },
        { role: 'After a preposition', say: 'Patience. Genitive with kasra after بِ.' },
        { role: 'And', say: 'It joins the second تَوَاصَوْا to the first.' },
        { role: 'Verb, past, Form VI', say: 'The same verb again, joined to the first one.' },
        { role: 'Preposition', say: 'It belongs to the second تَوَاصَوْا.' },
        { role: 'After a preposition', say: 'Mercy. Genitive with kasra after بِ. A verbal noun with a mim, like مَسْغَبَةٍ.' },
      ],
      quiz: { word: 0, q: 'According to al-Jadwal, what does ثُمَّ join?', options: ['The clause with كَانَ to the clause لَا اقْتَحَمَ in verse 11', 'The clause with كَانَ to إِطْعَامٌ in verse 14', 'Two nouns'], answer: 0, why: 'al-Jadwal joins the clause كَانَ مِنَ الَّذِينَ to the clause لَا اقْتَحَمَ. A note adds that it either falls under the same negation, or is a positive statement if there is none.' },
    },
    18: {
      words: [
        { role: 'Subject (mubtadaʾ)', say: 'Those. It points back to the believers of verse 17. It never changes its ending, so only its position is nominative.' },
        { role: 'Predicate (khabar), first part of a possession', say: 'Companions. Nominative with ḍamma. It owns the next word, so it has no al-. A broken plural of صَاحِب.' },
        { role: 'Second part of a possession', say: 'The right side. Genitive with kasra, because أَصْحَابُ owns it. On the pattern مَفْعَلَة.' },
      ],
      quiz: { word: 1, q: 'What is أَصْحَابُ in this sentence?', options: ['The subject', 'An adjective', 'The predicate'], answer: 2, why: 'أُولَٰئِكَ is the subject. أَصْحَابُ الْمَيْمَنَةِ says who they are, so it is the predicate.' },
    },
    19: {
      words: [
        { role: 'Joining wa', say: 'al-Jadwal: it joins this sentence to the one in verse 18.' },
        { role: 'Relative pronoun, subject', say: 'Those who. It starts the sentence, so its position is nominative. Its predicate is the whole sentence هُمْ أَصْحَابُ الْمَشْأَمَةِ.' },
        { role: 'Verb, past', say: 'They disbelieved. The ending وا is the subject. This clause completes الَّذِينَ.' },
        { role: 'Preposition', say: 'It belongs to كَفَرُوا: disbelieved in.' },
        { role: 'After a preposition, plus “our”', say: 'Our signs. Genitive with kasra after بِ. The ending نَا means “our”.' },
        { role: 'Subject (mubtadaʾ) of its own sentence', say: 'They. al-Jadwal reads it as the subject of its own sentence. It repeats the subject and adds emphasis.' },
        { role: 'Predicate (khabar)', say: 'Companions. It says what هُمْ are. Nominative, and the first part of a possession.' },
        { role: 'Second part of a possession', say: 'The left side. Genitive with kasra, because أَصْحَابُ owns it. The mirror of الْمَيْمَنَةِ.' },
      ],
      quiz: { word: 5, q: 'How does al-Jadwal read هُمْ here?', options: ['As a pronoun of separation (ḍamīr al-faṣl)', 'As the subject of its own sentence', 'As the object of كَفَرُوا'], answer: 1, why: 'al-Jadwal reads هُمْ as a subject, and أَصْحَابُ as its predicate. That whole sentence is the predicate of الَّذِينَ.' },
    },
    20: {
      words: [
        { role: 'Predicate placed first', say: 'The preposition عَلَى with the pronoun هِمْ: “upon them”. It is the predicate, put first, so the subject comes after it.' },
        { role: 'Subject (mubtadaʾ), comes last', say: 'Fire. Nominative with tanwin ḍamma. It may start the sentence even though it is indefinite, because the predicate comes first.' },
        { role: 'Adjective (naʿt)', say: 'Closed, sealed. It describes نَارٌ, so it copies its nominative case. A passive participle of the Form IV verb آصَدَ.' },
      ],
      quiz: { word: 0, q: 'What is عَلَيْهِمْ in this sentence?', options: ['The predicate, put first', 'The object', 'The adjective of نَارٌ'], answer: 0, why: 'The phrase says where the fire is, and it comes before the subject نَارٌ. al-Jadwal ties it to the predicate placed first.' },
    },
  },
};
