import { HttpRedirectResponse, HttpStatus, Injectable } from '@nestjs/common';
import { generateRandomString } from '@/util/generateRandomString';
import { SPOTIFY_SCOPE } from '@/constants/SpotifyScope';
import { RequestError } from '@/util/Error';
import { logger } from '@/util/Logger';
import { Response } from 'express';
import { DateFormatter } from '@/util/formatter/date-formatter';
import { REFRESH_TOKEN_TTL } from '@/constants';
import { HttpHeader } from '@/util/HttpHeader';
import { SpotifyEndpointURLs } from '@/constants/SpotifyEndpointURLs';
import { InternalEndpointURLs } from '@/constants/InternalEndpointURLs';
import { SupportedCookies } from '@/constants/SupportedCookies';

@Injectable()
export class AuthService {
  /**
   * Function that inits the Oauth process, by creating the redirect url, and then redirecting to said url.
   * Once the Oauth is completed, the callback endpoint of the backend will be called by spotify.
   */
  auth(): HttpRedirectResponse {
    // Abort if .env is not correctly configured
    if (!process.env.SPOTIFY_CLIENT_ID) {
      logger.error('Spotify client ID is not set in env');

      throw new RequestError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Server is missing information to proceed requests'
      );
    }

    // A randomly generated string to protect against attacks such as cross-site request forgery.
    const state = generateRandomString(16);

    const authQueryParams = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: SPOTIFY_SCOPE,
      redirect_uri: InternalEndpointURLs.backend.OAuthCallback,
      state: state,
    });

    return {
      url: SpotifyEndpointURLs.UserOAuth(authQueryParams),
      statusCode: HttpStatus.MOVED_PERMANENTLY,
    };
  }

  /**
   * Function is called, when spotifys OAuth uses the given redirect URI to call this backends' endpoint, which calls this function.
   * The function then calls another spotify endpoint, to get an acces token, based on the fetched code data from the OAuth process.
   * @param code {string} The generated code from the OAuth process.
   * @param response {Response} The response object to be able to append the set-cookie header.
   * @returns {Promise<HttpRedirectResponse>} Another redirect to the base url of the frontend, appended with access token data in the url.
   */
  callback(code: string, response: Response): Promise<HttpRedirectResponse> {
    // Abort if .env is not correctly configured
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      logger.error(
        '[authCallback] Spotify client ID or secret is not set in env'
      );

      return Promise.reject({
        url: InternalEndpointURLs.frontend.InternalServerErrorPage(
          encodeURIComponent(
            'Server is missing information to proceed requests'
          )
        ),
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const requestParams = {
      method: 'POST',
      headers: {
        'Authorization': HttpHeader.getSpotifyBasicAuthorization(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        redirect_uri: InternalEndpointURLs.backend.OAuthCallback,
        grant_type: 'authorization_code',
      }),
    };

    // Fetch access token from spotify
    return fetch(SpotifyEndpointURLs.TokenAuthorization, requestParams)
      .then((response) => response.json())
      .then((data: Spotify.DetailedAuthToken<Spotify.AuthToken>) => {
        // Spotify not always throws an error response, so we have to manually check if a token was provided.
        if (!data.access_token) {
          const err: Spotify.AuthenticationError =
            data as unknown as Spotify.AuthenticationError;

          logger.error(
            `[authCallback] Spotify returned no access token. Error: ${err.error_description}`
          );
          throw new Error(err.error_description);
        }

        logger.log(
          `[authCallback] Successfully fetched ${data.token_type} access token`,
          data
        );

        // Set auth token cookie header
        response.cookie(SupportedCookies.accessToken, data.access_token, {
          sameSite: 'lax',
          path: '/',
          httpOnly: false,
          expires: DateFormatter.CreateDateAfterDelay(data.expires_in),
        });

        response.cookie(SupportedCookies.refreshToken, data.refresh_token, {
          sameSite: 'lax',
          path: '/',
          httpOnly: false,
          expires: new Date(Date.now() + 604800000), // Date one week from now
        });

        return {
          url: process.env.APP_ORIGIN_URL!,
          statusCode: HttpStatus.MOVED_PERMANENTLY,
        };
      })
      .catch((error) => {
        logger.error(
          '[authCallback] Fetching spotify access token based on provided OAuth code failed:',
          error
        );

        // Redirect to 500 page on frontend, if an error occured.
        return {
          url: InternalEndpointURLs.frontend.InternalServerErrorPage(
            encodeURIComponent('Spotify authorization failed')
          ),
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      });
  }

  /**
   * Refresh an access token based on the given refresh token.
   * On success, sets adds the access and refresh token to the cookie header payload.
   * @param token {string} The refresh token.
   * @param response {Response} The response object to be able to append the set-cookie header.
   * @returns {Spotify.AuthToken} A new set of a valid access and refresh token.
   */
  refreshToken(token: string, response: Response): Promise<Spotify.AuthToken> {
    const requestParams = {
      method: 'POST',
      headers: {
        'Authorization': HttpHeader.getSpotifyBasicAuthorization(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token,
      }),
    };

    return fetch(SpotifyEndpointURLs.TokenAuthorization, requestParams)
      .then((response) => response.json())
      .then((data: Spotify.DetailedAuthToken<Spotify.AccessToken>) => {
        // Spotify not always throws an error response, so we have to manually check if a token was provided.
        if (!data.access_token) {
          const err: Spotify.AuthenticationError =
            data as unknown as Spotify.AuthenticationError;

          logger.error(
            `[refreshToken] Spotify returned no access token. Error: ${err.error_description}`
          );
          throw new Error(err.error_description);
        }

        logger.log(
          `[refreshToken] Successfully refreshed new ${data.token_type} access token`,
          data
        );

        // Set auth token cookie header
        response.cookie(SupportedCookies.accessToken, data.access_token, {
          sameSite: 'lax',
          path: '/',
          httpOnly: false,
          expires: DateFormatter.CreateDateAfterDelay(data.expires_in),
        });

        response.cookie(SupportedCookies.refreshToken, token, {
          sameSite: 'lax',
          path: '/',
          httpOnly: false,
          expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        logger.log('[refreshToken] Token set refreshed successfully.');

        return {
          access_token: data.access_token,
          refresh_token: token,
          expires_in: data.expires_in,
        };
      })
      .catch((error) => {
        logger.error(
          '[refreshToken] Refreshing spotify access token based on given refresh token failed:',
          error
        );

        return Promise.reject(
          new RequestError(HttpStatus.UNAUTHORIZED, 'Failed to refresh token.')
        );
      });
  }
}
