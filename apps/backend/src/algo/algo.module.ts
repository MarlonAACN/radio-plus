import { Module } from '@nestjs/common';

import { PlaylistModule } from '@/playlist/playlist.module';
import { TrackModule } from '@/track/track.module';
import { UserModule } from '@/user/user.module';

import { AlgoController } from './algo.controller';
import { AlgoService } from './algo.service';

@Module({
  controllers: [AlgoController],
  providers: [AlgoService],
  imports: [UserModule, PlaylistModule, TrackModule],
})
export class AlgoModule {}
