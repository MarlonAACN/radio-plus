import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { TrackRepo } from '@/repos/TrackRepo';
import { RadioPlus } from '@/types/RadioPlus';
import { logger } from '@/util/Logger';

type ConfigContextProps = {
  data: RadioPlus.Config;
  setData: (data: RadioPlus.Config) => void;
  errors: RadioPlus.ConfigErrors;
  isLoading: boolean;
};

type ConfigProps = {
  children: ReactNode;
};

const configDefaultValues: ConfigContextProps = {
  data: {
    radioOriginTrackId: null,
  },
  setData: (_data: RadioPlus.Config) => {
    return;
  },
  errors: {
    radioOriginTrackId: null,
  },
  isLoading: false,
};

const ConfigContext = createContext<ConfigContextProps>(configDefaultValues);

function useConfig() {
  return useContext(ConfigContext);
}

function ConfigProvider({ children }: ConfigProps) {
  const cachedData = useRef<RadioPlus.Config>({ radioOriginTrackId: null });
  const [data, setData] = useState<RadioPlus.Config>({
    radioOriginTrackId: null,
  });
  const [errors, setErrors] = useState<RadioPlus.ConfigErrors>({
    radioOriginTrackId: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [radioOriginTrack, setRadioOriginTrack] =
    useState<RadioPlus.DetailedTrack | null>(null);
  const trackRepo = new TrackRepo(process.env.NEXT_PUBLIC_API_BASE_URL);

  useEffect(() => {
    console.log(radioOriginTrack);
  }, [radioOriginTrack]);

  /** Refetch new data, based on changes in new config. */
  useEffect(() => {
    if (isLoading) {
      return;
    }

    configUpdateHandler(data, cachedData.current).finally(() => {
      logger.log('[ConfigContext] Config related data refresh completed.');
      logger.log(data);
    });
  }, [data]);

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
    if (_cache.radioOriginTrackId !== _data.radioOriginTrackId) {
      await newTrackHandler(_data.radioOriginTrackId)
        .then(() => {
          // On success, reset error entry and save id in cache.
          updateErrors.radioOriginTrackId = null;
          newCache.radioOriginTrackId = _data.radioOriginTrackId;
        })
        .catch((err: string) => {
          // On failure, update error entry accordingly and don't save new id cache.
          updateErrors.radioOriginTrackId = err;
        });
    }

    // Update global error object, update global cache.
    setErrors(updateErrors);
    cachedData.current = newCache;
    setIsLoading(false);
  }

  function newTrackHandler(trackId: string | null): Promise<void> {
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
    data: data,
    setData: setDataHandler,
    errors: errors,
    isLoading: isLoading,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export { useConfig, ConfigProvider };
