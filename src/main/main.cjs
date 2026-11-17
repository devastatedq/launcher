const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Database = require('better-sqlite3');
const crypto = require('crypto');

let mainWindow = null;
let db = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    },
    frame: true,
    autoHideMenuBar: true,
    show: false
  });

  const startURL = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
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
  const user = loginUser(username, password);
  if (user) {
    return { success: true, user };
  }
  return { success: false, error: 'Неверный логин или пароль' };
});

ipcMain.handle('auth:register', async (_event, { username, password }) => {
  const success = registerUser(username, password);
  if (success) {
    return { success: true };
  }
  return { success: false, error: 'Пользователь уже существует' };
});

ipcMain.handle('game:download', async () => {
  if (!mainWindow) return { success: false, error: 'Окно не найдено' };

  setTimeout(() => {
    mainWindow.webContents.send('download:progress', {
      fileName: 'demo',
      progress: 100,
      status: 'Демо режим - файлы не скачиваются'
    });
  }, 1000);

  return { success: true };
});

ipcMain.handle('game:launch', async (_event, { username }) => {
  console.log(`Запуск игры для ${username}`);
  return { success: true };
});
