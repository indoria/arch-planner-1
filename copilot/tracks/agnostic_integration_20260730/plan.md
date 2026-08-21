# Implementation Plan - Import, Export & Data Fidelity

## Phase 1: Position Contract
- [ ] Make `position: { x, y }` required in the serialized node schema.
- [ ] Ensure creation, drag repositioning, import, and export use one command
  path and stable numeric normalization.

## Phase 2: Services
- [ ] Implement architecture/domain JSON and YAML import with diagnostics.
- [ ] Implement stable-key JSON export, embedded/independent model handling,
  SVG export, and report/metric bundles.

## Phase 3: Fidelity Gate
- [ ] Add a round-trip test with manually repositioned nodes asserting identical
  positions and stable serialized output.
- [ ] Add warnings for missing or changed shared architecture references.

## Phase 4: Verification
- [ ] Test malformed inputs, large files, SVG cleanup, and git-friendly output.
