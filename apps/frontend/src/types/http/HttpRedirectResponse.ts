import { HttpStatus } from '@/types/http/HttpStatus';

export interface HttpRedirectResponse {
  url: string;
  statusCode: HttpStatus;
}
