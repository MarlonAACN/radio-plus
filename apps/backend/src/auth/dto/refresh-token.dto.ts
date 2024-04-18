import { IsString } from 'class-validator';

class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export { RefreshTokenDto };
