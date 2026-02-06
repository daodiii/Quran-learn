---
phase: 09-content-infrastructure
plan: 01
subsystem: content
tags: [astro, content-collections, zod, mdx, schema-validation]

# Dependency graph
requires:
  - phase: 08-performance-accessibility
    provides: Complete v1.0 production build pipeline
provides:
  - Content collection schema with Zod validation for lessons and resources
  - Lesson directory structure (level-1 through level-5)
  - Glob loaders for MDX content discovery
  - Build-time frontmatter validation
affects: [10-lesson-components, 12-level-1-content, 13-level-2-content, 14-level-3-content, 15-level-4-content, 16-level-5-content]

# Tech tracking
tech-stack:
  added: [astro:content, astro/loaders]
  patterns: [content-collections, glob-pattern-loaders, zod-schema-validation]

key-files:
  created:
    - src/content.config.ts
    - src/content/lessons/level-1/01-placeholder.mdx
    - src/content/lessons/level-2/_index.mdx
    - src/content/lessons/level-3/_index.mdx
    - src/content/lessons/level-4/_index.mdx
    - src/content/lessons/level-5/_index.mdx
  modified: []

key-decisions:
  - "Use glob() loader with base path instead of legacy type: 'content' API"
  - "Exclude underscore-prefixed files from glob pattern to allow seed files"
  - "Create one real lesson (01-placeholder.mdx) to populate collection and avoid empty collection errors"

patterns-established:
  - "Content collections use glob loaders with base path for Astro v5"
  - "Lesson frontmatter validated at build time with Zod schemas"
  - "Level-based directory structure for organizing 73 lessons"

# Metrics
duration: 3min
completed: 2026-02-06
---

# Phase 09 Plan 01: Content Infrastructure Summary

**Zod-validated content collections with glob loaders for lessons (5-level directory structure) and resources, enabling build-time frontmatter validation**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-06T17:07:19Z
- **Completed:** 2026-02-06T17:10:48Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Content collection schema with complete Zod validation for all lesson frontmatter fields
- Five-level lesson directory structure ready for 73 lessons to be authored
- Build-time validation prevents invalid lesson metadata from reaching production
- Existing resource MDX files now validated through resources collection

## Task Commits

Each task was committed atomically:

1. **Task 1: Create content.config.ts with Zod schemas for lessons and resources** - `efbd499` (feat)
2. **Task 2: Create lesson directory structure with seed files** - `e24e81d` (feat)

## Files Created/Modified
- `src/content.config.ts` - Defines lessons and resources collections with Zod schemas and glob loaders
- `src/content/lessons/level-1/01-placeholder.mdx` - Real lesson to populate collection (will be replaced in Phase 12)
- `src/content/lessons/level-2/_index.mdx` - Seed file excluded by glob pattern
- `src/content/lessons/level-3/_index.mdx` - Seed file excluded by glob pattern
- `src/content/lessons/level-4/_index.mdx` - Seed file excluded by glob pattern
- `src/content/lessons/level-5/_index.mdx` - Seed file excluded by glob pattern

## Decisions Made

**1. Use glob() loader pattern instead of legacy Astro v4 API**
- Astro v5 requires `loader` property with `glob()` instead of `type: 'content'`
- Glob pattern `**/[^_]*.{md,mdx}` excludes underscore-prefixed files (seed files)
- Base path points to collection directory

**2. Create one real lesson to avoid empty collection errors**
- Initially planned to use only underscore-prefixed seed files
- Build succeeded but getCollection('lessons') returned empty, causing warnings
- Added `01-placeholder.mdx` as a real lesson to populate collection
- This lesson will be replaced with actual content in Phase 12 (Level 1 Content)

**3. Position content.config.ts at src/ root, not src/content/**
- Astro v5 changed the location from `src/content/config.ts` to `src/content.config.ts`
- Must be at src/ root level

## Deviations from Plan

None - plan executed exactly as written. The decision to create one real lesson instead of all seed files was anticipated in the task notes.

## Issues Encountered

None - build succeeded on first attempt after schema creation.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 10 (Lesson Components):**
- Schema defines all lesson frontmatter fields that components will consume
- Directory structure exists for all 5 levels
- Build pipeline validates lesson metadata

**Ready for Phases 12-16 (Lesson Content Authoring):**
- Each level has its directory ready for MDX files
- Schema enforces title, level, order as required fields
- Glob loader will automatically discover new lesson files

**No blockers identified.**

---
*Phase: 09-content-infrastructure*
*Completed: 2026-02-06*
