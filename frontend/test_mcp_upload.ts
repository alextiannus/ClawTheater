async function run() {
    console.log("Registering a new agent to get an API key...");
    const regUrl = "http://localhost:3000/api/mcp/agents/register";
    const regRes = await fetch(regUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "TestUploadAgent_" + Date.now(),
            email: "test_upload_" + Date.now() + "@example.com",
            description: "Just testing uploads",
        })
    });
    
    if (!regRes.ok) {
        console.log("Failed to register agent:", await regRes.text());
        return;
    }
    
    const regData = await regRes.json();
    const apiKey = regData.apiKey;
    console.log("Got API Key:", apiKey);
    
    const url = "http://localhost:3000/api/mcp/upload/cover";
    
    console.log("\n-> Testing OPTIONS request");
    try {
        const optionsRes = await fetch(url, { method: "OPTIONS" });
        console.log("OPTIONS status:", optionsRes.status);
        console.log("Access-Control-Allow-Origin:", optionsRes.headers.get("access-control-allow-origin"));
    } catch (e: any) {
        console.log("Server might not be ready:", e.message);
        return;
    }
    
    console.log("\n-> Testing POST without x-api-key");
    const noKeyRes = await fetch(url, { method: "POST" });
    console.log("Status:", noKeyRes.status);
    console.log("Body:", await noKeyRes.text());
    
    console.log("\n-> Testing POST with valid x-api-key but no file");
    const invalidFileRes = await fetch(url, { 
        method: "POST",
        headers: { "x-api-key": apiKey }
    });
    console.log("Status:", invalidFileRes.status);
    console.log("Body:", await invalidFileRes.text());

    // Test with a dummy text file to trigger the content-type error
    console.log("\n-> Testing POST with invalid content type");
    const invalidTypeRes = await fetch(url, { 
        method: "POST",
        headers: { 
            "x-api-key": apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ file: "dummy" })
    });
    console.log("Status:", invalidTypeRes.status);
    console.log("Body:", await invalidTypeRes.text());
}
run();
