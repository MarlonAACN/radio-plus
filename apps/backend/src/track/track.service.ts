import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpHeader } from '@/util/HttpHeader';
import { SpotifyEndpointURLs } from '@/constants/SpotifyEndpointURLs';
import { throwIfDataIsSpotifyError } from '@/util/throwIfDataIsSpotifyError';
import { logger } from '@/util/Logger';
import { RequestError } from '@/util/Error';
import { RadioPlus } from '@/types/RadioPlus';

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

    return fetch(SpotifyEndpointURLs.track.getAudioFeatures(id), requestParams)
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

    return fetch(SpotifyEndpointURLs.track.getData(id), requestParams)
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
}
