import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpHeader } from '@/util/HttpHeader';
import { SpotifyURI, SpotiyUriType } from '@/util/formatter/SpotifyURI';
import { SpotifyEndpointURLs } from '@/constants/SpotifyEndpointURLs';
import { throwIfDataIsSpotifyError } from '@/util/throwIfDataIsSpotifyError';
import { logger } from '@/util/Logger';
import { RequestError } from '@/util/Error';
import { TrackFilter } from '@/util/TrackFilter';
import { RadioPlus } from '@/types/RadioPlus';
import { UserService } from '@/user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheObject, CacheObjectType } from '@/util/formatter/CacheObject';

@Injectable()
export class AlgoService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userService: UserService
  ) {}

  /**
   * Fetch user data based on the given access token and add to cache.
   * If a cached object already exists, overwrite it.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @param userId {string} The id of the user, used as key for the cache object.
   */
  private async cacheUserData(
    accessToken: string,
    userId: string
  ): Promise<void> {
    // 13-15 kb on average
    const userData: RadioPlus.UserData =
      await this.userService.getUserData(accessToken);

    await this.cacheManager.set(
      CacheObject.constructKey(userId, CacheObjectType.UserData),
      userData,
      86400000
    ); // One day from now
    await this.cacheManager.set('foo', 'bar', 86400000);

    // Delete potentially existing recommendation data
    await this.cacheManager.del(
      CacheObject.constructKey(userId, CacheObjectType.Recommendations)
    );

    logger.log('[cacheUserData] Cache data set successfully.');

    return Promise.resolve();
  }

  /**
   * Marks the start of a running algorithm.
   * This sets based on the given origin track id the track as currently played.
   * This also toggles the playback to play.
   * This also fetches userData and sets said data as cachable object. When a new init is triggered, this data gets replaced.
   * @param originTrackId {string} The origin track id, that is used in the current lifetime cycle of the running algorithm.
   * @param user {RadioPlus.user} The user data required to set the cachable object.
   * @param deviceId {string} The id of the current device (radio plus instance)
   * @param accessToken {string} The access token of the user to authenticate the request.
   */
  async initAlgorithm(
    originTrackId: string,
    user: RadioPlus.User,
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

    await this.cacheUserData(accessToken, user.id);

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
   * @param user {RadioPlus.User} The user data, relevant to the algorithm.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {string | null} The recommendation track or null if no eligible recommendation track could be found.
   */
  private async getRecommendation(
    trackId: string,
    user: RadioPlus.User,
    accessToken: string
  ): Promise<string | null> {
    // Check if cached recommendation track list exists.
    const recommendations: RadioPlus.Recommendations | undefined =
      await this.cacheManager.get(
        CacheObject.constructKey(user.id, CacheObjectType.Recommendations)
      );

    // Check if object exists and user is not at the end of it.
    if (
      recommendations &&
      recommendations.position < recommendations.tracks.length - 1
    ) {
      // Update cache objects position
      await this.cacheManager.set(
        CacheObject.constructKey(user.id, CacheObjectType.Recommendations),
        {
          position: recommendations.position + 1,
          tracks: recommendations.tracks,
        },
        86400000
      );

      logger.log(
        `[getRecommendation] Return position ${recommendations.position}/${recommendations.tracks.length} in recommendation track list. (ref. userId: ${user.id})`
      );

      return recommendations.tracks[recommendations.position];
    }

    // No recommendations cached or at the end of array -> generate new set.
    const userData = await this.cacheManager.get(
      CacheObject.constructKey(user.id, CacheObjectType.UserData)
    );

    const urlParams = new URLSearchParams({
      limit: '100',
      seed_tracks: trackId,
      market: user.market,
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
      .then(async (raw) => {
        const data: Spotify.RecommendationsObject = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);

        if (data.tracks.length === 0) {
          logger.error(
            '[getRecommendation] Array of recommendations is empty.'
          );
          throw new Error('No recommendations found.');
        }

        const filteredRecommendationTracks = TrackFilter.filterRecommendations(
          data.tracks
        );

        // Add object to cache
        await this.cacheManager.set(
          CacheObject.constructKey(user.id, CacheObjectType.Recommendations),
          {
            position: 0,
            tracks: filteredRecommendationTracks,
          },
          86400000
        );
        logger.log(
          `[getRecommendation] Created new recommendation track list with ${filteredRecommendationTracks.length} tracks. (ref. userId: ${user.id})`
        );

        return filteredRecommendationTracks[0];
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
   * @param user {RadioPlus.User} The user data, relevant to the algorithm.
   * @param deviceId {string} The id of the current device (radio plus instance)
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {string} The id of track that was added to the queue.
   */
  async updateQueue(
    originTrackId: string,
    user: RadioPlus.User,
    deviceId: string,
    accessToken: string
  ): Promise<string> {
    const recommendedTrackId = await this.getRecommendation(
      originTrackId,
      user,
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
