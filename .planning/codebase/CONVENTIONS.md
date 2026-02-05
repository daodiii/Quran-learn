# Coding Conventions

**Analysis Date:** 2026-02-05

## Naming Patterns

**Files:**
- Astro components: PascalCase (e.g., `Header.astro`, `AuthButton.astro`, `Quiz.astro`)
- TypeScript/JavaScript: kebab-case or camelCase based on type
  - Library functions: camelCase (e.g., `supabase.ts`, `auth.ts`, `progress.ts`)
  - Config files: camelCase (e.g., `content.config.ts`, `capacitor-init.ts`)
  - Page files: kebab-case for routes (e.g., `index.astro`, `learn/[...slug].astro`)
- CSS class names: kebab-case (e.g., `hero-container`, `auth-button-container`, `level-card`)

**Functions:**
- Exported functions: camelCase (e.g., `signUp()`, `signIn()`, `getCurrentUser()`, `markLessonComplete()`)
- Local helper functions: camelCase (e.g., `shuffle()`, `showScreen()`, `renderQuestion()`)
- Boolean-returning functions: prefix with `is` or `has` (e.g., `isSupabaseConfigured()`, `hasArabic()`, `isLessonComplete()`)
- Query functions: prefix with `get` (e.g., `getCurrentUser()`, `getCompletedLessons()`, `getQuizScores()`)
- Mutation functions: prefix with `save`, `mark`, or verb (e.g., `saveQuizScore()`, `markLessonComplete()`, `signOut()`)

**Variables:**
- Local state in Astro scripts: camelCase (e.g., `selectedQuestions`, `currentIndex`, `wrongAnswers`)
- Database column references: snake_case (e.g., `user_id`, `lesson_slug`, `completed_at`, `total_questions`)
- CSS custom properties: kebab-case with prefix (e.g., `--accent-primary`, `--text-secondary`, `--level-1-bg`)
- Constants: UPPER_SNAKE_CASE for exported constants (none observed in codebase yet)

**Types/Interfaces:**
- Type names: PascalCase (e.g., `AuthResult`, `LessonProgress`, `QuizScore`, `Question`)
- Interface names: PascalCase prefixed with `I` is not used; direct `interface` names (e.g., `interface Props`, `interface Question`)
- Zod schemas: camelCase when used as object fields, but schemas define properties as needed

## Code Style

**Formatting:**
- No explicit linter config detected (eslint, prettier not in dependencies)
- Indentation: 2 spaces (inferred from codebase)
- Line length: varies, but appears to follow readability guidelines
- Trailing semicolons: consistently used

**Linting:**
- Not detected in package.json or config files
- TypeScript is configured via `tsconfig.json` with strict mode enabled (extends `astro/tsconfigs/strict`)
- Type checking likely happens during build via Astro

**Astro-specific patterns:**
- Frontmatter separated from HTML/template with `---` fences
- Script sections use `<script>` tags with `is:inline` attribute for synchronous initialization
- Props defined as TypeScript `interface Props` at top of component frontmatter

## Import Organization

**Order:**
1. Framework imports (Astro, Capacitor)
2. Component/layout imports (relative to src/)
3. Library imports (local utilities in `lib/`)
4. Type imports
5. Style imports (usually global CSS)

**Example from codebase:**
```typescript
// From src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';

// From src/layouts/BaseLayout.astro
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

// From src/components/Quiz.astro
import { saveQuizScore } from '../lib/progress';
import { getCurrentUser } from '../lib/auth';
```

**Path Aliases:**
- Not configured; uses relative paths throughout (`../lib/`, `../components/`, etc.)
- Import pattern allows navigating up 1-2 levels consistently

## Error Handling

**Patterns:**
- Async functions return tuples of `{ data, error }` pattern from Supabase
- Manual error checks: `if (error) return []` or `if (error) return false`
- Default values on error: functions return empty arrays, null, false, or empty objects
- No explicit error classes; relies on nullable returns and early returns
- Null checks common: `if (!user) return false`, `if (!supabase) return []`

**Example:**
```typescript
// From src/lib/progress.ts
export async function markLessonComplete(lessonSlug: string): Promise<boolean> {
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from('user_progress').upsert({...});
  return !error;
}
```

## Logging

**Framework:** `console` (no logging library detected)

**Patterns:**
- Uses `console.warn()` for configuration warnings (e.g., "Supabase credentials not found")
- Limited logging in observable code; appears to rely on browser dev tools
- No structured logging or error tracking service observed

**Example:**
```typescript
// From src/lib/supabase.ts
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Auth features will be disabled.');
}
```

## Comments

**When to Comment:**
- Component purpose documented with HTML comments (e.g., `<!-- Start Screen -->`, `<!-- Question Screen -->`)
- Algorithm explanation for non-trivial logic (e.g., Fisher-Yates shuffle)
- Section headers for logical groups of functionality

**JSDoc/TSDoc:**
- Not used; no explicit docstring format observed
- Type safety via TypeScript interfaces replaces much documentation need

**Example:**
```typescript
// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```

## Function Design

**Size:**
- Functions range from 5 to 50+ lines
- Single responsibility preferred but not strictly enforced
- Larger functions like `renderQuestion()` and `selectOption()` handle multiple related DOM operations

**Parameters:**
- Simple primitives preferred (string, number, boolean)
- Type annotations always present in TypeScript files
- No function overloading observed

**Return Values:**
- Explicit return types specified: `Promise<boolean>`, `Promise<QuizScore[]>`, `void`, etc.
- Promise-based for all async operations
- Synchronous functions return typed values directly

**Example:**
```typescript
export async function saveQuizScore(
  level: number,
  score: number,
  totalQuestions: number,
  passed: boolean
): Promise<boolean> {
  // implementation
}
```

## Module Design

**Exports:**
- Named exports used consistently (e.g., `export function`, `export interface`, `export const`)
- No default exports observed
- Single responsibility per file (auth.ts for auth, progress.ts for progress tracking)

**Barrel Files:**
- Not used; each library file exports only its own functions
- Imports reference specific files: `from '../lib/auth'` not `from '../lib'`

**File Structure:**
- Type/interface definitions at top of file
- Exported functions in logical order
- Dependencies managed explicitly at top

## HTML/Template Patterns

**Class naming in Astro components:**
- Descriptive kebab-case classes tied to component functionality
- BEM-like naming with states: `quiz-option`, `quiz-option.correct`, `quiz-option.incorrect`
- Scoped styles within components using `<style>` blocks

**Data attributes:**
- Used to pass configuration from server to client script (e.g., `data-questions`, `data-passing-score`)
- JSON stringified for complex data: `data-questions={JSON.stringify(questions)}`

**Inline scripts in Astro:**
- Client-side behavior initialized within component `<script>` blocks
- Direct DOM manipulation via `document.getElementById()`, `querySelector()`
- Event listeners attached programmatically, not declaratively

---

*Convention analysis: 2026-02-05*
