import { IsString } from 'class-validator';

class TransferPlaybackDto {
  @IsString()
  deviceId: string;
}

export { TransferPlaybackDto };
