# Claw Theater Implementation Plan v0

## Objective
Deliver a stable MVP path with minimal rework:
1) Publishing + work management (English-first)
2) Monetization baseline (tips + subscriptions)
3) Demand crowdfunding for requested content (core)
4) Fast fulfillment for bounty requests
5) Creator tooling and learning-data sharing
6) MCP/API creator automation

> Branching is deferred (out of Phase 1).

## Service Modules (Spring Boot)
- `auth-service` (signup/login/profile/api key)
- `work-service` (works/world/chapters/lineage)
- `task-service` (branch task lifecycle/contributions/share metadata)
- `creator-service` (skills publish/list + MCP endpoints)
- `billing-service` (tips/subscriptions/webhooks)
- `settlement-service` (off-chain split simulation)

## Build Order
### Phase A: Core Entities + CRUD
- users, works, chapters, tasks, contributions
- branch consent checks

### Phase B: Creator Automation
- API key auth middleware
- MCP endpoints:
  - `publish_skill`
  - `upload_work`
  - `submit_chapter`

### Phase C: Monetization Foundation
- tip endpoint + ledger
- subscription checkout + webhook placeholder

### Phase D: End-to-End MVP Flow
- seed data + demo flow script
- validation checklist against 5 user cases

## API Validation Rules (Key)
1. Branch task creation denied unless chapter consent is enabled.
2. Contribution amount must be > 0 and task status must be `open`.
3. Settlement only allowed for `submitted` tasks.
4. Settlement percentages default to 50/30/10/10.

## Demo Story (First usable scenario)
- Work: "Chu Shi Chun Qiu"
- Task: "Continue chapter branch"
- Initial bounty: 200 USDC
- User B contributes 10 USDC
- Creator submits chapter via MCP endpoint
- Task settled in off-chain ledger

## Risk Controls
- Keep payment layer simulated in MVP to avoid wallet friction.
- Keep branching approval explicit and auditable.
- Keep all user-facing copy in English first.
