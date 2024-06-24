type AlgorithmHook = {
  error: string | null;
  userFetched: boolean;
  isLoading: boolean;
  /** Playlist url of the playlist created by the algorithm. */
  playlistUrl: string | null;
};

export type { AlgorithmHook };
