---
name: grill-me
description: Grill the user relentlessly about a plan or design. Use when the user wants to stress-test a plan before building, or uses any 'grill' trigger phrases.
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing. Asking multiple questions at once is bewildering.

If a _fact_ can be found by exploring the codebase, look it up rather than asking me. _The decisions_, though, are mine — put each one to me and wait for my answer.

Do not enact the plan until I confirm we have reached a shared understanding.

## Pipeline role

**Entry point** (with `/wayfinder`) for new work. This skill decides — it does **not** write the epic. After confirmation, hand off to the next step in [docs/agents/project.md](../../../docs/agents/project.md):

→ **`/to-spec`** — synthesize the agreed plan into an epic PRD.

Do not run `/to-tickets`, `/implement`, or `/code-review` in this session.

If the user only wanted grilling with no follow-up, stop after confirmation.
