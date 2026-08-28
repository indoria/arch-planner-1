# Implementation Plan - Advanced UI Features

This plan builds the time-travel and parallel simulation features using a strict TDD approach.

## Phase 1: Simulation Time-Travel [checkpoint: bb3866c]
- [x] Task: History Manager & State Snapshots [729868b]
    - [x] **Write failing tests** for state capture and restoration logic.
    - [x] Implement the `HistoryService` to store simulation snapshots.
- [x] Task: Playback Controls UI [2d71a07]
    - [x] Build the time-travel UI (scrubber, play/pause).

## Phase 2: Parallel Split-Screen Simulations
- [x] Task: Multi-Canvas Manager [d3968cf]
    - [x] **Write failing tests** for spawning and managing multiple canvas instances.
    - [x] Implement the `SplitViewManager` in the VS Code shell.
- [ ] Task: Synchronized Playback Logic
    - [ ] **Write failing tests** for sync commands (Play/Pause/Seek) across instances.
    - [ ] Implement the `PlaybackCoordinator` for multi-instance sync.

## Phase 3: Comparative Analysis UI
...

    - [ ] **Write failing tests** for comparing metrics from two simulation engines.
    - [ ] Build the UI to display comparison delta (e.g., "Arch A is 20ms faster than Arch B").

## Phase 4: Verification & Integration
- [ ] Task: Stress Test Parallel Sims
    - [ ] Verify performance stability with two active high-density simulations.
- [ ] Task: Conductor - User Manual Verification 'Advanced UI Features' (Protocol in workflow.md)
