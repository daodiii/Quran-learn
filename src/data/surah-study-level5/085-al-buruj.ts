// Plain-English teaching layer for Surah 85, Al-Buruj. Same shape and rules as in surah-study.ts.
//
// Drafted 2026-10-29. Every line follows the parse in the surah's file, which was checked verse by verse against
// al-Jadwal (Mahmud Safi). Where al-Jadwal gives more than one reading, the line says which one it follows. Someone
// who knows Arabic grammar should read these before they ship.
import type { SurahStudy } from '../surah-study';

export const STUDY: SurahStudy = {
  verses: {
    1: {
      words: [
        { role: 'Oath wāw', say: 'The وَ means “by”. It swears by the word after it, and that word is genitive. al-Jadwal says the verb “I swear” is left unspoken.' },
        { role: 'Sworn by', say: 'Genitive with kasra, because the oath وَ puts it in the genitive. It is tied to the unspoken verb “I swear”.' },
        { role: 'Adjective (naʿt)', say: 'It means “owner of” and describes السَّمَاءِ, so it copies its genitive case. It is feminine, like “sky”.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because ذَاتِ owns it. It is a broken plural of بُرْج, “tower”.' },
      ],
      quiz: { word: 1, q: 'Why is السَّمَاءِ genitive?', options: ['A preposition like فِي comes before it', 'It is the second part of a possession', 'The oath وَ puts it in the genitive'], answer: 2, why: 'The وَ of the oath governs the word after it and makes it genitive. There is no preposition in the verse, and السَّمَاءِ is the first part of the phrase, not the second.' },
    },
    2: {
      words: [
        { role: 'Oath wāw', say: 'It swears again: “and by”. The word after it is genitive.' },
        { role: 'Sworn by', say: 'Genitive with kasra, because of the oath وَ. The adjective after it says which day.' },
        { role: 'Adjective (naʿt)', say: 'A passive participle on the pattern مَفْعُول: “the one that is promised”. It describes الْيَوْمِ, so it copies its genitive case. al-Jadwal says the day is the Day of Resurrection.' },
      ],
      quiz: { word: 2, q: 'What kind of word is الْمَوْعُودِ?', options: ['An active participle: the one who promises', 'A passive participle: the one that is promised', 'A past verb'], answer: 1, why: 'The pattern مَفْعُول makes a passive participle. The day does not promise anything. It is the thing that has been promised.' },
    },
    3: {
      words: [
        { role: 'Oath wāw', say: 'It swears again: “and by”. The word after it is genitive.' },
        { role: 'Sworn by (active participle)', say: 'An active participle: “one who witnesses”. Genitive with tanwin kasra, because of the oath. The tanwin means no one in particular.' },
        { role: 'Wāw that joins', say: 'It joins مَشْهُودٍ to شَاهِدٍ, so the two are sworn by as a pair.' },
        { role: 'Sworn by (passive participle)', say: 'A passive participle: “one that is witnessed”. Genitive with tanwin kasra, like شَاهِدٍ.' },
      ],
      quiz: { word: 3, q: 'What does the pattern مَفْعُول in مَشْهُودٍ tell you?', options: ['It is the one that is witnessed', 'It is the one who witnesses', 'It is a command'], answer: 0, why: 'مَفْعُول is the passive participle: the thing that something is done to. شَاهِدٍ is the active one, the doer.' },
    },
    4: {
      words: [
        { role: 'Verb, past, passive', say: 'The passive form: ḍamma on the first letter, kasra on the second. The killer is not named. Here it is a curse: “may they be destroyed”. al-Jadwal reads this verse as a new sentence that explains, after an oath whose answer is not spoken.' },
        { role: 'Stand-in subject (nāʾib al-fāʿil)', say: 'With a passive verb, the one it happens to takes the place of the subject. It is nominative with ḍamma. It is also the first part of a possession.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because أَصْحَابُ owns it. The pattern أُفْعُول names a trench cut in the ground.' },
      ],
      quiz: { word: 1, q: 'Why is أَصْحَابُ nominative?', options: ['It is the object of قُتِلَ', 'It comes after a preposition', 'It is the stand-in subject of a passive verb'], answer: 2, why: 'قُتِلَ is passive, so the one it happens to is nominative as its stand-in subject (nāʾib al-fāʿil).' },
    },
    5: {
      words: [
        { role: 'Badal ishtimāl from “the trench”', say: 'It stands next to الْأُخْدُودِ and names what the trench holds: the fire. al-Jadwal calls this a badal ishtimāl, a badal that names something the first word includes. A word that points back, “in it”, is left out. It copies the genitive case.' },
        { role: 'Adjective (naʿt)', say: 'It means “owner of” and describes النَّارِ, so it copies its genitive case.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because ذَاتِ owns it. It means “fuel”.' },
      ],
      quiz: { word: 0, q: 'What is النَّارِ to الْأُخْدُودِ?', options: ['A badal that names what the trench holds', 'The answer to the oath', 'The subject of a new sentence'], answer: 0, why: 'al-Jadwal calls it a badal ishtimāl from الْأُخْدُودِ. That is why it is genitive too.' },
    },
    6: {
      words: [
        { role: 'Adverb of time', say: 'It means “when”. It never changes its ending. al-Jadwal ties it to قُتِلَ in verse 4. The whole sentence after it is its second part, as in a possession.' },
        { role: 'Subject (mubtadaʾ)', say: 'The pronoun “they”, nominative in place. It starts the sentence that follows إِذْ.' },
        { role: 'Preposition + “it”', say: 'عَلَى plus هَا. The هَا is the fire. It says where they sat: over it.' },
        { role: 'Predicate (khabar)', say: 'The plural of قَاعِد, “sitting”. Nominative with tanwin ḍamma, because it is the predicate of هُمْ.' },
      ],
      quiz: { word: 0, q: 'What is the clause هُمْ عَلَيْهَا قُعُودٌ to إِذْ?', options: ['A condition', 'Its second part (mudāf ilayhi)', 'The answer to an oath'], answer: 1, why: 'al-Jadwal says the clause after إِذْ fills a genitive place, as the second part of a possession. It is not a condition and not a separate state clause.' },
    },
    7: {
      words: [
        { role: 'Wāw that joins', say: 'It joins this sentence to the one in verse 6. So this sentence is also part of what follows إِذْ.' },
        { role: 'Subject (mubtadaʾ)', say: 'The pronoun “they”, subject of this sentence.' },
        { role: 'Preposition', say: 'It belongs to شُهُودٌ: witnesses over something. The phrase after it is genitive.' },
        { role: 'Masdar particle', say: 'In al-Jadwal, مَا makes the verb after it into a noun: مَا يَفْعَلُونَ means “their doing”. It never changes its ending. al-Jadwal also allows مَا as “what”.' },
        { role: 'Verb, present', say: 'It finishes the مَا clause. Present tense, plural “they”. The نَ at the end stays because nothing makes the verb subjunctive or jussive.' },
        { role: 'Preposition', say: 'It belongs to يَفْعَلُونَ: do something to someone.' },
        { role: 'After a preposition', say: 'Genitive after بِ. The ending ـِينَ is the genitive of a sound masculine plural.' },
        { role: 'Predicate (khabar)', say: 'The plural of شَاهِد, “witness”. Nominative with tanwin ḍamma, because it is the predicate of هُمْ.' },
      ],
      quiz: { word: 3, q: 'What does مَا do in مَا يَفْعَلُونَ?', options: ['It means “not”', 'It makes the verb past', 'It turns the verb into a noun: “their doing”'], answer: 2, why: 'al-Jadwal calls this مَا a masdar particle. مَا يَفْعَلُونَ then means “their doing”, and the whole phrase comes after عَلَى.' },
    },
    8: {
      words: [
        { role: 'Wāw that joins', say: 'It joins this sentence to the one in verse 7.' },
        { role: 'Negative particle', say: 'It means “not”. With إِلَّا later it makes the sentence a restriction: only one thing.' },
        { role: 'Verb, past', say: 'Past tense, plural “they”. al-Jadwal says it carries the sense “they found fault with”, which is why مِنْ comes after it.' },
        { role: 'Preposition + “them”', say: 'مِنْ plus هُمْ. It belongs to نَقَمُوا and says whom they found fault with.' },
        { role: 'Restriction particle', say: 'It means “except”. With the مَا before it, it limits the fault to one thing.' },
        { role: 'Masdar particle, makes subjunctive', say: 'It turns the verb after it into a noun: “that they believe” means “their believing”. It puts that verb in the subjunctive.' },
        { role: 'Verb, present, subjunctive', say: 'Form IV. After أَن it is subjunctive, so the نَ at the end drops. The whole أَن clause is what they found fault with: the object of نَقَمُوا. al-Jadwal also allows it as a badal.' },
        { role: 'Preposition', say: 'It belongs to يُؤْمِنُوا: believe in.' },
        { role: 'After a preposition', say: 'Genitive with kasra after بِ.' },
        { role: 'Adjective (naʿt)', say: 'The first adjective of اللَّهِ, so it copies its genitive case.' },
        { role: 'Second adjective (naʿt)', say: 'The second adjective of اللَّهِ, also genitive.' },
      ],
      quiz: { word: 5, q: 'What does أَن do to يُؤْمِنُوا?', options: ['It puts it in the subjunctive and makes the clause a noun: “their believing”', 'It makes it past', 'It makes it a command'], answer: 0, why: 'أَن is a masdar particle that puts the present verb in the subjunctive. That is why the نَ of يُؤْمِنُونَ dropped.' },
    },
    9: {
      words: [
        { role: 'Relative pronoun, third adjective of Allah', say: 'It points back to اللَّهِ in verse 8 and adds a third description, after الْعَزِيزِ and الْحَمِيدِ. It never changes its ending; only its place is genitive. al-Jadwal also allows it as the predicate of an unspoken “He”.' },
        { role: 'Predicate (khabar muqaddam)', say: 'لِ plus هُ, “to Him”. It comes first and is the predicate of مُلْكُ.' },
        { role: 'Subject (mubtadaʾ), first part of a possession', say: 'Nominative with ḍamma. It comes after its predicate لَهُ. It owns السَّمَاوَاتِ.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because مُلْكُ owns it. Kasra is also the genitive sign of a sound feminine plural.' },
        { role: 'And', say: 'It joins الْأَرْضِ to السَّمَاوَاتِ.' },
        { role: 'Joined word, genitive', say: 'It is joined to السَّمَاوَاتِ, so it is genitive too.' },
        { role: 'Wāw that starts a new sentence', say: 'This وَ does not join two words. It begins a new sentence.' },
        { role: 'Subject (mubtadaʾ)', say: 'Nominative with ḍamma. The words after it say what He is.' },
        { role: 'Preposition', say: 'It belongs to شَهِيدٌ: witness over.' },
        { role: 'After a preposition, first part of a possession', say: 'Genitive after عَلَىٰ. It owns شَيْءٍ.' },
        { role: 'Second part of a possession', say: 'Genitive with tanwin kasra, because كُلِّ owns it.' },
        { role: 'Predicate (khabar)', say: 'Nominative with tanwin ḍamma. It says what اللَّهُ is: a witness.' },
      ],
      quiz: { word: 0, q: 'What does الَّذِي do in this verse?', options: ['It is the subject of a new sentence', 'It adds a third description of اللَّهِ from verse 8', 'It is a question word'], answer: 1, why: 'al-Jadwal reads الَّذِي as a third naʿt of اللَّهِ, after الْعَزِيزِ and الْحَمِيدِ in verse 8. The clause لَهُ مُلْكُ ... completes it.' },
    },
    10: {
      words: [
        { role: 'Emphasis particle (inna)', say: 'It stresses the sentence. It puts its noun in the accusative.' },
        { role: 'Noun of إِنَّ', say: 'A relative pronoun, plural: “those who”. It is the noun of إِنَّ, so it is accusative in place. The word itself never changes its ending.' },
        { role: 'Verb, past', say: 'It means they persecuted. It starts the clause that says who “those” are. The ending وا is the plural “they”.' },
        { role: 'Object', say: 'What they persecuted. Accusative, shown by the ending ـِينَ.' },
        { role: 'And', say: 'It joins الْمُؤْمِنَاتِ to الْمُؤْمِنِينَ.' },
        { role: 'Object, joined', say: 'Joined to الْمُؤْمِنِينَ, so also accusative. A sound feminine plural shows the accusative with kasra.' },
        { role: 'Conjunction “then”', say: 'It joins the next clause to فَتَنُوا, with a gap in time.' },
        { role: 'Negative particle, jussive', say: 'It means “did not” and puts the present verb in the jussive.' },
        { role: 'Verb, present, jussive', say: 'After لَمْ the verb is jussive, so the نَ drops: يَتُوبُونَ becomes يَتُوبُوا. It is still part of the “those who” clause, not a separate condition.' },
        { role: 'Extra fāʾ', say: 'al-Jadwal calls this فَ extra. It is there because “those who ...” sounds like “whoever ...”, a condition. It does not open a result clause.' },
        { role: 'Predicate (khabar muqaddam)', say: 'لِ plus هُمْ, “for them”. It comes first and is the predicate of عَذَابُ.' },
        { role: 'Subject (mubtadaʾ), first part of a possession', say: 'Nominative with ḍamma. It owns جَهَنَّمَ.' },
        { role: 'Second part of a possession', say: 'Genitive, but it ends in fatḥa without tanwin, because it is a diptote (a word that cannot take tanwin).' },
        { role: 'And', say: 'It joins the second “for them is punishment” sentence to the first.' },
        { role: 'Predicate (khabar muqaddam)', say: 'The same as before: “for them”, placed before its subject.' },
        { role: 'Subject (mubtadaʾ), first part of a possession', say: 'Nominative with ḍamma. It owns الْحَرِيقِ.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra. al-Jadwal calls it a noun of the action (ism masdar) meaning the burning, so the punishment answers the burning they did.' },
      ],
      quiz: { word: 9, q: 'What does the فَ in فَلَهُمْ do?', options: ['It means “because”', 'It begins the answer to a condition', 'It is extra, added because “those who” sounds like a condition'], answer: 2, why: 'al-Jadwal calls this فَ extra (زائدة). The relative الَّذِينَ is like a condition word, so the فَ may appear before the predicate. There is no real condition clause.' },
    },
    11: {
      words: [
        { role: 'Emphasis particle (inna)', say: 'It stresses the sentence. It puts its noun in the accusative.' },
        { role: 'Noun of إِنَّ', say: 'A relative pronoun, plural: “those who”. It is the noun of إِنَّ, so it is accusative in place.' },
        { role: 'Verb, past, Form IV', say: 'It starts the clause that says who “those” are. The ending وا is the plural “they”.' },
        { role: 'And', say: 'It joins عَمِلُوا to آمَنُوا, both inside the “those who” clause.' },
        { role: 'Verb, past', say: 'Joined to آمَنُوا. Plural “they”.' },
        { role: 'Object', say: 'What they did. Accusative with kasra, the sign for a sound feminine plural. It means good deeds.' },
        { role: 'Predicate (khabar muqaddam)', say: '“For them”, placed before its subject جَنَّاتٌ.' },
        { role: 'Subject (mubtadaʾ)', say: 'Nominative with tanwin ḍamma. The sentence لَهُمْ جَنَّاتٌ is the predicate of إِنَّ. This word is not the noun of إِنَّ; that is الَّذِينَ.' },
        { role: 'Verb, present', say: 'This clause describes جَنَّاتٌ. The verb ends in ي, so the ḍamma is not written. The subject is الْأَنْهَارُ.' },
        { role: 'Preposition', say: 'It belongs to تَجْرِي: flow from.' },
        { role: 'After a preposition, plus “it”', say: 'تَحْتِ is genitive with kasra after مِن. al-Jadwal says a word is left out: “from under its trees”. The هَا is the gardens.' },
        { role: 'Subject of the verb (fāʿil)', say: 'Nominative with ḍamma. It does the flowing.' },
        { role: 'Subject (mubtadaʾ)', say: 'The pointing word “that”. It starts a new sentence and points to the believers having the gardens.' },
        { role: 'Predicate (khabar)', say: 'Nominative with ḍamma. “That is the success.”' },
        { role: 'Adjective (naʿt)', say: 'It describes الْفَوْزُ, so it copies its nominative case.' },
      ],
      quiz: { word: 7, q: 'What is جَنَّاتٌ in this verse?', options: ['The subject (mubtadaʾ) of the sentence لَهُمْ جَنَّاتٌ', 'The noun of إِنَّ', 'The object of عَمِلُوا'], answer: 0, why: 'The noun of إِنَّ is الَّذِينَ. The sentence لَهُمْ جَنَّاتٌ is the predicate of إِنَّ, and inside it جَنَّاتٌ is the subject placed after لَهُمْ.' },
    },
    12: {
      words: [
        { role: 'Emphasis particle (inna)', say: 'It stresses the sentence. It puts its noun in the accusative.' },
        { role: 'Noun of إِنَّ, first part of a possession', say: 'Accusative with fatḥa, because إِنَّ puts its noun in the accusative. It owns رَبِّكَ. It means a hard grip or seizure.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because بَطْشَ owns it. The ending كَ is “your”: the listener, the Prophet.' },
        { role: 'Lām of emphasis', say: 'It adds stress to the predicate. al-Jadwal calls it the “moved” lām: it stands on the predicate, but it goes with إِنَّ.' },
        { role: 'Predicate of إِنَّ', say: 'Nominative with tanwin ḍamma. It says what the seizure is: severe.' },
      ],
      quiz: { word: 3, q: 'What is the job of لَ in لَشَدِيدٌ?', options: ['It means “to”', 'It adds emphasis on the predicate of إِنَّ', 'It makes the word plural'], answer: 1, why: 'This is the emphasis lām. It sits on the predicate and strengthens إِنَّ.' },
    },
    13: {
      words: [
        { role: 'إِنَّ + “He”', say: 'إِنَّ stresses the sentence. The ending هُ is “He” (Allah). It is the noun of إِنَّ, so it is accusative in place. al-Jadwal says this sentence gives the reason for verse 12.' },
        { role: 'Subject (mubtadaʾ)', say: 'In al-Jadwal it is the subject of the clause هُوَ يُبْدِئُ, and it repeats “He” for stress. al-Jadwal also allows it as an emphasis pronoun that repeats the هُ.' },
        { role: 'Verb, present, Form IV', say: 'The predicate of هُوَ: “He originates”, He starts creation. The subject “He” is hidden inside the verb.' },
        { role: 'And', say: 'It joins يُعِيدُ to يُبْدِئُ.' },
        { role: 'Verb, present, Form IV', say: 'Joined to يُبْدِئُ, so it is also part of the predicate: “He brings back”.' },
      ],
      quiz: { word: 1, q: 'How does al-Jadwal read هُوَ here?', options: ['As the object of يُبْدِئُ', 'As a particle that means “only”', 'As the subject of the clause هُوَ يُبْدِئُ'], answer: 2, why: 'al-Jadwal makes هُوَ the subject (mubtadaʾ) of the clause that follows. The clause is the predicate of إِنَّ. It also allows an emphasis pronoun, but that is its second reading.' },
    },
    14: {
      words: [
        { role: 'And', say: 'It joins this sentence to هُوَ يُبْدِئُ in verse 13.' },
        { role: 'Subject (mubtadaʾ)', say: 'The pronoun “He”, nominative in place. The two names after it say who He is.' },
        { role: 'Predicate (khabar)', say: 'Nominative with ḍamma. The pattern فَعُول names someone who does it a lot: “who forgives again and again”.' },
        { role: 'Second predicate', say: 'A second predicate of هُوَ, also nominative. The same pattern فَعُول: “full of love”.' },
      ],
      quiz: { word: 3, q: 'What does the pattern فَعُول in الْوَدُودُ show?', options: ['A lot of the action, again and again', 'One act in the past', 'The doer is not named'], answer: 0, why: 'فَعُول is a pattern of intensity. It names someone who does the thing often and fully.' },
    },
    15: {
      words: [
        { role: 'Predicate (khabar), one of the five nouns', say: 'It goes on saying who “He” is (verse 14). It is nominative, shown by the long و. It is one of the “five nouns”. It means “owner of” and owns الْعَرْشِ.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra, because ذُو owns it.' },
        { role: 'Adjective (naʿt) of ذُو', say: 'It ends with ḍamma, so it is nominative and describes ذُو, the Lord. Another recitation reads الْمَجِيدِ with kasra, and then it describes the Throne.' },
      ],
      quiz: { word: 2, q: 'With the ḍamma on الْمَجِيدُ, which word does it describe?', options: ['الْعَرْشِ, the Throne', 'ذُو, the owner', 'Nothing: it is a verb'], answer: 1, why: 'An adjective copies the case of the word it describes. الْمَجِيدُ is nominative, and ذُو is nominative. الْعَرْشِ is genitive, so it cannot be the one described.' },
    },
    16: {
      words: [
        { role: 'Predicate (khabar)', say: 'Nominative with tanwin ḍamma. The pattern فَعَّال has a doubled middle letter and means someone who does the action fully and often. It works like a verb, so it can take an object.' },
        { role: 'Extra lām', say: 'al-Jadwal calls this لِ extra: it only strengthens the object. It does not add “to” or “for”. al-Jadwal also allows it as a real preposition tied to فَعَّالٌ.' },
        { role: 'Object of فَعَّالٌ', say: 'A relative pronoun, “what”. It is the object of فَعَّالٌ, accusative in place, even though the لِ stands before it.' },
        { role: 'Verb, present, Form IV', say: 'It finishes the مَا clause: “what He wants”. The subject “He” is hidden inside the verb.' },
      ],
      quiz: { word: 2, q: 'What is مَا in لِمَا يُرِيدُ?', options: ['The subject of a new sentence', 'A word for “not”', 'The object of فَعَّالٌ'], answer: 2, why: 'al-Jadwal reads مَا as the object of the intensive word فَعَّالٌ. The لِ before it is only there to strengthen that object.' },
    },
    17: {
      words: [
        { role: 'Question particle', say: 'It asks a question that makes the listener agree: “you have heard it, haven’t you?”. al-Jadwal also reads it as a question of wonder. It does not change any ending.' },
        { role: 'Verb, past, plus “you”', say: 'The past verb “came”. The ending كَ is “you” (the Prophet), the object. The one that came is the next word.' },
        { role: 'Subject (fāʿil), first part of a possession', say: 'The thing that came. Nominative with ḍamma. It owns الْجُنُودِ.' },
        { role: 'Second part of a possession', say: 'Genitive with kasra. A broken plural: “armies”.' },
      ],
      quiz: { word: 0, q: 'What does al-Jadwal say هَلْ is doing here?', options: ['Making the listener agree, or wonder', 'Meaning “not”', 'Joining two sentences'], answer: 0, why: 'al-Jadwal reads هَلْ as a question meant to make the listener confirm (or a question of wonder), not a question that looks for new information.' },
    },
    18: {
      words: [
        { role: 'Badal of “armies”', say: 'It stands in place of الْجُنُودِ and names them. al-Jadwal says a word is left out: “the armies of Pharaoh”. It is genitive, and it ends in fatḥa without tanwin because it is a diptote.' },
        { role: 'And', say: 'It joins ثَمُودَ to فِرْعَوْنَ.' },
        { role: 'Joined word', say: 'Joined to فِرْعَوْنَ, so it is genitive too. It ends in fatḥa without tanwin: a diptote as well.' },
      ],
      quiz: { word: 0, q: 'Why does فِرْعَوْنَ end in fatḥa when it is genitive?', options: ['It never changes its ending (mabnī)', 'It is a diptote, so the genitive is a fatḥa with no tanwin', 'It is a verb'], answer: 1, why: 'A diptote (mamnūʿ min al-ṣarf) takes fatḥa in the genitive and no tanwin. The word is not fixed (mabnī). It does change, for example to ḍamma in the nominative.' },
    },
    19: {
      words: [
        { role: 'Particle that moves on', say: 'It moves the talk to a new point: from the armies of the past to the disbelievers of now. The kasra on the ل is only there because a sukun meets the next ل.' },
        { role: 'Subject (mubtadaʾ)', say: 'A relative pronoun, “those who”. It starts a new sentence. It never changes its ending; its place is nominative.' },
        { role: 'Verb, past', say: 'It finishes the clause that says who “those” are. Plural “they”.' },
        { role: 'Preposition', say: 'It makes a phrase that is the predicate of الَّذِينَ.' },
        { role: 'After a preposition', say: 'Genitive with tanwin kasra. The pattern تَفْعِيل is the regular noun of the action for Form II: from كَذَّبَ.' },
      ],
      quiz: { word: 4, q: 'What is تَكْذِيبٍ?', options: ['An active participle', 'A past verb', 'The noun of the action for Form II (كَذَّبَ)'], answer: 2, why: 'al-Jadwal calls it the regular verbal noun (masdar) of the Form II verb كَذَّبَ, on the pattern تَفْعِيل.' },
    },
    20: {
      words: [
        { role: 'And', say: 'A plain “and”. It joins this sentence to the new sentence in verse 19. al-Jadwal does not read it as “while”.' },
        { role: 'Subject (mubtadaʾ)', say: 'Nominative with ḍamma.' },
        { role: 'Preposition', say: 'It belongs to مُحِيطٌ.' },
        { role: 'After a preposition, plus “them”', say: 'The word for “behind” is genitive with kasra after مِن. The ending هِمْ means “them”.' },
        { role: 'Predicate (khabar)', say: 'An active participle of Form IV: “surrounding”. Nominative with tanwin ḍamma. al-Jadwal calls “from behind them” a picture: they cannot get away from Him.' },
      ],
      quiz: { word: 0, q: 'How does al-Jadwal read the وَ at the start of this verse?', options: ['A plain wāw that joins this sentence to verse 19', 'A wāw that means “while” and gives a state', 'A wāw of an oath'], answer: 0, why: 'al-Jadwal says the sentence is joined to the sentence of verse 19. It is not a state clause.' },
    },
    21: {
      words: [
        { role: 'Particle that moves on', say: 'As in verse 19, it moves on to a new point: from their denial to what the Qur’an is.' },
        { role: 'Subject (mubtadaʾ)', say: 'The pronoun “it”, the Qur’an. Nominative in place.' },
        { role: 'Predicate (khabar)', say: 'Nominative with tanwin ḍamma. The tanwin makes it general: “a Qur’an that is ...”.' },
        { role: 'Adjective (naʿt)', say: 'It describes قُرْآنٌ, so it copies its nominative case and its tanwin.' },
      ],
      quiz: { word: 3, q: 'Why does مَجِيدٌ end in tanwin ḍamma?', options: ['It is the object of a verb', 'It describes قُرْآنٌ and copies its nominative case', 'It follows a preposition'], answer: 1, why: 'An adjective copies the case and the tanwin of the word it describes. قُرْآنٌ is nominative with tanwin, so مَجِيدٌ is too.' },
    },
    22: {
      words: [
        { role: 'Preposition', say: 'The phrase it opens is a second description of قُرْآنٌ in verse 21, after مَجِيدٌ (al-Jadwal).' },
        { role: 'After a preposition', say: 'Genitive with tanwin kasra. It means a tablet.' },
        { role: 'Adjective (naʿt)', say: 'A passive participle: “guarded”. It describes لَوْحٍ, so it copies its genitive case and its tanwin.' },
      ],
      quiz: { word: 2, q: 'What kind of word is مَحْفُوظٍ?', options: ['A past verb', 'An active participle: the one who guards', 'A passive participle: the one that is guarded'], answer: 2, why: 'The pattern مَفْعُول makes a passive participle. The tablet does not guard. It is the thing that is guarded.' },
    },
  },
};
