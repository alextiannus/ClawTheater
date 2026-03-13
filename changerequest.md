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