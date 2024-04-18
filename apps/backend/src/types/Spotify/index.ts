import {
  AuthToken,
  DetailedAuthToken,
  AccessToken,
} from '@/types/Spotify/AuthToken';
import { Error } from '@/types/Spotify/Error';

declare namespace Spotify {
  export { AuthToken, DetailedAuthToken, AccessToken, Error };
}

export { Spotify };
