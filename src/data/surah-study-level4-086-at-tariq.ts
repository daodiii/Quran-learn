// Plain-English teaching layer for At-Tariq (86). Same shape and rules as in surah-study.ts.
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Someone who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from './surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Oath wa', say: 'It means “by”. It is the oath particle, and it belongs to a verb that is left unsaid: “I swear”.' },
        { role: 'After the oath wa, genitive', say: 'Genitive with kasra, because the oath wa puts the noun after it in the genitive.' },
        { role: 'Joining wa', say: 'This وَ joins the next word to “the sky”. It does not start a new oath, so both words are sworn by.' },
        { role: 'Joined word, genitive', say: 'Joined to السَّمَاءِ, so it is genitive with kasra too. The pattern فَاعِل names the one who does the act: the one who comes at night. al-Jadwal says it can also be the name of a known star.' },
      ],
      quiz: { word: 2, q: 'What does the second وَ do?', options: ['It starts a new oath, with a new verb', 'It joins الطَّارِقِ to السَّمَاءِ', 'It is the answer to the oath'], answer: 1, why: 'Only the first وَ is the oath particle. The second one joins الطَّارِقِ to السَّمَاءِ, so both are genitive and both are sworn by.' },
    },
    2: {
      words: [
        { role: 'Aside (parenthetical) wa', say: 'al-Jadwal calls this وَ parenthetical: the question breaks in between the oath and its answer. It does not join two statements.' },
        { role: 'Question word, subject', say: 'It starts a sentence, so it is the subject. The word after it, with its clause, says something about it.' },
        { role: 'Verb, past, Form IV, plus “you”', say: 'From the root د ر ي, “to know”. Form IV makes someone else know: “made you know”. Its clause is the predicate of the first مَا. The ending كَ is the first object, and the clause مَا الطَّارِقُ fills the place of the second.' },
        { role: 'Question word, subject', say: 'A second subject, in its own short sentence. That sentence fills the place of the second object of أَدْرَىٰكَ.' },
        { role: 'Predicate (khabar)', say: 'It says what the second مَا is about. It is nominative with ḍamma. In verse 1 it was genitive, because of the oath.' },
      ],
      quiz: { word: 4, q: 'Why is الطَّارِقُ nominative here, when it was genitive in verse 1?', options: ['It is the object of أَدْرَىٰكَ', 'It comes after an oath wa', 'It is the predicate of the second مَا'], answer: 2, why: 'Here there is no oath wa in front of it. The second مَا is the subject, and الطَّارِقُ is its predicate, so it is nominative.' },
    },
    3: {
      words: [
        { role: 'Predicate (khabar) of an unspoken “it”', say: 'The subject هُوَ (“it is...”) is left out. This word says what the night-comer is. It is nominative with ḍamma.' },
        { role: 'Adjective (naʿt)', say: 'It describes النَّجْمُ and copies its nominative case and its al-. The pattern فَاعِل names the one who pierces.' },
      ],
      quiz: { word: 0, q: 'What is النَّجْمُ in this verse?', options: ['The predicate of an unspoken “it”: “it is the star”', 'A badal of الطَّارِقُ', 'The subject, with a verb left out'], answer: 0, why: 'al-Jadwal reads a new sentence that explains the question of verse 2. The subject “it” is left out, and النَّجْمُ is its predicate.' },
    },
    4: {
      words: [
        { role: 'Negation', say: 'Here إِن means “not”. It is not the “if” word. The sentence is negative until لَمَّا breaks it: “not... except”.' },
        { role: 'Subject (mubtadaʾ), first part of a possession', say: 'It opens the sentence, so it is nominative with ḍamma. It owns the next word, so it has no al-. The clause at the end of the verse is its predicate.' },
        { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because كُلُّ owns it. It is indefinite, so “every soul” means each single one.' },
        { role: 'Particle “except”', say: 'al-Jadwal reads it as a particle that limits, with the meaning of “except”. Here it stands in front of a noun sentence.' },
        { role: 'Prepositional phrase', say: 'It is tied to a predicate that comes first: “over it is”. The ending هَا means “it” and points back to the soul.' },
        { role: 'Subject, placed after its predicate', say: 'In the little clause, al-Jadwal reads this word as the subject, put after its predicate عَلَيْهَا. It is nominative with tanwin. The pattern فَاعِل names one who guards. The whole verse is the answer to the oath.' },
      ],
      quiz: { word: 5, q: 'What is حَافِظٌ in this verse?', options: ['An adjective of نَفْسٍ', 'The predicate of كُلُّ', 'The subject, placed after its predicate عَلَيْهَا'], answer: 2, why: 'The whole clause عَلَيْهَا حَافِظٌ is the predicate of كُلُّ. Inside it, عَلَيْهَا is the predicate and حَافِظٌ is the subject that comes after it.' },
    },
    5: {
      words: [
        { role: 'Resumptive fa', say: 'al-Jadwal calls this فَ resumptive: it starts a new sentence. It does not mean “because of this”.' },
        { role: 'Lām of command', say: 'The lām al-amr turns “he looks” into “let him look”. It is written joined to the verb.' },
        { role: 'Verb, present, jussive, Form I', say: 'The lām of command makes it jussive, which would end in sukun. It takes kasra, because the next word begins with al- and two sukuns cannot meet. The subject is الْإِنسَانُ.' },
        { role: 'Subject (fāʿil)', say: 'The one who looks. It is nominative with ḍamma.' },
        { role: 'Preposition + question word', say: 'It is مِن + مَا, “from what?”. The alif of مَا dropped after the preposition, and the ن merged into the م. It belongs to خُلِقَ.' },
        { role: 'Verb, past, passive', say: 'The one who created is not named, and the hidden “he” (the human) takes the place of the subject. al-Jadwal says this clause fills the place of the object of “look”.' },
      ],
      quiz: { word: 0, q: 'What kind of فَ is this?', options: ['It shows cause and effect: “so that”', 'It starts a new sentence (resumptive)', 'It joins two verbs'], answer: 1, why: 'al-Jadwal calls it a resumptive فَ. It does not link a cause to an effect; it opens a new sentence: “let man look...”.' },
    },
    6: {
      words: [
        { role: 'Verb, past, passive', say: 'The same verb as in verse 5. al-Jadwal reads this clause as a new sentence that explains the first خُلِقَ. The hidden “he” is the human.' },
        { role: 'Preposition', say: 'It shows the source: what he was made from. It belongs to this second خُلِقَ.' },
        { role: 'After a preposition', say: 'Genitive with tanwin kasra after مِن. It has no al-, so it is “a fluid”, not a known one.' },
        { role: 'Adjective (naʿt)', say: 'It describes مَاءٍ and copies its genitive case and tanwin. The pattern is active (“gushing”), but al-Jadwal says it has the sense of “poured out”.' },
      ],
      quiz: { word: 3, q: 'Which word does دَافِقٍ describe?', options: ['مَاءٍ', 'خُلِقَ', 'مِن'], answer: 0, why: 'An adjective copies the case of the word it describes. دَافِقٍ is genitive with tanwin, like مَاءٍ.' },
    },
    7: {
      words: [
        { role: 'Verb, present, Form I', say: 'The subject “it” (the fluid) is hidden. al-Jadwal reads the clause as describing مَاءٍ in verse 6. It also allows a ḥāl.' },
        { role: 'Preposition', say: 'It belongs to يَخْرُجُ: where it comes out from.' },
        { role: 'After a preposition, first part of a possession', say: 'Genitive with kasra after مِن. It owns الصُّلْبِ.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because بَيْنِ owns it. It names the backbone.' },
        { role: 'And', say: 'It joins the next word to الصُّلْبِ.' },
        { role: 'Joined word, genitive', say: 'Joined to الصُّلْبِ, so it is genitive too. A broken plural of the pattern فَعَائِل. al-Jadwal says it names the chest or its ribs.' },
      ],
      quiz: { word: 5, q: 'Why is التَّرَائِبِ genitive?', options: ['It owns بَيْنِ', 'It is the object of يَخْرُجُ', 'It is joined to الصُّلْبِ'], answer: 2, why: 'بَيْنِ owns only الصُّلْبِ. التَّرَائِبِ is joined to it with وَ, so it takes the same genitive case.' },
    },
    8: {
      words: [
        { role: 'Particle إِنَّ and its noun “He”', say: 'إِنَّ stresses the sentence. The ending هُ means “He” (Allah). It is the noun of إِنَّ, so it is accusative.' },
        { role: 'Preposition', say: 'It belongs to قَادِرٌ, which comes later: able over his return.' },
        { role: 'After a preposition', say: 'Genitive with kasra after عَلَىٰ. A verbal noun: “returning”. The ending هِ names the one who is returned. al-Jadwal allows the fluid or the human.' },
        { role: 'Lām that stresses', say: 'It adds stress to the predicate. It stands in front of قَادِرٌ, not at the start of the sentence.' },
        { role: 'Predicate of إِنَّ', say: 'An active participle of the pattern فَاعِل, from ق د ر. It is the predicate, so it stays nominative with tanwin ḍamma.' },
      ],
      quiz: { word: 1, q: 'Which word does the phrase starting with عَلَىٰ belong to?', options: ['إِنَّهُ', 'قَادِرٌ', 'لَ'], answer: 1, why: 'al-Jadwal ties the phrase عَلَىٰ رَجْعِهِ to قَادِرٌ: able over his return. It comes before the word it belongs to.' },
    },
    9: {
      words: [
        { role: 'Time word, accusative', say: 'It tells when. It is accusative with fatḥa and belongs to رَجْعِهِ in verse 8. It owns the clause after it, so it has no tanwin.' },
        { role: 'Verb, present, passive, Form I', say: 'The vowels show the passive: who tests is not named. It is feminine singular, to agree with السَّرَائِرُ, a plural of things. This whole clause is owned by يَوْمَ, so it fills a genitive place.' },
        { role: 'Stands in for the subject (naʾib al-fāʿil)', say: 'It receives the action of the passive verb, so it is nominative with ḍamma. A broken plural of the pattern فَعَائِل: “secrets”.' },
      ],
      quiz: { word: 0, q: 'Why is يَوْمَ accusative?', options: ['It is a time word (an adverb)', 'It follows a preposition', 'It is the subject of تُبْلَى'], answer: 0, why: 'A word that tells when is an adverb of time, and it takes the accusative. Nothing in the verse puts it after a preposition.' },
    },
    10: {
      words: [
        { role: 'Connecting fa', say: 'al-Jadwal reads this فَ as tying an answer to an unspoken “if”: “if he is raised that Day, then he has no strength”.' },
        { role: 'Negation', say: 'It means “not”. The sentence it opens says there is no strength and no helper.' },
        { role: 'Phrase “for him”', say: 'The preposition لِ with the pronoun هُ. It is tied to a predicate that comes first: “for him is...”. The pronoun points to the human.' },
        { role: 'Extra مِن', say: 'It adds no new meaning of its own. It stresses the denial: no strength at all. It is why the next noun is genitive in form.' },
        { role: 'Delayed subject (mubtadaʾ)', say: 'Genitive in form, because of مِن. In position it is nominative, as the subject that comes after its predicate لَهُ.' },
        { role: 'And', say: 'It joins نَاصِرٍ to قُوَّةٍ.' },
        { role: 'Extra لَا', say: 'al-Jadwal calls it extra: it only stresses the denial.' },
        { role: 'Joined word', say: 'Joined to قُوَّةٍ, so it is genitive in form like it, and nominative in position. The pattern فَاعِل names one who helps.' },
      ],
      quiz: { word: 4, q: 'Why is قُوَّةٍ genitive, when it is the subject?', options: ['It follows لَهُ', 'It is the second part of a possession', 'مِن stands before it: genitive in form, nominative in position'], answer: 2, why: 'The extra مِن puts the noun after it in the genitive. The word is still the subject, so al-Jadwal calls it nominative in position.' },
    },
    11: {
      words: [
        { role: 'Oath wa', say: 'It means “by”, as in verse 1. It belongs to an unspoken “I swear”.' },
        { role: 'After the oath wa, genitive', say: 'Genitive with kasra, because of the oath wa. Same as in verse 1.' },
        { role: 'Adjective (naʿt)', say: 'It describes السَّمَاءِ, so it is genitive, and feminine like it. It means “owner of”, and the next word is what it owns.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because ذَاتِ owns it. A verbal noun from the same root as رَجْعِهِ in verse 8.' },
      ],
      quiz: { word: 2, q: 'What does ذَاتِ do in this verse?', options: ['It describes السَّمَاءِ and copies its case', 'It is a second oath particle', 'It is the answer to the oath'], answer: 0, why: 'al-Jadwal reads ذَاتِ as an adjective of السَّمَاءِ. It copies the genitive case, and it owns الرَّجْعِ.' },
    },
    12: {
      words: [
        { role: 'Joining wa', say: 'al-Jadwal says الْأَرْضِ is joined to السَّمَاءِ with this وَ. It does not start a new oath.' },
        { role: 'Joined word, genitive', say: 'Joined to السَّمَاءِ of verse 11, so it is genitive with kasra.' },
        { role: 'Adjective (naʿt)', say: 'It describes الْأَرْضِ, so it is genitive. It means “owner of”.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because ذَاتِ owns it. A verbal noun for a split. al-Jadwal says it can also name the crack in the ground where plants come out.' },
      ],
      quiz: { word: 0, q: 'What is this وَ?', options: ['An oath wa, like the first one in verse 11', 'A wa that joins الْأَرْضِ to السَّمَاءِ', 'A wa that means “while”'], answer: 1, why: 'al-Jadwal says الْأَرْضِ is joined to السَّمَاءِ with وَ. It continues the oath of verse 11 and does not start a new one.' },
    },
    13: {
      words: [
        { role: 'Particle إِنَّ and its noun “it”', say: 'إِنَّ stresses the sentence. The ending هُ means “it” (the Quran, or this message). It is the noun of إِنَّ, so it is accusative.' },
        { role: 'Lām of the oath', say: 'al-Jadwal calls it the lām of the oath. It stands in the place of the lām that slides onto the predicate after إِنَّ.' },
        { role: 'Predicate of إِنَّ', say: 'Nominative with tanwin ḍamma. The whole sentence is the answer to the oath of verses 11 and 12.' },
        { role: 'Adjective (naʿt)', say: 'It describes قَوْلٌ and copies its nominative case and tanwin. A verbal noun used like an adjective: a word that decides.' },
      ],
      quiz: { word: 1, q: 'What is the لَ in لَقَوْلٌ?', options: ['The word “not”', 'The preposition “for”', 'The lām of the oath, which stresses the answer'], answer: 2, why: 'al-Jadwal calls it the lām of the oath. The verse is the answer to the oath of verses 11 and 12, and the لَ marks it as strong.' },
    },
    14: {
      words: [
        { role: 'Joining wa', say: 'It joins this sentence to the answer of the oath in verse 13.' },
        { role: 'Negation that works like لَيْسَ', say: 'al-Jadwal says مَا here works like لَيْسَ: it has a noun and a predicate.' },
        { role: 'Noun of مَا', say: 'The pronoun “it” (the Quran). Like the noun of لَيْسَ, it is nominative in position. A pronoun does not change its ending.' },
        { role: 'Extra بِ', say: 'It adds stress to the denial: not a joke at all. It is why the next word is genitive in form.' },
        { role: 'Predicate of مَا', say: 'Genitive in form, because of the extra بِ. In position it is accusative, as the predicate of a مَا that works like لَيْسَ. A verbal noun for joking.' },
      ],
      quiz: { word: 4, q: 'Why is الْهَزْلِ genitive?', options: ['The extra بِ puts it in the genitive', 'It is the second part of a possession', 'It follows the oath wa'], answer: 0, why: 'The بِ is extra, but it still puts the word after it in the genitive. In position the word is the predicate of مَا, so al-Jadwal calls it accusative.' },
    },
    15: {
      words: [
        { role: 'Particle إِنَّ and its noun “they”', say: 'إِنَّ stresses the sentence, which al-Jadwal reads as a new one. The ending هُمْ means “they” (the unbelievers). It is the noun of إِنَّ, so it is accusative.' },
        { role: 'Verb, present, Form I', say: 'The ending ونَ shows “they”. This whole clause is the predicate of إِنَّ.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'A verbal noun from the same root as the verb. It stresses the action. It is accusative with tanwin fatḥa. al-Jadwal also allows a plain object: plots against the Prophet.' },
      ],
      quiz: { word: 2, q: 'What is كَيْدًا here?', options: ['The subject of يَكِيدُونَ', 'An absolute object: it repeats the root of the verb to stress it', 'A time word'], answer: 1, why: 'كَيْدًا comes from the same root as يَكِيدُونَ and is accusative. al-Jadwal reads it first as an absolute object that stresses the verb.' },
    },
    16: {
      words: [
        { role: 'Wa of state (ḥāl)', say: 'al-Jadwal reads the clause after this وَ as a ḥāl: “while I plot a plot”. It also allows a new sentence.' },
        { role: 'Verb, present, Form I, “I”', say: 'The first letter أ shows “I” (Allah). The subject is hidden. The clause is a ḥāl in al-Jadwal.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'The same job as in verse 15: it repeats the root to stress the action. If the first كَيْدًا is a plain object, al-Jadwal reads this one as “I turn back the plot”.' },
      ],
      quiz: { word: 0, q: 'How does al-Jadwal read the clause that starts with this وَ?', options: ['As the answer to an oath', 'As a command', 'As a state (ḥāl): “while I plot a plot”'], answer: 2, why: 'al-Jadwal gives the clause a place as a ḥāl. It tells the state in which the plotters plot. It also allows reading it as a new sentence.' },
    },
    17: {
      words: [
        { role: 'Connecting fa', say: 'It ties the command to an unspoken “if”: “if they plot against you, then give them time”.' },
        { role: 'Verb, command, Form II', say: 'Form II (فَعَّلَ) has a doubled middle letter. A command ends in sukun, but here it takes kasra, because the next word begins with al-. The subject “you” (the Prophet) is hidden.' },
        { role: 'Object (mafʿūl bihi)', say: 'Those who are given time. It is accusative; the ending ينَ is the accusative sign of a sound masculine plural.' },
        { role: 'Verb, command, Form IV, plus “them”', say: 'Form IV (أَفْعَلَ) from the same root as the verb before. The ending هُمْ is the object. al-Jadwal reads this clause as a new sentence that says the first one again, for emphasis.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'A small form (فُعَيْل) that means “a little while”. It stands in for the verbal noun, so it is accusative with tanwin fatḥa.' },
      ],
      quiz: { word: 4, q: 'What is رُوَيْدًا?', options: ['An absolute object that stands in for the verbal noun', 'The object of مَهِّلِ', 'A time word, like يَوْمَ'], answer: 0, why: 'al-Jadwal reads رُوَيْدًا as an absolute object that stands in for the verbal noun. The object of the command is already الْكَافِرِينَ.' },
    },
  },
};
