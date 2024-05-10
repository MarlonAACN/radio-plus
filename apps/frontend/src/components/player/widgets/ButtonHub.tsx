import { SkipBackBtn } from '@/components/player/views/SkipBackBtn';
import { SkipFwdBtn } from '@/components/player/views/SkipFwdBtn';
import { TogglePauseBtn } from '@/components/player/views/TogglePauseBtn';

type ButtonHubProps = {
  skipBackHandler: () => void;
  skipFwdHandler: () => void;
  togglePauseHandler: () => void;
  isPaused: boolean;
  playerEventIsLoading: boolean;
  /** Check if init playback transfer is completed successfully. */
  initPlaybackWasTransfered: boolean;
};

function ButtonHubWidget({
  skipBackHandler,
  skipFwdHandler,
  togglePauseHandler,
  isPaused,
  playerEventIsLoading,
  initPlaybackWasTransfered,
}: ButtonHubProps) {
  return (
    <div className="radio-plus-player-button-hub-container flex flex-row justify-center items-center gap-x-5">
      <SkipBackBtn
        skipBackHandler={skipBackHandler}
        disabled={!initPlaybackWasTransfered}
      />
      <TogglePauseBtn
        toggleHandler={togglePauseHandler}
        isPaused={isPaused}
        playerEventIsLoading={playerEventIsLoading}
        disabled={!initPlaybackWasTransfered}
      />
      <SkipFwdBtn
        skipFwdHandler={skipFwdHandler}
        disabled={!initPlaybackWasTransfered}
      />
    </div>
  );
}

export { ButtonHubWidget };
