# Venture Template Enhancement Implementation Plan

## Overview

Enhance the venture startup template with essential development infrastructure: testing (Vitest + React Testing Library), CI/CD (GitHub Actions), smart documentation (ADR, PR templates, changesets), and AI-optimized configuration (CLAUDE.md + AGENTS.md). The goal is to create an easy-to-pick-up template that enables high-quality AI-assisted development while preventing "slop" output.

## Current State Analysis

**Existing Infrastructure:**

- Husky git hooks (pre-commit: prettier, commit-msg: commitlint)
- Commitlint with 4 types: `feat`, `fix`, `chore`, `refactor`
- Lint-staged for Prettier formatting
- Basic CLAUDE.md
- Comprehensive .gitignore
- Claude Code plugins configured

**Key Gaps:**

- No ESLint (only Prettier for formatting)
- No TypeScript config (no type checking)
- No testing framework
- No GitHub Actions CI/CD
- No PR templates
- No ADR structure
- No changelog/versioning automation
- Basic AI instructions (missing boundaries, examples)

## Desired End State

After implementation:

1. `pnpm lint` runs ESLint + Prettier checks
2. `pnpm type-check` validates TypeScript
3. `pnpm test` runs Vitest unit tests
4. **Gitleaks scans every commit for secrets** (blocks commits with leaked keys)
5. PRs automatically validated via GitHub Actions (including secret scanning)
6. Changesets manage versioning and changelogs
7. PR template guides contributors
8. ADR structure captures architectural decisions
9. CLAUDE.md + AGENTS.md provide comprehensive AI guidance with anti-slop boundaries

### Verification

- All new scripts pass: `pnpm lint && pnpm type-check && pnpm test`
- GitHub Actions workflow validates PRs
- Documentation is complete and follows templates

## What We're NOT Doing

- No Next.js app scaffold (tooling-only template)
- No E2E testing (Playwright) - unit tests only
- No preview deployments or release automation
- No Dependabot configuration
- No Storybook or component documentation

## Implementation Approach

Incremental phases that each leave the template in a working state. Each phase adds one logical piece of infrastructure with clear success criteria.

---

## Phase 1: Foundation - ESLint + TypeScript Config

### Overview

Add code quality linting (ESLint) and TypeScript configuration for type checking. This establishes the foundation for all subsequent testing and CI/CD.

### Changes Required

#### 1. ESLint Configuration

**File**: `eslint.config.js`
**Action**: Create new file

```javascript
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
);
```

#### 2. TypeScript Configuration

**File**: `tsconfig.json`
**Action**: Create new file

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", ".next", "out", "build", "dist"]
}
```

#### 3. Update package.json

**File**: `package.json`
**Action**: Add devDependencies and scripts

```json
{
  "devDependencies": {
    "@commitlint/cli": "^20.3.1",
    "@commitlint/config-conventional": "^20.3.1",
    "@eslint/js": "^9.18.0",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "husky": "^9.1.7",
    "lint-staged": "^16.2.7",
    "prettier": "^3.8.0",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.21.0"
  },
  "scripts": {
    "prepare": "husky",
    "lint": "eslint . && prettier --check .",
    "lint:fix": "eslint --fix . && prettier --write .",
    "type-check": "tsc --noEmit"
  },
  "type": "module"
}
```

#### 4. Update lint-staged Configuration

**File**: `lint-staged.config.js`
**Action**: Update to include ESLint

```javascript
/** @type {import('lint-staged').Config} */
const config = {
  // TypeScript/JavaScript files - lint then format
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],

  // Styles
  "*.{css,scss}": ["prettier --write"],

  // JSON, Markdown, etc.
  "*.{json,md,mdx,yml,yaml}": ["prettier --write"],
};

export default config;
```

### Success Criteria

#### Automated Verification

- [ ] Dependencies install cleanly: `pnpm install`
- [ ] ESLint runs without config errors: `pnpm lint`
- [ ] TypeScript config is valid: `pnpm type-check`
- [ ] Lint-staged works on commit: `git add . && git commit -m "test: verify lint-staged"`

#### Manual Verification

- [ ] ESLint catches unused variables when added to a test file
- [ ] TypeScript catches type errors when added to a test file

**Implementation Note**: After completing this phase and all automated verification passes, pause for manual confirmation before proceeding to Phase 1.5.

---

## Phase 1.5: Secret Scanning with Gitleaks

### Overview

Add Gitleaks for pre-commit secret detection to prevent API keys, tokens, and credentials from being committed. This runs via Husky before lint-staged, blocking commits that contain secrets.

### Why Gitleaks

- **Fastest performance**: Sub-second scans for staged files (critical for developer experience)
- **160+ built-in patterns**: Detects API keys, tokens, passwords, private keys
- **Highly customizable**: `.gitleaks.toml` for project-specific rules
- **Active development**: 18.8k+ GitHub stars, regular updates

### Changes Required

#### 1. Gitleaks Configuration

**File**: `.gitleaks.toml`
**Action**: Create new file

```toml
title = "Gitleaks Configuration for Venture Template"

[extend]
useDefault = true

[allowlist]
description = "Allowlist for false positives and test data"

# Common Next.js/Vercel/Supabase paths to exclude
paths = [
  '''\.env\.example$''',
  '''\.env\.local\.example$''',
  '''node_modules/''',
  '''\.next/''',
  '''\.vercel/''',
  '''pnpm-lock\.yaml$''',
  '''public/''',
  '''\.test\.(js|ts|tsx)$''',
  '''\.spec\.(js|ts|tsx)$''',
  '''^__tests__/''',
  '''^tests?/fixtures/''',
  '''^docs?/'''
]

# Common test/example patterns
regexes = [
  '''(?i)(test|demo|example|fake|mock)[-_]?(key|token|secret|api)''',
  '''EXAMPLE_''',
  '''YOUR_.*_HERE''',
  '''sk_test_''',
  '''pk_test_''',
  '''127\.0\.0\.1''',
  '''localhost'''
]

# Custom Supabase detection
[[rules]]
id = "supabase-service-key"
description = "Supabase Service Role Key (CRITICAL - never commit!)"
regex = '''eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6.*"role":"service_role"'''
tags = ["supabase", "service-key", "critical"]

[[rules]]
id = "vercel-token"
description = "Vercel API Token"
regex = '''(?i)vercel[_-]?(token|api)["\']?\s*[:=]\s*["\']?([a-z0-9]{24,})'''
tags = ["vercel", "token"]

[[rules]]
id = "nextauth-secret"
description = "NextAuth Secret"
regex = '''NEXTAUTH_SECRET\s*=\s*["\']?[a-z0-9+/=]{32,}["\']?'''
tags = ["nextauth", "secret"]
entropy = 4.0
```

#### 2. Update Husky Pre-commit Hook

**File**: `.husky/pre-commit`
**Action**: Replace existing file

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Check for secrets before running lint-staged
echo "🔍 Scanning for secrets..."

# Check if gitleaks is installed
if command -v gitleaks &> /dev/null; then
  gitleaks protect --staged --verbose --redact --config=.gitleaks.toml

  if [ $? -ne 0 ]; then
    echo "❌ Secret detected! Commit blocked."
    echo ""
    echo "💡 If this is a false positive:"
    echo "   1. Add inline comment: // gitleaks:allow"
    echo "   2. Update .gitleaks.toml allowlist"
    echo "   3. Emergency bypass: SKIP=gitleaks git commit -m 'message'"
    exit 1
  fi
  echo "✅ No secrets detected"
else
  echo "⚠️  Gitleaks not installed. Skipping secret scan."
  echo "   Install: brew install gitleaks (macOS) or see https://github.com/gitleaks/gitleaks"
fi

# Run lint-staged
pnpm lint-staged
```

#### 3. Update package.json Scripts

**File**: `package.json`
**Action**: Add secret scanning scripts

Add to scripts:

```json
{
  "secrets:check": "gitleaks protect --staged --verbose --config=.gitleaks.toml",
  "secrets:scan": "gitleaks detect --verbose --config=.gitleaks.toml",
  "secrets:scan-history": "gitleaks detect --log-opts='--all' --config=.gitleaks.toml"
}
```

#### 4. Add .env.example Template

**File**: `.env.example`
**Action**: Create new file

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# NextAuth (if used)
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Vercel (automatically set in Vercel deployments)
# VERCEL_URL=

# Add your API keys here
# EXAMPLE_API_KEY=your-key-here
```

### Installation Requirements

Gitleaks must be installed on developer machines:

```bash
# macOS
brew install gitleaks

# Linux
# Download from https://github.com/gitleaks/gitleaks/releases

# Windows
scoop install gitleaks
# or
choco install gitleaks

# Verify installation
gitleaks version
```

### Success Criteria

#### Automated Verification

- [ ] Gitleaks config is valid: `gitleaks detect --config=.gitleaks.toml --no-git`
- [ ] Pre-commit hook is executable: `ls -la .husky/pre-commit`
- [ ] Scripts work: `pnpm secrets:check` (with no staged files)

#### Manual Verification

- [ ] Commit with fake secret is blocked:
  ```bash
  echo "API_KEY=<fake-secret-value>" > test-secret.txt
  git add test-secret.txt
  git commit -m "test: should fail"  # Should be blocked
  rm test-secret.txt
  ```
- [ ] Normal commits pass through
- [ ] `.env.example` is committed (not blocked)

**Implementation Note**: After completing this phase and all automated verification passes, pause for manual confirmation before proceeding to Phase 2.

---

## Phase 2: Testing Infrastructure

### Overview

Add Vitest and React Testing Library for unit testing. Configure test scripts, coverage thresholds, and example test patterns.

### Changes Required

#### 1. Vitest Configuration

**File**: `vitest.config.ts`
**Action**: Create new file

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: ["node_modules", ".next", "out", "build", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "**/*.config.{js,ts}",
        "**/*.d.ts",
        "vitest.setup.ts",
      ],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

#### 2. Vitest Setup File

**File**: `vitest.setup.ts`
**Action**: Create new file

```typescript
import "@testing-library/jest-dom/vitest";

// Add any global test setup here
// Example: Mock global objects, configure testing-library, etc.
```

#### 3. Example Test Pattern

**File**: `src/lib/__tests__/example.test.ts`
**Action**: Create example test file

```typescript
import { describe, it, expect } from "vitest";

// Example utility function (would be in src/lib/example.ts)
function add(a: number, b: number): number {
  return a + b;
}

describe("Example Test Suite", () => {
  describe("add function", () => {
    it("should add two positive numbers", () => {
      expect(add(2, 3)).toBe(5);
    });

    it("should handle negative numbers", () => {
      expect(add(-1, 1)).toBe(0);
    });

    it("should handle zero", () => {
      expect(add(0, 5)).toBe(5);
    });
  });
});
```

#### 4. Update package.json

**File**: `package.json`
**Action**: Add test dependencies and scripts

Add to devDependencies:

```json
{
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/react": "^16.2.0",
  "@vitejs/plugin-react": "^4.3.4",
  "jsdom": "^26.0.0",
  "vitest": "^3.0.4"
}
```

Add to scripts:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

#### 5. Create src/lib directory structure

**Action**: Create directories

```bash
mkdir -p src/lib/__tests__
```

### Success Criteria

#### Automated Verification

- [ ] Dependencies install cleanly: `pnpm install`
- [ ] Tests run successfully: `pnpm test`
- [ ] Coverage generates: `pnpm test:coverage`
- [ ] Watch mode works: `pnpm test:watch` (then Ctrl+C)

#### Manual Verification

- [ ] Coverage report shows in terminal
- [ ] Coverage HTML report generates in `coverage/` directory

**Implementation Note**: After completing this phase and all automated verification passes, pause for manual confirmation before proceeding to Phase 3.

---

## Phase 3: GitHub Actions CI/CD

### Overview

Create GitHub Actions workflow for PR validation: lint, type-check, and test. Add changeset verification workflow.

### Changes Required

#### 1. CI Workflow

**File**: `.github/workflows/ci.yml`
**Action**: Create new file

```yaml
name: CI

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main, dev]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    name: Lint, Type Check, Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ESLint
        run: pnpm lint

      - name: Run Type Check
        run: pnpm type-check

      - name: Run Tests
        run: pnpm test

      - name: Scan for secrets
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload coverage
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7
```

#### 2. Changeset Check Workflow

**File**: `.github/workflows/changeset-check.yml`
**Action**: Create new file

```yaml
name: Changeset Check

on:
  pull_request:
    branches: [main, dev]

jobs:
  changeset:
    name: Check for changeset
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Check for changeset
        run: |
          # Check if there are any changeset files (excluding README)
          CHANGESETS=$(find .changeset -name "*.md" ! -name "README.md" 2>/dev/null | wc -l)
          if [ "$CHANGESETS" -eq "0" ]; then
            echo "::warning::No changeset found. If this PR should trigger a version bump, run 'pnpm changeset' to create one."
          else
            echo "✅ Changeset found"
          fi
```

#### 3. Create workflows directory

**Action**: Create directory

```bash
mkdir -p .github/workflows
```

### Success Criteria

#### Automated Verification

- [ ] Workflow files are valid YAML: `cat .github/workflows/*.yml`
- [ ] Local validation passes: `pnpm lint && pnpm type-check && pnpm test`

#### Manual Verification

- [ ] Push branch and create PR to verify Actions run
- [ ] CI workflow completes successfully
- [ ] Changeset check shows appropriate warning/success

**Implementation Note**: After completing this phase and all automated verification passes, pause for manual confirmation before proceeding to Phase 4.

---

## Phase 4: PR & Documentation Structure

### Overview

Add PR template, ADR directory structure, and changesets for versioning/changelog automation.

### Changes Required

#### 1. PR Template

**File**: `.github/PULL_REQUEST_TEMPLATE.md`
**Action**: Create new file

```markdown
## Description

<!-- Describe your changes and why you're making them -->

**Related Issue(s)**: <!-- Fixes #issue-number or N/A -->
**Type**: <!-- Feature | Fix | Refactor | Chore -->

## Changes

<!-- Bullet points of key changes -->

-
- ***

## AI Context

<!-- Helps both humans and AI reviewers understand the changes -->

**Key Files Modified**:

- `path/to/file.ts` - [Brief description]

**Breaking Changes**: <!-- Yes / No - if yes, describe migration -->

---

## Testing

- [ ] Unit tests added/updated
- [ ] Manual testing completed

**How to Test**:

1.
2.

---

## Checklist

- [ ] Code follows project style guide
- [ ] Self-review completed
- [ ] All tests passing (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm type-check`)
- [ ] Changeset added (if version-impacting): `pnpm changeset`
- [ ] Documentation updated (if needed)

---

## Reviewer Notes

<!-- Any specific areas you want reviewers to focus on -->
```

#### 2. ADR Directory Structure

**File**: `docs/adr/README.md`
**Action**: Create new file

```markdown
# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the project.

## What is an ADR?

An ADR is a document that captures an important architectural decision made along with its context and consequences.

## Creating a New ADR

1. Copy the template: `cp docs/adr/TEMPLATE.md docs/adr/NNNN-title.md`
2. Fill in the template with your decision
3. Submit as part of your PR

## Index

<!-- Add links to ADRs as they are created -->

- [TEMPLATE](TEMPLATE.md) - ADR template
```

#### 3. ADR Template

**File**: `docs/adr/TEMPLATE.md`
**Action**: Create new file

```markdown
# [ADR-NNNN] [Title]

- **Status**: [Proposed | Accepted | Deprecated | Superseded]
- **Date**: YYYY-MM-DD
- **Decision-makers**: [List of people]

## Context

<!-- What is the issue that we're seeing that is motivating this decision? -->

## Decision

<!-- What is the change that we're proposing and/or doing? -->

## Consequences

### Positive

-

### Negative

-

### Neutral

-

## Alternatives Considered

### [Alternative 1]

<!-- Description, pros, cons -->

### [Alternative 2]

<!-- Description, pros, cons -->

## References

<!-- Links to related documents, issues, or external resources -->
```

#### 4. Changesets Configuration

**File**: `.changeset/config.json`
**Action**: Create new file

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

#### 5. Changesets README

**File**: `.changeset/README.md`
**Action**: Create new file

````markdown
# Changesets

This project uses [changesets](https://github.com/changesets/changesets) for version management.

## Adding a Changeset

When you make a change that should be released:

```bash
pnpm changeset
```
````

Follow the prompts to:

1. Select the type of change (major/minor/patch)
2. Write a summary of the change

This creates a markdown file in `.changeset/` that will be consumed during release.

## When to Add a Changeset

- **patch**: Bug fixes, documentation updates
- **minor**: New features (backward compatible)
- **major**: Breaking changes

## When NOT to Add a Changeset

- CI/CD changes
- Test-only changes
- Internal refactoring with no user impact

````

#### 6. Update package.json

**File**: `package.json`
**Action**: Add changeset dependency and script

Add to devDependencies:
```json
{
  "@changesets/cli": "^2.27.12"
}
````

Add to scripts:

```json
{
  "changeset": "changeset"
}
```

#### 7. Create directory structure

**Action**: Create directories

```bash
mkdir -p .github
mkdir -p docs/adr
mkdir -p .changeset
```

### Success Criteria

#### Automated Verification

- [ ] Changeset initializes: `pnpm changeset status`
- [ ] All directories exist: `ls -la .github docs/adr .changeset`

#### Manual Verification

- [ ] PR template appears when creating new PR on GitHub
- [ ] ADR template is usable for documenting decisions
- [ ] `pnpm changeset` interactive prompts work

**Implementation Note**: After completing this phase and all automated verification passes, pause for manual confirmation before proceeding to Phase 5.

---

## Phase 5: AI Configuration

### Overview

Create enhanced CLAUDE.md with explicit boundaries and examples, plus AGENTS.md following the vendor-neutral standard.

### Changes Required

#### 1. Enhanced CLAUDE.md

**File**: `CLAUDE.md`
**Action**: Replace existing file

````markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a venture startup template optimized for Next.js + Supabase + Vercel deployments. It provides pre-configured:

- Git hooks (Husky) for commit linting and formatting
- ESLint + Prettier for code quality
- Vitest for unit testing
- GitHub Actions for CI/CD
- Changesets for versioning

## Commands

```bash
# Package Management (ALWAYS use pnpm, NOT npm or yarn)
pnpm install          # Install dependencies
pnpm prepare          # Set up husky git hooks

# Code Quality
pnpm lint             # Run ESLint + Prettier check
pnpm lint:fix         # Fix lint issues automatically
pnpm type-check       # Run TypeScript compiler check

# Testing
pnpm test             # Run all tests once
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report

# Versioning
pnpm changeset        # Create a changeset for versioning
```
````

## Git Workflow

**Branching Strategy:**

- `main` is protected - no direct pushes
- Create feature branches from `dev`
- Only `dev` merges into `main` via PR
- Branch naming: `feat/description`, `fix/description`, `chore/description`

**Commit Message Format (enforced by commitlint):**

- Format: `type: description` (lowercase, max 100 chars)
- Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `ci`, `perf`
- Example: `feat: add user authentication`

**Before Committing:**

1. Run `pnpm lint` - fix any issues
2. Run `pnpm type-check` - fix any errors
3. Run `pnpm test` - ensure all pass
4. Create changeset if needed: `pnpm changeset`

## Code Style

**TypeScript Strict Mode**: Always enabled. No `any` without justification.

**Imports**: Use `@/` alias for src directory imports.

```typescript
// ✅ Good
import { utils } from "@/lib/utils";

// ❌ Bad
import { utils } from "../../../lib/utils";
```

**Testing Pattern**:

```typescript
import { describe, it, expect } from "vitest";

describe("ComponentName", () => {
  it("should do expected behavior", () => {
    // Arrange
    const input = "test";

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe("expected");
  });
});
```

## Boundaries

### ✅ Always Do

- Use TypeScript strict mode
- Follow existing patterns in the codebase
- Add tests for new functionality
- Run lint/type-check/test before committing
- Use `pnpm` for package management
- Follow conventional commit format
- Create changeset for user-facing changes

### ⚠️ Ask First

- Adding new dependencies
- Changing configuration files (tsconfig, eslint, etc.)
- Modifying CI/CD workflows
- Changing project structure

### 🚫 Never Do

- Commit secrets, API keys, or .env files
- Push directly to `main` branch
- Use `any` type without explicit comment justification
- Disable ESLint rules without justification
- Skip tests for new features
- Use `npm` or `yarn` (use `pnpm`)

## Project Structure

```
/src
  /lib              # Utility functions
    /__tests__      # Tests alongside code
  /components       # React components (when Next.js added)
  /hooks            # Custom React hooks (when Next.js added)
/docs
  /adr              # Architecture Decision Records
/.github
  /workflows        # GitHub Actions
/.changeset         # Version changesets
```

## Adding New Features

1. Create feature branch from `dev`
2. Implement with tests
3. Run full validation: `pnpm lint && pnpm type-check && pnpm test`
4. Create changeset: `pnpm changeset`
5. Commit with conventional format
6. Create PR using template

````

#### 2. AGENTS.md (Vendor-Neutral Standard)

**File**: `AGENTS.md`
**Action**: Create new file

```markdown
# AGENTS.md

This file provides instructions for AI coding agents working on this project.

## Project Context

**Type**: Venture startup template
**Stack**: Next.js 14, TypeScript, Supabase, Vercel, Tailwind CSS
**Package Manager**: pnpm (required)
**Node Version**: 20.x

## Quick Reference

### Essential Commands
```bash
pnpm install           # Install dependencies
pnpm lint              # Check code quality
pnpm type-check        # Validate TypeScript
pnpm test              # Run unit tests
pnpm changeset         # Create version changeset
````

### File Locations

- Source code: `src/`
- Tests: `src/**/__tests__/` or `*.test.ts`
- Config: Root directory (`*.config.{js,ts,json}`)
- Documentation: `docs/`
- CI/CD: `.github/workflows/`

## Code Patterns

### TypeScript

```typescript
// ✅ Strict types, explicit return types for public APIs
export function processData(input: InputType): OutputType {
  return transform(input);
}

// ✅ Use type inference for internal/obvious cases
const items = [1, 2, 3];
const doubled = items.map((x) => x * 2);
```

### Testing

```typescript
// ✅ Descriptive test names, AAA pattern
describe("functionName", () => {
  it("should return expected result when given valid input", () => {
    // Arrange
    const input = createTestInput();

    // Act
    const result = functionName(input);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
```

### Error Handling

```typescript
// ✅ Explicit error handling, no silent failures
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  console.error("Operation failed:", error);
  return { success: false, error: "Operation failed" };
}
```

## Workflow

### Before Making Changes

1. Understand existing patterns in the codebase
2. Check for similar implementations to follow
3. Review relevant tests for expected behavior

### After Making Changes

1. Run `pnpm lint` - fix all issues
2. Run `pnpm type-check` - fix all errors
3. Run `pnpm test` - ensure all pass
4. Add tests for new functionality
5. Create changeset if user-facing: `pnpm changeset`

### Commit Format

```
type: description

Types: feat, fix, chore, refactor, docs, test, ci, perf
Examples:
- feat: add user profile validation
- fix: resolve null pointer in auth flow
- chore: update dependencies
```

## Boundaries

### Safe Actions (no approval needed)

- Reading and analyzing code
- Running lint, type-check, test commands
- Creating/modifying source files in `src/`
- Creating/modifying test files
- Formatting code with Prettier

### Require Approval

- Adding new npm dependencies
- Modifying config files (`*.config.*`, `tsconfig.json`)
- Changing CI/CD workflows (`.github/workflows/`)
- Modifying `package.json` scripts
- Creating new root-level files

### Forbidden Actions

- Committing to `main` branch directly
- Modifying `.env` files or committing secrets
- Disabling TypeScript strict mode
- Removing or skipping tests
- Using `npm` or `yarn` instead of `pnpm`
- Adding `@ts-ignore` without justification comment

## Common Tasks

### Add a New Utility Function

1. Create file in `src/lib/[name].ts`
2. Create test in `src/lib/__tests__/[name].test.ts`
3. Export from `src/lib/index.ts` if needed
4. Run validation: `pnpm lint && pnpm type-check && pnpm test`

### Fix a Bug

1. Write failing test that reproduces the bug
2. Implement the fix
3. Verify test passes
4. Run full validation suite
5. Create changeset: `pnpm changeset` (select `patch`)

### Add a New Feature

1. Create feature branch from `dev`
2. Implement with tests
3. Run full validation
4. Create changeset: `pnpm changeset` (select `minor`)
5. Create PR using template

## Dependencies

### Current Dev Dependencies

- TypeScript, ESLint, Prettier (code quality)
- Vitest, Testing Library (testing)
- Husky, lint-staged, commitlint (git hooks)
- Changesets (versioning)

### Adding Dependencies

Before adding a new dependency:

1. Check if functionality exists in current deps
2. Evaluate bundle size impact
3. Check maintenance status and security
4. Prefer well-maintained, typed packages

````

### Success Criteria:

#### Automated Verification:
- [ ] CLAUDE.md is valid markdown: `cat CLAUDE.md`
- [ ] AGENTS.md is valid markdown: `cat AGENTS.md`

#### Manual Verification:
- [ ] CLAUDE.md provides clear guidance for Claude Code
- [ ] AGENTS.md follows vendor-neutral format
- [ ] Boundaries are clear and actionable
- [ ] Code examples are correct and follow project patterns

**Implementation Note**: After completing this phase and all automated verification passes, pause for manual confirmation before proceeding to Phase 6.

---

## Phase 6: README & Developer Experience

### Overview

Update README with new workflows, add CONTRIBUTING.md, and expand commitlint types.

### Changes Required:

#### 1. Updated README.md

**File**: `README.md`
**Action**: Replace existing file

```markdown
# venture-template

A production-ready startup template optimized for Next.js + Supabase + Vercel with AI-assisted development in mind.

## Features

- **Code Quality**: ESLint + Prettier with auto-fix on commit
- **Type Safety**: TypeScript strict mode
- **Testing**: Vitest + React Testing Library
- **CI/CD**: GitHub Actions for PR validation
- **Git Workflow**: Husky hooks + commitlint for consistent commits
- **Versioning**: Changesets for semantic versioning
- **AI-Ready**: CLAUDE.md + AGENTS.md for AI coding assistants

## Quick Start

```bash
# 1. Fork and clone this repository
git clone <your-fork-url>
cd venture-template

# 2. Install dependencies (requires pnpm)
pnpm install

# 3. Create dev branch
git checkout -b dev

# 4. Start building!
````

## Commands

| Command              | Description                 |
| -------------------- | --------------------------- |
| `pnpm install`       | Install dependencies        |
| `pnpm lint`          | Run ESLint + Prettier check |
| `pnpm lint:fix`      | Auto-fix lint issues        |
| `pnpm type-check`    | Run TypeScript validation   |
| `pnpm test`          | Run unit tests              |
| `pnpm test:watch`    | Run tests in watch mode     |
| `pnpm test:coverage` | Generate coverage report    |
| `pnpm changeset`     | Create version changeset    |

## Git Workflow

### Branching Strategy

```
main (protected)
  └── dev (integration)
       ├── feat/feature-name
       ├── fix/bug-description
       └── chore/task-description
```

- `main` is protected - no direct pushes
- Create feature branches from `dev`
- Merge to `dev` first, then `dev` → `main` via PR

### Commit Format

Commits are validated by commitlint. Format: `type: description`

| Type       | Description             |
| ---------- | ----------------------- |
| `feat`     | New feature             |
| `fix`      | Bug fix                 |
| `chore`    | Maintenance task        |
| `refactor` | Code refactoring        |
| `docs`     | Documentation only      |
| `test`     | Adding/updating tests   |
| `ci`       | CI/CD changes           |
| `perf`     | Performance improvement |

Examples:

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login timeout issue"
git commit -m "chore: update dependencies"
```

### PR Workflow

1. Create feature branch from `dev`
2. Make changes with tests
3. Run validation: `pnpm lint && pnpm type-check && pnpm test`
4. Create changeset (if needed): `pnpm changeset`
5. Push and create PR
6. CI validates automatically
7. Get review and merge

## Project Structure

```
venture-template/
├── src/
│   └── lib/              # Utility functions
│       └── __tests__/    # Unit tests
├── docs/
│   └── adr/              # Architecture Decision Records
├── .github/
│   └── workflows/        # GitHub Actions
├── .changeset/           # Version changesets
├── CLAUDE.md             # Claude Code instructions
├── AGENTS.md             # AI agent instructions
└── [config files]
```

## Adding Your Next.js App

This template is tooling-only. To add your Next.js application:

```bash
# Option 1: Create new Next.js app in this directory
pnpm create next-app . --typescript --tailwind --eslint --app --src-dir

# Option 2: Copy your existing Next.js app
# (merge package.json dependencies manually)
```

## Architecture Decisions

Major decisions are documented in `docs/adr/`. To add a new decision:

1. Copy the template: `cp docs/adr/TEMPLATE.md docs/adr/NNNN-title.md`
2. Fill in the details
3. Include in your PR

## CI/CD

GitHub Actions automatically run on PRs to `main` and `dev`:

- **Lint**: ESLint + Prettier validation
- **Type Check**: TypeScript compilation
- **Test**: Vitest unit tests
- **Secret Scan**: Gitleaks secret detection
- **Changeset Check**: Warns if no changeset for versioned changes

### Local CI Testing (Optional)

You can run GitHub Actions locally using [nektos/act](https://github.com/nektos/act):

```bash
# Install
brew install act  # macOS
# or: scoop install act (Windows)

# List available workflows
act -l

# Run CI workflow locally
act pull_request

# Run specific job
act -j validate
```

**Note**: act requires Docker and supports ~79% of GitHub Actions features. It's optional but useful for iterating on workflows before pushing.

## Security

### Secret Scanning

Every commit is scanned for secrets using [Gitleaks](https://github.com/gitleaks/gitleaks):

- API keys (Supabase, Vercel, Stripe, etc.)
- Authentication tokens
- Private keys
- High-entropy strings

**If blocked**: Remove the secret, use environment variables, and update `.env.example`.

**False positive?** Add `// gitleaks:allow` inline or update `.gitleaks.toml`.

### Environment Variables

- Use `.env.local` for local development (gitignored)
- Use `.env.example` to document required variables (committed)
- Never commit real secrets

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## AI Assistance

This template is optimized for AI-assisted development:

- **CLAUDE.md**: Instructions for Claude Code
- **AGENTS.md**: Vendor-neutral AI agent instructions

These files provide context, patterns, and boundaries to help AI assistants write high-quality code that matches project conventions.

````

#### 2. CONTRIBUTING.md

**File**: `CONTRIBUTING.md`
**Action**: Create new file

```markdown
# Contributing

Thank you for contributing to this project!

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feat/your-feature`

## Code Standards

### Before Submitting

Run the full validation suite:

```bash
pnpm lint        # Must pass
pnpm type-check  # Must pass
pnpm test        # Must pass
````

### Code Style

- TypeScript strict mode is enforced
- ESLint + Prettier handle formatting
- Follow existing patterns in the codebase

### Testing

- Add tests for new functionality
- Update tests when changing behavior
- Aim for meaningful coverage, not 100%

### Commits

Follow conventional commit format:

```
type: description

Types: feat, fix, chore, refactor, docs, test, ci, perf
```

Examples:

- `feat: add export functionality`
- `fix: resolve race condition in auth`
- `test: add coverage for edge cases`

### Changesets

If your change affects users (new feature, bug fix, breaking change):

```bash
pnpm changeset
```

Select the appropriate bump type:

- `patch`: Bug fixes
- `minor`: New features (backward compatible)
- `major`: Breaking changes

## Pull Request Process

1. Create PR against `dev` branch (not `main`)
2. Fill out the PR template completely
3. Ensure CI passes
4. Request review
5. Address feedback
6. Squash and merge when approved

## Architecture Decisions

For significant technical decisions, create an ADR:

1. Copy template: `cp docs/adr/TEMPLATE.md docs/adr/NNNN-title.md`
2. Fill in context, decision, and consequences
3. Include ADR in your PR

## Questions?

Open an issue for questions or discussions.

````

#### 3. Update commitlint.config.js

**File**: `commitlint.config.js`
**Action**: Update with additional types

```javascript
/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "chore", "refactor", "docs", "test", "ci", "perf"],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "subject-case": [2, "always", "lower-case"],
    "header-max-length": [2, "always", 100],
  },
};

export default config;
````

### Success Criteria

#### Automated Verification

- [ ] README renders correctly: `cat README.md`
- [ ] CONTRIBUTING.md exists: `cat CONTRIBUTING.md`
- [ ] Commitlint config is valid: `pnpm commitlint --print-config`
- [ ] New commit types work: `echo "docs: test" | pnpm commitlint`

#### Manual Verification

- [ ] README provides clear getting started guide
- [ ] CONTRIBUTING.md covers all contribution aspects
- [ ] New commit types (docs, test, ci, perf) are accepted

---

## Final Validation

After all phases complete, run the full validation:

```bash
# Install all dependencies
pnpm install

# Run full validation suite
pnpm lint && pnpm type-check && pnpm test

# Verify changeset works
pnpm changeset status

# Test a commit
git add . && git commit -m "test: verify full setup"
```

## Summary of New Files

| File                                    | Purpose                       |
| --------------------------------------- | ----------------------------- |
| `eslint.config.js`                      | ESLint flat config            |
| `tsconfig.json`                         | TypeScript configuration      |
| `.gitleaks.toml`                        | Secret scanning config        |
| `.env.example`                          | Environment variable template |
| `vitest.config.ts`                      | Vitest test configuration     |
| `vitest.setup.ts`                       | Test setup file               |
| `src/lib/__tests__/example.test.ts`     | Example test                  |
| `.github/workflows/ci.yml`              | CI workflow                   |
| `.github/workflows/changeset-check.yml` | Changeset verification        |
| `.github/PULL_REQUEST_TEMPLATE.md`      | PR template                   |
| `docs/adr/README.md`                    | ADR index                     |
| `docs/adr/TEMPLATE.md`                  | ADR template                  |
| `.changeset/config.json`                | Changesets config             |
| `.changeset/README.md`                  | Changesets documentation      |
| `AGENTS.md`                             | AI agent instructions         |
| `CONTRIBUTING.md`                       | Contribution guidelines       |

## Summary of Modified Files

| File                    | Changes                        |
| ----------------------- | ------------------------------ |
| `package.json`          | New dependencies and scripts   |
| `lint-staged.config.js` | Added ESLint                   |
| `commitlint.config.js`  | Additional commit types        |
| `.husky/pre-commit`     | Added Gitleaks secret scanning |
| `CLAUDE.md`             | Enhanced with boundaries       |
| `README.md`             | Complete rewrite               |

## References

- [Vitest Documentation](https://vitest.dev/)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Changesets](https://github.com/changesets/changesets)
- [AGENTS.md Standard](https://github.com/agentsmd/agents.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Gitleaks - Secret Detection](https://github.com/gitleaks/gitleaks)
- [nektos/act - Local GitHub Actions](https://github.com/nektos/act)

---

## Appendix: Optional Tools

### nektos/act - Local GitHub Actions Testing

**What it is**: A tool to run GitHub Actions locally using Docker.

**Compatibility**: ~79% of GitHub Actions features supported (Linux runners only).

**When to use**:

- Iterating on workflow changes
- Debugging failing CI jobs
- Saving GitHub Actions minutes

**Setup**:

1. Install Docker (required)
2. Install act: `brew install act` (macOS) or `scoop install act` (Windows)
3. Optionally create `.actrc` in project root:

```bash
# .actrc
-P ubuntu-latest=catthehacker/ubuntu:act-latest
--artifact-server-path=.act-artifacts
```

4. Add to `.gitignore`:

```
# Act (optional local CI testing)
.actrc.local
.act-artifacts/
```

**Usage**:

```bash
act -l                    # List workflows
act                       # Run push event
act pull_request          # Run PR event
act -j validate           # Run specific job
act -n                    # Dry run (show what would execute)
```

**Limitations**:

- Linux runners only (no macOS/Windows)
- No `concurrency`, `job.permissions`, or OIDC support
- Docker required (500MB-17GB image depending on choice)
- Some GitHub context values differ

**Recommendation**: Document as optional in README. Do not make it a required dependency. Teams can adopt if they frequently iterate on workflows.
