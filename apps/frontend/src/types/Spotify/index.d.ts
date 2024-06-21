// Turned into global .d.ts file, so namespace merges with externally installed type package:
// @types/spotify-web-playback-sdk
declare namespace Spotify {
  type AuthToken = {
    /** The access token */
    access_token: string;

    /** The token type */
    expires_in: number;

    /** The refresh token if any to refresh the current token */
    refresh_token: string;
  };

  type Genres = {
    genres: Array<string>;
  };
}
