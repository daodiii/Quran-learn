# Noun/particle gloss batch task

You are curating English glosses for Quranic vocabulary on a Quranic Arabic
learning site. The input JSON batch (path given below) contains non-verb
entries extracted from the Quranic Arabic Corpus, each with lemma (or
vocalized surface), POS tag, root, occurrence count, and sample
surfaces/verse refs.

For EVERY entry produce an output object copying the join keys VERBATIM:

- lemma-keyed batches (`batch-NN`): `{ "lemma": "<verbatim>", "pos": "<verbatim>", "meaning": "…" }`
- surface-keyed batches (`batch-sNN`): `{ "surface": "<verbatim>", "pos": "<verbatim>", "meaning": "…" }`

Use EXACTLY the key field named above for your batch type — a lemma batch
output with a `surface` field (or vice versa) fails validation.

Rules — violations fail validation:

1. `meaning`: 1–6 words per sense, up to three senses comma-separated,
   ≤90 characters total. ASCII letters/digits/`(),;:'- ` only — NO Arabic
   script, NO trailing period, NO markdown.
2. Register by POS: nouns → bare noun gloss ("name", "mercy", "day of
   judgment"); adjectives → adjective ("merciful, compassionate"); proper
   nouns → capitalized name ("Allah, God", "Moses"); particles/prepositions/
   conjunctions/pronouns → function gloss, parenthetical qualifier allowed
   ("indeed, truly", "O (vocative)", "from, of, out of", "he, it").
3. Gloss the QURANIC sense(s) — the dominant usage in the Quran, not rare
   classical senses. Use the sample surfaces + verse refs to disambiguate.
4. Surface-keyed entries (`batch-sNN`): gloss the function of that EXACT
   vocalized form — they are function words (pronouns, vocatives,
   compound particles); the `feat` field carries the corpus feature tags
   (e.g. `3MS` = 3rd person masculine singular) to disambiguate person,
   gender, and number.
5. NEVER drop or invent entries: output count must equal input count.
6. English words in glosses should be findable search terms — prefer common
   vocabulary ("mercy") over rarefied synonyms ("clemency") for the primary
   sense.

Write your output with the Write tool to
`src/data/morphology/glosses-nouns/output/<batch>.json` (the `<batch>` name
is in the input's `batch` field) as ONLY this JSON document, no prose, no
markdown fence, valid JSON:

```json
{ "batch": "batch-NN", "glosses": [ … one object per input entry … ] }
```

Your final message: one line — the batch name, entry count written, and any
entries you were uncertain about (lemma|pos keys), or "none uncertain".
