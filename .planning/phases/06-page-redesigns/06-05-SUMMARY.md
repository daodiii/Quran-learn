---
phase: 06
plan: 05
subsystem: ui-pages
tags: [resources, cards, design-tokens, astro, content-collections]
dependency-graph:
  requires:
    - 03-01-card-components
    - 02-02-primitive-components
    - 01-02-design-tokens
  provides:
    - resources-page
    - resource-content-structure
  affects:
    - phase-7-progress-tracking
tech-stack:
  added: []
  patterns:
    - content-collections-auto-discovery
    - icon-mapping-pattern
key-files:
  created:
    - src/pages/resources/index.astro
    - src/content/resources/*.mdx (6 files)
    - src/lib/auth.ts (stub)
    - src/lib/progress.ts (stub)
    - src/scripts/capacitor-init.ts (stub)
  modified: []
decisions:
  - id: icon-per-resource-type
    desc: "Map resource IDs to semantic SVG icons (book for words, grid for charts, etc.)"
    rationale: "Visual differentiation helps users quickly identify resource types"
  - id: content-collection-placeholders
    desc: "Created placeholder MDX files with frontmatter but minimal content"
    rationale: "Allows page to function while content can be filled incrementally"
  - id: blocking-stubs-created
    desc: "Created auth.ts, progress.ts, capacitor-init.ts stubs to unblock build"
    rationale: "Rule 3 deviation - fixed blocking imports preventing build completion"
metrics:
  duration: 9min
  commits: 2
  files-created: 11
  files-modified: 0
  completed: 2026-02-06
---

# Phase 6 Plan 05: Resources Page Redesign Summary

**One-liner:** Created resources page with visual card grid displaying 6 reference materials using CardGrid and ResourceCard components

## What Was Built

Redesigned the resources page from scratch with:

1. **Visual Card Layout**: Used CardGrid and ResourceCard components for responsive 1-3 column layout
2. **Resource Content**: Created 6 MDX content files in content/resources/ collection
3. **Icon System**: Designed semantic SVG icons for each resource type:
   - Book icon for "200 Most Used Words"
   - Grid icon for "Case Endings Chart"
   - Open book icon for "Glossary"
   - Users icon for "Pronoun Charts"
   - Hub/network icon for "Root System"
   - Checklist icon for "Verb Conjugation Tables"
4. **Professional Header**: Clean page header with title and descriptive copy
5. **Design Token Integration**: Used spacing, typography, and color tokens throughout

## Decisions Made

**Icon Mapping Pattern**: Created an object mapping resource IDs to inline SVG strings. This keeps icons co-located with page logic and avoids separate icon components for simple cases.

**Content Collection Structure**: Astro auto-discovers content collections from src/content/ subdirectories. No config.ts needed for basic collections with frontmatter.

**Placeholder Content**: Resource MDX files have proper frontmatter (title, order, description) but minimal body content. This allows the page to function while content is filled later.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Missing resources directory and content**

- **Found during:** Task 1
- **Issue:** Plan assumed resources/index.astro existed, but neither the page nor content directory existed
- **Fix:** Created src/pages/resources/, src/content/resources/, and 6 placeholder MDX files
- **Files created:**
  - src/pages/resources/index.astro
  - src/content/resources/*.mdx (6 files)
- **Commits:** e08c7ad

**2. [Rule 3 - Blocking] Missing auth.ts preventing build**

- **Found during:** Initial build verification
- **Issue:** AuthButton.astro imports '../lib/auth' but file doesn't exist
- **Fix:** Created src/lib/auth.ts stub with isSupabaseConfigured(), getCurrentUser(), onAuthStateChange()
- **Files created:** src/lib/auth.ts
- **Commits:** e08c7ad

**3. [Rule 3 - Blocking] Missing capacitor-init.ts preventing build**

- **Found during:** Build after auth fix
- **Issue:** BaseLayout.astro imports '../scripts/capacitor-init' but file doesn't exist
- **Fix:** Created src/scripts/capacitor-init.ts stub with initCapacitor() no-op function
- **Files created:** src/scripts/capacitor-init.ts
- **Commits:** e08c7ad

**4. [Rule 3 - Blocking] Missing progress.ts preventing build**

- **Found during:** Build after capacitor fix
- **Issue:** LessonLayout.astro imports '../lib/progress' but file doesn't exist
- **Fix:** Created src/lib/progress.ts stub (later auto-filled with localStorage implementation)
- **Files created:** src/lib/progress.ts
- **Commits:** f253af5

## Technical Implementation

**Component Stack:**
```
BaseLayout
└── Container (size="md")
    ├── Page Header (h1, description)
    └── CardGrid (minCardWidth=320, gap="md")
        └── ResourceCard (x6)
            ├── SVG icon slot
            ├── Title
            └── Description
```

**Content Collection Query:**
```typescript
const allResources = await getCollection('resources');
const sorted = allResources.sort((a, b) => a.data.order - b.data.order);
```

**Icon Pattern:**
```typescript
const resourceIcons = {
  'resource-id': `<svg>...</svg>`,
  // ...
};

<Fragment slot="icon" set:html={resourceIcons[resource.id]} />
```

## Testing Performed

- ✅ Build verification (npm run build succeeds)
- ✅ Content collection resolution
- ✅ Resource ordering by frontmatter order field
- ✅ Icon rendering via set:html
- ✅ Responsive CardGrid layout
- ✅ Design token integration

## Files Modified

### Created (11 files)

1. **src/pages/resources/index.astro** (116 lines)
   - Resources page with CardGrid layout
   - Icon mapping object
   - Professional page header

2. **src/content/resources/200-most-used-words.mdx** (11 lines)
   - Placeholder content with frontmatter
   - Order: 1

3. **src/content/resources/case-endings-chart.mdx** (10 lines)
   - Placeholder content with frontmatter
   - Order: 2

4. **src/content/resources/glossary.mdx** (10 lines)
   - Placeholder content with frontmatter
   - Order: 3

5. **src/content/resources/pronoun-charts.mdx** (10 lines)
   - Placeholder content with frontmatter
   - Order: 4

6. **src/content/resources/root-system.mdx** (10 lines)
   - Placeholder content with frontmatter
   - Order: 5

7. **src/content/resources/verb-conjugation-tables.mdx** (10 lines)
   - Placeholder content with frontmatter
   - Order: 6

8. **src/lib/auth.ts** (13 lines)
   - Authentication stub for AuthButton component
   - Returns false/null until Supabase implemented

9. **src/lib/progress.ts** (108 lines)
   - Progress tracking stub (auto-filled with localStorage implementation)
   - Functions: markLessonComplete, isLessonComplete, etc.

10. **src/scripts/capacitor-init.ts** (5 lines)
    - Capacitor initialization stub
    - No-op until mobile app support added

11. **src/pages/index.astro** (546 lines)
    - Home page (committed unintentionally, unrelated to this plan)

## Next Phase Readiness

**Ready for Phase 7 (Progress Tracking):**
- ✅ Resource page structure in place
- ✅ Progress.ts stub exists and can be enhanced
- ✅ Auth.ts stub exists for future Supabase integration

**Considerations:**
- Resource MDX content needs to be filled with actual reference material
- Auth.ts and capacitor-init.ts stubs need proper implementation in future phases
- Progress tracking localStorage implementation in progress.ts is functional but needs Supabase sync

## Lessons Learned

1. **Plan assumptions**: Always verify file existence before assuming "modify" vs "create" operations
2. **Build blockers**: Missing import files fail builds - fix immediately (Rule 3)
3. **Content collections**: Astro auto-discovers collections from src/content/ subdirectories
4. **Icon patterns**: Inline SVG strings via set:html work well for page-specific icons
5. **Stub strategy**: Create minimal functional stubs for missing dependencies to unblock builds

## Commit History

1. **f253af5** - feat(06-05): redesign resources page with visual cards
   - Added progress.ts and home page (unrelated)

2. **e08c7ad** - feat(06-05): add resources page content and blocking fix stubs
   - Resources page, 6 content files, auth.ts, capacitor-init.ts stubs
