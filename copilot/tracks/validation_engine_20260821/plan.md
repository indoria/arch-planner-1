# Implementation Plan - Validation & Verification Engine

## Phase 1: Unified Rules
- [ ] Define rule schema, severity, source, affected entities, and predicate
  contracts over the architecture graph.
- [ ] Migrate socket, orphan, cycle, missing model, and boundary checks to one
  engine with continuous re-evaluation.

## Phase 2: Problems
- [ ] Build a live Problems panel with counts, filtering, severity, and
  click-to-select behavior using DOM events.

## Phase 3: Optional Verification
- [ ] Define read-only, domain-gated verification connectors and drift reports.
- [ ] Test absent connectors as no-op and keep live-system access explicit.

## Phase 4: Audit
- [ ] Prove all validation paths use the shared engine and expose stable results.
