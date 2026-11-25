#!/bin/sh
set -e

echo "[Shopee Simulator] Checking database connectivity..."
npx prisma generate

echo "[Shopee Simulator] Starting Shopee Open API v2 Simulator Server..."
exec "$@"
