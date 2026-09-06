# Tech Stack - Vanilla Architecture Planner

## Frontend
- **Markup:** Semantic HTML5.
- **Language:** TypeScript compiled to browser ES modules; Vanilla DOM APIs.
- **Styling:** Tailwind CSS, with CSS custom properties for diagram and state tokens.
- **State:** A small event-driven application store using immutable snapshots,
  browser `CustomEvent` notifications, and IndexedDB persistence.
- **Diagramming:** SVG and DOM for the architecture editor; D3.js for scales,
  links, overlays, transitions, and telemetry. Do not introduce a UI framework.
- **3D/WebGL:** Three.js and WebGL for optional spatial/system-of-systems views,
  not for ordinary 2D editor interactions.
- **Motion:** GSAP for timeline playback and deliberate UI transitions.  Handle complex sequencing, smooth property tweening, staggers, and ScrollTrigger interactions
- **Icons:** Inline accessible SVG icon primitives or a framework-free icon set.

## Backend
- **Runtime:** Node.js.
- **Framework:** NestJS with modular controllers, services, guards, and pipes.
- **API:** REST first; WebSocket gateways for collaboration and live telemetry.
- **Validation:** Zod or NestJS DTO validation at every external boundary.
- **Simulation:** Shared deterministic TypeScript domain packages, with worker
  execution in the browser and isolated server execution where required.

## Data and Operations
- **Database:** Remote MongoDB accessed through the official driver or Mongoose;
  repository interfaces must keep persistence replaceable.
- **Indexes:** Tenant, architecture, component, run, and created-at indexes are
  designed before implementation.
- **Auth:** Provider-neutral NestJS authentication guard, with JWT/OIDC as the
  first integration path.
- **Client persistence:** IndexedDB for drafts, cached domains, and offline runs.
- **Testing:** Vitest for unit tests, Supertest for NestJS HTTP tests, and
  Playwright for browser workflows.
- **Build:** npm scripts for typecheck, lint, test, coverage, and production
  builds. No framework-specific frontend runtime is required.
