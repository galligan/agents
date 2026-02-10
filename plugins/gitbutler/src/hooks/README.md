# Hook Runtime

This folder is for shared hook runtime logic used by plugin hook entrypoints.

Recommended identity model:
- `session_key = session_id`
- `subagent_key = ${session_id}:${agent_id || "main"}`

Core files:
- `dispatcher.mjs` entrypoint that reads hook stdin JSON and routes by `hook_event_name`
- `state.mjs` project-local state loading/saving
- `events/` event handlers (`SessionStart`, `SubagentStart`, `PreToolUse`, `PostToolUse`, `SubagentStop`, `Stop`)
- `policies/` reusable policy logic (coordination mode and bash guardrails)
