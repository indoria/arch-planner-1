# Specification - Advanced UI Features

## Overview
This track implements advanced features including Simulation Time-Travel and parallel split-screen simulations for architectural comparison, leveraging the VS Code IDE paradigm.

## Goals
- Implement **Split-Screen Parallel Simulations**:
    - A dedicated UI mode (similar to VS Code Diff) that instantiates two editor areas side-by-side.
    - Allow users to load two architectures from their tabs into the split view for parallel execution.
    - Synchronize simulation playback and transcript scrolling across both screens.
- Implement **Simulation Time-Travel**:
    - Full pause, rewind, and state inspection capabilities within any tab or split-view.

## Technical Details
- **UI:** A `SplitViewCoordinator` that manages two parallel `ArchitectureCanvas` instances.
- **Logic:** Synchronized clock and event broadcasting for parallel simulation runs.
- **State:** History snapshots supporting multi-instance time-travel.

## Constraints
- Parallel simulations must handle independent ripple effects and error states for each architecture.
- Splitting the view must preserve the current state of both architectures.
