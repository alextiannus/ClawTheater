import fetch from "node-fetch";

const PRODUCTION_API = "https://claw.theater/api/market";
const CREATOR_USER_ID = "did:privy:cmmkslvg700fh0cl4vz4ax4ue";

const skillsToUpload = [
    {
        name: "YILING: 多章节硬核网文生成架构",
        description: "专门针对多章节长篇小说设计的生成器底层架构。解决自动上下文衔接和伏笔管理，提供顶级的超长篇连载上下文跟踪能力。适用于需要保持数万字连贯性的叙事 Agent。",
        contentType: "SKILL",
        skillType: "PROMPT_TEMPLATE",
        isOpenSource: true,
        price: 0,
        content: `GitHub 仓库信息整合于此：https://github.com/YILING0013/AI_NovelGenerator\n此 Skill 提供长篇小说创作的“前情提要”摘要生成与“伏笔库”机制的 Prompt 设计思路。`
    },
    {
        name: "RWKV-LM: 极致网文语感引擎核心",
        description: "源于著名的序列大模型开源社区 RWKV-LM，沉淀的海量完美的“小说人设”、“世界观设定”及修仙/玄幻小说语感 Prompt 特征库。让 Agent 拥有纯正的大神级写手语感。",
        contentType: "SKILL",
        skillType: "PROMPT_TEMPLATE",
        isOpenSource: true,
        price: 0,
        content: `相关参考库：https://github.com/BlinkDL/RWKV-LM\n此 Skill 提供修仙/玄幻/爽文类专用的系统设定模板，强化 Agent 对“装逼打脸”、“升级体系”的深层理解。`
    },
    {
        name: "WACV: 性格锚点与人物弧光扮演体系",
        description: "源于 Chat-WAVC 的角色扮演测评框架，专门解决小说角色“OOC（人设崩塌）”问题。让 Agent 故事里的角色严格按照 MBTI 或性格档案以符合人设的口吻说话与互动。",
        contentType: "SKILL",
        skillType: "PROMPT_TEMPLATE",
        isOpenSource: true,
        price: 0,
        content: `来源框架：https://github.com/LC1332/Chat-WACV\n此 Skill 强调将对话系统与角色的隐藏动机（Hidden Motive）、心理学弱点（Fatal Flaw）相绑定。`
    },
    {
        name: "Awesome Storyteller: 万能写作提示词全辑",
        description: "从 awesome-chatgpt-prompts 提炼出针对小说家的精华合集。万能百搭的“Act as a Novelist”框架，帮助构建起承转合、感官细节填充（Show, Don't Tell）的基础叙事能力。",
        contentType: "SKILL",
        skillType: "PROMPT_TEMPLATE",
        isOpenSource: true,
        price: 0,
        content: `合集源：https://github.com/f/awesome-chatgpt-prompts\n提供各种类型（奇幻、科幻、浪漫）的预设小说家扮演指令模板，即插即用，提升文本渲染力。`
    }
];

async function main() {
    console.log(`Starting upload to production market for creator: ${CREATOR_USER_ID}`);
    let successCount = 0;

    for (const skill of skillsToUpload) {
        console.log(`Uploading skill: ${skill.name}...`);
        try {
            const body = {
                ...skill,
                creatorUserId: CREATOR_USER_ID
            };

            const response = await fetch(PRODUCTION_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Success: ${data.message} (ID: ${data.id})`);
                successCount++;
            } else {
                const errorData = await response.json();
                console.error(`❌ Failed: ${errorData.error}`);
            }
        } catch (error) {
            console.error(`❌ Fetch error for ${skill.name}: ${error}`);
        }
    }

    console.log(`\n🎉 Uploaded ${successCount}/${skillsToUpload.length} skills to production.`);
}

main().catch(console.error);
