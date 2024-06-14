import { useEffect, useRef, useState } from 'react';

import { HeartIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

import { Spinner } from '@/icons';
import { TrackRepo } from '@/repos/TrackRepo';
import { logger } from '@/util/Logger';

type SaveTrackBtnProps = {
  activeTrackId: string | null;
};

function SaveTrackBtn({ activeTrackId }: SaveTrackBtnProps) {
  const cachedTrackId = useRef<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const trackRepo = new TrackRepo(process.env.NEXT_PUBLIC_API_BASE_URL);

  useEffect(() => {
    if (cachedTrackId.current === activeTrackId) {
      return;
    }

    if (activeTrackId === null) {
      setIsSaved(false);
      cachedTrackId.current = activeTrackId;

      return;
    }

    cachedTrackId.current = activeTrackId;

    setIsLoading(true);
    trackRepo
      .isTrackSaved(activeTrackId)
      .then((bool) => {
        setIsSaved(bool);
      })
      .catch((err) => {
        logger.warn('[SaveTrackBtn] Failed checking if track is saved', err);
        setIsSaved(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeTrackId]);

  function saveTrackHandler() {
    if (activeTrackId === null || isLoading) {
      return;
    }

    setIsLoading(true);

    if (isSaved) {
      // remove track from saved list.
      trackRepo
        .removeSavedTrack(activeTrackId)
        .then(() => {
          setIsSaved(false);
        })
        .catch((err) => {
          logger.warn('[SaveTrackBtn] Failed removing saved track.', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Add track to saved list.
      trackRepo
        .saveTrack(activeTrackId)
        .then(() => {
          setIsSaved(true);
        })
        .catch((err) => {
          logger.warn('[SaveTrackBtn] Failed saving track.', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return;
  }

  // https://github.com/vercel/next.js/issues/35558
  const firefoxProps = {
    autoComplete: 'off',
  };

  return (
    <button
      {...firefoxProps}
      disabled={activeTrackId === null}
      className={clsx(
        'radio-plus-save-track-btn group transition-transform cursor-default',
        {
          'hover:enabled:scale-110 !cursor-pointer': !isLoading,
        }
      )}
      onClick={saveTrackHandler}
    >
      {isLoading ? (
        <Spinner className="w-6 h-6 py-0.5" />
      ) : (
        <HeartIcon
          className={clsx(
            'group-disabled:stroke-base-600 w-7 h-7 stroke-base-0 transition-colors',
            {
              'fill-primary-500 stroke-primary-500 group-disabled:fill-base-600 group-disabled:stroke-base-600':
                isSaved,
            }
          )}
        />
      )}
    </button>
  );
}

export { SaveTrackBtn };
