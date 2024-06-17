import { Type } from 'class-transformer';
import { IsBoolean, IsObject, IsString, ValidateNested } from 'class-validator';

import { UserDto } from '@/algo/dto/user.dto';

class UpdateQueueDto {
  @IsString()
  deviceId: string;

  @IsString()
  originTrackId: string;

  @IsBoolean()
  freshTracks: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}

export { UpdateQueueDto };
