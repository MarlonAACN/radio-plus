import { IsString } from 'class-validator';

class UserDto {
  @IsString()
  market: string;

  @IsString()
  id: string;
}

export { UserDto };
