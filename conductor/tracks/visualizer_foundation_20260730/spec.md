# Specification - Visualizer Foundation

## Overview
This track focuses on the foundational work required to define and visualize architectures within the playground. It establishes the "View State" by creating a robust data schema and integrating React Flow for SVG-based diagramming.

## Goals
- Define a comprehensive JSON schema for software architectures (nodes, edges, parameters).
- Set up the React/TypeScript environment with React Flow.
- Implement a basic visualization engine that can render a multi-component voicebot architecture.
- Enable interactive "View State" features: panning, zooming, and non-destructive node movement.

## Technical Details
- **Schema:** JSON/TypeScript interfaces for `Node`, `Edge`, and `ComponentMetadata`.
- **Visualization:** React Flow for node management and edge routing.
- **State:** Zustand for managing the loaded architecture state.
- **Components:** Standardized SVG icons for VAD, ASR, LLM, TTS, and Orchestrator.

## Constraints
- The schema must be architecture-agnostic (support voicebots and other systems).
- SVG rendering must be performant and responsive.
