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

  const [algoIsActive, setAlgoIsActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  /** Update queue if new track comes up.
   * This can be blocked if the blockQueueUpdate is set to true. For example when the starting track is set, this hook should not fire.
   * With this hook there is always one track in the queue of the user, as a new track is added to the queue, once a new track comes up.
   * This hook won't fire if the same track comes up right after the same track. (This should never happen).
   * */
  useEffect(() => {
    logger.log('[UpdateQueueTracker] New track detected.');

    if (blockQueueUpdate.current) {
      logger.log(
        '[UpdateQueueTracker] Updating track queue by hook is currently disabled.'
      );
      return;
    }

    if (!player.deviceId) {
      logger.log(
        "[UpdateQueueTracker] Can't update queue before player is connected with RadioPlus"
      );

      return;
    }

    if (!config.radioOriginTrack?.information.id) {
      logger.log(
        '[UpdateQueueTracker] Not updating queue, as no orign track has been set yet.'
      );
      return;
    }

    if (!algoIsActive) {
      logger.log(
        '[UpdateQueueTracker] Smart queue is disabled, not updating queue.'
      );
      return;
    }

    // user.fetchCompleted would usually be enough, but let's satisfy the compiler here.
    if (!user.fetchCompleted || !user.data) {
      logger.log(
        '[UpdateQueueTracker] Tried to update queue, before user data fetch was completed.'
      );
      return;
    }

    updateTrackQueue(
      player.deviceId,
      config.radioOriginTrack.information.id,
      user.data
    );
  }, [player.activeTrackId]);

  /**
   * Update the algorithm with the latest data from the config.
   * If no origin track is set, disable algorithm to prevent new track being added to the queue.
   * @param config {RadioPlus.Config} The current config object.
   */
  function handleConfigChange(config: RadioPlus.Config) {
    // Reset errors
    setAlgoError(null);

    if (!config.radioOriginTrackUrl) {
      setAlgoIsActive(false);

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

    let trackId;
    try {
      trackId = TrackFormatter.parseTrackUrl(config.radioOriginTrackUrl);
    } catch (err) {
      logger.error('[useAlgorithm] Track url is malformed.');
      setAlgoIsActive(false);
      setAlgoError('Origin track url is malformed');

      return;
    }

    if (!trackId) {
      setAlgoIsActive(false);
      //player.pause();

      return;
    }

    setOriginTrack(trackId, player.deviceId, user.data);
  }

  /**
   * Finds a recommendation based on the origin track id and adds it to the users track queue.
   * @param deviceId {string} The device id of the Radio plus instance.
   * @param originTrackId {string} The id of the origin track, that is used to fetch recommendations.
   * @param user {RadioPlus.User} Data of the user, that is relevant for the algorithm.
   */
  function updateTrackQueue(
    deviceId: string,
    originTrackId: string,
    user: RadioPlus.User
  ) {
    return algoRepo
      .updateQueue(deviceId, originTrackId, user)
      .then((res) => {
        logger.log(
          `[updateTrackQueue] Track with id: ${res.trackId} was successfully added to the queue.`
        );
      })
      .catch((err: RadioPlus.Error) => {
        logger.error('[updateTrackQueue] Failed to update track queue:', err);

        setAlgoError(err.message);

        return false;
      })
      .finally(() => (blockQueueUpdate.current = false));
  }

  /**
   * Changes the currently played song to the track with the given id.
   * This marks the start of the running algorithm.
   * @param trackId {string} The id of the origin track
   * @param deviceId {string} The id of the current device (radio plus instance)
   * @param user {RadioPlus.User} The user data, relevant to the algorithm.
   * @returns {boolean} A boolean indicating the outcome of the operation.
   */
  function setOriginTrack(
    trackId: string,
    deviceId: string,
    user: RadioPlus.User
  ): Promise<boolean> {
    setIsLoading(true);
    // Prevent track change hook from adding a track to the queue.
    blockQueueUpdate.current = true;

    return algoRepo
      .initAlgorithm(trackId, user, deviceId)
      .then(() => {
        setAlgoIsActive(true);
        logger.log(
          '[setOriginTrack] Origin track has been set and algorithm has been started.'
        );

        // manually trigger 'update track queue', since hook would not be called, if the set origin track matches the already active one.
        updateTrackQueue(deviceId, trackId, user);
        return true;
      })
      .catch((err: RadioPlus.Error) => {
        logger.error(
          '[setOriginTrack] Failed setting new track and start algorithm:',
          err
        );

        setAlgoError('Launching smart queue failed');
        blockQueueUpdate.current = false;
        return false;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return {
    error: algoError,
    userFetched: user.fetchCompleted,
    isLoading: isLoading,
  };
}

export { useAlgorithm };
