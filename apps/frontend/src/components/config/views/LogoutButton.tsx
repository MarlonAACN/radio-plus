import { useEffect, useRef, useState } from 'react';

import {
  ArrowLeftStartOnRectangleIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { m, AnimatePresence } from 'framer-motion';

type LogoutButtonProps = {
  logout: () => void;
  menuIsOpen: boolean;
};

const cancelBtnVariants = {
  active: {
    opacity: 1,
    right: '50px',
    transition: {
      duration: 0.1,
      delay: 0.1,
      ease: 'easeIn',
    },
  },
};

function LogoutButtonView({ logout, menuIsOpen }: LogoutButtonProps) {
  const [shieldIsActive, setShieldIsActive] = useState<boolean>(true);
  const shieldTimer = useRef<NodeJS.Timeout | null>(null);

  /** Active logout shield automatically after some seconds pass. */
  useEffect(() => {
    if (shieldTimer.current !== null) {
      clearTimeout(shieldTimer.current);
    }

    shieldTimer.current = setTimeout(() => {
      setShieldIsActive(true);
    }, 3000);

    return () => {
      if (shieldTimer.current !== null) {
        clearTimeout(shieldTimer.current);
        shieldTimer.current = null;
      }
    };
  }, [shieldIsActive]);

  return (
    <div className="radio-plus-logout-btn-container relative h-11">
      <AnimatePresence>
        {shieldIsActive && (
          <m.button
            initial={{ rotate: 0 }}
            animate={{ rotate: 0 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ ease: 'easeIn', duration: 0.1 }}
            aria-label="logout shield that prevents logout on first click"
            disabled={!menuIsOpen}
            title="logout"
            type="button"
            onClick={() => setShieldIsActive(false)}
            className="radio-plus-logout-btn-shield absolute top-0 right-0 px-3 py-3 text-font-300 bg-base-700 rounded-full transition-colors hover:bg-base-650"
          >
            <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
          </m.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!shieldIsActive && (
          <>
            <m.button
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ ease: 'easeIn', duration: 0.1 }}
              aria-label="confirm logout"
              disabled={!menuIsOpen}
              title="confirm logout"
              type="button"
              onClick={() => logout()}
              className="z-10 radio-plus-logout-btn absolute top-0 right-0 px-3 py-3 text-font-300 bg-primary-500 rounded-full transition-colors"
            >
              <CheckIcon className="w-5 h-5 stroke-white" />
            </m.button>
            <m.button
              variants={cancelBtnVariants}
              animate="active"
              exit={{
                opacity: 0,
              }}
              aria-label="cancel logout"
              disabled={!menuIsOpen}
              title="cancel logout"
              type="button"
              onClick={() => setShieldIsActive(true)}
              className="radio-plus-cancel-logout-btn absolute top-0 right-0 px-3 py-3 text-font-300 bg-base-700 rounded-full transition-colors hover:bg-base-650"
            >
              <XMarkIcon className="w-5 h-5 stroke-white" />
            </m.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export { LogoutButtonView };
