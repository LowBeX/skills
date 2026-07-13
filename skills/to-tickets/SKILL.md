---
name: to-tickets
description: Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker — edges as text in one file per ticket locally, or native blocking links on a real tracker.
disable-model-invocation: true
---

# To Tickets

Break an epic PRD, plan, or conversation into **tickets** — tracer-bullet vertical slices with explicit build order.

## Project config

Read [docs/agents/project.md](../../../docs/agents/project.md) first — ticket ID pattern, ticket layout, epic directory, backlog index, product spec, context file, manual QA doc. Follow **Discovery**: open one **complete existing epic** in the epic directory and match its ticket table columns, per-ticket section headings, and done-when style.

## Process

### 1. Gather context

Work from conversation context. If the user passes an epic path, read it fully. If the source is a **wayfinder map**, read `MAP.md` and resolved waypoints too.

### 2. Explore the codebase (optional)

If not already explored, grep for partial work. Read the **product spec** and **context file** from project config. Look for prefactor opportunities — "make the change easy, then make the easy change."

### 3. Draft vertical slices

Break work into **tracer bullet** tickets:

- Each slice cuts a narrow but **complete** path through every layer — vertical, not one-layer horizontal
- A completed slice is demoable or verifiable on its own
- Each slice fits one agent session (use sizing guide from **backlog index** when present)
- Prefactoring tickets come first when needed

Assign each ticket **blocked-by** edges — other ticket IDs that must finish first. No blockers → can start immediately.

**Wide refactors** (mechanical blast radius across the repo): sequence as expand → migrate batches → contract, each its own ticket with blocking edges.

### 4. Quiz the user

Present the breakdown. For each proposed ticket:

- **ID** — next free ID matching the **ticket ID pattern** (scan epics + backlog index)
- **Title** — short name
- **Pri / Size** — per backlog index legend when present; else agree with user
- **Blocked by** — ticket IDs or "none"
- **What it delivers** — end-to-end behaviour, user perspective

Ask: granularity OK? blocking edges correct? merge or split anything?

Iterate until approved.

### 5. Publish

Per **ticket layout** from project config:

**`inside-epic`** (default) — update the epic PRD in place:

1. Ticket table at the top (match existing column format)
2. **Build order** line listing ticket IDs in dependency order
3. Per-ticket sections — match headings from the reference epic (e.g. `## <ticket-id> — Title`, Done when, Key files, Tests)
4. Epic **Status** — reflect open tickets
5. **Checkpoint** — fill or update when the full test plan is clear
6. **Backlog index** — epic status + open-work rows for each new ticket

**`separate-files`** — one file per ticket under a directory the user defines in project config; include blocked-by in each file.

Do not mark tickets done or implement anything.

### 6. Stop

Tell the user to run **`/implement <ticket-id>`** on the first frontier ticket. Work one ticket per session. Do not auto-run implement or code-review.

## Rules

- No GitHub Issues, triage labels, or Matt-style `.scratch/` unless project config says so.
- Avoid stale file paths in done-when where possible — key files section holds paths.
- UI tickets: note relevant **manual QA doc** rows to add when project config lists one.
- Prototype snippets: inline in done-when only when they encode a decision.

## Wide refactor note

Expand–contract for mechanical renames/retypes that can't land green in one slice. Each batch is its own ticket with blocking edges; CI green batch-to-batch.
