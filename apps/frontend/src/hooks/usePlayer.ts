import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import {
  SPOTIFY_DEVICE_NAME,
  SPOTIFY_INIT_VOLUME,
  SPOTIFY_PLAYBACK_SDK_URL,
} from '@/constants';
import useAuth from '@/hooks/useAuth';
import { PlayerRepo } from '@/repos/PlayerRepo';
import { appRouter } from '@/router/app/AppRouter';
import { logger } from '@/util/Logger';
import { AuthTokenManager } from '@/util/manager/AuthTokenManager';

function usePlayer() {
  const { getAuthToken, isAuthenticated } = useAuth();
  const router = useRouter();
  const playerRepo = new PlayerRepo(process.env.NEXT_PUBLIC_API_BASE_URL);

  const [webPlaybackSDKReady, setWebPlaybackSDKReady] =
    useState<boolean>(false);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);

  /** Determines if player is connected to spotify. */
  const [isActive, setActive] = useState<boolean>(false);
  /** Determines if a current request for an operation is running. */
  const [eventIsLoading, setEventIsLoading] = useState<boolean>(false);
  /** Determines if the init playback transfer was successfully. */
  const [wasTransfered, setWasTransfered] = useState<boolean>(false);
  const [showReconnectBtn, setShowReconnectBtn] = useState<boolean>(false);
  /** On auth or account error from spotify, block player until redirect to login page. */
  const [errorOccured, setErrorOccured] = useState<boolean>(false);
  const [isPaused, setPaused] = useState<boolean>(true);
  /** Position in current track. */
  const [position, setPosition] = useState<number>(0);
  const [currentTrack, setTrack] = useState<Spotify.Track | null>(null);
  const deviceId = useRef<string | null>(null);

  // load Web Playback SDK, when user is authenticated and SDK hasn't been instanciated yet.
  useEffect(() => {
    if (isAuthenticated && !webPlaybackSDKReady) {
      const script = document.createElement('script');
      script.src = SPOTIFY_PLAYBACK_SDK_URL;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        logger.log('[SpotifyPlayer] Web playback SDK is ready.');
        setWebPlaybackSDKReady(true);
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isAuthenticated]);

  // create Spotify.Player instance. Called once when playback SDK is marked as ready.
  // Since SDK can only be marked as ready, when user is authenticated, the useEffect call needs to additional auth check.
  useEffect(() => {
    if (webPlaybackSDKReady) {
      const player = new Spotify.Player({
        name: SPOTIFY_DEVICE_NAME,
        getOAuthToken: async (callback) =>
          callback(
            await getAuthToken().catch(() => {
              return 'unauthorized';
            })
          ),
        volume: SPOTIFY_INIT_VOLUME,
      });

      eventHandlerFactory(player);
      setPlayer(player);

      connectPlayer(player);

      return () => {
        disconnectPlayer(player);
      };
    }
  }, [webPlaybackSDKReady]);

  /**
   * Add all from radio+ required event handlers to the spotify player.
   * @param player {Spotify.Player} The freshly created spotify player instance.
   */
  function eventHandlerFactory(player: Spotify.Player): void {
    player.addListener('player_state_changed', (state) => {
      if (!state) {
        return;
      }

      setTrack(state.track_window.current_track);
      setPosition(state.position);
      setPaused(state.paused);

      player.getCurrentState().then((state) => {
        !state ? setActive(false) : setActive(true);
      });

      logger.log('DEBUG: [SpotifyPlayer] Player state changed.');
    });

    player.addListener('ready', ({ device_id }) => {
      logger.log('[SpotifyPlayer] Ready with Device ID', device_id);
      deviceId.current = device_id;
      playerIsReadyHandler(device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
      logger.warn('[SpotifyPlayer] Device ID has gone offline', device_id);

      if (player !== null) {
        disconnectPlayer(player);
      }
    });

    player.on('authentication_error', ({ message }) => {
      logger.error('[SpotifyPlayer] Player failed to authenticate:', message);
      resetPlayer();
    });

    player.on('playback_error', ({ message }) => {
      logger.error('[SpotifyPlayer] Failed to perform playback:', message);
      setShowReconnectBtn(true);
    });

    player.on('account_error', ({ message }) => {
      logger.error(
        '[SpotifyPlayer] Failed to validate Spotify account:',
        message
      );
      resetPlayer();
    });
  }

  function togglePause() {
    logger.log('DEBUG: [SpotifyPlayer] Player paused.');

    setEventIsLoading(true);
    player?.togglePlay().finally(() => {
      setEventIsLoading(false);
    });
  }

  function skipForward() {
    logger.log('DEBUG: [SpotifyPlayer] Skipped forwards.');

    setEventIsLoading(true);
    player?.nextTrack().finally(() => {
      setEventIsLoading(false);
    });
  }

  function skipBackwards() {
    logger.log('DEBUG: [SpotifyPlayer] Skipped backwards.');

    setEventIsLoading(true);
    player?.previousTrack().finally(() => {
      setEventIsLoading(false);
    });
  }

  /**
   * Try to skip to the desired position of the current track.
   * If the position (in ms) is greater than the tracks max length, skip to next track.
   * Simply resolves if device id hasn't been established yet.
   * @param positionMs {number} The desired position in ms. If greater than the tracks max length, skip to next track.
   * @returns {Promise<boolean>} Return a boolean depending on the outcome of the operation
   */
  function seekPosition(positionMs: number): Promise<boolean> {
    if (!deviceId.current) {
      logger.warn(
        '[SpotifyPlayer] Cant seek position before device id is established.'
      );

      return Promise.resolve(false);
    }

    setEventIsLoading(true);
    return playerRepo
      .seekPosition(positionMs, deviceId.current)
      .then(() => {
        logger.log(
          '[SpotifyPlayer] Position of current track was updated successfully.'
        );

        return Promise.resolve(true);
      })
      .catch(() => {
        logger.error(
          '[SpotifyPlayer] Failed update position of current track.'
        );

        return Promise.resolve(false);
      })
      .finally(() => {
        setEventIsLoading(false);
      });
  }

  /**
   * Connect the given player instance to spotify.
   * @param player {Spotify.Player} The freshly created spotify player instance.
   */
  function connectPlayer(player: Spotify.Player): Promise<void> {
    return player.connect().then((success) => {
      if (success) {
        logger.log(
          '[SpotifyPlayer] The Web Playback SDK successfully connected to Spotify!'
        );

        setActive(true);
        return;
      } else {
        logger.warn(
          '[SpotifyPlayer] The Web Playback SDK failed to connect to Spotify.'
        );

        setActive(false);
        return;
      }
    });
  }

  /**
   * disconnect the given player instance to spotify.
   * @param _player {Spotify.Player} The existing spotify player instance that should be disconnected.
   */
  function disconnectPlayer(_player: Spotify.Player) {
    setActive(false);
    setPlayer(null);
    setWasTransfered(false);
    _player.disconnect();
  }

  function reconnectPlayer() {
    setShowReconnectBtn(false);

    if (player === null) {
      return router.reload();
    }

    if (!isActive) {
      return connectPlayer(player);
    }

    if (deviceId.current !== null) {
      return playerIsReadyHandler(deviceId.current);
    } else {
      return router.reload();
    }
  }

  /**
   * When both the access token and the refresh token are expired and thus are not present as cookies anymore (rare potential occasion),
   * Reset the player and redirect user back to login page to authenticate themselves once again.
   */
  function resetPlayer() {
    logger.log('[SpotifyPlayer] Resetting player...');

    setErrorOccured(true);

    if (player !== null) {
      disconnectPlayer(player);
    }

    AuthTokenManager.deleteAuthTokenCookies();

    setTimeout(() => {
      router.push(appRouter.get('Login').build());
    }, 1000);
  }

  /**
   * Transfer the playback of a connected and ready player to said player.
   * @param deviceId {string} The device id of the connected and ready player.
   */
  function playerIsReadyHandler(deviceId: string): Promise<void> {
    return playerRepo
      .transferPlayback(deviceId)
      .then(() => {
        logger.log(
          '[SpotifyPlayer] Playback was successfully transferred to this player.'
        );

        setWasTransfered(true);
      })
      .catch(() => {
        logger.error(
          '[SpotifyPlayer] Failed to transfer playback to this player.'
        );
      });
  }

  return {
    currentTrack,
    togglePause,
    skipBackwards,
    skipForward,
    wasTransfered,
    isActive,
    isPaused,
    eventIsLoading,
    position,
    seekPosition,
    errorOccured,
    reconnectPlayer,
    showReconnectBtn,
  };
}

export default usePlayer;
