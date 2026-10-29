// Plain-English teaching layer for the surahs read after Level 3: Ash-Sharh, At-Tin, Al-Qadr, Az-Zalzalah, Al-Adiyat,
// Al-Qariah, At-Takathur and Al-Asr. Same shape and rules as in surah-study.ts.
//
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Where al-Jadwal gives more than one reading, the line says which one it follows. Someone
// who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from './surah-study';

export const LEVEL_3: Record<string, SurahStudy> = {
  '094-ash-sharh': {
    verses: {
      1: {
        words: [
          { role: 'Question word plus “not”', say: 'The hamza asks a question whose answer is “yes”. لَمْ then puts the next verb in the jussive.' },
          { role: 'Present verb, jussive, “We”', say: 'It ends in sukun, because لَمْ puts it in the jussive. The doer “We” is hidden inside the verb. The meaning is in the past: “did We not expand?”' },
          { role: 'Preposition with “you”', say: 'The phrase “for you” is tied to نَشْرَحْ. The ending كَ is the pronoun “you”.' },
          { role: 'Object (mafʿūl bih)', say: 'What was expanded. It is accusative with fatḥa. The ending كَ means “your”.' },
        ],
        quiz: { word: 1, q: 'Why does نَشْرَحْ end in sukun?', options: ['It is a command', 'لَمْ puts the verb in the jussive', 'It is passive'], answer: 1, why: 'لَمْ is a jussive particle. A present verb after it loses its ḍamma and ends in sukun.' },
      },
      2: {
        words: [
          { role: 'And (conjunction)', say: 'It joins this sentence to the one in verse 1. al-Jadwal reads them as two separate sentences.' },
          { role: 'Past verb, “We”', say: 'The ending نَا is the doer, “We”. The verb starts with و, which is a root letter. It drops in the present tense (يَضَعُ).' },
          { role: 'Preposition with “you”', say: 'عَنْ means “away from”. The phrase is tied to وَضَعْنَا. The ending كَ means “you”.' },
          { role: 'Object (mafʿūl bih)', say: 'What was put down. It is accusative. The pronoun كَ makes it definite, and that matters in verse 3.' },
        ],
        quiz: { word: 3, q: 'Why is وِزْرَكَ definite although it has no الـ?', options: ['It follows a verb', 'It has tanwin', 'The pronoun كَ is attached to it'], answer: 2, why: 'A noun that owns a pronoun is definite. That is why a definite relative pronoun can describe it in verse 3.' },
      },
      3: {
        words: [
          { role: 'Relative pronoun, adjective (naʿt)', say: 'al-Jadwal reads it as an adjective of وِزْرَكَ, so its position is accusative. It never changes its ending. What follows is the relative clause.' },
          { role: 'Past verb, Form IV', say: 'The doer “it” (the burden) is hidden inside. Form IV (أَفْعَلَ) puts the action on the back. This clause says which burden is meant, and it has no case of its own.' },
          { role: 'Object (mafʿūl bih)', say: 'What the burden pressed on. It is accusative. The ending كَ means “your”.' },
        ],
        quiz: { word: 0, q: 'What does الَّذِي do in this verse?', options: ['It describes وِزْرَكَ', 'It is the subject', 'It is a verb'], answer: 0, why: 'al-Jadwal reads it as a naʿt (adjective) of وِزْرَكَ. The clause after it tells which burden is meant.' },
      },
      4: {
        words: [
          { role: 'And (conjunction)', say: 'It joins this sentence to the first sentence of the passage, like the وَ in verse 2.' },
          { role: 'Past verb, “We”', say: 'The ending نَا is “We”. It is the opposite of وَضَعْنَا in verse 2: the burden went down, the mention went up.' },
          { role: 'Preposition with “you”', say: 'The phrase “for you” is tied to رَفَعْنَا.' },
          { role: 'Object (mafʿūl bih)', say: 'What was raised. It is accusative. It is a verbal noun (masdar) that means “mention”, and كَ means “your”.' },
        ],
        quiz: { word: 3, q: 'What is the role of ذِكْرَكَ?', options: ['Subject of رَفَعْنَا', 'Predicate of a noun sentence', 'Object of رَفَعْنَا'], answer: 2, why: 'The doer is “We” inside the verb. ذِكْرَكَ is what was raised, so it is the object, in the accusative.' },
      },
      5: {
        words: [
          { role: 'Resumptive fa', say: 'al-Jadwal calls it a fa that starts a new sentence. It does not join two clauses.' },
          { role: 'Particle “indeed”', say: 'It makes the sentence strong and puts its noun in the accusative. Here its noun comes last.' },
          { role: 'Adverb, “with”', say: 'It is a word for company, accusative with fatḥa. al-Jadwal ties it to the predicate of إِنَّ, and that predicate is not said, like “is present”.' },
          { role: 'Second part of a possession', say: 'It belongs to مَعَ, so it is genitive with kasra. It has الـ, so it means the hardship we already know.' },
          { role: 'Noun of إِنَّ (ism)', say: 'It is accusative with tanwin, because إِنَّ puts its noun in the accusative. It has no الـ, so it means “an ease”.' },
        ],
        quiz: { word: 4, q: 'What is the role of يُسْرًا?', options: ['Predicate of إِنَّ', 'Noun of إِنَّ (ism)', 'Object of مَعَ'], answer: 1, why: 'The predicate is left unsaid and مَعَ الْعُسْرِ is tied to it. يُسْرًا is the noun of إِنَّ, so it is accusative.' },
      },
      6: {
        words: [
          { role: 'Particle “indeed”', say: 'The same sentence as in verse 5, without the فَ. al-Jadwal also calls this one a new sentence.' },
          { role: 'Adverb, “with”', say: 'Same as in verse 5: accusative, and tied to the predicate of إِنَّ that is not said.' },
          { role: 'Second part of a possession', say: 'Genitive with kasra, owned by مَعَ. It has الـ again, so it points to the same hardship as in verse 5.' },
          { role: 'Noun of إِنَّ (ism)', say: 'Accusative with tanwin. It has no الـ and no pronoun, so al-Jadwal reads it as a different ease from the one in verse 5.' },
        ],
        quiz: { word: 3, q: 'Why is the يُسْرًا of verse 6 a different ease from verse 5?', options: ['It has no الـ, so the repeated word means something new', 'It is a verb', 'It is genitive'], answer: 0, why: 'A repeated word without الـ or a pronoun is read as a different thing. So one hardship comes with two eases.' },
      },
      7: {
        words: [
          { role: 'And (conjunction)', say: 'al-Jadwal says it joins this sentence to what came before.' },
          { role: 'Time word with a condition', say: 'It means “when” and points to the future. It does not put the verb in the jussive. The clause after it belongs to it, like the second part of a possession.' },
          { role: 'Past verb, “you”', say: 'The ending تَ is the doer, “you”. After إِذَا the past tense has a future meaning. The whole clause is the second part of a possession for إِذَا, so it is genitive in position.' },
          { role: 'Fa that ties the answer', say: 'It links the command to the condition. A command cannot be the answer of a condition without a link, so this فَ ties it.' },
          { role: 'Imperative, the answer', say: 'A command to “you”, and the “you” is hidden. This clause is the answer of the condition, and it has no case of its own.' },
        ],
        quiz: { word: 3, q: 'What does the second فَ do in this verse?', options: ['It means “and”', 'It makes the verb past', 'It ties the command to the condition'], answer: 2, why: 'al-Jadwal calls it the fa that ties the answer of the condition. The answer here is a command.' },
      },
      8: {
        words: [
          { role: 'And (conjunction)', say: 'al-Jadwal says it joins this verse to verse 7.' },
          { role: 'Preposition', say: 'It means “to”. The phrase إِلَىٰ رَبِّكَ is tied to ارْغَب. It comes first, which puts the stress on “your Lord”.' },
          { role: 'After a preposition (majrūr)', say: 'Genitive with kasra after إِلَىٰ. The ending كَ means “your”.' },
          { role: 'Fa that ties the answer', say: 'al-Jadwal says it ties the answer of a condition that is not said: “if a need makes you ask for something, then turn to your Lord for it”.' },
          { role: 'Imperative, the answer', say: 'A command to “you”, and the “you” is hidden. Its clause is the answer of the unsaid condition, and it has no case of its own.' },
        ],
        quiz: { word: 3, q: 'What does the فَ in فَارْغَب do?', options: ['It ties the command to a condition that is not said', 'It means “because”', 'It makes the verb present'], answer: 0, why: 'al-Jadwal reads the answer of an unsaid condition: “if you need to ask for something, ask your Lord”. The فَ ties that answer.' },
      },
    },
  },
  '095-at-tin': {
    verses: {
      1: {
        words: [
          { role: 'Oath wa, “by”', say: 'It means “by” and puts the next noun in the genitive. al-Jadwal ties the phrase to an unspoken verb, “I swear”.' },
          { role: 'Sworn by (maqsam bih)', say: 'The thing sworn by. It is genitive with kasra after the oath wa. al-Jadwal says it is either the fruit or the name of a mountain.' },
          { role: 'And (conjunction)', say: 'This wa is not an oath wa. It joins the olive to the fig, so the olive is also sworn by.' },
          { role: 'Joined to the fig, genitive', say: 'It takes the same genitive case as التِّينِ, because it is joined to it. The ending ـون is part of the word.' },
        ],
        quiz: { word: 2, q: 'What is the second وَ in this verse?', options: ['Another oath wa', 'A conjunction that joins the olive to the fig', 'A wa that starts a new sentence'], answer: 1, why: 'Only the first wa is the oath wa. The later wa words join more things to the first, so they share its genitive case.' },
      },
      2: {
        words: [
          { role: 'And (conjunction)', say: 'It joins Mount Sinai to the things already sworn by.' },
          { role: 'First part of a possession', say: 'It is genitive, because it is joined to the fig. It owns سِينِينَ, so it has no tanwin and no الـ.' },
          { role: 'Second part of a possession', say: 'The name of a mountain. It is genitive, because طُورِ owns it. al-Jadwal gives its pattern as فِعْلِيل, so it is not a plural.' },
        ],
        quiz: { word: 2, q: 'What is سِينِينَ in this verse?', options: ['The name of a mountain, owned by طُورِ', 'A sound masculine plural', 'A verb'], answer: 0, why: 'al-Jadwal calls it the name of a mountain, on the pattern فِعْلِيل. It is the second part of the possession, so it is genitive.' },
      },
      3: {
        words: [
          { role: 'And (conjunction)', say: 'It joins هَـٰذَا to التِّينِ.' },
          { role: 'Demonstrative “this”', say: 'It never changes its ending, but its position is genitive, because it is joined to the fig. The noun after it says what “this” points to.' },
          { role: 'Badal of هَـٰذَا', say: 'al-Jadwal reads it as a badal: it stands in the place of “this” and names what is meant. It is genitive. al-Jadwal also allows ʿatf bayan.' },
          { role: 'Adjective (naʿt)', say: 'It describes الْبَلَدِ, so it matches it: genitive, singular, masculine and definite.' },
        ],
        quiz: { word: 2, q: 'What does الْبَلَدِ do after هَـٰذَا?', options: ['It is the subject', 'It is a verb', 'It is a badal that names what “this” points to'], answer: 2, why: 'A badal takes the place of the word before it and says what is meant. “This” alone is unclear, so “the city” names it.' },
      },
      4: {
        words: [
          { role: 'Lam of the oath plus qad', say: 'لَ is the lam of the oath. It starts the answer to the oath. قَدْ is a particle of certainty, “indeed”.' },
          { role: 'Past verb, “We”', say: 'The ending نَا is “We”. This clause is the answer to the oath, and it has no case of its own.' },
          { role: 'Object (mafʿūl bih)', say: 'What was created. It is accusative with fatḥa. Its root is أ-ن-س and its pattern is فِعْلَان.' },
          { role: 'Preposition', say: 'The phrase that starts here is tied to a state (ḥāl) of الْإِنسَانَ that is not said: “created, while in the best form”.' },
          { role: 'Elative, first part of a possession', say: 'The pattern أَفْعَل means “most”. It is genitive after فِي and owns تَقْوِيمٍ, so it means “the best of”.' },
          { role: 'Second part of a possession', say: 'Genitive with tanwin. It is a verbal noun of قَوَّمَ on the pattern تَفْعِيل, “putting into the right shape”.' },
        ],
        quiz: { word: 0, q: 'What is the job of the لَ in لَقَدْ?', options: ['It means “not”', 'It marks the answer to the oath', 'It makes the verb passive'], answer: 1, why: 'al-Jadwal calls it the lam of the oath. It opens the answer to the oath sworn in verses 1 to 3.' },
      },
      5: {
        words: [
          { role: 'Then (conjunction)', say: 'It joins this clause to the answer of the oath in verse 4. It means “then”.' },
          { role: 'Past verb, “We”, plus “him”', say: 'The ending نَا is “We” and هُ is “him”, the object. The root has two د letters, and they stay apart before نَا.' },
          { role: 'Hal (state), first part of a possession', say: 'al-Jadwal reads it first as a ḥāl from the “him”: We returned him as one who is the lowest. It is accusative. al-Jadwal also allows an adverb of place, with an unsaid word “place”.' },
          { role: 'Second part of a possession', say: 'It is genitive, and the sign is the ي before the last ن, like a sound masculine plural. It is a doer-noun (فَاعِل) from س-ف-ل.' },
        ],
        quiz: { word: 2, q: 'In al-Jadwal’s first reading, what does أَسْفَلَ describe?', options: ['The doer of the verb', 'The predicate of إِنَّ', 'The state of the “him” in رَدَدْنَاهُ'], answer: 2, why: 'al-Jadwal reads it as a ḥāl (state) from the pronoun هُ: he was returned as one who is the lowest.' },
      },
      6: {
        words: [
          { role: 'Particle of exception', say: 'It takes a group out of what verse 5 said. al-Jadwal also allows that it means لَكِنْ, “but”.' },
          { role: 'Relative pronoun, excepted word', say: 'The group taken out (mustathna). It never changes its ending, but its position is accusative.' },
          { role: 'Past verb, “they”', say: 'The وا is the doer, “they”. The clause says who the group is (the relative clause), so it has no case.' },
          { role: 'And (conjunction)', say: 'It joins the second clause to the first.' },
          { role: 'Past verb, “they”', say: 'The وا is the doer, “they”. This clause is joined to آمَنُوا and is also part of the relative clause.' },
          { role: 'Object (mafʿūl bih)', say: 'What they did. It is accusative, and the sign of a sound feminine plural in the accusative is kasra.' },
          { role: 'Extra fa', say: 'al-Jadwal calls it extra (zāʾidah): it adds strength and changes nothing in the grammar.' },
          { role: 'Fronted predicate', say: 'The phrase “for them” comes first. It is the predicate, and أَجْرٌ is the subject that comes later.' },
          { role: 'Subject (mubtadaʾ), delayed', say: 'Nominative with tanwin. It comes after its predicate لَهُمْ.' },
          { role: 'Adjective (naʿt)', say: 'It describes أَجْرٌ, so it is nominative. It owns مَمْنُونٍ.' },
          { role: 'Second part of a possession', say: 'Genitive with tanwin, owned by غَيْرُ. It means “cut off”, so غَيْرُ مَمْنُونٍ means “not cut off”.' },
        ],
        quiz: { word: 6, q: 'What does the فَ in فَلَهُمْ do?', options: ['It is extra and adds strength only', 'It is an oath particle', 'It makes أَجْرٌ accusative'], answer: 0, why: 'al-Jadwal calls this فَ extra (zāʾidah). The sentence would have the same grammar without it.' },
      },
      7: {
        words: [
          { role: 'Resumptive fa', say: 'al-Jadwal says it starts a new sentence.' },
          { role: 'Question word, subject', say: 'It asks in denial: “what could…?”. It is the subject (mubtadaʾ), and it never changes its ending.' },
          { role: 'Present verb, Form II, plus “you”', say: 'The doubled ذّ shows Form II: to call something false. The “it” is hidden inside, and كَ is “you”, the object. This clause is the predicate of مَا.' },
          { role: 'Adverb of time', say: 'It means “after this”. It ends in ḍamma because its second part is left unsaid. It is tied to يُكَذِّبُكَ.' },
          { role: 'Preposition', say: 'The phrase بِالدِّينِ is tied to يُكَذِّبُكَ: what you call false.' },
          { role: 'After a preposition (majrūr)', say: 'Genitive with kasra. It means the recompense, the Day of Judgment.' },
        ],
        quiz: { word: 3, q: 'Why does بَعْدُ end in ḍamma?', options: ['It is the subject', 'It is built on ḍamma because its second part is left unsaid', 'It is the object of the verb'], answer: 1, why: 'al-Jadwal says it is cut off from its second part in wording, not in meaning, so it is fixed on ḍamma.' },
      },
      8: {
        words: [
          { role: 'Question word', say: 'A question that wants you to agree: “Is He not…?”' },
          { role: 'Verb “is not”', say: 'It takes a noun in the nominative (its ism) and a predicate in the accusative.' },
          { role: 'Noun of لَيْسَ (ism)', say: 'Nominative with ḍamma.' },
          { role: 'Extra bi', say: 'al-Jadwal calls it extra (zāʾidah): it adds strength and needs no word to be tied to.' },
          { role: 'Predicate of لَيْسَ, elative', say: 'Genitive in form because of the extra بِ, but accusative in position. It owns الْحَاكِمِينَ, so it means “the most … of the judges”.' },
          { role: 'Second part of a possession', say: 'Genitive, and the sign is the ي. It is the plural of حَاكِم, “one who judges”.' },
        ],
        quiz: { word: 4, q: 'What is the position of أَحْكَمِ?', options: ['Subject of لَيْسَ', 'Object of بِ', 'Predicate of لَيْسَ, accusative in position'], answer: 2, why: 'Its ending is genitive only because of the extra بِ. In position it is the predicate of لَيْسَ, so it is accusative.' },
      },
    },
  },
  '097-al-qadr': {
    verses: {
      1: {
        words: [
          { role: 'Particle إِنَّ and its noun “we”', say: 'إِنَّ makes the sentence strong. The ending نَا means “we” (Allah). It is the noun of إِنَّ, so it is accusative in position.' },
          { role: 'Predicate of إِنَّ', say: 'A past verb in Form IV (أَفْعَلَ), which means “make something come down”. The ending نَا is the doer. The ending هُ is “it”, the object, and points to the Quran. The whole clause is the predicate of إِنَّ.' },
          { role: 'Preposition', say: 'It means “in” or “during”. The phrase belongs to أَنزَلْنَاهُ.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive after فِي. It owns الْقَدْرِ, so it has no al-.' },
          { role: 'Second part of a possession', say: 'Genitive, because لَيْلَةِ owns it. al-Jadwal says it is the name of one particular night.' },
        ],
        quiz: { word: 1, q: 'What is the clause أَنزَلْنَاهُ in this verse?', options: ['The noun of إِنَّ', 'The predicate of إِنَّ', 'A description of لَيْلَةِ'], answer: 1, why: 'إِنَّ takes a noun (the ending نَا) and a predicate. al-Jadwal reads the clause أَنزَلْنَاهُ as the predicate, in the nominative position.' },
      },
      2: {
        words: [
          { role: 'Aside (parenthetical) wa', say: 'al-Jadwal calls this وَ parenthetical: it breaks in with a question and does not join two statements.' },
          { role: 'Question word, subject', say: 'It starts the sentence, so it is the subject (mubtadaʾ). Its predicate is the clause أَدْرَىٰكَ.' },
          { role: 'Verb, Form IV, plus “you”', say: 'Form IV (أَفْعَلَ) from the root د ر ي means “make someone know”. The doer “he” is hidden. The ending كَ is the first object. The next question fills the place of the second object.' },
          { role: 'Question word, subject', say: 'A second subject, in its own short sentence. That sentence is the second object of أَدْرَىٰكَ. al-Jadwal also allows مَا to be a predicate put first.' },
          { role: 'Predicate', say: 'It says what the second مَا is about, so it is nominative with ḍamma. It owns الْقَدْرِ.' },
          { role: 'Second part of a possession', say: 'Genitive with kasra, because لَيْلَةُ owns it.' },
        ],
        quiz: { word: 2, q: 'What are the objects of أَدْرَىٰكَ?', options: ['It has no object', 'لَيْلَةُ الْقَدْرِ only', 'كَ and the clause مَا لَيْلَةُ الْقَدْرِ'], answer: 2, why: 'The verb takes two objects. The ending كَ is the first, and the question مَا لَيْلَةُ الْقَدْرِ fills the place of the second.' },
      },
      3: {
        words: [
          { role: 'Subject (mubtadaʾ)', say: 'It starts a new sentence, so it is nominative. It owns الْقَدْرِ.' },
          { role: 'Second part of a possession', say: 'Genitive with kasra, because لَيْلَةُ owns it.' },
          { role: 'Predicate (khabar)', say: 'It says what the night is: better. It is nominative with tanwin. With مِنْ it means “better than”.' },
          { role: 'Preposition', say: 'It means “than” here. The phrase belongs to خَيْرٌ.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive after مِنْ. It owns شَهْرٍ.' },
          { role: 'Second part of a possession', say: 'Genitive with tanwin. After أَلْفٌ the counted noun is singular and genitive.' },
        ],
        quiz: { word: 2, q: 'What is خَيْرٌ in this verse?', options: ['The predicate of لَيْلَةُ', 'A description of شَهْرٍ', 'The object of مِنْ'], answer: 0, why: 'لَيْلَةُ الْقَدْرِ is the subject, and خَيْرٌ says something about it, so it is the predicate. It is nominative with tanwin.' },
      },
      4: {
        words: [
          { role: 'Verb, present, Form V', say: 'Form V (تَفَعَّلَ). It was تَتَنَزَّلُ, and one تَ was dropped, says al-Jadwal. It is feminine because a verb in front of a broken plural may be feminine.' },
          { role: 'Doer (fāʿil)', say: 'Nominative with ḍamma. It is a broken plural of مَلَك.' },
          { role: 'And', say: 'وَ joins الرُّوحُ to الْمَلَائِكَةُ.' },
          { role: 'Second doer', say: 'It is joined to الْمَلَائِكَةُ, so it is also nominative.' },
          { role: 'Preposition and “it”', say: 'فِي with the ending هَا, “it”, meaning the night. The phrase belongs to تَنَزَّلُ.' },
          { role: 'Preposition', say: 'It means “with”. The phrase بِإِذْنِ رَبِّهِم belongs to تَنَزَّلُ. al-Jadwal also allows a ḥāl: they come “with permission”.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive after بِ. It owns رَبِّهِم.' },
          { role: 'Second part of a possession', say: 'Genitive, because إِذْنِ owns it. The ending هِم means “their”.' },
          { role: 'Preposition of reason', say: 'Here مِن shows the reason: “for every matter”. al-Jadwal says the phrase belongs to تَنَزَّلُ.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive after مِن. It owns أَمْرٍ.' },
          { role: 'Second part of a possession', say: 'Genitive with tanwin, because كُلِّ owns it.' },
        ],
        quiz: { word: 0, q: 'Why does تَنَزَّلُ have only one تَ at the start?', options: ['It is a command', 'One of the two تَ letters was dropped', 'It is a Form I verb'], answer: 1, why: 'The verb was تَتَنَزَّلُ. al-Jadwal says one of the two تَ letters was dropped, so the verb is written with one.' },
      },
      5: {
        words: [
          { role: 'Predicate put first (khabar muqaddam)', say: 'The predicate comes before the subject, which stresses it. It is nominative with tanwin.' },
          { role: 'Subject put last (mubtadaʾ muʾakhkhar)', say: 'It is the delayed subject. It points to the night. al-Jadwal also allows it to mean the angels.' },
          { role: 'Preposition “until”', say: 'It marks where the peace ends. The phrase belongs to سَلَامٌ. al-Jadwal also allows تَنَزَّلُ.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive after حَتَّىٰ. al-Jadwal calls it a verbal noun that starts with مَ, meaning “rising”. It owns الْفَجْرِ.' },
          { role: 'Second part of a possession', say: 'Genitive, because مَطْلَعِ owns it.' },
        ],
        quiz: { word: 0, q: 'Why does سَلَامٌ come before هِيَ?', options: ['It is a verb', 'It is a question word', 'It is the predicate, put first'], answer: 2, why: 'The normal order is subject, then predicate. Here the predicate is put first (khabar muqaddam), and هِيَ is the delayed subject.' },
      },
    },
  },
  '099-az-zalzalah': {
    verses: {
      1: {
        words: [
          { role: 'Time word “when”', say: 'It means “when” and sets a condition. It is tied to the answer تُحَدِّثُ in verse 4. The clause after it is its muḍāf ilayhi, the part it owns.' },
          { role: 'Passive past verb', say: 'The doer is not named. The ending تِ shows that the thing acted on is feminine. The whole clause is the muḍāf ilayhi of إِذَا.' },
          { role: 'Stand-in for the doer (nāʾib al-fāʿil)', say: 'In a passive sentence the thing acted on takes the place of the doer, so it is nominative with ḍamma.' },
          { role: 'Absolute object (mafʿūl muṭlaq)', say: 'A noun from the same root as the verb. It is accusative and makes the action strong: shaken with its shaking. The ending هَا is “its”, the earth’s.' },
        ],
        quiz: { word: 3, q: 'What is زِلْزَالَهَا in this verse?', options: ['The stand-in for the doer', 'A time word', 'The absolute object (mafʿūl muṭlaq)'], answer: 2, why: 'It comes from the same root as زُلْزِلَتِ and is accusative. Its job is to make the action stronger.' },
      },
      2: {
        words: [
          { role: 'And', say: 'It joins this clause to the clause in verse 1, so this clause is also a muḍāf ilayhi of إِذَا.' },
          { role: 'Past verb, Form IV', say: 'Form IV (أَفْعَلَ) means “make something go out”. The تِ shows that the doer is feminine.' },
          { role: 'Doer (fāʿil)', say: 'Nominative with ḍamma. al-Jadwal says that giving the action to the earth is figurative, because Allah is the real doer.' },
          { role: 'Object (mafʿūl bihi)', say: 'Accusative with fatḥa. It is a broken plural of ثِقْل, “burden”. The ending هَا is “its”, the earth’s.' },
        ],
        quiz: { word: 2, q: 'What is the role of الْأَرْضُ in this verse?', options: ['Doer (fāʿil)', 'Stand-in for the doer', 'Object'], answer: 0, why: 'أَخْرَجَتِ is active, so الْأَرْضُ is the doer. In verse 1 the verb was passive, so the earth took the place of the doer there.' },
      },
      3: {
        words: [
          { role: 'And', say: 'It joins this clause to the earlier clauses, so it is also a muḍāf ilayhi of إِذَا.' },
          { role: 'Past verb', say: 'Form I from the root ق و ل. It brings in what he said.' },
          { role: 'Doer (fāʿil)', say: 'Nominative with ḍamma. With al- it means people in general.' },
          { role: 'Question word, subject', say: 'It is a question noun that never changes its ending. It is the subject (mubtadaʾ) of the quoted sentence.' },
          { role: 'Preposition and “it”', say: 'لِ with the ending هَا, “it”. al-Jadwal ties it to an unspoken predicate, so the phrase means “What is the matter with it?”.' },
        ],
        quiz: { word: 3, q: 'What does مَا do in مَا لَهَا?', options: ['It is a negation', 'It is the question word and the subject', 'It means “that which”'], answer: 1, why: 'al-Jadwal reads مَا as a question noun in the nominative position, the subject. لَهَا is tied to an unspoken predicate.' },
      },
      4: {
        words: [
          { role: 'Time word “that day”', say: 'It is accusative or built on fatḥa. al-Jadwal ties it to the answer تُحَدِّثُ, so it is a badal of إِذَا. The tanwin stands for an unspoken clause: “when the earth is shaken”.' },
          { role: 'Present verb, the answer to إِذَا', say: 'Form II (فَعَّلَ). It is the answer to إِذَا from verse 1. It stays indicative with ḍamma, because إِذَا does not make a verb jussive. The doer “she”, the earth, is hidden.' },
          { role: 'Object (mafʿūl bihi)', say: 'Accusative with fatḥa. It is a broken plural of خَبَر, “news”. The ending هَا is “its”.' },
        ],
        quiz: { word: 1, q: 'What is the job of تُحَدِّثُ in the whole sentence?', options: ['It is the condition', 'It describes الْأَرْضُ', 'It is the answer to إِذَا'], answer: 2, why: 'The condition was in verses 1 to 3. تُحَدِّثُ is the answer (jawāb). It is not jussive, because إِذَا does not put verbs in the jussive.' },
      },
      5: {
        words: [
          { role: 'Preposition', say: 'It works with the clause after أَنَّ. Together they make one verbal noun in the genitive position, tied to تُحَدِّثُ. In meaning it gives the reason: “because”.' },
          { role: 'Particle “that”, like إِنَّ', say: 'It puts the next noun in the accusative, like إِنَّ. With its two parts it forms a verbal noun (maṣdar muʾawwal).' },
          { role: 'Noun of أَنَّ', say: 'Accusative with fatḥa, because أَنَّ stands in front of it. The ending كَ is “your”.' },
          { role: 'Past verb, Form IV', say: 'Form IV (أَفْعَلَ) from the root و ح ي, “inspire”. The clause أَوْحَىٰ لَهَا is the predicate of أَنَّ.' },
          { role: 'Preposition and “it”', say: 'It belongs to أَوْحَىٰ. al-Jadwal notes that أَوْحَىٰ usually takes إِلَى, so the one inspired may be unsaid (the angels, for the earth), or the verb means “allowed”.' },
        ],
        quiz: { word: 2, q: 'Why is رَبَّكَ accusative?', options: ['It is the noun of أَنَّ', 'It is the object of أَوْحَىٰ', 'It follows a preposition'], answer: 0, why: 'أَنَّ works like إِنَّ: it puts its noun in the accusative. The ending كَ is “your”.' },
      },
      6: {
        words: [
          { role: 'Time word, repeated', say: 'al-Jadwal reads it as an emphasis (tawkīd) of the first يَوْمَئِذٍ in verse 4. It also allows tying it to يَصْدُرُ.' },
          { role: 'Present verb', say: 'Form I from the root ص د ر. This is a new sentence and has no place in the grammar before it. It is indicative with ḍamma.' },
          { role: 'Doer (fāʿil)', say: 'Nominative with ḍamma. The verb comes first, so it stays singular.' },
          { role: 'State (ḥāl)', say: 'Accusative with tanwin. al-Jadwal reads it as a ḥāl from النَّاسُ: how they come out, in separate groups.' },
          { role: 'Lām of reason', say: 'It means “so that”. The verb after it is subjunctive because of an unspoken أَنْ. Together they make a verbal noun tied to يَصْدُرُ.' },
          { role: 'Passive verb, subjunctive', say: 'Form IV passive of ر أ ي, “be shown”. It is subjunctive, so the final نَ of يُرَوْنَ is dropped. The وَاو is the stand-in for the doer: “they”.' },
          { role: 'Second object', say: 'Accusative with fatḥa. al-Jadwal adds that a word is unsaid before it: the reward of their deeds. The ending هُمْ is “their”.' },
        ],
        quiz: { word: 4, q: 'What kind of لِ is this?', options: ['A lām of the oath', 'A lām of reason (“so that”)', 'A lām of command'], answer: 1, why: 'The verb after it is subjunctive through an unspoken أَنْ, and the meaning is “so that”. A lām of command would make the verb jussive.' },
      },
      7: {
        words: [
          { role: 'Joining فَ', say: 'It joins this sentence to يَصْدُرُ النَّاسُ in verse 6 and spells out what follows. al-Jadwal calls it ʿāṭifa tafrīʿiyya.' },
          { role: 'Condition noun, subject', say: 'A noun that means “whoever” and makes both verbs jussive. It is the subject (mubtadaʾ). Its ending never changes.' },
          { role: 'Verb of the condition, jussive', say: 'It is jussive because of مَن, and the sukūn on the last letter shows it. This clause is the predicate of مَن. al-Jadwal also allows the predicate to be both clauses together.' },
          { role: 'Object, first part of a possession', say: 'Accusative with fatḥa. It owns ذَرَّةٍ.' },
          { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because مِثْقَالَ owns it.' },
          { role: 'Specification (tamyīz)', say: 'Accusative with tanwin. It says what the weight is of: good. al-Jadwal also allows a badal of مِثْقَالَ.' },
          { role: 'Answer of the condition, jussive', say: 'It is jussive: the last letter of يَرَى is dropped. هُ is “it”, the object. It needs no فَ and has no place in the grammar of the clause before it.' },
        ],
        quiz: { word: 5, q: 'What does خَيْرًا do after مِثْقَالَ ذَرَّةٍ?', options: ['It is the subject', 'It is the doer of يَعْمَلْ', 'It says what the weight is of (tamyīz)'], answer: 2, why: 'The weight of an atom is not clear until you say of what. خَيْرًا is accusative and names it. al-Jadwal also allows reading it as a badal of مِثْقَالَ.' },
      },
      8: {
        words: [
          { role: 'And', say: 'It joins this sentence to verse 7. The second sentence is built like the first.' },
          { role: 'Condition noun, subject', say: 'The same as in verse 7: a noun meaning “whoever”, the subject, which makes both verbs jussive.' },
          { role: 'Verb of the condition, jussive', say: 'Jussive with sukūn. As in verse 7, this clause is the predicate of مَن.' },
          { role: 'Object, first part of a possession', say: 'Accusative with fatḥa. It owns ذَرَّةٍ.' },
          { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because مِثْقَالَ owns it.' },
          { role: 'Specification (tamyīz)', say: 'Accusative with tanwin. It says the weight is of evil. Apart from وَ, it is the only change from verse 7.' },
          { role: 'Answer of the condition, jussive', say: 'Jussive, with the last letter of the verb dropped. هُ is “it”, the object: the evil he did.' },
        ],
        quiz: { word: 0, q: 'What does وَ do at the start of verse 8?', options: ['It joins this sentence to verse 7', 'It starts an oath', 'It is an aside (parenthetical)'], answer: 0, why: 'al-Jadwal reads it as a joining وَ. The sentence is built like verse 7 and has the same parts.' },
      },
    },
  },
  '100-al-adiyat': {
    verses: {
      1: {
        words: [
          { role: 'Oath particle', say: 'وَ means “by”. al-Jadwal ties it to an unspoken verb, “I swear”.' },
          { role: 'Thing sworn by', say: 'Genitive with kasra, because it is the thing sworn by. It means “those that run”. al-Jadwal reads الـ here as “those that”.' },
          { role: 'Absolute object (mafʿūl muṭlaq)', say: 'A verbal noun in the accusative with tanwin. al-Jadwal ties it to an unspoken verb, “they pant”. It also allows two other readings, such as a state (ḥāl).' },
        ],
        quiz: { word: 2, q: 'What is ضَبْحًۭا in this verse?', options: ['The doer of a verb', 'A verbal noun that belongs to an unspoken verb', 'A word after a preposition'], answer: 1, why: 'ضَبْحًۭا is a verbal noun, the sound of panting. al-Jadwal ties it to an unspoken verb, “they pant”.' },
      },
      2: {
        words: [
          { role: 'Joining fa', say: 'al-Jadwal calls this فَ a joining word (ʿaṭf) in all four places. It adds the next step after the one before.' },
          { role: 'Thing sworn by', say: 'Genitive, joined to ٱلْعَـٰدِيَـٰتِ. A Form IV participle: those that make sparks.' },
          { role: 'Absolute object (mafʿūl muṭlaq)', say: 'A verbal noun in the accusative, for an unspoken verb, “they strike”. al-Jadwal gives it the same readings as ضَبْحًۭا.' },
        ],
        quiz: { word: 1, q: 'Why is ٱلْمُورِيَـٰتِ genitive?', options: ['It is joined to a word that is sworn by', 'It is the doer of a verb', 'It is an object'], answer: 0, why: 'فَ joins it to ٱلْعَـٰدِيَـٰتِ, which is the thing sworn by. So it takes the same case.' },
      },
      3: {
        words: [
          { role: 'Joining fa', say: 'The same joining فَ as in verse 2. It adds the third step.' },
          { role: 'Thing sworn by', say: 'Genitive, joined to the words before. A Form IV participle: those that raid.' },
          { role: 'Time word (ẓarf)', say: 'It answers “when?”. Accusative with tanwin. al-Jadwal ties it to ٱلْمُغِيرَٰتِ: they raid at dawn.' },
        ],
        quiz: { word: 2, q: 'Which question does صُبْحًۭا answer?', options: ['Who?', 'How?', 'When?'], answer: 2, why: 'صُبْحًۭا is a time word. Unlike ضَبْحًۭا and قَدْحًۭا, it is not a verbal noun. al-Jadwal ties it to the raiders.' },
      },
      4: {
        words: [
          { role: 'Joining fa', say: 'It joins this clause to the participles before it. al-Jadwal says the participles stand in for verbs: “those that ran, struck, raided, then raised”.' },
          { role: 'Past verb, “they” (females)', say: 'The ending نَ is the doer: the horses. So the verb is built on sukūn. It is Form IV, from the root ث و ر.' },
          { role: 'Preposition and “it”', say: 'The phrase belongs to أَثَرْنَ. al-Jadwal says “it” points to the place where they run, or to that time.' },
          { role: 'Object (mafʿūl bihi)', say: 'Accusative with tanwin. It means dust.' },
        ],
        quiz: { word: 1, q: 'What does the ending نَ in أَثَرْنَ mean?', options: ['It is the object “her”', 'It is the doer: “they” (females)', 'It makes the verb a command'], answer: 1, why: 'The ending نَ is the نُون النِّسْوَة. It is the doer, and it shows that the doers are feminine plural: the horses.' },
      },
      5: {
        words: [
          { role: 'Joining fa', say: 'It joins this clause to the one before: after they raised dust, they pierced the group.' },
          { role: 'Past verb, “they” (females)', say: 'The ending نَ is the doer. The وَ at the start is part of the root و س ط. It is not a joining word.' },
          { role: 'Preposition and “it”', say: 'The phrase belongs to وَسَطْنَ. al-Jadwal says “it” points to the dawn or to the dust. It also allows a state of the doer: “covered in dust”.' },
          { role: 'Object (mafʿūl bihi)', say: 'Accusative with tanwin. The horses pierced a gathering, that is an army. al-Jadwal calls it a direct object.' },
        ],
        quiz: { word: 3, q: 'What is جَمْعًا in this verse?', options: ['The object of وَسَطْنَ', 'A time word', 'A place word'], answer: 0, why: 'وَسَطْنَ takes a direct object: what the horses pierced. That is جَمْعًا.' },
      },
      6: {
        words: [
          { role: 'Particle إِنَّ', say: 'It stresses the sentence and puts its noun in the accusative. al-Jadwal says this sentence is the answer to the oath.' },
          { role: 'Noun of إِنَّ', say: 'Accusative with fatḥa. It means mankind in general.' },
          { role: 'Preposition', say: 'The phrase لِرَبِّهِۦ belongs to كَنُودٌۭ. It says toward whom the ingratitude is.' },
          { role: 'After a preposition', say: 'Genitive with kasra. The ending هِ means “his”.' },
          { role: 'Sliding lām', say: 'لَ stresses the predicate. al-Jadwal calls it the sliding lām: it belongs with إِنَّ but has moved. It also allows the lām of the oath.' },
          { role: 'Predicate of إِنَّ', say: 'Nominative with ḍamma. The pattern فَعُول is a pattern for “very much”: very ungrateful. al-Jadwal links it to the verb for denying a favour.' },
        ],
        quiz: { word: 4, q: 'What is the job of لَ before كَنُودٌۭ?', options: ['It means “to”', 'It makes the word plural', 'It stresses the predicate of إِنَّ'], answer: 2, why: 'The sliding lām sits on the predicate and adds stress. It belongs with إِنَّ, which is why the sentence says “indeed ... surely”.' },
      },
      7: {
        words: [
          { role: 'And', say: 'وَ joins this sentence to the answer to the oath in verse 6. So it has no place of its own.' },
          { role: 'إِنَّ and “he”', say: 'The ending هُ is the noun of إِنَّ, so it is in the accusative position. In the first reading on this page it points to mankind.' },
          { role: 'Preposition', say: 'The phrase عَلَىٰ ذَٰلِكَ belongs to شَهِيدٌۭ.' },
          { role: 'After a preposition', say: 'ذَٰلِكَ means “that”. It never changes its ending. It points to the ingratitude.' },
          { role: 'Sliding lām', say: 'The same lām as in verse 6. It stresses the predicate.' },
          { role: 'Predicate of إِنَّ', say: 'Nominative with ḍamma. It means a witness.' },
        ],
        quiz: { word: 2, q: 'What does the phrase عَلَىٰ ذَٰلِكَ belong to?', options: ['The word إِنَّهُۥ', 'The word شَهِيدٌۭ', 'The word وَ'], answer: 1, why: 'al-Jadwal ties عَلَىٰ ذَٰلِكَ to شَهِيدٌۭ: he is a witness to that.' },
      },
      8: {
        words: [
          { role: 'And', say: 'Same as in verse 7. It joins this sentence to the answer to the oath.' },
          { role: 'إِنَّ and “he”', say: 'The ending هُ is the noun of إِنَّ, as in verse 7.' },
          { role: 'Lām of strengthening', say: 'It ties لِحُبِّ ٱلْخَيْرِ to شَدِيدٌۭ. al-Jadwal also allows a lām of reason: “because of love of wealth”.' },
          { role: 'First part of a phrase (muḍāf)', say: 'Genitive with kasra, after the preposition. It is the first word of a two-word phrase, “love of ...”.' },
          { role: 'Second part of a phrase (muḍāf ilayhi)', say: 'Genitive with kasra. Here خَيْر means wealth.' },
          { role: 'Sliding lām', say: 'It stresses the predicate, as in verse 6.' },
          { role: 'Predicate of إِنَّ', say: 'Nominative with ḍamma. It means strong or intense.' },
        ],
        quiz: { word: 2, q: 'How does al-Jadwal read the لِ in لِحُبِّ ٱلْخَيْرِ?', options: ['As a lām of strengthening, tied to شَدِيدٌۭ', 'As the lām of the oath', 'As a word meaning “not”'], answer: 0, why: 'al-Jadwal gives this as the first reading and also allows a lām of reason. Both readings tie the phrase to شَدِيدٌۭ.' },
      },
      9: {
        words: [
          { role: 'Question particle', say: 'أَ asks a question. Here it is a question of rebuke, not a real question.' },
          { role: 'Joining fa', say: 'al-Jadwal says it joins the question to an unspoken sentence before it: “Does he do wrong, and not know ...?”' },
          { role: 'Negation', say: 'It says “not” and negates يَعْلَمُ.' },
          { role: 'Verb, present', say: 'Indicative with ḍamma. The doer is hidden: mankind. What he should know is left unsaid: that We will repay him.' },
          { role: 'Time word (ẓarf)', say: 'It means “when”. al-Jadwal says it is a time word in the accusative position and need not carry a condition. The clause after it is its muḍāf ilayhi.' },
          { role: 'Passive verb', say: 'Past passive, built. The root has four letters: ب ع ث ر. The one who does it is not named.' },
          { role: 'Deputy doer (nāʾib fāʿil)', say: 'مَا means “what”. It stands in as the doer of the passive verb. It is the thing that is scattered.' },
          { role: 'Preposition', say: 'It begins the phrase that completes مَا: “what is in ...”.' },
          { role: 'After a preposition', say: 'Genitive with kasra. A broken plural of قَبْر, a grave.' },
        ],
        quiz: { word: 6, q: 'What is مَا in بُعْثِرَ مَا فِى ٱلْقُبُورِ?', options: ['The doer of an active verb', 'The word “not”', 'The deputy doer of the passive verb'], answer: 2, why: 'بُعْثِرَ is passive, so the thing that is scattered takes the place of the doer. That is مَا, and فِى ٱلْقُبُورِ completes it.' },
      },
      10: {
        words: [
          { role: 'Joining wa', say: 'It joins this clause to the clause in verse 9. So it is also the muḍāf ilayhi of إِذَا.' },
          { role: 'Passive verb', say: 'Past passive of Form II, from the root ح ص ل. It means to be gathered and made clear.' },
          { role: 'Deputy doer (nāʾib fāʿil)', say: 'The same use as in verse 9: the thing that is made clear.' },
          { role: 'Preposition', say: 'It begins the phrase that completes مَا.' },
          { role: 'After a preposition', say: 'Genitive with kasra. A broken plural of صَدْر, the chest, where thoughts are kept.' },
        ],
        quiz: { word: 0, q: 'What does وَ do in وَحُصِّلَ?', options: ['It starts an oath', 'It joins this clause to the clause in verse 9', 'It means “not”'], answer: 1, why: 'al-Jadwal joins the clause حُصِّلَ ... to the clause بُعْثِرَ .... Both stand after إِذَا.' },
      },
      11: {
        words: [
          { role: 'Particle إِنَّ', say: 'It stresses the sentence. al-Jadwal reads the sentence as the reason for what the man should know. It also allows it to be that thing known, with kasra on إِنَّ because of the لَ.' },
          { role: 'Noun of إِنَّ', say: 'Accusative with fatḥa. The ending هُمْ means “their”.' },
          { role: 'Preposition and “them”', say: 'The phrase belongs to خَبِيرٌۢ. It says whom the Lord knows.' },
          { role: 'Time word (ẓarf)', say: 'It means “on that day”. al-Jadwal ties it to خَبِيرٌۢ, like بِهِمْ. It is accusative, or built.' },
          { role: 'Sliding lām', say: 'It stresses the predicate, as in verse 6.' },
          { role: 'Predicate of إِنَّ', say: 'Nominative with ḍamma. It means very well informed. It is also one of the names of Allah.' },
        ],
        quiz: { word: 3, q: 'Which word does يَوْمَئِذٍۢ belong to?', options: ['خَبِيرٌۢ', 'إِنَّ', 'رَبَّهُم'], answer: 0, why: 'al-Jadwal ties both بِهِمْ and يَوْمَئِذٍۢ to the predicate خَبِيرٌۢ: on that day He knows them well.' },
      },
    },
  },
  '101-al-qariah': {
    verses: {
      1: {
        words: [
          { role: 'Subject (mubtadaʾ)', say: 'It names the Day and is nominative. Its predicate is the question in verse 2, so verses 1 and 2 are one sentence.' },
        ],
        quiz: { word: 0, q: 'What is the predicate (khabar) of ٱلْقَارِعَةُ in verse 1?', options: ['Nothing, it is left out', 'The question مَا ٱلْقَارِعَةُ in verse 2', 'The word يَوْمَ in verse 4'], answer: 1, why: 'al-Jadwal says the clause مَا ٱلْقَارِعَةُ is the predicate. So the name and the question form one sentence.' },
      },
      2: {
        words: [
          { role: 'Question word, subject', say: 'مَا is a noun that asks “what?”. al-Jadwal reads it as the subject (mubtadaʾ). It never changes its ending.' },
          { role: 'Predicate (khabar)', say: 'It says what مَا is about. It is nominative with ḍamma. The whole question is the predicate of ٱلْقَارِعَةُ in verse 1.' },
        ],
        quiz: { word: 0, q: 'What is مَا in this verse?', options: ['A question noun that is the subject', 'A word that means “not”', 'A relative pronoun'], answer: 0, why: 'al-Jadwal reads مَا as an interrogative noun (ism istifhām) in the position of nominative: the subject. ٱلْقَارِعَةُ is its predicate.' },
      },
      3: {
        words: [
          { role: 'Aside (parenthetical) wa', say: 'al-Jadwal calls this وَ parenthetical: it breaks in with a remark and does not join two statements.' },
          { role: 'Question word, subject', say: 'It starts a sentence, so it is the subject. The clause أَدْرَىٰكَ is its predicate.' },
          { role: 'Verb, Form IV, plus “you”', say: 'Form IV (أَفْعَلَ) means “make someone know”. The ending كَ is the first object: “you”. The next question fills the place of the second object.' },
          { role: 'Question word, subject', say: 'A second subject, in its own short sentence. That sentence is the second object of أَدْرَىٰكَ.' },
          { role: 'Predicate (khabar)', say: 'It says what the second مَا is about. It is nominative with ḍamma.' },
        ],
        quiz: { word: 4, q: 'Why is ٱلْقَارِعَةُ nominative here?', options: ['It follows a preposition', 'It is the object of أَدْرَىٰكَ', 'It is the predicate of the second مَا'], answer: 2, why: 'The second مَا is the subject and ٱلْقَارِعَةُ is its predicate. The predicate of a nominal sentence is nominative.' },
      },
      4: {
        words: [
          { role: 'Adverb of time (ẓarf)', say: 'It means “the day when”. It is accusative with fatḥa. al-Jadwal ties it to an unspoken verb, like “it strikes”. It also owns the clause that follows.' },
          { role: 'Verb kana, present', say: 'يَكُونُ is the verb “to be”. It is present tense and indicative. Its whole clause belongs to يَوْمَ and says which day.' },
          { role: 'Noun of kana (ism kana)', say: 'It is the subject of يَكُونُ, so it is nominative. After kana, the subject is called its ism.' },
          { role: 'Preposition of comparison', say: 'كَ means “like”. The noun after it is genitive. The phrase belongs to the predicate of kana.' },
          { role: 'After كَ, the thing compared to', say: 'Genitive with kasra after كَ. It is a collective noun: one moth is فَرَاشَة.' },
          { role: 'Adjective (naʿt)', say: 'It describes ٱلْفَرَاشِ, so it copies its genitive case. It is a passive participle: “spread out”.' },
        ],
        quiz: { word: 4, q: 'Why is ٱلْفَرَاشِ genitive?', options: ['It is the subject of يَكُونُ', 'It follows the preposition كَ', 'It is a command'], answer: 1, why: 'كَ is a preposition, and a noun after a preposition is genitive.' },
      },
      5: {
        words: [
          { role: 'And', say: 'وَ joins this clause to the clause of verse 4.' },
          { role: 'Verb kana, feminine', say: 'It is the same verb as in verse 4, but it starts with تَ because ٱلْجِبَالُ is feminine. Its clause is joined to يَكُونُ ٱلنَّاسُ.' },
          { role: 'Noun of kana (ism kana)', say: 'It is the subject of تَكُونُ, so it is nominative. It is a broken plural.' },
          { role: 'Preposition of comparison', say: 'كَ means “like”. As in verse 4, the phrase belongs to the predicate of kana.' },
          { role: 'After كَ, the thing compared to', say: 'Genitive with kasra after كَ. It means wool.' },
          { role: 'Adjective (naʿt)', say: 'It describes ٱلْعِهْنِ and copies its case, number and gender. It is a passive participle: “carded, fluffed”.' },
        ],
        quiz: { word: 1, q: 'Why does the verb start with تَ and not يَ?', options: ['ٱلْجِبَالُ is feminine', 'It is a command', 'The verse is a question'], answer: 0, why: 'A verb agrees with its subject. ٱلْجِبَالُ is a plural of things, which is treated as feminine, so the verb takes تَ.' },
      },
      6: {
        words: [
          { role: 'Resumptive fa', say: 'al-Jadwal calls this فَ resumptive: it starts a new sentence, about people now.' },
          { role: 'Particle “as for”', say: 'أَمَّا sets up a condition and sorts people into groups. The answer comes with a second فَ in verse 7.' },
          { role: 'Relative noun, subject', say: 'مَن means “the one who”. It never changes its ending, so only its position is nominative. It is the subject, and its predicate is the clause in verse 7.' },
          { role: 'Past verb', say: 'The clause ثَقُلَتْ مَوَٰزِينُهُۥ tells who is meant and has no position of its own. The verb is feminine, because مَوَٰزِينُ is a plural of things.' },
          { role: 'Doer (fāʿil)', say: 'It does the action of the verb, so it is nominative. The ending هُ means “his”.' },
        ],
        quiz: { word: 2, q: 'What is the job of مَن here?', options: ['A question word', 'A preposition', 'The subject, meaning “the one who”'], answer: 2, why: 'al-Jadwal reads مَن as a relative noun in the position of nominative. It is the subject, and the clause in verse 7 is its predicate.' },
      },
      7: {
        words: [
          { role: 'Fa that links the answer', say: 'al-Jadwal says this فَ ties the answer to أَمَّا. A sentence that answers أَمَّا needs it.' },
          { role: 'Subject (mubtadaʾ)', say: 'The pronoun “he” starts a new sentence. The whole sentence is the predicate of مَن in verse 6.' },
          { role: 'Preposition', say: 'It means “in”. The phrase فِي عِيشَةٍ belongs to the predicate of هُوَ.' },
          { role: 'After a preposition', say: 'Genitive with tanwin kasra after فِي. The pattern فِعْلَة names a way of living.' },
          { role: 'Adjective (naʿt)', say: 'It describes عِيشَةٍ and copies its genitive case. al-Jadwal reads “a life that is pleased” as a figure of speech: the one pleased is the person living it. It also allows a passive meaning, “pleasing”.' },
        ],
        quiz: { word: 4, q: 'Which word does رَّاضِيَةٍ describe?', options: ['هُوَ', 'عِيشَةٍ', 'فِي'], answer: 1, why: 'An adjective follows the noun it describes and copies its case. Both words are genitive with tanwin, and both are feminine.' },
      },
      8: {
        words: [
          { role: 'And', say: 'وَ joins this sentence to the one in verse 6.' },
          { role: 'Particle “as for”', say: 'أَمَّا starts the second group, the opposite of the first.' },
          { role: 'Relative noun, subject', say: 'It has the same job as in verse 6: “the one who”. Its predicate is the clause in verse 9. Only its position is nominative.' },
          { role: 'Past verb', say: 'It is the opposite of ثَقُلَتْ. The root خ ف ف has the same letter twice, so it is written with a shadda. The ending تْ is the feminine ta. The clause has no position of its own.' },
          { role: 'Doer (fāʿil)', say: 'Same as in verse 6: nominative, and the ending هُ means “his”.' },
        ],
        quiz: { word: 3, q: 'Why does خَفَّتْ have a shadda?', options: ['The root خ ف ف has the same letter twice', 'It is a Form II verb', 'It is passive'], answer: 0, why: 'The second and third letters of the root are the same, so they join into one doubled letter.' },
      },
      9: {
        words: [
          { role: 'Fa that links the answer', say: 'It ties the answer to أَمَّا, as in verse 7.' },
          { role: 'Subject (mubtadaʾ)', say: '“His mother” is nominative, and it is definite because of the ending هُ. al-Jadwal reads “mother” as a comparison made with mockery: the Abyss is his shelter.' },
          { role: 'Predicate (khabar)', say: 'It is nominative with tanwin ḍamma. A definite subject can have an indefinite predicate. The whole sentence is the predicate of مَنْ in verse 8.' },
        ],
        quiz: { word: 1, q: 'What does “his mother” mean in this verse?', options: ['His real mother', 'A person who helps him', 'His shelter, said as a mocking comparison'], answer: 2, why: 'al-Jadwal reads it as a comparison. A mother is where a child runs for shelter, and here the shelter is the Abyss.' },
      },
      10: {
        words: [
          { role: 'Aside (parenthetical) wa', say: 'As in verse 3, this وَ breaks in with a remark and does not join two statements.' },
          { role: 'Question word, subject', say: 'It is the subject of a short sentence. The clause أَدْرَىٰكَ is its predicate.' },
          { role: 'Verb, Form IV, plus “you”', say: 'It is the same verb as in verse 3. The ending كَ is the first object.' },
          { role: 'Question word, subject', say: 'It is the subject of the second question. That question is the second object of أَدْرَىٰكَ.' },
          { role: 'Predicate, with pause hāʾ', say: 'The pronoun هِيَ means “it” and points back to هَاوِيَةٌ. It is the predicate of مَا. The last هْ is a hāʾ of pause and has no role in the grammar.' },
        ],
        quiz: { word: 4, q: 'What is the last letter هْ in هِيَهْ?', options: ['The word “his”', 'A hāʾ of pause with no grammatical role', 'A second subject'], answer: 1, why: 'al-Jadwal calls it hāʾ al-sakt. It is added to support the sound when one stops, and it takes no case.' },
      },
      11: {
        words: [
          { role: 'Predicate (khabar) of an unspoken “it”', say: 'The subject هِيَ (the Abyss) is left out. This word is the predicate, so it is nominative with tanwin ḍamma. It answers the question in verse 10.' },
          { role: 'Adjective (naʿt)', say: 'It describes نَارٌ and copies its nominative case. It is an active participle: “burning hot”.' },
        ],
        quiz: { word: 0, q: 'What is left out in this verse?', options: ['The subject هِيَ, “it is”', 'The verb', 'A preposition'], answer: 0, why: 'al-Jadwal says نَارٌ is the predicate of an unspoken subject, هِيَ. The verse is the answer to the question in verse 10.' },
      },
    },
  },
  '102-at-takathur': {
    verses: {
      1: {
        words: [
          { role: 'Past verb with object “you”', say: 'A Form IV verb from ل ه و. It means “to make someone busy”. The ending كُمُ is the object “you” (many). The doer is the next word, not a hidden “he”.' },
          { role: 'Doer (fāʿil)', say: 'Nominative with ḍamma. A verbal noun of Form VI, on the pattern تَفَاعُل. It means competing to have more.' },
        ],
        quiz: { word: 1, q: 'Who or what is the doer of أَلْهَاكُمُ?', options: ['A hidden “he”', 'التَّكَاثُرُ', 'The ending كُمُ'], answer: 1, why: 'The doer follows the verb. التَّكَاثُرُ is nominative, and the ending كُمُ is the object, the people who were kept busy.' },
      },
      2: {
        words: [
          { role: 'Preposition of limit', say: 'It means “until”. al-Jadwal says an unspoken أَنْ sits after it, so the clause works as a noun: “until your visiting”. The phrase belongs to أَلْهَاكُمُ.' },
          { role: 'Past verb', say: 'From the root ز و ر. The ending تُمُ is the doer, “you” (many). The ḍamma on ز points back to the original و.' },
          { role: 'Object (mafʿūl bihi)', say: 'Accusative with fatḥa. A plural of مَقْبَرَة, a place of graves.' },
        ],
        quiz: { word: 0, q: 'What does al-Jadwal say sits between حَتَّىٰ and زُرْتُمُ?', options: ['An unspoken أَنْ', 'An unspoken “not”', 'Nothing, because حَتَّىٰ is only a conjunction'], answer: 0, why: 'حَتَّىٰ takes the genitive, and a genitive needs a noun. The unspoken أَنْ together with the verb makes one: “your visiting”.' },
      },
      3: {
        words: [
          { role: 'Rebuke', say: 'كَلَّا means “no!”. al-Jadwal says it rebukes and warns. It stands apart from the sentence that follows.' },
          { role: 'Future particle', say: 'It puts the verb in the future. It does not change the mood of the verb.' },
          { role: 'Verb, present', say: 'Indicative: the ending ـُونَ shows this. The wāw is the doer, “you” (many). What they will know is left unsaid. al-Jadwal supplies “the bad end of boasting”.' },
        ],
        quiz: { word: 1, q: 'What does سَوْفَ do?', options: ['It says “not”', 'It asks a question', 'It puts the verb in the future'], answer: 2, why: 'سَوْفَ is a particle for the future. The verb after it stays indicative.' },
      },
      4: {
        words: [
          { role: 'Joining word', say: 'ثُمَّ joins this sentence to the one in verse 3. It makes the second warning stronger than the first.' },
          { role: 'Rebuke', say: 'The same rebuke as in verse 3.' },
          { role: 'Future particle', say: 'The same as in verse 3.' },
          { role: 'Verb, present', say: 'The same as in verse 3. al-Jadwal says this sentence is joined to the one before, and neither has a place of its own.' },
        ],
        quiz: { word: 0, q: 'What does ثُمَّ do here?', options: ['It starts an oath', 'It joins the second warning to the first and makes it stronger', 'It makes the verb past'], answer: 1, why: 'ثُمَّ is a joining word. The second warning repeats the first and adds weight.' },
      },
      5: {
        words: [
          { role: 'Rebuke', say: 'Another rebuke. It stands apart from the sentence.' },
          { role: 'Condition particle', say: 'It means “if”. al-Jadwal calls it a condition word that does not make the verb jussive. The result of the condition is left unsaid.' },
          { role: 'Verb of the condition', say: 'Present indicative. The wāw is the doer. After لَوْ the meaning points to a state that is not true now: “if you knew”.' },
          { role: 'Absolute object (mafʿūl muṭlaq)', say: 'A verbal noun from the same root as تَعْلَمُونَ. Accusative with fatḥa. It says how: with the knowing of certainty.' },
          { role: 'Second part of a phrase (muḍāf ilayhi)', say: 'Genitive with kasra. It is the muḍāf ilayhi of عِلْمَ.' },
        ],
        quiz: { word: 3, q: 'Why is عِلْمَ accusative?', options: ['It is the absolute object, from the same root as the verb', 'It is the doer', 'It follows a preposition'], answer: 0, why: 'عِلْمَ comes from ع ل م, like تَعْلَمُونَ. al-Jadwal calls it the absolute object, which says how the knowing is done.' },
      },
      6: {
        words: [
          { role: 'Lām of the oath', say: 'al-Jadwal says this verse answers an unspoken oath, so لَ is the lām of the oath.' },
          { role: 'Verb, present, with heavy nūn', say: 'It is still indicative. The sign, the nūn of تَرَوْنَ, is dropped because three nūns would meet. The wāw is the doer, and the heavy نَّ adds stress.' },
          { role: 'Object (mafʿūl bihi)', say: 'Accusative with fatḥa. It is the Hellfire.' },
        ],
        quiz: { word: 0, q: 'What is لَ in لَتَرَوُنَّ?', options: ['The word “not”', 'A preposition', 'The lām of the oath'], answer: 2, why: 'al-Jadwal reads the verse as the answer to an unspoken oath. The lām marks that answer.' },
      },
      7: {
        words: [
          { role: 'Joining word', say: 'It adds a second step. al-Jadwal says this sentence answers a second unspoken oath, joined to the first.' },
          { role: 'Lām of the oath', say: 'The same use as in verse 6.' },
          { role: 'Verb with object “it”', say: 'The same verb as in verse 6. The ending هَا is the object “it”, the Hellfire.' },
          { role: 'Absolute object (mafʿūl muṭlaq)', say: 'Accusative with fatḥa. al-Jadwal says it stands in for the verbal noun: “a seeing that is the eye of certainty”.' },
          { role: 'Second part of a phrase (muḍāf ilayhi)', say: 'Genitive with kasra. It is the muḍāf ilayhi of عَيْنَ.' },
        ],
        quiz: { word: 3, q: 'What is عَيْنَ in this verse?', options: ['A word for a place', 'An absolute object that stands in for the verbal noun', 'A word for the doer'], answer: 1, why: 'The seeing is described by عَيْنَ الْيَقِينِ. al-Jadwal reads عَيْنَ as an absolute object that takes the place of the verbal noun.' },
      },
      8: {
        words: [
          { role: 'Joining word', say: 'It adds the third step. The sentence is joined to the one in verse 7.' },
          { role: 'Lām of the oath', say: 'The same use as in verses 6 and 7.' },
          { role: 'Passive verb, present', say: 'The first letter has a ḍamma, so the verb is passive: “you will be asked”. The one who asks is not named. It is still indicative, and the heavy نَّ adds stress.' },
          { role: 'Time word (ẓarf)', say: 'It means “on that day”. Accusative (al-Jadwal also allows built). It belongs to لَتُسْأَلُنَّ. The tanwin stands for a dropped clause: “the day you see it”.' },
          { role: 'Preposition', say: 'The phrase عَنِ النَّعِيمِ belongs to لَتُسْأَلُنَّ. It says what they are asked about.' },
          { role: 'After a preposition', say: 'Genitive with kasra. It means pleasure and good things.' },
        ],
        quiz: { word: 2, q: 'How can we see that تُسْأَلُنَّ is passive?', options: ['The first letter has a ḍamma, not a fatḥa', 'It ends in نَّ', 'It starts with لَ'], answer: 0, why: 'The active verb starts with a fatḥa (تَسْأَلُ). The passive starts with a ḍamma (تُسْأَلُ). The ending نَّ only adds stress.' },
      },
    },
  },
  '103-al-asr': {
    verses: {
      1: {
        words: [
          { role: 'Oath wa', say: 'It means “by”. It is not a joining وَ. al-Jadwal ties it to an unspoken verb, أُقْسِمُ, “I swear”.' },
          { role: 'The thing sworn by', say: 'Genitive with kasra after the oath وَ. al-Jadwal gives three meanings: time or age, the late afternoon, or the ʿaṣr prayer.' },
        ],
        quiz: { word: 0, q: 'What kind of وَ opens this surah?', options: ['A joining وَ', 'An oath وَ meaning “by”', 'A parenthetical وَ'], answer: 1, why: 'Nothing comes before it to join. It swears by الْعَصْرِ and puts it in the genitive.' },
      },
      2: {
        words: [
          { role: 'Particle that stresses', say: 'It makes the statement strong and puts its noun in the accusative.' },
          { role: 'Noun of إِنَّ', say: 'Accusative with fatḥa. With al- it means all people, the whole kind.' },
          { role: 'Lām of emphasis', say: 'It stresses the predicate. al-Jadwal calls it the lām of the oath, which takes the place of the usual emphasis lām. It never changes.' },
          { role: 'Preposition', say: 'It means “in”. The phrase فِي خُسْرٍ is the predicate of إِنَّ.' },
          { role: 'After a preposition', say: 'Genitive with tanwin kasra. The tanwin makes it general: loss of any kind. The whole sentence answers the oath.' },
        ],
        quiz: { word: 1, q: 'Why is الْإِنسَانَ accusative?', options: ['It is the noun of إِنَّ', 'It comes after فِي', 'It is the object of an oath'], answer: 0, why: 'إِنَّ puts its noun in the accusative. فِي comes after it, not before it.' },
      },
      3: {
        words: [
          { role: 'Particle “except”', say: 'It takes a group out of the statement before it.' },
          { role: 'Relative pronoun, the group taken out', say: 'It means “those who”. It never changes its ending, but its place is accusative, because it is the group taken out (mustathnā).' },
          { role: 'Past verb, plural', say: 'Form IV of the root أ م ن. The ending وا shows many men doing it. The verb is built on ḍamma. This clause says who الَّذِينَ are (the ṣila).' },
          { role: 'And', say: 'It joins the next verb to the ṣila.' },
          { role: 'Past verb, plural', say: 'Form I of the root ع م ل. It is joined to the ṣila of الَّذِينَ.' },
          { role: 'Object (mafʿūl bihi)', say: 'A feminine plural noun. It is accusative, and the sign is kasra, not fatḥa.' },
          { role: 'And', say: 'It joins the next verb.' },
          { role: 'Past verb, Form VI', say: 'Form VI (تَفَاعَلَ) means doing it to each other: they urged one another. It is joined to the ṣila.' },
          { role: 'Preposition', say: 'It belongs to the تَوَاصَوْا just before it.' },
          { role: 'After a preposition', say: 'Genitive with kasra. It means “the truth”.' },
          { role: 'And', say: 'It joins the second تَوَاصَوْا.' },
          { role: 'Past verb, Form VI, again', say: 'The same verb said again. It is also joined to the ṣila.' },
          { role: 'Preposition', say: 'It belongs to the second تَوَاصَوْا.' },
          { role: 'After a preposition', say: 'Genitive with kasra. It means “patience”.' },
        ],
        quiz: { word: 7, q: 'What does Form VI add in تَوَاصَوْا?', options: ['It makes the verb passive', 'It means only one person did it', 'They did it to each other'], answer: 2, why: 'Form VI (تَفَاعَلَ) often means doing something to each other. They urged one another to the truth.' },
      },
    },
  },
};
