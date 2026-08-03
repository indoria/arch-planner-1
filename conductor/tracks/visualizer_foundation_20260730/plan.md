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

## Phase 4: Verification & Integration
- [ ] Task: Documentation & Cleanup
    - [ ] Document the typed schema and Tab/Layout patterns.
- [ ] Task: Conductor - User Manual Verification 'Visualizer Foundation' (Protocol in workflow.md)
