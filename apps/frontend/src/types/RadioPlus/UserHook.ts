import { User } from '@/types/RadioPlus/UserData';

type UserHook = {
  /** The data of the user. */
  data: User | null;
  /** Boolean that indicates if the init fetch for the customer data was completed. */
  fetchCompleted: boolean;
  error: string | null;
};

export type { UserHook };
