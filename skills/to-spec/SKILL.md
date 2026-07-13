---
name: to-spec
description: Turn the current conversation into a spec and publish it to the project issue tracker — no interview, just synthesis of what you've already discussed.
disable-model-invocation: true
---

Synthesize the current conversation (and any referenced docs) into an **epic PRD**. Do NOT interview the user — write from what is already decided. If critical gaps remain, list them under open questions in the epic; do not start a grill session unless the user asks.

## Project config

Read [docs/agents/project.md](../../../docs/agents/project.md) first — epic directory, filename pattern, backlog index, product spec, context file. Follow the **Discovery** section to match an existing epic's structure; if none exists, use minimal sections below.

## When to use

Always **after an entry step** — `/wayfinder` (map done) or `/grill-me` (shared understanding confirmed). Read the map (`MAP.md` + resolved waypoints) or grill conversation. If critical gaps remain, send the user back to `/grill-me`, not forward in the pipeline.

## Process

1. **Explore** the repo if you haven't already — grep for partial work, read the **context file** and cited **product spec** sections from project config. Match existing patterns in touched areas.

2. **Test seams** — sketch where tests will attach. Prefer existing seams at the highest level; one seam is ideal. **Check with the user** that these seams match expectations before writing the epic.

3. **Pick epic identity** — scan the **backlog index** for the next free epic number/slug per the **epic filename pattern**; confirm with user if ambiguous.

4. **Write the epic** to `<epic-directory>/<epic-filename>` matching a **complete existing epic** in that directory (table columns, section headings, status line). Leave the ticket table empty or placeholder — `/to-tickets` fills it. Minimal fallback when no prior epic exists:

```markdown
# <Epic title>

**Status:** Open — tickets TBD

> One-line summary.

| ID | … | _(columns from backlog index or ask user)_ |
|----|---|---------------------------------------------|

---

## Goals

## Design decisions

| Topic | Decision |
|-------|----------|

## Out of scope

---

## Checkpoint

## Key files
```

5. **Update the backlog index** — add epic row; add open-work rows only if ticket IDs already exist.

6. **Stop** — tell the user to run **`/to-tickets`** on the new epic path. Do not run `/to-tickets`, `/implement`, or `/code-review` unless asked.

## Rules

- All paths and ID patterns come from project config — never assume another repo's layout.
- Do not duplicate wayfinder waypoint files into the epic — distill into **Design decisions**.
- Ticket-level done-when and key files belong in `/to-tickets` output.
- Prototype snippets: inline only when they encode a decision more precisely than prose.
