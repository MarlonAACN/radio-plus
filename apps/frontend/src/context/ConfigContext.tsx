import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { LocalStorageKeys } from '@/constants/LocalStorageKeys';
import { TrackRepo } from '@/repos/TrackRepo';
import { RadioPlus } from '@/types/RadioPlus';
import { TrackFormatter } from '@/util/formatter/TrackFormatter';
import { logger } from '@/util/Logger';
import { LocalStorageManager } from '@/util/manager/LocalStorageManager';

type ConfigContextProps = {
  /** The data here, actually referes to the cached data, that gets only updated, if all data fetches for it were successfully. */
  data: RadioPlus.Config;
  /** This updates the base data object, which change is tracked and evaluated. If evaluation and external fetches were successfull, update cache data. */
  setData: (data: RadioPlus.Config) => void;
  errors: RadioPlus.ConfigErrors;
  hasErrors: boolean;
  radioOriginTrack: RadioPlus.DetailedTrack | null;
  isLoading: boolean;
};

type ConfigProps = {
  children: ReactNode;
};

const configDefaultValues: ConfigContextProps = {
  data: {
    radioOriginTrackUrl: null,
  },
  setData: (_data: RadioPlus.Config) => {
    return;
  },
  errors: {
    radioOriginTrackUrl: null,
  },
  hasErrors: false,
  radioOriginTrack: null,
  isLoading: false,
};

const ConfigContext = createContext<ConfigContextProps>(configDefaultValues);

function useConfig() {
  return useContext(ConfigContext);
}

function ConfigProvider({ children }: ConfigProps) {
  /** Once the changed data has been evaluated and all fetches successfully finished, update the data cache.
   * This is the source of truth for the config.
   * */
  const [cachedData, setCachedData] = useState<RadioPlus.Config>({
    radioOriginTrackUrl: null,
  });
  const [data, setData] = useState<RadioPlus.Config>({
    radioOriginTrackUrl: null,
  });
  const [errors, setErrors] = useState<RadioPlus.ConfigErrors>({
    radioOriginTrackUrl: null,
  });
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [radioOriginTrack, setRadioOriginTrack] =
    useState<RadioPlus.DetailedTrack | null>(null);
  const trackRepo = new TrackRepo(process.env.NEXT_PUBLIC_API_BASE_URL);

  /** Refetch new data, based on changes in new config. */
  useEffect(() => {
    if (isLoading) {
      return;
    }

    configUpdateHandler(data, cachedData).finally(() => {
      logger.log('[ConfigContext] Config related data refresh completed.');
      logger.log(data);
    });
  }, [data]);

  useEffect(() => {
    setHasErrors(errors.radioOriginTrackUrl !== null);
  }, [errors]);

  /**
   * Handler that is called once the config gets updated.
   * Calls each handler function that is related to an attribute in the config and awaits their results.
   * @param _data {RadioPlus.Config} Local object of the config data.
   * @param _cache {RadioPlus.Config} Local object of the cached config data.
   */
  async function configUpdateHandler(
    _data: RadioPlus.Config,
    _cache: RadioPlus.Config
  ) {
    setIsLoading(true);

    // Create a copy of the current cache to replace the old one at the end.
    const newCache = { ..._cache };
    // Create a copy of the current error object to replace the old one that the end.
    const updateErrors: RadioPlus.ConfigErrors = { ...errors };

    // 1. Radio origin track
    // Checks if the track id differs from the currently cached track id.
    if (_cache.radioOriginTrackUrl !== _data.radioOriginTrackUrl) {
      await newTrackHandler(_data.radioOriginTrackUrl)
        .then(() => {
          // On success, reset error entry, save id in cache and update local storage.
          updateErrors.radioOriginTrackUrl = null;

          newCache.radioOriginTrackUrl = _data.radioOriginTrackUrl;
          LocalStorageManager.updateConfigValue(
            LocalStorageKeys.radioOriginTrackUrl,
            _data.radioOriginTrackUrl
          );
        })
        .catch((err: string) => {
          // On failure, update error entry accordingly and set track id in cache to null. (since the var is reseted inside the track handler)
          updateErrors.radioOriginTrackUrl = err;
          newCache.radioOriginTrackUrl = null;
        });
    }

    // Update global error object, update global cache.
    setErrors(updateErrors);
    setCachedData(newCache);
    setIsLoading(false);
  }

  function newTrackHandler(trackUrl: string | null): Promise<void> {
    if (!trackUrl) {
      setRadioOriginTrack(null);
      return Promise.resolve();
    }

    let trackId;
    try {
      trackId = TrackFormatter.parseTrackUrl(trackUrl);
    } catch (err) {
      setRadioOriginTrack(null);
      logger.error('[newTrackHandler] Track url is malformed.');
      return Promise.reject('Track url is malformed.');
    }

    if (!trackId) {
      setRadioOriginTrack(null);
      return Promise.resolve();
    }

    return trackRepo
      .getDetailedTrack(trackId)
      .then((detaileTrack) => {
        setRadioOriginTrack(detaileTrack);

        logger.log(
          '[newTrackHandler] Successfully fetched detailed track data.'
        );
        return;
      })
      .catch((err: RadioPlus.Error) => {
        setRadioOriginTrack(null);

        logger.error(
          '[newTrackHandler] Failed fetching detailed track data:',
          err
        );

        return Promise.reject('Failed fetching detailed track data.');
      });
  }

  function setDataHandler(data: RadioPlus.Config) {
    setData(data);
  }

  const value: ConfigContextProps = {
    data: cachedData,
    setData: setDataHandler,
    errors: errors,
    hasErrors: hasErrors,
    radioOriginTrack: radioOriginTrack,
    isLoading: isLoading,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export { useConfig, ConfigProvider };
