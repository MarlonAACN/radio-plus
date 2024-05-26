import { FormEvent, useState } from 'react';

import { m } from 'framer-motion';

import { ConfigFormSubmitBtnView } from '@/components/config/views/ConfigFormSubmitBtn';
import { ConfigMenuToggleBarWidget } from '@/components/config/widgets/ConfigMenuToggleBar';
import { RadioOriginInputWidget } from '@/components/config/widgets/RadioOriginInput';
import { useConfig } from '@/context/ConfigContext';
import { useConfigForm } from '@/hooks/useConfigForm';

const variants = {
  open: { top: 0, bottom: 'unset' },
  closed: { bottom: 0, top: 'unset' },
};

function ConfigLayout() {
  const config = useConfig();
  const configForm = useConfigForm();
  const [isOpen, setIsOpen] = useState(false);

  function formSubmitHandler(e: FormEvent<HTMLFormElement>) {
    const success = configForm.formSubmitHandler(e);

    if (success) {
      setIsOpen(false);
    }
  }

  return (
    <>
      <div className="radio-plus-filter-spacer h-9"></div>
      <div className="radio-plus-filter-wrapper z-[999] absolute top-0 left-0 w-full h-16 flex flex-col justify-end items-center">
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
          <div className="w-full">
            <RadioOriginInputWidget
              formErrors={configForm.formErrors}
              setFormErrors={configForm.setFormErrors}
              isLoading={config.isLoading}
              inputChangeTracker={configForm.inputChangeTracker}
              updateInputChangeTracker={configForm.setInputChangeTracker}
            />
          </div>
          <ConfigFormSubmitBtnView
            isLoading={config.isLoading}
            formHasErrors={configForm.formHasErrors}
            formHoldsNewData={configForm.formHoldsNewData}
          />
          <ConfigMenuToggleBarWidget isOpen={isOpen} setIsOpen={setIsOpen} />
        </m.form>
      </div>
    </>
  );
}

export { ConfigLayout };
