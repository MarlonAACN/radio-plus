import { ApiRouter } from '@/router/api/ApiRouter';
import { RadioPlus } from '@/types/RadioPlus';
import { HttpHandler } from '@/util/HttpHandler';

class AlgoRepo {
  private readonly router: ApiRouter;

  constructor(apiBase: string) {
    this.router = new ApiRouter(apiBase);
  }

  initAlgorithm(
    originTrackId: string,
    user: RadioPlus.User,
    deviceId: string
  ): Promise<void> {
    return fetch(
      this.router.get('initAlgorithm').build({
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

  updateQueue(
    deviceId: string,
    originTrackId: string,
    user: RadioPlus.User
  ): Promise<{ trackId: string }> {
    return fetch(
      this.router.get('updateQueue').build({
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
        }),
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<{ trackId: string }>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<{ trackId: string }>(errResponse);
      });
  }
}

export { AlgoRepo };
