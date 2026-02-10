# Stack Patterns

Detailed patterns for GitButler stacked branches.

## Feature Dependency Stack

Build features that depend on each other in sequence.

```bash
# Auth foundation
but branch new auth-core
but commit auth-core -m "feat: add authentication core"

# OAuth layer depends on auth core
but branch new auth-oauth --anchor auth-core
but commit auth-oauth -m "feat: add OAuth integration"

# Social login depends on OAuth
but branch new auth-social --anchor auth-oauth
but commit auth-social -m "feat: add social login"
```

## Refactoring Stack

Break large refactors into reviewable phases.

```bash
# Extract utilities
but branch new refactor-extract-utils
but commit refactor-extract-utils -m "refactor: extract common utilities"

# Update consumers
but branch new refactor-use-utils --anchor refactor-extract-utils
but commit refactor-use-utils -m "refactor: use extracted utilities"

# Clean up
but branch new refactor-cleanup --anchor refactor-use-utils
but commit refactor-cleanup -m "refactor: remove deprecated code"
```

## Deep Stack (5+ Levels)

For complex features requiring many dependent phases.

```bash
but branch new db-schema
but branch new data-access --anchor db-schema
but branch new business-logic --anchor data-access
but branch new api-endpoints --anchor business-logic
but branch new frontend-integration --anchor api-endpoints
```

**Caution:** Deep stacks increase merge complexity. Prefer 2-3 levels when possible.

## Addressing Review Feedback Across a Stack

The most powerful stack workflow: fix review comments across multiple PRs in one pass.

### Scenario

You have a 3-level stack with review feedback on each level:

```
auth-core          ← reviewer: "add input validation"
auth-oauth         ← reviewer: "handle token refresh errors"
auth-social        ← reviewer: "add rate limiting"
```

### Without absorb (manual, slow)

You'd need to visit each branch, make changes, commit — 3 separate cycles.

### With absorb (automatic, fast)

```bash
# 1. Make ALL fixes in your working directory at once
#    Fix validation in src/auth/core.ts
#    Fix token refresh in src/auth/oauth.ts
#    Fix rate limiting in src/auth/social.ts

# 2. Preview routing
but absorb --dry-run
# Shows:
#   src/auth/core.ts    → auth-core (commit abc1234)
#   src/auth/oauth.ts   → auth-oauth (commit def5678)
#   src/auth/social.ts  → auth-social (commit ghi9012)

# 3. Execute — each fix amends into the correct commit
but absorb

# 4. Verify
but status --json    # All clean, changes routed correctly

# 5. Push all updated branches
but push

# 6. (Optional) Force push if branches were already pushed
but push --with-force
```

### Targeted absorb for precision

When you want explicit control over routing:

```bash
# Absorb only a specific file
but absorb <file-id>

# Absorb all changes staged to a specific branch
but absorb <branch-id>

# Preview before committing
but absorb <file-id> --dry-run
```

### When absorb can't auto-route

If a file is new (no commit history to match against), absorb may not know where to put it. In that case:

```bash
# Stage manually, then commit
but stage <file-id> <target-branch>
but commit <target-branch> -o -m "fix: add missing validation"
```

## Stack Publishing Workflow

End-to-end pattern for submitting a complete stack as PRs.

`but pr new` handles both pushing and PR creation — no separate `but push` needed. Create PRs bottom-to-top so GitButler auto-sets the correct base branch from anchors.

```bash
# 1. Create stack
but branch new db-migration
# ... implement, commit ...
but branch new api-endpoints -a db-migration
# ... implement, commit ...
but branch new frontend -a api-endpoints
# ... implement, commit ...

# 2. Verify stack structure
but status --json

# 3. Create PRs bottom-to-top (pushes automatically)
but pr new db-migration -m "feat: add user tables

Migration adds users and sessions tables."

but pr new api-endpoints -m "feat: add user API

REST endpoints for user CRUD. Depends on db-migration."

but pr new frontend -m "feat: add user dashboard

UI for user management. Depends on api-endpoints."

# 4. After review feedback, use absorb to update
# (make fixes)
but absorb
but push  # Updates already-created PRs (no new PRs needed)
```
