import Cookies from 'js-cookie';

import { SupportedCookies } from '@/constants/SupportedCookies';

/**
 * Utility class to manage the access token cookie.
 * Every validation test that is performed in this class, is just superficial,
 * as a concrete check is only executed, when actually fetching user data.
 */
class AuthTokenManager {
  public static deleteTokenCookie() {
    Cookies.remove(SupportedCookies.accessToken);
    Cookies.remove(SupportedCookies.accessTokenExpiration);
    Cookies.remove(SupportedCookies.refreshToken);
  }
}

export { AuthTokenManager };
