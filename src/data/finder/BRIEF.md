# Brief: plain English layer for the word finder

You write one batch of the "plain English layer" for a Quranic Arabic word finder. Worktree: C:\Users\daodi\code\Quran-learn\.claude\worktrees\resource-finder

Input: `src/data/finder/batches/in-NN.json` (your batch number is in your task). Each entry is a base word (lemma): id, lemma (Arabic base word; may be empty for attached-pronoun entries), pos (corpus tag: N noun, V verb, P preposition, PN proper noun, PRON pronoun, REL relative pronoun, DEM demonstrative, ADJ adjective, LOC/T place or time word, ...), roots, current_gloss (existing English, up to 3 variants), count (times in the Quran), sample_forms.

Style reference: read the first 12 entries of `src/data/finder/pilot-output.json` (and their input in `pilot-input.json`) and match that voice.

Output: `src/data/finder/batches/out-NN.json`, a JSON array with one object per input id, exactly these fields:

- `id` (number, copy from input)
- `easy` (string): what the word means in plain, everyday English a fluent English speaker understands at once. At most 14 words. NO grammar jargon: never use the words stem, nominative, accusative, genitive, relative pronoun, particle, preposition, conjunction, pronoun, imperfect, perfect, verbal noun, participle, demonstrative, adverb, vocative. For small grammar words, say what the word does with a tiny example, e.g. `who, those who: points to the people being described ("those who believe")`. For verbs write the plain "to ..." meaning. Stay faithful to current_gloss; add no theology or claims the gloss does not support.
- `kind` (string): exactly one of "action", "thing", "person or being", "name", "describing word", "place or time", "small word".
- `type` (array of strings): 6 to 15 things an English-speaking learner might TYPE to find this word, all lowercase, no Arabic script: synonyms, related everyday words, other forms of the English word (past tense, -ing, plural), short phrases, loanword spellings Muslims use when relevant (salah, sabr, jannah, shukr, taqwa, iman, zakat, jihad, sadaqah, hajj, dua, tawbah ...), and 1 or 2 common misspellings when the word is a likely typo target. Only include terms that genuinely lead to this word. Do not include the word's own transliteration unless it is a spelling people commonly use in English (e.g. "rahman"). Rare names of people or places (count 1 to 3): just the English name and common spellings, e.g. "harut", "harut and marut".
- `note` (string or null): ONE short sentence only when plain English would mislead (the Arabic word is wider or narrower than the English), else null.
- `check` (boolean): true if you are unsure of the meaning, the current_gloss looks wrong, or it needs a scholar's eye. If current_gloss looks wrong, write the meaning you believe is right in `easy`, and set check true.

Voice: plain, short, warm. B1 English. No idioms. Same output for entries with the same lemma and pos is not needed: each entry stands alone.

Process: read your input file with one Read call, assemble the entire array, write it with one Write call, then confirm with `node -e` that it parses and has the same number of entries as the input, every field present, easy at most 14 words. Do not read other files except the pilot references. Do not start servers or browsers. Do not edit anything else.

Report (at most 60 words): entries written, how many check:true, and the ids where current_gloss looked wrong.
