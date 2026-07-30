# Implementation Plan - Agnostic Loader & External Integration

This plan formalizes the architecture schema and builds the import/export engine using a strict TDD approach.

## Phase 1: Schema Formalization & Validation
- [ ] Task: Formalize JSON Schema
    - [ ] **Write failing tests** for validating architecture definitions against the schema.
    - [ ] Define the official JSON Schema for version 1.0 of the architecture definition.
- [ ] Task: Runtime Validation Engine
    - [ ] **Write failing tests** for identifying invalid node/edge configurations (e.g., missing mandatory parameters).
    - [ ] Implement the `ValidationService` using Ajv or Zod.

## Phase 2: Agnostic Loading & Parsing
- [ ] Task: Multi-format Parser
    - [ ] **Write failing tests** for parsing both JSON and YAML files into the internal state.
    - [ ] Implement the `ArchParser` utility using `js-yaml`.
- [ ] Task: Error Reporting & Feedback
    - [ ] **Write failing tests** for error message generation during failed imports.
    - [ ] Build a UI component to display import errors and warnings to the user.

## Phase 3: External Integration & Export
- [ ] Task: Import/Export Service
    - [ ] **Write failing tests** for the round-trip integrity of an exported architecture (Export -> Import should match).
    - [ ] Implement the `ExportService` for JSON and YAML file generation.
- [ ] Task: High-Res SVG Export
    - [ ] **Write failing tests** for SVG serialization and cleanup (removing UI elements from export).
    - [ ] Implement a utility to export the current diagram as a high-resolution, stand-alone SVG file.

## Phase 4: Verification & Documentation
- [ ] Task: Schema Documentation
    - [ ] Generate comprehensive documentation for the architecture schema for third-party developers.
- [ ] Task: Conductor - User Manual Verification 'Agnostic Loader & External Integration' (Protocol in workflow.md)
