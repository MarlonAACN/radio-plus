import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpHeader } from '@/util/HttpHeader';
import { SpotifyEndpointURLs } from '@/constants/SpotifyEndpointURLs';
import { logger } from '@/util/Logger';
import { RequestError } from '@/util/Error';
import { throwIfDataIsSpotifyError } from '@/util/throwIfDataIsSpotifyError';

@Injectable()
export class PlayerService {
  /**
   * Transfer the current spotify playback of the user to the device with the given id.
   * @param deviceId {string} The id of the device to whom the player will be transferred to.
   * @param accessToken {string} The access token of the user to authenticate and identify the correct user.
   */
  transferPlayback(deviceId: string, accessToken: string): Promise<void> {
    const requestParams = {
      method: 'PUT',
      headers: {
        'Authorization': HttpHeader.getSpotifyBearerAuthorization(accessToken),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ device_ids: [deviceId], play: false }),
    };

    return fetch(SpotifyEndpointURLs.player.PlaybackState, requestParams)
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
          '[transferPlayback] Transferring playback to Radio⁺ player failed:',
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to transfer playback to Radio⁺ player.'
          )
        );
      });
  }

  /**
   * Try to skip to the desired position of the current track.
   * If the position (in ms) is greater than the tracks max length, skip to next track.
   * @param position {number} The desired position in ms. If greater than the tracks max length, skip to next track.
   * @param deviceId {string} The id of the device to whom the player will be transferred to.
   * @param accessToken {string} The access token of the user to authenticate and identify the correct user.
   */
  seekPosition(
    position: number,
    deviceId: string,
    accessToken: string
  ): Promise<void> {
    const urlParams = new URLSearchParams({
      device_id: deviceId,
      position_ms: position.toString(),
    });

    const requestParams = {
      method: 'PUT',
      headers: {
        Authorization: HttpHeader.getSpotifyBearerAuthorization(accessToken),
      },
    };

    return fetch(
      SpotifyEndpointURLs.player.SeekPosition(urlParams),
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
          `[seekPosition] Seeking position to ${position}ms in current track failed:`,
          error.message
        );

        return Promise.reject(
          new RequestError(
            error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            'Seeking position in current track failed.'
          )
        );
      });
  }
}
