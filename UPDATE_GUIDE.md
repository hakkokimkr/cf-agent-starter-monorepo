# Starter Template 업데이트 가이드

이 문서는 AI 에이전트가 starter template의 업데이트를 확인하고 적용하는 방법을 설명합니다.

## 📋 체크 절차

### 1. 업데이트 확인

```bash
# 현재 버전 확인 (클론된 레포)
cat CURRENT_VERSION.json | jq -r '.version'
# 출력 예: 2026-01-15-02

# 최신 버전 확인 (starter repo)
curl -s https://raw.githubusercontent.com/hakkokimkr/cf-agent-starter-monorepo/main/CURRENT_VERSION
# 출력 예: 2026-02-25-01

# 업데이트 필요 여부 판단
CURRENT=$(cat CURRENT_VERSION.json 2>/dev/null | jq -r '.version' 2>/dev/null || echo "none")
LATEST=$(curl -s https://raw.githubusercontent.com/hakkokimkr/cf-agent-starter-monorepo/main/CURRENT_VERSION)

if [[ "$CURRENT" != "$LATEST" ]]; then
  echo "🔔 업데이트 가능: $CURRENT → $LATEST"
else
  echo "✅ 최신 버전 사용 중"
fi
```

### 2. 변경 내역 확인

```bash
# UPDATES.md 다운로드 및 확인
curl -s https://raw.githubusercontent.com/hakkokimkr/cf-agent-starter-monorepo/main/UPDATES.md

# 또는 브라우저에서 확인
# https://github.com/hakkokimkr/cf-agent-starter-monorepo/blob/main/UPDATES.md
```

### 3. 적용 판단

현재 버전 이후의 모든 업데이트 항목을 확인하고 카테고리별로 판단:

| 카테고리 | 적용 우선순위 | 설명 |
|---------|--------------|------|
| `breaking` | 🔴 **필수** | 기존 코드가 동작하지 않을 수 있음. 즉시 적용 필요 |
| `feature` | 🟡 **선택** | 새로운 기능 추가. 필요 시 적용 |
| `fix` | 🟢 **권장** | 버그 수정. 가능하면 적용 |
| `docs` | ⚪ **참고** | 문서만 변경. 적용 불필요 |
| `chore` | 🟡 **선택** | 설정 변경. 필요 시 적용 |

### 4. 적용 방법

각 업데이트 항목의 "적용 방법" 섹션을 따라 진행:

1. 해당 파일 열기
2. Before/After 비교
3. 변경 적용
4. 테스트 실행
5. 커밋

### 5. 버전 업데이트

적용 완료 후 `CURRENT_VERSION.json` 업데이트:

```bash
# 새 버전으로 업데이트
NEW_VERSION="2026-02-25-01"  # UPDATES.md에서 확인한 최신 버전
jq --arg v "$NEW_VERSION" --arg t "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  '.version = $v | .updated_at = $t | .notes = "Applied updates up to " + $v' \
  CURRENT_VERSION.json > tmp.json && mv tmp.json CURRENT_VERSION.json

# Git 커밋
git add CURRENT_VERSION.json
git commit -m "chore: update starter template to $NEW_VERSION"
```

## 🤖 에이전트 자동화

### 주기적 체크 (권장: 주 1회 또는 작업 시작 전)

```bash
#!/bin/bash
# scripts/check-starter-updates.sh

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
  echo "   다음 명령으로 생성하세요:"
  echo "   echo '{\"version\":\"$LATEST\",\"updated_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"notes\":\"Initial version\"}' | jq . > CURRENT_VERSION.json"
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
  exit 1
else
  echo "✅ 최신 버전 사용 중"
  exit 0
fi
```

### AGENTS.md 통합

클론된 레포의 `AGENTS.md`에 다음 섹션 추가:

```markdown
## Starter Template 업데이트

이 프로젝트는 [cf-starter-template](https://github.com/hakkokimkr/cf-agent-starter-monorepo)을 기반으로 합니다.

### 업데이트 체크 (권장: 주 1회)

\```bash
bash scripts/check-starter-updates.sh
\```

또는 수동 확인:

1. **현재 버전:** `cat CURRENT_VERSION.json`
2. **최신 버전:** https://github.com/hakkokimkr/cf-agent-starter-monorepo/blob/main/CURRENT_VERSION
3. **변경 내역:** https://github.com/hakkokimkr/cf-agent-starter-monorepo/blob/main/UPDATES.md
4. **적용 가이드:** https://github.com/hakkokimkr/cf-agent-starter-monorepo/blob/main/UPDATE_GUIDE.md

### 적용 우선순위

- 🔴 `breaking`: 즉시 적용 필요
- 🟢 `fix`: 가능하면 적용
- 🟡 `feature/chore`: 선택적 적용
```

## 📝 버전 넘버링 규칙

- **포맷:** `YYYY-MM-DD-NN`
- **예시:** `2026-02-25-01`
  - `YYYY-MM-DD`: 날짜
  - `NN`: 당일 N번째 업데이트 (01부터 시작)

## 🔄 업데이트 추가 (Maintainer용)

Starter template에 변경 사항 발생 시:

1. **버전 결정:**
   ```bash
   # 오늘 날짜 + 순번
   VERSION=$(date +%Y-%m-%d)-01  # 당일 첫 업데이트
   ```

2. **UPDATES.md 업데이트:**
   - 파일 상단에 새 섹션 추가
   - 카테고리, 변경 사항, 영향도, 적용 방법 작성

3. **CURRENT_VERSION 업데이트:**
   ```bash
   echo "$VERSION" > CURRENT_VERSION
   ```

4. **커밋 & 푸시:**
   ```bash
   git add UPDATES.md CURRENT_VERSION
   git commit -m "docs: release $VERSION"
   git push
   ```

## ❓ FAQ

**Q: CURRENT_VERSION.json이 없으면?**
A: 처음 클론한 경우. 현재 최신 버전으로 생성:
```bash
LATEST=$(curl -s https://raw.githubusercontent.com/hakkokimkr/cf-agent-starter-monorepo/main/CURRENT_VERSION)
echo "{\"version\":\"$LATEST\",\"updated_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"notes\":\"Initial version\"}" | jq . > CURRENT_VERSION.json
```

**Q: Breaking 변경을 건너뛰면?**
A: 권장하지 않음. 배포 실패나 런타임 에러 발생 가능.

**Q: 여러 버전을 한 번에 적용?**
A: 가능. UPDATES.md에서 현재 버전 이후 모든 항목을 순서대로 적용.

**Q: 자동 적용 스크립트는?**
A: Breaking 변경은 수동 검토 필수. 자동화는 권장하지 않음.

## 📚 참고

- [UPDATES.md](https://github.com/hakkokimkr/cf-agent-starter-monorepo/blob/main/UPDATES.md) - 모든 변경 내역
- [CURRENT_VERSION](https://github.com/hakkokimkr/cf-agent-starter-monorepo/blob/main/CURRENT_VERSION) - 최신 버전
- [GitHub Issues](https://github.com/hakkokimkr/cf-agent-starter-monorepo/issues) - 버그 리포트, 제안
