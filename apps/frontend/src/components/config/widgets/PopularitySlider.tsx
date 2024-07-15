import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Switch } from '@headlessui/react';
import { m, AnimatePresence } from 'framer-motion';

import { PopularityTooltipView } from '@/components/config/views/PopularityTooltip';
import { RadioPlus } from '@/types/RadioPlus';

type PopularitySliderProps = {
  isLoading: boolean;
  inputChangeTracker: RadioPlus.Config;
  updateInputChangeTracker: Dispatch<SetStateAction<RadioPlus.Config>>;
  menuIsOpen: boolean;
};
function PopularitySliderWidget({
  isLoading,
  inputChangeTracker,
  updateInputChangeTracker,
  menuIsOpen,
}: PopularitySliderProps) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  /** number: set (0-100), null: disabled, undefined: untouched yet. */
  const cachedPopularityValue = useRef<number | null | undefined>(undefined);

  // https://github.com/vercel/next.js/issues/35558
  const firefoxProps = {
    autoComplete: 'off',
  };

  /** When the local storage data is set for the input change tracker, update cache value if value exists.
   * Also toggle the popularity selector to active if ls data was found.
   * */
  useEffect(() => {
    if (
      cachedPopularityValue.current === undefined &&
      inputChangeTracker.popularity
    ) {
      cachedPopularityValue.current = inputChangeTracker.popularity;

      setIsEnabled(true);
    }
  }, [inputChangeTracker]);

  /** Remove popularity value from algoritm payload if disabled. If enabled check for cached value to set as popularity value. */
  useEffect(() => {
    if (cachedPopularityValue.current === undefined) {
      return;
    }

    if (!isEnabled) {
      updateInputChangeTracker({
        ...inputChangeTracker,
        popularity: null,
      });
    } else {
      if (cachedPopularityValue.current !== null) {
        updateInputChangeTracker({
          ...inputChangeTracker,
          popularity: cachedPopularityValue.current,
        });
      }
    }
  }, [isEnabled]);

  function generatePopularityScoreText(
    value: number | null | undefined
  ): string {
    if (value === undefined || value === null) {
      return '--';
    }

    if (value === 0) {
      return 'unknown';
    }

    if (value < 20) {
      return 'very low';
    }

    if (value < 40) {
      return 'low';
    }

    if (value < 60) {
      return 'moderate';
    }

    if (value < 80) {
      return 'high';
    }

    if (value < 100) {
      return 'very high';
    }

    if (value === 100) {
      return 'maximum';
    }

    return '--';
  }

  function changeHandler(e: FormEvent<HTMLInputElement>) {
    const eventProgressValue = e.currentTarget.value;

    updateInputChangeTracker({
      ...inputChangeTracker,
      popularity: Number(eventProgressValue),
    });

    cachedPopularityValue.current = Number(eventProgressValue);
  }

  return (
    <div
      className="radio-plus-popularity-slider-container relative w-full"
      role="menuitem"
    >
      <div className="relative w-fit flex flex-row justify-start items-center gap-x-4">
        <Switch
          checked={isEnabled}
          onChange={setIsEnabled}
          aria-label="Sets the popularity level for the recommended tracks."
          disabled={!menuIsOpen}
          className="group relative w-14 h-7 flex p-1 bg-base-600 rounded-full transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none data-[checked]:bg-primary-500 data-[focus]:outline-1 data-[focus]:outline-white"
        >
          <span
            aria-hidden="true"
            className="size-5 inline-block translate-x-0 bg-white rounded-full ring-0 shadow-lg transition duration-200 ease-in-out pointer-events-none group-data-[checked]:translate-x-7"
          />
        </Switch>
        <div className="flex flex-row flex-nowrap justify-start items-center">
          <p className="block pr-1">Popularity</p>
          <PopularityTooltipView menuIsOpen={menuIsOpen} />
        </div>
      </div>
      <AnimatePresence>
        {isEnabled && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '50px', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.1,
              ease: 'easeOut',
              height: { duration: 0.2, ease: 'easeOut' },
            }}
            className="radio-plus-popularity-slider flex flex-row flex-nowrap justify-start items-center pr-6"
          >
            <div className="radio-plus-popularity-position-container w-20">
              <span className="flex justify-start items-center m-auto text-sm text-font-400">
                {isEnabled && inputChangeTracker.popularity !== null
                  ? generatePopularityScoreText(inputChangeTracker.popularity)
                  : '--'}
              </span>
            </div>
            <input
              {...firefoxProps}
              type="range"
              min={0}
              max={100}
              onChange={(e) => changeHandler(e)}
              value={inputChangeTracker.popularity ?? 0}
              aria-label="Desired popularity value"
              aria-valuemin={0}
              aria-valuemax={100}
              title={
                inputChangeTracker.popularity
                  ? inputChangeTracker.popularity.toString()
                  : undefined
              }
              role="slider"
              disabled={isLoading || !isEnabled || !menuIsOpen}
              id="radio-plus-popularity-slider"
              className="range-slider flex-1"
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { PopularitySliderWidget };
