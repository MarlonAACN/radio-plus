import { Dispatch, SetStateAction } from 'react';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { RadioOriginTrackPreview } from '@/components/config/views/RadioOriginTrackPreview';

type ConfigMenuToggleBarProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
function ConfigMenuToggleBarWidget({
  isOpen,
  setIsOpen,
}: ConfigMenuToggleBarProps) {
  return (
    <div className="w-full h-16 flex flex-row justify-between items-center mt-5">
      <button
        type="button"
        aria-label="toggle config dropdown menu"
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
      <RadioOriginTrackPreview isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export { ConfigMenuToggleBarWidget };
