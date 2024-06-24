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

import { ValenceTooltipView } from '@/components/config/views/ValenceTooltip';
import { RadioPlus } from '@/types/RadioPlus';
import { SliderFilterFormatter } from '@/util/formatter/SliderFilterFormatter';

type ValenceSliderProps = {
  isLoading: boolean;
  inputChangeTracker: RadioPlus.Config;
  updateInputChangeTracker: Dispatch<SetStateAction<RadioPlus.Config>>;
};
function ValenceSliderWidget({
  isLoading,
  inputChangeTracker,
  updateInputChangeTracker,
}: ValenceSliderProps) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  /** number: set, null: disabled, undefined: untouched yet. */
  const cachedValenceValue = useRef<number | null | undefined>(undefined);

  // https://github.com/vercel/next.js/issues/35558
  const firefoxProps = {
    autoComplete: 'off',
  };

  /** When the local storage data is set for the input change tracker, update cache value if value exists.
   * Also toggle the valence selector to active if ls data was found.
   * */
  useEffect(() => {
    if (
      cachedValenceValue.current === undefined &&
      inputChangeTracker.valence
    ) {
      cachedValenceValue.current = inputChangeTracker.valence;

      setIsEnabled(true);
    }
  }, [inputChangeTracker]);

  /** Remove valence value from algoritm payload if disabled. If enabled check for cached value to set as valence value. */
  useEffect(() => {
    if (cachedValenceValue.current === undefined) {
      return;
    }

    if (!isEnabled) {
      updateInputChangeTracker({
        ...inputChangeTracker,
        valence: null,
      });
    } else {
      if (cachedValenceValue.current !== null) {
        updateInputChangeTracker({
          ...inputChangeTracker,
          valence: cachedValenceValue.current,
        });
      }
    }
  }, [isEnabled]);

  function generateMoodScoreText(value: number | null | undefined): string {
    if (value === undefined || value === null) {
      return '--';
    }

    if (value === 0) {
      return 'depressed';
    }

    if (value < 0.2) {
      return 'gloomy';
    }

    if (value < 0.4) {
      return 'melancholic';
    }

    if (value < 0.6) {
      return 'neutral';
    }

    if (value < 0.8) {
      return 'cheerful';
    }

    if (value < 1) {
      return 'happy';
    }

    if (value === 1) {
      return 'euphoric';
    }

    return '--';
  }

  function changeHandler(e: FormEvent<HTMLInputElement>) {
    const eventProgressValue = e.currentTarget.value;

    updateInputChangeTracker({
      ...inputChangeTracker,
      valence: SliderFilterFormatter.toConfigValueFromSliderValue(
        Number(eventProgressValue)
      ),
    });

    cachedValenceValue.current =
      SliderFilterFormatter.toConfigValueFromSliderValue(
        Number(eventProgressValue)
      );
  }

  return (
    <div className="radio-plus-valence-slider-container relative w-full">
      <div className="relative w-fit flex flex-row justify-start items-center gap-x-4">
        <Switch
          checked={isEnabled}
          onChange={setIsEnabled}
          aria-label="Sets mood of the recommended tracks."
          className="group relative w-14 h-7 flex p-1 bg-base-600 rounded-full transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none data-[checked]:bg-primary-500 data-[focus]:outline-1 data-[focus]:outline-white"
        >
          <span
            aria-hidden="true"
            className="size-5 inline-block translate-x-0 bg-white rounded-full ring-0 shadow-lg transition duration-200 ease-in-out pointer-events-none group-data-[checked]:translate-x-7"
          />
        </Switch>
        <div className="flex flex-row flex-nowrap justify-start items-center">
          <p className="block pr-1">Mood</p>
          <ValenceTooltipView />
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
            className="radio-plus-valence-slider flex flex-row flex-nowrap justify-start items-center pr-6"
          >
            <div className="radio-plus-valence-position-container w-24">
              <span className="flex justify-start items-center m-auto text-sm text-font-400">
                {isEnabled && inputChangeTracker.valence !== null
                  ? generateMoodScoreText(inputChangeTracker.valence)
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
                inputChangeTracker.valence
                  ? SliderFilterFormatter.toSliderValueFromConfigValue(
                      inputChangeTracker.valence
                    )
                  : 0
              }
              aria-label="Desired track mood"
              aria-valuemin={0}
              aria-valuemax={100}
              role="slider"
              disabled={isLoading || !isEnabled}
              id="radio-plus-valence-slider"
              className="range-slider flex-1"
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { ValenceSliderWidget };
