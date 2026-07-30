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
