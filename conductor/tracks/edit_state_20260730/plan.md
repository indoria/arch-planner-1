# Implementation Plan - Edit State Implementation

This plan focuses on building the component interactions and constraints using a TDD approach.

## Phase 1: Extensions Sidebar & Drag-and-Drop [checkpoint: 05c77a1]
- [x] Task: Left Sidebar Component Extensions [384f772]
    - [x] **Write failing tests** for the extension-style list rendering and search.
    - [x] Build the Left Sidebar "Component Repository" UI.
- [x] Task: Drag-and-Drop to Canvas [05c77a1]
    - [x] Implement node creation in the active tab upon drop.

## Phase 2: Inspector & Click-to-Replace [checkpoint: ebd9ab0]
- [x] Task: Inspector UI Foundation [7aa7140]
    - [x] **Write failing tests** for node selection and data binding in the inspector.
    - [x] Build the Inspector UI (specs, description, script editor).
- [x] Task: Click-to-Replace Shortcut [7f13925]
    - [x] **Write failing tests** for the `replaceComponent` function (verifying state update and connection preservation).
    - [x] Implement the list of alternatives in the inspector with instant swap functionality.

## Phase 3: Guardrails & Feedback
- [ ] Task: Guardrail Enforcement
    - [ ] **Write failing tests** for preventing incompatible swaps/connections.
    - [ ] Implement real-time validation for drag-and-drop and click-to-replace actions.
- [ ] Task: "Complaints" System UI
    - [ ] Build the visual feedback for architectural violations.

## Phase 4: Persistence & Verification
- [ ] Task: IndexedDB Persistence
    - [ ] Implement save/load for the tab-based architecture array.
- [ ] Task: Conductor - User Manual Verification 'Edit State Implementation' (Protocol in workflow.md)

