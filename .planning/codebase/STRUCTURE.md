# Codebase Structure

**Analysis Date:** 2026-02-05

## Directory Layout

```
quran-learn/
├── public/                    # Static assets (images, favicon)
├── src/
│   ├── components/            # Reusable Astro components
│   │   ├── AuthButton.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Quiz.astro
│   │   └── Sidebar.astro
│   ├── content/              # Content collections (MDX files)
│   │   ├── lessons/          # Grammar lesson content by level
│   │   │   ├── level-1/      # 11 lessons: alphabet, vowels, basics
│   │   │   ├── level-2/      # 11 lessons: core grammar, I'rab
│   │   │   ├── level-3/      # 18 lessons: verb forms, conjugations
│   │   │   ├── level-4/      # 17 lessons: advanced grammar
│   │   │   └── level-5/      # 5 lessons: applied Quranic study
│   │   ├── resources/        # Reference materials (glossary, charts)
│   │   └── surahs/           # Surah breakdowns with grammatical analysis
│   ├── data/                 # Static data files (JSON)
│   │   ├── quizzes/          # Quiz questions by level (level-1.json through level-5.json)
│   │   └── morphology/       # Morphological reference data (unused in current code)
│   ├── layouts/              # Page layout components
│   │   ├── BaseLayout.astro  # Global layout with header, footer, theme
│   │   ├── LessonLayout.astro
│   │   ├── QuizLayout.astro
│   │   └── SurahLayout.astro
│   ├── lib/                  # Business logic and utilities
│   │   ├── auth.ts           # Authentication functions (signUp, signIn, signOut, OAuth)
│   │   ├── progress.ts       # User progress tracking (lesson completion, quiz scores)
│   │   └── supabase.ts       # Supabase client initialization
│   ├── pages/               # File-based routes
│   │   ├── index.astro      # Home page
│   │   ├── about.astro
│   │   ├── profile.astro    # User profile (authenticated)
│   │   ├── login.astro
│   │   ├── signup.astro
│   │   ├── learn/
│   │   │   ├── index.astro  # Curriculum overview
│   │   │   ├── level-[1-5]/
│   │   │   │   └── quiz.astro
│   │   │   └── [...slug].astro # Dynamic lesson pages
│   │   ├── surahs/
│   │   │   ├── index.astro  # All surahs index
│   │   │   └── [...slug].astro # Dynamic surah pages
│   │   └── resources/
│   │       ├── index.astro  # Resources overview
│   │       └── [...slug].astro # Dynamic resource pages
│   ├── scripts/             # Client-side initialization scripts
│   │   └── capacitor-init.ts # Mobile app Capacitor initialization
│   ├── styles/              # Global styling
│   │   └── global.css       # Design tokens, Tailwind, theme variables
│   └── content.config.ts    # Astro content collections schema definition
├── android/                 # Capacitor Android app
├── ios/                     # Capacitor iOS app
├── dist/                    # Build output (generated)
├── .astro/                  # Astro build cache
├── .env                     # Environment variables (local)
├── .env.example            # Environment template
├── .gitignore
├── astro.config.mjs        # Astro configuration
├── capacitor.config.ts     # Capacitor mobile app configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # NPM dependencies and scripts
└── README.md
```

## Directory Purposes

**src/components/**
- Purpose: Reusable Astro components for UI elements
- Contains: `.astro` component files
- Key files:
  - `AuthButton.astro`: Login/signup/logout button with state detection
  - `Header.astro`: Navigation, theme toggle, auth button
  - `Footer.astro`: Footer with links and branding
  - `Quiz.astro`: Interactive quiz interface with 3 screens (start/question/results)
  - `Sidebar.astro`: Lesson navigation sidebar

**src/content/lessons/level-[1-5]/**
- Purpose: Store grammar curriculum organized by learning level
- Contains: MDX files with lesson content and metadata
- Frontmatter fields: title, titleArabic, level, order, description, nextLesson, prevLesson
- Content: HTML + Arabic text with examples
- Usage: Dynamically rendered by `/learn/[...slug].astro`, indexed by `/learn/index.astro`

**src/content/surahs/**
- Purpose: Store Quranic surah breakdowns with grammatical analysis
- Contains: MDX files, one per surah
- Frontmatter fields: name, nameArabic, surahNumber, verseCount, revelation, difficulty, grammarTopics
- Content: Verse-by-verse analysis with word morphology and grammar notes
- Difficulty levels: beginner, intermediate, advanced

**src/content/resources/**
- Purpose: Reference materials and supporting documentation
- Contains: MDX files (glossary.mdx, case-endings-chart.mdx, verb-conjugation-tables.mdx, etc.)
- Frontmatter fields: title, order, description
- Usage: Static reference pages at `/resources/[slug]/`

**src/data/quizzes/**
- Purpose: Quiz question pools for each learning level
- Contains: JSON files (level-1.json through level-5.json)
- Structure: Object with level, title, passingScore (8/10), totalQuestions (10), questions array
- Each question: id, question, questionArabic?, options[], correctIndex, explanation
- Usage: Loaded by quiz pages, questions shuffled and selected at runtime

**src/layouts/BaseLayout.astro**
- Purpose: Global page wrapper with header, footer, theme toggle, meta tags
- Provides: HTML structure, theme initialization script, Capacitor init
- Used by: All pages inherit from this or specialized layouts
- Styles: Imports `src/styles/global.css`

**src/lib/supabase.ts**
- Purpose: Initialize and export Supabase client
- Exports: `supabase` (client instance or null), `isSupabaseConfigured()`
- Env vars: PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY
- Logs warning to console if credentials missing

**src/lib/auth.ts**
- Purpose: Authentication API wrapper
- Exports: `signUp()`, `signIn()`, `signInWithGoogle()`, `signOut()`, `getCurrentUser()`, `onAuthStateChange()`
- Returns: AuthResult objects with user and error fields
- Gracefully handles missing Supabase configuration

**src/lib/progress.ts**
- Purpose: Track user learning progress
- Exports: `markLessonComplete()`, `isLessonComplete()`, `getCompletedLessons()`, `saveQuizScore()`, `getQuizScores()`, `getBestQuizScoreByLevel()`
- Tables: user_progress (lesson_slug, completed_at), quiz_scores (level, score, total_questions, passed, completed_at)
- Checks user authentication before accessing protected data

**src/styles/global.css**
- Purpose: Design system and global styling
- Contains: CSS custom properties (colors, spacing, shadows, fonts), Tailwind directives, dark mode rules
- Design tokens:
  - Colors: 6 accent colors (primary, secondary, gold, coral, sage, purple) with light variants
  - Level colors: 5 color schemes for difficulty levels
  - Spacing: 8 scale (xs-3xl)
  - Shadows: 5 levels (xs-xl)
  - Fonts: Arabic font family variable, monospace for code

## Key File Locations

**Entry Points:**
- `src/pages/index.astro`: Home page with hero, levels, featured surahs, features
- `src/layouts/BaseLayout.astro`: Global layout wrapper for all pages

**Configuration:**
- `astro.config.mjs`: Astro project config (trailingSlash, Tailwind integration, MDX)
- `tsconfig.json`: Extends astro/tsconfigs/strict
- `capacitor.config.ts`: Mobile app configuration
- `src/content.config.ts`: Content collection schemas (lessons, surahs, resources)

**Core Logic:**
- `src/lib/auth.ts`: Authentication operations
- `src/lib/progress.ts`: User progress and quiz score tracking
- `src/lib/supabase.ts`: Supabase client initialization
- `src/components/Quiz.astro`: Interactive quiz with client-side state machine

**Testing:**
- No test files present in codebase

## Naming Conventions

**Files:**
- Astro components: PascalCase + `.astro` (e.g., `AuthButton.astro`, `BaseLayout.astro`)
- TypeScript files: camelCase + `.ts` (e.g., `supabase.ts`, `auth.ts`)
- MDX content: kebab-case + `.mdx` (e.g., `01-arabic-alphabet.mdx`, `level-1-quiz.mdx`)
- JSON data: kebab-case + `.json` (e.g., `level-1.json`)
- Pages/routes: kebab-case for segments, brackets for dynamic routes (e.g., `[...slug].astro`)

**Directories:**
- Feature directories: kebab-case (e.g., `level-1`, `quiz-scores`)
- Type directories: lowercase plural (e.g., `components`, `layouts`, `pages`, `content`)

**Variables & Functions:**
- Functions: camelCase (e.g., `markLessonComplete()`, `getCurrentUser()`)
- Interface names: PascalCase (e.g., `AuthResult`, `LessonProgress`, `QuizScore`)
- Constants: UPPER_SNAKE_CASE (not prevalent in codebase)
- CSS classes: kebab-case (e.g., `quiz-card`, `lesson-order`, `progress-bar`)

**Routing:**
- Static routes: filename + path (e.g., `/about`, `/profile`, `/login`)
- Dynamic routes: `[slug]` pattern (e.g., `/learn/[...slug]/`, `/surahs/[...slug]/`)
- Nested routes: directory structure matches URL (e.g., `/learn/level-1/quiz.astro` → `/learn/level-1/quiz/`)

## Where to Add New Code

**New Lesson:**
- Implementation: Create MDX file in `src/content/lessons/level-[N]/`
- Naming: `[order]-[slug].mdx` (e.g., `03-irab-introduction.mdx`)
- Frontmatter: Follow schema in `src/content.config.ts` (title, level, order, description, nextLesson, prevLesson)
- Content: Write MDX with HTML, Arabic text, example blocks
- No new route file needed; dynamic routing handles it

**New Surah Breakdown:**
- Implementation: Create MDX file in `src/content/surahs/`
- Naming: `[number]-[slug].mdx` (e.g., `001-al-fatiha.mdx`)
- Frontmatter: name, nameArabic, surahNumber, verseCount, revelation, difficulty, grammarTopics
- Content: Verse-by-verse analysis
- Automatically indexed at `/surahs/index.astro`

**New Quiz Level or Update Questions:**
- Implementation: Edit `src/data/quizzes/level-[N].json`
- Structure: Update `questions` array with new question objects
- Fields: id, question, questionArabic?, options (4 items), correctIndex (0-3), explanation
- Quiz component auto-selects 10 random questions from pool

**New Utility Function:**
- Implementation: Add to appropriate file in `src/lib/`
- Auth logic: `src/lib/auth.ts`
- Progress logic: `src/lib/progress.ts`
- New category: Create new file, export from `src/lib/index.ts` (if it exists)

**New Component:**
- Implementation: Create `.astro` file in `src/components/`
- Naming: PascalCase filename (e.g., `ProgressBar.astro`, `StudentCard.astro`)
- Pattern: Use Astro props interface, destructure, then render

**New Page Route:**
- Implementation: Create `.astro` file in `src/pages/` matching desired URL
- Static page: `about.astro` → `/about/`
- Dynamic route: `[slug].astro` → `/[slug]/` (use `Astro.params`)
- Nested route: `learn/index.astro` → `/learn/`

**New Layout:**
- Implementation: Create `.astro` file in `src/layouts/`
- Pattern: Extend or import BaseLayout, define Props interface, use `<slot />`
- Example: `src/layouts/QuizLayout.astro` wraps quiz pages with special styling

## Special Directories

**src/.astro/ (Generated)**
- Purpose: Astro build cache and type definitions
- Generated: Yes, automatically by Astro during build
- Committed: No, should be in .gitignore

**dist/ (Generated)**
- Purpose: Production build output
- Contains: Static HTML, CSS, JS files ready for deployment
- Generated: Yes, by `npm run build`
- Committed: No, should be in .gitignore

**.env (Secrets)**
- Purpose: Store sensitive environment variables
- Contains: SUPABASE_URL, SUPABASE_ANON_KEY (and potentially others)
- Generated: No, created manually
- Committed: No, in .gitignore
- Template: `.env.example` provides list of required vars

**android/, ios/ (Generated)**
- Purpose: Native mobile app wrappers created by Capacitor
- Generated: Yes, by `npx cap sync` after building web assets
- Committed: Yes, native code customizations committed to git

**node_modules/ (Generated)**
- Purpose: NPM package dependencies
- Generated: Yes, by `npm install`
- Committed: No, in .gitignore

---

*Structure analysis: 2026-02-05*
