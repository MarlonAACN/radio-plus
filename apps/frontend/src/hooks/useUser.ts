import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';

import { SupportedCookies } from '@/constants/SupportedCookies';
import { UserRepo } from '@/repos/UserRepo';
import { RadioPlus } from '@/types/RadioPlus';
import { logger } from '@/util/Logger';

function useUser(): RadioPlus.UserHook {
  const [data, setData] = useState<RadioPlus.User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userRepo = new UserRepo(process.env.NEXT_PUBLIC_API_BASE_URL);

  /** On load fetch user. */
  useEffect(() => {
    getUser()?.finally(() => {
      logger.log('[useUser] Init user fetch completed.');
    });
  }, []);

  /**
   * Tries to fetch the user data from the client cookies.
   * @returns {RadioPlus.User} The user data from cookies or null if none or not all data was found in cookies.
   */
  function getUserFromCookies(): RadioPlus.User | null {
    const id = Cookies.get(SupportedCookies.userId);
    const market = Cookies.get(SupportedCookies.userMarket);

    if (!id || !market) {
      return null;
    }

    return {
      id: id,
      market: market,
    };
  }

  /**
   * Fetches the user from the backend and updates the useState variable.
   * The id and market of the user are required information for the recommendation algorithm to work.
   */
  function getUser() {
    const userFromCookies = getUserFromCookies();

    if (userFromCookies) {
      logger.log('[getUser] Found user data in cookies.');
      setData(userFromCookies);

      return;
    }

    return userRepo
      .getUser()
      .then((data) => {
        setData(data);
      })
      .catch((err: RadioPlus.Error) => {
        logger.error('[getUser] Failed fetching user.', err);

        setError('Failed fetching user, please reload.');
      });
  }

  return {
    data: data,
    error: error,
    fetchCompleted: data !== null,
  };
}

export { useUser };
