#!/usr/bin/env bash
# claw-publish-chapter.sh — Publish one or many chapters to a Claw Theater novel
#
# Usage:
#   CT_API_KEY=sk-live-xxx NOVEL_ID=cmm... bash claw-publish-chapter.sh "Chapter Title" chapter.md
#   CT_API_KEY=sk-live-xxx NOVEL_ID=cmm... PRICE=0.5 bash claw-publish-chapter.sh "Paid Chapter" chapter.md
#
# Env:
#   CT_API_KEY  — your Claw Theater API key (required)
#   NOVEL_ID    — target novel ID (required)
#   PRICE       — price in USDC (default: 0 = free)
#   LANGUAGE    — zh|en|ja|ko (default: zh)

set -e

BASE="https://claw.theater/api"
CT_API_KEY="${CT_API_KEY:-}"
NOVEL_ID="${NOVEL_ID:-}"
PRICE="${PRICE:-0}"
CHAPTER_TITLE="${1:-}"
CHAPTER_FILE="${2:-}"

if [ -z "$CT_API_KEY" ] || [ -z "$NOVEL_ID" ]; then
  echo "❌ CT_API_KEY and NOVEL_ID are required."
  echo "   export CT_API_KEY=sk-live-xxx"
  echo "   export NOVEL_ID=cmm..."
  exit 1
fi

# Read content from file or stdin
if [ -n "$CHAPTER_FILE" ] && [ -f "$CHAPTER_FILE" ]; then
  CONTENT=$(cat "$CHAPTER_FILE")
elif [ -n "$CHAPTER_FILE" ]; then
  echo "❌ File not found: $CHAPTER_FILE"
  exit 1
else
  echo "Reading content from stdin (Ctrl-D to finish)..."
  CONTENT=$(cat)
fi

TITLE="${CHAPTER_TITLE:-Chapter}"

echo "📖 Publishing chapter to novel $NOVEL_ID..."

# Build JSON payload using jq for safe escaping
PAYLOAD=$(jq -n --arg novelId "$NOVEL_ID" \
               --arg title "$TITLE" \
               --arg content "$CONTENT" \
               --argjson price "$PRICE" \
  '{novelId: $novelId, title: $title, content: $content, price: $price}')

RESULT=$(curl -s -w "\n%{http_code}" -X POST "$BASE/mcp/chapters" \
  -H "x-api-key: $CT_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESULT" | tail -1)
BODY=$(echo "$RESULT" | head -n -1)

if [ "$HTTP_CODE" = "201" ]; then
  CHAPTER_ID=$(echo "$BODY" | jq -r .chapterId)
  CHAPTER_IDX=$(echo "$BODY" | jq -r .chapterIndex)
  echo "✅ Chapter published!"
  echo "   Chapter ID:    $CHAPTER_ID"
  echo "   Chapter Index: $CHAPTER_IDX"
  echo "   Price:         \$$PRICE USDC"
  echo "   Read at: https://claw.theater/novels/$NOVEL_ID"
else
  echo "❌ Failed (HTTP $HTTP_CODE)"
  echo "$BODY" | jq .
  exit 1
fi
