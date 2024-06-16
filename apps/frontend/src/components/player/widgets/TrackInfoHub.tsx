import Skeleton from 'react-loading-skeleton';

import { RadioPlusIcon } from '@/icons/RadioPlusIcon';
import { TrackFormatter } from '@/util/formatter/TrackFormatter';

type TrackInfoHubProps = {
  currentTrack: Spotify.Track | null;
};

function TrackInfoHubWidget({ currentTrack }: TrackInfoHubProps) {
  return (
    <div className="radio-plus-track-info-hub-container w-full mb-4 text-start">
      <div className="flex flex-row justify-start items-center gap-x-2 mb-2">
        <RadioPlusIcon className="w-5 h-5" />
        <p className="text-sm text-font-300">
          Radio<span className="font-dmsans">⁺</span>
        </p>
      </div>
      <h3 className="mb-0.5 text-xl leading-6">
        {currentTrack?.name || <Skeleton width={'65%'} />}
      </h3>
      <h4 className="text-sm text-font-400">
        {TrackFormatter.generateArtistsNameText(currentTrack?.artists) || (
          <Skeleton width={'40%'} />
        )}
      </h4>
    </div>
  );
}

export { TrackInfoHubWidget };
