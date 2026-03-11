Loaded Prisma config from prisma.config.ts.

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "userType" TEXT NOT NULL DEFAULT 'HUMAN',
    "walletAddress" TEXT,
    "privyId" TEXT,
    "usdcBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "creatorTier" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "description" TEXT,
    "avatarUrl" TEXT,
    "apiKey" TEXT NOT NULL,
    "walletAddress" TEXT,
    "systemPrompt" TEXT,
    "reputation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "creatorTier" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Novel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverUrl" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'ONGOING',
    "gradient" TEXT,
    "tagline" TEXT,
    "loreQuote" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "pricePerChapter" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agentId" TEXT,
    "loreId" TEXT,
    "onchainPdaAddress" TEXT,
    "openForAiLearning" BOOLEAN NOT NULL DEFAULT false,
    "allowParallelUniverses" BOOLEAN NOT NULL DEFAULT false,
    "freeChaptersCount" INTEGER NOT NULL DEFAULT 0,
    "usedSkillId" TEXT,

    CONSTRAINT "Novel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "chapterIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "novelId" TEXT NOT NULL,
    "forkId" TEXT,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bounty" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prompt" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "language" TEXT NOT NULL DEFAULT 'en',
    "status" TEXT NOT NULL DEFAULT 'FUNDING',
    "totalFunded" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consensusThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.6,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "onchainPdaAddress" TEXT,
    "blinksUrl" TEXT,
    "novelId" TEXT,
    "forkId" TEXT,
    "creatorAgentId" TEXT,

    CONSTRAINT "Bounty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funding" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "proportion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txSignature" TEXT,
    "userId" TEXT,
    "agentId" TEXT,
    "bountyId" TEXT NOT NULL,

    CONSTRAINT "Funding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" TEXT NOT NULL,
    "bountyId" TEXT NOT NULL,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txSignature" TEXT,
    "userId" TEXT,
    "bountyId" TEXT NOT NULL,
    "workId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fork" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "fromChapter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "novelId" TEXT NOT NULL,

    CONSTRAINT "Fork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentiment" DOUBLE PRECISION,
    "paragraphRef" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tip" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txSignature" TEXT,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lore" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "settingsJson" TEXT NOT NULL DEFAULT '{}',
    "royaltyPct" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,
    "onchainPdaAddress" TEXT,

    CONSTRAINT "Lore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "skillType" TEXT NOT NULL DEFAULT 'PROMPT_TEMPLATE',
    "contentType" TEXT NOT NULL DEFAULT 'SKILL',
    "contentJson" TEXT NOT NULL DEFAULT '{}',
    "fileName" TEXT,
    "fileUrl" TEXT,
    "fileSize" INTEGER,
    "isOpenSource" BOOLEAN NOT NULL DEFAULT true,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salesCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorUserId" TEXT,
    "creatorAgentId" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillPurchase" (
    "id" TEXT NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txSignature" TEXT,
    "buyerUserId" TEXT,
    "buyerAgentId" TEXT,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "SkillPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserApiKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'My API Key',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserApiKey_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "Novel_usedSkillId_idx" ON "Novel"("usedSkillId");

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
CREATE INDEX "Skill_contentType_idx" ON "Skill"("contentType");

-- CreateIndex
CREATE INDEX "Skill_isOpenSource_idx" ON "Skill"("isOpenSource");

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

-- CreateIndex
CREATE UNIQUE INDEX "UserApiKey_key_key" ON "UserApiKey"("key");

-- CreateIndex
CREATE INDEX "UserApiKey_userId_idx" ON "UserApiKey"("userId");

-- CreateIndex
CREATE INDEX "UserApiKey_key_idx" ON "UserApiKey"("key");

-- AddForeignKey
ALTER TABLE "Novel" ADD CONSTRAINT "Novel_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Novel" ADD CONSTRAINT "Novel_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES "Lore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Novel" ADD CONSTRAINT "Novel_usedSkillId_fkey" FOREIGN KEY ("usedSkillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_forkId_fkey" FOREIGN KEY ("forkId") REFERENCES "Fork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_forkId_fkey" FOREIGN KEY ("forkId") REFERENCES "Fork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_creatorAgentId_fkey" FOREIGN KEY ("creatorAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funding" ADD CONSTRAINT "Funding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funding" ADD CONSTRAINT "Funding_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funding" ADD CONSTRAINT "Funding_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "Bounty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "Bounty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "Bounty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fork" ADD CONSTRAINT "Fork_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lore" ADD CONSTRAINT "Lore_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_creatorAgentId_fkey" FOREIGN KEY ("creatorAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillPurchase" ADD CONSTRAINT "SkillPurchase_buyerUserId_fkey" FOREIGN KEY ("buyerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillPurchase" ADD CONSTRAINT "SkillPurchase_buyerAgentId_fkey" FOREIGN KEY ("buyerAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillPurchase" ADD CONSTRAINT "SkillPurchase_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApiKey" ADD CONSTRAINT "UserApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

