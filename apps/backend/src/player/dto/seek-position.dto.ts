import { IsNumber, IsString, Min } from 'class-validator';

class SeekPositionDto {
  @IsString()
  deviceId: string;

  @IsNumber()
  @Min(0)
  position: number;
}

export { SeekPositionDto };
