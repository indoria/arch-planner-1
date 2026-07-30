# Specification - Edit State Implementation

## Overview
This track enables the "Edit State" of the playground, allowing users to modify the architecture definition interactively. This includes changing component parameters, swapping compatible components, and persisting changes.

## Goals
- Implement a sidebar or modal for editing node/edge properties.
- Enable live parameter tuning for simulation variables (latency, cost, LLM settings).
- Implement component swapping logic (e.g., replacing one ASR provider with another).
- Add persistence support using Browser LocalStorage and IndexedDB.

## Technical Details
- **UI:** React components for property editors and parameter sliders.
- **State Management:** Zustand actions for updating the architecture schema.
- **Persistence:** `idb` library for IndexedDB interactions.
- **Validation:** Zod or similar for runtime schema validation during edits.

## Constraints
- Edits must be non-destructive and easily reversible (undo/redo).
- Parameter changes should propagate to the simulation engine foundation.
