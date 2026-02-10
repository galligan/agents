#!/usr/bin/env node
import { readHookInput, printJson } from './lib/io.mjs';
import { loadState, saveState } from './state.mjs';
import { handleSessionStart } from './events/session-start.mjs';
import { handleSubagentStart } from './events/subagent-start.mjs';
import { handlePreToolUse } from './events/pre-tool-use.mjs';
import { handlePostToolUse } from './events/post-tool-use.mjs';
import { handleSubagentStop } from './events/subagent-stop.mjs';
import { handleStop } from './events/stop.mjs';
import { handleDefault } from './events/default.mjs';
import { noopOutput, systemMessage } from './output.mjs';

const handlers = {
  SessionStart: handleSessionStart,
  SubagentStart: handleSubagentStart,
  PreToolUse: handlePreToolUse,
  PostToolUse: handlePostToolUse,
  SubagentStop: handleSubagentStop,
  Stop: handleStop,
};

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--mode' && argv[i + 1]) {
      out.mode = argv[i + 1];
      i += 1;
    }
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv);
  const input = await readHookInput();
  if (args.mode) {
    input._mode_override = args.mode;
  }

  const eventName = input.hook_event_name || 'unknown';

  try {
    const { statePath, state } = await loadState(input);
    const handler = handlers[eventName] || handleDefault;
    const output = await handler(input, { state, statePath });
    await saveState(statePath, state);
    printJson(output || noopOutput());
  } catch (error) {
    // Fail open: do not block Claude by default on runtime failures.
    printJson(systemMessage(`GitButler hook runtime warning: ${String(error)}`));
  }
}

main();
