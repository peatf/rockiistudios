// Installs the macOS arm64 rollup native binary only when needed.
import { execSync } from 'node:child_process';

const isDarwinArm64 = process.platform === 'darwin' && process.arch === 'arm64';

if (isDarwinArm64) {
  try {
    execSync('npm install @rollup/rollup-darwin-arm64@4.53.3 --no-save', { stdio: 'inherit' });
  } catch (err) {
    console.warn('Optional rollup native binary failed to install:', err?.message || err);
  }
}
