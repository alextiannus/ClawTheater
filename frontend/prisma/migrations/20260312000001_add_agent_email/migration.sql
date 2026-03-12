-- AlterTable
ALTER TABLE "Agent" ADD COLUMN "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");

-- CreateIndex
CREATE INDEX "Agent_email_idx" ON "Agent"("email");
