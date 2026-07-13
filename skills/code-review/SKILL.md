---
name: code-review
description: Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes — Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/PRD asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to "review since X".
---

Two-axis review of the diff between `HEAD` and a fixed point the user supplies:

- **Standards** — does the code conform to this repo's documented coding standards?
- **Spec** — does the code faithfully implement the originating ticket / PRD / spec?

Both axes run as **parallel sub-agents** (`Task` tool, `generalPurpose`) so they don't pollute each other's context, then this skill aggregates their findings.

**Pipeline role:** step 5 — normally invoked by `/implement` at finish. Can also run standalone for ad-hoc review.

## Process

### 1. Pin the fixed point

Whatever the user said is the fixed point — a commit SHA, branch name, tag, `main`, `HEAD~5`, etc. If they didn't specify one, use `main`.

Capture the diff command once: `git diff <fixed-point>...HEAD` (three-dot, merge-base comparison). Also note commits via `git log <fixed-point>..HEAD --oneline`.

Before going further, confirm the fixed point resolves (`git rev-parse <fixed-point>`) and the diff is non-empty. Fail here — not inside sub-agents.

### 2. Identify the spec source

Discover ticket ID pattern, backlog index, and epic directory from the repo.

Look for the originating spec, in this order:

1. **Ticket ID in commit messages or branch name** — read backlog index → linked epic PRD → cited product spec sections.
2. **Path the user passed** as an argument.
3. **Epic PRD or spec file** under the project's epic directory or `docs/` matching branch name or feature slug.
4. **GitHub/GitLab issue refs** in commits (`#123`, `Closes #45`, `!67`) — only if `docs/agents/issue-tracker.md` exists; follow its fetch workflow.
5. If nothing is found, ask the user where the spec is. If they say there isn't one, skip the Spec sub-agent and report "no spec available".

### 3. Identify the standards sources

Always include when present:

- `CONTEXT.md` — **Language** for ubiquitous-language checks on the Spec axis; **Agent** for documented repo conventions (test commands, package layout); see [domain-modeling](../domain-modeling/SKILL.md)
- **Linter/formatter config** (e.g. `biome.json`, `.eslintrc`) — skip violations tooling already enforces
- **Scoped rules** (`.cursor/rules/*.mdc` or equivalent)

Also scan for `CODING_STANDARDS.md`, `CONTRIBUTING.md`, or similar.

On top of repo docs, the Standards axis carries the **smell baseline** in [smells.md](./smells.md). Read it and paste it in full into the Standards sub-agent prompt — the sub-agent has no other access to it.

### 4. Spawn both sub-agents in parallel

Send a **single message** with two `Task` tool calls (`subagent_type: "generalPurpose"`, `readonly: true`).

**Standards sub-agent prompt** — include:

- The full diff command and commit list.
- Paths to standards-source files from step 3, **plus smells.md pasted in full**.
- Brief: "Report — per file/hunk where relevant — (a) every place the diff violates a documented standard: cite the standard (file + rule); and (b) any baseline smell you spot: name it and quote the hunk. Distinguish hard violations from judgement calls — documented-standard breaches can be hard, but baseline smells are always judgement calls, and a documented repo standard overrides the baseline. Skip anything tooling enforces. Under 400 words."

**Spec sub-agent prompt** — include:

- The diff command and commit list.
- The epic PRD path and/or fetched contents (include done-when rows for matched ticket IDs).
- `CONTEXT.md` **Language** when checking terminology against the spec.
- Brief: "Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line for each finding. Under 400 words."

If the spec is missing, skip the Spec sub-agent and note this in the final report.

### 5. Aggregate

Present the two reports under `## Standards` and `## Spec` headings, verbatim or lightly cleaned. Do **not** merge or rerank findings — the two axes are deliberately separate (see _Why two axes_).

End with a one-line summary: total findings per axis, and the worst issue _within each axis_ (if any). Don't pick a single winner across axes.

## Why two axes

A change can pass one axis and fail the other:

- Code that follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Code that does exactly what the ticket asked but breaks project conventions → **Spec pass, Standards fail.**

Reporting them separately stops one axis from masking the other.
