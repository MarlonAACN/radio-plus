export const SpotifyEndpointURLs = {
  TokenAuthorization: 'https://accounts.spotify.com/api/token',
  UserOAuth: (authQueryParams: string) =>
    `https://accounts.spotify.com/authorize/?${authQueryParams}`,
  PlaybackState: 'https://api.spotify.com/v1/me/player',
  SeekPosition: 'https://api.spotify.com/v1/me/player/seek',
};
