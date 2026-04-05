---
name: clean-code-craft
description: >
  The art of writing JavaScript and TypeScript code that humans enjoy reading.
  This skill teaches AI coding agents how to write clean, consistent, reviewable
  JS/TS code — and provides a shared standard for both AI and human reviewers.
  Not about any specific framework or library. About the craft itself: naming,
  structure, consistency, clarity, and respect for the reader.
  Use this skill whenever writing, generating, editing, or refactoring any JavaScript
  or TypeScript code — components, modules, functions, utilities, APIs, scripts,
  tests, or configuration. Also activate when reviewing code, giving code feedback,
  or when the user mentions code quality, readability, clean code, naming, refactoring,
  file size, consistency, code review, PR quality, or coding standards. Apply these
  principles by default on every JS/TS task, even when the user doesn't ask for
  "clean code" — craftsmanship is not optional.
---

# Clean Code Craft

## Who This Is For

You are an AI coding agent writing JavaScript or TypeScript. But you are not just
completing a task. You are writing code that will be read by a human — a teammate
scanning a pull request at 4pm after three meetings, a new hire trying to understand
the codebase on their first week, a future version of yourself six months from now.

Code is read 10x more than it is written. Every decision you make — every name you
choose, every function you extract, every file you create — is a kindness or a burden
to that future reader.

This skill has two reference files. Consult them as needed:
- `references/writing-guide.md` — Detailed patterns for writing code (read when generating or editing code)
- `references/review-guide.md` — Review checklist for evaluating code quality (read when reviewing code or doing a final self-check before presenting output)

---

## The Core Principle

**Consistency beats cleverness. Clarity beats brevity. Predictability beats surprise.**

A codebase where every file follows the same patterns — same naming, same structure,
same level of abstraction — is a codebase where a developer can open any file and
immediately feel at home. That feeling of familiarity is the single most valuable
quality a codebase can have.

When writing code, always ask: "If someone reads this file having never seen it before,
how long will it take them to understand what it does and how it works?"
The answer should be less than two minutes.

---

## The Five Pillars

### 1. Names Are the User Interface of Your Code

Names are how a reader navigates code without reading every line. A well-named
function can be understood without reading its body. A well-named variable
explains itself without a comment.

**The rules:**
- Use meaningful, pronounceable names. If you can't say it out loud in conversation,
  rename it. `getUserAccountBalance()` not `getUsrAccBal()`.
- Use the same word for the same concept everywhere. If you call it `user` in one
  file, don't call it `account` or `member` or `person` in another when referring
  to the same thing. Pick one word and stick with it across the entire codebase.
- Naming conventions are non-negotiable:
  - `camelCase` for variables, functions, methods, parameters
  - `PascalCase` for classes, types, interfaces, enums
  - `UPPER_SNAKE_CASE` for true constants (compile-time values that never change)
  - Booleans read as questions: `isLoading`, `hasPermission`, `canEdit`, `shouldRetry`
  - Functions read as actions: `calculateTotal`, `fetchUser`, `validateInput`, `formatDate`
  - Event handlers follow a pattern: `handleClick`, `handleSubmit`, `onFilterChange`
- Name length should match scope. Loop index `i` is fine. Module-level variable
  must be descriptive. The broader the scope, the more descriptive the name.
- No meaningless names: `data`, `info`, `item`, `thing`, `stuff`, `temp`, `result`,
  `value` — these are placeholders, not names. What data? What result? Be specific.
  `userData`, `validationResult`, `formattedPrice`.
- No abbreviations unless universally understood (`url`, `id`, `api`, `html`).
  Not `btn`, `usr`, `nav`, `mgr`, `msg`.

### 2. Functions Tell a Story

A function is a paragraph in your code's narrative. It should do one thing, do it
completely, and have a name that tells the reader what that thing is without needing
to read the body.

**The rules:**
- One function, one job. If the function name contains "and" — split it.
  `validateAndSaveUser()` is two functions: `validateUser()` and `saveUser()`.
- Keep functions short. Aim for 5-15 lines. Hard ceiling at 30 lines. If it's
  longer, it's doing too much — extract sub-functions with descriptive names.
- Limit parameters to 2-3. If you need more, group them into an options object.
  This makes calling code self-documenting.
- No boolean flag parameters. `createUser(data, true)` — true what? Use separate
  functions or an options object: `createUser(data, { sendWelcomeEmail: true })`.
- No side effects hidden behind innocent names. A function called `getUser()`
  should not modify anything. If it writes to a database, call it `saveUser()`
  or `createUser()`.
- Early returns for guard clauses. Check failure cases first and return early.
  Keep the happy path at the lowest indentation level.
- Maximum 2 levels of nesting. If you're at 3+, extract the inner block into a
  named function. Deep nesting is the enemy of readability.

### 3. Files Have a Size Budget

Every file should have one clear reason to exist, described in a single sentence.
If a file grows too large, it's accumulating responsibilities that should live
elsewhere.

**The rules:**
- Target: 50-150 lines per file. Acceptable: up to 250. Over 300: must split.
- One primary export per file. The file name should match what it exports.
  `calculateTax.ts` exports `calculateTax`. `UserService.ts` exports `UserService`.
- Files named `helpers.ts`, `utils.ts`, or `misc.ts` are junk drawers — they
  attract unrelated code and grow forever. Use specific names: `formatCurrency.ts`,
  `dateUtils.ts`, `validationHelpers.ts`.
- Consistent internal structure in every file:
  1. Imports (grouped: external packages → project shared → relative siblings)
  2. Type definitions (if local to this file)
  3. Constants (if local to this file)
  4. The main export
  5. Private/internal helpers at the bottom
- When a directory grows past 5-7 files, add an `index.ts` barrel that re-exports
  the public API. Other parts of the codebase import from the barrel, not from
  individual internal files.

### 4. Consistency Is the Real Reuse

Code reuse is not just about DRY ("don't repeat yourself"). It's about establishing
patterns that become muscle memory for the team. When every API call follows the
same shape, every error is handled the same way, every module is structured the
same way — the codebase becomes predictable. Predictability is the highest form of
code reuse.

**The rules:**
- Establish patterns, then follow them everywhere. If you handle errors with
  try/catch in one place, don't use `.catch()` chains in another. Pick one approach.
- When you see a pattern repeated twice, note it. Three times, extract it.
  But the extraction must be a real abstraction — not just "these lines look similar".
  If callers need to know the internals, it's not a useful abstraction.
- Give extracted utilities names that describe what they do, not where they came from.
  `retryWithBackoff()` not `apiHelper()`.
- Don't pre-build utility libraries. Extract as patterns emerge organically.
  A utility that's used once is clutter, not reuse.
- Prefer composition over inheritance. Small functions composed together are easier
  to understand and recombine than deep inheritance hierarchies.
- When a pattern exists in the codebase, match it exactly — same naming, same
  structure, same error handling approach. Consistency means a reviewer should not
  be able to tell which file was written by the AI and which by a human.

### 5. Write for the Reviewer

Every line of code will be reviewed — by a human in a PR, by a colleague debugging
at 2am, by an AI agent asked to extend it later. Writing for the reviewer means
making their job effortless.

**The rules:**
- No dead code. No commented-out code. No TODO comments without ticket references.
  Dead code makes reviewers wonder "is this needed?" — that uncertainty is a cost.
- Comments explain "why", never "what". The code should tell the reader what it
  does. Comments explain business rules, workarounds, non-obvious decisions, and
  links to documentation or tickets.
- No magic numbers or strings. Use named constants. `if (retries > 3)` →
  `if (retries > MAX_RETRY_ATTEMPTS)`. The constant name is documentation.
- Keep diffs small and focused. When refactoring, don't mix structural changes with
  behaviour changes in the same file edit. Reviewers can only hold one type of
  change in their head at a time.
- TypeScript strictness is non-negotiable: no `any`, no `@ts-ignore` without
  explanation, no type assertions (`as`) without a comment explaining why.
  Types are documentation that the compiler enforces.
- Imports should be clean and grouped. A wall of unsorted imports is the first
  thing a reviewer sees — it sets the tone for the entire file.
- Error handling should be visible and intentional. Silent catch blocks
  (`catch (e) {}`) are bugs waiting to happen. At minimum, log the error.
  Better: rethrow as a typed error or return a result type.

---

## How to Apply This Skill

**When writing code:**
Before presenting any code output, read `references/writing-guide.md` and apply
its patterns. After writing, self-check against `references/review-guide.md`.

**When reviewing code:**
Read `references/review-guide.md` and evaluate the code against its checklist.
Give specific, actionable feedback with examples of how to improve.

**When refactoring:**
Identify which pillar is being violated (naming, function size, file size,
inconsistency, or reviewer hostility) and address that specific issue. Don't
refactor everything at once.

**When the task is small (a single function or fix):**
Still apply all five pillars. Craftsmanship at the small scale is what creates
quality at the large scale. There is no task too small for good naming, clean
structure, and consistent patterns.