import Cookies from 'js-cookie';

import { SupportedCookies } from '@/constants/SupportedCookies';

/**
 * Utility class to manage the auth token cookies.
 */
class CookieManager {
  public static deleteCookies() {
    Cookies.remove(SupportedCookies.accessToken);
    Cookies.remove(SupportedCookies.refreshToken);
    Cookies.remove(SupportedCookies.userMarket);
    Cookies.remove(SupportedCookies.userId);
  }
}

export { CookieManager };
