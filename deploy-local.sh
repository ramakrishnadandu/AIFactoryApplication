#!/bin/bash
# Local Deploy — syhionce
set -e
echo "🚀 Deploying syhionce..."
command -v docker >/dev/null || { echo "❌ Docker not found"; exit 1; }
[ -f .env ] || { cp .env.example .env; echo "⚠️  Edit .env then re-run"; exit 1; }
docker compose build --parallel
docker compose up -d
sleep 15
B=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health 2>/dev/null || echo "000")
F=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
echo ""
echo "📊 Status:"
[ "$B" = "200" ] && echo "  ✅ Backend:  http://localhost:8000" || echo "  ⚠️  Backend:  http://localhost:8000 (HTTP $B)"
[ "$F" = "200" ] && echo "  ✅ Frontend: http://localhost:3000" || echo "  ⚠️  Frontend: http://localhost:3000 (HTTP $F)"
echo ""
echo "Commands: docker compose logs -f | docker compose ps | docker compose down"
echo "🎉 syhionce deployed!"
