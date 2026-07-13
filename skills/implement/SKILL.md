---
name: implement
description: >-
  Implement work from a spec, epic PRD, or ticket. Reads the backlog index and
  epic PRDs for ticket IDs. Use when the user explicitly asks to implement
  (slash command or "implement this").
disable-model-invocation: true
---

# Implement

User-triggered — step 4 in the pipeline: `/wayfinder` or `/grill-me` → `/to-spec` → `/to-tickets` → `/implement` → `/code-review`. Run after `/to-tickets`. Read the spec or tickets first; do not guess scope.

## Repo layout

Discover paths and conventions from the repo — ticket IDs, epic directory, backlog index, product spec. Read `CONTEXT.md` (**Agent** for tests, **Language** for vocabulary); see [domain-modeling](../domain-modeling/SKILL.md). Ask the user when ambiguous.

## Route by input

| Input | Action |
|-------|--------|
| Ticket ID matching **ticket ID pattern** | Follow **Ticket workflow** below |
| Epic / PRD path | Read PRD done-when + cited product spec sections; grep for partial work |
| Ad-hoc spec only | Read the provided doc; grep codebase for related code |

## Ticket workflow

1. Read the **backlog index** — find ticket ID and linked epic PRD (always read fresh; do not hardcode open lists)
2. Read the epic PRD in the **epic directory** for done-when, checkpoint, key files
3. Read product spec sections cited in the PRD
4. Grep codebase for existing partial work related to ticket title/keywords
5. State briefly: ticket ID, done-when criteria, files to touch, blockers (check epic **Build order** / blocked-by)
6. Implement minimal diff; run relevant tests from `CONTEXT.md` **Agent**
7. UI changes: note relevant rows in the **manual QA doc** when configured
8. On completion: mark ticket done in the **epic PRD** (use the repo's done marker); update **backlog index** if epic status changed; update `CONTEXT.md` **Agent** status when the repo defines a sync convention

Read priority legend and done-marker conventions from the backlog index when present.

## Implementation

- Minimal diff — match existing patterns in touched files.
- Write tests at pre-agreed seams where they add meaningful coverage; do not TDD boilerplate or one-liner helpers.
- Run relevant tests from `CONTEXT.md` **Agent** during work (single files / package scope).

## Finish

Run the full test suite for packages you touched, then run **`/code-review`** — read and follow [code-review](../code-review/SKILL.md) against `main` unless the user specified otherwise. This is step 5 in the pipeline; always do it before considering the ticket done.
