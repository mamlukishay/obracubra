#!/bin/bash
# Ralph Once - Run a single Ralph iteration
# Usage: ./ralph-once.sh
#
# This is useful for human-in-the-loop workflows where you want to:
# - Complete one task at a time
# - Review changes before continuing
# - Maintain tighter control over the process

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"

# Check if PRD file exists
if [ ! -f "$PRD_FILE" ]; then
  echo "Error: prd.json not found in $SCRIPT_DIR"
  echo "Please create a prd.json file or copy one of the PRD JSON files:"
  echo "  cp prd-popular-features.json scripts/ralph/prd.json"
  echo "  cp prd-innovative-features.json scripts/ralph/prd.json"
  exit 1
fi

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Ralph Progress Log" > "$PROGRESS_FILE"
  echo "Started: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

echo "═══════════════════════════════════════════════════════"
echo "  Ralph Once - Single Iteration"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check how many tasks remain
INCOMPLETE=$(jq '[.userStories[] | select(.passes == false)] | length' "$PRD_FILE")
TOTAL=$(jq '.userStories | length' "$PRD_FILE")
COMPLETE=$((TOTAL - INCOMPLETE))

echo "Progress: $COMPLETE/$TOTAL tasks complete ($INCOMPLETE remaining)"
echo ""

if [ "$INCOMPLETE" -eq 0 ]; then
  echo "All tasks are already complete!"
  exit 0
fi

# Run Claude Code with the ralph prompt
OUTPUT=$(cat "$SCRIPT_DIR/prompt.md" | npx @anthropic-ai/claude-code --dangerously-skip-permissions 2>&1 | tee /dev/stderr) || true

echo ""
echo "═══════════════════════════════════════════════════════"

# Check for completion signal
if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
  echo "Ralph completed all tasks!"
  exit 0
else
  # Show updated progress
  INCOMPLETE_AFTER=$(jq '[.userStories[] | select(.passes == false)] | length' "$PRD_FILE")
  COMPLETE_AFTER=$((TOTAL - INCOMPLETE_AFTER))

  echo "Iteration complete."
  echo "Progress: $COMPLETE_AFTER/$TOTAL tasks complete ($INCOMPLETE_AFTER remaining)"
  echo ""
  echo "Run './scripts/ralph/ralph-once.sh' again to continue with the next task."
fi
