# Specification - Visualizer Foundation

## Overview
This track focuses on the foundational work required to define and visualize architectures within the playground. It establishes the "View State" using a VS Code-inspired UI layout and a robust, typed component foundation.

## Goals
- Define a comprehensive JSON schema supporting:
    - **Typed Sockets**: Input and Output sockets with predefined types.
    - **Socket Constraints**: Minimum and Maximum counts for connections.
    - **Compatibility Lists**: Explicit lists of what a component can connect to.
- Set up a VS Code-style UI Layout:
    - **Activity Bar**: Left-most icon bar for switching views.
    - **Sidebar**: Primary navigation and component library area.
    - **Editor Area**: The main React Flow canvas.
    - **Panels/Sheets**: Resizable and collapsible areas for logs, metrics, and properties.
- Implement the "Blank State" with an inviting "Open Architecture" or "Browse Library" splash screen.

## Technical Details
- **Schema:** JSON/TypeScript interfaces for `SocketDefinition`, `CompatibilityMatrix`, and `ArchitectureState`.
- **Layout:** CSS Grid/Flexbox or a library like `react-resizable-panels` to achieve the VS Code feel.
- **Visualization:** React Flow customized to handle multi-socket nodes and typed connections.

## Constraints
- The UI must remain responsive and modular to allow for future VS Code-like extensions (panes).
- Socket typing must be enforced at the schema level.
