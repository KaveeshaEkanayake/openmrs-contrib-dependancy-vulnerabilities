const fs = require('fs');
const path = require('path');

const root = process.cwd();
const sourceDir = path.join(root, 'data');
const targetDir = path.join(root, 'public', 'data');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyJsonFiles(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  let copied = 0;

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.toLowerCase().endsWith('.json')) continue;

    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    fs.copyFileSync(from, to);
    copied += 1;
  }

  return copied;
}

function main() {
  if (!fs.existsSync(sourceDir)) {
    console.log('[data] Source folder "data/" not found. Skipping sync.');
    return;
  }

  ensureDir(targetDir);
  const copied = copyJsonFiles(sourceDir, targetDir);
  console.log(`[data] Synced ${copied} JSON file(s) from data/ to public/data/.`);
}

main();
