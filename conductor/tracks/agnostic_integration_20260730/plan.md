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
