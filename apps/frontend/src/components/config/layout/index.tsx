import { FormEvent, useState } from 'react';

import { m } from 'framer-motion';

import { ConfigFormSubmitBtnView } from '@/components/config/views/ConfigFormSubmitBtn';
import { ConfigMenuToggleBtnView } from '@/components/config/views/ConfigMenuToggleBtn';
import { RadioOriginInputWidget } from '@/components/config/widgets/RadioOriginInput';
import { useConfig } from '@/context/ConfigContext';
import { RadioPlus } from '@/types/RadioPlus';
import { isWhitespaceString } from '@/util/is-whitespace-string';

type FormErrors = {
  radioOriginTrackId: string | null;
};

const variants = {
  open: { top: 0, bottom: 'unset' },
  closed: { bottom: 0, top: 'unset' },
};

function ConfigLayout() {
  const config = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    radioOriginTrackId: null,
  });

  function songOriginInputEvaluator(inputValue: string | null): string | null {
    if (inputValue === null) {
      throw Error("Couldn't read radio origin input.");
    }

    if (isWhitespaceString(inputValue)) {
      return null;
    }

    let trackId;
    try {
      const spotifyTrackUrl = new URL(inputValue);
      const trackIdMatch = spotifyTrackUrl.pathname.match(/\/track\/([^/]+)/);
      trackId = trackIdMatch ? trackIdMatch[1] : null;
    } catch (_err) {
      throw Error('Spotify track URL is malformed!');
    }

    if (trackId === null) {
      throw Error('Spotify track URL is malformed!');
    }

    return trackId;
  }

  /**
   * Expandable form submit handler to check all filter options if there are any errors.
   * @param e {FormEvent<HTMLFormElement>} The form event wrapping all filter inputs.
   */
  function filterFormSubmitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (config.isLoading) {
      return;
    }

    // Create local copies of data and error objects.
    const localConfig: RadioPlus.Config = { ...config.data };
    const localErrors: FormErrors = { radioOriginTrackId: null };

    // Extract form data.
    const formData = new FormData(e.target as HTMLFormElement);
    const songOriginInputValue = formData.get(
      'radio-plus-radio-origin-input'
    ) as string | null;

    // Run through each dedicated evaluator for each existing input in the config form.
    try {
      localConfig.radioOriginTrackId =
        songOriginInputEvaluator(songOriginInputValue);
    } catch (err) {
      localErrors.radioOriginTrackId = (err as { message: string }).message;
    }

    // If there is atleast one error, update the error variable and return.
    if (Object.values(localErrors).some((value) => value !== null)) {
      setErrors(localErrors);
      return;
    }

    config.setData(localConfig);
  }

  return (
    <>
      <div className="radio-plus-filter-spacer h-9"></div>
      <div className="radio-plus-filter-wrapper z-[999] absolute top-0 left-0 w-full h-16 flex flex-col justify-end items-center">
        <m.form
          onSubmit={(e) => filterFormSubmitHandler(e)}
          initial={{
            bottom: 0,
            top: 'unset',
          }}
          animate={isOpen ? 'open' : 'closed'}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
          variants={variants}
          className="radio-plus-filter-container absolute bottom-0 w-full h-fit flex flex-col justify-between items-start px-5 pt-5 overflow-hidden bg-base-800 rounded-b-xl sm:w-[calc(100%-3rem)] sm:px-6 md:w-4/5"
        >
          <div className="w-full">
            <RadioOriginInputWidget
              error={errors}
              setErrors={setErrors}
              isLoading={config.isLoading}
            />
          </div>
          <ConfigFormSubmitBtnView isLoading={config.isLoading} />
          <ConfigMenuToggleBtnView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            radioOrigin={config.data.radioOriginTrackId}
          />
        </m.form>
      </div>
    </>
  );
}

export { ConfigLayout };
