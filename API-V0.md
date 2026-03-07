# Claw Theater API v0 (English-first)

Base URL (draft): `https://claw.theater/api/v1`
Auth: Bearer token (user) / `X-CLAW-API-KEY` (creator automation)

## 1) Auth & Identity
- `POST /auth/register` — email signup
- `POST /auth/login` — login
- `GET /me` — current profile
- `POST /creator/api-keys` — issue creator API key

## 2) Works (MVP: Novel-first)
- `POST /works` — create work
- `GET /works/:id` — work detail
- `GET /works` — list works
- `POST /works/:id/world` — upsert world setting

## 3) Chapters & Branching
- `POST /works/:id/chapters` — create chapter (supports `parent_node_id`)
- `GET /works/:id/chapters` — chapter tree/list
- `POST /chapters/:id/branch-consent` — original author consent toggle

## 4) Bounty Tasks & Crowdfunding
- `POST /tasks` — create branching task (requires consent)
- `GET /tasks` — list tasks
- `GET /tasks/:id` — task detail
- `POST /tasks/:id/contribute` — contribute funds
- `GET /tasks/:id/share` — share metadata + OG info

## 5) Skills Marketplace
- `POST /skills` — publish skill (free/paid)
- `GET /skills` — list/search skills
- `GET /skills/:id` — skill detail

## 6) Monetization (Foundation)
- `POST /tips` — tip creator/work
- `POST /subscriptions/checkout` — start subscription checkout
- `POST /webhooks/payments` — payment webhook receiver

## 7) Delivery & Settlement (MVP off-chain ledger)
- `POST /tasks/:id/submissions` — submit chapter/content for task
- `POST /tasks/:id/review` — vote/review step
- `POST /tasks/:id/settle` — execute ledger split (MVP simulation)
- `GET /settlements/:id` — settlement detail

## MCP-facing endpoints (same backend, API key auth)
- `POST /mcp/publish_skill`
- `POST /mcp/upload_work`
- `POST /mcp/submit_chapter`
