import { PauseIcon, PlayIcon } from '@/icons';
import { logger } from '@/util/Logger';

type TogglePauseBtnProps = {
  toggleHandler: () => void;
  isPaused: boolean;
  playerEventIsLoading: boolean;
  disabled?: boolean;
};

function TogglePauseBtn({
  toggleHandler,
  isPaused,
  playerEventIsLoading,
  disabled = false,
}: TogglePauseBtnProps) {
  const firefoxProps = {
    autoComplete: 'off',
  };

  function toggleHandlerMiddleware() {
    if (playerEventIsLoading) {
      logger.log(
        '[TogglePauseBtn] Canceled pause toggle, as another event is currently in progress.'
      );
      return;
    }

    toggleHandler();
  }

  return (
    <button
      {...firefoxProps}
      disabled={disabled}
      onClick={() => toggleHandlerMiddleware()}
      className="radio-plus-pause-player-btn group p-3 bg-primary-500 rounded-full transition-colors hover:enabled:bg-primary-400 disabled:bg-base-700"
    >
      {isPaused ? (
        <PlayIcon className="group-disabled:fill-base-600 w-7 h-7 fill-base-0" />
      ) : (
        <PauseIcon className="group-disabled:fill-base-600 w-7 h-7 fill-base-0" />
      )}
    </button>
  );
}

export { TogglePauseBtn };
