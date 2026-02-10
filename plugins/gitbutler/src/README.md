# GitButler Plugin Source

Runtime code for GitButler plugin behaviors lives under `src/`.

Suggested module split:
- `hooks/` for hook runtime and event dispatch
- `hooks/events/` for event handlers (`PreToolUse`, `PostToolUse`, `Stop`, etc.)
- `hooks/policies/` for coordination policy (`shared`, `isolated`)
