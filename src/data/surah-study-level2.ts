// Plain-English teaching layer for the surahs read after Level 2: Al-Humazah, Al-Fil, Al-Maun, Al-Kawthar,
// Al-Kafirun, An-Nasr and Al-Masad. Same shape and rules as in surah-study.ts.
//
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Where al-Jadwal gives more than one reading, the line says which one it follows. Someone
// who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from './surah-study';

export const LEVEL_2: Record<string, SurahStudy> = {
  '104-al-humazah': {
    verses: {
      1: {
        words: [
          { role: 'Subject (mubtadaʾ)', say: 'It opens the sentence, so it is nominative. It has tanwin and can still start a sentence, because it is a curse.' },
          { role: 'Preposition', say: 'The لِ is joined to the lām of كُلِّ, so it is written with a shadda. The phrase belongs to a predicate that is left unsaid, like “is for”.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive after لِ. It owns هُمَزَةٍ, so it has no al-.' },
          { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because كُلِّ owns it. The pattern فُعَلَة names someone who does it all the time.' },
          { role: 'Adjective (naʿt)', say: 'It describes هُمَزَةٍ, so it copies its genitive case. al-Jadwal also allows reading it as the same word said again for emphasis.' },
        ],
        quiz: { word: 4, q: 'What does لُمَزَةٍ do in this verse?', options: ['It is the subject', 'It describes هُمَزَةٍ and copies its case', 'It is a verb'], answer: 1, why: 'al-Jadwal reads it as an adjective (naʿt) of هُمَزَةٍ. An adjective takes the case of the word it describes, so it is genitive.' },
      },
      2: {
        words: [
          { role: 'Relative pronoun, badal of “every”', say: 'al-Jadwal reads it as a badal of كُلِّ: it stands in its place and says who is meant. It never changes its ending, so only its position is genitive.' },
          { role: 'Past verb', say: 'This clause explains الَّذِي. The subject “he” is hidden inside the verb.' },
          { role: 'Object', say: 'What he gathered. It is accusative, with tanwin fatḥa.' },
          { role: 'And', say: 'وَ joins the second verb to the first.' },
          { role: 'Verb, past, Form II, plus “it”', say: 'Form II (فَعَّلَ) has a doubled middle letter and adds repetition. The ending هُ means “it” and points back to مَالًا.' },
        ],
        quiz: { word: 4, q: 'What does the doubled دّ in عَدَّدَهُ add?', options: ['It makes the verb passive', 'It makes it a command', 'He did it again and again'], answer: 2, why: 'Form II often adds repetition. عَدَّ is one count; عَدَّدَ is counting over and over.' },
      },
      3: {
        words: [
          { role: 'Verb, present', say: 'The whole clause is a ḥāl in al-Jadwal: it tells the state of the man while he counts. The subject “he” is hidden.' },
          { role: 'Particle “that”, like إِنَّ', say: 'It opens what he thinks. It puts the next noun in the accusative, like إِنَّ.' },
          { role: 'Noun of أَنَّ', say: 'It is accusative because أَنَّ stands in front of it. The ending هُ means “his”.' },
          { role: 'Predicate of أَنَّ', say: 'This past verb with its clause is the predicate. Form IV (أَفْعَلَ) makes someone else do the action. The ending هُ means “him”.' },
        ],
        quiz: { word: 2, q: 'Why is مَالَهُ accusative?', options: ['It follows a preposition', 'أَنَّ is in front of it and puts it in the accusative', 'It is the object of يَحْسَبُ'], answer: 1, why: 'أَنَّ works like إِنَّ: it puts its noun in the accusative. The whole أَنَّ clause then fills the place of the two objects of يَحْسَبُ.' },
      },
      4: {
        words: [
          { role: 'Rebuke', say: 'A word that says “no, stop”. It rejects what the verse before said.' },
          { role: 'Lām of the oath', say: 'al-Jadwal reads an oath that is not spoken, and this لَ answers it.' },
          { role: 'Verb, passive, with strong nūn', say: 'It is passive: the one who throws is not named. The strong nūn fixes the ending on fatḥa. This clause is the answer to the oath.' },
          { role: 'Preposition', say: 'It belongs to يُنبَذَنَّ: the place where he is thrown.' },
          { role: 'After a preposition', say: 'Genitive with kasra after فِي. The pattern فُعَلَة names what crushes all the time.' },
        ],
        quiz: { word: 1, q: 'What is the job of لَ in لَيُنبَذَنَّ?', options: ['It means “not”', 'It answers an oath that is not spoken', 'It makes the verb past'], answer: 1, why: 'al-Jadwal reads the verse as the answer to an oath that is left out. The لَ and the strong nūn work as a pair.' },
      },
      5: {
        words: [
          { role: 'Aside (parenthetical) wa', say: 'al-Jadwal calls this وَ parenthetical: it breaks in with a question and does not join two statements.' },
          { role: 'Question word, subject', say: 'It starts a sentence, so it is the subject. The next word says something about it.' },
          { role: 'Verb, Form IV, plus “you”', say: 'Its clause is the predicate of the first مَا. The ending كَ is the first object: “you”. The clause that follows fills the place of the second object.' },
          { role: 'Question word, subject', say: 'A second subject, in its own short sentence. That sentence fills the place of the second object of أَدْرَىٰكَ.' },
          { role: 'Predicate', say: 'It says what the second مَا is about. It is nominative with ḍamma.' },
        ],
        quiz: { word: 2, q: 'What are the objects of أَدْرَىٰكَ?', options: ['الْحُطَمَةُ only', 'It has no object', 'كَ and the clause مَا الْحُطَمَةُ'], answer: 2, why: 'The verb takes two objects. The pronoun كَ is the first, and the question مَا الْحُطَمَةُ fills the place of the second.' },
      },
      6: {
        words: [
          { role: 'Predicate of an unspoken “it”', say: 'The subject هِيَ (the Crusher) is left out. This word says what it is. It is nominative and the first part of a possession.' },
          { role: 'Second part of a possession', say: 'Genitive with kasra, because نَارُ owns it.' },
          { role: 'Adjective (naʿt)', say: 'It describes نَارُ, so it copies its nominative case. The ة shows that it is feminine, like the fire.' },
        ],
        quiz: { word: 2, q: 'Which word does الْمُوقَدَةُ describe?', options: ['اللَّهِ', 'نَارُ', 'الْحُطَمَةُ'], answer: 1, why: 'An adjective follows the word it describes and copies its case. الْمُوقَدَةُ is nominative, like نَارُ.' },
      },
      7: {
        words: [
          { role: 'Relative pronoun, second adjective', say: 'al-Jadwal reads it as a second adjective of نَارُ, after الْمُوقَدَةُ. It never changes its ending, so only its position is nominative.' },
          { role: 'Verb, present, Form VIII', say: 'This clause explains الَّتِي. Form VIII (اِفْتَعَلَ) has a ت after the first letter; here it joined the ط and made a doubled letter. The subject “it” is hidden.' },
          { role: 'Preposition', say: 'It belongs to تَطَّلِعُ.' },
          { role: 'After a preposition', say: 'Genitive with kasra after عَلَى. A broken plural.' },
        ],
        quiz: { word: 1, q: 'Why does تَطَّلِعُ have a doubled ط?', options: ['It is Form II', 'The ت of Form VIII joined the ط', 'It is a passive verb'], answer: 1, why: 'Form VIII puts a ت after the first letter: اِطْتَلَعَ. After ط the ت joins it and makes the doubled ط.' },
      },
      8: {
        words: [
          { role: 'Particle إِنَّ and its noun “it”', say: 'إِنَّ stresses the sentence. The ending هَا means “it” (the fire). It is the noun of إِنَّ, so it is accusative.' },
          { role: 'Prepositional phrase', say: 'It belongs to مُؤْصَدَةٌ, which comes after it. It says who the closing is on.' },
          { role: 'Predicate of إِنَّ', say: 'A passive participle with tanwin ḍamma. It is the predicate, so it stays nominative.' },
        ],
        quiz: { word: 1, q: 'Which word does عَلَيْهِم belong to?', options: ['إِنَّهَا', 'الْأَفْئِدَةِ', 'مُؤْصَدَةٌ'], answer: 2, why: 'al-Jadwal ties the phrase to مُؤْصَدَةٌ. It comes before the word it belongs to.' },
      },
      9: {
        words: [
          { role: 'Preposition', say: 'In al-Jadwal the phrase belongs to a second predicate of إِنَّ from verse 8 that is left unsaid, like “it is in…”.' },
          { role: 'After a preposition', say: 'Genitive with tanwin kasra after فِي. It is a broken plural.' },
          { role: 'Adjective (naʿt)', say: 'It describes عَمَدٍ, so it is genitive with tanwin. It is feminine singular, because a plural of things takes the feminine singular.' },
        ],
        quiz: { word: 2, q: 'Why is مُمَدَّدَةٍ feminine singular?', options: ['It describes a plural of things, which takes the feminine singular', 'It describes a person', 'It is a verb'], answer: 0, why: 'A plural of things is treated like one feminine word. عَمَدٍ is such a plural, so its adjective is feminine singular.' },
      },
    },
  },

  '105-al-fil': {
    verses: {
      1: {
        words: [
          { role: 'Question and negation', say: 'أَ asks and لَمْ says “not”. al-Jadwal calls it a question that expects yes: “you did see”. It also allows a question of wonder.' },
          { role: 'Verb, jussive', say: 'After لَمْ the verb is jussive, so its last letter dropped (تَرَى became تَرَ). The subject “you” is hidden.' },
          { role: 'Question word', say: 'al-Jadwal reads it as standing in place of a verbal noun, like “what great deed”. It also allows a ḥāl. It never changes its ending.' },
          { role: 'Past verb', say: 'This clause fills the place of the two objects of تَرَ. The question word كَيْفَ stops تَرَ from working on it directly.' },
          { role: 'Subject (fāʿil)', say: 'The one who did the act. It is nominative with ḍamma. The ending كَ means “your”.' },
          { role: 'Preposition', say: 'The phrase belongs to فَعَلَ: what He did to them.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive with kasra after بِ. It owns الْفِيلِ.' },
          { role: 'Second part of a possession', say: 'Genitive with kasra, because أَصْحَابِ owns it.' },
        ],
        quiz: { word: 1, q: 'Why did the last letter of تَرَى drop in تَرَ?', options: ['It is a command', 'لَمْ makes the verb jussive', 'It is passive'], answer: 1, why: 'After لَمْ a present verb is jussive. For a verb that ends in a weak letter, the jussive drops that letter.' },
      },
      2: {
        words: [
          { role: 'Question and negation', say: 'The same as in verse 1: a question that expects yes.' },
          { role: 'Verb, jussive', say: 'The sukun on the last letter is the jussive sign after لَمْ. The subject “He” is hidden.' },
          { role: 'First object', say: 'Accusative with fatḥa. The ending هُمْ means “their”.' },
          { role: 'Preposition', say: 'In al-Jadwal the phrase fills the place of the second object of يَجْعَلْ.' },
          { role: 'After a preposition', say: 'Genitive with tanwin kasra. A verbal noun of Form II (تَفْعِيل).' },
        ],
        quiz: { word: 2, q: 'What kind of word is كَيْدَهُمْ?', options: ['The subject', 'The first object of يَجْعَلْ', 'A word after a preposition'], answer: 1, why: 'يَجْعَلْ takes two objects. كَيْدَهُمْ is the first, and فِي تَضْلِيلٍ fills the place of the second.' },
      },
      3: {
        words: [
          { role: 'And', say: 'وَ joins this clause to the one before it.' },
          { role: 'Past verb, Form IV', say: 'The subject “He” is hidden. Form IV (أَفْعَلَ) here sends something out.' },
          { role: 'Prepositional phrase', say: 'It belongs to أَرْسَلَ: sent against them.' },
          { role: 'Object', say: 'Accusative with tanwin fatḥa. It is a collective word, so it can mean one bird or many.' },
          { role: 'Adjective (naʿt)', say: 'It describes طَيْرًا, so it is accusative too. It has no tanwin, because its pattern blocks it.' },
        ],
        quiz: { word: 4, q: 'Why does أَبَابِيلَ end in a fatḥa and have no tanwin?', options: ['It is the subject', 'It is a verb', 'It is accusative, and its pattern blocks tanwin'], answer: 2, why: 'It describes طَيْرًا, so it is accusative. Words on the pattern مَفَاعِيل do not take tanwin.' },
      },
      4: {
        words: [
          { role: 'Verb, present', say: 'The whole clause is a second adjective of طَيْرًا: birds that strike them. The hidden subject is feminine. The ending هِم means “them”.' },
          { role: 'Preposition', say: 'The phrase belongs to تَرْمِيهِم: what they struck with.' },
          { role: 'After a preposition', say: 'Genitive with tanwin kasra after بِ.' },
          { role: 'Preposition', say: 'In al-Jadwal the phrase belongs to a missing adjective of حِجَارَةٍ: stones that come “from” something.' },
          { role: 'After a preposition', say: 'Genitive with tanwin kasra after مِن.' },
        ],
        quiz: { word: 0, q: 'What does the clause تَرْمِيهِم do?', options: ['It starts a new, unrelated sentence', 'It describes the birds from verse 3', 'It is a command'], answer: 1, why: 'al-Jadwal reads it as a second adjective (naʿt) of طَيْرًا: birds that strike them.' },
      },
      5: {
        words: [
          { role: 'And then', say: 'al-Jadwal says it joins this clause to أَرْسَلَ. It shows what came next.' },
          { role: 'Past verb, plus “them”', say: 'The subject “He” is hidden. The ending هُمْ is the first object. The phrase after it fills the place of the second object.' },
          { role: 'Preposition', say: 'It means “like”. It starts the phrase that fills the second object.' },
          { role: 'After a preposition', say: 'Genitive with tanwin kasra after كَ.' },
          { role: 'Adjective (naʿt)', say: 'It describes عَصْفٍ, so it copies its genitive case. A passive participle: it names what was done to the straw.' },
        ],
        quiz: { word: 4, q: 'Why is مَّأْكُولٍ genitive?', options: ['It follows مِن', 'It is a verb', 'It describes عَصْفٍ, which is genitive'], answer: 2, why: 'An adjective copies the case of the word it describes. عَصْفٍ is genitive after كَ.' },
      },
    },
  },

  '107-al-maun': {
    verses: {
      1: {
        words: [
          { role: 'Question', say: 'أَ asks a question. It wants the listener to look, not to give an answer.' },
          { role: 'Past verb, plus “you”', say: 'Here “see” means “consider”. The ending تَ is the subject: “you”.' },
          { role: 'Relative pronoun, object', say: 'It is the object of رَأَيْتَ, so it is in the accusative position. It never changes its ending.' },
          { role: 'Verb, present, Form II', say: 'This clause explains الَّذِي. Form II (فَعَّلَ) means to call something a lie. The subject “he” is hidden.' },
          { role: 'Preposition', say: 'The phrase belongs to يُكَذِّبُ.' },
          { role: 'After a preposition', say: 'Genitive with kasra after بِ.' },
        ],
        quiz: { word: 3, q: 'What does the clause يُكَذِّبُ بِالدِّينِ do?', options: ['It is a command', 'It is the subject of رَأَيْتَ', 'It explains الَّذِي: who the person is'], answer: 2, why: 'A clause after الَّذِي completes it and says who is meant. It has no place of its own in the grammar.' },
      },
      2: {
        words: [
          { role: 'Fa of the answer', say: 'al-Jadwal: it links the answer to an unspoken “if”: if you ask who he is, then that is the one.' },
          { role: 'Subject (mubtadaʾ)', say: 'It points to the person from verse 1. It starts the sentence, so it is the subject.' },
          { role: 'Predicate (khabar)', say: 'It says who ذَٰلِكَ is. It never changes its ending, so only its position is nominative.' },
          { role: 'Verb, present', say: 'This clause explains الَّذِي. The subject “he” is hidden.' },
          { role: 'Object', say: 'Accusative with fatḥa.' },
        ],
        quiz: { word: 2, q: 'What is الَّذِي in this verse?', options: ['The object of a verb', 'The predicate of ذَٰلِكَ', 'The second part of a possession'], answer: 1, why: 'ذَٰلِكَ الَّذِي is a sentence: ذَٰلِكَ is the subject, and الَّذِي with its clause is the predicate.' },
      },
      3: {
        words: [
          { role: 'And', say: 'وَ joins this clause to the clause of يَدُعُّ.' },
          { role: 'Negation', say: 'It says “not” and does not change the mood of the verb.' },
          { role: 'Verb, present', say: 'The ending is a ḍamma, the ordinary ending. لَا does not change it. The subject “he” is hidden.' },
          { role: 'Preposition', say: 'The phrase belongs to يَحُضُّ: he urges toward something.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive after عَلَىٰ. It owns الْمِسْكِينِ, so it has no al-.' },
          { role: 'Second part of a possession', say: 'Genitive with kasra, because طَعَامِ owns it.' },
        ],
        quiz: { word: 1, q: 'Does لَا change the mood of يَحُضُّ?', options: ['Yes, it makes it jussive', 'No, the verb keeps its ḍamma', 'Yes, it makes it passive'], answer: 1, why: 'Only لَمْ makes a present verb jussive. After لَا the verb keeps its ordinary ḍamma ending.' },
      },
      4: {
        words: [
          { role: 'New sentence', say: 'al-Jadwal calls this فَ a new start. The surah now turns to the people who pray.' },
          { role: 'Subject (mubtadaʾ)', say: 'It starts the sentence, so it is nominative. Tanwin is allowed because it is a curse.' },
          { role: 'Preposition', say: 'The phrase belongs to the predicate, which is left unsaid: “is for”.' },
          { role: 'After a preposition', say: 'Genitive. The ـِينَ ending is the genitive ending of this plural. It is an active participle of Form II.' },
        ],
        quiz: { word: 1, q: 'Why can وَيْلٌ start a sentence even with tanwin?', options: ['It has al-', 'It is a curse or a prayer', 'It is a verb'], answer: 1, why: 'A word with tanwin is normally too vague to start a sentence. al-Jadwal says وَيْلٌ is allowed because it shows a prayer or a curse.' },
      },
      5: {
        words: [
          { role: 'Relative pronoun, adjective', say: 'It describes الْمُصَلِّينَ, so its position is genitive. al-Jadwal also allows a predicate of an unspoken “they”.' },
          { role: 'Subject (mubtadaʾ)', say: 'It starts the clause, so it is the subject. Its predicate is the last word.' },
          { role: 'Preposition', say: 'The phrase belongs to سَاهُونَ: heedless away from their prayer.' },
          { role: 'After a preposition', say: 'Genitive with kasra after عَن. The ending هِمْ means “their”.' },
          { role: 'Predicate (khabar)', say: 'An active participle. The ـُونَ ending is the nominative ending of this plural.' },
        ],
        quiz: { word: 4, q: 'Why does سَاهُونَ end in ـُونَ?', options: ['It is genitive after عَن', 'It is accusative', 'It is nominative, the predicate of هُمْ'], answer: 2, why: 'A predicate is nominative. For this plural, the nominative ending is ـُونَ.' },
      },
      6: {
        words: [
          { role: 'Relative pronoun, second adjective', say: 'al-Jadwal reads it like the first الَّذِينَ, an adjective of الْمُصَلِّينَ. It also allows a badal of the first.' },
          { role: 'Subject (mubtadaʾ)', say: 'It starts the clause, so it is the subject.' },
          { role: 'Predicate (khabar), verb', say: 'A verb can be a predicate. Form III (فَاعَلَ) here means doing something so that others see it.' },
        ],
        quiz: { word: 2, q: 'What is يُرَاءُونَ in this clause?', options: ['The object', 'The predicate of هُمْ', 'A preposition'], answer: 1, why: 'هُمْ يُرَاءُونَ is a sentence: هُمْ is the subject, and the verb يُرَاءُونَ is its predicate.' },
      },
      7: {
        words: [
          { role: 'And', say: 'al-Jadwal: it joins this clause to يُرَاءُونَ. It is one more thing said about هُمْ.' },
          { role: 'Verb, present', say: 'The ending ـُونَ means “they” and is the subject.' },
          { role: 'Object', say: 'It names what they refuse. It is accusative with fatḥa.' },
        ],
        quiz: { word: 1, q: 'What does the ending ـُونَ on يَمْنَعُونَ show?', options: ['The verb is passive', 'The doers are “they”, many people', 'The verb is a command'], answer: 1, why: 'The ending ـُونَ is the plural “they”. It is the subject, so no separate subject word is needed.' },
      },
    },
  },

  '108-al-kawthar': {
    verses: {
      1: {
        words: [
          { role: 'Particle إِنَّ and its noun “We”', say: 'إِنَّ stresses the sentence. The ending نَا means “We” and is the noun of إِنَّ, so it is accusative.' },
          { role: 'Predicate of إِنَّ', say: 'The whole clause is the predicate. The ending نَا is the doer, and كَ is the first object.' },
          { role: 'Second object', say: 'Accusative with fatḥa. The verb takes two objects: who receives and what is given.' },
        ],
        quiz: { word: 1, q: 'What is the clause أَعْطَيْنَاكَ الْكَوْثَرَ?', options: ['The noun of إِنَّ', 'A command', 'The predicate of إِنَّ'], answer: 2, why: 'إِنَّا already has its noun in نَا. The rest of the verse is the predicate.' },
      },
      2: {
        words: [
          { role: 'Fa of cause', say: 'al-Jadwal: it ties the command to the gift in verse 1, as reason and result. It also allows an answer to an unspoken “if”.' },
          { role: 'Command', say: 'A command to one man. The subject “you” is hidden.' },
          { role: 'Preposition', say: 'The phrase لِرَبِّكَ belongs to صَلِّ.' },
          { role: 'After a preposition', say: 'Genitive with kasra. The ending كَ means “your”.' },
          { role: 'And', say: 'وَ joins the second command to the first.' },
          { role: 'Command', say: 'A second command. It starts with a helping alif, because the root begins with a sukun.' },
        ],
        quiz: { word: 0, q: 'What does فَ do in this verse?', options: ['It makes a question', 'It ties the command to the gift in verse 1', 'It says “not”'], answer: 1, why: 'al-Jadwal calls it a fa that links reason and result: because of the gift, pray.' },
      },
      3: {
        words: [
          { role: 'Particle إِنَّ', say: 'It stresses the sentence and puts the next noun in the accusative.' },
          { role: 'Noun of إِنَّ', say: 'An active participle: the one who hates. Accusative with fatḥa. The ending كَ means “your”.' },
          { role: 'Separating pronoun', say: 'al-Jadwal: it separates the noun from the predicate and adds stress. It has no case of its own. (It also allows reading it as a subject.)' },
          { role: 'Predicate of إِنَّ', say: 'Nominative with ḍamma. An adjective of a lasting quality, on the pattern أَفْعَل.' },
        ],
        quiz: { word: 2, q: 'What does هُوَ do in this verse?', options: ['It is the doer of a verb', 'It is a preposition', 'It separates the noun from the predicate and adds stress'], answer: 2, why: 'إِنَّ already has its noun, شَانِئَكَ. al-Jadwal reads هُوَ as a separating pronoun. It also allows reading it as a subject with الْأَبْتَرُ as its predicate.' },
      },
    },
  },

  '109-al-kafirun': {
    verses: {
      1: {
        words: [
          { role: 'Command', say: 'A command to the Prophet. The subject “you” is hidden. What follows is what he must say.' },
          { role: 'Calling word', say: 'A particle that calls someone, like “O”.' },
          { role: 'Person called', say: 'The one called is أَيُّ. It ends in ḍamma and does not change, and its position is accusative. The هَا makes the person listen.' },
          { role: 'Badal of أَيُّهَا', say: 'It names who is called. It follows أَيُّهَا with a ḍamma, so it is nominative. al-Jadwal also allows a clarifying follower (ʿaṭf bayān).' },
        ],
        quiz: { word: 3, q: 'Why is الْكَافِرُونَ nominative?', options: ['It is the subject of قُلْ', 'It follows a preposition', 'It follows أَيُّهَا, which ends in ḍamma'], answer: 2, why: 'الْكَافِرُونَ stands in place of أَيُّهَا and follows its ḍamma. That is why it ends in ـُونَ.' },
      },
      2: {
        words: [
          { role: 'Negation', say: 'It says “not”. The verb after it stays in its ordinary mood.' },
          { role: 'Verb, present', say: 'The أَ at the start means “I”. The subject is hidden. This clause is the answer to the call.' },
          { role: 'Relative pronoun, object', say: 'It is the object of أَعْبُدُ. It never changes its ending. al-Jadwal also allows two other readings.' },
          { role: 'Verb, present', say: 'This clause explains مَا. The ending ـُونَ means “you” (many). The word “it” that should point back to مَا is left out.' },
        ],
        quiz: { word: 2, q: 'What is مَا in this verse?', options: ['The subject', 'The object of أَعْبُدُ', 'A preposition'], answer: 1, why: 'أَعْبُدُ needs something that is worshipped. مَا is that thing, and تَعْبُدُونَ explains it.' },
      },
      3: {
        words: [
          { role: 'And, and an idle negation', say: 'وَ joins this to the verse before. al-Jadwal calls لَا idle: it says “not” but changes no case.' },
          { role: 'Subject (mubtadaʾ)', say: 'The pronoun “you” (many) starts the sentence, so it is the subject.' },
          { role: 'Predicate (khabar)', say: 'An active participle, which names a state, not one action. The ـُونَ ending is the nominative ending of this plural.' },
          { role: 'Relative pronoun, object', say: 'The object of عَابِدُونَ. It is in the accusative position.' },
          { role: 'Verb, present', say: 'This clause explains مَا. The أَ at the start means “I”.' },
        ],
        quiz: { word: 2, q: 'Why does verse 3 use عَابِدُونَ and not a verb?', options: ['A participle names a lasting state: you are not worshippers', 'It is a command', 'It is a past verb'], answer: 0, why: 'A noun like عَابِدُونَ describes what someone is. A verb would describe one action.' },
      },
      4: {
        words: [
          { role: 'And, and an idle negation', say: 'The same as in verse 3. It joins this sentence to the verse before.' },
          { role: 'Subject (mubtadaʾ)', say: 'The pronoun “I” starts the sentence, so it is the subject.' },
          { role: 'Predicate (khabar)', say: 'A singular participle, to match “I”. Nominative with tanwin ḍamma.' },
          { role: 'Relative pronoun, object', say: 'The object of عَابِدٌ, in the accusative position.' },
          { role: 'Verb, past', say: 'This clause explains مَا. The ending تُمْ means “you” (many). This time the verb is past.' },
        ],
        quiz: { word: 4, q: 'What tense is عَبَدتُّمْ?', options: ['Present', 'Past', 'Command'], answer: 1, why: 'The ending تُمْ is the past-tense sign for “you” (many). The earlier verbs were present.' },
      },
      5: {
        words: [
          { role: 'And, and an idle negation', say: 'The same as in verse 3. It joins this sentence to the verse before.' },
          { role: 'Subject (mubtadaʾ)', say: 'The pronoun “you” (many), as in verse 3.' },
          { role: 'Predicate (khabar)', say: 'The same participle as in verse 3, nominative with the ـُونَ ending.' },
          { role: 'Relative pronoun, object', say: 'The object of عَابِدُونَ, in the accusative position.' },
          { role: 'Verb, present', say: 'This clause explains مَا. The أَ at the start means “I”.' },
        ],
        quiz: { word: 0, q: 'How does al-Jadwal read verse 5 next to verse 3?', options: ['As a different sentence', 'As a question', 'As the same words said again for emphasis'], answer: 2, why: 'al-Jadwal reads it as a repeat for emphasis. It says the Arabs repeat a sentence to make a point clear.' },
      },
      6: {
        words: [
          { role: 'Prepositional phrase, put first', say: 'The phrase belongs to a predicate that is put first and left unsaid: “is for”. The ending كُمْ means “you” (many).' },
          { role: 'Subject (mubtadaʾ), put last', say: 'Nominative with ḍamma. The ending كُمْ means “your”.' },
          { role: 'And, and a prepositional phrase', say: 'وَ joins a second sentence. The ending يَ means “me”.' },
          { role: 'Subject (mubtadaʾ), put last', say: 'The ي of “my” is dropped, and the kasra points to it. The word is still nominative: al-Jadwal says the ḍamma is not pronounced.' },
        ],
        quiz: { word: 3, q: 'Why does دِينِ end in a kasra although it is nominative?', options: ['It follows a preposition', 'The kasra points to the dropped ي of “my”', 'It is a mistake'], answer: 1, why: 'The word means “my religion”. The ي is dropped and the kasra stays. al-Jadwal says the ḍamma is estimated on the letter before the dropped ي.' },
      },
    },
  },

  '110-an-nasr': {
    verses: {
      1: {
        words: [
          { role: 'Time word', say: 'It means “when”, for a time that has not come yet. al-Jadwal says the clause after it is the second part of a possession with it.' },
          { role: 'Past verb', say: 'It refers to the future here, because of إِذَا. The doer comes after it.' },
          { role: 'Doer (fāʿil), first part of a possession', say: 'Nominative with ḍamma. It owns اللَّهِ, so it has no al-.' },
          { role: 'Second part of a possession', say: 'Genitive with kasra, because نَصْرُ owns it.' },
          { role: 'And, and a second doer', say: 'وَ joins الْفَتْحُ to نَصْرُ, so it is a second doer and also nominative.' },
        ],
        quiz: { word: 2, q: 'Why is نَصْرُ nominative?', options: ['It is the doer of جَاءَ', 'It follows a preposition', 'It is the object'], answer: 0, why: 'The doer of a verb is nominative. جَاءَ is the verb, and نَصْرُ is what comes.' },
      },
      2: {
        words: [
          { role: 'And, and a past verb', say: 'وَ joins this clause to the clause of verse 1, so it also belongs to what إِذَا introduces. The ending تَ is the doer: “you”.' },
          { role: 'Object', say: 'Accusative with fatḥa.' },
          { role: 'Verb, present (ḥāl)', say: 'This clause tells what state the people are in while you see them. al-Jadwal also allows reading it as a second object of رَأَيْتَ.' },
          { role: 'Preposition', say: 'The phrase belongs to يَدْخُلُونَ.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive with kasra after فِي. It owns اللَّهِ.' },
          { role: 'Second part of a possession', say: 'Genitive with kasra, because دِينِ owns it.' },
          { role: 'State (ḥāl)', say: 'It tells how they enter: in groups. It is accusative with tanwin fatḥa and describes the doers of يَدْخُلُونَ.' },
        ],
        quiz: { word: 6, q: 'What does أَفْوَاجًا tell us?', options: ['What they enter: it is the object', 'How the people enter: it is a ḥāl', 'Who enters: it is the subject'], answer: 1, why: 'A ḥāl describes the state of someone while the action happens. أَفْوَاجًا is accusative and says they enter in groups.' },
      },
      3: {
        words: [
          { role: 'Fa of the answer, and a command', say: 'The فَ joins the answer to the condition of verses 1 and 2. سَبِّحْ is a command, Form II (فَعَّلَ). The subject “you” is hidden.' },
          { role: 'Preposition, first part of a possession', say: 'In al-Jadwal the phrase says in what state to glorify: while praising. It is genitive after بِ and it owns رَبِّكَ.' },
          { role: 'Second part of a possession', say: 'Genitive with kasra, because حَمْدِ owns it. The ending كَ means “your”.' },
          { role: 'And, and a command, Form X', say: 'وَ joins a second command. Form X (اسْتَفْعَلَ) means to ask for something, here forgiveness. The ending هُ is the object.' },
          { role: 'Particle إِنَّ and its noun “He”', say: 'إِنَّ gives the reason for the commands. The ending هُ means “He” and is the noun of إِنَّ, so it is accusative.' },
          { role: 'Verb kāna', say: 'The verb “to be”. Its subject “He” is hidden. It makes its predicate accusative.' },
          { role: 'Predicate of kāna', say: 'Accusative with tanwin fatḥa. An intensive form (فَعَّال): He does it again and again. The clause كَانَ تَوَّابًا is the predicate of إِنَّ.' },
        ],
        quiz: { word: 6, q: 'Why is تَوَّابًا accusative?', options: ['It follows a preposition', 'It is the noun of إِنَّ', 'It is the predicate of كَانَ'], answer: 2, why: 'The predicate of كَانَ is accusative. The noun of إِنَّ is the ending هُ in إِنَّهُ.' },
      },
    },
  },

  '111-al-masad': {
    verses: {
      1: {
        words: [
          { role: 'Past verb, a curse', say: 'A past verb that wishes harm: may they perish. The ـتْ ending makes it feminine, to match يَدَا.' },
          { role: 'Doer, first part of a possession', say: 'A dual noun (two hands), nominative with the alif ending. The ن dropped because it owns أَبِي.' },
          { role: 'Second part of a possession, one of the five nouns', say: 'Genitive, so the ending is ـِي. This word changes: أَبُو, أَبَا, أَبِي.' },
          { role: 'Second part of a possession', say: 'Genitive with tanwin kasra. Together with أَبِي it makes a kunya, a name like “father of…”.' },
          { role: 'And, and a past verb', say: 'وَ joins a second verb. The subject “he” is hidden and means Abu Lahab himself. The verb is masculine now.' },
        ],
        quiz: { word: 0, q: 'Why does تَبَّتْ end in تْ?', options: ['The verb is passive', 'The doer is plural', 'The doer يَدَا is feminine'], answer: 2, why: 'A verb takes a feminine ending when its doer is feminine. يَدَا is the feminine dual of “hand”.' },
      },
      2: {
        words: [
          { role: 'Negation', say: 'It says “not”. al-Jadwal also allows a question word: “what did it help?”.' },
          { role: 'Past verb, Form IV', say: 'Form IV (أَفْعَلَ). The doer comes after the phrase.' },
          { role: 'Prepositional phrase', say: 'It belongs to أَغْنَىٰ. The ending هُ means “him”.' },
          { role: 'Doer', say: 'Nominative with ḍamma. The ending هُ means “his”.' },
          { role: 'And, and a particle that makes a verbal noun', say: 'al-Jadwal reads this مَا as a particle: مَا كَسَبَ together mean “his earning”. وَ joins it to مَالُهُ.' },
          { role: 'Past verb', say: 'It follows the particle مَا, and together they make one verbal noun. The subject “he” is hidden.' },
        ],
        quiz: { word: 4, q: 'How does al-Jadwal read the second مَا?', options: ['A negation', 'A question word', 'A particle: مَا كَسَبَ means “his earning”'], answer: 2, why: 'مَا and the verb make one verbal noun, joined to مَالُهُ. Many translations read it as “what he earned” instead.' },
      },
      3: {
        words: [
          { role: 'Future and verb', say: 'سَـ makes the verb future. The subject “he” is hidden.' },
          { role: 'Object', say: 'Accusative with tanwin fatḥa.' },
          { role: 'Adjective (naʿt), first part of a possession', say: 'It describes نَارًا, so it is accusative. It owns لَهَبٍ.' },
          { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because ذَاتَ owns it.' },
        ],
        quiz: { word: 2, q: 'Which word does ذَاتَ describe?', options: ['نَارًا', 'لَهَبٍ', 'سَيَصْلَىٰ'], answer: 0, why: 'It is an adjective of نَارًا and copies its accusative case.' },
      },
      4: {
        words: [
          { role: 'And, and a word joined to the doer', say: 'al-Jadwal: it joins the hidden doer of سَيَصْلَىٰ, so “he will burn, and his wife”. It also allows a new subject. The ending هُ means “his”.' },
          { role: 'Object of an unspoken verb, first part of a possession', say: 'The verse blames her: the verb “I blame” is left out, so the word is accusative. al-Jadwal also allows a ḥāl of امْرَأَتُهُ.' },
          { role: 'Second part of a possession', say: 'Genitive with kasra, because حَمَّالَةَ owns it.' },
        ],
        quiz: { word: 1, q: 'Why is حَمَّالَةَ accusative?', options: ['It follows a preposition', 'An unspoken verb, “I blame”, has it as its object', 'It is the subject'], answer: 1, why: 'al-Jadwal reads the verse with a left-out verb that means “I blame”. A ḥāl of امْرَأَتُهُ is another reading it allows.' },
      },
      5: {
        words: [
          { role: 'Preposition', say: 'The phrase belongs to a predicate that is put first and left unsaid.' },
          { role: 'After a preposition', say: 'Genitive with kasra after فِي. The ending هَا means “her”.' },
          { role: 'Subject (mubtadaʾ), put last', say: 'Nominative with tanwin ḍamma. It comes after its predicate.' },
          { role: 'Preposition', say: 'In al-Jadwal the phrase belongs to a missing adjective of حَبْلٌ: a rope that is “of” fibre.' },
          { role: 'After a preposition', say: 'Genitive with tanwin kasra after مِن.' },
        ],
        quiz: { word: 2, q: 'Which word is the subject of this sentence?', options: ['جِيدِهَا', 'مَسَدٍ', 'حَبْلٌ'], answer: 2, why: 'The subject comes last. فِي جِيدِهَا is the predicate, put first, and حَبْلٌ is nominative.' },
      },
    },
  },
};
