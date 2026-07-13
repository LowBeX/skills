# @lowbex/skills

Cursor agent skills — install selectively from GitHub into any project.

## Layout

```
skills/
├── package.json          # bin: agent-skills → bin/agent-skills.js
├── bin/agent-skills.js   # CLI
├── lib/                  # github fetch, install, prompts
├── skills/
│   ├── wayfinder/
│   ├── grill-me/
│   ├── to-spec/
│   ├── to-tickets/
│   ├── implement/
│   └── code-review/
├── templates/
│   └── project.template.md
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

1. Fetches available skills from GitHub
2. Multi-select picker — pick individual skills, **All** (every skill + `project.template.md`), or mix
3. Confirmation prompt
4. Writes selected skills to `.cursor/skills/<name>/`

Skips files that already exist unless you pass `--force`.

## Init everything

```bash
npx github:LowBeX/skills init
```

## Publish to npm (one-time)

`npx @lowbex/skills` 404s until the package is on the registry:

```bash
npm login          # create/login as lowbex on npmjs.com first
npm publish --otp=XXXXXX   # 6-digit code from your authenticator app
```

Installs all skills + project template in one shot.

## Options

| Flag | Description |
|------|-------------|
| `--force` | Overwrite existing skills / project.md |
| `--ref <branch>` | Git ref (default: `main`) |
| `--yes` | Skip confirmation (`init` only) |

## Auth

Public repos work without a token. For private repos or higher rate limits:

```bash
export GITHUB_TOKEN=ghp_...
```

## What gets installed

| Source | Destination |
|--------|-------------|
| `skills/*` | `.cursor/skills/*` |
| `templates/project.template.md` | `docs/agents/project.md` |
