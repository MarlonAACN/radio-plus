import { IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from '@/algo/dto/user.dto';

class InitAlgorithmDto {
  @IsString()
  deviceId: string;

  @IsString()
  originTrackId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}

export { InitAlgorithmDto };
