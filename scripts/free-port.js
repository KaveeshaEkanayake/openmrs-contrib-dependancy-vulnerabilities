const { execSync } = require('child_process');

function run(cmd) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  } catch {
    return '';
  }
}

function getPidsOnPortWindows(port) {
  const output = run(`netstat -ano -p tcp | findstr :${port}`);
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.toUpperCase().includes('LISTENING'));

  const pids = new Set();
  lines.forEach((line) => {
    const parts = line.split(/\s+/);
    const pid = parts[parts.length - 1];
    if (/^\d+$/.test(pid)) {
      pids.add(Number(pid));
    }
  });

  return Array.from(pids).filter((pid) => pid > 4 && pid !== process.pid);
}

function getPidsOnPortUnix(port) {
  const output = run(`lsof -ti:${port}`);
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\d+$/.test(line))
    .map(Number)
    .filter((pid) => pid > 1 && pid !== process.pid);
}

function killPidWindows(pid) {
  try {
    execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function killPidUnix(pid) {
  try {
    execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function isPortInUse(port, isWindows) {
  const pids = isWindows ? getPidsOnPortWindows(port) : getPidsOnPortUnix(port);
  return pids.length > 0;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitUntilFreed(port, isWindows, retries = 15, delayMs = 200) {
  for (let i = 0; i < retries; i += 1) {
    if (!isPortInUse(port, isWindows)) {
      return true;
    }
    await sleep(delayMs);
  }

  return !isPortInUse(port, isWindows);
}

async function main() {
  const port = process.argv[2] || '3000';
  const isWindows = process.platform === 'win32';

  const pids = isWindows ? getPidsOnPortWindows(port) : getPidsOnPortUnix(port);

  if (pids.length === 0) {
    console.log(`[dev] Port ${port} is free.`);
    return;
  }

  let killed = 0;
  pids.forEach((pid) => {
    const ok = isWindows ? killPidWindows(pid) : killPidUnix(pid);
    if (ok) killed += 1;
  });

  const freed = await waitUntilFreed(port, isWindows);

  if (freed) {
    console.log(`[dev] Freed port ${port} by stopping ${killed} process(es).`);
  } else {
    console.error(`[dev] Port ${port} is still in use. Stop the process manually and retry.`);
    process.exitCode = 1;
  }
}

main();
