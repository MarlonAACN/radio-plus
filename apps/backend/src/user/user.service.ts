import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpHeader } from '@/util/HttpHeader';
import { SpotifyEndpointURLs } from '@/constants/SpotifyEndpointURLs';
import { throwIfDataIsSpotifyError } from '@/util/throwIfDataIsSpotifyError';
import { logger } from '@/util/Logger';
import { RequestError } from '@/util/Error';
import { RadioPlus } from '@/types/RadioPlus';
import {
  SPOTIFY_TOP_ARTISTS_LIMIT,
  SPOTIFY_TOP_TRACKS_LIMIT,
} from '@/constants';
import { TrackFormatter } from '@/util/formatter/TrackFormatter';
import { SupportedCookies } from '@/constants/SupportedCookies';
import { Response } from '@/types/Better-express';

@Injectable()
export class UserService {
  /**
   * Get data of the user, based on the given token.
   * This currently only returns the id and the market (country) of the user.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @param response {Response} The response object to be able to append the set-cookie header.
   * @returns {RadioPlus.User} The fetched user object, based on the given token.
   */
  getUser(accessToken: string, response: Response): Promise<RadioPlus.User> {
    const requestParams = {
      method: 'GET',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(SpotifyEndpointURLs.GetUserProfile, requestParams)
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data: Spotify.UserObjectPrivate = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);

        response.cookie(SupportedCookies.userId, data.id, {
          sameSite: 'lax',
          path: '/',
          httpOnly: false,
          expires: new Date(Date.now() + 86400000), // One day from now
        });

        response.cookie(SupportedCookies.userMarket, data.country, {
          sameSite: 'lax',
          path: '/',
          httpOnly: false,
          expires: new Date(Date.now() + 86400000), // One day from now
        });

        return {
          id: data.id,
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

  /**
   * Issue multiple requests to Spotify to query all data to build a userData object.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {RadioPlus.UserData} The created userData object.
   */
  async getUserData(accessToken: string): Promise<RadioPlus.UserData> {
    const recentTracks: Array<Spotify.PlayHistoryObject> =
      await this.getUsersRecentlyPlayedTracks(accessToken)
        .then((data) => {
          return data;
        })
        .catch((err: RadioPlus.Error) => {
          logger.warn(
            '[getUserData] Failed fetching users recent tracks, using empty array.',
            err
          );
          return [];
        });

    const followedArtists: Array<Spotify.ArtistObjectFull> =
      await this.getUsersFollowedArtists(accessToken)
        .then((data) => {
          return data;
        })
        .catch((err: RadioPlus.Error) => {
          logger.warn(
            '[getUserData] Failed fetching users followed artists, using empty array.',
            err
          );
          return [];
        });

    const topArtists: Array<Spotify.ArtistObjectFull> =
      await this.getUsersTopArtists(accessToken)
        .then((data) => {
          return data;
        })
        .catch((err: RadioPlus.Error) => {
          logger.warn(
            '[getUserData] Failed fetching users top artists, using empty array.',
            err
          );
          return [];
        });

    const topTracks: Array<Spotify.TrackObjectFull> =
      await this.getUsersTopTracks(accessToken)
        .then((data) => {
          return data;
        })
        .catch((err: RadioPlus.Error) => {
          logger.warn(
            '[getUserData] Failed fetching users top tracks, using empty array.',
            err
          );
          return [];
        });

    return {
      recentTracks: TrackFormatter.listRecentlyPlayedTrackIds(recentTracks),
      topArtists: TrackFormatter.listArtistIds(topArtists),
      topTracks: TrackFormatter.listTracksIds(topTracks),
      followedArtists: TrackFormatter.listArtistIds(followedArtists),
    };
  }

  /**
   * Fetches the last 50 tracks the user listened to.
   * Spotify only caches the last 50 tracks, so radio plus can't fetch more items than that.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {Array<Spotify.PlayHistoryObject>} The list of tracks, the user recently listened to.
   */
  getUsersRecentlyPlayedTracks(
    accessToken: string
  ): Promise<Array<Spotify.PlayHistoryObject>> {
    const urlParams = new URLSearchParams({
      limit: '50',
      before: Date.now().toString(), // UNIX timestamp
    });

    const requestParams = {
      method: 'GET',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(
      SpotifyEndpointURLs.GetRecentlyPlayedTracks(urlParams),
      requestParams
    )
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data: Spotify.UsersRecentlyPlayedTracksResponse = raw
          ? JSON.parse(raw)
          : {};

        throwIfDataIsSpotifyError(data);

        return data.items;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[getUsersRecentlyPlayedTracks] Fetching users recently played tracks failed:`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Fetching users recently played tracks failed.'
          )
        );
      });
  }

  /**
   * Get a list of all artists the user follows in spotify.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {Array<Spotify.ArtistObjectFull>} A list of all artists, the user follows.
   */
  async getUsersFollowedArtists(
    accessToken: string
  ): Promise<Array<Spotify.ArtistObjectFull>> {
    const requestParams = {
      method: 'GET',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    let allArtists: Array<Spotify.ArtistObjectFull> = [];
    let after: string | null = null;
    let cursorAtEnd: boolean = false;
    let counter: number = 0;

    while (!cursorAtEnd) {
      const urlParams = new URLSearchParams({
        limit: '50',
        type: 'artist',
      });

      if (after !== null) {
        urlParams.set('after', after);
      }

      const query = await fetch(
        SpotifyEndpointURLs.GetFollowedArtists(urlParams),
        requestParams
      )
        .then((response) => {
          return response.text();
        })
        .then((raw) => {
          const data: Spotify.UsersFollowedArtistsResponse = raw
            ? JSON.parse(raw)
            : {};

          throwIfDataIsSpotifyError(data);

          return data;
        })
        .catch((error: Spotify.Error) => {
          logger.error(
            `[getUsersFollowedArtists] Fetching users followed artists failed at iteration ${counter}, at cursor after: ${after}:`,
            error.message
          );

          return null;
        });

      if (query !== null) {
        // Update cursor values on successfull fetch.
        after = query.artists.cursors.after;
        cursorAtEnd = query.artists.next === null;
        counter += 1;

        // save data
        allArtists = allArtists.concat(query.artists.items);
      } else {
        // prematurely break loop on error.
        cursorAtEnd = true;
      }
    } // end of loop

    logger.log(
      `[getUsersFollowedArtists] Fetched ${allArtists.length} artists, that the user follows, within ${counter} iterations.`
    );
    return allArtists;
  }

  /**
   * Get the top artists considered by spotify for the current user.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {Array<Spotify.ArtistObjectFull>} A list of all top artists of the user.
   */
  async getUsersTopArtists(
    accessToken: string
  ): Promise<Array<Spotify.ArtistObjectFull>> {
    const requestParams = {
      method: 'GET',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    const limit = 50;
    let allArtists: Array<Spotify.ArtistObjectFull> = [];
    let offset: number = 0;
    let hasNext: boolean = true;
    let counter: number = 0;

    while (hasNext) {
      const urlParams = new URLSearchParams({
        limit: limit.toString(),
      });

      if (offset !== 0) {
        urlParams.set('offset', offset.toString());
      }

      const query = await fetch(
        SpotifyEndpointURLs.GetUsersTopArtists(urlParams),
        requestParams
      )
        .then((response) => {
          return response.text();
        })
        .then((raw) => {
          const data: Spotify.UsersTopArtistsResponse = raw
            ? JSON.parse(raw)
            : {};

          throwIfDataIsSpotifyError(data);

          return data;
        })
        .catch((error: Spotify.Error) => {
          logger.error(
            `[getUsersTopArtists] Fetching users top artists failed at iteration ${counter}, at offset: ${offset}:`,
            error.message
          );

          return null;
        });

      if (query !== null) {
        // Update pagination offset after successful fetch.
        offset += limit;
        hasNext = query.next !== null;
        counter += 1;

        // save data
        allArtists = allArtists.concat(query.items);

        // If global limit is reached, stop loop query.
        if (allArtists.length >= SPOTIFY_TOP_ARTISTS_LIMIT) {
          hasNext = false;
        }
      } else {
        // prematurely break loop on error.
        hasNext = false;
      }
    } // end of loop

    logger.log(
      `[getUsersTopArtists] Fetched ${allArtists.length} top artists, within ${counter} iterations.`
    );
    return allArtists;
  }

  /**
   * Get the top tracks considered by spotify for the current user.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {Array<Spotify.TrackObjectFull>} A list of all top tracks of the user.
   */
  async getUsersTopTracks(
    accessToken: string
  ): Promise<Array<Spotify.TrackObjectFull>> {
    const requestParams = {
      method: 'GET',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    const limit = 50;
    let allTracks: Array<Spotify.TrackObjectFull> = [];
    let offset: number = 0;
    let hasNext: boolean = true;
    let counter: number = 0;

    while (hasNext) {
      const urlParams = new URLSearchParams({
        limit: limit.toString(),
      });

      if (offset !== 0) {
        urlParams.set('offset', offset.toString());
      }

      const query = await fetch(
        SpotifyEndpointURLs.GetUsersTopTracks(urlParams),
        requestParams
      )
        .then((response) => {
          return response.text();
        })
        .then((raw) => {
          const data: Spotify.UsersTopTracksResponse = raw
            ? JSON.parse(raw)
            : {};

          throwIfDataIsSpotifyError(data);

          return data;
        })
        .catch((error: Spotify.Error) => {
          logger.error(
            `[getUsersTopTracks] Fetching users top tracks failed at iteration ${counter}, at offset: ${offset}:`,
            error.message
          );

          return null;
        });

      if (query !== null) {
        // Update pagination offset after successful fetch.
        offset += limit;
        hasNext = query.next !== null;
        counter += 1;

        // save data
        allTracks = allTracks.concat(query.items);

        // If global limit is reached, stop loop query.
        if (allTracks.length >= SPOTIFY_TOP_TRACKS_LIMIT) {
          hasNext = false;
        }
      } else {
        // prematurely break loop on error.
        hasNext = false;
      }
    } // end of loop

    logger.log(
      `[getUsersTopTracks] Fetched ${allTracks.length} top tracks, within ${counter} iterations.`
    );
    return allTracks;
  }
}
