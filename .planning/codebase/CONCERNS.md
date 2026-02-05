# Codebase Concerns

**Analysis Date:** 2026-02-05

## Security Issues

**Exposed Supabase Credentials:**
- Issue: Public Supabase credentials are committed in `.env` file with actual project URL and API key
- Files: `.env` (lines 5-6)
- Impact: Any attacker with access to the repository can access the Supabase backend, read/modify user data, and impersonate users
- Fix approach: Move credentials to environment-only variables, remove `.env` from git, add `.env` to `.gitignore`. Rotate the exposed Supabase keys immediately in the Supabase dashboard.

**Missing Input Validation on Quiz Questions:**
- Issue: Quiz option text is directly rendered into HTML via `innerHTML` in Quiz.astro without sanitization
- Files: `src/components/Quiz.astro` (line 354)
- Impact: If quiz questions are user-provided or can be modified, this allows XSS attacks. Even though currently from MDX content, this is fragile.
- Fix approach: Use `textContent` instead of `innerHTML`, or use a proper HTML sanitization library. The `escapeHtml` function exists but is only used for wrong answers review.

**Missing Password Requirements:**
- Issue: Signup form only enforces minimum 6 character password requirement, no complexity rules
- Files: `src/pages/signup.astro` (lines 42-43, 55-56, 351-353)
- Impact: Users can create weak passwords (e.g., "123456"), reducing account security
- Fix approach: Add password complexity validation (require uppercase, lowercase, numbers, or symbols). Communicate requirements to users before submission.

**Unprotected Profile Routes:**
- Issue: All profile-related endpoints (`/profile/`, quiz scores, lesson progress) are accessible to anyone; only client-side auth check
- Files: `src/pages/profile.astro`, `src/lib/progress.ts`
- Impact: Users can manually change auth state in browser, potentially seeing other users' data if client-side check is bypassed
- Fix approach: Implement server-side route protection with Astro middleware or API routes that verify user identity before returning data.

## Error Handling Gaps

**Silent Failures in Progress Tracking:**
- Issue: Database operations in `progress.ts` return simple boolean/empty array on errors, without logging or user feedback
- Files: `src/lib/progress.ts` (lines 33, 64, 89, 104, 123)
- Impact: When quiz scores or lesson completions fail to save, users don't know and may not realize their progress wasn't recorded
- Fix approach: Add proper error logging to track which operations fail. Return more detailed error information to caller. Show user-facing alerts when progress save fails.

**Auth Error Not Recoverable:**
- Issue: Casting error object to `AuthError` type in `auth.ts` line 11 and 24 without proper structure
- Files: `src/lib/auth.ts` (lines 11, 24)
- Impact: Error object may be malformed, causing issues downstream when code accesses `error.message` or other properties
- Fix approach: Create proper error objects using Supabase's AuthError constructor or custom error class.

**Missing Network Error Handling:**
- Issue: No try-catch blocks in any async database calls in `progress.ts` or `auth.ts`
- Files: `src/lib/progress.ts`, `src/lib/auth.ts`
- Impact: Network timeouts or unexpected errors will cause unhandled promise rejections and crash the app
- Fix approach: Wrap all async database operations in try-catch blocks with proper error handling and user feedback.

**Quiz Results May Not Save:**
- Issue: In Quiz.astro, `getCurrentUser()` is awaited in `showResults()` but result is never checked before `saveQuizScore()`
- Files: `src/components/Quiz.astro` (lines 305-308)
- Impact: If user is null, quiz score still attempts to save and fails silently, progress is lost
- Fix approach: Check that user exists before attempting save, show error message if quiz results couldn't be saved.

## Performance Concerns

**No Pagination for Quiz Scores:**
- Issue: Profile page loads all quiz scores with no limit, then slices to 5 for display
- Files: `src/pages/profile.astro` (line 608)
- Impact: For users with hundreds of quiz attempts, memory usage and data transfer are unnecessarily high
- Fix approach: Implement pagination at the database query level using LIMIT and OFFSET.

**No Lazy Loading for Large Content Lists:**
- Issue: Level progress and quiz scores are rendered directly without virtual scrolling or lazy loading
- Files: `src/pages/profile.astro` (lines 580-627)
- Impact: If user has very long list of quiz attempts, DOM becomes large and rendering becomes slow
- Fix approach: Implement intersection observer or virtual scrolling for long lists.

**Repeated Full Shuffle on Quiz Retake:**
- Issue: Fisher-Yates shuffle algorithm runs every quiz start without memoization
- Files: `src/components/Quiz.astro` (lines 172-180)
- Impact: Minor - acceptable for small question pools, but inefficient for large pools. Not a bottleneck currently.
- Fix approach: Keep shuffled questions in memory across retakes to improve perceived performance.

## Data Consistency Issues

**No Lesson Completion Validation:**
- Issue: Lesson completion is marked by slug match regex, but there's no validation that lesson actually exists
- Files: `src/pages/profile.astro` (lines 569-577)
- Impact: If lesson slugs are inconsistent between content and progress tracking, completion counts may be wrong
- Fix approach: Maintain canonical lesson slug list in shared config, validate against it.

**Quiz Score Belongs to Wrong Level:**
- Issue: Quiz score is saved by level number, but no validation that user is actually on that level
- Files: `src/components/Quiz.astro` (line 307), `src/lib/progress.ts` (lines 68-73)
- Impact: User could POST to quiz endpoint with arbitrary level number, claiming completion of levels they haven't reached
- Fix approach: Validate that user has completed previous level before allowing quiz submission.

**No Duplicate Quiz Attempt Prevention:**
- Issue: User can submit quiz form multiple times rapidly, creating duplicate score records
- Files: `src/components/Quiz.astro` (lines 299-308)
- Impact: Database stores duplicate records for single quiz attempt, skewing analytics and user progress
- Fix approach: Add debouncing or one-time use flag to prevent double-submission.

## Fragile Areas

**Supabase Configuration Optional:**
- Issue: Entire auth system is optional - if Supabase not configured, app silently degraded instead of loudly failing
- Files: `src/lib/supabase.ts`, `src/lib/auth.ts`, multiple page files
- Impact: In production, if env vars aren't set, users might not realize auth isn't working. Silent degradation is dangerous.
- Fix approach: In production, throw error if Supabase not configured. Only allow graceful degradation in development.

**Hard-Coded Lesson Counts:**
- Issue: TOTAL_LESSONS_PER_LEVEL object is duplicated in JavaScript across components
- Files: `src/pages/profile.astro` (lines 507-513)
- Impact: If lesson counts change, multiple files must be updated. Easy to miss one and cause data consistency issues.
- Fix approach: Extract to shared configuration file, import and reuse everywhere.

**Manual Regex Parsing of Slugs:**
- Issue: Lesson level extraction uses fragile regex match on slug names
- Files: `src/pages/profile.astro` (line 570)
- Impact: If slug naming convention changes, progress by level calculation breaks
- Fix approach: Store level as structured data in database rather than parsing from slug.

**Type Casting Bypasses Type Safety:**
- Issue: `as AuthError` and `as HTMLElement` casts used without validation
- Files: `src/lib/auth.ts` (lines 11, 24), `src/components/Quiz.astro` (line 169), multiple Astro files
- Impact: Runtime errors if assumptions about types are wrong; TypeScript safety is bypassed
- Fix approach: Avoid type casting; use proper type guards or adjust code flow to satisfy TypeScript.

## Testing Coverage Gaps

**No Error Case Testing:**
- Issue: Error handling code exists but likely untested - no test files present
- Files: All TypeScript/auth files
- Impact: Error paths may not work as expected when actually triggered
- Fix approach: Add test suite with mocked Supabase client and test all error scenarios (network errors, auth failures, database errors).

**No Integration Tests:**
- Issue: Quiz flow is complex with many sequential steps; no tests verify complete flow works
- Files: `src/components/Quiz.astro`
- Impact: Breaking changes in quiz flow may not be caught until user reports them
- Fix approach: Add E2E tests with Playwright or Cypress testing complete quiz workflow.

**No Performance Tests:**
- Issue: No benchmarks for page load times or rendering performance
- Files: All page files
- Impact: Performance regressions may go unnoticed
- Fix approach: Add Lighthouse CI or similar performance monitoring.

## Missing Critical Features

**No Rate Limiting:**
- Issue: No rate limiting on auth endpoints (sign up, sign in, quiz submission)
- Files: `src/pages/login.astro`, `src/pages/signup.astro`, `src/components/Quiz.astro`
- Impact: Vulnerable to brute force attacks and bot spam
- Fix approach: Implement rate limiting in Supabase or with middleware.

**No User Feedback for Long Operations:**
- Issue: Quiz score save is awaited but no loading state shown to user
- Files: `src/components/Quiz.astro` (lines 305-308)
- Impact: User might think nothing happened during slow network requests
- Fix approach: Show "saving progress..." message while score is being saved.

**No Offline Support:**
- Issue: App requires constant internet connection; no offline caching
- Files: Entire app
- Impact: Quiz results lost if network disconnects during submission
- Fix approach: Consider service worker with offline queue for critical operations.

**No Mobile Navigation Drawer Close on Route Change:**
- Issue: Mobile sidebar may remain open when navigating between pages
- Files: `src/components/Sidebar.astro`
- Impact: Poor mobile UX - sidebar blocks content after navigation
- Fix approach: Add route change detection to auto-close sidebar on navigation.

## Dependencies at Risk

**Supabase Client Library:**
- Risk: Single point of failure for entire backend. Heavily depends on Supabase service availability.
- Current version: `@supabase/supabase-js@^2.94.0` (recent, maintained)
- Impact: If Supabase service goes down or deprecates API, entire app is broken
- Mitigation: Already exposed credentials, so dependency is critical risk anyway. Consider multi-region replication or backup auth provider.

**Capacitor Mobile Framework:**
- Risk: Used but not deeply integrated yet; unclear if mobile features are tested
- Current version: `@capacitor/core@^8.0.2`
- Impact: Mobile builds may fail or have platform-specific issues not caught in web development
- Mitigation: Test mobile builds regularly, especially after dependency updates.

**No DevDependencies for Testing:**
- Risk: No testing framework installed (no Jest, Vitest, Playwright, etc.)
- Impact: Difficult to add tests without setting up infrastructure
- Mitigation: Add testing framework and tools early.

## Scaling Limits

**Single Supabase Project:**
- Current capacity: Whatever free tier or paid plan is configured
- Limit: If app gains users, may hit database connections or query rate limits
- Scaling path: Implement connection pooling, optimize queries, potentially move to higher Supabase tier or self-hosted database

**No Caching Layer:**
- Current capacity: Every page load hits database
- Limit: High concurrent user load will overload database
- Scaling path: Add Redis caching for lesson content and user progress, implement ISR or revalidation strategy

**Content as MDX Files:**
- Current capacity: Works fine up to ~100 lessons
- Limit: At 1000+ lessons, file system traversal and compilation becomes slow
- Scaling path: Migrate lessons to database for better query performance and pagination

## Recommendations Priority

**HIGH (Critical for Production):**
1. Remove exposed Supabase credentials immediately and rotate keys
2. Add server-side auth protection for protected routes
3. Add try-catch error handling for all database operations
4. Add user feedback for failed operations
5. Implement input validation/sanitization for quiz content

**MEDIUM (Should Fix Soon):**
1. Add rate limiting on auth and submission endpoints
2. Add proper error logging and monitoring
3. Implement duplicate submission prevention
4. Add test framework and basic test coverage
5. Document hard-coded constants and move to config

**LOW (Nice to Have):**
1. Add pagination for quiz scores
2. Implement performance optimizations
3. Add offline support
4. Improve mobile navigation UX
5. Add E2E tests for critical flows

---

*Concerns audit: 2026-02-05*
