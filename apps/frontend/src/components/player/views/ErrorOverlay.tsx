import { m, AnimatePresence } from 'framer-motion';

import { Spinner } from '@/icons';

type ErrorOverlayProps = {
  showError: boolean;
  /** If loading is true, don't show error screen. */
  isLoading: boolean;
};

function ErrorOverlayView({ showError, isLoading }: ErrorOverlayProps) {
  return (
    <AnimatePresence>
      {showError && !isLoading && (
        <m.div
          role="alert"
          className="radio-plus-error-overlay z-50 absolute inset-0 flex flex-col justify-center items-center bg-base-700/90"
        >
          <div className="mb-10 text-center">
            <p className="text-2xl">Spotify returned an error</p>
            <p className="text-2xl">Please reconnect</p>
          </div>
          <Spinner className="w-8 h-8" />
          <span className="mt-1.5 text-sm text-font-400">Redirecting...</span>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export { ErrorOverlayView };
