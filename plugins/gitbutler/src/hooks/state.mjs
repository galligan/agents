import fs from 'node:fs/promises';
import path from 'node:path';
import { DEFAULT_COORDINATION_MODE, STATE_VERSION } from './constants.mjs';
import { readJsonFile, writeJsonFileAtomic } from './lib/io.mjs';

export function resolveProjectDir(input) {
  return process.env.CLAUDE_PROJECT_DIR || input?.cwd || process.cwd();
}

export function resolveStatePath(input) {
  if (process.env.GITBUTLER_HOOK_STATE_PATH) {
    return process.env.GITBUTLER_HOOK_STATE_PATH;
  }
  return path.join(resolveProjectDir(input), '.claude', 'gitbutler', 'hooks-state.json');
}

export function initialState() {
  return {
    version: STATE_VERSION,
    sessions: {},
    subagents: {},
  };
}

export async function loadState(input) {
  const statePath = resolveStatePath(input);
  const state = await readJsonFile(statePath, initialState());
  return { statePath, state: normalizeState(state) };
}

export async function saveState(statePath, state) {
  const dir = path.dirname(statePath);
  await fs.mkdir(dir, { recursive: true });
  await writeJsonFileAtomic(statePath, normalizeState(state));
}

export function normalizeState(state) {
  const base = initialState();
  const sessions = state?.sessions && typeof state.sessions === 'object' ? state.sessions : {};
  const subagents = state?.subagents && typeof state.subagents === 'object' ? state.subagents : {};

  return {
    ...base,
    ...state,
    version: STATE_VERSION,
    sessions,
    subagents,
  };
}

export function resolveMode(input, sessionRecord) {
  const override = String(input?._mode_override || process.env.GITBUTLER_COORDINATION_MODE || '').toLowerCase();
  if (override === 'shared' || override === 'isolated') return override;
  if (sessionRecord?.mode === 'shared' || sessionRecord?.mode === 'isolated') return sessionRecord.mode;
  return DEFAULT_COORDINATION_MODE;
}
