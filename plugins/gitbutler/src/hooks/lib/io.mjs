import fs from 'node:fs/promises';

export async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8').trim();
}

export async function readHookInput() {
  const raw = await readStdin();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (error) {
    // Fail safe: return a minimal object and continue without blocking.
    return {
      hook_event_name: 'unknown',
      _parse_error: String(error),
      _raw: raw,
    };
  }
}

export async function readJsonFile(filePath, fallback) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

export async function writeJsonFileAtomic(filePath, data) {
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
  const payload = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(tempPath, payload, 'utf8');
  await fs.rename(tempPath, filePath);
}

export function printJson(obj) {
  process.stdout.write(`${JSON.stringify(obj)}\n`);
}
