import { ApiRouter } from '@/router/api/ApiRouter';
import { RadioPlus } from '@/types/RadioPlus';
import { HttpHandler } from '@/util/HttpHandler';

class AlgoRepo {
  private readonly router: ApiRouter;

  constructor(apiBase: string) {
    this.router = new ApiRouter(apiBase);
  }

  runAlgorithm(
    deviceId: string,
    originTrackId: string,
    user: RadioPlus.User,
    freshTracks: boolean
  ): Promise<RadioPlus.PlaylistUrl> {
    return fetch(
      this.router.get('runAlgorithm').build({
        v: 'v1',
      }),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          deviceId: deviceId,
          originTrackId: originTrackId,
          user: user,
          freshTracks: freshTracks,
        }),
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<RadioPlus.PlaylistUrl>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<RadioPlus.PlaylistUrl>(errResponse);
      });
  }
}

export { AlgoRepo };
