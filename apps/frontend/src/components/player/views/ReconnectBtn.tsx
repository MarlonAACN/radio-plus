import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { m, AnimatePresence } from 'framer-motion';

type ReconnectBtnProps = {
  showReconnectBtn: boolean;
  reconnectHandler: () => void;
};

function ReconnectBtnView({
  showReconnectBtn,
  reconnectHandler,
}: ReconnectBtnProps) {
  return (
    <AnimatePresence>
      {showReconnectBtn && (
        <m.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeOut', duration: 0.2 }}
          className="absolute right-10 bottom-6 flex flex-row justify-center items-center gap-x-1 px-5 py-2 bg-primary-500 rounded-full transition-colors hover:bg-primary-400"
          onClick={reconnectHandler}
          aria-label="Try to reconnect radio plus player with spotify"
        >
          <ArrowPathIcon className="w-5 h-5 fill-white" />
          <p>Reconnect</p>
        </m.button>
      )}
    </AnimatePresence>
  );
}

export { ReconnectBtnView };
