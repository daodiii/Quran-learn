// Plain-English teaching layer for Al-Layl (92). Same shape and rules as in surah-study.ts.
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Someone who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from './surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Oath particle', say: 'wa- means “by”. It swears by the next word and puts it in the genitive. al-Jadwal ties it to an unspoken “I swear”.' },
        { role: 'Thing sworn by, genitive', say: 'The night. It is genitive with kasra, because of the oath wa-.' },
        { role: 'Time word', say: 'It means just “when”, with no “if” in it. al-Jadwal ties it to the unspoken “I swear”.' },
        { role: 'Verb, present, Form I', say: 'It covers. The subject “it” is hidden and means the night. This clause belongs to إِذَا and says when. No object is spoken.' },
      ],
      quiz: { word: 2, q: 'Does إِذَا in this verse mean “if”?', options: ['Yes, it starts a condition', 'No, it means “when” and is tied to “I swear”', 'No, it is a negation'], answer: 1, why: 'al-Jadwal says إِذَا here is a time word with the condition taken out of it. It tells us when the night covers, and it is tied to the unspoken “I swear”.' },
    },
    2: {
      words: [
        { role: 'Joining wa', say: 'wa- joins this thing sworn by to the night in verse 1.' },
        { role: 'Thing sworn by, genitive', say: 'The day. It is genitive with kasra, like اللَّيْلِ, because it is joined to it.' },
        { role: 'Time word', say: 'Again just “when”, tied to the unspoken “I swear”.' },
        { role: 'Verb, past, Form V', say: 'It showed itself. Form V (تَفَعَّلَ) often means doing the action to oneself. This clause belongs to إِذَا.' },
      ],
      quiz: { word: 3, q: 'What does the clause تَجَلَّىٰ do after إِذَا?', options: ['It is the answer to the oath', 'It is the object of the oath', 'It belongs to إِذَا and says when'], answer: 2, why: 'In al-Jadwal the clause after إِذَا is added to it, like the second part of a possession. The answer to the oath only comes in verse 4.' },
    },
    3: {
      words: [
        { role: 'Joining wa', say: 'wa- joins a third thing sworn by to the night and the day.' },
        { role: 'Masdar particle', say: 'al-Jadwal reads it first as a particle that turns the verb into a noun: “the creating of”. That noun is in the genitive position, joined to the night. He also allows “He who”, meaning Allah.' },
        { role: 'Verb, past, Form I', say: 'He created. The subject “He” is hidden and means Allah. This clause finishes مَا and has no place of its own.' },
        { role: 'Object', say: 'The male. Accusative with fatḥa, the object of خَلَقَ.' },
        { role: 'And', say: 'wa- joins the next word to the male.' },
        { role: 'Joined object', say: 'The female. It is joined to الذَّكَرَ, so it is accusative too. The alif maqsura hides the ending.' },
      ],
      quiz: { word: 1, q: 'How does al-Jadwal read مَا first?', options: ['As a particle that makes “the creating of”', 'As a negation', 'As a question word'], answer: 0, why: 'مَا with خَلَقَ turns into a noun, “the creating of the male and the female”. al-Jadwal also allows “He who created”, meaning Allah.' },
    },
    4: {
      words: [
        { role: 'Emphasis (inna)', say: 'It makes the sentence strong and puts its subject in the accusative. This sentence is the answer to the oaths.' },
        { role: 'Subject of inna (ism inna)', say: 'Your striving. Accusative with fatḥa. The ending كُمْ means “your”, for a group.' },
        { role: 'Lam of the oath', say: 'al-Jadwal calls this لَ the lam of the oath. It takes the place of the usual emphasis lam and sits on the predicate.' },
        { role: 'Predicate of inna (khabar)', say: 'Different, scattered. It is nominative in place, but the alif maqsura hides the ending. It is a plural adjective.' },
      ],
      quiz: { word: 2, q: 'What does al-Jadwal call the لَ in لَشَتَّىٰ?', options: ['The lam that means “for”', 'The lam of the oath, in place of the usual emphasis lam', 'The lam of command'], answer: 1, why: 'The three oaths in verses 1-3 are answered here. al-Jadwal reads the لَ as the lam of the oath, standing where the usual emphasis lam would be.' },
    },
    5: {
      words: [
        { role: 'New-sentence fa', say: 'al-Jadwal calls this فَ resumptive: it starts a new sentence after verse 4.' },
        { role: 'Particle of condition and detail', say: 'أَمَّا means “as for”. It sorts people into groups. Its answer takes a linking فَ, which comes in verse 7.' },
        { role: 'Relative pronoun, subject (mubtadaʾ)', say: 'Whoever. It starts the sentence, so it is the subject. Its predicate is the clause in verse 7.' },
        { role: 'Verb, past, Form IV', say: 'He gave. Form IV (أَفْعَلَ). The subject “he” is hidden. This clause says who مَنْ is.' },
        { role: 'And', say: 'wa- joins اتَّقَىٰ to the clause of أَعْطَىٰ.' },
        { role: 'Verb, past, Form VIII', say: 'He guarded himself, he feared God. Form VIII (افْتَعَلَ). The first root letter و dropped into the تَ. It is part of the same clause.' },
      ],
      quiz: { word: 0, q: 'What does al-Jadwal call the فَ at the start of this verse?', options: ['A fa that links an answer to a condition', 'A fa that shows cause and effect', 'A fa that starts a new sentence'], answer: 2, why: 'Nothing has been asked yet, so this فَ opens a fresh sentence. The فَ that links the answer to أَمَّا comes later, in verse 7.' },
    },
    6: {
      words: [
        { role: 'And', say: 'wa- joins this verb to the clause of مَنْ in verse 5.' },
        { role: 'Verb, past, Form II', say: 'He believed, he confirmed as true. Form II (فَعَّلَ) has the doubled middle letter. It is part of the clause that says who مَنْ is.' },
        { role: 'Preposition', say: 'The phrase belongs to صَدَّقَ: he believed in what?' },
        { role: 'After a preposition', say: 'The best, meaning the best reward. Genitive after بِ; the alif maqsura hides the ending. The pattern is فُعْلَى, the feminine of أَحْسَن.' },
      ],
      quiz: { word: 1, q: 'How does صَدَّقَ relate to أَعْطَىٰ and اتَّقَىٰ?', options: ['It is joined to the same clause that says who مَنْ is', 'It is the answer to أَمَّا', 'It is a new sentence with its own subject'], answer: 0, why: 'wa- joins it to the clause after مَنْ. Three verbs together describe one person.' },
    },
    7: {
      words: [
        { role: 'Fa of the answer', say: 'The linking fa for أَمَّا. It joins the answer to “as for whoever ...”. al-Jadwal says a second فَ was dropped to keep it light.' },
        { role: 'Future particle', say: 'سَ puts the verb in the future.' },
        { role: 'Verb, present, Form II, plus “him”', say: 'We will make easy for him. Form II (فَعَّلَ). نُ is “We” and the ending هُ is “him”, the object. The whole clause is the predicate of مَنْ.' },
        { role: 'Preposition', say: 'The phrase belongs to نُيَسِّرُ: ease toward what.' },
        { role: 'After a preposition', say: 'Ease. Genitive after لِ; the alif maqsura hides the ending. It has the same root as the verb. The pattern is فُعْلَى.' },
      ],
      quiz: { word: 0, q: 'What job does this فَ do?', options: ['It shows the cause of verse 5', 'It links the answer to أَمَّا', 'It starts a new sentence'], answer: 1, why: 'Verse 5 said “as for whoever ...”. This فَ ties the answer to that أَمَّا, and the answer clause is the predicate of مَنْ.' },
    },
    8: {
      words: [
        { role: 'Joining wa', say: 'It joins this أَمَّا-sentence to the one before it. The contrast comes from the meaning.' },
        { role: 'Particle of condition and detail', say: 'Again “as for”. Its answer comes in verse 10.' },
        { role: 'Relative pronoun, subject (mubtadaʾ)', say: 'Whoever. The subject of this second sentence. Its predicate is the clause in verse 10.' },
        { role: 'Verb, past, Form I', say: 'He was stingy. The pattern فَعِلَ often shows a state. This clause says who مَن is.' },
        { role: 'And', say: 'wa- joins اسْتَغْنَىٰ to the clause of بَخِلَ.' },
        { role: 'Verb, past, Form X', say: 'He counted himself free of need. Form X (اسْتَفْعَلَ) can mean counting oneself as having a quality. Many commentators read it as: he thought he needed nothing from God.' },
      ],
      quiz: { word: 5, q: 'What can Form X add to the meaning of اسْتَغْنَىٰ?', options: ['It makes the verb passive', 'It makes it a command', 'It can mean counting oneself as free of need'], answer: 2, why: 'Form X (اسْتَفْعَلَ) often means to count oneself as having a quality. So the verb fits “he thought he had no need”.' },
    },
    9: {
      words: [
        { role: 'And', say: 'wa- joins this verb to the clause of مَن in verse 8.' },
        { role: 'Verb, past, Form II', say: 'He called it a lie, he denied. Form II (فَعَّلَ). It is part of the clause that says who مَن is. It is the opposite of صَدَّقَ.' },
        { role: 'Preposition', say: 'The phrase belongs to كَذَّبَ.' },
        { role: 'After a preposition', say: 'The same word as in verse 6. Genitive after بِ; the alif maqsura hides the ending.' },
      ],
      quiz: { word: 1, q: 'How do صَدَّقَ (verse 6) and كَذَّبَ (verse 9) compare?', options: ['Both are Form II, with different roots and opposite meanings', 'One is Form II and the other is Form IV', 'One is passive'], answer: 0, why: 'Both have the doubled middle letter of Form II. The roots ص-د-ق (truth) and ك-ذ-ب (lie) give opposite meanings, and the rest of the verse is the same.' },
    },
    10: {
      words: [
        { role: 'Fa of the answer', say: 'The linking fa for أَمَّا, like verse 7. The answer to the second “as for” comes here.' },
        { role: 'Future particle', say: 'سَ puts the verb in the future.' },
        { role: 'Verb, present, Form II, plus “him”', say: 'We will make easy for him. The same words as verse 7. The whole clause is the predicate of مَن.' },
        { role: 'Preposition', say: 'The phrase belongs to نُيَسِّرُ.' },
        { role: 'After a preposition', say: 'Hardship. al-Jadwal reads it as a noun meaning narrowness and hardship. He also allows a feminine superlative, “the hardest”. Genitive after لِ.' },
      ],
      quiz: { word: 4, q: 'What does al-Jadwal say الْعُسْرَىٰ is?', options: ['A verb', 'A noun meaning hardship; he also allows “the hardest”', 'A particle'], answer: 1, why: 'al-Jadwal gives “a noun for narrowness and hardship” first, and also allows the feminine superlative of الْأَعْسَر. Its pattern is فُعْلَى, like الْيُسْرَىٰ.' },
    },
    11: {
      words: [
        { role: 'Joining wa', say: 'It joins this sentence to the one in verse 10.' },
        { role: 'Negation', say: 'مَا says “not”. al-Jadwal also allows it as a question word, “what?”.' },
        { role: 'Verb, present, Form IV', say: 'It helps, it is enough for. Form IV (أَفْعَلَ), with the same root as اسْتَغْنَىٰ. The clause is joined to the one in verse 10.' },
        { role: 'Phrase “for him”', say: 'عَنْ with “him”. The phrase belongs to يُغْنِي.' },
        { role: 'Subject (fāʿil)', say: 'His wealth. It does the action, so it is nominative with ḍamma. The ending هُ means “his”.' },
        { role: 'Time word with “if” in it', say: 'It means “when”, with a sense of “if”. al-Jadwal says its answer is left out: “his wealth does not help him”.' },
        { role: 'Verb, past, Form V', say: 'He fell down. Form V (تَفَعَّلَ). The last root letter ي turned into an alif. This clause belongs to إِذَا.' },
      ],
      quiz: { word: 5, q: 'What does al-Jadwal say about the answer to إِذَا here?', options: ['It is the next verse', 'It is the word “Hell”', 'It is left out: “his wealth does not help him”'], answer: 2, why: 'The words of the answer are the same as the sentence just before إِذَا, so they are not repeated.' },
    },
    12: {
      words: [
        { role: 'Emphasis (inna)', say: 'It makes the sentence strong and puts its subject in the accusative.' },
        { role: 'Phrase “upon Us”', say: 'عَلَى with نَا, “Us”. It belongs to the predicate of إِنَّ, which is left unsaid, and it comes first.' },
        { role: 'Emphasis lam', say: 'It sits on the subject of إِنَّ, which was pushed back.' },
        { role: 'Subject of inna (ism inna)', say: 'The guidance. It is accusative, but the alif maqsura hides the ending. It comes last.' },
      ],
      quiz: { word: 3, q: 'What is الْهُدَىٰ in this sentence?', options: ['The subject of إِنَّ, so accusative', 'The predicate of إِنَّ, so nominative', 'A verb'], answer: 0, why: 'The phrase عَلَيْنَا comes first and belongs to the predicate. The noun that comes last is the ism of inna, which is accusative. The alif maqsura hides the ending.' },
    },
    13: {
      words: [
        { role: 'Joining wa', say: 'It joins this sentence to the one in verse 12.' },
        { role: 'Emphasis (inna)', say: 'Same as in verse 12.' },
        { role: 'Phrase “to Us”', say: 'لِ with نَا. It belongs to the predicate of إِنَّ, which is left unsaid, and it comes first.' },
        { role: 'Emphasis lam', say: 'It sits on the subject of إِنَّ, which was pushed back.' },
        { role: 'Subject of inna (ism inna)', say: 'The Hereafter. Accusative with fatḥa. It comes last.' },
        { role: 'And', say: 'wa- joins the next word to الْآخِرَةَ.' },
        { role: 'Joined noun', say: 'The first life. It is joined to الْآخِرَةَ, so it is accusative too; the alif maqsura hides the ending. The pattern is فُعْلَى, the feminine of الأَوَّل.' },
      ],
      quiz: { word: 6, q: 'Why is الْأُولَىٰ accusative?', options: ['It is the object of a verb', 'It is joined to الْآخِرَةَ, which is the subject of إِنَّ', 'It comes after a preposition'], answer: 1, why: 'wa- joins it to الْآخِرَةَ, so it takes the same case. The alif maqsura hides the ending.' },
    },
    14: {
      words: [
        { role: 'Joining fa', say: 'al-Jadwal calls this فَ a joining fa: the sentence is joined to the ones before it, in verses 12-13.' },
        { role: 'Verb, past, Form IV, plus “I” and “you”', say: 'I warned you. Form IV (أَفْعَلَ). تُ is “I”, the subject, and كُمْ is “you all”, the first object. This verb takes two objects.' },
        { role: 'Second object', say: 'A fire. It is the second object, what they are warned of. Accusative with tanwin.' },
        { role: 'Verb, present, Form V', say: 'It blazes. Form V (تَفَعَّلَ). One of the two ت letters was dropped, from تَتَلَظَّىٰ. The clause describes نَارًا, so it is an adjective.' },
      ],
      quiz: { word: 2, q: 'What is نَارًا in this verse?', options: ['The subject of the verb', 'The first object of the verb', 'The second object of the verb'], answer: 2, why: 'أَنذَرْتُكُمْ takes two objects. كُمْ is the first (who is warned) and نَارًا is the second (what they are warned of).' },
    },
    15: {
      words: [
        { role: 'Negation', say: 'لَا says “not”. The verb keeps its ordinary ending.' },
        { role: 'Verb, present, Form I, plus “it”', say: 'He burns in it, he enters it. هَا is “it”, the fire, and it is the object. The whole clause describes نَارًا from verse 14.' },
        { role: 'Restriction', say: 'After a negation, إِلَّا means “only”. al-Jadwal calls it a particle of restriction.' },
        { role: 'Subject (fāʿil)', say: 'The most wretched. It is the doer of يَصْلَاهَا, so it is nominative. The pattern is أَفْعَل and the alif maqsura hides the ending.' },
      ],
      quiz: { word: 3, q: 'Why is الْأَشْقَى nominative, even after إِلَّا?', options: ['It is the subject of يَصْلَاهَا', 'It is the object of يَصْلَاهَا', 'It comes after a preposition'], answer: 0, why: 'With a negation and إِلَّا, the noun takes the case its job needs. Here it is the one who burns, so it is the subject.' },
    },
    16: {
      words: [
        { role: 'Relative pronoun, adjective', say: 'Who. It describes الْأَشْقَى and never changes its ending. al-Jadwal also allows it as the predicate of an unspoken “he is”.' },
        { role: 'Verb, past, Form II', say: 'He denied. This clause completes الَّذِي and has no place of its own. No object is spoken.' },
        { role: 'And', say: 'wa- joins the second verb to the same clause.' },
        { role: 'Verb, past, Form V', say: 'He turned away. Form V (تَفَعَّلَ). It is part of the same clause.' },
      ],
      quiz: { word: 0, q: 'What does الَّذِي do in this verse?', options: ['It starts a new sentence', 'It describes الْأَشْقَى, like an adjective', 'It is a preposition'], answer: 1, why: 'al-Jadwal puts الَّذِي in the same case as الْأَشْقَى, as its adjective. The clause after it says who he is.' },
    },
    17: {
      words: [
        { role: 'Joining wa', say: 'It joins this clause to “none will burn in it except ...” in verse 15.' },
        { role: 'Future particle', say: 'سَ puts the verb in the future.' },
        { role: 'Verb, present, passive, Form II, plus “it”', say: 'He will be kept away from it. Passive of Form II (يُفَعَّلُ). It does not say who keeps him away. هَا is the fire, the second object.' },
        { role: 'Deputy subject (nāʾib al-fāʿil)', say: 'The most pious. In a passive sentence this word stands in for the doer, so it is nominative. It has the same root as اتَّقَىٰ.' },
      ],
      quiz: { word: 3, q: 'What is الْأَتْقَى in this sentence?', options: ['The doer of the verb', 'The object of the verb', 'The deputy subject of a passive verb'], answer: 2, why: 'The verb is passive, so the doer is not named. The one who is kept away takes the subject place and is nominative.' },
    },
    18: {
      words: [
        { role: 'Relative pronoun, adjective', say: 'Who. It describes الْأَتْقَى and never changes its ending.' },
        { role: 'Verb, present, Form IV', say: 'He gives. Form IV (أَفْعَلَ), root أ-ت-ي. This clause completes الَّذِي. The verb takes two objects.' },
        { role: 'Object', say: 'His wealth. Accusative with fatḥa. The other object, the one who receives, is not said. هُ is “his”.' },
        { role: 'Verb, present, Form V', say: 'He purifies himself. al-Jadwal first reads this clause as a hal: it says how he gives, while purifying himself. He also allows a badal of يُؤْتِي. It has the same root as زَكَاة.' },
      ],
      quiz: { word: 3, q: 'What does al-Jadwal read the clause يَتَزَكَّىٰ as first?', options: ['A hal: how he gives, “while purifying himself”', 'A command', 'The answer to an oath'], answer: 0, why: 'A hal tells the state of the doer while the verb happens. So the sense is “gives his wealth, purifying himself”.' },
    },
    19: {
      words: [
        { role: 'New-sentence wa', say: 'al-Jadwal reads this wa as starting a new sentence. He also allows a hal wa.' },
        { role: 'Negation', say: 'مَا says “no”: no favor is owed to anyone.' },
        { role: 'Preposition', say: 'The phrase لِأَحَدٍ belongs to the predicate, which is left unsaid and comes first: “is for anyone”.' },
        { role: 'After a preposition', say: 'Anyone. Genitive with kasra after لِ.' },
        { role: 'Adverb of place, plus “him”', say: 'With him. al-Jadwal ties it to an unspoken hal of نِّعْمَةٍ: a favor with him. هُ is “him”.' },
        { role: 'Extra min', say: 'مِن adds only stress: not any favor at all. Grammar books call this min extra (zāʾida).' },
        { role: 'Delayed subject (mubtadaʾ)', say: 'A favor. It is genitive in form because of مِن, but nominative in place, because it is the subject. It comes last.' },
        { role: 'Verb, present, passive, Form I', say: 'It is repaid. Indicative; the alif maqsura hides the ending. This clause describes نِّعْمَةٍ, like an adjective.' },
      ],
      quiz: { word: 5, q: 'What does مِن do before نِّعْمَةٍ?', options: ['It means “from”', 'It is extra: it stresses “not any favor at all”', 'It starts a condition'], answer: 1, why: 'After a negation, مِن can be added only for stress. It still puts نِّعْمَةٍ in the genitive in form, but the word is the subject.' },
    },
    20: {
      words: [
        { role: 'Exception particle', say: 'It works like “but”. al-Jadwal reads what follows as a separate exception.' },
        { role: 'Verbal noun, accusative', say: 'Seeking. The verbal noun of Form VIII. It is accusative as a separate exception; al-Jadwal also allows “the reason”. It is the first part of a possession.' },
        { role: 'Second and first part of a possession', say: 'The face. Genitive because ابْتِغَاءَ owns it. It also owns the next word.' },
        { role: 'Second part of a possession', say: 'His Lord. Genitive because وَجْهِ owns it. The ending هِ means “his”.' },
        { role: 'Adjective', say: 'The Most High. It describes رَبِّهِ, so it is genitive; the alif maqsura hides the ending. The pattern is أَفْعَل.' },
      ],
      quiz: { word: 1, q: 'How does al-Jadwal read ابْتِغَاءَ first?', options: ['As the subject of the verse', 'As the object of a verb', 'As a separate exception, accusative'], answer: 2, why: 'What follows إِلَّا is not a kind of favor from verse 19, so it is a separate exception, and إِلَّا works like “but”. He also allows “the reason”.' },
    },
    21: {
      words: [
        { role: 'New-sentence wa', say: 'It starts a new sentence.' },
        { role: 'Lam of an oath', say: 'al-Jadwal reads لَ as the lam of an unspoken oath: “I swear he will ...”.' },
        { role: 'Future particle', say: 'سَوْفَ puts the verb in the future. Many grammars say it points farther ahead than سَ.' },
        { role: 'Verb, present, Form I', say: 'He will be pleased. The subject “he” is hidden and means الْأَتْقَى. This clause is the answer to the unspoken oath.' },
      ],
      quiz: { word: 1, q: 'What does al-Jadwal say لَ is in this verse?', options: ['The lam of an unspoken oath', 'The lam that means “to”', 'A lam of command'], answer: 0, why: 'The oath itself is not said, but the لَ shows it: “I swear he will be pleased”. The clause with سَوْفَ answers it.' },
    },
  },
};
