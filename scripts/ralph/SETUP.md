# Ralph Setup Guide for Obracubra

Ralph has been installed in this project! This directory contains all the files needed to run autonomous AI agent loops.

## What's Installed

```
scripts/ralph/
├── ralph.sh              # Main orchestration script
├── prompt.md             # Instructions for each AI iteration
├── prd.json.example      # Example PRD format
├── skills/               # Amp skills for PRD generation
│   ├── prd/             # Skill to create PRDs
│   └── ralph/           # Skill to convert PRDs to JSON
├── RALPH_README.md       # Full Ralph documentation
└── SETUP.md             # This file
```

## Prerequisites Still Needed

✅ **jq** - Already installed at `/usr/bin/jq`
❌ **Amp CLI** - Not yet installed. Ralph requires [Amp CLI](https://ampcode.com) to run.

### Installing Amp CLI

Visit https://ampcode.com to install Amp CLI for your system.

After installation, configure auto-handoff in `~/.config/amp/settings.json`:

```json
{
  "amp.experimental.autoHandoff": { "context": 90 }
}
```

## How to Use Ralph

### 1. Create a PRD

You can either:
- Use the PRD skill (if Amp is installed): Load the prd skill and create a PRD for your feature
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

- **Each iteration = fresh context**: Ralph spawns new Amp instances for each story
- **Memory persists via**: Git history, `progress.txt`, and `prd.json`
- **Small tasks work best**: Break large features into story-sized chunks
- **Quality gates**: All commits must pass typecheck/tests

## Example PRD Structure

```json
{
  "branchName": "ralph/my-feature",
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

1. Install Amp CLI from https://ampcode.com
2. Configure Amp settings as shown above
3. Create your first PRD
4. Run `./scripts/ralph/ralph.sh`

## Resources

- [Full Ralph Documentation](./RALPH_README.md)
- [Geoffrey Huntley's Ralph Pattern](https://ghuntley.com/ralph/)
- [Amp Documentation](https://ampcode.com/manual)
