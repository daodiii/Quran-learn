# Verb Form Generator — Design Spec

**Date:** 2026-07-03
**Status:** Approved by user (conversation, 2026-07-03)
**Branch:** `feat/verb-form-generator`

## Summary

An interactive page under Resources where a learner selects any triliteral root used verbally in the Quran and sees how it behaves across the ten verb forms (Form I–X): the real Arabic verb, transliteration, English meaning, occurrence count, and an example verse — for every form that root actually uses in the Quran.

**Core honesty rule: no fabricated Arabic, ever.** Every Arabic word displayed is an attested Quranic lemma from corpus morphology data. Forms a root does not use in the Quran appear as greyed pattern-only rows ("not used in the Quran for this root").

## User-approved decisions

| Decision | Choice |
|----------|--------|
| Unattested forms | Always show full I–X grid; unattested rows show abstract pattern only (فَعَّلَ), greyed, no invented words/meanings |
| Entry detail | Full: Arabic + transliteration + meaning + occurrence count + one example verse ref |
| Verb citation | Past + present pair (كَتَبَ / يَكْتُبُ — *kataba / yaktubu*) |
| Delivery | Single interactive page (no page reloads); static per-root SEO pages possible later from same data |
| Workflow | Fable 5 designs/validates; well-specified batch work delegated to lower-model subagents |

## User-facing behavior

1. **Entry points:** search box accepting Arabic root letters (`كتب`), transliteration (`ktb`, `kataba`), or English meaning fragments (`write`); an A–Z root index grouped by first Arabic letter; quick-pick chips for the ~20 highest-frequency roots.
2. **Root header:** spaced root letters (ن · ز · ل), count of forms used (e.g. "4 of 10 forms"), total Quranic occurrences.
3. **The grid:** ten rows, Form I → X, always all ten.
   - Attested row: form badge (IV), pattern (أَفْعَلَ), verb pair **أَنْزَلَ / يُنْزِلُ**, transliteration *anzala / yunzilu*, meaning "to send down", count chip "293×", example ref "2:23" (links to verse on quran.com or internal surah page when covered).
   - Unattested row: form badge + pattern, greyed, "not used in the Quran for this root."
4. Selection updates instantly client-side. Works offline in the Capacitor app builds.

## Data architecture

Two layers merged at build time into one static JSON.

### Layer 1 — mechanical extraction (corpus)

- Source: Quranic Arabic Corpus morphology data v0.4 (Kais Dukes; GPL; tab-separated, Buckwalter transliteration). Stored under `src/data/morphology/` (directory already exists, empty).
- `scripts/build-verb-dataset.ts` parses it and, for every token tagged `V`:
  - root (from `ROOT:` feature), form (roman numeral feature, default I), lemma (`LEM:` feature)
  - aggregates per (root, form): occurrence count + first-occurrence verse ref
  - converts Buckwalter → Arabic script and → scholarly transliteration (mechanical mapping)
- Output: `src/data/morphology/verb-skeleton.json` — the complete inventory (~950 roots, ~1,450 root×form entries; exact numbers produced by the script and recorded in the plan).

### Layer 2 — curated glosses (batched)

- `src/data/morphology/glosses/batch-NN.json` files, authored by subagents from Fable-written prompts, validated before merge.
- Per (root, form) entry: English meaning; present-tense form. Present is pattern-mechanical for Forms II–X; curated for Form I (unpredictable middle vowel) and all weak verbs (hollow, defective, assimilated, doubled, hamzated).
- Cross-check resource: the site's existing lessons/surah analyses already gloss hundreds of these verbs.

### Merged output + contract

`scripts/build-verb-dataset.ts merge` emits `src/data/verb-forms.json`:

```jsonc
{
  "meta": { "generated": "…", "roots": 0, "entries": 0, "source": "Quranic Arabic Corpus v0.4 (GPL)" },
  "roots": [
    {
      "root": "نزل",            // Arabic letters, no diacritics
      "translit": "n-z-l",
      "totalCount": 293,
      "forms": {
        "4": {
          "past": "أَنْزَلَ",      // fully vocalized, attested lemma
          "present": "يُنْزِلُ",   // fully vocalized
          "translit": "anzala / yunzilu",
          "meaning": "to send down, reveal",
          "count": 190,
          "example": "2:23"      // surah:ayah of a representative occurrence
        }
      }
    }
  ]
}
```

- `npm run validate:verbs` (joins the existing `validate:*` family): every entry has vocalized Arabic (diacritic density check), non-empty meaning, count > 0, `example` parses as valid surah:ayah within known ayah counts; merged totals reconcile with the skeleton; no skeleton entry silently dropped.

## UI implementation

- `src/pages/resources/verb-forms/index.astro`, URL `/resources/verb-forms/`; listed as a card on the Resources index.
- Site's established pattern: static page, vanilla `<script>` for search + render (same architecture as `Quiz.astro`). The dataset is fetched as a static JSON asset on page load (keeps the HTML document small; the JSON is cacheable and available to Capacitor builds as a bundled asset). No JS framework introduced.
- Search is client-side substring/normalized matching over root letters, transliteration, and meaning text.
- Visual build follows the mandatory design pipeline (site direction already locked: Modern Devotional dark system, existing tokens, Amiri for Arabic); Phase 2 skills load when UI code is written; `web-design-guidelines` audit before completion.
- Accessibility: grid rows are a semantic list/table; unattested rows keep sufficient contrast; search operable by keyboard; Arabic marked `lang="ar"` `dir="rtl"` (site convention via `rehype-arabic-wrap` for MDX; manual attrs here).

## Attribution / licensing

Corpus morphology data is GPL-licensed. The page footer carries an attribution line naming the Quranic Arabic Corpus (Kais Dukes). English glosses are original work of this project.

## Phasing

1. **Data pipeline** — obtain corpus file, extraction script, skeleton JSON, validation script. Produces the true inventory counts.
2. **Gloss batches** — ~20–25 subagent batches with per-batch validation + Fable spot-review. Page may ship mid-curation with "meaning coming soon" rows if desired.
3. **UI build** — the generator page (can proceed in parallel once the contract is frozen by Phase 1).
4. **Verification** — `validate:verbs`, `astro build`, Playwright smoke + existing a11y/font checks on the new page.

## Testing

- Unit-ish: extraction script has a fixture test (a slice of the corpus file with known verbs incl. Form I sound, hollow قال, Form IV أنزل, Form X استغفر) asserting parsed root/form/lemma/count.
- Dataset: `validate:verbs` as above.
- E2E: Playwright — load page, search "نزل" and "nzl", assert Form IV row shows أَنْزَلَ and the unattested rows are marked; a11y scan of the page.

## Out of scope (recorded for later)

- **Word lookup (next feature, user request):** a precise way to enter a specific Quranic word (any conjugated surface form, e.g. يُنْزِلُونَ) and find it — its root, form, meaning. The corpus token data extracted in Phase 1 is deliberately kept (skeleton keeps per-token source lines out of the shipped JSON but the raw file stays in-repo) so this feature can build on it.
- Static per-root SEO pages.
- Full conjugation tables (person/number/gender) per form — the existing `VerbConjugation` component and lessons already cover conjugation patterns.
