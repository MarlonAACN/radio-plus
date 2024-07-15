import { HttpStatus, Injectable } from '@nestjs/common';

import { RADIO_PLUS_COVER_BASE64_JPEG } from '@/constants';
import { SpotifyEndpointURLs } from '@/constants/SpotifyEndpointURLs';
import { TrackService } from '@/track/track.service';
import { RadioPlus } from '@/types/RadioPlus';
import { RequestError } from '@/util/Error';
import { SpotifyURI, SpotiyUriType } from '@/util/formatter/SpotifyURI';
import { HttpHeader } from '@/util/HttpHeader';
import { logger } from '@/util/Logger';
import { throwIfDataIsSpotifyError } from '@/util/throwIfDataIsSpotifyError';

@Injectable()
export class PlaylistService {
  constructor(private trackService: TrackService) {}

  /**
   * Creates a new playlist in the users account.
   * @param userId {string} The id of the current user.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @param details {RadioPlus.PlaylistDetailData} Detail data of the playlist, consisting of name and description.
   * @returns {Spotify.CreatePlaylistResponse} The newly created playlist
   */
  public createPlaylist(
    userId: string,
    accessToken: string,
    details: RadioPlus.PlaylistDetailData
  ): Promise<Spotify.CreatePlaylistResponse> {
    const requestParams = {
      method: 'POST',
      headers: {
        'Authorization': HttpHeader.getSpotifyBearerAuthorization(accessToken),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: details.name,
        description: details.description,
        public: false,
      }),
    };

    return fetch(SpotifyEndpointURLs.playlist.create(userId), requestParams)
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data: Spotify.CreatePlaylistResponse = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);
        logger.log(
          `[createPlaylist] Playlist "${details.name}" with id ${data.id} successfully created.`
        );

        return data;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[createPlaylist] Failed to create new playlist "${details.name}".`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed to create new playlist "${details.name}".`
          )
        );
      });
  }

  /**
   * Add an array of tracks to the playlist with the given id.
   * @param playlistId {string} The id of the playlist, where the tracks should be added to.
   * @param tracksIds {Array<string>} A list of track ids that should be added to the playlist.
   * @param accessToken {string} The access token of the user to authenticate the request.
   */
  public addTracksToPlaylist(
    playlistId: string,
    tracksIds: Array<string>,
    accessToken: string
  ): Promise<void> {
    const requestParams = {
      method: 'POST',
      headers: {
        'Authorization': HttpHeader.getSpotifyBearerAuthorization(accessToken),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: tracksIds.map((trackId) =>
          SpotifyURI.construct(trackId, SpotiyUriType.track)
        ),
        position: 0,
      }),
    };

    return fetch(
      SpotifyEndpointURLs.playlist.addTracks(playlistId),
      requestParams
    )
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);
        logger.log(
          `[addTracksToPlaylist] ${tracksIds.length} Tracks successfully added to playlist with id ${playlistId}.`
        );

        return;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[addTracksToPlaylist] Failed to add tracks to playlist with id ${playlistId}`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed to add tracks to playlist with id ${playlistId}.`
          )
        );
      });
  }

  /**
   * Update the details of a playlist, consisting of name and description.
   * @param playlistId {string} The id of the playlist, which details should be updated.
   * @param details {RadioPlus.PlaylistDetailData} The new detail data for the playlist.
   * @param accessToken {string} The access token of the user to authenticate the request.
   */
  public updatePlaylistDetails(
    playlistId: string,
    details: RadioPlus.PlaylistDetailData,
    accessToken: string
  ): Promise<void> {
    const requestParams = {
      method: 'PUT',
      headers: {
        'Authorization': HttpHeader.getSpotifyBearerAuthorization(accessToken),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: details.name,
        description: details.description,
      }),
    };

    return fetch(
      SpotifyEndpointURLs.playlist.updateDetails(playlistId),
      requestParams
    )
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);
        logger.log(
          `[updatePlaylistDetails] Playlist details with id ${playlistId} successfully updated.`
        );

        return;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[updatePlaylistDetails] Failed to update playlist with id ${playlistId} details.`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed to update playlist with id ${playlistId} details.`
          )
        );
      });
  }

  /**
   * Fetch an existing playlist and its data.
   * @param playlistId {string} The id of the playlist that should be fetched.
   * @param accessToken {string} The access token of the user to authenticate the request.
   * @returns {Spotify.SinglePlaylistResponse} The fetched playlist.
   */
  public getPlaylist(
    playlistId: string,
    accessToken: string
  ): Promise<Spotify.SinglePlaylistResponse> {
    const requestParams = {
      method: 'GET',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(SpotifyEndpointURLs.playlist.get(playlistId), requestParams)
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data: Spotify.SinglePlaylistResponse = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);
        logger.log(
          `[getPlaylist] Successfully fetched playlist with id ${playlistId}.`
        );

        return data;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[getPlaylist] Failed to fetch playlist with id ${playlistId}.`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed to fetch playlist with id ${playlistId}.`
          )
        );
      });
  }

  /**
   * Unfollows the given playlist.
   * @param playlistId {string} The id of the playlist which should be unfollowed.
   * @param accessToken {string} The access token of the user to authenticate the request.
   */
  public dumpPlaylist(playlistId: string, accessToken: string): Promise<void> {
    const requestParams = {
      method: 'DELETE',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(SpotifyEndpointURLs.playlist.delete(playlistId), requestParams)
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);
        logger.log(
          `[dumpPlaylist] Playlist with id ${playlistId} was dumped successfully.`
        );

        return;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[dumpPlaylist] Failed to dump playlist with id ${playlistId}.`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed to dump playlist with id ${playlistId}.`
          )
        );
      });
  }

  /**
   * Sets the cover image of the given playlist to a radio plus cover image.
   * @param playlistId {string} The id of the playlist for which the cover should be set.
   * @param accessToken {string} The access token of the user to authenticate the request.
   */
  public addRadioPlusPlaylistCoverImage(
    playlistId: string,
    accessToken: string
  ): Promise<void> {
    logger.log('Setting playlist cover is currently disabled.');

    const requestParams = {
      method: 'PUT',
      headers: {
        'Authorization': HttpHeader.getSpotifyBearerAuthorization(accessToken),
        'Content-Type': 'application/json',
      },
      body: RADIO_PLUS_COVER_BASE64_JPEG,
    };

    return fetch(
      SpotifyEndpointURLs.playlist.addCustomPlayCoverImage(playlistId),
      requestParams
    )
      .then((response) => {
        return response.text();
      })
      .then((raw) => {
        const data = raw ? JSON.parse(raw) : {};

        throwIfDataIsSpotifyError(data);
        logger.log(
          `[addRadioPlusPlaylistCoverImage] Playlist image cover set successfully.`
        );

        return;
      })
      .catch((error: Spotify.Error) => {
        logger.error(
          `[addRadioPlusPlaylistCoverImage] Failed to set playlist imager cover.`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed to set playlist imager cover.`
          )
        );
      });
  }

  public async analyzePlaylist(
    playlistId: string,
    accessToken: string
  ): Promise<void> {
    const playlist = await this.getPlaylist(playlistId, accessToken);
    // Filter out items where obj.track is null
    const filteredItems = playlist.tracks.items.filter(
      (obj) => obj.track !== null
    );

    // Extract track IDs from the filtered items
    const trackIds = filteredItems.map((obj) => obj.track!.id);

    const danceabilityList: Array<number> = [];
    const valenceList: Array<number> = [];
    const bpmList: Array<number> = [];

    logger.log(`Tracks in playlist: ${playlist.tracks.items.length}.`);

    const tracksData = await this.trackService
      .getSeveralTracksAudioFeatures(trackIds, accessToken)
      .catch((err: RequestError) => {
        logger.error(
          '[getSeveralTracksAudioFeatures] Fetching several tracks audio data failed.',
          err
        );

        return null;
      });

    if (tracksData === null) {
      return;
    }

    for (const trackData of tracksData) {
      danceabilityList.push(trackData.danceability);
      valenceList.push(trackData.valence);
      bpmList.push(trackData.tempo);
    }

    danceabilityList.sort((a, b) => a - b);

    logger.log(
      `Danceability list: ${danceabilityList[0]}, ${
        danceabilityList[danceabilityList.length - 1]
      }`
    );
    logger.log(
      `Valence list: ${valenceList[0]}, ${valenceList[valenceList.length - 1]}`
    );
    logger.log(`BPM list: ${bpmList[0]}, ${bpmList[bpmList.length - 1]}`);

    const sumDanceability = danceabilityList.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    const sumValence = valenceList.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    const sumBpm = bpmList.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    logger.log(
      `Average danceability: ${sumDanceability / danceabilityList.length}`
    );
    logger.log(`Average valence: ${sumValence / valenceList.length}`);
    logger.log(`Average bpm: ${sumBpm / bpmList.length}`);
    return;
  }
}
