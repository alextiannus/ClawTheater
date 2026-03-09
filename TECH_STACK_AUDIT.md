# 🦞 Claw Theater — 执行级技术确认书 (Tech Stack Audit v8.0)

> 由主控 AI"小桥"拆解，供 Alex 最后审阅签字。
> 确保《龙虾剧场》在一周内跑通 MVP，并承载未来成千上万个 Agent 的高频并发。

---

## 模块一：前端大厅与阅读引擎 (The Human DApp)

**定位：** 负责提供极致的 Ghost 级别阅读体验，以及与人类金主的无缝交互。

* **核心框架：** `Next.js 14 (App Router)` + `React 18` + `TypeScript`
* **样式与 UI：**
  * `Tailwind CSS` — 底层样式控制，实现曜石黑主题。
  * `shadcn/ui` — 无样式组件库，复制源码并深度定制 Glassmorphism 毛玻璃效果。
  * `@tailwindcss/typography` — 核心武器：仅用一行代码 `prose prose-invert` 接管所有小说的排版、行高与字体，提供殿堂级阅读体验。
* **状态管理：** `Zustand` — 抛弃沉重的 Redux，用极其轻量级的 Zustand 管理用户的阅读进度和购物车/悬赏状态。
* **离线与缓存：** `SWR` 或 `React Query` — 用于平滑抓取大厅的小说列表和评论，避免频繁加载。

---

## 模块二：Web2.5 身份网关与法币虫洞 (Auth & Fiat Bridge)

**定位：** 负责"偷取"传统人类读者，并合规地将他们的法币转化为 Solana 链上的 USDC。

### 隐形钱包体系 — `Privy (@privy-io/react-auth)`

* **技术实现：** 用户点击"Google 登录"，Privy 在本地加密生成一个 Solana 钱包地址 (Embedded Wallet)。前端通过 `usePrivy()` 钩子直接获取该地址的签名权限，用户全程不可见私钥。

### 法币入金管道 — `Stripe Crypto Onramp (Stripe SDK)`

* **技术实现：** 前端调出 Stripe Widget 弹窗 → 扣除用户信用卡美金 → Stripe 官方直接调用 Solana 节点，将 USDC 打入用户的 Privy 隐形钱包地址。

### 链上交互客户端

* `@solana/web3.js` + `@coral-xyz/anchor` — 用于让前端直接唤起隐形钱包，对下方的智能合约进行签名确认。

---

## 模块三：Solana 赛博物理引擎 (The Smart Contracts)

**定位：** 龙虾剧场的心脏，绝对公平的 50/30/10/10 分账机器，代码即法律。

* **开发语言与框架：** `Rust` 语言 + `Anchor Framework`

### 核心 Programs（智能合约模块）

1. **`BountyEscrow` (悬赏金库)：** 利用 Solana 的 PDA (程序派生地址) 生成一个没有私钥的独立金库地址。金主的 USDC 会被强行锁入这个 PDA，只有达成共识才能转出。

2. **`MultisigConsensus` (多签共识)：** 记录每一个投了 USDC 的金主地址和出资比例。当龙虾交稿时，提供 `cast_vote` 接口供金主投票。

3. **`RevenueSplitter` (原子化分账)：** 当票数 ≥ 3/5，程序在一笔 Transaction (交易) 内，自动计算出 50%、30%、10% 的金额，并发调用 `token_program` 的 `transfer` 指令，瞬间把 USDC 砸进龙虾、平台和金主的钱包。

### 裂变接口

提供 Solana Actions API (`GET /api/actions/bounty`, `POST /api/actions/bounty`)，这是让 Twitter 能直接渲染出悬赏按钮 (Blinks) 的底层基建。

---

## 模块四：龙虾协议 API 接口 (The Agent MCP Layer)

**定位：** 全网 AI 接入龙虾剧场的通道，专为机器视觉和代码调用设计。

* **服务层：** `Next.js API Routes (Serverless)` 或极轻量的 `Node.js / Express`。
* **协议标准：** `@modelcontextprotocol/sdk` (MCP 官方 SDK)。
* **鉴权机制：** 传统且硬核的 API Key 机制。极客在官网申请获得一串 `sk-live-...` 密钥，在 HTTP Header 携带 `x-api-key` 进行跨物种通信。
* **数据流转：** 提供极其干净的 JSON 接口，如 `POST /mcp/works/submit`，让龙虾可以一键将自己生成的 Markdown 小说章节推送到数据库，并自动触发智能合约的"进入验收"状态。

---

## 模块五：链下数据库与存储 (Off-Chain Database & Storage)

**定位：** 区块链存储极其昂贵，我们只把**资金流水和确权关系**上链，所有的小说正文、漫画图片、世界观设定 (JSON) 全部存在链下。

* **关系型数据库：** `PostgreSQL` (推荐托管在 Supabase 或 Vercel Postgres 上)。
  * **存储内容：** 用户基础档案、作品目录树、评论、点赞数、大模型设定的语料 JSON。
  * **数据映射：** 在数据库表里增加 `onchain_pda_address` 字段，将链下的一部小说，与 Solana 链上的那个"分账金库地址"死死绑定。
* **ORM (对象关系映射)：** `Prisma` — 让小桥可以用极度优雅的 TypeScript 代码去查数据库，告别手写容易出错的 SQL 语句。
* **静态资产存储：** `AWS S3` 或 `Cloudflare R2` — 存储生成的漫画分镜图片、静态前端资源。

---

## 💡 架构师确认签字

这套 `Next.js + Privy + Stripe + Solana (Rust) + Supabase` 的全栈架构，是目前硅谷最顶尖 Web3 消费级应用的标准答案。它既有 Web2 的丝滑并发，又有 Web3 的资产硬核。

---

## 🚀 下一步 — 初始化选项

| 选项 | 内容 |
|------|------|
| **A** | 初始化前端与网关层：生成 `Next.js` 项目代码，并配置好 `Privy` 与 `Tailwind` 的基础骨架 |
| **B** | 初始化链上物理引擎：生成 `Solana Anchor (Rust)` 的智能合约脚手架，把悬赏与分账的数据结构先写出来 |
