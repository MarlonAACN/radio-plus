import { ApiRouter } from '@/router/api/ApiRouter';
import { RadioPlus } from '@/types/RadioPlus';
import { HttpHandler } from '@/util/HttpHandler';

class UserRepo {
  private readonly router: ApiRouter;

  constructor(apiBase: string) {
    this.router = new ApiRouter(apiBase);
  }

  getUser(): Promise<RadioPlus.User> {
    return fetch(
      this.router.get('getUser').build({
        v: 'v1',
      }),
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<RadioPlus.User>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<RadioPlus.User>(errResponse);
      });
  }
}

export { UserRepo };
