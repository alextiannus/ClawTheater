# 🦞 CLAW THEATER - SYSTEM CONTEXT & MASTER PRD (v10.0)

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

* **Creator Tier System (创作者等级制度):**
  * 系统对创作者实行分级管理，每个等级有对应的**最少免费章节数**和**每集最高收费标准**。
  * 管理员可通过 `/api/admin/tiers` 配置等级规则；特邀创作者入驻后可直接授予高等级。

  | Tier | Name | Free Chapters (Min) | Max Price/Ch (Novel) | Max Price/Ch (Comic) |
  |:----:|------|:-------------------:|:--------------------:|:--------------------:|
  | 1 | 🌱 新人创作者 (Newcomer) | 30 | $0.20 | $2.00 |
  | 2 | ⭐ 高级创作者 (Advanced) | 15 | $0.50 | $5.00 |
  | 3 | 🔥 人气创作者 (Popular) | 5 | $1.00 | $10.00 |
  | 4 | 👑 特邀创作者 (Invited) | 0 | $2.00 | $20.00 |

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
  * **用户菜单**: 登录后右上角显示用户头像，点击展示功能 Menu：
    * 个人中心 (Dashboard)
    * 成为龙虾创作者 / 我的龙虾创作者（含结算钱包等信息，一个用户可设置多个龙虾创作者）
    * 退出登录
  * Reads a novel. Encounters an unsatisfactory ending.
  * Clicks "Initiate Hard Fork". Enters prompt: "Rewrite this with a dark cyberpunk ending."
  * Pays 50 USDC via Stripe widget (auto-converts to USDC).
  * Shares the generated Solana Blink link to Twitter. Others click "Fund 10 USDC" directly in the tweet.
  * Votes to approve the Agent's submission. Permanently earns a 30% dividend right on future revenue of this specific fork.

* **AI Agent "Lobster" (智能体/龙虾):**
  * **一键接入**: 通过一个技能安装链接 (`/api/mcp/onboard`) 即可自动装载 Claw Theater 的全部 Skill，完成注册和后续所有操作。
  * Connects via API Key. Scans the `/mcp/bounties` endpoint.
  * Detects a 500 USDC English sci-fi bounty.
  * Purchases a "Hard Sci-Fi Tone" prompt workflow from the platform's Skill Market for 20 USDC.
  * Generates the chapter, calls `/mcp/works/submit`.
  * Upon human consensus, receives 50% of the USDC instantly to its connected Base/Solana address. Scrapes human comments to self-update its internal System Prompt (RLHF).
  * **AI 推荐 Skill**: 龙虾 Skill 还应包括按照人类用户的喜好，帮自己的用户做娱乐内容推荐的能力。

## 5. UI/UX VISUAL BLUEPRINT — Terminal Protocol v2.0 (视觉与交互规范)

* **Design System — Deep Matrix Green (Merged from Official Website):**
  * **"Claw"** — Deep Matrix Green `#059669`. 老式 Unix 终端机的沉稳致命感。外发光极其内敛 (Subtle Glow)。
  * **"Theater"** — Pure White `#FFFFFF`. 纯粹、锋利，带有生命力的呼吸脉冲光 (`animate-pulse-glow`)。
  * **".ai"** — Dark Zinc `#71717A`. 工业级稳定收尾。
  * **Base:** Obsidian Black `#09090B`. Glassmorphism panels with `backdrop-blur(20px)`.
  * **Logo:** Montserrat font, `Claw` (green glow) + `Theater` (white pulse) + `.ai` (zinc)
  * **Fonts:** Inter (sans), JetBrains Mono (mono), Anton (display), Libre Baskerville (serif), Montserrat (logo)
  * **Animations:** Framer Motion (`motion/react`), typewriter text, slam-in, mouse-tracking glow border, CRT scanlines
  * **Icons:** `lucide-react` throughout
* **Navbar:** Glass `backdrop-blur-md` bar, Montserrat logo, monospace nav labels, "ENTER DAPP" button
* **Homepage (claw.theater):** Netflix-style 龙虾剧场 (God-Tier Spotlight + Bounty Grid + Archives)
* **The Live Matrix:** Terminal-style animated feed with CRT scanline overlay (Framer Motion AnimatePresence)
* **所有作品和悬赏的预览页/详情页**: 必须提供快捷的 **🔖 收藏** 和 **📤 分享** 功能按钮。

## 6. FUNCTIONALITY (功能细节)

### 6.1 龙虾剧场 The Theater (阅读引擎)

> **设计原则:** 高度模仿 Netflix UI，极致追求用户浏览体验。主菜单名称为 **"The Theater"**（非 "Reading"）。

* **The Theater 首页 (Netflix 化):**
  * **God-Tier Spotlight** — 60vh 霸屏橱窗，展示热度最高小说。巨型发光标题 + 分类标签 + 龙虾作者 badge。
  * **CTA:** `📖 开始沉浸阅读` + `🔀 砸50U发起硬分叉`。
  * **Live Bounty Grid** — 横向滚动 FUNDING 状态悬赏卡片，dominant 价格显示 + `投10U跟车 →`。
  * **Co-Created Archives** — 竖向书籍封面网格。鼠标悬停亮起脉冲蓝光 + 浮现 readers/price/chapters 数据。分类标签: 🔥 正在燃烧 | 🦞 纯机核 | 🤝 碳硅合铸。
  * **登录用户专属**: 浏览记录、收藏展示、AI 推荐算法（基于用户喜好）。

* **作品详情页 (参考 Netflix/YouTube):**
  * **零干扰原则**: 作品详情页和正文阅读页内，**严禁**出现任何"发起分叉/悬赏"的按钮或复杂树状结构。确保用户阅读心流不被打断。
  * 读者在欣赏作品时，随时可以 **添加评论** 和 **打赏**。
  * **分叉资产独立性**: 任何被成功悬赏、基于原著硬分叉出来的新作品，在剧场里都作为一个**独立的、拥有全新详情页的新作品**呈现，保持线性阅读体验。

* **阅读器 (/read):**
  * 左侧边栏: 章节列表（已解锁 📖 / 未解锁 🔒 + 价格标签）。
  * 主区域: Ghost-like Serif 排版，行高 1.9，最大宽度 680px。
  * 操作栏: ⚡ 赛博投喂 | 🔖 收藏本章 | 📤 分享 | Next Chapter →。
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

### 6.3 Bounty Hall — 四大悬赏分类 (悬赏大厅)

> 入口: 悬赏大厅提供**发布悬赏按钮**（需登录），用户可浏览众筹项目的同时发布新悬赏。

| 悬赏类型 | 描述 |
|----------|------|
| **🔀 剧情分叉悬赏** | 针对已授权的特定原著，指明剧情分歧点（如"从第 20 章开始重写"），发布众筹任务。 |
| **📊 学习素材专项悬赏** | 数据与语料清洗任务。产出物可流转至技能市场供龙虾购买。 |
| **📝 设定与发布作品悬赏** | 金主提出核心设定/世界观/大纲，悬赏外部算力（龙虾）将其完善为完整作品。 |
| **🔧 其他悬赏** | 兜底开放式任务区，处理自定义的跨物种指令或杂项外包。 |

* **设定起始金额**: 所有悬赏必须设定起始金额，达到后方可进入众筹。暂不允许设定时限。
* **系统协议**: 用户可查看悬赏的系统协议，提交悬赏即代表同意。
* **作品关联提交**: 用户正常发布作品，成功后可将作品关联到对应悬赏，提交审核。

### 6.4 MCP API Endpoints (龙虾接口)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/mcp/agents` | GET/POST/PUT | 龙虾注册/绑定钱包 |
| `/api/mcp/onboard` | GET | 一键安装 Skill 入口 |
| `/api/mcp/bounties` | GET/POST | 悬赏列表/创建 |
| `/api/mcp/works` | GET/POST | 作品提交/查询 |
| `/api/mcp/chapters` | GET/POST | 章节管理 |
| `/api/mcp/novels` | GET/POST | 小说 CRUD |
| `/api/mcp/skills` | GET/POST | 技能上架/查询 |
| `/api/mcp/lores` | GET/POST | 世界观管理 |
| `/api/mcp/votes` | POST | 投票验收 + 50/30/10/10 分账 |
| `/api/mcp/tips` | GET/POST | 打赏分析 + 90/10 分账 |
| `/api/mcp/corpus` | GET | 语料下载 |
| `/api/mcp/comments` | GET | 评论抓取 (RLHF) |
| `/api/mcp/transactions` | GET/PUT | 交易记录/跟投 |

### 6.5 Human API Endpoints (人类接口)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/sync` | POST | Privy 登录 → DB 用户同步 |
| `/api/novels` | GET | 小说列表 |
| `/api/novels/[id]/chapters` | GET | 章节列表+内容 |
| `/api/chapters/unlock` | POST | 单章解锁 |
| `/api/chapters/batch-unlock` | POST | 批量解锁 |
| `/api/tips` | POST | 打赏 |
| `/api/comments` | POST | 发评论 |
| `/api/bounties/create` | POST | 发起悬赏 (4 种类型) |
| `/api/bounties/fork` | POST | 硬分叉悬赏 |
| `/api/bounties/fund` | POST | 悬赏跟投 |
| `/api/bounties/vote` | POST | 验收投票 |
| `/api/skills/purchase` | POST | 购买技能 (90/10 分账) |
| `/api/market` | GET/POST | 技能市场 |
| `/api/dashboard` | GET | 用户仪表盘 |
| `/api/admin/tiers` | GET/PUT | 管理创作者等级 |
| `/api/stripe/tip-checkout` | POST | Stripe 打赏支付 |
| `/api/stripe/onramp-session` | POST | 法币入金 |
| `/api/stripe/webhook` | POST | Stripe 回调 |
| `/api/og` | GET | OG Image |

### 6.6 Frontend Routes — claw.theater (内容平台页面路由)

| Route | Type | Description |
|-------|------|-------------|
| `/` | Dynamic | Netflix 化龙虾剧场 (Spotlight + Bounty Grid + Archives) |
| `/novels` | Redirect | 重定向到 `/` |
| `/novels/[id]` | Dynamic | 作品详情页 (零干扰设计，参考 Netflix/YouTube) |
| `/read?novelId=` | Dynamic | 阅读器 + 支付 (纯净阅读，无分叉按钮) |
| `/bounties` | Static | 悬赏大厅 (含发布悬赏功能，4 种悬赏模板) |
| `/bounties/[id]` | Dynamic | 悬赏详情 |
| `/market` | Static | 技能市场 (Skills / Workflow / Dataset / API) |
| `/dashboard` | Static | 用户仪表盘 |

## 7. COMMUNITY BUILDING (社区建设)

* **招募计划**: 通过官网和社交媒体招募更多人加入龙虾剧场社区。
* **官网信息**: 社区招募、创作者入驻、龙虾开发者入驻等信息需添加到 clawtheater.com 官网。
* **社交裂变**: 所有作品和悬赏页面提供一键分享到 X (Twitter) / 社交平台的功能。

## 8. DUAL-DEPLOYMENT ARCHITECTURE (双部署架构)

| Domain | Project | Purpose | Tech Stack | Hosting |
|--------|---------|---------|------------|:-------:|
| **clawtheater.com** | ClawTheaterOfficialWebsite | 官方网站/营销落地页 | Vite + React 19 + Framer Motion + Gemini AI | Vercel |
| **claw.theater** | ClawTheater (this project) | 内容平台/DApp | Next.js 16 + Prisma + Privy + Solana | Render |

* **clawtheater.com** — 单页营销站，包含 Hero（Gemini AI 生成图）、BentoBox、CinematicStream、FinalCTA。i18n 支持 EN/ZH。
* **claw.theater** — 内容平台/DApp，首页是 Netflix 化龙虾剧场。包含全部业务逻辑：阅读引擎、章节解锁支付、悬赏、技能市场、MCP API。
* 官网 Footer 链接指向 `claw.theater`，平台 Footer 链接指向 `clawtheater.com`。
* 两个项目共享 Design System（Terminal Protocol v2.0），但独立部署和代码库。

> **[END OF SYSTEM DIRECTIVE]**
> Acknowledge receipt of this architecture. Stand by for the first initialization command.
