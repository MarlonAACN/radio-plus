import { useEffect, useRef, useState } from 'react';

import { useConfig } from '@/context/ConfigContext';
import { useUser } from '@/hooks/useUser';
import { AlgoRepo } from '@/repos/AlgoRepo';
import { RadioPlus } from '@/types/RadioPlus';
import { TrackFormatter } from '@/util/formatter/TrackFormatter';
import { logger } from '@/util/Logger';

type AlgorithmProps = {
  player: RadioPlus.PlayerHook;
};

function useAlgorithm({ player }: AlgorithmProps): RadioPlus.AlgorithmHook {
  const config = useConfig();
  const user = useUser();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [algoError, setAlgoError] = useState<string | null>(null);
  const blockQueueUpdate = useRef<boolean>(false);

  const algoRepo = new AlgoRepo(process.env.NEXT_PUBLIC_API_BASE_URL);

  /** if config data gets updated (updated by user), handle changes and update algorithm accordingly. */
  useEffect(() => {
    handleConfigChange(config.data);
  }, [config.data]);

  /** If the user hook throws an error update algos error state object accordingly. */
  useEffect(() => {
    if (user.error !== null) {
      setAlgoError(user.error);
    }
  }, [user.error]);

  /**
   * Update the algorithm with the latest data from the config.
   * If no origin track is set, disable algorithm to prevent new track being added to the queue.
   * @param _config {RadioPlus.Config} The current config object.
   */
  function handleConfigChange(_config: RadioPlus.Config) {
    if (!_config.radioOriginTrackUrl) {
      return;
    }

    // Confirm device id is set. This should always be the case!
    if (!player.deviceId) {
      setAlgoError(
        "Can't start smart queue before player is connected with Radio⁺"
      );

      return;
    }

    // Check if user data fetch was completed
    // user.fetchCompleted would usually be enough, but let's satisfy the compiler here.
    if (!user.fetchCompleted || !user.data) {
      setAlgoError("Can't start smart queue before user data is fetched.");

      return;
    }

    let originTrackId;
    try {
      originTrackId = TrackFormatter.parseTrackUrl(_config.radioOriginTrackUrl);
    } catch (err) {
      logger.error('[useAlgorithm] Track url is malformed.');
      setAlgoError('Origin track url is malformed');

      return;
    }

    if (!originTrackId) {
      return;
    }

    setAlgoError(null);
    player.pause();

    runAlgorithm(
      player.deviceId,
      originTrackId,
      user.data,
      _config.freshTracks,
      _config.selectedGenres,
      _config.bpm,
      _config.danceability,
      _config.popularity,
      _config.valence,
      _config.instrumentalness
    ).then((res) => {
      if (res === null) {
        setPlaylistUrl(null);
      } else {
        setPlaylistUrl(res.playlistUrl);
      }
    });
  }

  function runAlgorithm(
    deviceId: string,
    originTrackId: string,
    user: RadioPlus.User,
    freshTracks: boolean,
    selectedGenres: Array<string>,
    bpm: number | null | undefined,
    danceability: number | null | undefined,
    popularity: number | null | undefined,
    valence: number | null | undefined,
    instrumentalness: number | null | undefined
  ): Promise<RadioPlus.PlaylistUrl | null> {
    setIsLoading(true);

    return algoRepo
      .runAlgorithm(
        deviceId,
        originTrackId,
        user,
        freshTracks,
        selectedGenres,
        bpm ?? null,
        danceability ?? null,
        popularity ?? null,
        valence ?? null,
        instrumentalness ?? null
      )
      .then((data) => {
        logger.log(`[runAlgorithm] Algorithm ran successfully.`);
        return data;
      })
      .catch((err: RadioPlus.Error) => {
        logger.error('[runAlgorithm] Running algorithm failed:', err);

        setAlgoError(err.message);

        // reset origin track input
        config.setData({
          ...config.data,
          radioOriginTrackUrl: null,
        });

        return null;
      })
      .finally(() => {
        blockQueueUpdate.current = false;
        setIsLoading(false);
      });
  }

  return {
    error: algoError,
    userFetched: user.fetchCompleted,
    isLoading: isLoading,
    playlistUrl: playlistUrl,
  };
}

export { useAlgorithm };
