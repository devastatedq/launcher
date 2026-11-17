const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

/**
 * Конвертер PNG → ICO для Windows
 *
 * Использование:
 * node png-to-ico.js input.png output.ico
 */

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Использование: node png-to-ico.js input.png output.ico');
  console.log('\nПример:');
  console.log('  node png-to-ico.js logo.png resources/icon.ico');
  process.exit(1);
}

const [inputFile, outputFile] = args;

async function convertToIco() {
  console.log(`Конвертация ${inputFile} → ${outputFile}...`);

  try {
    const image = await Jimp.read(inputFile);

    // Создать временные файлы разных размеров
    const sizes = [256, 128, 64, 32, 16];
    const tempFiles = [];

    for (const size of sizes) {
      const tempFile = path.join(__dirname, `temp_${size}.png`);
      await image.clone().resize(size, size).write(tempFile);
      tempFiles.push(tempFile);
      console.log(`  ✓ ${size}×${size}`);
    }

    // Использовать ImageMagick для создания .ico
    const command = `magick convert ${tempFiles.join(' ')} ${outputFile}`;

    exec(command, (error) => {
      // Удалить временные файлы
      tempFiles.forEach(f => fs.unlinkSync(f));

      if (error) {
        console.error('\n❌ Ошибка: ImageMagick не установлен');
        console.log('\nУстанови ImageMagick:');
        console.log('  1. Скачай: https://imagemagick.org/script/download.php#windows');
        console.log('  2. Установи с опцией "Install legacy utilities"');
        console.log('  3. Перезапусти терминал');
        process.exit(1);
      } else {
        console.log(`\n✅ Иконка создана: ${outputFile}`);
      }
    });

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

convertToIco();
