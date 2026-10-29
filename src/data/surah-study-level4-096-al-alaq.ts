// Plain-English teaching layer for Al-Alaq (96). Same shape and rules as in surah-study.ts.
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Someone who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from './surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Command (imperative)', say: 'Read, recite. A command to one man. It ends in sukun, so it never changes. The hamza at the start is a connecting hamza and drops when a word comes before it.' },
        { role: 'Preposition', say: 'In, with. It puts the next word in the genitive. al-Jadwal ties the phrase to a state of the one told to read: read while beginning with the name of your Lord.' },
        { role: 'After a preposition, first part of a possession', say: 'Genitive with kasra after بِ. It owns رَبِّكَ, so it has no al-.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because ٱسْمِ owns it. The ending كَ means “your”.' },
        { role: 'Relative pronoun, adjective (naʿt)', say: 'Who. al-Jadwal reads it as an adjective of رَبِّكَ. It never changes its ending, so only its position is genitive.' },
        { role: 'Verb, past, Form I', say: 'He created. This clause completes ٱلَّذِى. The subject “he” is hidden, and the object is not said.' },
      ],
      quiz: { word: 4, q: 'What does ٱلَّذِى do in this verse?', options: ['It describes رَبِّكَ, and the clause after it completes it', 'It is the object of ٱقْرَأْ', 'It is a preposition'], answer: 0, why: 'al-Jadwal reads ٱلَّذِى as an adjective of رَبِّكَ. The clause خَلَقَ after it says which Lord is meant.' },
    },
    2: {
      words: [
        { role: 'Verb, past, Form I', say: 'He created. The subject “he” is hidden. al-Jadwal reads this sentence as an explanation of the first خَلَقَ: it names what was created.' },
        { role: 'Object', say: 'Man. Accusative with fatḥa, because he is what was created.' },
        { role: 'Preposition', say: 'From. It gives the starting point of the creation. The phrase belongs to خَلَقَ.' },
        { role: 'After a preposition', say: 'Genitive with tanwin kasra after مِنْ. A clot: a lump that clings, in the first stage of a baby.' },
      ],
      quiz: { word: 3, q: 'Why does عَلَقٍ end in a kasra?', options: ['It is the object of خَلَقَ', 'It comes after the preposition مِنْ', 'It is the subject of the verse'], answer: 1, why: 'A noun after a preposition is always genitive. The object of خَلَقَ is ٱلْإِنسَـٰنَ, which is accusative.' },
    },
    3: {
      words: [
        { role: 'Command (imperative)', say: 'Read again. al-Jadwal says this repeats the command for emphasis, as a new sentence.' },
        { role: 'Circumstantial wa (wāw al-ḥāl)', say: 'al-Jadwal calls this وَ a ḥāl wāw: it opens a state. It means “while”, not just “and”.' },
        { role: 'Subject (mubtadaʾ)', say: 'Your Lord. It starts the sentence, so it is nominative with ḍamma. The ending كَ means “your”.' },
        { role: 'Predicate (khabar)', say: 'The Most Generous. It says something about the subject, so it is nominative. The pattern أَفْعَل usually means “more”, but al-Jadwal says here it means a generosity above all other generosity.' },
      ],
      quiz: { word: 1, q: 'What does the وَ in وَرَبُّكَ do?', options: ['It joins two equal commands', 'It swears an oath', 'It opens a state: read while your Lord is the Most Generous'], answer: 2, why: 'al-Jadwal calls it a ḥāl wāw. The sentence رَبُّكَ ٱلْأَكْرَمُ is a state of the one told to read, so وَ means “while”.' },
    },
    4: {
      words: [
        { role: 'Relative pronoun, adjective (naʿt)', say: 'Who. al-Jadwal reads it as an adjective of ٱلْأَكْرَمُ, so only its position is nominative. It never changes its ending. al-Jadwal also allows other readings.' },
        { role: 'Verb, past, Form II', say: 'He taught. Form II (فَعَّلَ) has a doubled middle letter and means “made someone know”. This clause completes ٱلَّذِى. The subject “he” is hidden.' },
        { role: 'Preposition', say: 'By, with. It shows the tool: taught by means of the pen. The phrase belongs to عَلَّمَ.' },
        { role: 'After a preposition', say: 'Genitive with kasra after بِ. The pen.' },
      ],
      quiz: { word: 2, q: 'What does the بِ in بِٱلْقَلَمِ show?', options: ['The tool: He taught by means of the pen', 'The place: He taught inside the pen', 'An oath: “by the pen”'], answer: 0, why: 'al-Jadwal calls this the bāʾ of help (istiʿānah): the pen is what He used to teach. It is not an oath.' },
    },
    5: {
      words: [
        { role: 'Verb, past, Form II', say: 'He taught. al-Jadwal reads this whole clause as a badal of the clause in verse 4: it says again what the teaching was. The subject “he” is hidden.' },
        { role: 'First object', say: 'Man, the one who was taught. Accusative with fatḥa.' },
        { role: 'Relative pronoun, second object', say: 'What. It is the second object of عَلَّمَ, and the clause لَمْ يَعْلَمْ completes it. It never changes its ending, so only its position is accusative.' },
        { role: 'Negation, jussive', say: 'A little word that means “did not”. It puts the verb after it in the jussive.' },
        { role: 'Verb, present, Form I, jussive', say: 'He knew. After لَمْ it ends in sukun, the sign of the jussive. The subject “he” is hidden and points back to man.' },
      ],
      quiz: { word: 2, q: 'What is مَا in this verse?', options: ['A word that means “not”', 'The second object of عَلَّمَ', 'The subject of يَعْلَمْ'], answer: 1, why: 'عَلَّمَ takes two objects: first man, then what he did not know. مَا stands for the thing that was taught.' },
    },
    6: {
      words: [
        { role: 'Rebuke', say: 'A word of “No, stop!” It turns away from what came before. al-Jadwal adds that some read it as “attention!” and others as “truly”.' },
        { role: 'Particle إِنَّ', say: 'Indeed. It stresses the sentence and puts the next noun in the accusative.' },
        { role: 'Noun of إِنَّ', say: 'Man. Accusative with fatḥa, because إِنَّ stands in front of it.' },
        { role: 'Shifted lām (lām al-muzaḥlaqa)', say: 'A لَ that stresses the sentence. It belongs with إِنَّ, but it moved to the predicate so that two stress words do not stand side by side.' },
        { role: 'Verb, present, Form I', say: 'He goes too far. This clause is the predicate of إِنَّ. The ending is an alif maqṣūra, so the ḍamma is not shown.' },
      ],
      quiz: { word: 3, q: 'What is the لَ in لَيَطْغَىٰٓ?', options: ['The lām of a command', 'The word for “to”', 'The shifted lām: a stress word that moved from إِنَّ to the predicate'], answer: 2, why: 'al-Jadwal calls it the shifted lām (lām al-muzaḥlaqa). It only adds stress, and it sits on the predicate.' },
    },
    7: {
      words: [
        { role: 'Particle أَنْ, makes a verbal noun', say: 'It turns the clause after it into a verbal noun: “his seeing himself ...”. al-Jadwal reads it as genitive in position, through a lām of reason that is left out, and ties it to يَطْغَىٰ.' },
        { role: 'Verb, past, Form I, plus “himself”', say: 'He saw. It is a verb of the heart. The ending هُ is its first object and means “himself”, because it points back to man.' },
        { role: 'Verb, past, Form X', say: 'He counted himself free of need. Form X (اِسْتَفْعَلَ) often means “to count oneself as”. This clause is the second object of رَّءَاهُ.' },
      ],
      quiz: { word: 0, q: 'What does أَن do in أَن رَّءَاهُ?', options: ['It is a maṣdar particle: it makes the clause a verbal noun', 'It means “if” and starts a condition', 'It is an oath particle'], answer: 0, why: 'al-Jadwal calls it a maṣdar particle. With its clause it gives the reason for يَطْغَىٰ: he goes too far because he saw himself free of need.' },
    },
    8: {
      words: [
        { role: 'Particle إِنَّ', say: 'Indeed. It stresses the sentence. Its noun comes last here.' },
        { role: 'Preposition', say: 'To. The phrase إِلَىٰ رَبِّكَ comes first. al-Jadwal ties it to the predicate of إِنَّ, which is not said.' },
        { role: 'After a preposition', say: 'Genitive with kasra after إِلَىٰ. The ending كَ means “your”.' },
        { role: 'Noun of إِنَّ', say: 'The return. It is accusative, but the fatḥa is hidden on the alif maqṣūra. It comes last, after the phrase, to stress that the return is to your Lord.' },
      ],
      quiz: { word: 3, q: 'What is ٱلرُّجْعَىٰ in this sentence?', options: ['The noun of إِنَّ, accusative with the fatḥa hidden on the alif', 'The predicate of إِنَّ', 'A verb'], answer: 0, why: 'The phrase إِلَىٰ رَبِّكَ comes first, so the noun of إِنَّ is pushed to the end. It stays accusative.' },
    },
    9: {
      words: [
        { role: 'Question word', say: 'A question of surprise: “Have you seen ...?” It does not ask for news.' },
        { role: 'Verb, past, Form I, plus “you”', say: 'You saw. al-Jadwal reads it as “tell me”. The ending تَ is the subject: “you”. The second object is left unsaid.' },
        { role: 'Relative pronoun, first object', say: 'The one who. It is the first object of رَءَيْتَ. It never changes its ending, so only its position is accusative.' },
        { role: 'Verb, present, Form I', say: 'He forbids. This clause completes ٱلَّذِى. The subject “he” is hidden. The one he forbids comes in verse 10.' },
      ],
      quiz: { word: 1, q: 'How does al-Jadwal read أَرَءَيْتَ here?', options: ['As a command', 'As a plain statement with no question', 'As “tell me”, in a question of surprise'], answer: 2, why: 'The أَ makes it a question of surprise, and the verb is like “tell me”. The second object is left out.' },
    },
    10: {
      words: [
        { role: 'Object', say: 'A servant. It is the object of يَنْهَىٰ in verse 9, so it is accusative with tanwin fatḥa. Most commentators say it means the Prophet.' },
        { role: 'Adverb of time', say: 'When. al-Jadwal says it only gives the time here, with no condition in it. It belongs to يَنْهَىٰ: he forbids at the time he prays.' },
        { role: 'Verb, past, Form II', say: 'He prayed. Its clause is the second part of a possession with إِذَا, so it is genitive in position. The subject “he” is hidden.' },
      ],
      quiz: { word: 1, q: 'Does إِذَا make a condition here?', options: ['Yes: it puts the next verb in the jussive', 'No: al-Jadwal says it only gives the time', 'Yes: it needs an answer'], answer: 1, why: 'al-Jadwal calls it a plain adverb of time here. The clause after it is its second part, so the verb stays past and is not jussive.' },
    },
    11: {
      words: [
        { role: 'Question word + verb, plus “you”', say: 'Have you seen. The same question of surprise as in verse 9. The ending تَ is the subject: “you”.' },
        { role: 'Conditional particle', say: 'If. It starts a condition and puts the verb after it in the jazm.' },
        { role: 'Verb kāna, past', say: 'He was. It is the verb of the condition, jazm in position only, because a past verb never changes. The subject “he” is hidden: the servant.' },
        { role: 'Preposition', say: 'On, upon. The phrase عَلَى ٱلْهُدَىٰٓ is tied to the predicate of كَانَ, which is not said.' },
        { role: 'After a preposition', say: 'Genitive after عَلَى. The kasra is hidden on the alif maqṣūra. The word means guidance.' },
      ],
      quiz: { word: 1, q: 'What is missing after إِن كَانَ عَلَى ٱلْهُدَىٰٓ?', options: ['The verb of the condition', 'The answer to the condition: it is left out', 'The preposition عَلَى'], answer: 1, why: 'al-Jadwal says the answer is dropped. The surprise in verse 9 and the question in verse 14 show what it would be.' },
    },
    12: {
      words: [
        { role: 'Conjunction “or”', say: 'Or. It joins this clause to the clause of كَانَ in verse 11, so both belong to the condition.' },
        { role: 'Verb, past, Form I', say: 'He ordered. The subject “he” is hidden. Its clause is joined to the clause of كَانَ.' },
        { role: 'Preposition', say: 'The verb أَمَرَ takes what is ordered with بِ. The phrase belongs to أَمَرَ.' },
        { role: 'After a preposition', say: 'Genitive after بِ, with the kasra hidden on the alif maqṣūra. Taqwa: guarding yourself, being aware of Allah. The first root letter و turned into تـ.' },
      ],
      quiz: { word: 0, q: 'What does أَوْ join here?', options: ['Two nouns', 'The condition and its answer', 'The clause أَمَرَ to the clause كَانَ, both inside the condition'], answer: 2, why: 'al-Jadwal says the clause أَمَرَ is joined to the clause كَانَ. Both are in the same condition: if he is on guidance, or orders taqwa.' },
    },
    13: {
      words: [
        { role: 'Question word + verb, plus “you”', say: 'Have you seen. The third time. The first object is left out; al-Jadwal says verse 9 shows it is the one who forbids. The second object is the question in verse 14.' },
        { role: 'Conditional particle', say: 'If. It starts a new condition.' },
        { role: 'Verb, past, Form II', say: 'He called it false. Form II (فَعَّلَ) has a doubled middle letter. It is the verb of the condition, jazm in position.' },
        { role: 'And', say: 'Joins تَوَلَّىٰٓ to كَذَّبَ.' },
        { role: 'Verb, past, Form V', say: 'He turned away. Form V (تَفَعَّلَ) starts with تَ. It is joined to كَذَّبَ, so it is also part of the condition.' },
      ],
      quiz: { word: 2, q: 'Which Form is كَذَّبَ?', options: ['Form II: the middle letter is doubled', 'Form V: it starts with تَ', 'Form VIII: it has a ت after the first letter'], answer: 0, why: 'كَذَّبَ is on the pattern فَعَّلَ, with the middle letter doubled. That is Form II. The verb next to it, تَوَلَّىٰٓ, is Form V.' },
    },
    14: {
      words: [
        { role: 'Question word', say: 'A question of reproach. It scolds; it does not ask for news.' },
        { role: 'Negation, jussive', say: 'A word that means “did not”. It puts يَعْلَم in the jussive.' },
        { role: 'Verb, present, Form I, jussive', say: 'He knows. After لَمْ it ends in sukun. The subject “he” is hidden: the one who forbids.' },
        { role: 'Preposition', say: 'Of, about. al-Jadwal reads it as a real preposition, not an extra one. Its phrase is the thing he should know, tied to يَعْلَم.' },
        { role: 'Particle “that”, like إِنَّ', say: 'That. It puts the next noun in the accusative and makes its clause a verbal noun, genitive after بِ.' },
        { role: 'Noun of أَنَّ', say: 'Allah. Accusative with fatḥa, because أَنَّ stands in front of it.' },
        { role: 'Verb, present, Form I', say: 'He sees. This clause is the predicate of أَنَّ. The subject “he” is hidden: Allah. The middle hamza has dropped, and the last letter shows as an alif maqṣūra.' },
      ],
      quiz: { word: 3, q: 'Is the بِ in بِأَنَّ an extra word?', options: ['Yes: it adds nothing', 'No: al-Jadwal reads it as a real preposition, tied to يَعْلَم', 'Yes, but only before أَنَّ'], answer: 1, why: 'The clause أَنَّ ٱللَّهَ يَرَىٰ is what he should know, and بِ links it to يَعْلَم. al-Jadwal does not call this بِ extra.' },
    },
    15: {
      words: [
        { role: 'Rebuke', say: 'No! A strong warning. It is the second time in the surah.' },
        { role: 'Oath-preparing lām + “if”', say: 'The لَ prepares for an oath that is not spoken. إِن means “if” and puts the next verb in the jazm.' },
        { role: 'Negation, jussive', say: 'Did not. It puts the verb after it in the jussive.' },
        { role: 'Verb, present, Form VIII, jussive', say: 'He stops. Form VIII (اِفْتَعَلَ) has a ت after the first letter. The last yā’ has dropped because of the jussive. The subject “he” is hidden.' },
        { role: 'Lām of the oath', say: 'This لَ begins the answer to the oath. The answer is the verb that follows.' },
        { role: 'Verb, present, 1st person plural, with emphatic nūn', say: 'We will seize and drag. The ending is a light emphatic nūn, which the mushaf writes like tanwin. It fixes the verb on fatḥa. This clause is the answer to the oath.' },
        { role: 'Preposition', say: 'By. It shows what is taken: seize by the forelock. The phrase belongs to نَسْفَعًۢا.' },
        { role: 'After a preposition', say: 'Genitive with kasra after بِ. The forelock: the hair at the front of the head.' },
      ],
      quiz: { word: 4, q: 'What is the لَ in لَنَسْفَعًۢا?', options: ['The lām of a command: “let us drag”', 'A word that means “not”', 'The lām of the oath, at the start of its answer'], answer: 2, why: 'The first لَ, in لَئِن, only prepares for the oath. This second لَ is the lām of the oath itself. al-Jadwal says the answer to the condition is left out, and this answer shows it.' },
    },
    16: {
      words: [
        { role: 'Badal of “the forelock”', say: 'A forelock. al-Jadwal reads it as a badal of ٱلنَّاصِيَةِ in verse 15: it stands in its place and is genitive too. It has tanwin because it is indefinite.' },
        { role: 'Adjective (naʿt)', say: 'Lying. It describes نَاصِيَةٍ, so it copies its genitive case and its feminine form. The pattern فَاعِلَة is an active participle.' },
        { role: 'Adjective (naʿt)', say: 'Sinning, in the wrong. A second adjective of نَاصِيَةٍ. al-Jadwal says the verse gives the forelock what really belongs to its owner, for emphasis.' },
      ],
      quiz: { word: 0, q: 'What is نَاصِيَةٍ in relation to ٱلنَّاصِيَةِ in verse 15?', options: ['A badal: it stands in its place and says more about it', 'A new subject', 'An adjective of it'], answer: 0, why: 'al-Jadwal reads it as a badal. It repeats the same forelock, in the same genitive case, now with two adjectives.' },
    },
    17: {
      words: [
        { role: 'Connecting fa', say: 'Then. al-Jadwal reads an unspoken condition before it: “if he can keep the punishment away”. This فَ ties the answer to it.' },
        { role: 'Lām of the command', say: 'This لْ gives a command to “he”: “let him”. It puts the verb after it in the jussive. The kasra is lost after فَ.' },
        { role: 'Verb, present, Form I, jussive', say: 'He calls. The last wāw has dropped because of the jussive. The subject “he” is hidden: the one who forbids.' },
        { role: 'Object, plus “his”', say: 'His council: the people who sit with him. Accusative with fatḥa. The word really means the meeting place; al-Jadwal says it stands for the people there. The ending هُ means “his”.' },
      ],
      quiz: { word: 0, q: 'What does the فَ in فَلْيَدْعُ do?', options: ['It shows cause and effect with the verse before', 'It ties the answer to a condition that is not spoken', 'It joins two commands'], answer: 1, why: 'al-Jadwal reads an unspoken condition: “if he can keep the punishment away”. The فَ ties the command to it as its answer.' },
    },
    18: {
      words: [
        { role: 'Future particle', say: 'Will. It puts the verb in the future. It does not change the verb’s ending.' },
        { role: 'Verb, present, 1st person plural', say: 'We call. “We” is Allah, the plural of majesty. The mushaf does not write the last wāw, but the ḍamma is there. al-Jadwal reads this clause as the reason for verse 17.' },
        { role: 'Object', say: 'The angels of punishment. Accusative with fatḥa. A plural, found only here in the Quran.' },
      ],
      quiz: { word: 1, q: 'What shows that the subject of نَدْعُ is “We”?', options: ['The سَ in front of it', 'The ending of ٱلزَّبَانِيَةَ', 'The نَ at the start of the verb'], answer: 2, why: 'The prefix نَ marks “we”. al-Jadwal says this “we” is Allah, in the plural of majesty.' },
    },
    19: {
      words: [
        { role: 'Rebuke', say: 'No! The third and last time in the surah.' },
        { role: 'Prohibition', say: 'Do not. This لَا forbids something and puts the verb after it in the jussive.' },
        { role: 'Verb, present, Form IV, jussive, plus “him”', say: 'You obey. Form IV (أَفْعَلَ). In the jussive the long ī has dropped, so two sukuns do not meet. The ending هُ is the object: “him”.' },
        { role: 'And', say: 'Joins the next command to the new sentence before it.' },
        { role: 'Command (imperative), Form I', say: 'Prostrate. It ends in sukun, so it never changes. al-Jadwal gives it no place of its own in the sentence.' },
        { role: 'And', say: 'Joins the next command to the same sentence.' },
        { role: 'Command (imperative), Form VIII', say: 'Come near. Form VIII (اِفْتَعَلَ) has a ت after the first letter. It ends in sukun, so it never changes.' },
      ],
      quiz: { word: 2, q: 'Why does تُطِعْهُ have no long ī before the ع, as the present tense does?', options: ['The long ī dropped in the jussive, so two sukuns do not meet', 'It is a command, so the letter dropped', 'It is Form I'], answer: 0, why: 'لَا forbids and puts the verb in the jussive. The ع then gets sukun, and the long ī goes so that two sukuns do not meet. The verb is still Form IV.' },
    },
  },
};
