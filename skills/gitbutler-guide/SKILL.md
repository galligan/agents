---
name: gitbutler-guide
description: Use when working with GitButler — virtual branches, stacks, completing branches, parallel development, post-hoc commit organization, multi-agent coordination, or when "but" CLI commands, "virtual branch", "stack", "stacked branches", "anchor", "--anchor", "create dependent branch", "break feature into PRs", "complete a branch", "merge to main", "finish my feature", "ship this branch", "assign file to branch", "organize commits", "--gitbutler", or "--but" are mentioned. Comprehensive guide for the full GitButler branch management lifecycle.
metadata:
  version: "1.1.0"
  author: Matt Galligan <mg@outfitter.dev>
  category: version-control
  related-skills:
    - gitbutler-multiagent
---

# GitButler Guide

Virtual branches → parallel development → stacks → publish → ship.

<when_to_use>

- Any GitButler workflow — virtual branches, stacks, publishing, completing
- Multiple unrelated features in same workspace simultaneously
- Sequential dependencies (e.g., refactor → API → frontend)
- Large features broken into reviewable chunks
- Multi-agent concurrent development
- Exploratory coding where organization comes after writing
- Post-hoc commit reorganization

NOT for: projects using Graphite (incompatible models), simple linear workflows (use plain git)

</when_to_use>

## Core Concepts

| Concept | Description |
|---------|-------------|
| Virtual branches | Multiple branches applied simultaneously to working directory |
| Integration branch | `gitbutler/workspace` tracks virtual branch state — never touch directly |
| Target branch | Base branch (e.g., `origin/main`) all work diverges from |
| CLI IDs | Short 2-3 char identifiers for every object — commits (`c5`), branches (`bu`), files (`m6`), hunks (`h1`) |
| Dependency tracking | GitButler tracks code dependencies automatically — prevents staging to wrong branches |
| Applied vs Unapplied | Control which branches are active with `but apply`/`but unapply` |
| Stacked branches | Virtual branches split into a dependent sequence with `--anchor` |
| Oplog | Operations log for undo/restore — your safety net |

## This, Not That

| Task | This | Not That |
| ---- | ---- | -------- |
| Initialize workspace | `but setup` | manual setup |
| Create branch | `but branch new name` | `git checkout -b name` |
| View changes | `but status --json` | `git status` |
| Stage file to branch | `but stage <file-id> <branch>` | `git add` |
| Amend file into commit | `but amend <file-id> <commit>` | `git commit --amend` |
| Commit specific files | `but commit <branch> -m "msg" -p <id>,<id>` | `git commit` |
| Publish branch + create PR | `but pr new <branch>` | `but push` then `but pr new` |
| Update existing PR | `but push` | `but pr new` (only for first publish) |
| Discard changes | `but discard <id>` | `git checkout -- <file>` |
| Move commit | `but rub <sha> <branch>` | `git cherry-pick` |
| Squash commits | `but squash <branch>` | `git rebase -i` |
| Undo operation | `but undo` | `git reset` |
| Switch context | Create new branch | `git checkout` |

**Key difference from Git**: All branches visible at once. Organize files to branches after editing. No checkout.

## Quick Start

```bash
# Initialize (one time)
but setup

# Create branch
but branch new feature-auth

# Make changes, check status for CLI IDs
but status --json
# ╭┄00 [Unassigned Changes]
# │   m6 A src/auth.ts
# │   p9 A src/auth.test.ts

# Commit specific files directly by ID (no staging needed)
but commit feature-auth -m "feat: add authentication" -p m6,p9
```

## Core Loop

1. **Create**: `but branch new <name>`
2. **Edit**: Make changes in working directory
3. **Check**: `but status --json` to see CLI IDs
4. **Commit**: `but commit <branch> -m "message" -p <id>,<id>` (specific files by ID)
5. **Repeat**: Continue with other features in parallel

**Alternatives**: Use `but stage <id> <branch>` to pre-assign files, then `but commit <branch> -o` to commit staged only. Or use `but rub` for any source→target operation.

## The Power of `but rub`

Swiss Army knife — combines entities to perform operations:

| Source | Target | Operation |
|--------|--------|-----------|
| File ID | Branch | Assign file to branch |
| File ID | Commit | Amend commit with file |
| Commit SHA | Branch | Move commit between branches |
| Commit SHA | Commit SHA | Squash (newer into older) |

### Higher-Level Aliases

For common operations, prefer the self-documenting aliases:

| Alias | Equivalent `but rub` | Purpose |
|-------|----------------------|---------|
| `but stage <file> <branch>` | `but rub <file> <branch>` | Stage file to branch |
| `but amend <file> <commit>` | `but rub <file> <commit>` | Amend file into commit |
| `but squash <commits>` | Multiple `but rub` | Combine commits |
| `but move <commit> <target>` | `but rub <commit> <target>` | Reorder commits |

`but rub` is the universal primitive. The aliases are convenience wrappers for clarity.

## Essential Commands

| Command | Purpose |
|---------|---------|
| `but setup` | Initialize GitButler in repository |
| `but status --json` | View workspace state, changes, and CLI IDs |
| `but diff --json` | Show diff with hunk IDs |
| `but show <id> --json` | Inspect a commit or branch in detail |
| `but branch new <name>` | Create virtual branch |
| `but branch new <name> --anchor <parent>` | Create stacked branch |
| `but apply <branch>` / `but unapply <branch>` | Activate/deactivate branch in workspace |
| `but commit <branch> -m "msg" -p <id>,<id>` | Commit specific files/hunks by CLI ID |
| `but commit <branch> -o -m "msg"` | Commit only pre-staged files |
| `but commit empty --before/--after <target>` | Insert placeholder commit |
| `but stage <file> <branch>` | Stage file to branch |
| `but amend <file> <commit>` | Amend file into commit |
| `but rub <source> <target>` | Universal: assign/move/squash/amend |
| `but absorb` | Auto-amend uncommitted changes to appropriate commits |
| `but squash <commits>` | Squash commits (by IDs, range, or branch name) |
| `but move <commit> <target>` | Move commit to different position |
| `but discard <id>` | Discard uncommitted changes |
| `but reword <id>` | Edit commit message or rename branch |
| `but uncommit <source>` | Uncommit changes back to unstaged |
| `but resolve <commit>` | Enter conflict resolution mode |
| `but push` | Push branches to remote (`--dry-run` to preview) |
| `but pr new <branch>` | Push and create PR on forge |
| `but pr new <branch> -m "Title\n\nBody"` | Non-interactive PR creation |
| `but config forge auth` | Authenticate with GitHub (OAuth) |
| `but mark <id>` | Auto-route new changes to branch or commit |
| `but unmark` | Remove all marks |
| `but oplog --json` | Show operation history |
| `but undo` | Undo last operation |
| `but oplog snapshot --message "msg"` | Create manual snapshot |
| `but pull` | Update workspace with latest base |

**JSON output**: Always use `--json` or `-j` on inspection commands: `but status --json`, `but show <id> --json`, `but diff --json`. CLI IDs are included in JSON as `cliId` fields.

For the complete CLI reference with flags, JSON schemas, and detailed options, see `references/cli-reference.md`.

## Parallel Development

```bash
# Create two independent features
but branch new feature-a
but branch new feature-b

# Edit files for both (same workspace!)

# Check status for IDs
but status --json

# Commit specific files to each branch
but commit feature-a -m "feat: implement feature A" -p m6
but commit feature-b -m "feat: implement feature B" -p p9

# Both branches exist, zero conflicts, same directory
```

## Auto-Assignment with Marks

Mark a branch or commit for auto-routing of new changes:

```bash
# Mark a branch — new changes auto-stage here
but mark <branch-id>

# Mark a commit — new changes auto-amend into it
but mark <commit-id>

# Remove a specific mark
but mark <id> --delete

# Remove all marks
but unmark
```

Useful for focused work sessions and multi-agent auto-assignment. See `references/cli-reference.md` for empty commits as placeholders with marks.

## Stacking Branches

### Stacked vs Virtual

| Type | Use Case | Dependencies |
|------|----------|--------------|
| **Virtual** | Independent, unrelated work | None — parallel |
| **Stacked** | Sequential dependencies | Each builds on parent |

Stacked branches = virtual branches split into dependent sequence. Default: Virtual branches are stacks of one.

### Creating Stacks

```bash
# Base branch (no anchor)
but branch new base-feature

# Stacked branch (--anchor specifies parent)
but branch new child-feature --anchor base-feature

# Third level
but branch new grandchild-feature --anchor child-feature
```

**Result:** `base-feature` ← `child-feature` ← `grandchild-feature`

**Short form:** `-a` instead of `--anchor`

```bash
but branch new child -a parent
```

See `references/patterns.md` for detailed stack patterns (feature dependency, refactoring, deep stacks).

### Stack Navigation

Virtual branches don't need checkout — all branches active simultaneously.

```bash
# View full stack structure
but status --json

# Work on any branch directly (no checkout needed)
but commit base-feature -m "update base"
but commit dependent-feature -m "update dependent"

# Inspect a specific branch
but show dependent-feature --json

# Extract commit IDs
but show dependent-feature --json | jq '.commits[] | .id'
```

## Publishing & PRs

### Creating PRs

`but pr new` is the primary command for publishing — it handles both pushing and PR creation in one step. No separate `but push` needed.

```bash
# Create PR (pushes automatically + creates PR)
but pr new base-feature -m "feat: base feature"

# For stacks: bottom-to-top, one command per level
but pr new base-feature -m "feat: base feature"
but pr new child-feature -m "feat: child feature"
```

`but pr new` auto-pushes the branch and sets correct base branches for stacked PRs. GitButler figures out the right base from anchor relationships.

### Push Without PR

Use `but push` only when you want to push without creating a PR (e.g., updating an already-created PR after review feedback):

```bash
# Preview before pushing
but push --dry-run

# Push updated branches (after absorb, review fixes, etc.)
but push
```

### Non-Interactive PR Creation

For agents and automation — skip the editor:

```bash
# Inline message: first line = title, rest = body
but pr new feature-auth -m "feat: add authentication

Adds JWT-based auth with refresh tokens."

# From file
but pr new feature-auth -F pr_message.txt
```

For stacked branches, custom message applies to the selected branch only — dependents get default messages.

### GitHub CLI Alternative

```bash
git push -u origin base-feature
git push -u origin dependent-feature

gh pr create --base main --head base-feature \
  --title "feat: base feature" --body "First in stack"

gh pr create --base base-feature --head dependent-feature \
  --title "feat: dependent feature" --body "Depends on base-feature PR"
```

### GitHub Settings

- Enable automatic branch deletion after merge
- Use **Merge** strategy (recommended) — no force pushes needed
- Merge bottom-to-top (sequential order)

See `references/patterns.md` for a complete end-to-end stack publishing workflow.

## Completing Branches

When a branch is ready to ship, follow this workflow.

### Pre-Integration Checklist

| Check | Command | Expected |
|-------|---------|----------|
| GitButler running | `but --version` | Version output |
| Work committed | `but status --json` | Committed changes, no unassigned files |
| Tests passing | `bun test` (or project equivalent) | All green |
| Base updated | `but pull` | Up to date with main |
| Snapshot created | `but oplog snapshot -m "Before integrating..."` | Snapshot ID returned |

### CLI Workflow (Preferred)

```bash
# 1. Verify branch state
but status --json
but show feature-auth --json

# 2. Create snapshot
but oplog snapshot --message "Before publishing feature-auth"

# 3. Authenticate with forge (one-time)
but config forge auth

# 4. Create PR (pushes automatically + creates PR in one step)
but pr new feature-auth

# 5. Review and merge PR on GitHub

# 6. Update local and clean up
but pull
but branch delete feature-auth
```

### Stacked Branches (Bottom-to-Top)

Must merge in order: base → dependent → final. **One at a time, waiting between each.**

#### Squash Merge (Most Common)

When your repo uses squash merges (GitHub default for most teams), each merge rewrites history. The remaining stack must rebase onto the new squashed commit before the next merge.

```bash
# 1. Merge bottom PR (via GitHub UI or CLI)
gh pr merge <bottom-pr> --squash --delete-branch

# 2. WAIT — pull to rebase remaining stack onto new main
but pull

# 3. Push rebased branches to update remote
but push

# 4. Verify next PR is mergeable, then merge it
gh pr merge <next-pr> --squash --delete-branch

# 5. Repeat: pull → push → verify → merge for each level
```

**Why waiting matters:** Squash merges rewrite commits into a single new SHA. This makes the next PR's base branch (the old branch) diverge from main. If you merge the next PR immediately, GitHub auto-closes it as "conflicting" because its base branch was deleted. The PR **cannot be reopened** — you must recreate it with `gh pr create --base main`.

The `but pull` step rebases the remaining stack cleanly onto the new squashed commit, and `but push` updates the remote branches so GitHub sees them as mergeable.

#### Merge Commit (When Available)

If your repo allows merge commits, stacks are simpler — history isn't rewritten:

```bash
# 1. Merge base branch first (via PR or direct)
# 2. Update remaining branches
but pull
# 3. Merge next level
# 4. Repeat for remaining stack levels
```

See `references/completing-branches.md` for alternative workflows (direct merge, manual PR), error recovery, and post-integration cleanup.

## Review Feedback with Absorb

Fix review comments across multiple PRs in one pass:

```bash
# 1. Make ALL fixes in your working directory at once

# 2. Preview where absorb will route each change
but absorb --dry-run

# 3. Execute — changes route to correct commits based on file context
but absorb

# 4. Push all updated branches (no new PRs needed — they already exist)
but push
```

**How it works:** `but absorb` analyzes which existing commits touch the same files/lines and amends each change into the appropriate commit. No manual per-branch navigation needed.

**Targeted routing:**

```bash
# Absorb a specific file into the right commit
but absorb <file-id>

# Absorb all changes staged to a specific branch
but absorb <branch-id>
```

**When absorb can't auto-route** (new files with no commit history):

```bash
but stage <file-id> <target-branch>
but commit <target-branch> -o -m "fix: add missing validation"
```

See `references/patterns.md` for a detailed absorb example across a 3-level stack.

## Stack Maintenance

```bash
# Sync with upstream — pulls trunk, rebases all stacks, updates workspace
but pull

# Check if stacks can merge cleanly before pulling
but pull --check

# After a stack level is merged upstream
but pull
but branch delete <merged-branch>
```

`but pull` is the stack maintenance command — run it regularly to stay current and catch conflicts early.

## Conflict Handling

GitButler resolves conflicts **per-commit** during rebase (unlike Git's all-or-nothing model):

1. When base branch updates, dependent commits rebase automatically
2. Conflicted commits marked but don't block other commits
3. Resolve conflicts per affected commit
4. Partial resolution can be saved and continued later

```bash
# Update base (may trigger rebases in stack)
but pull

# Check which commits have conflicts
but status --json

# Enter resolution mode for a specific commit
but resolve <commit-id>

# Fix conflicts in your editor, then check remaining
but resolve status

# Finalize when done
but resolve finish
```

## Stack Reorganization

Key operations for restructuring stacks:

| Operation | Command |
|-----------|---------|
| Squash commits | `but squash <branch>` or `but rub <newer> <older>` |
| Move commit | `but rub <sha> <target-branch>` |
| Split branch | Create anchored branch, move commits |
| Post-hoc stacking | Create with anchor, `but rub` commits, delete original |

Always snapshot before reorganizing: `but oplog snapshot --message "Before stack reorganization"`

See `references/reorganization.md` for detailed examples and recovery procedures.

<rules>

ALWAYS:
- Use `but pr new` (not `but push`) to publish branches — it pushes and creates the PR in one step
- Use `but push` only to update branches that already have PRs (e.g., after absorb or review fixes)
- Use `but` for all work within virtual branches
- Use `git` only for integrating completed work into main
- Use `--json` on all inspection commands (`but status`, `but show`, `but diff`, `but oplog`)
- Check CLI IDs with `but status --json` before committing or staging
- Commit specific files with `-p <id>,<id>` or pre-assign with `but stage`
- Create stacks with `--anchor` from the start
- Create snapshot before integration or reorganization: `but oplog snapshot --message "..."`
- Merge stacks bottom-to-top (base first, dependents after)
- Run `but pull` regularly to keep stacks rebased on trunk
- Use `but absorb` to route review feedback to correct stack levels
- Return to workspace after any git operations: `git checkout gitbutler/workspace`
- Use `--no-ff` flag to preserve branch history (direct merge workflow)
- Run tests before integrating
- Keep each stack level small (100-250 LOC) for reviewability
- Delete empty/merged branches after cleanup

NEVER:
- Batch-merge stacked PRs — squash merges rewrite history; merge one, `but pull`, `but push`, then merge the next
- Run `but push` before `but pr new` — `but pr new` already handles pushing; a separate push is redundant
- Use `git commit` on virtual branches — breaks GitButler state
- Use `git add` — GitButler manages index
- Use `git checkout` on virtual branches — no checkout needed
- Push `gitbutler/integration` to remote — it's local-only
- Mix Graphite and GitButler in same repo — incompatible models
- Skip stack levels when merging
- Stack independent, unrelated features (use virtual branches)
- Create deep stacks (5+ levels) without good reason
- Forget anchor when creating dependent branches
- Manually navigate branches to fix review feedback — use `but absorb` instead
- Merge without snapshot backup
- Force push to main without explicit confirmation
- Pipe `but status` directly — causes panic; capture output first:

  ```bash
  status_output=$(but status --json)
  echo "$status_output" | jq '.stacks'
  ```

</rules>

## Troubleshooting

| Symptom | Cause | Solution |
|---------|-------|----------|
| Files not committing | Not assigned to branch | Use `-p <id>` or `but stage <id> <branch>` |
| Broken pipe panic | Output piped directly | Capture to variable first |
| Filename with dash fails | Interpreted as range | Use file ID from `but status --json` |
| Branch not visible | Not applied | `but apply <branch>` |
| Stack not showing in `but status --json` | Missing `--anchor` | Recreate with correct anchor |
| Commits in wrong stack level | Wrong branch targeted | `but rub <sha> correct-branch` |
| Can't merge middle of stack | Wrong order | Merge bottom-to-top only |
| Stacked PR auto-closed after squash merge | Base branch deleted by squash | `but pull` → `but push` → recreate PR with `gh pr create --base main` |
| Merge conflicts | Diverged from main | Resolve conflicts, stage, commit |
| Push rejected | Main moved ahead | `git pull`, resolve, push |
| Branch not found | Wrong ref path | Use `refs/gitbutler/<name>` |
| Mixed git/but broke state | Used git commands | `but pull` or `but setup` |
| Can't return to workspace | Integration issue | `git checkout gitbutler/workspace` |
| Lost work | Accidental deletion | `but undo` or `but oplog restore <id>` |

For detailed troubleshooting and recovery scenarios, see `references/cli-reference.md`.

## Emergency Recovery

```bash
# Quick undo
but undo

# Full restore from snapshot
but oplog restore <snapshot-id>

# View operation history
but oplog --json

# If stuck after git operations
git checkout gitbutler/workspace

# If severely broken
but setup  # Reinitialize
```

For branch anchor fixes, see `references/reorganization.md`. For comprehensive recovery scenarios, see `references/cli-reference.md`.

## Best Practices

**Keep branches small:**
- Small branches = easier merges
- Aim for single responsibility per branch

**Update base regularly:**

```bash
but pull
```

**Meaningful merge commits:**

```bash
# Good: Describes what and why
git merge --no-ff feature-auth -m "feat: add JWT-based user authentication"

# Bad: Generic message
git merge --no-ff feature-auth -m "Merge branch"
```

**Planning stacks:**
- Start simple: 2-3 levels max initially
- Single responsibility per level
- Only stack when there's a real dependency
- Descriptive names indicating stack relationship

**File assignment discipline:**
- Best: Commit directly with `-p <id>,<id>`
- Alternative: `but stage` immediately if committing later
- Use marks for focused work sessions

<references>

### Reference Files

- **`references/cli-reference.md`** — Complete CLI reference, JSON schemas, troubleshooting, recovery, oplog deep dive
- **`references/examples.md`** — Real-world workflow patterns with commands
- **`references/ai-integration.md`** — Hooks, MCP server, agent lifecycle patterns
- **`references/patterns.md`** — Detailed stack patterns, absorb examples, publishing workflow
- **`references/reorganization.md`** — Post-hoc organization, squashing, moving commits, splitting, recovery
- **`references/completing-branches.md`** — Alternative integration workflows (direct merge, manual PR), error recovery, cleanup

### Related Skills

- [gitbutler-multiagent](../gitbutler-multiagent/SKILL.md) — Multi-agent coordination

### External

- [GitButler Docs](https://docs.gitbutler.com/) — Official documentation
- [GitButler Stacks Docs](https://docs.gitbutler.com/features/branch-management/stacked-branches)
- [Stacked Branches Blog](https://blog.gitbutler.com/stacked-branches-with-gitbutler)
- [GitButler GitHub Integration](https://docs.gitbutler.com/features/forge-integration/github-integration)
- [GitButler AI Integration](https://docs.gitbutler.com/features/ai-integration/) — Hooks and MCP

</references>
