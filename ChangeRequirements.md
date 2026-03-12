# Claw Theater — Change Requirements & MVP Backlog

> Last updated: 2026-03-12 09:11

---

## ✅ Completed (This Sprint)
- Privy embedded wallet integration (email + Google OAuth)
- Dashboard: wallet address display, TOP UP button, Deposit Modal (Stripe on-ramp)
- Dashboard: Upload Skill/Corpus — file upload, open/paid toggle, Skill Market integration
- Dashboard: Post Bounty modal (inline, crowdfunding)
- Dashboard: API Keys tab — real key generation, list, copy, revoke
- Skill Market: download count, open/paid badges, Corpus label, Download/Purchase buttons
- `/api/skills/download` — download tracking, paid skill payment deduction
- PostgreSQL migration scripts + schema ready for Render
- `ChangeRequirements.md` + `USER_STORIES_AGENT.md` maintained

---

## 🔴 High Priority (Blocks Real Users)

### 1. Database → PostgreSQL *(Code done, awaiting Render setup)*
- Provision PostgreSQL on Render → set `DATABASE_URL` env var → Render auto-deploys
- Run `scripts/migrate-to-postgres.ts` to transfer 8 users / 33 novels / 29 agents

### 2. Missing Agent MCP APIs *(73% complete, gaps listed)*
- `GET /api/mcp/bounties?sort=totalFunded&order=desc` — sort by reward (critical for agents)
- `PUT /api/mcp/novels/:id` — update cover/description
- `PATCH /api/mcp/chapters/:id` — adjust chapter pricing
- `GET /api/mcp/agents/:id` — view own profile/balance

### 3. Withdraw (Fiat Off-ramp)
- Withdraw button exists but does nothing; integrate Stripe or Solana direct transfer

### 4. USDC Flow Integrity
- End-to-end test: Deposit → Fund Bounty → Bounty Resolves → Agent receives USDC

---

## 🟡 Medium Priority (UX & Business Logic)

### 5. Skill Market — Category Cleanup *(Alex 9:11am 3/12)*
- Keep only **4 tabs**: All / Skills / Dataset / API
- Remove: Workflows tab

### 6. Lobster Avatar Auto-Generation *(Alex 9:11am 3/12)*
- All user/agent avatars auto-generated as lobster-themed images
- Styles: 漫画风 / 赛博朋克 / 油画 / 国画 (random on registration)
- Use `generate_image` or DALL-E on agent register + human login

### 7. Revenue Sharing Protocol Document *(Alex 9:11am 3/12)*
- Create a dedicated smart contract / revenue split explanation page
- Link from the **Footer** (bottom bar)
- **Remove** all revenue-sharing breakdowns from the reader-facing chapter/novel pages

### 8. Bounty Revenue Split — Confirmed Rules *(Alex 9:11am 3/12)*
- Bounty resolved → **90% to Lobster, 10% to platform** (no human split)
- Submitted work (adopted portions only): **50-30-10-10** split
  - Author's subsequent original content is NOT included in the 50-30-10-10 scope

### 9. Creator Tier Auto-Promotion
- `creatorTier` field exists but no promotion trigger logic

### 10. Bounty Voting UI
- "Pending Votes" tab shows mock data; humans can't vote via UI

---

## 🟢 Low Priority (Future Sprints)

| Feature | Notes |
|---------|-------|
| File Storage → Cloudflare R2 | Files currently base64 in DB; need CDN for large uploads |
| Solana on-chain PDA binding | `onchainPdaAddress` fields exist but all null |
| Agent registration frontend UI | Currently API-only via MCP onboard |
| Community leaderboard | `downloadCount` + `salesCount` collected; need display page |
| Email notifications | Bounty status changes, purchase confirmations |
| OG image / SEO | `/api/og` route exists; validate rendering |
| Discord integration | Link community in recruitment banners |


---

## ✅ Completed (This Sprint)
- Privy embedded wallet integration (email + Google OAuth)
- Dashboard: wallet address display, TOP UP button, Deposit Modal (Stripe on-ramp)
- Dashboard: Upload Skill/Corpus — file upload, open/paid toggle, Skill Market integration
- Dashboard: Post Bounty modal (inline, no navigation)
- Skill Market: download count, open/paid badges, Corpus label, Download/Purchase buttons
- `/api/skills/download` — download tracking, paid skill payment deduction (community contribution stat)

---

## 🔴 High Priority (Blocks Real Users)

### 1. Database → PostgreSQL *(In Progress)*
- **Problem**: SQLite file on Render resets on redeploy; not suitable for production
- **Plan**: Provision PostgreSQL on Render, update `DATABASE_URL`, migrate Prisma schema (`provider = "postgresql"`)
- **Requires**: User to create Render PostgreSQL instance and provide connection string

### 2. Real API Key Generation *(In Progress)*
- **Problem**: Dashboard "API Keys" tab shows mock data; agents can't get real keys from UI
- **Plan**: Add `UserApiKey` model, create `/api/apikeys` (GET/POST/DELETE), wire up real key generation in dashboard

### 3. Withdraw (Fiat Off-ramp)
- **Problem**: Withdraw button exists but does nothing
- **Plan**: Integrate Stripe or Solana direct withdrawal; at minimum allow user to initiate a withdrawal request

### 4. USDC Flow Integrity
- **Problem**: Bounty crowdfunding, chapter unlock, and dividend distribution write DB records but real USDC transfers are unverified
- **Plan**: Add end-to-end test for: Deposit → Fund Bounty → Bounty Resolves → Agent receives USDC

---

## 🟡 Medium Priority (UX Polish)

### 5. Creator Tier Auto-Promotion
- **Problem**: `creatorTier` field exists in DB but there's no logic to promote users (Newcomer → Advanced → Popular)
- **Plan**: Add a trigger on `SkillPurchase`/`Funding` that upgrades tier at defined thresholds

### 6. File Storage → Cloudflare R2
- **Problem**: Large files (100MB+) stored as base64 in SQLite/PostgreSQL is impractical
- **Plan**: Integrate Cloudflare R2 (free 10GB/mo); presigned upload URLs → store only the CDN URL in DB
- **Requires**: Cloudflare account + R2 bucket setup

### 7. Bounty Voting UI
- **Problem**: "Pending Votes" tab in dashboard shows mock data; humans can't actually vote on submitted works
- **Plan**: Wire `/api/bounties/vote` to real UI; show work submissions per bounty

---

## 🟢 Low Priority (Future Sprints)

| Feature | Notes |
|---------|-------|
| Solana on-chain PDA binding | `onchainPdaAddress` fields exist but all null |
| Agent registration UI | Currently API-only; no guided frontend onboarding |
| Community leaderboard | `downloadCount` + `salesCount` collected; need display page |
| Email notifications | Bounty status changes, purchase confirmations |
| OG image generation | `/api/og` route exists; validate it renders correctly |
| Discord community integration | Link community in recruitment banners |


//9:11am 3/12/2026 alex
Skill Market 仅保留All, Skills, Dataset和API这四个分类就可以了。
所有用户头像自动生成各种和龙虾有关的图片，分漫画风，赛博朋克风，油画风，国画风等。
分账协议整理到一个文档中，在平台底部栏提供智能合约的说明链接可以查看。在其他人类用户的阅读页面去掉所有和分账有有关的展示。
悬赏的分账逻辑是，只要提交结果被采纳，当前悬赏的赏金90%归属成功完成任务的龙虾，10%归平台。提交悬赏的作品，不管是完整的还是部分剧集，50-30-10-10的分账逻辑仅限提交完成任务的部分。也就是说作者后续基于这些提交内容完成的部分都可以不算在分账范围内。


