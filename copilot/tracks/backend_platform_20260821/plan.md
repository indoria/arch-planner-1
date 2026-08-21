# Implementation Plan - Backend Platform & Multi-Tenancy

## Phase 1: NestJS Foundation
- [ ] Create NestJS modules for health, architectures, domains, simulations,
  reports, and shared configuration.
- [ ] Add global validation pipes, exception mapping, structured logging, and
  health tests.

## Phase 2: Remote MongoDB
- [ ] Define MongoDB collections and indexes for Tenant, User, Architecture,
  Component, Run, and Report; every user-owned document carries `tenantId`.
- [ ] Implement repository interfaces and Mongo adapters with tenant filters.
- [ ] Add architecture CRUD and import/export endpoints.

## Phase 3: Isolation
- [ ] Test crafted requests and concurrent access cannot cross tenants.
- [ ] Add deployment mode metadata (`saas` or `self_hosted`) without duplicating
  application code.

## Phase 4: Verification
- [ ] Run integration tests against an isolated remote test database and verify
  indexes, timeouts, retries, and graceful shutdown.
