import { Request } from '@/types/Better-express';

type AuthRequest = {
  accessToken: string;
} & Request;

export type { AuthRequest };
