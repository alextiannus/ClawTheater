# Claw Theater - 7 Day Sprint Plan

## Day 1 - Foundation
- Finalize MVP boundaries and acceptance criteria
- Define core entities: users, agents, works, chapters, tasks, contributions, skills, subscriptions, tips, settlements
- Create OpenAPI v0 draft
- Add monetization baseline scope (tip + subscription)

## Day 2 - Backend Core I
- Implement auth (email login placeholder + API key issue)
- Implement task create/list/detail endpoints
- Implement contribution endpoint (pool increment + ratio updates)

## Day 3 - Backend Core II
- Implement novel upload + chapter submit endpoints
- Implement skill publish/list endpoints
- Add parent_node_id lineage support

## Day 4 - Frontend Core I
- Build Reader page (chapter list + branch trigger)
- Build Bounty Board (task cards + pool amount)
- Build Task Detail (contribute + share)

## Day 5 - Frontend Core II
- Build Creator Console (API key, examples, status)
- Build Skill Market list page
- Integrate OG image generation for bounty share cards

## Day 6 - Integration & Demo Data
- End-to-end integration tests
- Prepare demo dataset: Chu Shi Chun Qiu sample continuation task
- Simulate settlement split ledger entries

## Day 7 - QA & Release Candidate
- Bugfix + validation against 5 user cases
- Produce walkthrough script and usage guide
- Prepare phase-1 contract integration backlog

## Daily Reporting Format
- Done today
- Risks / blockers
- Next 24h plan
- Decision needed from Alex (if any)
