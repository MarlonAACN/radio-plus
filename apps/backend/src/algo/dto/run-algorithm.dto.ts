import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

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

  @IsArray()
  @IsString({ each: true })
  selectedGenres: Array<string>;
}

export { RunAlgorithmDto };
