import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AlgoController } from '@/algo/algo.controller';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import { PlayerController } from '@/player/player.controller';
import { UserController } from '@/user/user.controller';

import { AlgoModule } from './algo/algo.module';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { PlaylistModule } from './playlist/playlist.module';
import { TrackController } from './track/track.controller';
import { TrackModule } from './track/track.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PlayerModule,
    TrackModule,
    AlgoModule,
    UserModule,
    PlaylistModule,
  ],
})
@Module({
  imports: [AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        PlayerController,
        TrackController,
        AlgoController,
        UserController
      );
  }
}
