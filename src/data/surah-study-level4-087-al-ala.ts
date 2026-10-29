// Plain-English teaching layer for Al-A'la (87). Same shape and rules as in surah-study.ts.
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Someone who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from './surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Command, Form II, “you”', say: 'A command: declare glory. The doubled بّ shows Form II. It ends in a kasra here only because the next word begins with a joining alif.' },
        { role: 'Object, first part of a possession', say: 'What is glorified. Accusative with fatḥa because it is the object. It owns رَبِّكَ, so it has no al- and no tanwin. al-Jadwal says there is no need to call it extra: glorifying the name is glorifying the One who has it.' },
        { role: 'Second part of a possession, plus “your”', say: 'Genitive with kasra, because اسْمَ owns it. The attached كَ means “your”: the Prophet is addressed.' },
        { role: 'Adjective of رَبِّكَ', say: 'The Most High. It describes رَبِّكَ, so it is genitive. The kasra cannot be seen because the word ends in alif maqsura.' },
      ],
      quiz: { word: 3, q: 'Which word does الْأَعْلَىٰ describe?', options: ['اسْمَ', 'رَبِّكَ', 'سَبِّحِ'], answer: 1, why: 'al-Jadwal reads it as an adjective of رَبِّكَ, genitive with an unseen kasra. So “the Most High” is the Lord, not the name.' },
    },
    2: {
      words: [
        { role: 'Relative pronoun', say: 'Who. al-Jadwal reads it as a second adjective of رَبِّكَ in verse 1, so it is in the genitive position. It never changes its ending.' },
        { role: 'Verb, past, Form I', say: 'He created. This clause completes الَّذِي and says who is meant. The subject “He” is hidden.' },
        { role: 'Joining fa', say: 'Joins the next verb to the one before: first He created, then He proportioned.' },
        { role: 'Verb, past, Form II', say: 'He proportioned. The doubled وّ shows Form II. Its clause is joined to خَلَقَ. The alif maqsura comes from a weak last letter (root س و ي).' },
      ],
      quiz: { word: 0, q: 'What does الَّذِي do in this verse?', options: ['It describes رَبِّكَ from verse 1', 'It is the subject of خَلَقَ', 'It is the object of سَوَّىٰ'], answer: 0, why: 'al-Jadwal reads it as a second adjective of رَبِّكَ, in the genitive position. The subject of خَلَقَ is a hidden “He”.' },
    },
    3: {
      words: [
        { role: 'And', say: 'Joins this الَّذِي to the first one in verse 2. So both describe رَبِّكَ.' },
        { role: 'Relative pronoun', say: 'Who. It is joined to the first الَّذِي, so it is also genitive in position and also describes رَبِّكَ.' },
        { role: 'Verb, past, Form II', say: 'He measured out, He decreed. The clause completes الَّذِي. The doubled دّ shows Form II. The subject “He” is hidden.' },
        { role: 'Joining fa', say: 'Joins هَدَىٰ to قَدَّرَ: He measured out, then He guided.' },
        { role: 'Verb, past, Form I', say: 'He guided. The alif maqsura comes from a weak last letter (root ه د ي). Its clause is joined to قَدَّرَ.' },
      ],
      quiz: { word: 0, q: 'What does the وَ in وَالَّذِي join?', options: ['An oath to its answer', 'Two verbs', 'This الَّذِي to the first الَّذِي'], answer: 2, why: 'al-Jadwal joins the second and the third الَّذِي to the first one. All of them describe رَبِّكَ.' },
    },
    4: {
      words: [
        { role: 'And', say: 'Joins this الَّذِي to the first one, as in verse 3.' },
        { role: 'Relative pronoun', say: 'Who. The third in the row. It is joined to the first, so it also describes رَبِّكَ.' },
        { role: 'Verb, past, Form IV', say: 'He brought out. The extra أَ shows Form IV (أَفْعَلَ). It turns “go out” into “bring out”. The subject “He” is hidden.' },
        { role: 'Object', say: 'The pasture. Object of أَخْرَجَ, so accusative. The fatḥa cannot be seen because the word ends in alif maqsura.' },
      ],
      quiz: { word: 2, q: 'What does the extra أَ at the start of أَخْرَجَ show?', options: ['A question', 'Future tense', 'Form IV: “go out” becomes “bring out”'], answer: 2, why: 'Form IV (أَفْعَلَ) often makes a verb act on something else. خَرَجَ is “he went out”; أَخْرَجَ is “he brought out”.' },
    },
    5: {
      words: [
        { role: 'Joining fa', say: 'al-Jadwal: it joins this clause to أَخْرَجَ in verse 4. First He brought out the pasture, then He made it into something else.' },
        { role: 'Verb, past, plus “it”', say: 'He made it. This verb takes two objects. The attached هُ is the first object, and it points back to الْمَرْعَىٰ.' },
        { role: 'Second object', say: 'Debris, dry stubble. The second object of جَعَلَ, so accusative with tanwin fatḥa.' },
        { role: 'Adjective of غُثَاءً', say: 'Dark, blackish. It describes غُثَاءً, so it is accusative; the fatḥa cannot be seen. al-Jadwal also allows another reading: a ḥāl from الْمَرْعَىٰ (He brought out the pasture dark).' },
      ],
      quiz: { word: 2, q: 'What is غُثَاءً in this verse?', options: ['The subject', 'The second object of جَعَلَ', 'A ḥāl'], answer: 1, why: 'جَعَلَ here means “turn into”, so it takes two objects: the attached هُ and غُثَاءً. Both are accusative.' },
    },
    6: {
      words: [
        { role: 'Future prefix', say: 'Puts the present verb in the near future: “We will”.' },
        { role: 'Verb, present, Form IV, “We”, plus “you”', say: 'We will make you recite. The نُ means “We”. Form IV means “cause to recite”. The attached كَ is the object: you. al-Jadwal calls this a new sentence.' },
        { role: 'Joining fa', say: 'al-Jadwal calls it a joining fa: it joins this clause to سَنُقْرِئُكَ. It is not a “cause and effect” fa in the grammar.' },
        { role: 'Negation', say: 'Says “not”. It does not change the mood of the verb. al-Jadwal notes that some read it as “do not forget”, with the last alif added for the rhyme.' },
        { role: 'Verb, present, Form I, “you”', say: 'You will forget. It keeps its ordinary ḍamma, which cannot be seen. Its object is left out: what you recite. The alif is a changed ya.' },
      ],
      quiz: { word: 2, q: 'What does the فَ in فَلَا تَنسَىٰ do, according to al-Jadwal?', options: ['It joins the clause to سَنُقْرِئُكَ', 'It answers a condition', 'It makes the verb jussive'], answer: 0, why: 'al-Jadwal reads it as a joining fa. The sense follows from the promise, but in the grammar it just joins two clauses.' },
    },
    7: {
      words: [
        { role: 'Exception particle', say: 'Means “except”. What follows is the thing taken out of “you will not forget”.' },
        { role: 'Relative pronoun', say: 'What. It is the thing excepted, so al-Jadwal puts it in the accusative position. It never changes its ending.' },
        { role: 'Verb, past, Form I', say: 'He willed. This clause completes مَا. The doer comes next.' },
        { role: 'Subject (fāʿil)', say: 'Allah does the willing, so it is nominative with ḍamma.' },
        { role: 'Inna, plus “He”', say: 'Strengthens what follows. The attached هُ is the subject of إِنَّ, accusative in position. al-Jadwal reads this sentence as the reason for the exception.' },
        { role: 'Verb, present, Form I', say: 'He knows. The whole clause is the predicate (khabar) of إِنَّ. The subject “He” is hidden.' },
        { role: 'Object', say: 'The open, what is done or said aloud. Object of يَعْلَمُ, so accusative.' },
        { role: 'And', say: 'Joins the next مَا to الْجَهْرَ.' },
        { role: 'Relative pronoun', say: 'What. Joined to الْجَهْرَ, so it is also an object of يَعْلَمُ, in the accusative position.' },
        { role: 'Verb, present, Form I', say: 'Is hidden. This clause completes the second مَا. The alif maqsura is a changed ya.' },
      ],
      quiz: { word: 8, q: 'What is the second مَا joined to?', options: ['شَاءَ', 'الْجَهْرَ', 'اللَّهُ'], answer: 1, why: 'The وَ joins it to الْجَهْرَ. So it is also an object of يَعْلَمُ: He knows the open and what is hidden.' },
    },
    8: {
      words: [
        { role: 'And', say: 'al-Jadwal joins this clause to سَنُقْرِئُكَ in verse 6.' },
        { role: 'Verb, present, Form II, “We”, plus “you”', say: 'We will ease you. The doubled سّ shows Form II, “make easy”. The نُ is “We” and the attached كَ is the object. It points to the future, like verse 6.' },
        { role: 'Preposition', say: 'To, toward. The phrase it starts belongs to نُيَسِّرُكَ.' },
        { role: 'After a preposition', say: 'The easiest way. Genitive after لِ; the kasra cannot be seen because of the alif maqsura. al-Jadwal: the feminine of أَيْسَر, “easiest”. It shares the root ي س ر with نُيَسِّرُكَ.' },
      ],
      quiz: { word: 2, q: 'What does the phrase لِلْيُسْرَىٰ belong to?', options: ['وَ', 'Nothing: it stands alone', 'The verb نُيَسِّرُكَ'], answer: 2, why: 'al-Jadwal ties the phrase to نُيَسِّرُكَ: He eases you toward the easiest way.' },
    },
    9: {
      words: [
        { role: 'Fa of the answer', say: 'al-Jadwal: it links the command to an unspoken “if”: if the reminder helps the one who will take heed, then remind.' },
        { role: 'Command, Form II, “you”', say: 'Remind. The doubled كّ shows Form II. It ends in sukun, the ordinary ending of a command. It is the answer to the unspoken condition.' },
        { role: 'Condition particle', say: 'If. It starts a condition, and the verb after it is the verb of the condition.' },
        { role: 'Verb, past, Form I, feminine', say: 'It benefited. Past tense, but after إِن it means the future. The ـتِ is feminine because الذِّكْرَىٰ is feminine; the kasra avoids two sukuns.' },
        { role: 'Subject (fāʿil)', say: 'The reminder. It does the benefiting, so it is nominative; the ḍamma cannot be seen because of the alif maqsura. Same root as ذَكِّرْ.' },
      ],
      quiz: { word: 0, q: 'What does the فَ in فَذَكِّرْ do, according to al-Jadwal?', options: ['It means “because”', 'It joins two verbs', 'It links the command to an unspoken condition'], answer: 2, why: 'The full sense is: if the reminder helps the one who will take heed, then remind. The written إِن clause explains that condition.' },
    },
    10: {
      words: [
        { role: 'Future prefix', say: 'Puts the verb in the near future: “will”.' },
        { role: 'Verb, present, Form V', say: 'He will take heed. Form V means doing it for oneself. It was يَتَذَكَّرُ; the تَ merged into the ذ. al-Jadwal reads this sentence as the reason for the command in verse 9.' },
        { role: 'Relative pronoun, subject', say: 'The one who. It is the subject of يَذَّكَّرُ, so it is nominative in position. Here it is a relative pronoun, not a “whoever” condition.' },
        { role: 'Verb, present, Form I', say: 'He fears. This clause completes مَن. The alif maqsura is a changed ya. What he fears (Allah) is understood.' },
      ],
      quiz: { word: 2, q: 'What is مَن in this verse, according to al-Jadwal?', options: ['A condition word: “whoever”', 'A question word', 'A relative pronoun: “the one who”'], answer: 2, why: 'al-Jadwal calls it a relative pronoun and the subject of يَذَّكَّرُ. The clause يَخْشَىٰ completes it.' },
    },
    11: {
      words: [
        { role: 'And', say: 'Joins this clause to سَيَذَّكَّرُ in verse 10. It only joins; the contrast comes from the meaning.' },
        { role: 'Verb, present, Form V, plus “it”', say: 'He avoids it. Form V: he puts himself to one side. The attached هَا is the object, and it points back to الذِّكْرَىٰ.' },
        { role: 'Subject (fāʿil)', say: 'The most wretched (pattern أَفْعَلُ). It does the avoiding, so it is nominative. It comes after the verb and its attached object, which is normal order.' },
      ],
      quiz: { word: 0, q: 'What does the وَ at the start of this verse do?', options: ['It swears an oath', 'It only joins this clause to the one before', 'It is a word of contrast that replaces “but”'], answer: 1, why: 'al-Jadwal joins the clause to سَيَذَّكَّرُ. The contrast between the fearful and the wretched comes from the meaning, not from the particle.' },
    },
    12: {
      words: [
        { role: 'Relative pronoun', say: 'Who. It describes الْأَشْقَىٰ from verse 11, so it is nominative in position.' },
        { role: 'Verb, present, Form I', say: 'He will burn in, will enter. This clause completes الَّذِي. The present tense points to the future here. The alif maqsura is a changed ya (root ص ل ي).' },
        { role: 'Object', say: 'The Fire. Object of يَصْلَى, so accusative with fatḥa.' },
        { role: 'Adjective of النَّارَ', say: 'The greatest. It describes النَّارَ, so it is accusative (the fatḥa cannot be seen) and feminine, like النَّارَ. It is the feminine of أَكْبَرُ.' },
      ],
      quiz: { word: 0, q: 'What does الَّذِي describe in this verse?', options: ['النَّارَ', 'يَصْلَى', 'الْأَشْقَىٰ'], answer: 2, why: 'al-Jadwal reads it as an adjective of الْأَشْقَىٰ from verse 11. The clause يَصْلَى النَّارَ completes it.' },
    },
    13: {
      words: [
        { role: 'Joining word: then', say: 'al-Jadwal: it joins this clause to يَصْلَى in verse 12. It adds a step in time: first the Fire, then this.' },
        { role: 'Negation', say: 'Says “not”. It does not change the mood of the verb.' },
        { role: 'Verb, present, Form I', say: 'He dies. It keeps its ḍamma, because لَا does not change it. This clause is part of the description of الْأَشْقَىٰ.' },
        { role: 'Preposition, plus “it”', say: 'In it. The pronoun هَا points back to النَّارَ, the Fire.' },
        { role: 'And', say: 'Joins the second negative clause to the first.' },
        { role: 'Negation', say: 'Says “not” again, for the second verb.' },
        { role: 'Verb, present, Form I', say: 'He lives. Root ح ي ي. The ending is a changed ya. It keeps its ordinary ḍamma, which cannot be seen.' },
      ],
      quiz: { word: 0, q: 'What does ثُمَّ join, according to al-Jadwal?', options: ['The clause لَا يَمُوتُ to the clause يَصْلَى', 'Two nouns', 'A question to its answer'], answer: 0, why: 'al-Jadwal joins لَا يَمُوتُ to the clause يَصْلَى in verse 12, so it belongs to the description of الْأَشْقَىٰ. ثُمَّ adds the step in time.' },
    },
    14: {
      words: [
        { role: 'Particle of certainty', say: 'Means “certainly”. With a past verb it adds certainty. al-Jadwal calls it a particle of making sure.' },
        { role: 'Verb, past, Form IV', say: 'He succeeded. The extra أَ shows Form IV. It has no object; the doer comes next. al-Jadwal calls this a new sentence.' },
        { role: 'Relative pronoun, subject', say: 'The one who. It is the doer of أَفْلَحَ, so it is nominative in position.' },
        { role: 'Verb, past, Form V', say: 'He purified himself. Form V means he did it to himself. This clause completes مَن. The alif maqsura is a changed last letter (root ز ك و).' },
      ],
      quiz: { word: 1, q: 'Which verb form is أَفْلَحَ?', options: ['Form IV', 'Form II', 'Form V'], answer: 0, why: 'The extra أَ before the root letters ف ل ح is the sign of Form IV (أَفْعَلَ). Here it simply means “he succeeded”.' },
    },
    15: {
      words: [
        { role: 'And', say: 'al-Jadwal joins this clause to تَزَكَّىٰ, the clause that completes مَن. So these are all things the successful one did.' },
        { role: 'Verb, past, Form I', say: 'He mentioned, he remembered. Form I, the plain verb. Same root as ذَكِّرْ and يَذَّكَّرُ.' },
        { role: 'Object, first part of a possession', say: 'Accusative, as the object of ذَكَرَ. It owns رَبِّهِ, so it has no al-.' },
        { role: 'Second part of a possession, plus “his”', say: 'Genitive with kasra. The attached هِ means “his”: the one who purified himself. In verse 1 it was كَ, “your”.' },
        { role: 'Joining fa', say: 'Joins صَلَّىٰ to ذَكَرَ: he remembered, then he prayed.' },
        { role: 'Verb, past, Form II', say: 'He prayed. The doubled لّ shows Form II. Root ص ل و; the alif maqsura is a changed و.' },
      ],
      quiz: { word: 0, q: 'What is the وَ at the start of this verse joined to?', options: ['تَزَكَّىٰ', 'أَفْلَحَ', 'صَلَّىٰ'], answer: 0, why: 'al-Jadwal joins ذَكَرَ to the clause تَزَكَّىٰ. So the one who succeeded purified himself, remembered his Lord, and prayed.' },
    },
    16: {
      words: [
        { role: 'Particle: turning to a new topic', say: 'Means “no, rather”. al-Jadwal reads it as a turn from an unspoken “you do not do this” to a new topic. It does not join two words here.' },
        { role: 'Verb, present, Form IV, “you” (plural)', say: 'You prefer. Form IV (أَفْعَلَ), root أ ث ر. The ending ـونَ is the plural “you”. This starts a new sentence.' },
        { role: 'Object', say: 'Life. Object of تُؤْثِرُونَ, so accusative with fatḥa.' },
        { role: 'Adjective of الْحَيَاةَ', say: 'The nearer, the lower. It describes الْحَيَاةَ, so it is accusative (the fatḥa cannot be seen). It is the feminine of أَدْنَى.' },
      ],
      quiz: { word: 0, q: 'What does بَلْ do in this verse?', options: ['It moves to a new topic', 'It joins two nouns', 'It asks a question'], answer: 0, why: 'al-Jadwal reads it as a particle of turning away: from an unspoken “you do not do this” to “you prefer the worldly life”.' },
    },
    17: {
      words: [
        { role: 'Wa of the ḥāl', say: 'al-Jadwal: it opens a clause that says in what state people prefer this life: while the Hereafter is better. It means “while”.' },
        { role: 'Subject (mubtadaʾ)', say: 'The Hereafter. It starts the sentence, so it is nominative.' },
        { role: 'Predicate (khabar)', say: 'Better. It says something about الْآخِرَةُ, so it is nominative with tanwin.' },
        { role: 'And', say: 'Joins أَبْقَىٰ to خَيْرٌ.' },
        { role: 'Second predicate', say: 'More lasting. It is joined to خَيْرٌ, so it is also a predicate and nominative; the ḍamma cannot be seen. It has no tanwin, because it is on the أَفْعَلُ pattern.' },
      ],
      quiz: { word: 0, q: 'What does al-Jadwal say the first وَ in this verse is?', options: ['The wa of an oath', 'The wa of the ḥāl: “while”', 'A wa that joins two verbs'], answer: 1, why: 'The clause الْآخِرَةُ خَيْرٌ وَأَبْقَىٰ describes the state of the people in verse 16: they prefer this life while the Hereafter is better. al-Jadwal also allows a new sentence.' },
    },
    18: {
      words: [
        { role: 'Inna', say: 'Strengthens the sentence: “indeed”. It puts its subject in the accusative.' },
        { role: 'Subject of inna', say: 'This. It points to what was just said. It never changes its ending, so it is accusative only in position.' },
        { role: 'Emphasis lam', say: 'A lam that adds emphasis. It sits on the predicate, not next to إِنَّ. al-Jadwal calls it the “moved” lam (lām al-muzaḥlaqa).' },
        { role: 'Preposition', say: 'In. al-Jadwal ties the phrase to the predicate of إِنَّ.' },
        { role: 'After a preposition', say: 'The scrolls, the scriptures. Genitive with kasra after فِي. It is a plural of things.' },
        { role: 'Adjective of الصُّحُفِ', say: 'The first, the earlier. It describes الصُّحُفِ, so it is genitive (the kasra cannot be seen). It is feminine singular, because a plural of things counts as feminine singular.' },
      ],
      quiz: { word: 2, q: 'Why does the لَ stand on لَفِي and not next to إِنَّ?', options: ['Because لَ means “in”', 'Because the lam cannot sit next to إِنَّ, so it moves to the predicate', 'Because هَٰذَا is a verb'], answer: 1, why: 'al-Jadwal calls it the “moved” lam. It adds emphasis, but it is placed on the predicate and not directly after إِنَّ.' },
    },
    19: {
      words: [
        { role: 'Substitute (badal), first part of a possession', say: 'al-Jadwal: it replaces الصُّحُفِ in verse 18 and says which scriptures are meant. So it is genitive. It owns إِبْرَاهِيمَ, so it has no al-.' },
        { role: 'Second part of a possession', say: 'Abraham. Genitive, but it shows a fatḥa and not a kasra, because a foreign name takes no tanwin and no kasra (a diptote).' },
        { role: 'And', say: 'Joins مُوسَىٰ to إِبْرَاهِيمَ.' },
        { role: 'Joined name', say: 'Moses. Joined to إِبْرَاهِيمَ, so it is also genitive. The case cannot be seen, because the name ends in alif maqsura.' },
      ],
      quiz: { word: 0, q: 'How does صُحُفِ relate to الصُّحُفِ in verse 18?', options: ['It is the predicate of إِنَّ', 'It is a substitute (badal) that says which scriptures', 'It is a new subject'], answer: 1, why: 'al-Jadwal calls صُحُفِ a badal of الصُّحُفِ. It repeats the idea and names the scriptures: those of Abraham and Moses.' },
    },
  },
};
