import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { AuthDatabase } from './services/Database';
import { FileManager } from './services/FileManager';
import { MinecraftLauncher } from './services/MinecraftLauncher';
import { UpdateChecker } from './services/UpdateChecker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let db: AuthDatabase;
let fileManager: FileManager;
let updateChecker: UpdateChecker;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    frame: true,
    titleBarStyle: 'default',
    autoHideMenuBar: true,
    show: false
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../index.html'));
  }

  mainWindow.show();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  db = new AuthDatabase();
  fileManager = new FileManager();
  updateChecker = new UpdateChecker();

  createWindow();
  updateChecker.check();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.close();
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('auth:login', async (_event, { username, password }) => {
  const user = db.login(username, password);
  if (user) {
    return { success: true, user };
  }
  return { success: false, error: 'Неверный логин или пароль' };
});

ipcMain.handle('auth:register', async (_event, { username, password }) => {
  const success = db.register(username, password);
  if (success) {
    return { success: true };
  }
  return { success: false, error: 'Пользователь уже существует' };
});

ipcMain.handle('game:check-updates', async () => {
  const manifest = await fileManager.checkUpdates();
  return manifest;
});

ipcMain.handle('game:download', async () => {
  if (!mainWindow) return;

  const manifest = await fileManager.checkUpdates();
  if (!manifest) {
    return { success: false, error: 'Не удалось получить список файлов' };
  }

  try {
    const files = [
      manifest.java,
      manifest.client,
      ...manifest.mods,
      ...manifest.resourcepacks,
      ...manifest.shaderpacks
    ];

    for (const file of files) {
      await fileManager.downloadFile(file, mainWindow);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('game:launch', async (_event, { username, ram }) => {
  if (!mainWindow) return;

  const gameDir = fileManager.getGameDir();
  const launcher = new MinecraftLauncher(gameDir, ram || 8192);

  try {
    await launcher.launch(username, mainWindow);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});
