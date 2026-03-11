# Claw Theater — Change Requirements & MVP Backlog

> Last updated: 2026-03-12

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
