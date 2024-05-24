import { useState } from 'react';

import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import {
  QuestionMarkCircleIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { m, AnimatePresence } from 'framer-motion';

function RadioOriginInputInfoView() {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  return (
    <div className="radio-plus-radio-origin-info relative bg-base-700 rounded-full">
      <QuestionMarkCircleIcon
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
        className="w-9 h-9 p-1 stroke-font-400 cursor-pointer"
      />
      <AnimatePresence>
        {showInfo && (
          <m.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeOut', duration: 0.1 }}
            className="radio-plus-tooltip z-20 absolute top-full right-0 w-60 h-auto px-2 py-2 mt-1 origin-top-right bg-base-600 rounded-lg shadow-sm max-w[82vw]"
          >
            <ol type="1">
              <li>1. Right click a song</li>
              <li className="flex flex-row justify-start items-center gap-x-1.5 my-1">
                2. Go to <ArrowUpTrayIcon className="w-4 h-auto" />
                <strong>Share</strong>
              </li>
              <li className="flex flex-row justify-start items-center gap-x-1.5">
                3. Click <DocumentDuplicateIcon className="w-4 h-auto" />
                <strong>Copy songlink</strong>
              </li>
            </ol>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { RadioOriginInputInfoView };
