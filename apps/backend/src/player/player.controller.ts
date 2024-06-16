import { Body, Controller, HttpException, Put, Req } from '@nestjs/common';

import { SeekPositionDto, TransferPlaybackDto } from '@/player/dto';
import { PlayerService } from '@/player/player.service';
import { AuthRequest } from '@/types/misc/AuthRequest';
import { RequestError } from '@/util/Error';

@Controller({
  version: '1',
  path: 'player',
})
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Put()
  transferPlayback(
    @Body() dto: TransferPlaybackDto,
    @Req() request: AuthRequest
  ): Promise<void> {
    return this.playerService
      .transferPlayback(dto.deviceId, request.accessToken)
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

  @Put('seek')
  seekPosition(
    @Body() dto: SeekPositionDto,
    @Req() request: AuthRequest
  ): Promise<void> {
    return this.playerService
      .seekPosition(dto.position, dto.deviceId, request.accessToken)
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
}
