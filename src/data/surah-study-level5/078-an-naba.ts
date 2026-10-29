// Plain-English teaching layer for Surah 78, An-Naba. Same shape and rules as in surah-study.ts.
//
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Where al-Jadwal gives more than one reading, the line says which one it follows. Someone
// who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from '../surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Preposition + “what”', say: 'عَمَّ is عَنْ (“about”) joined to مَا (“what”). The alif of مَا drops after a preposition, and only a fatḥa is left as its trace. The phrase is tied to يَتَسَاءَلُونَ.' },
        { role: 'Verb, present, Form VI', say: 'Form VI (تَفَاعَلَ) means doing something to each other: they ask one another. It is indicative, and the plural wāw is the subject.' },
      ],
      quiz: { word: 0, q: 'What happened to the alif of مَا in عَمَّ?', options: ['It was never there', 'It dropped because a preposition comes before مَا', 'It turned into a hamza'], answer: 1, why: 'When مَا means “what?” and a preposition comes before it, its alif drops. The fatḥa stays as a trace, so عَنْ + مَا is written عَمَّ.' },
    },
    2: {
      words: [
        { role: 'Preposition', say: 'It means “about”. Its nūn takes a kasra so that two sukūns do not meet before the lām of النَّبَإِ. The phrase is tied to an unspoken يَتَسَاءَلُونَ: “about the news they ask”.' },
        { role: 'After a preposition', say: 'Genitive with kasra, because عَنِ governs it.' },
        { role: 'Adjective (naʿt)', say: 'It describes النَّبَإِ, so it is definite, masculine, singular and genitive like it. al-Jadwal counts it as the first adjective; الَّذِي in verse 3 is the second.' },
      ],
      quiz: { word: 2, q: 'Why is الْعَظِيمِ genitive?', options: ['It follows a preposition itself', 'It is the second half of a possession', 'It describes النَّبَإِ and copies its case'], answer: 2, why: 'An adjective copies the case of the word it describes. النَّبَإِ is genitive after عَنِ, so الْعَظِيمِ is genitive too.' },
    },
    3: {
      words: [
        { role: 'Relative pronoun, second adjective', say: 'It points back to النَّبَإِ and acts as a second adjective for it. al-Jadwal does not call it a badal. Its ending never changes; only its position is genitive. The clause after it is its ṣilah.' },
        { role: 'Subject (mubtadaʾ)', say: 'A separate pronoun, “they”. It starts the short sentence inside the ṣilah, so it is nominative.' },
        { role: 'Preposition + “it”', say: 'فِي plus the pronoun هِ, “it”, meaning the news. The phrase is tied to مُخْتَلِفُونَ.' },
        { role: 'Predicate (khabar)', say: 'A Form VIII participle: “differing”. It is nominative, and ـُونَ is the nominative ending of a sound masculine plural.' },
      ],
      quiz: { word: 0, q: 'What is الَّذِي in this verse?', options: ['A second adjective of النَّبَإِ', 'The subject of the sentence', 'A preposition'], answer: 0, why: 'al-Jadwal reads الَّذِي as a second adjective (naʿt) of النَّبَإِ. Its position is genitive, and the clause هُمْ فِيهِ مُخْتَلِفُونَ is its ṣilah.' },
    },
    4: {
      words: [
        { role: 'Rebuke particle', say: 'A word that turns them back: “No!”. It never changes its ending. It rejects their asking in verses 1–3.' },
        { role: 'Verb, future', say: 'The سَـ puts the present tense in the future. The verb stays indicative, and the plural wāw is the subject. It begins a new sentence and carries a threat.' },
      ],
      quiz: { word: 1, q: 'What does the سَـ in سَيَعْلَمُونَ do?', options: ['It puts the verb in the future', 'It makes the verb a command', 'It makes the verb passive'], answer: 0, why: 'The prefix سَـ marks the future. The verb itself stays indicative.' },
    },
    5: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins this sentence to the one in verse 4. al-Jadwal says the repeated sentence is added to make the threat stronger.' },
        { role: 'Rebuke particle', say: 'The same word as in verse 4: “No!”. It never changes its ending.' },
        { role: 'Verb, future', say: 'The same verb as in verse 4: سَـ marks the future, the verb is indicative, and the plural wāw is the subject.' },
      ],
      quiz: { word: 0, q: 'What does ثُمَّ do in this verse?', options: ['It begins a question', 'It makes the verb past', 'It joins a repeated sentence to the first one to strengthen it'], answer: 2, why: 'ثُمَّ is a joining word (ʿaṭf). al-Jadwal says the second سَيَعْلَمُونَ is added to the first to make the threat stronger.' },
    },
    6: {
      words: [
        { role: 'Question + “not”', say: 'The hamza asks a question that expects the answer “yes”, and لَمْ negates the verb and puts it in the jussive. Together: “Have We not...?”' },
        { role: 'Verb, present, jussive', say: 'Jussive after لَمْ, so its last letter loses its vowel; before the al- of الْأَرْضَ it takes a kasra. The subject “We” is hidden. جَعَلَ here takes two objects.' },
        { role: 'First object', say: 'What was made. Accusative with fatḥa.' },
        { role: 'Second object', say: 'What the earth was made into: a resting place. Accusative with tanwīn.' },
      ],
      quiz: { word: 3, q: 'What is مِهَادًا in this verse?', options: ['The subject', 'The second object of نَجْعَلِ', 'An adverb of time'], answer: 1, why: 'جَعَلَ takes two objects: الْأَرْضَ is what was made, and مِهَادًا is what it was made into.' },
    },
    7: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins الْجِبَالَ to الْأَرْضَ and أَوْتَادًا to مِهَادًا, under the same verb and the same question in verse 6. The verb is not said again.' },
        { role: 'First object, joined to the earth', say: 'Accusative with fatḥa, because it is joined to الْأَرْضَ.' },
        { role: 'Second object, joined to “resting place”', say: 'Accusative with tanwīn. The mountains are made into “stakes”.' },
      ],
      quiz: { word: 0, q: 'What does وَ join in this verse?', options: ['A new sentence with its own verb', 'الْجِبَالَ to الْأَرْضَ, under the verb of verse 6', 'Two verbs'], answer: 1, why: 'al-Jadwal reads this verse as joined to verse 6: the mountains are the first object joined to the earth, and “stakes” is the second object joined to “resting place”.' },
    },
    8: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins this sentence to the sentence of verse 6.' },
        { role: 'Verb, past, + “you”', say: 'The ending نَا is the subject “We” and the ending كُمْ is the object “you”. This verb takes only one object.' },
        { role: 'State (ḥāl)', say: 'Accusative with tanwīn. It tells in what state you were created, and it describes the object كُمْ: “as pairs”.' },
      ],
      quiz: { word: 2, q: 'What does أَزْوَاجًا do?', options: ['It tells the state of the people created (ḥāl)', 'It is the second object of خَلَقَ', 'It is the subject'], answer: 0, why: 'al-Jadwal reads أَزْوَاجًا as a ḥāl from the object pronoun كُمْ. خَلَقَ takes only one object, so it cannot be a second object.' },
    },
    9: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins this sentence to the sentence of verse 6.' },
        { role: 'Verb, past', say: 'The ending نَا is the subject “We”. Here the two-object pattern comes back: “We made X into Y”.' },
        { role: 'First object', say: 'Accusative with fatḥa. The ending كُمْ means “your”.' },
        { role: 'Second object', say: 'Accusative with tanwīn: sleep was made into a rest.' },
      ],
      quiz: { word: 3, q: 'What is سُبَاتًا in this verse?', options: ['The first object of جَعَلْنَا', 'A state (ḥāl)', 'The second object of جَعَلْنَا'], answer: 2, why: 'نَوْمَكُمْ is what was made, and سُبَاتًا is what it was made into. That makes it the second object.' },
    },
    10: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins this sentence to the sentence of verse 6.' },
        { role: 'Verb, past', say: 'The ending نَا is the subject “We”. It takes two objects.' },
        { role: 'First object', say: 'Accusative with fatḥa: the night.' },
        { role: 'Second object', say: 'Accusative with tanwīn. The night is called “clothing”; al-Jadwal names this a tashbīh balīgh, a comparison with the word “like” left out.' },
      ],
      quiz: { word: 3, q: 'What kind of comparison does al-Jadwal see in لِبَاسًا?', options: ['A comparison with the word “like” left out (tashbīh balīgh)', 'A question', 'An oath'], answer: 0, why: 'Night is compared to clothing, because both cover. The comparison word and the point of likeness are left out, which al-Jadwal calls tashbīh balīgh.' },
    },
    11: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins this sentence to the sentence of verse 6.' },
        { role: 'Verb, past', say: 'The ending نَا is the subject “We”. It takes two objects.' },
        { role: 'First object', say: 'Accusative with fatḥa: the day.' },
        { role: 'Second object', say: 'Accusative with tanwīn. A verbal noun with a mīm, “making a living”. al-Jadwal says a word for time is unsaid: “the time of making a living”.' },
      ],
      quiz: { word: 3, q: 'What does al-Jadwal say about مَعَاشًا?', options: ['It is a verb', 'It stands for a time: “the time of making a living”', 'It is the subject'], answer: 1, why: 'al-Jadwal reads مَعَاشًا as a mīm-verbal noun that stands for a time, so the word “time” is unsaid.' },
    },
    12: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins this sentence to the sentence of verse 6.' },
        { role: 'Verb, past', say: 'The last letter of بَنَى shows up as يْ before نَا. The ending نَا is the subject “We”. al-Jadwal says it carries the sense of “raised” here.' },
        { role: 'Adverb of place', say: 'Accusative with fatḥa. The ending كُمْ means “you”. It is tied to بَنَيْنَا and tells where the heavens were built.' },
        { role: 'Object, standing for “seven heavens”', say: 'The object of بَنَيْنَا, accusative with tanwīn. It is an adjective that stands in for a noun that is not said, سَمَاوَاتٍ: “seven (heavens)”.' },
        { role: 'Adjective (naʿt)', say: 'It describes the unsaid heavens, so it is accusative with tanwīn: “strong ones”.' },
      ],
      quiz: { word: 3, q: 'What is left unsaid after سَبْعًا?', options: ['A verb', 'A pronoun “they”', 'The noun سَمَاوَاتٍ (heavens), which سَبْعًا stands for'], answer: 2, why: 'al-Jadwal says سَبْعًا is an adjective standing in for a noun that is not said: “seven heavens”.' },
    },
    13: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins this sentence to the sentence of verse 6.' },
        { role: 'Verb, past', say: 'The ending نَا is the subject “We”. al-Jadwal gives it the sense of خَلَقْنَا (“We created”), so it takes one object. It also allows two objects, with “the sun” unsaid.' },
        { role: 'Object', say: 'What was created: a lamp. Accusative with tanwīn.' },
        { role: 'Adjective (naʿt)', say: 'It describes سِرَاجًا, so it is accusative with tanwīn. The doubled هّ gives the sense of blazing.' },
      ],
      quiz: { word: 1, q: 'How does al-Jadwal read جَعَلْنَا here?', options: ['As a verb with no object', 'As “We made”, always with two objects', 'As having the sense of “We created”, with one object'], answer: 2, why: 'al-Jadwal gives جَعَلَ the sense of خَلَقَ here, so سِرَاجًا is its one object. It also allows two objects with “the sun” unsaid.' },
    },
    14: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins this sentence to the sentence of verse 6.' },
        { role: 'Verb, past, Form IV', say: 'Form IV (أَفْعَلَ) makes something come down: “We sent down”. The ending نَا is the subject.' },
        { role: 'Preposition', say: 'It means “from” and is tied to أَنزَلْنَا. Its nūn has a fatḥa before the al- that follows.' },
        { role: 'After a preposition', say: 'Genitive. A sound feminine plural, so its genitive sign is a kasra. al-Jadwal glosses it as clouds whose time to rain has come.' },
        { role: 'Object', say: 'What was sent down: water. Accusative with tanwīn.' },
        { role: 'Adjective (naʿt)', say: 'It describes مَاءً: pouring water. The pattern فَعَّال often gives the sense of strong flow.' },
      ],
      quiz: { word: 5, q: 'What does ثَجَّاجًا describe?', options: ['الْمُعْصِرَاتِ', 'مَاءً', 'أَنزَلْنَا'], answer: 1, why: 'ثَجَّاجًا is an adjective, and it copies the case of مَاءً (accusative with tanwīn). It says what kind of water.' },
    },
    15: {
      words: [
        { role: 'Lām of purpose', say: 'It means “so that”. An unspoken أَنْ comes after it and puts the verb in the subjunctive.' },
        { role: 'Verb, present, subjunctive', say: 'Subjunctive with fatḥa, because of the unspoken أَنْ after لِ. Form IV: “bring out”. The subject “We” is hidden. أَنْ and the verb together work like a noun, tied to أَنزَلْنَا.' },
        { role: 'Preposition + “it”', say: 'بِ means “by means of”, and هِ points back to the water.' },
        { role: 'Object', say: 'What We bring out: grain. Accusative with tanwīn.' },
        { role: 'Joining word (ʿaṭf)', say: 'It joins نَبَاتًا to حَبًّا.' },
        { role: 'Object, joined to “grain”', say: 'Accusative with tanwīn: plants.' },
      ],
      quiz: { word: 1, q: 'Why is نُخْرِجَ subjunctive?', options: ['Because of an unspoken أَنْ after لِ', 'Because it follows لَمْ', 'Because it is a command'], answer: 0, why: 'al-Jadwal says an unspoken أَنْ comes after the lām of purpose, and that أَنْ puts the verb in the subjunctive.' },
    },
    16: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins جَنَّاتٍ to حَبًّا and نَبَاتًا, as another thing We bring out.' },
        { role: 'Object, joined to “grain”', say: 'Accusative. A sound feminine plural takes a kasra in the accusative, not a fatḥa.' },
        { role: 'Adjective (naʿt)', say: 'It describes جَنَّاتٍ: dense gardens, with branches wound together. Accusative with tanwīn.' },
      ],
      quiz: { word: 1, q: 'Why does جَنَّاتٍ end in a kasra although it is an object?', options: ['A sound feminine plural takes a kasra for both genitive and accusative', 'It follows a preposition', 'It is the second half of a possession'], answer: 0, why: 'A sound feminine plural uses the same ending, a kasra, for genitive and accusative. Here it is accusative, joined to حَبًّا.' },
    },
    17: {
      words: [
        { role: 'Particle “indeed”', say: 'It stresses the sentence and puts its noun in the accusative.' },
        { role: 'Noun of inna', say: 'Accusative with fatḥa, because إِنَّ governs it. It owns الْفَصْلِ, so it has no al-.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra: “the day of the decision”.' },
        { role: 'Verb “was”', say: 'It begins the khabar of إِنَّ. Its subject is hidden. It puts its predicate in the accusative.' },
        { role: 'Predicate of كَانَ', say: 'Accusative with tanwīn: an appointed time. The clause كَانَ مِيقَاتًا is the khabar of إِنَّ.' },
      ],
      quiz: { word: 1, q: 'Which word is the noun of إِنَّ?', options: ['الْفَصْلِ', 'مِيقَاتًا', 'يَوْمَ'], answer: 2, why: 'يَوْمَ is accusative because إِنَّ governs it. الْفَصْلِ only completes it as the second part of the possession.' },
    },
    18: {
      words: [
        { role: 'Badal of “appointed time”', say: 'al-Jadwal reads it as a badal of مِيقَاتًا in verse 17: it says which time is meant. It is accusative and owns the clause يُنفَخُ. al-Jadwal also allows a badal of the noun of إِنَّ, or tied to تَأْتُونَ.' },
        { role: 'Verb, present, passive', say: 'Passive: the one who blows is not named. It is indicative. This clause is what يَوْمَ owns.' },
        { role: 'Preposition', say: 'It means “in”. Together with الصُّورِ it stands as the deputy subject of يُنفَخُ.' },
        { role: 'After a preposition', say: 'Genitive with kasra. The phrase فِي الصُّورِ takes the place of the doer in the passive.' },
        { role: 'Joining word (ʿaṭf)', say: 'It adds تَأْتُونَ to يُنفَخُ, one after the other: the blowing, then the coming.' },
        { role: 'Verb, present', say: 'Indicative, with ـُونَ as the plural “you”. It is joined to يُنفَخُ, so it falls under the same day.' },
        { role: 'State (ḥāl)', say: 'Accusative with tanwīn. It tells how they come, from the doers of تَأْتُونَ: in groups.' },
      ],
      quiz: { word: 4, q: 'What does the فَ in فَتَأْتُونَ do?', options: ['It begins a question', 'It joins تَأْتُونَ to يُنفَخُ', 'It makes the verb passive'], answer: 1, why: 'al-Jadwal says تَأْتُونَ is joined to يُنفَخُ, so the فَ is a joining word. The two events follow in order.' },
    },
    19: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins this clause to the earlier ones. al-Jadwal says it is joined to تَأْتُونَ, or to يُنفَخُ.' },
        { role: 'Verb, past, passive', say: 'Passive: the opener is not named. The تِ shows a feminine subject. Its last letter has a kasra before the al- of السَّمَاءُ.' },
        { role: 'Deputy subject', say: 'Nominative with ḍamma. It takes the place of the doer in a passive sentence.' },
        { role: 'Joining word (ʿaṭf)', say: 'It joins كَانَتْ أَبْوَابًا to فُتِحَتِ: first opened, then became gates.' },
        { role: 'Verb “became”', say: 'Feminine, because the sky is feminine. Here it means “became”. It puts its predicate in the accusative.' },
        { role: 'Predicate of كَانَتْ', say: 'Accusative with tanwīn: gates.' },
      ],
      quiz: { word: 3, q: 'What is the role of the فَ in فَكَانَتْ?', options: ['It joins كَانَتْ أَبْوَابًا to فُتِحَتِ', 'It gives a reason for the opening', 'It starts a question'], answer: 0, why: 'al-Jadwal calls the فَ here a joining word: the clause كَانَتْ أَبْوَابًا is joined to the clause فُتِحَتِ السَّمَاءُ.' },
    },
    20: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins this clause to the earlier ones, as in verse 19.' },
        { role: 'Verb, past, Form II, passive', say: 'Form II (فَعَّلَ) in the passive: “were set moving”. The doer is not named. The تِ shows a feminine subject.' },
        { role: 'Deputy subject', say: 'Nominative with ḍamma. It takes the place of the doer in a passive sentence.' },
        { role: 'Joining word (ʿaṭf)', say: 'It joins كَانَتْ سَرَابًا to سُيِّرَتِ: first moved, then became a mirage.' },
        { role: 'Verb “became”', say: 'Feminine, because the mountains (a plural of things) take the feminine singular. It puts its predicate in the accusative.' },
        { role: 'Predicate of كَانَتْ', say: 'Accusative with tanwīn: a mirage. al-Jadwal calls the image a comparison with “like” left out (tashbīh balīgh).' },
      ],
      quiz: { word: 2, q: 'Why is الْجِبَالُ nominative?', options: ['It is the subject of an active verb', 'It is the noun of إِنَّ', 'It takes the place of the doer in a passive sentence'], answer: 2, why: 'سُيِّرَتِ is passive, so the thing that was moved takes the place of the doer and is nominative.' },
    },
    21: {
      words: [
        { role: 'Particle “indeed”', say: 'It stresses the sentence and puts its noun in the accusative.' },
        { role: 'Noun of inna', say: 'Accusative, but it ends in a fatḥa with no tanwīn: it is a foreign, feminine name, so it never takes tanwīn (a “diptote”).' },
        { role: 'Verb “was”', say: 'Feminine, to agree with جَهَنَّمَ. It puts its predicate in the accusative.' },
        { role: 'Predicate of كَانَتْ', say: 'Accusative with tanwīn. A word of intensity from رَصَدَ, “to watch”. al-Jadwal glosses it: Hell watches for the deniers, or is made ready for them.' },
      ],
      quiz: { word: 1, q: 'Why does جَهَنَّمَ have no tanwīn?', options: ['It follows a preposition', 'It is a feminine foreign name (a diptote)', 'It is definite with al-'], answer: 1, why: 'Names that are both feminine and foreign do not take tanwīn. That is why جَهَنَّمَ ends in a plain fatḥa.' },
    },
    22: {
      words: [
        { role: 'Preposition', say: 'It means “for”. The phrase لِلطَّاغِينَ is tied to مِرْصَادًا.' },
        { role: 'After a preposition', say: 'Genitive. The ending ـِينَ is the genitive (and accusative) ending of a sound masculine plural.' },
        { role: 'Second predicate of كَانَتْ', say: 'Accusative with tanwīn. al-Jadwal reads it as a second khabar of كَانَتْ: Hell is both a lookout and a place of return.' },
      ],
      quiz: { word: 2, q: 'What does al-Jadwal make مَآبًا?', options: ['A badal of مِرْصَادًا', 'A state (ḥāl)', 'A second predicate of كَانَتْ'], answer: 2, why: 'al-Jadwal reads مَآبًا as a second khabar of كَانَتْ, next to مِرْصَادًا.' },
    },
    23: {
      words: [
        { role: 'State (ḥāl)', say: 'Accusative; the ending ـِينَ is the accusative ending of a sound masculine plural. It tells the state of الطَّاغِينَ in verse 22: they stay.' },
        { role: 'Preposition + “it”', say: 'The pronoun هَا means Hell. The phrase is tied to لَابِثِينَ.' },
        { role: 'Adverb of time', say: 'Accusative with tanwīn: “for long ages”. It is tied to لَابِثِينَ.' },
      ],
      quiz: { word: 0, q: 'What is لَابِثِينَ?', options: ['A state (ḥāl) of الطَّاغِينَ', 'The subject', 'A preposition'], answer: 0, why: 'al-Jadwal reads لَابِثِينَ as a ḥāl from الطَّاغِينَ of verse 22: it tells the state they are in.' },
    },
    24: {
      words: [
        { role: 'Negation', say: 'It negates the verb. The verb stays indicative.' },
        { role: 'Verb, present', say: 'Indicative, with the plural wāw as the subject. The whole clause tells a state of the لَابِثِينَ of verse 23.' },
        { role: 'Preposition + “it”', say: 'The pronoun هَا means Hell. al-Jadwal ties it to an unsaid state of the tasting people, and also allows it to be tied to the verb.' },
        { role: 'Object', say: 'What they do not taste: coolness. Accusative with tanwīn. al-Jadwal notes that بَرْد can also mean “sleep”, in the speech of the Hudhayl tribe.' },
        { role: 'Joining wa + extra lā', say: 'وَ joins شَرَابًا to بَرْدًا. The second لَا is extra: it only stresses the denial.' },
        { role: 'Object, joined to “coolness”', say: 'Accusative with tanwīn: drink.' },
      ],
      quiz: { word: 4, q: 'What is the second لَا in وَلَا?', options: ['A new negative verb', 'An extra لَا that stresses the denial', 'A question word'], answer: 1, why: 'al-Jadwal calls the second لَا extra (zāʾida): it adds stress to the denial and does not change the meaning.' },
    },
    25: {
      words: [
        { role: 'Particle “except”', say: 'It marks what is left out of the denial in verse 24.' },
        { role: 'Badal of “drink”', say: 'al-Jadwal reads it as a badal of شَرَابًا, so it is accusative like it. Some scholars make it an accusative exception of the “cut-off” kind, and al-Jadwal mentions this.' },
        { role: 'Joining word (ʿaṭf)', say: 'It joins غَسَّاقًا to حَمِيمًا.' },
        { role: 'Joined to “scalding water”', say: 'Accusative with tanwīn: foul, dripping liquid.' },
      ],
      quiz: { word: 1, q: 'What does al-Jadwal make حَمِيمًا?', options: ['The subject', 'A state (ḥāl)', 'A badal of شَرَابًا'], answer: 2, why: 'After a denial, the word after إِلَّا can replace the word denied. al-Jadwal reads حَمِيمًا as a badal of شَرَابًا.' },
    },
    26: {
      words: [
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'Accusative with tanwīn. It stands for an unsaid verb: “We repay them a repayment”. al-Jadwal also allows “because of” (mafʿūl li-ajlihi) or a state: “repaid”.' },
        { role: 'Adjective (naʿt)', say: 'It describes جَزَاءً: fitting. It is a verbal noun of وَافَقَ (“to match”) used as an adjective, for emphasis.' },
      ],
      quiz: { word: 0, q: 'What is جَزَاءً here?', options: ['An absolute object (mafʿūl muṭlaq) for an unsaid verb', 'The subject of a nominal sentence', 'A noun after a preposition'], answer: 0, why: 'al-Jadwal reads جَزَاءً as a mafʿūl muṭlaq: it repeats the idea of an unsaid verb, “We repay a repayment”.' },
    },
    27: {
      words: [
        { role: 'Inna + “they”', say: 'The ending هُمْ is the noun of إِنَّ (accusative position). al-Jadwal calls the sentence an explanation of the punishment.' },
        { role: 'Verb “were”', say: 'The plural wāw is its subject, and the clause after it is its predicate.' },
        { role: 'Negation', say: 'It negates the verb. The verb stays indicative.' },
        { role: 'Verb, present', say: 'Indicative. The clause لَا يَرْجُونَ حِسَابًا is the predicate of كَانُوا.' },
        { role: 'Object', say: 'What they do not hope for: a reckoning. Accusative with tanwīn.' },
      ],
      quiz: { word: 3, q: 'What is the clause لَا يَرْجُونَ حِسَابًا?', options: ['The khabar of كَانُوا', 'The noun of كَانُوا', 'An adverb of time'], answer: 0, why: 'The noun of كَانُوا is the plural wāw. The clause لَا يَرْجُونَ حِسَابًا is its khabar.' },
    },
    28: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins كَذَّبُوا to كَانُوا, so it is part of the khabar of إِنَّ.' },
        { role: 'Verb, past, Form II', say: 'Form II (فَعَّلَ): the doubled ذّ gives strength, “denied”. The plural wāw is the subject.' },
        { role: 'Preposition', say: 'This verb uses بِ for what is denied. The phrase is tied to كَذَّبُوا.' },
        { role: 'After a preposition', say: 'Genitive with kasra (sound feminine plural). The ending نَا means “Our”.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'Accusative with tanwīn. It repeats the verb to strengthen it: “denied a denial”. This verbal noun is one the Arabs said; it is not made by a rule.' },
      ],
      quiz: { word: 4, q: 'What is كِذَّابًا?', options: ['A state (ḥāl)', 'An absolute object (mafʿūl muṭlaq) that strengthens the verb', 'The second object'], answer: 1, why: 'كِذَّابًا is a verbal noun of the same verb. It stands as a mafʿūl muṭlaq and strengthens it.' },
    },
    29: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It starts a new sentence, joined to the earlier one.' },
        { role: 'Object of an unsaid verb', say: 'Accusative with fatḥa. al-Jadwal reads an unsaid verb before it, “We counted every ...”, which the verb أَحْصَيْنَاهُ then explains (called ishtighāl). It owns شَيْءٍ.' },
        { role: 'Second part of a possession', say: 'Genitive with tanwīn.' },
        { role: 'Verb, past, + “it”', say: 'Form IV. The ending نَا is the subject, and هُ is the object and points back to كُلَّ شَيْءٍ. This clause only explains; it has no place of its own.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'Accusative with tanwīn. It stands for the verbal noun, because writing is a kind of counting. al-Jadwal also allows a state: “written”.' },
      ],
      quiz: { word: 1, q: 'Why is كُلَّ accusative?', options: ['It follows a preposition', 'It is the noun of إِنَّ', 'It is the object of an unsaid verb that أَحْصَيْنَاهُ explains'], answer: 2, why: 'al-Jadwal says an unsaid verb governs كُلَّ, and أَحْصَيْنَاهُ explains that verb.' },
    },
    30: {
      words: [
        { role: 'Fa that answers an unspoken condition', say: 'It ties the order to a condition that is left unsaid, something like “if you denied in the world, then ...”.' },
        { role: 'Verb, command', say: 'A command to many people. It is the answer to that unspoken condition.' },
        { role: 'Fa that gives the reason', say: 'It introduces the reason for the command.' },
        { role: 'Particle of future negation', say: 'It negates the future and puts the next verb in the subjunctive.' },
        { role: 'Verb, present, subjunctive', say: 'Subjunctive with fatḥa after لَن. The كُمْ is the first object, “you”. زَادَ takes two objects here.' },
        { role: 'Particle of restriction', say: 'It limits the increase to one thing.' },
        { role: 'Second object', say: 'Accusative with tanwīn: “We add nothing to you but punishment.”' },
      ],
      quiz: { word: 6, q: 'What is عَذَابًا?', options: ['A state (ḥāl)', 'The second object of نَزِيدَكُمْ', 'The subject'], answer: 1, why: 'al-Jadwal reads عَذَابًا as the second object of نَزِيدَكُمْ. كُمْ is the first object.' },
    },
    31: {
      words: [
        { role: 'Particle “indeed”', say: 'It stresses the sentence and puts its noun in the accusative.' },
        { role: 'Preposition', say: 'It means “for”. The phrase is tied to the khabar of إِنَّ.' },
        { role: 'After a preposition', say: 'Genitive. A Form VIII participle: those who guard themselves. The ending ـِينَ is the genitive ending of a sound masculine plural.' },
        { role: 'Noun of inna', say: 'Accusative with tanwīn. It comes late because the khabar (“is for the God-fearing”) comes first. A mīm-verbal noun meaning success.' },
      ],
      quiz: { word: 3, q: 'Which word is the noun of إِنَّ?', options: ['الْمُتَّقِينَ', 'إِنَّ', 'مَفَازًا'], answer: 2, why: 'مَفَازًا is accusative because إِنَّ governs it. لِلْمُتَّقِينَ is tied to the khabar, which comes first.' },
    },
    32: {
      words: [
        { role: 'Badal of “success”', say: 'Accusative, with a fatḥa and no tanwīn: it is a plural of a heavy pattern (فَعَائِل), which takes no tanwīn. It says what the success is.' },
        { role: 'Joining word (ʿaṭf)', say: 'It joins أَعْنَابًا to حَدَائِقَ.' },
        { role: 'Joined to “gardens”', say: 'Accusative with tanwīn. This plural has a lighter pattern, so it does take tanwīn.' },
      ],
      quiz: { word: 0, q: 'Why does حَدَائِقَ have no tanwīn?', options: ['It is a plural of a heavy pattern that never takes tanwīn', 'It is definite', 'It follows a preposition'], answer: 0, why: 'Plurals of the pattern فَعَائِل are diptotes: no tanwīn, and a fatḥa in the accusative.' },
    },
    33: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins كَوَاعِبَ to حَدَائِقَ.' },
        { role: 'Joined to “gardens”', say: 'Accusative with a fatḥa and no tanwīn, the same heavy plural pattern (فَوَاعِل) as حَدَائِقَ.' },
        { role: 'Adjective (naʿt)', say: 'It describes كَوَاعِبَ: companions of the same age. Accusative with tanwīn.' },
      ],
      quiz: { word: 2, q: 'What does أَتْرَابًا do?', options: ['It is a state (ḥāl)', 'It describes كَوَاعِبَ', 'It is the subject'], answer: 1, why: 'al-Jadwal reads أَتْرَابًا as an adjective (naʿt) of كَوَاعِبَ. It copies its accusative case.' },
    },
    34: {
      words: [
        { role: 'Joining word (ʿaṭf)', say: 'It joins كَأْسًا to حَدَائِقَ.' },
        { role: 'Joined to “gardens”', say: 'Accusative with tanwīn: a cup. It takes tanwīn because it is a simple noun.' },
        { role: 'Adjective (naʿt)', say: 'It describes كَأْسًا: brimming. al-Jadwal calls it an adjective of the pattern فِعَال, from دَهَقَ, “to fill”.' },
      ],
      quiz: { word: 2, q: 'What does دِهَاقًا describe?', options: ['حَدَائِقَ', 'كَأْسًا', 'أَتْرَابًا'], answer: 1, why: 'دِهَاقًا describes the cup: it is full. It is accusative with tanwīn like كَأْسًا.' },
    },
    35: {
      words: [
        { role: 'Negation', say: 'It negates the verb. The verb stays indicative.' },
        { role: 'Verb, present', say: 'Indicative, with the plural wāw as the subject. al-Jadwal calls the clause a new explaining sentence, or alternatively an adjective of حَدَائِقَ.' },
        { role: 'Preposition + “it”', say: 'The pronoun هَا points back to the gardens. al-Jadwal ties the phrase to an unsaid state of the hearers, and also allows it to be tied to the verb.' },
        { role: 'Object', say: 'What they do not hear: idle talk. Accusative with tanwīn.' },
        { role: 'Joining wa + extra lā', say: 'وَ joins كِذَّابًا to لَغْوًا. The second لَا is extra: it only stresses the denial.' },
        { role: 'Object, joined to “idle talk”', say: 'Accusative with tanwīn: lying. A verbal noun of Form II that the Arabs said, as in verse 28.' },
      ],
      quiz: { word: 4, q: 'What does the second لَا do?', options: ['It only stresses the negation', 'It starts a new sentence', 'It turns the verb into a command'], answer: 0, why: 'al-Jadwal calls the second لَا extra (zāʾida): it adds stress to the denial.' },
    },
    36: {
      words: [
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'Accusative with tanwīn. Same parse as in verse 26: it stands for an unsaid verb, “He repays them a repayment”.' },
        { role: 'Preposition', say: 'It means “from”.' },
        { role: 'After a preposition', say: 'Genitive with kasra. The ending كَ means “your”.' },
        { role: 'Badal of “repayment”', say: 'Accusative with tanwīn. It says that the repayment is a gift. al-Jadwal also allows a mafʿūl muṭlaq.' },
        { role: 'Adjective (naʿt)', say: 'It describes عَطَاءً: a gift that is enough, a gift “counted out”.' },
      ],
      quiz: { word: 3, q: 'What does al-Jadwal make عَطَاءً?', options: ['The subject', 'A noun after a preposition', 'A badal of جَزَاءً'], answer: 2, why: 'al-Jadwal reads عَطَاءً as a badal of جَزَاءً: it says which kind of repayment this is.' },
    },
    37: {
      words: [
        { role: 'Badal of “your Lord”', say: 'Genitive. It says which Lord: the One of the heavens and the earth. It owns السَّمَاوَاتِ, so it has no al-.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra (sound feminine plural).' },
        { role: 'Joined to “the heavens”', say: 'The وَ joins الْأَرْضِ to السَّمَاوَاتِ, so it is genitive too.' },
        { role: 'Joined relative pronoun', say: 'The وَ joins مَا (“what”) to the genitive group. مَا never changes; its position is genitive.' },
        { role: 'Place word + “the two”', say: 'The ending هُمَا means “the two of them”, the heavens and the earth. It belongs to the part that follows مَا: “what is between them”.' },
        { role: 'Adjective (naʿt) of the second “Lord”', say: 'Genitive. A name of Allah. al-Jadwal reads it as an adjective of the second رَبِّ.' },
        { role: 'Negation', say: 'It negates the verb. The verb stays indicative.' },
        { role: 'Verb, present', say: 'Indicative, with the plural wāw as the subject. al-Jadwal reads the clause as a state of الرَّحْمَٰنِ.' },
        { role: 'Preposition + “Him”', say: 'Tied to يَمْلِكُونَ, which al-Jadwal reads as having the sense of “get”.' },
        { role: 'Object', say: 'What they do not get from Him: speech. Accusative with tanwīn.' },
      ],
      quiz: { word: 5, q: 'What does al-Jadwal make الرَّحْمَٰنِ?', options: ['A badal of رَبِّ', 'The subject of يَمْلِكُونَ', 'An adjective of the second رَبِّ'], answer: 2, why: 'al-Jadwal reads الرَّحْمَٰنِ as an adjective (naʿt) of the second رَبِّ, so it copies its genitive case.' },
    },
    38: {
      words: [
        { role: 'Adverb of time', say: 'Accusative with fatḥa. al-Jadwal ties it to يَمْلِكُونَ in verse 37, and it owns the clause that follows.' },
        { role: 'Verb, present', say: 'Indicative. Its doers come after it.' },
        { role: 'Subject (fāʿil)', say: 'Nominative with ḍamma.' },
        { role: 'Joined to “the Spirit”', say: 'The وَ joins it to الرُّوحُ, so it is nominative too.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'Accusative with tanwīn. It stands for an unsaid verb: they stand in rows. al-Jadwal also allows a state: “in rows”.' },
        { role: 'Negation', say: 'It negates the verb. The verb stays indicative.' },
        { role: 'Verb, present, Form V', say: 'Indicative, with the plural wāw as the subject. The clause tells a state of the Spirit and the angels.' },
        { role: 'Particle “except”', say: 'It marks the one who may speak.' },
        { role: 'Relative pronoun, badal of the doers', say: 'It never changes its ending. al-Jadwal makes it a badal of the plural wāw in يَتَكَلَّمُونَ (nominative position), and also allows an accusative exception.' },
        { role: 'Verb, past', say: 'It is inside the clause that follows مَنْ: “gave permission”.' },
        { role: 'Preposition + “him”', say: 'Tied to أَذِنَ.' },
        { role: 'Subject (fāʿil)', say: 'Nominative with ḍamma: the One who gives permission.' },
        { role: 'Joined verb, past', say: 'The وَ joins قَالَ to أَذِنَ, both inside the clause that follows مَنْ. Its subject is hidden: “he said”.' },
        { role: 'Object', say: 'Accusative with tanwīn. al-Jadwal says it is an adjective standing for an unsaid noun: “he said a right thing”.' },
      ],
      quiz: { word: 8, q: 'What is مَنْ in this verse?', options: ['A relative pronoun that is a badal of the doers of يَتَكَلَّمُونَ', 'A question word', 'A conditional word'], answer: 0, why: 'al-Jadwal reads مَنْ as a relative pronoun, with أَذِنَ لَهُ الرَّحْمَٰنُ as its ṣilah. It is a badal of the doers of يَتَكَلَّمُونَ.' },
    },
    39: {
      words: [
        { role: 'Subject (mubtadaʾ)', say: 'A pointing word, “that”. It never changes its ending. Its position is nominative.' },
        { role: 'Badal of “that”', say: 'Nominative. It says which thing is pointed at. al-Jadwal also allows a related reading, ʿaṭf bayān.' },
        { role: 'Predicate (khabar)', say: 'Nominative with ḍamma: “is the true”.' },
        { role: 'Fa that answers an unspoken condition', say: 'It ties what follows to a condition left unsaid, something like “if you have understood the matter of that day, then ...”.' },
        { role: 'Conditional noun, subject', say: 'It means “whoever”, and never changes. It is the mubtadaʾ, and the two verbs after it are the condition and its answer.' },
        { role: 'Verb of the condition', say: 'Past in form, future in meaning. al-Jadwal makes this clause the khabar of مَن, and also allows both clauses together.' },
        { role: 'Verb, answer to the condition', say: 'Past in form, future in meaning. Form VIII: “take for oneself”. It needs no فَ. It takes two objects; al-Jadwal supplies “faith” as the unsaid first, and مَآبًا is the second.' },
        { role: 'Preposition', say: 'It means “to”.' },
        { role: 'After a preposition', say: 'Genitive with kasra. The ending هِ means “his”. The phrase إِلَىٰ رَبِّهِ is tied to a state of مَآبًا: a way back to Him.' },
        { role: 'Second object', say: 'Accusative with tanwīn: a way of return.' },
      ],
      quiz: { word: 4, q: 'What is مَن here?', options: ['A relative pronoun after a preposition', 'A conditional noun (“whoever”) and the subject', 'A question word'], answer: 1, why: 'al-Jadwal calls مَن a conditional noun and the mubtadaʾ. The fa before it answers an unspoken condition.' },
    },
    40: {
      words: [
        { role: 'Inna + “We”', say: 'The ending نَا is the noun of إِنَّ.' },
        { role: 'Verb, past, Form IV, + “you”', say: 'The ending نَا is the subject and كُمْ is the first object. أَنذَرَ takes two objects: the person warned and the thing. This clause is the khabar of إِنَّ.' },
        { role: 'Second object', say: 'What We warned you of. Accusative with tanwīn.' },
        { role: 'Adjective (naʿt)', say: 'It describes عَذَابًا, so it is accusative with tanwīn.' },
        { role: 'Adverb of time', say: 'Accusative. al-Jadwal ties it to عَذَابًا: the punishment of that day. It owns the clause يَنظُرُ ...' },
        { role: 'Verb, present', say: 'Indicative. al-Jadwal says it carries the sense of “see”, so it can take a direct object.' },
        { role: 'Subject (fāʿil)', say: 'Nominative with ḍamma.' },
        { role: 'Relative pronoun, object', say: 'It means “what”. It never changes. It is the object of يَنظُرُ, and the clause after it is its ṣilah.' },
        { role: 'Verb, past, Form II', say: 'The تْ shows a feminine subject: يَدَاهُ, since “hand” is feminine.' },
        { role: 'Subject (fāʿil)', say: 'Nominative dual: the alif is the dual mark. The nūn of the dual dropped because of the ending هُ, “his”.' },
        { role: 'Joined verb, present', say: 'The وَ joins it to يَنظُرُ, so it also falls under the same “day”.' },
        { role: 'Subject (fāʿil)', say: 'Nominative with ḍamma. An active participle used as a noun: the one who disbelieves.' },
        { role: 'Alert particle', say: 'al-Jadwal calls it a word that draws attention, not a call to someone.' },
        { role: 'Wish particle + “me”', say: 'لَيْتَ expresses a wish. The ending ـنِي is “me” (the nūn protects the verb-like particle), and it is the noun of لَيْتَ.' },
        { role: 'Verb “I were”', say: 'The تُ is the subject “I”. The clause كُنتُ تُرَابًا is the khabar of لَيْتَ.' },
        { role: 'Predicate of كَانَ', say: 'Accusative with tanwīn: dust.' },
      ],
      quiz: { word: 12, q: 'What does al-Jadwal call يَا in this verse?', options: ['A call to someone', 'A word of negation', 'An alert particle'], answer: 2, why: 'al-Jadwal calls يَا here a word that draws attention (tanbīh). Nobody is being called.' },
    },
  },
};
