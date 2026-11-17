import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import { dialog } from 'electron';

export class UpdateChecker {
  constructor() {
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'devastatedq',
      repo: 'launcher'
    });

    autoUpdater.on('update-available', () => {
      dialog.showMessageBox({
        title: 'Обновление доступно',
        message: 'Новая версия лаунчера загружается в фоне...',
        type: 'info'
      });
    });

    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        title: 'Обновление готово',
        message: 'Перезапустить лаунчер сейчас?',
        type: 'question',
        buttons: ['Да', 'Позже']
      }).then(result => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });

    autoUpdater.on('error', (error) => {
      console.error('Update error:', error);
    });
  }

  check() {
    autoUpdater.checkForUpdates();
  }
}
