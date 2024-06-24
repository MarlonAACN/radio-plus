import { Controller, Get, HttpException, Req } from '@nestjs/common';

import { GenreService } from '@/genre/genre.service';
import { AuthRequest } from '@/types/misc/AuthRequest';
import { RequestError } from '@/util/Error';

@Controller({
  version: '1',
  path: 'genre',
})
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Get()
  getAvailableGenres(@Req() request: AuthRequest): Promise<Spotify.Genres> {
    return this.genreService
      .getAvailableGenres(request.accessToken)
      .then((genres) => {
        return genres;
      })
      .catch((err: RequestError) => {
        throw new HttpException(
          {
            status: err.status,
            message: err.message,
          },
          err.status
        );
      });
  }
}
