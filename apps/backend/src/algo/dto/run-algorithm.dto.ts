import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
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

  @IsNumber()
  @IsOptional()
  bpm: number | null;

  @IsNumber()
  @IsOptional()
  danceability: number | null;

  @IsNumber()
  @IsOptional()
  popularity: number | null;

  @IsNumber()
  @IsOptional()
  valence: number | null;

  @IsNumber()
  @IsOptional()
  instrumentalness: number | null;
}

export { RunAlgorithmDto };
