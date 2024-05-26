import { FormEvent, useEffect, useState } from 'react';

import { useConfig } from '@/context/ConfigContext';
import { RadioPlus } from '@/types/RadioPlus';
import { TrackFormatter } from '@/util/formatter/TrackFormatter';
import { isWhitespaceString } from '@/util/is-whitespace-string';

function useConfigForm() {
  const config = useConfig();

  const [inputChangeTracker, setInputChangeTracker] =
    useState<RadioPlus.Config>(config.data);
  /** Determines if the input of the form has changed, based by comparing the inputChangeTracker data to the saved config data. */
  const [formHoldsNewData, setFormHoldsNewData] = useState<boolean>(false);
  /** Holds the errors from the form for each input of it. */
  const [formErrors, setFormErrors] = useState<RadioPlus.ConfigFormErrors>({
    radioOriginTrackUrl: null,
  });
  /** Determines if any of the form inputs have thrown a warning to the user, based on his inputs. */
  const [formHasErrors, setFormHasErrors] = useState<boolean>(false);

  /** On update of the formError object, check if form holds any errors. */
  useEffect(() => {
    setFormHasErrors(Object.values(formErrors).some((value) => value !== null));
  }, [formErrors]);

  /** If the config data or the input change tracker data changes, make a comparison check on their equality. */
  useEffect(() => {
    setFormHoldsNewData(
      haveDifferentAttributes(inputChangeTracker, config.data)
    );
  }, [inputChangeTracker, config.data]);

  /**
   * Compares two config objects on thei similiarity.
   * This doesn't compare key differences.
   * @param newInput {RadioPlus.Config} The new config object.
   * @param currentInput {RadioPlus.Config} The current config object.
   * @return {boolean} True if the configs are not equal in terms of their values.
   */
  function haveDifferentAttributes(
    newInput: RadioPlus.Config,
    currentInput: RadioPlus.Config
  ): boolean {
    const keys = Object.keys(currentInput) as (keyof RadioPlus.Config)[];

    // Compare values for each key
    for (const key of keys) {
      if (currentInput[key] !== newInput[key]) {
        return true;
      }
    }

    return false;
  }

  /**
   * Validates the input for the radio origin.
   * Checks if the track url is not malformed.
   * @param inputValue {string} The input value from the radio origin input.
   * @returns {string | null} The provided input value if deemed valid or null if the input was an empty string.
   * @throws {Error} If the input is null (form extraction went wrong) or when the url is malformed.
   */
  function radioOriginInputEvaluator(inputValue: string | null): string | null {
    if (inputValue === null) {
      throw Error("Couldn't read radio origin input.");
    }

    if (isWhitespaceString(inputValue)) {
      return null;
    }

    // Check if track url is not malformed.
    // ID will be extracted again later on, so the input change tracker can work as expected.
    let trackId;
    try {
      trackId = TrackFormatter.parseTrackUrl(inputValue);
    } catch (err) {
      throw Error((err as { message: string }).message);
    }

    if (trackId === null) {
      throw Error('Spotify track URL is malformed!');
    }

    return inputValue;
  }

  /**
   * Expandable form submit handler to check all config options for if there are any errors.
   * @param e {FormEvent<HTMLFormElement>} The form event wrapping all filter inputs.
   * @returns {boolean} If the data was evaluated and saved in the config succesfully return true. Also returns false if config status is currently loading.
   */
  function formSubmitHandler(e: FormEvent<HTMLFormElement>): boolean {
    e.preventDefault();

    if (config.isLoading) {
      return false;
    }

    // Create local copies of data and error objects.a
    const localConfig: RadioPlus.Config = { ...config.data };
    const localErrors: RadioPlus.ConfigFormErrors = {
      radioOriginTrackUrl: null,
    };

    // Extract form data.
    const formData = new FormData(e.target as HTMLFormElement);
    const songOriginInputValue = formData.get(
      'radio-plus-radio-origin-input'
    ) as string | null;

    // Run through each dedicated evaluator for each existing input in the config form.
    try {
      localConfig.radioOriginTrackUrl =
        radioOriginInputEvaluator(songOriginInputValue);
    } catch (err) {
      localErrors.radioOriginTrackUrl = (err as { message: string }).message;
    }

    // If there is atleast one error, update the error variable and return.
    if (Object.values(localErrors).some((value) => value !== null)) {
      setFormErrors(localErrors);
      return false;
    }

    config.setData(localConfig);
    return true;
  }

  return {
    formErrors,
    setFormErrors,
    formHasErrors,
    formSubmitHandler,
    setFormHasErrors,
    formHoldsNewData,
    inputChangeTracker,
    setInputChangeTracker,
    radioOriginInputEvaluator,
  };
}

export { useConfigForm };
