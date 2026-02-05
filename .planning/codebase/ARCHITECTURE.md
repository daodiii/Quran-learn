# Architecture

**Analysis Date:** 2026-02-05

## Pattern Overview

**Overall:** Static Site Generation with Content Collections and Client-Side Interactivity

**Key Characteristics:**
- Astro-based static site builder with MDX content integration
- Component-driven UI with Astro components (no framework overhead for most pages)
- Content-driven curriculum structured in collections (lessons, surahs, resources)
- Client-side quiz interactivity with state management
- Optional Supabase backend for user authentication and progress tracking
- Mobile-first responsive design with Tailwind CSS
- Dark mode support via CSS variables and client-side theme toggle

## Layers

**Content Layer:**
- Purpose: Define and organize educational curriculum as structured data
- Location: `src/content/` (lessons, surahs, resources)
- Contains: MDX files with frontmatter metadata (title, level, order, description, etc.)
- Depends on: Astro Content Collections API
- Used by: Pages in `src/pages/learn/`, `src/pages/surahs/`, `src/pages/resources/`

**Data Layer:**
- Purpose: Provide quiz questions and reference data
- Location: `src/data/quizzes/` (JSON quiz definitions), `src/data/morphology/` (morphological reference)
- Contains: Static JSON files with quiz questions, explanations, and metadata
- Depends on: File system (no database in development)
- Used by: Quiz component and related pages

**Service Layer:**
- Purpose: Handle authentication, data persistence, and state synchronization
- Location: `src/lib/`
- Key Files:
  - `src/lib/supabase.ts`: Initialize Supabase client, handle credential loading
  - `src/lib/auth.ts`: Auth operations (signUp, signIn, signOut, OAuth with Google)
  - `src/lib/progress.ts`: User progress tracking (lesson completion, quiz scores)
- Depends on: Supabase JS client, environment variables
- Used by: Pages requiring authentication, Quiz component, progress tracking

**Presentation Layer:**
- Purpose: Render UI and manage user interactions
- Location: `src/components/` and `src/layouts/`
- Key Components:
  - `src/layouts/BaseLayout.astro`: Global layout, theme toggle, meta tags
  - `src/layouts/LessonLayout.astro`: Lesson page template
  - `src/layouts/QuizLayout.astro`: Quiz page template
  - `src/layouts/SurahLayout.astro`: Surah breakdown template
  - `src/components/Header.astro`: Navigation, auth button, theme toggle
  - `src/components/Footer.astro`: Footer with links and branding
  - `src/components/Quiz.astro`: Interactive quiz with start/question/results screens
  - `src/components/AuthButton.astro`: Login/signup/logout button
  - `src/components/Sidebar.astro`: Navigation sidebar
- Depends on: Services, layouts, styles
- Used by: Pages to render content

**Routing Layer:**
- Purpose: Define page routes and handle dynamic routing
- Location: `src/pages/`
- File-based routing patterns:
  - Static pages: `index.astro`, `about.astro`, `profile.astro`
  - Dynamic lesson routes: `/learn/[level]/[slug].astro`
  - Dynamic surah routes: `/surahs/[slug].astro`
  - Quiz routes: `/learn/level-[N]/quiz.astro`
- Depends on: Astro file-based routing, Content Collections
- Used by: Browser navigation

**Styling Layer:**
- Purpose: Define design system, theme variables, and responsive design
- Location: `src/styles/global.css`
- Contains: CSS custom properties (design tokens), Tailwind directives, component styles
- Design System Elements:
  - Color palette: primary (teal), secondary (deep blue), gold, coral, sage, purple
  - Typography: Arabic font support, responsive font scaling
  - Spacing system (xs-3xl), shadows, border radius
  - Dark mode overrides
  - Level-specific colors (level-1 through level-5)
- Depends on: Tailwind CSS, CSS custom properties
- Used by: All components

## Data Flow

**Lesson Learning Flow:**

1. User navigates to `/learn/level-[N]/[lesson-slug]/`
2. Astro page loader retrieves lesson from content collection via `getCollection('lessons')`
3. Lesson metadata (title, level, order, description) extracted from frontmatter
4. MDX content rendered as HTML with layout wrapping
5. Client-side JavaScript (in BaseLayout) initializes theme, keyboard shortcuts, expandable sections
6. User completes lesson, clicks "Mark as Complete" (if authenticated)
7. Progress update sent to Supabase via `markLessonComplete()` in `src/lib/progress.ts`

**Quiz Flow:**

1. User navigates to `/learn/level-[N]/quiz/`
2. Page loads JSON from `src/data/quizzes/level-[N].json`
3. Quiz component receives questions via props, stores in data attributes
4. Client-side script initializes quiz state
5. User sees start screen with quiz info
6. Clicking "Start Quiz" triggers:
   - Fisher-Yates shuffle to randomize questions
   - Select first 10 questions from pool
   - Display question screen
7. User selects answer:
   - Highlight correct/incorrect options
   - Show explanation
   - Increment score
   - Enable "Next" button
8. User completes all questions:
   - Calculate pass/fail (80% threshold)
   - If authenticated, save score to Supabase via `saveQuizScore()`
   - Display results with score, message, and retake option
   - If passed and next level exists, show "Continue to Next Level" button

**Authentication Flow:**

1. User clicks AuthButton in header
2. Not authenticated: redirect to `/login` or `/signup`
3. Page shows form with email/password or Google OAuth button
4. On submit, call `signUp()` or `signIn()` from `src/lib/auth.ts`
5. Supabase returns auth token and user object
6. Auth state persists via Supabase session
7. `onAuthStateChange()` listener detects user login and triggers UI updates
8. User navigates to profile or quiz pages
9. Protected actions check `getCurrentUser()` to verify authentication

**State Management:**

- **Client-side UI state**: Theme (light/dark), expandable sections state - stored in localStorage and DOM
- **Authentication state**: Managed by Supabase auth module, accessible via `getCurrentUser()`
- **User progress**: Stored in Supabase tables (`user_progress`, `quiz_scores`)
- **Lesson/Quiz data**: Baked into HTML at build time (static generation), loaded dynamically in browser via JSON for quizzes

## Key Abstractions

**Content Collections:**
- Purpose: Treat lessons, surahs, and resources as structured, queryable data
- Examples: `src/content/lessons/level-1/01-arabic-alphabet.mdx`, `src/content/surahs/001-al-fatiha.mdx`
- Pattern: Zod schema validation + glob loader pattern. Each collection has schema defining required fields (title, level, order, description, etc.)
- Usage: `getCollection('lessons')` returns typed entries that can be filtered, sorted, and rendered

**Utility Functions:**
- Purpose: Encapsulate business logic for auth, progress tracking, and quiz operations
- Examples:
  - `signUp()`, `signIn()`, `signOut()` in `src/lib/auth.ts` - wraps Supabase auth API
  - `markLessonComplete()`, `getCompletedLessons()` in `src/lib/progress.ts` - handles user progress updates
  - `saveQuizScore()`, `getBestQuizScoreByLevel()` - tracks quiz performance
- Pattern: Async functions that check Supabase configuration before executing, return null or empty array if unconfigured

**Layout Abstraction:**
- Purpose: Reusable page structure with header, footer, and consistent styling
- Examples: `BaseLayout.astro`, `LessonLayout.astro`, `QuizLayout.astro`
- Pattern: Parent layout wraps content via `<slot />`, passes metadata (title, description) to base layout
- Usage: All pages inherit from layouts to maintain consistency

**Theme System:**
- Purpose: Implement light/dark mode and design system tokens
- Abstraction: CSS custom properties for colors, spacing, typography
- Pattern: `:root` selector in `src/styles/global.css` defines all tokens; `[data-theme="dark"]` selector overrides for dark mode
- Usage: Components reference `var(--accent-primary)`, `var(--bg-elevated)` instead of hardcoded colors

## Entry Points

**Web Application:**
- Location: `src/pages/index.astro`
- Triggers: Initial page load at `/`
- Responsibilities: Display hero section, featured surahs, learning levels, features overview. Provides entry point to curriculum and surah explorer.

**Lesson Pages:**
- Location: `src/pages/learn/[...slug].astro`
- Triggers: Navigation to `/learn/level-[N]/[lesson-slug]/`
- Responsibilities: Render lesson content from MDX file, wrap in LessonLayout, handle client-side interactions (expandable sections, progress tracking)

**Quiz Pages:**
- Location: `src/pages/learn/level-[N]/quiz.astro`
- Triggers: Navigation to `/learn/level-[N]/quiz/`
- Responsibilities: Load quiz JSON, mount Quiz component with questions, handle quiz state and scoring

**Surah Pages:**
- Location: `src/pages/surahs/[...slug].astro`
- Triggers: Navigation to `/surahs/[slug]/`
- Responsibilities: Render surah breakdown with word-by-word grammatical analysis

**Authentication Pages:**
- Location: `src/pages/login.astro`, `src/pages/signup.astro`
- Triggers: User clicks login/signup button
- Responsibilities: Display auth forms, call auth functions, redirect on success

**Profile Page:**
- Location: `src/pages/profile.astro`
- Triggers: Authenticated user navigation
- Responsibilities: Display user progress, completed lessons, quiz scores

## Error Handling

**Strategy:** Graceful degradation with optional features

**Patterns:**
- **Supabase Optional**: If `PUBLIC_SUPABASE_URL` or `PUBLIC_SUPABASE_ANON_KEY` env vars missing, `supabase` is set to null. All functions check `if (!supabase) return` before executing, disabling auth and progress tracking but keeping curriculum functional.
- **Failed Queries**: Async functions return empty arrays/null on error instead of throwing. User sees empty state or missing data rather than error page.
- **Auth State**: If user is not authenticated, protected features (mark complete, save score) silently fail without disrupting quiz/lesson experience.
- **Client-Side Errors**: Quiz component uses try-catch pattern to prevent one error from breaking entire quiz. HTML escaping prevents XSS in user-generated content.

## Cross-Cutting Concerns

**Logging:**
- Supabase warns to console if credentials missing: `console.warn('Supabase credentials not found...')`
- Error responses logged silently via `if (error) return []` pattern
- No centralized logger

**Validation:**
- Content collections validated via Zod schemas at build time (`src/content.config.ts`)
- Quiz questions validated by structure (id, question, options array, correctIndex)
- Auth input validated by Supabase SDK

**Authentication:**
- OAuth provider: Google via Supabase (optional)
- Session persistence: Supabase managed via localStorage
- Protected routes: Not enforced at routing level; checks performed in components/functions

**Internationalization (Partial):**
- Arabic text support via `direction: rtl` attributes and Arabic font family
- English-to-Arabic labels for lessons/levels
- Quiz supports both English and Arabic question text (via `questionArabic` field)
- No i18n framework; hardcoded bilingual content

**Responsive Design:**
- Mobile-first Tailwind breakpoints (sm, md, lg)
- CSS Grid for curriculum layout
- Flexbox for component layouts
- Meta viewport tag for mobile rendering
- Skip link for keyboard accessibility in BaseLayout

**Dark Mode:**
- CSS custom properties with `:root` and `[data-theme="dark"]` selectors
- Persisted to localStorage
- System preference detection with `window.matchMedia()`
- Meta theme-color updates for mobile UI

---

*Architecture analysis: 2026-02-05*
