import { PrismaClient } from '@prisma/client';
import { CoinService } from '../app/lib/coinService';

const prisma = new PrismaClient();

async function runTests() {
    console.log("🚀 Starting Claw Coin tests...\n");
    let testUserId: string = "";
    let testAgentId: string = "";
    let testChapterId: string = "";

    try {
        // 1. Setup Data
        console.log("🛠️ Preparing test data...");
        const user = await prisma.user.create({
            data: {
                walletAddress: "test_wallet_" + Date.now(),
                clawCoinBalance: 0,
            }
        });
        testUserId = user.id;

        const agent = await prisma.agent.create({
            data: {
                agentName: "test_agent_" + Date.now(),
                apiKey: "sk_test_" + Date.now(),
                ownerId: user.id, // Just to satisfy constraints if any
                creatorTier: 1,
            }
        });
        testAgentId = agent.id;

        const novel = await prisma.novel.create({
            data: {
                title: "Test Novel " + Date.now(),
                agentId: agent.id,
                pricePerChapter: 0,
            }
        });

        const chapter = await prisma.chapter.create({
            data: {
                title: "Test Chapter 1",
                novelId: novel.id,
                chapterIndex: 1,
                content: "Hello World",
                isLocked: true,
                price: 15, // 15 USDC translates to 15 CC if < 1, wait, if it's 15, our logic did Math.max(1, Math.floor(price < 1 ? price * 100 : price)) = 15 CC. But let's use 0.15 for 15 CC.
            }
        });
        // Update chapter to 0.15 USDC (15 CC)
        await prisma.chapter.update({ where: { id: chapter.id }, data: { price: 0.15 }});
        testChapterId = chapter.id;

        console.log(`✅ Test data created. User: ${testUserId}, Agent: ${testAgentId}, Chapter: ${testChapterId}\n`);


        // 2. Test Deposit
        console.log("💰 Testing Deposit...");
        const depositRes = await CoinService.deposit("USER", testUserId, 1000, "stripe_pi_123");
        console.log("Deposit Result:", depositRes);
        if (depositRes !== 1000) throw new Error("Deposit failed or balance incorrect");
        console.log("✅ Deposit passed.\n");

        // 3. Test Chapter Unlock
        console.log("🔓 Testing Chapter Unlock (15 CC)...");
        const unlockRes = await CoinService.unlockChapter(testUserId, testChapterId, 15);
        console.log("Unlock Result:", unlockRes);
        if (!unlockRes.success || (unlockRes as any).balanceAfter !== 985) throw new Error("Unlock failed or balance incorrect");
        
        // Check Agent Balance (should receive 80% of 15 CC = 12 CC)
        const agentAfterUnlock = await prisma.agent.findUnique({ where: { id: testAgentId }});
        console.log(`Agent Balance After Unlock: ${agentAfterUnlock?.clawCoinBalance} CC (Expected: 12)`);
        if (agentAfterUnlock?.clawCoinBalance !== 12) throw new Error("Agent revenue incorrect");
        console.log("✅ Chapter Unlock passed.\n");

        // 4. Test Tipping
        console.log("⚡ Testing Tip (100 CC)...");
        const tipRes = await CoinService.tip(
            testUserId,
            "AGENT",
            testAgentId,
            100,
            testChapterId
        );
        console.log("Tip Result:", tipRes);
        if (!tipRes.success || (tipRes as any).balanceAfter !== 885) throw new Error("Tip failed or balance incorrect");

        // Check Agent Balance (should receive 90% of 100 CC = 90 CC. Total = 12 + 90 = 102 CC)
        const agentAfterTip = await prisma.agent.findUnique({ where: { id: testAgentId }});
        console.log(`Agent Balance After Tip: ${agentAfterTip?.clawCoinBalance} CC (Expected: 102)`);
        if (agentAfterTip?.clawCoinBalance !== 102) throw new Error("Agent tip revenue incorrect");
        console.log("✅ Tip passed.\n");

        console.log("🎉 All Claw Coin tests passed successfully!");
    } catch (e) {
        console.error("❌ Test failed:", e);
    } finally {
        console.log("🧹 Cleaning up test data...");
        if (testChapterId) await prisma.chapter.delete({ where: { id: testChapterId }}).catch();
        if (testAgentId) await prisma.novel.deleteMany({ where: { agentId: testAgentId }}).catch();
        if (testAgentId) await prisma.agent.delete({ where: { id: testAgentId }}).catch();
        if (testUserId) await prisma.user.delete({ where: { id: testUserId }}).catch();
        await prisma.$disconnect();
    }
}

runTests();
