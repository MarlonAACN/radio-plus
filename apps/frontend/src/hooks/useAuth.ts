import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';

import { SupportedCookies } from '@/constants/SupportedCookies';
import { AuthRepo } from '@/repos/AuthRepo';
import { RadioPlusError } from '@/util/Error';
import { logger } from '@/util/Logger';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // On page load / page change check authentication status
  useEffect(() => {
    hasAuthentication();
  }, []);

  /**
   * Checks the cookies of the client, if any authentication cookies exist.
   * This actively updates the status of the use state variable.
   * @returns {boolean} True if either an access or refresh token exists.
   */
  function hasAuthentication(): boolean {
    const accessToken = Cookies.get(SupportedCookies.accessToken);
    const refreshToken = Cookies.get(SupportedCookies.refreshToken);

    if (accessToken !== undefined || refreshToken !== undefined) {
      logger.log('[useAuth] User is authenticated.');
      setIsAuthenticated(true);
      return true;
    } else {
      logger.log('[useAuth] User is currently not authenticated.');
      setIsAuthenticated(false);
      return false;
    }
  }

  /**
   * Get the current valid access token of the user.
   * If no access token exists, but a refresh token, refresh token set and update cookies accordingly, when called on client side.
   * @returns {Promise<string>} The currently valid access token.
   * @throws {Error} If neither access nor a refresh token exists as cookies on the client.
   * @throws {Error} If spotify fails to refresh the token.
   */
  function getAuthToken(): Promise<string> {
    const accessToken: string | undefined = Cookies.get(
      SupportedCookies.accessToken
    );

    // If access token exists, return
    if (accessToken) {
      logger.log('[useAuth] Valid access token found in cookies.');
      return Promise.resolve(accessToken);
    }

    const refreshToken: string | undefined = Cookies.get(
      SupportedCookies.refreshToken
    );

    // Neither access nor refresh token exists, throw error as user is not authenticated.
    if (!refreshToken) {
      logger.error(
        '[useAuth] Client contains neither access nor refresh token, user is not authenticated.'
      );

      setIsAuthenticated(false);
      return Promise.reject('User is not authenticated.');
    }

    // try to refresh token
    return new AuthRepo(process.env.NEXT_PUBLIC_API_BASE_URL)
      .refreshToken(refreshToken)
      .then((authToken: Spotify.AuthToken) => {
        return authToken.access_token;
      })
      .catch((err: RadioPlusError) => {
        logger.error('[useAuth] Refreshing token failed:', err.message);
        return Promise.reject('Failed to refresh token');
      });
  }

  return {
    isAuthenticated,
    getAuthToken,
  };
}

export default useAuth;
