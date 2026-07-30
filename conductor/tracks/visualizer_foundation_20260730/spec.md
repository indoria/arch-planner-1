# Specification - Visualizer Foundation

## Overview
This track focuses on the foundational work required to define and visualize architectures within the playground. It establishes the "View State" using a VS Code-inspired UI layout, featuring a robust Tab Management system and a dual-purpose Left Sidebar.

## Goals
- Define a comprehensive JSON schema supporting:
    - **Typed Sockets**: Input and Output sockets with predefined types and connection constraints.
    - **Compatibility Lists**: Explicit lists of what a component can connect to.
- Set up the **VS Code IDE Shell**:
    - **Activity Bar**: Left-most icon bar for switching between Explorer and Extensions.
    - **Left Sidebar (The Explorer)**: 
        - **Architectures Section**: File-explorer style view for saved designs.
        - **Enterprise Knowledge Base**: Collapsible section for educational content.
    - **Top Tab Bar**: Center area tabs for managing multiple open architectures (`openTabs`, `activeTabId`).
    - **Editor Area**: The main React Flow canvas for the active tab.
    - **Panels/Sheets**: Resizable bottom pane for logs and metrics.
- Implement **Progressive Disclosure**:
    - Standardized UI components (Accordions/Details) for all educational and technical data.
- Implement the "Blank State" splash screen.

## Technical Details
- **Framework:** Next.js + Tailwind CSS + Lucide React.
- **Layout:** `react-resizable-panels` for the IDE shell.
- **State:** Zustand store managing the tab array and active ID.

## Constraints
- The UI must remain responsive and modular to allow for future VS Code-like extensions (panes).
- Socket typing must be enforced at the schema level.
