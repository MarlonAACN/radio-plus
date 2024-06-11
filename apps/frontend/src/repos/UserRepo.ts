import { ApiRouter } from '@/router/api/ApiRouter';
import { HttpHandler } from '@/util/HttpHandler';

class UserRepo {
  private readonly router: ApiRouter;

  constructor(apiBase: string) {
    this.router = new ApiRouter(apiBase);
  }

  getUserMarket(): Promise<{ market: string }> {
    return fetch(
      this.router.get('getUserMarket').build({
        v: 'v1',
      }),
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<{ market: string }>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<{ market: string }>(errResponse);
      });
  }
}

export { UserRepo };
