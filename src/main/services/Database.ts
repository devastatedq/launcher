import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import crypto from 'crypto';
import { User } from '@/shared/types';

export class AuthDatabase {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'launcher.db');
    this.db = new Database(dbPath);
    this.init();
  }

  private init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        token TEXT,
        last_login DATETIME
      )
    `);
  }

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  register(username: string, password: string): boolean {
    try {
      const hash = this.hashPassword(password);
      this.db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, hash);
      return true;
    } catch {
      return false;
    }
  }

  login(username: string, password: string): User | null {
    const hash = this.hashPassword(password);
    const user = this.db.prepare('SELECT id, username, token FROM users WHERE username = ? AND password_hash = ?')
      .get(username, hash) as User | undefined;

    if (!user) return null;

    this.db.prepare('UPDATE users SET last_login = ? WHERE id = ?')
      .run(new Date().toISOString(), user.id);

    return user;
  }

  close() {
    this.db.close();
  }
}
