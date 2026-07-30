# Specification - Analysis & Metrics Dashboard

## Overview
This track implements the analytical features of the playground, including real-time metrics and a VS Code-style "Call Log" transcript view.

## Goals
- Build the **Call Log / Transcript Pane**:
    - A resizable and collapsible pane at the bottom (VS Code style).
    - Real-time display of text/data as it flows through components (e.g., ASR output, LLM response).
- Implement **Telemetry Visualization**:
    - Overlay metrics directly onto nodes and edges in the visualizer.
- Build the **Analysis Dashboard**:
    - A resizable pane or sidebar for aggregated metrics (latency, cost, throughput).

## Technical Details
- **UI:** Virtualized list for the Call Log to handle high-volume simulation data.
- **Visuals:** React Flow overlays for telemetry; Chart.js for dashboard graphs.
- **Layout:** Integration with the `react-resizable-panels` layout from the foundation.

## Constraints
- The Call Log must support filtering by transaction ID or component.
- The UI must remain responsive even with rapid simulation event updates.
