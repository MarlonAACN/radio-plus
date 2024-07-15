import { Controller, Get, HttpException, Param, Req } from '@nestjs/common';

import { PlaylistService } from '@/playlist/playlist.service';
import { AuthRequest } from '@/types/misc/AuthRequest';
import { RequestError } from '@/util/Error';

@Controller({
  version: '1',
  path: 'playlist',
})
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @Get(':id')
  analyzePlaylist(
    @Param('id') id: string,
    @Req() request: AuthRequest
  ): Promise<void> {
    return this.playlistService
      .analyzePlaylist(id, request.accessToken)
      .then((trackData) => {
        return trackData;
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
