import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackResolver } from './track.resolver';

@Module({
  controllers: [TrackController],
  providers: [TrackService, TrackResolver]
})
export class TrackModule {}
