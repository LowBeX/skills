const GITHUB_API = "https://api.github.com";

function parseRepo(repo) {
  const [owner, name] = repo.split("/");
  if (!owner || !name) {
    throw new Error(`Invalid repo "${repo}". Use owner/repo (e.g. lowbex/skills).`);
  }
  return { owner, name };
}

function headers(accept = "application/vnd.github+json") {
  const h = {
    Accept: accept,
    "User-Agent": "agent-skills-cli",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function githubFetch(url, accept) {
  const res = await fetch(url, { headers: headers(accept) });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

async function fetchRawFile(url) {
  const res = await fetch(url, { headers: headers("application/vnd.github.raw") });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status}: ${body || res.statusText}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function fetchFileContent(owner, name, filePath, ref) {
  const meta = await githubFetch(
    `${GITHUB_API}/repos/${owner}/${name}/contents/${filePath}?ref=${ref}`,
  );

  if (meta.content) {
    return Buffer.from(meta.content, "base64");
  }

  if (meta.download_url) {
    const res = await fetch(meta.download_url, { headers: headers() });
    if (!res.ok) {
      throw new Error(`Failed to download ${filePath}: ${res.status}`);
    }
    return Buffer.from(await res.arrayBuffer());
  }

  return fetchRawFile(
    `${GITHUB_API}/repos/${owner}/${name}/contents/${filePath}?ref=${ref}`,
  );
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
          content: await fetchFileContent(owner, name, entry.path, ref),
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
      const content = await fetchFileContent(owner, name, path, ref);
      return content.toString("utf8");
    } catch {
      // try next path
    }
  }

  throw new Error(`project template not found in ${repo}`);
}
