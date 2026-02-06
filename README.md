# agents

Hand-crafted skills and agents for agentic workflows. This is a [Claude Code plugin marketplace](https://github.com/anthropics/claude-code) — install it and the skills become available to your agents automatically.

## What's in here

Skills 📚 and Agents 🤖 I've built as I go. More will follow as I craft them.

| Type | Name | What it does |
|:----:|------|-------------|
| 📚 | **gitbutler-guide** | The one-stop skill for GitButler workflows — core concepts, commands, stacking, publishing, completing branches, absorb, conflict resolution |
| 📚 | **gitbutler-multiagent** | Patterns for multiple AI agents working in the same repo simultaneously via virtual branches |
| 🤖 | **gitbutler-expert** | Knows its way around GitButler and can handle operations directly |

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
agents/              # Agent definitions
skills/              # Skill directories with SKILL.md + references/
.agents/notes/       # Background context
.claude-plugin/      # Marketplace manifest
```

## License

MIT
