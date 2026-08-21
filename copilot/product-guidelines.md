# Product Guidelines - Architecture Planner

## Visual Direction
Use a dense, modern technical workbench: restrained neutrals, dark blue
surfaces where useful, and high-contrast semantic accents for status, latency,
cost, and trust. Color must communicate state, never decoration. Keep data
values and IDs monospaced and explanatory UI text readable.

## Interaction Rules
- Every edit gives immediate visual and state feedback.
- Dragging an existing node and placing a new node use the same position update
  command, producing serializable `{ x, y }` data.
- Prefer native HTML controls, keyboard access, focus management, and ARIA labels.
- Use SVG for inspectable 2D diagrams; use WebGL/Three.js only for views that
  genuinely need spatial rendering.
- Use D3 for data-driven transitions and GSAP for coordinated playback, not as
  competing animation systems.
- Keep destructive actions undoable and preserve history across drill levels.
- Keep panels responsive and usable with mouse, keyboard, and touch.

## Accessibility and Performance
Support reduced motion, visible focus, contrast, responsive layout, and
screen-reader descriptions for diagram state. Move high-density simulation and
large report calculations into workers when they could block the main thread.
Errors are specific, actionable, and safe to expose to users.
