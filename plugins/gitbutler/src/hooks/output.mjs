export function noopOutput() {
  return { continue: true, suppressOutput: true };
}

export function systemMessage(message) {
  return {
    continue: true,
    suppressOutput: true,
    systemMessage: message,
  };
}

export function preToolAllow(reason, additionalContext) {
  return {
    continue: true,
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'allow',
      ...(reason ? { permissionDecisionReason: reason } : {}),
      ...(additionalContext ? { additionalContext } : {}),
    },
  };
}

export function preToolDeny(reason) {
  return {
    continue: true,
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  };
}

export function eventAdditionalContext(hookEventName, additionalContext) {
  return {
    continue: true,
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName,
      additionalContext,
    },
  };
}
