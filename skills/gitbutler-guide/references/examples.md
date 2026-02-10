# GitButler Examples

Real-world patterns and workflows for virtual branches, multi-agent collaboration, and post-hoc organization.

---

## Basic Workflows

### First Virtual Branch

```bash
# Initialize (one time)
cd /path/to/repo
but setup

# Check state
but status --json
# ● 0c60c71 (common base) [origin/main]

# Create branch
but branch new feature-user-auth

# Make changes
echo "export function authenticate()" > src/auth.ts
echo "test('authenticates user')" > src/auth.test.ts

# Check status for CLI IDs
but status --json
# ╭┄00 [Unassigned Changes]
# │   m6 A src/auth.ts
# │   p9 A src/auth.test.ts

# Commit specific files by ID (no staging needed)
but commit feature-user-auth -m "feat: add user authentication" -p m6,p9
```

### Context Switching (No Checkout!)

```bash
# Working on feature when bug reported
but branch new feature-dashboard
echo "Dashboard code" > dashboard.ts

# Bug reported - switch context immediately (no checkout!)
but branch new bugfix-login-timeout
echo "Fix timeout" > login.ts

# Both exist in same workspace
but status --json
# m6 A dashboard.ts
# p9 A login.ts

# Commit bugfix first (urgent) — specify which file
but commit bugfix-login-timeout -m "fix: resolve login timeout" -p p9

# Continue feature work
but commit feature-dashboard -m "feat: add dashboard" -p m6
```

---

## Reorganizing Work

### Moving Commits Between Branches

```bash
# Oops, committed to wrong branch!
but status --json
# Shows def5678 "feat: add new feature" on bugfix-branch

# Create correct branch
but branch new feature-new-capability

# Move the commit
but rub def5678 feature-new-capability

# Commit moved!
but status --json
```

### Squashing Commits

```bash
# Too many small commits on feature-branch
# Squash using explicit command
but squash feature-branch
```

### Post-Hoc File Assignment

```bash
# Made changes without branches
echo "Auth code" > auth.ts
echo "API code" > api.ts
echo "Docs" > README.md

but status --json
# m6 A auth.ts
# p9 A api.ts
# i3 A README.md

# Create branches and organize using stage
but branch new feature-auth
but branch new feature-api
but branch new docs-update

but stage m6 feature-auth
but stage p9 feature-api
but stage i3 docs-update

# Commit each (--only commits pre-staged files)
but commit feature-auth -o -m "feat: add authentication"
but commit feature-api -o -m "feat: add API endpoints"
but commit docs-update -o -m "docs: update readme"
```

---

## Multi-Agent Patterns

### Parallel Feature Development

```bash
# Agent 1 (Claude)
but branch new claude-feature-auth
echo "Auth implementation" > src/auth.ts
but status --json  # → m6 A src/auth.ts
but commit claude-feature-auth -m "feat: add authentication" -p m6

# Agent 2 (Droid) - simultaneously, same workspace!
but branch new droid-feature-api
echo "API implementation" > src/api.ts
but status --json  # → p9 A src/api.ts
but commit droid-feature-api -m "feat: add API endpoints" -p p9

# Zero conflicts, zero coordination overhead
```

### Sequential Handoffs

```bash
# Agent A: Initial implementation
but branch new feature-user-management
echo "Initial user code" > user.ts
but rub <id> feature-user-management
but commit feature-user-management -m "feat: initial user management"

# Agent A hands off to Agent B
but branch new feature-user-management-tests --anchor feature-user-management

# Agent B: Adds tests
echo "Tests for user management" > user.test.ts
but rub <id> feature-user-management-tests
but commit feature-user-management-tests -m "test: add user management tests"
```

### Cross-Agent Commit Transfer

```bash
# Agent A finishes work
but branch new agent-a-feature
but commit agent-a-feature -m "feat: implementation complete"

# Agent B creates their branch
but branch new agent-b-continuation

# Transfer commit from A to B
but rub abc1234 agent-b-continuation

# Agent B continues
echo "More work" >> feature.ts
but commit agent-b-continuation -m "feat: continue implementation"
```

---

## Stack Management

### Creating a Linear Stack

```bash
# Base refactoring
but branch new refactor-database
echo "Refactor database layer" > db-refactor.ts
but rub <id> refactor-database
but commit refactor-database -m "refactor: restructure database"

# Build on refactoring
but branch new feature-new-model --anchor refactor-database
echo "New data model" > model.ts
but rub <id> feature-new-model
but commit feature-new-model -m "feat: add new data model"

# Add tests on top
but branch new test-new-model --anchor feature-new-model
echo "Model tests" > model.test.ts
but rub <id> test-new-model
but commit test-new-model -m "test: comprehensive model tests"

# Visualize stack
but status --json
```

### Submit Stack as PRs

`but pr new` handles both pushing and PR creation — no separate `but push` needed. Create PRs bottom-to-top so GitButler sets correct base branches from anchors.

```bash
# Using but CLI (preferred) — bottom-to-top
but pr new refactor-database          # PR against main
but pr new feature-new-model          # PR against refactor-database (auto)
but pr new test-new-model             # PR against feature-new-model (auto)
```

```bash
# Alternative: using git + gh directly
git push origin refactor-database
gh pr create --title "refactor: database layer" --base main

git push origin feature-new-model
gh pr create --title "feat: new data model" --base refactor-database

git push origin test-new-model
gh pr create --title "test: model tests" --base feature-new-model
```

---

## Emergency Recovery

### Recover Deleted Branch

```bash
# Oops, deleted wrong branch
but branch delete important-feature --force

# Check oplog
but oplog --json

# Undo deletion
but undo

# Verify recovery
but status --json  # Branch recovered!
```

### Recover from Bad Reorganization

```bash
# Snapshot before risky operations
but oplog snapshot --message "Before reorganizing commits"

# Attempt reorganization
but rub <commit1> <branch1>
but rub <commit2> <branch2>

# Result is a mess - restore to snapshot
snapshot_id=$(but oplog --json | jq -r '.[] | select(.message | contains("Before reorganizing")) | .id')
but oplog restore $snapshot_id

# Back to pre-reorganization state!
```

### Recover from Mixed Git/But Commands

```bash
# Made changes on virtual branch
but branch new my-feature
echo "changes" > file.ts

# Accidentally used git
git add file.ts
git commit -m "oops"  # WRONG!

# Recovery
but pull

# If still broken, reinitialize
but oplog snapshot --message "Before recovery"
but setup
```

---

## New in 0.19.0

### Selective Commit with `--changes`

```bash
# Check status for file/hunk IDs
but status --json
# ╭┄00 [Unassigned Changes]
# │   m6 A src/auth.ts
# │   p9 A src/api.ts
# │   i3 M README.md

# Commit only specific files by ID
but commit feature-auth -p m6,i3 -m "feat: add auth and update docs"

# p9 remains uncommitted
```

### Conflict Resolution with `but resolve`

```bash
# After pulling, a commit has conflicts
but pull
but status --json
# Shows conflicted commit with ⚠️ marker

# Enter resolution mode
but resolve abc1234

# Fix conflict markers in your editor
# Check what's left
but resolve status

# Finalize
but resolve finish
```

### Squashing with Ranges

```bash
# Squash all commits in a branch
but squash feature-branch

# Squash specific commits
but squash abc1234 def5678

# Squash a range
but squash abc1234..ghi9012
```

### Absorb with Preview

```bash
# Preview where changes would be absorbed
but absorb --dry-run

# Absorb into new commits instead of amending
but absorb --new
```

### Push with Preview (For Updating Existing PRs)

Use `but push` to update branches that already have PRs. For first-time publishing, use `but pr new` instead.

```bash
# See what would be pushed without pushing
but push --dry-run

# Push a specific branch (updates existing PR)
but push feature-auth

# Push all branches with unpushed commits
but push
```

---

## Applied/Unapplied Branches

### Focusing Work by Unapplying

```bash
# Three branches applied, feature-b and feature-c conflict
but status --json
# Applied: feature-a (bu), feature-b (bv), feature-c (bw)

# Unapply conflicting branches to focus
but unapply bv
but unapply bw

# Work on feature-a without noise
but commit bu -o -m "feat: complete feature-a"
but pr new bu

# Bring others back
but apply bv
but apply bw
```

### Temporarily Setting Aside Work

```bash
# Experimental branch you want to keep but not clutter workspace
but unapply experimental-branch

# Later, when ready to resume
but apply experimental-branch
```

---

## Empty Commits and Marks

### Placeholder for Iterative Refinement

```bash
# Create placeholder commit for upcoming error handling work
but commit empty -m "TODO: Add error handling" --after c3

# Mark it — new changes auto-amend into this placeholder
but status --json  # Find the empty commit ID, e.g. c4
but mark c4

# Make changes across multiple files — all accumulate in c4
echo "try/catch" >> handler.ts
echo "error types" >> errors.ts

# Changes auto-amend into c4
but status --json  # c4 now contains both files

# Done — unmark
but unmark
```

### Focused Branch Work with Mark

```bash
# Mark a branch for auto-staging during focused work session
but branch new refactor-errors
but mark <refactor-branch-id>

# Make 20 changes across files — all auto-stage to refactor-errors
# ...

# Commit everything staged
but commit refactor-errors -o -m "refactor: centralize error handling"

# Clean up
but unmark
```

---

## Hunk-Level Commits

### Committing Parts of a File

```bash
# Large file with changes for two different concerns
# auth-related changes AND refactoring changes in the same file

# Get hunk IDs
but diff --json
# Shows hunks: h1 (auth change), h2 (refactor), h3 (auth change)

# Commit auth-related hunks only
but commit feature-auth -m "feat: add auth checks" -p h1,h3

# Commit refactoring hunk to a different branch
but commit refactor-cleanup -m "refactor: extract helper" -p h2
```

---

## Using Stage and Amend

### Stage for Multi-Branch Organization

```bash
# Multiple files need to go to different branches
but status --json
# m6 A auth.ts
# p9 A api.ts
# i3 A utils.ts

# Pre-assign files to branches (stage = explicit intent)
but stage m6 feature-auth
but stage p9 feature-api
but stage i3 shared-utils

# Commit each branch's staged files
but commit feature-auth -o -m "feat: add auth"
but commit feature-api -o -m "feat: add API"
but commit shared-utils -o -m "chore: add utilities"
```

### Amend into Specific Commit

```bash
# Forgot to include a file in an earlier commit
but status --json
# m6 M src/auth.ts  (fix that should be in c2)

# Amend directly into the target commit
but amend m6 c2

# Cleaner than creating a new commit + squashing
```

---

## Tips and Patterns

### Branch Naming

```bash
# Agent-based naming
but branch new claude-feat-user-auth
but branch new droid-fix-api-timeout

# Task-based naming
but branch new feature-authentication
but branch new bugfix-timeout
```

### Snapshot Cadence

```bash
but oplog snapshot --message "Before major reorganization"
but oplog snapshot --message "Before multi-agent coordination"
but oplog snapshot --message "Before complex stack changes"
```

### File Assignment Discipline

```bash
# Best: Commit directly with -p
echo "code" > file1.ts
but status --json  # → m6 A file1.ts
but commit my-branch -m "feat: add code" -p m6

# Alternative: Stage immediately if committing later
echo "code" > file1.ts
but stage <id> my-branch  # Right away
```

### JSON Output

```bash
# Get branch commits
but show feature-branch --json | jq '.commits[] | .id'

# Workspace overview
but status --json | jq '.stacks'
```
