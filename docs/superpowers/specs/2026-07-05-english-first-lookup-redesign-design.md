# English-First Lookup Search + Structured Arabic Display — Design Spec

Date: 2026-07-05
Status: approved (direction + both scope decisions user-approved in brainstorming session)
Predecessors: `2026-07-03-word-lookup-design.md`, `2026-07-03-verb-form-generator-design.md`
(this spec modifies both shipped features; it adds no new page)

## Summary

Two user complaints about the shipped tools: (1) visitors have English keyboards and can't
find words, and (2) the Arabic display reads as messy — too small, not structured.

Diagnosis: English and transliteration search already work in both tools, but they are
invisible — the only affordance is a faded placeholder, and English input gets mostly
Arabic-only feedback (the verb generator's suggestion rows show no meaning at all; the word
lookup shows the entry's *first* gloss, not the one that matched). Matching is
exact-substring, so "believed" misses "believe". And 35.5% of word keys have no gloss yet,
making them unfindable in English. On the display side, the hero Arabic is fine (30–38px)
but all secondary vocalized Arabic sits at 17–18px — harakat are illegible — and rows are
built from wrapping flex lines with no vertical alignment, so nothing lines up.

Three workstreams fix this:

- **A. English-first search UX** — visible example chips, English meaning echoed in every
  suggestion row with the match highlighted, token/stem matching shared by both tools.
- **B. Type + structure** — a vocalized-Arabic type floor, and aligned column grids so all
  Arabic sits on one clean right spine. CSS/markup only; no data changes.
- **C. Gloss tail** — batch-gloss the remaining ~3,400 lemmas + 187 rootless particles so
  English search covers 100% of the index.

## User-approved decisions

1. **Scope: UX fix + full gloss coverage** (not UX-only, not coverage-only).
2. **Design scope: type + structure** — bigger Arabic everywhere plus aligned grids, applied
   to both tools. No page-level interaction redesign (no tabs, panels, sticky headers).
3. **Font stays KFGQPC Hafs Uthmani.** Size and layout are the problem, not the typeface.
4. **Matching stays deterministic** — tokenization + light stemming, unit-tested. No
   embeddings/semantic search.
5. **Two branches**: `feat/lookup-english-first` (workstreams A+B — they share markup) and
   `feat/gloss-tail` (workstream C, data only, can run concurrently).

## Workstream A — English-first search UX

### A1. Example chips under each search box

A quiet one-line row directly below the input: `Works with` followed by clickable example
chips — word lookup: `mercy` · `believe` · `rahma` · `الرحمن`; verb generator: `guide` ·
`send down` · `nzl` · `نصر`. Clicking a chip fills the input, triggers the normal input
flow (including first-focus data load), and focuses the box. These are query examples —
visually distinct from the generator's existing 18 root quick-chips, which stay unchanged.

### A2. English meaning echoed in every suggestion row

- **Verb generator rows** (currently root + translit + count only): every row gains a
  meaning line. When the query matched a meaning, show *that* meaning with the matched
  range wrapped in `<mark>`; when it matched by root/transliteration, show the root's most
  frequent attested entry's meaning as context. A row never appears without English.
- **Word lookup meaning-group rows**: the existing hint span shows the matched gloss
  (with `<mark>`) instead of the entry's first gloss. Sound-group and Arabic-suggestion
  rows keep the current first-gloss hint.
- `<mark>` styled on site tokens (gold-100 background / gold-900 text; dark theme via
  `:global([data-theme="dark"])` — the scoped-style ancestor gotcha applies).

### A3. Shared Latin matching module

New `src/lib/latin-match.ts`, used by `lookup-search.ts` and by a new
`src/lib/verb-search.ts` (the generator's inline `findMatches` moves out of the page into
this tested lib; the page becomes DOM glue, mirroring the lookup pattern).

Matching rules for English (meaning) queries:

- Query and gloss are tokenized on non-letters; matching is per-token.
- **Tiers**: (1) whole-word — query token equals a gloss token, or their stems are equal;
  (2) prefix — a gloss token starts with the query token (query token ≥3 chars);
  (3) substring — today's `includes()` behavior (query ≥3 chars), kept for recall.
- **Stemming** (light, deterministic): strip suffixes `-s -es -ed -ing -er -ers -ly -ful`,
  collapse a doubled final consonant (`stopped→stop`), normalize trailing `i→y`
  (`merciful→mercy`), plus a fixed map of ~30 common irregular verb forms
  (`sent→send`, `gave→give`, `made→make`, …). Full table lives in the implementation
  plan and its test file.
- **Multi-word queries**: every query token must match the same gloss (any tier); the
  match ranks at its worst tier.
- **Ranking**: tier first, then occurrence frequency (existing order). Result caps stay
  as they are (20 in the lib, 8 rendered per group; 12 in the generator).
- Meaning results carry the matched gloss text + character range for highlighting.
- Transliteration ("sound") matching is unchanged in both tools.
- Perf: token + stem arrays for the ~13.4k glossed entries are precomputed once in
  `prepareIndex` (and on verb data load), keeping per-keystroke work linear and cheap.

## Workstream B — Type + structure

### Type floor

No vocalized Arabic below **1.25rem** anywhere in the two tools. Concrete changes
(current → new):

| Selector | Current | New |
|---|---|---|
| `.wl-sug [lang="ar"]` | 1.3rem | 1.5rem |
| `.wl-morpheme [lang="ar"]` | 1.15rem | 1.4rem |
| `.wl-root-chip [lang="ar"]`, `.wl-chip` | 1.05rem | 1.25rem |
| `.wl-word` | 2.4rem | keep |
| `.vf-verb` | 1.9rem | 2.125rem |
| `.vf-pattern` | 1.15rem | 1.25rem |
| `.vf-sug [lang="ar"]` | 1.25rem | 1.5rem |
| `.vf-chip` | 1.05rem | 1.25rem |
| `.vf-root-link` | 1.1rem | 1.3rem |
| `.vf-root-letters` | 2.5rem | 2.75rem |

Line-height for vocalized Arabic ≥1.8 so harakat never clip (Hafs needs the clearance).
Exact values may be fine-tuned during the polish pass, but never below the floor.

### Verb form rows → aligned grid

Each attested row becomes a three-column grid: `[roman badge] [English block] [Arabic
block]`. English block: meaning (promoted, ~15–16px), transliteration italic beneath,
then one quiet metadata line (count · example ref). Arabic block right-aligned: the
past/present pair at 2.125rem with the wazn echo (`أَفْعَلَ`) beneath at 1.25rem muted —
the pattern moves here from the row head, so the head keeps only badge + semantic-shift
label. All Arabic blocks share one right spine down the page. Unattested rows stay
one-line and quiet (badge + pattern + note) inside the same grid so the spine holds.
Multi-lemma forms repeat the English/Arabic pair per entry within the row. Quad roots
(`Q1`…) use the same anatomy.

### Word lookup card

Order inside each analysis becomes: grammar line → **meaning (promoted)** → morpheme
breakdown → quiet metadata line (root chip · count · refs). The breakdown changes from
wrapped tiles to an aligned two-column mini-grid — Arabic segment (1.4rem, right column,
RTL order preserved) | role label — one row per morpheme, hairline-separated. (Two
columns, not three: the corpus has no per-morpheme transliteration; the affix code like
`bi+` stays inside the label.)

### Constraints

- Preserve the ARIA combobox contract (roles, `aria-expanded`, arrow-key navigation),
  `lang="ar" dir="rtl"` on every new Arabic node (the dir-guard rule from the review
  pass), `translate="no"` on transliterations, the `--i` stagger variables, and
  reduced-motion behavior.
- Mobile: grids collapse gracefully at narrow widths (Arabic block above English block,
  spine becomes row alignment); no horizontal overflow at 320px.
- Implementation runs the mandated design pipeline (taste-skill → impeccable →
  emil-design-eng → web-design-guidelines audit), anchored to existing site tokens —
  no new visual direction, no new fonts.

## Workstream C — Gloss tail (data only)

- Rerun the extractor with a higher `--top` (its `a[9] !== null` filter auto-skips the
  already-glossed 305 after a rebuild), emitting input batches of ~55 lemmas for the
  ~3,376 remaining non-verb lemmas. The 187 rootless particles are included, glossed at
  surface level (keyed exactly as the extractor emits rootless lemmas), with a
  particle-specific prompt instruction (function-word glosses: "indeed", "not",
  "O (vocative)" …).
- Batches run as delegated subagent waves (cheap model), reusing the existing
  noun-gloss prompt + schema. Every batch passes a validation gate before merge: schema
  shape, count parity with input, no empty glosses, Arabic fields untouched, ~10%
  accuracy spot-check by the orchestrator.
- Rebuild `word-lookup.json`; the existing **800 KB gzip hard gate** stays (currently
  716 KB; estimate +15–25 KB). If the gate ever trips, letter-sharding remains the
  documented fallback from the word-lookup spec.
- Result: English meaning search covers every glossable entry; the italic "meaning
  coming soon" state disappears from the tail naturally. `sugRow` hints densify with no
  code change.

## Testing

- **TDD units** (extend the existing 72): table-driven cases for `latin-match`
  (stemming: believed/believes/believing→believe, merciful→mercy, sent→send; tier
  ranking; multi-word "send down"; 2-char queries never prefix/substring-match),
  `verb-search` parity tests proving root/translit behavior is unchanged after
  extraction, and updated `lookup-search` meaning tests (matched-gloss + range).
- **E2E** (extend the existing 44, which must stay green): "believed" in the word lookup
  shows a meaning group with a `<mark>` inside the hint; example-chip click runs its
  search; "send down" in the generator shows نزل rows with highlighted meaning text;
  selected root renders the new grid structure (structural assertions, not pixel).
- **Batch gate**: validation script per gloss batch (criteria above) + gzip budget
  assertion in the build.
- **Visual**: web-design-guidelines audit pass, plus manual light/dark and 320px checks.

## Out of scope

- Semantic/synonym search beyond the stemmer; muqatta'at glosses (correctly unglossable);
  page-level interaction redesign; font changes; a browsable English→Arabic index page;
  per-morpheme transliteration (data doesn't carry it).

## Rollout

1. `feat/lookup-english-first` — workstreams A+B, conventional commits per milestone
   (lib TDD → lookup page → verb page → polish/audit), PR with code review.
2. `feat/gloss-tail` — workstream C batches land incrementally (data-only diffs),
   independent PR; can start immediately and merge before or after the UI branch.
