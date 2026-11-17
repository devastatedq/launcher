const { build: buildElectron } = require('esbuild');
const path = require('path');
const fs = require('fs');

async function buildMain() {
  console.log('Building Electron main process...');

  await buildElectron({
    entryPoints: [path.join(__dirname, 'electron.cjs')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outfile: 'dist-electron/main.js',
    external: ['electron', 'better-sqlite3', 'electron-updater']
  });

  console.log('Building Electron preload script...');

  await buildElectron({
    entryPoints: [path.join(__dirname, 'preload.cjs')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outfile: 'dist-electron/preload.js',
    external: ['electron']
  });

  console.log('✓ Electron build complete');
}

buildMain().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
