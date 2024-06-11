import { useEffect, useState } from 'react';

import { DEFAULT_MARKET } from '@/constants';
import { UserRepo } from '@/repos/UserRepo';
import { RadioPlus } from '@/types/RadioPlus';
import { logger } from '@/util/Logger';

function useUser(): RadioPlus.UserHook {
  const [userData, setUserData] = useState<RadioPlus.UserData | null>(null);
  const userRepo = new UserRepo(process.env.NEXT_PUBLIC_API_BASE_URL);

  /** On load fetch required user data. */
  useEffect(() => {
    getUserData().finally(() => {
      logger.log('[useUser] Init user data fetch completed.');
    });
  }, []);

  /**
   * Fetches the required user data from the backend and updates the useState variable.
   */
  async function getUserData() {
    const userMarket = await userRepo
      .getUserMarket()
      .then((data) => {
        return data.market;
      })
      .catch((err: RadioPlus.Error) => {
        logger.warn(
          '[getUserData] Failed fetching users market, returning fallback instead.',
          err
        );

        return DEFAULT_MARKET;
      });

    setUserData({
      market: userMarket,
      recentTracks: [],
    });
  }

  return {
    userData,
    fetchCompleted: userData !== null,
  };
}

export { useUser };
