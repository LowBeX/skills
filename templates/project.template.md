# Project agent config

Per-repo paths and conventions. **Portable skills read this file first on every invoke.**

## Planning

| Key | Value |
|-----|-------|
| Map storage | `docs/wayfinder/<slug>/` |
| Epic PRD directory | `docs/plans/` |
| Epic filename pattern | `NN-<slug>.md` |
| Backlog index | `docs/BACKLOG.md` |
| Product spec | `docs/SPEC.md` |

## Canonical pipeline

```
/wayfinder  OR  /grill-me  →  /to-spec  →  /to-tickets  →  /implement  →  /code-review
```

Each step is a separate invocation unless the user asks to continue.

## Backlog vocabulary

| Term | Meaning |
|------|---------|
| **Epic** | Implementation PRD under the epic directory |
| **Ticket** | Implementation unit in the backlog — not a wayfinder waypoint |

## Implementation

| Key | Value |
|-----|-------|
| Ticket ID pattern | `PROJ-###` |
| Ticket layout | `inside-epic` |
| Context sync rule | _(optional)_ |
| Manual QA doc | _(optional)_ |

## Agent context

| Key | Value |
|-----|-------|
| Context file | `AGENTS.md` |
| Scoped rules glob | `.cursor/rules/*.mdc` |

## Code review

| Key | Value |
|-----|-------|
| Linter / formatter config | _(optional)_ |
| Default diff base branch | `main` |
| Optional standards files | `CODING_STANDARDS.md`, `CONTRIBUTING.md` |

## Discovery (for agents)

1. Read this file for paths and patterns.
2. Glob the **epic PRD directory** for existing epics.
3. Open one **complete** epic that already has tickets — match its structure.
4. If none exists, ask the user or use minimal sections (Goals, Design decisions, Out of scope).

Priority legend and sizing guide: read from the **backlog index** when present.
