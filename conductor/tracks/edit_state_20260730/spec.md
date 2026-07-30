# Specification - Edit State Implementation

## Overview
This track enables the "Edit State," focusing on modifying architecture definitions within a VS Code-style sidebar and enforcing strict architectural constraints.

## Goals
- Build the **Component Library Sidebar**:
    - A searchable list of components similar to the VS Code Extensions view.
    - Drag-and-drop components into the canvas.
- Implement **Architectural Guardrails**:
    - Enforce **Compatibility Lists**: Prevent invalid connections between incompatible components.
    - Enforce **Socket Constraints**: Prevent connections that exceed min/max socket limits or type mismatches.
- Build the **Property Inspector**:
    - A dedicated pane (VS Code style) for editing component scripts and parameters.

## Technical Details
- **UI:** Sidebar component utilizing React Flow's drag-and-drop hooks.
- **Logic:** A `ConnectionValidationEngine` to check compatibility and socket rules in real-time.
- **Script Editing:** Integration of a lightweight code editor (e.g., Monaco or CodeMirror) for component scripts.

## Constraints
- Invalid connection attempts must provide clear visual and text feedback (the "Complaints" system).
- The sidebar must handle a large number of components efficiently.
