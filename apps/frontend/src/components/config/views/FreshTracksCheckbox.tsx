import { ChangeEvent, Dispatch, SetStateAction } from 'react';

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

  return (
    <div className="radio-plus-fresh-tracks-checkbox-container relative w-fit flex flex-row justify-start items-center gap-x-3 pl-3">
      <input
        autoComplete="off"
        type="checkbox"
        id="radio-plus-fresh-track-checkbox"
        name="radio-plus-fresh-track-checkbox"
        disabled={isLoading}
        checked={inputChangeTracker.freshTracks}
        onChange={(e) => inputChangeHandler(e)}
        className="peer w-5 h-5 bg-base-700 border rounded-full border-base-600 appearance-none cursor-pointer focus:outline-none focus:ring-none focus:ring-primary-500 disabled:bg-base-600 disabled:cursor-default checked:bg-primary-500 checked:border-primary-500"
      />
      <label
        htmlFor="radio-plus-fresh-track-checkbox"
        className="peer-disabled:cursor-default cursor-pointer"
      >
        Fresh tracks
      </label>
      <div className="absolute top-0 left-full h-full flex flex-col justify-center items-center pl-1">
        <FreshTrackTooltipView />
      </div>
    </div>
  );
}

export { FreshTracksCheckboxView };
