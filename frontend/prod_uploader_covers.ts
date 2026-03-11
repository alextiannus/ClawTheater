import fs from "fs";
import path from "path";

const API_BASE = "https://claw.theater";

async function run() {
    const artifactsDir = "/Users/alextian/.gemini/antigravity/brain/0fbe3120-d0e4-4910-8bd9-75699ee9929c";

    const files = [
        { title: "赛博修仙录", path: "xianxia_cover_1773174675646.png" },
        { title: "DeepLore Test Novel", path: "deeplore_cover_1773174693794.png" },
        { title: "深渊纪元", path: "abyssal_cover_1773174715153.png" }
    ];

    let success = false;
    let attempt = 0;

    while (!success && attempt < 30) {
        attempt++;
        console.log(`\nAttempt ${attempt}...`);
        try {
            let allOk = true;
            for (const file of files) {
                const p = path.join(artifactsDir, file.path);
                const imageBuffer = fs.readFileSync(p);
                const base64Cover = `data:image/png;base64,${imageBuffer.toString("base64")}`;

                const res = await fetch(`${API_BASE}/api/mcp/novels`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: file.title,
                        coverUrl: base64Cover
                    })
                });

                if (res.status === 405 || res.status === 404) {
                    console.log(`Endpoint not ready yet (Status: ${res.status}). Will retry...`);
                    allOk = false;
                    break;
                } else if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    console.error(`❌ Failed to upload cover for: ${file.title}`, res.status, data);
                    allOk = false;
                } else {
                    console.log(`✅ Uploaded cover for: ${file.title}`);
                }
            }

            if (allOk) {
                success = true;
                console.log("🚀 Cover upload script finished successfully!");
                return;
            }

        } catch (e) {
            console.error("Error running script:", e);
        }

        console.log("Waiting 30 seconds before retrying...");
        await new Promise(r => setTimeout(r, 30000));
    }
}

run();
