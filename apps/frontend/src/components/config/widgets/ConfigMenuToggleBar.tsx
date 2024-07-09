import { Dispatch, SetStateAction } from 'react';

import {
  ChevronDownIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { RadioOriginTrackPreview } from '@/components/config/views/RadioOriginTrackPreview';
import { useConfig } from '@/context/ConfigContext';

type ConfigMenuToggleBarProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  algorithmError: string | null;
};
function ConfigMenuToggleBarWidget({
  isOpen,
  setIsOpen,
  algorithmError,
}: ConfigMenuToggleBarProps) {
  const config = useConfig();

  return (
    <div className="w-full h-16 flex flex-row justify-between items-center mt-5">
      <div className="flex flex-row justify-between items-center gap-x-3">
        <button
          type="button"
          aria-label="toggle config dropdown menu"
          aria-expanded={isOpen}
          aria-controls="filter-wrapper"
          aria-haspopup={true}
          title="toggle config dropdown menu"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full transition-colors hover:bg-base-500/10"
        >
          <ChevronDownIcon
            className={clsx(
              'w-10 h-10 fill-white transition-transform duration-200 ease-out',
              {
                'rotate-180': isOpen,
              }
            )}
          />
        </button>
        {config.hasErrors && (
          <div className="w-max flex flex-row justify-start items-center gap-x-1.5">
            <ExclamationCircleIcon className="w-7 h-7 fill-red-500" />
            <p className="font-medium text-red-500">
              Starting smart queue failed!
            </p>
          </div>
        )}
        {algorithmError && (
          <div className="w-max flex flex-row justify-start items-center gap-x-1.5">
            <ExclamationCircleIcon className="w-7 h-7 fill-red-500" />
            <p className="font-medium text-red-500">{algorithmError}</p>
          </div>
        )}
      </div>
      <RadioOriginTrackPreview isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export { ConfigMenuToggleBarWidget };
