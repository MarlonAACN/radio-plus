import { ApiRouter } from '@/router/api/ApiRouter';
import { HttpHandler } from '@/util/HttpHandler';

class PlayerRepo {
  private readonly router: ApiRouter;

  constructor(apiBase: string) {
    this.router = new ApiRouter(apiBase);
  }

  /**
   * Transfer the spotify playback to the device with the given id.
   * @param deviceId {string} The id of the device to whom the playback should be transferred to.
   */
  transferPlayback(deviceId: string): Promise<void> {
    return fetch(
      this.router.get('PlayerPlayback').build({
        v: 'v1',
      }),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          deviceId: deviceId,
        }),
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<void>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<void>(errResponse);
      });
  }

  /**
   * Try to skip to the desired position of the current track.
   * If the position (in ms) is greater than the tracks max length, skip to next track.
   * @param positionMs {number} The desired position in ms. If greater than the tracks max length, skip to next track.
   * @param deviceId {string} The id of the device to whom the player will be transferred to.
   */
  seekPosition(positionMs: number, deviceId: string): Promise<void> {
    return fetch(
      this.router.get('SeekPosition').build({
        v: 'v1',
      }),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          position: positionMs,
          deviceId: deviceId,
        }),
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<void>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<void>(errResponse);
      });
  }
}

export { PlayerRepo };
