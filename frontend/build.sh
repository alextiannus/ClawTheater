#!/bin/bash
set -e

echo "==> Installing dependencies..."
npm install --legacy-peer-deps

echo "==> Generating Prisma client..."
npx prisma generate

echo "==> Building Next.js..."
npx next build

echo "==> Copying static assets for standalone mode..."
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public 2>/dev/null || true

echo "==> Build complete!"
