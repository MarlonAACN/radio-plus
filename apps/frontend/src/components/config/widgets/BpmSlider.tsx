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

import { BpmTooltipView } from '@/components/config/views/BpmTooltip';
import { RadioPlus } from '@/types/RadioPlus';

type BpmSliderProps = {
  isLoading: boolean;
  inputChangeTracker: RadioPlus.Config;
  updateInputChangeTracker: Dispatch<SetStateAction<RadioPlus.Config>>;
  menuIsOpen: boolean;
};
function BpmSliderWidget({
  isLoading,
  inputChangeTracker,
  updateInputChangeTracker,
  menuIsOpen,
}: BpmSliderProps) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  /** number: set, null: disabled, undefined: untouched yet. */
  const cachedBpmValue = useRef<number | null | undefined>(undefined);

  // https://github.com/vercel/next.js/issues/35558
  const firefoxProps = {
    autoComplete: 'off',
  };

  /** When the local storage data is set for the input change tracker, update cache value if value exists.
   * Also toggle the bpm selector to active if ls data was found.
   * */
  useEffect(() => {
    if (cachedBpmValue.current === undefined && inputChangeTracker.bpm) {
      cachedBpmValue.current = inputChangeTracker.bpm;

      setIsEnabled(true);
    }
  }, [inputChangeTracker]);

  /** Remove bpm value from algoritm payload if disabled. If enabled check for cached value to set as bpm value. */
  useEffect(() => {
    if (cachedBpmValue.current === undefined) {
      return;
    }

    if (!isEnabled) {
      updateInputChangeTracker({
        ...inputChangeTracker,
        bpm: null,
      });
    } else {
      if (cachedBpmValue.current !== null) {
        updateInputChangeTracker({
          ...inputChangeTracker,
          bpm: cachedBpmValue.current,
        });
      }
    }
  }, [isEnabled]);

  function changeHandler(e: FormEvent<HTMLInputElement>) {
    const eventProgressValue = e.currentTarget.value;

    updateInputChangeTracker({
      ...inputChangeTracker,
      bpm: Number(eventProgressValue),
    });

    cachedBpmValue.current = Number(eventProgressValue);
  }

  return (
    <div
      className="radio-plus-bpm-slider-container relative w-full"
      role="menuitem"
    >
      <div className="relative w-fit flex flex-row justify-start items-center gap-x-4">
        <Switch
          checked={isEnabled}
          onChange={setIsEnabled}
          aria-label="Sets the amount of desired BMP for the recommended tracks."
          disabled={!menuIsOpen}
          className="group relative w-14 h-7 flex p-1 bg-base-600 rounded-full transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none data-[checked]:bg-primary-500 data-[focus]:outline-1 data-[focus]:outline-white"
        >
          <span
            aria-hidden="true"
            className="size-5 inline-block translate-x-0 bg-white rounded-full ring-0 shadow-lg transition duration-200 ease-in-out pointer-events-none group-data-[checked]:translate-x-7"
          />
        </Switch>
        <div className="flex flex-row flex-nowrap justify-start items-center">
          <p className="block pr-1">BPM (Beats per minute)</p>
          <BpmTooltipView menuIsOpen={menuIsOpen} />
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
            className="radio-plus-bpm-slider flex flex-row flex-nowrap justify-start items-center pr-6"
          >
            <div className="radio-plus-bpm-position-container w-20">
              <span className="flex justify-start items-center m-auto text-sm text-font-400">
                {isEnabled && inputChangeTracker.bpm !== null
                  ? `${inputChangeTracker.bpm} BPM`
                  : '-- BPM'}
              </span>
            </div>
            <input
              {...firefoxProps}
              type="range"
              min={20}
              max={300}
              onChange={(e) => changeHandler(e)}
              value={inputChangeTracker.bpm ?? 20}
              title={
                inputChangeTracker.bpm
                  ? inputChangeTracker.bpm.toString()
                  : undefined
              }
              aria-label="Desired beats per minute"
              aria-valuemin={20}
              aria-valuemax={300}
              role="slider"
              disabled={isLoading || !isEnabled}
              id="radio-plus-bpm-slider"
              className="range-slider flex-1"
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { BpmSliderWidget };
