// Plain-English teaching layer for Ash-Shams (91). Same shape and rules as in surah-study.ts.
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Someone who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from './surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Oath particle', say: 'wa- here means “by”. It puts the next noun in the genitive. al-Jadwal ties the phrase to an unspoken verb: “I swear”.' },
        { role: 'Sworn by, genitive', say: 'Genitive with kasra, because of the oath wa- before it. The sun is the first thing sworn by.' },
        { role: 'And', say: 'This wa- joins ضُحَاهَا to الشَّمْسِ. It is a plain “and”, not a new oath particle.' },
        { role: 'Joined noun, genitive', say: 'Genitive because it is joined to الشَّمْسِ. The ending هَا means “its” and points back to the sun.' },
      ],
      quiz: { word: 2, q: 'What is the second وَ in this verse, the one before ضُحَاهَا?', options: ['A second oath particle', 'A conjunction: it joins ضُحَاهَا to الشَّمْسِ', 'A wāw that describes a state'], answer: 1, why: 'The first وَ swears. The second one only joins one noun to another, so ضُحَاهَا is genitive because الشَّمْسِ is.' },
    },
    2: {
      words: [
        { role: 'And', say: 'wa- joins the moon to the sun, so the oath carries on. It is read as a conjunction, not a new oath particle.' },
        { role: 'Sworn by, genitive', say: 'Genitive with kasra, because it is joined to الشَّمْسِ.' },
        { role: 'Time word', say: 'al-Jadwal: a time word with no “if” in it, so it does not make the verb jussive. It is tied to the unspoken “I swear”.' },
        { role: 'Verb, past, plus “it”', say: 'The clause after إِذَا is its mudaf ilayhi (the word added to it). The subject “he” is the moon, hidden. The ending هَا is the object: the sun.' },
      ],
      quiz: { word: 2, q: 'What does al-Jadwal say about إِذَا here?', options: ['It is “if”: it makes the next verb jussive', 'It is a preposition that governs the next word', 'It is a time word with no condition in it, tied to the unspoken “I swear”'], answer: 2, why: 'This إِذَا only says when. It does not set a condition, so the verb after it keeps its normal ending.' },
    },
    3: {
      words: [
        { role: 'And', say: 'wa- joins the day to the nouns before it, so the oath carries on.' },
        { role: 'Sworn by, genitive', say: 'Genitive with kasra, because it is joined to the earlier oath nouns.' },
        { role: 'Time word', say: 'A time word with no condition in it, tied to the unspoken “I swear”. The clause after it is its mudaf ilayhi.' },
        { role: 'Verb, past, Form II, plus “it”', say: 'Form II (فَعَّلَ) makes the meaning stronger: to show something clearly. The subject “it” is the day, hidden. The ending هَا is the object: the sun.' },
      ],
      quiz: { word: 3, q: 'What place does the clause جَلَّاهَا have in the sentence?', options: ['Genitive: it is the mudaf ilayhi of إِذَا', 'Accusative: it describes a state', 'No place: it is a relative clause'], answer: 0, why: 'al-Jadwal says the clause after this إِذَا is added to it, like the second word of a possession. That gives the clause a genitive position.' },
    },
    4: {
      words: [
        { role: 'And', say: 'wa- joins the night to the nouns before it, so the oath carries on.' },
        { role: 'Sworn by, genitive', say: 'Genitive with kasra, because it is joined to the earlier oath nouns.' },
        { role: 'Time word', say: 'Same as in the two verses before: a time word with no condition in it, tied to the unspoken “I swear”.' },
        { role: 'Verb, present, plus “it”', say: 'A present verb, indicative (marfuʿ). The ḍamma does not show because the stem ends in alif. The subject “it” is the night, hidden; the ending هَا is the object.' },
      ],
      quiz: { word: 3, q: 'What mood is يَغْشَاهَا after إِذَا?', options: ['Jussive, because إِذَا is a conditional word', 'Subjunctive, because a particle comes before it', 'Indicative (marfuʿ): this إِذَا has no condition, so it changes nothing'], answer: 2, why: 'A present verb is only jussive after a word that really sets a condition. al-Jadwal reads this إِذَا as a plain time word, so the verb stays indicative.' },
    },
    5: {
      words: [
        { role: 'And', say: 'wa- joins the sky to the earlier oath nouns. It is a conjunction.' },
        { role: 'Sworn by, genitive', say: 'Genitive with kasra, because it is joined to the earlier oath nouns.' },
        { role: 'And', say: 'This wa- joins the whole phrase مَا بَنَاهَا to السَّمَاءِ. It is a conjunction, not an oath particle.' },
        { role: 'Particle that makes a verbal noun', say: 'al-Jadwal reads مَا as a particle: مَا بَنَاهَا means “the building of it”. It also allows a relative noun: “He who built it”.' },
        { role: 'Verb, past, plus “it”', say: 'This clause completes مَا and has no place of its own. The subject “He” (Allah) is hidden. The ending هَا is the object: the sky.' },
      ],
      quiz: { word: 3, q: 'How does al-Jadwal read مَا in وَمَا بَنَاهَا?', options: ['A negative: “it did not build”', 'A particle that makes a verbal noun: “the building of it” (it also allows “He who built it”)', 'A question word: “what built it?”'], answer: 1, why: 'The particle plus its clause makes one noun in the genitive, joined to السَّمَاءِ. al-Jadwal adds that the relative reading, “He who built it”, is also possible.' },
    },
    6: {
      words: [
        { role: 'And', say: 'wa- joins the earth to the earlier oath nouns. It is a conjunction.' },
        { role: 'Sworn by, genitive', say: 'Genitive with kasra, because it is joined to the earlier oath nouns.' },
        { role: 'And', say: 'This wa- joins the phrase مَا طَحَاهَا to الْأَرْضِ.' },
        { role: 'Particle that makes a verbal noun', say: 'The same as in verse 5: “the spreading of it”, or in the other reading “He who spread it”. The phrase is in the genitive position.' },
        { role: 'Verb, past, plus “it”', say: 'The verb means to spread out. This clause completes مَا and has no place of its own. The ending هَا is the object: the earth.' },
      ],
      quiz: { word: 2, q: 'What is the وَ before مَا in وَمَا طَحَاهَا?', options: ['A conjunction: it joins the مَا phrase to الْأَرْضِ', 'A new oath particle that governs the genitive', 'A wāw that describes a state'], answer: 0, why: 'al-Jadwal says the phrase مَا طَحَاهَا is joined to الْأَرْضِ. Joining is the job of a conjunction, so this وَ is not a new oath.' },
    },
    7: {
      words: [
        { role: 'And', say: 'wa- joins the soul to the earlier oath nouns. It is a conjunction.' },
        { role: 'Sworn by, genitive, indefinite', say: 'Genitive, because it is joined to the earlier oath nouns. Tanwin kasratayn shows it has no al-: “a soul”.' },
        { role: 'And', say: 'This wa- joins the phrase مَا سَوَّاهَا to نَفْسٍ.' },
        { role: 'Particle that makes a verbal noun', say: 'The same as in verses 5 and 6: “the proportioning of it”, or “He who proportioned it”.' },
        { role: 'Verb, past, Form II, plus “it”', say: 'Form II (فَعَّلَ): to shape evenly, to put in good order. This clause completes مَا. The ending هَا is the soul.' },
      ],
      quiz: { word: 1, q: 'Why does نَفْسٍ end with tanwin kasratayn?', options: ['It is the object of a verb, and it is indefinite', 'It is the subject, and it is indefinite', 'It is genitive, joined to the oath nouns, and it is indefinite'], answer: 2, why: 'The kasra shows the genitive: it is joined to the earlier oath nouns. The tanwin shows it has no al-, so it means “a soul” or “any soul”.' },
    },
    8: {
      words: [
        { role: 'And, joining clauses', say: 'al-Jadwal: a conjunction that joins this clause to the clause سَوَّاهَا in verse 7.' },
        { role: 'Verb, past, Form IV, plus “it”', say: 'Form IV (أَفْعَلَ). It takes two objects. The ending هَا is the first: the soul. The subject “He” (Allah) is hidden.' },
        { role: 'Second object', say: 'Accusative with fatḥa: what the soul was inspired with. The ending هَا means “its”.' },
        { role: 'And', say: 'Joins تَقْوَاهَا to فُجُورَهَا.' },
        { role: 'Joined to the second object', say: 'Accusative in position, like فُجُورَهَا. The stem ends in alif, so the fatḥa does not show.' },
      ],
      quiz: { word: 0, q: 'What does the فَ in فَأَلْهَمَهَا do, according to al-Jadwal?', options: ['It starts a new sentence', 'It joins this clause to the clause سَوَّاهَا in verse 7', 'It answers an unspoken “if”'], answer: 1, why: 'al-Jadwal calls it a conjunction. Both clauses finish the third مَا, so the soul was proportioned and then inspired.' },
    },
    9: {
      words: [
        { role: 'Particle of certainty', say: 'قَدْ before a past verb adds “surely”.' },
        { role: 'Verb, past, Form IV', say: 'Form IV (أَفْعَلَ): to succeed. al-Jadwal calls the whole sentence an explaining sentence with no place in the grammar. It also allows that it is the answer to the oath.' },
        { role: 'Relative pronoun', say: 'It means “whoever”. al-Jadwal gives it the position of an object; other books, such as al-Daas, call it the subject of أَفْلَحَ. The clause after it completes it.' },
        { role: 'Verb, past, Form II, plus “it”', say: 'This clause completes مَن and has no place of its own. Form II (فَعَّلَ) here means to make pure. The subject is hidden; the ending هَا is the soul.' },
      ],
      quiz: { word: 1, q: 'What does al-Jadwal say about the sentence قَدْ أَفْلَحَ مَن زَكَّاهَا?', options: ['It explains the oath and starts afresh; the answer is unspoken (it also allows the other reading)', 'It is the answer to the oath, in its usual place', 'It is a condition: “if he purifies it, he succeeds”'], answer: 0, why: 'al-Jadwal prefers an unspoken answer, something like “you will surely be raised”. It also allows that this sentence is the answer, with the lām dropped.' },
    },
    10: {
      words: [
        { role: 'And', say: 'al-Jadwal: it joins this sentence to the explaining sentence of verse 9.' },
        { role: 'Particle of certainty', say: 'The same as in verse 9: “surely”.' },
        { role: 'Verb, past', say: 'The root is خ-ي-ب. The alif in the middle comes from a ي.' },
        { role: 'Relative pronoun', say: 'It means “whoever”, like in verse 9. al-Jadwal gives it the position of an object. The clause after it completes it.' },
        { role: 'Verb, past, Form II, plus “it”', say: 'al-Jadwal: the original was دَسَّسَهَا, and one س turned into ي and then alif. The clause completes مَن. The ending هَا is the soul.' },
      ],
      quiz: { word: 0, q: 'What does the وَ in وَقَدْ خَابَ do?', options: ['It swears an oath', 'It describes a state', 'It joins this sentence to the sentence of verse 9'], answer: 2, why: 'al-Jadwal says this sentence is joined to the explaining sentence before it. The two sentences stand side by side: success and failure.' },
    },
    11: {
      words: [
        { role: 'Verb, past, Form II', say: 'Form II (فَعَّلَ): to call something a lie. The ending تْ shows the subject is feminine. al-Jadwal calls this sentence a fresh start.' },
        { role: 'Subject (fāʿil)', say: 'Nominative with ḍamma. Thamud is a tribe, so it takes a feminine verb. It has no tanwin because it is a diptote.' },
        { role: 'Preposition', say: 'The phrase belongs to كَذَّبَتْ. al-Jadwal reads بِ as “because of”; it also allows “by means of”.' },
        { role: 'After a preposition, plus “their”', say: 'Genitive with kasra after بِ. The pattern is فَعْلَى, a verbal noun for going beyond limits. The ending هَا points to Thamud.' },
      ],
      quiz: { word: 2, q: 'What is the phrase بِطَغْوَاهَا tied to?', options: ['To ثَمُودُ', 'To كَذَّبَتْ: Thamud denied because of their transgression', 'To an unspoken verb: “I swear”'], answer: 1, why: 'A preposition phrase belongs to a verb. al-Jadwal ties بِطَغْوَاهَا to كَذَّبَتْ, and reads the بِ as the cause of the denial.' },
    },
    12: {
      words: [
        { role: 'Time word', say: 'al-Jadwal: it is tied to كَذَّبَتْ in verse 11. Thamud denied at the time the most wretched of them rose up. The clause after it is its mudaf ilayhi.' },
        { role: 'Verb, past, Form VII', say: 'Form VII (انْفَعَلَ) often has the sense of happening by itself: to rise up. The clause is the mudaf ilayhi of إِذِ.' },
        { role: 'Subject (fāʿil), superlative', say: 'Nominative with ḍamma. أَشْقَى is a superlative on the pattern أَفْعَل: the most wretched. The ending هَا points to Thamud.' },
      ],
      quiz: { word: 0, q: 'What is إِذِ tied to, according to al-Jadwal?', options: ['To the unspoken “I swear”, like إِذَا in verses 2 to 4', 'To كَذَّبَتْ in verse 11', 'To أَشْقَاهَا'], answer: 1, why: 'In the oath verses إِذَا was tied to “I swear”. Here there is no oath. إِذِ says when the denial happened.' },
    },
    13: {
      words: [
        { role: 'And, joining clauses', say: 'al-Jadwal: a conjunction that joins this clause to كَذَّبَتْ ثَمُودُ.' },
        { role: 'Verb, past', say: 'The root is ق-و-ل. The subject comes after the phrase لَهُمْ: it is رَسُولُ.' },
        { role: 'Preposition with “them”', say: 'The phrase belongs to قَالَ. The ending هُمْ means “them”: Thamud.' },
        { role: 'Subject (fāʿil), first part of a possession', say: 'Nominative with ḍamma. It owns اللَّهِ, so it has no al-.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because رَسُولُ owns it.' },
        { role: 'Object of an unspoken verb', say: 'Accusative with fatḥa. al-Jadwal: the verb is unspoken, something like “leave”, meaning “beware of hurting her”. It is a warning (taḥdhīr).' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because نَاقَةَ owns it.' },
        { role: 'And', say: 'Joins سُقْيَاهَا to نَاقَةَ.' },
        { role: 'Joined noun, accusative', say: 'Accusative, because it is joined to نَاقَةَ. The noun means her drinking. The ending هَا means “her”: the she-camel.' },
      ],
      quiz: { word: 5, q: 'Why is نَاقَةَ accusative, even though no verb is written?', options: ['It is the object of an unspoken verb, in a warning', 'It is the subject of قَالَ', 'It follows the preposition لَهُمْ'], answer: 0, why: 'al-Jadwal reads a dropped verb, something like “leave”. When the thing warned about is joined to another noun by وَ, the verb has to be dropped.' },
    },
    14: {
      words: [
        { role: 'And so, joining clauses', say: 'al-Jadwal: a conjunction that joins this clause to قَالَ لَهُمْ in verse 13. All four فَ in this verse are conjunctions.' },
        { role: 'Verb, past, Form II, plus “him”', say: 'The ending ـوا is the subject: “they”. It is written, not hidden. The ending هُ is the object: “him”, Salih.' },
        { role: 'And so, joining clauses', say: 'Joins this clause to the one before it.' },
        { role: 'Verb, past, plus “her”', say: 'The ending ـوا is the subject: “they”. The ending هَا is the object: the she-camel. The verb means to cut the legs of an animal.' },
        { role: 'And so, joining clauses', say: 'Joins this clause to the one before it.' },
        { role: 'Verb, past, four-letter root', say: 'A verb with four root letters. al-Jadwal says the sense is “pressed down over them”.' },
        { role: 'Preposition with “them”', say: 'The phrase belongs to دَمْدَمَ.' },
        { role: 'Subject (fāʿil)', say: 'Nominative with ḍamma: “their Lord”. The ending هُم means “their”.' },
        { role: 'Preposition', say: 'al-Jadwal: the بِ that gives the cause. The phrase belongs to دَمْدَمَ.' },
        { role: 'After a preposition, plus “their”', say: 'Genitive with kasra after بِ. The ending هِمْ means “their”.' },
        { role: 'And so, joining clauses', say: 'Joins this last clause to دَمْدَمَ.' },
        { role: 'Verb, past, Form II, plus “it”', say: 'The subject “He” (Allah) is hidden. Form II here means to level, to make even; in verse 7 the same verb meant to proportion.' },
      ],
      quiz: { word: 1, q: 'In كَذَّبُوهُ, what is the ـوا ending?', options: ['The subject: the attached pronoun “they”', 'The object: “him”', 'A plural ending on a noun'], answer: 0, why: 'The wāw of the group is a pronoun attached to the verb, in the nominative position. The object is the last letter, هُ.' },
    },
    15: {
      words: [
        { role: 'Wāw of the state (or new start)', say: 'al-Jadwal: first choice, a wāw that begins a clause describing a state: “while He does not fear...”. It also allows a new sentence.' },
        { role: 'Negation', say: 'It says “not” and does not change the mood of the verb.' },
        { role: 'Verb, present', say: 'Indicative with ḍamma. The subject “He” is hidden: the one who leveled it, Allah. al-Jadwal also allows the messenger or the man who hamstrung the she-camel.' },
        { role: 'Object', say: 'Accusative with fatḥa on a stem that ends in alif, so it does not show. It is what He does not fear. The ending هَا points to the act of punishment.' },
      ],
      quiz: { word: 0, q: 'How does al-Jadwal read the وَ in وَلَا يَخَافُ first?', options: ['As an oath particle', 'As a plain “and” that joins two verbs', 'As a wāw of the state: the clause describes the doer of سَوَّاهَا'], answer: 2, why: 'Read this way, the clause لَا يَخَافُ عُقْبَاهَا tells us how the doer acted: He leveled it, and He does not fear the outcome. al-Jadwal also allows a new sentence.' },
    },
  },
};
