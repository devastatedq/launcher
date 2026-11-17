const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const fs = require('fs');

let mainWindow = null;
let db = null;
let logger = null;
let lastUpdateState = null;

function sendUpdate(payload) {
  lastUpdateState = payload;
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('launcher:update', payload);
  }
}

function setupAutoUpdater() {
  if (!app.isPackaged) {
    if (logger) logger.info('Автообновление отключено в dev-режиме');
    return;
  }

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => sendUpdate({ state: 'checking' }));
  autoUpdater.on('update-available', (info) =>
    sendUpdate({ state: 'available', version: info.version }));
  autoUpdater.on('update-not-available', () => sendUpdate({ state: 'none' }));
  autoUpdater.on('download-progress', (p) =>
    sendUpdate({ state: 'downloading', percent: Math.round(p.percent) }));
  autoUpdater.on('update-downloaded', (info) =>
    sendUpdate({ state: 'ready', version: info.version }));
  autoUpdater.on('error', (err) => {
    if (logger) logger.warn('Ошибка автообновления', { message: String(err) });
  });

  autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 30 * 60 * 1000);
}

// Инициализация логгера
function initLogger() {
  const LOG_DIR = path.join(app.getPath('userData'), 'logs');
  const LOG_FILE = path.join(LOG_DIR, `launcher-${new Date().toISOString().split('T')[0]}.log`);

  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

  logger = {
    log: (level, message, data = {}) => {
      const timestamp = new Date().toISOString();
      const logLine = `[${timestamp}] [${level}] ${message} ${JSON.stringify(data)}\n`;
      fs.appendFileSync(LOG_FILE, logLine);
      console.log(logLine.trim());
    },
    info: (msg, data) => logger.log('INFO', msg, data),
    warn: (msg, data) => logger.log('WARN', msg, data),
    error: (msg, data) => logger.log('ERROR', msg, data)
  };
}

function appIconPath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'resources', 'icons', 'launcher.ico')
    : path.join(__dirname, '..', 'resources', 'icons', 'launcher.ico');
}

function createWindow() {
  initLogger();
  logger.info('Создание главного окна');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 600,
    icon: appIconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    frame: false,
    backgroundColor: '#070a10',
    autoHideMenuBar: true,
    show: false
  });

  // Определить URL для загрузки
  let startURL;

  if (app.isPackaged) {
    // Production: загружаем из файловой системы
    // В упакованном приложении структура:
    // resources/app.asar/dist-electron/main.js (это __dirname)
    // resources/app.asar/dist/index.html (это куда нам нужно)
    startURL = `file://${path.join(__dirname, '..', 'dist', 'index.html')}`;
    logger.info('Production mode', {
      isPackaged: true,
      appPath: app.getAppPath(),
      dirname: __dirname,
      startURL
    });
  } else {
    // Development: загружаем с Vite dev server
    startURL = 'http://localhost:5173';
    logger.info('Development mode', { startURL });
  }

  logger.info('Loading URL', { url: startURL });

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => {
    logger.info('Window ready to show');
    mainWindow.show();

    // Открыть DevTools только в dev режиме
    if (!app.isPackaged) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    logger.error('Failed to load URL', {
      errorCode,
      errorDescription,
      validatedURL
    });
  });

  mainWindow.on('closed', () => {
    logger.info('Window closed');
    mainWindow = null;
  });
}

function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'launcher.db');
  db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      last_login DATETIME
    )
  `);
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function registerUser(username, password) {
  try {
    const hash = hashPassword(password);
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, hash);
    return true;
  } catch {
    return false;
  }
}

function loginUser(username, password) {
  const hash = hashPassword(password);
  const user = db.prepare('SELECT id, username FROM users WHERE username = ? AND password_hash = ?')
    .get(username, hash);

  if (!user) return null;

  db.prepare('UPDATE users SET last_login = ? WHERE id = ?')
    .run(new Date().toISOString(), user.id);

  return user;
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  // Даём окну загрузиться, затем проверяем обновления (только packaged).
  setTimeout(setupAutoUpdater, 5000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close();
    app.quit();
  }
});

ipcMain.handle('auth:login', async (_event, { username, password }) => {
  if (logger) logger.info('Попытка входа', { username });
  const user = loginUser(username, password);
  if (user) {
    if (logger) logger.info('Вход успешен', { username });
    return { success: true, user };
  }
  if (logger) logger.warn('Неверный логин или пароль', { username });
  return { success: false, error: 'Неверный логин или пароль' };
});

ipcMain.handle('auth:register', async (_event, { username, password }) => {
  if (logger) logger.info('Попытка регистрации', { username });
  const success = registerUser(username, password);
  if (success) {
    if (logger) logger.info('Регистрация успешна', { username });
    return { success: true };
  }
  if (logger) logger.warn('Пользователь уже существует', { username });
  return { success: false, error: 'Пользователь уже существует' };
});

ipcMain.handle('game:download', async () => {
  if (logger) logger.info('Начало скачивания файлов');
  if (!mainWindow) return { success: false, error: 'Окно не найдено' };

  setTimeout(() => {
    mainWindow.webContents.send('download:progress', {
      fileName: 'demo',
      progress: 100,
      status: 'Демо режим - файлы не скачиваются'
    });
  }, 1000);

  if (logger) logger.info('Демо загрузка завершена');
  return { success: true };
});

ipcMain.handle('game:launch', async (_event, { username, ram }) => {
  if (logger) logger.info('Запуск игры', { username, ram });
  console.log(`Запуск игры для ${username} с ${ram}MB RAM`);
  return { success: true };
});

ipcMain.handle('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window:toggle-maximize', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});

ipcMain.handle('app:version', () => app.getVersion());

const ASSET_RE = /^(frames|logos|icons|ui|news)\/[A-Za-z0-9._-]+\.(png|jpg|jpeg|webp)$/;

ipcMain.handle('assets:load', async (_event, rel) => {
  try {
    if (typeof rel !== 'string' || !ASSET_RE.test(rel)) return null;
    const root = app.isPackaged
      ? path.join(process.resourcesPath, 'resources')
      : path.join(__dirname, '..', 'resources');
    const full = path.join(root, rel);
    const data = await fs.promises.readFile(full);
    const ext = path.extname(full).toLowerCase();
    const mime = ext === '.jpg' || ext === '.jpeg'
      ? 'image/jpeg'
      : ext === '.webp'
        ? 'image/webp'
        : 'image/png';
    return `data:${mime};base64,${data.toString('base64')}`;
  } catch {
    return null;
  }
});

ipcMain.handle('launcher:update-state', () => lastUpdateState);

ipcMain.handle('launcher:update-check', () => {
  if (app.isPackaged) autoUpdater.checkForUpdates().catch(() => {});
});

ipcMain.handle('launcher:update-restart', () => {
  if (app.isPackaged) autoUpdater.quitAndInstall(false, true);
});
