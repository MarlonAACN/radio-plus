import {
  Body,
  Controller,
  HttpException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AlgoService } from '@/algo/algo.service';
import { RunAlgorithmDto } from '@/algo/dto';
import { SupportedCookies } from '@/constants/SupportedCookies';
import { AuthRequest } from '@/types/misc/AuthRequest';
import { RadioPlus } from '@/types/RadioPlus';
import { RequestError } from '@/util/Error';

@Controller({
  version: '1',
  path: 'algorithm',
})
export class AlgoController {
  constructor(private algoService: AlgoService) {}

  @Post()
  runAlgorithm(
    @Body() dto: RunAlgorithmDto,
    @Req() request: AuthRequest,
    @Res({ passthrough: true }) response: Response
  ): Promise<RadioPlus.AlgorithmResponse> {
    const playlistIdCookie =
      request.cookies[SupportedCookies.sessionPlaylistId];

    console.log(dto);
    return Promise.resolve({
      playlistUrl: 'http://www.google.com',
    });

    return this.algoService
      .runAlgorithm(
        dto.originTrackId,
        playlistIdCookie ?? null,
        dto.user,
        request.accessToken,
        dto.deviceId,
        response,
        dto.freshTracks,
        dto.selectedGenres,
        dto.bpm
      )
      .then((playlistUrl) => {
        return playlistUrl;
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
