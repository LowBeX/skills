import fs from "node:fs/promises";
import path from "node:path";

const SKILLS_DIR = ".cursor/skills";
const PROJECT_CONFIG = "docs/agents/project.md";

export async function skillExists(cwd, skillName) {
  try {
    await fs.access(path.join(cwd, SKILLS_DIR, skillName, "SKILL.md"));
    return true;
  } catch {
    return false;
  }
}

export async function projectConfigExists(cwd) {
  try {
    await fs.access(path.join(cwd, PROJECT_CONFIG));
    return true;
  } catch {
    return false;
  }
}

export async function writeSkill(cwd, skillName, files, { force = false } = {}) {
  const destDir = path.join(cwd, SKILLS_DIR, skillName);

  if (!force && (await skillExists(cwd, skillName))) {
    return { skillName, status: "skipped" };
  }

  await fs.mkdir(destDir, { recursive: true });

  for (const file of files) {
    const dest = path.join(destDir, file.relativePath);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, file.content);
  }

  return { skillName, status: "installed", path: destDir };
}

export async function writeProjectConfig(cwd, content, { force = false } = {}) {
  const dest = path.join(cwd, PROJECT_CONFIG);

  if (!force && (await projectConfigExists(cwd))) {
    return { status: "skipped", path: dest };
  }

  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, content, "utf8");

  return { status: "installed", path: dest };
}
