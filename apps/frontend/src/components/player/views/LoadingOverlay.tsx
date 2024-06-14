import { m, AnimatePresence } from 'framer-motion';

import { Spinner } from '@/icons';

type LoadingOverlayProps = {
  isLoading: boolean;
};

function LoadingOverviewView({ isLoading }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeIn', duration: 0.1 }}
          role="alert"
          className="radio-plus-loading-overlay z-50 absolute inset-0 flex flex-col justify-center items-center bg-base-700/90"
        >
          <Spinner className="w-8 h-8" />
          <span className="mt-1.5 text-sm text-font-400">Loading...</span>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export { LoadingOverviewView };
