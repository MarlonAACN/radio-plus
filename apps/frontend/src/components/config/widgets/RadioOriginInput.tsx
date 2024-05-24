import { Dispatch, SetStateAction } from 'react';

import clsx from 'clsx';

import { RadioOriginInputInfoView } from '@/components/config/views/RadioOriginInputInfo';

type FormErrors = {
  radioOriginTrackId: string | null;
};

type RadioOriginInputProps = {
  error: FormErrors;
  setErrors: Dispatch<SetStateAction<FormErrors>>;
  isLoading: boolean;
};

function RadioOriginInputWidget({
  error,
  setErrors,
  isLoading,
}: RadioOriginInputProps) {
  return (
    <div className="radio-plus-radio-origin-input-container w-full">
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
          disabled={isLoading}
          onFocus={() => setErrors({ ...error, radioOriginTrackId: null })}
          onBlur={(e) => {
            e.target.value = e.target.value.trim();
          }}
          placeholder="https://open.spotify.com/intl-de/track/0FNLM4iuEwHAb7OTSWI18p?si=e254ad26d2624f71"
          className={clsx(
            'w-full px-5 py-2.5 bg-base-700 border rounded-full border-base-700 transition-colors disabled:bg-base-800 enabled:focus:border-base-0 enabled:active:border-base-0 enabled:focus:outline-none placeholder-base-600',
            { 'border-red-500': error.radioOriginTrackId }
          )}
        ></input>
        <div className="absolute top-0 right-2 h-full flex flex-col justify-center items-center">
          <RadioOriginInputInfoView />
        </div>
      </div>
      {error.radioOriginTrackId ? (
        <p className="radio-plus-error mt-1 mb-3 ml-2.5 text-red-500">
          {error.radioOriginTrackId}
        </p>
      ) : null}
    </div>
  );
}

export { RadioOriginInputWidget };
