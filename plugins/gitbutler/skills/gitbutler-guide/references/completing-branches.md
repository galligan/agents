# Completing Branches

Detailed workflows for integrating finished GitButler virtual branches into main.

For the preferred CLI workflow, see the main skill guide. This reference covers alternative integration paths, error recovery, and cleanup procedures.

## Direct Merge to Main

When you want to merge locally without a PR:

```bash
# 1. Verify branch state
but status --json
but show feature-auth --json

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

Must merge in order: base → dependent → final. **One at a time, waiting between each.**

### Squash Merge via PRs (Most Common)

Most GitHub repos enforce squash merges. This rewrites each branch into a single commit, which invalidates the base branch for the next PR in the stack. You **must** wait, pull, and push between each merge.

```bash
# 1. Merge bottom PR
gh pr merge <bottom-pr-number> --squash --delete-branch

# 2. CRITICAL: Wait for main to update, then rebase remaining stack
but pull     # Rebases remaining branches onto the new squashed commit
but push     # Updates remote branches so GitHub sees them as mergeable

# 3. Verify the next PR is mergeable
gh pr view <next-pr-number> --json mergeable --jq '.mergeable'
# Should be "MERGEABLE" — if "UNKNOWN", wait a moment and retry

# 4. Merge next PR
gh pr merge <next-pr-number> --squash --delete-branch

# 5. Repeat steps 2-4 for each remaining stack level

# 6. Final cleanup
but pull
but unapply <last-branch>  # Or but branch delete if possible
```

**What goes wrong if you skip the wait:**

| Step skipped | Consequence |
|-------------|-------------|
| `but pull` after merge | Next PR's base branch diverges from main — GitHub marks it "CONFLICTING" |
| `but push` after pull | Remote branches still point at old commits — GitHub can't merge cleanly |
| Both | GitHub auto-closes the next PR when the base branch is deleted. **Cannot reopen** — must recreate with `gh pr create --base main` |

### Direct Merge (No Squash)

When merge commits are allowed, history isn't rewritten and stacks are simpler:

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
but status --json  # Should show remaining active branches only
```
