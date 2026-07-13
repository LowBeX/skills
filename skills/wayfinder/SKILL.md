---
name: wayfinder
description: >-
  Plan a large, foggy effort as a local markdown map of waypoints (decisions to
  resolve), then work through them one at a time on demand. Planning only — no
  auto-implementation, commits, or PRs. Use when an idea is too big for one
  session and the route to a spec or epic isn't clear yet.
disable-model-invocation: true
---

A loose idea has arrived — too big for one agent session, and wrapped in fog: the way from here to the **destination** isn't visible yet. Wayfinding is about finding that way, not charging at the destination. This skill charts the way as a **shared map** in local markdown, then works its **waypoints** — questions whose resolution is a decision, not implementation work — one at a time until the route is clear.

The destination varies per effort. It might be an epic PRD to hand off, a design decision to lock before planning, or a migration strategy. The map is planning-only; building belongs to other skills the user invokes separately.

## Project config

Read [docs/agents/project.md](../../../docs/agents/project.md) first. If missing, ask the user or use sensible defaults and discover epic format from the repo.

## Vocabulary

Avoid conflating wayfinding artifacts with the implementation backlog (use **Backlog vocabulary** from project config when set):

| Term         | Typical meaning                                            |
| ------------ | ---------------------------------------------------------- |
| **Map**      | This skill's planning index (`MAP.md`)                     |
| **Waypoint** | One decision unit on the map (a markdown file)             |
| **Epic**     | Implementation PRD — written by `/to-spec` in the pipeline |
| **Ticket**   | Implementation backlog unit — **not** a waypoint           |

Refer to waypoints and the map **by title**, never by bare numbers.

## Plan, don't do

Wayfinder is **planning** by default: each waypoint resolves a decision; the map is done when nothing is left to decide before someone builds. The pull to implement is usually the signal you've reached the edge of the map — **stop and tell the user**; do not start coding, commit, push, or open PRs unless they explicitly ask in this session.

No automatic handoffs. When the map is clear, tell the user to run **`/to-spec`** (pass the map path). Do not run `/to-tickets`, `/implement`, or `/code-review` in this session.

## Storage

Maps live under **map storage** from project config — local markdown only, no issue tracker unless project config defines one.

```
<map-storage>/<slug>/
  MAP.md
  waypoints/
    01-<short-name>.md
    02-<short-name>.md
```

Add the map directory to `.gitignore` if the user wants a private scratch map; otherwise commit is fine.

### MAP.md body

Load once per session. Open waypoints are **not** listed — scan `waypoints/` for `Status: open`.

```markdown
# <Effort title>

## Destination

<what reaching the end of this map looks like — epic PRD, locked decision, or change strategy. One or two lines; every session orients here first.>

## Notes

<domain context; skills to consult from project config; standing preferences for this effort>

## Decisions so far

<!-- one line per resolved waypoint: gist + link to the file that holds the full answer -->

- [<waypoint title>](waypoints/03-example.md) — one-line gist of the answer.

## Not yet specified

<!-- in-scope fog you can't waypoint yet; graduates as the frontier advances -->

## Out of scope

<!-- work ruled beyond the destination; never graduates -->
```

### Waypoint files

`<map-storage>/<slug>/waypoints/NN-<short-name>.md`, numbered from `01`:

```markdown
# <Waypoint title>

Type: grilling | research | prototype | task
Status: open | in_progress | resolved
Blocked by: 01, 02 <!-- omit if unblocked -->

## Question

<the decision or investigation this waypoint resolves>

## Answer

<!-- filled on resolution -->
```

- **Frontier**: waypoints with `Status: open`, unblocked (every `Blocked by` entry is `resolved`), sorted by number — first wins.
- **Claim**: set `Status: in_progress` before any work (skip if already `in_progress` in this session).
- **Resolve**: write `## Answer`, set `Status: resolved`, append one line to the map's **Decisions so far**.

Assets (prototypes, notes) link from the answer; don't paste large blobs into `MAP.md`.

## Waypoint types

Every waypoint is either **HITL** (human in the loop) or **AFK** (agent-driven). HITL waypoints only resolve through live exchange — the agent never answers its own grilling questions.

- **Research** (AFK): Read docs, APIs, or the codebase to surface a fact a decision waits on. Do the reading in this session when the user invokes work-through; do **not** spawn background subagents or branches.
- **Prototype** (HITL): Cheap rough artifact to react to — outline, stub, or throwaway UI/logic sketch. Link or path in the answer; discard after the decision unless the user keeps it.
- **Grilling** (HITL): One question at a time via [grilling](../grilling/SKILL.md) and [domain-modeling](../domain-modeling/SKILL.md). Default type.
- **Task** (HITL or AFK): Manual prerequisite before a decision — provisioning, signup, moving data. The one type that _does_ rather than decides; it earns its place by unblocking a waypoint. Record what was done and facts later waypoints need.

Consult the **product spec** from project config when designing.

## Fog of war

The map is deliberately incomplete. **Not yet specified** holds the dim view toward the destination — in scope but not sharp enough to waypoint yet.

**Fog or waypoint?** Can you state the question precisely now — not whether you can answer it?

- **Waypoint** when the question is sharp (even if blocked).
- **Not yet specified** when you can't phrase it sharply yet. One fog patch may become several waypoints, or none, when the frontier advances.

Exclude from fog: decisions already in **Decisions so far**, live waypoints, and **Out of scope**.

## Out of scope

Work beyond the destination goes in **Out of scope**, not fog. It never graduates unless the destination is redrawn (fresh map, not resumption).

If an existing waypoint sits past the destination, mark it `Status: resolved` with answer "Out of scope — …", and add one line under **Out of scope** on the map. Do not add it to **Decisions so far**.

## Invocation

Two modes, **user-triggered only**. Never resolve more than one waypoint per session — except the user explicitly asks to batch-resolve research waypoints in one go.

Do not auto-chain into `/to-spec`, `/to-tickets`, `/implement`, or `/code-review` in this session.

### Chart the map

User invokes with a loose idea.

1. **Name the destination.** Run `/grilling` and `/domain-modeling` to pin what this map is finding its way to. Destination fixes scope — settle it first.
2. **Map the frontier.** Grill again, **breadth-first**: fan out across the space, surfacing open decisions and first takeable steps. **If no fog** — the way is already clear — skip the map; tell the user to run **`/to-spec`** directly.
3. **Create** `<map-storage>/<slug>/MAP.md`: Destination, Notes, empty Decisions so far, fog in **Not yet specified**.
4. **Create waypoints** you can specify now under `waypoints/` — then add `Blocked by` in a second pass (files need numbers before they can reference each other). Unspecified fog stays in **Not yet specified**.
5. **Stop.** Charting is one session's work; do not resolve waypoints, spawn subagents, or start implementation.

### Work through the map

User invokes with a map path or slug. A waypoint name/path is **optional** — without one, pick the first frontier waypoint.

1. Load **MAP.md** only — not every waypoint body.
2. Choose the waypoint. User's choice wins; else first on the frontier. Set `Status: in_progress`.
3. Resolve it — read related resolved waypoints on demand; follow skills named in **Notes**. Default: `/grilling` and `/domain-modeling`. Use codebase lookup for facts, not grilling.
4. Record: fill `## Answer`, set `Status: resolved`, append to **Decisions so far** on the map.
5. Add new waypoints if the answer surfaces them; graduate fog from **Not yet specified**; rule out-of-scope items per above. Update or remove invalidated waypoints.
6. **Stop.** Stop — charting is one session's work; it hand-resolves nothing.

## When the map is done

All waypoints resolved, fog cleared or explicitly deferred, destination reachable. Summarize the route in plain language (one short paragraph), then tell the user to run **`/to-spec`** — feed it the map path (`<map-storage>/<slug>/`).

Do not run `/to-spec` yourself unless the user asks in this session.
