# Architecture Planner

This application is a generic architecture planning and simulation tool, designed to be architecture-agnostic. While originally conceived for voice AI systems, it can be configured to model any modular system.

## Vision
To provide a highly interactive, architecture-agnostic playground for designing, simulating, and analyzing various software system architectures.

## Core Principles
- **Agility:** Easily swap components or reconfigure architectures.
- **Transparency:** Progressive disclosure of component details, latency, cost, and functionality.
- **Extensibility:** The engine is decoupled from the domain-specific data, allowing for new architecture types to be loaded.

## How to use as a Planner
1. **Define Architecture:** Load a JSON/YAML configuration file representing your system's nodes and data-flow lines.
2. **Configure Simulator:** Define the simulation parameters (e.g., latency ranges, error probabilities) for each component.
3. **Simulate:** Run the simulation to model system performance, bottlenecks, and costs.
4. **Iterate:** Use the interactive canvas to swap components and instantly see the updated simulation metrics.
