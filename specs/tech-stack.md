# Tech Stack - Voicebot Architecture Playground

## Frontend & Core Framework
- **Document structure:** Semantic **HTML5** for the IDE-style shell and accessible controls.
- **Language:** **Vanilla JavaScript** using browser ES modules and runtime validation.
- **Styling:** **Tailwind CSS** for a minimalist, VS Code-like dark mode aesthetic.
- **Layout:** CSS Grid and Flexbox for resizable IDE panels, with Pointer Events for direct manipulation.

## Visualization & Diagramming
- **Node-Based Editor:** **D3.js** for building and manipulating SVG architecture diagrams (nodes and edges).
- **Data Visualization:** **D3.js** for custom SVG transitions, latency modeling charts, and data-driven overlays.
- **Motion:** **GSAP** for timeline playback, panel transitions, and animated data flow.
- **3D Visualization:** **Three.js** with **WebGL** for optional high-density or spatial architecture views.
- **Icons:** Lucide icons loaded for direct DOM use.

## Simulation Engine & State Management
- **State Engine:** A small vanilla JavaScript store using immutable updates and DOM event subscriptions.
- **Tab Management:** State-driven tab system handling `openTabs` and `activeTabId`.
- **Simulation Logic:** Custom JavaScript event loop to model component latencies, jitter, and error scenarios.

## Backend & Storage
- **Application Server:** **Node.js** with **Express** or **Fastify** where server-side collaboration features are needed.
- **Database:** **PostgreSQL** or **MongoDB** for storing architecture definitions, component libraries, and simulation logs.
- **Cloud Integration:** **Firebase** or **Supabase** for quick deployment of authentication and real-time architecture sharing features.
- **Client-Side Persistence:** **IndexedDB** for local caching of large architecture definitions and offline simulation capabilities.
