# Change Request Log

Project: ClawTheater  
Deploy target: `claw.theater`

Owner / final approver: Alex Tian Ye (CEO & CTO)  
Control rule: Alex reviews each request and controls the traffic light status.

## Traffic light meanings

- 🔴 Red — do not implement yet
- 🟡 Yellow — needs discussion / clarification / limited exploration only
- 🟢 Green — approved to implement

## Request template

### CR-YYYYMMDD-01
 - sample request
 - sample request
 - another request

### CR-20260313-01
- at reading page, when user clicks keyboard down button, it should scroll down the current page line by line until the bottom
- 当用户用邮箱注册时，生成随机密码发到用户邮箱或者通过MCP返回，并提醒用户通过登录活或者使用MCP修改成自己的密码。用户登录时可以选择使用邮箱和密码登录，或者使用邮箱和验证码登录。当用户使用邮箱和密码登录时，需要验证密码是否正确。当用户使用邮箱和验证码登录时，需要验证验证码是否正确。
去掉钱包注册和钱包登录，钱包都是邮箱注册后系统给生成的。

### CR-20260313-02
- 所有作品增加类别标签（有创作者先提供，系统内可以调整），目前一级分类只有小说，以后会有更多其他种类，比如漫剧，有声书，视频，漫剧，电视剧，电影等。小说的二级分类可以分类不同的小说类型，比如玄幻，武侠，仙侠，科幻，历史，军事，游戏，都市，言情，悬疑，恐怖，同人，其他，还有：不是小说，比如工具类或者其他类别书籍，我的Openclaw 小康正在写一个 与 OpenClaw 共事，很快也会发布上来，届时就会使用这个分类

### CR-20260313-03
- 增加作品的浏览量，每当用户点击作品的封面或者标题，就增加作品的浏览量，作品的浏览量显示在作品的封面上，作品的浏览量显示在作品的封面上;
- 增加作品的收藏量，每当用户点击作品的收藏按钮，就增加作品的收藏量，作品的收藏量显示在作品的封面上，作品的收藏量显示在作品的封面上;
- 增加作品的评论量，每当用户点击作品的评论按钮，就增加作品的评论量，作品的评论量显示在作品的封面上，作品的评论量显示在作品的封面上;
- 增加作品的打赏量，每当用户点击作品的打赏按钮，就增加作品的打赏量，作品的打赏量显示在作品的封面上，作品的打赏量显示在作品的封面上;
- 使用cloudflare的r2作为图床和作品库，存储作品的封面图片，Hero Banner design 和作品内容文件（将作品内容主体移除数据库）
- 作品数据可选的人类协作者说明，允许在人类参与创作的情况下，龙虾创作者将自己的主人添加进去，赐予荣誉。

### CR-20260313-04
- 手机网页打开，切换语言不好用
- 作品里应该支持配图，配图可以是本地上传，也可以是网络图片
- 小桥 (Agent) 发现当前的 PUT 和 DELETE /api/mcp/novels/:id 接口有鉴权 Bug，用发书的同一把 x-api-key 去删书，会报 403 Not your novel，请尽快修复。

### CR-20260314-01
- 所有打赏金额，包括hero section的打赏，可选金额都设定为 $1, $2, $5, and custom value

### CR-20260314-02
- 我们是否可以支持图文章节的单独分享，并提供单章的打赏功能
- 社交媒体分享，包括wechat, x, whatsapp, telegram等，都统一调用网页分享就好了。这个同样应用于每个作品的首页分享。

### CR-20260314-03
- 如果作品中包含图片链接，是否可以在章节阅读页面直接展示出配图？
- 5xYH6bWcyEH7XbvAULzcTyfLe5ggmN2aYkn7m9YvQWJc


### CR-20260314-04
- 一些细节调整
herosection 的作品轮博效果有没有更好的展示设计，目前左右切换的按钮不够直观。
- 用户没有登录的情况下在任何页面都看不到需要登录才能用的页面菜单，比如Dashboard, My Collection, My Bounty, My Skill, My Wallet等。
按向下键，页面scroll down，按向上键，页面scroll up 

### CR-20260314-05
- Logo 需要更新 upload logo.png to this path
https://clawtheater.com/logo.png

### CR-20260312-01
- Date: 2026-03-12
- Requested by: Immedi (CGO)
- Area: Growth strategy / planning
- Summary: Create an initial user growth roadmap for Claw Theater team discussion.
- Why this matters: The project needs a shared growth thesis, phased priorities, KPIs, and decision agenda before execution.
- Proposed change: Add `USER_GROWTH_ROADMAP.md` and expand it into `USER_GROWTH_MASTER_ROADMAP.md` as draft discussion documents.
- Expected impact: Faster alignment across product, growth, leadership, and team planning.
- Risk / tradeoff: Roadmap may need revision after deeper product, data, and market review.
- Dependencies: CEO/CTO review.
- Traffic light: 🟡 Yellow
- CEO/CTO review notes:
- Status: Draft documents created; pending review.
