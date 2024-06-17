import { Body, Controller, HttpException, Post, Req } from '@nestjs/common';

import { AlgoService } from '@/algo/algo.service';
import { InitAlgorithmDto, UpdateQueueDto } from '@/algo/dto';
import { AuthRequest } from '@/types/misc/AuthRequest';
import { RequestError } from '@/util/Error';

@Controller({
  version: '1',
  path: 'algorithm',
})
export class AlgoController {
  constructor(private algoService: AlgoService) {}

  @Post()
  initAlgorithm(
    @Body() dto: InitAlgorithmDto,
    @Req() request: AuthRequest
  ): Promise<void> {
    return this.algoService
      .initAlgorithm(
        dto.originTrackId,
        dto.user,
        dto.deviceId,
        request.accessToken
      )
      .then(() => {
        return;
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

  @Post('queue')
  updateQueue(
    @Body() dto: UpdateQueueDto,
    @Req() request: AuthRequest
  ): Promise<{ trackId: string }> {
    return this.algoService
      .updateQueue(
        dto.originTrackId,
        dto.freshTracks,
        dto.user,
        dto.deviceId,
        request.accessToken
      )
      .then((trackId) => {
        return { trackId: trackId };
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
