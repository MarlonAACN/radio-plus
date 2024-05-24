import { Dispatch, SetStateAction } from 'react';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

type FilterMenuToggleBtnProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  radioOrigin: string | null;
};

function ConfigMenuToggleBtnView({
  isOpen,
  setIsOpen,
  radioOrigin,
}: FilterMenuToggleBtnProps) {
  return (
    <div className="w-full h-16 flex flex-row justify-between items-center mt-5">
      <button
        type="button"
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
      <div>
        <p>{radioOrigin}</p>
      </div>
    </div>
  );
}

export { ConfigMenuToggleBtnView };
