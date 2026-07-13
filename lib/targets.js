export const AGENTS = {
  cursor: {
    id: "cursor",
    label: "Cursor",
    skillsDir: ".cursor/skills",
  },
  claude: {
    id: "claude",
    label: "Claude Code",
    skillsDir: ".claude/skills",
  },
};

export function resolveAgent(agentId) {
  const agent = AGENTS[agentId];
  if (!agent) {
    throw new Error(
      `Unknown agent "${agentId}". Use: ${Object.keys(AGENTS).join(", ")}.`,
    );
  }
  return agent;
}
