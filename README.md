# agents

Hand-crafted skills and agents for agentic workflows. This is a [Claude Code plugin marketplace](https://github.com/anthropics/claude-code) repo.

## What's in here

GitButler content now lives under `plugins/gitbutler/`, including plugin-scoped skills, agents, and hook/runtime code.

| Type | Name | What it does |
|:----:|------|-------------|
| 📚 | **gitbutler-guide** | The one-stop skill for GitButler workflows — core concepts, commands, stacking, publishing, completing branches, absorb, conflict resolution |
| 📚 | **gitbutler-multiagent** | Patterns for multiple AI agents working in the same repo simultaneously via virtual branches |
| 📚 | **gitbutler-coordination-isolated** | Forces isolated subagent routing (separate lanes/workspace targets) |
| 📚 | **gitbutler-coordination-shared** | Forces shared subagent routing (single collaborative lane/workspace target) |
| 🤖 | **the-gitbutler** | Knows its way around GitButler and can handle operations directly |

Each skill has detailed reference files for the stuff you don't need every time but want available when you do.

## Install

```bash
# Inside Claude Code
/plugin marketplace add galligan/agents

# From the terminal
claude marketplace add galligan/agents

# Via npx
npx skills add galligan/agents
```

## Structure

```
plugins/gitbutler/   # GitButler plugin: skills, agents, hooks, runtime source
agents/              # Root-level (non-plugin) agent definitions
skills/              # Root-level (non-plugin) skills
.agents/notes/       # Background context
.claude-plugin/      # Marketplace manifest
```

## License

MIT
