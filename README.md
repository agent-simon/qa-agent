A multi-agent AI system that generates and self-heals Playwright BDD test suites using the Anthropic Claude API.

## Overview

This project contains two agentic pipelines:

1. **Test Generation** — visits a URL, analyzes the page, and generates a full BDD test suite (feature files, page objects, step definitions, and spec files)
2. **Self-Healing** — runs a failing test, diagnoses the failure, applies a fix, and retries until the test passes or max retries are reached

## Architecture

```
qa-agent/
├── agents/
│   ├── analyze/system.md      # Interprets raw DOM data
│   ├── generate/system.md     # Produces BDD test files
│   ├── validate/system.md     # Checks quality before writing to disk
│   ├── diagnose/system.md     # Identifies what's broken in a failing test
│   └── fix/system.md          # Applies the diagnosed repair
├── utils.ts                   # Shared callAgent helper + file parser
├── orchestrator.ts            # 3-agent test generation chain
├── healOrchestrator.ts        # Diagnose/fix retry loop
├── index.ts                   # Test generation entry point
└── heal.ts                    # Self-healing entry point
```

### Test Generation Pipeline

```
URL (via Playwright)
  → Agent 1: analyze   — interprets page structure (inputs, buttons, forms, headings)
  → Agent 2: generate  — produces feature, POM, steps, and spec files
  → Agent 3: validate  — checks syntax, imports, selectors, and best practices
  → index.ts           — writes files to disk
```

### Self-Healing Pipeline

```
failing test
  → run test          — capture error output + screenshot
  → Agent 1: diagnose — identify root cause, output structured JSON repair plan
  → Agent 2: fix      — apply the fix to the source file
  → run test again    — verify fix worked
  → retry up to 3x or give up
```

## Stack

- [Anthropic Claude API](https://docs.anthropic.com) — `claude-sonnet-4-20250514`
- [Playwright](https://playwright.dev) — browser automation and test execution
- Node.js + TypeScript
- pnpm

## Prerequisites

- Node.js 18+
- pnpm
- An Anthropic API key

## Setup

```bash
git clone <repo-url>
cd qa-agent
pnpm install
npx playwright install chromium
```

Set your API key:

```bash
export ANTHROPIC_API_KEY=your_key_here
```

## Usage

### Generate Tests from a URL

```bash
npx ts-node --esm index.ts "<instruction>" "<url>"
```

**Example:**

```bash
npx ts-node --esm index.ts "Write smoke tests for this page" "https://the-internet.herokuapp.com/login"
```

This will generate:

```
features/loginPage.feature
pom/loginPage.ts
steps/loginPage.ts
tests/login.spec.js
```

### Self-Heal a Failing Test

```bash
npx ts-node --esm heal.ts "<path-to-spec-file>"
```

**Example:**

```bash
npx ts-node --esm heal.ts "tests/login.spec.js"
```

The agent will:
1. Run the test and capture failures + screenshots
2. Diagnose the root cause
3. Apply a fix
4. Re-run and verify — up to 3 attempts

## Project Structure Conventions

| File Type        | Location   | Example                      |
|------------------|------------|------------------------------|
| Feature files    | `features/` | `features/loginPage.feature` |
| Step definitions | `steps/`   | `steps/loginPage.ts`         |
| Page objects     | `pom/`     | `pom/loginPage.ts`           |
| Test specs       | `tests/`   | `tests/login.spec.js`        |

## How Agents Are Defined

Each agent is a markdown file in `agents/`. The markdown defines:

- The agent's single responsibility
- What input it receives
- What output format it must return

The `callAgent` helper in `utils.ts` loads the markdown as a system prompt and sends it to the Claude API with streaming enabled.

To modify agent behavior, edit the relevant `system.md` file — no code changes required.