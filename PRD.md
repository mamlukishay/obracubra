# PRD: Rubik's Cube Timer Tasks

This PRD breaks down the implementation into discrete tasks suitable for Ralph loops.

---

## Task 1: Project Initialization
**Status:** completed

**Objective:** Set up the Vite + React + TypeScript project with Tailwind and shadcn/ui.

**Acceptance Criteria:**
- [x] `npm create vite@latest . -- --template react-ts` executed
- [x] `npm install` completes without errors
- [x] Tailwind CSS v4 installed and configured
- [x] shadcn/ui initialized with dark theme
- [x] shadcn/ui components added: button, card, scroll-area
- [x] `npm run dev` starts without errors
- [x] `npm run build` succeeds

**Completion:** `<promise>TASK-1-DONE</promise>`

---

## Task 2: TypeScript Types & Project Structure
**Status:** pending

**Objective:** Create the type definitions and folder structure.

**Acceptance Criteria:**
- [ ] `src/types/index.ts` created with:
  - `TimerState` type: `'idle' | 'holding' | 'ready' | 'running' | 'stopped'`
  - `Solve` interface: `{ id: string, time: number, scramble: string, timestamp: Date }`
  - `Statistics` interface: `{ count, best, worst, average, ao5, ao12 }`
- [ ] Folder structure created: `components/`, `hooks/`, `utils/`, `lib/`
- [ ] `src/lib/utils.ts` with shadcn `cn()` utility
- [ ] TypeScript compiles without errors

**Completion:** Output `<promise>TASK-2-DONE</promise>`

---

## Task 3: Timer Hook (useTimer)
**Status:** pending

**Objective:** Implement accurate millisecond timer using requestAnimationFrame.

**Acceptance Criteria:**
- [ ] `src/hooks/useTimer.ts` created
- [ ] Uses `performance.now()` for accuracy
- [ ] Uses `requestAnimationFrame` for smooth updates
- [ ] Exports: `{ time, isRunning, start, stop, reset }`
- [ ] Timer accurate to milliseconds
- [ ] Cleanup on unmount (cancel animation frame)
- [ ] TypeScript types correct

**Completion:** Output `<promise>TASK-3-DONE</promise>`

---

## Task 4: Keyboard & Touch Controls Hook
**Status:** pending

**Objective:** Implement spacebar and touch event handling with hold-to-start.

**Acceptance Criteria:**
- [ ] `src/hooks/useKeyboardControls.ts` created
- [ ] Listens for `keydown`/`keyup` on spacebar
- [ ] Listens for `touchstart`/`touchend` on document
- [ ] Implements 550ms hold threshold with setTimeout
- [ ] Ignores `e.repeat` for held keys
- [ ] Prevents default (no page scroll)
- [ ] Callbacks: `onHoldStart`, `onReady`, `onRelease`, `onStop`
- [ ] Cleanup on unmount

**Completion:** Output `<promise>TASK-4-DONE</promise>`

---

## Task 5: Timer Display Component
**Status:** pending

**Objective:** Create the main timer display with color states.

**Acceptance Criteria:**
- [ ] `src/components/Timer.tsx` created
- [ ] Displays time in `MM:SS.mmm` format
- [ ] Large monospace font (centered)
- [ ] Color states via Tailwind:
  - idle: `text-foreground` (default)
  - holding: `text-red-500`
  - ready: `text-green-500`
  - running: `text-green-500`
  - stopped: `text-foreground`
- [ ] Smooth color transitions
- [ ] Instruction text below timer (context-aware)

**Completion:** Output `<promise>TASK-5-DONE</promise>`

---

## Task 6: Scramble Generator & Component
**Status:** pending

**Objective:** Generate valid 3x3 scrambles and display them.

**Acceptance Criteria:**
- [ ] `src/utils/scrambleGenerator.ts` created
- [ ] Generates 20-move scrambles
- [ ] Uses standard notation: R, L, U, D, F, B with ', 2 modifiers
- [ ] No consecutive moves on same face
- [ ] No three moves on same axis
- [ ] `src/components/Scramble.tsx` displays scramble
- [ ] Scramble text is readable and centered

**Completion:** Output `<promise>TASK-6-DONE</promise>`

---

## Task 7: App State Machine & Integration
**Status:** pending

**Objective:** Wire up the 5-state machine in App.tsx.

**Acceptance Criteria:**
- [ ] `src/App.tsx` implements full state machine
- [ ] State transitions work correctly:
  - idle -> holding (space down)
  - holding -> ready (550ms elapsed)
  - holding -> idle (space up early)
  - ready -> running (space up)
  - running -> stopped (any key)
  - stopped -> idle (space down, new scramble)
- [ ] Timer starts/stops correctly
- [ ] New scramble generated after each solve
- [ ] App runs without errors

**Completion:** Output `<promise>TASK-7-DONE</promise>`

---

## Task 8: History Component & Local Storage
**Status:** pending

**Objective:** Save solves and display history list.

**Acceptance Criteria:**
- [ ] `src/hooks/useLocalStorage.ts` created
- [ ] `src/components/History.tsx` created
- [ ] Solves persist to localStorage
- [ ] History shows newest first
- [ ] Uses shadcn Card and ScrollArea
- [ ] Each item shows: solve number, formatted time
- [ ] Delete button for each solve
- [ ] Loads saved solves on app start

**Completion:** Output `<promise>TASK-8-DONE</promise>`

---

## Task 9: Statistics Calculations & Component
**Status:** pending

**Objective:** Calculate and display solve statistics.

**Acceptance Criteria:**
- [ ] `src/utils/statistics.ts` created
- [ ] Calculates: count, best, worst, mean
- [ ] Calculates Ao5, Ao12 (WCA-style: drop best & worst)
- [ ] `src/components/Statistics.tsx` displays stats
- [ ] Uses shadcn Card for styling
- [ ] Updates when solves change
- [ ] Handles edge cases (< 5 solves, etc.)

**Completion:** Output `<promise>TASK-9-DONE</promise>`

---

## Task 10: Time Formatter Utility
**Status:** pending

**Objective:** Create utility for formatting milliseconds to display string.

**Acceptance Criteria:**
- [ ] `src/utils/timeFormatter.ts` created
- [ ] `formatTime(ms)` returns `MM:SS.mmm` string
- [ ] Handles hours if needed (for long times)
- [ ] Pads zeros correctly (01:05.023)
- [ ] Used consistently across Timer, History, Statistics

**Completion:** Output `<promise>TASK-10-DONE</promise>`

---

## Task 11: Responsive Layout
**Status:** pending

**Objective:** Implement mobile-first responsive design.

**Acceptance Criteria:**
- [ ] Desktop (md+): Two-column grid, sidebar on right
- [ ] Mobile: Single column, timer on top
- [ ] Timer area is full-width touchable on mobile
- [ ] Touch targets minimum 44px
- [ ] Tested in Chrome DevTools responsive mode
- [ ] No horizontal scroll on any viewport

**Completion:** Output `<promise>TASK-11-DONE</promise>`

---

## Task 12: Final Polish & Testing
**Status:** pending

**Objective:** Complete final testing and polish.

**Acceptance Criteria:**
- [ ] All features working end-to-end
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Hold-to-start works on desktop and mobile
- [ ] Statistics calculate correctly
- [ ] Data persists across refresh
- [ ] Responsive layout works

**Completion:** Output `<promise>TASK-12-DONE</promise>`

---

## Ralph Loop Examples

### Run all tasks sequentially:
```bash
/ralph-loop "Complete the next pending task from PRD.md. Mark it complete. Output <promise>DONE</promise> when task is complete." --max-iterations 50 --completion-promise "TASK-12-DONE"
```

### Run a single task:
```bash
/ralph-loop "Complete Task 2 (TypeScript Types & Project Structure) from PRD.md" --max-iterations 10 --completion-promise "TASK-2-DONE"
```
