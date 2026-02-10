---
name: gitbutler-coordination-shared
description: Use when multiple subagents should collaborate in a shared GitButler lane/workspace target for rapid iterative work on closely related changes.
hooks:
  SessionStart:
    - matcher: "startup|resume|clear|compact"
      hooks:
        - type: command
          command: "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/mode-shared.sh"
          timeout: 20
          once: true
  SubagentStart:
    - matcher: ".*"
      hooks:
        - type: command
          command: "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/mode-shared.sh"
          timeout: 20
---

# GitButler Shared Coordination

Use this skill when subagents should work in a shared coordination lane.

## Behavior

- Sets GitButler coordination mode to `shared`
- Routes subagents in a session to a common lane/workspace target
- Optimized for rapid collaboration on a single feature area

## Tradeoffs

- Faster handoffs and iteration
- Higher risk of overlapping edits
