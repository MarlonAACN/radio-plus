import Cookies from 'js-cookie';

import { SupportedCookies } from '@/constants/SupportedCookies';

/**
 * Utility class to manage the auth token cookies.
 */
class AuthTokenManager {
  public static deleteAuthTokenCookies() {
    Cookies.remove(SupportedCookies.accessToken);
    Cookies.remove(SupportedCookies.refreshToken);
  }
}

export { AuthTokenManager };
