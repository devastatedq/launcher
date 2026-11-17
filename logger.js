const fs = require('fs');
const path = require('path');

/**
 * Система логирования для Trimira Launcher
 */

const LOG_DIR = path.join(require('electron').app.getPath('userData'), 'logs');
const LOG_FILE = path.join(LOG_DIR, `launcher-${new Date().toISOString().split('T')[0]}.log`);

class Logger {
  constructor() {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    this.cleanOldLogs();
  }

  cleanOldLogs() {
    const files = fs.readdirSync(LOG_DIR);
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    files.forEach(file => {
      const filePath = path.join(LOG_DIR, file);
      const stat = fs.statSync(filePath);

      if (stat.mtime.getTime() < sevenDaysAgo) {
        fs.unlinkSync(filePath);
      }
    });
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...data
    };

    const logLine = `[${timestamp}] [${level}] ${message} ${JSON.stringify(data)}\n`;

    fs.appendFileSync(LOG_FILE, logLine);
    console.log(logLine.trim());
  }

  info(message, data) {
    this.log('INFO', message, data);
  }

  warn(message, data) {
    this.log('WARN', message, data);
  }

  error(message, data) {
    this.log('ERROR', message, data);
  }

  debug(message, data) {
    this.log('DEBUG', message, data);
  }
}

module.exports = new Logger();
