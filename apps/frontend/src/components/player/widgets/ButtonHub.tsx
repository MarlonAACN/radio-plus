import { SaveTrackBtn } from '@/components/player/views/SaveTrackBtn';
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
  initPlaybackWasTransferred: boolean;
  activeTrackId: string | null;
};

function ButtonHubWidget({
  skipBackHandler,
  skipFwdHandler,
  togglePauseHandler,
  isPaused,
  playerEventIsLoading,
  initPlaybackWasTransferred,
  activeTrackId,
}: ButtonHubProps) {
  return (
    <div className="flex flex-row flex-nowrap justify-between items-center">
      <div className="flex-1 flex flex-col justify-center">
        <SaveTrackBtn activeTrackId={activeTrackId} />
      </div>
      <div className="radio-plus-player-button-hub-container flex-1 flex flex-row flex-nowrap justify-center items-center gap-x-5">
        <SkipBackBtn
          skipBackHandler={skipBackHandler}
          disabled={!initPlaybackWasTransferred}
        />
        <TogglePauseBtn
          toggleHandler={togglePauseHandler}
          isPaused={isPaused}
          playerEventIsLoading={playerEventIsLoading}
          disabled={!initPlaybackWasTransferred}
        />
        <SkipFwdBtn
          skipFwdHandler={skipFwdHandler}
          disabled={!initPlaybackWasTransferred}
        />
      </div>
      <div className="flex-1"></div>
    </div>
  );
}

export { ButtonHubWidget };
