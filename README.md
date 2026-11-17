# Trimira Launcher

Кастомный лаунчер для Minecraft проекта Trimira.

## Быстрый старт

### Запуск для разработки
```bash
npm run dev
```

### Сборка установщика
```bash
npm run build
# Результат: dist/Trimira-Setup-1.0.0.exe
```

## Настройка перед релизом

### 1. Добавь ассеты

Закинь файлы в папки:
- `resources/backgrounds/main-bg.jpg` — фон главного экрана (1920×1080)
- `resources/logos/trimira-logo.png` — логотип (512×512, прозрачный)
- `resources/icons/app-icon.ico` — иконка приложения (Windows ICO)

### 2. Настрой GitHub Releases

Открой `src/main/services/FileManager.ts:7` и измени:
```typescript
private manifestUrl = 'https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/releases/latest';
```

### 3. Создай manifest.json

Скопируй `manifest.example.json` → `manifest.json` и заполни:
- URL файлов (Java, клиент, моды)
- SHA256 хеши (команда ниже)

**Генерация хешей:**
```powershell
Get-FileHash .\client.jar -Algorithm SHA256
```

### 4. Создай Release на GitHub

1. Перейди в раздел Releases
2. "Create a new release"
3. Тег: `v1.0.0`
4. Загрузи файлы:
   - `manifest.json`
   - `jre-21-windows-x64.zip`
   - `client-1.21.1.jar`
   - `trimira-combat-1.0.0.jar`
   - Другие моды/текстуры

## Команды

```bash
npm run dev       # Запуск в режиме разработки
npm run build     # Сборка .exe установщика
npm run preview   # Предпросмотр production билда
```

## Структура проекта

```
trimira-launcher/
├── src/
│   ├── main/          # Backend (Electron + Node.js)
│   ├── renderer/      # Frontend (React)
│   ├── preload/       # Electron bridge
│   └── shared/        # Типы
├── resources/         # ⭐ АССЕТЫ (фоны, логотип, иконка)
├── dist/             # Собранный .exe
├── TUTORIAL.md       # Полная инструкция
└── config.json       # Настройки (сервер, RAM)
```

## Полная документация

См. **`TUTORIAL.md`** — там всё про:
- Добавление ассетов
- Настройку CDN
- Обновление контента
- Релиз новых версий
- FAQ

## Технологии

- **Electron 28** — десктопное приложение
- **React 19** — UI
- **TypeScript** — типизация
- **Tailwind CSS** — стилизация
- **better-sqlite3** — локальная БД (авторизация)
- **electron-updater** — автообновление

## Системные требования

- Windows 10/11
- Node.js 18+
- npm 9+

---

**Готов к запуску:** `npm run dev`
