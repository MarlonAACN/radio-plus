import { HttpStatus, Injectable } from '@nestjs/common';

import { SpotifyEndpointURLs } from '@/constants/SpotifyEndpointURLs';
import { RadioPlus } from '@/types/RadioPlus';
import { RequestError } from '@/util/Error';
import { HttpHeader } from '@/util/HttpHeader';
import { logger } from '@/util/Logger';
import { throwIfDataIsSpotifyError } from '@/util/throwIfDataIsSpotifyError';

@Injectable()
export class TrackService {
  /**
   * Fetches detailed data of a track, based on the given id.
   * This includes basic information about the track and its audio features.
   * @param id {string} The id of the desired track.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {RadioPlus.DetailedTrack} The detailed track data, based on the given id. This includes audio features and basic information about the track.
   */
  async getDetailedTrack(
    id: string,
    accessToken: string
  ): Promise<RadioPlus.DetailedTrack> {
    const basicTrackData = await this.getTrackData(id, accessToken)
      .then((track) => {
        return track;
      })
      .catch((err: RequestError) => {
        logger.error(
          '[getDetailedTrack] Aborting detailed track data fetch as basic data fetch failed',
          err
        );

        return Promise.reject(
          new RequestError(
            err.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed fetching basic track data for track with id: ${id}.`
          )
        );
      });

    const trackAudioFeatures = await this.getTracksAudioFeatures(
      id,
      accessToken
    )
      .then((track) => {
        return track;
      })
      .catch((err: RequestError) => {
        logger.error(
          '[getDetailedTrack] Aborting detailed track data fetch as fetch for audio features failed',
          err
        );

        return Promise.reject(
          new RequestError(
            err.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed fetching tracks audio features for track with id: ${id}.`
          )
        );
      });

    return {
      information: basicTrackData,
      audioFeatures: trackAudioFeatures,
    };
  }

  /**
   * Fetches the audio features of the track from spotify, based on the given track id.
   * @param id {string} The id of the desired tracks audio features.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {RadioPlus.TrackAudioFeatures} The audio features of the desired track from spotify.
   */
  getTracksAudioFeatures(
    id: string,
    accessToken: string
  ): Promise<RadioPlus.TrackAudioFeatures> {
    const requestParams = {
      method: 'GET',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(SpotifyEndpointURLs.track.GetAudioFeatures(id), requestParams)
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);

        return data;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[getTrack] Failed to fetch tracks audio features for track with id: ${id}:`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed to fetch tracks audio features for track with id: ${id}.`
          )
        );
      });
  }

  /**
   * Fetches basic information from a spotify track.
   * @param id {string} The id of the desired track.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {Spotify.Track} Basic information like artist and name of the track from spotify.
   */
  getTrackData(id: string, accessToken: string): Promise<Spotify.Track> {
    const requestParams = {
      method: 'GET',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(SpotifyEndpointURLs.track.GetData(id), requestParams)
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);

        return data;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[getTrack] Failed fetching basic track data for track with id: ${id}.`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed fetching basic track data for track with id: ${id}.`
          )
        );
      });
  }

  /**
   * Check if a track is saved in spotify by the user.
   * @param trackId {string} The id of the track that should be checked, if it's saved by the user.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {boolean} True if the track is saved by the user, otherwise false.
   */
  trackIsSaved(trackId: string, accessToken: string): Promise<boolean> {
    const urlParams = new URLSearchParams({
      ids: trackId,
    });

    const requestParams = {
      method: 'GET',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(
      SpotifyEndpointURLs.track.IsSavedByUser(urlParams),
      requestParams
    )
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);

        return data[0];
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[trackIsSaved] Failed to check if track with id ${trackId} is saved by user.`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed to check if track with id ${trackId} is saved by user.`
          )
        );
      });
  }

  /**
   * Saves the track with the given id in spotify.
   * @param trackId {string} The id of the track that should be saved in spotify.
   * @param accessToken {string} The access token of the user to authenticate the request.
   */
  saveTrack(trackId: string, accessToken: string): Promise<void> {
    const urlParams = new URLSearchParams({
      ids: trackId,
    });

    const requestParams = {
      method: 'PUT',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(SpotifyEndpointURLs.track.SaveTrack(urlParams), requestParams)
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);

        logger.log(
          `[saveTrack] Track ${trackId} successfully saved in saved track list.`
        );
        return;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[saveTrack] Failed to save track id ${trackId}.`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed to save track id ${trackId}.`
          )
        );
      });
  }

  /**
   * Remove the track with the given id from users saved tracks in spotify.
   * @param trackId {string} The id of the track that should be removed from the users tracks in spotify.
   * @param accessToken {string} The access token of the user to authenticate the request.
   */
  removeSavedTrack(trackId: string, accessToken: string): Promise<void> {
    const urlParams = new URLSearchParams({
      ids: trackId,
    });

    const requestParams = {
      method: 'DELETE',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(SpotifyEndpointURLs.track.SaveTrack(urlParams), requestParams)
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);
        logger.log(
          `[removeSavedTrack] Track ${trackId} successfully removed from saved track list.`
        );

        return;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[removeSavedTrack] Failed to remove saved track with id ${trackId}.`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed to remove saved track with id ${trackId}.`
          )
        );
      });
  }
}
