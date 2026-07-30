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
