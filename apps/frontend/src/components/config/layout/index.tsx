import { FormEvent, useEffect, useState } from 'react';

import { m } from 'framer-motion';

import { ConfigFormSubmitBtnView } from '@/components/config/views/ConfigFormSubmitBtn';
import { FreshTracksCheckboxView } from '@/components/config/views/FreshTracksCheckbox';
import { BpmSliderWidget } from '@/components/config/widgets/BpmSlider';
import { ConfigHeaderWidget } from '@/components/config/widgets/ConfigHeader';
import { ConfigMenuToggleBarWidget } from '@/components/config/widgets/ConfigMenuToggleBar';
import { DanceabilitySliderWidget } from '@/components/config/widgets/DanceabilitySlider';
import { GenreSelectWidget } from '@/components/config/widgets/GenreSelect';
import { InstrumentalnessSliderWidget } from '@/components/config/widgets/instrumentalnessSlider';
import { PopularitySliderWidget } from '@/components/config/widgets/PopularitySlider';
import { RadioOriginInputWidget } from '@/components/config/widgets/RadioOriginInput';
import { ValenceSliderWidget } from '@/components/config/widgets/ValenceSlider';
import { useConfig } from '@/context/ConfigContext';
import { useConfigForm } from '@/hooks/useConfigForm';
import { logger } from '@/util/Logger';

type ConfigLayoutProps = {
  logout: () => void;
  playerWasTransferred: boolean;
  userFetched: boolean;
  algorithmError: string | null;
};

const variants = {
  open: { top: 0, bottom: 'unset' },
  closed: { bottom: 0, top: 'unset' },
};

function ConfigLayout({
  logout,
  playerWasTransferred,
  userFetched,
  algorithmError,
}: ConfigLayoutProps) {
  const config = useConfig();
  const configForm = useConfigForm();
  const [isOpen, setIsOpen] = useState(false);

  /** If updating the config fails, open menu again. */
  useEffect(() => {
    if (config.hasErrors && !isOpen) {
      setIsOpen(true);
    }
  }, [config.hasErrors]);

  function formSubmitHandler(e: FormEvent<HTMLFormElement>) {
    if (!playerWasTransferred) {
      logger.warn(
        '[formSubmitHandler] Tried to update config form, before player was transferred. Aborting.'
      );
      return;
    }

    const success = configForm.formSubmitHandler(e);

    if (success) {
      setIsOpen(false);
    }
  }

  return (
    <>
      <div className="radio-plus-filter-spacer h-9"></div>
      <div
        className="radio-plus-filter-wrapper z-[999] absolute top-0 left-0 w-full h-16 flex flex-col justify-end items-center"
        aria-hidden={!isOpen}
        id="filter-wrapper"
        role="menu"
      >
        <m.form
          onSubmit={(e) => formSubmitHandler(e)}
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
          className="radio-plus-filter-container absolute bottom-0 w-full h-fit flex flex-col justify-between items-start px-5 pt-5 overflow-hidden bg-base-800 rounded-b-xl sm:w-[calc(100%-3rem)] sm:px-6 md:w-4/5 max-w-4xl"
        >
          <ConfigHeaderWidget logout={logout} />
          <div className="w-full flex flex-col flex-nowrap justify-start items-start gap-y-5">
            <RadioOriginInputWidget
              formErrors={configForm.formErrors}
              setFormErrors={configForm.setFormErrors}
              isLoading={config.isLoading}
              inputChangeTracker={configForm.inputChangeTracker}
              updateInputChangeTracker={configForm.setInputChangeTracker}
            />
            <FreshTracksCheckboxView
              isLoading={config.isLoading}
              inputChangeTracker={configForm.inputChangeTracker}
              updateInputChangeTracker={configForm.setInputChangeTracker}
            />
            <GenreSelectWidget
              isLoading={config.isLoading}
              inputChangeTracker={configForm.inputChangeTracker}
              updateInputChangeTracker={configForm.setInputChangeTracker}
            />
            <BpmSliderWidget
              isLoading={config.isLoading}
              inputChangeTracker={configForm.inputChangeTracker}
              updateInputChangeTracker={configForm.setInputChangeTracker}
            />
            <DanceabilitySliderWidget
              isLoading={config.isLoading}
              inputChangeTracker={configForm.inputChangeTracker}
              updateInputChangeTracker={configForm.setInputChangeTracker}
            />
            <PopularitySliderWidget
              isLoading={config.isLoading}
              inputChangeTracker={configForm.inputChangeTracker}
              updateInputChangeTracker={configForm.setInputChangeTracker}
            />
            <ValenceSliderWidget
              isLoading={config.isLoading}
              inputChangeTracker={configForm.inputChangeTracker}
              updateInputChangeTracker={configForm.setInputChangeTracker}
            />
            <InstrumentalnessSliderWidget
              isLoading={config.isLoading}
              inputChangeTracker={configForm.inputChangeTracker}
              updateInputChangeTracker={configForm.setInputChangeTracker}
            />
          </div>
          <ConfigFormSubmitBtnView
            isLoading={config.isLoading}
            formHasErrors={configForm.formHasErrors}
            formHoldsNewData={configForm.formHoldsNewData}
            playerWasTransferred={playerWasTransferred}
            userFetched={userFetched}
            radioOriginTrackinputValue={
              configForm.inputChangeTracker.radioOriginTrackUrl
            }
          />
          <ConfigMenuToggleBarWidget
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            algorithmError={algorithmError}
          />
        </m.form>
      </div>
    </>
  );
}

export { ConfigLayout };
