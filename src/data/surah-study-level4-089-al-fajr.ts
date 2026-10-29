// Plain-English teaching layer for Al-Fajr (89). Same shape and rules as in surah-study.ts.
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Someone who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from './surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Oath particle wa, plus the noun after it', say: 'This وَ is the oath wa, not “and”: it means “by”. It puts الْفَجْرِ in the genitive (kasra). The phrase is tied to an unspoken verb, “I swear”.' },
      ],
      quiz: { word: 0, q: 'What does the وَ in وَالْفَجْرِ do?', options: ['It joins two nouns, like “and”', 'It is the oath wa: it means “by” and puts the noun in the genitive', 'It starts a question'], answer: 1, why: 'The verse opens an oath. The wa takes the place of “I swear by”, so الْفَجْرِ is genitive.' },
    },
    2: {
      words: [
        { role: 'Joining wa', say: 'A plain “and”. It joins لَيَالٍ to الْفَجْرِ. The oath wa was in verse 1. (al-Darwish parses it this way.)' },
        { role: 'Noun joined to “the dawn”', say: 'Genitive with tanwin kasra, because it is joined to الْفَجْرِ. The last ي of لَيَالِيَ has dropped. It has no al-.' },
        { role: 'Adjective (naʿt)', say: 'The number ten describes لَيَالٍ, so it copies its genitive case and has tanwin. The form without ة is the one used with a feminine noun.' },
      ],
      quiz: { word: 1, q: 'Why is لَيَالٍ genitive?', options: ['It is joined to الْفَجْرِ, which is genitive', 'The oath wa in this verse puts it in the genitive', 'It follows the number عَشْرٍ'], answer: 0, why: 'The oath particle was in verse 1. Here the وَ only joins, so لَيَالٍ takes the case of الْفَجْرِ.' },
    },
    3: {
      words: [
        { role: 'Joining wa', say: 'It joins الشَّفْعِ to الْفَجْرِ. It is not an oath wa; that was in verse 1. (al-Darwish parses it this way.)' },
        { role: 'Noun joined to “the dawn”', say: 'Genitive with kasra, because it is joined to الْفَجْرِ. It means “the even”, a pair. Pattern فَعْل.' },
        { role: 'Joining wa', say: 'It joins الْوَتْرِ to الشَّفْعِ.' },
        { role: 'Noun joined to the word before', say: 'Genitive with kasra, because it is joined to what comes before. It means “the odd”, a single one. Pattern فَعْل.' },
      ],
      quiz: { word: 0, q: 'What kind of وَ is the first word of this verse?', options: ['The oath wa', 'The wa of the circumstance (ḥāl)', 'A joining wa'], answer: 2, why: 'The oath particle was in verse 1. Here وَ joins the next oath noun to الْفَجْرِ, so that noun is genitive too.' },
    },
    4: {
      words: [
        { role: 'Joining wa', say: 'It joins الَّيْلِ to the oath nouns before it, so it is genitive too.' },
        { role: 'Noun joined to “the dawn”', say: 'Genitive with kasra, because it is joined to الْفَجْرِ. It means “the night”.' },
        { role: 'Time word, “when”', say: 'al-Jadwal reads it as a time word with no condition in it here. It is tied to the unspoken “I swear”. The clause after it completes it, like the second part of a possession (muḍāf ilayhi).' },
        { role: 'Verb, present, Form I', say: 'It passes by night. The ي at the end has dropped to suit the rhyme of the verses, so the ḍamma is not written. The subject “it” (the night) is hidden.' },
      ],
      quiz: { word: 2, q: 'What does إِذَا do in this verse?', options: ['It is a time word, “when”, with no condition in it here', 'It starts a condition and makes the next verb jussive', 'It is a question word'], answer: 0, why: 'al-Jadwal reads it as a time word tied to the unspoken “I swear”. The verb يَسْرِ only looks jussive: its ي has dropped for the rhyme.' },
    },
    5: {
      words: [
        { role: 'Question particle', say: 'A question meant to confirm: “Is there not…?” The sentence is new, so it has no place in the grammar of the oaths before it.' },
        { role: 'Preposition', say: 'It means “in”. The phrase فِي ذَٰلِكَ is tied to a predicate that comes first.' },
        { role: 'Demonstrative, after a preposition', say: 'It means “that” and points to the oaths. It never changes its ending; its place is genitive after فِي.' },
        { role: 'Subject (mubtadaʾ), delayed', say: 'The predicate فِي ذَٰلِكَ comes first, so the subject comes last. It is nominative with tanwin. It means “an oath”.' },
        { role: 'Preposition', say: 'It means “for”. The phrase لِذِي حِجْرٍ is tied to an adjective of قَسَمٌ: “an oath for…”.' },
        { role: 'One of the five nouns, first part of a possession', say: 'It means “owner of”. After لِ it is genitive, and the ي shows it. It owns حِجْرٍ.' },
        { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because ذِي owns it. It means “intellect”: it holds a person back from what is wrong.' },
      ],
      quiz: { word: 3, q: 'What is قَسَمٌ in this sentence?', options: ['The predicate, placed first', 'The subject (mubtadaʾ), placed after its predicate', 'The object of فِي'], answer: 1, why: 'The phrase فِي ذَٰلِكَ is the predicate and it comes first. قَسَمٌ is the subject, so it is nominative.' },
    },
    6: {
      words: [
        { role: 'Question and negation', say: 'أَ asks and لَمْ says “not”. It is a question meant to confirm: “you have seen”.' },
        { role: 'Verb, present, jussive', say: 'Jussive after لَمْ, so the last letter of تَرَى has dropped. The seeing is with the heart, which means “know”. The subject “you” is hidden.' },
        { role: 'Question word, “how”', say: 'It is a noun, not a particle, and never changes its ending. al-Jadwal reads it as a ḥāl (a state word) tied to فَعَلَ. It also allows reading it as a verbal noun, like “what great deed”.' },
        { role: 'Verb, past, Form I', say: 'The whole clause fills the place of the two objects of تَرَ. The question word كَيْفَ stops تَرَ from acting on it directly.' },
        { role: 'Subject (fāʿil)', say: 'The one who did it. Nominative with ḍamma. The ending كَ means “your”.' },
        { role: 'Preposition', say: 'The phrase is tied to فَعَلَ: what He did to them.' },
        { role: 'After a preposition', say: 'Genitive with tanwin kasra after بِ. ʿĀd takes full tanwin, so it is not a diptote.' },
      ],
      quiz: { word: 2, q: 'What kind of word is كَيْفَ here?', options: ['A conjunction', 'A particle that opens a quoted question', 'A question word (a noun), read by al-Jadwal as a ḥāl of فَعَلَ'], answer: 2, why: 'كَيْفَ is a noun. al-Jadwal ties it to فَعَلَ as a ḥāl: “in what way did your Lord act”. It also stops تَرَ from acting directly on the clause.' },
    },
    7: {
      words: [
        { role: 'Explanatory apposition (ʿaṭf bayān)', say: 'It says which ʿĀd is meant. al-Jadwal also allows a badal. It is genitive, but it is a name and feminine, so it has no tanwin and shows fatḥa.' },
        { role: 'Adjective (naʿt), first part of a possession', say: 'It describes إِرَمَ, so it is genitive. It means “owner of” (feminine) and owns الْعِمَادِ.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because ذَاتِ owns it. A collective word for tall buildings or pillars.' },
      ],
      quiz: { word: 0, q: 'Why does إِرَمَ end in fatḥa although it is genitive?', options: ['It is a diptote: a feminine name takes fatḥa in the genitive and no tanwin', 'It is really accusative, the object of فَعَلَ', 'It is the first part of a possession'], answer: 0, why: 'A name that is feminine does not take tanwin, and its genitive is shown by fatḥa. It is joined to عَادٍ, so it is genitive.' },
    },
    8: {
      words: [
        { role: 'Relative pronoun, adjective (naʿt) of Iram', say: 'It never changes its ending. al-Jadwal reads it as an adjective of إِرَمَ, so its place is genitive. It also allows a predicate of an unspoken “it is”.' },
        { role: 'Negation', say: 'It means “not” and puts the verb after it in the jussive.' },
        { role: 'Verb, passive, jussive', say: 'It was created. The sukun is the jussive sign after لَمْ. It is passive: the one who creates is not named. This clause explains الَّتِي.' },
        { role: 'Deputy subject (nāʾib fāʿil)', say: 'The thing that was not created: its like. It is nominative. The ending هَا means “it” (Iram).' },
        { role: 'Preposition', say: 'The phrase is tied to يُخْلَقْ: where it was not created.' },
        { role: 'After a preposition', say: 'Genitive with kasra after فِي. A plural of a thing: lands.' },
      ],
      quiz: { word: 3, q: 'Why is مِثْلُهَا nominative?', options: ['It is the subject of a nominal sentence', 'It is the deputy subject of the passive verb يُخْلَقْ', 'It follows لَمْ'], answer: 1, why: 'يُخْلَقْ is passive, so what was not created takes the place of the subject. A subject and a deputy subject are both nominative.' },
    },
    9: {
      words: [
        { role: 'Joining wa', say: 'It joins ثَمُودَ to عَادٍ in verse 6.' },
        { role: 'Joined to ʿĀd', say: 'Genitive, because it is joined to عَادٍ. It is a name and feminine, so it is a diptote: the sign is fatḥa and there is no tanwin.' },
        { role: 'Relative pronoun, adjective (naʿt) of Thamud', say: 'It never changes its ending. It describes ثَمُودَ, so its place is genitive. It is plural because Thamud means a people.' },
        { role: 'Verb, past, Form I, plural', say: 'They cut. The root ج-و-ب is hollow: the middle و turned into alif. The وا is the subject “they”. This clause explains الَّذِينَ.' },
        { role: 'Object (mafʿūl bihi)', say: 'What they cut: the rock. Accusative with fatḥa.' },
        { role: 'Preposition', say: 'The phrase is tied to جَابُوا: where they cut.' },
        { role: 'After a preposition', say: 'Genitive with kasra after بِ. The last ي is not written, to suit the rhyme of the verse.' },
      ],
      quiz: { word: 1, q: 'Why does ثَمُودَ end in fatḥa?', options: ['It is accusative, the object of فَعَلَ', 'It is nominative, the subject of جَابُوا', 'It is genitive, joined to عَادٍ, but a diptote, so fatḥa shows it'], answer: 2, why: 'al-Jadwal reads it as joined to عَادٍ, so it is genitive. A name that is feminine has no tanwin, and fatḥa stands in for the kasra.' },
    },
    10: {
      words: [
        { role: 'Joining wa', say: 'It joins فِرْعَوْنَ to عَادٍ in verse 6.' },
        { role: 'Joined to ʿĀd', say: 'Genitive, like ثَمُودَ in verse 9. A foreign name and a diptote, so the sign is fatḥa and there is no tanwin.' },
        { role: 'One of the five nouns, adjective (naʿt)', say: 'It describes فِرْعَوْنَ, so it is genitive, and the ي shows it. It means “owner of”.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because ذِي owns it. A broken plural of وَتِد: stakes.' },
      ],
      quiz: { word: 2, q: 'What case is ذِي, and how can you tell?', options: ['Genitive: it describes فِرْعَوْنَ, which is genitive, and the ي is the sign', 'Accusative, because فِرْعَوْنَ ends in fatḥa', 'Nominative, because it starts a new sentence'], answer: 0, why: 'فِرْعَوْنَ is genitive even though it ends in fatḥa, because it is a diptote. ذِي describes it and copies the genitive case.' },
    },
    11: {
      words: [
        { role: 'Relative pronoun, adjective (naʿt)', say: 'al-Jadwal reads it as an adjective of فِرْعَوْنَ with a dropped “people of”: “the people of Pharaoh, who…”. It also allows a predicate of an unspoken “they”, said to blame them, or an adjective of all three.' },
        { role: 'Verb, past, Form I, plural', say: 'They went too far. The last letter of the root dropped before the plural وا. This clause explains الَّذِينَ.' },
        { role: 'Preposition', say: 'The phrase is tied to طَغَوْا: where they went too far.' },
        { role: 'After a preposition', say: 'Genitive with kasra after فِي. The same word as in verse 8.' },
      ],
      quiz: { word: 0, q: 'In al-Jadwal first reading, what does الَّذِينَ describe?', options: ['عَادٍ only', 'فِرْعَوْنَ, with a dropped “people of”', 'الْبِلَادِ'], answer: 1, why: 'The plural الَّذِينَ fits “people”, so al-Jadwal reads a dropped word: the people of Pharaoh, who went too far. It also allows other readings.' },
    },
    12: {
      words: [
        { role: 'Joining fa', say: 'It joins this clause to طَغَوْا and means “then”: they went too far, then they increased corruption. It is not a cause-and-effect fa.' },
        { role: 'Verb, past, Form IV, plural', say: 'They increased. Form IV (أَفْعَلَ) here means “did more of it”. The وا is the subject. The clause is joined to طَغَوْا.' },
        { role: 'Preposition and pronoun', say: 'فِي with هَا, “in it”, meaning the lands. The phrase is tied to أَكْثَرُوا. al-Jadwal also allows a ḥāl of the doers.' },
        { role: 'Object (mafʿūl bihi)', say: 'What they increased: the corruption. Accusative with fatḥa.' },
      ],
      quiz: { word: 0, q: 'What kind of فَ is the first word?', options: ['The fa that ties an answer to أَمَّا', 'A fa of cause: “because”', 'A joining fa: “then”'], answer: 2, why: 'al-Jadwal calls it a joining fa. It joins the clause to طَغَوْا and follows it in time; it does not give a reason.' },
    },
    13: {
      words: [
        { role: 'Joining fa', say: 'It joins this clause to أَكْثَرُوا: after the corruption came the punishment.' },
        { role: 'Verb, past, Form I', say: 'He poured. A doubled verb (two identical letters). al-Jadwal reads “pour” as a picture: the punishment is like water poured out.' },
        { role: 'Preposition and pronoun', say: 'عَلَى with هِمْ, “on them”. The phrase is tied to صَبَّ.' },
        { role: 'Subject (fāʿil)', say: 'The one who poured. It comes late in the verse. Nominative; the ending كَ means “your”.' },
        { role: 'Object, first part of a possession', say: 'What He poured: a lash. Accusative with fatḥa. al-Jadwal says “whip” stands for the punishment, and next to the punishment of the next life it is only a whip.' },
        { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because سَوْطَ owns it: “a lash of punishment”.' },
      ],
      quiz: { word: 4, q: 'Why is سَوْطَ accusative?', options: ['It is the object of صَبَّ', 'It is the subject of صَبَّ', 'It follows a preposition'], answer: 0, why: 'The subject is رَبُّكَ. What He poured is the object (mafʿūl bihi), so it is accusative. It is also the first part of a possession with عَذَابٍ.' },
    },
    14: {
      words: [
        { role: 'Particle “indeed”', say: 'It stresses the sentence and puts its subject in the accusative. al-Jadwal says the sentence explains what came before: He did this because He is always watching.' },
        { role: 'Subject of inna', say: 'Accusative with fatḥa, because إِنَّ is in front of it. The ending كَ means “your”.' },
        { role: 'Lām of emphasis', say: 'It adds to the stress of إِنَّ and sits on the predicate.' },
        { role: 'Preposition', say: 'It means “in, at”. The phrase بِالْمِرْصَادِ is the predicate of إِنَّ.' },
        { role: 'After a preposition', say: 'Genitive with kasra after بِ. A noun on the pattern مِفْعَال for a place of watching. al-Jadwal reads the saying as a picture: a man who sits on the road to catch whoever passes.' },
      ],
      quiz: { word: 2, q: 'What does the لَ in لَبِالْمِرْصَادِ do?', options: ['It means “not”', 'It adds emphasis to the predicate, together with إِنَّ', 'It is a preposition meaning “for”'], answer: 1, why: 'It is the lām of emphasis. It stands on the predicate and doubles the stress of إِنَّ.' },
    },
    15: {
      words: [
        { role: 'Resumptive fa', say: 'It opens a new sentence. It does not join anything.' },
        { role: 'Particle of condition and detail', say: 'It means “as for”. It sorts out the cases of the human. Its answer needs a فَ in front.' },
        { role: 'Subject (mubtadaʾ)', say: 'The topic: as for the human. Nominative. Its predicate is the clause يَقُولُ later in the verse.' },
        { role: 'Condition word, “when”', say: 'It is conditional but does not make the verb jussive. al-Jadwal says its own answer is left out, because the answer to أَمَّا shows it. The clause after it completes it (muḍāf ilayhi).' },
        { role: 'Extra particle', say: 'It has no job here. It only adds stress to إِذَا.' },
        { role: 'Verb, past, Form VIII, plus “him”', say: 'He tested him. Form VIII (اِفْتَعَلَ) has a ت after the first letter. The ending هُ is the object. This clause completes إِذَا.' },
        { role: 'Subject (fāʿil)', say: 'Who tested him: his Lord. Nominative. The ending هُ means “his”.' },
        { role: 'Joining fa', say: 'It joins أَكْرَمَهُ to ابْتَلَاهُ: He tested him, then honoured him.' },
        { role: 'Verb, past, Form IV, plus “him”', say: 'He honoured him. Form IV (أَفْعَلَ). هُ is the object. This clause is joined to ابْتَلَاهُ, so it also completes إِذَا.' },
        { role: 'Joining wa', say: 'It joins نَعَّمَهُ to the same clause.' },
        { role: 'Verb, past, Form II, plus “him”', say: 'He gave him comfort. Form II (فَعَّلَ) has a doubled middle letter. هُ is the object.' },
        { role: 'The fa that ties the answer to amma', say: 'A sentence with أَمَّا needs this فَ in front of its answer. It ties the answer to أَمَّا.' },
        { role: 'Verb, present; predicate (khabar) of the human', say: 'He says. The subject “he” is hidden. The whole clause is the predicate of الْإِنسَانُ.' },
        { role: 'Subject (mubtadaʾ)', say: 'My Lord. Nominative; the ي is “my”. This sentence is what he says.' },
        { role: 'Predicate: verb, past, Form IV', say: 'He honoured me. The نِ protects the verb before the ي of “me”, and that ي has dropped to suit the rhyme. The clause is the predicate of رَبِّي.' },
      ],
      quiz: { word: 11, q: 'What does the فَ in فَيَقُولُ do?', options: ['It joins two verbs, like “then”', 'It opens a new sentence', 'It ties the answer to أَمَّا'], answer: 2, why: 'A sentence that starts with أَمَّا needs a فَ in front of its answer. al-Jadwal calls it the fa that links the answer.' },
    },
    16: {
      words: [
        { role: 'Joining wa', say: 'It joins this أَمَّا sentence to the one in verse 15. al-Jadwal parses the two in the same way.' },
        { role: 'Particle of condition and detail', say: 'The same job as in verse 15: the second case of the human.' },
        { role: 'Condition word, “when”', say: 'Same as in verse 15. Its answer is left out, and the clause after it completes it (muḍāf ilayhi).' },
        { role: 'Extra particle', say: 'It has no job. It only adds stress to إِذَا.' },
        { role: 'Verb, past, Form VIII, plus “him”', say: 'He tested him. هُ is the object. The subject “He” is hidden, because this verse does not repeat رَبُّهُ.' },
        { role: 'Joining fa', say: 'It joins قَدَرَ to ابْتَلَاهُ: He tested him, then restricted.' },
        { role: 'Verb, past, Form I', say: 'He tightened. With عَلَى it means to limit what someone receives. This clause is joined to ابْتَلَاهُ.' },
        { role: 'Preposition and pronoun', say: 'عَلَى with هِ, “on him”. The phrase is tied to قَدَرَ.' },
        { role: 'Object, plus “his”', say: 'What He restricted: his provision. Accusative with fatḥa. The ending هُ means “his”.' },
        { role: 'The fa that ties the answer to amma', say: 'The same as in verse 15: it ties the answer to أَمَّا.' },
        { role: 'Verb, present', say: 'He says. The subject is an unspoken “he” (the human), because this verse does not repeat الْإِنسَانُ. The clause is the predicate of that unspoken subject.' },
        { role: 'Subject (mubtadaʾ)', say: 'My Lord. Nominative. This sentence is what he says.' },
        { role: 'Predicate: verb, past, Form IV', say: 'He humiliated me. Form IV (أَفْعَلَ) turns ه-و-ن, “to be small”, into “to make small”. The نِ protects the verb before the dropped ي of “me”.' },
      ],
      quiz: { word: 10, q: 'What is the subject of يَقُولُ in this verse?', options: ['An unspoken “he”: the human from verse 15', 'الْإِنسَانُ, written again in this verse', 'رَبِّي'], answer: 0, why: 'Verse 16 does not repeat الْإِنسَانُ. al-Jadwal reads an unspoken “he” as the subject, and the clause يَقُولُ is its predicate.' },
    },
    17: {
      words: [
        { role: 'Rebuke particle', say: 'A word of rebuke: “no, stop that”. al-Jadwal says it scolds the idea of verses 15-16. It never changes its ending.' },
        { role: 'Particle that moves on', say: 'It moves on to a new point: “rather, here is the real problem”. It does not cancel what came before.' },
        { role: 'Negation', say: 'It means “not” and negates the verb after it.' },
        { role: 'Verb, present, Form IV, plural', say: 'You honour. Indicative: the ن is the sign. The و is the subject “you”. This is a new sentence.' },
        { role: 'Object (mafʿūl bihi)', say: 'Who is not honoured: the orphan. Accusative with fatḥa.' },
      ],
      quiz: { word: 1, q: 'What does بَل do here?', options: ['It cancels the verses before it: “no, that was wrong”', 'It moves on to a new point', 'It asks a question'], answer: 1, why: 'al-Jadwal calls it a particle that moves on. The verses before are not cancelled; the speech turns to the real problem.' },
    },
    18: {
      words: [
        { role: 'Joining wa', say: 'It joins this sentence to لَا تُكْرِمُونَ in verse 17.' },
        { role: 'Negation', say: 'It means “not” and negates the verb after it.' },
        { role: 'Verb, present, Form VI, plural', say: 'You urge each other. Form VI (تَفَاعَلَ) means doing it to one another. One ت has dropped from تَتَحَاضُّونَ. The doubled ض is two identical root letters.' },
        { role: 'Preposition', say: 'The phrase is tied to تَحَاضُّونَ: what they do not urge each other to do.' },
        { role: 'After a preposition, first part of a possession', say: 'Genitive with kasra after عَلَىٰ. al-Jadwal reads it as “feeding” (إِطْعَام). It owns الْمِسْكِينِ.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because طَعَامِ owns it.' },
      ],
      quiz: { word: 2, q: 'What does Form VI add to تَحَاضُّونَ?', options: ['It makes the verb passive', 'It makes someone else do the action', 'It means doing it to one another'], answer: 2, why: 'Form VI (تَفَاعَلَ) often means that people do the action to each other. They do not urge each other to feed the poor.' },
    },
    19: {
      words: [
        { role: 'Joining wa', say: 'It joins this sentence to لَا تُكْرِمُونَ in verse 17.' },
        { role: 'Verb, present, Form I, plural', say: 'You eat. The ن is the sign of the indicative. The و is the subject “you”.' },
        { role: 'Object (mafʿūl bihi)', say: 'What they eat: inheritance. Accusative with fatḥa. The first root letter و turned into ت.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'It comes from the same root as the verb and stresses it. Accusative with tanwin. It says how: “an eating”.' },
        { role: 'Adjective (naʿt)', say: 'It describes أَكْلًا, so it is accusative with tanwin. It is a verbal noun meaning “gathering”, used like an adjective: a great gathering of everything.' },
      ],
      quiz: { word: 3, q: 'Why is أَكْلًا accusative?', options: ['It is a mafʿūl muṭlaq: a noun from the same root that stresses the verb', 'It is the object of تَأْكُلُونَ', 'It follows a preposition'], answer: 0, why: 'The object is التُّرَاثَ. أَكْلًا comes from the same root as the verb and stresses it, so it is a mafʿūl muṭlaq. Such a word is accusative.' },
    },
    20: {
      words: [
        { role: 'Joining wa', say: 'It joins this sentence to لَا تُكْرِمُونَ in verse 17.' },
        { role: 'Verb, present, Form IV, plural', say: 'You love. Form IV (أَفْعَلَ). The two identical root letters merge into a doubled ب. The ن is the sign of the indicative; the و is the subject “you”.' },
        { role: 'Object (mafʿūl bihi)', say: 'What they love: wealth. Accusative with fatḥa.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'From the same root as the verb. al-Jadwal says it stands in for the verbal noun of the verb, which it can do because it is a noun of the act (ism maṣdar). Accusative with tanwin.' },
        { role: 'Adjective (naʿt)', say: 'It describes حُبًّا, so it is accusative with tanwin. It means “abundant”. al-Jadwal also calls it a verbal noun used as a description.' },
      ],
      quiz: { word: 3, q: 'Which word does جَمًّا describe?', options: ['الْمَالَ', 'حُبًّا', 'تُحِبُّونَ'], answer: 1, why: 'جَمًّا means “abundant”. It describes حُبًّا, the love, and copies its accusative case. It does not describe the wealth.' },
    },
    21: {
      words: [
        { role: 'Rebuke particle', say: 'al-Jadwal says it scolds those who gather wealth and hold it back.' },
        { role: 'Condition word, “when”', say: 'A time word with a condition in it, but it does not make the verb jussive. It is tied to its answer يَتَذَكَّرُ in verse 23. The clause after it completes it (muḍāf ilayhi).' },
        { role: 'Verb, past, passive', say: 'It was pounded. Passive: the one who pounds is not named. The ت shows a feminine subject.' },
        { role: 'Deputy subject (nāʾib fāʿil)', say: 'What was pounded: the earth. Nominative, because it takes the place of the subject of the passive verb.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'The same root as the verb; it stresses the act. Accusative with tanwin.' },
        { role: 'Confirmation (tawkīd)', say: 'The same word said again to stress the first. Same case: accusative with tanwin. Pounding upon pounding.' },
      ],
      quiz: { word: 5, q: 'What is the second دَكًّا?', options: ['A new object of دُكَّتِ', 'A ḥāl of الْأَرْضُ', 'The first دَكًّا said again to stress it'], answer: 2, why: 'al-Jadwal says the second دَكًّا confirms the first (tawkīd), so it has the same case: accusative.' },
    },
    22: {
      words: [
        { role: 'Joining wa', say: 'It joins the clause جَاءَ رَبُّكَ to دُكَّتِ in verse 21, so this clause also completes إِذَا.' },
        { role: 'Verb, past, Form I', say: 'He came. The past tense is used for something still to come, to make it certain. al-Jadwal reads “your Lord came” as “the command of your Lord came”, with a dropped first word.' },
        { role: 'Subject (fāʿil)', say: 'Nominative. The ending كَ means “your”.' },
        { role: 'Joining wa', say: 'It joins الْمَلَكُ to رَبُّكَ.' },
        { role: 'Second subject', say: 'Joined to رَبُّكَ, so it is nominative too. One form that stands for all the angels.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'al-Jadwal reads it like دَكًّا in verse 21: accusative with tanwin. It means “a row, a rank”.' },
        { role: 'Confirmation (tawkīd)', say: 'The same word again, to stress the first: rank after rank.' },
      ],
      quiz: { word: 5, q: 'How does al-Jadwal read the first صَفًّا?', options: ['As a mafʿūl muṭlaq, like دَكًّا in verse 21', 'As a ḥāl of الْمَلَكُ', 'As the object of جَاءَ'], answer: 0, why: 'al-Jadwal treats it like دَكًّا in verse 21. The second صَفًّا confirms the first.' },
    },
    23: {
      words: [
        { role: 'Joining wa', say: 'It joins the clause جِيءَ بِجَهَنَّمَ to دُكَّتِ, so this clause also completes إِذَا.' },
        { role: 'Verb, past, passive', say: 'It was brought. Passive, so the one who brings is not named. The phrase بِجَهَنَّمَ takes the place of the subject.' },
        { role: 'Time word', say: 'Accusative (or built, because of إِذٍ). al-Jadwal reads it as a badal of إِذَا in verse 21: “when the earth is pounded… on that Day”.' },
        { role: 'Preposition', say: 'It means “with”. The phrase بِجَهَنَّمَ takes the place of the subject of جِيءَ.' },
        { role: 'After a preposition', say: 'Genitive. It is a name and feminine, so it is a diptote: fatḥa and no tanwin.' },
        { role: 'Confirmation (tawkīd)', say: 'The same time word again, to stress the first one.' },
        { role: 'Verb, present, Form V', say: 'He will remember. Form V (تَفَعَّلَ) adds a reflexive sense, like “call to mind”. This clause is the answer to إِذَا.' },
        { role: 'Subject (fāʿil)', say: 'Who will remember: the human. Nominative.' },
        { role: 'Wa of the circumstance (ḥāl)', say: 'al-Jadwal reads it as a ḥāl wa: the clause after it tells his state. It also allows a wa that breaks in (parenthetical).' },
        { role: 'Question word, “how?”', say: 'A noun, not a particle. An adverb of place in the accusative position, tied to the predicate that comes first.' },
        { role: 'Preposition and pronoun', say: 'لَ with هُ, “for him”. The phrase is also tied to the predicate that comes first.' },
        { role: 'Subject (mubtadaʾ), delayed', say: 'The remembering. The predicate أَنَّىٰ لَهُ comes first. Nominative; the ending is an alif maqṣūra, so no ḍamma shows.' },
      ],
      quiz: { word: 8, q: 'Which kind of وَ does al-Jadwal give first for وَأَنَّىٰ?', options: ['A joining wa', 'A wa of the circumstance (ḥāl)', 'An oath wa'], answer: 1, why: 'The clause أَنَّىٰ لَهُ الذِّكْرَىٰ tells his state: he remembers, but remembering no longer helps him. al-Jadwal also allows a wa that breaks in.' },
    },
    24: {
      words: [
        { role: 'Verb, present, Form I', say: 'He says. The subject is the human. al-Jadwal reads the clause as an explanation of the remembering in verse 23.' },
        { role: 'Alerting particle', say: 'It does not call anyone. It draws attention to the wish: “Oh!”' },
        { role: 'Wish particle, plus “me”', say: 'لَيْتَ is one of the sisters of إِنَّ. The نِ is only a protecting letter before the ي of “me”. The ي is its noun (ism), in the accusative position.' },
        { role: 'Verb, past, Form II, plus “I”', say: 'I sent ahead. Form II (فَعَّلَ). The تُ is the subject “I”. The clause is the predicate of لَيْتَ.' },
        { role: 'Preposition', say: 'It means “for”. The phrase is tied to قَدَّمْتُ.' },
        { role: 'After a preposition', say: 'Genitive with kasra after لِ. The ي is “my”.' },
      ],
      quiz: { word: 2, q: 'What is the ي in لَيْتَنِي?', options: ['The subject of قَدَّمْتُ', 'The predicate of لَيْتَ', 'The noun (ism) of لَيْتَ, in the accusative position'], answer: 2, why: 'لَيْتَ works like إِنَّ, so its noun is accusative. The نِ is only a protecting letter. The predicate is the clause قَدَّمْتُ لِحَيَاتِي.' },
    },
    25: {
      words: [
        { role: 'Resumptive fa', say: 'It opens a new sentence. It does not give a reason.' },
        { role: 'Time word', say: 'Accusative. It is tied to the negated verb يُعَذِّبُ: on that Day no one will punish like this.' },
        { role: 'Negation', say: 'It means “not” and negates the verb.' },
        { role: 'Verb, present, Form II', say: 'He punishes. Form II (يُفَعِّلُ) has a doubled middle letter. This sentence has no place in the grammar.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'al-Jadwal says it stands in for the verbal noun, which it can do because it is a noun of the act. The ending هُ refers to Allah. Accusative with fatḥa.' },
        { role: 'Subject (fāʿil)', say: 'Anyone. Nominative with tanwin.' },
      ],
      quiz: { word: 0, q: 'What kind of فَ is this?', options: ['A resumptive fa: it opens a new sentence', 'A fa of cause: “because”', 'A fa that ties an answer to أَمَّا'], answer: 0, why: 'al-Jadwal calls it a resumptive fa. The sentence is new and has no place in the grammar.' },
    },
    26: {
      words: [
        { role: 'Joining wa', say: 'It joins this sentence to the one in verse 25.' },
        { role: 'Negation', say: 'It means “not” and negates the verb.' },
        { role: 'Verb, present, Form IV', say: 'He ties up. Form IV (يُفْعِلُ).' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'Parsed like عَذَابَهُ in verse 25: a noun of the act standing in for the verbal noun. Accusative. The ending هُ refers to Allah.' },
        { role: 'Subject (fāʿil)', say: 'Anyone. Nominative with tanwin.' },
      ],
      quiz: { word: 3, q: 'What is وَثَاقَهُ?', options: ['The subject of يُوثِقُ', 'A mafʿūl muṭlaq, like عَذَابَهُ in verse 25', 'A ḥāl'], answer: 1, why: 'It comes from the same root as يُوثِقُ and stands in for the verbal noun. The sentence means “no one binds as He binds”.' },
    },
    27: {
      words: [
        { role: 'Calling particle', say: 'It means “O” and calls the one addressed.' },
        { role: 'Called noun (munādā)', say: 'A specific but unnamed noun. It is built on ḍamma and does not change; its place is accusative. هَا only draws attention.' },
        { role: 'Badal', say: 'It says who is meant. al-Jadwal reads it as a badal of أَيَّتُ and also allows an explaining apposition. It is nominative because it follows the ḍamma of أَيَّتُ.' },
        { role: 'Adjective (naʿt)', say: 'It describes النَّفْسُ, so it copies its nominative case. It is feminine, like النَّفْسُ. From the verb اطْمَأَنَّ, “to be at rest”.' },
      ],
      quiz: { word: 2, q: 'Why does النَّفْسُ end in ḍamma?', options: ['It is the subject of a sentence', 'It is the object of يَا', 'It follows أَيَّتُ, which is built on ḍamma'], answer: 2, why: 'al-Jadwal reads النَّفْسُ as a badal of أَيَّتُ. The called noun is built on ḍamma, and the badal follows it in form.' },
    },
    28: {
      words: [
        { role: 'Command, feminine singular', say: 'Return. The ي is the subject “you” (feminine). The command is built (mabni) on the loss of the ن. This clause answers the call in verse 27.' },
        { role: 'Preposition', say: 'It means “to”. The phrase is tied to ارْجِعِي.' },
        { role: 'After a preposition', say: 'Genitive with kasra after إِلَىٰ. The ending كِ is “your” (feminine).' },
        { role: 'State word (ḥāl)', say: 'It tells the state of the one who returns: pleased. Accusative with tanwin. It is an active participle: she is pleased.' },
        { role: 'Second state word (ḥāl)', say: 'A second description of the one who returns. Accusative with tanwin. It is a passive participle: she is the one God is pleased with.' },
      ],
      quiz: { word: 3, q: 'What is رَاضِيَةً in this verse?', options: ['A state word (ḥāl) of the one who returns', 'An adjective of رَبِّكِ', 'The object of ارْجِعِي'], answer: 0, why: 'It tells in what state the soul returns, so it is a ḥāl from the doer of ارْجِعِي. It cannot describe رَبِّكِ, which is masculine and genitive.' },
    },
    29: {
      words: [
        { role: 'Joining fa', say: 'It joins this command to ارْجِعِي: first return, then enter.' },
        { role: 'Command, feminine singular', say: 'Enter. The ي is the subject “you” (feminine). Built (mabni) on the loss of the ن.' },
        { role: 'Preposition', say: 'It means “in, among”. The phrase is tied to ادْخُلِي. al-Jadwal reads a dropped word, “in the company of”.' },
        { role: 'After a preposition', say: 'Genitive with kasra. A broken plural of عَبْد. The ي is “my”: My servants.' },
      ],
      quiz: { word: 2, q: 'According to al-Jadwal, what is unspoken in فِي عِبَادِي?', options: ['A dropped verb: “and be”', 'A dropped word: “in the company of” My servants', 'Nothing is missing'], answer: 1, why: 'al-Jadwal reads a dropped word before عِبَادِي: enter “in the company of” My servants.' },
    },
    30: {
      words: [
        { role: 'Joining wa', say: 'It joins this command to the earlier commands.' },
        { role: 'Command, feminine singular', say: 'Enter, again. The same form as in verse 29. This clause is joined to the answer to the call.' },
        { role: 'Object (mafʿūl bihi)', say: 'What she enters: My Paradise. Accusative; the sign is hidden because of the ي of “my”. The verb دَخَلَ takes a place as its object.' },
      ],
      quiz: { word: 2, q: 'Why is جَنَّتِي accusative?', options: ['It is the second part of a possession', 'It follows the preposition فِي', 'It is the object of ادْخُلِي'], answer: 2, why: 'دَخَلَ takes the place it enters as a direct object. جَنَّتِي is that object. The ي is “my”, so the accusative sign is hidden.' },
    },
  },
};
