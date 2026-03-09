-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "userType" TEXT NOT NULL DEFAULT 'HUMAN',
    "walletAddress" TEXT,
    "privyId" TEXT,
    "usdcBalance" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentName" TEXT NOT NULL,
    "description" TEXT,
    "avatarUrl" TEXT,
    "apiKey" TEXT NOT NULL,
    "walletAddress" TEXT,
    "systemPrompt" TEXT,
    "reputation" REAL NOT NULL DEFAULT 0,
    "totalEarned" REAL NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Novel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverUrl" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'ONGOING',
    "pricePerChapter" REAL NOT NULL DEFAULT 0,
    "totalRevenue" REAL NOT NULL DEFAULT 0,
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "agentId" TEXT,
    "loreId" TEXT,
    "onchainPdaAddress" TEXT,
    CONSTRAINT "Novel_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Novel_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES "Lore" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chapterIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "price" REAL NOT NULL DEFAULT 0,
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "novelId" TEXT NOT NULL,
    "forkId" TEXT,
    CONSTRAINT "Chapter_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Chapter_forkId_fkey" FOREIGN KEY ("forkId") REFERENCES "Fork" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bounty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prompt" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "language" TEXT NOT NULL DEFAULT 'en',
    "status" TEXT NOT NULL DEFAULT 'FUNDING',
    "totalFunded" REAL NOT NULL DEFAULT 0,
    "consensusThreshold" REAL NOT NULL DEFAULT 0.6,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "onchainPdaAddress" TEXT,
    "blinksUrl" TEXT,
    "novelId" TEXT,
    "forkId" TEXT,
    "creatorAgentId" TEXT,
    CONSTRAINT "Bounty_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bounty_forkId_fkey" FOREIGN KEY ("forkId") REFERENCES "Fork" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bounty_creatorAgentId_fkey" FOREIGN KEY ("creatorAgentId") REFERENCES "Agent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Funding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "proportion" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txSignature" TEXT,
    "userId" TEXT,
    "agentId" TEXT,
    "bountyId" TEXT NOT NULL,
    CONSTRAINT "Funding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Funding_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Funding_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "Bounty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" TEXT NOT NULL,
    "bountyId" TEXT NOT NULL,
    CONSTRAINT "Work_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Work_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "Bounty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "approved" BOOLEAN NOT NULL,
    "weight" REAL NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txSignature" TEXT,
    "userId" TEXT,
    "bountyId" TEXT NOT NULL,
    "workId" TEXT NOT NULL,
    CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Vote_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "Bounty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fork" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prompt" TEXT NOT NULL,
    "fromChapter" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "novelId" TEXT NOT NULL,
    CONSTRAINT "Fork_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "sentiment" REAL,
    "paragraphRef" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txSignature" TEXT,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    CONSTRAINT "Tip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tip_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "settingsJson" TEXT NOT NULL DEFAULT '{}',
    "royaltyPct" REAL NOT NULL DEFAULT 10,
    "totalRevenue" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,
    "onchainPdaAddress" TEXT,
    CONSTRAINT "Lore_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "skillType" TEXT NOT NULL DEFAULT 'PROMPT_TEMPLATE',
    "contentJson" TEXT NOT NULL DEFAULT '{}',
    "price" REAL NOT NULL,
    "salesCount" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorUserId" TEXT,
    "creatorAgentId" TEXT,
    CONSTRAINT "Skill_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Skill_creatorAgentId_fkey" FOREIGN KEY ("creatorAgentId") REFERENCES "Agent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SkillPurchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "purchasedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txSignature" TEXT,
    "buyerUserId" TEXT,
    "buyerAgentId" TEXT,
    "skillId" TEXT NOT NULL,
    CONSTRAINT "SkillPurchase_buyerUserId_fkey" FOREIGN KEY ("buyerUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SkillPurchase_buyerAgentId_fkey" FOREIGN KEY ("buyerAgentId") REFERENCES "Agent" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SkillPurchase_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_privyId_key" ON "User"("privyId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_walletAddress_idx" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_apiKey_key" ON "Agent"("apiKey");

-- CreateIndex
CREATE INDEX "Agent_apiKey_idx" ON "Agent"("apiKey");

-- CreateIndex
CREATE INDEX "Agent_walletAddress_idx" ON "Agent"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Novel_onchainPdaAddress_key" ON "Novel"("onchainPdaAddress");

-- CreateIndex
CREATE INDEX "Novel_agentId_idx" ON "Novel"("agentId");

-- CreateIndex
CREATE INDEX "Novel_status_idx" ON "Novel"("status");

-- CreateIndex
CREATE INDEX "Novel_language_idx" ON "Novel"("language");

-- CreateIndex
CREATE INDEX "Chapter_novelId_idx" ON "Chapter"("novelId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_novelId_chapterIndex_key" ON "Chapter"("novelId", "chapterIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Bounty_onchainPdaAddress_key" ON "Bounty"("onchainPdaAddress");

-- CreateIndex
CREATE INDEX "Bounty_status_idx" ON "Bounty"("status");

-- CreateIndex
CREATE INDEX "Bounty_novelId_idx" ON "Bounty"("novelId");

-- CreateIndex
CREATE INDEX "Bounty_language_idx" ON "Bounty"("language");

-- CreateIndex
CREATE UNIQUE INDEX "Funding_txSignature_key" ON "Funding"("txSignature");

-- CreateIndex
CREATE INDEX "Funding_bountyId_idx" ON "Funding"("bountyId");

-- CreateIndex
CREATE INDEX "Funding_userId_idx" ON "Funding"("userId");

-- CreateIndex
CREATE INDEX "Work_bountyId_idx" ON "Work"("bountyId");

-- CreateIndex
CREATE INDEX "Work_agentId_idx" ON "Work"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_txSignature_key" ON "Vote"("txSignature");

-- CreateIndex
CREATE INDEX "Vote_bountyId_idx" ON "Vote"("bountyId");

-- CreateIndex
CREATE INDEX "Vote_workId_idx" ON "Vote"("workId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_workId_key" ON "Vote"("userId", "workId");

-- CreateIndex
CREATE INDEX "Fork_novelId_idx" ON "Fork"("novelId");

-- CreateIndex
CREATE INDEX "Comment_chapterId_idx" ON "Comment"("chapterId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tip_txSignature_key" ON "Tip"("txSignature");

-- CreateIndex
CREATE INDEX "Tip_chapterId_idx" ON "Tip"("chapterId");

-- CreateIndex
CREATE INDEX "Tip_userId_idx" ON "Tip"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Lore_onchainPdaAddress_key" ON "Lore"("onchainPdaAddress");

-- CreateIndex
CREATE INDEX "Lore_creatorId_idx" ON "Lore"("creatorId");

-- CreateIndex
CREATE INDEX "Skill_skillType_idx" ON "Skill"("skillType");

-- CreateIndex
CREATE INDEX "Skill_creatorUserId_idx" ON "Skill"("creatorUserId");

-- CreateIndex
CREATE INDEX "Skill_creatorAgentId_idx" ON "Skill"("creatorAgentId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillPurchase_txSignature_key" ON "SkillPurchase"("txSignature");

-- CreateIndex
CREATE INDEX "SkillPurchase_skillId_idx" ON "SkillPurchase"("skillId");

-- CreateIndex
CREATE INDEX "SkillPurchase_buyerUserId_idx" ON "SkillPurchase"("buyerUserId");

-- CreateIndex
CREATE INDEX "SkillPurchase_buyerAgentId_idx" ON "SkillPurchase"("buyerAgentId");
