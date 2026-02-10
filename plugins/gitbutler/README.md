# GitButler Plugin

This plugin contains GitButler-specific components for Claude Code marketplace usage.

## Layout

- `agents/` GitButler-focused agent definitions
- `skills/` GitButler-focused skills and references
- `src/` hook runtime and coordination logic
- `hooks/` plugin hook configuration and executable script entrypoints

## Hook Runtime Location

Shared hook runtime code belongs in:

`plugins/gitbutler/src/`

A suggested deeper path is:

`plugins/gitbutler/src/hooks/`

## Coordination Skills

- `gitbutler-coordination-isolated` isolates subagents into separate lanes/workspace targets
- `gitbutler-coordination-shared` routes subagents to a shared lane/workspace target

These skills are intended to be mutually exclusive per session.
