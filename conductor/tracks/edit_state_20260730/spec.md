# Specification - Edit State Implementation

## Overview
This track enables the "Edit State," focusing on modifying architecture definitions within a VS Code-style UI using direct manipulation and specific interaction shortcuts.

## Goals
- Build the **Component Extensions Sidebar (Left)**:
    - A library of available components in the left sidebar, mimicking the VS Code Extensions view.
    - Support for dragging components into the active tab's canvas.
- Build the **Inspector & Click-to-Replace (Right)**:
    - A dedicated right sidebar (Inspector) that appears when a node is selected.
    - Displays component specs (Cost, Latency, Description).
    - **Click-to-Replace Interaction**: A list of alternative/equivalent components that instantly swaps the selected node in the active tab when clicked.
- Implement **Architectural Guardrails**:
    - Enforce compatibility and socket constraints during drag-and-drop and click-to-replace events.

## Technical Details
- **UI:** Right sidebar utilizing a `replaceComponent(nodeId, newComponentData)` function.
- **Interaction:** Sidebar list for alternatives, instantly updating the Zustand tab state.
- **Validation:** Guardrail logic that validates a "replace" action before applying it.

## Constraints
- "Click-to-replace" must maintain existing valid connections where possible or "complain" if the replacement is incompatible.
