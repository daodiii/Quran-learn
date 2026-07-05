# Word Lookup — Design Spec

Date: 2026-07-03
Status: approved (all sections user-approved in brainstorming session)
Predecessor: `2026-07-03-verb-form-generator-design.md` (shares data sources, libs, page pattern)

## Summary

A user sees a word in the Quran — pasted from a digital mushaf (Uthmani, vocalized) or typed by
hand (bare, modern spelling) — and wants to understand it. They enter it on
`/resources/word-lookup/` and get every attested analysis of that written word: root, part of
speech, verb form, readable grammar features, morpheme breakdown (prefixes / stem / attached
pronoun), curated meaning (verbs since v1; top-305 noun/particle lemmas since Phase 2), occurrence count, and example verse refs. Verb results
deep-link into the Verb Form Generator via its existing `#root=` hash. Latin input searches both
by sound (transliteration) and by meaning (curated glosses).

## User-approved decisions

1. **Scope: all words, verb meanings first.** Every one of the 77,429 corpus words is findable
   now (root / POS / lemma / features). v1 shipped curated English glosses for verbs only
   (joined from `verb-forms.json`); Phase 2 (2026-07-05) added the top 305 non-verb lemmas by
   frequency (80% of non-verb occurrences) via the same subagent batch pipeline — the tail
   (~3.4k lemmas) continues in later rounds.
2. **Input: Arabic + both Latin modes.** Arabic (vocalized or bare, Uthmani or modern spelling);
   Latin input searches transliterations ("yunziluna" ≈ "yunzilūna") AND English meanings
   ("send down"), results grouped by kind. No mode toggle — script auto-detected.
3. **Architecture: single packed index, lazy-loaded.** One `public/data/word-lookup.json`
   fetched on first search-box focus; all matching runs in-memory. Measured at build (final
   pipeline, 2026-07-03): 14,695 normalized keys, 20,414 distinct analyses, 2,163 alternate
   keys; 2,323 KB raw / **716 KB gzipped**. The design-time 600 KB guard proved too tight:
   transliteration strings — required by the user-chosen sound-search mode — account for the
   overage, and the trimming levers (refs 3→1, drop noun features) bottom out at ~671 KB.
   Accepted: guard raised to 800 KB. Letter-sharding remains the documented fallback if the
   payload ever needs to shrink (no schema change required).
4. No fabricated Arabic, ever — same rule as the generator. Every Arabic string in the index is
   derived from the corpus; glosses come from the existing curated dataset.

## User-facing behavior

- Search box (`dir="auto"`, both-scripts placeholder). Suggestions appear as the user types
  (ARIA combobox: listbox roles, arrow keys, Enter, Escape — same contract as the generator).
- **Arabic query** → normalized exact match; prefix matches feed autocomplete (~8 suggestions).
- **Latin query** → two result groups, labelled: "matches by sound", "matches by meaning".
- **Result cards**, one per vocalized variant of the matched written word, every homograph
  analysis shown (e.g. bare ملك lists مَلَك / مُلْك / مَلِك / مَٰلِك …):
  - Arabic word large (Amiri, `lang="ar" dir="rtl"`), transliteration beneath (`translate="no"`).
  - Grammar line humanized client-side from packed feature tokens: "verb, Form IV — imperfect,
    3rd person masculine plural" / "noun, genitive, from the root ن-ز-ل". Tags the humanizer
    map doesn't know are shown as their raw corpus code rather than dropped (honest, debuggable).
  - Morpheme breakdown when the word has attachments:
    `فَ (so) + سَ (will) + يَكْفِي + كَ (you) + هُمُ (them)`. Segmentation and the Arabic
    segment text come from the corpus; the mini-glosses from a small static grammar map in the
    page (reference content, not corpus-derived — acceptable, it is grammar teaching, not
    Quran text). Pronoun suffixes are labeled role-neutrally ("we / us / our") because the
    corpus tags subject endings as PRON suffixes too; claiming subject vs object would need a
    form-level heuristic — deferred (recorded under out of scope).
  - Meaning: curated gloss (verbs; glossed noun/particle lemmas since Phase 2); italic
    "meaning coming soon" for the still-unglossed tail (generator pattern).
  - Root chip: verbs → link to `/resources/verb-forms/#root=<rootAr>`; non-verbs → plain root
    display; omitted entirely for the 1,345 root-less analyses (particles, pronouns, etc.).
  - `N× in the Quran` + up to 3 example refs linking to quran.com (generator's exact pattern).
- **No match** → "did you mean" suggestions (nearest keys by shared normalized prefix) + a hint
  that pasting from a digital mushaf works.
- **Fetch failure** → generator's retry-message pattern.
- **Deep link in**: `#q=<word>` pre-fills the box and runs the search on load.
- Cross-links: hand-placed card on `/resources/` index (beside the generator card, with
  `data-testid="resource-word-lookup"`); one line on the generator page pointing here.

## Data architecture

### Build script — `scripts/build-word-lookup.ts` (`npm run lookup:build`)

1. Parse the corpus with a new general row parser in `scripts/lib/group-words.ts` — the
   existing `parseCorpus` (`scripts/lib/extract-verbs.ts`) is verbs-only and drops
   word/segment numbers, so it stays untouched and the verb pipeline is not disturbed.
2. **Group rows by word location `(surah:ayah:word)`** — new lib `scripts/lib/group-words.ts`.
   A written word = concatenation of its segment FORMs in order (PREFIX* STEM+ SUFFIX*).
   ~500 words carry TWO stems (compounds like بِئْسَمَا) → both stems kept, producing two
   analyses that share the same surface. Suffix PRON rows include attached object/possessive
   pronouns AND subject endings (the corpus tags ونَ of يُؤْمِنُونَ as a PRON suffix — see the
   output-contract note on column [8]).
3. Per distinct `(vocalized surface, lemma, root, POS, features-signature)`: aggregate count,
   collect first ≤3 refs.
4. **Verb corrections**: apply `FORM_OVERRIDES` (existing table) to verb form numbers.
5. **Gloss join (build time, one source of truth)**: from `public/data/verb-forms.json` by
   `(rootAr, form)`. Where a form has multiple lemma entries (the 7 lemma merges), disambiguate
   by matching the entry's past-citation string against `bwToArabic(lemma)`. A verb analysis
   that finds no gloss gets `null` (must be logged by the validator, expected ≈0).
6. Emit packed JSON; print raw + gzip size; **exit non-zero if gzip > 800 KB** (guard raised
   from the original 600 KB — see decision 3).

### Output contract — `public/data/word-lookup.json`

```jsonc
{
  "meta": { "source": "Quranic Arabic Corpus v0.4 (Kais Dukes, GPL) — corpus.quran.com",
            "words": 14695, "analyses": 20414, "version": 1 },
  "words": {
    "<normalizedArabic>": [
      // packed analysis — fixed column order:
      // [0] vocalized surface (Arabic)     [1] transliteration
      // [2] root (Arabic) | null           [3] lemma (Arabic)
      // [4] POS code (corpus tag, e.g. "V","N","PN","P","PRON")
      // [5] verb form number | 0           [6] feature tokens (compact string, e.g. "IMPF|3MP|MOOD:JUS|PASS")
      // [7] prefixes in corpus order, each "arabicSegment|featureCode"
      //     (e.g. "وَ|w:CONJ+", "ٱل|Al+") — empty array if none
      // [8] suffixes, same format (e.g. "هُ|PRON:3MS") — empty array if none. Plural because
      //     words like أَنزَلْنَٰهُ carry TWO attached pronouns; also covers "+n:EMPH". Note:
      //     the corpus tags SUBJECT endings (ونَ of يُؤْمِنُونَ, نَٰ of أَنزَلْنَٰهُ) as PRON
      //     suffixes too — traditional grammar treats them as attached subject pronouns.
      //     Storing the real Arabic segment (نَٰ vs نِي) is what keeps them distinguishable.
      // [9] gloss | null                   [10] occurrence count
      // [11] example refs, ≤3 (e.g. ["2:255","3:5"])
      // (verified real row shape — values recomputed by the build)
      ["يُؤْمِنُونَ", "yuʾminūna", "ءمن", "آمَنَ", "V", 4, "IMPF|3MP", [], ["ونَ|PRON:3MP"], "to believe", 87, ["2:3"]]
    ]
  },
  "altKeys": { "<alternateSpelling>": "<canonicalKey>" }
}
```

The transliteration search key (diacritic-folded) is derived client-side from column [1] at
load time — not stored, keeps the file smaller.

### Normalization — `src/lib/arabic-normalize.ts` (single shared module)

Imported by BOTH the build script (Node) and the page script (browser) so index keys and query
normalization can never drift. The generator's `normalizeAr` is root-oriented (folds hamza
carriers أإآٱؤئ → ء) and would break whole-word matching (typed انزل would miss أَنزَلَ) — the
lookup gets its own documented function:

- Strip: harakat + Quranic annotation marks (U+064B–U+065F, U+0670 dagger alif,
  U+06D6–U+06ED), tatweel (U+0640), whitespace.
- Fold: أ إ آ ٱ → ا;  ى → ي.
- Keep distinct: ة (users type it correctly), ؤ ئ (hamza seats; misspellings are caught by
  "did you mean").

**Uthmani alternate keys, derived from data**: when the vocalized form contains dagger-alif
orthography whose bare skeleton differs from the modern spelling (الصلوٰة → users type الصلاة),
the build script emits `altKeys` entries mapping the modern spelling to the canonical key. The
mapping rule (letter + U+0670 → letter replaced by ا in the alternate) is applied mechanically
to the vocalized form — no hardcoded word list. Client checks `words[k] ?? words[altKeys[k]]`.

### Matching engine (client)

- Script detection per input: any Arabic-block codepoint → Arabic path, else Latin path.
- Arabic: normalize → exact lookup (with altKeys fallback); prefix scan over keys for
  autocomplete; no-match → nearest-prefix "did you mean".
- Latin: fold (`lowercase; strip [\s\-''ʼ’]; map āīū→aiu, ḍḥṣṭẓ→dhstz, ʿʾ→removed`) → match
  against folded transliterations (prefix/substring); separately substring-match raw lowercase
  query against glosses. Two labelled result groups. The fold table is derived from
  `bwToTranslit`'s actual character inventory and locked by a test that folds every translit
  the build emits down to plain ASCII (no unfoldable char may slip through).

## Attribution / licensing

Same GPL obligations as the generator: corpus attribution + link to corpus.quran.com in the
page footer (`meta.source` also carries it in the data file). Tanzil notice already covered by
the corpus file header retained in-repo.

## Phasing

- **v1 (this spec)**: everything above; verb glosses only.
- **Phase 2 (SHIPPED 2026-07-05, top-305 milestone)**: noun/particle gloss curation via the
  subagent batch pipeline (`orchestration-fable-brain-cheap-subagents`) — store at
  `src/data/morphology/glosses-nouns/` keyed `lemma|pos`, joined in `buildNounGlossMap`. As
  predicted, no schema change (column [9] simply stops being null) and meaning search widened
  automatically. Actual glossless workload was 3,681 lemmas (design estimate ~2k+); the top 305
  by frequency cover 80% of non-verb occurrences. The tail (~3.4k lemmas) and 187 root-less
  lemma-less analyses continue in later rounds.

## Testing

TDD throughout, repo conventions (`tsx --test`, `npm run test:lookup`):

- `src/lib/arabic-normalize.test.ts` — every strip/fold rule; Uthmani alt-key derivation cases
  (الصلوة/الصلاة, الزكوة/الزكاة); idempotence.
- `scripts/lib/group-words.test.ts` — segment reconstruction (prefix+stem+suffix), two-stem
  words, ref aggregation, count math.
- Gloss-join tests — normal join, lemma-merge disambiguation, no-gloss logging.
- `scripts/validate-word-lookup.ts` (`npm run validate:lookup`) — **round-trips all 77,429
  corpus words through the real normalize+lookup code path**: every word in the Quran must find
  itself and one of its analyses must match its own location's lemma+POS. Spot checks: both
  spellings of الصلاة; bare-typed انزل finds أَنزَلَ forms; مِن homographs list every analysis;
  gzip size ≤ 600 KB.
- Playwright e2e (`tests/word-lookup.spec.ts`): paste vocalized Uthmani; type bare Arabic;
  translit query; meaning query; homograph card list; no-match did-you-mean; `#q=` deep link;
  root chip deep-links into the generator. A11y spec extended to the new page.
- Design-guidelines audit (Phase 3 of the UI pipeline) before completion.

## Out of scope (recorded for later)

- Noun/particle gloss tail beyond the top 305 (Phase 2 above; 6,998 analyses still pending).
- Transliteration display-style preferences; virtual Arabic keyboard.
- Per-word static SEO pages (mirrors the generator's deferred per-root pages).
- Verse-context view (showing the full ayah around an occurrence).
