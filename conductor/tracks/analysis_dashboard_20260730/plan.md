# Implementation Plan - Analysis & Metrics Dashboard

This plan builds the analytical dashboard and the VS Code-style Call Log pane using a strict TDD approach.

## Phase 1: Call Log & Transcript Pane [checkpoint: 06e9a79]
- [x] Task: Call Log Component (84894d4)
    - [x] **Write failing tests** for real-time log appending and virtualization logic.
    - [x] Build the `CallLogPane` with auto-scroll and filtering support.
- [x] Task: Transcript Mapping (4d336d9)
    - [x] **Write failing tests** for mapping simulation data (e.g., ASR text) to the log view.
    - [x] Implement the data transformation logic from simulation events to log entries.

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
