# Architecture Planner

This application is a generic architecture planning and simulation tool, designed to be architecture-agnostic. While originally conceived for voice AI systems, it can be configured to model any modular system.

## Vision
To provide a highly interactive, architecture-agnostic playground for designing, simulating, and analyzing various software system architectures.

## Core Principles
- **Agility:** Easily swap components or reconfigure architectures.
- **Transparency:** Progressive disclosure of component details, latency, cost, and functionality.
- **Extensibility:** The engine is decoupled from the domain-specific data, allowing for new architecture types to be loaded.

## How to use as a Planner
1. **Define Architecture:** Load a JSON/YAML configuration file representing your system's nodes and data-flow lines.
2. **Configure Simulator:** Define the simulation parameters (e.g., latency ranges, error probabilities) for each component.
3. **Simulate:** Run the simulation to model system performance, bottlenecks, and costs.
4. **Iterate:** Use the interactive canvas to swap components and instantly see the updated simulation metrics.

---

# Product Definition - Voicebot Architecture Playground

## Vision
To provide a highly interactive, architecture-agnostic playground for designing, simulating, and analyzing voice-based communication systems. The tool aims to bridge the gap between theoretical architecture and practical performance modeling, serving as both a learning platform and a professional design sandbox.

## Target Users
- **System Architects:** Designing complex real-time communication and AI orchestration systems.
- **LLM Developers:** Exploring the integration of VAD, ASR, LLM, and TTS components.
- **Students/Researchers:** Studying distributed systems, low-latency requirements, and modern voice stacks.

## Core Features
- **SVG Architecture Visualizer:** Interactive, high-fidelity SVG diagrams representing system components and their relationships.
- **End-to-End Call Simulator:** Simulation of full calls with configurable parameters for text, latency, jitter, and error scenarios.
- **Agnostic Architecture Engine:** A plug-and-play system that can ingest architecture definitions (e.g., via JSON/YAML) for any type of software system.
- **Component Library & Drag-and-Drop Builder:** A visual interface to construct new architectures from pre-defined or custom components.

## Simulation & Analysis Goals
- **Logic & Flow Visualization:** Deep dive into data movement and error handling strategies within a call.
- **Performance Modeling:** Realistic latency and throughput estimation to identify bottlenecks.
- **Resource & Cost Analysis:** Integrated analysis to estimate the cost and resource utilization of specific architectural choices during simulation.

## Interactivity & UX
- **Live Parameter Tuning:** Real-time adjustment of component parameters (e.g., LLM temperature, ASR confidence thresholds) during active simulations.
- **Simulation Time-Travel:** The ability to pause, rewind, and inspect the state of a call at any point in the simulation timeline.
- **Interactive Diagrams:** Direct manipulation of SVG elements to inspect component health and metadata.

---

# Product Guidelines - Voicebot Architecture Playground

## Visual Aesthetic: Modern Technical
- **Design Philosophy:** Prioritize clarity, readability, and data density. The interface should feel like a high-end technical dashboard.
- **Color Palette:** Professional neutrals (grays, whites, dark blues) with high-contrast accent colors (e.g., electric blue, vibrant orange) for active states and alerts.
- **Typography:** Clean, sans-serif typefaces for general UI; monospaced fonts for data values and component parameters.

## Tone & Voice: Instructive & Collaborative
- **Communication Style:** The tool acts as a peer mentor—supportive, knowledgeable, and encouraging.
- **Documentation & Tooltips:** Use clear, jargon-free language where possible, but provide technical definitions when necessary to aid learning.
- **Error Messages:** Focused on resolution rather than blame; providing clear paths to fix architectural issues.

## UX Principles
- **Instant Feedback:** Every interaction (tuning a parameter, dragging a component) must result in immediate visual or data feedback to reinforce the cause-and-effect relationship.
- **Non-Destructive Design:** Users should feel free to experiment. Implement robust undo/redo functionality and the ability to save/reset simulation "snapshots."
- **Just-in-Time Learning:** Integrate help markers and tooltips that explain *why* a certain architectural choice might impact performance (e.g., "Increasing LLM context length may increase first-token latency").

## Diagramming & Visualization Standards
- **Standardized Components:** Use a consistent icon set for common voicebot nodes (VAD, ASR, LLM, TTS, Orchestrator) to ensure diagrams are intuitive.
- **Semantic Color Coding:** Use a "traffic light" system or a gradient (e.g., Green to Red) to represent real-time health, latency, or cost metrics.
- **Dynamic Data Flow:** Visualize active call simulations with animated data "packets" moving along connection lines, making the sequence of events and bottlenecks visually obvious.

---

# Tracks

## 1. Advanced UI Features
### Specification
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

### Implementation Plan
# Implementation Plan - Advanced UI Features

This plan builds the time-travel and parallel simulation features using a strict TDD approach.

## Phase 1: Simulation Time-Travel
- [ ] Task: History Manager & State Snapshots
    - [ ] **Write failing tests** for state capture and restoration logic.
    - [ ] Implement the `HistoryService` to store simulation snapshots.
- [ ] Task: Playback Controls UI
    - [ ] Build the time-travel UI (scrubber, play/pause).

## Phase 2: Parallel Split-Screen Simulations
- [ ] Task: Multi-Canvas Manager
    - [ ] **Write failing tests** for spawning and managing multiple canvas instances.
    - [ ] Implement the `SplitViewManager` in the VS Code shell.
- [ ] Task: Synchronized Playback Logic
    - [ ] **Write failing tests** for sync commands (Play/Pause/Seek) across instances.
    - [ ] Implement the `PlaybackCoordinator` for multi-instance sync.

## Phase 3: Comparative Analysis UI
- [ ] Task: Side-by-Side Metrics
    - [ ] **Write failing tests** for comparing metrics from two simulation engines.
    - [ ] Build the UI to display comparison delta (e.g., "Arch A is 20ms faster than Arch B").

## Phase 4: Verification & Integration
- [ ] Task: Stress Test Parallel Sims
    - [ ] Verify performance stability with two active high-density simulations.
- [ ] Task: Conductor - User Manual Verification 'Advanced UI Features' (Protocol in workflow.md)

---

## 2. Agnostic Loader & External Integration
### Specification
# Specification - Agnostic Loader & External Integration

## Overview
This track implements the features that make the playground truly architecture-agnostic. It focuses on the standardized schema, robust data loading from external sources (JSON/YAML), and exporting simulation results. It specifically handles the separation of "Architecture" (connections) and "Component Definitions" (behavioral models).

## Goals
- Formalize and version the Architecture Definition Schema.
- Support loading of two distinct data types:
    - **Architecture Definition**: Defines how nodes are connected.
    - **Component Definition**: Models how components behave, their properties, and interactions.
- Support flexible loading strategies:
    - Independent files for Architecture and Components.
    - Embedded Architecture files that include component models.
- Build a **Component Repository** that is formed automatically when component models are provided.
- Implement a **Validation Engine** that "complains" (provides clear error messages) if either connection info or behavioral models are missing.
- Implement comprehensive import/export features for sharing and versioning.

## Technical Details
- **Schema Validation:** `Ajv` for JSON Schema validation or `Zod` for runtime validation.
- **Parsing:** `js-yaml` for YAML support.
- **Component Registry:** A dedicated store for managing the component library (repository).
- **Error Reporting:** A structured diagnostic system for reporting missing or invalid definitions.

## Constraints
- The loader must handle invalid or incomplete files gracefully with clear error reporting.
- Standardized exports should be compatible with version control (Git-friendly JSON).

### Implementation Plan
# Implementation Plan - Agnostic Loader & External Integration

This plan formalizes the architecture schema and builds the import/export engine using a strict TDD approach, specifically addressing the dual-input and repository requirements.

## Phase 1: Schema Formalization & Dual-Input Validation
- [ ] Task: Formalize Multi-Part Schema
    - [ ] **Write failing tests** for validating standalone "Architecture" definitions (missing models).
    - [ ] **Write failing tests** for standalone "Component Definition" models.
    - [ ] **Write failing tests** for "Embedded" definitions (Architecture + Models).
    - [ ] Define the official schemas for Connections and Component Models.
- [ ] Task: Diagnostic & Reporting Engine
    - [ ] **Write failing tests** for the "Complaints" system (verifying specific error messages for missing connectivity vs. missing models).
    - [ ] Implement the `DiagnosticService` to provide detailed validation feedback.

## Phase 2: Agnostic Loading & Repository Management
- [ ] Task: Flexible Arch Loader
    - [ ] **Write failing tests** for loading independent files and merging them into the state.
    - [ ] **Write failing tests** for loading an embedded file.
    - [ ] Implement the `UnifiedLoader` to handle independent or merged inputs.
- [ ] Task: Component Repository (Registry)
    - [ ] **Write failing tests** for forming a repository from provided component models.
    - [ ] **Write failing tests** for searching and retrieving models from the repository.
    - [ ] Implement the `ComponentRepository` store and management logic.

## Phase 3: External Integration & Export
- [ ] Task: Import/Export Service
    - [ ] **Write failing tests** for exporting architectures with and without embedded models.
    - [ ] Implement the `ExportService` for multi-format generation.
- [ ] Task: High-Res SVG Export
    - [ ] **Write failing tests** for SVG serialization and cleanup.
    - [ ] Implement a utility to export the current diagram as a high-resolution SVG.

## Phase 4: Verification & Documentation
- [ ] Task: Schema Documentation
    - [ ] Generate documentation explaining the independent vs. embedded loading strategy.
- [ ] Task: Conductor - User Manual Verification 'Agnostic Loader & External Integration' (Protocol in workflow.md)

---

## 3. Analysis & Metrics Dashboard
### Specification
# Specification - Analysis & Metrics Dashboard

## Overview
This track implements the analytical features of the playground, including real-time metrics and a VS Code-style "Call Log" transcript view.

## Goals
- Build the **Call Log / Transcript Pane**:
    - A resizable and collapsible pane at the bottom (VS Code style).
    - Real-time display of text/data as it flows through components (e.g., ASR output, LLM response).
- Implement **Telemetry Visualization**:
    - Overlay metrics directly onto nodes and edges in the visualizer.
- Build the **Analysis Dashboard**:
    - A resizable pane or sidebar for aggregated metrics (latency, cost, throughput).

## Technical Details
- **UI:** Virtualized list for the Call Log to handle high-volume simulation data.
- **Visuals:** React Flow overlays for telemetry; Chart.js for dashboard graphs.
- **Layout:** Integration with the `react-resizable-panels` layout from the foundation.

## Constraints
- The Call Log must support filtering by transaction ID or component.
- The UI must remain responsive even with rapid simulation event updates.

### Implementation Plan
# Implementation Plan - Analysis & Metrics Dashboard

This plan builds the analytical dashboard and the VS Code-style Call Log pane using a strict TDD approach.

## Phase 1: Call Log & Transcript Pane
- [ ] Task: Call Log Component
    - [ ] **Write failing tests** for real-time log appending and virtualization logic.
    - [ ] Build the `CallLogPane` with auto-scroll and filtering support.
- [ ] Task: Transcript Mapping
    - [ ] **Write failing tests** for mapping simulation data (e.g., ASR text) to the log view.
    - [ ] Implement the data transformation logic from simulation events to log entries.

## Phase 2: Telemetry & Overlay
- [ ] Task: SVG Telemetry Overlay
    - [ ] **Write failing tests** for dynamic node/edge label updates.
    - [ ] Implement the React Flow overlay for real-time latency and status.

## Phase 3: Metrics Dashboard
- [ ] Task: KPI Calculation Engine
    - [ ] **Write failing tests** for cost and latency aggregation.
    - [ ] Build the metrics aggregation logic.
- [ ] Task: Metrics Dashboard UI
    - [ ] **Write failing tests** for dashboard layout and chart rendering.
    - [ ] Implement the metrics pane in the VS Code shell.

## Phase 4: Verification & Integration
- [ ] Task: Export System
    - [ ] Implement log and metric export functionality.
- [ ] Task: Conductor - User Manual Verification 'Analysis & Metrics Dashboard' (Protocol in workflow.md)

---

## 4. Backend & Collaboration
### Specification
# Specification - Backend & Collaboration

## Overview
This track builds the necessary server-side foundation to support persistent architecture storage, user authentication, and collaboration features (sharing architectures).

## Goals
- Set up a Node.js/Express (or Fastify) backend.
- Integrate a database (PostgreSQL/MongoDB) for persistent storage.
- Implement user authentication and authorization (via Firebase/Supabase or custom JWT).
- Build a collaboration API for sharing, cloning, and versioning architectures.
- Implement a centralized component library that can be synchronized across users.

## Technical Details
- **Backend:** Node.js with TypeScript and Express/Fastify.
- **Database:** Prisma ORM for type-safe database access (PostgreSQL) or Mongoose (MongoDB).
- **Auth:** Supabase Auth or Firebase Auth for fast integration.
- **API:** RESTful endpoints for CRUD operations on architectures and components.

## Constraints
- The backend must be lightweight and scalable.
- Authentication must be secure and support social/email login providers.
- Sharing features must handle permissions (view-only vs. edit access).

### Implementation Plan
# Implementation Plan - Backend & Collaboration

This plan builds the server-side infrastructure and collaboration features using a strict TDD approach.

## Phase 1: Backend Foundation & API
- [ ] Task: Project Scaffolding (Server)
    - [ ] Initialize Node.js + TypeScript + Express project.
    - [ ] **Write failing tests** for a basic health-check endpoint.
    - [ ] Implement the base server and logging infrastructure.
- [ ] Task: Database Integration
    - [ ] **Write failing tests** for the database connection and basic CRUD operations.
    - [ ] Set up Prisma/Mongoose and define the `User`, `Architecture`, and `Component` models.

## Phase 2: User Authentication
- [ ] Task: Auth Integration (Supabase/Firebase)
    - [ ] **Write failing tests** for the authentication middleware and route protection.
    - [ ] Integrate the chosen auth provider and implement login/signup flows.
- [ ] Task: User Profiles & Permissions
    - [ ] **Write failing tests** for role-based access control (RBAC) on architecture resources.
    - [ ] Implement ownership and permission checks for architecture operations.

## Phase 3: Architecture Management & Collaboration
- [ ] Task: Architecture CRUD API
    - [ ] **Write failing tests** for saving, retrieving, and updating architectures via the API.
    - [ ] Implement the architecture management endpoints with schema validation.
- [ ] Task: Collaboration & Sharing
    - [ ] **Write failing tests** for sharing links and "Clone" functionality.
    - [ ] Build the API and UI support for generating shareable architecture URLs.

## Phase 4: Centralized Component Library
- [ ] Task: Shared Component Registry
    - [ ] **Write failing tests** for publishing and searching components in the central registry.
    - [ ] Implement the component library API to allow users to share their custom nodes.
- [ ] Task: Conductor - User Manual Verification 'Backend & Collaboration' (Protocol in workflow.md)

---

## 5. Edit State Implementation
### Specification
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

### Implementation Plan
# Implementation Plan - Edit State Implementation

This plan focuses on building the component interactions and constraints using a TDD approach.

## Phase 1: Extensions Sidebar & Drag-and-Drop [checkpoint: 05c77a1]
- [x] Task: Left Sidebar Component Extensions [384f772]
    - [x] **Write failing tests** for the extension-style list rendering and search.
    - [x] Build the Left Sidebar "Component Repository" UI.
- [x] Task: Drag-and-Drop to Canvas [05c77a1]
    - [x] Implement node creation in the active tab upon drop.

## Phase 2: Inspector & Click-to-Replace
- [ ] Task: Inspector UI
    - [ ] **Write failing tests** for node selection and data binding in the inspector.
    - [ ] Build the Inspector UI (specs, description, script editor).
- [ ] Task: Click-to-Replace Shortcut
    - [ ] **Write failing tests** for the `replaceComponent` function (verifying state update and connection preservation).
    - [ ] Implement the list of alternatives in the inspector with instant swap functionality.

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

---

## 6. Interactive Ideas Library
### Specification
# Specification - Interactive Ideas Library

## Overview
This track implements the "Interactive Ideas Library," a dedicated view in the IDE that allows users to upload, browse, and learn from architectural concepts using text and interactive diagrams.

## Goals
- Add a dedicated **Library Icon** to the Activity Bar (Leftmost).
- Implement a **Library Upload Mechanism**:
    - Users can upload JSON/YAML files containing a collection of "Ideas."
- Build the **Idea List View**:
    - A searchable and categorized list of architectural concepts (e.g., Semantic Endpointing, AEC).
- Implement the **Interactive Idea Viewer**:
    - A rich view that combines text (Progressive Disclosure) with **interactive SVG diagrams** for each idea.
- Support for complex concepts like:
    - Semantic Endpointing
    - Sentence-Boundary Streaming
    - Backchannel Filtering
    - Latency Masking
    - Acoustic Echo Cancellation (AEC)
    - Speculative Execution

## Technical Details
- **UI:** A new `LibraryView` component in the VS Code shell.
- **Rendering:** Integration with D3.js and React Flow for the interactive diagrams within each idea's deep dive.
- **Schema:** A new `IdeaLibrarySchema` defining text content and SVG/Diagram configuration.

## Constraints
- The library must be persistent across sessions once uploaded.
- Interactive diagrams must be responsive and follow the project's visual guidelines.

### Implementation Plan
# Implementation Plan - Interactive Ideas Library

This plan builds the Interactive Ideas Library, focusing on the upload mechanism and interactive rendering using a strict TDD approach.

## Phase 1: Library View & Activity Bar
- [ ] Task: Activity Bar Integration
    - [ ] **Write failing tests** for switching to the "Library" view via the Activity Bar.
    - [ ] Add the Library icon (Lucide) and implement the view toggle logic.
- [ ] Task: Library Upload Engine
    - [ ] **Write failing tests** for parsing and validating the `IdeaLibrarySchema`.
    - [ ] Implement the file upload handler for JSON/YAML library files.

## Phase 2: Idea Listing & Navigation
- [ ] Task: Idea List Component
    - [ ] **Write failing tests** for rendering the list of ideas from the uploaded state.
    - [ ] Build the searchable list view in the sidebar.
- [ ] Task: Navigation to Idea Viewer
    - [ ] Implement the routing/state change to open an idea's detail view in the editor area.

## Phase 3: Interactive Idea Viewer
- [ ] Task: Rich Text & Progressive Disclosure
    - [ ] **Write failing tests** for the summary -> deep-dive rendering of idea content.
    - [ ] Build the text viewer using the `KnowledgeAccordion` components.
- [ ] Task: Interactive Diagram Renderer
    - [ ] **Write failing tests** for instantiating interactive SVG/React Flow diagrams from the idea definition.
    - [ ] Build the diagram host that renders the custom interactive elements for each concept (e.g., a latency slider for AEC).

## Phase 4: Bundled Content & Final Verification
- [ ] Task: Bundle Standard Concepts
    - [ ] Create the standard library file containing the 6 mandated concepts (Endpointing, AEC, etc.).
- [ ] Task: Verification & Persistence
    - [ ] **Write failing tests** for IndexedDB persistence of uploaded libraries.
    - [ ] Verify the end-to-end "Upload -> List -> Explore Diagram" flow.
- [ ] Task: Conductor - User Manual Verification 'Interactive Ideas Library' (Protocol in workflow.md)

---

## 7. Onboarding & Visualization Polish
### Specification
# Specification - Onboarding & Visualization Polish

## Overview
The final track focused on creating a seamless user experience through sample data, tutorials, and a robust Enterprise Knowledge Base.

## Goals
- Populate the **Enterprise Knowledge Base**:
    - Implement the "Progressive Disclosure" repository for core concepts:
        1. **Semantic Endpointing** (LLM-based silence detection)
        2. **Sentence-Boundary Streaming** (Chunking & TTS streaming)
        3. **Backchannel Filtering** (Handling "uh-huh" without barge-in)
        4. **Latency Masking** (Pre-fetching filler words like "Hmm, let me check")
        5. **Acoustic Echo Cancellation** (AEC)
        6. **Speculative Execution** (Pre-prompting before user finishes)
- Bake in **Sample Architectures**:
    - **"Cheapest 650ms Setup"**: Focused on cost-efficiency.
    - **"Ultra-Low Latency 200ms Setup"**: Focused on speed.
- Implement **Interactive Onboarding**:
    - A guided tour of the Activity Bar, Explorer, Tab system, and Inspector.
- Final **Visual Polish**:
    - Refine SVG animations for data flow, ripple effects, and congestion.

## Technical Details
- **Data:** Bundled JSON repository for the Knowledge Base and Baseline Architectures.
- **UI:** `react-joyride` or custom tour overlay for the IDE shell.

## Constraints
- Knowledge Base entries must strictly follow the "Summary -> Deep Dive" progressive disclosure mandate.

### Implementation Plan
# Implementation Plan - Onboarding & Visualization Polish

This plan focuses on final data bundling, knowledge base population, and UI polish.

## Phase 1: Knowledge Base & Baselines
- [ ] Task: Populate Enterprise Knowledge Base
    - [ ] **Write failing tests** for the progressive disclosure component rendering the specific 6 concepts (Endpointing, AEC, etc.).
    - [ ] Draft the "Summary" and "Deep Dive" content for each concept.
- [ ] Task: Create Baseline Architectures
    - [ ] Define the "Cheapest 650ms" and "Ultra-Low Latency 200ms" JSON definitions.
    - [ ] Verify both load correctly into the Tab system.

## Phase 2: Interactive Guided Tour
- [ ] Task: VS Code Shell Tour
    - [ ] **Write failing tests** for the tour step sequence (Activity Bar -> Explorer -> Tabs -> Inspector).
    - [ ] Implement the interactive tour highlighting the IDE features.

## Phase 3: Final Visual Polish
- [ ] Task: SVG Animation Fine-tuning
    - [ ] Polish the animated data packets and "congestion" ripple effects.
- [ ] Task: Final CSS Audit
    - [ ] Ensure all monospaced fonts, dark mode colors, and borders match the "VS Code online" aesthetic.

## Phase 4: Final Verification
- [ ] Task: End-to-End User Flow Audit
    - [ ] Verify the "Blank Start -> Open Tab -> Click-to-Replace -> Parallel Simulate" flow.
- [ ] Task: Conductor - User Manual Verification 'Onboarding & Visualization Polish' (Protocol in workflow.md)

---

## 8. Simulation Engine
### Specification
# Specification - Simulation Engine

## Overview
This track builds the core simulation engine responsible for executing the logic defined in component scripts and visualizing the complex "ripple effects" of performance and errors.

## Goals
- Develop a **Scriptable Execution Engine**:
    - Execute component behavior defined in scripts (JS/TS-based).
    - Handle complex logic for data transformation and decision-making within a node.
- Implement **Error Propagation & Ripple Effects**:
    - Model how a failure in one component affects downstream nodes.
    - Visualize **Congestion**: Show back-pressure or slowed data flow when a bottleneck occurs.
- Support **High-Density Parallel Channels**:
    - Simulate hundreds of parallel "calls" with independent telemetry.

## Technical Details
- **Execution:** A sandboxed or isolated runtime for component scripts (to prevent simulation crashes).
- **Ripple Logic:** A graph-traversal algorithm that propagates state changes (latency, error) down the chain.
- **Visualization:** Integration with D3.js to animate the "congestion" (e.g., slowing down packet animations on edges).

## Constraints
- Script execution must be performant enough to not lag the UI thread.
- Error propagation must be traceable via the Simulation Time-Travel feature.

### Implementation Plan
# Implementation Plan - Simulation Engine

This plan builds the script-driven simulation engine and ripple-effect logic using a strict TDD approach.

## Phase 1: Script Execution Foundation
- [ ] Task: Component Script Runner
    - [ ] **Write failing tests** for executing a basic JS script within a node context.
    - [ ] Implement the `ScriptRuntime` to evaluate component behavior.
- [ ] Task: Parameter-Script Binding
    - [ ] **Write failing tests** for passing parameters (latency, range) into the script context.
    - [ ] Implement the data binding between the schema and the runtime.

## Phase 2: Ripple Effects & Error Handling
- [ ] Task: Error Propagation Logic
    - [ ] **Write failing tests** for downstream failure when a parent node errors out.
    - [ ] Implement the propagation algorithm to update downstream state.
- [ ] Task: Congestion & Back-pressure Modeling
    - [ ] **Write failing tests** for increased latency in downstream nodes when a parent is slow.
    - [ ] Implement the "Ripple" logic for performance degradation.

## Phase 3: High-Density Simulation & Visualization Hooks
- [ ] Task: Parallel Channel Execution
    - [ ] **Write failing tests** for handling 100+ concurrent parallel scripts.
    - [ ] Implement the multi-channel simulation coordinator.
- [ ] Task: Congestion Visualization Hooks
    - [ ] **Write failing tests** for emitting "Congestion" telemetry events.
    - [ ] Create hooks for the UI to trigger "slowing" animations in the SVG diagram.

## Phase 4: Verification & Integration
- [ ] Task: Time-Travel Verification
    - [ ] Verify that script state is correctly captured in the history for time-travel.
- [ ] Task: Conductor - User Manual Verification 'Simulation Engine' (Protocol in workflow.md)

---

## 9. System of Systems
### Specification
# Specification - System of Systems

## Overview
The "System of Systems" feature allows for recursive architectural modeling. A single component in a high-level architecture can represent an entire sub-system with its own nodes, connections, and logic. This enables architects to model complex hierarchies while maintaining a clean, manageable top-level view.

## Goals
- **Recursive JSON Schema**: Update the architecture definition to allow a `subArchitecture` property on nodes.
- **Drill-down Navigation**: 
    - Interaction: Double-clicking a component with a `subArchitecture` opens that sub-system in the editor.
    - Breadcrumbs: A navigation bar showing the path from the root system to the current sub-system (e.g., `Root > Voice Gateway > ASR Engine`).
- **Hierarchical Simulation**:
    - Stepping Into: The simulation engine can run simulations within a sub-system.
    - Aggregate Metrics: The parent component in the higher-level view reflects aggregate telemetry from its sub-system (e.g., total latency = sum of internal latencies).
- **Sub-system Context**: Sub-systems must be able to reference inputs and outputs of their parent node (proxy sockets).

## Technical Details
- **Schema**: 
    - `Node` interface will include an optional `subArchitectureId: string` or `subArchitecture: Architecture`.
- **UI**:
    - Integration with `ArchitectureCanvas` to handle "focus" levels.
    - Breadcrumb component in the Editor header.
- **Simulation**:
    - The `SimulationEngine` will use a recursive traversal or a flat graph representation with "virtual" nodes for sub-systems.

## Constraints
- Avoid infinite recursion (circular sub-architecture references).
- Drill-down must maintain undo/redo history across levels.
- Simulation performance must not degrade exponentially with depth.

### Implementation Plan
# Implementation Plan - System of Systems

This plan outlines the steps to implement hierarchical architectures and drill-down simulation.

## Phase 1: Recursive Schema & Data Model [checkpoint: c935401]
- [x] Task: Update Architecture Schema [2d0d538]
    - [x] **Write failing tests** for recursive schema validation (detecting cycles, validating sub-architecture links).
    - [x] Update `Architecture` and `Node` interfaces to support `subArchitectureId`.
- [x] Task: Mock Data for Hierarchical Systems [09e674a]
    - [x] Create a sample "System of Systems" JSON configuration for a Voice Gateway containing an internal ASR and VAD system.

## Phase 2: Drill-down UI & Navigation
- [ ] Task: Breadcrumb Component
    - [ ] **Write failing tests** for breadcrumb path generation from a hierarchical state.
    - [ ] Build the `Breadcrumbs` UI component and integrate it into the Shell header.
- [ ] Task: Drill-down Interaction
    - [ ] **Write failing tests** for the "Step Into" action (updating the active view context).
    - [ ] Implement double-click handler on React Flow nodes to navigate into sub-architectures.

## Phase 3: Recursive Simulation Engine
- [ ] Task: Hierarchical Event Propagation
    - [ ] **Write failing tests** for event passing between parent nodes and internal sub-system sockets.
    - [ ] Update `SimulationEngine` to resolve sub-architectures during the event loop.
- [ ] Task: Aggregate Telemetry
    - [ ] **Write failing tests** for latency aggregation (bubbling up sub-system latency to parent).
    - [ ] Implement metric collectors that aggregate internal node states.

## Phase 4: Verification & Polish
- [ ] Task: Visual Cues for Sub-systems
    - [ ] Add visual indicators (e.g., a "sub-system" icon or miniature preview) to nodes that contain sub-architectures.
- [ ] Task: Conductor - User Manual Verification 'System of Systems'

---

## 10. Visualizer Foundation
### Specification
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

### Implementation Plan
# Implementation Plan - Visualizer Foundation

This plan outlines the steps to build the core architecture schema and the VS Code-style UI foundation.

## Phase 1: IDE Shell & Tab Management
- [x] Task: Project Scaffolding (Next.js) [2e093d7]
    - [x] Initialize Next.js + Tailwind + Lucide project.
    - [x] Install layout dependencies: `react-resizable-panels`, `reactflow`.
- [x] Task: VS Code Shell Implementation [45eaece]
    - [x] **Write failing tests** for the Activity Bar and Sidebar switching logic.
    - [x] Build the Shell: Activity Bar, Explorer Sidebar, and Editor Area.
- [x] Task: Tab Management System [39d6040]
    - [x] **Write failing tests** for opening, closing, and switching between architecture tabs.
    - [x] Implement the Zustand store for `openTabs` and `activeTabId`.
    - [x] Build the Top Tab Bar UI.

## Phase 2: Typed Schema & Progressive Disclosure [checkpoint: 9094164]
- [x] Task: Define Typed Architecture Schema [b042325]
    - [x] **Write failing tests** for socket count and type validation logic.
    - [x] Implement TypeScript interfaces for `Socket`, `TypedConnection`, and `CompatibilityList`.
- [x] Task: Progressive Disclosure Components [1bf3c89]
    - [x] **Write failing tests** for the summary/deep-dive expansion logic.
    - [x] Build a reusable `KnowledgeAccordion` component using Tailwind.

## Phase 3: Canvas & Rendering [checkpoint: a355c5e]
- [x] Task: React Flow Integration [a674292]
    - [x] **Write failing tests** for rendering a multi-socket architecture from the tab state.
    - [x] Implement the `ArchitectureCanvas` with custom multi-socket nodes.
- [x] Task: Blank State UI [c8578ed]
    - [x] Build the editor splash screen for the blank state.

## Phase 4: Verification & Integration [checkpoint: 614efcc]
- [x] Task: Documentation & Cleanup [4c62437]
    - [x] Document the typed schema and Tab/Layout patterns.
- [x] Task: Conductor - User Manual Verification 'Visualizer Foundation' [614efcc]
