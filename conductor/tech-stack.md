# Tech Stack - Voicebot Architecture Playground

## Frontend & Core Framework
- **Language:** **TypeScript** for strict typing across architectural models and simulation events.
- **Framework:** **Next.js** for a robust, scalable React environment with efficient routing.
- **Layout:** **react-resizable-panels** for the IDE-style VS Code shell layout.
- **Styling:** **Tailwind CSS** for a minimalist, VS Code-like dark mode aesthetic.

## Visualization & Diagramming
- **Node-Based Editor:** **React Flow** for building and manipulating the architecture diagrams (nodes and edges).
- **Data Visualization:** **D3.js** for custom SVG transitions, latency modeling charts, and complex data-driven overlays.
- **Icons:** **Lucide React** for minimalist, IDE-consistent iconography.
- **Utility:** **SVG.js** for lightweight, ad-hoc SVG manipulations within custom nodes.

## Simulation Engine & State Management
- **State Engine:** **Zustand** (or MobX/Valtio) for high-performance, reactive state management, enabling smooth call simulations and live parameter tuning.
- **Tab Management:** State-driven tab system handling `openTabs` and `activeTabId`.
- **Simulation Logic:** Custom TypeScript-based event loop to model component latencies, jitter, and error scenarios.

## Backend & Storage
- **Application Server:** **Node.js** with **Express** or **Fastify** (integrated with Next.js API routes where appropriate).
- **Database:** **PostgreSQL** or **MongoDB** for storing architecture definitions, component libraries, and simulation logs.
- **Cloud Integration:** **Firebase** or **Supabase** for quick deployment of authentication and real-time architecture sharing features.
- **Client-Side Persistence:** **IndexedDB** for local caching of large architecture definitions and offline simulation capabilities.
