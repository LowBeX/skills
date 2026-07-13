import fs from "node:fs/promises";
import path from "node:path";

export async function skillExists(cwd, skillName, skillsDir) {
  try {
    await fs.access(path.join(cwd, skillsDir, skillName, "SKILL.md"));
    return true;
  } catch {
    return false;
  }
}

export async function writeSkill(
  cwd,
  skillName,
  files,
  skillsDir,
  { force = false } = {},
) {
  const destDir = path.join(cwd, skillsDir, skillName);

  if (!force && (await skillExists(cwd, skillName, skillsDir))) {
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
