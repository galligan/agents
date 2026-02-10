# AI Integration Reference

GitButler plugin integration for Claude Code hooks, subagents, and coordination modes.

---

## Hook Runtime (Plugin)

This plugin ships a baseline hook config and runtime:

- Hook config: `plugins/gitbutler/hooks/hooks.json`
- Hook scripts: `plugins/gitbutler/hooks/scripts/*.sh`
- Runtime dispatcher: `plugins/gitbutler/src/hooks/dispatcher.mjs`
- Runtime state: `.claude/gitbutler/hooks-state.json` (project-local, generated at runtime)

The baseline hooks cover:
- `SessionStart`
- `SubagentStart`
- `PreToolUse`
- `PostToolUse`
- `SubagentStop`
- `Stop`

### Identity model used by runtime

- `session_key = session_id`
- `subagent_key = ${session_id}:${agent_id || "main"}`

This makes session-level policy and subagent-level routing explicit.

---

## Coordination Modes

Two coordination modes are supported:

- `shared`: all subagents route into one shared lane/workspace target
- `isolated`: each subagent routes to its own lane/workspace target

Default mode is `isolated` unless overridden by skill hooks.

### Coordination skills

- `gitbutler-coordination-shared`
- `gitbutler-coordination-isolated`

These skills set mode by running plugin hook scripts on `SessionStart` and `SubagentStart`.

> Recommendation: keep these skills mutually exclusive in a session.

---

## Hook Behavior Summary

### SessionStart
- Initializes session routing state
- Establishes current coordination mode

### SubagentStart
- Registers/updates subagent routing via `subagent_key`
- Assigns lane/workspace target based on mode

### PreToolUse
- Applies guardrails before tools execute
- For `Bash`, blocks raw git write commands (for example `git commit`, `git add`, `git checkout`) to keep workflows on GitButler commands

### PostToolUse
- Records ownership context after write/edit tools

### SubagentStop
- Marks subagent state as stopped

### Stop
- Updates session stop state
- Skips re-entry behavior when `stop_hook_active` is true

---

## MCP Server (GitButler CLI)

Start MCP server for tool-based integration:

```bash
but mcp
```

Current primary tool:

- `gitbutler_update_branches` (async commit processing path)

---

## Practical Guidance

1. Use `gitbutler-coordination-isolated` for parallel implementation to reduce collisions.
2. Use `gitbutler-coordination-shared` for collaborative refinement on the same feature area.
3. Keep GitButler write operations on `but` commands.
4. Treat hook runtime as policy/routing and keep commit choreography explicit in skills/agent instructions.

---

## References

- Claude Code hook reference (event model, matcher behavior, I/O semantics)
- GitButler docs: AI integration overview / MCP / Claude integration
