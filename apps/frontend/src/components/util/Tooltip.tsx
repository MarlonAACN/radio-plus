import { ReactNode, useState } from 'react';

import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { AnimatePresence, m } from 'framer-motion';
import useKeypress from 'react-use-keypress';

type TooltipProps = {
  children: ReactNode;
  id: string;
  options: {
    iconBackground?: boolean;
    origin: 'left' | 'right';
    yAxisPos?: string;
    width: string;
  };
};

function Tooltip({ children, id, options }: TooltipProps) {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  useKeypress('Escape', () => {
    if (showInfo) {
      setShowInfo(false);
    }
  });

  return (
    <div
      className={clsx(
        'radio-plus-tooltip-container md2:relative rounded-full',
        {
          'bg-base-700': options?.iconBackground,
        }
      )}
    >
      <button
        type="button"
        className="block"
        onClick={() => setShowInfo(true)}
        onFocus={() => setShowInfo(true)}
        onBlur={() => setShowInfo(false)}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
        aria-describedby={id}
        aria-haspopup={true}
        aria-expanded={showInfo}
      >
        <QuestionMarkCircleIcon className="w-9 h-9 p-1 stroke-font-400 cursor-pointer" />
      </button>
      <AnimatePresence>
        {showInfo && (
          <m.div
            id={id}
            role="tooltip"
            aria-hidden={!showInfo}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeOut', duration: 0.1 }}
            className={clsx(
              'radio-plus-tooltip z-20 md2:max-w-[45vw] absolute w-max h-auto px-2 py-2 mt-1 bg-base-600 rounded-lg shadow-sm sm:max-w-[86vw] md:max-w-[74vw] xl:max-w-xl max-w-[91vw]',
              options.width,
              options?.yAxisPos,
              {
                'origin-top-right right-0': options?.origin === 'right',
                'origin-top-left left-0': options?.origin === 'left',
                'top-full': !options?.yAxisPos,
              }
            )}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { Tooltip };
