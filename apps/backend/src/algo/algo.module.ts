import { Module } from '@nestjs/common';
import { AlgoController } from './algo.controller';
import { AlgoService } from './algo.service';
import { UserModule } from '@/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [AlgoController],
  providers: [AlgoService],
  imports: [UserModule, CacheModule.register()],
})
export class AlgoModule {}
