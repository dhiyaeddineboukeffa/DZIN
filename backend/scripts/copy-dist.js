const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const clientDist = path.join(root, '..', 'dzin-shop', 'dist');
const publicDir = path.join(root, 'public');

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error('Client build not found at', src);
    process.exit(1);
  }
  fs.mkdirSync(dest, { recursive: true });
  // Node 16.7+ has fs.cpSync
  if (fs.cpSync) {
    fs.cpSync(src, dest, { recursive: true });
    return;
  }
  // Fallback copy
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('Removing existing public dir:', publicDir);
  removeDir(publicDir);
  console.log('Copying client dist from', clientDist, 'to', publicDir);
  copyDir(clientDist, publicDir);
  console.log('Client assets copied to backend/public');
} catch (err) {
  console.error('Failed to copy client dist:', err);
  process.exit(1);
}
