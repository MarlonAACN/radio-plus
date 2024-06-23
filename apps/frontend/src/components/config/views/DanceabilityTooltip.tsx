import { Tooltip } from '@/components/util/Tooltip';

function DanceabilityTooltipView() {
  return (
    <Tooltip options={{ iconBackground: false, origin: 'left', width: 'w-96' }}>
      <p className="pb-2">
        Danceability describes how suitable a track is for dancing based on a
        combination of musical elements including tempo, rhythm stability, beat
        strength, and overall regularity.
      </p>
    </Tooltip>
  );
}

export { DanceabilityTooltipView };
