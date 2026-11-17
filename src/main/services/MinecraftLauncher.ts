import { spawn } from 'child_process';
import { BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';

export class MinecraftLauncher {
  private javaPath: string;
  private gamePath: string;
  private ramAllocation: number;

  constructor(gamePath: string, ramAllocation: number = 8192) {
    this.gamePath = gamePath;
    this.javaPath = path.join(gamePath, 'java', 'bin', 'java.exe');
    this.ramAllocation = ramAllocation;
  }

  async launch(username: string, window: BrowserWindow): Promise<void> {
    const args = [
      `-Xmx${this.ramAllocation}M`,
      `-Xms2048M`,
      `-Djava.library.path=${path.join(this.gamePath, 'natives')}`,
      '-cp',
      this.buildClasspath(),
      'net.minecraft.client.main.Main',
      '--username', username,
      '--version', '1.21.1',
      '--gameDir', this.gamePath,
      '--assetsDir', path.join(this.gamePath, 'assets'),
      '--assetIndex', '1.21',
      '--server', 'play.trimira.ru',
      '--port', '25565'
    ];

    window.webContents.send('game:status', 'Запуск игры...');

    const gameProcess = spawn(this.javaPath, args, {
      cwd: this.gamePath,
      stdio: 'pipe'
    });

    gameProcess.stdout?.on('data', (data) => {
      console.log(`[Game] ${data.toString()}`);
    });

    gameProcess.stderr?.on('data', (data) => {
      console.error(`[Game Error] ${data.toString()}`);
    });

    gameProcess.on('exit', (code) => {
      window.webContents.send('game:exit', code);
      console.log(`Game exited with code ${code}`);
    });
  }

  private buildClasspath(): string {
    const libsDir = path.join(this.gamePath, 'libraries');
    const clientJar = path.join(this.gamePath, 'client.jar');

    const libs: string[] = [];

    if (fs.existsSync(libsDir)) {
      const files = fs.readdirSync(libsDir, { recursive: true });
      files.forEach((file) => {
        if (typeof file === 'string' && file.endsWith('.jar')) {
          libs.push(path.join(libsDir, file));
        }
      });
    }

    libs.push(clientJar);

    return libs.join(process.platform === 'win32' ? ';' : ':');
  }
}
