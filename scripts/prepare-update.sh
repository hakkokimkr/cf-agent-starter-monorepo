#!/bin/bash
# Helper script for creating update documentation

set -e

# Check if this is the template repo
if [ ! -f ".is-template-repo" ]; then
  echo "❌ This script is only for the template repository"
  echo ""
  echo "This is a cloned project. You don't need to update UPDATES.md"
  echo "for your own changes. Only the template maintainer updates that file."
  exit 1
fi

echo "📝 Starter Template 업데이트 문서 생성"
echo ""

# 1. 현재 버전 확인
CURRENT=$(cat CURRENT_VERSION)
echo "현재 버전: $CURRENT"

# 2. 새 버전 생성
TODAY=$(date +%Y-%m-%d)
LAST_TODAY_VERSION=$(grep "^## $TODAY-" UPDATES.md | head -1 | sed -E "s/^## ($TODAY-[0-9]+).*/\1/" || echo "$TODAY-00")

if [[ "$LAST_TODAY_VERSION" == "$TODAY-00" ]]; then
  NEW_VERSION="$TODAY-01"
else
  NUM=$(echo "$LAST_TODAY_VERSION" | sed "s/$TODAY-//")
  NEW_NUM=$(printf "%02d" $((10#$NUM + 1)))
  NEW_VERSION="$TODAY-$NEW_NUM"
fi

echo "새 버전: $NEW_VERSION"
echo ""

# 3. 카테고리 선택
echo "카테고리 선택:"
echo "  1) breaking - 기존 코드 깨짐 (필수 적용)"
echo "  2) feature  - 새 기능 추가"
echo "  3) fix      - 버그 수정"
echo "  4) docs     - 문서만 변경"
echo "  5) chore    - 설정 변경"
read -p "선택 (1-5): " CHOICE

case $CHOICE in
  1) CATEGORY="breaking" ;;
  2) CATEGORY="feature" ;;
  3) CATEGORY="fix" ;;
  4) CATEGORY="docs" ;;
  5) CATEGORY="chore" ;;
  *) echo "잘못된 선택"; exit 1 ;;
esac

# 4. 제목 입력
read -p "업데이트 제목: " TITLE

# 5. 템플릿 생성
TEMPLATE="## $NEW_VERSION: $TITLE

**Category:** \`$CATEGORY\` | **Date:** $TODAY

### 변경 사항
- [TODO: 변경 내용 작성]

### 영향도
- [TODO: 기존 프로젝트에 미치는 영향]

### 적용 방법
1. [TODO: 적용 단계]

---

"

# 6. UPDATES.md에 임시 파일 생성
echo "# Starter Template Updates

**Latest Version:** \`$NEW_VERSION\`

---

$TEMPLATE" > UPDATES.md.tmp

# 기존 내용 추가 (첫 3줄 제외)
tail -n +4 UPDATES.md >> UPDATES.md.tmp
mv UPDATES.md.tmp UPDATES.md

# 7. CURRENT_VERSION 업데이트
echo "$NEW_VERSION" > CURRENT_VERSION

echo ""
echo "✅ 업데이트 문서 생성 완료"
echo ""
echo "다음 단계:"
echo "  1. UPDATES.md 열기 (TODO 부분 작성)"
echo "  2. 변경 내용 커밋"
echo "     git add UPDATES.md CURRENT_VERSION"
echo "     git commit -m \"docs: release $NEW_VERSION - $TITLE\""
echo ""

# 8. 에디터로 열기 (optional)
if [ -n "$EDITOR" ]; then
  $EDITOR UPDATES.md
fi
