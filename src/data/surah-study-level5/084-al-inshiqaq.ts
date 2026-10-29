// Plain-English teaching layer for Surah 84, Al-Inshiqaq. Same shape and rules as in surah-study.ts.
//
// Drafted 2026-10-29. Every line follows the parse in the surah’s file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Where al-Jadwal gives more than one reading, the line says which one it follows. Someone
// who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from '../surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Word for time, “when”', say: 'إِذَا names a time. It never changes its ending. In al-Jadwal the sentence after it is its mudāf ilayhi, and its answer is left unspoken.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'It is nominative. al-Jadwal reads a verb that is left out before it, and the next word explains that verb. So this is a verbal sentence, not a mubtadaʾ with a khabar.' },
        { role: 'Verb, past, Form VII', say: 'It explains the unspoken verb, so it has no place of its own in the sentence. Form VII (اِنْفَعَلَ) means “it split itself open”. The final تْ shows that the subject is feminine, like السَّمَاءُ.' },
      ],
      quiz: { word: 1, q: 'Why is السَّمَاءُ nominative?', options: ['It is the mubtadaʾ of a nominal sentence', 'It follows a preposition', 'It is the subject of an unspoken verb that انشَقَّتْ explains'], answer: 2, why: 'al-Jadwal reads a verb that is left out before السَّمَاءُ, and انشَقَّتْ explains it. The noun is the fāʿil of that verb, so it is nominative.' },
    },
    2: {
      words: [
        { role: 'And', say: 'وَ joins this verb to the sentence before it, so it stands where that sentence stands.' },
        { role: 'Verb, past', say: 'The subject “she” is hidden inside the verb and means السَّمَاءُ. al-Jadwal calls the picture a hidden comparison (isti‘āra makniyya): the sky is like a listener who obeys.' },
        { role: 'Preposition', say: 'The phrase beginning with لِ belongs to أَذِنَتْ. It says who the sky listened to.' },
        { role: 'After a preposition', say: 'Genitive with kasra, because of لِ. The ending هَا means “its” and points back to the sky.' },
        { role: 'And', say: 'وَ joins the next verb to أَذِنَتْ.' },
        { role: 'Verb, past, passive', say: 'It is passive: the one who made it right is not named. Its deputy subject (nāʾib al-fāʿil) is a hidden pronoun for the sky. al-Jadwal reads “its listening was made right”, and also allows that the sky was simply made fit to listen.' },
      ],
      quiz: { word: 5, q: 'What is the deputy subject (nāʾib al-fāʿil) of حُقَّتْ?', options: ['A hidden pronoun that returns to السَّمَاءُ', 'The word رَبِّهَا', 'It has no subject at all'], answer: 0, why: 'A passive verb still needs a subject. Here it is a pronoun hidden inside the verb, and it returns to السَّمَاءُ.' },
    },
    3: {
      words: [
        { role: 'And', say: 'وَ joins this whole إِذَا sentence to the first one.' },
        { role: 'Word for time, “when”', say: 'The same word as in verse 1. The sentence after it is its mudāf ilayhi, and the answer is the same unspoken one.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'Nominative, like السَّمَاءُ in verse 1. al-Jadwal gives the left-out verb as انبسطت, “it spread out”, and the next word explains it.' },
        { role: 'Verb, past, passive', say: 'It explains the unspoken verb, so it has no place of its own. It is passive: the one who stretches the earth is not named. The doubled دّ comes from the root م-د-د.' },
      ],
      quiz: { word: 3, q: 'What does مُدَّتْ do in the sentence?', options: ['It is the predicate of الْأَرْضُ', 'It explains the unspoken verb whose subject is الْأَرْضُ', 'It is a ḥāl'], answer: 1, why: 'al-Jadwal reads الْأَرْضُ as the subject of a verb that is left out. مُدَّتْ is the explaining verb (tafsīriyya).' },
    },
    4: {
      words: [
        { role: 'And', say: 'وَ joins this verb to the unspoken verb of verse 3.' },
        { role: 'Verb, past, Form IV', say: 'The subject “she” is hidden and means the earth. Form IV (أَفْعَلَ) here means “she threw out”. al-Jadwal calls the picture a hidden comparison: the earth is like a pregnant woman who throws out what is in her.' },
        { role: 'Object (maf‘ūl bihi)', say: 'What she threw out. It is accusative in position and never changes its ending. The words after it complete it.' },
        { role: 'Preposition + “it”', say: 'فِيهَا completes مَا (silat mā). The phrase belongs to a word that is left out, like “is in it”. The ending هَا means “her”, the earth.' },
        { role: 'And', say: 'وَ joins the last verb to أَلْقَتْ.' },
        { role: 'Verb, past, Form V', say: 'Form V (تَفَعَّلَ) is reflexive: “she emptied herself”. It needs no object. The subject “she” is hidden.' },
      ],
      quiz: { word: 2, q: 'What is مَا in this verse?', options: ['The object of a preposition', 'The subject of تَخَلَّتْ', 'The object of أَلْقَتْ'], answer: 2, why: 'The earth threw out “what is in it”. So مَا is the object (maf‘ūl bihi) of أَلْقَتْ, and فِيهَا completes it.' },
    },
    5: {
      words: [
        { role: 'And', say: 'وَ joins this verb to the verbs before it in the second إِذَا sentence.' },
        { role: 'Verb, past', say: 'The same words as verse 2, but now the hidden “she” is the earth.' },
        { role: 'Preposition', say: 'The phrase belongs to أَذِنَتْ and says who the earth listened to.' },
        { role: 'After a preposition', say: 'Genitive with kasra, because of لِ. The ending هَا means “its”, and now it points to the earth.' },
        { role: 'And', say: 'وَ joins the next verb to أَذِنَتْ.' },
        { role: 'Verb, past, passive', say: 'Passive, as in verse 2. Its deputy subject is a hidden pronoun, and here it returns to the earth.' },
      ],
      quiz: { word: 1, q: 'In verse 5, who is the hidden subject of أَذِنَتْ?', options: ['The earth (الْأَرْضُ)', 'The sky (السَّمَاءُ)', 'Mankind (الْإِنسَانُ)'], answer: 0, why: 'The verse repeats verse 2, but it belongs to the second إِذَا sentence, which is about الْأَرْضُ. The hidden “she” returns to the earth.' },
    },
    6: {
      words: [
        { role: 'Calling particle', say: 'يَا calls someone. The called word comes next. It never changes its ending.' },
        { role: 'Called noun (munādā)', say: 'أَيُّهَا is the person who is called: someone specific, not named. It is built on ḍamma and sits in the place of the accusative. هَا is a small word of attention.' },
        { role: 'Badal of أَيُّهَا', say: 'It says who is meant, and it follows أَيُّهَا in the nominative. al-Jadwal also allows ‘aṭf bayān.' },
        { role: 'Inna + “you”', say: 'إِنَّ adds emphasis and puts its noun in the accusative. Its noun is the attached كَ, “you”. The sentence إِنَّكَ كَادِحٌ is the answer to the call.' },
        { role: 'Predicate of inna (khabar)', say: 'An active participle, “one who labours”. It is nominative with tanwin because it is the khabar of إِنَّ.' },
        { role: 'Preposition', say: 'The phrase belongs to كَادِحٌ. al-Jadwal reads a word left out: “toward the meeting of your Lord”.' },
        { role: 'After a preposition', say: 'Genitive with kasra, because of إِلَىٰ. The ending كَ means “your”.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'The verbal noun of the same root as كَادِحٌ. It is accusative with tanwin fatḥa and adds emphasis: “labouring hard”.' },
        { role: 'Joining fa (‘aṭf)', say: 'فَ joins مُلَاقِيهِ to كَادِحٌ. It is a plain joining word here.' },
        { role: 'Joined to كَادِحٌ', say: 'An active participle of Form III with “Him” attached: “one who meets Him”. It is nominative because it is joined to كَادِحٌ. al-Jadwal also allows it as the khabar of an unspoken أَنتَ.' },
      ],
      quiz: { word: 2, q: 'What is الْإِنسَانُ in the call?', options: ['The called noun itself (munādā)', 'A badal of أَيُّهَا, following it in the nominative', 'A ḥāl'], answer: 1, why: 'al-Jadwal reads أَيُّهَا as the called noun. الْإِنسَانُ says who is meant and follows it as a badal (or ‘aṭf bayān), so it is nominative.' },
    },
    7: {
      words: [
        { role: 'Joining fa (‘aṭf)', say: 'فَ joins this sentence to the call in verse 6 and opens the details: “as for...”.' },
        { role: 'Particle of condition and detail', say: 'أَمَّا sets out the cases one by one: “as for...”. It needs a فَ before its answer, which comes in verse 8.' },
        { role: 'Conditional noun, subject (mubtadaʾ)', say: 'مَنْ means “whoever”. al-Jadwal reads it as a conditional noun and the mubtadaʾ. It never changes its ending. al-Jadwal also allows a relative noun here.' },
        { role: 'Verb, past, passive, Form IV', say: 'It is passive, so the giver is not named. Its deputy subject is a hidden pronoun for مَنْ. The whole clause is the khabar of مَنْ.' },
        { role: 'Object (mafʿūl bihi)', say: 'Accusative with fatḥa: the thing that was given. The verb is passive, but its deputy subject is the hidden pronoun, so this word stays accusative. The ending هُ means “his”.' },
        { role: 'Preposition', say: 'The phrase belongs to أُوتِيَ and says in which hand he is given it.' },
        { role: 'After a preposition', say: 'Genitive with kasra, because of بِ. The ending هِ means “his”.' },
      ],
      quiz: { word: 4, q: 'What is the case of كِتَابَهُ, and why?', options: ['Nominative, because it is the deputy subject', 'Genitive, because it follows a preposition', 'Accusative, because it is an object of أُوتِيَ'], answer: 2, why: 'The deputy subject of أُوتِيَ is a hidden pronoun for مَنْ. كِتَابَهُ is the other object, so it stays accusative. You can see the fatḥa on the ب.' },
    },
    8: {
      words: [
        { role: 'Fa that links the answer', say: 'The answer to a condition that starts with أَمَّا needs a فَ. This فَ links the answer to the condition.' },
        { role: 'Future particle', say: 'سَوْفَ puts the verb in the future: “will”. It is a particle and never changes its ending.' },
        { role: 'Verb, present, passive, Form III', say: 'Passive: the one who holds him to account is not named. It is indicative with ḍamma. The clause is the answer of the condition, in the place of jazm. Its deputy subject is hidden and returns to مَنْ.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'The verbal noun of the same root as the verb. al-Jadwal reads it as a mafʿūl muṭlaq. It is accusative with tanwin fatḥa.' },
        { role: 'Adjective (naʿt)', say: 'It describes حِسَابًا, so it copies its accusative case and tanwin: “an easy reckoning”.' },
      ],
      quiz: { word: 3, q: 'What is حِسَابًا?', options: ['An absolute object (mafʿūl muṭlaq) of يُحَاسَبُ', 'A ḥāl', 'The object of a preposition'], answer: 0, why: 'حِسَابًا is the verbal noun of the same root as يُحَاسَبُ, in the accusative. al-Jadwal calls it a mafʿūl muṭlaq, and يَسِيرًا describes it.' },
    },
    9: {
      words: [
        { role: 'And', say: 'وَ joins this verb to يُحَاسَبُ.' },
        { role: 'Verb, present, Form VII', say: 'Joined to يُحَاسَبُ, so it is also part of the answer, in the place of jazm. The subject “he” is hidden. Form VII (اِنْفَعَلَ) here means “he turns back”.' },
        { role: 'Preposition', say: 'The phrase belongs to يَنقَلِبُ and gives the place he goes back to.' },
        { role: 'After a preposition', say: 'Genitive with kasra, because of إِلَىٰ. The ending هِ means “his”.' },
        { role: 'State (ḥāl)', say: 'al-Jadwal reads it as a ḥāl from the hidden subject of يَنقَلِبُ: it tells how he returns. It is accusative with tanwin fatḥa. It is a passive participle, “pleased”.' },
      ],
      quiz: { word: 4, q: 'What is مَسْرُورًا in this verse?', options: ['The predicate of كَانَ', 'A ḥāl from the hidden subject of يَنقَلِبُ', 'The object of يَنقَلِبُ'], answer: 1, why: 'It tells in what state he returns, and it is accusative. al-Jadwal reads it as a ḥāl from the hidden “he”. There is no كَانَ in this verse.' },
    },
    10: {
      words: [
        { role: 'And', say: 'وَ joins this second case to the first.' },
        { role: 'Particle of condition and detail', say: 'The same أَمَّا as in verse 7. It sets out the second case.' },
        { role: 'Conditional noun, subject (mubtadaʾ)', say: 'As in verse 7: “whoever”. Its khabar is the clause after it.' },
        { role: 'Verb, past, passive, Form IV', say: 'As in verse 7: passive, with a hidden deputy subject for مَنْ.' },
        { role: 'Object (mafʿūl bihi)', say: 'Accusative with fatḥa, as in verse 7.' },
        { role: 'Adverb of place (ẓarf)', say: 'It means “behind”. It is accusative with fatḥa and belongs to أُوتِيَ. It owns the next word.' },
        { role: 'Second part of a possession (muḍāf ilayhi)', say: 'Genitive with kasra, because وَرَاءَ owns it. The ending هِ means “his”.' },
      ],
      quiz: { word: 5, q: 'What is وَرَاءَ here?', options: ['A particle that never changes', 'The subject of أُوتِيَ', 'An adverb of place, accusative, that owns ظَهْرِهِ'], answer: 2, why: 'وَرَاءَ means “behind”. al-Jadwal calls it an adverb of place (ẓarf makān) in the accusative, and the word after it is its muḍāf ilayhi.' },
    },
    11: {
      words: [
        { role: 'Fa that links the answer', say: 'فَ links the answer of the second أَمَّا, as in verse 8.' },
        { role: 'Future particle', say: 'It puts the verb in the future: “will”.' },
        { role: 'Verb, present, Form I', say: 'Indicative, with a long ū at the end. The clause is the answer of the condition, in the place of jazm. The subject “he” is hidden.' },
        { role: 'Object (mafʿūl bihi)', say: 'What he calls for: “destruction”. It is accusative with tanwin fatḥa.' },
      ],
      quiz: { word: 0, q: 'What does the فَ in فَسَوْفَ يَدْعُو do?', options: ['It links the answer of the condition that began with أَمَّا', 'It says “because he did wrong”', 'It joins two nouns'], answer: 0, why: 'The answer to an أَمَّا condition needs a فَ. It links the answer and does not say that one thing causes the other.' },
    },
    12: {
      words: [
        { role: 'And', say: 'وَ joins this verb to يَدْعُو.' },
        { role: 'Verb, present, Form I', say: 'Joined to يَدْعُو, so it is also part of the answer. The final alif written as ىٰ comes from an original يَصْلَيُ, where the yāʾ turns into an alif after a fatḥa. The subject “he” is hidden.' },
        { role: 'Object (mafʿūl bihi)', say: 'al-Jadwal reads it as an object, like ثُبُورًا in verse 11: what he enters. It is accusative with tanwin fatḥa.' },
      ],
      quiz: { word: 2, q: 'What is سَعِيرًا in this verse?', options: ['A ḥāl', 'The object (mafʿūl bihi) of يَصْلَىٰ', 'An adjective'], answer: 1, why: 'al-Jadwal reads سَعِيرًا as an object, like ثُبُورًا before it. It is what he enters, not a description of how.' },
    },
    13: {
      words: [
        { role: 'Inna + “he”', say: 'إِنَّ puts its noun in the accusative. Its noun is the attached هُ, “he”. al-Jadwal reads this sentence as a reason for what came before (taʿlīl), and it has no place of its own.' },
        { role: 'Verb “was”, past', say: 'كَانَ takes a noun (here a hidden “he”) and a predicate in the accusative. The whole clause is the khabar of إِنَّ.' },
        { role: 'Preposition', say: 'The phrase belongs to مَسْرُورًا, not to كَانَ: “glad among his people”.' },
        { role: 'After a preposition', say: 'Genitive with kasra, because of فِي. The ending هِ means “his”.' },
        { role: 'Predicate of kāna (khabar)', say: 'Accusative with tanwin fatḥa, because it is the khabar of كَانَ. It is the same word as in verse 9, but here it is not a ḥāl.' },
      ],
      quiz: { word: 4, q: 'What is مَسْرُورًا here, and how is it different from verse 9?', options: ['A ḥāl, the same as in verse 9', 'The object of فِي', 'The khabar of كَانَ, not a ḥāl like verse 9'], answer: 2, why: 'In verse 9 there is no كَانَ, so مَسْرُورًا is a ḥāl. Here it is the khabar of كَانَ, so it is accusative for that reason.' },
    },
    14: {
      words: [
        { role: 'Inna + “he”', say: 'Another reason (taʿlīl) in the same style as verse 13. The attached هُ is the noun of إِنَّ.' },
        { role: 'Verb, past', say: 'ظَنَّ means “he thought”. It takes two objects, and the أَنْ clause fills their place. Its clause is a second khabar of إِنَّ.' },
        { role: 'Light form of anna', say: 'أَنْ here is the light form of أَنَّ, with its noun left out (“that he...”). It does not put the verb in the subjunctive: that is the job of لَنْ.' },
        { role: 'Negative particle', say: 'لَنْ negates the future, “will never”, and puts the verb in the subjunctive. The clause after it is the khabar of أَنْ.' },
        { role: 'Verb, present, subjunctive', say: 'Subjunctive with fatḥa because of لَنْ. The subject “he” is hidden. The whole أَنْ clause works like a verbal noun that fills the place of the two objects of ظَنَّ.' },
      ],
      quiz: { word: 2, q: 'What is the أَنْ in أَن لَّن يَحُورَ?', options: ['The light form of أَنَّ, with its noun left out', 'A particle that puts the verb in the subjunctive', 'A preposition'], answer: 0, why: 'al-Jadwal reads it as the light form of أَنَّ. The subjunctive of يَحُورَ comes from لَنْ, and the clause after it is the khabar of أَنْ.' },
    },
    15: {
      words: [
        { role: 'Answer particle', say: 'بَلَىٰ answers a negative with “yes, on the contrary”. Here it answers لَن يَحُورَ in verse 14. al-Jadwal reads an unspoken answer after it: “yes, he will return to God”.' },
        { role: 'Particle of emphasis', say: 'إِنَّ gives the reason for that answer. It puts its noun in the accusative.' },
        { role: 'Noun of inna', say: 'Accusative with fatḥa, because إِنَّ stands before it. The ending هُ means “his”.' },
        { role: 'Verb “was”, past', say: 'Its subject is hidden. The whole clause كَانَ بِهِ بَصِيرًا is the khabar of إِنَّ.' },
        { role: 'Preposition + “him”', say: 'The phrase belongs to بَصِيرًا. It says whom the Lord sees.' },
        { role: 'Predicate of kāna (khabar)', say: 'Accusative with tanwin fatḥa, because it is the khabar of كَانَ. The pattern فَعِيل gives an adjective: “seeing”.' },
      ],
      quiz: { word: 0, q: 'What does بَلَىٰ do in this verse?', options: ['It means “no”, agreeing with the negation', 'It affirms what the negation لَن يَحُورَ denied', 'It is a preposition'], answer: 1, why: 'بَلَىٰ is used after a negative to say “yes, it is so”. He said he would never return; بَلَىٰ answers “yes, he will”.' },
    },
    16: {
      words: [
        { role: 'Resuming fa', say: 'فَ starts a new sentence after the passage before it. al-Jadwal does not read it as a “so” of cause.' },
        { role: 'Added particle (zāʾida)', say: 'al-Jadwal calls this لَا an added particle: it is not a negation. It adds emphasis to the oath.' },
        { role: 'Verb, present, Form IV', say: 'Indicative with ḍamma. The subject “I” is hidden. أُقْسِمُ means “I swear”.' },
        { role: 'Preposition', say: 'The phrase belongs to أُقْسِمُ and names the thing sworn by.' },
        { role: 'After a preposition', say: 'Genitive with kasra, because of بِ. al-Jadwal gives two meanings: the mixing of daylight with the dark after sunset, or the red glow seen soon after sunset.' },
      ],
      quiz: { word: 1, q: 'What is the لَا in فَلَا أُقْسِمُ?', options: ['A negation: “I do not swear”', 'A prohibition', 'An added particle (zāʾida) that adds emphasis'], answer: 2, why: 'al-Jadwal reads this لَا as an added particle. The speaker does swear; the لَا only adds emphasis.' },
    },
    17: {
      words: [
        { role: 'Joining wa (‘aṭf)', say: 'al-Jadwal reads this وَ as joining, not as an oath particle: the oath is أُقْسِمُ بِ in verse 16, and the night is joined to الشَّفَقِ.' },
        { role: 'Joined to الشَّفَقِ', say: 'Genitive with kasra, because it is joined to الشَّفَقِ, which is genitive after بِ.' },
        { role: 'Joining wa (‘aṭf)', say: 'It joins what follows to الشَّفَقِ, as the first وَ did.' },
        { role: 'Particle that makes a verbal noun', say: 'al-Jadwal reads مَا as a masdar particle: مَا وَسَقَ means “its gathering”. It never changes its ending. al-Jadwal also allows “what it gathers”, with مَا as a relative noun.' },
        { role: 'Verb, past, Form I', say: 'The subject “it” is hidden and means the night. The clause follows مَا and has no place of its own. The verb means “gathered”.' },
      ],
      quiz: { word: 1, q: 'Why is اللَّيْلِ genitive?', options: ['It is joined to الشَّفَقِ, which is genitive after بِ', 'It follows an oath particle وَ', 'It owns the next word'], answer: 0, why: 'al-Jadwal reads the three وَ in verses 17-18 as joining particles. So اللَّيْلِ takes the case of الشَّفَقِ, which is genitive after بِ.' },
    },
    18: {
      words: [
        { role: 'Joining wa (‘aṭf)', say: 'It joins the moon to الشَّفَقِ.' },
        { role: 'Joined to الشَّفَقِ', say: 'Genitive with kasra, because it is joined to الشَّفَقِ.' },
        { role: 'Word for time, no condition', say: 'al-Jadwal reads إِذَا here as a plain word for time, without any “if” meaning. It belongs to أُقْسِمُ: “I swear by the moon when...”. The clause after it is its mudāf ilayhi.' },
        { role: 'Verb, past, Form VIII', say: 'The subject “it” is hidden and means the moon. The original is اِوْتَسَقَ: the و is replaced by تَ and the two merge into تّ. It means “it became full”.' },
      ],
      quiz: { word: 2, q: 'How does al-Jadwal read إِذَا in this verse?', options: ['As a conditional word that needs an answer', 'As a plain word for time, tied to أُقْسِمُ', 'As a preposition'], answer: 1, why: 'al-Jadwal says the إِذَا is stripped of conditional force and belongs to أُقْسِمُ. So there is no answer to look for after it.' },
    },
    19: {
      words: [
        { role: 'Lām of the oath', say: 'It starts the answer to the oath in verses 16-18. With the strong nūn on the verb, it makes the answer strong: “you will surely...”.' },
        { role: 'Verb, present, with strong nūn', say: 'It means “you (plural) ride”. The nūn of the ending and the plural و are both dropped before the strong nūn, and the ḍamma on the ب shows that a و was there. al-Jadwal calls it indicative, with the sign (the nūn) dropped. The clause is the answer to the oath.' },
        { role: 'Object (mafʿūl bihi)', say: 'What you ride. It is accusative with tanwin fatḥa. The word طَبَق means a “state” or “stage” here.' },
        { role: 'Preposition', say: 'Here عَن means “after”, as al-Jadwal notes. The phrase describes the first طَبَقًا.' },
        { role: 'After a preposition', say: 'Genitive with tanwin kasra, because of عَن: “a state after a state”.' },
      ],
      quiz: { word: 0, q: 'What is the job of لَ in لَتَرْكَبُنَّ?', options: ['It means “not”', 'It makes the verb passive', 'It starts the answer to the oath'], answer: 2, why: 'This is the lām of the oath. It starts the answer to the oaths in verses 16-18, and the strong nūn on the verb goes with it.' },
    },
    20: {
      words: [
        { role: 'Fa for an unspoken condition', say: 'al-Jadwal reads a hidden “if” before it: “if this is how it will be with them, then what is the matter with them...?”.' },
        { role: 'Question word, subject', say: 'مَا means “what”. It is the mubtadaʾ of the sentence and never changes its ending.' },
        { role: 'Preposition + “them”', say: 'The phrase belongs to the khabar of مَا, which is left out: “what is [there] for them?”. The ending هُمْ means “them”.' },
        { role: 'Negation', say: 'لَا negates the present verb after it.' },
        { role: 'Verb, present, Form IV', say: 'Indicative; the final نَ is the sign of the plural. The clause is a ḥāl from the pronoun in لَهُمْ: “what is wrong with them, while they do not believe?”.' },
      ],
      quiz: { word: 0, q: 'What does the فَ in فَمَا لَهُمْ link to?', options: ['An unspoken condition: “if this is how it is...”', 'A cause: it means “because”', 'A noun before it'], answer: 0, why: 'al-Jadwal reads a hidden “if” before the فَ, and the question is its answer. The فَ does not state a cause.' },
    },
    21: {
      words: [
        { role: 'And', say: 'وَ joins this whole sentence to the sentence of verse 20.' },
        { role: 'Word for time, with “if”', say: 'Here إِذَا keeps its force of “when/if”. Its answer is لَا يَسْجُدُونَ. The sentence after it is its mudāf ilayhi.' },
        { role: 'Verb, past, passive', say: 'The reader is not named. It is passive, and its deputy subject is الْقُرْآنُ. The vowels change from قَرَأَ to قُرِئَ.' },
        { role: 'Preposition + “them”', say: 'The phrase belongs to قُرِئَ and shows who it is read to. The ending هِمُ means “them”.' },
        { role: 'Deputy subject (nāʾib al-fāʿil)', say: 'Nominative with ḍamma. It would be the object with an active verb; with the passive verb it becomes the subject.' },
        { role: 'Negation', say: 'لَا negates the verb after it.' },
        { role: 'Verb, present: answer of idha', say: 'It is the answer to إِذَا. al-Jadwal reads the whole sentence (إِذَا... لَا يَسْجُدُونَ) as a second ḥāl, joined to لَا يُؤْمِنُونَ in verse 20.' },
      ],
      quiz: { word: 4, q: 'What is الْقُرْآنُ in this sentence?', options: ['The subject of an active verb', 'The deputy subject (nāʾib al-fāʿil) of قُرِئَ', 'The object of عَلَيْهِمُ'], answer: 1, why: 'قُرِئَ is passive, and the thing read becomes its subject, so it is nominative. عَلَيْهِمُ is a preposition and the phrase belongs to the verb.' },
    },
    22: {
      words: [
        { role: 'Particle of moving on', say: 'al-Jadwal reads بَلِ here as “moving on” (idrāb intiqālī): it does not cancel what came before but turns to a new statement.' },
        { role: 'Relative noun, subject (mubtadaʾ)', say: 'It means “those who”. It is the mubtadaʾ and never changes its ending.' },
        { role: 'Verb, past: sila', say: 'This clause completes الَّذِينَ and has no place of its own. The final ا is the sign of the plural “they”.' },
        { role: 'Predicate (khabar), verb, Form II', say: 'Present, indicative. The clause is the khabar of الَّذِينَ. Form II (فَعَّلَ) here means “to call something a lie”.' },
      ],
      quiz: { word: 0, q: 'What does بَلِ do here?', options: ['It cancels the earlier verses and says they were wrong', 'It means “because”', 'It moves on to a new statement'], answer: 2, why: 'al-Jadwal calls it a particle of moving on (idrāb intiqālī). The earlier verses stay; a new statement begins.' },
    },
    23: {
      words: [
        { role: 'And', say: 'وَ joins this sentence to the one before it. al-Jadwal also allows a وَ that sets the scene (ḥāl).' },
        { role: 'Subject (mubtadaʾ)', say: 'Nominative with ḍamma.' },
        { role: 'Predicate (khabar), elative shape', say: 'Nominative with ḍamma, and no tanwin because it has the elative form أَفْعَل. al-Jadwal reads it with the meaning of عَالِم, “knowing”.' },
        { role: 'Preposition', say: 'The phrase belongs to أَعْلَمُ and gives what is known.' },
        { role: 'Particle that makes a verbal noun', say: 'al-Jadwal first reads مَا as a masdar particle: بِمَا يُوعُونَ means “of their keeping inside”. The phrase after بِ is genitive in position. It also allows “of what they keep”, with مَا as a relative noun.' },
        { role: 'Verb, present, Form IV', say: 'Indicative; the final نَ is the sign of the plural “they”. The clause follows مَا and has no place of its own. أَوْعَى means “to put into a container”; here it means “to keep hidden inside”.' },
      ],
      quiz: { word: 4, q: 'How does al-Jadwal first read مَا in بِمَا يُوعُونَ?', options: ['As a particle that makes a verbal noun with the verb', 'As a question word', 'As a preposition'], answer: 0, why: 'al-Jadwal takes مَا as a masdar particle. Together with the verb it means “their keeping inside”, which is genitive after بِ. It also allows a relative noun.' },
    },
    24: {
      words: [
        { role: 'Fa for an unspoken condition', say: 'al-Jadwal reads a hidden “if” before it: “if they carry on in their lying, then give them tidings...”.' },
        { role: 'Command, Form II, plus “them”', say: 'The command is to one person (the Prophet). Form II (فَعَّلَ) acts on someone else: “give someone news”. The ending هُمْ is the object “them”. The clause is the answer to the hidden condition, in the place of jazm.' },
        { role: 'Preposition', say: 'The phrase belongs to بَشِّرْهُم and gives what the news is.' },
        { role: 'After a preposition', say: 'Genitive with tanwin kasra, because of بِ.' },
        { role: 'Adjective (naʿt)', say: 'It describes عَذَابٍ, so it copies its genitive case and tanwin: “a painful punishment”.' },
      ],
      quiz: { word: 0, q: 'What does the فَ in فَبَشِّرْهُم link to?', options: ['It means “therefore” and states a cause', 'An unspoken condition: “if they carry on denying...”', 'A noun before it'], answer: 1, why: 'al-Jadwal reads a hidden “if they carry on in their lying” before the فَ, and the command is its answer.' },
    },
    25: {
      words: [
        { role: 'Particle of exception', say: 'al-Jadwal calls this a disconnected exception (munqaṭiʿ): those excepted were not among the people who were to be given the tidings of punishment. إِلَّا never changes its ending.' },
        { role: 'Excepted party (mustathnā)', say: 'It means “those who”. In al-Jadwal it is accusative in position as the excepted party. al-Jadwal also allows it as a mubtadaʾ if إِلَّا means “but” (لَكِنْ).' },
        { role: 'Verb, past: sila', say: 'This clause completes الَّذِينَ and has no place of its own. The final ا marks the plural “they”.' },
        { role: 'And', say: 'وَ joins the next verb to آمَنُوا.' },
        { role: 'Verb, past, joined', say: 'Joined to آمَنُوا, so it is also part of the sila.' },
        { role: 'Object (mafʿūl bihi)', say: 'Accusative. The feminine plural ending takes kasra for the accusative: ـاتِ.' },
        { role: 'Preposition + “them”, predicate first', say: 'The phrase belongs to an unspoken khabar that is placed before its subject. It puts the weight on the people the reward is for.' },
        { role: 'Subject (mubtadaʾ), placed after', say: 'Nominative with tanwin ḍamma. The khabar came first (لَهُمْ): “for them is a reward”. al-Jadwal reads the sentence as a new explaining sentence (istiʾnāf bayānī).' },
        { role: 'Adjective (naʿt) of أَجْرٌ', say: 'It describes أَجْرٌ, so it is nominative. It owns the next word.' },
        { role: 'Second part of a possession (muḍāf ilayhi)', say: 'Genitive with kasra, because غَيْرُ owns it. It is a passive participle: مَمْنُون means “cut off”, so the phrase means “not cut off”.' },
      ],
      quiz: { word: 8, q: 'Why is غَيْرُ nominative?', options: ['It follows a preposition', 'It is the subject of a verb', 'It describes أَجْرٌ, so it copies its nominative case'], answer: 2, why: 'al-Jadwal calls غَيْرُ a naʿt of أَجْرٌ. An adjective takes the case of the word it describes, and أَجْرٌ is the nominative mubtadaʾ.' },
    },
  },
};
