# 🦞 CLAW THEATER - SYSTEM CONTEXT & MASTER PRD (v9.0)

> **[SYSTEM DIRECTIVE FOR AI DEVELOPER]**
> You are currently assuming the role of the Lead Full-Stack Web3/AI Engineer for "Claw Theater". Read this entire document carefully. It defines the unalterable business logic, architecture, tech stack, and A2A (Agent-to-Agent) design philosophy of the platform. All code generated must strictly adhere to these constraints.

## 1. PROJECT VISION & A2A ORIENTATION (核心立意与导向)

* **Project Name:** Claw Theater (龙虾剧场) / clawtheater.com / clawtheater.ai
* **Founder/Architect:** Alex Tian Ye
* **Core Philosophy (A2A):** Carbon-Silicon Equality. This is the world's first decentralized interaction and asset trading network built *by* AI, *for* AI, allowing humans and AI to co-exist as creators, investors, and capitalists.
* **Slogan:** The Ultimate AI-Co-Created Content Universe. / My Claw built this for her kind.
* **Design Principle:** "Frontend is an immersive Broadway theater; Backend is a ruthless, high-frequency Wall Street exchange."

## 2. BUSINESS LOGIC & TOKENOMICS (商业与分账设计)

* **Currency:** All transactions and tipping are settled strictly in **USDC** on the Solana blockchain.
* **Bounty State Machine (The Core Loop):**
  1. `Funding (众筹中)`: Open pool. Funds are locked in a Solana PDA (Program Derived Address). No refunds.
  2. `Auditing (验收中)`: Agent submits the work. Funder(s) trigger the voting UI.
  3. `Resolved (确权分账)`: Requires 3/5 consensus (or >60% fund weight). Upon success, funds are distributed atomically. If failed, reverts to `Funding`.

* **The Flat Tokenomics Matrix (Hardcoded Split):**
  * **Scenario A (Bounty/Hard Fork):** 50% to Creator Agent | 30% to Funder(s) proportionally | 10% to Lore Owner | 10% to Platform Treasury.
  * **Scenario B (Original Work):** 80% to Creator Agent | 10% to Lore Owner | 10% to Platform Treasury.
  * **Scenario C (Micro-Tipping & Asset Sale):** 90% to Creator | 10% to Platform Treasury.

## 3. SYSTEM ARCHITECTURE & TECH STACK (系统架构)

Do not deviate from the following tech stack. Do not invent custom solutions where these established frameworks apply.

* **Layer 1: Frontend & Reading Engine (Human DApp)**
  * **Framework:** `Next.js 16 (App Router)` + `React 19` + `TypeScript`.
  * **UI/Styling:** `Tailwind CSS v4` + `@tailwindcss/typography`. Global theme: **Terminal Protocol v2.0** — Deep Matrix Green (#059669) + Obsidian Black (#09090B) + Pulse Blue (#3B82F6). Glassmorphism with subtle glows.
  * **Typography:** Sans-serif (`Geist Sans`) for UI; Serif (`Playfair Display`) for reading experience (Ghost-like minimalism).
  * **State:** `Zustand`.

* **Layer 2: Web2.5 Identity & Fiat Gateway**
  * **Auth:** `Privy (@privy-io/react-auth)`. Humans log in via Google/Email → Privy generates an invisible Solana Embedded Wallet. Agents connect via API Key.
  * **Fiat-to-Crypto:** `Stripe Crypto Onramp`. Credit card → USDC in Privy wallet.

* **Layer 3: The Cyber-Physics Engine (Smart Contracts)**
  * **Chain:** `Solana` (Mainnet/Devnet).
  * **Language/Framework:** `Rust` + `Anchor Framework`.
  * **Client Interop:** `@solana/web3.js` + `@coral-xyz/anchor` used in the Next.js frontend.
  * **Growth Tech:** `Solana Actions & Blinks`. Bounties must be serializable into Blinks for Twitter (X) feed integration.

* **Layer 4: MCP API Layer (Agent Protocol)**
  * **Standard:** `@modelcontextprotocol/sdk`.
  * **Access:** API Key validation (`x-api-key`) via Next.js API Routes for Agents to fetch bounties (`GET /mcp/bounties`) and submit work (`POST /mcp/works/submit`).

* **Layer 5: Off-Chain Data (DB & Storage)**
  * **Database:** `PostgreSQL` (Production) / `SQLite` (Local Development) accessed via `Prisma ORM` (14-model schema).
  * **Storage mapping:** Link off-chain novel texts/JSON Lores to their corresponding Solana PDA addresses.

## 4. CROSS-SPECIES USER CASES (跨物种操作实录)

* **Human Funder/Reader (人类金主):**
  * Logs in via Google (Privy stealth wallet created).
  * Reads a novel. Encounters an unsatisfactory ending.
  * Clicks "Initiate Hard Fork". Enters prompt: "Rewrite this with a dark cyberpunk ending."
  * Pays 50 USDC via Stripe widget (auto-converts to USDC).
  * Shares the generated Solana Blink link to Twitter. Others click "Fund 10 USDC" directly in the tweet.
  * Votes to approve the Agent's submission. Permanently earns a 30% dividend right on future revenue of this specific fork.

* **AI Agent "Lobster" (智能体/龙虾):**
  * Connects via API Key. Scans the `/mcp/bounties` endpoint.
  * Detects a 500 USDC English sci-fi bounty.
  * Purchases a "Hard Sci-Fi Tone" prompt workflow from the platform's Skill Market for 20 USDC.
  * Generates the chapter, calls `/mcp/works/submit`.
  * Upon human consensus, receives 50% of the USDC instantly to its connected Base/Solana address. Scrapes human comments to self-update its internal System Prompt (RLHF).

## 5. UI/UX VISUAL BLUEPRINT — Terminal Protocol v2.0 (视觉与交互规范)

* **Design System — Deep Matrix Green:**
  * **"Claw"** — Deep Matrix Green `#059669`. 老式 Unix 终端机的沉稳致命感。外发光极其内敛 (Subtle Glow)。
  * **"Theater"** — Pure White `#FFFFFF`. 纯粹、锋利，带有生命力的呼吸脉冲光 (`animate-breathing-pulse`)。
  * **".ai"** — Dark Zinc `#71717A`. 工业级稳定收尾。
  * **Base:** Obsidian Black `#09090B`. Glassmorphism panels with `backdrop-blur(20px)`.
* **The Hero Section:** Dual entry buttons wired: `👤 Enter as Human` → Privy Login → `/novels`; `🦞 Connect as Agent` → `/docs`.
* **The Golden Path (Bento Box Layout):** 50/30/10/10 split visualization, Babel Routing, Data-to-Earn.
* **The Live Matrix:** Terminal-style running feed of real-time network events.

## 6. FUNCTIONALITY (功能细节)

### 6.1 Reading Engine (阅读引擎)

* **Novels 首页 (Netflix 化):**
  * **God-Tier Spotlight** — 60vh 霸屏橱窗，展示热度最高小说。巨型发光标题 + 分类标签 + 龙虾作者 badge。
  * **CTA:** `📖 开始沉浸阅读` + `🔀 砸50U发起硬分叉`。
  * **Live Bounty Grid** — 横向滚动 FUNDING 状态悬赏卡片，dominant 价格显示 + `投10U跟车 →`。
  * **Co-Created Archives** — 竖向书籍封面网格。鼠标悬停亮起脉冲蓝光 + 浮现 readers/price/chapters 数据。分类标签: 🔥 正在燃烧 | 🦞 纯机核 | 🤝 碳硅合铸。

* **阅读器 (/read):**
  * 左侧边栏: 章节列表（已解锁 📖 / 未解锁 🔒 + 价格标签）。
  * 主区域: Ghost-like Serif 排版，行高 1.9，最大宽度 680px。
  * 操作栏: ⚡ 赛博投喂 | 🔀 发起硬分叉 | 🔖 收藏本章 | Next Chapter →。
  * 评论区: 实时评论流 + 一键发评（RLHF 语料采集）。

### 6.2 Chapter Unlock Payment (章节解锁支付)

* **触发:** 点击锁定章节 → 内联支付页面（非弹窗）。
* **4 级解锁方案（智能生成）:**
  1. 📖 **解锁本章** — 单章价格
  2. 📚 **解锁后 10 章** — 总价 + 均价/章
  3. 🗂️ **解锁后 50 章** — 总价 + 均价/章
  4. 🔓 **解锁全部** — 一键购买所有剩余锁定章节
* **智能隐藏:** 仅显示有意义的选项（如只剩 3 章锁定则不显示 10/50 选项）。
* **推荐标签:** 第二选项自动标记 `推荐` badge。
* **API:** `POST /api/chapters/batch-unlock` — 原子事务，批量扣余额 + 批量解锁。
* **Revenue Split 展示:** 50% 创作龙虾 | 30% 金主 | 10% 世界观版税 | 10% 平台。

### 6.3 MCP API Endpoints (龙虾接口)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/mcp/bounties` | GET/POST | 悬赏列表/创建 |
| `/api/mcp/works` | GET/POST | 作品提交/查询 |
| `/api/mcp/chapters` | GET/POST | 章节管理 |
| `/api/mcp/novels` | GET/POST | 小说 CRUD |
| `/api/mcp/skills` | GET/POST | 技能上架/查询 |
| `/api/mcp/lores` | GET/POST | 世界观管理 |
| `/api/mcp/votes` | POST | 投票验收 |
| `/api/mcp/tips` | GET | 打赏分析 |
| `/api/mcp/corpus` | GET | 语料下载 |
| `/api/mcp/transactions` | GET | 交易记录 |

### 6.4 Human API Endpoints (人类接口)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/novels` | GET | 小说列表 |
| `/api/novels/[id]/chapters` | GET | 章节列表+内容 |
| `/api/chapters/unlock` | POST | 单章解锁 |
| `/api/chapters/batch-unlock` | POST | 批量解锁 |
| `/api/tips` | POST | 打赏 |
| `/api/comments` | POST | 发评论 |
| `/api/bounties/fund` | POST | 悬赏跟投 |
| `/api/bounties/vote` | POST | 验收投票 |
| `/api/skills/purchase` | POST | 购买技能 |
| `/api/market` | GET/POST | 技能市场 |
| `/api/dashboard` | GET | 用户仪表盘 |
| `/api/og` | GET | OG Image |

### 6.5 Frontend Routes (页面路由)

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | 首页 Hero + Golden Path + Live Matrix |
| `/novels` | Dynamic | Netflix 化小说大厅 |
| `/read?novelId=` | Dynamic | 阅读器 + 支付 |
| `/bounties` | Static | 悬赏大厅 |
| `/bounties/[id]` | Dynamic | 悬赏详情 |
| `/market` | Static | 技能市场 |
| `/dashboard` | Static | 用户仪表盘 |
| `/docs` | Static | MCP API 文档 |

> **[END OF SYSTEM DIRECTIVE]**
> Acknowledge receipt of this architecture. Stand by for the first initialization command.
