# Implementation Plan - Domain Plugin SDK & Marketplace

## Phase 1: SDK
- [ ] Build `domain-cli validate` around shared schemas and
  `domain-cli simulate --sample` around the deterministic engine.
- [ ] Define manifests, versions, capabilities, examples, and trust metadata.

## Phase 2: Sandboxing
- [ ] Run untrusted behavior scripts in a restricted Worker/WASM boundary with
  no ambient network or filesystem access.
- [ ] Enforce invocation time, memory, and output quotas; fail one node safely.

## Phase 3: Marketplace
- [ ] Add NestJS publish/review/search/install endpoints and Mongo indexes.
- [ ] Add browser browsing UI showing publisher, version, trust tier, and
  validation status.

## Phase 4: Verification
- [ ] Run adversarial escape tests and ensure trusted status is review-assigned,
  never self-declared.
