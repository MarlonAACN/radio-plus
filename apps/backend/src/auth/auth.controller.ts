import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpRedirectResponse,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { RequestError } from '@/util/Error';
import { AuthPayloadDto, RefreshTokenDto } from '@/auth/dto';
import { Response } from 'express';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @Redirect(
    'https://accounts.spotify.com/authorize',
    HttpStatus.MOVED_PERMANENTLY
  )
  auth(): HttpRedirectResponse {
    return this.authService.auth();
  }

  @Redirect(process.env.APP_ORIGIN_URL, HttpStatus.MOVED_PERMANENTLY)
  @Get('callback')
  callback(
    @Query() payload: AuthPayloadDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<HttpRedirectResponse> {
    return this.authService
      .callback(payload.code, response)
      .then((redirect: HttpRedirectResponse) => {
        return redirect;
      })
      .catch((err: RequestError) => {
        throw new HttpException(
          {
            status: err.status,
            message: err.message,
          },
          err.status
        );
      });
  }

  @Post('refresh')
  refreshToken(
    @Body() token: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<Spotify.AuthToken> {
    return this.authService
      .refreshToken(token.refreshToken, response)
      .then((token: Spotify.AuthToken) => {
        return token;
      })
      .catch((err: RequestError) => {
        throw new HttpException(
          {
            status: err.status,
            message: err.message,
          },
          err.status
        );
      });
  }
}
