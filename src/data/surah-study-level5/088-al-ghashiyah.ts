// Plain-English teaching layer for Surah 88, Al-Ghashiyah. Same shape and rules as in surah-study.ts.
//
// Drafted 2026-10-29. Every line follows the parse in the surah’s file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Where al-Jadwal gives more than one reading, the line says which one it follows. Someone
// who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from '../surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Question word (hal) of suspense', say: 'A little word that opens the question. al-Jadwal calls it a hal of suspense: it makes you want to hear what comes next. He also allows it to mean قَدْ, “indeed”. It never changes its ending.' },
        { role: 'Verb, past, plus “you”', say: 'It came to you. The ending كَ is “you” and is the object. The one that came is the next word, حَدِيثُ. The verb ends in a long ā because its last root letter is weak.' },
        { role: 'Doer (fāʿil), first part of a possession', say: 'The story. It is the doer of أَتَاكَ, so it is nominative. It also owns the next word, so it has no al- and no tanwin.' },
        { role: 'Second part of a possession', say: 'The Overwhelming One, a name for the Last Day. It is genitive, because حَدِيثُ owns it. It is a doer-word (active participle) from غَشِيَ, “to cover”.' },
      ],
      quiz: { word: 3, q: 'Why does الْغَاشِيَةِ end in kasra?', options: ['It follows a preposition', 'حَدِيثُ owns it, so it is genitive', 'It is the object of أَتَاكَ'], answer: 1, why: 'حَدِيثُ الْغَاشِيَةِ is a possession phrase. The second word of a possession phrase is always genitive.' },
    },
    2: {
      words: [
        { role: 'Subject (mubtadaʾ)', say: 'Faces. It opens the sentence, so it is nominative. It has tanwin and can still start a sentence, because the words after it describe it. Its real predicate only comes in verse 4.' },
        { role: 'Time word (ẓarf)', say: 'That day. al-Jadwal says it is accusative (or has a fixed ending) and belongs to خَاشِعَةٌ: the faces are humbled on that day. The tanwin on -ذٍ stands for a clause that is left out.' },
        { role: 'Adjective (naʿt)', say: 'Humbled. al-Jadwal reads it as an adjective of وُجُوهٌ, not as the predicate, so it copies the nominative case. A plural of things takes a feminine singular adjective, which is why it ends in ة.' },
      ],
      quiz: { word: 2, q: 'What does خَاشِعَةٌ do in this verse, in al-Jadwal?', options: ['It is an adjective (naʿt) of وُجُوهٌ; the predicate comes later', 'It is the predicate of وُجُوهٌ', 'It is the object of a verb'], answer: 0, why: 'al-Jadwal reads خَاشِعَةٌ, عَامِلَةٌ and نَاصِبَةٌ as adjectives of وُجُوهٌ. The predicate is the sentence تَصْلَىٰ نَارًا in verse 4.' },
    },
    3: {
      words: [
        { role: 'Adjective (naʿt)', say: 'Working hard. A second adjective of وُجُوهٌ (verse 2), so it is nominative. It is a doer-word (active participle) from عَمِلَ, “to work”.' },
        { role: 'Adjective (naʿt)', say: 'Worn out. A third adjective of وُجُوهٌ, nominative. It comes from نَصِبَ, “to be tired”. There is no وَ between the three adjectives, so they read as one picture.' },
      ],
      quiz: { word: 1, q: 'Which word does نَاصِبَةٌ describe?', options: ['عَامِلَةٌ only', 'نَارًا in verse 4', 'وُجُوهٌ in verse 2'], answer: 2, why: 'All three words, خَاشِعَةٌ, عَامِلَةٌ and نَاصِبَةٌ, describe the same noun: وُجُوهٌ.' },
    },
    4: {
      words: [
        { role: 'Verb, present: the predicate (khabar)', say: 'They burn in. The hidden doer is “she”, pointing to the faces (a group of things is treated as feminine singular). al-Jadwal takes this whole sentence as the predicate of وُجُوهٌ from verse 2. It ends in a long ā because its last root letter is weak.' },
        { role: 'Object (mafʿūl bihi)', say: 'Fire. It is accusative with tanwin fatḥa, because it is what the faces enter.' },
        { role: 'Adjective (naʿt)', say: 'Blazing hot. It describes نَارًا, so it copies its accusative case and its tanwin. It is a doer-word (active participle) from حَمِيَ, “to be hot”.' },
      ],
      quiz: { word: 0, q: 'What does the sentence تَصْلَىٰ نَارًا حَامِيَةً do for وُجُوهٌ?', options: ['It is another adjective', 'It is its predicate (khabar)', 'It is a circumstantial state (ḥāl)'], answer: 1, why: 'The three words in verses 2–3 are adjectives. The sentence in verse 4 finally gives the predicate of وُجُوهٌ.' },
    },
    5: {
      words: [
        { role: 'Verb, present, passive', say: 'They are made to drink. The verb is passive, so the one who gives the drink is not named. The hidden “she” is the faces. al-Jadwal takes this sentence as a second predicate (khabar) of وُجُوهٌ.' },
        { role: 'Preposition', say: 'From. The phrase مِنْ عَيْنٍ belongs to تُسْقَىٰ and tells where the drink comes from.' },
        { role: 'After a preposition', say: 'A spring. It is genitive with tanwin kasra, because it follows مِنْ.' },
        { role: 'Adjective (naʿt)', say: 'Boiling hot. It describes عَيْنٍ, so it copies its genitive case and its tanwin. It is a doer-word (active participle).' },
      ],
      quiz: { word: 0, q: 'What is special about the verb تُسْقَىٰ?', options: ['It is a command', 'It is a past verb', 'It is passive: the giver of the drink is not named'], answer: 2, why: 'The vowels on تُسْقَىٰ (ḍamma on the first letter, fatḥa before the end) show the passive. The faces receive the drink, and the verse does not say who gives it.' },
    },
    6: {
      words: [
        { role: 'Verb laysa (“is not”)', say: 'There is not. It works like كَانَ: its subject takes the nominative. Here its predicate is a phrase, the next word.' },
        { role: 'Phrase in place of the predicate', say: 'For them. It fills the place of the predicate of لَيْسَ and comes before the subject. al-Jadwal says it belongs to a predicate that is left unsaid. The هُمْ means the owners of the faces.' },
        { role: 'Subject of laysa', say: 'Food. It is nominative, because it is the subject of لَيْسَ. It has tanwin because no particular food is meant.' },
        { role: 'Particle of restriction', say: 'Except. al-Jadwal reads it as a word that limits: there is no food for them except food from ضَرِيعٍ. He also allows reading it as the “except” of an exception.' },
        { role: 'Preposition', say: 'From. The phrase مِن ضَرِيعٍ describes an understood word for “food”: no food except a food from ضَرِيعٍ.' },
        { role: 'After a preposition', say: 'A thorny plant. It is genitive with tanwin kasra, because it follows مِن. al-Jadwal says it is the name of a kind of thorn, and when it is dry even animals do not eat it.' },
      ],
      quiz: { word: 3, q: 'What does إِلَّا do here, in al-Jadwal’s first reading?', options: ['It limits the meaning: no food except food from ضَرِيعٍ', 'It is the “but” of a new sentence', 'It negates the verb'], answer: 0, why: 'al-Jadwal reads إِلَّا as a word of restriction (ḥaṣr). He also allows an exception, but not a badal.' },
    },
    7: {
      words: [
        { role: 'Negation', say: 'Not. It is a plain negative, so the verb after it keeps its normal ending, ḍamma.' },
        { role: 'Verb, present, Form IV', say: 'It fattens. Form IV (أَفْعَلَ) makes something happen to someone else. The hidden doer is “it”, the thorny plant. al-Jadwal says the whole sentence describes ضَرِيعٍ from verse 6.' },
        { role: 'And', say: 'وَ joins the second sentence to the first one.' },
        { role: 'Negation', say: 'Not, again, this time for the second verb.' },
        { role: 'Verb, present, Form IV', say: 'It does not push away. al-Jadwal says this verb carries the sense of “pushes away”, and that is why it can take مِن جُوعٍ. This sentence is joined to the one before it, so it also describes ضَرِيعٍ.' },
        { role: 'Preposition', say: 'From. It comes before جُوعٍ. The phrase as a whole is the thing that is not pushed away.' },
        { role: 'After a preposition', say: 'Hunger. It is genitive with tanwin kasra because of مِن. al-Jadwal says it is also the object of يُغْنِي in position, because the verb carries the sense of “pushes away”.' },
      ],
      quiz: { word: 1, q: 'The verb يُسْمِنُ starts a sentence. What does that sentence do?', options: ['It answers a condition', 'It describes ضَرِيعٍ', 'It is the subject of لَيْسَ'], answer: 1, why: 'al-Jadwal says the sentence لَا يُسْمِنُ stands in the place of a genitive adjective for ضَرِيعٍ, and the sentence with يُغْنِي is joined to it.' },
    },
    8: {
      words: [
        { role: 'Subject (mubtadaʾ)', say: 'Faces, again. It is nominative. It begins a new group of faces, and its predicate comes in verse 9.' },
        { role: 'Time word (ẓarf)', say: 'That day, as in verse 2. It belongs to نَاعِمَةٌ.' },
        { role: 'Adjective (naʿt)', say: 'Full of ease and joy. As in verse 2, al-Jadwal reads it as an adjective of وُجُوهٌ, not as the predicate. It is a doer-word (active participle) from نَعِمَ, “to be well off”.' },
      ],
      quiz: { word: 2, q: 'In verse 8, what is نَاعِمَةٌ?', options: ['The predicate of وُجُوهٌ', 'A verb', 'An adjective (naʿt) of وُجُوهٌ'], answer: 2, why: 'al-Jadwal says verse 8 is “like verse 2”. نَاعِمَةٌ describes the faces, and the predicate is رَاضِيَةٌ in verse 9.' },
    },
    9: {
      words: [
        { role: 'Preposition', say: 'For, with. The لِ is joined to the next word. The phrase لِسَعْيِهَا belongs to رَاضِيَةٌ: pleased with their effort.' },
        { role: 'After a preposition, plus “her”', say: 'Effort. It is genitive after لِ. The ending هَا points back to وُجُوهٌ, the faces.' },
        { role: 'Predicate (khabar)', say: 'Pleased. al-Jadwal takes this as the predicate of وُجُوهٌ from verse 8, so it is nominative. It is a doer-word (active participle) from رَضِيَ, “to be pleased”.' },
      ],
      quiz: { word: 2, q: 'What does رَاضِيَةٌ do in verse 9?', options: ['It is the predicate of وُجُوهٌ from verse 8', 'It is an adjective of سَعْيِهَا', 'It is the object of لِ'], answer: 0, why: 'In verse 8 نَاعِمَةٌ was only an adjective. The predicate of وُجُوهٌ arrives here, in رَاضِيَةٌ.' },
    },
    10: {
      words: [
        { role: 'Preposition', say: 'In. The phrase فِي جَنَّةٍ belongs to a predicate that is left unsaid. al-Jadwal takes it as a second predicate of وُجُوهٌ. He also allows it to be the predicate, with رَاضِيَةٌ then a second adjective.' },
        { role: 'After a preposition', say: 'A garden. It is genitive with tanwin kasra, because it follows فِي. The next verses describe it more and more.' },
        { role: 'Adjective (naʿt)', say: 'High. It describes جَنَّةٍ, so it copies its genitive case. It is a doer-word (active participle) from عَلَا, “to be high”. The ي replaces a weak و.' },
      ],
      quiz: { word: 0, q: 'What does the phrase فِي جَنَّةٍ belong to, in al-Jadwal?', options: ['The verb تَصْلَىٰ', 'A predicate that is left unsaid', 'The adjective عَالِيَةٍ'], answer: 1, why: 'A phrase with a preposition has to hang on something. Here it hangs on a predicate that is not spoken, a second predicate of وُجُوهٌ.' },
    },
    11: {
      words: [
        { role: 'Negation', say: 'Not. A plain negative, so the verb keeps its ḍamma.' },
        { role: 'Verb, present', say: 'You hear (anyone hears). al-Jadwal says this whole sentence is a second description of جَنَّةٍ from verse 10: a garden where no foolish talk is heard.' },
        { role: 'Phrase “in it”', say: 'In it, meaning in the garden. The phrase belongs to تَسْمَعُ. al-Jadwal also allows that it belongs to a ḥāl of لَاغِيَةً.' },
        { role: 'Object (mafʿūl bihi)', say: 'Foolish talk. It is accusative with tanwin fatḥa, because it is what is heard. It is a doer-word from لَغَا, “to talk nonsense”. al-Jadwal also notes a view that it is a verbal noun, like عَافِيَةٌ.' },
      ],
      quiz: { word: 3, q: 'Why does لَاغِيَةً end in tanwin fatḥa?', options: ['It follows a preposition', 'It is a predicate', 'It is the object of تَسْمَعُ'], answer: 2, why: 'تَسْمَعُ is a verb that takes an object: what is heard. That object is accusative.' },
    },
    12: {
      words: [
        { role: 'Predicate (khabar), put first', say: 'In it. This phrase belongs to the predicate and comes before the subject, because the subject has no al-. al-Jadwal says this whole sentence is a third description of جَنَّةٍ.' },
        { role: 'Subject (mubtadaʾ), comes later', say: 'A spring. It is nominative with tanwin. It comes after its predicate.' },
        { role: 'Adjective (naʿt)', say: 'Flowing. It describes عَيْنٌ and copies its nominative case. It is a doer-word (active participle) from جَرَى, “to run”.' },
      ],
      quiz: { word: 1, q: 'Why is عَيْنٌ nominative?', options: ['It is the subject, and فِيهَا is the predicate before it', 'It follows a preposition', 'It is the object of a verb'], answer: 0, why: 'In a sentence with a predicate put first, the subject comes after it and stays nominative.' },
    },
    13: {
      words: [
        { role: 'Predicate (khabar), put first', say: 'In it. A phrase in the place of the predicate, put first. The nouns that are joined to سُرُرٌ in verses 14–16 share this predicate. The whole sentence is a fourth description of جَنَّةٍ.' },
        { role: 'Subject (mubtadaʾ), comes later', say: 'Couches. It is nominative with tanwin. It is a broken plural of سَرِيرٌ. The nouns in the next three verses are joined to it.' },
        { role: 'Adjective (naʿt)', say: 'Raised. It is a passive participle: it means “that has been raised”. It describes سُرُرٌ and copies its nominative case. A plural of things takes a feminine singular adjective, hence the ة.' },
      ],
      quiz: { word: 2, q: 'What kind of word is مَرْفُوعَةٌ?', options: ['An active participle: the one who raises', 'A passive participle: something that has been raised', 'A past verb'], answer: 1, why: 'The pattern مَفْعُولَة is the passive participle. It says the couches have been raised, and it does not say by whom.' },
    },
    14: {
      words: [
        { role: 'And, joins to “couches”', say: 'وَ joins أَكْوَابٌ to سُرُرٌ in verse 13. Both share the same predicate, فِيهَا.' },
        { role: 'Joined to سُرُرٌ', say: 'Cups. It is nominative, because it is joined to the nominative noun سُرُرٌ. It is not a new subject with its own predicate: it shares فِيهَا from verse 13.' },
        { role: 'Adjective (naʿt)', say: 'Set down, put ready. A passive participle. It describes أَكْوَابٌ and copies its nominative case.' },
      ],
      quiz: { word: 1, q: 'Why is أَكْوَابٌ nominative?', options: ['It is the subject of a new sentence', 'It follows وَ, which always gives ḍamma', 'It is joined to سُرُرٌ, which is nominative'], answer: 2, why: 'al-Jadwal says the nouns of verses 14–16 are joined to سُرُرٌ and are nominative like it. A joined word takes the case of the word it is joined to.' },
    },
    15: {
      words: [
        { role: 'And, joins to “couches”', say: 'وَ joins نَمَارِقُ to سُرُرٌ in verse 13.' },
        { role: 'Joined to سُرُرٌ', say: 'Cushions. It is nominative, because it is joined to سُرُرٌ. The pattern فَعَالِلُ never takes tanwin, so it ends in a single ḍamma.' },
        { role: 'Adjective (naʿt)', say: 'Set in rows. A passive participle from صَفَّ, “to line up”. It describes نَمَارِقُ and copies its nominative case.' },
      ],
      quiz: { word: 1, q: 'Why does نَمَارِقُ end in a single ḍamma, with no tanwin?', options: ['It is definite', 'Its pattern never takes tanwin', 'It is a dual'], answer: 1, why: 'Plurals on the pattern فَعَالِلُ, like نَمَارِقُ, are words that never take tanwin. They keep a single ḍamma in the nominative.' },
    },
    16: {
      words: [
        { role: 'And, joins to “couches”', say: 'وَ joins زَرَابِيُّ to سُرُرٌ in verse 13.' },
        { role: 'Joined to سُرُرٌ', say: 'Fine carpets. It is nominative, joined to سُرُرٌ. The shadda on يُّ is part of the word, and the ḍamma is the case ending. al-Jadwal says it is a plural on the pattern فَعَالِيلُ, so it has no tanwin.' },
        { role: 'Adjective (naʿt)', say: 'Spread out. A passive participle from بَثَّ, “to spread”. It describes زَرَابِيُّ and copies its nominative case.' },
      ],
      quiz: { word: 2, q: 'What does مَبْثُوثَةٌ do?', options: ['It is the predicate of زَرَابِيُّ', 'It is an adjective (naʿt) of زَرَابِيُّ', 'It is the subject of the sentence'], answer: 1, why: 'The predicate of all these nouns is فِيهَا in verse 13. مَبْثُوثَةٌ only describes the carpets.' },
    },
    17: {
      words: [
        { role: 'Question word (a) that scolds', say: 'The question word أَ. al-Jadwal says it scolds: “do they really not look?” It does not ask for information.' },
        { role: 'Fa, joins to an unspoken sentence', say: 'فَ joins this question to a sentence that is left out, like “Do they deny it, and so do they not look…?”' },
        { role: 'Negation', say: 'Not. It negates the verb after it.' },
        { role: 'Verb, present', say: 'They look. The ون is the doer, “they”, and the verb keeps its final نَ, the sign of the indicative.' },
        { role: 'Preposition', say: 'At. The phrase إِلَى الْإِبِلِ belongs to يَنظُرُونَ.' },
        { role: 'After a preposition', say: 'The camels. It is genitive after إِلَى. The clause after it says more about it.' },
        { role: 'Question word “how” (ḥāl)', say: 'How. A word that asks, with a fixed ending. al-Jadwal says it is accusative by position, as a ḥāl, and the verb after it governs it.' },
        { role: 'Verb, past, passive', say: 'It was created. The verb is passive, so the creator is not named. al-Jadwal says the whole clause كَيْفَ خُلِقَتْ is a badal ishtimāl of الْإِبِلِ: look at the camels, at how they were created.' },
      ],
      quiz: { word: 7, q: 'What does the clause كَيْفَ خُلِقَتْ do, in al-Jadwal?', options: ['It is the object of يَنظُرُونَ', 'It answers a condition', 'It is a badal of الْإِبِلِ: it says what to look at in them'], answer: 2, why: 'al-Jadwal reads it as a badal ishtimāl: the clause stands in place of الْإِبِلِ and tells you what about the camels to look at.' },
    },
    18: {
      words: [
        { role: 'And', say: 'وَ joins this to verse 17. The verb يَنظُرُونَ is understood again.' },
        { role: 'Preposition', say: 'At. The phrase belongs to the same يَنظُرُونَ from verse 17.' },
        { role: 'After a preposition', say: 'The sky. It is genitive after إِلَى. It is feminine singular, so the verb after it is feminine too.' },
        { role: 'Question word “how” (ḥāl)', say: 'How, as in verse 17: accusative by position, as a ḥāl.' },
        { role: 'Verb, past, passive', say: 'It was raised. The verb is passive. The ت shows feminine singular. The clause كَيْفَ رُفِعَتْ is a badal ishtimāl of السَّمَاءِ.' },
      ],
      quiz: { word: 4, q: 'Why does رُفِعَتْ end in ت?', options: ['It agrees with السَّمَاءِ, which is feminine singular', 'It is second person', 'It is plural'], answer: 0, why: 'The ت at the end of a past verb shows a feminine singular subject. Here the subject is the sky.' },
    },
    19: {
      words: [
        { role: 'And', say: 'وَ joins this to verse 17. The verb يَنظُرُونَ is understood again.' },
        { role: 'Preposition', say: 'At. The phrase belongs to يَنظُرُونَ from verse 17.' },
        { role: 'After a preposition', say: 'The mountains. It is genitive after إِلَى.' },
        { role: 'Question word “how” (ḥāl)', say: 'How: accusative by position, as a ḥāl, as in verse 17.' },
        { role: 'Verb, past, passive', say: 'They were set up. A group of things takes a feminine singular verb, so it is نُصِبَتْ. The clause كَيْفَ نُصِبَتْ is a badal ishtimāl of الْجِبَالِ.' },
      ],
      quiz: { word: 2, q: 'Why does الْجِبَالِ end in kasra?', options: ['It is the subject of the passive verb', 'It follows the preposition إِلَى', 'It is a ḥāl'], answer: 1, why: 'Any noun after a preposition is genitive. إِلَى is the preposition.' },
    },
    20: {
      words: [
        { role: 'And', say: 'وَ joins this to verse 17. The verb يَنظُرُونَ is understood again.' },
        { role: 'Preposition', say: 'At. The phrase belongs to يَنظُرُونَ from verse 17.' },
        { role: 'After a preposition', say: 'The earth. It is genitive after إِلَى. It is feminine singular, so the verb after it is feminine too.' },
        { role: 'Question word “how” (ḥāl)', say: 'How: accusative by position, as a ḥāl, as in verse 17.' },
        { role: 'Verb, past, passive', say: 'It was spread out. A passive verb from سَطَحَ, “to flatten”. The clause كَيْفَ سُطِحَتْ is a badal ishtimāl of الْأَرْضِ.' },
      ],
      quiz: { word: 3, q: 'What does كَيْفَ do in verses 17–20, in al-Jadwal?', options: ['It is the subject of the passive verb', 'It is a preposition', 'It is a question word, accusative by position as a ḥāl'], answer: 2, why: 'al-Jadwal says each كَيْفَ is a question word with a fixed ending that stands in the accusative as a ḥāl, and the verb after it governs it.' },
    },
    21: {
      words: [
        { role: 'Fa, answer to an unspoken condition', say: 'فَ ties the command to a condition that is left out: “if they do not learn from the signs, then remind them”.' },
        { role: 'Command, Form II', say: 'Remind! Form II (فَعَّلَ) has a doubled middle letter and means “make someone remember”. The hidden doer is “you”. The ending is sukun, the sign of a command. This sentence answers the unspoken condition.' },
        { role: 'inna + ma (“only”)', say: 'Only. It is إِنَّ joined to مَا. The مَا stops إِنَّ from working on the noun after it, so أَنتَ stays nominative. The word limits the meaning to one thing.' },
        { role: 'Subject (mubtadaʾ)', say: 'You. A separate pronoun. It is the subject of the sentence.' },
        { role: 'Predicate (khabar)', say: 'One who reminds. A Form II doer-word (active participle) from the same root as ذَكِّرْ. It is nominative with tanwin, because it is the predicate.' },
      ],
      quiz: { word: 2, q: 'Why is أَنتَ nominative after إِنَّمَا, not accusative as after إِنَّ?', options: ['The مَا stops إِنَّ from working on it', 'Because it follows فَ', 'Because it is the object of ذَكِّرْ'], answer: 0, why: 'In إِنَّمَا the مَا is a stopper (kāffa). It cancels the effect of إِنَّ, so the sentence stays an ordinary subject and predicate.' },
    },
    22: {
      words: [
        { role: 'Verb laysa, “you are not”', say: 'You are not. This is لَيْسَ with the ending تَ, “you”. The تَ is its subject. Its predicate is مُصَيْطِرٍ.' },
        { role: 'Phrase tied to the predicate', say: 'Over them. al-Jadwal says the phrase belongs to مُصَيْطِرٍ, not to لَسْتَ. The هِمْ points to the people the Prophet reminds.' },
        { role: 'Added bāʾ', say: 'An extra بِ that strengthens the denial. It adds no new meaning. It makes the word after it genitive in form.' },
        { role: 'Predicate of laysa, after the extra bāʾ', say: 'One who forces others. It is genitive in form because of بِ, but accusative by position, because it is the predicate of لَسْتَ. It comes from سَيْطَرَ, “to rule over”.' },
      ],
      quiz: { word: 3, q: 'Why does مُصَيْطِرٍ end in kasra?', options: ['It is the subject of لَسْتَ', 'The extra بِ makes it genitive in form; by position it is the predicate', 'It is joined to a genitive word'], answer: 1, why: 'The predicate of لَيْسَ should be accusative. The extra بِ puts a kasra on it, and al-Jadwal still calls it accusative by position.' },
    },
    23: {
      words: [
        { role: 'Particle of exception', say: 'Except. al-Jadwal reads this as an exception: you are not a controller over them, except whoever… He also allows it to work like “but”.' },
        { role: 'Relative pronoun “whoever”', say: 'Whoever. It never changes its ending. al-Jadwal says it is accusative by position, as the excepted word after إِلَّا. He also allows it as a subject, with the next verse as its predicate.' },
        { role: 'Verb, past, Form V (relative clause)', say: 'He turned away. This sentence completes مَن and has no place of its own. Form V (تَفَعَّلَ) often means doing it to oneself: he turned himself away. The ending ىٰ is a long ā, since the last root letter is weak.' },
        { role: 'And', say: 'وَ joins the second verb to the first one.' },
        { role: 'Verb, past', say: 'He disbelieved. It is joined to تَوَلَّىٰ and is part of the same sentence that completes مَن.' },
      ],
      quiz: { word: 1, q: 'What does مَن do here, in al-Jadwal’s first reading?', options: ['It is the subject of a new sentence', 'It is the object of تَوَلَّىٰ', 'It is the excepted word after إِلَّا, accusative by position'], answer: 2, why: 'al-Jadwal reads إِلَّا مَن as an exception, so مَن takes the place of an accusative. He also allows the other reading, with مَن as a subject.' },
    },
    24: {
      words: [
        { role: 'Fa, joins to an unspoken sentence', say: 'فَ joins this to a sentence that is left out, like “He holds him, then punishes him”. al-Jadwal does not take it as the answer to a condition.' },
        { role: 'Verb, present, Form II, plus “him”', say: 'He punishes him. Form II (يُفَعِّلُ) has a doubled middle letter. The ending هُ is “him” and is the object.' },
        { role: 'Doer (fāʿil)', say: 'Allah. Nominative, because He is the one who punishes. The verse names the doer here, unlike the passive verbs of verses 17–20.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'The punishment. It is accusative and comes from the same root as the verb. It repeats the action for strength: “He punishes him a punishment”.' },
        { role: 'Adjective (naʿt)', say: 'The greatest. It describes الْعَذَابَ, so it copies its accusative case and its al-. It is a comparison form (أَفْعَلُ), here “the greatest”.' },
      ],
      quiz: { word: 3, q: 'What is الْعَذَابَ in this sentence?', options: ['The absolute object (mafʿūl muṭlaq): the same root as the verb, for strength', 'The doer', 'The predicate of a subject'], answer: 0, why: 'يُعَذِّبُ and الْعَذَابَ share the root ع ذ ب. Repeating the action as an accusative noun is the absolute object.' },
    },
    25: {
      words: [
        { role: 'Particle inna (“indeed”)', say: 'Indeed. It puts its noun, the third word, in the accusative. Its predicate is the phrase that follows it.' },
        { role: 'Predicate of inna, put first', say: 'To Us. The phrase is the predicate of إِنَّ and comes before its noun. Putting it first narrows the meaning: to Us, and to no one else. The نَا is the majestic “We”.' },
        { role: 'Noun of inna', say: 'Their return. It is accusative, because it is the noun of إِنَّ. It is a verbal noun of آبَ, “to return”, and the ending هُمْ means “their”. al-Jadwal says this sentence gives the reason for the reckoning.' },
      ],
      quiz: { word: 2, q: 'Why is إِيَابَهُمْ accusative?', options: ['It is the object of a verb', 'It is the noun of إِنَّ', 'It follows a preposition'], answer: 1, why: 'إِنَّ puts its noun in the accusative. The noun here comes after the predicate, which was put first.' },
    },
    26: {
      words: [
        { role: 'Then (thumma)', say: 'ثُمَّ joins this sentence to the one in verse 25 and means “after that”, with a gap in time between the two.' },
        { role: 'Particle inna (“indeed”)', say: 'Indeed. The same use as in verse 25.' },
        { role: 'Predicate of inna, put first', say: 'Upon Us. A phrase put before the noun of إِنَّ. عَلَى shows that the reckoning is Our responsibility. The نَا is the majestic “We”.' },
        { role: 'Noun of inna', say: 'Their reckoning. It is accusative, because it is the noun of إِنَّ. It is a verbal noun, and the ending هُمْ means “their”.' },
      ],
      quiz: { word: 2, q: 'What is عَلَيْنَا in this sentence?', options: ['The predicate of إِنَّ, placed before its noun', 'The noun of إِنَّ', 'A verb'], answer: 0, why: 'The noun of إِنَّ is حِسَابَهُمْ, which comes last. The phrase عَلَيْنَا is the predicate, put first.' },
    },
  },
};
