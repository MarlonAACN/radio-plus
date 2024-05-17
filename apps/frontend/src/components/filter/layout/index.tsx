import { useState } from 'react';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { m } from 'framer-motion';

import { SongBaseInputWidget } from '@/components/filter/widgets/SongBaseInput';

const variants = {
  open: { top: 0, bottom: 'unset' },
  closed: { bottom: 0, top: 'unset' },
};

function FilterLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="radio-plus-filter-spacer h-9"></div>
      <div className="radio-plus-filter-wrapper absolute top-0 left-0 w-full h-16 flex flex-col justify-end items-center">
        <m.div
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
          className="radio-plus-filter-container absolute bottom-0 w-full h-fit flex flex-col justify-between items-start px-5 pt-3 overflow-hidden bg-base-800 rounded-b-xl sm:w-[calc(100%-3rem)] sm:px-6 md:w-4/5"
        >
          <div className="w-full">
            <SongBaseInputWidget />
          </div>
          <div className="w-full h-16 flex flex-row justify-between items-center pb-2">
            <button
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
          </div>
        </m.div>
      </div>
    </>
  );
}

export { FilterLayout };
