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

import { DanceabilityTooltipView } from '@/components/config/views/DanceabilityTooltip';
import { RadioPlus } from '@/types/RadioPlus';
import { SliderFilterFormatter } from '@/util/formatter/SliderFilterFormatter';

type DanceabilitySliderProps = {
  isLoading: boolean;
  inputChangeTracker: RadioPlus.Config;
  updateInputChangeTracker: Dispatch<SetStateAction<RadioPlus.Config>>;
};
function DanceabilitySliderWidget({
  isLoading,
  inputChangeTracker,
  updateInputChangeTracker,
}: DanceabilitySliderProps) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  /** number: set (0-1), null: disabled, undefined: untouched yet. */
  const cachedDanceabilityValue = useRef<number | null | undefined>(undefined);

  // https://github.com/vercel/next.js/issues/35558
  const firefoxProps = {
    autoComplete: 'off',
  };

  /** When the local storage data is set for the input change tracker, update cache value if value exists.
   * Also toggle the danceability selector to active if ls data was found.
   * */
  useEffect(() => {
    if (
      cachedDanceabilityValue.current === undefined &&
      inputChangeTracker.danceability
    ) {
      cachedDanceabilityValue.current = inputChangeTracker.danceability;

      setIsEnabled(true);
    }
  }, [inputChangeTracker]);

  /** Remove danceability value from algoritm payload if disabled. If enabled check for cached value to set as danceability value. */
  useEffect(() => {
    if (cachedDanceabilityValue.current === undefined) {
      return;
    }

    if (!isEnabled) {
      updateInputChangeTracker({
        ...inputChangeTracker,
        danceability: null,
      });
    } else {
      if (cachedDanceabilityValue.current !== null) {
        updateInputChangeTracker({
          ...inputChangeTracker,
          danceability: cachedDanceabilityValue.current,
        });
      }
    }
  }, [isEnabled]);

  function generateDanceabilityScoreText(
    value: number | null | undefined
  ): string {
    if (value === undefined || value === null) {
      return '--';
    }

    if (value === 0) {
      return 'minimal';
    }

    if (value < 0.2) {
      return 'low';
    }

    if (value < 0.4) {
      return 'barely';
    }

    if (value < 0.6) {
      return 'moderate';
    }

    if (value < 0.8) {
      return 'high';
    }

    if (value < 1) {
      return 'groovy';
    }

    if (value === 1) {
      return 'exceptional';
    }

    return '--';
  }

  function changeHandler(e: FormEvent<HTMLInputElement>) {
    const eventProgressValue = e.currentTarget.value;

    updateInputChangeTracker({
      ...inputChangeTracker,
      danceability: SliderFilterFormatter.toConfigValueFromSliderValue(
        Number(eventProgressValue)
      ),
    });

    cachedDanceabilityValue.current =
      SliderFilterFormatter.toConfigValueFromSliderValue(
        Number(eventProgressValue)
      );
  }

  return (
    <div
      className="radio-plus-danceability-slider-container relative w-full"
      role="menuitem"
    >
      <div className="relative w-fit flex flex-row justify-start items-center gap-x-4">
        <Switch
          checked={isEnabled}
          onChange={setIsEnabled}
          aria-label="Sets the danceability level for the recommended tracks."
          className="group relative w-14 h-7 flex p-1 bg-base-600 rounded-full transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none data-[checked]:bg-primary-500 data-[focus]:outline-1 data-[focus]:outline-white"
        >
          <span
            aria-hidden="true"
            className="size-5 inline-block translate-x-0 bg-white rounded-full ring-0 shadow-lg transition duration-200 ease-in-out pointer-events-none group-data-[checked]:translate-x-7"
          />
        </Switch>
        <div className="flex flex-row flex-nowrap justify-start items-center">
          <p className="block pr-1">Danceability</p>
          <DanceabilityTooltipView />
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
            className="radio-plus-danceability-slider flex flex-row flex-nowrap justify-start items-center pr-6"
          >
            <div className="radio-plus-danceability-position-container w-20">
              <span className="flex justify-start items-center m-auto text-sm text-font-400">
                {isEnabled && inputChangeTracker.danceability !== null
                  ? generateDanceabilityScoreText(
                      inputChangeTracker.danceability
                    )
                  : '--'}
              </span>
            </div>
            <input
              {...firefoxProps}
              type="range"
              min={0}
              max={100}
              onChange={(e) => changeHandler(e)}
              value={
                inputChangeTracker.danceability
                  ? SliderFilterFormatter.toSliderValueFromConfigValue(
                      inputChangeTracker.danceability
                    )
                  : 0
              }
              aria-label="Desired danceability value"
              aria-valuemin={0}
              aria-valuemax={100}
              role="slider"
              disabled={isLoading || !isEnabled}
              id="radio-plus-danceability-slider"
              className="range-slider flex-1"
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { DanceabilitySliderWidget };
