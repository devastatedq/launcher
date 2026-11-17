import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import https from 'https';
import crypto from 'crypto';
import { Manifest, ManifestFile } from '@/shared/types';

export class FileManager {
  private manifestUrl = 'https://api.github.com/repos/devastatedq/launcher/releases/latest';
  private localDir: string;

  constructor() {
    this.localDir = path.join(app.getPath('userData'), 'game');
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [
      this.localDir,
      path.join(this.localDir, 'java'),
      path.join(this.localDir, 'mods'),
      path.join(this.localDir, 'resourcepacks'),
      path.join(this.localDir, 'shaderpacks'),
      path.join(this.localDir, 'libraries'),
      path.join(this.localDir, 'natives')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async checkUpdates(): Promise<Manifest | null> {
    try {
      const response = await this.fetch(this.manifestUrl);
      const release = JSON.parse(response);

      const manifestAsset = release.assets.find((a: any) => a.name === 'manifest.json');
      if (!manifestAsset) return null;

      const manifestData = await this.fetch(manifestAsset.browser_download_url);
      return JSON.parse(manifestData);
    } catch (error) {
      console.error('Failed to check updates:', error);
      return null;
    }
  }

  async downloadFile(file: ManifestFile, window: BrowserWindow): Promise<void> {
    const filePath = path.join(this.localDir, file.path);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
      const existingHash = await this.calculateHash(filePath);
      if (existingHash === file.hash) {
        window.webContents.send('download:progress', {
          fileName: file.name,
          progress: 100,
          status: `${file.name} актуален`
        });
        return;
      }
    }

    return new Promise((resolve, reject) => {
      https.get(file.url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          https.get(response.headers.location!, (redirectResponse) => {
            this.handleDownload(redirectResponse, filePath, file, window, resolve, reject);
          });
        } else {
          this.handleDownload(response, filePath, file, window, resolve, reject);
        }
      }).on('error', reject);
    });
  }

  private handleDownload(
    response: any,
    filePath: string,
    file: ManifestFile,
    window: BrowserWindow,
    resolve: () => void,
    reject: (error: Error) => void
  ) {
    const total = parseInt(response.headers['content-length'] || '0');
    let downloaded = 0;

    const writer = fs.createWriteStream(filePath);

    response.on('data', (chunk: Buffer) => {
      writer.write(chunk);
      downloaded += chunk.length;
      const progress = (downloaded / total) * 100;

      window.webContents.send('download:progress', {
        fileName: file.name,
        progress: Math.round(progress),
        status: `Загрузка ${file.name}... ${Math.round(progress)}%`
      });
    });

    response.on('end', async () => {
      writer.close();

      const downloadedHash = await this.calculateHash(filePath);
      if (downloadedHash !== file.hash) {
        fs.unlinkSync(filePath);
        reject(new Error(`Hash mismatch for ${file.name}`));
      } else {
        window.webContents.send('download:progress', {
          fileName: file.name,
          progress: 100,
          status: `${file.name} загружен`
        });
        resolve();
      }
    });

    response.on('error', reject);
  }

  private async calculateHash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('data', data => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  private fetch(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      https.get(url, {
        headers: {
          'User-Agent': 'Trimira-Launcher'
        }
      }, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  getGameDir(): string {
    return this.localDir;
  }
}
