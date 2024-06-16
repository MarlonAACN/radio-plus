import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import { SupportedCookies } from '@/constants/SupportedCookies';
import { AuthRequest } from '@/types/misc/AuthRequest';
import { logger } from '@/util/Logger';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  use(req: AuthRequest, res: Response, next: NextFunction) {
    const accessTokenCookie = req.cookies[SupportedCookies.accessToken];
    const refreshTokenCookie = req.cookies[SupportedCookies.refreshToken];

    if (accessTokenCookie) {
      logger.log(
        '[AuthMiddleware] Request is authenticated with spotify access token.'
      );

      req.accessToken = accessTokenCookie;
      return next();
    }

    if (refreshTokenCookie) {
      return this.authService
        .refreshToken(refreshTokenCookie, res)
        .then((authToken: Spotify.AuthToken) => {
          logger.log(
            '[AuthMiddleware] Successfully refreshed spotify token set and updated set-Cookie header.'
          );

          req.accessToken = authToken.access_token;
          return next();
        })
        .catch(() => {
          logger.error(
            '[AuthMiddleware] Failed to refresh spotify token set, request is unauthorized.'
          );

          throw new HttpException(
            {
              status: HttpStatus.UNAUTHORIZED,
              message: 'Unauthorized',
            },
            HttpStatus.UNAUTHORIZED
          );
        });
    }

    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}
