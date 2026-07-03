# Verb gloss batch task

You are curating dictionary entries for Quranic verbs on a Quranic Arabic
learning site. The input JSON batch (path given below) contains roots with
attested (root, form) lemma entries extracted from the Quranic Arabic Corpus.

For EVERY entry in every root, produce an output object:

```json
{ "root": "<root field verbatim>", "form": 4, "lemma": "<lemma field verbatim>",
  "past": "أَنْزَلَ", "present": "يُنْزِلُ",
  "translit": "anzala / yunzilu",
  "meaning": "to send down, reveal" }
```

Rules — violations fail validation:

1. `root`, `form`, `lemma` copied verbatim from input (they are join keys).
2. `past`: the classical dictionary citation form (3rd masc. sing. perfect),
   fully vocalized. Start from `draftPast` (mechanical conversion) and fix
   orthography to dictionary convention: ءَامَنَ → آمَنَ; add the missing kasra on
   connective alif (اسْتَغْفَرَ → اِسْتَغْفَرَ); every consonant must carry a diacritic
   (fatha/kasra/damma/sukun/shadda±vowel). Final radical carries fatha.
3. `present`: matching 3rd masc. sing. imperfect, fully vocalized, correct
   for the verb's ACTUAL behavior:
   - Forms II–X sound roots: pattern-regular (II يُفَعِّلُ · III يُفَاعِلُ · IV يُفْعِلُ ·
     V يَتَفَعَّلُ · VI يَتَفَاعَلُ · VII يَنْفَعِلُ · VIII يَفْتَعِلُ · IX يَفْعَلُّ · X يَسْتَفْعِلُ).
   - Form I: supply the correct middle vowel (يَفْعَلُ / يَفْعِلُ / يَفْعُلُ) as
     established in classical dictionaries for THIS verb (e.g. كَتَبَ/يَكْتُبُ،
     جَلَسَ/يَجْلِسُ، فَتَحَ/يَفْتَحُ، عَلِمَ/يَعْلَمُ، كَرُمَ/يَكْرُمُ).
   - Weak roots (`weak` flags in input): apply the correct weak conjugation
     (hollow: قَالَ/يَقُولُ، بَاعَ/يَبِيعُ، خَافَ/يَخَافُ; defective: دَعَا/يَدْعُو،
     هَدَى/يَهْدِي، رَضِيَ/يَرْضَى; assimilated: وَعَدَ/يَعِدُ، وَجِلَ/يَوْجَلُ; doubled:
     ظَنَّ/يَظُنُّ، مَسَّ/يَمَسُّ; hamzated: أَكَلَ/يَأْكُلُ، سَأَلَ/يَسْأَلُ، قَرَأَ/يَقْرَأُ).
     Weak roots in derived forms too: IV hollow أَقَامَ/يُقِيمُ; X hollow
     اِسْتَقَامَ/يَسْتَقِيمُ; IV defective أَلْقَى/يُلْقِي; V defective تَوَلَّى/يَتَوَلَّى.
   - Quadriliteral roots (`quad: true`): quad patterns (زَلْزَلَ/يُزَلْزِلُ).
   - Rare forms XI/XII if present: e.g. XII اِطْمَأَنَّ/يَطْمَئِنُّ.
4. `translit`: scholarly transliteration of BOTH forms, format `"past / present"`,
   using exactly this character set: a i u ā ī ū b t th j ḥ kh d dh r z s sh
   ṣ ḍ ṭ ẓ ʿ gh f q k l m n h w y ʾ. No initial ʾ (write anzala, āmana —
   not ʾanzala). Doubled letters written twice (ʿallama, iṭmaʾanna).
   Correct the mechanical draft where wrong.
5. `meaning`: 2–8 word English infinitive gloss starting with "to …",
   reflecting how the QURAN uses this verb (its dominant Quranic sense(s),
   not rare classical senses). Up to two senses separated by a comma. No
   trailing period. For passive-only lemmas (vocalized passively in the
   input, e.g. زُلْزِلَ), keep the passive citation and gloss it passively
   ("to be shaken violently").
6. NEVER invent forms not in the input. NEVER drop an entry. Output gloss
   count must equal input entry count exactly.

Write your output with the Write tool to
`src/data/morphology/glosses/output/<batch>.json` (the `<batch>` name is in
the input's `batch` field) as ONLY this JSON document, no prose, no markdown
fence, valid JSON:

```json
{ "batch": "batch-NN", "glosses": [ … one object per input entry … ] }
```

Your final message: one line — the batch name, entry count written, and any
entries you were uncertain about (root:form keys), or "none uncertain".
