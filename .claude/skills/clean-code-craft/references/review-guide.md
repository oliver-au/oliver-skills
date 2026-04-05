# Review Guide

Read this reference when reviewing code, evaluating a PR, or doing a final self-check
before presenting code output. This guide serves both AI reviewers and human reviewers.

The purpose of a code review is not to find bugs (tests do that). The purpose is to
ensure the code is **understandable, consistent, and maintainable** — that it raises
the quality of the codebase rather than degrading it.

---

## Table of Contents

1. The 30-Second Scan
2. Naming Review
3. Function Review
4. File and Structure Review
5. Consistency Review
6. TypeScript Review
7. Readability Review
8. The Final Question

---

## 1. The 30-Second Scan

Before reading any code in detail, scan the entire change and answer:

- **Can I tell what this change does from the file names and function names alone?**
  If not, the naming needs work.
- **How many files were changed?** If it's one massive file, it probably needs splitting.
  If it's dozens of tiny files, some might be unnecessary.
- **Are the imports clean and grouped?** Messy imports signal messy code.
- **Is there any commented-out code?** Flag for removal.
- **Is there any `console.log` left behind?** Flag for removal or replacement with
  proper logging.

If the 30-second scan reveals problems, the detailed review will too. Address
structural issues before nitpicking logic.

---

## 2. Naming Review

Ask these questions for every variable, function, type, and file name:

**Is it meaningful?**
- Can you understand what it represents without reading surrounding code?
- Does the name describe the "what" (for variables) or the "action" (for functions)?
- ❌ `d`, `temp`, `data`, `info`, `val`, `result`, `x`, `cb`
- ✅ `startDate`, `formattedPrice`, `activeUsers`, `validationErrors`

**Is it consistent?**
- Does it use the same word that the rest of the codebase uses for this concept?
- If the codebase says `fetch`, don't use `get`, `load`, `retrieve`, or `pull`.
- If the codebase says `User`, don't switch to `Account`, `Member`, or `Client`.

**Does it follow conventions?**
- `camelCase` for variables and functions
- `PascalCase` for classes, types, interfaces, enums
- `UPPER_SNAKE_CASE` for true constants
- Booleans as questions: `is`, `has`, `can`, `should`, `will`
- Functions as verbs: `calculate`, `format`, `validate`, `fetch`, `handle`

**Is it honest?**
- Does a function called `get*` actually just return a value without side effects?
- Does a function called `create*` actually make something new?
- Does the name match what the code actually does?

**Is it the right length?**
- Is a loop variable using a full sentence name? (Too long for its scope)
- Is a module-level export using a single letter? (Too short for its scope)

---

## 3. Function Review

Ask these questions for every function:

**Does it do one thing?**
- Can you describe what it does in one sentence without using the word "and"?
- Could you extract a meaningful sub-function from its body? If yes, it's
  doing more than one thing.

**Is it short enough?**
- Under 15 lines: excellent
- 15-30 lines: acceptable
- Over 30 lines: likely doing too much — flag for splitting

**Are parameters reasonable?**
- 0-2 parameters: fine
- 3 parameters: consider an options object
- 4+ parameters: should use an options object
- Any boolean flags? Flag for refactoring into separate functions or options object

**Is the abstraction level consistent?**
- Does the function mix high-level orchestration with low-level detail?
  Example: a function that calls `processOrder()` AND manually formats a
  date string — those are different abstraction levels.

**Are side effects visible?**
- Does the function name honestly communicate what it does?
- Are there hidden mutations (modifying arguments, writing global state)?
- Is the function pure where possible? (Same input → same output)

**Is nesting shallow?**
- 0-2 levels of indentation: clean
- 3 levels: question it — can an early return or extraction flatten it?
- 4+ levels: flag for refactoring

---

## 4. File and Structure Review

Ask these questions for every file:

**Does it have a single purpose?**
- Can you describe what this file is for in one sentence?
- Does the file name match what it exports?

**Is it the right size?**
- Under 150 lines: ideal
- 150-250 lines: acceptable if content is cohesive
- Over 300 lines: flag for splitting — what responsibilities can be extracted?

**Is the internal structure consistent?**
- Imports at the top, grouped and sorted?
- Types/interfaces defined before they're used?
- Main export clearly identifiable?
- Private helpers at the bottom?

**Should this be multiple files?**
- If the file exports 5+ unrelated functions, it's a junk drawer.
- If sections could be tested independently, they could be separate files.
- If the file has distinct "chapters" (separated by big comment blocks), each
  chapter might be its own file.

**Is the directory structure intuitive?**
- Can a new developer find what they need by browsing the file tree?
- Are related files co-located?
- Is there a barrel `index.ts` for directories with 3+ public exports?

---

## 5. Consistency Review

This is the most important section. A codebase that follows its own conventions —
even imperfect ones — is better than one with locally perfect but globally
inconsistent code.

**Pattern matching:**
- Does this code follow the same patterns established elsewhere in the codebase?
- If there are 10 API endpoints that handle errors the same way, does the 11th?
- If the codebase uses async/await, does this code also use async/await (not .then)?
- If the codebase names files in kebab-case, does this file follow?

**Same concept, same shape:**
- Do all API response objects have the same structure?
- Do all error handlers follow the same pattern?
- Do all configuration objects use the same naming conventions?
- Do all test files follow the same structure (describe/it/arrange-act-assert)?

**Import consistency:**
- Are import paths consistent with the rest of the codebase?
  (Aliases vs relative paths, default vs named imports)
- Are imports grouped the same way as other files?

**When inconsistency is found:**
- Ask: "Is this inconsistency intentional?" If yes, is there a comment explaining why?
- If not intentional, flag it. Provide the existing pattern as a reference:
  "The rest of the codebase handles this with [pattern X] — see [file Y] for example."

---

## 6. TypeScript Review

**Type safety:**
- Any use of `any`? Flag it. Suggest `unknown` with narrowing, or a proper type.
- Any `@ts-ignore` or `@ts-expect-error` without a comment explaining why?
- Any type assertions (`as`) without justification?
- Are function return types explicit for exported functions?

**Type design:**
- Are types named clearly? (Nouns for data shapes, adjectives for capabilities)
- Could any type be derived from another source (schema, const, function return)
  instead of defined separately?
- Are there boolean fields that should be a discriminated union?
- Are optional fields (`?`) genuinely optional, or are they hiding required data?

**Type duplication:**
- Is the same shape defined in multiple places?
- Could a shared type reduce duplication?
- If a type is used across module boundaries, is it in a shared types file?

---

## 7. Readability Review

Read the code as if you've never seen it. Read it as a story.

**Flow:**
- Can you read the code top-to-bottom without jumping around?
- Is the most important code visible first (not buried at the bottom)?
- Do early returns handle edge cases before the main logic?

**Noise:**
- Is there any dead code? (Unused variables, unreachable branches, commented-out code)
- Are there any unnecessary abstractions? (Wrapper functions that just call another
  function with the same arguments)
- Are there any unnecessary comments? ("Increment counter" next to `counter++`)
- Are there over-engineered solutions? (Generic factory pattern for something
  used in one place)

**Clarity:**
- Are complex expressions broken into named intermediate variables?
- Are conditional blocks readable? (Positive conditions preferred over negated ones)
- Are error messages helpful? (Not just "Error" or "Something went wrong")
- Are string templates used instead of concatenation?

**Comments quality:**
- Do comments explain "why", not "what"?
- Are there links to tickets/docs for workarounds?
- Are JSDoc comments on public APIs accurate and complete?
- Is there any stale documentation (comments that don't match the code)?

---

## 8. The Final Question

After reviewing everything, ask yourself this one question:

**If a new developer joined the team tomorrow and opened this file as the
first code they saw, would they understand:**
1. What it does (from the file name and function names)
2. How it works (from the code structure and naming)
3. Why non-obvious decisions were made (from comments)

**...within two minutes?**

If yes — the code is clean. If no — identify what's creating confusion and
suggest specific improvements.

---

## How to Give Review Feedback

Whether you're an AI reviewer or a human reviewer, feedback should be:

**Specific** — Don't say "this is hard to read." Say "this function is 45 lines
and mixes validation with data transformation — consider extracting the validation
into a separate function."

**Constructive** — Provide a concrete suggestion or example. Don't just identify
problems, show what better looks like.

**Prioritised** — Not all issues are equal. Categorise feedback:
- **Must fix:** Incorrect behaviour, type safety holes, inconsistency with
  established codebase patterns
- **Should fix:** Readability issues, naming improvements, missing error handling
- **Consider:** Style preferences, alternative approaches, minor optimisations

**Kind** — Code review is collaboration, not criticism. The goal is to make the
code better together. Acknowledge what's done well, not just what needs changing.