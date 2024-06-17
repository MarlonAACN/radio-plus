import { HttpStatus } from '@nestjs/common';

type Error = ErrorConstructor & {
  status: number;
  message: string;
};

class RadioPlusError extends Error {
  public code: HttpStatus;

  constructor(code: HttpStatus, message: string) {
    super(message);
    this.name = 'RadioPlusError';
    this.code = code;
  }
}

export type { Error };
export { RadioPlusError };
