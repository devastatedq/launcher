# 📘 Туториал по настройке Trimira Launcher

## Содержание
1. [Структура проекта](#структура-проекта)
2. [Добавление ассетов](#добавление-ассетов)
3. [Настройка CDN (GitHub Releases)](#настройка-cdn-github-releases)
4. [Создание manifest.json](#создание-manifestjson)
5. [Обновление контента](#обновление-контента)
6. [Релиз лаунчера](#релиз-лаунчера)
7. [Тестирование](#тестирование)
8. [Частые вопросы](#частые-вопросы)

---

## Структура проекта

```
trimira-launcher/
├── src/
│   ├── main/              # Backend (Electron + Node.js)
│   ├── renderer/          # Frontend (React + Tailwind)
│   ├── preload/           # Electron preload
│   └── shared/            # Общие типы
├── resources/             # ⭐ СЮДА ДОБАВЛЯТЬ АССЕТЫ
│   ├── backgrounds/
│   ├── logos/
│   └── icons/
├── dist/                  # Собранный .exe (после npm run build)
└── package.json
```

---

## Добавление ассетов

### 1. Подготовь файлы

**Фоновое изображение:**
- Путь: `resources/backgrounds/main-bg.jpg`
- Рекомендуемый размер: 1920×1080 px
- Формат: JPG, PNG
- Используется на главном экране

**Логотип:**
- Путь: `resources/logos/trimira-logo.png`
- Рекомендуемый размер: 512×512 px (прозрачный фон)
- Формат: PNG
- Используется в заголовке и на экране логина

**Иконка приложения:**
- Путь: `resources/icons/app-icon.ico`
- Требования: Windows ICO файл (256×256, 128×128, 64×64, 32×32, 16×16)
- Используется как иконка .exe файла

**Иконка PNG (опционально):**
- Путь: `resources/icons/app-icon.png`
- Размер: 256×256 px
- Используется в UI лаунчера

### 2. Создай папки (если их нет)

```bash
mkdir resources\backgrounds
mkdir resources\logos
mkdir resources\icons
```

### 3. Закинь файлы

Просто скопируй свои ассеты в соответствующие папки. Лаунчер автоматически их подхватит при следующей сборке.

### 4. Пересобери лаунчер

```bash
npm run build
```

Готово! Теперь лаунчер использует твои ассеты.

---

## Настройка CDN (GitHub Releases)

### Вариант 1: GitHub Releases (рекомендуется)

#### Шаг 1: Создай репозиторий

1. Создай репозиторий на GitHub: `https://github.com/trimira-project/launcher`
2. Пометь его как Private (если не хочешь, чтобы другие видели файлы)

#### Шаг 2: Измени настройки в коде

Открой `src/main/services/FileManager.ts:7` и измени URL:

```typescript
private manifestUrl = 'https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/releases/latest';
```

Замени `YOUR_USERNAME` и `YOUR_REPO` на свои.

#### Шаг 3: Создай первый Release

1. Перейди в раздел "Releases" на GitHub
2. Нажми "Create a new release"
3. Тег версии: `v1.0.0`
4. Название: `Trimira Client v1.0.0`
5. Загрузи файлы (см. следующий раздел)

### Вариант 2: Свой сервер / CDN

Если хочешь использовать свой сервер:

1. Открой `src/main/services/FileManager.ts:7`
2. Измени на прямой URL к manifest.json:

```typescript
private manifestUrl = 'https://cdn.trimira.ru/manifest.json';
```

3. Залей файлы на свой сервер в структуре:

```
cdn.trimira.ru/
├── manifest.json
├── java/
├── client/
├── mods/
├── resourcepacks/
└── shaderpacks/
```

---

## Создание manifest.json

### Структура manifest.json

```json
{
  "version": "1.0.0",
  "java": {
    "name": "Java 21",
    "version": "21.0.1",
    "url": "https://github.com/YOUR_USERNAME/YOUR_REPO/releases/download/v1.0.0/jre-21-windows-x64.zip",
    "hash": "SHA256_HASH_HERE",
    "path": "java/jre-21"
  },
  "client": {
    "name": "Minecraft Client",
    "version": "1.21.1",
    "url": "https://github.com/YOUR_USERNAME/YOUR_REPO/releases/download/v1.0.0/client-1.21.1.jar",
    "hash": "SHA256_HASH_HERE",
    "path": "client.jar"
  },
  "mods": [
    {
      "name": "trimira-combat",
      "version": "1.0.0",
      "url": "https://github.com/YOUR_USERNAME/YOUR_REPO/releases/download/v1.0.0/trimira-combat-1.0.0.jar",
      "hash": "SHA256_HASH_HERE",
      "path": "mods/trimira-combat-1.0.0.jar"
    }
  ],
  "resourcepacks": [
    {
      "name": "Trimira Textures",
      "version": "1.0.0",
      "url": "https://github.com/YOUR_USERNAME/YOUR_REPO/releases/download/v1.0.0/trimira-textures.zip",
      "hash": "SHA256_HASH_HERE",
      "path": "resourcepacks/trimira-textures.zip"
    }
  ],
  "shaderpacks": []
}
```

### Генерация SHA256 хешей

**Windows (PowerShell):**
```powershell
Get-FileHash .\client-1.21.1.jar -Algorithm SHA256
```

**Linux / macOS:**
```bash
sha256sum client-1.21.1.jar
```

Скопируй полученный хеш в поле `"hash"` в manifest.json.

### Где взять файлы

**Java 21:**
- Скачай JRE 21 с [Adoptium](https://adoptium.net/temurin/releases/?version=21&os=windows&arch=x64&package=jre)
- Архивируй в `.zip` (если скачал инсталлятор, распакуй его сначала)
- Название: `jre-21-windows-x64.zip`

**Minecraft Client 1.21.1:**
- Официальный клиент: скачай из `.minecraft/versions/1.21.1/1.21.1.jar`
- Или используй Fabric установщик: `fabric-loader-0.15.0-1.21.1.jar`

**Моды:**
- Собери свои моды: `./gradlew build` в `trimira-combat` и `trimira-magic`
- Возьми `.jar` файлы из `build/libs/`

**Ресурспаки / Шейдеры:**
- Свои текстурпаки (.zip архивы)
- Complementary Shaders или другие (скачай с CurseForge / Modrinth)

---

## Обновление контента

### Когда выходит новая версия мода/текстур:

#### Шаг 1: Собери новую версию

```bash
cd trimira-combat
./gradlew build
# Файл появится в build/libs/trimira-combat-1.1.0.jar
```

#### Шаг 2: Посчитай SHA256

```powershell
Get-FileHash .\trimira-combat-1.1.0.jar -Algorithm SHA256
```

#### Шаг 3: Обнови manifest.json

Измени версию и хеш:

```json
{
  "name": "trimira-combat",
  "version": "1.1.0",  // ← Новая версия
  "url": "https://github.com/.../trimira-combat-1.1.0.jar",
  "hash": "новый_sha256_хеш",
  "path": "mods/trimira-combat-1.1.0.jar"
}
```

#### Шаг 4: Создай новый Release

1. GitHub → Releases → "Create a new release"
2. Тег: `v1.1.0`
3. Загрузи:
   - `manifest.json` (обновлённый)
   - `trimira-combat-1.1.0.jar` (новый файл)
4. Опубликуй Release

#### Шаг 5: Готово!

При следующем запуске лаунчер автоматически:
- Проверит `manifest.json`
- Увидит новую версию
- Скачает обновление
- Проверит хеш

Пользователь просто нажимает "Играть" — всё происходит автоматически.

---

## Релиз лаунчера

### Когда нужно обновить сам лаунчер (не контент):

#### Шаг 1: Поднять версию

```bash
npm version patch   # 1.0.0 → 1.0.1
# или
npm version minor   # 1.0.0 → 1.1.0
# или
npm version major   # 1.0.0 → 2.0.0
```

Эта команда обновит `package.json` и создаст git commit + tag.

#### Шаг 2: Собрать установщик

```bash
npm run build
```

После сборки появится файл:
- Windows: `dist/Trimira-Setup-1.0.1.exe`

#### Шаг 3: Создать Release на GitHub

1. Перейди в раздел Releases
2. "Create a new release"
3. Тег: `launcher-v1.0.1` (чтобы не путать с релизами контента)
4. Загрузи `Trimira-Setup-1.0.1.exe`
5. Опубликуй

#### Шаг 4: Автообновление

При следующем запуске лаунчер:
- Проверит наличие новой версии
- Покажет уведомление "Обновление доступно"
- Скачает в фоне
- Предложит перезапуститься

Пользователю не нужно ничего качать вручную!

### Настройка автообновления (если не работает)

Открой `src/main/services/UpdateChecker.ts:7-10` и измени:

```typescript
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'YOUR_USERNAME',        // ← Твой GitHub username
  repo: 'launcher'               // ← Название репозитория
});
```

---

## Тестирование

### Локальное тестирование (разработка)

```bash
npm run dev
```

Откроется окно лаунчера с hot-reload. Изменения в коде применяются мгновенно.

### Тестирование сборки

```bash
npm run build
cd dist
.\Trimira-Setup-1.0.0.exe
```

Установи лаунчер как обычную программу и протестируй:
1. Регистрацию
2. Логин
3. Скачивание файлов (проверь прогресс-бар)
4. Запуск игры

### Проверка хешей

Лаунчер проверяет SHA256 каждого файла. Если хеш не совпадает:
- Файл удаляется
- Появляется ошибка "Hash mismatch for ..."
- Нужно перекачать файл

**Как исправить:**
1. Пересчитай хеш заново
2. Обнови `manifest.json`
3. Создай новый Release

---

## Частые вопросы

### Q: Где лаунчер хранит файлы игры?

**A:** В `%APPDATA%/trimira-launcher/game/`:
```
C:\Users\ИМЯ_ПОЛЬЗОВАТЕЛЯ\AppData\Roaming\trimira-launcher\game\
├── java/
├── client.jar
├── mods/
├── resourcepacks/
└── shaderpacks/
```

### Q: Как изменить объём RAM для игры?

**A:** Открой `src/renderer/screens/MainScreen.tsx:46`:

```typescript
const result = await window.electron.invoke('game:launch', {
  username: user.username,
  ram: 8192  // ← Измени на нужное значение (в мегабайтах)
});
```

Или добавь слайдер в настройках (позже).

### Q: Как добавить больше модов?

**A:** В `manifest.json` добавь в массив `"mods"`:

```json
"mods": [
  {
    "name": "mod-1",
    "version": "1.0.0",
    "url": "...",
    "hash": "...",
    "path": "mods/mod-1.jar"
  },
  {
    "name": "mod-2",
    "version": "1.0.0",
    "url": "...",
    "hash": "...",
    "path": "mods/mod-2.jar"
  }
]
```

Лаунчер скачает все автоматически.

### Q: Можно ли использовать без GitHub?

**A:** Да! Используй любой CDN или свой сервер:

1. Залей файлы на сервер
2. Создай `manifest.json` с прямыми ссылками
3. Открой `src/main/services/FileManager.ts:7`
4. Измени URL на свой

### Q: Лаунчер не запускает игру

**A:** Проверь:
1. Java скачана? Проверь `%APPDATA%/trimira-launcher/game/java/`
2. `client.jar` существует?
3. Логи: открой DevTools (Ctrl+Shift+I в dev режиме)
4. Правильный ли путь к серверу? (`play.trimira.ru:25565`)

### Q: Как изменить адрес сервера?

**A:** Открой `src/main/services/MinecraftLauncher.ts:28`:

```typescript
'--server', 'play.trimira.ru',  // ← Твой IP
'--port', '25565'                // ← Твой порт
```

### Q: Ошибка "Hash mismatch"

**A:** Хеш в `manifest.json` не совпадает с реальным файлом:

1. Пересчитай хеш:
   ```powershell
   Get-FileHash файл.jar -Algorithm SHA256
   ```
2. Обнови `manifest.json`
3. Создай новый Release с исправленным манифестом

### Q: Как добавить кастомный шрифт?

**A:** 
1. Положи `.ttf` в `resources/fonts/`
2. Открой `tailwind.config.js:10`:
   ```javascript
   fontFamily: {
     fantasy: ['CustomFont', 'system-ui'],
   }
   ```
3. В `globals.css` добавь:
   ```css
   @font-face {
     font-family: 'CustomFont';
     src: url('../resources/fonts/custom.ttf');
   }
   ```

### Q: Лаунчер слишком большой (>200 MB)

**A:** Electron приложения весят ~150-200 MB из-за встроенного Chromium. Это нормально.

Если нужен лёгкий лаунчер:
- Перепиши на Tauri (Rust + WebView, ~10-15 MB)
- Но это отдельный проект (6-8 часов работы)

---

## Быстрая шпаргалка

### Добавить ассеты
```bash
# Закинь файлы в resources/
npm run build
```

### Обновить контент
```json
// Измени manifest.json
// Создай Release на GitHub
```

### Обновить лаунчер
```bash
npm version patch
npm run build
# Загрузи .exe на GitHub Releases
```

### Запустить локально
```bash
npm run dev
```

### Собрать .exe
```bash
npm run build
# Файл в dist/Trimira-Setup-X.X.X.exe
```

---

## Контакты и поддержка

Если что-то не работает:
1. Проверь логи в DevTools (Ctrl+Shift+I)
2. Проверь `manifest.json` на правильность JSON
3. Проверь хеши файлов
4. Убедись, что Release опубликован (не Draft)

**Готово! Лаунчер настроен и работает.**
