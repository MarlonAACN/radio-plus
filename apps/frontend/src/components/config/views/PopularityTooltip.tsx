import { Tooltip } from '@/components/util/Tooltip';

function PopularityTooltipView() {
  return (
    <Tooltip
      options={{
        iconBackground: false,
        origin: 'left',
        width: 'w-96',
        yAxisPos: 'bottom-full',
      }}
    >
      <p className="pb-2">
        Defines how popular the recommended tracks should be. The popularity is
        calculated by spotify and is based, in the most part, on the total
        number of plays the track has had and how recent those plays are.
      </p>
      <p>
        Generally speaking, songs that are being played a lot now will have a
        higher popularity than songs that were played a lot in the past.
        Duplicate tracks (e.g. the same track from a single and an album) are
        rated independently. Artist and album popularity is derived
        mathematically from track popularity.
      </p>
      <p>
        Tracks with a popularity score nearest to the target values will be
        preferred, meaning that the popularity score of the tracks will not
        necessary match the desired value exactly.
      </p>
    </Tooltip>
  );
}

export { PopularityTooltipView };
