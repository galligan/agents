import { eventAdditionalContext } from '../output.mjs';
import { resolveMode } from '../state.mjs';
import { upsertSession, upsertSubagent } from '../policies/coordination.mjs';

export async function handleSubagentStart(input, ctx) {
  const existingSession = ctx.state.sessions[input.session_id];
  const mode = resolveMode(input, existingSession);
  upsertSession(ctx.state, input, mode);
  const subagent = upsertSubagent(ctx.state, input, mode);

  return eventAdditionalContext(
    'SubagentStart',
    `Assigned ${subagent.subagent_key} to ${subagent.workspace_target} using ${mode} coordination mode.`
  );
}
