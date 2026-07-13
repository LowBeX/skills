const GITHUB_API = "https://api.github.com";

function parseRepo(repo) {
  const [owner, name] = repo.split("/");
  if (!owner || !name) {
    throw new Error(`Invalid repo "${repo}". Use owner/repo (e.g. lowbex/skills).`);
  }
  return { owner, name };
}

function headers() {
  const h = {
    Accept: "application/vnd.github+json",
    "User-Agent": "agent-skills-cli",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function githubFetch(url) {
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

export async function listSkills(repo, ref = "main") {
  const { owner, name } = parseRepo(repo);
  const entries = await githubFetch(
    `${GITHUB_API}/repos/${owner}/${name}/contents/skills?ref=${ref}`,
  );
  return entries
    .filter((e) => e.type === "dir")
    .map((e) => e.name)
    .sort();
}

export async function fetchSkillFiles(repo, skillName, ref = "main") {
  const { owner, name } = parseRepo(repo);
  const files = [];

  async function walk(dirPath) {
    const entries = await githubFetch(
      `${GITHUB_API}/repos/${owner}/${name}/contents/${dirPath}?ref=${ref}`,
    );
    for (const entry of entries) {
      if (entry.type === "file") {
        files.push({
          relativePath: entry.path.replace(/^skills\/[^/]+\//, ""),
          content: Buffer.from(entry.content, "base64"),
        });
      } else if (entry.type === "dir") {
        await walk(entry.path);
      }
    }
  }

  await walk(`skills/${skillName}`);
  return files;
}

export async function fetchTemplate(repo, ref = "main") {
  const { owner, name } = parseRepo(repo);
  const paths = ["templates/project.template.md", "project.template.md"];

  for (const path of paths) {
    try {
      const entry = await githubFetch(
        `${GITHUB_API}/repos/${owner}/${name}/contents/${path}?ref=${ref}`,
      );
      if (entry.type === "file") {
        return Buffer.from(entry.content, "base64").toString("utf8");
      }
    } catch {
      // try next path
    }
  }

  throw new Error(`project template not found in ${repo}`);
}
