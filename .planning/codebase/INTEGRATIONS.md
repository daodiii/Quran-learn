# External Integrations

**Analysis Date:** 2026-02-05

## APIs & External Services

**Backend as a Service:**
- Supabase - Complete backend platform for auth, database, and real-time features
  - SDK/Client: `@supabase/supabase-js` 2.94.0
  - Auth: Public key (`PUBLIC_SUPABASE_ANON_KEY`)
  - URL: `PUBLIC_SUPABASE_URL` (e.g., `https://vuteywffdogpgutfbaht.supabase.co`)

## Data Storage

**Databases:**
- Supabase PostgreSQL Database
  - Connection: Via `@supabase/supabase-js` client using env variables
  - Client: Supabase JS SDK
  - Tables accessed:
    - `user_progress` - Stores completed lessons per user (upserted with conflict handling)
    - `quiz_scores` - Stores user quiz results with scores and pass/fail status
  - Authentication: Session-based via Supabase auth

**File Storage:**
- Local filesystem only (static assets in `public/` directory)
- No cloud file storage detected

**Caching:**
- None detected (client-side caching via browser)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (built on PostgreSQL with pgBouncer)
  - Implementation: Email/password and Google OAuth
  - Files: `src/lib/auth.ts` - All auth functions

**Auth Methods:**
1. Email/Password signup: `signUp(email, password)`
2. Email/Password login: `signIn(email, password)`
3. Google OAuth: `signInWithGoogle()` with redirect to `/profile/`
4. Logout: `signOut()`
5. Session monitoring: `onAuthStateChange(callback)` for real-time auth state updates

**Session State:**
- Supabase auto-manages sessions with tokens
- Current user fetched via: `supabase.auth.getUser()`
- Auth state subscribed at component level in `src/components/AuthButton.astro`

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, LogRocket, etc.)

**Logs:**
- Console logging only via `console.warn()` in `src/lib/supabase.ts`
- Warning when Supabase credentials missing for development/testing

**Health Checks:**
- `isSupabaseConfigured()` helper function checks if Supabase client is initialized

## CI/CD & Deployment

**Hosting:**
- Not specified (typical: Netlify, Vercel, AWS S3, or other static hosting)
- Build output: `dist/` directory (Astro static build)

**CI Pipeline:**
- None detected in codebase

**Mobile Distribution:**
- Native builds via Capacitor + xcodebuild/Gradle
- Package ID: `com.quranlearn.app`
- App name: `Quran Learn`
- Distribution via Apple App Store and Google Play Store (configured but not detailed)

## Environment Configuration

**Required env vars:**
- `PUBLIC_SUPABASE_URL` - Supabase project URL (public, exposed to browser)
- `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public, exposed to browser)

**Optional vars:**
- None detected

**Secrets location:**
- `.env` file (local development only, NOT committed)
- `.env.example` provides template
- Secrets must be added to hosting provider's secret management

**Current Status:**
- Example in `.env.example`: Template shows proper format
- Actual `.env` file contains real credentials (for local development only)

## Webhooks & Callbacks

**Incoming:**
- Google OAuth redirect: Returns to `${window.location.origin}/profile/` after login
- Supabase auth state changes trigger local callbacks

**Outgoing:**
- None detected

## Data Flow

**User Progress Tracking:**
1. User completes lesson → `markLessonComplete(lessonSlug)` called
2. Data sent to `user_progress` table with upsert (handles duplicates)
3. User can query progress via `getCompletedLessons()` or `isLessonComplete(slug)`
4. Real-time updates via Supabase subscriptions (not currently implemented)

**Quiz Scoring:**
1. Quiz submitted → `saveQuizScore(level, score, totalQuestions, passed)` called
2. Inserted into `quiz_scores` table with user_id and timestamp
3. Query results via:
   - `getQuizScores()` - All scores for user (newest first)
   - `getBestQuizScoreByLevel(level)` - Best score for specific level

**Authentication Flow:**
1. User signs up/logs in via Supabase auth
2. Session stored in browser localStorage (managed by Supabase SDK)
3. `onAuthStateChange()` listens for session changes and updates UI
4. Protected routes check `getCurrentUser()` before allowing access
5. `isSupabaseConfigured()` gracefully degrades when credentials missing

---

*Integration audit: 2026-02-05*
