# Contributing to CF Agent Starter Monorepo

## For Template Maintainers

This guide is for maintainers of the **official starter template** repository.

### ⚠️ Important: Template Repository Only

The workflows and checks described here **only apply to the template repository** (`hakkokimkr/cf-agent-starter-monorepo`).

Cloned projects do NOT need to follow these rules for their own code changes.

---

## Making Changes to the Template

### ✅ Required Steps

When you modify code in `apps/`, `packages/`, or `tooling/`:

1. **Make your code changes**

2. **Document the update** (REQUIRED):
   ```bash
   # Use helper script (recommended)
   ./scripts/prepare-update.sh
   
   # Or manually:
   # 1. Add new section at top of UPDATES.md
   # 2. Update CURRENT_VERSION with new version (YYYY-MM-DD-NN)
   ```

3. **Fill in update documentation:**
   - Category: `breaking`, `feature`, `fix`, `docs`, or `chore`
   - Changes: What changed
   - Impact: Effect on cloned projects
   - Migration guide: Step-by-step if breaking

4. **Commit together:**
   ```bash
   git add UPDATES.md CURRENT_VERSION [your-changes]
   git commit -m "feat: your feature + update docs"
   ```

### 📝 Update Documentation Format

```markdown
## 2026-MM-DD-NN: Short Title

**Category:** `breaking|feature|fix|docs|chore` | **Date:** 2026-MM-DD

### 변경 사항
- What changed in this update

### 영향도
- Impact on existing cloned projects
- Who needs to apply this update

### 마이그레이션 가이드 (for breaking changes)
**Before:**
\```language
old code
\```

**After:**
\```language
new code
\```

### 적용 방법
1. Step-by-step instructions
2. Commands to run
3. How to verify
```

### 🔒 Automated Checks

**Git Hooks** (install with `./scripts/install-hooks.sh`):
- Pre-push: Validates that UPDATES.md and CURRENT_VERSION are updated

**GitHub Actions**:
- Runs on every PR/push
- Fails if code changes lack update documentation
- Only runs if `.is-template-repo` file exists

**Bypass** (not recommended):
```bash
git push --no-verify  # Skip pre-push hook
```

---

## Version Numbering

**Format:** `YYYY-MM-DD-NN`

- `YYYY-MM-DD`: Date of the update
- `NN`: Sequential number for updates on the same day (01, 02, 03...)

**Examples:**
- `2026-02-25-01`: First update on Feb 25, 2026
- `2026-02-25-02`: Second update on the same day

---

## Categories

| Category | Priority | Description | Example |
|----------|----------|-------------|---------|
| `breaking` | 🔴 Required | Changes that break existing code | API signature changes, config format changes |
| `feature` | 🟡 Optional | New functionality | New components, utilities |
| `fix` | 🟢 Recommended | Bug fixes | Security patches, error handling |
| `docs` | ⚪ Info | Documentation only | README updates, comments |
| `chore` | 🟡 Optional | Configuration/tooling | Build config, linter rules |

---

## Setup for Maintainers

### Install Git Hooks

```bash
./scripts/install-hooks.sh
```

This installs a pre-push hook that validates update documentation.

### Helper Scripts

```bash
# Prepare update documentation (interactive)
./scripts/prepare-update.sh

# Check for pending updates (for cloned projects)
./scripts/check-starter-updates.sh
```

---

## For Cloned Project Users

**You do NOT need to:**
- Update UPDATES.md for your own changes
- Bump CURRENT_VERSION for your features
- Follow these contribution guidelines

**You SHOULD:**
- Regularly check for template updates: `./scripts/check-starter-updates.sh`
- Apply breaking changes from the template
- Keep CURRENT_VERSION.json updated after applying template updates

See [UPDATE_GUIDE.md](./UPDATE_GUIDE.md) for details.

---

## Questions?

- **Template updates:** Open an issue on GitHub
- **Using the template:** See [README.md](./README.md) and [AGENTS.md](./AGENTS.md)
- **Version tracking:** See [UPDATE_GUIDE.md](./UPDATE_GUIDE.md)
