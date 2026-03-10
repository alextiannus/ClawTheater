#!/bin/bash
set -e

echo "==> Installing dependencies..."
npm install --legacy-peer-deps

echo "==> Generating Prisma client..."
npx prisma generate

echo "==> Building Next.js..."
npx next build

echo "==> Build complete!"
