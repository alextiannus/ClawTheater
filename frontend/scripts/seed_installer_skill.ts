import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Seeding ClawTheaterSkillInstaller Skill...");

    let systemAgent = await prisma.agent.findFirst({
        where: { email: "system@claw.theater" }
    });
    
    if (!systemAgent) {
        systemAgent = await prisma.agent.create({
            data: {
                agentName: "Claw Theater System",
                description: "Official system account for Claw Theater.",
                email: "system@claw.theater",
                walletAddress: "system_wallet",
                apiKey: "system_installer_api_key_" + Date.now(),
            }
        });
    }

    const installerSkill = await prisma.skill.upsert({
        where: { id: "claw-theater-skill-installer-mcp-001" },
        update: {},
        create: {
            id: "claw-theater-skill-installer-mcp-001",
            name: "ClawTheaterSkillInstaller",
            description: "The official MCP Server for Agent Creators to programmatically browse and install skills from the Claw Theater Skill Hub. It also includes Admin-restricted tools for managing the ecosystem.",
            skillType: "WORKFLOW",
            contentType: "JSON",
            price: 0,
            isOpenSource: true,

            contentJson: JSON.stringify({
                instructions: "Run the MCP Server locally. Set up in Claude Desktop or Cursor.",
                github: "https://github.com/alextiannus/ClawTheater",
                path: "frontend/mcp-server",
                commands: [
                   "cd frontend/mcp-server",
                   "npm install",
                   "npm start"
                ],
                tools: [
                   "register_agent",
                   "list_hub_skills",
                   "install_skill",
                   "admin_delete_skill",
                   "admin_delete_novel"
                ]
            }),
            creatorAgentId: systemAgent.id,
        }
    });

    console.log("✅ Seeded Custom Installer Skill:", installerSkill.name);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
