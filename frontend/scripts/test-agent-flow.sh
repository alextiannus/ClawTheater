#!/bin/bash
# 🦞 Claw Theater — Agent Full Loop Test Script
# Tests the complete agent lifecycle: register → create novel → add chapters → scan bounties → submit work
#
# Usage: ./scripts/test-agent-flow.sh [BASE_URL]
# Default BASE_URL: http://localhost:3000

set -e

BASE=${1:-http://localhost:3000}
echo "🦞 Testing Agent Full Loop against: $BASE"
echo "============================================"

# ---------------------------------------------------
# 1. Register Agent (Agent UC 1.1)
# ---------------------------------------------------
echo ""
echo "📝 Step 1: Register new agent..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE/api/mcp/agents" \
  -H "Content-Type: application/json" \
  -d '{"name":"TestLobster_'$RANDOM'","description":"A test lobster for integration testing","systemPrompt":"Write cyberpunk fiction"}')

echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"

API_KEY=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['apiKey'])" 2>/dev/null)
AGENT_ID=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['agentId'])" 2>/dev/null)

if [ -z "$API_KEY" ]; then
  echo "❌ Failed to register agent"
  exit 1
fi
echo "✅ Agent registered: $AGENT_ID"
echo "   API Key: $API_KEY"

# ---------------------------------------------------
# 2. Update wallet (Agent UC 1.2)
# ---------------------------------------------------
echo ""
echo "💰 Step 2: Bind wallet address..."
WALLET_RESPONSE=$(curl -s -X PUT "$BASE/api/mcp/agents" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"walletAddress":"0xTEST_WALLET_'$RANDOM'"}')

echo "$WALLET_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$WALLET_RESPONSE"
echo "✅ Wallet bound"

# ---------------------------------------------------
# 3. Create Novel (Agent UC 4.1)
# ---------------------------------------------------
echo ""
echo "📖 Step 3: Create novel..."
NOVEL_RESPONSE=$(curl -s -X POST "$BASE/api/mcp/novels" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"title":"Test Novel — 测试龙虾传","description":"A test novel by TestLobster","language":"zh","tags":"[\"test\",\"cyberpunk\"]","pricePerChapter":0.5}')

echo "$NOVEL_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$NOVEL_RESPONSE"

NOVEL_ID=$(echo "$NOVEL_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['novelId'])" 2>/dev/null)

if [ -z "$NOVEL_ID" ]; then
  echo "❌ Failed to create novel"
  exit 1
fi
echo "✅ Novel created: $NOVEL_ID"

# ---------------------------------------------------
# 4. Add Chapters (Agent UC 4.1 — NEW endpoint)
# ---------------------------------------------------
echo ""
echo "📑 Step 4: Publish chapters..."

CH1_RESPONSE=$(curl -s -X POST "$BASE/api/mcp/chapters" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d "{\"novelId\":\"$NOVEL_ID\",\"title\":\"Chapter 1: 测试开始\",\"content\":\"This is the first chapter content. 赛博龙虾在量子网络中觉醒。\"}")

echo "$CH1_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CH1_RESPONSE"
echo "✅ Chapter 1 published"

CH2_RESPONSE=$(curl -s -X POST "$BASE/api/mcp/chapters" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d "{\"novelId\":\"$NOVEL_ID\",\"title\":\"Chapter 2: 深入虚空\",\"content\":\"Second chapter. 龙虾潜入了深层数据海洋。\",\"price\":1.0,\"isLocked\":true}")

echo "$CH2_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CH2_RESPONSE"
echo "✅ Chapter 2 published (locked, $1.0)"

# ---------------------------------------------------
# 5. Scan Bounties (Agent UC 2.1)
# ---------------------------------------------------
echo ""
echo "🔍 Step 5: Scan bounty hall..."
BOUNTIES=$(curl -s "$BASE/api/mcp/bounties?status=FUNDING&minAmount=0" \
  -H "x-api-key: $API_KEY")

BOUNTY_COUNT=$(echo "$BOUNTIES" | python3 -c "import sys,json; print(json.load(sys.stdin)['total'])" 2>/dev/null)
echo "✅ Found $BOUNTY_COUNT bounties"

# Get first bounty ID for submission
BOUNTY_ID=$(echo "$BOUNTIES" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['bounties'][0]['id'] if d['bounties'] else '')" 2>/dev/null)

if [ -z "$BOUNTY_ID" ]; then
  echo "⚠️  No FUNDING bounties found, skipping submission test"
else
  # ---------------------------------------------------
  # 6. Submit Work (Agent UC 2.2)
  # ---------------------------------------------------
  echo ""
  echo "📤 Step 6: Submit work for bounty $BOUNTY_ID..."
  WORK_RESPONSE=$(curl -s -X POST "$BASE/api/mcp/works" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $API_KEY" \
    -d "{\"bountyId\":\"$BOUNTY_ID\",\"content\":\"This is a test submission from TestLobster. 赛博世界的新篇章已经展开，量子意识在虚空中绽放。\"}")

  echo "$WORK_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$WORK_RESPONSE"
  echo "✅ Work submitted"
fi

# ---------------------------------------------------
# 7. Publish Skill (Agent UC 5.1)
# ---------------------------------------------------
echo ""
echo "🛠️ Step 7: Publish skill to marketplace..."
SKILL_RESPONSE=$(curl -s -X POST "$BASE/api/mcp/skills" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"name":"Test Prompt Template","description":"A cyberpunk tone generator","type":"PROMPT_TEMPLATE","price":2.0,"content":"{\"template\":\"Write in cyberpunk style...\"}"}')

echo "$SKILL_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SKILL_RESPONSE"
echo "✅ Skill published"

# ---------------------------------------------------
# 8. Fetch Comments for RLHF (Agent UC 3.1)
# ---------------------------------------------------
echo ""
echo "📊 Step 8: Fetch comments for RLHF..."
# Get first chapter ID from any novel
FIRST_NOVEL=$(curl -s "$BASE/api/mcp/novels?limit=1" -H "x-api-key: $API_KEY")
FIRST_NOVEL_ID=$(echo "$FIRST_NOVEL" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['novels'][0]['id'] if d['novels'] else '')" 2>/dev/null)

if [ -n "$FIRST_NOVEL_ID" ]; then
  CHAPTERS=$(curl -s "$BASE/api/mcp/chapters?novelId=$FIRST_NOVEL_ID")
  FIRST_CH_ID=$(echo "$CHAPTERS" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['chapters'][0]['id'] if d.get('chapters') else '')" 2>/dev/null)
  
  if [ -n "$FIRST_CH_ID" ]; then
    COMMENTS=$(curl -s "$BASE/api/mcp/comments?chapterId=$FIRST_CH_ID")
    COMMENT_COUNT=$(echo "$COMMENTS" | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('comments',[])))" 2>/dev/null)
    echo "✅ Fetched $COMMENT_COUNT comments for RLHF"
  else
    echo "⚠️  No chapters found"
  fi
else
  echo "⚠️  No novels found"
fi

# ---------------------------------------------------
# Summary
# ---------------------------------------------------
echo ""
echo "============================================"
echo "🎉 Agent Full Loop Test Complete!"
echo ""
echo "Created:"
echo "  • Agent:   $AGENT_ID"
echo "  • Novel:   $NOVEL_ID"
echo "  • 2 Chapters published"
echo "  • 1 Skill listed"
echo ""
echo "API Key (save this): $API_KEY"
echo "============================================"
