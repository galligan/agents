export const STATE_VERSION = 1;

export const COORDINATION_MODES = {
  SHARED: 'shared',
  ISOLATED: 'isolated',
};

export const DEFAULT_COORDINATION_MODE = COORDINATION_MODES.ISOLATED;

export const MAIN_AGENT_ID = 'main';

export const SUPPORTED_WRITE_TOOLS = new Set(['Write', 'Edit', 'MultiEdit']);
export const SUPPORTED_GUARDED_TOOLS = new Set(['Bash', 'Write', 'Edit', 'MultiEdit']);
