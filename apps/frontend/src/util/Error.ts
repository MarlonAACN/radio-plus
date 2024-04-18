import { HttpStatus } from '@nestjs/common';

/**
 * Custom error object for radio plus, which extends the Error interface
 * and adds the 'code' attribute, to be able to provide an additional httpStatus.
 */
class RadioPlusError extends Error {
  public code: HttpStatus;

  constructor(code: HttpStatus, message: string) {
    super(message);
    this.name = 'RadioPlusError';
    this.code = code;
  }
}

export { RadioPlusError };
