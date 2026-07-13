---
name: to-spec
description: Synthesize decided work into an epic PRD — no interview, just distillation of what you've already discussed.
disable-model-invocation: true
---

Synthesize the current conversation (and any referenced docs) into an **epic PRD**. Do NOT interview the user — write from what is already decided. If critical gaps remain, list them under open questions in the epic; do not start a grill session unless the user asks.

## Repo layout

Discover paths and conventions from the repo — epic directory, backlog index, product spec. Read `CONTEXT.md` for vocabulary (**Language**) and repo conventions (**Agent**); see [domain-modeling](../domain-modeling/SKILL.md). Open one **complete existing epic** and match its structure; if none exists, use minimal sections below.

## When to use

Always **after an entry step** — `/wayfinder` (map done) or `/grill-me` / `/grill-with-docs` (shared understanding confirmed). Read the map (`MAP.md` + resolved waypoints), `CONTEXT.md`, and `docs/adr/` when present, or the grill conversation. If critical gaps remain, send the user back to `/grill-me` or `/grill-with-docs`, not forward in the pipeline.

## Process

1. **Explore** the repo if you haven't already — grep for partial work, read `CONTEXT.md`, `docs/adr/`, and the product spec. Match existing patterns in touched areas.

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

- Discover paths and ID patterns from the repo — never assume another repo's layout.
- Do not duplicate wayfinder waypoint files into the epic — distill into **Design decisions**.
- Do not duplicate **Language** from `CONTEXT.md` or ADR prose — link ADRs (`ADR-0003`) where relevant.
- **Design decisions** = epic-scoped choices needed to implement this build. Skip decisions already captured in ADRs (link instead) or glossary terms (use **Language** vocabulary).
- Ticket-level done-when and key files belong in `/to-tickets` output.
- Prototype snippets: inline only when they encode a decision more precisely than prose.
