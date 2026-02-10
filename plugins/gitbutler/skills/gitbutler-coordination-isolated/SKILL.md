---
name: gitbutler-coordination-isolated
description: Use when subagents should be isolated into separate GitButler lanes/workspace targets to reduce edit conflicts during parallel implementation.
hooks:
  SessionStart:
    - matcher: "startup|resume|clear|compact"
      hooks:
        - type: command
          command: "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/mode-isolated.sh"
          timeout: 20
          once: true
  SubagentStart:
    - matcher: ".*"
      hooks:
        - type: command
          command: "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/mode-isolated.sh"
          timeout: 20
---

# GitButler Isolated Coordination

Use this skill when subagents should work in isolated coordination lanes.

## Behavior

- Sets GitButler coordination mode to `isolated`
- Routes each subagent key to a separate lane/workspace target
- Optimized for concurrent implementation with lower conflict risk

## Tradeoffs

- Better isolation and ownership clarity
- Slightly more orchestration overhead
