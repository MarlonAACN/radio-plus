import { Tooltip } from '@/components/util/Tooltip';
import { InputInfoTooltipProps } from '@/types/InputInfoTooltip';

function DanceabilityTooltipView({ menuIsOpen }: InputInfoTooltipProps) {
  return (
    <Tooltip
      id="danceability-tooltip"
      disabled={!menuIsOpen}
      options={{
        iconBackground: false,
        origin: 'left',
        width: 'w-96',
        yAxisPos: 'bottom-full',
      }}
    >
      <p className="pb-2">
        Danceability describes how suitable a track is for dancing based on a
        combination of musical elements including tempo, rhythm stability, beat
        strength, and overall regularity.
      </p>
      <p>
        Tracks with a danceability score nearest to the target values will be
        preferred, meaning that the danceability score of the tracks will not
        necessary match the desired value exactly.
      </p>
    </Tooltip>
  );
}

export { DanceabilityTooltipView };
