import { LOG_LEVEL } from '@/constants';
import { LogLevel } from '@/types/misc/LogLevel';

interface LogFn {
  (message?: any, ...optionalParams: any[]): void;
}

export interface Logger {
  log: LogFn;
  warn: LogFn;
  error: LogFn;
}

const NO_OP: LogFn = (_message?: any, ..._optionalParams: any[]) => undefined;

class ConsoleLogger implements Logger {
  readonly log: LogFn;
  readonly warn: LogFn;
  readonly error: LogFn;

  constructor(options?: { level?: LogLevel }) {
    const { level } = options || {};

    this.error = console.error.bind(console);
    this.warn = NO_OP;
    this.log = NO_OP;

    switch (level) {
      case 'warn':
        this.warn = console.warn.bind(console);
        break;
      case 'log':
        this.warn = console.warn.bind(console);
        this.log = console.log.bind(console);
        break;
    }
  }

  disable() {
    Object.defineProperty(this, 'error', {
      value: NO_OP,
    });
    Object.defineProperty(this, 'warn', {
      value: NO_OP,
    });
    Object.defineProperty(this, 'log', {
      value: NO_OP,
    });
  }

  enable() {
    Object.defineProperty(this, 'error', {
      value: console.error.bind(console),
    });
    Object.defineProperty(this, 'warn', {
      value: console.warn.bind(console),
    });
    Object.defineProperty(this, 'log', {
      value: console.log.bind(console),
    });
  }
}

export const logger = new ConsoleLogger({ level: LOG_LEVEL });
