import { AnimatePresence, m } from 'framer-motion';

import { Spinner } from '@/icons';

type GenreSelectLoadingProps = {
  isLoading: boolean;
};

function GenreSelectLoadingView({ isLoading }: GenreSelectLoadingProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeIn', duration: 0.1 }}
          className="absolute left-0 w-full flex justify-between items-center px-5 py-2.5 bg-base-700 rounded-full cursor-default"
        >
          <p className="text-base-600">Add track genre</p>
          <Spinner className="w-5 h-5" />
        </m.div>
      )}
    </AnimatePresence>
  );
}

export { GenreSelectLoadingView };
