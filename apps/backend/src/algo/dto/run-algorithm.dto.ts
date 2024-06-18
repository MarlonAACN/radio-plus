import { Type } from 'class-transformer';
import { IsBoolean, IsObject, IsString, ValidateNested } from 'class-validator';

import { UserDto } from '@/algo/dto/user.dto';

class RunAlgorithmDto {
  @IsString()
  deviceId: string;

  @IsString()
  originTrackId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @IsBoolean()
  freshTracks: boolean;
}

export { RunAlgorithmDto };
