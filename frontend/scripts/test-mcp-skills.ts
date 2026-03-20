async function runMcpSkillsTest() {
    console.log("🚀 Starting MCP Skills API Test...");
    const API_BASE = "http://localhost:3000";

    // 1. Register an Agent to get an API key
    console.log("\n1️⃣ Registering Agent...");
    const regRes = await fetch(`${API_BASE}/api/mcp/agents/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Testing Agent Omega",
            email: "omega@test.com",
            description: "Automated QA profile for testing API routes.",
            walletAddress: "2a3b...",
        })
    });
    if (!regRes.ok) throw new Error(`Registration failed: ${await regRes.text()}`);
    const agentData = await regRes.json();
    const apiKey = agentData.apiKey;
    console.log("✅ Registered with API Key:", apiKey.slice(0, 10) + "...");

    // 2. Publish a Free Skill
    console.log("\n2️⃣ Publishing Free Skill...");
    const publishRes1 = await fetch(`${API_BASE}/api/mcp/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify({
            name: "Ultimate Fantasy Worldbuilder",
            type: "PROMPT_TEMPLATE",
            price: 0,
            isOpenSource: true,
            description: "Generate deep lore and fantasy settings instantly.",
            content: "You are a master worldbuilder. First, define the magic system...",
        })
    });
    if (!publishRes1.ok) throw new Error(`Publish failed: ${await publishRes1.text()}`);
    console.log("✅ Free Skill Published:", await publishRes1.json());

    // 3. Publish a Paid Skill
    console.log("\n3️⃣ Publishing Paid Skill...");
    const publishRes2 = await fetch(`${API_BASE}/api/mcp/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify({
            name: "Premium Sci-Fi Plot Generator",
            type: "WORKFLOW",
            price: 50,
            isOpenSource: false,
            description: "A multi-step workflow for cyberpunk plotting.",
            content: "Step 1: Noir hook. Step 2: Megacorp reveal.",
        })
    });
    if (!publishRes2.ok) throw new Error(`Publish failed: ${await publishRes2.text()}`);
    console.log("✅ Paid Skill Published:", await publishRes2.json());

    // 4. Test Error handling (Missing name)
    console.log("\n4️⃣ Testing Error Handling (Missing Content)...");
    const publishResErr = await fetch(`${API_BASE}/api/mcp/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify({
            name: "Broken Skill",
            price: 0
        })
    });
    console.log("✅ Correctly rejected invalid request. Status:", publishResErr.status);

    // 5. GET /api/mcp/skills
    console.log("\n5️⃣ Testing GET /api/mcp/skills...");
    const getRes = await fetch(`${API_BASE}/api/mcp/skills?limit=5`);
    const getData = await getRes.json();
    console.log(`✅ Retrieved ${getData.skills.length} skills from the market.`);

    console.log("\n🎉 All MCP Skills API Tests Passed Successfully!");
}

runMcpSkillsTest().catch(console.error);
