# Resource Finder: Word Lookup and Verb Form Generator, merged

Status: design, 2026-10-29. Nothing here is built except the pilot data in `src/data/finder/`.

## What is wrong today (measured on the real tools, not the mockups)

Both tools already match English meanings, sounds and Arabic. They fail in these ways:

- **Phrases.** "he said", "they believed", "the book", "day of judgement", "come out" return nothing.
- **Typos.** "beleive", "recieve", "fogive" return nothing. "prey" (pray) returns hunting.
- **Irregular English.** "ate" matches inside "create" and "fabricate", so the verb tool shows `kh-l-q` and `q-w-l`.
- **Words Muslims already know.** "sabr", "shukr", "jihad", "bismillah", "alhamdulillah", "jannah" return nothing. "salah" returns the root for "reform".
- **Answers are a pile of word forms.** "believe" returns 20 separate forms. The learner then has to guess the root and open the other tool.
- **Explanations read like a grammar book.** "stem of the relative pronoun" means nothing to a fluent English reader who does not know the terms.
- **The count is shown as if it were the answer.** It is a small fact.

## The idea: one box, one answer

One search box on `/resources/find/`. It takes English (single words, phrases, typos), sound (`rahma`, `sabr`), Arabic with or without marks, and root letters (`k t b`).

The result is a short list of **base words**, one per word, not one per written form. Each row shows:

1. The base word in large Arabic, with how to say it.
2. What it means in plain English, one line. No grammar terms.
3. A small label: action, thing, person or being, name, describing word, place or time, small word.
4. Why it matched ("you typed *afterlife*; the Quran says *the last home*").

Opening a word gives one card:

- **Meaning** in plain English, plus a note only where English would mislead.
- **How it is built**, for the exact form the learner typed or pasted. Example for وَالَّذِينَ: **wa-** *and* + **alladhīna** *those who*. In one line: "and those who". Built from the corpus tags, no grammar words.
- **The family** (same root): nouns, describing words and verbs, each with its plain meaning.
- **Verb forms**, for roots with verbs: the generator's ten-form view, with the forms the Quran uses marked.
- **Seen in the Quran**: a verse and a small count ("about 830 times"). The count sits at the bottom.

Verbs and words appear together in the family, so the two tools stop being two tools. The old addresses `/resources/word-lookup/` and `/resources/verb-forms/` stay and open the finder in the matching view (links and bookmarks keep working).

## Four layers

**A. Plain English layer (built ahead of time).** For each of the 5,147 base words, written once and checked:
`easy` (plain meaning, max 14 words, no grammar jargon), `kind`, `type` (6 to 15 things people type to find it: synonyms, other forms of the English word, loanword spellings, likely typos), `note` (only when English misleads), `check` (needs a scholar's eye). Written with AI in batches, then reviewed. Ships as its own lazily loaded file, never inside `word-lookup.json`.

**B. English understanding (in the browser, no AI call).** Strips filler ("he", "they", "the", "to", "a"), maps irregular forms (ate to eat, said to say), handles plurals and -ing/-ed, tolerates one or two letter typos, matches whole words before parts of words, and ranks by how central the meaning is, not by corpus frequency. A phrase like "they believed" finds *to believe* and highlights the matching written form (āmanū).

**C. How it is built (generated, no AI).** From the corpus tags we already ship: attached words (wa- *and*, bi- *with*, al- *the*), the base word's plain meaning, and the ending as a plain pronoun (-hum *them*, -ūna *they*). Verbs read as "they believe", "he said", "say!".

**D. Grouping.** Written forms group under the base word; base words group under the root (1,642 roots). The verb generator's data (943 verb roots) attaches to the root.

## Order of work (each step ships on its own)

1. Layer A on all base words, plus a before/after report against the current search. Needs the owner's sign-off on a sample first.
2. Layer B in the existing Word Lookup and Verb Form Generator (smallest user-visible win).
3. Layer C: the "how it is built" line replaces today's grammar line.
4. The merged finder page and redirects.

## Constraints

- `word-lookup.json` is at 829 KB of an 850 KB gzip budget. Layer A is a separate file, target 200 KB gzip or less, loaded on first focus of the search box.
- Everything stays offline and free per search. No AI call when a visitor types.
- The corpus is GPL (Kais Dukes); keep the attribution already on both pages. AI-written meanings carry the site's own credit, as the glosses do now.
- Plain B1 English. Arabic hero, letter-spacing 0, 44 px targets, AAA contrast for Arabic, colour never the only signal.

## Open questions

- Who reviews layer A? Proposal: `check:true` entries and a 10% random sample go to the owner.
- Does the verb view stay a tab inside the card, or a separate section below the family?
- Should "paste a verse" (tap each word) live in the finder? It already works in Word Lookup for single words.
