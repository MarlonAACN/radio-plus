import { ApiRouter } from '@/router/api/ApiRouter';
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

  /**
   * Refresh a token set based on the given refresh token.
   * This will still automatically update the clients access and refresh tokens, when called from client side.
   * @param refreshToken {string} The refresh token, which will generated a new token set.
   * @returns {Promise<Response>} The raw response object to be able to extract stuff like set-Cookie headers.
   */
  refreshTokenRawResponse(refreshToken: string): Promise<Response> {
    return fetch(
      this.router.get('RefreshToken').build({
        v: 'v1',
      }),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      }
    );
  }

  /**
   * Refresh a token set based on the given refresh token.
   * This automatically updates the clients access and refresh tokens, when called from client side.
   * @param refreshToken {string} The refresh token, which will generated a new token set.
   * @returns {Promise<Spotify.AuthToken>} The newly generated spotify auth token set.
   */
  refreshToken(refreshToken: string): Promise<Spotify.AuthToken> {
    return fetch(
      this.router.get('RefreshToken').build({
        v: 'v1',
      }),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<Spotify.AuthToken>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<Spotify.AuthToken>(errResponse);
      });
  }
}

export { AuthRepo };
