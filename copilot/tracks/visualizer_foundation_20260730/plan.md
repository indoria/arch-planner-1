# Implementation Plan - IDE Shell & Global Navigation

## Phase 1: Browser Foundation
- [ ] Scaffold TypeScript browser modules, HTML entrypoint, Tailwind build,
  Vitest, Playwright, and a static asset pipeline.
- [ ] Define typed `Architecture`, `Node`, `Socket`, `Connection`, `Tab`, and
  `DrillPath` schemas with runtime validation.
- [ ] Build the semantic HTML shell: activity bar, sidebar, tabs, header,
  editor, and bottom panels.

## Phase 2: DOM State and SVG Canvas
- [ ] Implement an immutable application store and command/event bus for tabs,
  active view, selection, and drill path.
- [ ] Render the canvas with SVG and D3 data joins, including multi-socket nodes,
  edges, zoom, pan, keyboard selection, and blank state.
- [ ] Add progressive disclosure with native `details` or accessible custom
  disclosure controls.

## Phase 3: Navigation
- [ ] Add Architectures, Domains, Settings, account popover, command palette,
  focus trap, Escape handling, and breadcrumb rendering.
- [ ] Add focused unit and browser tests for navigation and keyboard behavior.

## Phase 4: Verification
- [ ] Verify responsive behavior, reduced motion, accessibility, and no frontend
  framework dependencies before marking this track complete.
