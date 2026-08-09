# Application Guide

Welcome to the Voicebot Architecture Planner documentation. This guide will walk you through the key features and workflows of the application.

## Table of Contents
1. [Adding Components](#adding-components)
2. [Connecting Components](#connecting-components)
3. [Managing Sub-Graphs (Sub-Architectures)](#managing-sub-graphs)
4. [Swapping Components](#swapping-components)
5. [Monitoring Issues (Complaints Log)](#monitoring-issues)
6. [Navigating Tabs](#navigating-tabs)

---

## Adding Components
To add a new component to your architecture:
1.  Open the **Component Library** by clicking the "Box" icon in the left-hand Activity Bar.
2.  Browse or search for the component you need (e.g., ASR, LLM, TTS).
3.  **Click and drag** the component from the library onto the canvas.
4.  As you drag, you will see a **visual ghost element** representing the node.
5.  Release the mouse button to drop and create the node at the desired position.

## Connecting Components
Components communicate through typed sockets:
1.  Identify the **Output** socket (right side) on the source node and the **Input** socket (left side) on the target node.
2.  Click and drag a line from an output socket to an input socket.
3.  The system enforces **Type Safety**:
    *   You can only connect compatible types (e.g., `Audio` to `Audio`, `Text` to `Text`).
    *   Connections must be `Output` to `Input`.
4.  If a connection is invalid, an error message will appear in the **Complaints Log** explaining why.

## Managing Sub-Graphs
Sub-graphs allow you to create nested, hierarchical architectures:
1.  **Create**: Select a node on the canvas and click **"Create Sub-Graph"** in the **Inspector** panel on the right.
2.  **Drill Down**: To enter the sub-graph:
    *   Click **"Drill Down into Sub-Graph"** in the Inspector, OR
    *   **Double-click** the node on the canvas.
3.  **Navigate**: Use the **Breadcrumbs** at the top of the canvas to see your current depth. Click **"Back to Parent"** or use the breadcrumb links to navigate back up.
4.  **Identify**: Nodes with sub-graphs display a "Layers" icon in their header.

## Swapping Components
You can change the type of an existing node while preserving its position:
1.  Select a node on the canvas.
2.  In the **Inspector** panel, look for the **"Alternatives"** section.
3.  Click on an alternative component to swap the current node.
4.  **Warning**: If the new component has incompatible sockets, existing connections may be automatically removed to maintain integrity. A warning will appear in the Complaints Log if this happens.

## Monitoring Issues
The **Complaints Log** (at the bottom of the screen) tracks all validation errors and warnings:
1.  It automatically logs incompatible connection attempts.
2.  It notifies you when connections are removed during component swaps.
3.  Click **"Clear"** to empty the log.

## Navigating Tabs
Manage multiple architectures simultaneously using the top **Tab Bar**:
1.  Click a tab to switch between different architectures.
2.  Use the **"X"** icon on a tab to close it.
3.  Click **"Close All"** to clear your workspace.
4.  The application saves your open tabs automatically to local storage.
