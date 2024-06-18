export const SpotifyEndpointURLs = {
  TokenAuthorization: 'https://accounts.spotify.com/api/token',
  UserOAuth: (urlParams: URLSearchParams) =>
    `https://accounts.spotify.com/authorize/?${urlParams}`,
  player: {
    PlaybackState: 'https://api.spotify.com/v1/me/player',
    SeekPosition: (urlParams: URLSearchParams) =>
      `https://api.spotify.com/v1/me/player/seek?${urlParams}`,
    StartResumePlayback: (urlParams: URLSearchParams) =>
      `https://api.spotify.com/v1/me/player/play?${urlParams}`,
    AddToQueue: (urlParams: URLSearchParams) =>
      `https://api.spotify.com/v1/me/player/queue?${urlParams}`,
  },
  track: {
    GetData: (id: string) => `https://api.spotify.com/v1/tracks/${id}`,
    GetAudioFeatures: (id: string) =>
      `https://api.spotify.com/v1/audio-features/${id}`,
    IsSavedByUser: (urlParams: URLSearchParams) =>
      `https://api.spotify.com/v1/me/tracks/contains?${urlParams}`,
    SaveTrack: (urlParams: URLSearchParams) =>
      `https://api.spotify.com/v1/me/tracks?${urlParams}`,
  },
  playlist: {
    create: (userId: string) =>
      `https://api.spotify.com/v1/users/${userId}/playlists`,
    get: (playlistId: string) =>
      `https://api.spotify.com/v1/playlists/${playlistId}`,
    delete: (playlistId: string) =>
      `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
    updateDetails: (playlistId: string) =>
      `https://api.spotify.com/v1/playlists/${playlistId}`,
    addTracks: (playlistId: string) =>
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
  },
  GetRecommendations: (urlParams: URLSearchParams) =>
    `https://api.spotify.com/v1/recommendations?${urlParams}`,
  GetUserProfile: 'https://api.spotify.com/v1/me',
  GetRecentlyPlayedTracks: (urlParams: URLSearchParams) =>
    `https://api.spotify.com/v1/me/player/recently-played?${urlParams}`,
  GetFollowedArtists: (urlParams: URLSearchParams) =>
    `https://api.spotify.com/v1/me/following?${urlParams}`,
  GetUsersTopArtists: (urlParams: URLSearchParams) =>
    `https://api.spotify.com/v1/me/top/artists?${urlParams}`,
  GetUsersTopTracks: (urlParams: URLSearchParams) =>
    `https://api.spotify.com/v1/me/top/tracks?${urlParams}`,
};
