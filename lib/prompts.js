import { checkbox, confirm, select } from "@inquirer/prompts";
import { AGENTS } from "./targets.js";

const ALL = "__all__";

export async function selectAgent() {
  return select({
    message: "Install skills for",
    choices: Object.values(AGENTS).map((agent) => ({
      name: `${agent.label} (${agent.skillsDir}/)`,
      value: agent.id,
    })),
    default: "cursor",
  });
}

export async function selectInstallItems(available) {
  if (available.length === 0) {
    throw new Error("No skills found in repository.");
  }

  const selected = await checkbox({
    message: "Select skills to install",
    loop: false,
    pageSize: Math.min(available.length + 2, 12),
    choices: [
      { name: "All (every skill)", value: ALL },
      { name: "────────────", value: "__sep__", disabled: true },
      ...available.map((name) => ({ name, value: name })),
    ],
    required: true,
  });

  if (selected.includes(ALL)) {
    return [...available];
  }

  return selected;
}

export async function confirmInstall({ agent, skills }) {
  const lines = [
    "",
    `Target: ${agent.label} (${agent.skillsDir}/)`,
    "",
    "Will install:",
    ...skills.map((s) => `  • ${agent.skillsDir}/${s}/`),
    "",
  ];

  console.log(lines.join("\n"));

  return confirm({
    message: "Proceed?",
    default: true,
  });
}
