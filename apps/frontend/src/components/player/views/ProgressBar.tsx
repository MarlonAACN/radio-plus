import { FormEvent, useEffect, useRef, useState } from 'react';

import prettyMilliseconds from 'pretty-ms';

import { PROGRESS_BAR_DEFAULT_LENGTH } from '@/constants';

type ProgressBarProps = {
  /** Required for proper detection of position change */
  currentTrack: Spotify.Track | null;
  /** Length of the track in ms */
  trackLength: number | undefined;
  /** current track position */
  position: number;
  /** Check if init playback transfer is completed successfully. */
  initPlaybackWasTransferred: boolean;
  isPaused: boolean;
  playerEventIsLoading: boolean;
  seekPosition: (positionInMs: number) => Promise<boolean>;
};

function ProgressBarWidget({
  currentTrack,
  trackLength,
  position,
  isPaused,
  initPlaybackWasTransferred,
  playerEventIsLoading,
  seekPosition,
}: ProgressBarProps) {
  const [isDragged, setIsDragged] = useState<boolean>(false);
  const [progressBarValue, setProgressBarValue] = useState<string>('0');
  const inputDragDebouncer = useRef<NodeJS.Timer | null>(null);
  const interval = useRef<NodeJS.Timer | null>(null);
  const inputRangeHtml = useRef<HTMLInputElement | null>(null);
  // https://github.com/vercel/next.js/issues/35558
  const firefoxProps = {
    autoComplete: 'off',
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      inputRangeHtml.current = document.getElementById(
        'radio-plus-track-progress-slider'
      ) as HTMLInputElement | null;
    }
  }, []);

  // Call the js css progress indicator styler script on each value change of the progress bar.
  useEffect(() => {
    progressScript();
  }, [progressBarValue]);

  // Initially and on position change (player state change) update progress bar.
  useEffect(() => {
    setProgressBarValue(msToSeconds(position).toString());
  }, [position, currentTrack]);

  useEffect(() => {
    // Don't run interval if player is currently either paused, dragged or a player event is loading.
    if (!isPaused && !isDragged && !playerEventIsLoading) {
      // No need to start a new interval, if one is already up and running.
      if (interval.current !== null) {
        return;
      }

      interval.current = setInterval(() => {
        setProgressBarValue((prevValue) => (Number(prevValue) + 1).toString());
      }, 1000);
    } else {
      // Since one of the conditions is true stop interval if one is running.
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, [isPaused, isDragged, playerEventIsLoading]);

  /**
   * Script function to support track progress CSS for Chrome.
   */
  function progressScript() {
    if (inputRangeHtml.current === null) {
      inputRangeHtml.current = document.getElementById(
        'radio-plus-track-progress-slider'
      ) as HTMLInputElement | null;
      return;
    }

    const sliderValue = inputRangeHtml.current.value;

    if (currentTrack === null || !initPlaybackWasTransferred) {
      inputRangeHtml.current.style.background = `linear-gradient(to right, #242424 0%, #242424 0%)`;
      return;
    }

    const progress =
      (Number(sliderValue) / Number(inputRangeHtml.current.max)) * 100;
    inputRangeHtml.current.style.background = `linear-gradient(to right, #F70062 ${progress}%, #242424 ${progress}%)`;
  }

  /**
   * On change handler for the range input.
   * Handling keyboard interaction with the progress bar
   * Is called whenever the input value is changed by the user via the keyboard (non-drag events).
   * Since the event can fire several times in a short duration, a debouncer is in place to only be called after the event.
   * @param e {FormEvent<HTMLInputElement>} The input event.
   */
  function progressChangeHandler(e: FormEvent<HTMLInputElement>) {
    const eventProgressValue = e.currentTarget.value;

    setProgressBarValue(eventProgressValue);

    /// event will be handled in the drag handler, once drag is concluded.
    if (isDragged) {
      return;
    }

    if (inputDragDebouncer.current !== null) {
      clearTimeout(inputDragDebouncer.current);
    }

    inputDragDebouncer.current = setTimeout(
      () => updateSpotifyPlayerPosition(Number(eventProgressValue)),
      200
    );
  }

  /**
   * When user drags the progress bar, toggle the isDragged useState variable.
   * This prevents the progress bar to keep ticking, while the user drags it.
   */
  function mouseDownEventHandler() {
    setIsDragged(true);
  }

  /**
   * Fired when drag event is finished.
   * Update isDragged useState variable and call the updateSpotifyPlayerPosition function.
   * @param e {MouseEvent<HTMLInputElement, MouseEvent>} The object emitted from the event.
   */
  function mouseUpEventHandler(e: React.MouseEvent<HTMLInputElement>) {
    const eventProgressValue = e.currentTarget.value;

    setProgressBarValue(eventProgressValue);
    setIsDragged(false);

    updateSpotifyPlayerPosition(Number(eventProgressValue));
  }

  /**
   * Update the current tracks position in spotify.
   * @param newPosition {number} The new position in seconds.
   */
  function updateSpotifyPlayerPosition(newPosition: number) {
    seekPosition(secondsToMs(newPosition)).then((res) => {
      // If operation failed, set progress bar back to original position.
      if (!res) {
        setProgressBarValue(msToSeconds(position).toString());
      }
    });
  }

  function msToSeconds(ms: number | undefined): number {
    return Math.floor((ms ?? PROGRESS_BAR_DEFAULT_LENGTH) / 1000);
  }

  function secondsToMs(seconds: number): number {
    return seconds * 1000;
  }

  function msToTimeString(ms: number): string {
    return prettyMilliseconds(ms, {
      colonNotation: true,
      secondsDecimalDigits: 0,
    });
  }

  return (
    <div className="radio-plus-progress-bar h-5 flex flex-row flex-nowrap justify-start items-center mb-3">
      <div className="radio-plus-track-position-container w-10">
        <span className="flex justify-start items-center m-auto text-sm text-font-400">
          {currentTrack !== null
            ? msToTimeString(secondsToMs(Number(progressBarValue)))
            : null}
        </span>
      </div>
      <input
        {...firefoxProps}
        type="range"
        min="0"
        max={msToSeconds(trackLength)}
        value={progressBarValue}
        onChange={progressChangeHandler}
        onMouseDown={mouseDownEventHandler}
        onMouseUp={(e) => mouseUpEventHandler(e)}
        disabled={!initPlaybackWasTransferred}
        aria-label="Current track position progress in seconds"
        aria-valuemin={0}
        aria-valuemax={msToSeconds(trackLength)}
        aria-valuenow={Number(progressBarValue)}
        role="slider"
        id="radio-plus-track-progress-slider"
        className="radio-plus-track-progress-slider flex-1"
      />
      <div className="radio-plus-track-position-container w-10">
        <span className="flex justify-end items-center m-auto text-sm text-font-400">
          {trackLength ? msToTimeString(trackLength) : null}
        </span>
      </div>
    </div>
  );
}

export { ProgressBarWidget };
