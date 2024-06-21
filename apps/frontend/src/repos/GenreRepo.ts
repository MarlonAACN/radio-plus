import { ApiRouter } from '@/router/api/ApiRouter';
import { HttpHandler } from '@/util/HttpHandler';

class GenreRepo {
  private readonly router: ApiRouter;

  constructor(apiBase: string) {
    this.router = new ApiRouter(apiBase);
  }

  getAvailableGenres(): Promise<Spotify.Genres> {
    return fetch(
      this.router.get('getAvailableGenres').build({
        v: 'v1',
      }),
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<Spotify.Genres>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<Spotify.Genres>(errResponse);
      });
  }
}

export { GenreRepo };
