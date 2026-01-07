# codex-intruction.md

## Scope
This repository is a **TypeScript + React + SQL** codebase maintained with strict AI-assisted coding rules.

These rules are mandatory for *any* code generated or modified by an AI (Codex/LLM) and for any human changes that follow the same workflow.

If there is a conflict between a request and these rules, **this file wins**.

---

## 1) Absolute rule: Every implemented code change MUST be documented inline
**No undocumented code is allowed.** If code is added or modified, it MUST include documentation explaining:

- **What** it does
- **Why** it exists (intent / business rule)
- **Inputs and outputs** (types)
- **Edge cases / constraints**
- **Side effects** (SQL writes, network calls, localStorage, caching)

### Documentation requirements by artifact type
#### TypeScript functions and methods
- Must have a **TSDoc** comment (`/** ... */`) immediately above.
- Any non-trivial block must include **why-comments** inline.

#### React components
- Must have a short TSDoc describing:
  - Responsibility
  - Props contract
  - State behavior
  - Rendering assumptions
  - Side effects (effects, fetches)

#### SQL
- Any query beyond trivial must be documented:
  - What it returns
  - Why it’s needed
  - Index assumptions / performance notes
- Schema changes must be documented in the migration file and in a short migration note.

#### Types, interfaces, and DTOs
- Must document:
  - Meaning of fields
  - Constraints (nullable/optional, ranges, formats)
  - Relationship to DB columns (if applicable)

---

## 2) No “silent” behavior
- No magic defaults without documentation.
- No swallowing errors.
- No hidden retries, caching, fallbacks, or timeouts unless documented.
- Validate inputs at boundaries (API routes, form submit handlers, DB write functions).

---

## 3) Minimal, scoped changes
- Only modify what is necessary to accomplish the requested task.
- Do not refactor unrelated code “while you’re there”.
- If refactoring is required, separate it clearly (separate commit/PR or clearly separated section).

---

## 4) TypeScript rules (mandatory)
- `any` is **not allowed** (unless explicitly justified in a comment and isolated).
- Prefer `unknown` + narrowing over `any`.
- Prefer explicit return types for exported functions.
- No unused exports, no dead code.
- Use `eslint`/`prettier` project config without exceptions.

---

## 5) React rules (mandatory)
- Components should be small and single responsibility.
- Side effects must live in `useEffect` (or equivalent) with clear dependency arrays.
- Avoid mixing data-fetching and complex UI rendering in one component:
  - Extract data hooks (`useXyz`) with full TSDoc.
- Prefer controlled components for forms.
- All async UI states must be handled: `loading`, `error`, `empty`, `success`.

---

## 6) SQL & database rules (mandatory)
### Schema changes
- Schema changes MUST be done via migrations (no manual DB edits).
- Every migration must include:
  - A header comment: purpose + risk notes
  - FKs, indexes, and constraints explicitly stated
  - Rollback strategy (down migration) when the tool supports it

### Query rules
- Use parameterized queries (never string concat with user input).
- Queries must be:
  - Safe (SQL injection resistant)
  - Predictable (explicit columns, no `SELECT *` except small internal tooling)
  - Documented (what + why + edge cases)

### Naming rules
- Table/column names must be consistently spelled and consistent casing.
- Prefer `snake_case` in SQL and map to `camelCase` in TS (document mapping).
- Foreign keys must be named consistently: `xxx_id` or `XxxId` depending on DB conventions.

---

## 7) API rules (if this repo has a backend)
- All endpoints must validate inputs (zod/yup/valibot or manual guards).
- All endpoints must return typed responses.
- Error responses must be consistent (shape + codes) and documented.
- Never leak secrets, hashes, tokens, or SQL errors directly to clients.

---

## 8) Testing rules (mandatory)
Any change that adds or modifies behavior MUST include tests.

Minimum test coverage:
- Happy path
- One edge case
- One failure case

### Frontend tests
- Component tests for rendering states and user interactions.
- If a hook changes behavior, test the hook.

### Backend/DB tests
- Query tests should include:
  - expected rows returned
  - constraints and failure behavior
- If migrations change schema, add a migration sanity test if available.

---

## 9) Error handling & logging rules
- Errors must be actionable and include context (ids, operation, input shape).
- Never log secrets (password hashes, tokens, raw credentials).
- Use consistent error types (e.g., `AppError`) where available.

---

## 10) “Output contract” for AI-generated changes (required)
Whenever the assistant generates code, it MUST also output:

1) **Summary** of what changed (2–6 bullets)
2) **Files changed** (list)
3) **Assumptions** (list)
4) **How to test** (exact commands)

If any requirement cannot be met, STOP and explain what is missing.

---

## 11) Required TSDoc templates

### Function / method (required)
/**
 * What it does:
 * Why it exists:
 *
 * @param ... - Meaning, constraints, edge cases.
 * @returns Meaning and shape of the return value.
 *
 * @throws Describe when errors happen and how they surface.
 * @sideEffects Describe DB writes, network calls, storage, caches, time dependency.
 *
 * Edge cases:
 * - ...
 */

### React component (required)
/**
 * Responsibility:
 * Props:
 * State:
 * Side effects:
 * Rendering states:
 * - loading:
 * - error:
 * - empty:
 * - success:
 */

### SQL block (required)
-- Purpose:
-- Why:
-- Inputs:
-- Output shape:
-- Performance/index assumptions:
-- Edge cases:

---

## Definition of Done (DoD)
A change is done only when:
- All new/changed code is documented inline
- Types are explicit and safe
- SQL is parameterized and documented
- Tests added/updated and passing
- No unrelated changes were introduced
- Naming is consistent and spelled correctly