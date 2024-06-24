import { Tooltip } from '@/components/util/Tooltip';

function BpmTooltipView() {
  return (
    <Tooltip options={{ iconBackground: false, origin: 'left', width: 'w-96' }}>
      <p className="pb-2">
        Defines a value of orentiation for the tracks that will be recommended,
        to be around the given BPM value.
      </p>
      <p>
        Tracks with a BPM value nearest to the target values will be preferred,
        meaning that the BPM value of the tracks will not necessary match the
        desired value exactly.
      </p>
    </Tooltip>
  );
}

export { BpmTooltipView };
