// Plain-English teaching layer for Surah 79, An-Naziʿat. Same shape and rules as in surah-study.ts.
//
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Where al-Jadwal gives more than one reading, the line says which one it follows. Someone
// who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from '../surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Oath wāw + thing sworn by', say: 'The وَ is the oath wāw: it means “I swear by”, and the verb “I swear” is left unsaid. وَٱلنَّـٰزِعَـٰتِ is the thing sworn by, so it is genitive. al-Jadwal says these are the angels.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'غَرْقًا is accusative with tanwin fatḥa. It stands in for the verbal noun and says how the pulling is done: hard and deep. al-Jadwal also quotes a view that makes it a ḥāl.' },
      ],
      quiz: { word: 0, q: 'What does the first وَ do in وَٱلنَّـٰزِعَـٰتِ?', options: ['It only joins two words', 'It is the oath wāw: “I swear by”', 'It means “but”'], answer: 1, why: 'This is the first oath, so the وَ is the oath wāw. In the next verses al-Jadwal reads the wāw and fāʾ as plain joining words.' },
    },
    2: {
      words: [
        { role: 'Joining wāw + thing sworn by', say: 'This وَ is not a new oath. al-Jadwal reads it as a joining wāw: it ties this oath to the first one. وَٱلنَّـٰشِطَـٰتِ is genitive, because it is also sworn by.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'نَشْطًا is accusative with tanwin fatḥa. It stands in for the verbal noun and says how: with ease.' },
      ],
      quiz: { word: 0, q: 'What is the job of the وَ in وَٱلنَّـٰشِطَـٰتِ?', options: ['It joins this oath to the first one', 'It starts a brand-new oath', 'It means “and not”'], answer: 0, why: 'The oath is made once, in verse 1. al-Jadwal reads the later وَ and فَ as joining words (ʿāṭifa).' },
    },
    3: {
      words: [
        { role: 'Joining wāw + thing sworn by', say: 'A joining wāw again, tying this oath to the first. وَٱلسَّـٰبِحَـٰتِ is genitive, because it is also sworn by.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'سَبْحًا is accusative with tanwin fatḥa. It stands in for the verbal noun: swimming, gliding quickly.' },
      ],
      quiz: { word: 1, q: 'Why does سَبْحًا end in tanwin fatḥa?', options: ['It comes after a preposition', 'It is the subject of a sentence', 'It is an absolute object (mafʿūl muṭlaq), which is accusative'], answer: 2, why: 'سَبْحًا stands in for the verbal noun of the action, and that kind of word is accusative.' },
    },
    4: {
      words: [
        { role: 'Joining fāʾ + thing sworn by', say: 'al-Jadwal reads this فَ as a joining word, like the wāw before it. It is not a “because” fāʾ. وَٱلسَّـٰبِقَـٰتِ is genitive, because it is also sworn by.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'سَبْقًا is accusative with tanwin fatḥa. It stands in for the verbal noun: racing ahead.' },
      ],
      quiz: { word: 0, q: 'How does al-Jadwal read the فَ in فَٱلسَّـٰبِقَـٰتِ?', options: ['A fāʾ of cause: “because of this”', 'An oath fāʾ that starts a new oath', 'A joining fāʾ, like the wāw before it'], answer: 2, why: 'The fāʾ links this oath to the ones before it. al-Jadwal does not read it as a fāʾ of cause.' },
    },
    5: {
      words: [
        { role: 'Joining fāʾ + thing sworn by', say: 'A joining fāʾ again. فَٱلْمُدَبِّرَٰتِ is genitive. It is Form II and means those who arrange things.' },
        { role: 'Direct object (mafʿūl bihi)', say: 'أَمْرًا is accusative. It is the object of the participle ٱلْمُدَبِّرَٰتِ: they arrange what? A matter. This is the only one of the five oaths whose second word is a real object, not an absolute object.' },
      ],
      quiz: { word: 1, q: 'What is أَمْرًا in this verse?', options: ['An absolute object (mafʿūl muṭlaq)', 'The direct object of ٱلْمُدَبِّرَٰتِ', 'The subject of the sentence'], answer: 1, why: 'ٱلْمُدَبِّرَٰتِ acts on something, and أَمْرًا is what it acts on. The other four oaths end in an absolute object.' },
    },
    6: {
      words: [
        { role: 'Time word (ẓarf)', say: 'It says when. It is accusative with fatḥa. al-Jadwal ties it to the answer of the oath, which is left unsaid (لَتُبْعَثُنَّ, “you will be raised”). The clause after it completes it, like the second part of a possession phrase.' },
        { role: 'Verb, present', say: 'Indicative, with ḍamma. It is feminine (the تـ) because its doer is feminine. The whole clause completes يَوْمَ.' },
        { role: 'Doer (fāʿil)', say: 'Nominative with ḍamma. It is the first blast. al-Jadwal calls the shaking a figure of speech (isnād majāzī): the blast only causes the shaking.' },
      ],
      quiz: { word: 0, q: 'What does al-Jadwal tie يَوْمَ to?', options: ['The unspoken answer to the oath', 'The verb تَرْجُفُ', 'The word ٱلرَّاجِفَةُ'], answer: 0, why: 'The answer to the oath is left out (“you will be raised”), and يَوْمَ names the time of it. So verse 6 is not the answer itself.' },
    },
    7: {
      words: [
        { role: 'Verb, present, plus “it”', say: 'Indicative, with ḍamma. The ending هَا means “it” and points back to ٱلرَّاجِفَةُ. In al-Jadwal the whole clause is a ḥāl: it tells the state of the first blast.' },
        { role: 'Doer (fāʿil)', say: 'Nominative with ḍamma. It is the second blast, the one that follows. The verb comes first, then its object pronoun, then the doer.' },
      ],
      quiz: { word: 0, q: 'What is the clause تَتْبَعُهَا ٱلرَّادِفَةُ in al-Jadwal?', options: ['A ḥāl: the state of the first blast', 'The answer to the oath', 'A new question'], answer: 0, why: 'al-Jadwal reads it as a ḥāl from ٱلرَّاجِفَةُ: the first blast comes with the second one following it.' },
    },
    8: {
      words: [
        { role: 'Subject (mubtadaʾ)', say: 'Nominative with tanwin. Its predicate is the whole clause in verse 9, not the word that comes next here.' },
        { role: 'Time word (ẓarf)', say: 'It means “on that day” and is made of يَوْم + إِذْ. al-Jadwal ties it to وَاجِفَةٌ. A time word may stand between an adjective and the noun it describes.' },
        { role: 'Adjective (naʿt)', say: 'It describes قُلُوبٌ, so it is nominative with tanwin. It is feminine singular because the noun is a broken plural of things. Do not read it as the predicate: that comes in verse 9.' },
      ],
      quiz: { word: 2, q: 'What is وَاجِفَةٌ in al-Jadwal?', options: ['The predicate (khabar) of قُلُوبٌ', 'The doer of a verb', 'An adjective (naʿt) of قُلُوبٌ'], answer: 2, why: 'The predicate of قُلُوبٌ is the clause أَبْصَـٰرُهَا خَـٰشِعَةٌ in verse 9. وَاجِفَةٌ only describes the hearts.' },
    },
    9: {
      words: [
        { role: 'Second subject (mubtadaʾ)', say: 'Nominative with ḍamma. al-Jadwal reads a word left out: “the eyes of their owners”. The ending هَا points back to the hearts.' },
        { role: 'Predicate (khabar)', say: 'It says what the eyes are: lowered. This whole clause is the predicate of قُلُوبٌ in verse 8.' },
      ],
      quiz: { word: 1, q: 'What is the clause أَبْصَـٰرُهَا خَـٰشِعَةٌ?', options: ['The answer to an oath', 'The predicate (khabar) of قُلُوبٌ', 'An adjective of يَوْمَئِذٍۢ'], answer: 1, why: 'قُلُوبٌ is the subject from verse 8. Its predicate is this whole clause, which has its own subject and predicate.' },
    },
    10: {
      words: [
        { role: 'Verb, present', say: 'Present, “they”: the ـونَ belongs to the verb. In al-Jadwal this clause is the predicate of an unspoken “they”, and the sentence is a ḥāl of the people with the trembling hearts.' },
        { role: 'Question hamza + inna + “we”', say: 'The أَ asks a question of denial: they do not really ask. إِنَّ makes the sentence strong and puts نَا (“we”) in the accusative as its noun.' },
        { role: 'Predicate of inna', say: 'Nominative; the ـونَ ending marks a sound masculine plural. The لَ is the strengthening lām (lām al-muzaḥlaqa): it slid back from the front of إِنَّ onto the predicate.' },
        { role: 'Preposition', say: 'It belongs to مَرْدُودُونَ: “sent back into”.' },
        { role: 'After a preposition', say: 'Genitive with kasra after فِى. al-Jadwal says it names the path back to where a person came from, and here it means the earth.' },
      ],
      quiz: { word: 2, q: 'What is the job of the لَ in لَمَرْدُودُونَ?', options: ['It means “not”', 'It strengthens the predicate', 'It is the lām of command'], answer: 1, why: 'This is the lām of emphasis. It sits on the predicate of إِنَّ and adds force to the question of denial.' },
    },
    11: {
      words: [
        { role: 'Question hamza + time word', say: 'The أَ asks a question of denial. إِذَا here is a time word: the clause after it completes it. al-Jadwal says its answer is left unsaid, something like “shall we be raised anew?”.' },
        { role: 'Verb kāna + “we”', say: 'Past of كَانَ. The ending نَا is its subject, “we”. The clause كُنَّا عِظَـٰمًا نَّخِرَةً completes إِذَا.' },
        { role: 'Predicate of kāna', say: 'Accusative with tanwin fatḥa, because كَانَ puts its predicate in the accusative. It is the broken plural of عَظْم, “bone”.' },
        { role: 'Adjective (naʿt)', say: 'It describes عِظَـٰمًا, so it copies its accusative case. It is feminine singular because broken plurals of things take the feminine singular.' },
      ],
      quiz: { word: 0, q: 'How does al-Jadwal read إِذَا in أَءِذَا كُنَّا...?', options: ['A time word; the clause after it completes it, and its answer is unspoken', 'A word for “if” whose answer is in the same verse', 'A verb meaning “to come”'], answer: 0, why: 'The clause كُنَّا عِظَـٰمًا نَّخِرَةً completes إِذَا, and the answer is left out. The listener supplies it.' },
    },
    12: {
      words: [
        { role: 'Verb, past', say: 'Past, “they”: the ـوا belongs to the verb. This is a new sentence that repeats and confirms يَقُولُونَ of verse 10.' },
        { role: 'Subject (mubtadaʾ)', say: 'A pointing word, “that”, for a feminine thing. It starts the sentence, so it is nominative in position, but it never changes its ending.' },
        { role: 'Answer particle', say: 'A word of answer, “in that case”. It does not change anything in the sentence. al-Jadwal says it stands for an unspoken condition: “if we are returned and that is true, then...”.' },
        { role: 'Predicate (khabar)', say: 'Nominative with tanwin ḍamma. A return, a turning back. The pattern فَعْلَة names one time.' },
        { role: 'Adjective (naʿt)', say: 'It describes كَرَّةٌ, so it is nominative too. The loss really belongs to the people who return. The verse gives it to the return itself (isnād majāzī in al-Jadwal).' },
      ],
      quiz: { word: 2, q: 'What does إِذًا do in this verse?', options: ['It is a time word meaning “when”', 'It is the subject of the sentence', 'It is an answer particle standing for an unspoken “if”'], answer: 2, why: 'إِذًا with tanwin is a word of answer. It has no place in the sentence and stands for the unspoken condition.' },
    },
    13: {
      words: [
        { role: 'New-sentence fāʾ + innamā', say: 'The فَ starts a new sentence. In إِنَّمَا the مَا stops إِنَّ from working, so the next word stays nominative. The word also means “only”.' },
        { role: 'Subject (mubtadaʾ)', say: 'It never changes its ending. It points back to the resurrection. It is the subject here, not the noun of إِنَّ, because إِنَّمَا does not work.' },
        { role: 'Predicate (khabar)', say: 'Nominative with tanwin ḍamma. A single shout. The pattern فَعْلَة names one time.' },
        { role: 'Adjective (naʿt)', say: 'It describes زَجْرَةٌ and copies its nominative case and its feminine form.' },
      ],
      quiz: { word: 1, q: 'Why is هِىَ not the “noun of inna” here?', options: ['The مَا in إِنَّمَا stops إِنَّ from working', 'It is in the genitive case', 'It is a verb'], answer: 0, why: 'With مَا added, إِنَّ no longer puts a noun in the accusative. So هِىَ is a plain subject and زَجْرَةٌ a plain predicate.' },
    },
    14: {
      words: [
        { role: 'Tie-fāʾ + idha of surprise', say: 'al-Jadwal reads the فَ as tying this clause to an unspoken condition (“when the Horn is blown, then...”). إِذَا here is the idha of surprise: “suddenly!”. It is not the time word idha.' },
        { role: 'Subject (mubtadaʾ)', say: 'The word for “they”. It starts the sentence after the idha of surprise.' },
        { role: 'Preposition + noun', say: 'Genitive with kasra after بِ. The phrase is tied to an unspoken predicate: “they are on the open ground”. The word names the earth or the open desert.' },
      ],
      quiz: { word: 0, q: 'What kind of إِذَا is it in فَإِذَا هُم؟', options: ['The time word idha, with a verb after it', 'The idha of surprise', 'The “if” idha'], answer: 1, why: 'No verb follows it. It is followed by a nominal sentence, which is the sign of the idha of surprise.' },
    },
    15: {
      words: [
        { role: 'Question word', say: 'It turns the sentence into a yes-or-no question. It does not change any ending.' },
        { role: 'Verb, past, plus “you”', say: 'Past of أَتَى. The ending كَ is the object, “you”. The word ends in an alif maqṣūra, so no short vowel shows.' },
        { role: 'Doer (fāʿil), first part of a possession', say: 'Nominative with ḍamma. It is the first part of a possession phrase, so it has no tanwin: “the story of Mūsā”.' },
        { role: 'Second part of a possession', say: 'It is genitive, but the name ends in an alif maqṣūra, so no ending shows.' },
      ],
      quiz: { word: 3, q: 'Why does no case ending show on مُوسَىٰ?', options: ['It is a foreign name that never takes a case', 'It is a verb', 'It ends in an alif maqṣūra'], answer: 2, why: 'مُوسَىٰ is genitive here, but a word that ends in an alif maqṣūra never shows its case ending.' },
    },
    16: {
      words: [
        { role: 'Time word (ẓarf), past', say: 'It means “when” for the past. al-Jadwal ties it to حَدِيثُ in verse 15: the story of the time when... It never changes its ending.' },
        { role: 'Verb, past, plus “him”', say: 'Form III. The ending هُ is the object, “him” (Mūsā). The clause نَادَىٰهُ رَبُّهُۥ completes إِذْ.' },
        { role: 'Doer (fāʿil)', say: 'Nominative with ḍamma. The ending هُ means “his”, so it is “his Lord”.' },
        { role: 'Preposition + noun', say: 'Genitive with kasra after بِ. al-Jadwal ties the phrase to a ḥāl from the “him” in نَادَىٰهُ: he was in the valley when called.' },
        { role: 'Adjective (naʿt)', say: 'It describes ٱلْوَادِ and copies its genitive case. It is a passive participle: made holy.' },
        { role: 'Explaining apposition (ʿaṭf bayān)', say: 'The name of the valley, said next to it to make it clear. It copies the genitive of ٱلْوَادِ, but no ending shows. al-Jadwal also allows calling it a badal.' },
      ],
      quiz: { word: 5, q: 'What is طُوًى in al-Jadwal?', options: ['A verb', 'A new subject', 'A name that explains ٱلْوَادِ (ʿaṭf bayān)'], answer: 2, why: 'طُوًى is the name of the valley. It follows ٱلْوَادِ and explains it.' },
    },
    17: {
      words: [
        { role: 'Command (imperative)', say: 'It is built on sukūn. It is not “jussive”. The doer “you” is hidden. al-Jadwal reads this command as opening an explaining sentence.' },
        { role: 'Preposition', say: 'It means “to”. It belongs to ٱذْهَبْ.' },
        { role: 'After a preposition', say: 'It is genitive, but it is a no-tanwin noun (mamnūʿ min aṣ-ṣarf), so the genitive shows as fatḥa.' },
        { role: 'Inna + “he”', say: 'It gives the reason for the command. The ending هُ is “he” (Firʿawn) and is the noun of إِنَّ, so it is accusative in position.' },
        { role: 'Predicate of inna (a verb)', say: 'Past verb, “he went too far”. The clause is the predicate of إِنَّ.' },
      ],
      quiz: { word: 2, q: 'Why does فِرْعَوْنَ end in fatḥa after إِلَىٰ?', options: ['It is genitive, but a no-tanwin noun shows genitive with fatḥa', 'It is accusative', 'It is the object of a verb'], answer: 0, why: 'After a preposition the noun is genitive. A no-tanwin noun shows the genitive with a fatḥa instead of a kasra.' },
    },
    18: {
      words: [
        { role: 'Joining fāʾ + command', say: 'The فَ joins this command to ٱذْهَبْ. قُلْ is a command built on sukūn; the doer “you” is hidden.' },
        { role: 'Question word', say: 'It asks the question Mūsā is to put to Firʿawn.' },
        { role: 'Preposition + “you”', say: 'Genitive in position. al-Jadwal says the phrase is a predicate put first, and the subject is left out: something like “a wish” or “a way”.' },
        { role: 'Preposition', say: 'It belongs to the unspoken subject: “a wish to...”. Its noun is the phrase أَن تَزَكَّىٰ.' },
        { role: 'Particle that makes a verbal noun', say: 'A masdar particle: it puts the next verb in the subjunctive and turns أَن + verb into a verbal noun, “purifying yourself”.' },
        { role: 'Verb, present, subjunctive', say: 'Form V, “purify yourself”. It is subjunctive because of أَن, but the ending is on an alif maqṣūra, so it does not show. One تـ was dropped.' },
      ],
      quiz: { word: 4, q: 'What does أَن do in أَن تَزَكَّىٰ?', options: ['It makes the verb past', 'It makes the verb subjunctive and turns the clause into a verbal noun', 'It is the word “that” before a noun'], answer: 1, why: 'أَن is a masdar particle. أَن تَزَكَّىٰ together means “purifying yourself”, and it stands after إِلَىٰ.' },
    },
    19: {
      words: [
        { role: 'Joining wāw + verb', say: 'The وَ joins this verb to تَزَكَّىٰ, so it is under the same أَن and is subjunctive (fatḥa on the ي). The ending كَ is the object, “you”.' },
        { role: 'Preposition', say: 'It belongs to أَهْدِيَكَ: guide you to...' },
        { role: 'After a preposition', say: 'Genitive with kasra; the ending كَ is “your”. al-Jadwal reads a word left out: “to the knowledge of your Lord”.' },
        { role: 'Reason-fāʾ + verb, present', say: 'The فَ gives the reason (“for then you will fear”). The verb is indicative, not subjunctive: it has a ḍamma on the alif, which does not show. The doer “you” is hidden.' },
      ],
      quiz: { word: 3, q: 'What mood is تَخْشَىٰ in فَتَخْشَىٰ?', options: ['Subjunctive, after a fāʾ of result', 'Indicative: the فَ gives a reason and does not change the verb', 'Jussive'], answer: 1, why: 'al-Jadwal reads this فَ as a fāʾ that gives the reason. It does not put the verb in the subjunctive.' },
    },
    20: {
      words: [
        { role: 'Joining fāʾ + verb, past, plus “him”', say: 'Form IV: “made him see”, so it takes two objects. هُ is the first (Firʿawn). al-Jadwal ties the فَ to an unspoken sentence: “he went to Firʿawn and showed him”.' },
        { role: 'Second object', say: 'Accusative with fatḥa. It is the thing shown.' },
        { role: 'Adjective (naʿt)', say: 'It describes ٱلْـَٔايَةَ. It is accusative in position, but no ending shows on an alif maqṣūra. It is the feminine of أَكْبَر, “greatest”.' },
      ],
      quiz: { word: 1, q: 'What is ٱلْـَٔايَةَ in فَأَرَىٰهُ ٱلْـَٔايَةَ?', options: ['The first object', 'The doer', 'The second object'], answer: 2, why: 'أَرَىٰ takes two objects. The first is the “him” (Firʿawn), and the second is the sign.' },
    },
    21: {
      words: [
        { role: 'Joining fāʾ + verb, past', say: 'Form II: “called it a lie, firmly”. The فَ joins it to the verb before. The doer “he” is hidden.' },
        { role: 'Joining wāw + verb, past', say: 'The وَ joins it to كَذَّبَ: “and he disobeyed”. The final alif maqṣūra comes from a ي.' },
      ],
      quiz: { word: 1, q: 'What does the وَ in وَعَصَىٰ do?', options: ['It joins عَصَىٰ to كَذَّبَ', 'It starts an oath', 'It means “with”'], answer: 0, why: 'It is a plain joining wāw. Both verbs have the same hidden doer.' },
    },
    22: {
      words: [
        { role: 'Joining word “then”', say: 'It joins أَدْبَرَ to the verbs before it and adds a step of time.' },
        { role: 'Verb, past, Form IV', say: '“He turned his back”. The doer “he” is hidden.' },
        { role: 'State (ḥāl)', say: 'A present verb. The clause tells the state of the doer of أَدْبَرَ while he turned away: he was hurrying. It is indicative, and no ending shows on the alif maqṣūra.' },
      ],
      quiz: { word: 2, q: 'What is the clause يَسْعَىٰ in this verse?', options: ['A ḥāl: the state of the one who turned away', 'A new command', 'The predicate of inna'], answer: 0, why: 'al-Jadwal reads يَسْعَىٰ as a ḥāl from the doer of أَدْبَرَ.' },
    },
    23: {
      words: [
        { role: 'Joining fāʾ + verb, past', say: '“So he gathered.” The فَ joins it to أَدْبَرَ. No object is said.' },
        { role: 'Joining fāʾ + verb, past', say: 'Form III, “called out”. The فَ joins it to حَشَرَ. No object is said either.' },
      ],
      quiz: { word: 0, q: 'What does the فَ in فَحَشَرَ do?', options: ['It asks a question', 'It joins the verb to أَدْبَرَ', 'It gives a reason'], answer: 1, why: 'Each verb is joined to the one before it by a fāʾ, so the actions come one after another.' },
    },
    24: {
      words: [
        { role: 'Joining fāʾ + verb, past', say: 'The فَ joins it to نَادَىٰ. What he said follows.' },
        { role: 'Subject (mubtadaʾ)', say: 'The word for “I”. It starts the sentence and never changes its ending.' },
        { role: 'Predicate (khabar)', say: 'Nominative with ḍamma. The ending كُمُ means “your”.' },
        { role: 'Adjective (naʿt)', say: 'It describes رَبُّكُمُ and copies its nominative case. It has the shape of “highest”, but al-Jadwal says it is used here to describe, not to compare.' },
      ],
      quiz: { word: 3, q: 'What is ٱلْأَعْلَىٰ in al-Jadwal?', options: ['A badal of أَنَا', 'A verb', 'An adjective (naʿt) of رَبُّكُمُ'], answer: 2, why: 'al-Jadwal reads it as a describing word that follows رَبُّكُمُ and copies its case.' },
    },
    25: {
      words: [
        { role: 'Joining fāʾ + verb, past, plus “him”', say: 'The فَ joins it to قَالَ. “So He seized him”: the ending هُ is the object.' },
        { role: 'Doer (fāʿil)', say: 'Nominative with ḍamma. The doer is named out loud here.' },
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'Accusative. It stands for the verbal noun of an unspoken verb (“He made an example of him”). al-Jadwal also allows a reading as a reason (mafʿūl li-ajlihi). It is the first part of a possession phrase.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because نَكَالَ owns it. al-Jadwal reads it as describing an unspoken word, “the last word”.' },
        { role: 'Joined word', say: 'The وَ joins it to ٱلْـَٔاخِرَةِ, so it is genitive too, though no ending shows. It stands for “the first word”.' },
      ],
      quiz: { word: 2, q: 'What is نَكَالَ in al-Jadwal’s first reading?', options: ['The doer of أَخَذَ', 'A word after a preposition', 'An absolute object standing for the verbal noun of an unspoken verb'], answer: 2, why: 'It is accusative because it stands for the verbal noun of a verb left out. al-Jadwal also allows a mafʿūl li-ajlihi.' },
    },
    26: {
      words: [
        { role: 'Inna', say: 'It makes the sentence strong. Its noun is accusative, and its predicate is the phrase that comes first.' },
        { role: 'Preposition', say: 'It belongs to the predicate that is put first.' },
        { role: 'After a preposition', say: 'A pointing word, “that”, for what happened to Firʿawn. It is genitive in position and never changes. The phrase فِى ذَٰلِكَ is the predicate of إِنَّ, put first.' },
        { role: 'Noun of inna', say: 'Accusative with tanwin fatḥa. It comes after its predicate. The لَ in front is the strengthening lām.' },
        { role: 'Preposition + “who”', say: 'The phrase describes عِبْرَةً: a lesson for those who...' },
        { role: 'Verb, present', say: 'It completes مَن. “Fears.” The alif maqṣūra hides the ending.' },
      ],
      quiz: { word: 3, q: 'Why is لَعِبْرَةًۭ accusative?', options: ['It is the noun of إِنَّ, put after its predicate', 'It comes after a preposition', 'It is a doer'], answer: 0, why: 'The predicate فِى ذَٰلِكَ comes first, so the noun of إِنَّ comes after it. That noun is accusative.' },
    },
    27: {
      words: [
        { role: 'Question hamza + subject', say: 'The أَ is a question that scolds. أَنتُمْ is the subject.' },
        { role: 'Predicate (khabar)', say: 'Nominative, with one ḍamma because it is a no-tanwin word. It means “stronger”.' },
        { role: 'Specifier (tamyīz)', say: 'Accusative with tanwin fatḥa. It says in what way: in creation.' },
        { role: 'Joining word “or”', say: 'It offers a choice and joins ٱلسَّمَآءُ to أَنتُمْ.' },
        { role: 'Joined to “you”', say: 'Nominative, because it is joined to the nominative أَنتُمْ.' },
        { role: 'Verb, past, plus “it”', say: 'It starts a new sentence that explains. The doer “He” is Allah, clear from the context. The ending هَا is “it”, the sky.' },
      ],
      quiz: { word: 4, q: 'Why is ٱلسَّمَآءُ nominative?', options: ['It is the doer of بَنَىٰ', 'It is joined by أَمِ to the nominative أَنتُمْ', 'It follows a preposition'], answer: 1, why: 'al-Jadwal reads ٱلسَّمَآءُ as joined to the pronoun أَنتُمْ. The doer of بَنَىٰ is Allah.' },
    },
    28: {
      words: [
        { role: 'Verb, past', say: 'It starts a sentence that explains how He built it. “He raised.” The doer is hidden.' },
        { role: 'Object', say: 'Accusative with fatḥa. It is the first part of a possession phrase; هَا means “its”.' },
        { role: 'Joining fāʾ + verb, past', say: 'Form II, “made it even”. The فَ joins it to رَفَعَ and puts it after.' },
      ],
      quiz: { word: 2, q: 'What does the فَ in فَسَوَّىٰهَا do?', options: ['It starts a question', 'It joins the verb to رَفَعَ and puts it after', 'It makes the verb a command'], answer: 1, why: 'The raising came first, then the making even. The فَ joins the two verbs in that order.' },
    },
    29: {
      words: [
        { role: 'Joining wāw + verb, past', say: 'Form IV: “made dark”. The وَ joins it to رَفَعَ.' },
        { role: 'Object', say: 'Accusative with fatḥa. The ending هَا means “its”.' },
        { role: 'Joining wāw + verb, past', say: 'Form IV: “brought out”. It is joined to رَفَعَ as well.' },
        { role: 'Object', say: 'Accusative; no ending shows on the alif maqṣūra. It means the morning light. The ending هَا means “its”.' },
      ],
      quiz: { word: 0, q: 'What does Form IV (أَفْعَلَ) add in أَغْطَشَ?', options: ['It makes someone else do it: “made dark”', 'It makes the verb passive', 'It makes the verb a command'], answer: 0, why: 'Form IV often makes a thing happen. غَطِشَ is to be dark; أَغْطَشَ is to make dark.' },
    },
    30: {
      words: [
        { role: 'Object of an unspoken verb', say: 'The وَ starts a new sentence. ٱلْأَرْضَ is accusative because an unspoken verb, “spread”, works on it. The spoken verb دَحَىٰهَا explains it (ishtighāl).' },
        { role: 'Time word (ẓarf)', say: 'Accusative with fatḥa. It is the first part of a possession phrase, and it is tied to the unspoken verb.' },
        { role: 'Second part of a possession', say: 'A pointing word, “that”. It is genitive in position and never changes.' },
        { role: 'Verb, past, plus “it”', say: 'The spoken verb that explains the unspoken one. The ending هَا points back to ٱلْأَرْضَ.' },
      ],
      quiz: { word: 0, q: 'Why is ٱلْأَرْضَ accusative?', options: ['It follows a preposition', 'It is the subject of دَحَىٰ', 'An unspoken verb works on it, and دَحَىٰهَا explains it'], answer: 2, why: 'This is ishtighāl: the noun comes first, an unspoken verb works on it, and the spoken verb with its pronoun explains it.' },
    },
    31: {
      words: [
        { role: 'Verb, past, Form IV', say: 'A new sentence that explains. “He brought out.” The doer is hidden.' },
        { role: 'Preposition + “it”', say: 'It belongs to أَخْرَجَ: out of it. The ending هَا is the earth.' },
        { role: 'Object', say: 'Accusative; “its water”. The ending هَا means “its”.' },
        { role: 'Joined object', say: 'The وَ joins it to مَآءَهَا, so it is accusative too. مَرْعَى began as the place of grazing; here it means all that grows (majāz mursal in al-Jadwal).' },
      ],
      quiz: { word: 3, q: 'What does the وَ in وَمَرْعَىٰهَا join?', options: ['مَرْعَىٰهَا to the object مَآءَهَا', 'Two verbs', 'Two oaths'], answer: 0, why: 'Both words are objects of أَخْرَجَ: He brought out its water and its pasture.' },
    },
    32: {
      words: [
        { role: 'Object of an unspoken verb', say: 'Same pattern as ٱلْأَرْضَ in verse 30: an unspoken verb, “anchored”, works on it. The وَ joins this sentence to the one before.' },
        { role: 'Verb, past, plus “them”', say: 'Form IV. It explains the unspoken verb. The ending هَا points to the mountains: a broken plural of things is treated as feminine singular.' },
      ],
      quiz: { word: 0, q: 'What is وَٱلْجِبَالَ here?', options: ['The doer of أَرْسَىٰ', 'A genitive after the وَ', 'The object of an unspoken verb that أَرْسَىٰهَا explains'], answer: 2, why: 'It is the same pattern as the earth in verse 30. The noun comes first, then the verb with its pronoun.' },
    },
    33: {
      words: [
        { role: 'Absolute object (mafʿūl muṭlaq)', say: 'Accusative with tanwin. al-Jadwal first reads it as standing for the verbal noun of an unspoken verb: “He gave you this as a provision”. It also allows “for provision” (mafʿūl li-ajlihi).' },
        { role: 'Preposition + “you”', say: 'It belongs to مَتَـٰعًا: a provision for you.' },
        { role: 'Joined phrase', say: 'The وَ joins this phrase to لَّكُمْ. أَنْعَام is genitive after لِ. The ending كُمْ means “your”.' },
      ],
      quiz: { word: 0, q: 'How does al-Jadwal first read مَتَـٰعًا?', options: ['The subject of the sentence', 'An absolute object for an unspoken verb', 'A word after a preposition'], answer: 1, why: 'It stands for the verbal noun of a verb left out, so it is accusative.' },
    },
    34: {
      words: [
        { role: 'New-sentence fāʾ + time word', say: 'The فَ starts a new sentence. In al-Jadwal إِذَا is a time word and the clause after it completes it. The answer is left unsaid.' },
        { role: 'Verb, past', say: 'The تِ shows that the doer is feminine. The clause completes إِذَا.' },
        { role: 'Doer (fāʿil)', say: 'Nominative with ḍamma. The overwhelming calamity.' },
        { role: 'Adjective (naʿt)', say: 'It describes ٱلطَّآمَّةُ and copies its nominative case. No ending shows on the alif maqṣūra.' },
      ],
      quiz: { word: 0, q: 'What does al-Jadwal say about the answer to إِذَا in this verse?', options: ['It is the verb جَآءَتِ', 'It is the word ٱلطَّآمَّةُ', 'It is left unsaid'], answer: 2, why: 'The clause جَآءَتِ ٱلطَّآمَّةُ ٱلْكُبْرَىٰ completes إِذَا, and the answer is left for the listener to supply.' },
    },
    35: {
      words: [
        { role: 'Time word (ẓarf)', say: 'Accusative. al-Jadwal ties it to an unspoken verb such as “is reckoned”. The clause after it completes it.' },
        { role: 'Verb, present', say: 'Form V. Indicative. “Remembers.”' },
        { role: 'Doer (fāʿil)', say: 'Nominative with ḍamma.' },
        { role: 'Verbal-noun particle', say: 'مَا here is a masdar particle, not “what”. مَا سَعَىٰ means “his striving”, and the whole phrase is the object of يَتَذَكَّرُ.' },
        { role: 'Verb after مَا', say: 'Past verb. It completes the masdar particle مَا.' },
      ],
      quiz: { word: 3, q: 'What is مَا in مَا سَعَىٰ?', options: ['A relative pronoun, “what”', 'A verbal-noun (masdar) particle: “his striving”', 'A word meaning “not”'], answer: 1, why: 'al-Jadwal reads مَا with the verb as a masdar: مَا سَعَىٰ = “his striving”.' },
    },
    36: {
      words: [
        { role: 'Joining wāw + verb, passive', say: 'Form II passive: the doer is not named. The تِ shows the stand-in subject is feminine. The clause is joined to يَتَذَكَّرُ.' },
        { role: 'Stand-in for the doer (nāʾib fāʿil)', say: 'Nominative with ḍamma. With a passive verb, the thing that is done to takes the doer’s place.' },
        { role: 'Preposition + “who”', say: 'It belongs to بُرِّزَتِ: shown to whoever...' },
        { role: 'Verb, present', say: 'It completes مَن. “Sees.”' },
      ],
      quiz: { word: 1, q: 'Why is ٱلْجَحِيمُ nominative?', options: ['It is the stand-in for the doer of a passive verb', 'It is the object of بُرِّزَتِ', 'It follows a preposition'], answer: 0, why: 'بُرِّزَتِ is passive, so the thing shown takes the place of the doer and is nominative.' },
    },
    37: {
      words: [
        { role: 'Joining fāʾ + amma', say: 'The فَ joins and spreads out the topic. أَمَّا means “as for”. It is a condition word that does not make a verb jussive.' },
        { role: 'Subject (mubtadaʾ)', say: 'A relative pronoun, “the one who”. al-Jadwal says its predicate is left unsaid, something like “is punished”.' },
        { role: 'Verb, past', say: 'It completes مَن. “Went too far.”' },
      ],
      quiz: { word: 1, q: 'What is the predicate of مَن in al-Jadwal?', options: ['طَغَىٰ', 'The clause فَإِنَّ ٱلْجَحِيمَ in verse 39', 'It is left unsaid, something like “is punished”'], answer: 2, why: 'طَغَىٰ only completes مَن. The clause in verse 39 gives the reason for the unspoken predicate.' },
    },
    38: {
      words: [
        { role: 'Joining wāw + verb, past', say: 'Form IV: “preferred”. The وَ joins it to طَغَىٰ, so it also completes مَن.' },
        { role: 'Object', say: 'Accusative with fatḥa.' },
        { role: 'Adjective (naʿt)', say: 'It describes ٱلْحَيَوٰةَ and copies its accusative case. It means “nearest”.' },
      ],
      quiz: { word: 0, q: 'What does the وَ in وَءَاثَرَ do?', options: ['It starts an oath', 'It joins the verb to طَغَىٰ, inside the same description of مَن', 'It starts a sentence about someone else'], answer: 1, why: 'Both verbs describe the same person: he went too far, and he preferred this life.' },
    },
    39: {
      words: [
        { role: 'Reason-fāʾ + inna', say: 'The فَ gives a reason. The clause explains why the unspoken predicate in verse 37 is true.' },
        { role: 'Noun of inna', say: 'Accusative with fatḥa.' },
        { role: 'Separating pronoun (ḍamīr al-faṣl)', say: 'It has no case. It stands between the noun and the predicate. It makes the sentence firm and shows that ٱلْمَأْوَىٰ is the predicate, not an adjective.' },
        { role: 'Predicate of inna', say: 'Nominative, but no ending shows on the alif maqṣūra. It means the place to live.' },
      ],
      quiz: { word: 2, q: 'What does هِىَ do in this verse?', options: ['It shows that ٱلْمَأْوَىٰ is the predicate and makes the sentence firm', 'It is the subject of a new sentence', 'It is the doer of a verb'], answer: 0, why: 'This is the separating pronoun. It comes between ٱلْجَحِيمَ and ٱلْمَأْوَىٰ.' },
    },
    40: {
      words: [
        { role: 'Joining wāw + amma', say: 'Same as verse 37, with a wāw. “And as for.”' },
        { role: 'Subject (mubtadaʾ)', say: 'A relative pronoun, “the one who”. Its predicate is left unsaid, as in verse 37.' },
        { role: 'Verb, past', say: 'It completes مَنْ. “Feared.” It is a hollow verb: the middle و shows as an alif.' },
        { role: 'Object, first part of a possession', say: 'Accusative with fatḥa. “The standing” before his Lord.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra. The ending هِ means “his”.' },
        { role: 'Joining wāw + verb, past', say: 'The وَ joins it to خَافَ, in the same description of مَنْ.' },
        { role: 'Object', say: 'Accusative with fatḥa. “The self”: what he held back.' },
        { role: 'Preposition', say: 'It belongs to نَهَى: held back from.' },
        { role: 'After a preposition', say: 'Genitive; no ending shows on the alif maqṣūra. Desire.' },
      ],
      quiz: { word: 3, q: 'Why is مَقَامَ accusative?', options: ['It follows a preposition', 'It is the object of خَافَ', 'It is the subject'], answer: 1, why: 'خَافَ is a verb and مَقَامَ is what he feared, so it is its object.' },
    },
    41: {
      words: [
        { role: 'Reason-fāʾ + inna', say: 'The فَ gives a reason. The clause explains the unspoken predicate of مَنْ in verse 40. al-Jadwal gives the unspoken answer as “he enters Paradise”.' },
        { role: 'Noun of inna', say: 'Accusative with fatḥa.' },
        { role: 'Separating pronoun (ḍamīr al-faṣl)', say: 'It has no case. It stands between the noun and the predicate and makes the sentence firm.' },
        { role: 'Predicate of inna', say: 'Nominative, but no ending shows on the alif maqṣūra.' },
      ],
      quiz: { word: 1, q: 'Why is ٱلْجَنَّةَ accusative?', options: ['It is the object of a verb', 'It follows a preposition', 'It is the noun of إِنَّ'], answer: 2, why: 'إِنَّ puts its noun in the accusative. ٱلْجَنَّةَ comes right after فَإِنَّ.' },
    },
    42: {
      words: [
        { role: 'Verb, present, plus “you”', say: 'It starts a new sentence. “They ask you.” The ـونَ is “they”; كَ is the object.' },
        { role: 'Preposition', say: 'It belongs to يَسْـَٔلُونَكَ: ask about.' },
        { role: 'After a preposition', say: 'Genitive with kasra. The Hour.' },
        { role: 'Question word for time', say: '“When?” al-Jadwal: it is accusative in position and tied to an unspoken predicate of مُرْسَىٰهَا. It never changes.' },
        { role: 'Subject (mubtadaʾ)', say: 'Nominative; no ending shows on the alif maqṣūra. “Its coming to rest.” The ending هَا means “its”. Its predicate is unspoken.' },
      ],
      quiz: { word: 4, q: 'What is مُرْسَىٰهَا in al-Jadwal?', options: ['The subject (mubtadaʾ), with an unspoken predicate', 'The object of يَسْـَٔلُونَ', 'A time word'], answer: 0, why: 'أَيَّانَ is tied to the unspoken predicate, and مُرْسَىٰهَا is the subject: “when is its coming to rest?”' },
    },
    43: {
      words: [
        { role: 'Preposition + “what”', say: 'It is فِي + مَا. The alif of مَا drops after a preposition. al-Jadwal reads the phrase as the predicate put first for أَنتَ.' },
        { role: 'Subject (mubtadaʾ)', say: 'It never changes its ending. “You”: the Prophet.' },
        { role: 'Preposition', say: 'It belongs to the unspoken predicate.' },
        { role: 'After a preposition', say: 'Genitive with kasra. “Mentioning it.” The ending هَا is the Hour.' },
      ],
      quiz: { word: 0, q: 'Why is the alif of مَا missing in فِيمَ?', options: ['It is a verb', 'The alif of مَا drops after a preposition', 'It has a tanwin'], answer: 1, why: 'When مَا is a question word after a preposition, its alif is dropped, so فِي + مَا is written فِيمَ.' },
    },
    44: {
      words: [
        { role: 'Preposition', say: 'It belongs to the predicate that is put first.' },
        { role: 'After a preposition', say: 'Genitive with kasra. The ending كَ means “your”.' },
        { role: 'Subject (mubtadaʾ), put after', say: 'Nominative; no ending shows on the alif maqṣūra. It means where it ends. The predicate إِلَىٰ رَبِّكَ comes first, which says that this belongs to Him alone.' },
      ],
      quiz: { word: 2, q: 'Why does إِلَىٰ رَبِّكَ come before مُنتَهَىٰهَآ?', options: ['Because it is a command', 'Because it is a question', 'The predicate is put first to stress that the end belongs to the Lord alone'], answer: 2, why: 'Putting the predicate first limits the matter to Him: its end is with your Lord only.' },
    },
    45: {
      words: [
        { role: '“Only” (innamā)', say: 'The مَا stops إِنَّ from working, so أَنتَ stays nominative. The word means “only”.' },
        { role: 'Subject (mubtadaʾ)', say: 'It never changes its ending. “You”: the Prophet.' },
        { role: 'Predicate (khabar), first part of a possession', say: 'Nominative with ḍamma. A Form IV doer-word: “one who warns”.' },
        { role: 'Second part of a possession', say: 'A relative pronoun, genitive in position, because مُنذِرُ owns it.' },
        { role: 'Verb, present, plus “it”', say: 'It completes مَن. “Fears it.” The ending هَا is the Hour.' },
      ],
      quiz: { word: 3, q: 'What case is مَن here?', options: ['Nominative', 'Accusative', 'Genitive in position, as the second part of a possession'], answer: 2, why: 'مُنذِرُ مَن is a possession phrase, so مَن is genitive in position.' },
    },
    46: {
      words: [
        { role: 'Ka-anna + “they”', say: 'كَأَنَّ means “as if”. It works like إِنَّ, so هُمْ is its noun, accusative in position.' },
        { role: 'Time word (ẓarf)', say: 'Accusative. The clause يَرَوْنَهَا completes it. al-Jadwal ties it to a ḥāl from the doer of the negated يَلْبَثُوا.' },
        { role: 'Verb, present, plus “it”', say: 'Indicative. The clause completes يَوْمَ. “They see it.”' },
        { role: 'Negative word', say: 'It makes the next verb jussive and gives it a past meaning: “did not”.' },
        { role: 'Verb, jussive', say: 'The final ن is dropped because of لَمْ. The clause is the predicate of كَأَنَّ.' },
        { role: 'Word of restriction', say: 'It limits the stay: “nothing but”. al-Jadwal calls it a word of restriction.' },
        { role: 'Time word (ẓarf)', say: 'Accusative with tanwin fatḥa. It is tied to يَلْبَثُوا. An evening or afternoon.' },
        { role: 'Joining word “or”', say: 'It joins ضُحَىٰهَا to عَشِيَّةً.' },
        { role: 'Joined word', say: 'Accusative; no ending shows. “Its morning.” The ending هَا is allowed because both belong to one day.' },
      ],
      quiz: { word: 4, q: 'Why does يَلْبَثُوا lose its final ن?', options: ['لَمْ makes the verb jussive', 'It is a command', 'إِلَّا drops it'], answer: 0, why: 'After لَمْ the verb is jussive, and a verb ending in ـونَ drops its ن in the jussive.' },
    },
  },
};
