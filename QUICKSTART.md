# Быстрая шпаргалка

## Запуск
```bash
npm run dev
```

## Сборка
```bash
npm run build
# Файл: dist/Trimira-Setup-1.0.0.exe
```

## Обновление версии
```bash
npm version patch   # 1.0.0 → 1.0.1
npm run build
```

## Генерация SHA256 хеша
```powershell
Get-FileHash .\файл.jar -Algorithm SHA256
```

## Добавление ассетов
1. Закинь файлы в `resources/backgrounds/`, `resources/logos/`, `resources/icons/`
2. `npm run build`

## Настройка GitHub Releases
1. Измени URL в `src/main/services/FileManager.ts:7`
2. Создай Release с тегом `v1.0.0`
3. Загрузи `manifest.json` и все файлы

## Обновление контента
1. Измени `manifest.json` (версию + хеш)
2. Создай новый Release
3. Лаунчер автоматически скачает обновление

---

**Полная документация:** `TUTORIAL.md`
