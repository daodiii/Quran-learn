# Testing Patterns

**Analysis Date:** 2026-02-05

## Test Framework

**Runner:**
- Not detected - No test framework configured in `package.json`
- No vitest, jest, mocha, or testing-library dependencies present

**Assertion Library:**
- Not applicable - No testing framework integrated

**Run Commands:**
- None defined in package.json scripts
- No test execution scripts available

## Current Testing Status

**No automated tests found in codebase:**
- No `.test.ts`, `.test.tsx`, `.spec.ts` files in `src/` directory
- No test configuration files (jest.config.js, vitest.config.js, etc.)
- No test dependencies in package.json

## Test File Organization

**Location:**
- Not applicable - No tests currently written

**Naming Convention:**
- Not applicable - No tests currently written

**Suggested Location for Future Tests:**
- Co-locate with source: `src/lib/__tests__/` or adjacent to functions
- E.g., `src/lib/auth.test.ts` for testing `src/lib/auth.ts`

## Test Structure

**Current Recommendation:**
Given the Astro/TypeScript stack, future tests should follow this pattern:

```typescript
// Example structure for testing auth.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signUp, signIn, getCurrentUser } from '../auth';
import * as supabaseModule from '../supabase';

describe('auth', () => {
  beforeEach(() => {
    // Mock setup
  });

  it('should handle sign up', async () => {
    // test implementation
  });
});
```

## Mocking

**Framework:**
- Not yet implemented - Would recommend Vitest or Jest for Astro projects

**Patterns for Future Implementation:**
- Mock Supabase client since auth functions depend heavily on it
- Mock DOM elements in Astro script testing
- Mock `import.meta.env` for environment variables

**Example Mock Strategy:**
```typescript
// Mocking Supabase for auth tests
vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signIn: vi.fn(),
      getUser: vi.fn(),
    },
  },
}));
```

**What to Mock:**
- External API clients (Supabase)
- Browser APIs (localStorage, window.matchMedia)
- Network requests

**What NOT to Mock:**
- Pure utility functions (shuffle, hasArabic)
- Core business logic (quiz scoring calculation)
- Type definitions

## Fixtures and Factories

**Test Data:**
- No fixtures currently exist
- Recommended approach for this codebase:

```typescript
// src/lib/__fixtures__/auth.ts
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {},
};

export const mockQuizScore = {
  id: 'score-123',
  level: 1,
  score: 8,
  total_questions: 10,
  passed: true,
  completed_at: '2024-01-01T00:00:00Z',
};
```

**Location:**
- `src/lib/__fixtures__/` for shared test data
- `src/lib/__mocks__/` for mock implementations

## Coverage

**Requirements:**
- Not enforced - No coverage configuration detected

**Recommended Coverage Targets:**
- Functions in `src/lib/`: 80%+ coverage (core business logic)
- Astro components: Focus on script logic, less critical for template
- Total: 60-70% minimum

**View Coverage (once tests added):**
```bash
# With Vitest
npm run test:coverage

# With Jest
npm run test -- --coverage
```

## Test Types

**Unit Tests:**
- **Scope:** Individual functions in `src/lib/` (auth.ts, progress.ts, supabase.ts)
- **Approach:** Test functions with various inputs, mock Supabase responses
- **Example targets:**
  - `signUp()` with valid/invalid email
  - `markLessonComplete()` with user/no user
  - `getCompletedLessons()` with empty/populated data

**Integration Tests:**
- **Scope:** Component + library interaction (Quiz.astro + progress.ts)
- **Approach:** Test full quiz flow: initialization, answer submission, score saving
- **Example:**
  - Quiz initialization with questions loaded
  - User answers question and feedback displays
  - Quiz completion saves score to database

**E2E Tests:**
- **Framework:** Not currently used
- **Recommendation:** Consider Playwright or Cypress for full user flows
- **Examples:**
  - Complete login flow
  - Start and complete a quiz level
  - View profile with completed lessons

## Common Patterns to Test

**Async Operations:**
```typescript
// Pattern for testing async functions
it('should fetch user data', async () => {
  const user = await getCurrentUser();
  expect(user).toBeDefined();
  // Additional assertions
});
```

**Error Handling:**
```typescript
// Pattern for testing error scenarios
it('should handle auth not configured', async () => {
  vi.mocked(supabase).mockReturnValue(null);
  const result = await signUp('test@example.com', 'password');
  expect(result.user).toBeNull();
  expect(result.error).toBeDefined();
});
```

**State Management in Components:**
```typescript
// Pattern for testing component state
it('should update quiz state on answer selection', () => {
  // Mount component, simulate user interaction
  const button = screen.getByRole('button', { name: /option/i });
  button.click();
  // Assert state changed
});
```

## Recommended Testing Stack

**For This Project:**
- **Test Runner:** Vitest (modern, fast, good Astro integration)
- **Assertion Library:** Vitest's built-in expect (compatible with Jest syntax)
- **Mocking:** Vitest's vi module for mocks
- **Component Testing:** Consider astro-testing-library for Astro components

**Setup Command (when ready):**
```bash
npm install -D vitest @vitest/ui @testing-library/astro jsdom
```

**Configuration File (vitest.config.ts):**
```typescript
import { defineConfig } from 'vitest/config';
import astro from 'astro/config';

export default defineConfig({
  plugins: [astro()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
```

## Current Code Testability Analysis

**High Priority to Test:**
- `src/lib/auth.ts`: Core authentication functions (5 exported functions)
- `src/lib/progress.ts`: Progress tracking (6 exported functions)
- Quiz logic in `src/components/Quiz.astro`: Complex state machine (shuffle, scoring, validation)

**Medium Priority:**
- `src/lib/supabase.ts`: Already has null checks for unconfigured state
- Capacitor initialization in `src/scripts/capacitor-init.ts`

**Lower Priority:**
- Content configuration in `src/content.config.ts` (static schema definitions)
- Layout components (mostly presentational)

## Gaps and Issues

**Current Gaps:**
1. No automated testing of authentication flow
2. No validation that quiz scoring algorithm is correct
3. No tests for Supabase error handling
4. No E2E tests for user flows
5. No accessibility testing

**Risk Areas Without Tests:**
- Quiz state machine could fail silently on edge cases
- Progress tracking might not save if Supabase error handling is wrong
- Authentication state changes might not propagate correctly to UI

---

*Testing analysis: 2026-02-05*
