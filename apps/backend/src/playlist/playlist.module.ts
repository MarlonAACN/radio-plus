import { Module } from '@nestjs/common';

import { TrackModule } from '@/track/track.module';

import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';

@Module({
  providers: [PlaylistService],
  exports: [PlaylistService],
  imports: [TrackModule],
  controllers: [PlaylistController],
})
export class PlaylistModule {}
