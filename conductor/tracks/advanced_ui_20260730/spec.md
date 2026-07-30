# Specification - Advanced UI Features

## Overview
This track implements advanced features including Simulation Time-Travel and parallel split-screen simulations for architectural comparison.

## Goals
- Implement **Split-Screen Parallel Simulations**:
    - Support two independent editor areas in the VS Code shell.
    - Run two different architectures (or the same one with different parameters) side-by-side.
    - Synchronize simulation playback across both screens.
- Implement **Simulation Time-Travel**:
    - Full pause, rewind, and state inspection capabilities.

## Technical Details
- **UI:** A "Split View" manager that instantiates two `ArchitectureCanvas` components.
- **Sync:** A `GlobalPlaybackController` to broadcast simulation commands to multiple engine instances.
- **State:** Enhanced history tracking to store state for both active simulations.

## Constraints
- Running parallel simulations must not degrade the UI frame rate.
- Time-travel must accurately reflect the "Ripple Effects" and script states.
