#!/usr/bin/env node

import { fetchSkillFiles, listSkills } from "../lib/github.js";
import { listLocalSkills, readLocalSkillFiles } from "../lib/local.js";
import { skillExists, writeSkill } from "../lib/install.js";
import { confirmInstall, selectAgent, selectInstallItems } from "../lib/prompts.js";
import { resolveAgent } from "../lib/targets.js";

const DEFAULT_REPO = "LowBeX/skills";
const DEFAULT_REF = "main";

function usage() {
  console.log(`Usage:
  npx @lowbex/skills install [owner/repo]   Pick agent and skills
  npx @lowbex/skills init [owner/repo]       Install all skills

Options:
  --agent    cursor | claude (skip agent picker)
  --force    Overwrite existing files
  --ref      Git ref (default: main)
  --local    Use bundled skills (dev / before GitHub push)
  --yes      Skip confirmation (init only; installs everything)

Examples:
  npx @lowbex/skills install
  npx @lowbex/skills install --agent claude
  npx @lowbex/skills init --force
`);
}

function parseArgs(argv) {
  const args = {
    force: false,
    yes: false,
    local: false,
    ref: DEFAULT_REF,
    repo: DEFAULT_REPO,
    agent: null,
  };
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--force") args.force = true;
    else if (arg === "--yes" || arg === "-y") args.yes = true;
    else if (arg === "--local") args.local = true;
    else if (arg === "--agent") args.agent = argv[++i];
    else if (arg === "--ref") args.ref = argv[++i];
    else if (arg === "--help" || arg === "-h") args.help = true;
    else if (!arg.startsWith("-")) positional.push(arg);
  }

  if (positional[0]) args.repo = positional[0];
  return args;
}

async function resolveAgentChoice(args) {
  if (args.agent) return resolveAgent(args.agent);
  return resolveAgent(await selectAgent());
}

async function getAvailableSkills(args) {
  if (args.local) {
    return { skills: await listLocalSkills(), source: "local" };
  }

  try {
    const skills = await listSkills(args.repo, args.ref);
    return { skills, source: "github" };
  } catch (err) {
    if (err.message.includes("404")) {
      throw new Error(
        `Repository ${args.repo} not found on GitHub. Push the repo first, or use --local.`,
      );
    }
    throw err;
  }
}

async function fetchSkill(skillName, args) {
  if (args.local) return readLocalSkillFiles(skillName);
  return fetchSkillFiles(args.repo, skillName, args.ref);
}

async function installSkills(cwd, skillNames, agent, args) {
  const results = [];

  for (const name of skillNames) {
    process.stdout.write(`  ${name}: fetching...`);
    const files = await fetchSkill(name, args);
    process.stdout.write(
      ` writing ${files.length} file${files.length === 1 ? "" : "s"}...`,
    );
    const result = await writeSkill(cwd, name, files, agent.skillsDir, {
      force: args.force,
    });
    console.log(result.status === "skipped" ? " skipped (exists)" : " done");
    results.push(result);
  }

  return results;
}

async function cmdInstall(cwd, args) {
  const agent = await resolveAgentChoice(args);
  const { skills: available, source } = await getAvailableSkills(args);
  const label = source === "local" ? "package" : `${args.repo}@${args.ref}`;
  console.log(`\nFetching skills from ${label}...\n`);

  const selected = await selectInstallItems(available);

  const ok = await confirmInstall({ agent, skills: selected });

  if (!ok) {
    console.log("Cancelled.");
    return;
  }

  console.log("\nInstalling...\n");

  const results = await installSkills(cwd, selected, agent, args);
  printResults(results);
}

async function cmdInit(cwd, args) {
  const agent = await resolveAgentChoice(args);
  const { skills: available, source } = await getAvailableSkills(args);
  const label = source === "local" ? "package" : `${args.repo}@${args.ref}`;
  console.log(`\nFetching skills from ${label}...\n`);

  if (!args.yes) {
    const existing = [];
    for (const name of available) {
      if (await skillExists(cwd, name, agent.skillsDir)) existing.push(name);
    }

    if (existing.length) {
      console.log("Already installed (will skip unless --force):");
      for (const name of existing) {
        console.log(`  • ${agent.skillsDir}/${name}/`);
      }
      console.log("");
    }

    const ok = await confirmInstall({ agent, skills: available });

    if (!ok) {
      console.log("Cancelled.");
      return;
    }
  }

  console.log("\nInstalling...\n");

  const results = await installSkills(cwd, available, agent, args);
  printResults(results);
}

function printResults(skillResults) {
  console.log("\nSummary:");
  for (const r of skillResults) {
    const label = r.status === "skipped" ? "skipped (exists)" : "installed";
    const dest = r.path ? ` → ${r.path}` : "";
    console.log(`  ${r.skillName}: ${label}${dest}`);
  }
  console.log("\nDone.");
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    usage();
    process.exit(0);
  }

  const [command, ...rest] = argv;
  const args = parseArgs(rest);
  const cwd = process.cwd();

  if (!command) {
    usage();
    process.exit(command ? 0 : 1);
  }

  try {
    if (command === "install") await cmdInstall(cwd, args);
    else if (command === "init") await cmdInit(cwd, args);
    else {
      console.error(`Unknown command: ${command}\n`);
      usage();
      process.exit(1);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
