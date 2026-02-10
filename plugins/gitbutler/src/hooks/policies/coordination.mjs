import { laneId, workspaceTarget } from '../keys.mjs';

export function upsertSession(state, input, mode) {
  const key = String(input.session_id || '').trim();
  const now = new Date().toISOString();
  if (!key) return null;

  const existing = state.sessions[key] || {};
  state.sessions[key] = {
    session_key: key,
    mode,
    shared_lane_id: mode === 'shared' ? laneId(mode, input) : null,
    created_at: existing.created_at || now,
    updated_at: now,
  };
  return state.sessions[key];
}

export function upsertSubagent(state, input, mode) {
  const session = String(input.session_id || '').trim();
  const agent = String(input.agent_id || 'main').trim() || 'main';
  const key = `${session}:${agent}`;
  const now = new Date().toISOString();
  const existing = state.subagents[key] || {};

  state.subagents[key] = {
    subagent_key: key,
    session_key: session,
    agent_id: agent,
    agent_type: input.agent_type || existing.agent_type || 'main',
    lane_id: laneId(mode, input),
    workspace_target: workspaceTarget(mode, input),
    status: input.hook_event_name === 'SubagentStop' ? 'stopped' : 'active',
    created_at: existing.created_at || now,
    updated_at: now,
    last_tool_name: input.tool_name || existing.last_tool_name || null,
    last_file_path: input?.tool_input?.file_path || input?.tool_response?.filePath || existing.last_file_path || null,
  };

  return state.subagents[key];
}
