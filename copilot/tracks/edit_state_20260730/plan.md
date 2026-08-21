# Implementation Plan - Architecture Canvas & Component Editing

## Phase 1: Repository Placement
- [ ] Connect repository items to an SVG drag payload and create nodes through a
  single `updateNodePosition` command.
- [ ] Test new placement, pointer capture, touch input, and serialization.

## Phase 2: Editing and Inspector
- [ ] Implement existing-node repositioning with SVG pointer events and the same
  position command used for creation.
- [ ] Build an accessible inspector for selection, properties, latency, cost,
  description, alternatives, and variants.
- [ ] Implement `replaceComponent` with connection preservation checks.

## Phase 3: Guardrails
- [ ] Enforce socket compatibility before drop, connect, or replacement.
- [ ] Surface diagnostics in the inspector and canvas without silently dropping
  valid connections.

## Phase 4: Persistence
- [ ] Add IndexedDB draft persistence, undo/redo snapshots, and recovery tests.
