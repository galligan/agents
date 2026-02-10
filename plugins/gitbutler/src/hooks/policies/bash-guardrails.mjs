const DISALLOWED_GIT_WRITE_PATTERNS = [
  /(^|\s)git\s+add(\s|$)/i,
  /(^|\s)git\s+commit(\s|$)/i,
  /(^|\s)git\s+checkout(\s|$)/i,
  /(^|\s)git\s+switch(\s|$)/i,
  /(^|\s)git\s+merge(\s|$)/i,
  /(^|\s)git\s+rebase(\s|$)/i,
  /(^|\s)git\s+cherry-pick(\s|$)/i,
  /(^|\s)git\s+stash(\s|$)/i,
  /(^|\s)git\s+reset(\s|$)/i,
];

export function evaluateBashCommand(command) {
  const safeCommand = String(command || '').trim();
  if (!safeCommand) {
    return { allow: true };
  }

  for (const pattern of DISALLOWED_GIT_WRITE_PATTERNS) {
    if (pattern.test(safeCommand)) {
      return {
        allow: false,
        reason: 'Blocked raw git write command. Use GitButler `but` commands instead.',
      };
    }
  }

  return { allow: true };
}
