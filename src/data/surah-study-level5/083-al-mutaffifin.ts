// Plain-English teaching layer for Surah 83, Al-Mutaffifin. Same shape and rules as in surah-study.ts.
//
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Where al-Jadwal gives more than one reading, the line says which one it follows. Someone
// who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from '../surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Subject (mubtadaʾ)', say: 'A word of doom: “woe”. It has tanwin and still opens the sentence, because it is a curse. The predicate is not spoken.' },
        { role: 'After a preposition', say: 'لِ means “for”. The phrase goes with the predicate that is left unsaid. الْمُطَفِّفِينَ ends in ـِينَ because the preposition puts it in the genitive. These are people who give less than the right measure.' },
      ],
      quiz: { word: 0, q: 'Why can وَيْلٌ open the sentence even though it has tanwin?', options: ['Because it is a curse, a prayer against someone', 'Because it is a verb', 'Because it is plural'], answer: 0, why: 'al-Jadwal says a word like وَيْلٌ may start a sentence because it carries the sense of a prayer against someone. The predicate is left unsaid.' },
    },
    2: {
      words: [
        { role: 'Relative pronoun, adjective (naʿt)', say: 'It means “those who”. It never changes its ending. It describes الْمُطَفِّفِينَ from verse 1, so its place is genitive. al-Jadwal also allows a new sentence: “they are those who...”.' },
        { role: 'Time word “when”', say: 'It means “when”. The clause اكْتَالُوا عَلَى النَّاسِ is the word that belongs to it (its muḍāf ilayhi). The answer يَسْتَوْفُونَ is not part of that.' },
        { role: 'Verb, past, Form VIII', say: 'They take a measure for themselves. Form VIII (اِفْتَعَلَ) has a ت after the first letter. The middle ي shows as a long ā. The و means “they”.' },
        { role: 'Preposition', say: 'It goes with اكْتَالُوا. al-Zamakhshari, quoted in al-Jadwal, says it stands where مِنْ would be, because the buyer presses on the people. al-Jadwal also allows it to go with يَسْتَوْفُونَ.' },
        { role: 'After a preposition', say: 'The people they buy from. Genitive with kasra after عَلَى.' },
        { role: 'Verb, present, Form X; answer of إِذَا', say: 'They take in full. Form X (اِسْتَفْعَلَ) here means asking for the whole amount. The ending ـونَ means “they”, and the verb is indicative. It is the answer to إِذَا.' },
      ],
      quiz: { word: 1, q: 'What does the clause اكْتَالُوا عَلَى النَّاسِ do for إِذَا?', options: ['It is the subject of إِذَا', 'It is the answer to إِذَا', 'It is the clause that belongs to إِذَا (its muḍāf ilayhi)'], answer: 2, why: 'al-Jadwal reads the clause after إِذَا as its muḍāf ilayhi, in the genitive position. The answer is the next verb, يَسْتَوْفُونَ.' },
    },
    3: {
      words: [
        { role: 'And + time word “when”', say: 'وَ joins this sentence to verse 2. إِذَا means “when”, and the clause كَالُوهُمْ أَوْ وَزَنُوهُمْ belongs to it.' },
        { role: 'Verb, past, plus “them”', say: 'They measure out to them. The و means “they” and هُمْ means “them”, the people they sell to, so it is the object. The middle ي shows as a long ā.' },
        { role: 'Or', say: 'It joins two choices: measure or weigh.' },
        { role: 'Verb, past, plus “them”', say: 'They weigh out to them. The first و is a root letter of وَزَنَ, not “and”. The shadda is there because أَوْ is joined to it. The ending وهُمْ is “they” and “them”.' },
        { role: 'Verb, present, Form IV; answer of إِذَا', say: 'They make them lose. Form IV (أَفْعَلَ) here means making the other person lose. It is the answer to إِذَا. The ending ـونَ means “they”.' },
      ],
      quiz: { word: 1, q: 'What does the هُمْ at the end of كَالُوهُمْ mean?', options: ['The sellers themselves', 'The people they measure out to (the object)', '“They”, the subject of the verb'], answer: 1, why: 'The subject “they” is the و. The هُمْ is a second pronoun and it is the object: the people who are buying.' },
    },
    4: {
      words: [
        { role: 'Question of rebuke', say: 'أَ asks a question and لَا means “not”. al-Jadwal calls it a question of rebuke: “Do they not think?” It starts a new sentence.' },
        { role: 'Verb, present', say: 'He thinks. The doubled نّ is there because the root ظ ن ن has two identical last letters. The subject is the next word.' },
        { role: 'Subject (fāʿil)', say: 'The word “those”, pointing at the cheats from a distance. They are the ones who do the thinking.' },
        { role: 'أَنَّ and its noun', say: 'أَنَّ means “that” and puts the next noun in the accusative. The هُمْ is its noun. The whole أَنَّ clause fills the place of the two objects of يَظُنُّ.' },
        { role: 'Predicate of أَنَّ', say: 'Raised from the dead. It says what they will be. It is nominative with ـونَ. It is a passive participle: someone else raises them.' },
      ],
      quiz: { word: 3, q: 'What does the clause أَنَّهُم مَّبْعُوثُونَ do for يَظُنُّ?', options: ['It fills the place of the thing thought (its objects)', 'It is the subject of يَظُنُّ', 'It answers a condition'], answer: 0, why: 'al-Jadwal reads the أَنَّ clause as a verbal noun that stands in place of the two objects of يَظُنُّ. The subject is أُولَٰئِكَ.' },
    },
    5: {
      words: [
        { role: 'After a preposition', say: 'لِ means “for”. The phrase goes with مَبْعُوثُونَ in verse 4: raised for a great day. Genitive with tanwin because it is indefinite.' },
        { role: 'Adjective (naʿt)', say: 'Great. It describes يَوْمٍ, so it copies its genitive case, its tanwin, and its masculine singular form.' },
      ],
      quiz: { word: 1, q: 'Why does عَظِيمٍ end in kasra with tanwin?', options: ['It follows لِ directly', 'It is a verb', 'It copies the case and tanwin of the word it describes'], answer: 2, why: 'An adjective takes the case, number, gender and definiteness of the word it describes. يَوْمٍ is genitive and indefinite, so عَظِيمٍ is too.' },
    },
    6: {
      words: [
        { role: 'Time word, accusative', say: 'Day. Accusative with fatḥa because it tells the time. al-Jadwal ties it to an unspoken verb “they are raised”. The clause يَقُومُ النَّاسُ belongs to it.' },
        { role: 'Verb, present', say: 'He stands. The root is ق و م. The ending is ḍamma, the sign of the indicative.' },
        { role: 'Subject (fāʿil)', say: 'The people. They do the standing, so it is nominative.' },
        { role: 'Preposition + first part of a possession', say: 'لِ here goes with يَقُومُ and means “before”. رَبِّ is genitive after لِ and it owns the next word.' },
        { role: 'Second part of a possession', say: 'The worlds. Genitive with ـِينَ, because رَبِّ owns it.' },
      ],
      quiz: { word: 0, q: 'Why is يَوْمَ accusative in this verse?', options: ['It is the subject', 'It tells the time, tied to an unspoken verb “they are raised”', 'It follows a preposition'], answer: 1, why: 'al-Jadwal reads it as a word of time (ẓarf zamān), tied to an unspoken verb. A word of time takes the accusative.' },
    },
    7: {
      words: [
        { role: 'Rebuke', say: 'A word that says “stop!” al-Jadwal says it rebukes them for cheating and for forgetting the resurrection. It never changes its ending.' },
        { role: 'Particle إِنَّ', say: 'It stresses what follows and puts the next noun in the accusative.' },
        { role: 'Noun of إِنَّ, first part of a possession', say: 'Record. Accusative with fatḥa because إِنَّ stands before it. It owns الْفُجَّارِ, so it has no al-.' },
        { role: 'Second part of a possession', say: 'The wicked. Genitive with kasra, because كِتَابَ owns it. A broken plural of فَاجِر.' },
        { role: 'Lām of emphasis + preposition', say: 'The لَ is the “moved” lām (lām muzaḥlaqa). It belongs with إِنَّ but sits in front of the phrase. فِي means “in”, and the phrase goes with the predicate of إِنَّ, which is not spoken.' },
        { role: 'After a preposition', say: 'Sijjin, a name. al-Jadwal says it names a book of the wicked’s deeds, or a place. Genitive with tanwin after فِي.' },
      ],
      quiz: { word: 4, q: 'What does the لَ in لَفِي سِجِّينٍ do?', options: ['It means “not”', 'It makes the verb past', 'It adds stress, and it belongs with إِنَّ'], answer: 2, why: 'It is the lām of emphasis, moved from the predicate of إِنَّ to the front of the phrase (lām muzaḥlaqa).' },
    },
    8: {
      words: [
        { role: 'New sentence + question word', say: 'وَ starts a new sentence. مَا means “what” and is the subject. Its predicate is the clause أَدْرَىٰكَ.' },
        { role: 'Verb, past, Form IV, plus “you”', say: 'It made you know. It is Form IV of دَرَى (to know), not of دَرَكَ. The كَ means “you”: the first object. The whole clause is the predicate of the first مَا.' },
        { role: 'Question word, subject', say: 'A second “what”. It starts a short sentence, and that sentence fills the place of the second object of أَدْرَىٰكَ.' },
        { role: 'Predicate (khabar)', say: 'It says what the second مَا is about. Nominative with ḍamma and tanwin.' },
      ],
      quiz: { word: 1, q: 'Which root does أَدْرَىٰكَ come from?', options: ['د ر ي (to know)', 'د ر ك (to reach)', 'د ر س (to study)'], answer: 0, why: 'It is Form IV of دَرَى, “to know”, so it means “made you know”. It is not from دَرَكَ.' },
    },
    9: {
      words: [
        { role: 'Predicate of an unspoken “it”', say: 'A record. The subject “it” (huwa), meaning Sijjin, is left out. Nominative with tanwin. al-Jadwal reads this as a new sentence that explains.' },
        { role: 'Adjective (naʿt)', say: 'Written, marked. A passive participle. It describes كِتَابٌ and copies its nominative case and tanwin.' },
      ],
      quiz: { word: 0, q: 'Where is the subject of this verse?', options: ['In the word مَرْقُومٌ', 'It is left unsaid: “it”, meaning Sijjin', 'It is كِتَابٌ'], answer: 1, why: 'كِتَابٌ is the predicate. The subject, “it”, is not written, and it points back to Sijjin.' },
    },
    10: {
      words: [
        { role: 'Subject (mubtadaʾ)', say: 'Woe again, as in verse 1. It is a curse, so it can open the sentence although it has tanwin.' },
        { role: 'Badal of يَوْمَ (verse 6)', say: '“On that day”. al-Jadwal reads it as a badal (replacement) of يَوْمَ in verse 6, so its place is accusative. The tanwin stands for a missing clause: the day when the people stand.' },
        { role: 'After a preposition', say: 'For the deniers. Genitive after لِ. The phrase goes with the unspoken predicate, as in verse 1. The doubled ذّ of Form II means he calls it a lie again and again.' },
      ],
      quiz: { word: 1, q: 'What does يَوْمَئِذٍ replace, according to al-Jadwal?', options: ['The word وَيْلٌ', 'The word لِلْمُكَذِّبِينَ', 'The word يَوْمَ in verse 6'], answer: 2, why: 'al-Jadwal reads it as a badal of يَوْمَ يَقُومُ النَّاسُ in verse 6: that same day.' },
    },
    11: {
      words: [
        { role: 'Relative pronoun, adjective (naʿt)', say: 'Those who. It describes الْمُكَذِّبِينَ, so its place is genitive. al-Jadwal also allows a new sentence: “they are those who...”.' },
        { role: 'Verb, present, Form II', say: 'They call it a lie. This clause explains الَّذِينَ. The ending ـونَ means “they”.' },
        { role: 'Preposition + first part of a possession', say: 'بِ goes with يُكَذِّبُونَ: they deny it. يَوْمِ is genitive after بِ, and it owns الدِّينِ.' },
        { role: 'Second part of a possession', say: 'The reckoning, the repayment. Genitive because يَوْمِ owns it.' },
      ],
      quiz: { word: 0, q: 'What does الَّذِينَ do in this verse?', options: ['It describes الْمُكَذِّبِينَ (naʿt)', 'It is a verb', 'It is a preposition'], answer: 0, why: 'al-Jadwal reads it as an adjective of الْمُكَذِّبِينَ in verse 10, so it takes the genitive position. It also allows a new sentence.' },
    },
    12: {
      words: [
        { role: 'State wa + “not”', say: 'The وَ gives the situation: al-Jadwal reads the clause as a ḥāl (state) and also allows a new sentence. مَا means “not”.' },
        { role: 'Verb, present, Form II', say: 'He denies. Its subject comes after إِلَّا. The ending is ḍamma, the sign of the indicative.' },
        { role: 'Preposition + “it”', say: 'بِ goes with يُكَذِّبُ. The هِ means “it”: the Day of Recompense.' },
        { role: 'Word of limit “except”', say: 'After the “not”, it limits the denial to one group of people.' },
        { role: 'Subject (fāʿil), first part of a possession', say: 'Every. It is the one who denies, so it is nominative. It owns the next word.' },
        { role: 'Second part of a possession', say: 'Wrongdoer. Genitive with tanwin because كُلُّ owns it. It is a Form VIII active participle, and its last ي dropped in front of the tanwin.' },
        { role: 'Adjective (naʿt)', say: 'Sinful. It describes مُعْتَدٍ and copies its genitive case.' },
      ],
      quiz: { word: 4, q: 'What is كُلُّ in this verse?', options: ['The object of يُكَذِّبُ', 'The subject (fāʿil) of يُكَذِّبُ, placed after إِلَّا', 'A preposition'], answer: 1, why: 'The verb is يُكَذِّبُ and the one who denies is كُلُّ, so it is the subject. It is nominative with ḍamma.' },
    },
    13: {
      words: [
        { role: 'Time word “when”', say: 'When. The clause تُتْلَىٰ عَلَيْهِ آيَاتُنَا belongs to it (its muḍāf ilayhi), and the answer is قَالَ. al-Jadwal reads the whole sentence as an adjective of كُلُّ مُعْتَدٍ أَثِيمٍ in verse 12.' },
        { role: 'Verb, present, passive', say: 'They are recited. Passive: the reciter is not named. The ending is alif maqṣūra because the last root letter is weak. It is feminine because آيَاتُنَا is feminine.' },
        { role: 'Preposition + “him”', say: 'To him. It goes with تُتْلَىٰ. The هِ is the wrongdoer of verse 12.' },
        { role: 'Deputy subject (nāʾib al-fāʿil)', say: 'Our verses. The verb is passive, so this word takes the place of the subject and is nominative. The نَا means “our”.' },
        { role: 'Verb, past; answer of إِذَا', say: 'He said. The subject “he” is hidden in the verb. It is the answer to إِذَا.' },
        { role: 'Subject (mubtadaʾ) in the words said', say: 'Stories. It opens the words he said, and the predicate is left out: “they are stories of...”. It is nominative and it owns the next word.' },
        { role: 'Second part of a possession', say: 'The earlier peoples. Genitive with ـِينَ because أَسَاطِيرُ owns it.' },
      ],
      quiz: { word: 3, q: 'Why is آيَاتُنَا nominative?', options: ['It is the object of تُتْلَىٰ', 'It follows عَلَيْهِ', 'The verb is passive, so this word takes the place of the subject'], answer: 2, why: 'تُتْلَىٰ is passive. The thing that is recited becomes its deputy subject (nāʾib al-fāʿil), and a subject is nominative.' },
    },
    14: {
      words: [
        { role: 'Rebuke', say: 'Stop. It rejects what they said in verse 13.' },
        { role: 'Word that moves on', say: 'Rather. al-Jadwal calls it a move to a new statement (iḍrāb intiqālī): it leaves what was said and gives the real cause.' },
        { role: 'Verb, past', say: 'It covered over, like rust. The middle ي turned into a long ā. A new sentence starts here, and its doer is مَا.' },
        { role: 'Preposition', say: 'Over. It goes with رَانَ.' },
        { role: 'After a preposition', say: 'Their hearts. Genitive with kasra after عَلَىٰ. The هِمْ means “their”.' },
        { role: 'Relative pronoun, doer (fāʿil)', say: 'What. It does the covering, so its place is nominative. The pronoun that would point back (“what they used to earn it”) is left out. The clause after it explains it.' },
        { role: 'Verb kāna, past', say: 'They used to. The و is its noun (“they”). It needs a predicate.' },
        { role: 'Predicate of kāna', say: 'They earn. A verb with its clause can be the predicate, and its place is accusative. كَانَ with a present verb says they did it again and again.' },
      ],
      quiz: { word: 5, q: 'What does مَّا do in رَانَ عَلَىٰ قُلُوبِهِم مَّا كَانُوا يَكْسِبُونَ?', options: ['It is the doer (fāʿil) of رَانَ', 'It means “not”', 'It is a preposition'], answer: 0, why: 'al-Jadwal reads مَا as a relative pronoun: what they used to earn covered their hearts. It is the doer of رَانَ, so it is nominative in place.' },
    },
    15: {
      words: [
        { role: 'Rebuke', say: 'Stop. It rejects their excuse and starts a new warning.' },
        { role: 'إِنَّ and its noun', say: 'إِنَّ stresses the sentence. The هُمْ means “they”: the noun of إِنَّ, so it is accusative.' },
        { role: 'Preposition', say: 'From. It goes with مَحْجُوبُونَ. al-Jadwal adds an unspoken word: “from seeing their Lord”.' },
        { role: 'After a preposition', say: 'Their Lord. Genitive with kasra after عَنْ.' },
        { role: 'Time word', say: 'On that day. It also goes with مَحْجُوبُونَ. The tanwin stands for a missing clause: the day when the people stand.' },
        { role: 'Lām of emphasis + predicate of إِنَّ', say: 'The لَ is the moved lām of emphasis, which belongs with إِنَّ. مَحْجُوبُونَ means “shut out”. It is the predicate, nominative with ـونَ, and a passive participle: someone shuts them out.' },
      ],
      quiz: { word: 5, q: 'What does the لَ in لَّمَحْجُوبُونَ do?', options: ['It means “not”', 'It is the moved lām of emphasis that belongs with إِنَّ', 'It makes the word passive'], answer: 1, why: 'al-Jadwal names it the lām muzaḥlaqa: a lām of emphasis that stands on the predicate although it belongs with إِنَّ.' },
    },
    16: {
      words: [
        { role: 'And then', say: 'Then. It joins this sentence to the one before and moves a step further.' },
        { role: 'إِنَّ and its noun', say: 'إِنَّ stresses the sentence, and the هُمْ is “they”, its noun, accusative.' },
        { role: 'Lām of emphasis + predicate, first part of a possession', say: 'The moved lām of emphasis. صَالُو means “those who burn in”. It is nominative with the plural و. It has no ن because it owns the next word.' },
        { role: 'Second part of a possession', say: 'The blazing fire. Genitive with kasra because صَالُو owns it.' },
      ],
      quiz: { word: 2, q: 'Why does لَصَالُو end in و with no ن?', options: ['It is a dual', 'It is a verb', 'It is a plural that owns the next word, so the ن dropped'], answer: 2, why: 'A sound masculine plural drops its ن when it is the first part of a possession. صَالُو owns الْجَحِيمِ.' },
    },
    17: {
      words: [
        { role: 'And then', say: 'Then. It joins this sentence to the ones before.' },
        { role: 'Verb, present, passive', say: 'It will be said. Passive: the speaker is not named. Its deputy subject is the whole saying that follows.' },
        { role: 'Subject (mubtadaʾ)', say: 'This. It opens the saying and it is the subject.' },
        { role: 'Predicate (khabar)', say: 'The one that. A relative pronoun that never changes its ending. It is the predicate, so its place is nominative. The clause after it explains it.' },
        { role: 'Verb kāna, past, plus “you”', say: 'You were. The تُم means “you” (plural), and it is the noun of كَانَ.' },
        { role: 'Preposition + “it”', say: 'It goes with تُكَذِّبُونَ: you denied it.' },
        { role: 'Predicate of kāna', say: 'You deny. It is the predicate of كُنتُم, so its place is accusative. Form II.' },
      ],
      quiz: { word: 3, q: 'What is الَّذِي in هَٰذَا الَّذِي كُنتُم بِهِ تُكَذِّبُونَ?', options: ['The predicate of هَٰذَا', 'The subject', 'A verb'], answer: 0, why: 'هَٰذَا is the subject. الَّذِي is the predicate, and the clause after it tells which thing is meant.' },
    },
    18: {
      words: [
        { role: 'Rebuke', say: 'Stop. It turns away from the way of the wicked and moves on to the righteous.' },
        { role: 'Particle إِنَّ', say: 'It stresses what follows and puts the next noun in the accusative.' },
        { role: 'Noun of إِنَّ, first part of a possession', say: 'Record. Accusative with fatḥa because إِنَّ stands before it. It owns الْأَبْرَارِ, so it has no al-.' },
        { role: 'Second part of a possession', say: 'The righteous. Genitive with kasra, because كِتَابَ owns it. A broken plural of بَرّ.' },
        { role: 'Lām of emphasis + preposition', say: 'The moved lām of emphasis, as in verse 7. فِي means “in”, and the phrase goes with the unspoken predicate of إِنَّ.' },
        { role: 'After a preposition', say: 'ʿIlliyyin, a name. al-Jadwal reads it as a book of good deeds, or a place. It may be the plural of عِلِّيّ, or one word that only looks plural. Genitive after فِي.' },
      ],
      quiz: { word: 3, q: 'Why is الْأَبْرَارِ genitive?', options: ['It follows لَفِي', 'Because كِتَابَ owns it (muḍāf ilayhi)', 'It is the subject'], answer: 1, why: 'كِتَابَ and الْأَبْرَارِ form a possession. The second part of a possession is always genitive.' },
    },
    19: {
      words: [
        { role: 'New sentence + question word', say: 'وَ starts a new sentence. مَا means “what” and is the subject. Its predicate is the clause أَدْرَىٰكَ.' },
        { role: 'Verb, past, Form IV, plus “you”', say: 'It made you know. The كَ means “you”, the first object. The whole clause is the predicate of the first مَا.' },
        { role: 'Question word, subject', say: 'A second “what”. It starts a short sentence, and that sentence fills the place of the second object of أَدْرَىٰكَ.' },
        { role: 'Predicate (khabar)', say: 'It says what the second مَا is about. Nominative with the plural ending ـُونَ. al-Jadwal says it may be one word that only looks plural.' },
      ],
      quiz: { word: 3, q: 'Why does عِلِّيُّونَ end in ـُونَ here, but ـِينَ in verse 18?', options: ['It is a different word', 'The root changed', 'Here it is a predicate (nominative); in verse 18 it came after فِي (genitive)'], answer: 2, why: 'The same word changes its ending with its job. A predicate is nominative (ـُونَ). After a preposition it is genitive (ـِينَ).' },
    },
    20: {
      words: [
        { role: 'Predicate of an unspoken “it”', say: 'A record. The subject “it”, meaning ʿIlliyyin, is left out. Nominative with tanwin. al-Jadwal reads this as a new sentence that explains.' },
        { role: 'Adjective (naʿt)', say: 'Written, marked. A passive participle. It describes كِتَابٌ and copies its nominative case and tanwin.' },
      ],
      quiz: { word: 1, q: 'What does مَّرْقُومٌ do in this verse?', options: ['It describes كِتَابٌ (naʿt)', 'It is the subject', 'It is a verb'], answer: 0, why: 'مَرْقُومٌ is a passive participle used as an adjective. It follows كِتَابٌ in case and tanwin.' },
    },
    21: {
      words: [
        { role: 'Verb, present, plus “it”', say: 'They see it. The هُ means “it” (the record) and is the object. This clause is a second predicate of the unspoken “it” from verse 20. The verb stays singular because it comes before its doer.' },
        { role: 'Subject (fāʿil)', say: 'Those brought near. Nominative with ـُونَ. A Form II passive participle: someone brought them near.' },
      ],
      quiz: { word: 0, q: 'Why is يَشْهَدُهُ singular when its doer is plural?', options: ['It is a mistake', 'The verb comes before its doer, so it stays singular', 'It is a passive verb'], answer: 1, why: 'In Arabic a verb that comes before its doer stays singular, whatever the number of the doer.' },
    },
    22: {
      words: [
        { role: 'Particle إِنَّ', say: 'It stresses the sentence and puts the next noun in the accusative.' },
        { role: 'Noun of إِنَّ', say: 'The righteous. Accusative with fatḥa because إِنَّ stands before it.' },
        { role: 'Lām of emphasis + preposition', say: 'The moved lām of emphasis. فِي means “in”, and the phrase goes with the unspoken predicate of إِنَّ.' },
        { role: 'After a preposition', say: 'Bliss. Genitive with tanwin after فِي. The tanwin shows it is indefinite: bliss beyond words.' },
      ],
      quiz: { word: 1, q: 'Why does الْأَبْرَارَ end in fatḥa here, but kasra in verse 18?', options: ['The meaning changed', 'It is a verb here', 'Here إِنَّ stands before it (accusative); in verse 18 كِتَابَ owned it (genitive)'], answer: 2, why: 'Its job is different. Here it is the noun of إِنَّ, so it is accusative. In verse 18 it was the second part of a possession, so it was genitive.' },
    },
    23: {
      words: [
        { role: 'Preposition', say: 'On. The phrase goes with an unspoken ḥāl (state): they look while they sit on couches.' },
        { role: 'After a preposition', say: 'The couches. Genitive with kasra after عَلَى. A broken plural.' },
        { role: 'Verb, present', say: 'They look. The و means “they”. This clause is a second predicate of إِنَّ in verse 22. The object is not said.' },
      ],
      quiz: { word: 0, q: 'How does al-Jadwal read عَلَى الْأَرَائِكِ?', options: ['It goes with an unspoken ḥāl: they look while on couches', 'It is the subject', 'It is a verb'], answer: 0, why: 'al-Jadwal ties the phrase to a ḥāl (state) from the doers of يَنظُرُونَ.' },
    },
    24: {
      words: [
        { role: 'Verb, present', say: 'You recognise. The “you” is hidden. It speaks to anyone who sees them. The clause is a third predicate of إِنَّ in verse 22.' },
        { role: 'Preposition', say: 'In. It goes with تَعْرِفُ.' },
        { role: 'After a preposition', say: 'Their faces. Genitive with kasra after فِي. The هِمْ means “their”.' },
        { role: 'Object (mafʿūl bihi), first part of a possession', say: 'The glow. It is what you recognise, so it is accusative with fatḥa. It owns the next word.' },
        { role: 'Second part of a possession', say: 'The bliss. Genitive with kasra because نَضْرَةَ owns it.' },
      ],
      quiz: { word: 3, q: 'Why is نَضْرَةَ accusative?', options: ['It follows فِي', 'It is the object of تَعْرِفُ', 'It is the subject'], answer: 1, why: 'What you recognise is the object of تَعْرِفُ. An object is accusative.' },
    },
    25: {
      words: [
        { role: 'Verb, present, passive', say: 'They are given to drink. Passive: the one who serves is not named. The و is the deputy subject, “they”. This clause is a fourth predicate of إِنَّ in verse 22.' },
        { role: 'Preposition', say: 'Of, from. It goes with يُسْقَوْنَ and gives the source of the drink.' },
        { role: 'After a preposition', say: 'Pure wine. Genitive with tanwin after مِنْ.' },
        { role: 'Adjective (naʿt)', say: 'Sealed. A passive participle. It describes رَحِيقٍ and copies its genitive case and tanwin.' },
      ],
      quiz: { word: 3, q: 'Which word does مَّخْتُومٍ describe?', options: ['يُسْقَوْنَ', 'مِنْ', 'رَحِيقٍ'], answer: 2, why: 'مَخْتُومٍ is an adjective. It follows the noun it describes, رَحِيقٍ, in case and tanwin.' },
    },
    26: {
      words: [
        { role: 'Subject (mubtadaʾ)', say: 'Its seal, or what it ends with. The هُ means “its”. al-Jadwal reads this whole sentence as a second adjective of رَحِيقٍ in verse 25.' },
        { role: 'Predicate (khabar)', say: 'Musk. Nominative with tanwin.' },
        { role: 'Aside wa + preposition', say: 'The وَ is parenthetical: it breaks in with a call to the reader. فِي goes with يَتَنَافَسِ.' },
        { role: 'After a preposition', say: 'That. It points to the wine. Its place is genitive after فِي.' },
        { role: 'fa + command lām + verb', say: 'The فَ answers an unspoken condition: if people are going to compete for anything, let them compete in this. لِ is the command lām (“let”), and the verb is jussive. Form VI means competing with one another.' },
        { role: 'Subject (fāʿil)', say: 'The ones who compete. Nominative with ـُونَ. A Form VI active participle.' },
      ],
      quiz: { word: 4, q: 'What does the لِ in فَلْيَتَنَافَسِ do?', options: ['It makes a command: “let them compete”', 'It means “for”', 'It means “not”'], answer: 0, why: 'This is the lām of command. It puts the verb in the jussive and gives the sense “let them...”.' },
    },
    27: {
      words: [
        { role: 'And + subject (mubtadaʾ)', say: 'وَ joins this sentence to خِتَامُهُ مِسْكٌ. مِزَاجُهُ is what it is mixed with. The هُ means “its”. Nominative.' },
        { role: 'Preposition', say: 'From. The phrase goes with the predicate, which is left unsaid.' },
        { role: 'After a preposition', say: 'Tasnim, the name of a spring in Paradise. Genitive with tanwin after مِنْ.' },
      ],
      quiz: { word: 1, q: 'What does the phrase مِن تَسْنِيمٍ go with?', options: ['The verb يَشْرَبُ', 'The unspoken predicate of مِزَاجُهُ', 'The word رَحِيقٍ'], answer: 1, why: 'al-Jadwal ties the phrase to the predicate of مِزَاجُهُ, which is not written.' },
    },
    28: {
      words: [
        { role: 'Object of an unspoken verb', say: 'A spring. Accusative with tanwin. al-Jadwal: an unspoken verb such as “I mean” or “I praise” takes it as its object. It also allows it as the object of “they are given to drink”.' },
        { role: 'Verb, present', say: 'He drinks. The clause يَشْرَبُ بِهَا الْمُقَرَّبُونَ describes عَيْنًا. The verb stays singular because it comes before its doer.' },
        { role: 'Preposition + “it”', say: 'It goes with يَشْرَبُ. The verb carries the sense of drinking with joy, so بِ is used. The هَا means “it”: the spring.' },
        { role: 'Subject (fāʿil)', say: 'Those brought near. Nominative with ـُونَ.' },
      ],
      quiz: { word: 1, q: 'What does the clause starting with يَشْرَبُ do for عَيْنًا?', options: ['It answers a condition', 'It is the subject', 'It describes it (naʿt)'], answer: 2, why: 'al-Jadwal reads the clause as an adjective of عَيْنًا: a spring that those brought near drink from.' },
    },
    29: {
      words: [
        { role: 'Particle إِنَّ', say: 'It stresses the sentence and puts the next noun in the accusative.' },
        { role: 'Noun of إِنَّ', say: 'Those who. A relative pronoun that never changes its ending. Its place is accusative because it is the noun of إِنَّ. The clause أَجْرَمُوا explains it.' },
        { role: 'Verb, past, Form IV', say: 'They did crimes. This clause explains الَّذِينَ. The و means “they”.' },
        { role: 'Verb kāna, past', say: 'They used to. The whole clause that starts here is the predicate of إِنَّ. The و is the noun of كَانَ.' },
        { role: 'Preposition', say: 'At. It goes with يَضْحَكُونَ: they laughed at.' },
        { role: 'Relative pronoun, after a preposition', say: 'Those who. Its place is genitive after مِنَ. The clause آمَنُوا explains it.' },
        { role: 'Verb, past, Form IV', say: 'They believed. This clause explains the second الَّذِينَ.' },
        { role: 'Predicate of kāna', say: 'They laugh. Its place is accusative as the predicate of كَانُوا. With كَانُوا it says: they used to laugh, again and again.' },
      ],
      quiz: { word: 7, q: 'What is يَضْحَكُونَ in this verse?', options: ['The predicate of كَانُوا', 'The subject of إِنَّ', 'An object'], answer: 0, why: 'كَانُوا needs a predicate, and the verb يَضْحَكُونَ with its clause is that predicate. Its place is accusative.' },
    },
    30: {
      words: [
        { role: 'And + time word “when”', say: 'وَ joins this to verse 29. The clause مَرُّوا بِهِمْ belongs to إِذَا. The whole conditional sentence is joined to يَضْحَكُونَ in verse 29.' },
        { role: 'Verb, past', say: 'They passed. The root is م ر ر, so the last two letters are doubled. The و means “they”.' },
        { role: 'Preposition + “them”', say: 'By them. It goes with مَرُّوا. The هِمْ means the believers.' },
        { role: 'Verb, present, Form VI; answer of إِذَا', say: 'They wink at one another. Form VI (تَفَاعَلَ) means doing it to each other. It is the answer to إِذَا.' },
      ],
      quiz: { word: 3, q: 'What does Form VI (تَفَاعَلَ) add to يَتَغَامَزُونَ?', options: ['Something done to oneself', 'Something done to one another', 'A passive meaning'], answer: 1, why: 'Form VI usually means that people do the action to each other. They wink at one another.' },
    },
    31: {
      words: [
        { role: 'And + time word “when”', say: 'The same pattern as in verse 30. The clause انقَلَبُوا إِلَىٰ أَهْلِهِمُ belongs to إِذَا.' },
        { role: 'Verb, past, Form VII', say: 'They went back. Form VII (اِنْفَعَلَ) shows the action coming back on the doer. The و means “they”.' },
        { role: 'Preposition', say: 'To. It goes with انقَلَبُوا.' },
        { role: 'After a preposition', say: 'Their people, their family. Genitive after إِلَىٰ. The هِمُ means “their”.' },
        { role: 'Verb, past; answer of إِذَا', say: 'They went back. The same verb again, now as the answer to إِذَا.' },
        { role: 'Circumstantial state (ḥāl)', say: 'Joking, full of fun. It tells how they went back. Accusative, shown by ـِينَ. A describing word of the pattern فَعِل.' },
      ],
      quiz: { word: 5, q: 'What does فَكِهِينَ tell us?', options: ['Who went back', 'Where they went', 'How they went back (their state)'], answer: 2, why: 'A ḥāl describes the state of the doer while the action happens. They went back joking.' },
    },
    32: {
      words: [
        { role: 'And + time word “when”', say: 'The same pattern again. The clause رَأَوْهُمْ belongs to إِذَا.' },
        { role: 'Verb, past, plus “them”', say: 'They saw them. The و means “they” and the هُمْ means “them”: the believers.' },
        { role: 'Verb, past; answer of إِذَا', say: 'They said. It is the answer to إِذَا. What they said comes next.' },
        { role: 'Particle إِنَّ', say: 'It stresses their words. Everything that follows is what they said.' },
        { role: 'Noun of إِنَّ', say: 'These people. It never changes its ending, so only its place is accusative, as the noun of إِنَّ.' },
        { role: 'Lām of emphasis + predicate', say: 'The moved lām of emphasis. ضَالُّونَ means “lost”. It is the predicate of إِنَّ, nominative with ـونَ.' },
      ],
      quiz: { word: 4, q: 'Why does هَٰؤُلَاءِ not show a case ending?', options: ['It never changes its ending; the case shows only in its place', 'It has a shadda', 'It is a verb'], answer: 0, why: 'A demonstrative word is fixed. It keeps the same form, and its job (here, noun of إِنَّ, accusative) shows only in its place in the sentence.' },
    },
    33: {
      words: [
        { role: 'State wa + “not”', say: 'The وَ gives a situation: they said it while they had not been sent. al-Jadwal calls this a ḥāl. مَا means “not”.' },
        { role: 'Verb, past, passive, Form IV', say: 'They were sent. Passive: who sent them is not named. The و is the deputy subject.' },
        { role: 'Preposition + “them”', say: 'Over them. It goes with حَافِظِينَ. The هِمْ means the believers.' },
        { role: 'Circumstantial state (ḥāl)', say: 'As guards. It tells in what state they were not sent. Accusative, shown by ـِينَ. It is a ḥāl from the و of أُرْسِلُوا.' },
      ],
      quiz: { word: 3, q: 'What does حَافِظِينَ do in this verse?', options: ['It is the subject', 'It tells the state: sent “as guards”', 'It is a verb'], answer: 1, why: 'al-Jadwal reads it as a ḥāl from the و of أُرْسِلُوا. They were not sent as guards over the believers.' },
    },
    34: {
      words: [
        { role: 'fa + time word', say: 'The فَ answers an unspoken condition: if they laughed then, today the believers laugh. الْيَوْمَ is a word of time, accusative, and it goes with يَضْحَكُونَ at the end.' },
        { role: 'Subject (mubtadaʾ)', say: 'Those who. A relative pronoun that never changes its ending. It starts the sentence, so its place is nominative. The clause آمَنُوا explains it.' },
        { role: 'Verb, past, Form IV', say: 'They believed. This clause explains الَّذِينَ.' },
        { role: 'Preposition', say: 'At. It goes with يَضْحَكُونَ.' },
        { role: 'After a preposition', say: 'The unbelievers. Genitive with kasra after مِنَ. A broken plural.' },
        { role: 'Predicate (khabar)', say: 'They laugh. This is the predicate of الَّذِينَ. The ـونَ means “they”.' },
      ],
      quiz: { word: 0, q: 'What does the فَ in فَالْيَوْمَ do, according to al-Jadwal?', options: ['It shows cause and effect', 'It joins two nouns', 'It answers an unspoken condition'], answer: 2, why: 'al-Jadwal reads it as a fa that links to an unspoken condition: if the criminals laughed in the world, then today the believers laugh.' },
    },
    35: {
      words: [
        { role: 'Preposition', say: 'On. The phrase goes with an unspoken ḥāl: they look while they sit on couches.' },
        { role: 'After a preposition', say: 'The couches. Genitive with kasra after عَلَى.' },
        { role: 'Verb, present', say: 'They look. Here the clause is a ḥāl (state) from the doers of يَضْحَكُونَ in verse 34: they laugh while they look. In verse 23 it was a predicate of إِنَّ.' },
      ],
      quiz: { word: 2, q: 'What does يَنظُرُونَ do for يَضْحَكُونَ in verse 34?', options: ['It tells their state: they laugh while they look', 'It is the subject', 'It is the answer to a condition'], answer: 0, why: 'al-Jadwal reads the clause as a ḥāl from the doers of يَضْحَكُونَ.' },
    },
    36: {
      words: [
        { role: 'Question word', say: 'A word that asks a yes/no question. It starts a new sentence.' },
        { role: 'Verb, past, passive, Form II', say: 'They were paid back. Passive: who pays is not named. The doubled letter is Form II. The next word is its deputy subject.' },
        { role: 'Deputy subject (nāʾib al-fāʿil)', say: 'The unbelievers. The verb is passive, so this word takes the place of the subject and is nominative.' },
        { role: 'Masdar particle “what”', say: 'مَا with the verb after it means “their doing”. Together they are accusative in place, because the word مِنْ (“for”) has dropped. al-Jadwal also allows a relative pronoun, “that which”.' },
        { role: 'Verb kāna, past', say: 'They used to. The و is its noun.' },
        { role: 'Predicate of kāna', say: 'They do. Its place is accusative as the predicate of كَانُوا.' },
      ],
      quiz: { word: 3, q: 'How does al-Jadwal read مَا in مَا كَانُوا يَفْعَلُونَ?', options: ['As the word “not”', 'As a masdar particle: “their doing”', 'As a question word'], answer: 1, why: 'The first reading al-Jadwal gives is a masdar particle. مَا كَانُوا يَفْعَلُونَ then means “their doing”.' },
    },
  },
};
