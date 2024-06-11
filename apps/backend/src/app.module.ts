import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import { PlayerController } from '@/player/player.controller';
import { TrackController } from './track/track.controller';
import { TrackModule } from './track/track.module';
import { AlgoModule } from './algo/algo.module';
import { AlgoController } from '@/algo/algo.controller';
import { UserModule } from './user/user.module';
import { UserController } from '@/user/user.controller';

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
