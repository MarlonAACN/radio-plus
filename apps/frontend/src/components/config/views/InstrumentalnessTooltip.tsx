import { Tooltip } from '@/components/util/Tooltip';
import { InputInfoTooltipProps } from '@/types/InputInfoTooltip';

function InstrumentalnessTooltipView({ menuIsOpen }: InputInfoTooltipProps) {
  return (
    <Tooltip
      id="instrumentalness-tooltip"
      disabled={!menuIsOpen}
      options={{
        iconBackground: false,
        origin: 'left',
        width: 'w-96',
        yAxisPos: 'bottom-full',
      }}
    >
      <p className="pb-2">
        Predicts whether a track contains no vocals. &quot;Ooh&quot; and
        &quot;aah&quot; sounds are treated as instrumental in this context. Rap
        or spoken word tracks are clearly &quot;vocal&quot;. The higher the
        instrumentalness value is, the greater likelihood the track contains no
        vocal content. Values above 50% are intended to represent instrumental
        tracks, but confidence is higher as the value gets even higher.
      </p>
      <p>
        Tracks with a instrumental score nearest to the target values will be
        preferred, meaning that the instrumental score of the tracks will not
        necessary match the desired value exactly.
      </p>
    </Tooltip>
  );
}

export { InstrumentalnessTooltipView };
