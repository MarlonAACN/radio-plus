import { Request } from 'express';

type AuthRequest = {
  accessToken: string;
} & Request;

export type { AuthRequest };
