# TodoMVC QA Practice Project - AI Agent Instructions

## Project Overview

This is a QA skills practice repository for testing the **TodoMVC TypeScript React app** (https://todomvc.com/examples/typescript-react) using Playwright. The focus is on learning test automation, CI/CD quality gates, and best practices for maintainable test code.

**Important**: Always use `/examples/typescript-react/#/` as the base URL, not `/examples/react/dist/`.

## Test Architecture & Patterns

### Test File Organization

The project has comprehensive test coverage organized by priority and type:

1. **`todomvc_high_priority.spec.ts`** - Critical user flows (add, delete, complete, filter tasks)
2. **`todomvc_accessibility.spec.ts`** - ARIA snapshots, keyboard navigation, accessibility tree validation
3. **`todomvc_performance.spec.ts`** - Page load metrics, responsiveness with 100+ tasks, filtering performance
4. **`todomvc_edge_cases.spec.ts`** - Edit task functionality, empty/whitespace validation, extremely long task names

### Helper Functions Over Duplication

All tests use reusable helper functions defined at the top of test files:

**High Priority Tests** (`tests/todomvc_high_priority.spec.ts`):

- `addTasks(page, tasks: string[])` - Adds multiple tasks via the input field
- `completeAllTasks(page)` - Clicks the "toggle all" checkbox
- `clearCompletedTasks(page)` - Clicks the "Clear completed" button

**Accessibility Tests** (`tests/todomvc_accessibility.spec.ts`):

- `addTasks(page, tasks: string[])` - Same helper pattern for DRY code

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

## CI/CD Workflow Architecture

### Centralized Lint & Format (`.github/workflows/lint.yml`)

**Reusable workflow** that runs once per push/PR via `workflow_call`:

- Runs Prettier check on all files
- Runs ESLint with Playwright plugin on TypeScript/JavaScript files
- Only executes when called by other workflows (no direct triggers)

### Quality Gate Workflows

All CI/CD workflows depend on `lint.yml` passing first:

1. **Playwright Tests** (`.github/workflows/playwright.yml`):
   - Installs only Chromium browser (faster ~2-3 min)
   - Runs all 30+ Playwright tests in parallel
   - Uploads test reports and traces on failure
   - Depends on: `code-quality` job (lint.yml)

2. **CodeQL Security Analysis** (`.github/workflows/codeql.yml`):
   - Scans for security vulnerabilities in JavaScript/TypeScript and GitHub Actions
   - Runs on push to main, PRs, and weekly schedule
   - Depends on: `code-quality` job (lint.yml)

3. **SonarCloud Quality Analysis** (`.github/workflows/sonarcloud.yml`):
   - Analyzes code quality, coverage, and technical debt
   - Configured to exclude test files from coverage requirements
   - Runs on push to main and PRs
   - Depends on: `code-quality` job (lint.yml)

### Key Architectural Decisions

- **Single lint/format execution**: Centralized `lint.yml` runs exactly once per push/PR, avoiding duplicate CI time
- **Chromium only in CI**: Cross-browser testing deferred to BrowserStack (when implemented) for free tier optimization
- **Headed mode locally, headless in CI**: `playwright.config.ts` uses `headless: process.env.CI ? true : false`
- **Parallel test execution**: `fullyParallel: true` with 3 workers for speed
- **Retry strategy**: `retries: process.env.CI ? 2 : 0` - only retry in CI to catch flaky tests

## Known Issues & Bug Tracking

### Bug Register (`bug_register.md`)

Document bugs found during testing with:

- Summary, steps to reproduce, expected vs. actual results
- Locator information (so tests can be written or marked as expected failures)
- Version-specific notes (e.g., bug exists in plain React but not TypeScript React)

### Test Annotations for Known Bugs

Use `test.fail()` to mark tests for known bugs:

```typescript
test("Feature with known bug", async ({ page }) => {
  test.fail(true, "Known bug: Description (bug register reference)");
  // ... test code
});
```

**Note**: The ampersand bug (renders as `&amp;`) only exists in the plain React version, not the TypeScript React version we're testing.

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
- Implement comprehensive test coverage (functional, accessibility, performance, edge cases)
- Integrate code quality tools (CodeQL, SonarCloud)

### Non-Goals

- Comprehensive cross-browser testing in CI (Chromium only for speed; BrowserStack for manual/scheduled cross-browser testing)
- Testing the TodoMVC app itself (focus is on QA skills, not app validation)
- Production-grade infrastructure (this is a learning/practice project)

## When Making Changes

1. **Adding new tests**: Use existing helper functions or create new ones. Follow the test.step() structure.
2. **Updating workflows**: Keep jobs fast and focused. Don't add complexity without clear value.
3. **Code style**: Always run Prettier before committing. ESLint will catch Playwright-specific issues.
4. **Bugs found**: Add to `bug_register.md` and consider marking test as `test.fail()` if it's an upstream bug.

## Future Enhancements

### Planned/In Progress

- **BrowserStack Integration**: Cross-browser testing with BrowserStack Automate (free tier/trial)
  - BrowserStack Live for manual testing
  - BrowserStack Chrome Extension for quick checks
  - BrowserStack Test Management for test case organization
  - See `qa_practice_plan.md` for detailed integration steps

### Potential Future Work

- Visual regression testing (Percy, Applitools, or BrowserStack Percy)
- API testing with Playwright (if TodoMVC has an API backend)
- Mobile app testing (if TodoMVC has native apps)
- Load/stress testing for performance validation
