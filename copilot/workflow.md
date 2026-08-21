# Copilot Workflow

## Planning Rules
1. `plan.md` is the source of truth for each track.
2. Update `tech-stack.md` before changing an architectural decision.
3. Use test-first development for schema, state, simulation, API, and UI behavior.
4. Keep frontend modules framework-free and browser-testable.
5. Keep deterministic domain logic independent from DOM, NestJS, and MongoDB.
6. Treat remote MongoDB as an external dependency: use test doubles locally and
   run explicitly configured integration tests against a safe test database.

## Task Lifecycle
1. Mark the task `[~]` in its `plan.md`.
2. Add a failing Vitest, Playwright, or Supertest test.
3. Run the focused test and record the failure.
4. Implement the smallest change, then rerun the focused test.
5. Refactor only with green tests; check coverage and accessibility where relevant.
6. Run typecheck, lint, and the relevant integration suite.
7. Mark `[x]`, record the commit SHA, and update the track index.

## Quality Gates
- TypeScript strict mode and no frontend UI framework dependencies.
- Unit coverage target above 80% for new domain and server modules.
- Keyboard, responsive, reduced-motion, and accessibility checks for UI work.
- Deterministic simulation outputs for the same seed and inputs.
- No secrets or customer architecture content in logs.
- MongoDB queries are tenant-scoped and indexed.

## Suggested Commands
```text
npm run test -- --run
npm run test:e2e
npm run typecheck
npm run lint
npm run build
npm run test:integration
```
