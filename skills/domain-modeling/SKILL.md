---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when the user wants to pin down domain terminology or a ubiquitous language, record an architectural decision, or when another skill needs to maintain the domain model.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the _active_ discipline — challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. (Merely _reading_ `CONTEXT.md` for vocabulary is not this skill — that's a one-line habit any skill can do. This skill is for when you're changing the model, not just consuming it.)

## File structure

Most repos have a single context:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

If a `CONTEXT-MAP.md` exists at the root, the repo has multiple contexts. The map points to where each one lives:

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Create files lazily — only when you have something to write. If no `CONTEXT.md` exists, create one when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

## Where decisions go

Route each resolved item to exactly one home:

| What | Where | When |
|------|-------|------|
| **Canonical term** | `CONTEXT.md` → **Language** | A word or concept is pinned |
| **ADR-worthy decision** | `docs/adr/NNNN-slug.md` | Hard to reverse, surprising without context, and a real trade-off |
| **Planning rationale** | Waypoint `## Answer` ([wayfinder](../wayfinder/SKILL.md)) | Everything else during wayfinding — reasoning for _this_ question |
| **Epic-scoped decision** | Epic **Design decisions** | Distilled by `/to-spec` for _this_ build — link ADRs, don't duplicate them |

During a session: terms → **Language** immediately; ADR-worthy → write ADR and note the path in the waypoint answer; the rest stays in the waypoint answer until `/to-spec` distills epic-scoped rows.

Do not put glossary terms or ADR prose into epic **Design decisions**. Do not put implementation commands or test recipes in **Language**.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `CONTEXT.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Update CONTEXT.md inline

When a term is resolved, update `CONTEXT.md` → **Language** right there. Don't batch these up — capture them as they happen. Use the format in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

### Offer ADRs sparingly

Only offer to create an ADR when all three criteria in [ADR-FORMAT.md](./ADR-FORMAT.md) are met. If any is missing, skip the ADR.
