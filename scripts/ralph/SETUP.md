# Ralph Setup Guide for Obracubra

Ralph has been installed in this project! This directory contains all the files needed to run autonomous AI agent loops **using Claude Code CLI**.

## What's Installed

```
scripts/ralph/
├── ralph.sh              # Main orchestration script (adapted for Claude Code)
├── prompt.md             # Instructions for each AI iteration
├── prd.json.example      # Example PRD format
├── skills/               # Skills for PRD generation
│   ├── prd/             # Skill to create PRDs
│   └── ralph/           # Skill to convert PRDs to JSON
├── RALPH_README.md       # Full Ralph documentation
└── SETUP.md             # This file
```

## Prerequisites

✅ **jq** - Already installed at `/usr/bin/jq`
✅ **Claude Code CLI** - Available via `npx @anthropic-ai/claude-code`
✅ **Node.js/npm** - Required for Claude Code CLI

### Claude Code CLI

This implementation uses Claude Code CLI instead of Amp. The script runs:
```bash
npx @anthropic-ai/claude-code --dangerously-skip-permissions
```

No additional installation needed if you have Node.js!

## How to Use Ralph

### 1. Create a PRD

You can either:
- Use the PRD skill: Load the prd skill and create a PRD for your feature
- Manually create a `prd.json` file based on `prd.json.example`

### 2. Run Ralph

```bash
cd /home/user/obracubra
./scripts/ralph/ralph.sh [max_iterations]
```

Default is 10 iterations if not specified.

### 3. Ralph Will Autonomously:

1. Read your `prd.json` file
2. Pick the highest priority story where `passes: false`
3. Implement that story
4. Run quality checks (tests, typecheck, lint)
5. Commit if checks pass
6. Update `prd.json` to mark story as complete
7. Append learnings to `progress.txt`
8. Repeat until all stories pass or max iterations reached

## Key Concepts

- **Each iteration = fresh context**: Ralph spawns new Claude Code instances for each story
- **Memory persists via**: Git history, `progress.txt`, and `prd.json`
- **Small tasks work best**: Break large features into story-sized chunks
- **Quality gates**: All commits must pass typecheck/tests

## Example PRD Structure

```json
{
  "branchName": "claude/my-feature",
  "userStories": [
    {
      "id": "001",
      "priority": 1,
      "title": "Add timer component",
      "description": "Create a reusable timer component with start/stop/reset",
      "acceptanceCriteria": [
        "Timer displays in MM:SS format",
        "Start/stop/reset buttons work",
        "Tests pass"
      ],
      "passes": false
    }
  ]
}
```

## Next Steps

1. Create your first PRD (manually or using the skills)
2. Run `./scripts/ralph/ralph.sh [iterations]`
3. Monitor progress in `progress.txt`

## Resources

- [Full Ralph Documentation](./RALPH_README.md)
- [frankbria/ralph-claude-code](https://github.com/frankbria/ralph-claude-code) - Claude Code implementation
- [Geoffrey Huntley's Ralph Pattern](https://ghuntley.com/ralph/)
- [Ralph + Claude Code Article](https://medium.com/coding-nexus/claude-code-ralph-how-i-built-an-ai-that-ships-production-code-while-i-sleep-3ca37d08edaa)
