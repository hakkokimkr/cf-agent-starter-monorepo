#!/bin/bash
# Starter template 업데이트 체크 스크립트

set -e

REPO_URL="https://raw.githubusercontent.com/hakkokimkr/cf-agent-starter-monorepo/main"
CURRENT=$(cat CURRENT_VERSION.json 2>/dev/null | jq -r '.version' 2>/dev/null || echo "none")
LATEST=$(curl -s "$REPO_URL/CURRENT_VERSION")

echo "📦 Starter Template 업데이트 체크"
echo "   현재 버전: $CURRENT"
echo "   최신 버전: $LATEST"
echo ""

if [[ "$CURRENT" == "none" ]]; then
  echo "⚠️  CURRENT_VERSION.json 파일이 없습니다."
  echo ""
  echo "   다음 명령으로 생성하세요:"
  echo "   echo '{\"version\":\"$LATEST\",\"updated_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"notes\":\"Initial version\"}' | jq . > CURRENT_VERSION.json"
  echo ""
  exit 1
elif [[ "$CURRENT" != "$LATEST" ]]; then
  echo "🔔 업데이트 가능!"
  echo ""
  echo "📄 변경 내역 확인:"
  echo "   https://github.com/hakkokimkr/cf-agent-starter-monorepo/blob/main/UPDATES.md"
  echo ""
  echo "📖 적용 가이드:"
  echo "   https://github.com/hakkokimkr/cf-agent-starter-monorepo/blob/main/UPDATE_GUIDE.md"
  echo ""
  echo "💡 적용 후 버전 업데이트:"
  echo "   jq --arg v \"$LATEST\" --arg t \"\$(date -u +%Y-%m-%dT%H:%M:%SZ)\" \\"
  echo "     '.version = \$v | .updated_at = \$t | .notes = \"Applied updates up to \" + \$v' \\"
  echo "     CURRENT_VERSION.json > tmp.json && mv tmp.json CURRENT_VERSION.json"
  echo ""
  exit 1
else
  echo "✅ 최신 버전 사용 중"
  exit 0
fi
