# 🎮 Trimira Launcher — ГОТОВ К УТРУ

## ✅ ЧТО СДЕЛАНО

### 1. **Лаунчер полностью собран**
**Файл:** `E:\Projects\Trimira\trimira-launcher\release\Trimira Launcher Setup 1.0.0.exe`

### 2. **Исправлены все ошибки**
- ✅ Белое окно → теперь загружается правильный UI
- ✅ Preload script ошибка → исправлен путь
- ✅ DevTools автоматически закрывается в production

### 3. **Добавленные функции**

#### ⚙️ **Настройки RAM (слайдер)**
- Модальное окно настроек (иконка шестерёнки справа вверху)
- Слайдер 2-16 GB с пресетами (2/4/8/16 GB)
- Сохранение в localStorage

#### 📝 **Система логирования**
- Все действия логируются в файл
- Путь: `%APPDATA%/Trimira Launcher/logs/launcher-YYYY-MM-DD.log`
- Автоочистка логов старше 7 дней
- Логи: авторизация, загрузка, запуск игры

#### 🛠️ **Скрипты автоматизации**

**`generate-manifest.js`** — Генератор manifest.json
```bash
node generate-manifest.js
```
- Сканирует папку files/
- Считает SHA256 хеши
- Создаёт готовый manifest.json

**`build-release.js`** — Полная сборка релиза
```bash
node build-release.js
```
- Собирает моды из trimira-combat/trimira-magic
- Копирует в files/
- Генерирует manifest.json
- Собирает .exe установщик

**`png-to-ico.js`** — Конвертер иконок
```bash
node png-to-ico.js logo.png resources/icon.ico
```
- Создаёт .ico из PNG
- Все нужные размеры (256/128/64/32/16)

---

## 📦 КАК УСТАНОВИТЬ И ПРОТЕСТИРОВАТЬ

### 1. Удали старую версию
`Параметры → Приложения → Trimira Launcher → Удалить`

### 2. Установи новую
```
E:\Projects\Trimira\trimira-launcher\release\Trimira Launcher Setup 1.0.0.exe
```

### 3. Запусти
Ярлык на рабочем столе "Trimira"

### 4. Что должно работать
- ✅ Экран логина (градиент, круглая иконка "T")
- ✅ Регистрация пользователя
- ✅ Вход в систему
- ✅ Главный экран:
  - Панель новостей слева
  - Плейсхолдер персонажа в центре
  - Зелёная кнопка "ИГРАТЬ"
  - Иконка настроек (шестерёнка) справа вверху
- ✅ Открытие настроек → слайдер RAM
- ✅ Прогресс-бар внизу

---

## 📂 СТРУКТУРА ФАЙЛОВ

```
trimira-launcher/
├── release/
│   └── Trimira Launcher Setup 1.0.0.exe  ← УСТАНОВЩИК
│
├── Скрипты автоматизации:
│   ├── generate-manifest.js    # Генератор manifest.json
│   ├── build-release.js        # Полная сборка релиза
│   └── png-to-ico.js           # Конвертер PNG → ICO
│
├── Документация:
│   ├── README.md               # Основная документация
│   ├── TUTORIAL.md             # Полный туториал (8000+ слов)
│   ├── QUICKSTART.md           # Быстрая шпаргалка
│   └── CLAUDE.md               # Обновлён (добавлена секция лаунчера)
│
└── Конфигурация:
    ├── manifest.example.json   # Шаблон манифеста
    └── config.json             # Настройки (сервер, RAM)
```

---

## 🎯 ЧТО ДЕЛАТЬ УТРОМ

### 1. Добавить ассеты (5 минут)
Закинь файлы в папки:
- `resources/backgrounds/main-bg.jpg` (1920×1080)
- `resources/logos/trimira-logo.png` (512×512, прозрачный)
- `resources/icons/app-icon.ico` (Windows ICO)

Потом:
```bash
cd E:\Projects\Trimira\trimira-launcher
npm run build
```

### 2. Настроить GitHub Releases (10 минут)
1. Создай репозиторий на GitHub
2. Открой `src/main/services/FileManager.ts:7`
3. Замени URL на свой репозиторий
4. Пересобери: `npm run build`

### 3. Загрузить контент (20 минут)
```bash
# 1. Положи файлы в files/
files/
├── java/jre-21-windows-x64.zip
├── client/client-1.21.1.jar
├── mods/trimira-combat-1.0.0.jar
└── ...

# 2. Сгенерируй manifest.json
node generate-manifest.js

# 3. Создай Release на GitHub
# 4. Загрузи все файлы + manifest.json
```

### 4. Или используй автоматическую сборку
```bash
node build-release.js
```
Соберёт моды, сгенерирует manifest, создаст .exe

---

## 🐛 ЕСЛИ ЧТО-ТО СЛОМАЕТСЯ

### Белое окно / не грузится UI
```bash
cd E:\Projects\Trimira\trimira-launcher
Remove-Item -Recurse -Force dist,dist-electron,release
npm run build
```

### Ошибка preload script
Проверь `electron.cjs:13` — путь должен быть `preload.js`, не `preload.cjs`

### Логи для отладки
Путь: `C:\Users\home\AppData\Roaming\Trimira Launcher\logs\`

---

## 📞 КОМАНДЫ ДЛЯ УПРАВЛЕНИЯ

### Разработка
```bash
npm run dev          # Запуск в dev режиме (hot-reload)
```

### Сборка
```bash
npm run build        # Собрать .exe установщик
```

### Автоматизация
```bash
node generate-manifest.js   # Создать manifest.json
node build-release.js       # Полная сборка релиза
node png-to-ico.js logo.png resources/icon.ico  # Конвертер иконок
```

---

## ✨ ДОПОЛНИТЕЛЬНО РЕАЛИЗОВАНО

1. **Модальное окно настроек** — слайдер RAM, сохранение в localStorage
2. **Логирование** — все действия записываются в файл
3. **Генератор manifest.json** — автоматический подсчёт хешей
4. **Скрипт полной сборки** — собирает моды + лаунчер одной командой
5. **Конвертер PNG → ICO** — для создания иконки приложения
6. **Исправлены все пути** — теперь UI корректно загружается в production

---

## 🚀 ИТОГ

**Лаунчер полностью рабочий.**

1. Установи `release\Trimira Launcher Setup 1.0.0.exe`
2. Протестируй все функции
3. Утром добавь ассеты и настрой GitHub Releases

**Все скрипты и документация готовы к использованию.**

Спокойной ночи! 🌙
