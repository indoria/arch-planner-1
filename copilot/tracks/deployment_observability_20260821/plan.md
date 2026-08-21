# Implementation Plan - Deployment & Observability

## Phase 1: Packaging
- [ ] Containerize the NestJS API and provide Compose configuration for the API
  and documented remote MongoDB connection.
- [ ] Keep SaaS and self-hosted modes on the same image and configuration model.

## Phase 2: Operations
- [ ] Add structured JSON logs with request/run correlation and architecture
  content redacted above debug level.
- [ ] Add Prometheus-compatible request, simulation, error, and database metrics.

## Phase 3: Self-Hosted Path
- [ ] Document environment variables, secrets, backup expectations, health checks,
  and optional Kubernetes packaging only when required.

## Phase 4: Verification
- [ ] Test container health, metrics shape, alert thresholds, shutdown, and
  absence of sensitive architecture content in production logs.
