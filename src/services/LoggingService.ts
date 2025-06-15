export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

class LoggingService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandling();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private setupGlobalErrorHandling(): void {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });

    // Catch JavaScript errors
    window.addEventListener('error', (event) => {
      this.error('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error
      });
    });
  }

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    data?: any
  ): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output in development
    if (process.env.NODE_ENV === 'development') {
      console[entry.level === 'error' ? 'error' : 'log'](
        `[${entry.level.toUpperCase()}] ${entry.message}`,
        entry.data
      );
    }

    // Store in localStorage for persistence
    this.persistLogs();
  }

  private persistLogs(): void {
    try {
      const recentLogs = this.logs.slice(-100); // Store only recent logs
      localStorage.setItem('pos_logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.warn('Failed to persist logs to localStorage:', error);
    }
  }

  public info(message: string, data?: any): void {
    this.addLog(this.createLogEntry('info', message, data));
  }

  public warn(message: string, data?: any): void {
    this.addLog(this.createLogEntry('warn', message, data));
  }

  public error(message: string, data?: any): void {
    this.addLog(this.createLogEntry('error', message, data));
  }

  public debug(message: string, data?: any): void {
    this.addLog(this.createLogEntry('debug', message, data));
  }

  public getLogs(level?: LogEntry['level']): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  public clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('pos_logs');
  }

  public getLogsSummary(): {
    total: number;
    errors: number;
    warnings: number;
    lastError?: LogEntry;
  } {
    const errors = this.logs.filter(log => log.level === 'error');
    const warnings = this.logs.filter(log => log.level === 'warn');
    
    return {
      total: this.logs.length,
      errors: errors.length,
      warnings: warnings.length,
      lastError: errors[errors.length - 1]
    };
  }

  // Load persisted logs on initialization
  public loadPersistedLogs(): void {
    try {
      const stored = localStorage.getItem('pos_logs');
      if (stored) {
        const logs = JSON.parse(stored);
        this.logs = Array.isArray(logs) ? logs : [];
      }
    } catch (error) {
      console.warn('Failed to load persisted logs:', error);
    }
  }
}

const loggingService = new LoggingService();
loggingService.loadPersistedLogs();

export default loggingService;
