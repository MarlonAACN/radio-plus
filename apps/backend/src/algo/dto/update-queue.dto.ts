import { IsString } from 'class-validator';

class UpdateQueueDto {
  @IsString()
  deviceId: string;

  @IsString()
  originTrackId: string;
}

export { UpdateQueueDto };
