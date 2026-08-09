# Implementation Plan - System of Systems

This plan outlines the steps to implement hierarchical architectures and drill-down simulation.

## Phase 1: Recursive Schema & Data Model [checkpoint: c935401]
- [x] Task: Update Architecture Schema [2d0d538]
    - [x] **Write failing tests** for recursive schema validation (detecting cycles, validating sub-architecture links).
    - [x] Update `Architecture` and `Node` interfaces to support `subArchitectureId`.
- [x] Task: Mock Data for Hierarchical Systems [09e674a]
    - [x] Create a sample "System of Systems" JSON configuration for a Voice Gateway containing an internal ASR and VAD system.

## Phase 2: Drill-down UI & Navigation
- [x] Task: Breadcrumb Component [d0fcc5a]
    - [x] **Write failing tests** for breadcrumb path generation from a hierarchical state.
    - [x] Build the `Breadcrumbs` UI component and integrate it into the Shell header.
- [ ] Task: Drill-down Interaction
    - [ ] **Write failing tests** for the "Step Into" action (updating the active view context).
    - [ ] Implement double-click handler on React Flow nodes to navigate into sub-architectures.

## Phase 3: Recursive Simulation Engine
- [ ] Task: Hierarchical Event Propagation
    - [ ] **Write failing tests** for event passing between parent nodes and internal sub-system sockets.
    - [ ] Update `SimulationEngine` to resolve sub-architectures during the event loop.
- [ ] Task: Aggregate Telemetry
    - [ ] **Write failing tests** for latency aggregation (bubbling up sub-system latency to parent).
    - [ ] Implement metric collectors that aggregate internal node states.

## Phase 4: Verification & Polish
- [ ] Task: Visual Cues for Sub-systems
    - [ ] Add visual indicators (e.g., a "sub-system" icon or miniature preview) to nodes that contain sub-architectures.
- [ ] Task: Conductor - User Manual Verification 'System of Systems'
