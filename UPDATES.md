# Starter Template Updates

**Latest Version:** `2026-02-25-04`

---

## 2026-02-25-04: Update Wrangler to v4.68.1

**Category:** `chore` | **Date:** 2026-02-25

### 변경 사항
- Wrangler 업데이트: `^3.36.0` → `^4.68.1`
- Cloudflare Workers CLI 최신 기능 및 성능 개선 적용

### 영향도
- ⚠️ **Major version bump**: v3 → v4
- 대부분의 기능은 하위 호환 유지
- 새로운 기능 및 버그 수정 포함

### 적용 방법

1. **package.json 업데이트:**
   ```bash
   # apps/api/package.json
   # "wrangler": "^3.36.0" → "wrangler": "^4.68.1"
   ```

2. **의존성 재설치:**
   ```bash
   pnpm install
   ```

3. **검증:**
   ```bash
   pnpm --filter @repo/api dev
   # Dev server 정상 작동 확인
   ```

### 참고
- [Wrangler v4 Changelog](https://github.com/cloudflare/workers-sdk/releases)
- 기존 v3 설정 대부분 호환

---



---

## 2026-02-25-03: Add TestFeature type

**Category:** `feature` | **Date:** 2026-02-25

### 변경 사항
- `packages/shared-types`에 `TestFeature` 인터페이스 추가
- 테스트용 타입 정의

### 영향도
- ℹ️ **Non-breaking**: 새로운 타입 추가로 기존 코드 영향 없음
- 선택적으로 사용 가능

### 적용 방법
필요 시 import하여 사용:
```typescript
import { TestFeature } from '@repo/shared-types';
```

---



---

## 2026-02-25-02: Cloudflare Workers Cron 정의 방식 변경

**Category:** `breaking` | **Date:** 2026-02-25

### 변경 사항
- Wrangler v3에서 cron 정의 방식 변경
- `triggers.crons` → `[[schedules]]` 섹션으로 이동
- 더 명확한 cron 설정 구조

### 영향도
- ⚠️ **Breaking**: 기존 `triggers.crons` 설정은 Wrangler v3에서 동작하지 않음
- 모든 cron 사용 프로젝트는 필수 업데이트

### 마이그레이션 가이드

**Before (Old):**
```toml
# apps/api/wrangler.toml
[triggers]
crons = ["0 */6 * * *", "0 0 * * *"]
```

**After (New):**
```toml
# apps/api/wrangler.toml
[[schedules]]
cron = "0 */6 * * *"

[[schedules]]
cron = "0 0 * * *"
```

### 적용 방법

1. **파일 열기:**
   ```bash
   # API Worker의 wrangler.toml
   open apps/api/wrangler.toml
   ```

2. **변경 적용:**
   - `[triggers]` 섹션 찾기
   - `crons = [...]` 배열을 `[[schedules]]` 섹션들로 변환
   - 각 cron 표현식마다 별도의 `[[schedules]]` 블록 생성

3. **검증:**
   ```bash
   # Wrangler 설정 검증
   pnpm --filter @repo/api wrangler deploy --dry-run
   ```

4. **배포:**
   ```bash
   pnpm --filter @repo/api deploy
   ```

### 참고
- [Wrangler v3 Migration Guide](https://developers.cloudflare.com/workers/wrangler/migration/v3/)
- Cron이 없는 프로젝트는 영향 없음

---

## 2026-02-25-01: Initial Version Tracking

**Category:** `docs` | **Date:** 2026-02-25

### 변경 사항
- 버전 추적 시스템 도입
- `UPDATES.md`, `CURRENT_VERSION`, `UPDATE_GUIDE.md` 추가
- 클론된 레포에서 업데이트 확인 가능

### 영향도
- ℹ️ **Non-breaking**: 기존 코드 영향 없음
- 신규 클론 시 `CURRENT_VERSION.json` 생성 권장

### 적용 방법
클론된 레포에 `CURRENT_VERSION.json` 생성:
```json
{
  "version": "2026-02-25-01",
  "updated_at": "2026-02-25T01:00:00Z",
  "notes": "Initial version tracking"
}
```

### 사용 방법
- [UPDATE_GUIDE.md](./UPDATE_GUIDE.md) 참고
- 에이전트는 주기적으로 최신 버전 확인

---

## 향후 업데이트 포맷

각 업데이트는 다음 형식을 따릅니다:

```markdown
## YYYY-MM-DD-NN: 업데이트 제목

**Category:** `breaking|feature|fix|docs|chore` | **Date:** YYYY-MM-DD

### 변경 사항
- 변경된 내용 요약

### 영향도
- 기존 코드에 미치는 영향

### 마이그레이션 가이드 (breaking만)
Before/After 코드 예시

### 적용 방법
단계별 적용 가이드
```

---

**업데이트 추가 시:** 이 파일 상단에 새 섹션 추가 (최신순 정렬)
