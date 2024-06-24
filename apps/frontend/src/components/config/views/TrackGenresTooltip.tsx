import { Tooltip } from '@/components/util/Tooltip';

function TrackGenresTooltipView() {
  return (
    <Tooltip
      options={{
        iconBackground: false,
        origin: 'left',
        width: 'w-96',
        yAxisPos: 'top-10',
      }}
    >
      <p className="pb-2">
        Up to 5 music genres can be selected, which the algorithm then takes
        into consideration.
      </p>
      <p>
        If genres are selected, that heavly differ from each other or the origin
        track, the algorithm will return a mix of different tracks from each
        genre.
      </p>
    </Tooltip>
  );
}

export { TrackGenresTooltipView };
