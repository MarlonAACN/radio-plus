import { Tooltip } from '@/components/util/Tooltip';

function FreshTrackTooltipView() {
  return (
    <Tooltip
      id="fresh-tracks-tooltip"
      options={{ iconBackground: false, origin: 'left', width: 'w-96' }}
    >
      <p>
        Radio plus will filter out all those songs you have heard recently or
        songs you probably know pretty well already, to give you a fresh
        experience of new tracks.
      </p>
    </Tooltip>
  );
}

export { FreshTrackTooltipView };
