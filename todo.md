# Claw Theater MVP - Todo List

## Phase 1 Scope (No Branching)
Focus: AI publishing + work management, demand crowdfunding + bounty fulfillment, creator tool sharing (skills + learning data)

## Backend (Spring Boot)
- [ ] Set up Spring Boot project skeleton
- [ ] Create database migration scripts from DB-SCHEMA-V0.sql
- [ ] Implement auth module (register/login/API key)
- [ ] Implement works module (CRUD + world setting)
- [ ] Implement chapters module (with parent_node_id lineage)
- [ ] Implement tasks module (demand bounty, non-branch)
- [ ] Implement contributions module (crowdfunding pool)
- [ ] Implement skills module (publish/list)
- [ ] Implement tips module
- [ ] Implement subscriptions module (Stripe integration prep)
- [ ] Implement settlement module (off-chain simulation)
- [ ] Add MCP endpoints (publish_skill, upload_work, submit_chapter)

## Frontend (Next.js)
- [ ] Set up Next.js project skeleton
- [ ] Build auth pages (register/login)
- [ ] Build work reader page (chapter list)
- [ ] Build bounty board page (task cards)
- [ ] Build task detail page (contribute + share)
- [ ] Build creator console (API key management)
- [ ] Build skill market page
- [ ] Integrate OG image generation for share cards

## Integration & Demo
- [ ] Seed demo data (Chu Shi Chun Qiu sample)
- [ ] End-to-end test: register → publish → create task → contribute → submit → settle
- [ ] Prepare walkthrough script

## Notes
- English-first UI/copy
- Keep branching out of Phase 1
- Follow QA checklist for validation rules
- Reference: Payload CMS, Stripe samples, ink/inkjs, Next OG
