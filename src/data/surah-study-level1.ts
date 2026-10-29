// Plain-English teaching layer for the surahs read after Level 1: Al-Fatiha, Quraysh, Al-Falaq and An-Nas
// (Al-Ikhlas is in surah-study.ts). Same shape and rules as there.
//
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi), and for Quraysh 106:3 and An-Nas 114:6 also against al-Daʿʿās and al-Durr al-Maṣūn.
// Where the books give more than one reading, the line says which one it follows. Someone who knows Arabic grammar
// should read these before they ship.
import type { SurahStudy } from './surah-study';

export const LEVEL_1: Record<string, SurahStudy> = {
  '001-al-fatiha': {
    verses: {
      1: {
        words: [
          { role: 'Prepositional phrase', say: 'بِ means “in, with” and اسْمِ means “name”. The phrase is tied to something left unsaid, like “my beginning is”.' },
          { role: 'Second part of a possession', say: 'اسْمِ owns it, so it is genitive (kasra). In a possession the second word is always genitive.' },
          { role: 'Adjective (naʿt)', say: 'It describes Allah: the Most Gracious. An adjective copies the case of the word it describes, so it is genitive too.' },
          { role: 'Second adjective (naʿt)', say: 'A second description of Allah: the Most Merciful. Same case as Allah: genitive.' },
        ],
        quiz: { word: 2, q: 'Why does الرَّحْمَـٰنِ end in a kasra?', options: ['It follows بِ directly', 'It describes اللَّهِ, which is genitive, so it copies that case', 'It is the second part of a possession'], answer: 1, why: 'An adjective takes the case of the word it describes. اللَّهِ is genitive, so الرَّحْمَـٰنِ is genitive.' },
      },
      2: {
        words: [
          { role: 'Subject (mubtadaʾ)', say: 'It opens the sentence, so it is the subject and takes the nominative (ḍamma).' },
          { role: 'Prepositional phrase', say: 'لِ means “for, belonging to”. The phrase says who owns the praise. It is tied to an unspoken predicate, like “is for”.' },
          { role: 'Adjective (naʿt), first part of a possession', say: 'It describes Allah: Lord of. It is also the first word of a possession with الْعَالَمِينَ, so it has no al-.' },
          { role: 'Second part of a possession', say: 'It follows رَبِّ in a possession, so it is genitive. The ـِينَ ending is the genitive ending of this plural.' },
        ],
        quiz: { word: 0, q: 'What case is الْحَمْدُ, and why?', options: ['Nominative: it is the subject of the sentence', 'Genitive: it follows a preposition', 'Accusative: it is an object'], answer: 0, why: 'It opens the sentence and the rest says something about it, so it is the subject (mubtadaʾ). A subject is nominative.' },
      },
      3: {
        words: [
          { role: 'Adjective (naʿt)', say: 'The verse repeats the two descriptions of Allah. It is genitive because it describes اللَّهِ from verse 2. (al-Jadwal also allows reading it as a badal.)' },
          { role: 'Second adjective (naʿt)', say: 'The second description: the Most Merciful. Same case as Allah: genitive.' },
        ],
        quiz: { word: 0, q: 'Which word does الرَّحْمَـٰنِ describe here?', options: ['رَبِّ', 'اللَّهِ', 'الْعَالَمِينَ'], answer: 1, why: 'It is an adjective of اللَّهِ from verse 2, so it copies its genitive case, even across the verse break.' },
      },
      4: {
        words: [
          { role: 'Adjective (naʿt), first part of a possession', say: 'It describes Allah, so it is genitive. It is also the first word of the possession مَالِكِ يَوْمِ الدِّينِ, so it has no al-.' },
          { role: 'Second part, then first part again', say: 'It belongs to مَالِكِ, so it is genitive. It also owns الدِّينِ, so it has no al-.' },
          { role: 'Second part of a possession', say: 'The last word of the chain is genitive and has al-.' },
        ],
        quiz: { word: 1, q: 'Why does يَوْمِ have no al-?', options: ['It is the first word of a possession, so the last word carries the definiteness', 'It is indefinite by mistake', 'It is a verb'], answer: 0, why: 'In a possession (iḍāfa) the first word never takes al-. الدِّينِ at the end makes the whole phrase definite.' },
      },
      5: {
        words: [
          { role: 'Object, put first', say: 'It is the object of نَعْبُدُ but comes before the verb. Putting it first limits the worship to Allah: “You alone”.' },
          { role: 'Verb, present', say: 'The subject “we” is hidden inside the verb. It ends in a ḍamma because nothing changes its mood.' },
          { role: 'And + object, put first', say: 'وَ joins the second statement to the first, and إِيَّاكَ is again the object placed before its verb.' },
          { role: 'Verb, present, Form X', say: 'Form X (اسْتَفْعَلَ) means asking for something, here help. The subject “we” is hidden.' },
        ],
        quiz: { word: 0, q: 'Why does إِيَّاكَ come before the verb?', options: ['To limit worship to Allah: “You alone”', 'Because it is the subject', 'Because verbs must come last'], answer: 0, why: 'The object is put first for emphasis (ḥaṣr). It says: we worship You and no one else.' },
      },
      6: {
        words: [
          { role: 'Command verb, plus “us”', say: 'It is a request to Allah, but its form is a command. نَا (“us”) is the first object. The subject “you” is hidden.' },
          { role: 'Second object', say: 'هَدَى can take two objects: who is guided (us) and where to (the path). The second object is accusative (fatḥa).' },
          { role: 'Adjective (naʿt)', say: 'It describes الصِّرَاطَ, so it is accusative too.' },
        ],
        quiz: { word: 1, q: 'What is الصِّرَاطَ in this verse?', options: ['The first object of اهْدِنَا', 'The second object of اهْدِنَا', 'The subject'], answer: 1, why: 'نَا is the first object (who is guided). الصِّرَاطَ is the second (where to). Both are accusative.' },
      },
      7: {
        words: [
          { role: 'Badal of “the path”, first part of a possession', say: 'It says which path: “the path of those…”. A badal copies the case of the word it stands for, so it is accusative.' },
          { role: 'Relative pronoun, second part of a possession', say: 'It never changes its ending. It is the second part of the possession, so it counts as genitive.' },
          { role: 'Past verb', say: 'تَ is “you” (Allah). This clause explains الَّذِينَ.' },
          { role: 'Prepositional phrase', say: 'عَلَى (“on”) with هِمْ (“them”). It belongs to أَنْعَمْتَ: you blessed them.' },
          { role: 'Badal of “those who”', say: 'al-Jadwal reads it as a badal of الَّذِينَ, so it is genitive. It is also the first word of a possession.' },
          { role: 'Second part of a possession', say: 'A passive participle: they are the ones the anger falls on. It is genitive because غَيْرِ owns it.' },
          { role: 'Stands in for the subject of the passive', say: 'With الْمَغْضُوبِ it means “those anger is put on”. In a passive, this phrase takes the place of the subject.' },
          { role: 'And + extra “not”', say: 'وَ joins the next group. لَا is added to make the “not” stronger: not these, and not those.' },
          { role: 'Joined to “other than”', say: 'وَ joins it to غَيْرِ, so it is genitive. The ـِينَ ending is the genitive of this plural.' },
        ],
        quiz: { word: 4, q: 'Why is غَيْرِ genitive, though it does not follow a preposition?', options: ['It stands in place of الَّذِينَ, which is genitive', 'It is a verb', 'It is the subject'], answer: 0, why: 'al-Jadwal reads it as a badal of الَّذِينَ. A badal copies the case of the word it stands for. He lists two other readings too.' },
      },
    },
  },

  '106-quraysh': {
    verses: {
      1: {
        words: [
          { role: 'Preposition: “for, because of”', say: 'al-Jadwal ties it to يَعْبُدُوا in verse 3: let them worship because of this.' },
          { role: 'Verbal noun after a preposition', say: 'It is a verbal noun (maṣdar) of Form IV. It follows لِ, so it is genitive, and it is the first word of a possession.' },
          { role: 'Second part of a possession', say: 'They are the ones who are made familiar. Second part of the possession, so genitive.' },
        ],
        quiz: { word: 1, q: 'Why is إِيلَافِ genitive?', options: ['It follows the preposition لِ', 'It is the subject', 'It is the object of a verb'], answer: 0, why: 'A word after a preposition is genitive. إِيلَافِ also owns قُرَيْشٍ.' },
      },
      2: {
        words: [
          { role: 'Badal of “the accustoming”', say: 'It repeats and explains the first إِيلَافِ, so it is genitive like it.' },
          { role: 'Object of the verbal noun', say: 'A verbal noun can take an object like a verb does. Here it is accusative (fatḥa) and the first word of a possession.' },
          { role: 'Second part of a possession', say: 'The journey of winter. Genitive.' },
          { role: 'And', say: 'Joins summer to winter.' },
          { role: 'Joined to “winter”', say: 'Joined to الشِّتَاءِ by وَ, so it is genitive too.' },
        ],
        quiz: { word: 1, q: 'Why is رِحْلَةَ accusative?', options: ['It is the object of the verbal noun إِيلَافِهِمْ', 'It follows a preposition', 'It is the subject'], answer: 0, why: 'A verbal noun can work like its verb and take an object: “their accustoming (to) the journey”.' },
      },
      3: {
        words: [
          { role: 'Fāʾ that opens an answer', say: 'al-Jadwal: it starts the answer to an unspoken condition. If they will not worship Him for any other favour, let them worship Him for this one.' },
          { role: 'Lām of command', say: 'لْ with a present verb makes a command for “him, her, them”: “let them”.' },
          { role: 'Verb, jussive', say: 'After لْ the verb is jussive, so the final نْ of يَعْبُدُونَ drops. The ـوا ending is “they”.' },
          { role: 'Object, first part of a possession', say: 'It is the object of the verb, so accusative (fatḥa), and the first word of a possession, so no al-.' },
          { role: 'Second part of a possession', say: 'A pointing word. It does not change its ending, but it counts as genitive because رَبَّ owns it.' },
          { role: 'Badal of “this”', say: 'It says which thing “this” points to, so it is genitive like هَـٰذَا.' },
        ],
        quiz: { word: 2, q: 'Why does يَعْبُدُوا lose the final ن of يَعْبُدُونَ?', options: ['The lām of command makes the verb jussive', 'Because it is past tense', 'Because it is passive'], answer: 0, why: 'لْ puts the verb in the jussive. For verbs ending in ـُونَ the jussive sign is dropping the نْ.' },
      },
      4: {
        words: [
          { role: 'Relative pronoun, adjective of “Lord”', say: 'It describes رَبَّ, so it sits in the accusative position.' },
          { role: 'Past verb, plus “them”', say: 'Form IV makes someone do the action: to make them eat. هُمْ (“them”) is the object. This clause explains الَّذِي.' },
          { role: 'Preposition', say: 'Here it gives the reason (al-Jadwal): the feeding answers hunger.' },
          { role: 'After a preposition', say: 'Genitive after مِنْ. The tanwin means any hunger.' },
          { role: 'And', say: 'Joins the second favour to the first.' },
          { role: 'Past verb, plus “them”', say: 'Form IV of أَمِنَ. It is joined to the verb before it.' },
          { role: 'Preposition', say: 'From.' },
          { role: 'After a preposition', say: 'Genitive after مِنْ, with tanwin.' },
        ],
        quiz: { word: 1, q: 'What does Form IV usually add to the meaning of a verb?', options: ['It makes someone else do the action: to cause it', 'It makes the verb passive', 'It makes the verb past'], answer: 0, why: 'Form IV (أَفْعَلَ) often means to cause someone to do the action: أَطْعَمَهُمْ is “made them eat”, to feed them.' },
      },
    },
  },

  '113-al-falaq': {
    verses: {
      1: {
        words: [
          { role: 'Command', say: 'The middle letter و dropped (from قَالَ) and the verb ends in sukun.' },
          { role: 'Verb, present', say: 'The أَ at the start means “I”. It ends in a ḍamma.' },
          { role: 'Prepositional phrase, first part of a possession', say: 'بِ means “in” here: I take refuge in the Lord. The phrase belongs to أَعُوذُ.' },
          { role: 'Second part of a possession', say: 'Genitive after رَبِّ.' },
        ],
        quiz: { word: 1, q: 'What does the أَ at the start of أَعُوذُ mean?', options: ['I', 'We', 'You'], answer: 0, why: 'A present verb that starts with أَ is first person singular: I seek refuge.' },
      },
      2: {
        words: [
          { role: 'Preposition', say: 'It belongs to أَعُوذُ: I seek refuge from.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive after مِن, and the first word of a possession.' },
          { role: 'Relative pronoun', say: 'It never changes its ending. It is the second part of the possession.' },
          { role: 'Past verb', say: 'This clause explains مَا. The word it points back to is left out.' },
        ],
        quiz: { word: 3, q: 'What is the job of the clause خَلَقَ?', options: ['It says which thing مَا means (a relative clause)', 'It is a question', 'It is the subject'], answer: 0, why: 'A relative pronoun needs a clause after it to say which thing is meant. خَلَقَ is that clause for مَا.' },
      },
      3: {
        words: [
          { role: 'And + preposition', say: 'وَ adds another evil to the list, and مِن again belongs to أَعُوذُ.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive after مِن.' },
          { role: 'Second part of a possession', say: 'An active participle of غَسَقَ: the one that grows dark. Genitive with tanwin.' },
          { role: 'Time word', say: 'al-Jadwal: it only gives the time here, with no “if” in it, and it belongs to شَرِّ: the evil when it settles.' },
          { role: 'Past verb', say: 'Its clause is the second part of the possession with إِذَا, which is why a past verb comes after it.' },
        ],
        quiz: { word: 3, q: 'Does إِذَا mean “if” in this verse?', options: ['No, it only says when', 'Yes, it makes a condition', 'It is a verb'], answer: 0, why: 'al-Jadwal says it has no condition in it here. It names the time of the evil: when darkness settles.' },
      },
      4: {
        words: [
          { role: 'And + preposition', say: 'وَ adds another evil, and مِن belongs to أَعُوذُ.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive after مِن.' },
          { role: 'Second part of a possession', say: 'An intensive form (فَعَّالَة): they do it again and again. Feminine plural, genitive with kasra.' },
          { role: 'Preposition', say: 'The phrase belongs to النَّفَّاثَاتِ: blowing on the knots.' },
          { role: 'After a preposition', say: 'Genitive after فِي.' },
        ],
        quiz: { word: 2, q: 'What does the intensive pattern of النَّفَّاثَاتِ add?', options: ['They do it again and again', 'It makes the word singular', 'It makes it passive'], answer: 0, why: 'The pattern فَعَّال is an intensive form of the active participle: not just blowing, but blowing again and again.' },
      },
      5: {
        words: [
          { role: 'And + preposition', say: 'وَ adds the last evil, and مِن belongs to أَعُوذُ.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive after مِن.' },
          { role: 'Second part of a possession', say: 'An active participle: the one who envies. Genitive with tanwin.' },
          { role: 'Time word', say: 'Like in verse 3 it only gives the time and belongs to شَرِّ.' },
          { role: 'Past verb', say: 'Its clause is the second part of the possession with إِذَا.' },
        ],
        quiz: { word: 2, q: 'What kind of word is حَاسِدٍ?', options: ['An active participle: the one who envies', 'A passive participle', 'A verb'], answer: 0, why: 'The pattern فَاعِل names the doer: حَاسِد is the one who envies, like غَاسِق, the one that grows dark.' },
      },
    },
  },

  '114-an-nas': {
    verses: {
      1: {
        words: [
          { role: 'Command', say: 'The middle letter و dropped and the verb ends in sukun.' },
          { role: 'Verb, present', say: 'The أَ at the start means “I”.' },
          { role: 'Prepositional phrase, first part of a possession', say: 'The phrase belongs to أَعُوذُ.' },
          { role: 'Second part of a possession', say: 'Genitive after رَبِّ.' },
        ],
        quiz: { word: 3, q: 'Why is النَّاسِ genitive?', options: ['It is the second part of a possession, after رَبِّ', 'It is the subject', 'It is a verb'], answer: 0, why: 'In a possession the second word is always genitive. رَبِّ owns النَّاسِ.' },
      },
      2: {
        words: [
          { role: 'Badal of “Lord”, first part of a possession', say: 'It stands in place of رَبِّ and explains it, so it is genitive. (al-Jadwal also allows an adjective.)' },
          { role: 'Second part of a possession', say: 'Genitive after مَلِكِ.' },
        ],
        quiz: { word: 0, q: 'Which word does مَلِكِ stand in place of?', options: ['رَبِّ', 'أَعُوذُ', 'قُلْ'], answer: 0, why: 'al-Jadwal reads مَلِكِ as a badal of رَبِّ, so it copies its genitive case.' },
      },
      3: {
        words: [
          { role: 'Badal of “King”, first part of a possession', say: 'It follows مَلِكِ as a badal, so it is genitive.' },
          { role: 'Second part of a possession', say: 'Genitive after إِلَـٰهِ.' },
        ],
        quiz: { word: 0, q: 'Why does إِلَـٰهِ have no al-?', options: ['It is the first word of a possession', 'It is a verb', 'It is a mistake'], answer: 0, why: 'In a possession the first word never takes al-. النَّاسِ after it carries the definiteness.' },
      },
      4: {
        words: [
          { role: 'Preposition', say: 'It belongs to أَعُوذُ: I seek refuge from.' },
          { role: 'After a preposition, first part of a possession', say: 'Genitive after مِن.' },
          { role: 'Second part of a possession', say: 'A name for someone who whispers. Genitive.' },
          { role: 'Adjective (naʿt)', say: 'The one who slips away. An intensive form: he does it again and again. It describes الْوَسْوَاسِ, so it is genitive.' },
        ],
        quiz: { word: 3, q: 'Which word does الْخَنَّاسِ describe?', options: ['الْوَسْوَاسِ', 'النَّاسِ', 'شَرِّ'], answer: 0, why: 'An adjective follows the word it describes and copies its case. الْخَنَّاسِ describes الْوَسْوَاسِ.' },
      },
      5: {
        words: [
          { role: 'Relative pronoun, adjective of “the whisperer”', say: 'It describes الْوَسْوَاسِ, so it sits in the genitive position.' },
          { role: 'Verb, present', say: 'A four-letter verb (و س و س): the repeated sound copies the sound of whispering. Its clause explains الَّذِي.' },
          { role: 'Preposition', say: 'The phrase belongs to يُوَسْوِسُ.' },
          { role: 'After a preposition, first part of a possession', say: 'A broken plural. Genitive after فِي.' },
          { role: 'Second part of a possession', say: 'Genitive after صُدُورِ.' },
        ],
        quiz: { word: 1, q: 'What is special about the verb يُوَسْوِسُ?', options: ['Its repeated sound copies the sound of whispering', 'It is a command', 'It is passive'], answer: 0, why: 'The doubled و-س pattern is a four-letter verb whose sound copies what it describes: a whisper.' },
      },
      6: {
        words: [
          { role: 'Preposition', say: 'The phrase مِنَ الْجِنَّةِ tells what the whisperer is: al-Jadwal reads it as a ḥāl, a state of the one who whispers. The fatḥa is because two sukuns met.' },
          { role: 'After a preposition', say: 'Genitive after مِنَ.' },
          { role: 'And', say: 'Joins mankind to the jinn.' },
          { role: 'Joined to “the jinn”', say: 'وَ joins it to الْجِنَّةِ, so it is genitive after مِنَ too.' },
        ],
        quiz: { word: 3, q: 'Why is النَّاسِ genitive in this verse?', options: ['وَ joins it to الْجِنَّةِ, which follows مِنَ', 'It is the object of a verb', 'It is the subject'], answer: 0, why: 'A word joined by وَ copies the case of the word before it. الْجِنَّةِ is genitive after مِنَ, so النَّاسِ is too.' },
      },
    },
  },
};
