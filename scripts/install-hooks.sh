#!/bin/bash
# Install git hooks for template repository

set -e

# Check if this is the template repo
if [ ! -f ".is-template-repo" ]; then
  echo "ℹ️  This is not the template repository."
  echo "   Git hooks are only for the official starter template."
  echo "   Skipping hook installation."
  exit 0
fi

echo "📦 Installing git hooks for template repository..."

# Create pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash
# Pre-push hook: Check if UPDATES.md and CURRENT_VERSION are updated

# Check if this is the template repo
if [ ! -f ".is-template-repo" ]; then
  exit 0
fi

# Get the range of commits being pushed
while read local_ref local_sha remote_ref remote_sha; do
  if [ "$local_sha" = "0000000000000000000000000000000000000000" ]; then
    # Branch deletion, skip
    continue
  fi
  
  if [ "$remote_sha" = "0000000000000000000000000000000000000000" ]; then
    # New branch, check all commits
    RANGE="$local_sha"
  else
    # Existing branch, check new commits
    RANGE="$remote_sha..$local_sha"
  fi
  
  # Get changed files in the range
  CHANGED_FILES=$(git diff --name-only $RANGE)
  
  # Check if code was changed
  if echo "$CHANGED_FILES" | grep -qE '^(apps|packages|tooling)/'; then
    echo "✅ Code changes detected"
    
    # Check UPDATES.md
    if ! echo "$CHANGED_FILES" | grep -q "^UPDATES.md$"; then
      echo ""
      echo "❌ Code changes detected but UPDATES.md was not updated"
      echo ""
      echo "📝 Please update UPDATES.md with your changes:"
      echo "   1. Run: ./scripts/prepare-update.sh"
      echo "   2. Fill in the TODO sections"
      echo "   3. Commit: git add UPDATES.md CURRENT_VERSION && git commit --amend"
      echo ""
      echo "💡 To bypass this check (not recommended):"
      echo "   git push --no-verify"
      exit 1
    fi
    
    # Check CURRENT_VERSION
    if ! echo "$CHANGED_FILES" | grep -q "^CURRENT_VERSION$"; then
      echo ""
      echo "❌ UPDATES.md was updated but CURRENT_VERSION was not"
      echo ""
      echo "📝 Please update CURRENT_VERSION:"
      echo "   echo '2026-MM-DD-NN' > CURRENT_VERSION"
      echo "   git add CURRENT_VERSION && git commit --amend"
      exit 1
    fi
    
    echo "✅ Update documentation is present"
  fi
done

exit 0
EOF

chmod +x .git/hooks/pre-push

echo "✅ Git hooks installed"
echo ""
echo "🎣 Installed hooks:"
echo "   - pre-push: Validates UPDATES.md and CURRENT_VERSION on push"
echo ""
echo "💡 These hooks only run in the template repository (.is-template-repo present)"
