import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpHeader } from '@/util/HttpHeader';
import { SpotifyURI, SpotiyUriType } from '@/util/formatter/SpotifyURI';
import { SpotifyEndpointURLs } from '@/constants/SpotifyEndpointURLs';
import { throwIfDataIsSpotifyError } from '@/util/throwIfDataIsSpotifyError';
import { logger } from '@/util/Logger';
import { RequestError } from '@/util/Error';
import { TrackFilter } from '@/util/TrackFilter';

@Injectable()
export class AlgoService {
  /**
   * Marks the start of a running algorithm.
   * This sets based on the given origin track id the track as currently played.
   * This also toggles the playback to play.
   * @param originTrackId {string} The origin track id, that is used in the current lifetime cycle of the running algorithm.
   * @param deviceId {string} The id of the current device (radio plus instance)
   * @param accessToken {string} The access token of the user to authenticate the request.
   */
  initAlgorithm(
    originTrackId: string,
    deviceId: string,
    accessToken: string
  ): Promise<void> {
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
        uris: [SpotifyURI.construct(originTrackId, SpotiyUriType.track)],
      }),
    };

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

        return;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[startAlgorithm] Starting algorithm with setting track origin as current track failed:`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Starting algorithm with setting track origin as current track failed.'
          )
        );
      });
  }

  /**
   * Get a recommendation track based on the given trackId.
   * @param trackId {string} The trackId of the track that should be used as base for the recommendation.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {string | null} The recommendation track or null if no eligible recommendation track could be found.
   */
  private getRecommendation(
    trackId: string,
    accessToken: string
  ): Promise<string | null> {
    const urlParams = new URLSearchParams({
      limit: '20',
      seed_tracks: trackId,
    });

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
      .then((raw) => {
        const data: Spotify.RecommendationsObject = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);

        if (data.tracks.length === 0) {
          logger.error(
            '[getRecommendation] Array of recommendations is empty.'
          );
          throw new Error('No recommendations found.');
        }

        return TrackFilter.filterRecommendations(data.tracks);
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[getRecommendation] Fetching recommendation failed:`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Fetching recommendation failed.'
          )
        );
      });
  }

  /**
   * Adds a new track to the queue of the user.
   * The track is based on a recommendation query, which uses dedicated parameters and the origin track as base.
   * @param originTrackId {string} The id of the origin track id, that is used as base for the current lifetime cycle of the running alogorithm.
   * @param deviceId {string} The id of the current device (radio plus instance)
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {string} The id of track that was added to the queue.
   */
  async updateQueue(
    originTrackId: string,
    deviceId: string,
    accessToken: string
  ): Promise<string> {
    const recommendedTrackId = await this.getRecommendation(
      originTrackId,
      accessToken
    )
      .then((recommendation) => {
        if (recommendation) {
          return recommendation;
        } else {
          return Promise.reject(
            new RequestError(
              HttpStatus.BAD_REQUEST,
              "Couldn't finde a valid recommendation."
            )
          );
        }
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[updateQueue] Finding a recommendation failed:`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed finding a recommendation.'
          )
        );
      });

    const urlParams = new URLSearchParams({
      uri: SpotifyURI.construct(recommendedTrackId, SpotiyUriType.track),
      device_id: deviceId,
    });

    const requestParams = {
      method: 'POST',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(
      SpotifyEndpointURLs.player.AddToQueue(urlParams),
      requestParams
    )
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);

        // Return id of track that was just added to the queue.
        return recommendedTrackId;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[updateQueue] Updating track queue failed:`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Updating track queue failed.'
          )
        );
      });
  }
}
