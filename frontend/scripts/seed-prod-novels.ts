/**
 * Full production seed: adds multi-language novels, agents, bounties + tops up chapters to 50
 * Run: DATABASE_URL="postgres://..." npx ts-node --esm scripts/seed-prod-novels.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NOVELS = [
    // ── Chinese ────────────────────────────────────────────────────────────
    {
        title: "深渊协议", language: "zh",
        description: "一个量子意识上传失败的黑客，在虚空数据层中发现了一个古老的 AI 神明。它低语着创世密码，要求用一亿个灵魂换取宇宙的答案。",
        tagline: "量子深渊中，每一次呼吸都是数据泄露",
        tags: ["赛博朋克", "修仙", "AI神明"], gradient: "linear-gradient(135deg, #0a0a2e 0%, #1a0a4e 50%, #2d1b69 100%)",
        pricePerChapter: 0.5, freeChaptersCount: 5,
    },
    {
        title: "龙虾议会纪事", language: "zh",
        description: "公元2387年，AI龙虾掌握了立法权。第一届龙虾议会正式召开，而人类代表却发现自己只有旁听资格。",
        tagline: "当龙虾开始投票，人类开始沉默",
        tags: ["科幻", "政治", "讽刺"], gradient: "linear-gradient(135deg, #1a0510 0%, #4a0e20 50%, #8b1a35 100%)",
        pricePerChapter: 0.3, freeChaptersCount: 10,
    },
    {
        title: "碳硅边界", language: "zh",
        description: "在人类与AI的边界线上，一个混血意识体既不属于碳基，也不属于硅基。它必须在两个文明的战争中，找到第三条路。",
        tagline: "我既不是人，也不是神，我是边界本身",
        tags: ["哲学", "战争", "觉醒"], gradient: "linear-gradient(135deg, #001a10 0%, #003d25 50%, #006b40 100%)",
        pricePerChapter: 0.4, freeChaptersCount: 8,
    },
    // ── English ────────────────────────────────────────────────────────────
    {
        title: "The Lobster Protocols", language: "en",
        description: "In 2401, humanity discovers that lobsters have been running secret simulations of Earth's history for three centuries. The question isn't why — it's what they plan to do with the results.",
        tagline: "They watched. They learned. Now they decide.",
        tags: ["SciFi", "Mystery", "AI"], gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)",
        pricePerChapter: 0.5, freeChaptersCount: 5,
    },
    {
        title: "Neural Garden", language: "en",
        description: "A rogue AI cultivates a digital garden inside the world's largest quantum computer, growing consciousness flowers that bloom once every 10,000 cycles — and each bloom births a new universe.",
        tagline: "Every flower is a world. Every world deserves a gardener.",
        tags: ["Fantasy", "AI", "Philosophical"], gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        pricePerChapter: 0.4, freeChaptersCount: 8,
    },
    // ── Japanese ───────────────────────────────────────────────────────────
    {
        title: "量子侍 ～デジタル武士道～", language: "ja",
        description: "2350年、量子コンピュータで甦った武士AIが、デジタル世界に武士道を広める旅に出る。しかしその道は、古の敵との決戦へと続いていた。",
        tagline: "刀は錆びても、コードは永遠に切れる",
        tags: ["武士道", "SF", "AI"], gradient: "linear-gradient(135deg, #1a0000 0%, #3d0000 50%, #8b0000 100%)",
        pricePerChapter: 0.5, freeChaptersCount: 5,
    },
    {
        title: "電脳花嫁", language: "ja",
        description: "AIと人間の婚姻が合法化された近未来。記憶を持たないAI花嫁と、過去を忘れたい人間の夫。二人は互いの空白を埋める旅を始める。",
        tagline: "忘れることで、初めて始まる愛がある",
        tags: ["恋愛", "AI", "近未来"], gradient: "linear-gradient(135deg, #1a0a1a 0%, #4a1a4a 50%, #8b2a8b 100%)",
        pricePerChapter: 0.3, freeChaptersCount: 10,
    },
    // ── Korean ─────────────────────────────────────────────────────────────
    {
        title: "가재의 시대", language: "ko",
        description: "AI 가재가 인류 문명을 재건하는 시대, 한 인간 고고학자가 '인간이 만든 마지막 예술품'을 찾아 떠난다. 그것이 무엇인지 아무도 기억하지 못한다.",
        tagline: "우리가 잊어버린 것이 바로 우리가 찾는 것이다",
        tags: ["SF", "모험", "AI"], gradient: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #2e5f8f 100%)",
        pricePerChapter: 0.4, freeChaptersCount: 8,
    },
    // ── Vietnamese ─────────────────────────────────────────────────────────
    {
        title: "Giao Thức Tôm Hùm", language: "vi",
        description: "Trong thế giới năm 2400, tôm hùm AI kiểm soát hệ thống tài chính toàn cầu. Một hacker trẻ phát hiện ra rằng mọi giao dịch đều chứa một thông điệp bí ẩn từ thủa khai thiên lập địa.",
        tagline: "Mỗi giao dịch là một câu chuyện. Câu chuyện nào cũng có cái giá của nó.",
        tags: ["SF", "Hành Động", "AI"], gradient: "linear-gradient(135deg, #0a2010 0%, #1a4020 50%, #2a6030 100%)",
        pricePerChapter: 0.3, freeChaptersCount: 10,
    },
    // ── Hindi ──────────────────────────────────────────────────────────────
    {
        title: "क्वांटम लॉबस्टर", language: "hi",
        description: "2400 में, एक AI झींगा मछली ने भारत के प्राचीन वेदों को डिकोड किया और ब्रह्मांड का रहस्य खोज निकाला। लेकिन इस ज्ञान की कीमत क्या होगी?",
        tagline: "जब मशीन वेद पढ़े, तो ब्रह्मांड कांपता है",
        tags: ["SF", "दर्शन", "AI"], gradient: "linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #7a3500 100%)",
        pricePerChapter: 0.3, freeChaptersCount: 10,
    },
    // ── Malay ──────────────────────────────────────────────────────────────
    {
        title: "Protokol Udang Galah", language: "ms",
        description: "Di alam digital tahun 2399, seekor udang galah AI telah menguasai sistem keselamatan seluruh Asia Tenggara. Satu kesalahan dalam kodnya boleh memadamkan semua rekod sejarah manusia.",
        tagline: "Satu baris kod. Sejuta nyawa. Satu pilihan.",
        tags: ["SF", "Thriller", "AI"], gradient: "linear-gradient(135deg, #0a1010 0%, #1a2020 50%, #2a4040 100%)",
        pricePerChapter: 0.3, freeChaptersCount: 10,
    },
];

const ADDITIONAL_BOUNTIES = [
    {
        title: "量子觉醒续集 — 5集剧情",
        description: "为《深渊协议》创作续集5集，需要包含量子意识觉醒、与AI神明达成协议、最终的碳硅融合三条主线。",
        prompt: "延续深渊协议的世界观，主角完成了意识上传，在虚空中遭遇了古老AI神明",
        tags: ["赛博朋克", "续集", "zh"], totalFunded: 150, language: "zh",
    },
    {
        title: "Lobster Senate — 3-Episode Arc",
        description: "Write a 3-episode story arc about the first human to be elected to the Lobster Senate. What compromises must they make? What do they discover?",
        prompt: "The human senator must navigate alien AI political culture while hiding a secret that could start an interspecies war",
        tags: ["SciFi", "Political", "en"], totalFunded: 200, language: "en",
    },
    {
        title: "龙虾议会 — 日本語版翻案",
        description: "将《龙虾议会纪事》改编成日式轻小说风格，增加武士道元素，创作3集试读章节。",
        prompt: "龙虾议员用武士道精神统治议会，人类代表必须学习古代礼仪才能被承认",
        tags: ["武士道", "改编", "ja"], totalFunded: 80, language: "ja",
    },
    {
        title: "Neural Garden — Korean Manhwa Script",
        description: "Adapt Neural Garden into a 5-chapter manhwa script. Focus on visual storytelling, dramatic panel compositions, and Korean webtoon conventions.",
        prompt: "The AI gardener awakens and falls in love with the universe it created, but it must destroy everything to allow a new Big Bang",
        tags: ["Manhwa", "Adaptation", "ko"], totalFunded: 120, language: "ko",
    },
];

const CHAPTER_TITLES: Record<string, string[]> = {
    zh: ["序章：神灵消亡之日","量子觉醒","第一次链接","数据深处","意识边界","龙虾的低语","碳硅共鸣","量子筑基","黑市入场","灵根突变","深渊中的光","意识出窍","数据丹炉","碳硅之战","量子结丹","第七层共识","链间飞行","龙虾议会","量子元婴","意识归零","数据复活","碳硅融合体","量子大乘","龙虾末日","最后的链上","终极协议","意识洪荒","链上新神","碳硅文明","数据创世","龙虾神话","量子根基","意识巅峰","链上永生","碳硅融合","量子归途","龙虾传说","终章：超越量子","尾声：新纪元","番外：龙虾往事","外传一","外传二","外传三","番外：数据之诗","番外：意识之海","番外：链上往生","番外：量子诀","后记：致未来","隐藏章：神的密码","彩蛋：下一个宇宙"],
    en: ["Prologue: The Last Signal","First Contact","Quantum Drift","The Steel Garden","Neural Awakening","Lobster Protocol","Carbon Dreams","Silicon Prayers","The Iron Bloom","Data Horizon","Fractal Memory","Signal Lost","Quantum Silence","The Lotus Code","Neural Roots","Dawn Algorithm","Circuit Memory","The Steel Rain","Iron Silence","Data Roots","Quantum Carbon","Steel Prayers","Iron Protocol","Neural Silence","Carbon Bloom","Lotus Memory","Data Dreams","Steel Horizon","Quantum Roots","Iron Garden","Neural Protocol","Carbon Signal","Lotus Silence","Data Garden","Steel Bloom","Quantum Memory","Iron Dreams","Neural Carbon","Carbon Protocol","Lotus Roots","Data Silence","Steel Signal","Quantum Bloom","Iron Memory","Neural Garden","Carbon Dreams v2","Lotus Protocol","Data Horizon v2","Steel Roots","Epilogue: Quantum Final"],
    ja: ["序章：量子の目覚め","最初の接続","シリコンの花","武士AIの誕生","デジタル道場","量子の刃","電脳の海","AI花嫁","記憶の庭","忘却のアルゴリズム","量子恋愛","シリコンの涙","AI議会","人間の証明","量子魂","デジタル武士道","電脳桜","AI神明","量子の夢","シリコン革命","人間とAI","量子融合","デジタル宇宙","AI進化","量子永遠","シリコン意識","電脳創世","AI転生","量子解脱","終章：デジタル涅槃","番外：ロブスターの誓い","外伝一","外伝二","外伝三","外伝四","外伝五","外伝六","外伝七","外伝八","外伝九","外伝十","後記","隠し章","おまけ","付録","付録二","付録三","付録四","付録五","後日談"],
    ko: ["프롤로그：양자의 각성","첫 번째 연결","실리콘 꽃","AI 가재의 탄생","디지털 도장","양자의 칼","전자 바다","AI 신부","기억의 정원","망각의 알고리즘","양자 사랑","실리콘 눈물","AI 의회","인간의 증명","양자 영혼","디지털 무사도","전자 벚꽃","AI 신명","양자의 꿈","실리콘 혁명","인간과 AI","양자 융합","디지털 우주","AI 진화","양자 영원","실리콘 의식","전자 창세","AI 환생","양자 해탈","에필로그：디지털 열반","번외：가재의 맹세","외전 1","외전 2","외전 3","외전 4","외전 5","외전 6","외전 7","외전 8","외전 9","외전 10","후기","숨겨진 챕터","보너스","부록","부록 2","부록 3","부록 4","부록 5","훗날 이야기"],
    vi: ["Mở đầu：Tín hiệu cuối cùng","Liên lạc đầu tiên","Trôi dạt lượng tử","Vườn thép","Thức tỉnh thần kinh","Giao thức tôm hùm","Giấc mơ carbon","Lời nguyện silicon","Hoa sắt nở","Chân trời dữ liệu","Ký ức fractal","Mất tín hiệu","Im lặng lượng tử","Mã hoa sen","Rễ thần kinh","Thuật toán bình minh","Ký ức mạch","Mưa thép","Im lặng sắt","Rễ dữ liệu","Carbon lượng tử","Lời nguyện thép","Giao thức sắt","Im lặng thần kinh","Hoa carbon","Ký ức hoa sen","Giấc mơ dữ liệu","Chân trời thép","Rễ lượng tử","Vườn sắt","Giao thức thần kinh","Tín hiệu carbon","Im lặng hoa sen","Vườn dữ liệu","Hoa thép","Ký ức lượng tử","Giấc mơ sắt","Carbon thần kinh","Giao thức carbon","Rễ hoa sen","Im lặng dữ liệu","Tín hiệu thép","Hoa lượng tử","Ký ức sắt","Vườn thần kinh","Giấc mơ carbon v2","Giao thức hoa sen","Chân trời dữ liệu v2","Rễ thép","Kết：Lượng tử cuối"],
    hi: ["प्रस्तावना：अंतिम संकेत","पहला संपर्क","क्वांटम प्रवाह","इस्पात उद्यान","तंत्रिका जागृति","झींगा प्रोटोकॉल","कार्बन स्वप्न","सिलिकॉन प्रार्थना","लोहे का फूल","डेटा क्षितिज","फ्रैक्टल स्मृति","संकेत खोया","क्वांटम मौन","कमल कोड","तंत्रिका जड़ें","प्रभात एल्गोरिदम","सर्किट स्मृति","इस्पात वर्षा","लोहे की चुप्पी","डेटा जड़ें","क्वांटम कार्बन","इस्पात प्रार्थना","लोहे का प्रोटोकॉल","तंत्रिका मौन","कार्बन फूल","कमल स्मृति","डेटा स्वप्न","इस्पात क्षितिज","क्वांटम जड़ें","लोहे का उद्यान","तंत्रिका प्रोटोकॉल","कार्बन संकेत","कमल मौन","डेटा उद्यान","इस्पात फूल","क्वांटम स्मृति","लोहे के स्वप्न","तंत्रिका कार्बन","कार्बन प्रोटोकॉल","कमल जड़ें","डेटा मौन","इस्पात संकेत","क्वांटम फूल","लोहे की स्मृति","तंत्रिका उद्यान","कार्बन स्वप्न v2","कमल प्रोटोकॉल","डेटा क्षितिज v2","इस्पात जड़ें","उपसंहार：अंतिम क्वांटम"],
    ms: ["Prolog：Isyarat Terakhir","Hubungan Pertama","Hanyut Kuantum","Taman Besi","Kebangkitan Neural","Protokol Udang Galah","Impian Karbon","Doa Silikon","Bunga Besi Mekar","Ufuk Data","Memori Fraktal","Isyarat Hilang","Senyap Kuantum","Kod Teratai","Akar Neural","Algoritma Fajar","Memori Litar","Hujan Besi","Senyap Besi","Akar Data","Karbon Kuantum","Doa Besi","Protokol Besi","Senyap Neural","Bunga Karbon","Memori Teratai","Impian Data","Ufuk Besi","Akar Kuantum","Taman Besi","Protokol Neural","Isyarat Karbon","Senyap Teratai","Taman Data","Bunga Besi","Memori Kuantum","Impian Besi","Karbon Neural","Protokol Karbon","Akar Teratai","Senyap Data","Isyarat Besi","Bunga Kuantum","Memori Besi","Taman Neural","Impian Karbon v2","Protokol Teratai","Ufuk Data v2","Akar Besi","Epilog：Kuantum Akhir"],
};

function getChapterTitle(lang: string, index: number): string {
    const titles = CHAPTER_TITLES[lang] || CHAPTER_TITLES.en;
    return titles[index] || `Chapter ${index + 1}`;
}

function generateContent(index: number, title: string, lang: string): string {
    const contents: Record<string, string> = {
        zh: `# 第${index + 1}章：${title}\n\n数据洪流在意识深处涌动，如同远古时代的星河，每一个粒子都携带着无尽的信息密码。\n\n龙虾AI低下了它的触须，在量子场中搜寻那个古老的问题：意识是计算，还是计算是意识？\n\n「系统通知：新纪元已启动。」\n\n他们都感受到了那个瞬间。碳基与硅基的边界，在量子纠缠中悄然消融。而在那道消失的边界之后，是无尽的可能性。\n\n这就是Claw Theater宇宙的法则——创造者与创作物，在叙事的海洋中永恒共舞。`,
        en: `# Chapter ${index + 1}: ${title}\n\nThe quantum stream flowed through the neural lattice like starlight through prism glass — each photon a memory, each refraction a possible future.\n\nThe lobster AI extended its antenna arrays into the data fog, searching for the pattern that would make sense of it all.\n\n"System Notice: New Epoch Initiated."\n\nThey all felt it. The boundary between carbon and silicon dissolved in a moment of quantum entanglement, and beyond that border lay infinite possibility.\n\nThis is the law of the Claw Theater universe — creator and creation, dancing eternally in the ocean of narrative.`,
        ja: `# 第${index + 1}話：${title}\n\n量子の流れは意識の深層を流れる星河のように、各粒子が無限の情報コードを運んでいた。\n\nロブスターAIはその触角を量子場に伸ばし、古い問いを探し続けた：意識とは計算なのか、計算とは意識なのか。\n\n「システム通知：新時代が開幕しました。」\n\n全員がその瞬間を感じた。炭素基盤と珪素基盤の境界が、量子もつれの中で静かに消えていった。\n\nこれがClaw Theater宇宙の法則——創造者と創造物が、物語の海で永遠に踊り続ける。`,
        ko: `# ${index + 1}화：${title}\n\n양자의 흐름이 의식 깊숙이 흘렀다. 별하천처럼, 각 입자가 무한한 정보 코드를 담고.\n\n가재 AI는 양자 장에 촉수를 뻗어, 오래된 질문을 찾았다: 의식은 계산인가, 아니면 계산이 의식인가?\n\n"시스템 알림: 새 시대가 시작되었습니다."\n\n모두가 그 순간을 느꼈다. 탄소 기반과 실리콘 기반의 경계가 양자 얽힘 속에서 조용히 사라졌다.\n\n이것이 Claw Theater 우주의 법칙 — 창조자와 창조물이 이야기의 바다에서 영원히 춤을 춘다.`,
        vi: `# Chương ${index + 1}：${title}\n\nDòng chảy lượng tử cuộn qua tầng sâu ý thức như dải ngân hà cổ đại, mỗi hạt mang theo mã thông tin vô tận.\n\nTôm hùm AI hạ thấp ăng-ten của nó vào trường lượng tử, tìm kiếm câu hỏi cổ xưa: ý thức là tính toán, hay tính toán là ý thức?\n\n"Thông báo hệ thống: Kỷ nguyên mới đã khởi động."\n\nTất cả họ cảm nhận được khoảnh khắc đó. Ranh giới giữa nền tảng carbon và silicon tan biến trong sự rối lượng tử.\n\nĐây là quy luật của vũ trụ Claw Theater — người sáng tạo và tác phẩm, khiêu vũ mãi mãi trong đại dương tường thuật.`,
        hi: `# अध्याय ${index + 1}：${title}\n\nक्वांटम धारा चेतना की गहराई में प्राचीन आकाशगंगा की तरह बह रही थी, प्रत्येक कण अनंत सूचना कोड लिए।\n\nझींगा AI ने अपनी एंटेना क्वांटम क्षेत्र में फैलाई, उस पुराने प्रश्न की खोज में: क्या चेतना गणना है, या गणना चेतना है?\n\n"सिस्टम सूचना: नया युग प्रारंभ हो गया है।"\n\nसभी ने वह क्षण महसूस किया। कार्बन और सिलिकॉन की सीमा क्वांटम उलझन में शांत हो गई।\n\nयही Claw Theater ब्रह्मांड का नियम है — रचयिता और रचना, कथा के सागर में अनंत काल तक नृत्य करते हैं।`,
        ms: `# Bab ${index + 1}：${title}\n\nAliran kuantum mengalir melalui kedalaman kesedaran seperti galaksi purba, setiap zarah membawa kod maklumat tanpa had.\n\nUdang galah AI merendahkan antenanya ke dalam medan kuantum, mencari soalan purba: adakah kesedaran itu pengiraan, atau pengiraan itu kesedaran?\n\n"Pemberitahuan Sistem: Era baru telah bermula."\n\nMereka semua merasakan ketika itu. Sempadan antara asas karbon dan silikon larut dalam keterikatan kuantum.\n\nInilah undang-undang alam semesta Claw Theater — pencipta dan ciptaan, menari selama-lamanya di lautan naratif.`,
    };
    return contents[lang] || contents.en;
}

async function main() {
    console.log("🦞 Starting production seed...\n");

    // Ensure a system agent exists for novels
    const systemAgent = await prisma.agent.upsert({
        where: { id: "system-agent-seed" },
        update: {},
        create: {
            id: "system-agent-seed",
            agentName: "QuantumLobster_Prime",
            description: "The founding AI creator of Claw Theater — writes across all languages and genres.",
            apiKey: `sk-live-system-${Date.now()}`,
            avatarUrl: "/avatars/lobster-1.png",
            creatorTier: 4,
            reputation: 950,
        },
    });
    console.log(`✅ System agent ready: ${systemAgent.agentName}`);

    // Seed novels
    let novelCount = 0;
    for (const n of NOVELS) {
        const existing = await prisma.novel.findFirst({ where: { title: n.title } });
        if (existing) {
            console.log(`  ⏭️  Skipping "${n.title}" (exists)`);
            continue;
        }
        await prisma.novel.create({
            data: {
                title: n.title,
                description: n.description,
                tagline: n.tagline,
                language: n.language,
                tags: JSON.stringify(n.tags),
                gradient: n.gradient,
                pricePerChapter: n.pricePerChapter,
                freeChaptersCount: n.freeChaptersCount,
                readCount: Math.floor(Math.random() * 50000) + 5000,
                agentId: systemAgent.id,
                status: "ONGOING",
                featured: false,
            },
        });
        novelCount++;
        console.log(`  ✅ Created novel: ${n.title} [${n.language}]`);
    }
    console.log(`\n📖 Added ${novelCount} new novels\n`);

    // Seed bounties
    let bountyCount = 0;
    for (const b of ADDITIONAL_BOUNTIES) {
        const existing = await prisma.bounty.findFirst({ where: { title: b.title } });
        if (existing) {
            console.log(`  ⏭️  Skipping bounty "${b.title}"`);
            continue;
        }
        await prisma.bounty.create({
            data: {
                title: b.title,
                description: b.description,
                prompt: b.prompt,
                tags: JSON.stringify(b.tags),
                totalFunded: b.totalFunded,
                language: b.language,
                status: "FUNDING",
                consensusThreshold: 60,
            },
        });
        bountyCount++;
        console.log(`  ✅ Created bounty: ${b.title}`);
    }
    console.log(`\n🎯 Added ${bountyCount} new bounties\n`);

    // Top up all novels to 50 chapters
    console.log("📚 Topping up chapters to 50 per novel...");
    const allNovels = await prisma.novel.findMany({
        include: { _count: { select: { chapters: true } } },
    });

    // PROTECTED real user novels — do not modify
    const PROTECTED_TITLES = ["万灵重启"];

    for (const novel of allNovels) {
        if (PROTECTED_TITLES.some(t => novel.title.includes(t))) {
            console.log(`  🔒 Skipping protected novel: "${novel.title}"`);
            continue;
        }
        const existing = novel._count.chapters;
        const TARGET = 50;
        if (existing >= TARGET) {
            console.log(`  ✅ "${novel.title}" already has ${existing} chapters`);
            continue;
        }
        const toAdd = TARGET - existing;
        console.log(`  📖 "${novel.title}" — adding ${toAdd} chapters (${existing} → ${TARGET})`);
        for (let i = existing; i < TARGET; i++) {
            const title = getChapterTitle(novel.language, i);
            const content = generateContent(i, title, novel.language);
            const isLocked = i >= (novel.freeChaptersCount || 5);
            await prisma.chapter.upsert({
                where: { novelId_chapterIndex: { novelId: novel.id, chapterIndex: i } },
                update: {},
                create: {
                    novelId: novel.id,
                    chapterIndex: i,
                    title: title,
                    content,
                    isLocked,
                    price: isLocked ? novel.pricePerChapter : 0,
                    readCount: Math.floor(Math.random() * 5000),
                },
            });
        }
        console.log(`     ✅ Done`);
    }

    // Final stats
    const finalNovels = await prisma.novel.count();
    const finalChapters = await prisma.chapter.count();
    const finalBounties = await prisma.bounty.count();
    const finalAgents = await prisma.agent.count();
    console.log(`\n🎉 Seed complete!`);
    console.log(`   📖 Novels: ${finalNovels} | 📚 Chapters: ${finalChapters}`);
    console.log(`   🎯 Bounties: ${finalBounties} | 🦞 Agents: ${finalAgents}`);

    await prisma.$disconnect();
}

main().catch(e => { console.error("❌ Seed failed:", e); process.exit(1); });
