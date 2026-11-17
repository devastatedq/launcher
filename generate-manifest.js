const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Генератор manifest.json для Trimira Launcher
 *
 * Использование:
 * 1. Положи все файлы в папку files/
 * 2. Запусти: node generate-manifest.js
 * 3. Получишь manifest.json с хешами
 */

const FILES_DIR = path.join(__dirname, 'files');
const OUTPUT = path.join(__dirname, 'manifest.json');
const GITHUB_REPO = 'YOUR_USERNAME/YOUR_REPO';
const VERSION = 'v1.0.0';

function calculateHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

function getFileInfo(filePath, relativePath, category) {
  const name = path.basename(filePath, path.extname(filePath));
  const hash = calculateHash(filePath);
  const url = `https://github.com/${GITHUB_REPO}/releases/download/${VERSION}/${path.basename(filePath)}`;

  return {
    name,
    version: VERSION.replace('v', ''),
    url,
    hash,
    path: relativePath
  };
}

function generateManifest() {
  const manifest = {
    version: VERSION.replace('v', ''),
    java: null,
    client: null,
    mods: [],
    resourcepacks: [],
    shaderpacks: []
  };

  if (!fs.existsSync(FILES_DIR)) {
    console.log('Создай папку files/ и положи туда файлы:');
    console.log('  files/java/jre-21-windows-x64.zip');
    console.log('  files/client/client-1.21.1.jar');
    console.log('  files/mods/*.jar');
    console.log('  files/resourcepacks/*.zip');
    console.log('  files/shaderpacks/*.zip');
    fs.mkdirSync(FILES_DIR, { recursive: true });
    fs.mkdirSync(path.join(FILES_DIR, 'java'), { recursive: true });
    fs.mkdirSync(path.join(FILES_DIR, 'client'), { recursive: true });
    fs.mkdirSync(path.join(FILES_DIR, 'mods'), { recursive: true });
    fs.mkdirSync(path.join(FILES_DIR, 'resourcepacks'), { recursive: true });
    fs.mkdirSync(path.join(FILES_DIR, 'shaderpacks'), { recursive: true });
    return;
  }

  // Java
  const javaDir = path.join(FILES_DIR, 'java');
  if (fs.existsSync(javaDir)) {
    const javaFiles = fs.readdirSync(javaDir).filter(f => f.endsWith('.zip'));
    if (javaFiles.length > 0) {
      const javaPath = path.join(javaDir, javaFiles[0]);
      manifest.java = getFileInfo(javaPath, 'java/jre-21', 'java');
      console.log(`✓ Java: ${javaFiles[0]}`);
    }
  }

  // Client
  const clientDir = path.join(FILES_DIR, 'client');
  if (fs.existsSync(clientDir)) {
    const clientFiles = fs.readdirSync(clientDir).filter(f => f.endsWith('.jar'));
    if (clientFiles.length > 0) {
      const clientPath = path.join(clientDir, clientFiles[0]);
      manifest.client = getFileInfo(clientPath, 'client.jar', 'client');
      console.log(`✓ Client: ${clientFiles[0]}`);
    }
  }

  // Mods
  const modsDir = path.join(FILES_DIR, 'mods');
  if (fs.existsSync(modsDir)) {
    const modFiles = fs.readdirSync(modsDir).filter(f => f.endsWith('.jar'));
    modFiles.forEach(file => {
      const modPath = path.join(modsDir, file);
      manifest.mods.push(getFileInfo(modPath, `mods/${file}`, 'mod'));
      console.log(`✓ Mod: ${file}`);
    });
  }

  // Resourcepacks
  const resourcepacksDir = path.join(FILES_DIR, 'resourcepacks');
  if (fs.existsSync(resourcepacksDir)) {
    const rpFiles = fs.readdirSync(resourcepacksDir).filter(f => f.endsWith('.zip'));
    rpFiles.forEach(file => {
      const rpPath = path.join(resourcepacksDir, file);
      manifest.resourcepacks.push(getFileInfo(rpPath, `resourcepacks/${file}`, 'resourcepack'));
      console.log(`✓ Resourcepack: ${file}`);
    });
  }

  // Shaderpacks
  const shaderpacksDir = path.join(FILES_DIR, 'shaderpacks');
  if (fs.existsSync(shaderpacksDir)) {
    const spFiles = fs.readdirSync(shaderpacksDir).filter(f => f.endsWith('.zip'));
    spFiles.forEach(file => {
      const spPath = path.join(shaderpacksDir, file);
      manifest.shaderpacks.push(getFileInfo(spPath, `shaderpacks/${file}`, 'shaderpack'));
      console.log(`✓ Shaderpack: ${file}`);
    });
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2));
  console.log(`\n✅ manifest.json создан: ${OUTPUT}`);
  console.log(`\nТеперь:`);
  console.log(`1. Замени YOUR_USERNAME/YOUR_REPO на свой репозиторий`);
  console.log(`2. Создай Release на GitHub с тегом ${VERSION}`);
  console.log(`3. Загрузи все файлы из files/ + manifest.json`);
}

generateManifest();
