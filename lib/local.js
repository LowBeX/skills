import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

export async function listLocalSkills() {
  const skillsDir = path.join(PACKAGE_ROOT, "skills");
  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

export async function readLocalSkillFiles(skillName) {
  const skillDir = path.join(PACKAGE_ROOT, "skills", skillName);
  const files = [];

  async function walk(dir, prefix = "") {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full, rel);
      } else {
        files.push({
          relativePath: rel,
          content: await fs.readFile(full),
        });
      }
    }
  }

  await walk(skillDir);
  return files;
}
