import { GetServerSidePropsContext } from 'next';

import { parse } from 'set-cookie-parser';

import { SupportedCookies } from '@/constants/SupportedCookies';
import { ApiRouter } from '@/router/api/ApiRouter';
import { logger } from '@/util/Logger';

class ContextManager {
  public static setNoStoreCacheHeader(ctx: GetServerSidePropsContext): void {
    ctx.res.setHeader('Cache-Control', 'no-store, must-revalidate');
  }

  /**
   * Get a single param from the context url.
   * @param ctx {GetServerSidePropsContext} getServerSide context object.
   * @param name declared param name.
   * @returns the param value or undefined if not found.
   */
  public static getSingleParam(
    ctx: GetServerSidePropsContext,
    name: string
  ): string | undefined {
    let param = ctx.params?.[name];

    if (param && Array.isArray(param)) {
      param = param[0];
    }

    return param;
  }

  /**
   * Get an object containing the data of the query params that were defined in the names attribute. Undefined values will be omitted from the final object.
   * @param ctx {GetServerSidePropsContext} getServerSide context object.
   * @param names {Array<string>} A list of all query names that should be looked up and returned.
   * @returns { [K in T]?: string } An object with all desired query parameters, where undefined values are not present in the final object.
   */
  public static getDefinedParams<T extends string>(
    ctx: GetServerSidePropsContext,
    names: Array<T>
  ): { [K in T]?: string } {
    const result: { [K in T]?: string } = {};

    for (const name of names) {
      const value = ctx.query[name];

      if (Array.isArray(value)) {
        result[name] = value[0]; // Push first item of array.
      } else if (value) {
        result[name] = value;
      }
    }

    return result;
  }

  public static deleteCookieOnClient(
    name: string,
    ctx: GetServerSidePropsContext
  ): void {
    const deleteCookie = `${name}=undefined; Max-Age=0; path=/`;
    const setCookieHeader = ctx.res.getHeader('Set-Cookie');

    // check if cookie header in res exists
    if (!setCookieHeader) {
      ctx.res.setHeader('Set-Cookie', deleteCookie);
    } else {
      // check if cookie header is an array
      if (Array.isArray(setCookieHeader)) {
        ctx.res.setHeader('Set-Cookie', setCookieHeader.push(deleteCookie));
      } else {
        // turn cookie header string into an array and push
        ctx.res.setHeader('Set-Cookie', [
          setCookieHeader.toString(),
          deleteCookie,
        ]);
      }
    }
  }

  /**
   * Checks the context object of a server side object, if access or refresh tokens exist.
   * Fetches a new access token if no access token exists, but a refresh token.
   * Direclty manipluates the Set-Cookie header payload of the given context object.
   * @param ctx {GetServerSidePropsContext} The getServerSide context object.
   * @throws {Error} If no tokens exist or the refresh request fails, an error is thrown.
   */
  public static async handleCookieAuth(
    ctx: GetServerSidePropsContext
  ): Promise<void> {
    const accessTokenCookie = ctx.req.cookies[SupportedCookies.accessToken];
    const refreshTokenCookie = ctx.req.cookies[SupportedCookies.refreshToken];

    if (!accessTokenCookie) {
      // If no access token exists, but a refresh token -> refresh access token.
      if (refreshTokenCookie) {
        logger.log(
          '[checkCookieAuth] Access token is expired, use refresh token to refresh token set...'
        );

        try {
          // Use the raw response object to extract set-cookie header.
          const setAuthCookieResponse = await fetch(
            new ApiRouter(process.env.API_BASE_URL).get('RefreshToken').build({
              v: 'v1',
            }),
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                refreshToken: refreshTokenCookie,
              }),
            }
          );

          // Parse set-cookie header for validation
          const cookies = parse(setAuthCookieResponse.headers.getSetCookie(), {
            decodeValues: true, // default: true
          });

          // Check if set-cookie payload includes access token
          if (
            cookies.find(
              (cookie) => cookie.name === SupportedCookies.accessToken
            ) === undefined
          ) {
            logger.error(
              "[checkCookieAuth] Request for token refresh, didn't return a new access token."
            );

            throw new Error(
              "Request for token refresh, didn't return a new access token."
            );
          }

          // Update contexts set-Cookie header.
          logger.log('[checkCookieAuth] Tokens were refreshed successfully.');

          ctx.res.setHeader(
            'Set-Cookie',
            setAuthCookieResponse.headers.getSetCookie()
          );

          return Promise.resolve();
        } catch (err) {
          logger.error('[checkCookieAuth] Refreshing token failed:', err);

          throw new Error('Refreshing token failed.');
        }
      } else {
        // Neither access nor refresh token exists.
        logger.error(
          '[BasePage] Neither access nor refresh token found in cookies.'
        );
        throw new Error('Neither access nor refresh token found in cookies.');
      }
    }
  }
}

export { ContextManager };
