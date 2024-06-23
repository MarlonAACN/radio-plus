import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import { Switch } from '@headlessui/react';

import { FreshTrackTooltipView } from '@/components/config/views/FreshTrackTooltip';
import { RadioPlus } from '@/types/RadioPlus';

type FreshTracksCheckboxProps = {
  isLoading: boolean;
  inputChangeTracker: RadioPlus.Config;
  updateInputChangeTracker: Dispatch<SetStateAction<RadioPlus.Config>>;
};

function FreshTracksCheckboxView({
  isLoading,
  inputChangeTracker,
  updateInputChangeTracker,
}: FreshTracksCheckboxProps) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  /**
   * Updates the input tracker on change.
   * @param e {ChangeEvent<HTMLInputElement>} The event object emitted from the input.
   */
  function inputChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    updateInputChangeTracker({
      ...inputChangeTracker,
      freshTracks: e.target.checked,
    });
  }

  /**
   * Updates the input tracker on change.
   * @param state {boolean} The boolean state of the switch.
   */
  function switchToggleHandler(state: boolean) {
    updateInputChangeTracker({
      ...inputChangeTracker,
      freshTracks: state,
    });
  }

  return (
    <div className="radio-plus-fresh-tracks-switch-container relative w-fit flex flex-row justify-start items-center gap-x-3 pl-3">
      <Switch
        disabled={isLoading}
        checked={inputChangeTracker.freshTracks}
        onChange={switchToggleHandler}
        aria-label="Toggle to determine if recommended tracks should mostly be unknown."
        id="radio-plus-fresh-track-switch"
        className="group relative w-14 h-7 flex p-1 bg-base-600 rounded-full transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none disabled:bg-base-700 data-[checked]:bg-primary-500 data-[focus]:outline-1 data-[focus]:outline-white"
      >
        <span
          aria-hidden="true"
          className="size-5 group-disabled:bg-base-600 inline-block translate-x-0 bg-white rounded-full ring-0 shadow-lg transition duration-200 ease-in-out pointer-events-none group-data-[checked]:translate-x-7"
        />
      </Switch>
      <p className="peer-disabled:cursor-default cursor-pointer">
        Fresh tracks
      </p>
      <div className="absolute top-0 left-full h-full flex flex-col justify-center items-center pl-1">
        <FreshTrackTooltipView />
      </div>
    </div>
  );
}

export { FreshTracksCheckboxView };
