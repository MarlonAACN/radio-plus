import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { CheckCircleIcon, ChevronDownIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';
import { m, AnimatePresence } from 'framer-motion';

import { GenreSelectedItemsView } from '@/components/config/views/GenreSelectedItems';
import { GenreSelectErrorView } from '@/components/config/views/GenreSelectError';
import { GenreSelectLoadingView } from '@/components/config/views/GenreSelectLoading';
import { TrackGenresTooltipView } from '@/components/config/views/TrackGenresTooltip';
import { GenreRepo } from '@/repos/GenreRepo';
import { RadioPlus } from '@/types/RadioPlus';
import { logger } from '@/util/Logger';
import { ArrayManager } from '@/util/manager/ArrayManager';

type GenreSelectProps = {
  isLoading: boolean;
  inputChangeTracker: RadioPlus.Config;
  updateInputChangeTracker: Dispatch<SetStateAction<RadioPlus.Config>>;
};

function GenreSelectWidget({
  isLoading,
  inputChangeTracker,
  updateInputChangeTracker,
}: GenreSelectProps) {
  const [fetchingGenres, setFetchingGenres] = useState<boolean>(false);
  /** before fetch null, on error fetch undefined, on success Array<string> */
  const [genres, setGenres] = useState<Array<string> | undefined | null>(null);
  //const [selectedGenres, setSelectedGenres] = useState<Array<string>>([]);
  const genreRepo = new GenreRepo(process.env.NEXT_PUBLIC_API_BASE_URL);

  // https://github.com/vercel/next.js/issues/35558
  const extraFirefoxProps = {
    autoComplete: 'off',
  };

  /** On load fetch all available genres. */
  useEffect(() => {
    if (fetchingGenres || genres !== null) {
      return;
    }

    setFetchingGenres(true);
    genreRepo
      .getAvailableGenres()
      .then((data) => {
        setGenres(data.genres);
      })
      .catch((err: RadioPlus.Error) => {
        logger.warn(
          '[GenreSelectWidget] Fetching all available genres failed.',
          err.message
        );

        setGenres(undefined);
      })
      .finally(() => {
        setFetchingGenres(false);
      });
  }, []);

  function onClickHandler(value: string) {
    // Check if genre is already selected.
    if (inputChangeTracker.selectedGenres.includes(value)) {
      logger.log(
        `[GenreSelectWidget] Removing genre ${value} from selected genre list.`
      );

      updateInputChangeTracker({
        ...inputChangeTracker,
        selectedGenres: ArrayManager.removeValue(
          inputChangeTracker.selectedGenres,
          value
        ),
      });

      return;
    }

    if (inputChangeTracker.selectedGenres.length === 5) {
      logger.warn(
        '[GenreSelectWidget] Maximum amount of 5 selected genres reached!'
      );
      return;
    }

    logger.log(
      `[GenreSelectWidget] Adding genre ${value} to selected genre list.`
    );

    updateInputChangeTracker({
      ...inputChangeTracker,
      selectedGenres: [...inputChangeTracker.selectedGenres, value],
    });
  }

  return (
    <div className="radio-plus-select-genre-container w-full">
      <div className="flex flex-row flex-wrap justify-between items-center gap-x-4 pr-3 pb-2 pl-3">
        <div className="flex flex-row flex-nowrap justify-start items-center">
          <p className="block pr-1">Track genres</p>
          <TrackGenresTooltipView />
        </div>
        <AnimatePresence>
          {inputChangeTracker.selectedGenres.length === 5 && (
            <m.div
              initial={{ x: '30px', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '30px', opacity: 0 }}
              transition={{
                duration: 0.1,
                ease: 'easeOut',
                x: { duration: 0.2, ease: 'easeOut' },
              }}
              className="radio-plus-maximum-genres-selected-warning"
            >
              <p className="text-secondary-400" role="alert">
                Maximum amount of 5 genres selected.
              </p>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className="radio-plus-select-genre-wrapper relative w-full">
        <GenreSelectLoadingView isLoading={fetchingGenres || isLoading} />
        <GenreSelectErrorView hasError={genres === undefined} />
        <Menu>
          <MenuButton
            {...extraFirefoxProps}
            disabled={
              fetchingGenres ||
              genres === undefined ||
              genres === null ||
              isLoading
            }
            className="w-full flex justify-between items-center gap-2 px-5 py-2.5 text-white bg-base-700 rounded-full transition-colors data-[hover]:bg-base-600 data-[open]:bg-base-600 data-[focus]:outline-1 data-[focus]:outline-primary-500"
          >
            Add track genre
            <ChevronDownIcon className="w-5 h-auto fill-font-400" />
          </MenuButton>
          <MenuItems
            anchor="bottom"
            className="z-[9999] w-[var(--button-width)] mt-1.5 bg-base-700 rounded-md !max-h-72"
          >
            {genres?.map((genre) => {
              const genreIsSelected =
                inputChangeTracker.selectedGenres.includes(genre);

              return (
                <MenuItem key={genre}>
                  <button
                    onClick={() => onClickHandler(genre)}
                    disabled={
                      !genreIsSelected &&
                      inputChangeTracker.selectedGenres.length === 5
                    }
                    className={clsx(
                      'w-full flex flex-row justify-start items-center gap-x-2 px-5 py-2 text-left cursor-pointer',
                      {
                        'data-[focus]:bg-primary-500':
                          !genreIsSelected &&
                          inputChangeTracker.selectedGenres.length !== 5,
                        'data-[focus]:bg-base-600': genreIsSelected,
                        '!cursor-default':
                          !genreIsSelected &&
                          inputChangeTracker.selectedGenres.length === 5,
                      }
                    )}
                  >
                    {genreIsSelected && (
                      <CheckCircleIcon className="w-5 h-auto fill-primary-500" />
                    )}
                    {genre}
                  </button>
                </MenuItem>
              );
            })}
          </MenuItems>
        </Menu>
        <GenreSelectedItemsView
          inputChangeTracker={inputChangeTracker}
          updateInputChangeTracker={updateInputChangeTracker}
        />
      </div>
    </div>
  );
}

export { GenreSelectWidget };
