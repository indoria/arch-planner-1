# Implementation Plan - Simulation Engine

This plan builds the simulation event loop and performance modeling logic using a strict TDD approach.

## Phase 1: Event Loop & Basic Flow
- [ ] Task: Simulation Event Loop
    - [ ] **Write failing tests** for the event loop's timing accuracy and tick mechanism.
    - [ ] Implement the `SimulationLoop` class (decoupled from the UI).
- [ ] Task: Basic Linear Flow Execution
    - [ ] **Write failing tests** for a simple linear path (Node A -> Node B) with fixed latency.
    - [ ] Implement the message passing logic between nodes in the graph.

## Phase 2: Performance & Concurrency Modeling
- [ ] Task: Latency & Jitter Modeling
    - [ ] **Write failing tests** for the random latency generator (verifying distribution bounds).
    - [ ] Implement probability-based latency and jitter functions.
- [ ] Task: Parallel Transaction Handling
    - [ ] **Write failing tests** for multiple parallel message flows (handling concurrent "calls").
    - [ ] Implement transaction ID tracking and state isolation for concurrent simulations.

## Phase 3: Telemetry & State Hooks
- [ ] Task: Real-time Telemetry Dispatcher
    - [ ] **Write failing tests** for the event hook mechanism (verifying callback execution).
    - [ ] Implement a telemetry dispatcher that emits events (start, processing, end) for each node.
- [ ] Task: UI State Synchronization
    - [ ] **Write failing tests** for updating the Zustand store from simulation events.
    - [ ] Create a bridge to sync simulation telemetry with the React state for visualization.

## Phase 4: Verification & Stress Testing
- [ ] Task: Load Testing
    - [ ] **Write failing tests** for high-load scenarios (100+ parallel calls).
    - [ ] Optimize the event loop and state updates for performance.
- [ ] Task: Conductor - User Manual Verification 'Simulation Engine' (Protocol in workflow.md)
