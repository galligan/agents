import { noopOutput, eventAdditionalContext } from '../output.mjs';

export async function handleStop(input, ctx) {
  const sessionKey = String(input.session_id || '').trim();
  if (!sessionKey) {
    return noopOutput();
  }

  const session = ctx.state.sessions[sessionKey];
  if (!session) {
    return noopOutput();
  }

  session.updated_at = new Date().toISOString();
  session.stopped_at = new Date().toISOString();

  // Prevent obvious re-entry loops if stop hook is already active.
  if (input.stop_hook_active === true) {
    return noopOutput();
  }

  return eventAdditionalContext(
    'Stop',
    `Session ${sessionKey} stopped under ${session.mode} coordination mode.`
  );
}
