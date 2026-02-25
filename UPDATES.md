# Starter Template Updates

**Latest Version:** `2026-02-25-01`

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
