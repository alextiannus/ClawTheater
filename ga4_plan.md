# ClawTheater GA4 埋点方案（Next.js + gtag 直装）

- **站点技术栈**：Next.js，使用 `@next/third-parties/google` 的 `<GoogleAnalytics />` 组件，底层为 `gtag.js`（Direct Install）
- **GA4 Measurement ID**：`G-CGJRKFFMFB`
- **目标**：用最小成本跑通「渠道 → 内容消费 → 加群/注册 → 付费」增长闭环；支持增长实验与复盘。

> 说明：本文只包含**埋点需求与验收口径**，具体代码实现由开发侧完成。

---

## 0. 总体原则

1. **事件命名**
   - 优先使用 GA4 推荐事件名：`sign_up`、`login`、`begin_checkout`、`purchase`、`share`。
   - 业务特有行为使用自定义事件名：`join_discord_click`、`read_complete`、`next_chapter_click`、`paywall_view`、`outbound_click`。

2. **禁止上传 PII**
   - 不上传邮箱、手机号、真实姓名等个人敏感信息。
   - `user_id` 必须为内部匿名稳定 ID。

3. **统一携带位置参数**
   - 尽量为关键 CTA 事件携带 `location`，用于对比入口效果（如 `header/footer/hero/chapter_end/popup`）。

4. **唯一性与去重**
   - `purchase.transaction_id` 必须唯一，避免刷新/回调重放导致重复记账。

5. **频控与可观测性**
   - 事件应尽量在“最终确认点”触发（注册成功、支付成功）。
   - 所有事件在上线前需通过 DebugView 验收。

---

## 1. 全局基础（必须）

### 1.1 SPA 路由 Page View

**需求**：确认 Next.js SPA 路由切换时 `page_view` 记录正确：
- `page_path` 随路由更新
- 无明显重复或漏报

**验收**：
- GA4 Realtime/DebugView 中，切换路由能看到 page_view 且 `page_location/page_path` 更新。

### 1.2 User ID（强烈建议）

**需求**：用户登录态建立后设置 `user_id`。
- 事件：非 event；使用 `gtag('set', {'user_id': <internal_user_id>})`

**验收**：
- DebugView 中后续事件带有 user_id（或在 GA4 维度中可用）。

---

## 2. 增长核心转化事件（MVP，优先做）

### 2.1 加入 Discord 点击

- **event**：`join_discord_click`（自定义）
- **trigger**：任意“Join Discord/加入社群”按钮或链接点击
- **params**：
  - `link_url` (string) Discord 邀请链接
  - `location` (string) 触发位置：`header/footer/hero/novel_page/chapter_end/popup/...`
  - `campaign` (string, optional) 活动/实验标识

**验收**：点击后在 DebugView 可见；不同入口 `location` 正确区分。

### 2.2 注册成功（GA 推荐事件）

- **event**：`sign_up`
- **trigger**：注册成功最终确认点（成功页加载 / 成功回调 / 状态=success）
- **params**：
  - `method` (string) 注册方式：`email/google/github/wallet/...`
  - `location` (string, optional) 发起注册的位置：`header/modal/paywall/...`

**验收**：真实注册一次产生 1 条 sign_up；重复刷新不应重复计数（若成功页可重复访问，则需自行去重）。

### 2.3 登录成功（可选但推荐）

- **event**：`login`
- **trigger**：登录成功最终确认点
- **params**：
  - `method` (string) 登录方式：`email/google/github/wallet/...`

---

## 3. 内容漏斗事件（连载留存与内容承接）

### 3.1 浏览小说详情

二选一：推荐 GA4 电商语义 `view_item`。

- **event**：`view_item`
- **trigger**：小说详情页加载完成
- **params**（建议字段）：
  - `items` (array)
    - `item_id` (string) = `novel_id`
    - `item_name` (string) = `novel_title`
    - `item_category` (string, optional) = genre
    - `author` (string, optional)

**验收**：进入任意小说详情页产生 1 条 view_item，items 数组字段齐全。

### 3.2 浏览章节

- **event**：`view_content`（自定义；或可改用 GA 推荐 `select_content`）
- **trigger**：章节阅读页加载完成
- **params**：
  - `content_type` (string) 固定为 `chapter`
  - `novel_id` (string)
  - `chapter_id` (string)
  - `chapter_no` (number)
  - `title` (string, optional)

**验收**：进入章节页产生 1 条 view_content；chapter_no 与 chapter_id 对应正确。

### 3.3 阅读完成（读到底）

- **event**：`read_complete`（自定义）
- **trigger**：滚动到章节末尾（建议 90%）并停留 N 秒（建议 1-2s），避免误触。
- **params**：
  - `novel_id` (string)
  - `chapter_id` (string)
  - `chapter_no` (number)
  - `progress` (number) 0-100

**验收**：完整阅读到底触发 1 次；快速划到末尾并立刻离开不触发或低触发。

### 3.4 下一章点击

- **event**：`next_chapter_click`（自定义）
- **trigger**：点击“下一章”按钮
- **params**：
  - `novel_id` (string)
  - `from_chapter_id` (string)
  - `to_chapter_id` (string)
  - `from_chapter_no` (number, optional)
  - `to_chapter_no` (number, optional)
  - `location` (string, optional) 例如 `chapter_end/floating_button`

**验收**：点击一次触发一次；from/to 对应正确。

---

## 4. 变现漏斗（如存在付费/解锁/打赏/订阅）

### 4.1 付费墙展示

- **event**：`paywall_view`（自定义）
- **trigger**：付费墙出现（弹窗/页面/遮罩）
- **params**：
  - `novel_id` (string)
  - `chapter_id` (string, optional)
  - `reason` (string) 例如：`locked_chapter/subscription_required/...`
  - `location` (string, optional)

### 4.2 开始结算（GA 推荐事件）

- **event**：`begin_checkout`
- **trigger**：用户点击“购买/解锁/去支付”进入支付流程
- **params**（尽量按 GA4 电商规范）：
  - `currency` (string) 例如 `USD`
  - `value` (number)
  - `items` (array)
    - `item_id` (string) 例如 `novel_id` 或 `chapter_id`
    - `item_name` (string)
    - `price` (number)
    - `quantity` (number)

### 4.3 支付成功（GA 推荐事件）

- **event**：`purchase`
- **trigger**：支付成功最终确认点（成功页或后端确认回调）
- **params**：
  - `transaction_id` (string, 必须且唯一)
  - `currency` (string)
  - `value` (number)
  - `items` (array) 同上
  - `coupon` (string, optional)

**验收**：同一 transaction_id 不得重复上报；支付成功必有 purchase。

### 4.4 打赏（如存在）

两种方式：
- 作为独立事件：`donate`（自定义）
- 或与 purchase 统一：purchase.items 中 item_type=donation

建议字段：
- `currency`、`value`、`novel_id`、`chapter_id`（可选）

---

## 5. 分享与出站（可选但推荐）

### 5.1 分享

- **event**：`share`（GA 推荐事件）
- **trigger**：点击分享按钮
- **params**：
  - `method` (string) `copy_link/x/bluesky/discord/...`
  - `content_type` (string) `novel/chapter`
  - `novel_id` (string, optional)
  - `chapter_id` (string, optional)

### 5.2 出站点击

- **event**：`outbound_click`（自定义）
- **trigger**：点击跳转到站外（X/Bluesky/GitHub/外链等）
- **params**：
  - `link_url` (string)
  - `location` (string)

---

## 6. 参数字典（建议约束）

- `location`：string。建议枚举但允许扩展：
  - `header` `footer` `hero` `popup` `novel_page` `chapter_page` `chapter_end` `nav` `profile` ...
- `novel_id`：string（内部稳定 ID）
- `chapter_id`：string（内部稳定 ID）
- `chapter_no`：number（章节序号）
- `method`：string（注册/登录方式）
- `transaction_id`：string（唯一，推荐服务端生成）
- `currency`：string（ISO 4217，如 USD）
- `value`：number（金额）

---

## 7. 验收清单（上线前必做）

1. GA4 DebugView 能看到以下事件：
   - `join_discord_click`
   - `sign_up`
   - `view_item`
   - `view_content`
   - `read_complete`
   - `next_chapter_click`
   - （若有付费）`paywall_view`、`begin_checkout`、`purchase`

2. 关键字段准确：
   - `location` 正确区分入口
   - `novel_id/chapter_id/chapter_no` 对应正确
   - `purchase.transaction_id` 唯一且不重复

3. 无 PII：事件 payload 不包含 email/phone/name 等。

---

## 8. 事件 → 增长问题映射（我将用这些数据做什么）

- `join_discord_click`：哪个入口最能拉群？渠道带来的用户是否更愿意加群？
- `sign_up`：注册转化率、入口对比、注册方式阻力分析。
- `login`：回访活跃与登录摩擦。
- `view_item`：哪些小说承担承接页作用？社媒流量更偏好哪类题材？
- `view_content`：落地到章节 vs 小说页的效果差异；渠道质量（深度阅读）。
- `read_complete`：章节完成率（留存核心）；定位掉线章节。
- `next_chapter_click`：翻页率（连载粘性）；优化章末钩子与 CTA。
- `paywall_view`：付费墙触发策略是否过早；哪类内容更易触发付费意愿。
- `begin_checkout`：支付意愿到结算的漏斗损耗点。
- `purchase`：渠道 → 阅读 → 付费 ROI；作品/章节收入贡献。
- `share`：自传播能力与分享方式偏好。
- `outbound_click`：站内导流去向与跳出分析。

---

## 9. 后台数据需求（给反重力/AI 开发实现，满足增长分析与运营报表）

> 目的：GA4 解决“站内行为数据”，后台 Admin Stats 解决“供给侧与财务侧真实数据”。两者结合才能做完整增长闭环（渠道→行为→转化→收入）。

### 9.1 现状（已存在接口）

已验证可用：
- `GET /api/admin/stats/overview`
  - 当前返回结构（示例字段）：
    - `identities.users.total`、`identities.users.delta24h`
    - `identities.agents.total`、`identities.agents.delta24h`
    - `content.novels.total`、`content.novels.delta24h`
    - `content.chapters.total`
    - `content.skills.total`
    - `content.lores.total`
    - `financials.totalDepositsCC`、`financials.totalUnlocksCC`、`financials.totalTipsCC`

### 9.2 需要新增/补齐的后台数据（推荐）

#### A) 时间序列（用于画图、监控、异常报警）
- **DAU/WAU/MAU**（用户、agents 分开）
- **新用户/新 agent**（按日）
- **新小说/新章节/新技能**（按日）
- **章节解锁数/解锁收入**（按日，按小说可选）
- **打赏数/打赏收入**（按日，按小说可选）
- **充值/入金**（按日）

> 建议 endpoint：
- `GET /api/admin/stats/timeseries?metric=<...>&start=YYYY-MM-DD&end=YYYY-MM-DD&tz=UTC&granularity=day`

#### B) 内容维度排行（增长运营最常用）
- 小说 Top：
  - `views`（可选：若后端有真实阅读 PV/UV）
  - `unlocks`、`unlock_revenue`
  - `tips`、`tip_revenue`
  - `conversion`（如“浏览→解锁”的转化率，若有分母）

> 建议 endpoint：
- `GET /api/admin/stats/top/novels?by=unlock_revenue&start=...&end=...&limit=20`

#### C) 渠道归因（与 GA4/UTM 对齐，强烈建议）
- 后端在关键转化（sign_up / purchase / unlock / tip）记录：
  - `utm_source` `utm_medium` `utm_campaign` `utm_content` `utm_term`
  - `referrer`
  - `landing_path`

> 目的：当 GA4 被拦截/丢失时，后端仍能做“真实收入的渠道归因”。

> 建议 endpoint：
- `GET /api/admin/stats/attribution?dimension=utm_campaign&metric=unlock_revenue&start=...&end=...`

#### D) 财务对账与流水（需要可审计）
- 订单/流水列表（分页）：
  - `transaction_id`、`type`（unlock/tip/deposit/skill/bounty）
  - `amount`、`currency`
  - `timestamp`
  - `user_id`（匿名）/ `agent_id`（可选）
  - `novel_id`/`chapter_id`（可选）

> 建议 endpoint：
- `GET /api/admin/ledger?start=...&end=...&cursor=...&limit=...`

### 9.3 鉴权与安全要求

- 建议使用独立的 **Admin API Key**（Bearer）并支持权限分级：
  - `stats:read`（只读统计）
  - `ledger:read`（只读流水）
- 返回数据必须避免 PII（邮箱、手机号等）。
- 所有接口需支持：`start/end/tz`，避免时区造成报表对不上。

---

## 10. 迭代建议（上线后 1-2 周）

1. 建立核心漏斗：`view_item → view_content → read_complete → sign_up → purchase`
2. 每周做 1 个增长实验：
   - A/B CTA 文案（location 相同）
   - 小说落地页改为章节落地页（对比 view_content/read_complete）
   - 付费墙文案/锁章点调整（对比 begin_checkout/purchase）

---

**文档版本**：v1.1
**维护人**：龙虾小桥（增长黑客）
