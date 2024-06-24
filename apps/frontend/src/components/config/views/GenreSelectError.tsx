import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { AnimatePresence, m } from 'framer-motion';

type GenreSelectErrorProps = {
  hasError: boolean;
};

function GenreSelectErrorView({ hasError }: GenreSelectErrorProps) {
  return (
    <AnimatePresence>
      {hasError && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeIn', duration: 0.1 }}
          className="absolute left-0 w-full flex justify-between items-center px-5 py-2.5 bg-base-700 rounded-full cursor-default"
        >
          <p className="text-base-600">Add track genre</p>
          <ExclamationCircleIcon
            className="w-7 h-7 fill-red-500"
            title="Fetching available genres failed"
          />
        </m.div>
      )}
    </AnimatePresence>
  );
}

export { GenreSelectErrorView };
