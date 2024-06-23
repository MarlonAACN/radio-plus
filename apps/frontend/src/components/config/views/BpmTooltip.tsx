import { Tooltip } from '@/components/util/Tooltip';

function BpmTooltipView() {
  return (
    <Tooltip options={{ iconBackground: false, origin: 'left', width: 'w-96' }}>
      <p className="pb-2">
        Defines a value of orentiation for the tracks that will be recommended,
        to be around the given BPM value.
      </p>
      <p>
        The BPM of the tracks will not match the given value exactly, but use it
        as point of orientation, so all tracks should be around that value.
      </p>
    </Tooltip>
  );
}

export { BpmTooltipView };
