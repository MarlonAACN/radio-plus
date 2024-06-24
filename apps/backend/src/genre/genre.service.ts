import { HttpStatus, Injectable } from '@nestjs/common';

import { SpotifyEndpointURLs } from '@/constants/SpotifyEndpointURLs';
import { RequestError } from '@/util/Error';
import { HttpHeader } from '@/util/HttpHeader';
import { logger } from '@/util/Logger';
import { throwIfDataIsSpotifyError } from '@/util/throwIfDataIsSpotifyError';

@Injectable()
export class GenreService {
  /**
   * Get all available track genres from spotify.
   * @param accessToken {string} The access token of the user to authenticate the request.
   */
  getAvailableGenres(accessToken: string): Promise<Spotify.Genres> {
    const requestParams = {
      method: 'GET',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(SpotifyEndpointURLs.GetAvailableGenres, requestParams)
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data: Spotify.Genres = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);

        return data;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          '[getAvailableGenres] Failed fetching available genres.',
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed fetching available genres.'
          )
        );
      });
  }
}
