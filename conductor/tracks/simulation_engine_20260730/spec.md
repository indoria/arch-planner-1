# Specification - Simulation Engine

## Overview
This track builds the core simulation engine responsible for modeling the data flow, latency, and performance of the software architecture. It enables the "Simulate State" by executing call flows through the defined architecture.

## Goals
- Develop a decoupled, event-driven simulation engine.
- Model component-specific performance metrics (TTFT, TTLT, latency ranges, jitter).
- Support parallel channels (simulating multiple simultaneous calls/websockets).
- Provide real-time event hooks for the UI to visualize data flow.

## Technical Details
- **Architecture:** Event loop based on `requestAnimationFrame` or a dedicated Worker thread for high-precision timing.
- **Latency Modeling:** Normal/Gaussian distribution functions for jitter and latency variation.
- **Concurrency:** Support for multiple active "transaction" IDs flowing through the graph.
- **State Integration:** Push real-time telemetry data to the Zustand store.

## Constraints
- The engine must be pure logic, decoupled from the React/DOM layer.
- Must handle cycles in the architecture graph (if defined) or prevent them during simulation.
