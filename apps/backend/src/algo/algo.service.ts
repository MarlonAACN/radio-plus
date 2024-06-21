import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';

import { SpotifyEndpointURLs } from '@/constants/SpotifyEndpointURLs';
import { SupportedCookies } from '@/constants/SupportedCookies';
import { PlaylistService } from '@/playlist/playlist.service';
import { TrackService } from '@/track/track.service';
import { RadioPlus } from '@/types/RadioPlus';
import { RadioPlusError } from '@/types/RadioPlus/Error';
import { UserService } from '@/user/user.service';
import { createPlaylistDescription } from '@/util/createPlaylistDescription';
import { delay } from '@/util/delay';
import { RequestError } from '@/util/Error';
import { SpotifyURI, SpotiyUriType } from '@/util/formatter/SpotifyURI';
import { HttpHeader } from '@/util/HttpHeader';
import { logger } from '@/util/Logger';
import { throwIfDataIsSpotifyError } from '@/util/throwIfDataIsSpotifyError';
import { TrackFilter } from '@/util/TrackFilter';

@Injectable()
export class AlgoService {
  constructor(
    private userService: UserService,
    private playlistService: PlaylistService,
    private trackService: TrackService
  ) {}

  /**
   *
   * @param originTrackId {string} The origin track id, that is used in the current lifetime cycle of the running algorithm.
   * @param playlistId {string | null} A potentially already existing session playlist from the current session.
   * @param user {RadioPlus.user} The user data required for proper result filtering.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @param deviceId {string} The id of the current device (radio plus instance)
   * @param response {Response} The response object to be able to append the set-cookie header.
   * @param freshTracks {boolean} Filter option that determines if known tracks should be excluded.
   * @param selectedGenres {Array<string>} Filter option that determines the type of genres the recommended tracks should belong to.
   * @returns {RadioPlus.AlgorithmResponse} The url to the playlist in the spotify webapp.
   */
  async runAlgorithm(
    originTrackId: string,
    playlistId: string | null,
    user: RadioPlus.User,
    accessToken: string,
    deviceId: string,
    response: Response,
    freshTracks: boolean,
    selectedGenres: Array<string>
  ): Promise<RadioPlus.AlgorithmResponse> {
    // 1. Check if a dedicated radio plus session playlist already exists.
    if (playlistId) {
      // 1a. Playlist ref exists -> try fetching it.
      const playlist: Spotify.SinglePlaylistResponse | null =
        await this.playlistService
          .getPlaylist(playlistId, accessToken)
          .then((_playlist: Spotify.SinglePlaylistResponse) => {
            logger.log('[runAlgorithm] Found existing playlist.');

            return _playlist;
          })
          .catch((_error: RadioPlus.Error) => {
            logger.warn(
              '[runAlgorithm] Failed fetching playlist. Playlist reference is invalid.'
            );

            return null;
          });

      // 1b. If playlist actually exists, dump it.
      if (playlist !== null) {
        await this.playlistService.dumpPlaylist(playlistId, accessToken);
      }
    }

    // 2a. Get origin track data.
    const originTrack: Spotify.Track = await this.trackService
      .getTrackData(originTrackId, accessToken)
      .then((track) => {
        return track;
      })
      .catch((error: RadioPlus.Error) => {
        logger.error('[runAlgorithm] Failed fetching origin track data.');

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed fetching origin track data.'
          )
        );
      });

    // 2b. Create new playlist for current recommendation list.
    const newPlaylist = await this.playlistService
      .createPlaylist(user.id, accessToken, {
        name: `Radio⁺ | ${originTrack.name}`,
        description: createPlaylistDescription(
          originTrack.name,
          freshTracks,
          selectedGenres
        ),
      })
      .then((playlist) => {
        logger.log(
          `[runAlgorithm] Radio⁺ session playlist with id ${playlist.id} successfully created.`
        );
        return playlist;
      })
      .catch((error: RadioPlus.Error) => {
        logger.error(
          '[runAlgorithm] Failed creating session playlist.',
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed creating session playlist.'
          )
        );
      });

    // 3. Get recommendation track list.
    const recommendationTrackIds = await this.getRecommendations(
      originTrackId,
      freshTracks,
      selectedGenres,
      user,
      accessToken
    )
      .then((recommendations) => {
        return recommendations;
      })
      .catch((error: RadioPlus.Error) => {
        logger.error(
          '[runAlgorithm] Failed fetching recommendations.',
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed finding proper recommendations.'
          )
        );
      });

    // 4. Add recommendations to playlist.
    await this.playlistService
      .addTracksToPlaylist(newPlaylist.id, recommendationTrackIds, accessToken)
      .then(() => {
        logger.log(
          `[runAlgorithm] ${recommendationTrackIds.length} tracks successfully added to session playlist.`
        );
      })
      .catch((error: RadioPlus.Error) => {
        logger.error(
          '[runAlgorithm] Failed adding tracks to session playlist.'
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed adding tracks to session playlist.'
          )
        );
      });

    // 4. Try to set playlist image cover.
    await this.playlistService
      .addRadioPlusPlaylistCoverImage(newPlaylist.id, accessToken)
      .catch((_error: RadioPlus.Error) => {
        logger.warn('[runAlgorithm] Failed to set playlist image cover.');
      });

    // 6. Launch playback of playlist
    const urlParams = new URLSearchParams({
      device_id: deviceId,
    });

    const requestParams = {
      method: 'PUT',
      headers: {
        'Authorization': HttpHeader.getSpotifyBearerAuthorization(accessToken),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context_uri: SpotifyURI.construct(
          newPlaylist.id,
          SpotiyUriType.playlist
        ),
        offset: {
          position: 0,
        },
        position_ms: 0,
      }),
    };

    let retries = 0;

    function startPlayback(): Promise<RadioPlus.AlgorithmResponse> {
      return fetch(
        SpotifyEndpointURLs.player.StartResumePlayback(urlParams),
        requestParams
      )
        .then((response) => {
          return response.text();
        })
        .then((raw) => {
          const data = raw ? JSON.parse(raw) : {};

          throwIfDataIsSpotifyError(data);

          response.cookie(SupportedCookies.sessionPlaylistId, newPlaylist.id, {
            sameSite: 'lax',
            path: '/',
            httpOnly: false,
            expires: new Date(Date.now() + 21600000), // Six hours from now
          });

          logger.log(
            `[runAlgorithm] Successfully started playback on ${retries} try.`
          );

          return {
            playlistUrl: newPlaylist.external_urls.spotify,
          };
        })
        .catch(async (error: Spotify.Error) => {
          logger.error(
            `[runAlgorithm] Failed starting playback for session playlist with id ${
              newPlaylist.id
            } try (${retries + 1}/3).`,
            error.message
          );

          if (retries < 3) {
            retries += 1;

            logger.log(
              '[runAlgorithm] Retrying to launch playback in 5 seconds...'
            );

            await delay(5000);
            return startPlayback();
          } else {
            logger.warn(
              `[runAlgorithm] Failed starting playback for session playlist with id ${newPlaylist.id}`
            );

            return {
              playlistUrl: newPlaylist.external_urls.spotify,
            };
          }
        });
    }

    return startPlayback();
  }

  /**
   * Get a recommendation track list based on the given trackId.
   * @param trackId {string} The trackId of the track that should be used as base for the recommendation.
   * @param freshTracks {boolean} Determine if only tracks unkown to the user should be recommended.
   * @param selectedGenres {Array<string>} Filter option that determines the type of genres the recommended tracks should belong to.
   * @param user {RadioPlus.User} The user data, relevant to the algorithm.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {Array<string>} The recommendation track list.
   */
  private async getRecommendations(
    trackId: string,
    freshTracks: boolean,
    selectedGenres: Array<string>,
    user: RadioPlus.User,
    accessToken: string
  ): Promise<Array<string>> {
    const urlParams = new URLSearchParams({
      limit: '100',
      seed_tracks: trackId,
      market: user.market,
    });

    if (selectedGenres.length > 0) {
      urlParams.append('seed_genres', selectedGenres.join(','));
    }

    const requestParams = {
      method: 'GET',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(
      SpotifyEndpointURLs.GetRecommendations(urlParams),
      requestParams
    )
      .then((response) => {
        return response.text();
      })
      .then(async (raw) => {
        const data: Spotify.RecommendationsObject = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);

        if (data.tracks.length === 0) {
          logger.error(
            '[getRecommendations] Array of recommendations is empty.'
          );
          throw new RadioPlusError(
            HttpStatus.NOT_FOUND,
            'No recommendations found.'
          );
        }

        // Fetch user data (recent tracks, top artists & tracks etc.)
        const userData = await this.userService.getUserData(accessToken);

        // Filter recommendation track list based on filers.
        const filteredRecommendationTracks = TrackFilter.filterRecommendations(
          data.tracks,
          userData,
          { freshTracks: freshTracks }
        );

        logger.log(
          `[getRecommendations] Created new recommendation track list with ${filteredRecommendationTracks.length} tracks. (${data.tracks.length} before filtering) (ref. userId: ${user.id})`
        );

        return filteredRecommendationTracks;
      })
      .catch((error: Spotify.Error | RadioPlusError) => {
        // Fast-forward if radio plus error.
        if (error instanceof RadioPlusError) {
          throw error;
        }

        logger.error(
          `[getRecommendations] Fetching recommendations failed:`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Fetching recommendations failed.'
          )
        );
      });
  }
}
