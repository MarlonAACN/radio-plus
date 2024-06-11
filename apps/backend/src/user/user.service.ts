import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpHeader } from '@/util/HttpHeader';
import { SpotifyEndpointURLs } from '@/constants/SpotifyEndpointURLs';
import { throwIfDataIsSpotifyError } from '@/util/throwIfDataIsSpotifyError';
import { logger } from '@/util/Logger';
import { RequestError } from '@/util/Error';

@Injectable()
export class UserService {
  /**
   * Get the country the user resides in and thus has access to the spotify market of that country.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {{market: string}} The market where the current user resides in.
   */
  getUserMarket(accessToken: string): Promise<{ market: string }> {
    const requestParams = {
      method: 'GET',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(SpotifyEndpointURLs.getUserProfile, requestParams)
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data: Spotify.UserObjectPrivate = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);

        return {
          market: data.country,
        };
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[getUserMarket] Failed fetching user data:`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed fetching user data.'
          )
        );
      });
  }
}
