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

## Phase 2: Typed Schema & Progressive Disclosure
- [x] Task: Define Typed Architecture Schema [b042325]
    - [x] **Write failing tests** for socket count and type validation logic.
    - [x] Implement TypeScript interfaces for `Socket`, `TypedConnection`, and `CompatibilityList`.
- [ ] Task: Progressive Disclosure Components
    - [ ] **Write failing tests** for the summary/deep-dive expansion logic.
    - [ ] Build a reusable `KnowledgeAccordion` component using Tailwind.

## Phase 3: Canvas & Rendering
- [ ] Task: React Flow Integration
    - [ ] **Write failing tests** for rendering a multi-socket architecture from the tab state.
    - [ ] Implement the `ArchitectureCanvas` with custom multi-socket nodes.
- [ ] Task: Blank State UI
    - [ ] Build the editor splash screen for the blank state.

## Phase 4: Verification & Integration
- [ ] Task: Documentation & Cleanup
    - [ ] Document the typed schema and Tab/Layout patterns.
- [ ] Task: Conductor - User Manual Verification 'Visualizer Foundation' (Protocol in workflow.md)
