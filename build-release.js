const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Скрипт полной сборки релиза Trimira Launcher
 *
 * Собирает:
 * - Моды из trimira-combat и trimira-magic
 * - Копирует в files/
 * - Генерирует manifest.json
 * - Собирает .exe лаунчера
 */

const PROJECT_ROOT = path.join(__dirname, '..');
const LAUNCHER_ROOT = __dirname;
const FILES_DIR = path.join(LAUNCHER_ROOT, 'files');

console.log('🚀 Trimira Release Builder\n');

// 1. Создать структуру files/
console.log('1️⃣ Создание структуры files/...');
['java', 'client', 'mods', 'resourcepacks', 'shaderpacks'].forEach(dir => {
  const dirPath = path.join(FILES_DIR, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});
console.log('✅ Структура создана\n');

// 2. Собрать моды
console.log('2️⃣ Сборка модов...');

const COMBAT_DIR = path.join(PROJECT_ROOT, 'trimira-combat');
const MAGIC_DIR = path.join(PROJECT_ROOT, 'trimira-magic');

if (fs.existsSync(COMBAT_DIR)) {
  console.log('   Сборка trimira-combat...');
  try {
    execSync('cd ../trimira-combat && ./gradlew build', { stdio: 'inherit' });

    const buildLibs = path.join(COMBAT_DIR, 'build', 'libs');
    const jars = fs.readdirSync(buildLibs).filter(f => f.endsWith('.jar') && !f.includes('sources'));

    if (jars.length > 0) {
      const latestJar = jars[jars.length - 1];
      fs.copyFileSync(
        path.join(buildLibs, latestJar),
        path.join(FILES_DIR, 'mods', latestJar)
      );
      console.log(`   ✅ ${latestJar} скопирован`);
    }
  } catch (error) {
    console.log('   ⚠️ Ошибка сборки trimira-combat (пропущено)');
  }
} else {
  console.log('   ⚠️ trimira-combat не найден');
}

if (fs.existsSync(MAGIC_DIR)) {
  console.log('   Сборка trimira-magic...');
  try {
    execSync('cd ../trimira-magic && ./gradlew build', { stdio: 'inherit' });

    const buildLibs = path.join(MAGIC_DIR, 'build', 'libs');
    const jars = fs.readdirSync(buildLibs).filter(f => f.endsWith('.jar') && !f.includes('sources'));

    if (jars.length > 0) {
      const latestJar = jars[jars.length - 1];
      console.log(`   ⚠️ ${latestJar} — серверный мод, не нужен клиенту (пропущено)`);
    }
  } catch (error) {
    console.log('   ⚠️ Ошибка сборки trimira-magic (пропущено)');
  }
} else {
  console.log('   ⚠️ trimira-magic не найден');
}

console.log('');

// 3. Проверить наличие других файлов
console.log('3️⃣ Проверка файлов...');
const checks = [
  { dir: 'java', desc: 'Java JRE', pattern: '.zip' },
  { dir: 'client', desc: 'Minecraft Client', pattern: '.jar' },
  { dir: 'mods', desc: 'Моды', pattern: '.jar' },
  { dir: 'resourcepacks', desc: 'Ресурспаки', pattern: '.zip' },
  { dir: 'shaderpacks', desc: 'Шейдеры', pattern: '.zip' }
];

checks.forEach(({ dir, desc, pattern }) => {
  const dirPath = path.join(FILES_DIR, dir);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith(pattern));

  if (files.length > 0) {
    console.log(`   ✅ ${desc}: ${files.length} файл(ов)`);
  } else {
    console.log(`   ⚠️ ${desc}: не найдено`);
  }
});

console.log('');

// 4. Генерация manifest.json
console.log('4️⃣ Генерация manifest.json...');
try {
  execSync('node generate-manifest.js', { stdio: 'inherit' });
  console.log('✅ manifest.json создан\n');
} catch (error) {
  console.log('⚠️ Ошибка генерации manifest.json\n');
}

// 5. Сборка лаунчера
console.log('5️⃣ Сборка лаунчера...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✅ Лаунчер собран!\n');
} catch (error) {
  console.log('\n❌ Ошибка сборки лаунчера\n');
  process.exit(1);
}

// 6. Итоги
console.log('📦 Релиз готов!');
console.log(`   Установщик: release/Trimira Launcher Setup 1.0.0.exe`);
console.log(`   manifest.json: ${path.join(LAUNCHER_ROOT, 'manifest.json')}`);
console.log(`   Файлы для загрузки: files/\n`);

console.log('📝 Следующие шаги:');
console.log('   1. Создай Release на GitHub');
console.log('   2. Загрузи все файлы из files/ + manifest.json');
console.log('   3. Отредактируй manifest.json (замени YOUR_USERNAME/YOUR_REPO)');
