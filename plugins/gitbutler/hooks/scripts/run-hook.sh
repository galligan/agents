#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

if command -v node >/dev/null 2>&1; then
  node "${PLUGIN_ROOT}/src/hooks/dispatcher.mjs" "$@"
  exit 0
fi

if command -v bun >/dev/null 2>&1; then
  bun "${PLUGIN_ROOT}/src/hooks/dispatcher.mjs" "$@"
  exit 0
fi

# Fail open with valid JSON if runtime is unavailable.
echo '{"continue":true,"suppressOutput":true,"systemMessage":"GitButler hook runtime unavailable (need node or bun)."}'
