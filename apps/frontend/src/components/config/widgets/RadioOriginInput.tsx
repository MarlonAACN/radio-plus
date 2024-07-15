import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import clsx from 'clsx';

import { RadioOriginInputTooltipView } from '@/components/config/views/RadioOriginInputInfo';
import { RadioPlus } from '@/types/RadioPlus';

type RadioOriginInputProps = {
  formErrors: RadioPlus.ConfigFormErrors;
  setFormErrors: Dispatch<SetStateAction<RadioPlus.ConfigFormErrors>>;
  isLoading: boolean;
  inputChangeTracker: RadioPlus.Config;
  updateInputChangeTracker: Dispatch<SetStateAction<RadioPlus.Config>>;
  menuIsOpen: boolean;
};

function RadioOriginInputWidget({
  formErrors,
  setFormErrors,
  isLoading,
  menuIsOpen,
  inputChangeTracker,
  updateInputChangeTracker,
}: RadioOriginInputProps) {
  /**
   * Updates the input tracker on change.
   * Sets the value to null, if the input is an empty string.
   * @param e {ChangeEvent<HTMLInputElement>} The event object emitted from the input.
   */
  function inputChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    updateInputChangeTracker({
      ...inputChangeTracker,
      radioOriginTrackUrl: e.target.value !== '' ? e.target.value : null,
    });
  }

  /**
   * Updates the input tracker, when the focus on the input ends.
   * Sets the value to null, if the input is an empty string.
   * Also trims the input to prevent whitespace from occuring in the input.
   * @param e {React.FocusEvent<HTMLInputElement>} The event object emitted from the input.
   */
  function onBlurHandler(e: React.FocusEvent<HTMLInputElement>) {
    const trimmedInputValue = e.target.value.trim();

    updateInputChangeTracker({
      ...inputChangeTracker,
      radioOriginTrackUrl: trimmedInputValue !== '' ? trimmedInputValue : null,
    });
  }

  return (
    <div
      className="radio-plus-radio-origin-input-container relative w-full"
      role="menuitem"
    >
      <label
        htmlFor="radio-plus-radio-origin-input"
        className="block pb-2 pl-3"
      >
        Radio origin
      </label>
      <div className="relative w-full">
        <input
          autoComplete="off"
          id="radio-plus-radio-origin-input"
          name="radio-plus-radio-origin-input"
          disabled={isLoading || !menuIsOpen}
          value={inputChangeTracker.radioOriginTrackUrl ?? ''}
          onChange={(e) => inputChangeHandler(e)}
          onFocus={() =>
            setFormErrors({ ...formErrors, radioOriginTrackUrl: null })
          }
          onBlur={(e) => {
            onBlurHandler(e);
          }}
          placeholder="https://open.spotify.com/intl-de/track/0FNLM4iuEwHAb7OTSWI18p?si=e254ad26d2624f71"
          className={clsx(
            'w-full px-5 py-2.5 bg-base-700 border rounded-full border-base-700 transition-colors disabled:bg-base-800 enabled:focus:border-base-0 enabled:active:border-base-0 enabled:focus:outline-none placeholder-base-600',
            { 'border-red-500': formErrors.radioOriginTrackUrl }
          )}
        ></input>
        <div className="absolute top-0 right-2 h-full flex flex-col justify-center items-center">
          <RadioOriginInputTooltipView menuIsOpen={menuIsOpen} />
        </div>
      </div>
      {formErrors.radioOriginTrackUrl ? (
        <p className="radio-plus-error absolute -bottom-7 left-0 left-2.5 text-red-500">
          {formErrors.radioOriginTrackUrl}
        </p>
      ) : null}
    </div>
  );
}

export { RadioOriginInputWidget };
