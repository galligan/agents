import { MAIN_AGENT_ID } from './constants.mjs';

export function sessionKey(input) {
  return String(input?.session_id || '').trim();
}

export function agentId(input) {
  return String(input?.agent_id || MAIN_AGENT_ID).trim() || MAIN_AGENT_ID;
}

export function subagentKey(input) {
  const session = sessionKey(input);
  const agent = agentId(input);
  return `${session}:${agent}`;
}

export function laneId(mode, input) {
  const session = sessionKey(input);
  const agent = agentId(input);
  if (mode === 'shared') {
    return `lane:${session}:shared`;
  }
  return `lane:${session}:${agent}`;
}

export function workspaceTarget(mode, input) {
  return `stack:${laneId(mode, input)}`;
}
