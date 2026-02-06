# Completing Branches

Detailed workflows for integrating finished GitButler virtual branches into main.

For the preferred CLI workflow, see the main skill guide. This reference covers alternative integration paths, error recovery, and cleanup procedures.

## Direct Merge to Main

When you want to merge locally without a PR:

```bash
# 1. Verify branch state
but status
but show feature-auth

# 2. Create snapshot
but oplog snapshot --message "Before integrating feature-auth"

# 3. Switch to main
git checkout main

# 4. Update main
git pull origin main

# 5. Merge with --no-ff (preserves history)
git merge --no-ff refs/gitbutler/feature-auth -m "feat: add user authentication"

# 6. Push
git push origin main

# 7. Clean up
but branch delete feature-auth
git checkout gitbutler/workspace
```

## Manual Pull Request Workflow

When `but pr new` isn't available or you need more control:

```bash
# 1. Push branch to remote
git push origin refs/gitbutler/feature-auth:refs/heads/feature-auth

# 2. Create PR
gh pr create --base main --head feature-auth \
  --title "feat: add user authentication" \
  --body "Description..."

# 3. Wait for review and approval

# 4. Merge PR (via GitHub UI or CLI)
gh pr merge feature-auth --squash

# 5. Update main and clean up
git checkout main
git pull origin main
but branch delete feature-auth
git checkout gitbutler/workspace
```

## Stacked Branches (Bottom-Up)

Must merge in order: base → dependent → final.

```bash
# 1. Merge base branch first
git checkout main && git pull
git merge --no-ff refs/gitbutler/feature-base -m "feat: base feature"
git push origin main
but branch delete feature-base
git checkout gitbutler/workspace

# 2. Update remaining branches
but pull

# 3. Merge next level
git checkout main && git pull
git merge --no-ff refs/gitbutler/feature-api -m "feat: API feature"
git push origin main
but branch delete feature-api
git checkout gitbutler/workspace

# 4. Repeat for remaining stack levels
```

## Error Recovery

### Merge Conflicts

```bash
# View conflicted files
git status

# Resolve conflicts manually

# Stage resolved files
git add src/auth.ts

# Complete merge
git commit

# Verify and push
git push origin main

# Clean up
but branch delete feature-auth
git checkout gitbutler/workspace
```

### Push Rejected (Main Moved Ahead)

```bash
git pull origin main
# Resolve any conflicts if main diverged
git push origin main
```

### Undo Integration (Not Pushed Yet)

```bash
git reset --hard HEAD~1
git checkout gitbutler/workspace
```

### Undo Integration (Already Pushed)

```bash
git revert -m 1 HEAD
git push origin main
```

## Post-Integration Cleanup

```bash
# Delete integrated virtual branch
but branch delete feature-auth

# Clean up remote branch (if created for PR)
git push origin --delete feature-auth

# Verify workspace is clean
but status  # Should show remaining active branches only
```
