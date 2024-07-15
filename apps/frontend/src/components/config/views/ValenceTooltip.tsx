import { Tooltip } from '@/components/util/Tooltip';
import { InputInfoTooltipProps } from '@/types/InputInfoTooltip';

function ValenceTooltipView({ menuIsOpen }: InputInfoTooltipProps) {
  return (
    <Tooltip
      id="valence-tooltip"
      disabled={!menuIsOpen}
      options={{
        iconBackground: false,
        origin: 'left',
        width: 'w-96',
        yAxisPos: 'bottom-full',
      }}
    >
      <p className="pb-2">
        The valence describes the musical positiveness conveyed by a track.
        Tracks with high valence sound more positive (e.g. happy, cheerful,
        euphoric), while tracks with low valence sound more negative (e.g. sad,
        depressed, angry)
      </p>
      <p>
        Tracks with a valence score nearest to the target values will be
        preferred, meaning that the valence score of the tracks will not
        necessary match the desired value exactly.
      </p>
    </Tooltip>
  );
}

export { ValenceTooltipView };
