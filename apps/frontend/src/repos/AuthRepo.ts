import { ApiRouter } from '@/router/api/ApiRouter';
import { HttpRedirectResponse } from '@/types/http/HttpRedirectResponse';
import { HttpHandler } from '@/util/HttpHandler';

class AuthRepo {
  private readonly router: ApiRouter;

  constructor(apiBase: string) {
    this.router = new ApiRouter(apiBase);
  }

  getSpotifyOAuthUrl() {
    return this.router.get('Auth').build({
      v: 'v1',
    });
  }

  // TODO: Remove
  example(): Promise<HttpRedirectResponse> {
    return fetch(
      this.router.get('Auth').build({
        v: 'v1',
      }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<HttpRedirectResponse>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<HttpRedirectResponse>(errResponse);
      });
  }
}

export { AuthRepo };
