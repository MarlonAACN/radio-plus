import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

import { Tooltip } from '@/components/util/Tooltip';
import { InputInfoTooltipProps } from '@/types/InputInfoTooltip';

function RadioOriginInputTooltipView({ menuIsOpen }: InputInfoTooltipProps) {
  return (
    <Tooltip
      id="radio-origin-input-tooltip"
      disabled={!menuIsOpen}
      options={{ iconBackground: true, origin: 'right', width: 'w-60' }}
    >
      <ol type="1">
        <li>1. Right click a song</li>
        <li className="flex flex-row justify-start items-center gap-x-1.5 my-1">
          2. Go to <ArrowUpTrayIcon className="w-4 h-auto" />
          <strong>Share</strong>
        </li>
        <li className="flex flex-row justify-start items-center gap-x-1.5">
          3. Click <DocumentDuplicateIcon className="w-4 h-auto" />
          <strong>Copy songlink</strong>
        </li>
      </ol>
    </Tooltip>
  );
}

export { RadioOriginInputTooltipView };
