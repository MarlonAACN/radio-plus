import { HttpStatus } from '@nestjs/common';

/**
 * Error object to generalize thrown error objects, mostly associated with request handling.
 */
class RequestError extends Error {
  public status: HttpStatus;

  constructor(status: HttpStatus, message: string) {
    super(message);
    this.name = 'RequestError';
    this.status = status;
  }
}

export { RequestError };
