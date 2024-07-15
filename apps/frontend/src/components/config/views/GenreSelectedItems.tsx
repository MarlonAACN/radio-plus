import { Dispatch, SetStateAction } from 'react';

import { m, AnimatePresence } from 'framer-motion';

import { RadioPlus } from '@/types/RadioPlus';
import { ArrayManager } from '@/util/manager/ArrayManager';

type GenreSelectedItemsProps = {
  inputChangeTracker: RadioPlus.Config;
  updateInputChangeTracker: Dispatch<SetStateAction<RadioPlus.Config>>;
  menuIsOpen: boolean;
};

function GenreSelectedItemsView({
  inputChangeTracker,
  updateInputChangeTracker,
  menuIsOpen,
}: GenreSelectedItemsProps) {
  function removeGenreHandler(value: string) {
    updateInputChangeTracker({
      ...inputChangeTracker,
      selectedGenres: ArrayManager.removeValue(
        inputChangeTracker.selectedGenres,
        value
      ),
    });
  }

  return (
    <div className="radio-plus-selected-genres-list-container flex flex-row justify-start items-center gap-x-2 pb-3 mt-2 overflow-x-scroll">
      {inputChangeTracker.selectedGenres.map((genre) => {
        return (
          <AnimatePresence key={genre}>
            <m.button
              initial={{ x: '30px', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '30px', opacity: 0 }}
              transition={{
                duration: 0.1,
                ease: 'easeOut',
                x: { duration: 0.2, ease: 'easeOut' },
              }}
              type="button"
              aria-label={`Removes selected genre ${genre} from the selection list.`}
              disabled={!menuIsOpen}
              title={`Remove selected genre "${genre}"`}
              className="px-2.5 py-1 break-keep bg-base-600 rounded-full transition-colors hover:bg-primary-500"
              onClick={() => removeGenreHandler(genre)}
            >
              {genre}
            </m.button>
          </AnimatePresence>
        );
      })}
    </div>
  );
}

export { GenreSelectedItemsView };
