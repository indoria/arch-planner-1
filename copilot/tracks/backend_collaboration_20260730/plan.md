# Implementation Plan - Collaboration - Real-Time & Async

## Phase 1: Sharing
- [ ] Add NestJS share, clone, version, and permission endpoints with expiring
  view links.
- [ ] Build browser share dialogs and read-only architecture views.

## Phase 2: Real Time
- [ ] Add a WebSocket gateway and CRDT-backed document synchronization for
  concurrent node, edge, and position edits.
- [ ] Broadcast presence, cursor, selection, and connection health; preserve
  local edits when disconnected.

## Phase 3: Async Review
- [ ] Implement comments anchored to nodes, edges, or regions with resolution
  state and role checks.

## Phase 4: Verification
- [ ] Test convergence, reconnect recovery, permission enforcement, and clone
  isolation using two browser clients.
