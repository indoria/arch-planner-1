# Specification - Agnostic Loader & External Integration

## Overview
This track implements the features that make the playground truly architecture-agnostic. It focuses on the standardized schema, robust data loading from external sources (JSON/YAML), and exporting simulation results. It specifically handles the separation of "Architecture" (connections) and "Component Definitions" (behavioral models).

## Goals
- Formalize and version the Architecture Definition Schema.
- Support loading of two distinct data types:
    - **Architecture Definition**: Defines how nodes are connected.
    - **Component Definition**: Models how components behave, their properties, and interactions.
- Support flexible loading strategies:
    - Independent files for Architecture and Components.
    - Embedded Architecture files that include component models.
- Build a **Component Repository** that is formed automatically when component models are provided.
- Implement a **Validation Engine** that "complains" (provides clear error messages) if either connection info or behavioral models are missing.
- Implement comprehensive import/export features for sharing and versioning.

## Technical Details
- **Schema Validation:** `Ajv` for JSON Schema validation or `Zod` for runtime validation.
- **Parsing:** `js-yaml` for YAML support.
- **Component Registry:** A dedicated store for managing the component library (repository).
- **Error Reporting:** A structured diagnostic system for reporting missing or invalid definitions.

## Constraints
- The loader must handle invalid or incomplete files gracefully with clear error reporting.
- Standardized exports should be compatible with version control (Git-friendly JSON).
