// Plain-English teaching layer for Surah 81, At-Takwir. Same shape and rules as in surah-study.ts.
//
// Drafted 2026-10-29. Every line follows the parse in the surah’s file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Where al-Jadwal gives more than one reading, the line says which one it follows. Someone
// who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from '../surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Time word (ẓarf)', say: 'It means “when” and looks ahead to the future. al-Jadwal reads it as an adverb of time tied to the answer in verse 14 (عَلِمَتْ). It never changes its ending. The sentence after it is its second part (muḍāf ilayhi).' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'al-Jadwal does not call it a mubtadaʾ. It is the doer of a verb that is left out, for example انطوت (“folded up”), and the next word explains that verb. It is nominative with ḍamma.' },
        { role: 'Passive verb that explains', say: 'A Form II passive verb (فُعِّلَ): the one who wrapped the sun up is not named. It explains the left-out verb, so its clause has no place in the grammar. The ـتْ is feminine, to match الشَّمْسُ.' },
      ],
      quiz: { word: 1, q: 'How does al-Jadwal parse الشَّمْسُ?', options: ['Subject (mubtadaʾ), with كُوِّرَتْ as its khabar', 'Doer (fāʿil) of an unspoken verb that كُوِّرَتْ explains', 'Object of كُوِّرَتْ'], answer: 1, why: 'al-Jadwal says a noun after إِذَا is the doer of a verb that is left out, and the verb that follows only explains it. So الشَّمْسُ is not a mubtadaʾ.' },
    },
    2: {
      words: [
        { role: 'Joining wa', say: 'It joins this إِذَا clause to the one in verse 1, so the whole chain waits for the same answer in verse 14.' },
        { role: 'Time word (ẓarf)', say: 'The same “when” as in verse 1. The sentence after it is again its second part.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'Same reading as الشَّمْسُ in verse 1: the doer of a verb that is left out. It is nominative with ḍamma. It is a plural of things.' },
        { role: 'Verb, Form VII', say: 'Form VII (اِنْفَعَلَ) means the thing happened by itself, so it is not passive. It explains the left-out verb. The ـتْ is feminine singular, because a plural of things takes a feminine singular verb.' },
      ],
      quiz: { word: 3, q: 'Why does انكَدَرَتْ end in a feminine singular ـتْ, when النُّجُومُ is plural?', options: ['A plural of things takes a feminine singular verb', 'Because the verb is dual', 'Because the stars are women'], answer: 0, why: 'In Arabic a broken plural of things is treated as feminine singular. The verb takes the single ـتْ.' },
    },
    3: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the earlier إِذَا clauses.' },
        { role: 'Time word (ẓarf)', say: 'It means “when” and is tied to the answer in verse 14. The sentence after it is its second part.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'The doer of a verb that is left out. al-Jadwal suggests انتثرت (“scattered”). It is nominative with ḍamma.' },
        { role: 'Verb, passive, Form II', say: 'The passive of سَيَّرَ (“make travel”). The shadda is Form II. Someone makes the mountains move, and he is not named. It explains the left-out verb.' },
      ],
      quiz: { word: 3, q: 'What does the shadda in سُيِّرَتْ show?', options: ['The verb is a command', 'The verb is dual', 'It is Form II, which adds the sense of making it happen'], answer: 2, why: 'Form II (فَعَّلَ) often means “cause to do”. سَيَّرَ is “make something travel”, and the passive says the mountains were made to move.' },
    },
    4: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the earlier إِذَا clauses.' },
        { role: 'Time word (ẓarf)', say: 'It means “when” and is tied to the answer in verse 14. The sentence after it is its second part.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'The doer of a verb that is left out. al-Jadwal suggests سرحت وحدها (“went free on their own”). It is the plural of عُشَرَاء, a she-camel about to give birth. Nominative with ḍamma.' },
        { role: 'Verb, passive, Form II', say: 'The passive of عَطَّلَ (“leave idle”). Someone leaves the camels idle, and he is not named. It explains the left-out verb.' },
      ],
      quiz: { word: 1, q: 'In وَإِذَا الْعِشَارُ عُطِّلَتْ, what is the muḍāf ilayhi of إِذَا?', options: ['Only the word الْعِشَارُ', 'The sentence with the left-out verb, which عُطِّلَتْ explains', 'The answer in verse 14'], answer: 1, why: 'al-Jadwal says the sentence after إِذَا is its muḍāf ilayhi. The answer in verse 14 is the word that إِذَا is tied to, not its second part.' },
    },
    5: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the earlier إِذَا clauses.' },
        { role: 'Time word (ẓarf)', say: 'It means “when” and is tied to the answer in verse 14. The sentence after it is its second part.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'The doer of a verb that is left out. al-Jadwal suggests اجتمعت (“gathered”). It is the plural of وَحْش, a wild animal. Nominative with ḍamma.' },
        { role: 'Verb, passive, Form I', say: 'The passive of حَشَرَ (“gather”). The vowels change from حَشَرَ to حُشِرَ, so the one who gathers is not named. It explains the left-out verb.' },
      ],
      quiz: { word: 3, q: 'How is حُشِرَتْ made passive?', options: ['By adding a prefix أَ', 'By doubling the middle letter', 'By changing the vowels: ḍamma on the first letter and kasra on the second'], answer: 2, why: 'In Form I the passive only changes the vowels: حَشَرَ becomes حُشِرَ. Nothing is added.' },
    },
    6: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the earlier إِذَا clauses.' },
        { role: 'Time word (ẓarf)', say: 'It means “when” and is tied to the answer in verse 14. The sentence after it is its second part.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'The doer of a verb that is left out. al-Jadwal suggests اختلطت أو امتلأت (“mixed together or filled”). It is the plural of بَحْر. Nominative with ḍamma.' },
        { role: 'Verb, passive, Form II', say: 'The passive of سَجَّرَ. The shadda adds force. Someone sets the seas ablaze, and he is not named. It explains the left-out verb.' },
      ],
      quiz: { word: 3, q: 'What does the clause سُجِّرَتْ do in this verse?', options: ['It explains the left-out verb and has no place in the grammar', 'It is the khabar of الْبِحَارُ', 'It is the answer to the condition'], answer: 0, why: 'al-Jadwal calls it an explaining clause (tafsīriyya). The answer to the whole chain only comes in verse 14.' },
    },
    7: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the earlier إِذَا clauses.' },
        { role: 'Time word (ẓarf)', say: 'It means “when” and is tied to the answer in verse 14. The sentence after it is its second part.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'The doer of a verb that is left out. al-Jadwal suggests اقترنت (“were joined together”). It is the plural of نَفْس, “soul”. Nominative with ḍamma.' },
        { role: 'Verb, passive, Form II', say: 'The passive of زَوَّجَ (“pair, join”). The one who pairs the souls is not named. It explains the left-out verb.' },
      ],
      quiz: { word: 2, q: 'What case is النُّفُوسُ, and why?', options: ['Accusative, because it is an object', 'Nominative, because it is the doer of the left-out verb', 'Genitive, because it comes after إِذَا'], answer: 1, why: 'al-Jadwal makes it the fāʿil of an unspoken verb, and a fāʿil is nominative. The genitive of إِذَا falls on the whole sentence, not on this word.' },
    },
    8: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the earlier إِذَا clauses.' },
        { role: 'Time word (ẓarf)', say: 'It means “when” and is tied to the answer in verse 14. The sentence after it is its second part.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'The doer of a verb that is left out. al-Jadwal suggests تظلّمت (“complained of being wronged”). It is a passive participle of وَأَدَ (“bury alive”) with the feminine ـة: the girl who was buried alive. Nominative with ḍamma.' },
        { role: 'Verb, passive', say: 'The passive of سَأَلَ: she is the one who is asked. It explains the left-out verb. What she is asked comes in verse 9.' },
      ],
      quiz: { word: 2, q: 'What kind of word is الْمَوْءُودَةُ?', options: ['A past verb', 'An active participle: the one who buries', 'A passive participle: the girl who was buried alive'], answer: 2, why: 'It is the passive participle of وَأَدَ on the pattern مَفْعُول, with the feminine ـة. al-Jadwal says it names the girl who is buried alive.' },
    },
    9: {
      words: [
        { role: 'Preposition of reason', say: 'It means “because of”. al-Jadwal says it is tied to قُتِلَتْ. It puts the next word in the genitive.' },
        { role: 'Question word, after a preposition', say: 'Genitive with kasra after بِ. It is the first part of a possession, and ذَنبٍ is the second part. A question word stands at the start of its clause.' },
        { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because أَيِّ owns it. It is the muḍāf ilayhi of أَيِّ, not the object of بِ.' },
        { role: 'Verb, passive', say: 'The passive of قَتَلَ. The hidden “she” stands in the doer’s place (nāʾib fāʿil) and is the girl of verse 8. al-Jadwal reads the whole clause as what she is asked about, with an unspoken عَنْ (“about”).' },
      ],
      quiz: { word: 2, q: 'Why is ذَنبٍ genitive?', options: ['It is the second part of a possession: the muḍāf ilayhi of أَيِّ', 'It is the object of the verb قُتِلَتْ', 'It is an adjective of أَيِّ'], answer: 0, why: 'أَيِّ is the first part and ذَنبٍ the second, so ذَنبٍ is genitive. أَيِّ itself is genitive because of بِ.' },
    },
    10: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the earlier إِذَا clauses and picks the chain up again after verse 9.' },
        { role: 'Time word (ẓarf)', say: 'It means “when” and is tied to the answer in verse 14. The sentence after it is its second part.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'The doer of a verb that is left out. al-Jadwal suggests ظهرت (“appeared”). It is the plural of صَحِيفَة, “page”. Nominative with ḍamma.' },
        { role: 'Verb, passive, Form I', say: 'The passive of نَشَرَ (“spread open”). The one who opens the pages is not named. It explains the left-out verb.' },
      ],
      quiz: { word: 0, q: 'What does the وَ at the start of verse 10 do?', options: ['It begins an oath', 'It joins this إِذَا clause to the earlier ones, which all wait for the answer in verse 14', 'It means “because”'], answer: 1, why: 'The chain of إِذَا clauses is joined by wa. Verse 9 is a question that belongs to verse 8, and the chain goes on.' },
    },
    11: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the earlier إِذَا clauses.' },
        { role: 'Time word (ẓarf)', say: 'It means “when” and is tied to the answer in verse 14. The sentence after it is its second part.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'The doer of a verb that is left out. al-Jadwal suggests زالت (“went away”). It is nominative with ḍamma.' },
        { role: 'Verb, passive, Form I', say: 'The passive of كَشَطَ (“strip off, peel”). The one who strips the sky is not named. It explains the left-out verb.' },
      ],
      quiz: { word: 3, q: 'What is the clause كُشِطَتْ in this verse?', options: ['The answer to the condition', 'The khabar of السَّمَاءُ', 'An explaining clause (tafsīriyya) with no place in the grammar'], answer: 2, why: 'al-Jadwal says the passive verbs in these clauses only explain the left-out verbs. They are not khabars, and they are not the answer.' },
    },
    12: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the earlier إِذَا clauses.' },
        { role: 'Time word (ẓarf)', say: 'It means “when” and is tied to the answer in verse 14. The sentence after it is its second part.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'The doer of a verb that is left out. al-Jadwal suggests اشتعلت (“blazed up”). It names the fire of Hell and is nominative with ḍamma.' },
        { role: 'Verb, passive, Form II', say: 'The passive of سَعَّرَ (“kindle”). The shadda adds force. The one who kindles the fire is not named. It explains the left-out verb.' },
      ],
      quiz: { word: 2, q: 'In وَإِذَا الْجَحِيمُ سُعِّرَتْ, what is the job of الْجَحِيمُ?', options: ['Doer (fāʿil) of an unspoken verb', 'Object of سُعِّرَتْ', 'Adjective of إِذَا'], answer: 0, why: 'Same as every noun in the chain: the doer of a verb that is left out, which the next word explains.' },
    },
    13: {
      words: [
        { role: 'Joining wa', say: 'It joins this last clause to the earlier إِذَا clauses.' },
        { role: 'Time word (ẓarf)', say: 'It means “when” and is tied to the answer in verse 14. The sentence after it is its second part.' },
        { role: 'Subject (fāʿil) of an unspoken verb', say: 'The doer of a verb that is left out. al-Jadwal suggests قربت (“came near”). It is nominative with ḍamma.' },
        { role: 'Verb, passive, Form IV', say: 'The passive of أَزْلَفَ (“bring near”). The pattern is أُفْعِلَ: ḍamma on the prefix hamza and kasra on the second root letter. The one who brings Paradise near is not named.' },
      ],
      quiz: { word: 3, q: 'Which form is أُزْلِفَتْ?', options: ['Form II passive', 'Form IV passive', 'Form I passive'], answer: 1, why: 'It has the prefix hamza of Form IV (أَفْعَلَ), with the passive vowels: ḍamma on the hamza, kasra on the second root letter.' },
    },
    14: {
      words: [
        { role: 'Verb, past: the answer (jawāb)', say: 'This is the answer to all twelve إِذَا clauses. It is a past verb with a future meaning. al-Jadwal says its clause has no place in the grammar. The ـتْ is feminine, to match نَفْسٌ.' },
        { role: 'Doer (fāʿil)', say: 'Nominative with tanwin ḍamma. It has no al-, so it means any soul at all. al-Jadwal notes that the indefinite noun spreads the knowing to every soul.' },
        { role: 'Relative pronoun, object', say: 'It means “what”. It is the object of عَلِمَتْ (accusative in place). A relative clause follows, and the pronoun that returns to it is left out: أَحْضَرَتْهُ.' },
        { role: 'Verb of the relative clause', say: 'Form IV past (أَفْعَلَ): “she made it present, she brought it”. This clause is the ṣila of مَا and has no place in the grammar. The hidden “she” is the soul.' },
      ],
      quiz: { word: 2, q: 'What is مَا in عَلِمَتْ نَفْسٌ مَا أَحْضَرَتْ?', options: ['A negative “not”', 'A question word “what?”', 'A relative pronoun: the object of عَلِمَتْ'], answer: 2, why: 'al-Jadwal calls it a relative pronoun in the accusative position, with the returning pronoun left out. The clause أَحْضَرَتْ is its ṣila.' },
    },
    15: {
      words: [
        { role: 'Fa that opens a new sentence', say: 'al-Jadwal says this فَ opens a new sentence (istiʾnāf). It does not mean “because” or “so”.' },
        { role: 'Extra particle (zāʾida)', say: 'It does not say “no” here. al-Jadwal calls it extra, and it adds weight to the oath.' },
        { role: 'Verb, present, Form IV', say: 'It means “I swear”. It is indicative, with ḍamma, because nothing makes it subjunctive or jussive. The “I” is hidden inside.' },
        { role: 'Preposition', say: 'It means “by” and begins the thing sworn by. Its phrase is tied to أُقْسِمُ.' },
        { role: 'After a preposition', say: 'Genitive with kasra after بِ. It is the plural of خَانِس (“one that falls back”). al-Jadwal says it names the planets other than the moon.' },
      ],
      quiz: { word: 1, q: 'What does the لَا in فَلَا أُقْسِمُ do?', options: ['It is extra and adds emphasis to the oath', 'It cancels the oath', 'It makes the verb a command'], answer: 0, why: 'al-Jadwal calls this لَا extra (zāʾida). The speaker really does swear.' },
    },
    16: {
      words: [
        { role: 'Substitute (badal) of الْخُنَّسِ', say: 'al-Jadwal reads it as a badal of الْخُنَّسِ in verse 15: it stands in its place and names the same things. It is genitive, but the final ي is dropped, so the kasra is understood on the missing letter. It means “the ones that run”.' },
        { role: 'Adjective (naʿt) of الْجَوَارِ', say: 'It describes الْجَوَارِ, so it copies its genitive case. It means “the ones that go out of sight in their place”, and it has the same derivation as الْخُنَّسِ.' },
      ],
      quiz: { word: 0, q: 'How does al-Jadwal parse الْجَوَارِ?', options: ['Adjective of الْخُنَّسِ', 'Badal of الْخُنَّسِ', 'Subject of a new sentence'], answer: 1, why: 'al-Jadwal says الْجَوَارِ is a badal of الْخُنَّسِ, and that الْكُنَّسِ is the adjective of الْجَوَارِ.' },
    },
    17: {
      words: [
        { role: 'Joining wa', say: 'al-Jadwal says it joins اللَّيْلِ to الْخُنَّسِ in verse 15. It is not a new oath wa.' },
        { role: 'Joined to the thing sworn by', say: 'Genitive with kasra. The genitive comes from the بِ in verse 15, which reaches this word through the wa.' },
        { role: 'Time word with no condition', say: 'It means “when”. Here it has no condition in it, and it is tied to أُقْسِمُ. The clause after it is its muḍāf ilayhi.' },
        { role: 'Verb, past, four letters', say: 'A rare four-letter verb: the first two root letters are repeated (عَسْ + عَسَ). Many commentators take it as “departed”. Its clause is genitive in place, as the muḍāf ilayhi of إِذَا.' },
      ],
      quiz: { word: 0, q: 'What is the wa in وَاللَّيْلِ إِذَا عَسْعَسَ?', options: ['A wa of oath that governs the genitive by itself', 'A wa of circumstance', 'A wa that joins اللَّيْلِ to الْخُنَّسِ'], answer: 2, why: 'al-Jadwal says the wa is a conjunction in both verse 17 and verse 18. The genitive still comes from the بِ of verse 15.' },
    },
    18: {
      words: [
        { role: 'Joining wa', say: 'Same as in verse 17: it joins الصُّبْحِ to الْخُنَّسِ.' },
        { role: 'Joined to the thing sworn by', say: 'Genitive with kasra, through the بِ of verse 15.' },
        { role: 'Time word with no condition', say: 'It means “when”, tied to أُقْسِمُ. The clause after it is its muḍāf ilayhi. al-Jadwal says this verse is like verse 17.' },
        { role: 'Verb, past, Form V', say: 'Form V (تَفَعَّلَ) with a doubled middle letter: “breathe”. al-Jadwal first reads the picture as a metaphor: the morning breeze is likened to a breath. Its clause is the muḍāf ilayhi of إِذَا.' },
      ],
      quiz: { word: 3, q: 'What is the clause تَنَفَّسَ to إِذَا?', options: ['Its muḍāf ilayhi (genitive in place)', 'Its khabar', 'A circumstance (ḥāl)'], answer: 0, why: 'al-Jadwal says the clause after this إِذَا is genitive in place, as its muḍāf ilayhi. It is not a ḥāl.' },
    },
    19: {
      words: [
        { role: 'Particle that puts its noun in the accusative', say: 'It means “indeed”. It makes the next noun accusative. al-Jadwal says this sentence is the answer to the oath and has no place in the grammar.' },
        { role: 'Noun of إِنَّ (“it”)', say: 'The attached pronoun is the noun of إِنَّ, so it is accusative in place. It points to the Quran.' },
        { role: 'Lam of emphasis', say: 'It sits on the khabar and adds emphasis. al-Jadwal says it stands where an oath lam would stand.' },
        { role: 'Khabar of إِنَّ, first part of a possession', say: 'Nominative with ḍamma. Its second part is رَسُولٍ.' },
        { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because قَوْلُ owns it.' },
        { role: 'Adjective (naʿt)', say: 'It describes رَسُولٍ, so it is genitive, indefinite, masculine, singular, like رَسُولٍ.' },
      ],
      quiz: { word: 3, q: 'What is قَوْلُ in إِنَّهُ لَقَوْلُ رَسُولٍ كَرِيمٍ?', options: ['Noun of إِنَّ', 'Khabar of إِنَّ', 'Object of إِنَّ'], answer: 1, why: 'The attached هُ is the noun of إِنَّ. The word after the lam, قَوْلُ, is the khabar, so it is nominative.' },
    },
    20: {
      words: [
        { role: 'Adjective (naʿt) of رَسُولٍ, first part', say: 'One of the five nouns. It is genitive, so it ends in ي. It describes رَسُولٍ from verse 19, and its second part is قُوَّةٍ.' },
        { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because ذِي owns it. It is a noun of strength.' },
        { role: 'Adverb of place', say: 'It means “with, beside”. It is accusative. al-Jadwal ties it to مَكِينٍ and also allows tying it to a ḥāl from مَكِينٍ. Its second part is ذِي.' },
        { role: 'Second part after عِندَ, first part again', say: 'Genitive, because عِندَ owns it, so this one of the five nouns shows ي again. Its own second part is الْعَرْشِ.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra. “The Throne”.' },
        { role: 'Adjective (naʿt) of رَسُولٍ', say: 'Genitive and indefinite. It describes رَسُولٍ, not الْعَرْشِ. The pattern is فَعِيل.' },
      ],
      quiz: { word: 2, q: 'What does al-Jadwal tie عِندَ to?', options: ['ذِي قُوَّةٍ', 'رَسُولٍ', 'مَكِينٍ'], answer: 2, why: 'al-Jadwal ties the adverb to مَكِينٍ: “secure with the Lord of the Throne”. It also allows a ḥāl from مَكِينٍ.' },
    },
    21: {
      words: [
        { role: 'Adjective (naʿt) of رَسُولٍ', say: 'A passive participle of the Form IV verb أَطَاعَ: “the one who is obeyed”. The pattern is مُفْعَل, and the و became ا. It is genitive, to match رَسُولٍ.' },
        { role: 'Adverb of place', say: 'It means “there”, in heaven. It never changes (mabni on fatha). It is accusative in place and is tied to مُطَاعٍ: “obeyed there”.' },
        { role: 'Adjective (naʿt) of رَسُولٍ', say: 'The pattern is فَعِيل: “trustworthy”. It is genitive and indefinite, like رَسُولٍ.' },
      ],
      quiz: { word: 1, q: 'Which word is ثَمَّ tied to?', options: ['مُطَاعٍ', 'أَمِينٍ', 'رَسُولٍ'], answer: 0, why: 'al-Jadwal ties ثَمَّ to مُطَاعٍ. The meaning is “obeyed there”.' },
    },
    22: {
      words: [
        { role: 'Joining wa', say: 'al-Jadwal says it joins this clause to the answer of the oath in verse 19.' },
        { role: 'Negation working like لَيْسَ', say: 'It means “not”. al-Jadwal says it works like لَيْسَ: its noun is nominative and its khabar is accusative, here accusative in place.' },
        { role: 'Noun of مَا', say: 'صَاحِب (“companion”) with the attached كُمْ (“your”). It is nominative with ḍamma, like the subject of لَيْسَ.' },
        { role: 'Extra preposition', say: 'It adds emphasis and no new meaning. Because of it the khabar is in the genitive.' },
        { role: 'Khabar of مَا', say: 'Genitive with tanwin kasra because of the extra بِ, but accusative in place. It is a passive participle of جَنَّ: the one whom madness has taken.' },
      ],
      quiz: { word: 4, q: 'Why is مَجْنُونٍ genitive?', options: ['It is the second part of a possession', 'The extra بِ puts it in the genitive, although it is the khabar of مَا and accusative in place', 'It is an adjective of صَاحِبُكُم'], answer: 1, why: 'al-Jadwal says it is genitive in form because of the extra بِ, and accusative in place as the khabar of مَا.' },
    },
    23: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the clause in verse 22, which is itself joined to the answer of the oath.' },
        { role: 'Lam of the oath', say: 'The lam that goes with an oath. Together with قَدْ it strengthens the verb.' },
        { role: 'Particle of certainty', say: 'قَدْ before a past verb makes it certain: “he really saw”. It never changes its ending.' },
        { role: 'Verb, past, plus “him”', say: 'Form I past of رَأَى. The doer “he” (the Prophet) is hidden inside. The attached هُ is the object (Gabriel). The final alif of رَأَى is written رَآ before the pronoun.' },
        { role: 'Preposition', say: 'It means “on, in”. al-Jadwal ties بِالْأُفُقِ to a ḥāl from the attached “him”: he saw him while he was on the horizon. It also allows tying it to رَآهُ.' },
        { role: 'After a preposition', say: 'Genitive with kasra after بِ. “The horizon”.' },
        { role: 'Adjective (naʿt)', say: 'It describes الْأُفُقِ, so it is definite and genitive. It is an active participle of Form IV (أَبَانَ): “clear”.' },
      ],
      quiz: { word: 1, q: 'What is the لَ in وَلَقَدْ رَآهُ?', options: ['The lam of command', 'The lam that means “to”', 'The lam of the oath'], answer: 2, why: 'al-Jadwal calls it the lam of the oath. It goes with قَدْ in front of the past verb.' },
    },
    24: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the clause رَآهُ in verse 23. al-Jadwal also allows a wa of circumstance, with the clause as a ḥāl.' },
        { role: 'Negation working like لَيْسَ', say: 'It means “not”. al-Jadwal says it works like لَيْسَ, as in verse 22.' },
        { role: 'Noun of مَا', say: 'The detached “he” is the Prophet. It never changes its form, and in place it is nominative, as the noun of مَا.' },
        { role: 'Preposition', say: 'It means “over, concerning”. Its phrase is tied to ضَنِينٍ.' },
        { role: 'After a preposition', say: 'Genitive with kasra after عَلَى. “The unseen”.' },
        { role: 'Extra preposition', say: 'It adds emphasis and no new meaning. Because of it the khabar is genitive.' },
        { role: 'Khabar of مَا', say: 'A فَعِيل adjective from ضَنَّ (“be stingy with something”). Genitive because of the extra بِ, accusative in place. Some recite ظَنِينٍ (“accused”) here.' },
      ],
      quiz: { word: 5, q: 'What does the بِ in بِضَنِينٍ add?', options: ['Emphasis: it is extra, and ضَنِينٍ is still the khabar of مَا', 'A new meaning, “with”', 'It makes ضَنِينٍ the second part of a possession'], answer: 0, why: 'al-Jadwal reads the بِ as extra. It only makes the khabar genitive in form.' },
    },
    25: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to the one before, like the wa in verse 24.' },
        { role: 'Negation working like لَيْسَ', say: 'It means “not”. al-Jadwal says it works like لَيْسَ, as in verses 22 and 24.' },
        { role: 'Noun of مَا', say: 'The detached pronoun. In this verse al-Jadwal says it points to the Quran. It is nominative in place, as the noun of مَا.' },
        { role: 'Extra preposition', say: 'It adds emphasis and no new meaning. Because of it the khabar is genitive.' },
        { role: 'Khabar of مَا, first part of a possession', say: 'Genitive because of the extra بِ, accusative in place. Its second part is شَيْطَانٍ.' },
        { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because قَوْلِ owns it.' },
        { role: 'Adjective (naʿt) of شَيْطَانٍ', say: 'A فَعِيل adjective with a passive meaning: “stoned, cast out”. It copies شَيْطَانٍ: genitive and indefinite.' },
      ],
      quiz: { word: 2, q: 'What does هُوَ point to in this verse?', options: ['The Prophet', 'The Quran', 'Gabriel'], answer: 1, why: 'In verse 24 the pronoun is the Prophet. al-Jadwal says that in verse 25 the pronoun points to the Quran.' },
    },
    26: {
      words: [
        { role: 'Fa that links an answer', say: 'al-Jadwal says it links an answer to an unspoken condition: “if the matter of Muhammad and the Quran is clear to you, then where are you going?”' },
        { role: 'Question word, adverb of place', say: 'It means “where”. It never changes (mabni on fatha). It is accusative in place and is tied to تَذْهَبُونَ, with an unspoken إِلَى (“to where”).' },
        { role: 'Verb, present', say: 'It is indicative, so it keeps the final نُون (one of the five verbs). Its clause stands in the place of a jussive, as the answer to the unspoken condition.' },
      ],
      quiz: { word: 0, q: 'What does the فَ do in فَأَيْنَ تَذْهَبُونَ?', options: ['It means “because”', 'It joins the verse to the one before as “and then”', 'It links an answer to an unspoken condition'], answer: 2, why: 'al-Jadwal reads the فَ as the link of an answer to a condition that is not said: “if it is clear to you, then where are you going?”' },
    },
    27: {
      words: [
        { role: 'Negation “not”', say: 'This is إِنْ with sukun, not إِنَّ. It means “not”, and with إِلَّا it limits the meaning.' },
        { role: 'Subject (mubtadaʾ)', say: 'The detached pronoun starts the sentence. It points to the Quran.' },
        { role: 'Restriction particle', say: 'Together with إِنْ it means “nothing but”. It limits the Quran to being a reminder.' },
        { role: 'Predicate (khabar)', say: 'Nominative with tanwin ḍamma. It is a verbal noun (masdar) meaning “reminder”.' },
        { role: 'Preposition', say: 'It means “for”. Its phrase tells who the reminder is for.' },
        { role: 'After a preposition', say: 'Genitive, with the ending ـِينَ of the masculine plural. “The worlds”. Verse 28 repeats the preposition and names who is meant.' },
      ],
      quiz: { word: 0, q: 'What is the إِنْ (with sukun) in إِنْ هُوَ إِلَّا ذِكْرٌ?', options: ['A negation, “not”', 'The particle إِنَّ, which puts its noun in the accusative', 'A condition, “if”'], answer: 0, why: 'al-Jadwal calls it a negation particle. With إِلَّا it limits: “it is nothing but a reminder”.' },
    },
    28: {
      words: [
        { role: 'Preposition, repeated', say: 'It means “for”. It repeats the لِ of لِلْعَالَمِينَ in verse 27.' },
        { role: 'Relative pronoun, in a substitute', say: 'It means “whoever”. It never changes. al-Jadwal says لِمَن is a badal of لِلْعَالَمِينَ, with the preposition repeated: the reminder is for the worlds, and in particular for whoever wills.' },
        { role: 'Verb of the relative clause', say: 'Past, “he willed”. The “he” is hidden inside. This clause is the ṣila of مَن and has no place in the grammar.' },
        { role: 'Preposition and pronoun', say: 'مِنْ with the attached كُمْ: “among you”. al-Jadwal ties it to a ḥāl from the hidden doer of شَاءَ.' },
        { role: 'Particle “that”, subjunctive', say: 'A masdar particle that puts the next verb in the subjunctive. With its verb it makes a verbal noun: “uprightness”.' },
        { role: 'Verb, subjunctive, Form X', say: 'It ends in fatha because of أَن. Its clause is the ṣila of أَن. أَن يَسْتَقِيمَ is the object of شَاءَ, accusative in place.' },
      ],
      quiz: { word: 1, q: 'What is لِمَن in verse 28?', options: ['An adjective of الْعَالَمِينَ', 'A badal of لِلْعَالَمِينَ, with the preposition repeated', 'The khabar of ذِكْرٌ'], answer: 1, why: 'al-Jadwal says لِمَن is a badal of لِلْعَالَمِينَ in verse 27, with the preposition repeated.' },
    },
    29: {
      words: [
        { role: 'Wa that opens a new sentence', say: 'al-Jadwal says this wa opens a new sentence (istiʾnāf).' },
        { role: 'Negation “not”', say: 'It means “not”. With إِلَّا it limits the meaning: “you will only…”.' },
        { role: 'Verb, present', say: 'It is indicative, so it keeps the ـُونَ ending (you, plural). The object is left out. al-Jadwal suggests “uprightness”.' },
        { role: 'Restriction particle', say: 'Together with مَا it means “only, nothing but”.' },
        { role: 'Masdar particle', say: 'It puts the next verb in the subjunctive. With its verb it makes a verbal noun, “Allah’s willing”. al-Jadwal puts that noun in the genitive with an unspoken بِ: “except by the will of Allah”. It also allows a time reading.' },
        { role: 'Verb, subjunctive', say: 'It ends in fatha because of أَن. Its clause is the ṣila of أَن and has no place in the grammar.' },
        { role: 'Doer (fāʿil)', say: 'The name of God is the doer of يَشَاءَ, so it is nominative with ḍamma.' },
        { role: 'Adjective (naʿt) of اللَّهُ', say: 'al-Jadwal reads رَبُّ as an adjective of the name اللَّهُ, so it is nominative too. It is the first part of a possession.' },
        { role: 'Second part of a possession', say: 'Genitive, with the ending ـِينَ of the masculine plural, because رَبُّ owns it. “The worlds”.' },
      ],
      quiz: { word: 7, q: 'How does al-Jadwal parse رَبُّ?', options: ['Badal of اللَّهُ', 'Khabar of يَشَاءَ', 'Adjective (naʿt) of اللَّهُ'], answer: 2, why: 'al-Jadwal calls رَبُّ a naʿt of the name اللَّهُ. It is not a badal.' },
    },
  },
};
