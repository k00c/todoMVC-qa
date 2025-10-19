# TodoMVC QA Practice Project - AI Agent Instructions

## Project Overview

This is a QA skills practice repository for testing the TodoMVC React app (https://todomvc.com/examples/react/dist) using Playwright. The focus is on learning test automation, CI/CD quality gates, and best practices for maintainable test code.

## Test Architecture & Patterns

### Helper Functions Over Duplication

All tests use reusable helper functions defined at the top of test files (see `tests/todomvc_high_priority.spec.ts`):

- `addTasks(page, tasks: string[])` - Adds multiple tasks via the input field
- `completeAllTasks(page)` - Clicks the "toggle all" checkbox
- `clearCompletedTasks(page)` - Clicks the "Clear completed" button

**When adding new tests:** Extract repeated actions into helpers rather than duplicating code.

### Locator Strategy

Use **user-facing, role-based locators** (per Playwright best practices):

- ✅ `page.getByRole('textbox', { name: 'Search Input' })`
- ✅ `page.getByText('Buy groceries')`
- ❌ Avoid CSS selectors like `.toggle` unless absolutely necessary for specificity

### Test Structure

All tests follow this pattern:

```typescript
test("Test name describes user action", async ({ page }) => {
  await test.step("Setup/Given", async () => {
    /* ... */
  });
  await test.step("Action/When", async () => {
    /* ... */
  });
  await test.step("Verify/Then", async () => {
    /* ... */
  });
});
```

## CI/CD Workflow (`.github/workflows/playwright.yml`)

### Two-Stage Pipeline

1. **lint-and-format** job: Runs Prettier and ESLint (with Playwright plugin) on all code
2. **test** job: Installs only Chromium browser and runs Playwright tests (depends on lint-and-format)

### Key Decisions

- **Chromium only in CI**: To speed up browser install (~2-3 min), we only test Chromium. Cross-browser testing is considered lower priority for this practice project.
- **Headed mode locally, headless in CI**: `playwright.config.ts` uses `headless: process.env.CI ? true : false` so developers can watch tests run locally.
- **No actionlint**: Removed due to complexity vs. value for a small project. Prettier catches YAML formatting issues.

## Known Issues & Bug Tracking

### Bug Register (`bug_register.md`)

Document bugs found during testing with:

- Summary, steps to reproduce, expected vs. actual results
- Locator information (so tests can be written or marked as expected failures)
- Example: Bug #1 - Ampersand renders as `&amp;` (see test with `test.fail()` annotation)

### Test Annotations for Known Bugs

Use `test.fail()` to mark tests for known bugs:

```typescript
test("Add task with ampersand (known bug)", async ({ page }) => {
  test.fail(true, "Known bug: & renders as &amp; (bug #1)");
  // ... test code
});
```

## Developer Workflows

### Running Tests Locally

```bash
npx playwright test                    # Run all tests (headless=false locally)
npx playwright test --headed           # Explicitly run in headed mode
npx playwright test --project=chromium # Run only Chromium tests
npx playwright test --debug            # Run in debug mode with Playwright Inspector
```

### Code Quality Commands

```bash
npx prettier --write .                 # Format all files
npx prettier --check .                 # Check formatting (CI mode)
npx eslint . --ext .ts,.js --plugin playwright  # Lint TypeScript/JS with Playwright rules
```

### Viewing Test Reports

```bash
npx playwright show-report             # Open HTML report after test run
npx playwright show-trace trace.zip    # View trace for debugging failures
```

## Configuration Files

### `playwright.config.ts`

- `baseURL: "https://todomvc.com"` - All page.goto() calls are relative to this
- `fullyParallel: true` - Tests run in parallel for speed
- `retries: process.env.CI ? 2 : 0` - Retry flaky tests only in CI
- Only Chromium project is enabled (Firefox/WebKit commented out)

### `eslint.config.js`

Uses flat config (ESLint v9+) with TypeScript parser and Playwright plugin for test-specific rules.

## Project Goals & Non-Goals

### Goals

- Practice high-level QA skills (planning, prioritization, automation)
- Learn Playwright best practices (web-first assertions, auto-waiting, accessibility)
- Build a maintainable test suite with helper functions and clear structure
- Establish CI/CD quality gates (linting, formatting, tests)

### Non-Goals

- Comprehensive cross-browser testing (Chromium only for speed)
- Testing the TodoMVC app itself (focus is on QA skills, not app validation)
- Advanced static analysis tools (CodeQL, SonarCloud deferred for simplicity)

## When Making Changes

1. **Adding new tests**: Use existing helper functions or create new ones. Follow the test.step() structure.
2. **Updating workflows**: Keep jobs fast and focused. Don't add complexity without clear value.
3. **Code style**: Always run Prettier before committing. ESLint will catch Playwright-specific issues.
4. **Bugs found**: Add to `bug_register.md` and consider marking test as `test.fail()` if it's an upstream bug.
