# Implementation Plan - Auth, RBAC & Security Hardening

## Phase 1: Authentication
- [ ] Add a provider-neutral NestJS auth guard and JWT/OIDC adapter.
- [ ] Test protected routes, invalid tokens, login identity mapping, and safe
  error responses.

## Phase 2: Authorization
- [ ] Implement shared viewer/editor/admin policy guards for every mutating
  architecture, domain, sharing, and simulation route.
- [ ] Test ownership, role changes, and tenant boundaries.

## Phase 3: Audit
- [ ] Add immutable audit entries for privileged actions, written server-side as
  part of the action transaction or reliable outbox flow.
- [ ] Test exactly-once intent, actor/tenant attribution, and redaction.

## Phase 4: Enterprise Path
- [ ] Define OIDC/SAML extension points and document deferred provider work.
- [ ] Threat-model imports, script execution, WebSockets, and Mongo queries.
