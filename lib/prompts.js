import { checkbox, confirm, select } from "@inquirer/prompts";
import { AGENTS } from "./targets.js";

const ALL = "__all__";
const TEMPLATE = "__template__";

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

export async function selectInstallItems(available, { templateExists } = {}) {
  if (available.length === 0) {
    throw new Error("No skills found in repository.");
  }

  const templateLabel = templateExists
    ? "docs/agents/project.md (from project.template.md) — exists, will skip unless --force"
    : "docs/agents/project.md (from project.template.md)";

  const selected = await checkbox({
    message: "Select skills to install",
    loop: false,
    pageSize: Math.min(available.length + 3, 12),
    choices: [
      { name: "All (every skill + project.template.md)", value: ALL },
      { name: "────────────", value: "__sep__", disabled: true },
      ...available.map((name) => ({ name, value: name })),
      { name: "────────────", value: "__sep2__", disabled: true },
      { name: templateLabel, value: TEMPLATE },
    ],
    required: true,
  });

  if (selected.includes(ALL)) {
    return { skills: [...available], includeTemplate: true };
  }

  return {
    skills: selected.filter((v) => v !== TEMPLATE),
    includeTemplate: selected.includes(TEMPLATE),
  };
}

export async function confirmInstall({
  agent,
  skills,
  includeTemplate,
  templateExists,
}) {
  const lines = [
    "",
    `Target: ${agent.label} (${agent.skillsDir}/)`,
    "",
    "Will install:",
    ...skills.map((s) => `  • ${agent.skillsDir}/${s}/`),
  ];

  if (includeTemplate) {
    lines.push(
      templateExists
        ? "  • docs/agents/project.md (overwrite)"
        : "  • docs/agents/project.md",
    );
  }

  lines.push("");

  console.log(lines.join("\n"));

  return confirm({
    message: "Proceed?",
    default: true,
  });
}
