import { UserData } from '@/types/RadioPlus/UserData';

type UserHook = {
  /** The data of the user. */
  userData: UserData | null;
  /** Boolean that indicates if the init fetch for the customer data was completed. */
  fetchCompleted: boolean;
};

export type { UserHook };
