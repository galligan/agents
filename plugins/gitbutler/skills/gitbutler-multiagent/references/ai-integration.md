# Multi-Agent AI Integration Reference

Operational reference for running multiple agents with GitButler plugin hooks.

---

## Baseline Integration Points

### Plugin hooks (default)

Use the plugin-provided hook config:

- `plugins/gitbutler/hooks/hooks.json`

It wires:
- `SessionStart`
- `SubagentStart`
- `PreToolUse`
- `PostToolUse`
- `SubagentStop`
- `Stop`

to scripts in:
- `plugins/gitbutler/hooks/scripts/`

and runtime logic in:
- `plugins/gitbutler/src/hooks/`

### Identity + routing

Runtime keys:
- `session_key = session_id`
- `subagent_key = ${session_id}:${agent_id || "main"}`

These keys drive lane assignment and per-subagent ownership.

---

## Coordination Strategy

### 1) Isolated mode (recommended default)

Activate skill: `gitbutler-coordination-isolated`

- Each subagent gets a separate lane/workspace target
- Best for true parallel implementation
- Lower edit collision risk

### 2) Shared mode

Activate skill: `gitbutler-coordination-shared`

- All subagents in one lane/workspace target
- Best for fast collaborative refinement
- Higher chance of overlapping edits

> Keep shared/isolated skills mutually exclusive per session.

---

## Event-Level Behavior in Multi-Agent Runs

### SubagentStart
- Registers `subagent_key`
- Assigns lane based on active coordination mode

### PreToolUse
- Enforces command/tool policy before execution
- Blocks raw git write flows in Bash so agents stay on GitButler workflows

### PostToolUse
- Tracks latest ownership context (tool/file) per subagent lane

### SubagentStop
- Marks subagent stopped and preserves lane assignment state

### Stop
- Final session update; avoids re-entry loops with `stop_hook_active`

---

## Recommended Multi-Agent Pattern

1. Start in `isolated` mode.
2. Let subagents implement independently.
3. Switch to `shared` mode only when doing coordinated refinement.
4. Keep final branch/commit organization explicit with your GitButler skills and commands.

---

## Troubleshooting

### Subagents stepping on each other

- Ensure `gitbutler-coordination-isolated` is active
- Confirm plugin hooks are enabled and running

### Hooks firing but routing seems wrong

- Inspect `.claude/gitbutler/hooks-state.json`
- Verify `agent_id` presence in hook payloads for the tools you care about

### Raw git writes being blocked

- Expected by guardrail policy in `PreToolUse`
- Use `but` commands for write operations
