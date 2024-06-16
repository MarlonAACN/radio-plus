import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { UserModule } from '@/user/user.module';

import { AlgoController } from './algo.controller';
import { AlgoService } from './algo.service';

@Module({
  controllers: [AlgoController],
  providers: [AlgoService],
  imports: [UserModule, CacheModule.register()],
})
export class AlgoModule {}
