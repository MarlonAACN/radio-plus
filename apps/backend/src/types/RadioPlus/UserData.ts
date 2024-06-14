type UserData = {
  /** Tracks the user recently listened to. (max 50 units) */
  recentTracks: Array<string>;
  /** Top tracks of the user. */
  topTracks: Array<string>;
  /** Top artists of the user. */
  topArtists: Array<string>;
  /** Artists, the user follows. */
  followedArtists: Array<string>;
};

type User = {
  id: string;
  /** Country the user is located in. */
  market: string;
};

export type { UserData, User };
