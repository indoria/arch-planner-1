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
