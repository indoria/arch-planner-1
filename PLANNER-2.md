# Architecture Planner

This application is a generic architecture planning and simulation tool, designed to be architecture-agnostic. It helps explore and design systems of systems. Originally conceived for voice AI systems, it is built so any modular system — cloud infrastructure, business processes, network topology, or anything else — can be loaded as a domain and modeled the same way.

**This document supersedes `PLANNER.md`.** Every track in that file is carried forward here — completed checkpoints keep their real commit hashes and stay checked — but every track is deepened, and eight tracks are new. Three specific gaps identified in a review of `PLANNER.md` are fixed explicitly and called out where they're addressed: (1) an architecture, once built, can be promoted into a reusable component for *other* architectures, not just decomposed internally; (2) simulation produces a structured, listable bottleneck report, not only a visual congestion cue; (3) export → import is guaranteed, by an explicit round-trip test, to reproduce identical component placement.

## Vision
To provide a highly interactive, architecture-agnostic playground for designing, simulating, and analyzing modular system architectures — voice AI stacks first, with the engine kept fully decoupled from that domain so any other kind of system can be loaded the same way. The tool bridges theoretical architecture and practical performance modeling, serving as a learning platform, a professional design sandbox, and — as it hardens — a real multi-tenant product.

Two ideas anchor everything else in this plan:
- **System of systems.** Any component can itself be a system, recursively, without limit. The user drills down for detail and rolls up for the big picture, and — critically — an architecture that's been designed and simulated can itself become a component available to *other, unrelated* architectures, not just a decomposition trapped inside the node that spawned it.
- **Validation vs. Verification.** Validation is design-time, simulation-driven: is this a good design? Verification is post-build: was it built as designed? The engine is Validation-first; Verification (checking a model against a real, live deployment) is a later, domain-dependent capability, not assumed everywhere.

## Core Principles
- **Agility:** Easily swap components or reconfigure architectures.
- **Transparency:** Progressive disclosure of component details, latency, cost, and functionality.
- **Extensibility:** The engine is decoupled from domain-specific data, allowing new architecture types to be loaded.
- **Composability:** A system's components can themselves be systems. Reuse — not just decomposition — is a first-class operation.
- **Deterministic rigor:** Simulation and validation are deterministic and rules-based. No model inference sits in the execution path; the numbers a user sees are reproducible from the same seed every time.

## How to use as a Planner
1. **Import domain knowledge:** Load a Component Definition set (behavioral models, sockets, properties, cost functions) independently or embedded with an architecture.
2. **Define or upload an architecture:** Build on the canvas from the Component Repository, or load a JSON/YAML configuration representing nodes and data-flow lines.
3. **Configure the simulator:** Set parameters (latency ranges, error probabilities, load profile) per component.
4. **Simulate:** Run the simulation to model performance, bottlenecks, and costs — and get a structured report, not just a live animation.
5. **Iterate:** Swap components, reposition them, drill into or promote sub-systems, and see updated metrics instantly.
6. **Export, reshare, reuse:** Export with guaranteed layout fidelity; share or embed a read view; promote a finished architecture into the Component Repository for reuse elsewhere.

---

# Product Definition — Architecture Planner

## Vision
To provide a highly interactive, architecture-agnostic playground for designing, simulating, and analyzing modular system architectures, with voice-based communication systems (VAD, ASR, LLM, TTS orchestration) as the flagship domain proving the engine out.

## Target Users
- **System Architects** designing complex real-time communication and AI orchestration systems.
- **LLM/Voice AI Developers** exploring the integration of VAD, ASR, LLM, and TTS components.
- **Students/Researchers** studying distributed systems, low-latency requirements, and modern voice stacks.
- **Platform/Infrastructure Teams** (as the product matures toward multi-tenant use) evaluating the tool for org-wide adoption — this is the audience Tracks 10–11 exist for.

## Core Features
- **SVG/Canvas Architecture Visualizer:** Interactive, high-fidelity diagrams of components and their relationships.
- **End-to-End Simulator:** Full-run simulation with configurable parameters for latency, jitter, error, and load scenarios.
- **Agnostic Architecture Engine:** Plug-and-play ingestion of architecture and component definitions for any modular system.
- **Component Repository & Drag-and-Drop Builder:** Visual construction from pre-defined or custom components.
- **System of Systems:** Recursive decomposition *and* recursive reuse — drill down, roll up, and promote a finished architecture into a reusable component.
- **Structured Analysis Output:** A real bottleneck report (not just an animation), cost breakdown, and latency percentiles per run.
- **Guaranteed-Fidelity Export/Import:** What you export is exactly what you get back, including layout.

## Simulation & Analysis Goals
- **Logic & Flow Visualization:** Deep dive into data movement and error handling within a run.
- **Performance Modeling:** Realistic latency and throughput estimation to identify bottlenecks — surfaced as both a visual and a structured, exportable list.
- **Resource & Cost Analysis:** Per-component cost functions rolled up into an architecture-level cost estimate.

## Interactivity & UX
- **Live Parameter Tuning:** Real-time adjustment of component parameters during active simulations.
- **Simulation Time-Travel:** Pause, rewind, and inspect any point in the simulation timeline.
- **Interactive Diagrams:** Direct manipulation of diagram elements to inspect component health and metadata.
- **Recursive Drill-Down & Roll-Up:** Open a component's internal architecture full-screen; breadcrumb back up; see aggregate metrics bubble up automatically.

---

# Product Guidelines — Architecture Planner

## Visual Aesthetic: Modern Technical
- **Design Philosophy:** Prioritize clarity, readability, and data density — a high-end technical dashboard, not a marketing page.
- **Color Palette:** Professional neutrals (grays, whites, dark blues) with high-contrast accents for active states and alerts. Where color encodes meaning (a mode, a severity, a trust tier), it must encode *only* that — never used decoratively elsewhere, so the signal stays legible.
- **Typography:** Clean sans-serif for general UI; monospaced for data values, IDs, and component parameters.

## Tone & Voice: Instructive & Collaborative
- **Communication Style:** A peer mentor — supportive, knowledgeable, encouraging.
- **Documentation & Tooltips:** Clear, jargon-free by default; technical definitions available on demand, not forced.
- **Error Messages:** Resolution-focused, never blame-focused — a clear path to fix the issue.

## UX Principles
- **Instant Feedback:** Every interaction (tuning a parameter, dragging a component) produces immediate visual or data feedback.
- **Non-Destructive Design:** Robust undo/redo, including **across drill-down levels** — undoing after rolling up must still be possible and must not corrupt the level you left.
- **Just-in-Time Learning:** Help markers and tooltips explaining *why* a choice affects performance (e.g. "Increasing LLM context length may increase first-token latency").

## Diagramming & Visualization Standards
- **Standardized Components:** A consistent icon set per domain (VAD, ASR, LLM, TTS, Orchestrator for the voice domain; the equivalent for any other loaded domain).
- **Semantic Color Coding:** A traffic-light or gradient system for real-time health, latency, or cost.
- **Dynamic Data Flow:** Animated packets moving along connections during simulation, making bottlenecks visually obvious.
- **Recursion Cues:** A node with an internal architecture (or a promoted, reused architecture) carries a distinct, consistent visual marker — a user should never be surprised that a node is drillable.

---

# Tracks

## 1. IDE Shell & Global Navigation
*Evolves `PLANNER.md` Track 10 "Visualizer Foundation." Phases 1–4 below are already complete and carried forward unchanged; Phase 5 is new.*

### Specification
# Specification - IDE Shell & Global Navigation

## Overview
Establishes the VS Code-inspired application shell: activity bar, tab management, typed schema foundation, and progressive disclosure primitives. Phase 5 extends the original two-destination shell (Explorer/Extensions) into three explicit, persistent destinations — Architectures, Domains, Settings — plus a command palette and account menu, matching the fuller navigation model worked out since the original foundation shipped.

## Goals
- *(carried forward, complete)* Typed schema with typed sockets and compatibility lists; VS Code IDE shell; tab management (`openTabs`, `activeTabId`); progressive disclosure components; blank-state splash screen.
- *(new)* Restructure the activity bar into three persistent, app-level destinations rather than two: **Architectures** (the file-explorer-style view, unchanged in spirit from the original Explorer), **Domains** (a new, dedicated reference view — see Track 2 — replacing "Extensions" as a more accurate name for what it actually is: browsing installed component knowledge, not installing app extensions), and **Settings**.
- *(new)* Add a persistent **account menu** anchored beneath the activity bar (profile, preferences, sign-out) — lightweight, a popover, not a full workspace view.
- *(new)* Add a **command palette** (`⌘K`) for fuzzy-searchable navigation and action dispatch.
- *(new)* Add a **breadcrumb** in the shell header reflecting the active view and, once inside an architecture, the active drill-down path (Track 4 owns the path data; this track owns rendering it).

## Technical Details
- **Framework:** Next.js + Tailwind CSS + Lucide React *(unchanged)*.
- **Layout:** `react-resizable-panels` for the IDE shell *(unchanged)*.
- **State:** Zustand store managing the tab array and active ID *(unchanged)*; extend with an `activityView: 'architectures' | 'domains' | 'settings'` slice and a `drillPath` slice per open tab.
- **Command palette:** a lightweight local command registry (navigation actions first; extensible to arbitrary registered actions later) with fuzzy matching over labels.

## Constraints
- The UI must remain responsive and modular to allow future panes without shell rework.
- Socket typing must be enforced at the schema level *(unchanged)*.
- Renaming "Extensions" to "Domains" must not break any already-implemented Explorer/sidebar code paths — this is a relabel-and-extend, not a rewrite, of Phase 1–4 work.

### Implementation Plan
# Implementation Plan - IDE Shell & Global Navigation

## Phase 1: IDE Shell & Tab Management [x]
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

## Phase 5: Three-Destination Navigation, Command Palette & Account Menu
- [ ] Task: Activity Bar Restructure
    - [ ] **Write failing tests** for switching between Architectures/Domains/Settings and for the active-state styling.
    - [ ] Relabel "Explorer" → **Architectures**, relabel and re-scope "Extensions" → **Domains** (see Track 2 for what now lives there), add **Settings** as a third destination.
    - [ ] Add the account menu popover anchored below the activity bar (profile, preferences, sign-out).
- [ ] Task: Command Palette
    - [ ] **Write failing tests** for palette open/close, focus trap, and Escape-to-close.
    - [ ] Implement the command registry and fuzzy filter; wire the initial navigation commands.
- [ ] Task: Breadcrumb
    - [ ] **Write failing tests** for breadcrumb rendering from `activityView` and, when inside an architecture, from `drillPath`.
    - [ ] Build the breadcrumb component and integrate it into the shell header.
- [ ] Task: Conductor - User Manual Verification 'IDE Shell & Global Navigation' (Protocol in workflow.md)

---

## 2. Domain & Component Knowledge System
*Evolves `PLANNER.md` Track 2 "Agnostic Loader & External Integration" — this track keeps that track's loading/validation half and turns the "Component Repository" into a fully browsable, versioned reference system. The export/import half of the original track moves to Track 8.*

### Specification
# Specification - Domain & Component Knowledge System

## Overview
Formalizes what a "domain" is (a versioned collection of Component Definitions, optionally grouped into sub-domains) and builds the browsing experience for it, alongside the loader and diagnostic engine that makes the whole tool architecture-agnostic. This is also where the **cost-model gap** gets closed: every Component Definition must carry a cost function, not just a behavioral model, because the Analysis track (Track 7) has nothing to aggregate otherwise.

## Goals
- Formalize and version the Architecture Definition Schema and the Component Definition Schema as genuinely separate, independently loadable artifacts.
- Support flexible loading: independent files, or an embedded architecture file that includes its component models.
- Build the **Component Repository** as a real, versioned, searchable structure — Domain → optional Sub-domain → Component — not just a flat list assembled from whatever was last uploaded.
- Every Component Definition includes: typed sockets (in/out, protocol, cardinality), properties, a behavioral model reference, and **a cost function** (parameterized by properties and simulated load — the fix for the earlier gap where cost aggregation had no defined source).
- Implement the **Diagnostic/Validation Engine** that complains clearly when connection info or behavioral models are missing or incompatible.
- Build the **Domain & Component browsing UI**: a searchable tree (Domain → Sub-domain → Component) and a component detail view with Overview / Interface / Properties / Compatibility / Variants tabs.

## Technical Details
- **Schema Validation:** `Zod` for runtime validation (preferred over `Ajv` for TypeScript-native inference).
- **Parsing:** `js-yaml` for YAML support.
- **Component Registry:** a dedicated, versioned store — not just an in-memory list — supporting search and retrieval by domain/sub-domain.
- **Error Reporting:** structured `DiagnosticService` distinguishing "missing connectivity info" from "missing/invalid behavioral model" from "missing cost function."
- **Cost function shape:** `costModel: (properties, simulatedLoad) => number`, stored alongside the behavioral script reference, evaluated by Track 5's simulation engine and aggregated by Track 7.

## Constraints
- The loader must handle invalid or incomplete files gracefully with clear, specific error reporting.
- A Component Definition without a cost function must fail validation with an explicit message — cost analysis silently reporting "0" for unmodeled components is treated as a bug, not a default.
- Socket typing must be enforced at the schema level, and checked at both load time and connection time (connection-time enforcement is built in Track 3).

### Implementation Plan
# Implementation Plan - Domain & Component Knowledge System

## Phase 1: Schema Formalization & Dual-Input Validation
- [ ] Task: Formalize Multi-Part Schema
    - [ ] **Write failing tests** for standalone Architecture definitions (missing models).
    - [ ] **Write failing tests** for standalone Component Definition models, including the required cost-function field.
    - [ ] **Write failing tests** for embedded definitions (architecture + models together).
    - [ ] Define the official schemas for connections, component models, and cost functions.
- [ ] Task: Diagnostic & Reporting Engine
    - [ ] **Write failing tests** for the "complaints" system (specific messages per failure category, including missing cost functions).
    - [ ] Implement the `DiagnosticService`.

## Phase 2: Agnostic Loading & Component Repository
- [ ] Task: Flexible Architecture Loader
    - [ ] **Write failing tests** for loading independent files and merging them into state.
    - [ ] **Write failing tests** for loading an embedded file.
    - [ ] Implement the `UnifiedLoader`.
- [ ] Task: Versioned Component Repository
    - [ ] **Write failing tests** for organizing components into Domain → Sub-domain → Component, and for version history per domain.
    - [ ] Implement the `ComponentRepository` store, including a domain version log (semver + change note).

## Phase 3: Domain & Component Browsing UI
- [ ] Task: Domain Tree
    - [ ] **Write failing tests** for tree rendering, expand/collapse, and search/filter across a large component set.
    - [ ] Build the searchable Domain → Sub-domain → Component tree in the Domains activity-bar destination (Track 1).
- [ ] Task: Component Detail Tabs
    - [ ] **Write failing tests** for each tab's data binding (Overview, Interface, Properties, Compatibility, Variants).
    - [ ] Build the five-tab component detail view, including the cost function surfaced under Properties.

## Phase 4: Verification & Documentation
- [ ] Task: Schema Documentation
    - [ ] Document the independent-vs-embedded loading strategy and the cost-function requirement.
- [ ] Task: Conductor - User Manual Verification 'Domain & Component Knowledge System' (Protocol in workflow.md)

---

## 3. Architecture Canvas & Component Editing
*Evolves `PLANNER.md` Track 5 "Edit State Implementation." Phase 1 below is complete and carried forward; Phases 2–4 are the original plan, now enriched.*

### Specification
# Specification - Architecture Canvas & Component Editing

## Overview
The direct-manipulation editing experience: adding components from the repository, repositioning them, replacing them with alternatives, and enforcing compatibility guardrails while doing so. This track also owns the **explicit repositioning requirement** feeding Track 8's position-fidelity guarantee — "move a component to place it better" needs to be a named, tested interaction, not an incidental side effect of the underlying canvas library.

## Goals
- *(carried forward, complete)* Left sidebar Component Repository with drag-and-drop onto the canvas.
- *(new, explicit)* **Reposition an existing node** on the canvas as its own tested interaction (drag an existing node, not just drop a new one) — this is what Track 8's export/import fidelity test depends on.
- Build the **Inspector** (right sidebar): specs, cost, latency, description for the selected node.
- Implement **Click-to-Replace**: a list of compatible alternative components (including declared **variants** of the same component, per Track 2) that instantly swaps the selected node.
- Implement **Architectural Guardrails**: enforce socket compatibility during drag-and-drop and click-to-replace.
- Surface the component's **cost function output** (given current properties and, once a simulation has run, current load) directly in the Inspector — closing the loop with Track 2's cost-model requirement.

## Technical Details
- **UI:** Right sidebar using `replaceComponent(nodeId, newComponentData)`.
- **Interaction:** Sidebar list of alternatives/variants, instantly updating the Zustand tab state; drag handling for both new-node placement and existing-node repositioning through the same underlying React Flow position API, so both paths produce identical, serializable `{x, y}` data.
- **Validation:** Guardrail logic validates a replace or connect action *before* applying it, reusing Track 2's compatibility schema.

## Constraints
- Click-to-replace must preserve existing valid connections where possible, or "complain" if the replacement is incompatible — never silently drop a connection.
- Every node position mutation (new placement or repositioning) must go through one code path, so Track 8 has a single, reliable source of position data to serialize.

### Implementation Plan
# Implementation Plan - Architecture Canvas & Component Editing

## Phase 1: Repository Sidebar & Drag-and-Drop [x, checkpoint: 05c77a1]
- [x] Task: Left Sidebar Component Repository [384f772]
    - [x] **Write failing tests** for list rendering and search.
    - [x] Build the Left Sidebar Component Repository UI.
- [x] Task: Drag-and-Drop to Canvas [05c77a1]
    - [x] Implement node creation in the active tab upon drop.

## Phase 2: Repositioning, Inspector & Click-to-Replace
- [ ] Task: Explicit Repositioning
    - [ ] **Write failing tests** for dragging an existing node and persisting its new `{x, y}` through the same position-update path used for new placements.
    - [ ] Implement/confirm repositioning goes through one shared position-update function.
- [ ] Task: Inspector UI
    - [ ] **Write failing tests** for node selection and data binding in the inspector, including the cost-function readout.
    - [ ] Build the Inspector UI (specs, cost, latency, description).
- [ ] Task: Click-to-Replace & Variant Swap
    - [ ] **Write failing tests** for `replaceComponent` (state update, connection preservation, variant-vs-alternative distinction).
    - [ ] Implement the alternatives/variants list in the inspector with instant swap.

## Phase 3: Guardrails & Feedback
- [ ] Task: Guardrail Enforcement
    - [ ] **Write failing tests** for preventing incompatible swaps/connections.
    - [ ] Implement real-time validation for drag-and-drop and click-to-replace.
- [ ] Task: "Complaints" System UI
    - [ ] Build the visual feedback for architectural violations, reusing Track 2's `DiagnosticService` messages.

## Phase 4: Persistence & Verification
- [ ] Task: IndexedDB Persistence
    - [ ] Implement save/load for the tab-based architecture array (local, session-level persistence — distinct from Track 8's export/import).
- [ ] Task: Conductor - User Manual Verification 'Architecture Canvas & Component Editing' (Protocol in workflow.md)

---

## 4. System of Systems & Recursive Composition
*Evolves `PLANNER.md` Track 9 "System of Systems." Phase 1 below is complete and carried forward. Phases 2–4 are the original plan, enriched; Phase 5 is entirely new and closes the biggest gap from the review: promoting a finished architecture into a reusable component.*

### Specification
# Specification - System of Systems & Recursive Composition

## Overview
Recursive architectural modeling: a component in a high-level architecture can represent an entire sub-system with its own nodes, connections, and logic — and, going further than the original plan, a *finished, standalone* architecture can be promoted into the Component Repository so it becomes available as a component for entirely different, unrelated architectures. This is the difference between "drilling into detail that already belongs to this one node" and genuine reuse.

## Goals
- *(carried forward)* Recursive JSON schema (`subArchitectureId` on nodes), drill-down navigation with double-click, breadcrumb path.
- *(carried forward)* Hierarchical simulation: step into a sub-system's simulation; aggregate metrics roll telemetry up to the parent.
- *(carried forward)* Sub-system context via proxy sockets referencing the parent node's own inputs/outputs.
- *(new, promoted from "constraint" to "validated rule")* **Boundary consistency is enforced, not just structurally possible.** A sub-architecture's proxy sockets must satisfy its parent component's own socket contract — the Diagnostic Engine (Track 2) must check this on every edit to the sub-architecture, exactly the way any other socket-compatibility violation is checked, not left as an implementation detail nobody validates.
- *(new)* **Undo/redo across drill levels**, promoted from a constraint to explicitly tested behavior: undoing after rolling up must not corrupt the level left behind, and must not silently no-op.
- *(new)* **Reference resolution model, decided explicitly:** `subArchitectureId` resolves to a canonical, *shared* stored Architecture — editing it from any place it's used updates it everywhere, exactly like editing a Component Definition updates every instance that uses it. A separate, explicit **"Detach / make independent copy"** action exists for when a user wants to fork one instance without affecting others. (This resolves the ambiguity flagged in review: reuse is by-reference by default; copying is an opt-in, explicit action, never silent.)
- *(new — closes the main gap)* **Promote Architecture to Component:** any standalone architecture, once it's in a reasonable state (no unresolved diagnostic errors), can be published into the Component Repository. Publishing requires declaring which nodes' sockets become the new component's external interface (its own proxy-socket boundary) and produces a new Component Definition whose `subArchitectureId` points back at the promoted architecture — i.e., promotion and decomposition are the same underlying mechanism, just entered from opposite directions.

## Technical Details
- **Schema:** `Node.subArchitectureId: string`, resolving through the shared Component Repository store (Track 2), not an embedded copy, by default.
- **UI:** `ArchitectureCanvas` "focus" levels; `Breadcrumbs` component in the shell header (Track 1); a **"Promote to Component"** action in the Inspector/toolbar, with a boundary-socket-selection step.
- **Simulation:** `SimulationEngine` resolves sub-architectures recursively during the event loop (see Track 5 for black-box vs. glass-box expansion mode).
- **Reference vs. copy:** the store distinguishes `sharedArchitectureId` (live reference) from a materialized, detached copy created only via the explicit Detach action — never implicitly.

## Constraints
- Avoid infinite recursion — reject a link that would create a cycle back to an ancestor, checked at write time.
- Drill-down must maintain undo/redo history across levels (tested, not assumed).
- Simulation performance must not degrade exponentially with depth — an explicit expansion-depth limit is enforced server-/engine-side regardless of what a run requests.
- Because reuse is by-reference by default, **editing a promoted architecture from inside one consumer must be reflected the next time any other consumer opens it** — this needs an explicit invalidation/refresh story, not just a save.

### Implementation Plan
# Implementation Plan - System of Systems & Recursive Composition

## Phase 1: Recursive Schema & Data Model [x, checkpoint: c935401]
- [x] Task: Update Architecture Schema [2d0d538]
    - [x] **Write failing tests** for recursive schema validation (cycle detection, sub-architecture link validation).
    - [x] Update `Architecture` and `Node` interfaces to support `subArchitectureId`.
- [x] Task: Mock Data for Hierarchical Systems [09e674a]
    - [x] Create a sample System-of-Systems JSON configuration (a Voice Gateway containing an internal ASR and VAD system).

## Phase 2: Drill-down UI, Roll-Up & Undo/Redo
- [ ] Task: Breadcrumb Component
    - [ ] **Write failing tests** for breadcrumb path generation from hierarchical state.
    - [ ] Build the `Breadcrumbs` UI component and integrate it into the Shell header.
- [ ] Task: Drill-down & Roll-Up Interaction
    - [ ] **Write failing tests** for "step into" (updating active view context) and "roll up" (returning to a parent level, including aggregate-metric refresh).
    - [ ] Implement the double-click handler for drilling into sub-architectures and the breadcrumb-click handler for rolling up.
- [ ] Task: Cross-Level Undo/Redo
    - [ ] **Write failing tests** for undo/redo that spans a drill-down/roll-up boundary without corrupting either level's history stack.
    - [ ] Implement the history model change needed to support this (likely: history keyed per architecture id, with drill/roll-up itself as an undoable navigation event).

## Phase 3: Boundary Consistency & Recursive Simulation Engine
- [ ] Task: Boundary Consistency Validation
    - [ ] **Write failing tests** for a sub-architecture whose proxy sockets don't satisfy the parent component's declared socket contract.
    - [ ] Wire this check into Track 2's `DiagnosticService` as a first-class rule, not a separate code path.
- [ ] Task: Hierarchical Event Propagation
    - [ ] **Write failing tests** for event passing between parent nodes and internal sub-system proxy sockets.
    - [ ] Update `SimulationEngine` to resolve sub-architectures during the event loop.
- [ ] Task: Aggregate Telemetry
    - [ ] **Write failing tests** for latency/cost aggregation bubbling from a sub-system up to its parent.
    - [ ] Implement metric collectors that aggregate internal node states into the parent's displayed metrics.

## Phase 4: Promote Architecture to Component *(new — closes the primary review gap)*
- [ ] Task: Reference Resolution Model
    - [ ] **Write failing tests** distinguishing a shared, by-reference `subArchitectureId` from a detached, independent copy.
    - [ ] Implement the shared-reference resolution path as the default, and the explicit "Detach / make independent copy" action.
- [ ] Task: Promotion Flow
    - [ ] **Write failing tests** for promoting a standalone architecture into a Component Definition, including the boundary-socket-selection step and rejection when unresolved diagnostic errors exist.
    - [ ] Build the "Promote to Component" UI (Inspector/toolbar action) and the backing service that creates the new Component Definition pointing at the promoted architecture.
- [ ] Task: Update Propagation
    - [ ] **Write failing tests** confirming that editing a promoted (shared-reference) architecture from one consumer is reflected the next time any other consumer opens it.
    - [ ] Implement the refresh/invalidation mechanism.

## Phase 5: Verification & Polish
- [ ] Task: Visual Cues for Sub-systems
    - [ ] Add a distinct, consistent visual indicator to nodes with a `subArchitectureId` — and a second, visually distinguishable indicator for nodes referencing a *shared, reused* architecture versus one with a private/detached internal architecture.
- [ ] Task: Conductor - User Manual Verification 'System of Systems & Recursive Composition' (Protocol in workflow.md)

---

## 5. Simulation Engine Core
*Evolves `PLANNER.md` Track 8 "Simulation Engine," adding hierarchical (black-box/glass-box) expansion for recursive components and explicit chaos/what-if fault injection as a first-class capability rather than an implicit side effect of error propagation.*

### Specification
# Specification - Simulation Engine Core

## Overview
The core execution engine: runs component behavior scripts, propagates errors and performance degradation downstream ("ripple effects"), models congestion/back-pressure, and — new in this plan — explicitly supports both **black-box** simulation of a composite component (using its own declared behavior) and **glass-box** simulation (recursively expanding into its internal/sub-architecture), plus **operator-triggered chaos scenarios** (deliberately fail a component mid-run and watch the blast radius) as a named feature, not just an emergent property of the ripple-effect logic.

## Goals
- Develop a **Scriptable Execution Engine**: component behavior defined in JS/TS scripts, executed in an isolated runtime.
- Implement **Error Propagation & Ripple Effects**: model how a failure in one component affects downstream nodes; visualize congestion/back-pressure.
- Support **High-Density Parallel Channels**: hundreds of parallel simulated "calls" (or requests, or messages — domain-dependent) with independent telemetry.
- *(new)* **Hierarchical simulation fidelity:** for any node with a `subArchitectureId`, the engine supports **black-box mode** (use the component's own declared behavior — fast, default) and **glass-box mode** (recursively simulate the sub-architecture instead — slower, more accurate), selectable per run, with a hard expansion-depth limit enforced regardless of what's requested.
- *(new)* **Chaos scenarios as a first-class action:** an operator can select a running or completed simulation, choose a component, and inject a fault at a specific point on the timeline; the engine re-runs that branch forward and the blast radius is visualized and logged, distinctly from "naturally occurring" ripple effects during a normal run.

## Technical Details
- **Execution:** a sandboxed/isolated runtime for component scripts (prevents a bad script from crashing the whole simulation).
- **Ripple Logic:** graph-traversal algorithm propagating state changes (latency, error) downstream.
- **Hierarchical expansion:** the engine's event loop resolves a composite node either via its behavior script (black-box) or via a nested engine instance against its `subArchitectureId` (glass-box); depth-limited.
- **Chaos:** fault injection is a distinct engine entry point — `injectFault(runId, nodeId, atTimestamp)` — that branches the existing recorded trace rather than mutating it, so the original run remains inspectable.
- **Visualization:** integration with D3.js to animate congestion (slowing packet animation on edges) and chaos blast-radius (visually distinct from ordinary congestion).

## Constraints
- Script execution must be performant enough to not lag the UI thread.
- Error propagation and chaos-injected branches must both be traceable via Simulation Time-Travel (Track 6).
- Glass-box expansion depth is capped server-/engine-side — this is the same safeguard Track 4 requires for recursion in general, applied specifically to simulation cost.

### Implementation Plan
# Implementation Plan - Simulation Engine Core

## Phase 1: Script Execution Foundation
- [ ] Task: Component Script Runner
    - [ ] **Write failing tests** for executing a basic JS script within a node context.
    - [ ] Implement the `ScriptRuntime` to evaluate component behavior.
- [ ] Task: Parameter-Script Binding
    - [ ] **Write failing tests** for passing parameters (latency, range, cost inputs) into the script context.
    - [ ] Implement the data binding between the schema (Track 2) and the runtime.

## Phase 2: Ripple Effects, Error Handling & Chaos Injection
- [ ] Task: Error Propagation Logic
    - [ ] **Write failing tests** for downstream failure when a parent node errors out.
    - [ ] Implement the propagation algorithm to update downstream state.
- [ ] Task: Congestion & Back-pressure Modeling
    - [ ] **Write failing tests** for increased latency in downstream nodes when a parent is slow.
    - [ ] Implement the ripple logic for performance degradation.
- [ ] Task: Chaos Scenario Injection
    - [ ] **Write failing tests** for `injectFault(runId, nodeId, atTimestamp)` producing a new branched trace without mutating the original.
    - [ ] Implement fault injection and the blast-radius propagation through the existing ripple-effect logic.

## Phase 3: Hierarchical Fidelity & High-Density Simulation
- [ ] Task: Black-Box / Glass-Box Expansion
    - [ ] **Write failing tests** for a composite node simulating via its own behavior (black-box) vs. recursively via its `subArchitectureId` (glass-box), selectable per run.
    - [ ] Implement the nested-engine-instance expansion path and the server-enforced depth limit.
- [ ] Task: Parallel Channel Execution
    - [ ] **Write failing tests** for handling 100+ concurrent parallel scripts/calls.
    - [ ] Implement the multi-channel simulation coordinator.
- [ ] Task: Congestion & Chaos Visualization Hooks
    - [ ] **Write failing tests** for emitting congestion and chaos-blast-radius telemetry events, distinctly.
    - [ ] Create hooks for the UI to trigger the two visually distinct animations.

## Phase 4: Verification & Integration
- [ ] Task: Time-Travel Verification
    - [ ] Verify script state, ripple state, and chaos-injected branches are all correctly captured in history for time-travel.
- [ ] Task: Conductor - User Manual Verification 'Simulation Engine Core' (Protocol in workflow.md)

---

## 6. Advanced Simulation UI
*Carries forward `PLANNER.md` Track 1 "Advanced UI Features" largely as originally planned — this remains a genuinely strong addition beyond the original enterprise-scale discussion, kept intact.*

### Specification
# Specification - Advanced Simulation UI

## Overview
Implements Simulation Time-Travel and parallel split-screen simulations for architectural comparison, leveraging the VS Code IDE paradigm already established in Track 1.

## Goals
- Implement **Split-Screen Parallel Simulations**: a dedicated UI mode (VS Code Diff-style) instantiating two editor areas side-by-side, loading two architectures from open tabs for parallel execution, with synchronized playback and transcript scrolling.
- Implement **Simulation Time-Travel**: full pause, rewind, and state inspection within any tab or split-view, including chaos-injected branches (Track 5) and glass-box-expanded sub-runs (Track 5).

## Technical Details
- **UI:** a `SplitViewCoordinator` managing two parallel `ArchitectureCanvas` instances.
- **Logic:** synchronized clock and event broadcasting for parallel simulation runs.
- **State:** history snapshots supporting multi-instance time-travel, including nested/hierarchical run branches.

## Constraints
- Parallel simulations must handle independent ripple effects, chaos branches, and error states for each architecture.
- Splitting the view must preserve the current state of both architectures.

### Implementation Plan
# Implementation Plan - Advanced Simulation UI

## Phase 1: Simulation Time-Travel
- [ ] Task: History Manager & State Snapshots
    - [ ] **Write failing tests** for state capture and restoration, including chaos-branch and glass-box-nested state.
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
    - [ ] Build the UI to display comparison deltas (e.g. "Arch A is 20ms faster than Arch B", "Arch A is $340/mo cheaper").

## Phase 4: Verification & Integration
- [ ] Task: Stress Test Parallel Sims
    - [ ] Verify performance stability with two active high-density simulations.
- [ ] Task: Conductor - User Manual Verification 'Advanced Simulation UI' (Protocol in workflow.md)

---

## 7. Analysis & Metrics Dashboard
*Evolves `PLANNER.md` Track 3 "Analysis & Metrics Dashboard" — closes the second review gap by adding a structured, exportable bottleneck report alongside the original visual congestion cues.*

### Specification
# Specification - Analysis & Metrics Dashboard

## Overview
The analytical layer: a VS Code-style Call Log/transcript pane, telemetry overlays on the diagram itself, and a metrics dashboard for aggregated cost/latency/throughput. New in this plan: an explicit, structured **Bottleneck Report** — a listable, exportable artifact naming which components exceeded a threshold and why, not solely a congestion animation a user has to watch to notice.

## Goals
- Build the **Call Log / Transcript Pane**: resizable, collapsible, bottom-of-shell, real-time display of data flowing through components.
- Implement **Telemetry Visualization**: overlay metrics directly onto nodes and edges.
- Build the **Metrics Dashboard**: aggregated latency, cost, throughput.
- *(new — closes a review gap)* Build the **Bottleneck Report**: after a run, a structured list of flagged components — id, name, reason (e.g. "queue depth exceeded threshold for 40% of run duration", "p95 latency 3.1× the architecture median"), severity — separate from and complementary to the congestion animation. This report must be exportable (Track 8) and diffable across two runs (feeding Track 6's comparison UI).

## Technical Details
- **UI:** Virtualized list for the Call Log to handle high-volume simulation data.
- **Visuals:** React Flow overlays for telemetry; Chart.js for dashboard graphs.
- **Bottleneck detection:** rule-based thresholds evaluated against the completed run's trace (e.g. queue-depth-over-time, latency-percentile-vs-median) — deterministic and inspectable, not a black box itself.
- **Layout:** integration with `react-resizable-panels` from the shell foundation.

## Constraints
- The Call Log must support filtering by transaction ID or component.
- The UI must remain responsive even with rapid simulation event updates.
- The Bottleneck Report's thresholds must be visible/configurable, not hardcoded invisibly — a user must be able to see *why* something was flagged.

### Implementation Plan
# Implementation Plan - Analysis & Metrics Dashboard

## Phase 1: Call Log & Transcript Pane
- [ ] Task: Call Log Component
    - [ ] **Write failing tests** for real-time log appending and virtualization.
    - [ ] Build the `CallLogPane` with auto-scroll and filtering.
- [ ] Task: Transcript Mapping
    - [ ] **Write failing tests** for mapping simulation data to the log view.
    - [ ] Implement the transformation from simulation events to log entries.

## Phase 2: Telemetry Overlay
- [ ] Task: SVG Telemetry Overlay
    - [ ] **Write failing tests** for dynamic node/edge label updates.
    - [ ] Implement the React Flow overlay for real-time latency and status.

## Phase 3: Metrics Dashboard & Bottleneck Report
- [ ] Task: KPI Calculation Engine
    - [ ] **Write failing tests** for cost and latency aggregation, pulling per-component cost functions from Track 2.
    - [ ] Build the metrics aggregation logic.
- [ ] Task: Metrics Dashboard UI
    - [ ] **Write failing tests** for dashboard layout and chart rendering.
    - [ ] Implement the metrics pane in the shell.
- [ ] Task: Bottleneck Report *(new)*
    - [ ] **Write failing tests** for threshold-based bottleneck detection against a completed run's trace, and for the structured report shape (id, name, reason, severity).
    - [ ] Build the Bottleneck Report UI (listable, sortable) and wire configurable thresholds.

## Phase 4: Verification & Integration
- [ ] Task: Export System
    - [ ] Implement log, metric, and Bottleneck Report export (feeds Track 8).
- [ ] Task: Conductor - User Manual Verification 'Analysis & Metrics Dashboard' (Protocol in workflow.md)

---

## 8. Import, Export & Data Fidelity
*Evolves the export/import half of `PLANNER.md` Track 2. Closes the third review gap explicitly: guaranteed, tested position round-trip fidelity.*

### Specification
# Specification - Import, Export & Data Fidelity

## Overview
Comprehensive import/export: architectures with or without embedded component models, high-resolution SVG export, and — new in this plan — an explicit, tested guarantee that exporting and re-importing an architecture reproduces **identical component placement**, not just identical connectivity.

## Goals
- Implement the **Import/Export Service** for architectures, with and without embedded models.
- Implement **High-Res SVG Export**.
- *(new — closes a review gap)* Add `position: { x: number, y: number }` as an explicit, required field on every serialized `Node`, and treat it as load-bearing data, not incidental React Flow state.
- *(new)* Add an explicit **round-trip fidelity test**: given an architecture with manually repositioned nodes, export then re-import must reproduce byte-for-byte identical positions — this is a first-class acceptance test, not an assumption.
- Export the Bottleneck Report and metrics (Track 7) alongside the architecture, so a shared export is self-describing.
- Standardized, git-friendly JSON output for version control compatibility.

## Technical Details
- **Schema Validation:** `Zod`, shared with Track 2.
- **Parsing:** `js-yaml`.
- **Position serialization:** captured directly from React Flow's node position state at export time; on import, applied directly to node instantiation — one shared code path with Track 3's repositioning, so there's only one place position data can diverge.
- **SVG export:** self-contained (no external stylesheet dependency), suitable for embedding or printing.

## Constraints
- Exports must be Git-friendly (stable key ordering, no non-deterministic fields).
- The round-trip fidelity test is a release gate for this track — it does not ship without it passing.
- Exporting a shared/promoted architecture (Track 4) must clearly indicate that it's a reference and warn on import if the referenced architecture no longer exists or has changed since export.

### Implementation Plan
# Implementation Plan - Import, Export & Data Fidelity

## Phase 1: Position as First-Class Data
- [ ] Task: Explicit Position Field
    - [ ] **Write failing tests** asserting every serialized Node includes `position: {x, y}`.
    - [ ] Formalize this in the schema shared with Track 2/3, sourced from the same position-update path Track 3 uses for both placement and repositioning.

## Phase 2: Import/Export Service
- [ ] Task: Import/Export Core
    - [ ] **Write failing tests** for exporting architectures with and without embedded models.
    - [ ] Implement the `ExportService` for multi-format generation.
- [ ] Task: High-Res SVG Export
    - [ ] **Write failing tests** for SVG serialization and cleanup.
    - [ ] Implement the diagram-to-SVG export utility.
- [ ] Task: Report & Metrics Export
    - [ ] **Write failing tests** for including the Bottleneck Report and metrics summary in an export bundle.
    - [ ] Implement combined architecture + analysis export.

## Phase 3: Round-Trip Fidelity Guarantee *(new)*
- [ ] Task: Position Round-Trip Test
    - [ ] **Write failing tests**: given a manually repositioned architecture, export → re-import must reproduce identical positions for every node.
    - [ ] Fix any divergence found (this task is expected to surface and close real bugs, not just add coverage to already-correct code).
- [ ] Task: Shared-Reference Export Warnings
    - [ ] **Write failing tests** for import-time warnings when a referenced promoted architecture (Track 4) is missing or has changed since export.
    - [ ] Implement the warning UI.

## Phase 4: Verification & Documentation
- [ ] Task: Schema Documentation
    - [ ] Document the independent vs. embedded strategy and the position-fidelity guarantee explicitly.
- [ ] Task: Conductor - User Manual Verification 'Import, Export & Data Fidelity' (Protocol in workflow.md)

---

## 9. Validation & Verification Engine
*New track. Elevates the diagnostic/compatibility logic threaded through Tracks 2–4 into an explicit, named engine, and introduces Verification as an optional, domain-dependent capability distinct from Validation.*

### Specification
# Specification - Validation & Verification Engine

## Overview
**Validation** — is this a well-formed, internally consistent design? — has so far lived inside the Diagnostic Engine (Track 2), the guardrails (Track 3), and the boundary-consistency check (Track 4). This track consolidates those into one addressable engine with a consistent rule model, and adds **Verification** — checking a modeled architecture against a real, live system — as an explicit, optional capability, since it doesn't apply the same way to every domain (a purely conceptual voicebot design has nothing to verify against; a voicebot wired to real ASR/TTS/LLM provider accounts does).

## Goals
- Formalize a single **rule schema** (`id`, `description`, `severity`, `predicate`) used by every structural check in the system: missing sockets, socket-type mismatches, orphan components, boundary-consistency for sub-architectures, and any domain-specific rules a loaded Component Definition set brings with it.
- Rules re-evaluate continuously as the architecture is edited, not only on demand.
- Surface results in a **Problems panel**, distinct from the Call Log — severity, message, source rule id, affected node, click-to-select.
- *(new)* Define **Verification** as an opt-in capability: for domains where components can carry a "live reference" (e.g. an actual ASR provider account, an actual deployed endpoint), Verification compares the modeled properties against the real, queried configuration and reports drift. This is off by default and explicitly domain-gated — most voicebot playground use won't need it.

## Technical Details
- **Rule engine:** predicate evaluator over the current architecture graph, shared by Tracks 2–4 rather than duplicated per-track.
- **Problems panel:** bottom-panel tab, reusing the Call Log pane's resizable/collapsible shell from Track 7.
- **Verification connector (optional, domain-gated):** a narrow, read-only integration point a Component Definition can optionally declare (e.g. "this component type supports live verification against endpoint X"); absent by default.

## Constraints
- The rule engine must be the single source of truth — no track re-implements its own ad hoc validation logic once this track ships; Tracks 2–4 refactor onto it.
- Verification connectors are read-only by design — Verification never writes to or modifies a real, live system.
- A Verification connector, if used, must clearly disclose what it reads and never silently expand its own access.

### Implementation Plan
# Implementation Plan - Validation & Verification Engine

## Phase 1: Unified Rule Engine
- [ ] Task: Rule Schema & Evaluator
    - [ ] **Write failing tests** for the rule schema (id/description/severity/predicate) and predicate evaluation against a sample graph.
    - [ ] Implement the rule engine.
- [ ] Task: Migrate Existing Checks
    - [ ] **Write failing tests** confirming socket-compatibility (Track 3) and boundary-consistency (Track 4) checks produce identical results through the new engine as they did through their original ad hoc implementations.
    - [ ] Refactor Tracks 2–4's validation logic onto the shared engine.

## Phase 2: Problems Panel
- [ ] Task: Problems Panel UI
    - [ ] **Write failing tests** for live-updating problem list bound to the rule engine's output.
    - [ ] Build the Problems tab, click-to-select-node behavior, and severity/count badge.

## Phase 3: Verification (optional, domain-gated)
- [ ] Task: Verification Connector Interface
    - [ ] **Write failing tests** for a Component Definition optionally declaring a read-only verification connector, and for the absence case (most domains) being a clean no-op.
    - [ ] Implement the connector interface and a drift-report shape.
- [ ] Task: Drift Reporting UI
    - [ ] **Write failing tests** for surfacing verification drift results distinctly from design-time Problems.
    - [ ] Build the (initially minimal) drift report view.

## Phase 4: Verification & Integration
- [ ] Task: End-to-End Rule Coverage Audit
    - [ ] Confirm every previously-scattered validation check now runs through the unified engine with no regressions.
- [ ] Task: Conductor - User Manual Verification 'Validation & Verification Engine' (Protocol in workflow.md)

---

## 10. Backend Platform & Multi-Tenancy
*Evolves the foundation half of `PLANNER.md` Track 4 "Backend & Collaboration." Adds the multi-tenant/deployment-mode groundwork flagged as absent in review, phased so an MVP can still ship on the simpler original stack first.*

### Specification
# Specification - Backend Platform & Multi-Tenancy

## Overview
The server-side foundation: database, API, and — new in this plan — an explicit, phased path toward multi-tenant isolation and dual SaaS/self-hosted deployment, without forcing that complexity onto day one. Phase 1 ships the original, simpler single-workspace backend; Phase 3 adds the tenant model as a deliberate, tracked upgrade rather than a silent scope drop.

## Goals
- Set up a Node.js/Express (or Fastify) backend.
- Integrate PostgreSQL via Prisma for type-safe persistence.
- *(new, phased)* Introduce an explicit `Tenant` entity and tenant-scoped queries at the data-access layer — even a single-workspace MVP gets exactly one `Tenant` row, so the schema never needs a breaking migration to go multi-tenant later.
- *(new, phased)* Support two deployment modes recorded on the `Tenant` (`saas` | `self_hosted`) — initially both point at the same codebase/config, with real infrastructure separation deferred, but the field exists from day one.

## Technical Details
- **Backend:** Node.js + TypeScript + Express/Fastify.
- **Database:** Prisma ORM (PostgreSQL) — Mongoose/MongoDB is a documented alternative, not pursued unless Prisma proves insufficient.
- **Schema:** `Tenant (id, name, deployment_mode)`, `User (id, tenant_id, email, role)`, `Architecture (id, tenant_id, ...)`, `Component (id, tenant_id | null for global/shared, ...)`.
- **Tenant scoping:** enforced at the data-access layer (every query filtered by `tenant_id`), not only at the API route layer.

## Constraints
- The backend must stay lightweight and scalable.
- Every table holding user data carries `tenant_id` from the first migration — retrofitting it later is the single most expensive mistake this track can make, so it does not get deferred even though real multi-tenant *isolation enforcement* can be.
- A single-tenant MVP deployment must work with zero additional operational overhead versus the original simpler plan — the `Tenant` row is invisible to a solo user.

### Implementation Plan
# Implementation Plan - Backend Platform & Multi-Tenancy

## Phase 1: Backend Foundation & API
- [ ] Task: Project Scaffolding (Server)
    - [ ] Initialize Node.js + TypeScript + Express project.
    - [ ] **Write failing tests** for a basic health-check endpoint.
    - [ ] Implement the base server and logging infrastructure.
- [ ] Task: Database Integration
    - [ ] **Write failing tests** for the database connection and basic CRUD operations.
    - [ ] Set up Prisma and define `Tenant`, `User`, `Architecture`, and `Component` models — `Tenant` from day one, per the constraint above.

## Phase 2: Architecture Management API
- [ ] Task: Architecture CRUD API
    - [ ] **Write failing tests** for saving, retrieving, and updating architectures via the API, scoped by `tenant_id`.
    - [ ] Implement the architecture management endpoints with schema validation (Track 2).

## Phase 3: Multi-Tenancy Hardening
- [ ] Task: Tenant-Scoped Query Enforcement
    - [ ] **Write failing tests** proving a query cannot return another tenant's data even under a deliberately crafted request.
    - [ ] Enforce `tenant_id` filtering at the data-access layer, not just route guards.
- [ ] Task: Deployment Mode Field
    - [ ] **Write failing tests** for the `deployment_mode` field's presence and default value.
    - [ ] Add the field; document (do not yet implement) the self-hosted packaging path — see Track 16.

## Phase 4: Verification & Integration
- [ ] Task: Load & Isolation Testing
    - [ ] Verify tenant isolation holds under concurrent multi-tenant load, not just single-request tests.
- [ ] Task: Conductor - User Manual Verification 'Backend Platform & Multi-Tenancy' (Protocol in workflow.md)

---

## 11. Auth, RBAC & Security Hardening
*Evolves the auth half of `PLANNER.md` Track 4. Keeps the original fast-integration auth choice as the MVP path and adds an explicit enterprise-hardening phase.*

### Specification
# Specification - Auth, RBAC & Security Hardening

## Overview
User authentication and authorization, starting from the original fast-integration plan (Supabase/Firebase Auth) and adding, as an explicit later phase, the enterprise-readiness pieces flagged as absent in review: real SSO/SAML support and audit logging.

## Goals
- Implement user authentication and authorization via Supabase Auth or Firebase Auth for fast integration.
- Implement role-based access control (RBAC) on architecture and component resources.
- *(new, phased)* Add SSO/SAML support as an upgrade path once a real enterprise customer needs it — not built speculatively ahead of demand, but the RBAC model is designed so adding it doesn't require reworking role checks.
- *(new)* Implement an **audit log** — every privileged action (role change, architecture deletion, sharing-link creation) recorded immutably — since this is a baseline expectation the moment the product is positioned for team/enterprise use, not a nice-to-have.

## Technical Details
- **Auth:** Supabase Auth or Firebase Auth (MVP); SAML/OIDC via the same provider's enterprise tier, or a dedicated connector, once needed.
- **RBAC:** role stored on `User` (Track 10's schema), checked via middleware on every mutating route — same role set as previously scoped (`viewer`, `editor`, `admin`).
- **Audit log:** an `AuditLogEntry (id, tenant_id, actor_id, action, context, created_at)` table, written to on every privileged action server-side (never client-reported).

## Constraints
- Authentication must be secure and support social/email login providers at minimum.
- RBAC checks live in one shared middleware, not duplicated per-route — this is what makes the later SSO upgrade cheap.
- Audit log writes must not be skippable by a buggy or malicious client — they're triggered server-side as a side effect of the privileged action itself, not a separate client call.

### Implementation Plan
# Implementation Plan - Auth, RBAC & Security Hardening

## Phase 1: Auth Integration
- [ ] Task: Auth Integration (Supabase/Firebase)
    - [ ] **Write failing tests** for the authentication middleware and route protection.
    - [ ] Integrate the chosen auth provider and implement login/signup flows.

## Phase 2: RBAC
- [ ] Task: User Profiles & Permissions
    - [ ] **Write failing tests** for role-based access control on architecture resources.
    - [ ] Implement ownership and permission checks, via one shared middleware, for every mutating route.

## Phase 3: Audit Logging
- [ ] Task: Audit Log
    - [ ] **Write failing tests** confirming every privileged action produces exactly one audit entry, server-side.
    - [ ] Implement the `AuditLogEntry` table and the write-on-privileged-action hook.

## Phase 4: Enterprise SSO Upgrade Path (deferred until needed)
- [ ] Task: SSO/SAML Connector
    - [ ] **Write failing tests** for SSO login replacing/augmenting the MVP auth flow without breaking existing RBAC checks.
    - [ ] Integrate SAML/OIDC once a real customer requires it.
- [ ] Task: Conductor - User Manual Verification 'Auth, RBAC & Security Hardening' (Protocol in workflow.md)

---

## 12. Collaboration — Real-Time & Async
*Evolves the collaboration half of `PLANNER.md` Track 4, keeping its sharing/cloning scope and adding real-time co-editing, which review flagged as entirely absent.*

### Specification
# Specification - Collaboration — Real-Time & Async

## Overview
Sharing, cloning, and versioning (as originally planned), plus live multiplayer co-editing with presence — the gap flagged in review, where the original plan only supported asynchronous sharing.

## Goals
- Build a collaboration API for sharing, cloning, and versioning architectures.
- *(new)* Implement **real-time co-editing**: multiple users editing the same architecture simultaneously, with live cursors/presence.
- *(new)* Implement **comments/suggested edits** for asynchronous review, distinct from real-time co-editing.

## Technical Details
- **Sharing/cloning:** RESTful endpoints, as originally planned.
- **Real-time sync:** a CRDT library (e.g. Yjs) layered over the architecture document, broadcasting over WebSocket; this is additive to, not a replacement for, the REST CRUD API from Track 10.
- **Presence:** cursor position and active selection broadcast alongside CRDT updates.
- **Comments:** REST-based, anchored to a node/edge/region, with a resolved/unresolved state.

## Constraints
- Sharing features must handle permissions (view-only vs. edit access).
- Real-time sync must degrade gracefully to the last-saved REST state if the WebSocket connection drops — never lose local edits.
- Comments and real-time presence are independent features; either can ship without the other blocking it.

### Implementation Plan
# Implementation Plan - Collaboration — Real-Time & Async

## Phase 1: Sharing & Cloning
- [ ] Task: Collaboration & Sharing
    - [ ] **Write failing tests** for sharing links and "Clone" functionality.
    - [ ] Build the API and UI support for generating shareable architecture URLs.

## Phase 2: Real-Time Co-Editing
- [ ] Task: CRDT Sync
    - [ ] **Write failing tests** for two clients converging on the same document state after concurrent, conflicting edits.
    - [ ] Integrate a CRDT library and the WebSocket sync layer.
- [ ] Task: Presence
    - [ ] **Write failing tests** for cursor/selection broadcast between connected clients.
    - [ ] Implement presence indicators on the canvas.

## Phase 3: Async Review
- [ ] Task: Comments
    - [ ] **Write failing tests** for anchored comment creation, resolution, and retrieval.
    - [ ] Implement the comment API and UI overlay.

## Phase 4: Centralized Component Library & Verification
- [ ] Task: Shared Component Registry
    - [ ] **Write failing tests** for publishing and searching components in the central, cross-tenant-aware registry (building on Track 2's per-tenant repository).
    - [ ] Implement the component library API for sharing custom nodes across a team.
- [ ] Task: Conductor - User Manual Verification 'Collaboration — Real-Time & Async' (Protocol in workflow.md)

---

## 13. Domain Plugin SDK & Marketplace
*New track. Formalizes "loading a new domain" (already possible via Track 2's loader) into an authoring/publishing pipeline with a trust model, for when domains start coming from outside the core team.*

### Specification
# Specification - Domain Plugin SDK & Marketplace

## Overview
Track 2 already lets anyone *load* a Component Definition set. This track adds the tooling and trust model needed for a broader ecosystem: authoring guidance, local validation tooling, a review/publish pipeline, and a security model for running behavior scripts that didn't come from the core team.

## Goals
- Build a **Domain SDK**: manifest schema reference, a component-schema validator CLI, and a local simulator for dry-running a sample architecture against a new domain before publishing.
- Define a **trust tier model**: `trusted` (internal/curated, runs with full privilege) vs. `sandboxed` (third-party/community-authored, runs with a restricted script execution surface — no network/filesystem access from within a component's behavior script).
- Build a lightweight **marketplace**: browse, search, and install community-published domains; a review step before first publish.

## Technical Details
- **SDK:** a CLI (`domain-cli validate`, `domain-cli simulate --sample`) wrapping Track 2's Zod schemas and Track 5's simulation engine.
- **Sandboxed execution:** an isolated JS runtime (e.g. a Worker with a locked-down global scope, or a WASM-based sandbox for stronger isolation) for `sandboxed`-tier component scripts — a stricter version of Track 5's existing "isolated runtime for component scripts."
- **Marketplace:** a searchable index over published domains, each carrying its trust tier, version, and publisher.

## Constraints
- `trusted` tier is never self-granted by a publisher — it's a review outcome.
- Sandboxed execution must have zero ambient network/filesystem capability, not merely permission-gated capability.
- A malicious or buggy sandboxed component script must fail safely (that one node's simulation degrades) without affecting other components' or other tenants' runs.

### Implementation Plan
# Implementation Plan - Domain Plugin SDK & Marketplace

## Phase 1: Domain SDK
- [ ] Task: Manifest & Schema Validator CLI
    - [ ] **Write failing tests** for CLI validation against Track 2's schemas.
    - [ ] Build `domain-cli validate`.
- [ ] Task: Local Simulator CLI
    - [ ] **Write failing tests** for a dry-run simulation against a sample architecture built entirely from a candidate domain.
    - [ ] Build `domain-cli simulate --sample`.

## Phase 2: Trust Tiers & Sandboxed Execution
- [ ] Task: Trust Tier Model
    - [ ] **Write failing tests** for trust-tier assignment and enforcement (a sandboxed-tier domain's scripts cannot access network/filesystem).
    - [ ] Implement the tiered execution path, extending Track 5's isolated runtime.
- [ ] Task: Resource Quotas
    - [ ] **Write failing tests** for per-invocation memory/time limits on sandboxed scripts.
    - [ ] Implement quota enforcement with safe, isolated failure.

## Phase 3: Marketplace
- [ ] Task: Publish & Review Pipeline
    - [ ] **Write failing tests** for the publish flow (schema validation, automated checks, pending-review state).
    - [ ] Implement domain publishing with a review gate before first public listing.
- [ ] Task: Discovery UI
    - [ ] **Write failing tests** for search/browse over published domains.
    - [ ] Build the marketplace browsing UI, integrated into Track 2's Domains view.

## Phase 4: Verification & Integration
- [ ] Task: Security Review
    - [ ] Verify sandboxed execution has no ambient capability leak, under adversarial test scripts specifically written to attempt escape.
- [ ] Task: Conductor - User Manual Verification 'Domain Plugin SDK & Marketplace' (Protocol in workflow.md)

---

## 14. Interactive Ideas & Knowledge Base
*Carries forward `PLANNER.md` Track 6 "Interactive Ideas Library" largely unchanged — it remains a strong, distinctive feature.*

### Specification
# Specification - Interactive Ideas & Knowledge Base

## Overview
A dedicated view allowing users to upload, browse, and learn from architectural concepts using text and interactive diagrams — voice AI concepts (semantic endpointing, AEC, etc.) as the flagship content, but the mechanism is domain-agnostic like everything else.

## Goals
- Add a dedicated **Library** destination to the activity bar (Track 1).
- Implement a **Library Upload Mechanism**: JSON/YAML files containing a collection of "Ideas."
- Build the **Idea List View**: searchable, categorized.
- Implement the **Interactive Idea Viewer**: progressive-disclosure text combined with interactive diagrams.
- Support concepts including Semantic Endpointing, Sentence-Boundary Streaming, Backchannel Filtering, Latency Masking, Acoustic Echo Cancellation, and Speculative Execution.

## Technical Details
- **UI:** a `LibraryView` component in the shell.
- **Rendering:** D3.js and React Flow for interactive diagrams within a deep-dive.
- **Schema:** `IdeaLibrarySchema` defining text content and diagram configuration.

## Constraints
- The library must persist across sessions once uploaded.
- Interactive diagrams must be responsive and follow the project's visual guidelines.

### Implementation Plan
# Implementation Plan - Interactive Ideas & Knowledge Base

## Phase 1: Library View & Activity Bar
- [ ] Task: Activity Bar Integration
    - [ ] **Write failing tests** for switching to the Library view via the activity bar (Track 1).
    - [ ] Add the Library icon and view toggle logic.
- [ ] Task: Library Upload Engine
    - [ ] **Write failing tests** for parsing and validating `IdeaLibrarySchema`.
    - [ ] Implement the file upload handler for JSON/YAML library files.

## Phase 2: Idea Listing & Navigation
- [ ] Task: Idea List Component
    - [ ] **Write failing tests** for rendering the list of ideas from uploaded state.
    - [ ] Build the searchable list view in the sidebar.
- [ ] Task: Navigation to Idea Viewer
    - [ ] Implement routing/state change to open an idea's detail view in the editor area.

## Phase 3: Interactive Idea Viewer
- [ ] Task: Rich Text & Progressive Disclosure
    - [ ] **Write failing tests** for summary → deep-dive rendering.
    - [ ] Build the text viewer using `KnowledgeAccordion` (Track 1).
- [ ] Task: Interactive Diagram Renderer
    - [ ] **Write failing tests** for instantiating interactive diagrams from an idea definition.
    - [ ] Build the diagram host for custom interactive elements (e.g. a latency slider for AEC).

## Phase 4: Bundled Content & Final Verification
- [ ] Task: Bundle Standard Concepts
    - [ ] Create the standard library file containing the six mandated voice AI concepts.
- [ ] Task: Verification & Persistence
    - [ ] **Write failing tests** for persistence of uploaded libraries.
    - [ ] Verify the end-to-end "Upload → List → Explore Diagram" flow.
- [ ] Task: Conductor - User Manual Verification 'Interactive Ideas & Knowledge Base' (Protocol in workflow.md)

---

## 15. Onboarding, Sample Architectures & Visual Polish
*Carries forward `PLANNER.md` Track 7, enriched with the new features this plan adds (drill-down, promotion, chaos, bottleneck report) so the guided tour and sample content stay current.*

### Specification
# Specification - Onboarding, Sample Architectures & Visual Polish

## Overview
Ties everything together into a coherent first-run experience: bundled baseline architectures, a guided tour of the full (now larger) IDE shell, and final visual polish across every animation this plan introduces.

## Goals
- Bake in **Sample Architectures**: "Cheapest 650ms Setup" and "Ultra-Low Latency 200ms Setup," now demonstrating at least one promoted/reused sub-architecture (Track 4) so the sample content teaches the feature, not just describes it.
- Implement **Interactive Onboarding**: a guided tour covering the activity bar (Architectures/Domains/Settings), tabs, inspector, drill-down, and — new — the Bottleneck Report and chaos-injection controls.
- Final **Visual Polish**: data-flow animation, congestion ripple, and the chaos blast-radius animation (visually distinct from ordinary congestion, per Track 5).

## Technical Details
- **Data:** bundled JSON repository for the Knowledge Base (Track 14) and baseline architectures.
- **UI:** `react-joyride` or a custom tour overlay for the IDE shell.

## Constraints
- Knowledge Base entries strictly follow the summary → deep-dive mandate.
- The guided tour must reflect the actual current shell (three-destination nav, not the original two) — this track ships after Track 1 Phase 5, not before.

### Implementation Plan
# Implementation Plan - Onboarding, Sample Architectures & Visual Polish

## Phase 1: Baselines & Knowledge Base
- [ ] Task: Populate Enterprise Knowledge Base
    - [ ] **Write failing tests** for the progressive-disclosure rendering of the six voice AI concepts.
    - [ ] Draft summary and deep-dive content.
- [ ] Task: Create Baseline Architectures
    - [ ] Define "Cheapest 650ms" and "Ultra-Low Latency 200ms," including a promoted/reused sub-architecture in at least one of them.
    - [ ] Verify both load correctly into the tab system.

## Phase 2: Interactive Guided Tour
- [ ] Task: Shell Tour
    - [ ] **Write failing tests** for the tour step sequence (Architectures → Domains → Settings → Tabs → Inspector → Drill-down → Bottleneck Report → Chaos injection).
    - [ ] Implement the interactive tour.

## Phase 3: Final Visual Polish
- [ ] Task: Animation Fine-Tuning
    - [ ] Polish animated data packets, congestion ripple, and the chaos blast-radius animation.
- [ ] Task: Final CSS Audit
    - [ ] Confirm monospaced data fonts, dark-mode colors, and borders match the visual guidelines throughout — including the new Domains reference view and Settings workspace.

## Phase 4: Final Verification
- [ ] Task: End-to-End User Flow Audit
    - [ ] Verify: Blank start → Import domain knowledge → Create/upload architecture → Simulate (bottlenecks/cost/latency) → Reposition → Export → Re-import (identical placement) → Drill down → Promote to component → Reuse in a second architecture → Parallel-compare.
- [ ] Task: Conductor - User Manual Verification 'Onboarding, Sample Architectures & Visual Polish' (Protocol in workflow.md)

---

## 16. Deployment & Observability
*New track. Not present in `PLANNER.md` at all — closes the self-hosted/observability gap flagged in review, phased to trail real demand rather than block the MVP.*

### Specification
# Specification - Deployment & Observability

## Overview
Packaging and operating the platform once it's more than a locally-run dev project: containerized deployment usable both as a hosted service and as a self-hosted install, plus the logging/metrics/alerting needed to run it responsibly at either.

## Goals
- Containerize the backend (Track 10) and produce a Docker Compose / minimal Helm chart for self-hosted installs, using the `deployment_mode` field already on `Tenant`.
- Implement centralized structured logging across backend services.
- Implement basic metrics (request latency, simulation run duration/volume, error rates) and alerting thresholds.

## Technical Details
- **Containerization:** Docker for the backend; a Helm chart once Kubernetes-based self-hosting is actually requested, not built speculatively ahead of that.
- **Logging:** structured JSON logs, one pipeline regardless of deployment mode.
- **Metrics:** a standard metrics endpoint (Prometheus-compatible) plus a minimal dashboard.

## Constraints
- Self-hosted and SaaS must run from the same container image — no parallel codebase.
- Observability must never log architecture *content* (a customer's actual designs) at anything above debug-level, and never in production logs by default — this is a straightforward data-handling expectation once the product has real users' work in it.

### Implementation Plan
# Implementation Plan - Deployment & Observability

## Phase 1: Containerization
- [ ] Task: Dockerize Backend
    - [ ] **Write failing tests** (smoke tests) confirming the containerized backend passes the Track 10 health-check.
    - [ ] Write the Dockerfile and Compose file.

## Phase 2: Logging & Metrics
- [ ] Task: Structured Logging
    - [ ] **Write failing tests** confirming log output is structured JSON and never includes raw architecture content above debug level.
    - [ ] Implement the logging pipeline.
- [ ] Task: Metrics Endpoint
    - [ ] **Write failing tests** for the metrics endpoint's shape and key counters.
    - [ ] Implement request/run/error metrics and expose a Prometheus-compatible endpoint.

## Phase 3: Self-Hosted Packaging (trailing real demand)
- [ ] Task: Helm Chart / Self-Hosted Guide
    - [ ] **Write failing tests** (deployment smoke tests) against a local Kubernetes cluster.
    - [ ] Build the Helm chart and self-hosted install documentation.

## Phase 4: Verification & Integration
- [ ] Task: Alerting Thresholds
    - [ ] Define and verify alerting on error-rate and latency thresholds.
- [ ] Task: Conductor - User Manual Verification 'Deployment & Observability' (Protocol in workflow.md)

---

## Cross-track dependency notes

- **Track 4 Phase 4 (Promote to Component) depends on Track 9's unified rule engine** — promotion is blocked on unresolved diagnostic errors, so the rule engine needs to exist first (or these two tracks need to land together).
- **Track 8's round-trip fidelity test depends on Track 3's explicit repositioning task** — both must go through one shared position-update path, or the test has nothing reliable to assert against.
- **Track 7's Bottleneck Report depends on Track 2's cost-function requirement and Track 5's simulation trace** — it has nothing to compute from until both exist.
- **Track 11's audit logging depends on Track 10's `Tenant`/`User` schema** — audit entries are meaningless without `tenant_id`/`actor_id` to attach them to.
- **Track 13 (Plugin SDK & Marketplace) depends on Track 9's trust-tier-aware validation model** — sandboxed execution is a security property the rule engine and simulation engine both need to already respect.
- Tracks 1–9 are the core, single-tenant-usable product. Tracks 10–13 and 16 are what turn it into a real multi-user, multi-tenant, extensible platform — they can trail Tracks 1–9 without blocking a usable release.