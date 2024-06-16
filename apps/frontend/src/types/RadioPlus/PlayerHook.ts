type PlayerHook = {
  /** The currently playing track or null if no track is selected / fetch is still running. */
  currentTrack: Spotify.Track | null;

  /** The id of the current track. Only updates when the track itself changes. */
  activeTrackId: string | null;
  /** ID of the radio plus spotify instance. */
  deviceId: string | null;
  /** Logout the current user and delete all references of him from the client. */
  logout: () => void;
  /** Pause the player. */
  pause: () => void;
  /** Toggle the playing state of the player. */
  togglePause: () => void;
  /** Skip to the previous song. */
  skipBackwards: () => void;
  /** Skip to the next song. */
  skipForward: () => void;
  /** Determines if the init playback transfer was successfully. */
  wasTransferred: boolean;
  /** Determines if player is connected to spotify. At this point the player is ready to be used. */
  isActive: boolean;
  /** Determines if playback is paused. */
  isPaused: boolean;
  /** Determines if a current request for an operation is running.  */
  eventIsLoading: boolean;
  /** The position in the currently running track. */
  position: number;
  /** Skip the current song to the desired position. */
  seekPosition: (positionMs: number) => Promise<boolean>;
  /** On auth or account error from spotify, block player until redirect to login page. */
  errorOccured: boolean;
  /** Reconnects the current player, handled differently depending on its disconnection state. */
  reconnectPlayer: () => void;
  /** Determines if the reconnect btn should be shown or not. */
  showReconnectBtn: boolean;
};

export type { PlayerHook };
