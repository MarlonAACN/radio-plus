import { IsString } from 'class-validator';

class AuthPayloadDto {
  @IsString()
  code: string;

  @IsString()
  state: string;
}

export { AuthPayloadDto };
