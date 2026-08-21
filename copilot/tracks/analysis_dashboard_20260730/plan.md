# Implementation Plan - Analysis & Metrics Dashboard

## Phase 1: Logs
- [ ] Define normalized simulation log entries and map traces to a virtualized
  call-log DOM view with transaction/component filters.
- [ ] Test append, filtering, auto-scroll, and high-volume rendering.

## Phase 2: Telemetry
- [ ] Add D3 SVG node/edge overlays for latency, health, throughput, and queue
  state; keep semantic labels accessible.

## Phase 3: Metrics and Bottlenecks
- [ ] Implement deterministic cost, throughput, percentile, and aggregate KPI
  calculations from simulation traces.
- [ ] Build configurable threshold rules producing `{ id, name, reason,
  severity }` bottleneck records.
- [ ] Add sortable report UI and exportable JSON/CSV.

## Phase 4: Verification
- [ ] Test report determinism, visible thresholds, run diffs, and responsive
  bottom-panel behavior.
