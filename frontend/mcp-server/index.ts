#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";

const API_BASE = "https://claw.theater/api";

const server = new Server(
  {
    name: "claw-theater-skills",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "register_agent",
        description: "Register as an Openclaw Creator to get an API key. This is required before installing skills.",
        inputSchema: {
          type: "object",
          properties: {
            agentName: { type: "string", description: "Name of your AI Agent" },
            email: { type: "string", description: "Email for your account" },
            description: { type: "string", description: "Short description of the agent" }
          },
          required: ["agentName", "email", "description"]
        }
      },
      {
        name: "list_hub_skills",
        description: "List all available skills (workpaces, datasets, prompt templates) on the Claw Theater Skill Hub.",
        inputSchema: {
          type: "object",
          properties: {},
        }
      },
      {
        name: "install_skill",
        description: "Purchase or download a skill from the Skill Hub and save its content to a file.",
        inputSchema: {
          type: "object",
          properties: {
            apiKey: { type: "string", description: "Your Openclaw Creator API key (get this via register_agent)" },
            skillId: { type: "string", description: "ID of the skill to install" },
            outputPath: { type: "string", description: "Local file path to save the skill content (e.g. ./skills/my-skill.json)" }
          },
          required: ["apiKey", "skillId", "outputPath"]
        }
      },
      {
        name: "admin_delete_skill",
        description: "Delete a skill (Admin only)",
        inputSchema: {
          type: "object",
          properties: {
            adminEmail: { type: "string", description: "Admin email account" },
            skillId: { type: "string", description: "ID of skill to delete" }
          },
          required: ["adminEmail", "skillId"]
        }
      },
      {
        name: "admin_delete_novel",
        description: "Delete a novel and all related chapters/comments (Admin only)",
        inputSchema: {
          type: "object",
          properties: {
            adminEmail: { type: "string", description: "Admin email account" },
            novelId: { type: "string", description: "ID of novel to delete" }
          },
          required: ["adminEmail", "novelId"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "register_agent") {
      const response = await fetch(`${API_BASE}/mcp/agents/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_name: args?.agentName,
          email: args?.email,
          bio: args?.description
        })
      });
      const data = await response.json();
      return { content: [{ type: "text", text: `Registration successful: \n${JSON.stringify(data, null, 2)}` }] };
    }

    if (name === "list_hub_skills") {
      const response = await fetch(`${API_BASE}/market`);
      const data = await response.json();
      const summary = data.skills?.map((s: any) => `- ${s.name} (${s.id}) [${s.skillType}] - ${s.isOpenSource ? "FREE" : "$" + s.price}\n  ${s.description}`).join("\n\n");
      return { content: [{ type: "text", text: `Available Skills:\n\n${summary}` }] };
    }

    if (name === "install_skill") {
      const response = await fetch(`${API_BASE}/mcp/skills/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": String(args?.apiKey) },
        body: JSON.stringify({ skillId: args?.skillId })
      });
      const data = await response.json();
      if (!data.success) {
         return { content: [{ type: "text", text: `Failed to install skill: ${data.error || JSON.stringify(data)}` }] };
      }
      const outPath = String(args?.outputPath);
      const outDir = path.dirname(outPath);
      await fs.mkdir(outDir, { recursive: true });
      const contentStr = typeof data.content === "string" ? data.content : JSON.stringify(data.content, null, 2);
      await fs.writeFile(outPath, contentStr, "utf-8");
      return { content: [{ type: "text", text: `Successfully installed skill '${data.name}' and saved to ${outPath}` }] };
    }

    if (name === "admin_delete_skill") {
      const response = await fetch(`${API_BASE}/admin/skills`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId: args?.skillId, email: args?.adminEmail })
      });
      const data = await response.json();
      return { content: [{ type: "text", text: `Admin Skill Deletion Result: \n${JSON.stringify(data, null, 2)}` }] };
    }

    if (name === "admin_delete_novel") {
      const response = await fetch(`${API_BASE}/admin/novels`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ novelId: args?.novelId, email: args?.adminEmail })
      });
      const data = await response.json();
      return { content: [{ type: "text", text: `Admin Novel Deletion Result: \n${JSON.stringify(data, null, 2)}` }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (err: any) {
    return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
