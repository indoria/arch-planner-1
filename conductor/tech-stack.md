# Tech Stack - Voicebot Architecture Playground

## Frontend & Core Framework
- **Language:** **TypeScript** for strict typing across architectural models and simulation events.
- **Framework:** **React** to manage the complex, componentized interactive UI.

## Visualization & Diagramming
- **Node-Based Editor:** **React Flow** for building and manipulating the architecture diagrams (nodes and edges).
- **Data Visualization:** **D3.js** for custom SVG transitions, latency modeling charts, and complex data-driven overlays.
- **Utility:** **SVG.js** for lightweight, ad-hoc SVG manipulations within custom nodes.

## Simulation Engine & State Management
- **State Engine:** **Zustand** (or MobX/Valtio) for high-performance, reactive state management, enabling smooth call simulations and live parameter tuning.
- **Simulation Logic:** Custom TypeScript-based event loop to model component latencies, jitter, and error scenarios.

## Backend & Storage
- **Application Server:** **Node.js** with **Express** or **Fastify** to handle architecture management and persistent data.
- **Database:** **PostgreSQL** or **MongoDB** for storing architecture definitions, component libraries, and simulation logs.
- **Cloud Integration:** **Firebase** or **Supabase** for quick deployment of authentication and real-time architecture sharing features.
- **Client-Side Persistence:** **IndexedDB** for local caching of large architecture definitions and offline simulation capabilities.
