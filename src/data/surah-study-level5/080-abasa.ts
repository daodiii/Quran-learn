// Plain-English teaching layer for Surah 80, ʿAbasa. Same shape and rules as in surah-study.ts.
//
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Where al-Jadwal gives more than one reading, the line says which one it follows. Someone
// who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from '../surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Verb, past', say: 'He frowned. The subject “he” is hidden inside the verb; the story is about the Prophet ﷺ. This is the first sentence of the surah.' },
        { role: 'And', say: 'وَ joins the second verb to the first.' },
        { role: 'Verb, past, Form V', say: 'He turned away. Form V (تَفَعَّلَ) has a doubled middle letter. The ending ـىٰ is an alif written for a last letter that was ي.' },
      ],
      quiz: { word: 2, q: 'Which form is تَوَلَّىٰ?', options: ['Form I', 'Form IV', 'Form V'], answer: 2, why: 'The doubled middle letter and the extra تَـ at the start of the root mark Form V (تَفَعَّلَ): he turned himself away.' },
    },
    2: {
      words: [
        { role: 'Particle “that” (maṣdar)', say: 'It turns the clause after it into a noun-like phrase, “his coming”. al-Jadwal reads an unspoken لِ in front of it, so the sense is “because the blind man came”.' },
        { role: 'Verb, past, plus “him”', say: 'He came to him. The ending هُ means “him”. The verb is past, so its ending stays on fatḥa.' },
        { role: 'Doer (fāʿil)', say: 'The blind man. He is the one who came, so he is nominative. The ending ـىٰ is a long alif, so the case does not show.' },
      ],
      quiz: { word: 0, q: 'What does أَن do at the start of this verse?', options: ['It turns the clause into a noun-like phrase: “because he came”', 'It makes the verb jussive', 'It asks a question'], answer: 0, why: 'أَنْ here is a maṣdar particle. The clause it opens is read as a verbal noun, with an unspoken لِ in front of it in al-Jadwal.' },
    },
    3: {
      words: [
        { role: 'And', say: 'وَ joins this sentence to the opening sentence of the surah.' },
        { role: 'Question word, subject', say: 'What? It starts the sentence, so it is the subject (mubtadaʾ). The clause يُدْرِيكَ says something about it. The question needs no answer.' },
        { role: 'Verb, Form IV, plus “you”', say: 'It makes you know. Form IV (أَفْعَلَ) makes someone else know. The ending كَ is “you”, the first object. The second object is the whole clause لَعَلَّهُ يَزَّكَّىٰ.' },
        { role: 'Particle “perhaps”, plus “he”', say: 'لَعَلَّ works like إِنَّ: it puts its noun, the pronoun هُ, in the accusative. It shows hope.' },
        { role: 'Verb, present, predicate of laʿalla', say: 'He may purify himself. The doubled زّ is the تَـ of Form V melted into the زّ. This clause is the predicate of لَعَلَّ, and the verb is not in the subjunctive.' },
      ],
      quiz: { word: 4, q: 'Why is يَزَّكَّىٰ not in the subjunctive after لَعَلَّ?', options: ['لَعَلَّ puts every verb in the subjunctive', 'The clause is just the predicate of لَعَلَّ, which does not change the verb', 'It is a past verb'], answer: 1, why: 'لَعَلَّ works on its noun (the accusative هُ) and takes a predicate. It does not act on the verb inside that predicate.' },
    },
    4: {
      words: [
        { role: 'Or', say: 'أَوْ joins this clause to يَزَّكَّىٰ in the verse before.' },
        { role: 'Verb, present, Form V', say: 'He may take heed. It ends in ḍamma, so it is indicative: it is joined to يَزَّكَّىٰ. The doubled ذّ is the تَـ of Form V melted into the ذ.' },
        { role: 'Fa of cause', say: 'It shows that what follows is a result: he takes heed, and then it helps him. An unspoken أَنْ after it puts the next verb in the subjunctive.' },
        { role: 'Verb, subjunctive, plus “him”', say: 'It would benefit him. It ends in fatḥa, the sign of the subjunctive, because of the unspoken أَنْ after فَ. تَـ is feminine because the doer is feminine. هُ is “him”.' },
        { role: 'Doer (fāʿil)', say: 'The reminder. It is the doer of تَنفَعَ, so it is nominative. The ending ـىٰ hides the case. It is feminine, so the verb is feminine too.' },
      ],
      quiz: { word: 3, q: 'Why does تَنفَعَهُ end in fatḥa?', options: ['It is a past verb', 'It is a command', 'An unspoken أَنْ after فَ puts it in the subjunctive'], answer: 2, why: 'al-Jadwal reads a hidden أَنْ after the فَ of cause. That أَنْ puts the present verb in the subjunctive.' },
    },
    5: {
      words: [
        { role: 'As for (ammā)', say: 'It opens a sentence that sorts people into groups: “as for this one... as for that one...”. al-Jadwal calls it a particle of condition and detail. Its answer must start with فَ.' },
        { role: 'Relative pronoun, subject', say: 'Whoever, the one who. It is the subject (mubtadaʾ) of the sentence, and its predicate comes in verse 6. The kasra on نِ is there because the next word starts with a joining alif.' },
        { role: 'Verb, past, Form X, relative clause', say: 'He counted himself free of need. This clause completes مَنِ; it is not the predicate. Form X often means “to count oneself as ...”.' },
      ],
      quiz: { word: 2, q: 'What is the job of the clause ٱسْتَغْنَىٰ here?', options: ['It completes مَنِ (a relative clause); the predicate comes in verse 6', 'It is the predicate of مَنِ', 'It is a command'], answer: 0, why: 'In al-Jadwal the clause ٱسْتَغْنَىٰ is the ṣilah of مَنِ. The real predicate of مَنِ is the whole sentence فَأَنتَ لَهُ تَصَدَّىٰ.' },
    },
    6: {
      words: [
        { role: 'Fa that ties the answer to ammā', say: 'أَمَّا needs a فَ at the start of its answer. This is it. It does not mean “because”.' },
        { role: 'Subject (mubtadaʾ)', say: 'You. It starts the answer, and the verb تَصَدَّىٰ says what you do. This whole sentence is the predicate of مَنِ in verse 5.' },
        { role: 'Preposition + “him”', say: 'To him. It belongs to تَصَدَّىٰ and comes before it, so the focus falls on him.' },
        { role: 'Verb, present, predicate', say: 'You give your attention. One تَـ has been dropped from تَتَصَدَّىٰ to make it lighter. The clause is the predicate of أَنتَ.' },
      ],
      quiz: { word: 0, q: 'What is the job of فَ in فَأَنتَ?', options: ['It means “because”', 'It ties the answer to أَمَّا, which needs it', 'It joins two verbs'], answer: 1, why: 'أَمَّا requires a فَ at the start of its answer. It is not a cause-and-effect word here.' },
    },
    7: {
      words: [
        { role: 'Wāw of ḥāl', say: 'It begins a state clause: you give him your attention while you are not to blame if he does not grow. The state belongs to the “you” of the verse before.' },
        { role: 'Negative “not”', say: 'al-Jadwal reads it as “not”: no blame is on you. It also allows a second reading, the question “what is on you?”.' },
        { role: 'Predicate placed first', say: 'On you. The phrase belongs to an unspoken word like “is” and comes first. What it speaks about comes last.' },
        { role: 'أَنْ + لَا', say: 'أَنْ turns the clause into a noun-like phrase, “his not growing”, and لَا makes it negative. This phrase is the subject, placed last. أَنْ puts the next verb in the subjunctive.' },
        { role: 'Verb, subjunctive', say: 'He should purify himself. It follows أَنْ, so it is in the subjunctive, though the ending ـىٰ hides the sign.' },
      ],
      quiz: { word: 0, q: 'What does the وَ at the start of this verse do?', options: ['It means “because”', 'It swears an oath', 'It begins a state clause (ḥāl)'], answer: 2, why: 'al-Jadwal calls this wāw ḥāliyyah: the sentence it starts gives the state of the person addressed in verse 6.' },
    },
    8: {
      words: [
        { role: 'And', say: 'وَ joins this “as for” sentence to the first one in verse 5.' },
        { role: 'As for (ammā)', say: 'The same word as in verse 5. It needs a فَ in its answer, which comes in verse 10.' },
        { role: 'Relative pronoun, subject', say: 'The one who. It is the subject, and its predicate is the whole sentence in verse 10. It never changes its ending.' },
        { role: 'Verb, past, relative clause, plus “you”', say: 'He came to you. This clause completes مَن. The ending كَ means “you”.' },
        { role: 'Verb, present, state (ḥāl)', say: 'Hurrying. It tells how he came, so it is a ḥāl from the one who came. The present tense lets us watch him as he comes.' },
      ],
      quiz: { word: 4, q: 'What does يَسْعَىٰ do in this verse?', options: ['It tells the state of the one who came (ḥāl)', 'It is the predicate of مَن', 'It is a command'], answer: 0, why: 'In al-Jadwal the clause يَسْعَىٰ is a ḥāl from the doer of جَآءَكَ. The predicate of مَن is in verse 10.' },
    },
    9: {
      words: [
        { role: 'Wāw of ḥāl', say: 'It starts another state clause: “while he fears”. It is not a plain “and” joining two equal clauses.' },
        { role: 'Subject (mubtadaʾ)', say: 'He. The subject of a small sentence. The verb يَخْشَىٰ says something about him.' },
        { role: 'Verb, present, predicate', say: 'He fears (Allah). The clause tells the state of the man who is hurrying. The ending ـىٰ is an alif written for a last letter that was ي.' },
      ],
      quiz: { word: 0, q: 'What is the job of وَ in وَهُوَ يَخْشَىٰ?', options: ['It joins two equal verbs', 'It begins a state clause: “while he fears”', 'It swears an oath'], answer: 1, why: 'al-Jadwal reads it as a wāw of ḥāl. The whole sentence هُوَ يَخْشَىٰ is a state of the one who hurries.' },
    },
    10: {
      words: [
        { role: 'Fa that ties the answer to ammā', say: 'The answer to أَمَّا in verse 8 starts here, with the فَ that أَمَّا needs.' },
        { role: 'Subject (mubtadaʾ)', say: 'You. The verb تَلَهَّىٰ says what you do. This whole sentence is the predicate of مَن in verse 8.' },
        { role: 'Preposition + “him”', say: 'From him. It belongs to تَلَهَّىٰ and comes before it, which mirrors لَهُ in verse 6.' },
        { role: 'Verb, present, predicate', say: 'You pay no attention. One تَـ has been dropped from تَتَلَهَّىٰ to make it lighter. The clause is the predicate of أَنتَ.' },
      ],
      quiz: { word: 0, q: 'Why does this verse start with فَ?', options: ['Because the verb before it is past', 'Because it means “because of this”', 'Because أَمَّا in verse 8 needs a فَ in its answer'], answer: 2, why: 'The فَ answers the demand of أَمَّا. The same pattern was in verse 6 for the first أَمَّا.' },
    },
    11: {
      words: [
        { role: 'Rebuke', say: 'A word that says “No! Stop!”. al-Jadwal calls it a particle of rebuke and warning. It never changes, and a new sentence starts after it.' },
        { role: 'إِنَّ + “it”', say: 'Indeed it. The pronoun هَا points to the Qur’an or these verses. It is the noun of إِنَّ, so it is accusative in position.' },
        { role: 'Predicate of inna', say: 'A reminder. It completes إِنَّ, so it is nominative with tanwin. The pattern تَفْعِلَة is a verbal noun of the Form II verb ذَكَّرَ.' },
      ],
      quiz: { word: 2, q: 'Why is تَذْكِرَةٌ nominative?', options: ['It is the predicate of إِنَّ', 'It follows a preposition', 'It is the object of a verb'], answer: 0, why: 'إِنَّ puts its noun (هَا) in the accusative and leaves its predicate nominative.' },
    },
    12: {
      words: [
        { role: 'And / so', say: 'فَ joins this sentence to the one before it.' },
        { role: 'Conditional word, subject', say: 'Whoever. It opens a condition and is the subject (mubtadaʾ). A word like this puts two verbs in the jussive; here the verbs are past, so they only sit in the place of a jussive.' },
        { role: 'Verb, past, the condition', say: 'He wills. This is the condition. Its clause is the predicate of مَن; al-Jadwal also allows the condition and the answer together to be the predicate.' },
        { role: 'Verb, past, the answer', say: 'He remembers it. It is the answer to the condition and needs no فَ. The ending هُ is “it”, the reminder.' },
      ],
      quiz: { word: 2, q: 'What is the clause شَآءَ in this verse?', options: ['The answer to the condition', 'The condition; its clause is the predicate of مَن', 'A relative clause that completes مَن'], answer: 1, why: 'مَن is a conditional word here, so شَآءَ is the condition and ذَكَرَهُ is the answer.' },
    },
    13: {
      words: [
        { role: 'Preposition', say: 'In. The phrase says where the reminder is. al-Jadwal ties it to a state (ḥāl) of the هُ in ذَكَرَهُ in verse 12.' },
        { role: 'After a preposition', say: 'Pages. Genitive with tanwin kasra after فِى. It is a broken plural of صَحِيفَة.' },
        { role: 'Adjective (naʿt)', say: 'Honoured. It describes صُحُفٍ, so it copies its genitive case and is indefinite. It has the feminine singular form, as is normal when the plural is of things.' },
      ],
      quiz: { word: 2, q: 'Why does مُّكَرَّمَةٍ end in kasra with tanwin?', options: ['It follows فِى directly', 'It is the predicate of إِنَّ', 'It describes صُحُفٍ and copies its genitive case'], answer: 2, why: 'An adjective takes the case and definiteness of the noun it describes. صُحُفٍ is genitive and indefinite.' },
    },
    14: {
      words: [
        { role: 'Adjective (naʿt)', say: 'Raised, exalted. A second adjective of صُحُفٍ, so it is also genitive. It is a passive participle on the pattern مَفْعُولَة.' },
        { role: 'Adjective (naʿt)', say: 'Purified. A third adjective of صُحُفٍ, with the same genitive ending. It is a Form II passive participle, so the middle letter is doubled.' },
      ],
      quiz: { word: 1, q: 'What does مُّطَهَّرَةٍ describe?', options: ['The pages (صُحُفٍ)', 'The angels (سَفَرَةٍ)', 'The man (ٱلْإِنسَـٰنُ)'], answer: 0, why: 'The three adjectives of verses 13-14 all describe صُحُفٍ and copy its genitive case.' },
    },
    15: {
      words: [
        { role: 'Preposition', say: 'In, by. al-Jadwal ties the phrase بِأَيْدِي سَفَرَةٍ to مَرْفُوعَةٍ in verse 14: the pages are raised in the hands of the scribes.' },
        { role: 'After a preposition, first part of a possession', say: 'Hands. Genitive after بِ. It owns سَفَرَةٍ, so it has no al-. It is a broken plural of يَد and ends in a ي.' },
        { role: 'Second part of a possession', say: 'Scribes. Genitive with tanwin kasra, because أَيْدِي owns it. It is the plural of سَافِر, a writer.' },
      ],
      quiz: { word: 2, q: 'Why is سَفَرَةٍ genitive?', options: ['It follows a preposition directly', 'أَيْدِي owns it (iḍāfa)', 'It describes صُحُفٍ'], answer: 1, why: 'بِ governs أَيْدِي. Then أَيْدِي owns سَفَرَةٍ, and the second part of a possession is always genitive.' },
    },
    16: {
      words: [
        { role: 'Adjective (naʿt)', say: 'Noble. It describes سَفَرَةٍ, so it copies its genitive case. It is a broken plural of كَرِيم.' },
        { role: 'Adjective (naʿt)', say: 'Righteous, dutiful. A second adjective of سَفَرَةٍ, with the same genitive ending. It is a broken plural of بَارّ.' },
      ],
      quiz: { word: 0, q: 'What does كِرَامٍ describe?', options: ['صُحُفٍ, the pages', 'أَيْدِي, the hands', 'سَفَرَةٍ, the scribes'], answer: 2, why: 'The phrase ends with سَفَرَةٍ, the scribes, and the two adjectives that follow describe them.' },
    },
    17: {
      words: [
        { role: 'Verb, past, passive', say: 'May he be destroyed. It is a curse. The vowels قُتِلَ (ḍamma, then kasra) show the passive: the one who kills is not named.' },
        { role: 'Stand-in for the doer (nāʾib al-fāʿil)', say: 'Man. He receives the action, so he takes the doer’s place and is nominative.' },
        { role: 'Exclamation word, subject', say: 'How! Here مَا is a noun meaning something like “what a thing”. It is the subject, and the clause أَكْفَرَهُ is its predicate. al-Jadwal also allows reading it as the question “what?”.' },
        { role: 'Verb of wonder, plus “him”', say: 'How ungrateful he is! The pattern مَا أَفْعَلَهُ is used to show wonder. The ending هُ is “him”, the one we wonder at.' },
      ],
      quiz: { word: 0, q: 'Why does قُتِلَ have ḍamma and then kasra?', options: ['It is passive: nobody names who kills', 'It is a command', 'It is a present verb'], answer: 0, why: 'The pattern فُعِلَ is the past passive. The doer of the killing is left out, and man takes his place.' },
    },
    18: {
      words: [
        { role: 'Preposition', say: 'From. The phrase belongs to خَلَقَهُ at the end of the verse.' },
        { role: 'Question word, first part of a possession', say: 'Which? Genitive after مِنْ. It owns شَىْءٍ, so it has no tanwin.' },
        { role: 'Second part of a possession', say: 'Thing. Genitive with tanwin kasra, because أَيِّ owns it.' },
        { role: 'Verb, past, plus “him”', say: 'He created him. The subject “He” is hidden (Allah). The ending هُ is “him”, the human.' },
      ],
      quiz: { word: 1, q: 'Why is أَىِّ genitive?', options: ['It is the object of خَلَقَهُ', 'It follows مِنْ', 'It describes شَىْءٍ'], answer: 1, why: 'A noun after a preposition is genitive. أَىِّ comes straight after مِنْ.' },
    },
    19: {
      words: [
        { role: 'Preposition', say: 'From. The phrase answers the question of verse 18.' },
        { role: 'After a preposition', say: 'A drop. Genitive with tanwin kasra after مِن.' },
        { role: 'Verb, past, plus “him”', say: 'He created him. al-Jadwal reads this clause as a badal of the same clause in verse 18: the answer repeats the verb of the question.' },
        { role: 'And then', say: 'فَ joins the next verb to this one, and the second action follows the first.' },
        { role: 'Verb, past, Form II, plus “him”', say: 'He measured him out. Form II (فَعَّلَ) has a doubled middle letter and adds care and thoroughness. هُ is “him”.' },
      ],
      quiz: { word: 4, q: 'What does the doubled دّ in قَدَّرَهُ add?', options: ['It makes it passive', 'It makes it present tense', 'Care and thoroughness: He measured him exactly'], answer: 2, why: 'Form II often adds intensity. قَدَرَ is to have power; قَدَّرَ is to measure out with care.' },
    },
    20: {
      words: [
        { role: 'Then', say: 'ثُمَّ adds a new stage after a gap in time.' },
        { role: 'Object of an unspoken verb', say: 'The way. It is accusative. al-Jadwal reads an unspoken verb before it that يَسَّرَهُ explains: “the way, He made it easy”.' },
        { role: 'Verb, past, Form II, plus “it”', say: 'He made it easy. Form II doubles the middle letter. The ending هُ points back to ٱلسَّبِيل.' },
      ],
      quiz: { word: 1, q: 'Why is ٱلسَّبِيلَ accusative?', options: ['It is the object of an unspoken verb that يَسَّرَهُ explains', 'It follows a preposition', 'It is the doer of يَسَّرَ'], answer: 0, why: 'al-Jadwal reads ishtighāl: the noun is the object of an unspoken verb, and the verb written after it explains that verb.' },
    },
    21: {
      words: [
        { role: 'Then', say: 'ثُمَّ marks the next stage after a gap in time.' },
        { role: 'Verb, past, Form IV, plus “him”', say: 'He caused him to die. Form IV (أَفْعَلَ) makes someone die. The long ā comes from the middle و of the root. هُ is “him”.' },
        { role: 'And right after', say: 'فَ joins the next verb and shows that it follows at once.' },
        { role: 'Verb, past, Form IV, plus “him”', say: 'He gave him a grave. Form IV here means “to provide with ...”, from the noun قَبْر, a grave.' },
      ],
      quiz: { word: 1, q: 'What does Form IV add to مَاتَ in أَمَاتَهُ?', options: ['It means he died again', 'It makes it a cause: He made him die', 'It makes it passive'], answer: 1, why: 'Form IV (أَفْعَلَ) makes the doer cause the action. مَاتَ is “he died”; أَمَاتَ is “he made him die”.' },
    },
    22: {
      words: [
        { role: 'Then', say: 'ثُمَّ opens the last stage of the story of man.' },
        { role: 'Time word, “when”', say: 'It has a conditional sense but does not change the verb after it. The clause شَآءَ belongs to it: it is its muḍāf ilayhi.' },
        { role: 'Verb, past, after idhā', say: 'He wills. It is past in form but points to the future. Because إِذَا owns this clause, it sits in the genitive place.' },
        { role: 'Verb, past, the answer, plus “him”', say: 'He raises him. It is the answer to إِذَا and needs no فَ. Form IV of نَشَرَ, “to spread”. هُ is “him”.' },
      ],
      quiz: { word: 2, q: 'What is the clause شَآءَ to إِذَا?', options: ['Its answer', 'Its subject', 'Its muḍāf ilayhi (the clause that إِذَا owns)'], answer: 2, why: 'al-Jadwal says the clause after إِذَا stands in the genitive place as its muḍāf ilayhi. The answer is أَنشَرَهُ.' },
    },
    23: {
      words: [
        { role: 'Rebuke', say: 'No! A particle of rebuke and warning. It tells man that what he does is wrong.' },
        { role: 'Negation “not yet”', say: 'It puts the verb in the jussive and says that something has not happened up to now.' },
        { role: 'Verb, present, jussive', say: 'He has carried out. The last ي has dropped. For this verb, the jussive removes the weak letter.' },
        { role: 'Relative pronoun, object', say: 'What. It is the object of يَقْضِ. A word that should return to it, “to do”, is left out: “what He ordered him to do”.' },
        { role: 'Verb, past, relative clause, plus “him”', say: 'He ordered him. This clause completes مَا. The ending هُ is “him”, the human.' },
      ],
      quiz: { word: 2, q: 'Why is the last ي missing from يَقْضِ?', options: ['The jussive after لَمَّا drops it', 'It is a past verb', 'It is a command'], answer: 0, why: 'لَمَّا puts the present verb in the jussive. A verb that ends in a weak letter loses that letter in the jussive.' },
    },
    24: {
      words: [
        { role: 'Fa that opens a sentence', say: 'It starts a new sentence: “so let man look ...”. al-Jadwal also allows it to answer an unspoken condition.' },
        { role: 'Lām of command', say: 'It means “let”. It puts the verb in the jussive.' },
        { role: 'Verb, present, jussive', say: 'Let him look. The jussive removes the ḍamma. The kasra on ر is only there because the next word starts with ٱل.' },
        { role: 'Doer (fāʿil)', say: 'Man. He is the one who looks, so he is nominative.' },
        { role: 'Preposition', say: 'To, at. The phrase إِلَىٰ طَعَامِهِ belongs to يَنظُرِ.' },
        { role: 'After a preposition', say: 'His food. Genitive after إِلَىٰ. The ending هِ is “his” and points back to man. Verse 25 says which part of his food: it is a badal.' },
      ],
      quiz: { word: 1, q: 'What does لْ do in فَلْيَنظُرِ?', options: ['It means “not”', 'It means “let” and puts the verb in the jussive', 'It makes the verb past'], answer: 1, why: 'This is the lām of command. It gives a command to a third person, and the verb after it is jussive.' },
    },
    25: {
      words: [
        { role: 'أَنَّ + “we”', say: 'That We. أَنَّ puts the pronoun نَا in the accusative. al-Jadwal reads the whole أَنَّ clause as a badal from طَعَامِهِ in verse 24: it says what to look at.' },
        { role: 'Verb, past, predicate of anna', say: 'We poured. The ending نَا is “we”. This whole clause is the predicate of أَنَّ.' },
        { role: 'Object', say: 'The water. Accusative, because it is what We poured.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'A pouring. It repeats the root of the verb to make the action stronger. It is accusative with tanwin.' },
      ],
      quiz: { word: 3, q: 'What does صَبًّا add to the sentence?', options: ['It tells where the water went', 'It tells when it fell', 'It repeats the action of the verb to strengthen it'], answer: 2, why: 'A mafʿūl muṭlaq is a verbal noun of the same root as the verb. It is accusative and stresses the action.' },
    },
    26: {
      words: [
        { role: 'Then', say: 'ثُمَّ joins شَقَقْنَا to صَبَبْنَا: the second step comes after the first.' },
        { role: 'Verb, past', say: 'We split. The doubled ق is written as two letters because نَا follows. This clause is joined to the clause of verse 25, so it is part of the same أَنَّ clause.' },
        { role: 'Object', say: 'The earth. Accusative, because it is what We split.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'A splitting. It repeats the root of the verb for emphasis, like صَبًّا in the verse before.' },
      ],
      quiz: { word: 3, q: 'What kind of word is شَقًّا here?', options: ['A repeated action word (mafʿūl muṭlaq) that strengthens the verb', 'The doer of the verb', 'A word of place'], answer: 0, why: 'شَقًّا comes from the same root as شَقَقْنَا and is accusative. It stresses the action.' },
    },
    27: {
      words: [
        { role: 'And then', say: 'فَ joins this verb to the one before and shows that the growing follows the splitting.' },
        { role: 'Verb, past, Form IV', say: 'We made grow. Form IV (أَفْعَلَ) makes something grow. The ت is a root letter, and نَا is “we”. Its objects run on to verse 31.' },
        { role: 'Preposition + “it”', say: 'In it, meaning in the earth. The phrase belongs to أَنۢبَتْنَا.' },
        { role: 'Object', say: 'Grain. Accusative with tanwin. It is the first of the things We made grow.' },
      ],
      quiz: { word: 3, q: 'Which verb governs حَبًّا and the accusative words up to verse 31?', options: ['صَبَبْنَا', 'أَنۢبَتْنَا', 'شَقَقْنَا'], answer: 1, why: 'أَنۢبَتْنَا is the verb whose objects are grain, grapes, herbage, olives, palms, gardens, fruit and grass.' },
    },
    28: {
      words: [
        { role: 'And', say: 'وَ joins the next object to the ones before it.' },
        { role: 'Object, joined', say: 'Grapes. Accusative with tanwin, because it is joined to حَبًّا, an object of أَنۢبَتْنَا.' },
        { role: 'And', say: 'وَ joins the next object to عِنَبًا.' },
        { role: 'Object, joined', say: 'Fresh plants that are cut as food for animals. Accusative with tanwin, joined to the same objects.' },
      ],
      quiz: { word: 1, q: 'Why is عِنَبًا accusative?', options: ['It follows a preposition', 'It is the doer', 'It is joined to حَبًّا, an object of أَنۢبَتْنَا'], answer: 2, why: 'وَ joins nouns of the same case. حَبًّا is an object of أَنۢبَتْنَا, so عِنَبًا is also accusative.' },
    },
    29: {
      words: [
        { role: 'And', say: 'وَ joins the next object to the ones before it.' },
        { role: 'Object, joined', say: 'Olives. Accusative with tanwin, joined to the objects of أَنۢبَتْنَا.' },
        { role: 'And', say: 'وَ joins the next object to زَيْتُونًا.' },
        { role: 'Object, joined', say: 'Palm trees. Accusative with tanwin, joined to the same objects.' },
      ],
      quiz: { word: 3, q: 'Which verb governs نَخْلًا?', options: ['أَنۢبَتْنَا in verse 27', 'شَقَقْنَا in verse 26', 'صَبَبْنَا in verse 25'], answer: 0, why: 'There is no new verb in verses 28-31. Every noun is joined to the objects of أَنۢبَتْنَا.' },
    },
    30: {
      words: [
        { role: 'And', say: 'وَ joins the next object to the ones before it.' },
        { role: 'Object, joined', say: 'Gardens. Accusative, but it has fatḥa and no tanwin: a word on the pattern فَعَائِل never takes tanwin.' },
        { role: 'Adjective (naʿt)', say: 'Thick, dense. It describes حَدَائِقَ, so it is accusative with tanwin. al-Jadwal glosses it as a name for thick, tangled trees; here it is read as an adjective of the gardens.' },
      ],
      quiz: { word: 1, q: 'Why does حَدَآئِقَ end in fatḥa with no tanwin?', options: ['It is a dual', 'Words of this plural pattern never take tanwin', 'It is a verb'], answer: 1, why: 'حَدَائِق is a broken plural of the pattern فَعَائِل. This pattern is diptote: no tanwin, and fatḥa instead of kasra in the genitive.' },
    },
    31: {
      words: [
        { role: 'And', say: 'وَ joins the next object to the ones before it.' },
        { role: 'Object, joined', say: 'Fruit. Accusative with tanwin, joined to the objects of أَنۢبَتْنَا.' },
        { role: 'And', say: 'وَ joins the last object to فَـٰكِهَةً.' },
        { role: 'Object, joined', say: 'Herbage. al-Jadwal glosses it as dry herbage (some say straw). It is accusative with tanwin, the last of the eight things in the list.' },
      ],
      quiz: { word: 3, q: 'What is the case of أَبًّا, and why?', options: ['Genitive, after a preposition', 'Nominative, because it is the doer', 'Accusative, because it is joined to the objects of أَنۢبَتْنَا'], answer: 2, why: 'The list in verses 27-31 has no new verb. Each noun, including أَبًّا, is joined to the objects of أَنۢبَتْنَا.' },
    },
    32: {
      words: [
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'As an enjoyment. al-Jadwal reads an unspoken verb: “He gave you enjoyment of all that, as an enjoyment”. It is accusative with tanwin.' },
        { role: 'Preposition + “you”', say: 'For you. The phrase belongs to مَتَاعًا. The ending كُمْ is “you” (plural).' },
        { role: 'And', say: 'وَ joins the next phrase to لَكُمْ.' },
        { role: 'Preposition', say: 'For. It makes the noun after it genitive.' },
        { role: 'After a preposition', say: 'Your livestock. Genitive after لِ. The ending كُمْ is “your”.' },
      ],
      quiz: { word: 0, q: 'How does al-Jadwal read مَّتَاعًا?', options: ['As a mafʿūl muṭlaq of an unspoken verb: “He gave you enjoyment”', 'As a state (ḥāl) of the crops', 'As the doer of أَنۢبَتْنَا'], answer: 0, why: 'al-Jadwal supplies a verb like “He gave you enjoyment of that”, and مَتَاعًا repeats its meaning as a mafʿūl muṭlaq.' },
    },
    33: {
      words: [
        { role: 'Fa that opens a sentence', say: 'It starts a new part of the surah. It does not mean “because”.' },
        { role: 'Time word, “when”', say: 'It has a conditional sense. The clause after it belongs to it (muḍāf ilayhi). Its answer is not spoken; al-Jadwal supplies “every person will be busy with himself”.' },
        { role: 'Verb, past, feminine', say: 'It comes. The final تِ is feminine, because the doer is feminine, and it has a kasra because the next word starts with ٱل.' },
        { role: 'Doer (fāʿil)', say: 'The Deafening Blast. Nominative as the doer. It is feminine, so the verb is feminine too.' },
      ],
      quiz: { word: 1, q: 'What is the answer to إِذَا in this verse?', options: ['The next verb, يَفِرُّ', 'It is not spoken: it is understood from the next verses', 'جَآءَتِ'], answer: 1, why: 'al-Jadwal says the answer is left out. The words in verses 34-37 describe the time and say what fills it.' },
    },
    34: {
      words: [
        { role: 'Time word, badal from idhā', say: 'On the day. It is accusative as a word of time. al-Jadwal reads it as a badal from إِذَا: it names the same time again. It owns the clause that follows.' },
        { role: 'Verb, present', say: 'He flees. The ḍamma shows that it is indicative. The two ر are written as one letter with a shadda.' },
        { role: 'Doer (fāʿil)', say: 'The person. Nominative as the doer.' },
        { role: 'Preposition', say: 'From. Its phrase belongs to يَفِرُّ, and the same مِنْ reaches the next verses.' },
        { role: 'After a preposition', say: 'His brother. Genitive: the long ـي is its genitive sign, as with the five nouns أَب, أَخ and so on. هِ is “his”.' },
      ],
      quiz: { word: 4, q: 'What shows that أَخِيهِ is genitive?', options: ['A ḍamma on the last letter', 'A fatḥa on the last letter', 'The long ـي after the خ'], answer: 2, why: 'The five nouns (أَبٌ, أَخٌ ...) show their case with long vowels when they own something: ـُو, ـَا, ـِي.' },
    },
    35: {
      words: [
        { role: 'And', say: 'وَ joins the next noun to أَخِيهِ.' },
        { role: 'After a preposition, joined', say: 'His mother. Genitive, because it is joined to أَخِيهِ, which comes after مِنْ.' },
        { role: 'And', say: 'وَ joins the next noun to the ones before.' },
        { role: 'After a preposition, joined', say: 'His father. Genitive, joined to the same list. The long ـي is again the genitive sign of one of the five nouns.' },
      ],
      quiz: { word: 1, q: 'Why is أُمِّهِ genitive?', options: ['It is joined to أَخِيهِ, which comes after مِنْ', 'It is the doer', 'It is the object of يَفِرُّ'], answer: 0, why: 'وَ joins nouns of the same case. أَخِيهِ is genitive after مِنْ, so the nouns joined to it are genitive too.' },
    },
    36: {
      words: [
        { role: 'And', say: 'وَ joins the next noun to the list.' },
        { role: 'After a preposition, joined', say: 'His wife (literally, his companion). Genitive, joined to the same list after مِنْ. The ـة turns into ـتِ before the pronoun.' },
        { role: 'And', say: 'وَ joins the last noun to the list.' },
        { role: 'After a preposition, joined', say: 'His sons. Genitive. It is declined like a sound masculine plural, بَنُونَ in the nominative; the ن drops before the pronoun, which leaves بَنِي.' },
      ],
      quiz: { word: 3, q: 'Why does بَنِيهِ have no ن at the end of the plural?', options: ['It is feminine', 'The ن drops when the word owns the pronoun هِ', 'It is a verb'], answer: 1, why: 'When a plural like بَنِينَ owns something, it loses its ن: بَنِي + هِ.' },
    },
    37: {
      words: [
        { role: 'Preposition', say: 'For. The phrase لِكُلِّ ٱمْرِئٍ is the predicate and is placed first.' },
        { role: 'After a preposition, first part of a possession', say: 'Every. Genitive after لِ. It owns ٱمْرِئٍ, so it has no tanwin.' },
        { role: 'Second part of a possession', say: 'A person. Genitive with tanwin kasra, because كُلِّ owns it.' },
        { role: 'Phrase describing “person”', say: 'Among them. It tells which person: one of them. It belongs to ٱمْرِئٍ.' },
        { role: 'Time word', say: 'That day. The tanwin takes the place of a sentence that is left out. al-Jadwal: accusative or built (mabnī). It belongs to the same hidden word as لِكُلِّ.' },
        { role: 'Subject, placed last', say: 'A matter, a concern. Nominative: it is the subject, and it comes after its predicate لِكُلِّ.' },
        { role: 'Verb, present, plus “him”', say: 'It keeps him busy. Form IV. The ending هُ is “him”. This clause describes شَأْنٌ (an adjective clause), so it needs no relative pronoun.' },
      ],
      quiz: { word: 5, q: 'Why is شَأْنٌ nominative?', options: ['It follows a preposition', 'It is the object of يُغْنِي', 'It is the subject, placed after its predicate لِكُلِّ ٱمْرِئٍ'], answer: 2, why: 'The predicate (لِكُلِّ ٱمْرِئٍ) comes first and the subject comes last. A subject is nominative.' },
    },
    38: {
      words: [
        { role: 'Subject (mubtadaʾ)', say: 'Faces. It is indefinite, but it can start the sentence because it is described by مُسْفِرَةٌ. It is nominative.' },
        { role: 'Time word', say: 'That day. It belongs to the predicate ضَاحِكَةٌ in the next verse.' },
        { role: 'Adjective (naʿt)', say: 'Bright. al-Jadwal reads it as an adjective of وُجُوهٌ, not as the predicate. It has the feminine singular form, as plurals of things do. It is a Form IV participle.' },
      ],
      quiz: { word: 2, q: 'How does al-Jadwal read مُّسْفِرَةٌ?', options: ['As an adjective of وُجُوهٌ', 'As the predicate of وُجُوهٌ', 'As a time word'], answer: 0, why: 'al-Jadwal calls it a naʿt of وُجُوهٌ. That is why an indefinite noun can open the sentence. The predicate is ضَاحِكَةٌ in verse 39.' },
    },
    39: {
      words: [
        { role: 'Predicate (khabar)', say: 'Laughing. It is the predicate of وُجُوهٌ in verse 38. It is a participle of ضَحِكَ. It is nominative with tanwin.' },
        { role: 'Second predicate (khabar)', say: 'Rejoicing at good news. It follows ضَاحِكَةٌ as a second predicate. It is a Form X participle: taking in good news with joy.' },
      ],
      quiz: { word: 0, q: 'What is ضَاحِكَةٌ to وُجُوهٌ?', options: ['Its adjective', 'Its predicate (khabar)', 'Its object'], answer: 1, why: 'al-Jadwal makes مُسْفِرَةٌ the adjective and ضَاحِكَةٌ the predicate of وُجُوهٌ.' },
    },
    40: {
      words: [
        { role: 'And', say: 'وَ joins this second group of faces to the first.' },
        { role: 'Subject (mubtadaʾ)', say: 'Faces. It is indefinite, yet it can start the sentence because the clause عَلَيْهَا غَبَرَةٌ describes it.' },
        { role: 'Time word', say: 'That day.' },
        { role: 'Predicate placed first', say: 'On them. It is the predicate of غَبَرَةٌ and comes first: “on them is dust”. The ending هَا is “them”, the faces.' },
        { role: 'Subject, placed last', say: 'Dust. Nominative: it is the subject and comes after its predicate عَلَيْهَا. The clause عَلَيْهَا غَبَرَةٌ describes the faces.' },
      ],
      quiz: { word: 4, q: 'Why is غَبَرَةٌ nominative?', options: ['It is the object of a verb', 'It follows a preposition', 'It is the subject, placed after the predicate عَلَيْهَا'], answer: 2, why: 'The phrase عَلَيْهَا is the predicate and comes first. The subject, غَبَرَةٌ, comes last and is nominative.' },
    },
    41: {
      words: [
        { role: 'Verb, present, plus “them”', say: 'It covers them. تَـ is feminine because the doer is feminine. هَا is “them”, the faces. This clause is the predicate of وُجُوهٌ in verse 40.' },
        { role: 'Doer (fāʿil)', say: 'Gloom, darkness. Nominative as the doer. It is feminine, so the verb is feminine.' },
      ],
      quiz: { word: 0, q: 'What is the clause تَرْهَقُهَا قَتَرَةٌ to وُجُوهٌ in verse 40?', options: ['Its predicate (khabar)', 'Its adjective', 'Its time word'], answer: 0, why: 'al-Jadwal reads عَلَيْهَا غَبَرَةٌ as the adjective of وُجُوهٌ and تَرْهَقُهَا قَتَرَةٌ as its predicate.' },
    },
    42: {
      words: [
        { role: 'Subject (mubtadaʾ)', say: 'Those. A plural “that” for people far away. It starts the sentence and never changes its ending.' },
        { role: 'Separating pronoun (ḍamīr al-faṣl)', say: 'They. It stands between the subject and the predicate, shows that a predicate follows, and adds emphasis. al-Jadwal calls it ḍamīr faṣl.' },
        { role: 'Predicate (khabar)', say: 'The disbelievers. Nominative. A broken plural of كَافِر.' },
        { role: 'Second predicate (khabar)', say: 'The wicked. Nominative, like the word before. A broken plural of فَاجِر. It could also be read as an adjective of ٱلْكَفَرَةُ.' },
      ],
      quiz: { word: 1, q: 'What does هُمُ do here?', options: ['It is the subject', 'It separates subject from predicate and adds emphasis', 'It is an object pronoun'], answer: 1, why: 'A pronoun in this place is a ḍamīr al-faṣl. It marks the next word as a predicate and strengthens the sentence.' },
    },
  },
};
