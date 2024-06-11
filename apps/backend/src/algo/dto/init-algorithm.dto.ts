import { IsString } from 'class-validator';

class InitAlgorithmDto {
  @IsString()
  deviceId: string;

  @IsString()
  originTrackId: string;
}

export { InitAlgorithmDto };
