# Writing Guide

Read this reference when generating, editing, or refactoring JavaScript or TypeScript code.
These patterns apply universally regardless of framework, library, or runtime.

---

## Table of Contents

1. Variables and Naming
2. Functions
3. Modules and Files
4. Error Handling
5. TypeScript-Specific Craft
6. Async Code
7. Consistency Patterns

---

## 1. Variables and Naming

### Use Searchable Names

A reviewer will Ctrl+F your codebase. Names must be unique enough to find.

```ts
// ❌ A reviewer searching for "86400" finds nothing meaningful
setTimeout(callback, 86400000);

// ✅ A reviewer searching for "MILLISECONDS_PER_DAY" finds this and understands it
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
setTimeout(callback, MILLISECONDS_PER_DAY);
```

### Use Explanatory Variables

Break complex expressions into named intermediate values. Each name is a mini-comment
the compiler can verify.

```ts
// ❌ Reader must parse this in their head
if (user.age >= 18 && user.country === 'AU' && user.hasVerifiedEmail) { ... }

// ✅ Each condition has a name that explains the business rule
const isAdult = user.age >= 18;
const isInSupportedRegion = user.country === 'AU';
const hasCompletedVerification = user.hasVerifiedEmail;

if (isAdult && isInSupportedRegion && hasCompletedVerification) { ... }
```

### Use the Same Vocabulary Consistently

One concept, one word, everywhere.

```ts
// ❌ Three different words for the same concept across the codebase
getUserInfo();    // in userService.ts
fetchClientData();  // in dashboard.ts
getCustomerRecord(); // in billing.ts

// ✅ One word, used everywhere
getUser();  // in userService.ts
getUser();  // in dashboard.ts (or a different function with a clear domain prefix)
getUser();  // in billing.ts
```

If your codebase calls them "users", never switch to "members", "accounts", or
"clients" unless these are genuinely different domain concepts.

### Don't Add Redundant Context

If the module or class provides context, don't repeat it in every member.

```ts
// ❌ "user" is repeated in every property — we already know this is a User
type User = {
  userName: string;
  userEmail: string;
  userAge: number;
};

// ✅ Clean — the type name provides the context
type User = {
  name: string;
  email: string;
  age: number;
};
```

### Avoid Mental Mapping

The reader should not need to translate a variable name into what it actually means.

```ts
// ❌ Reader must remember that "r" means "response" and "d" means "data"
const r = await fetch(url);
const d = await r.json();
return d.filter(x => x.active);

// ✅ No translation needed
const response = await fetch(url);
const users = await response.json();
return users.filter(user => user.active);
```

---

## 2. Functions

### Functions Should Do One Thing

Read the function body. If you can extract a meaningful sub-step and give it a name,
the function is doing more than one thing.

```ts
// ❌ This function does three things: validate, transform, and save
function processOrder(rawOrder: RawOrder): Order {
  // 30 lines of validation
  // 20 lines of transformation
  // 15 lines of database saving
}

// ✅ Each function does one thing — and the top-level reads like an outline
function processOrder(rawOrder: RawOrder): Order {
  validateOrder(rawOrder);
  const order = transformOrder(rawOrder);
  return saveOrder(order);
}
```

### One Level of Abstraction per Function

Don't mix high-level orchestration with low-level details in the same function.

```ts
// ❌ Mixing levels: business logic + string formatting + DOM query
function displayUserSummary(userId: string) {
  const user = userCache.get(userId);
  const fullName = `${user.firstName} ${user.lastName}`;
  const element = document.querySelector(`#user-${userId}`);
  element.textContent = fullName;
  element.classList.add('highlighted');
}

// ✅ Each function stays at one level of abstraction
function displayUserSummary(userId: string) {
  const user = getUser(userId);
  const displayName = formatUserName(user);
  renderUserElement(userId, displayName);
}
```

### Use Object Parameters for 3+ Arguments

Object parameters are self-documenting at the call site.

```ts
// ❌ What do these arguments mean? Reader must check the function signature
createUser('Oliver', 'oliver@example.com', true, false, 'admin');

// ✅ Every argument is labelled at the call site
createUser({
  name: 'Oliver',
  email: 'oliver@example.com',
  sendWelcomeEmail: true,
  requireMfa: false,
  role: 'admin',
});
```

### Early Returns Flatten Logic

Guard clauses at the top, happy path at the bottom.

```ts
// ❌ Deep nesting — reader must track multiple indentation levels
function getPaymentStatus(order: Order): string {
  if (order) {
    if (order.payment) {
      if (order.payment.isComplete) {
        return 'paid';
      } else {
        return 'pending';
      }
    } else {
      return 'no-payment';
    }
  } else {
    return 'no-order';
  }
}

// ✅ Flat — each guard clause exits early, happy path is at the bottom
function getPaymentStatus(order: Order | null): string {
  if (!order) return 'no-order';
  if (!order.payment) return 'no-payment';
  if (!order.payment.isComplete) return 'pending';
  return 'paid';
}
```

### No Side Effects Behind Getters

A function's name is a contract. "get" means read-only. "set" means write.
"create" means it makes something new.

```ts
// ❌ "getUser" modifies global state — the name lies
function getUser(id: string): User {
  currentUserId = id;              // side effect: writes global state
  analyticsTracker.logAccess(id);  // side effect: logs analytics
  return userCache.get(id);
}

// ✅ Side effects are explicit in the name and separated
function getUser(id: string): User {
  return userCache.get(id);
}

function setCurrentUser(id: string): void {
  currentUserId = id;
}

function trackUserAccess(id: string): void {
  analyticsTracker.logAccess(id);
}
```

### Encapsulate Conditionals

Give complex conditions a name.

```ts
// ❌ Reader must parse the boolean logic to understand the intent
if (user.subscription !== 'free' && user.paymentMethod && !user.isSuspended) {
  enablePremiumFeatures();
}

// ✅ The condition's name explains the business rule
const canAccessPremium =
  user.subscription !== 'free' &&
  user.paymentMethod != null &&
  !user.isSuspended;

if (canAccessPremium) {
  enablePremiumFeatures();
}
```

### Avoid Negative Conditionals

Negation adds cognitive load. Prefer positive checks.

```ts
// ❌ Double negative — reader must mentally invert
if (!isNotAuthenticated) { ... }

// ✅ Direct and clear
if (isAuthenticated) { ... }

// ❌ Negative function name
if (!isInvalidEmail(email)) { ... }

// ✅ Positive function name
if (isValidEmail(email)) { ... }
```

---

## 3. Modules and Files

### One Concept per File

The file name is the most visible documentation. It appears in file trees, import
statements, tabs, and search results. Make it count.

```ts
// ❌ formatters.ts — what does it format? Will grow forever.
export function formatDate() { ... }
export function formatCurrency() { ... }
export function formatPhoneNumber() { ... }

// ✅ Each formatter is a file — easy to find, easy to test, won't grow
// formatDate.ts
export function formatDate() { ... }

// formatCurrency.ts
export function formatCurrency() { ... }
```

**Exception:** If multiple functions are tightly coupled and under ~10 lines each,
they can share a file with a descriptive grouped name like `dateFormatters.ts`.

### Import Order

Consistent import ordering is the first thing a reviewer sees. Follow this order
with blank lines between groups:

```ts
// 1. Language/Node built-ins
import path from 'node:path';
import { readFile } from 'node:fs/promises';

// 2. External packages (from node_modules)
import express from 'express';
import { z } from 'zod';

// 3. Internal shared modules (absolute paths or aliases)
import { logger } from '@/utils/logger';
import type { AppConfig } from '@/types/config';

// 4. Relative imports (siblings and children)
import { validateInput } from './validateInput';
import { DEFAULTS } from './constants';
```

### Barrel Exports

When a directory represents a module with multiple internal files, expose a clean
public API via `index.ts`:

```ts
// payment/index.ts — this is the public API
export { processPayment } from './processPayment';
export { refundPayment } from './refundPayment';
export type { PaymentResult, PaymentMethod } from './types';

// Internal files like ./calculateFees.ts or ./validateCard.ts
// are NOT exported — they're implementation details.
```

Other parts of the codebase import from `'./payment'`, never from
`'./payment/calculateFees'`. This creates a boundary: internals can change
freely without affecting consumers.

---

## 4. Error Handling

### Errors Are First-Class Citizens

Don't treat error handling as an afterthought bolted onto the happy path.

```ts
// ❌ Silent catch — bugs disappear into the void
try {
  await saveUser(user);
} catch (e) {
  // do nothing
}

// ❌ Catching everything and logging a useless message
try {
  await saveUser(user);
} catch (e) {
  console.log('error');
}

// ✅ Typed errors with meaningful handling
try {
  await saveUser(user);
} catch (error) {
  if (error instanceof ValidationError) {
    return { success: false, errors: error.details };
  }
  // Unexpected errors bubble up — let the caller decide
  throw error;
}
```

### Don't Return null for Collections

A function that might return "nothing" for a collection should return an empty
array or object, not `null` or `undefined`. Callers shouldn't need null checks
before iterating.

```ts
// ❌ Every caller must check for null before using the result
function getActiveUsers(): User[] | null { ... }

// ✅ Callers can always iterate — empty array means "none found"
function getActiveUsers(): User[] { ... }
```

### Use Custom Error Types for Domain Errors

Don't encode error information in strings or generic Error objects.

```ts
// ❌ Error type is lost — callers must parse the string
throw new Error('User not found');

// ✅ Typed error — callers can handle it specifically
class NotFoundError extends Error {
  constructor(public readonly resource: string, public readonly id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

throw new NotFoundError('User', userId);
```

---

## 5. TypeScript-Specific Craft

### No `any` — Ever

`any` disables the type system. It's not a shortcut, it's a hole in your safety net.

```ts
// ❌ "any" means "I don't know and I don't care"
function processData(data: any): any { ... }

// ✅ Use "unknown" and narrow — you still get safety
function processData(data: unknown): ProcessedResult {
  if (!isValidInput(data)) {
    throw new ValidationError('Invalid input');
  }
  // data is now narrowed to the validated type
  return transform(data);
}
```

### Prefer `type` Over `interface` for Data Shapes

Use `type` for data shapes (props, configs, return values). Use `interface` only
when you need declaration merging or want to enforce a contract for implementation.

```ts
// Data shapes — use type
type UserProfile = {
  name: string;
  email: string;
  age: number;
};

// Contracts for implementation — use interface
interface Logger {
  info(message: string): void;
  error(message: string, error?: Error): void;
}
```

### Derive Types, Don't Duplicate Them

When a type can be derived from another source (schema, constant, function), derive it.
Duplication between types and runtime values leads to drift.

```ts
// ❌ Type and runtime validation defined separately — they will drift
type CreateUserInput = { name: string; email: string; };
const createUserSchema = z.object({ name: z.string(), email: z.string() });

// ✅ Single source of truth — type derived from schema
const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
type CreateUserInput = z.infer<typeof createUserSchema>;
```

### Use Discriminated Unions Over Boolean Flags

When a type has different shapes depending on a mode or state, use a discriminated union.
The compiler will enforce exhaustive handling.

```ts
// ❌ Booleans create ambiguous states — is "loading + error" possible?
type RequestState = {
  isLoading: boolean;
  isError: boolean;
  data?: User;
  error?: Error;
};

// ✅ Each state is explicit — impossible states are unrepresentable
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };
```

---

## 6. Async Code

### Always Handle Rejections

Every `await` or `.then()` must have corresponding error handling, even if it's
just letting the error propagate to a higher-level handler.

```ts
// ❌ Unhandled rejection if fetch fails
const data = await fetch(url).then(r => r.json());

// ✅ Errors are handled or intentionally propagated
async function fetchUserData(url: string): Promise<UserData> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(`Failed to fetch: ${response.status}`);
  }

  return response.json() as Promise<UserData>;
}
```

### Don't Mix async/await with .then()

Pick one style and use it consistently throughout the codebase.

```ts
// ❌ Mixing styles — inconsistent and harder to follow
async function loadData() {
  const config = await getConfig();
  return fetch(config.url).then(r => r.json()).then(data => {
    return process(data);
  });
}

// ✅ Consistent async/await throughout
async function loadData() {
  const config = await getConfig();
  const response = await fetch(config.url);
  const data = await response.json();
  return process(data);
}
```

### Parallel When Possible, Sequential When Necessary

Don't await things in sequence when they don't depend on each other.

```ts
// ❌ Sequential — each waits for the previous, total time = sum of all
const users = await fetchUsers();
const orders = await fetchOrders();
const settings = await fetchSettings();

// ✅ Parallel — independent calls run simultaneously, total time = longest
const [users, orders, settings] = await Promise.all([
  fetchUsers(),
  fetchOrders(),
  fetchSettings(),
]);
```

---

## 7. Consistency Patterns

### Establish a Pattern, Then Replicate It

Before writing new code, look at how existing code in the codebase handles the
same kind of task. Match that pattern exactly — same naming conventions, same
file structure, same error handling approach.

If you're adding a new API endpoint and the codebase has 10 existing endpoints
that all follow the same shape, your new endpoint must follow that shape too.
Even if you "know a better way". Consistency across the codebase matters more
than local perfection.

### Decision Log for Non-Obvious Choices

When you make a choice that a reviewer might question, add a brief comment.

```ts
// We use a Map here instead of an object because we need guaranteed
// insertion-order iteration and the keys can be non-string values.
const userSessions = new Map<UserId, Session>();
```

```ts
// Intentionally not using Promise.all here — these API calls must be
// sequential because the second call depends on the first call's side effect
// (it creates a resource that the second call reads).
const project = await createProject(data);
const membership = await addMember(project.id, userId);
```

### Tests Follow the Same Standards

Test code is production code. Apply all the same naming, structure, and clarity
rules. Messy tests make people avoid writing tests.

```ts
// ❌ Test name is meaningless — what does "works correctly" mean?
it('works correctly', () => { ... });

// ✅ Test name describes the scenario and expected outcome
it('returns empty array when no users match the filter', () => { ... });
it('throws ValidationError when email format is invalid', () => { ... });
```