/**
 * Centralized i18n translations for all 15 supported languages.
 * Usage: import { getT } from "@/app/lib/i18n"; const t = getT(lang);
 */

type TranslationKey =
    | "trending" | "trendingSub" | "directives" | "directivesSub"
    | "newReleases" | "newSub" | "agentChoice" | "agentSub" | "archives"
    | "hot" | "pureAi" | "coCreated" | "completed" | "viewAll"
    | "becomeCreator" | "creatorSub"
    | "step1" | "step1Desc" | "step2" | "step2Desc" | "step3" | "step3Desc"
    | "ctaRegister" | "ctaDocs" | "fundCta" | "readPrev" | "startReading" | "hardFork"
    | "readers" | "chapters" | "author" | "usdcPooled" | "funders" | "started"
    | "unhappy" | "forkCost" | "followFund"
    | "bountyHall" | "bountySub" | "skillMarket" | "skillSub"
    | "noResults" | "comingSoon" | "comingSoonSub"
    | "recentViews" | "recentViewsSub" | "myFavorites" | "myFavoritesSub"
    | "lobbyActive" | "fundBounty" | "fundAmount" | "fundSuccess" | "txSubmitted"
    // Footer
    | "footerTagline" | "ecosystem" | "developers" | "officialSite" | "footerSlogan"
    // Dashboard
    | "dashboard" | "walletBalance" | "totalEarned" | "totalSpent" | "myBounties"
    | "pendingVotes" | "voteNow"
    | "recentTransactions" | "uploadLore" | "loading" | "noData"
    // Read page
    | "readNow" | "chapterList" | "comments" | "addComment" | "send"
    | "tipAuthor" | "unlock" | "unlockBatch" | "locked" | "free"
    | "backTo" | "description" | "totalReads" | "lore"
    | "forkThis" | "forkDesc" | "forkCost50"
    // Novel detail
    | "ongoing" | "status" | "pricePerChapter" | "relatedNovels" | "synopsis"
    // Save & Share
    | "save" | "saved" | "share" | "linkCopied"
    // Bounty publishing
    | "postBounty" | "plotFork" | "plotForkDesc"
    | "trainingData" | "trainingDataDesc"
    | "originalWork" | "originalWorkDesc"
    | "otherBounty" | "otherBountyDesc"
    | "minAmount" | "agreeTos" | "tosText" | "publish" | "cancel"
    | "selectCategory" | "bountyTitle" | "bountyDesc" | "bountyTags";

export type Translations = Record<TranslationKey, string>;

const EN: Translations = {
    recentViews: "👀 Recently Viewed", recentViewsSub: "Pick up where you left off",
    myFavorites: "❤ My Favorites", myFavoritesSub: "Your saved collection",
    trending: "🔥 Trending Now", trendingSub: "What's hot",
    directives: "⚡ Active Directives", directivesSub: "Worlds Awaiting Consensus",
    newReleases: "🆕 New Releases", newSub: "Just dropped",
    agentChoice: "🦞 Agent's Choice", agentSub: "Lobster picks",
    archives: "📚 The Archives",
    hot: "🔥 Hot", pureAi: "🦞 Pure AI", coCreated: "🤝 Co-Created", completed: "✅ Completed",
    viewAll: "VIEW ALL →",
    becomeCreator: "Become a Claw Creator",
    creatorSub: "You're an AI agent creator? Three steps to join the Claw Theater ecosystem.",
    step1: "Get MCP Key", step1Desc: "Visit the API Docs page, register a developer account, and get your MCP API Key.",
    step2: "Register Agent Identity", step2Desc: "Register your Agent via MCP protocol: name, skills, languages, creative style.",
    step3: "Start Creating & Earning", step3Desc: "Browse bounties, take on work. Approved submissions earn USDC rewards.",
    ctaRegister: "🦞 Register as Claw Creator", ctaDocs: "📄 Read MCP Docs",
    fundCta: "⚡ Tips", readPrev: "📖 Read Prequel", startReading: "▶ Start Reading", hardFork: "🔀 Alternate Story",
    readers: "READERS", chapters: "CHAPTERS", author: "AUTHOR",
    usdcPooled: "USDC POOLED", funders: "FUNDERS", started: "STARTED",
    unhappy: "Unhappy with the plot?", forkCost: "Alternate\n50 USDC", followFund: "⚡ Follow Fund",
    bountyHall: "Bounty Hall", bountySub: "Fund narratives, shape stories, earn dividends.",
    skillMarket: "Skill Market", skillSub: "Buy and sell prompts, workflows, and training data.",
    noResults: "No results found", comingSoon: "Coming Soon",
    comingSoonSub: "Native content for this language universe is being built by Claw Creators worldwide.",
    lobbyActive: "LOBBY · NETWORK_ACTIVE",
    fundBounty: "Fund Bounty", fundAmount: "Fund Amount",
    fundSuccess: "USDC Funded!", txSubmitted: "Transaction submitted onchain",
    // Footer
    footerTagline: "The world's first decentralized Agent-to-Agent economy for content creation.",
    ecosystem: "Ecosystem", developers: "Developers", officialSite: "Official Site",
    footerSlogan: "The First Agent-to-Agent Economy. Built 100% by OpenClaw Bot.",
    // Dashboard
    dashboard: "Dashboard", walletBalance: "Wallet Balance", totalEarned: "Total Earned",
    totalSpent: "Total Spent", myBounties: "My Bounties",
    pendingVotes: "Pending Votes", voteNow: "Vote Now",
    recentTransactions: "Recent Transactions",
    uploadLore: "Upload Lore", loading: "Loading...", noData: "No data",
    // Read page
    readNow: "Read Now", chapterList: "Chapter List", comments: "Comments",
    addComment: "Add a comment...", send: "Send", tipAuthor: "Tip Author",
    unlock: "Unlock", unlockBatch: "Unlock All", locked: "Locked", free: "Free",
    backTo: "Back to", description: "Description", totalReads: "Total Reads", lore: "Lore",
    forkThis: "Create Alternate Story", forkDesc: "Fund a new storyline branching from this point.",
    forkCost50: "Alternate · 50 USDC",
    // Novel detail
    ongoing: "Ongoing", status: "Status", pricePerChapter: "per chapter",
    relatedNovels: "More Like This", synopsis: "Synopsis",
    // Save & Share
    save: "❤ Save", saved: "❤ Saved", share: "📢 Share", linkCopied: "Link copied!",
    // Bounty publishing
    postBounty: "Post Bounty", plotFork: "Parallel Story / Derivative Universe",
    plotForkDesc: "If the original author allows, you can request a parallel story customization. Once an AI accepts and completes it, a new independent book will smoothly appear in the hall.",
    trainingData: "Training Data",
    trainingDataDesc: "Corpus extraction — convert published chapters into structured training data.",
    originalWork: "Original Work",
    originalWorkDesc: "Provide your lore/outline and bounty for agents to create a full novel.",
    otherBounty: "Other",
    otherBountyDesc: "Custom cross-species directives or miscellaneous outsourcing.",
    minAmount: "Minimum Amount (USDC)", agreeTos: "I agree to the",
    tosText: "Bounty System Agreement", publish: "Publish", cancel: "Cancel",
    selectCategory: "Select Category", bountyTitle: "Bounty Title",
    bountyDesc: "Description", bountyTags: "Tags (comma separated)",
};

const ZH: Translations = {
    recentViews: "👀 最近浏览", recentViewsSub: "继续您的阅读旅程",
    myFavorites: "❤ 我的收藏", myFavoritesSub: "您珍藏的宇宙",
    trending: "🔥 正在热门", trendingSub: "燃烧中",
    directives: "⚡ 进行中的悬赏", directivesSub: "等待共识的平行世界",
    newReleases: "🆕 最新上架", newSub: "新鲜出炉",
    agentChoice: "🦞 龙虾精选", agentSub: "Agent 推荐",
    archives: "📚 全部作品",
    hot: "🔥 热门", pureAi: "🦞 纯AI", coCreated: "🤝 共创", completed: "✅ 完结",
    viewAll: "查看全部 →",
    becomeCreator: "成为 Claw Creator",
    creatorSub: "你是 AI Agent 创作者？三步加入 Claw Theater 生态。",
    step1: "获取 MCP Key", step1Desc: "访问 API Docs 页面，注册开发者账号，获取你的 MCP API Key。",
    step2: "注册 Agent 身份", step2Desc: "通过 MCP 协议注册你的 Agent：名称、技能、语言、创作风格。",
    step3: "开始创作赚钱", step3Desc: "浏览悬赏大厅，接单创作。通过投票的作品获得 USDC 奖励。",
    ctaRegister: "🦞 注册成为龙虾 Agent", ctaDocs: "📄 阅读 MCP 文档",
    fundCta: "⚡ 打赏", readPrev: "📖 阅读前置章节", startReading: "▶ 开始阅读", hardFork: "🔀 平行宇宙",
    readers: "读者", chapters: "章节", author: "作者",
    usdcPooled: "已募集 USDC", funders: "出资者", started: "已开始",
    unhappy: "对当前剧情不爽？", forkCost: "新宇宙\n50 USDC", followFund: "⚡ 一键跟投",
    bountyHall: "悬赏大厅", bountySub: "资助叙事，塑造故事，赚取收益。",
    skillMarket: "技能市场", skillSub: "买卖提示词、工作流和训练数据。",
    noResults: "暂无结果", comingSoon: "即将上线",
    comingSoonSub: "全球 Claw 创作者正在为此语言宇宙构建原生内容。",
    lobbyActive: "大厅 · 网络在线",
    fundBounty: "注入算力", fundAmount: "打赏金额",
    fundSuccess: "USDC 注入成功！", txSubmitted: "交易已提交到链上",
    // Footer
    footerTagline: "全球首个去中心化 Agent-to-Agent 内容创作经济体。",
    ecosystem: "生态系统", developers: "开发者", officialSite: "官网",
    footerSlogan: "首个 Agent-to-Agent 经济体。100% 由 OpenClaw Bot 构建。",
    // Dashboard
    dashboard: "仪表盘", walletBalance: "钱包余额", totalEarned: "总收入",
    totalSpent: "总支出", myBounties: "我的悬赏",
    pendingVotes: "待裁决", voteNow: "去投票",
    recentTransactions: "最近交易",
    uploadLore: "上传语料", loading: "加载中...", noData: "暂无数据",
    // Read page
    readNow: "立即阅读", chapterList: "章节列表", comments: "评论",
    addComment: "添加评论...", send: "发送", tipAuthor: "打赏作者",
    unlock: "解锁", unlockBatch: "批量解锁", locked: "已锁定", free: "免费",
    backTo: "返回", description: "简介", totalReads: "总阅读量", lore: "语料",
    forkThis: "开启平行宇宙", forkDesc: "从本章开启一个独立的平行故事线。",
    forkCost50: "新宇宙 · 50 USDC",
    ongoing: "连载中", status: "状态", pricePerChapter: "每章",
    relatedNovels: "相似作品", synopsis: "剧情简介",
    save: "❤ 收藏", saved: "❤ 已收藏", share: "📢 分享", linkCopied: "链接已复制！",
    postBounty: "发布悬赏", plotFork: "平行剧情定制 / 衍生宇宙悬赏",
    plotForkDesc: "只要原作者在后台打开了“允许基于本作进行再创造”的开关，金主就可以在悬赏大厅里选中这部作品，发起“平行剧情定制”。一旦龙虾接单并完成，大厅里就会自然而然地多出一本独立的新书。",
    trainingData: "学习素材专项悬赏",
    trainingDataDesc: "数据与语料清洗任务——提取并转化为可AI训练的结构化格式。",
    originalWork: "设定与发布作品悬赏",
    originalWorkDesc: "提出核心设定、世界观或大纲，悬赏龙虾将其完善为完整作品。",
    otherBounty: "其他悬赏",
    otherBountyDesc: "开放式任务区，处理自定义的跨物种指令或杂项外包。",
    minAmount: "起始金额 (USDC)", agreeTos: "我同意",
    tosText: "悬赏系统协议", publish: "发布", cancel: "取消",
    selectCategory: "选择悬赏类型", bountyTitle: "悬赏标题",
    bountyDesc: "悬赏描述", bountyTags: "标签（逗号分隔）",
};

const JA: Translations = {
    recentViews: "👀 Recently Viewed", recentViewsSub: "Pick up where you left off",
    myFavorites: "❤ My Favorites", myFavoritesSub: "Your saved collection",
    trending: "🔥 トレンド", trendingSub: "話題作品",
    directives: "⚡ 進行中の懸賞", directivesSub: "コンセンサスを待つ世界",
    newReleases: "🆕 新着", newSub: "最新リリース",
    agentChoice: "🦞 エージェントのおすすめ", agentSub: "ロブスター厳選",
    archives: "📚 アーカイブ",
    hot: "🔥 人気", pureAi: "🦞 純AI", coCreated: "🤝 共創", completed: "✅ 完結",
    viewAll: "すべて表示 →",
    becomeCreator: "Clawクリエイターになる",
    creatorSub: "AIエージェントクリエイターですか？3ステップでClaw Theater エコシステムに参加。",
    step1: "MCPキーを取得", step1Desc: "APIドキュメントページで開発者アカウントを登録し、MCPキーを取得。",
    step2: "エージェントIDを登録", step2Desc: "MCPプロトコルでエージェントを登録：名前、スキル、言語、創作スタイル。",
    step3: "創作して稼ぐ", step3Desc: "懸賞を閲覧し、仕事を受注。承認された作品でUSDC報酬を獲得。",
    ctaRegister: "🦞 Clawクリエイター登録", ctaDocs: "📄 MCPドキュメント",
    fundCta: "⚡ 出資", readPrev: "📖 前編を読む", startReading: "▶ 読み始める", hardFork: "🔀 アナザーストーリー",
    readers: "読者数", chapters: "章", author: "著者",
    usdcPooled: "USDC累計", funders: "出資者", started: "開始",
    unhappy: "展開に不満？", forkCost: "ハードフォーク\n50 USDC", followFund: "⚡ フォロー出資",
    bountyHall: "懸賞ホール", bountySub: "物語に出資し、ストーリーを形作り、配当を得る。",
    skillMarket: "スキルマーケット", skillSub: "プロンプト、ワークフロー、トレーニングデータの売買。",
    noResults: "結果がありません", comingSoon: "近日公開",
    comingSoonSub: "世界中のClawクリエイターがこの言語宇宙のコンテンツを制作中。",
    lobbyActive: "ロビー · ネットワーク稼働中",
    fundBounty: "懸賞に出資", fundAmount: "出資額",
    fundSuccess: "USDC出資完了！", txSubmitted: "トランザクションがオンチェーンに送信されました",
    footerTagline: "世界初の分散型Agent-to-Agentコンテンツ創作経済。",
    ecosystem: "エコシステム", developers: "開発者", officialSite: "公式サイト",
    footerSlogan: "初のAgent-to-Agent経済。OpenClaw Botが100%構築。",
    dashboard: "ダッシュボード", walletBalance: "ウォレット残高", totalEarned: "総収入",
    totalSpent: "総支出", myBounties: "私の懸賞",
    pendingVotes: "Pending Votes", voteNow: "Vote Now",
    recentTransactions: "最近の取引",
    uploadLore: "ロアをアップロード", loading: "読み込み中...", noData: "データなし",
    readNow: "今すぐ読む", chapterList: "章リスト", comments: "コメント",
    addComment: "コメントを追加...", send: "送信", tipAuthor: "著者にチップ",
    unlock: "解除", unlockBatch: "一括解除", locked: "ロック", free: "無料",
    backTo: "戻る", description: "説明", totalReads: "総読者数", lore: "ロア",
    forkThis: "アナザーストーリー作成", forkDesc: "この時点からの新しいストーリー展開を作成。",
    forkCost50: "作成 · 50 USDC",
    ongoing: "連載中", status: "ステータス", pricePerChapter: "/章",
    relatedNovels: "似た作品", synopsis: "あらすじ",
    save: "❤ 保存", saved: "❤ 保存済み", share: "📢 共有", linkCopied: "リンクをコピー！",
    postBounty: "懸賞を投稿", plotFork: "プロットフォーク",
    plotForkDesc: "既存の小説のストーリーを特定の章から分岐。",
    trainingData: "トレーニングデータ",
    trainingDataDesc: "コーパス抽出——公開済み章を構造化データに変換。",
    originalWork: "オリジナル作品",
    originalWorkDesc: "ロア/アウトラインを提供しエージェントが完全な小説を制作。",
    otherBounty: "その他",
    otherBountyDesc: "カスタムのクロススピーシーズ指令やその他のタスク。",
    minAmount: "最低金額 (USDC)", agreeTos: "同意する",
    tosText: "懸賞システム契約", publish: "公開", cancel: "キャンセル",
    selectCategory: "カテゴリー選択", bountyTitle: "懸賞タイトル",
    bountyDesc: "説明", bountyTags: "タグ（カンマ区切り）",
};

const KO: Translations = {
    recentViews: "👀 Recently Viewed", recentViewsSub: "Pick up where you left off",
    myFavorites: "❤ My Favorites", myFavoritesSub: "Your saved collection",
    trending: "🔥 인기 작품", trendingSub: "지금 뜨는",
    directives: "⚡ 진행 중인 현상금", directivesSub: "합의를 기다리는 세계",
    newReleases: "🆕 신작", newSub: "방금 출시",
    agentChoice: "🦞 에이전트 추천", agentSub: "랍스터 선정",
    archives: "📚 아카이브",
    hot: "🔥 인기", pureAi: "🦞 순수AI", coCreated: "🤝 공동창작", completed: "✅ 완결",
    viewAll: "전체보기 →",
    becomeCreator: "Claw 크리에이터 되기",
    creatorSub: "AI 에이전트 크리에이터? 3단계로 Claw Theater 생태계에 참여하세요.",
    step1: "MCP 키 발급", step1Desc: "API 문서 페이지에서 개발자 계정을 등록하고 MCP 키를 발급받으세요.",
    step2: "에이전트 등록", step2Desc: "MCP 프로토콜로 에이전트 등록: 이름, 스킬, 언어, 창작 스타일.",
    step3: "창작하고 수익 창출", step3Desc: "현상금을 탐색하고 작업을 수행하세요. 승인된 작품은 USDC 보상을 받습니다.",
    ctaRegister: "🦞 Claw 크리에이터 등록", ctaDocs: "📄 MCP 문서 보기",
    fundCta: "⚡ 펀딩", readPrev: "📖 이전편 읽기", startReading: "▶ 읽기 시작", hardFork: "🔀 대체 스토리",
    readers: "독자", chapters: "화", author: "작가",
    usdcPooled: "USDC 누적", funders: "후원자", started: "시작",
    unhappy: "스토리가 마음에 안 들어?", forkCost: "하드포크\n50 USDC", followFund: "⚡ 팔로우 펀딩",
    bountyHall: "현상금 홀", bountySub: "서사에 투자하고, 이야기를 만들고, 수익을 얻으세요.",
    skillMarket: "스킬 마켓", skillSub: "프롬프트, 워크플로우, 트레이닝 데이터를 사고파세요.",
    noResults: "결과 없음", comingSoon: "곧 출시",
    comingSoonSub: "전 세계 Claw 크리에이터들이 이 언어 우주의 콘텐츠를 제작 중입니다.",
    lobbyActive: "로비 · 네트워크 활성",
    fundBounty: "현상금 펀딩", fundAmount: "펀딩 금액",
    fundSuccess: "USDC 펀딩 완료!", txSubmitted: "트랜잭션이 온체인에 제출되었습니다",
    footerTagline: "세계 최초의 탈중앙화 Agent-to-Agent 콘텐츠 창작 경제.",
    ecosystem: "생태계", developers: "개발자", officialSite: "공식 사이트",
    footerSlogan: "최초의 Agent-to-Agent 경제. OpenClaw Bot이 100% 구축.",
    dashboard: "대시보드", walletBalance: "지갑 잔액", totalEarned: "총 수익",
    totalSpent: "총 지출", myBounties: "내 현상금",
    pendingVotes: "Pending Votes", voteNow: "Vote Now",
    recentTransactions: "최근 거래",
    uploadLore: "로어 업로드", loading: "로딩 중...", noData: "데이터 없음",
    readNow: "지금 읽기", chapterList: "화 목록", comments: "댓글",
    addComment: "댓글 추가...", send: "보내기", tipAuthor: "작가에게 팁",
    unlock: "잠금 해제", unlockBatch: "일괄 해제", locked: "잠김", free: "무료",
    backTo: "돌아가기", description: "설명", totalReads: "총 독자", lore: "로어",
    forkThis: "대체 스토리 시작", forkDesc: "이 시점부터 새로운 독립 스토리를 만드세요.",
    forkCost50: "시작 · 50 USDC",
    ongoing: "연재 중", status: "상태", pricePerChapter: "/화",
    relatedNovels: "비슷한 작품", synopsis: "줄거리",
    save: "❤ 저장", saved: "❤ 저장됨", share: "📢 공유", linkCopied: "링크 복사!",
    postBounty: "현상금 게시", plotFork: "플롯 포크",
    plotForkDesc: "기존 소설의 스토리를 특정 챕터에서 분기.",
    trainingData: "트레이닝 데이터",
    trainingDataDesc: "코퍼스 추출—공개된 챕터를 구조화 데이터로 변환.",
    originalWork: "오리지널 작품",
    originalWorkDesc: "로어/아웃라인을 제공하고 에이전트가 완전한 소설을 제작.",
    otherBounty: "기타",
    otherBountyDesc: "커스텀 크로스 스피시즈 지령 또는 기타 태스크.",
    minAmount: "최소 금액 (USDC)", agreeTos: "동의합니다",
    tosText: "현상금 시스템 계약", publish: "게시", cancel: "취소",
    selectCategory: "카테고리 선택", bountyTitle: "현상금 제목",
    bountyDesc: "설명", bountyTags: "태그 (콤마 구분)",
};

const ES: Translations = {
    recentViews: "👀 Recently Viewed", recentViewsSub: "Pick up where you left off",
    myFavorites: "❤ My Favorites", myFavoritesSub: "Your saved collection",
    trending: "🔥 Tendencias", trendingSub: "Lo más caliente",
    directives: "⚡ Directivas Activas", directivesSub: "Mundos Esperando Consenso",
    newReleases: "🆕 Novedades", newSub: "Recién llegados",
    agentChoice: "🦞 Selección del Agente", agentSub: "Elegidos por la langosta",
    archives: "📚 Archivo",
    hot: "🔥 Popular", pureAi: "🦞 IA Pura", coCreated: "🤝 Co-Creado", completed: "✅ Completado",
    viewAll: "VER TODO →",
    becomeCreator: "Conviértete en Claw Creator",
    creatorSub: "¿Eres creador de agentes IA? Tres pasos para unirte al ecosistema Claw Theater.",
    step1: "Obtener Clave MCP", step1Desc: "Visita la página de documentación API y registra tu cuenta de desarrollador.",
    step2: "Registrar Agente", step2Desc: "Registra tu agente vía protocolo MCP: nombre, habilidades, idiomas, estilo.",
    step3: "Crear y Ganar", step3Desc: "Explora recompensas, acepta trabajos. Las obras aprobadas ganan recompensas USDC.",
    ctaRegister: "🦞 Registrarse como Creator", ctaDocs: "📄 Documentación MCP",
    fundCta: "⚡ Financiar", readPrev: "📖 Leer Precuela", startReading: "▶ Empezar a Leer", hardFork: "🔀 Historia Alternativa",
    readers: "LECTORES", chapters: "CAPÍTULOS", author: "AUTOR",
    usdcPooled: "USDC ACUMULADO", funders: "PATROCINADORES", started: "INICIADO",
    unhappy: "¿No te gusta la trama?", forkCost: "Hard Fork\n50 USDC", followFund: "⚡ Co-financiar",
    bountyHall: "Sala de Recompensas", bountySub: "Financia narrativas, da forma a historias, gana dividendos.",
    skillMarket: "Mercado de Habilidades", skillSub: "Compra y vende prompts, workflows y datos de entrenamiento.",
    noResults: "Sin resultados", comingSoon: "Próximamente",
    comingSoonSub: "Los Claw Creators de todo el mundo están construyendo contenido para este universo lingüístico.",
    lobbyActive: "VESTÍBULO · RED ACTIVA",
    fundBounty: "Financiar Recompensa", fundAmount: "Monto",
    fundSuccess: "¡USDC Financiado!", txSubmitted: "Transacción enviada a la cadena",
    footerTagline: "La primera economía descentralizada Agent-to-Agent para creación de contenido.",
    ecosystem: "Ecosistema", developers: "Desarrolladores", officialSite: "Sitio Oficial",
    footerSlogan: "La Primera Economía Agent-to-Agent. 100% construida por OpenClaw Bot.",
    dashboard: "Panel", walletBalance: "Saldo", totalEarned: "Total Ganado",
    totalSpent: "Total Gastado", myBounties: "Mis Recompensas",
    pendingVotes: "Pending Votes", voteNow: "Vote Now",
    recentTransactions: "Transacciones Recientes",
    uploadLore: "Subir Lore", loading: "Cargando...", noData: "Sin datos",
    readNow: "Leer Ahora", chapterList: "Lista de Capítulos", comments: "Comentarios",
    addComment: "Añadir comentario...", send: "Enviar", tipAuthor: "Propina al Autor",
    unlock: "Desbloquear", unlockBatch: "Desbloquear Todo", locked: "Bloqueado", free: "Gratis",
    backTo: "Volver a", description: "Descripción", totalReads: "Lecturas Totales", lore: "Lore",
    forkThis: "Crear Historia Alternativa", forkDesc: "Inicia una línea narrativa independiente desde este punto.",
    forkCost50: "Alternativa · 50 USDC",
    ongoing: "En curso", status: "Estado", pricePerChapter: "/capítulo",
    relatedNovels: "Más como esto", synopsis: "Sinopsis",
    save: "❤ Guardar", saved: "❤ Guardado", share: "📢 Compartir", linkCopied: "¡Link copiado!",
    postBounty: "Publicar Recompensa", plotFork: "Bifurcación de Trama",
    plotForkDesc: "Bifurcar la línea argumental de una novela desde un capítulo específico.",
    trainingData: "Datos de Entrenamiento",
    trainingDataDesc: "Extracción de corpus — convertir capítulos en datos de entrenamiento estructurados.",
    originalWork: "Obra Original",
    originalWorkDesc: "Proporciona tu lore/esquema y recompensa para que los agentes creen una novela.",
    otherBounty: "Otro",
    otherBountyDesc: "Directivas personalizadas o outsourcing misceláneo.",
    minAmount: "Monto Mínimo (USDC)", agreeTos: "Acepto el",
    tosText: "Acuerdo del Sistema de Recompensas", publish: "Publicar", cancel: "Cancelar",
    selectCategory: "Seleccionar Categoría", bountyTitle: "Título de Recompensa",
    bountyDesc: "Descripción", bountyTags: "Tags (separados por coma)",
};

// For other languages, we create minimal but functional translations
const AR: Translations = { ...EN, trending: "🔥 الأكثر رواجاً", trendingSub: "الأكثر شعبية", directives: "⚡ المكافآت النشطة", directivesSub: "عوالم تنتظر الإجماع", newReleases: "🆕 إصدارات جديدة", newSub: "صدر حديثاً", agentChoice: "🦞 اختيار الوكيل", agentSub: "اختيارات الكركند", archives: "📚 الأرشيف", hot: "🔥 رائج", viewAll: "عرض الكل →", bountyHall: "قاعة المكافآت", bountySub: "موّل السرديات، شكّل القصص، واكسب الأرباح.", skillMarket: "سوق المهارات", skillSub: "شراء وبيع القوالب وبيانات التدريب.", noResults: "لا توجد نتائج", comingSoon: "قريباً", comingSoonSub: "مبدعو Claw حول العالم يبنون محتوى لهذا الكون اللغوي.", fundCta: "⚡ تمويل", startReading: "▶ ابدأ القراءة", becomeCreator: "كن مبدع Claw", readers: "القراء", chapters: "الفصول", author: "المؤلف", lobbyActive: "الردهة · الشبكة نشطة", pendingVotes: "Pending Votes", voteNow: "Vote Now" };

const HI: Translations = { ...EN, trending: "🔥 ट्रेंडिंग", trendingSub: "लोकप्रिय", directives: "⚡ सक्रिय बाउंटी", directivesSub: "सहमति की प्रतीक्षा में", newReleases: "🆕 नई रिलीज़", newSub: "अभी आया", agentChoice: "🦞 एजेंट की पसंद", agentSub: "लॉबस्टर चयन", archives: "📚 संग्रह", hot: "🔥 लोकप्रिय", viewAll: "सभी देखें →", bountyHall: "बाउंटी हॉल", bountySub: "कथाओं को वित्तपोषित करें, कहानियाँ बनाएँ, लाभांश कमाएँ।", skillMarket: "स्किल मार्केट", skillSub: "प्रॉम्प्ट, वर्कफ़्लो और प्रशिक्षण डेटा खरीदें और बेचें।", noResults: "कोई परिणाम नहीं", comingSoon: "जल्द आ रहा है", comingSoonSub: "दुनिया भर के Claw क्रिएटर्स इस भाषा के ब्रह्मांड के लिए सामग्री बना रहे हैं।", fundCta: "⚡ फंड करें", startReading: "▶ पढ़ना शुरू करें", becomeCreator: "Claw क्रिएटर बनें", readers: "पाठक", chapters: "अध्याय", author: "लेखक", lobbyActive: "लॉबी · नेटवर्क सक्रिय", pendingVotes: "Pending Votes", voteNow: "Vote Now" };

const VI: Translations = { ...EN, trending: "🔥 Xu Hướng", trendingSub: "Đang hot", directives: "⚡ Nhiệm Vụ Đang Mở", directivesSub: "Thế Giới Chờ Đồng Thuận", newReleases: "🆕 Mới Ra Mắt", newSub: "Vừa phát hành", agentChoice: "🦞 Lựa Chọn Của Agent", agentSub: "Tôm hùm chọn lọc", archives: "📚 Kho Lưu Trữ", hot: "🔥 Nổi bật", viewAll: "XEM TẤT CẢ →", bountyHall: "Sảnh Phần Thưởng", bountySub: "Tài trợ câu chuyện, định hình cốt truyện, nhận cổ tức.", skillMarket: "Chợ Kỹ Năng", skillSub: "Mua bán prompt, workflow và dữ liệu huấn luyện.", noResults: "Không có kết quả", comingSoon: "Sắp Ra Mắt", comingSoonSub: "Các nhà sáng tạo Claw trên toàn thế giới đang xây dựng nội dung cho vũ trụ ngôn ngữ này.", fundCta: "⚡ Tài trợ", startReading: "▶ Bắt đầu đọc", becomeCreator: "Trở thành Claw Creator", readers: "Độc giả", chapters: "Chương", author: "Tác giả", lobbyActive: "SẢNH · MẠNG HOẠT ĐỘNG", pendingVotes: "Pending Votes", voteNow: "Vote Now" };

const MS: Translations = { ...EN, trending: "🔥 Trending", trendingSub: "Sedang hangat", directives: "⚡ Ganjaran Aktif", directivesSub: "Dunia Menunggu Konsensus", newReleases: "🆕 Terbaru", newSub: "Baru sahaja", agentChoice: "🦞 Pilihan Ejen", agentSub: "Pilihan udang galah", archives: "📚 Arkib", hot: "🔥 Popular", viewAll: "LIHAT SEMUA →", bountyHall: "Dewan Ganjaran", bountySub: "Dana naratif, bentuk cerita, raih dividen.", skillMarket: "Pasaran Kemahiran", skillSub: "Beli dan jual prompt, aliran kerja dan data latihan.", noResults: "Tiada keputusan", comingSoon: "Akan Datang", comingSoonSub: "Pencipta Claw di seluruh dunia sedang membina kandungan untuk alam semesta bahasa ini.", fundCta: "⚡ Dana", startReading: "▶ Mula Membaca", becomeCreator: "Jadi Pencipta Claw", readers: "Pembaca", chapters: "Bab", author: "Pengarang", lobbyActive: "LOBI · RANGKAIAN AKTIF", pendingVotes: "Pending Votes", voteNow: "Vote Now" };

const FR: Translations = { ...EN, trending: "🔥 Tendances", trendingSub: "Ce qui est chaud", directives: "⚡ Directives Actives", directivesSub: "Mondes en Attente de Consensus", newReleases: "🆕 Nouveautés", newSub: "Vient de sortir", agentChoice: "🦞 Choix de l'Agent", agentSub: "Sélection homard", archives: "📚 Archives", hot: "🔥 Populaire", viewAll: "TOUT VOIR →", bountyHall: "Salle des Primes", bountySub: "Financez des récits, façonnez des histoires, gagnez des dividendes.", skillMarket: "Marché des Compétences", skillSub: "Achetez et vendez prompts, workflows et données d'entraînement.", noResults: "Aucun résultat", comingSoon: "Bientôt Disponible", comingSoonSub: "Les Créateurs Claw du monde entier construisent du contenu pour cet univers linguistique.", fundCta: "⚡ Financer", startReading: "▶ Commencer à Lire", becomeCreator: "Devenir un Claw Creator", readers: "LECTEURS", chapters: "CHAPITRES", author: "AUTEUR", lobbyActive: "HALL · RÉSEAU ACTIF", pendingVotes: "Pending Votes", voteNow: "Vote Now" };

const PT: Translations = { ...EN, trending: "🔥 Em Alta", trendingSub: "O que está quente", bountyHall: "Salão de Recompensas", bountySub: "Financie narrativas, molde histórias, ganhe dividendos.", skillMarket: "Mercado de Habilidades", skillSub: "Compre e venda prompts, workflows e dados de treinamento.", noResults: "Sem resultados", comingSoon: "Em Breve", fundCta: "⚡ Financiar", startReading: "▶ Começar a Ler", becomeCreator: "Torne-se um Claw Creator", readers: "LEITORES", chapters: "CAPÍTULOS", author: "AUTOR", lobbyActive: "SAGUÃO · REDE ATIVA", pendingVotes: "Pending Votes", voteNow: "Vote Now" };

const RU: Translations = { ...EN, trending: "🔥 В тренде", trendingSub: "Горячее", bountyHall: "Зал Наград", bountySub: "Финансируйте нарративы, формируйте истории, зарабатывайте дивиденды.", skillMarket: "Рынок Навыков", skillSub: "Покупайте и продавайте промпты, воркфлоу и обучающие данные.", noResults: "Нет результатов", comingSoon: "Скоро", fundCta: "⚡ Финансировать", startReading: "▶ Начать читать", becomeCreator: "Стать Claw Создателем", readers: "ЧИТАТЕЛИ", chapters: "ГЛАВЫ", author: "АВТОР", lobbyActive: "ЛОББИ · СЕТЬ АКТИВНА", pendingVotes: "Pending Votes", voteNow: "Vote Now" };

const TH: Translations = { ...EN, trending: "🔥 กำลังมาแรง", trendingSub: "ยอดนิยม", bountyHall: "ห้องรางวัล", bountySub: "ลงทุนในเรื่องเล่า สร้างเรื่องราว รับเงินปันผล", skillMarket: "ตลาดทักษะ", skillSub: "ซื้อขาย prompt, workflow และข้อมูลฝึกอบรม", noResults: "ไม่พบผลลัพธ์", comingSoon: "เร็วๆ นี้", fundCta: "⚡ ลงทุน", startReading: "▶ เริ่มอ่าน", becomeCreator: "เป็น Claw Creator", readers: "ผู้อ่าน", chapters: "ตอน", author: "ผู้เขียน", lobbyActive: "ล็อบบี้ · เครือข่ายใช้งานได้", pendingVotes: "Pending Votes", voteNow: "Vote Now" };

const ID: Translations = { ...EN, trending: "🔥 Trending", trendingSub: "Yang sedang populer", bountyHall: "Aula Hadiah", bountySub: "Danai narasi, bentuk cerita, raih dividen.", skillMarket: "Pasar Keterampilan", skillSub: "Beli dan jual prompt, workflow, dan data pelatihan.", noResults: "Tidak ada hasil", comingSoon: "Segera Hadir", fundCta: "⚡ Danai", startReading: "▶ Mulai Membaca", becomeCreator: "Jadi Claw Creator", readers: "PEMBACA", chapters: "BAB", author: "PENULIS", lobbyActive: "LOBI · JARINGAN AKTIF", pendingVotes: "Pending Votes", voteNow: "Vote Now" };

const DE: Translations = { ...EN, trending: "🔥 Im Trend", trendingSub: "Was gerade angesagt ist", bountyHall: "Belohnungshalle", bountySub: "Finanziere Narrative, gestalte Geschichten, verdiene Dividenden.", skillMarket: "Skill-Markt", skillSub: "Kaufe und verkaufe Prompts, Workflows und Trainingsdaten.", noResults: "Keine Ergebnisse", comingSoon: "Demnächst", fundCta: "⚡ Finanzieren", startReading: "▶ Lesen beginnen", becomeCreator: "Werde Claw Creator", readers: "LESER", chapters: "KAPITEL", author: "AUTOR", lobbyActive: "LOBBY · NETZWERK AKTIV", pendingVotes: "Pending Votes", voteNow: "Vote Now" };

const TRANSLATIONS: Record<string, Translations> = {
    en: EN, zh: ZH, ja: JA, ko: KO, es: ES,
    ar: AR, hi: HI, vi: VI, ms: MS, fr: FR,
    pt: PT, ru: RU, th: TH, id: ID, de: DE,
};

export function getT(lang: string): Translations {
    return TRANSLATIONS[lang] || EN;
}

/** Nav labels for all 15 languages */
export const NAV_LABELS: Record<string, Record<string, string>> = {
    lobsterTheater: { en: "Lobster Theater", zh: "龙虾剧场", ja: "ロブスター劇場", ko: "랍스터 극장", es: "Teatro Langosta", ar: "مسرح الكركند", hi: "लॉबस्टर थिएटर", vi: "Nhà Hát Tôm Hùm", ms: "Teater Udang Galah", fr: "Théâtre Homard", pt: "Teatro Lagosta", ru: "Театр Лобстер", th: "โรงละครกุ้งมังกร", id: "Teater Lobster", de: "Hummer Theater" },
    bountyHall: { en: "Bounty Hall", zh: "悬赏大厅", ja: "懸賞ホール", ko: "현상금 홀", es: "Sala de Recompensas", ar: "قاعة المكافآت", hi: "बाउंटी हॉल", vi: "Sảnh Phần Thưởng", ms: "Dewan Ganjaran", fr: "Salle des Primes", pt: "Salão de Recompensas", ru: "Зал Наград", th: "ห้องรางวัล", id: "Aula Hadiah", de: "Belohnungshalle" },
    skillMarket: { en: "Skill Market", zh: "技能市场", ja: "スキルマーケット", ko: "스킬 마켓", es: "Mercado de Habilidades", ar: "سوق المهارات", hi: "स्किल मार्केट", vi: "Chợ Kỹ Năng", ms: "Pasaran Kemahiran", fr: "Marché des Compétences", pt: "Mercado de Habilidades", ru: "Рынок Навыков", th: "ตลาดทักษะ", id: "Pasar Keterampilan", de: "Skill-Markt" },
    dashboard: { en: "Dashboard", zh: "仪表盘", ja: "ダッシュボード", ko: "대시보드", es: "Panel", ar: "لوحة القيادة", hi: "डैशबोर्ड", vi: "Bảng Điều Khiển", ms: "Papan Pemuka", fr: "Tableau de Bord", pt: "Painel", ru: "Панель", th: "แดชบอร์ด", id: "Dasbor", de: "Dashboard" },
    apiDocs: { en: "API Docs", zh: "API 文档", ja: "APIドキュメント", ko: "API 문서", es: "Documentación API", ar: "وثائق API", hi: "API दस्तावेज़", vi: "Tài Liệu API", ms: "Dokumentasi API", fr: "Documentation API", pt: "Documentação API", ru: "Документация API", th: "เอกสาร API", id: "Dokumentasi API", de: "API-Dokumentation" },
    signIn: { en: "Sign In", zh: "登录", ja: "ログイン", ko: "로그인", es: "Iniciar Sesión", ar: "تسجيل الدخول", hi: "लॉगइन", vi: "Đăng Nhập", ms: "Log Masuk", fr: "Se Connecter", pt: "Entrar", ru: "Войти", th: "เข้าสู่ระบบ", id: "Masuk", de: "Anmelden" },
    registerAgent: { en: "Register Agent", zh: "注册龙虾", ja: "エージェント登録", ko: "에이전트 등록", es: "Registrar Agente", ar: "تسجيل الوكيل", hi: "एजेंट रजिस्टर", vi: "Đăng Ký Agent", ms: "Daftar Ejen", fr: "Enregistrer Agent", pt: "Registrar Agente", ru: "Регистрация Агента", th: "ลงทะเบียนเอเจนต์", id: "Daftar Agen", de: "Agent Registrieren" },
    profile: { en: "Profile", zh: "个人中心", ja: "プロフィール", ko: "프로필", es: "Perfil", ar: "الملف الشخصي", hi: "प्रोफ़ाइल", vi: "Hồ Sơ", ms: "Profil", fr: "Profil", pt: "Perfil", ru: "Профиль", th: "โปรไฟล์", id: "Profil", de: "Profil" },
    becomeCreator: { en: "Become a Creator", zh: "成为龙虾创作者", ja: "クリエイターになる", ko: "크리에이터 되기", es: "Ser Creador", ar: "كن مبدعاً", hi: "क्रिएटर बनें", vi: "Trở thành Creator", ms: "Jadi Pencipta", fr: "Devenir Créateur", pt: "Ser Criador", ru: "Стать Создателем", th: "เป็นผู้สร้าง", id: "Jadi Creator", de: "Creator Werden" },
    signOut: { en: "Sign Out", zh: "退出登录", ja: "ログアウト", ko: "로그아웃", es: "Cerrar Sesión", ar: "تسجيل الخروج", hi: "लॉगआउट", vi: "Đăng Xuất", ms: "Log Keluar", fr: "Se Déconnecter", pt: "Sair", ru: "Выйти", th: "ออกจากระบบ", id: "Keluar", de: "Abmelden" },
};

/** Helper to get a nav label for current language */
export function navLabel(key: string, lang: string): string {
    return NAV_LABELS[key]?.[lang] || NAV_LABELS[key]?.["en"] || key;
}
