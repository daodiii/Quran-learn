# Tier 1 Systematic Fixes — Design Document

**Date:** 2026-02-15
**Scope:** Fix broken ExerciseBox props, invalid Callout types, and nested details/summary across ~45 lesson files
**Approach:** Parallel subagents grouped by fix pattern

## Problem

Three systematic issues affect ~234 component instances across the curriculum:

1. **T1-01 ExerciseBox props** (~88 instances, ~30 files): ExerciseBox accepts only `question` (string) and `id` (string). All other props (`title`, `difficulty`, `level`, `instructions`, `questions`, `problem`, `topic`, `hint`, `answer`, `exerciseId`, `skillType`, `arabicText`, `answerType`, `expectedElements`) are silently ignored, resulting in exercises with no visible question text.

2. **T1-02 Callout types** (~38 instances, ~22 files): Callout accepts `type` of `note | tip | rule | warning`. Invalid types (`info`, `insight`, `advanced`, `context`, `milestone`, `example`) silently default to `note`, losing intended semantic styling.

3. **T1-03 Nested details/summary** (~30 instances, ~15 files): ExerciseBox already provides its own show/hide toggle. Nested `<details>/<summary>` inside creates a redundant double-toggle UX.

## Component Contracts

### ExerciseBox
```
Props: question (string, required), id (string, optional)
Slot: answer content (markdown, MDX components)
```

### Callout
```
Props: type ('note' | 'tip' | 'rule' | 'warning'), title (string, optional)
Slot: callout body content
```

## Transformation Rules

### T1-02 Callout Type Replacements

| Invalid Type | Replacement | Rationale |
|-------------|-------------|-----------|
| `info` | `note` | Informational content maps to note |
| `insight` | `tip` | Deeper understanding maps to tip |
| `advanced` | `warning` | Advanced/complex content maps to warning |
| `context` | `note` | Contextual background maps to note |
| `milestone` | `tip` | Achievement/milestone maps to tip |
| `example` | `tip` | Example callouts map to tip |

### T1-03 Nested Details/Summary Removal

- Delete `<details>` and `</details>` tags
- Delete `<summary>...</summary>` lines
- Preserve all answer content that was between the tags

### T1-01 ExerciseBox Pattern Fixes

| Pattern | Current Shape | Transformation | Affected Files |
|---------|--------------|----------------|----------------|
| B | `title`/`difficulty` props + nested details | `title`→`question`, remove `difficulty`, strip details/summary | L1.10-11, L2.10-11, L5.01-07, L5.09-10, L5.12, L5.14-16 |
| C | `level` prop, missing `question` | Remove `level`, add `question` from surrounding content | L3.03-09 |
| D | `title`/`instructions`/`questions={[...]}` array | Split into individual `<ExerciseBox question="prompt">answer</ExerciseBox>` | L3.12, L3.15-18, L4.05-10 |
| E | `difficulty`/`topic`/`problem` | `problem`→`question`, remove `difficulty`/`topic` | L4.03-04 |
| F | `title`/`instructions` with slot | `title`→`question`, remove `instructions` | L4.11-17 |
| G | `question`/`hint`/`answer` props | Keep `question`, remove `hint`/`answer`, move answer to slot | L5.08 |
| H | Entirely fabricated props | Full rewrite to `<ExerciseBox question="...">answer</ExerciseBox>` | L5.11 |
| I | `title`/`difficulty`/`answer` | `title`→`question`, remove `difficulty`/`answer`, move to slot | L5.13 |

## Execution Plan

### Wave 1 (all parallel, no file overlap)

1. **Callout fixes** — All files with invalid Callout types
2. **Pattern B L1+L2** — L1.10, L1.11, L2.10, L2.11
3. **Pattern C L3** — L3.03-09
4. **Pattern D L3** — L3.12, L3.15-18
5. **Pattern D L4** — L4.05-10

### Wave 2 (after Wave 1, potential file overlap with Callout fixes)

6. **Pattern B L5 set 1** — L5.01-07, L5.09-10
7. **Patterns E+F L4** — L4.03-04, L4.11-17
8. **Patterns B+G+H+I L5 remaining** — L5.08, L5.11-16

### Verification

`npm run build` after all commits — must produce 0 errors.

## Commit Strategy

One atomic commit per agent: `fix(lessons): T1-0X — [description] across L[range]`

## Not In Scope

- Tier 2 (Arabic content errors) — manual review needed
- Tier 3 (content quality) — requires subject matter expertise
- Tier 4 (structural/links) — separate pass
- Adding missing exercise answers (L1.08-09) — content creation, not fix
