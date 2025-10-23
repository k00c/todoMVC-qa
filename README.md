# TodoMVC QA Practice Project

[![Playwright Tests](https://github.com/k00c/todoMVC-qa/actions/workflows/playwright.yml/badge.svg)](https://github.com/k00c/todoMVC-qa/actions/workflows/playwright.yml)
[![CodeQL](https://github.com/k00c/todoMVC-qa/actions/workflows/codeql.yml/badge.svg)](https://github.com/k00c/todoMVC-qa/actions/workflows/codeql.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=k00c_todoMVC-qa&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=k00c_todoMVC-qa)

A QA skills practice repository for testing the [TodoMVC TypeScript React app](https://todomvc.com/examples/typescript-react) using Playwright. The focus is on learning test automation, CI/CD quality gates, and best practices for maintainable test code.

## Overview

This project demonstrates:

- **Comprehensive test coverage**: Functional, accessibility, performance, and edge case testing
- **CI/CD quality gates**: Automated linting, formatting, security scanning, and code quality analysis
- **Best practices**: DRY principles, helper functions, web-first assertions, and proper test organization

## Test Suite

- **30+ Playwright tests** organized by priority and type:
  - `todomvc_high_priority.spec.ts` - Critical user flows (add, delete, complete, filter)
  - `todomvc_accessibility.spec.ts` - ARIA snapshots and keyboard navigation
  - `todomvc_performance.spec.ts` - Page load metrics and responsiveness with 100+ tasks
  - `todomvc_edge_cases.spec.ts` - Edit functionality and input validation

## Quick Start

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Running Tests

```bash
# Run all tests
npm test
# or
npx playwright test

# Run tests in headed mode
npm run test:headed
# or
npx playwright test --headed

# Run specific test file
npx playwright test todomvc_high_priority

# Debug tests
npm run test:debug
# or
npx playwright test --debug

# View test report
npm run report
# or
npx playwright show-report

# Analyze test performance
npm run analyze
# or
node analyze-test-performance.js

# Run tests and analyze performance
npm run test:analyze
```

### Test Performance Analytics

The project includes a custom performance analysis tool that identifies slow tests:

```bash
npm run analyze
```

**Output includes:**

- ✅ Total tests passed/failed
- ⏱️ Total and average test duration
- 🐌 Slowest tests (> 5 seconds) - helps identify optimization targets
- ⚡ Fastest tests (< 1 second)
- 📂 Performance breakdown by test file

**Example:**

```
🐌 SLOWEST TESTS (> 5 seconds):
1. [8.76s] Mark all tasks as completed
2. [8.70s] Space key to toggle checkbox
3. [8.48s] Responsiveness with 100+ tasks
```

This helps track test suite health and identify tests that need optimization.

### Code Quality

```bash
# Quick check before committing (recommended)
npm run check

# Auto-fix all issues
npm run fix

# Individual commands:
# Format code
npm run format
# or
npx prettier --write .

# Check formatting only
npm run format:check
# or
npx prettier --check .

# Lint code
npm run lint
# or
npx eslint . --ext .ts,.js --plugin playwright

# Auto-fix lint issues
npm run lint:fix
# or
npx eslint . --ext .ts,.js --plugin playwright --fix
```

## CI/CD Pipeline

All workflows depend on a centralized lint/format check:

1. **Code Quality Gate** (`lint.yml`) - Runs Prettier and ESLint
2. **Playwright Tests** (`playwright.yml`) - Runs all tests on Chromium
3. **CodeQL Security Analysis** (`codeql.yml`) - Scans for security vulnerabilities
4. **SonarCloud Quality Analysis** (`sonarcloud.yml`) - Analyzes code quality and technical debt

## BrowserStack Integration (Optional)

**⚠️ Security Notice:** Never commit BrowserStack credentials to git!

For BrowserStack setup instructions, see: [BROWSERSTACK_SETUP.md](BROWSERSTACK_SETUP.md)

**Quick Setup:**

```bash
# Set environment variables (Linux/Mac/Git Bash)
export BROWSERSTACK_USERNAME=your_username
export BROWSERSTACK_ACCESS_KEY=your_access_key

# Or create .env file (automatically ignored by git)
cp .env.example .env
# Edit .env with your credentials
```

## Project Structure

```
.
├── .github/
│   ├── workflows/          # CI/CD workflows
│   └── copilot-instructions.md
├── tests/                  # Playwright test files
│   ├── todomvc_high_priority.spec.ts
│   ├── todomvc_accessibility.spec.ts
│   ├── todomvc_performance.spec.ts
│   └── todomvc_edge_cases.spec.ts
├── playwright.config.ts    # Playwright configuration
├── eslint.config.js        # ESLint configuration
├── bug_register.md         # Known bugs documentation
├── qa_practice_plan.md     # Learning roadmap
└── todomvc_react_test_plan.md  # Test planning document
```

## Configuration

### Playwright Config

- **Base URL**: `https://todomvc.com`
- **Test Path**: `/examples/typescript-react/#/`
- **Browsers**: Chromium only in CI (for speed)
- **Parallel Execution**: Enabled with 3 workers
- **Retries**: 2 in CI, 0 locally

### Code Quality Tools

- **Prettier**: Code formatting
- **ESLint**: Linting with Playwright plugin
- **CodeQL**: Security analysis
- **SonarCloud**: Code quality and coverage analysis

## Learning Resources

- [QA Practice Plan](qa_practice_plan.md) - Step-by-step learning guide
- [Test Plan](todomvc_react_test_plan.md) - Test scenarios and priorities
- [Bug Register](bug_register.md) - Known issues and workarounds
- [Copilot Instructions](.github/copilot-instructions.md) - AI agent guidelines

## Future Enhancements

- **BrowserStack Integration**: Cross-browser testing with BrowserStack Automate
- **Visual Regression Testing**: Percy or Applitools integration
- **API Testing**: Backend API testing with Playwright
- **Mobile Testing**: iOS and Android app testing

## Contributing

This is a learning project, but contributions are welcome! Please:

1. Follow the existing code style (Prettier + ESLint)
2. Write tests using the established patterns (helper functions, test.step())
3. Update documentation as needed

## License

This project is for educational purposes. See individual dependencies for their licenses.

## Resources

- [TodoMVC](https://todomvc.com/) - The app under test
- [Playwright Documentation](https://playwright.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
