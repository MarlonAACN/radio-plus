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
import { RadioPlusError } from '@/util/Error';
import { getHttpStatusText } from '@/util/getHttpStatusText';
import { AuthPayloadDto, RefreshTokenDto } from '@/auth/dto';
import { Response } from 'express';
import { Spotify } from '@/types/Spotify';

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
      .catch((err: RadioPlusError) => {
        throw new HttpException(
          {
            status: err.code,
            message: err.message,
            error: getHttpStatusText(err.code),
          },
          err.code
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
      .catch((err: RadioPlusError) => {
        throw new HttpException(
          {
            status: err.code,
            message: err.message,
            error: getHttpStatusText(err.code),
          },
          err.code
        );
      });
  }
}
