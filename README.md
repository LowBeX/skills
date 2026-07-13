# @lowbex/skills

Agent skills for Cursor and Claude Code — install selectively from GitHub into any project.

## Layout

```
skills/
├── package.json          # bin: agent-skills → bin/agent-skills.js
├── bin/agent-skills.js   # CLI
├── lib/                  # github fetch, install, prompts
├── skills/
│   ├── wayfinder/
│   ├── grill-me/
│   ├── grilling/
│   ├── grill-with-docs/
│   ├── domain-modeling/
│   ├── to-spec/
│   ├── to-tickets/
│   ├── implement/
│   └── code-review/
└── README.md
```

## Install into a project

From any project root:

```bash
npx github:LowBeX/skills install
```

Once published to npm, this also works:

```bash
npx @lowbex/skills install
```

Or point at a specific repo:

```bash
npx github:LowBeX/skills install LowBeX/skills
```

Flow:

1. Pick agent: **Cursor** (`.cursor/skills/`) or **Claude Code** (`.claude/skills/`)
2. Fetches available skills from GitHub
3. Multi-select picker — pick individual skills or **All**
4. Confirmation prompt
5. Writes selected skills to the chosen agent directory

Skips files that already exist unless you pass `--force`.

Skip the agent picker:

```bash
npx @lowbex/skills install --agent claude
```

## Init everything

```bash
npx @lowbex/skills init
```

Installs all skills in one shot.

## Publish to npm (one-time)

`npx @lowbex/skills` 404s until the package is on the registry:

```bash
npm login          # create/login as lowbex on npmjs.com first
npm publish --otp=XXXXXX   # 6-digit code from your authenticator app
```

## Options

| Flag | Description |
|------|-------------|
| `--agent cursor\|claude` | Target agent (skip picker) |
| `--force` | Overwrite existing skills |
| `--ref <branch>` | Git ref (default: `main`) |
| `--local` | Use bundled skills instead of GitHub |
| `--yes` | Skip confirmation (`init` only) |

## Auth

Public repos work without a token. For private repos or higher rate limits:

```bash
export GITHUB_TOKEN=ghp_...
```

## What gets installed

| Source | Cursor | Claude Code |
|--------|--------|-------------|
| `skills/*` | `.cursor/skills/*` | `.claude/skills/*` |
