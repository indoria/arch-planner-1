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
    - **Editor Area**: The main D3.js SVG canvas for the active tab, with optional Three.js/WebGL views for 3D diagrams.
    - **Panels/Sheets**: Resizable bottom pane for logs and metrics.
- Implement **Progressive Disclosure**:
    - Standardized UI components (Accordions/Details) for all educational and technical data.
- Implement the "Blank State" splash screen.

## Technical Details
- **Frontend:** Semantic HTML5 + vanilla JavaScript ES modules + Tailwind CSS.
- **Layout:** CSS Grid/Flexbox with Pointer Events for the IDE shell.
- **Rendering:** D3.js for 2D SVG diagrams, GSAP for animation, and Three.js/WebGL for 3D views.
- **State:** A small vanilla JavaScript store managing the tab array and active ID.

## Constraints
- The UI must remain responsive and modular to allow for future VS Code-like extensions (panes).
- Socket typing must be enforced at the schema level.
