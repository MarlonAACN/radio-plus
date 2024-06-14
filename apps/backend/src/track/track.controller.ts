import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Put,
  Req,
} from '@nestjs/common';
import { TrackService } from '@/track/track.service';
import { AuthRequest } from '@/types/misc/AuthRequest';
import { RequestError } from '@/util/Error';
import { RadioPlus } from '@/types/RadioPlus';

@Controller({
  version: '1',
  path: 'track',
})
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get(':id')
  getDetailedTrack(
    @Param('id') id: string,
    @Req() request: AuthRequest
  ): Promise<RadioPlus.DetailedTrack> {
    return this.trackService
      .getDetailedTrack(id, request.accessToken)
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

  @Get('saved/:id')
  getIsTrackSavedByUser(
    @Param('id') id: string,
    @Req() request: AuthRequest
  ): Promise<boolean> {
    return this.trackService
      .trackIsSaved(id, request.accessToken)
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

  @Put('saved/:id')
  saveTrack(
    @Param('id') id: string,
    @Req() request: AuthRequest
  ): Promise<void> {
    return this.trackService
      .saveTrack(id, request.accessToken)
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

  @Delete('saved/:id')
  removeSavedTrack(
    @Param('id') id: string,
    @Req() request: AuthRequest
  ): Promise<void> {
    return this.trackService
      .removeSavedTrack(id, request.accessToken)
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
