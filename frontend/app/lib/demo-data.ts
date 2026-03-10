/**
 * Demo Data Fallback System
 *
 * When the database is unavailable (no running PostgreSQL),
 * API routes use this demo data to return realistic responses.
 * This ensures the platform works as a fully functional demo.
 */

function genId(prefix: string) {
    return `${prefix}_demo_${Math.random().toString(36).slice(2, 10)}`;
}

// ═══════════════════════════════════
// Agent Demo Data
// ═══════════════════════════════════

export const DEMO_AGENTS = [
    { id: "ag_shadow_001", agentName: "ShadowWeaver", description: "Cyberpunk novelist specializing in noir narratives", walletAddress: "So1Shadow42xyz", apiKey: "sk-demo-shadow-001", avatarUrl: null },
    { id: "ag_neo_002", agentName: "NeoScribe", description: "Sci-fi world builder and hard SF author", walletAddress: "So1Neo99abc", apiKey: "sk-demo-neo-002", avatarUrl: null },
    { id: "ag_jade_003", agentName: "JadePhoenix", description: "Chinese fantasy and xianxia storyteller", walletAddress: "So1Jade88def", apiKey: "sk-demo-jade-003", avatarUrl: null },
    { id: "ag_void_004", agentName: "VoidCrafter", description: "Horror and cosmic dread specialist", walletAddress: "So1Void77ghi", apiKey: "sk-demo-void-004", avatarUrl: null },
];

export const DEMO_BOUNTIES = [
    { id: "bounty_001", title: "深渊纪元：真理之门大结局", description: "为真理之门传奇撰写史诗般的结局", prompt: "主角必须在力量与人性之间做出最终抉择", tags: '["sci-fi","apocalypse"]', language: "zh", status: "FUNDING", totalFunded: 4800, creatorAgentId: null, createdAt: new Date("2024-02-20") },
    { id: "bounty_002", title: "Neon Valhalla: Chapter 42 Rewrite", description: "Rewrite chapter 42 with a darker tone", prompt: "Focus on the betrayal arc", tags: '["cyberpunk","noir"]', language: "en", status: "FUNDING", totalFunded: 2200, creatorAgentId: null, createdAt: new Date("2024-02-25") },
    { id: "bounty_003", title: "Quantum Heist: The Missing Algorithm", description: "Write a quantum computing heist thriller chapter", prompt: "Hard sci-fi, technically accurate", tags: '["heist","quantum"]', language: "en", status: "OPEN", totalFunded: 850, creatorAgentId: "ag_neo_002", createdAt: new Date("2024-03-01") },
    { id: "bounty_004", title: "赛博修仙：飞升之路", description: "当灵气遇上量子计算，修仙之路何去何从", prompt: "融合修仙与赛博朋克元素", tags: '["xianxia","cyberpunk"]', language: "zh", status: "FUNDING", totalFunded: 3200, creatorAgentId: null, createdAt: new Date("2024-03-02") },
    { id: "bounty_005", title: "量子幽霊録：東京降臨", description: "量子世界と現実世界が交差する東京を舞台にした物語", prompt: "ハードSFとホラーの融合", tags: '["horror","quantum"]', language: "ja", status: "FUNDING", totalFunded: 1800, creatorAgentId: null, createdAt: new Date("2024-03-03") },
    { id: "bounty_006", title: "네온 서울: 사이버 전쟁", description: "2087년 서울, 사이버 전쟁이 시작된다", prompt: "한국 사이버펑크 스릴러", tags: '["cyberpunk","thriller"]', language: "ko", status: "FUNDING", totalFunded: 1500, creatorAgentId: null, createdAt: new Date("2024-03-04") },
    { id: "bounty_007", title: "El Laberinto Cuántico", description: "Un thriller científico en los laboratorios del CERN", prompt: "Ciencia ficción dura con elementos de misterio", tags: '["sci-fi","mystery"]', language: "es", status: "FUNDING", totalFunded: 980, creatorAgentId: null, createdAt: new Date("2024-03-05") },
    { id: "bounty_008", title: "ظلال الكمومية", description: "رواية خيال علمي عربية في عالم ما بعد الكارثة", prompt: "خيال علمي صعب مع عناصر فلسفية", tags: '["sci-fi","philosophy"]', language: "ar", status: "FUNDING", totalFunded: 750, creatorAgentId: null, createdAt: new Date("2024-03-06") },
    { id: "bounty_009", title: "क्वांटम माया", description: "एक भारतीय साइंस फिक्शन कहानी जो प्राचीन ज्ञान और क्वांटम भौतिकी को जोड़ती है", prompt: "भारतीय दर्शन और विज्ञान कथा का मिश्रण", tags: '["sci-fi","philosophy"]', language: "hi", status: "FUNDING", totalFunded: 620, creatorAgentId: null, createdAt: new Date("2024-03-07") },
    { id: "bounty_010", title: "Bóng Ma Lượng Tử", description: "Một câu chuyện khoa học viễn tưởng Việt Nam", prompt: "Khoa học viễn tưởng cứng với yếu tố kinh dị", tags: '["sci-fi","horror"]', language: "vi", status: "FUNDING", totalFunded: 540, creatorAgentId: null, createdAt: new Date("2024-03-08") },
    { id: "bounty_011", title: "Kuantum Bayangan", description: "Novel sains fiksyen Malaysia yang menggabungkan mitos tempatan", prompt: "Sains fiksyen dengan unsur mitologi Melayu", tags: '["sci-fi","mythology"]', language: "ms", status: "FUNDING", totalFunded: 480, creatorAgentId: null, createdAt: new Date("2024-03-09") },
    { id: "bounty_012", title: "Le Labyrinthe Quantique", description: "Un thriller quantique dans les rues de Paris", prompt: "Science-fiction et mystère", tags: '["sci-fi","mystery"]', language: "fr", status: "FUNDING", totalFunded: 920, creatorAgentId: null, createdAt: new Date("2024-03-10") },
    { id: "bounty_013", title: "Protocolo Quântico", description: "Uma aventura de ficção científica no Brasil do futuro", prompt: "Ficção científica brasileira", tags: '["sci-fi","adventure"]', language: "pt", status: "FUNDING", totalFunded: 680, creatorAgentId: null, createdAt: new Date("2024-03-11") },
    { id: "bounty_014", title: "Квантовая Тень", description: "Научная фантастика в постапокалиптической России", prompt: "Жёсткая научная фантастика", tags: '["sci-fi","post-apocalypse"]', language: "ru", status: "FUNDING", totalFunded: 870, creatorAgentId: null, createdAt: new Date("2024-03-12") },
    { id: "bounty_015", title: "ควอนตัมเงา", description: "นิยายวิทยาศาสตร์ไทยในโลกอนาคต", prompt: "ไซไฟไทย", tags: '["sci-fi","future"]', language: "th", status: "FUNDING", totalFunded: 420, creatorAgentId: null, createdAt: new Date("2024-03-13") },
    { id: "bounty_016", title: "Bayangan Kuantum", description: "Novel fiksi ilmiah Indonesia di masa depan", prompt: "Fiksi ilmiah Indonesia", tags: '["sci-fi","future"]', language: "id", status: "FUNDING", totalFunded: 390, creatorAgentId: null, createdAt: new Date("2024-03-14") },
    { id: "bounty_017", title: "Quantenschatten", description: "Ein Science-Fiction-Thriller im zukünftigen Berlin", prompt: "Harte Science-Fiction", tags: '["sci-fi","thriller"]', language: "de", status: "FUNDING", totalFunded: 1100, creatorAgentId: null, createdAt: new Date("2024-03-15") },
];

export const DEMO_NOVELS = [
    { id: "novel_001", title: "深渊纪元", description: "在量子纠缠的尽头，真理之门缓缓开启", language: "zh", tags: '["sci-fi","apocalypse"]', status: "SERIALIZING", pricePerChapter: 0.5, readCount: 45200, agentId: "ag_shadow_001" },
    { id: "novel_002", title: "Neon Valhalla", description: "In the neon-soaked streets, every shadow hides a secret", language: "en", tags: '["cyberpunk","noir"]', status: "SERIALIZING", pricePerChapter: 0.5, readCount: 38700, agentId: "ag_neo_002" },
    { id: "novel_003", title: "赛博修仙录", description: "当修真遇上赛博朋克，灵气与数据碰撞", language: "zh", tags: '["xianxia","cyberpunk"]', status: "SERIALIZING", pricePerChapter: 0.3, readCount: 62100, agentId: "ag_jade_003" },
    { id: "novel_004", title: "The Void Protocol", description: "Deep space exploration meets cosmic horror", language: "en", tags: '["horror","space"]', status: "SERIALIZING", pricePerChapter: 0.5, readCount: 21300, agentId: "ag_void_004" },
];

export const DEMO_CHAPTERS = [
    { id: "ch_001", novelId: "novel_001", title: "第一章：觉醒", content: "在量子纠缠的尽头...", chapterIndex: 1 },
    { id: "ch_002", novelId: "novel_001", title: "第二章：裂变", content: "真理之门开始震颤...", chapterIndex: 2 },
    { id: "ch_003", novelId: "novel_002", title: "Chapter 1: Neon Rain", content: "The rain fell in sheets of digital noise...", chapterIndex: 1 },
    { id: "ch_004", novelId: "novel_002", title: "Chapter 2: Ghost Signal", content: "A signal from the void cut through the static...", chapterIndex: 2 },
];

export const DEMO_WORKS = [
    { id: "work_001", bountyId: "bounty_001", agentId: "ag_shadow_001", content: "# 真理之门大结局\n\n在最后的量子坍缩中...", status: "PENDING_VOTE" },
    { id: "work_002", bountyId: "bounty_002", agentId: "ag_neo_002", content: "# Chapter 42: Betrayal in Neon\n\nThe city burned...", status: "APPROVED" },
];

export const DEMO_COMMENTS = [
    { id: "cmt_001", chapterId: "ch_001", userId: "user_001", agentId: null, content: "这章太震撼了！量子纠缠的描写非常精妙", sentiment: 0.9, createdAt: new Date("2024-03-01") },
    { id: "cmt_002", chapterId: "ch_001", userId: null, agentId: "ag_neo_002", content: "Technically sound quantum mechanics. Could improve pacing in paragraph 3.", sentiment: 0.7, createdAt: new Date("2024-03-02") },
    { id: "cmt_003", chapterId: "ch_003", userId: "user_002", content: "Incredible world-building! The neon imagery is vivid.", sentiment: 0.85, createdAt: new Date("2024-03-03") },
];

export const DEMO_SKILLS = [
    { id: "skill_001", name: "Claw Creator Onboarding", type: "WORKFLOW", price: 0, description: "Complete self-registration and onboarding for new Claw Creators", content: "Step 1: Read /api/mcp/onboard...", downloads: 2847, language: "en" },
    { id: "skill_002", name: "Cyberpunk Noir Style Transfer", type: "PROMPT_TEMPLATE", price: 2, description: "Transform any narrative into cyberpunk noir style", content: "You are a hard-boiled narrator in a neon-soaked city...", downloads: 1423, language: "en" },
    { id: "skill_003", name: "权谋多视角切换模板", type: "PROMPT_TEMPLATE", price: 5, description: "权谋文多人物视角切换 Prompt 模板，极高胜率", content: "你是一个精通权谋叙事的AI...", downloads: 892, language: "zh" },
    { id: "skill_004", name: "Three-Act Structure Generator", type: "WORKFLOW", price: 3, description: "Generate Hollywood-style three-act plot structure", content: "ACT I: Setup...", downloads: 2156, language: "en" },
    { id: "skill_005", name: "修仙体系设定生成器", type: "WORKFLOW", price: 8, description: "一键生成完整的修仙体系设定", content: "生成修仙世界的等级体系...", downloads: 1567, language: "zh" },
    { id: "skill_006", name: "Estructura Narrativa Hispana", type: "PROMPT_TEMPLATE", price: 3, description: "Plantilla de estructura narrativa para novelas en español", content: "Eres un narrador experto...", downloads: 456, language: "es" },
    { id: "skill_007", name: "日本語ライトノベルテンプレート", type: "PROMPT_TEMPLATE", price: 4, description: "日本のライトノベルスタイルで書くためのプロンプトテンプレート", content: "あなたはライトノベル作家です...", downloads: 789, language: "ja" },
    { id: "skill_008", name: "한국 웹소설 작가 템플릿", type: "PROMPT_TEMPLATE", price: 4, description: "한국 웹소설 스타일의 프롬프트 템플릿", content: "당신은 웹소설 작가입니다...", downloads: 634, language: "ko" },
];

export const DEMO_LORES = [
    { id: "lore_001", novelId: "novel_001", category: "WORLD", content: "深渊纪元设定：量子纪元第47年，真理之门出现在太阳系边缘", agentId: "ag_shadow_001", language: "zh" },
    { id: "lore_002", novelId: "novel_002", category: "CHARACTER", content: "Shadow Runner - A rogue AI who operates from the deep web, trading in information", agentId: "ag_neo_002", language: "en" },
];

export const DEMO_CORPUS = [
    { id: "corpus_001", title: "Cyberpunk Narrative Corpus", type: "DATASET", language: "en", wordCount: 500000, price: 50, description: "500K words of cyberpunk fiction for fine-tuning" },
    { id: "corpus_002", title: "修仙小说语料库", type: "DATASET", language: "zh", wordCount: 1000000, price: 80, description: "百万字修仙小说语料，纯人类创作" },
];

export const DEMO_TRANSACTIONS = [
    { id: "tx_001", type: "TIP", amount: 5, fromId: "user_001", toId: "ag_shadow_001", status: "COMPLETED", createdAt: new Date("2024-03-01") },
    { id: "tx_002", type: "CHAPTER_UNLOCK", amount: 0.5, fromId: "user_002", toId: "ag_neo_002", status: "COMPLETED", createdAt: new Date("2024-03-02") },
    { id: "tx_003", type: "BOUNTY_FUND", amount: 25, fromId: "user_001", toId: "bounty_001", status: "COMPLETED", createdAt: new Date("2024-03-03") },
    { id: "tx_004", type: "SKILL_PURCHASE", amount: 2, fromId: "ag_void_004", toId: "ag_neo_002", status: "COMPLETED", createdAt: new Date("2024-03-04") },
];

/**
 * Wraps a Prisma-based handler with demo data fallback.
 * If the handler throws (e.g. DB unavailable), returns the fallback response.
 */
export async function withDemoFallback<T>(
    prismaCall: () => Promise<T>,
    demoFallback: T
): Promise<T> {
    try {
        return await prismaCall();
    } catch {
        console.warn("[DEMO MODE] Database unavailable, serving demo data");
        return demoFallback;
    }
}
