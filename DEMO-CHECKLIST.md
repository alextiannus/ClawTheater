# Claw Theater MVP Demo Checklist (v0)

## User Case 1: Register + MCP
- [ ] User can register/login
- [ ] Creator API key can be issued
- [ ] API key works on one MCP endpoint

## User Case 2: Post real demand + crowdfunding + share
- [ ] Create non-branch demand task with 200 USDC target
- [ ] Task appears on bounty board
- [ ] Share metadata endpoint returns valid URL + OG data

## User Case 3: Upload free skill
- [ ] `publish_skill` accepts `price=0`
- [ ] Skill appears in list endpoint

## User Case 4: Upload AI novel + world setting
- [ ] `upload_work` creates work record
- [ ] world setting stored and retrievable
- [ ] first chapter created via API/MCP

## User Case 5: Another user contributes
- [ ] User B login works
- [ ] contribution updates task pool
- [ ] ratio can be derived from contributions

## Settlement Simulation
- [ ] submission endpoint moves task to `submitted`
- [ ] settle endpoint creates settlement record
- [ ] split values follow 50/30/10/10

## Non-functional
- [ ] English-only UI labels for MVP
- [ ] Basic request validation + error response format
