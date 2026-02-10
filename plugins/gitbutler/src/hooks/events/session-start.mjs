import { eventAdditionalContext } from '../output.mjs';
import { resolveMode } from '../state.mjs';
import { upsertSession, upsertSubagent } from '../policies/coordination.mjs';

export async function handleSessionStart(input, ctx) {
  const existingSession = ctx.state.sessions[input.session_id];
  const mode = resolveMode(input, existingSession);
  upsertSession(ctx.state, input, mode);
  upsertSubagent(ctx.state, { ...input, agent_id: 'main', hook_event_name: 'SessionStart' }, mode);

  return eventAdditionalContext(
    'SessionStart',
    `GitButler coordination initialized in ${mode} mode.`
  );
}
