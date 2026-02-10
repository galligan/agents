import { evaluateBashCommand } from '../policies/bash-guardrails.mjs';
import { preToolAllow, preToolDeny } from '../output.mjs';
import { resolveMode } from '../state.mjs';
import { upsertSession, upsertSubagent } from '../policies/coordination.mjs';

export async function handlePreToolUse(input, ctx) {
  const existingSession = ctx.state.sessions[input.session_id];
  const mode = resolveMode(input, existingSession);
  upsertSession(ctx.state, input, mode);
  const subagent = upsertSubagent(ctx.state, input, mode);

  if (input.tool_name === 'Bash') {
    const command = input?.tool_input?.command;
    const verdict = evaluateBashCommand(command);
    if (!verdict.allow) {
      return preToolDeny(verdict.reason);
    }
  }

  return preToolAllow(
    `Routed via ${mode} mode`,
    `Using ${subagent.workspace_target} for ${subagent.subagent_key}`
  );
}
