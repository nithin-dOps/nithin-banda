# Goodbudget E2E Test Automation Framework

A comprehensive end-to-end test automation framework for the Goodbudget web application using Playwright with TypeScript, featuring cross-browser testing, Docker support, and CI/CD integration.

## 🎯 Overview

This framework tests the three most business-critical user flows identified through exploratory testing:

1. **User Authentication Flow** - Registration and login functionality
2. **Single Transaction Management** - Core transaction creation and validation
3. **Split Transaction Management** - Advanced budgeting features with known bug validation

## 🏗️ Architecture & Tech Stack

### Technology Choices

**Playwright + TypeScript** was chosen for the following reasons:

- **Cross-Browser Support**: Native support for Chromium, Firefox, and WebKit
- **Modern Web Standards**: Better handling of modern web applications compared to Selenium
- **TypeScript Integration**: Strong typing for better maintainability and IDE support
- **Built-in Waiting**: Intelligent waiting mechanisms reduce flaky tests
- **Parallel Execution**: Native support for parallel test execution
- **Rich Reporting**: Comprehensive HTML reports with screenshots and videos
- **Docker Ready**: Official Docker images available

### Framework Structure

```
├── tests/
│   ├── e2e/                    # End-to-end test suites
│   │   ├── 01-authentication.spec.ts
│   │   ├── 02-single-transaction.spec.ts
│   │   └── 03-split-transaction.spec.ts
│   ├── setup/                  # Test setup and configuration
│   │   └── global-setup.ts
│   └── utils/                  # Utilities and test data
│       └── test-data.ts
├── .github/workflows/          # CI/CD pipeline
│   └── e2e-tests.yml
├── test-results/              # Test execution artifacts
├── playwright.config.ts       # Playwright configuration
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Multi-container setup
└── package.json              # Dependencies and scripts
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Docker** (optional, for containerized execution)
- **Git**

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goodbudget-e2e-tests
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Install system dependencies** (Linux/WSL)
   ```bash
   npx playwright install-deps
   ```

5. **Environment configuration** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Docker Setup

1. **Build the Docker image**
   ```bash
   docker build -t goodbudget-e2e:latest .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up test-parallel
   ```

## 🧪 Running Tests

### Local Execution

```bash
# Run all tests across all browsers
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific browser tests
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run tests in parallel
npm run test:parallel

# View test report
npm run test:report
```

### Docker Execution

```bash
# Run all tests in Docker
docker-compose up playwright-tests

# Run specific browser tests
docker-compose up test-chromium
docker-compose up test-firefox
docker-compose up test-webkit

# Run parallel tests
docker-compose up test-parallel

# Quick Docker run
npm run test:docker
```

### CI/CD Execution

Tests automatically run on:
- **Push** to main/develop branches
- **Pull requests** to main/develop
- **Daily schedule** at 2 AM UTC
- **Manual trigger** via GitHub Actions

## 📊 Test Coverage

### Test Suite 1: Authentication Flow (01-authentication.spec.ts)

**Business Criticality**: Critical - Users cannot access the application without authentication

**Test Cases**:
- ✅ Navigation to signup page
- ✅ Login form display and validation
- ✅ Empty form validation
- ✅ Invalid credentials handling
- ✅ Session persistence
- ✅ Email format validation
- ✅ Password field security
- ✅ Keyboard navigation
- ✅ Form submission with Enter key

### Test Suite 2: Single Transaction Management (02-single-transaction.spec.ts)

**Business Criticality**: Critical - Core functionality for financial data management

**Test Cases**:
- ✅ Add Transaction button visibility
- ✅ Transaction form opening
- ✅ Required field validation
- ✅ Valid transaction data acceptance
- ✅ Amount field format validation
- ✅ **Issue 4 Regression Test**: Date field validation (future dates)
- ✅ Successful transaction saving
- ✅ Keyboard navigation
- ✅ Form cancellation
- ✅ Data persistence during interaction

### Test Suite 3: Split Transaction Management (03-split-transaction.spec.ts)

**Business Criticality**: High - Advanced budgeting feature with known issues

**Test Cases**:
- ✅ Split transaction option access
- ✅ Split rows display
- ✅ **Issue 1 Regression Test**: Uneven split distribution bug
- ✅ Manual split amount adjustment
- ✅ Split amount total validation
- ✅ Envelope assignment to splits
- ✅ Valid split transaction saving
- ✅ Split transaction cancellation
- ✅ Keyboard navigation in split form

## 🐛 Bug Validation

The framework includes specific regression tests for bugs discovered during exploratory testing:

### Issue 1: Uneven Split Transaction Distribution
- **Test**: `should test Issue 1: Uneven Split Transaction Distribution`
- **Location**: `03-split-transaction.spec.ts`
- **Purpose**: Validates the bug where split transactions automatically assign the full amount to the second row

### Issue 4: Limited Form Validation (Future Dates)
- **Test**: `should handle date field validation - Issue 4 Regression Test`
- **Location**: `02-single-transaction.spec.ts`
- **Purpose**: Tests that future dates are accepted without warning (current bug behavior)

## 📈 Reporting

### HTML Reports
- **Location**: `test-results/html-report/`
- **Features**: Screenshots, videos, traces, detailed test steps
- **Access**: `npm run test:report`

### JSON Reports
- **Location**: `test-results/results.json`
- **Usage**: Programmatic analysis, CI/CD integration

### JUnit Reports
- **Location**: `test-results/junit.xml`
- **Usage**: CI/CD systems, test result publishing

### Artifacts
- **Screenshots**: Captured on test failure
- **Videos**: Recorded for failed tests
- **Traces**: Detailed execution traces for debugging

## 🔧 Configuration

### Playwright Configuration (playwright.config.ts)

Key configurations:
- **Timeout**: 30 seconds global, 5 seconds for assertions
- **Retries**: 2 retries on CI, 0 locally
- **Parallel Workers**: Optimized for CI/local environments
- **Browsers**: Chromium, Firefox, WebKit + Mobile variants
- **Base URL**: Configurable via environment variables

### Environment Variables

```bash
BASE_URL=https://goodbudget.com    # Target application URL
CI=true                           # CI environment flag
NODE_ENV=test                     # Environment mode
```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow Features

- **Multi-stage pipeline**: Lint → Test → Report → Notify
- **Cross-browser matrix**: Parallel execution across all browsers
- **Docker testing**: Containerized test execution
- **Artifact management**: Test reports, screenshots, videos
- **Failure notifications**: Automatic issue creation on failures
- **Scheduled runs**: Daily automated testing
- **Manual triggers**: On-demand test execution

### Pipeline Stages

1. **Lint and Type Check**: Code quality validation
2. **E2E Tests**: Cross-browser test execution
3. **Docker Tests**: Containerized validation
4. **Parallel Tests**: High-performance execution
5. **Publish Results**: Report generation and publishing
6. **Notify Failure**: Automatic issue creation

## 🔍 Debugging

### Local Debugging
```bash
# Run in debug mode
npm run test:debug

# Run specific test file
npx playwright test tests/e2e/01-authentication.spec.ts --debug

# Run with trace viewer
npx playwright test --trace on
```

### Docker Debugging
```bash
# Run with interactive shell
docker run -it --rm goodbudget-e2e:latest /bin/bash

# Mount local files for development
docker run --rm -v $(pwd):/app -w /app goodbudget-e2e:latest npm test
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-test`
3. **Write tests** following the existing patterns
4. **Run tests locally**: `npm test`
5. **Commit changes**: `git commit -m "Add new test for feature X"`
6. **Push to branch**: `git push origin feature/new-test`
7. **Create Pull Request**

### Test Writing Guidelines

- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Include business context in test descriptions
- Add regression tests for discovered bugs
- Use page object patterns for complex interactions
- Ensure tests are independent and can run in any order

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check existing GitHub issues
2. Review test execution logs
3. Check Playwright documentation
4. Create a new issue with detailed reproduction steps

---

**Framework Version**: 1.0.0  
**Playwright Version**: 1.40.0  
**Node.js Version**: 18+  
**Last Updated**: 2025-06-20
