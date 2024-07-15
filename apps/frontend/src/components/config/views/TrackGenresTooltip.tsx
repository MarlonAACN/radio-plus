import { Tooltip } from '@/components/util/Tooltip';
import { InputInfoTooltipProps } from '@/types/InputInfoTooltip';

function TrackGenresTooltipView({ menuIsOpen }: InputInfoTooltipProps) {
  return (
    <Tooltip
      id="track-genre-tooltip"
      disabled={!menuIsOpen}
      options={{
        iconBackground: false,
        origin: 'left',
        width: 'w-96',
        yAxisPos: 'top-10',
      }}
    >
      <p className="pb-2">
        You can spice up your recommendations by flavoring it with additional
        tracks from genres of your choice. Up to 5 music genres can be selected,
        which the algorithm then takes into consideration.
      </p>
      <p>
        The additional tracks from the selected genres will still respect your
        selected filter options and will be added to your playlist that is based
        on your origin track.
      </p>
    </Tooltip>
  );
}

export { TrackGenresTooltipView };
