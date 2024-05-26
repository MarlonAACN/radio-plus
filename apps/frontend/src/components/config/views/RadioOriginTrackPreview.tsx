import { Dispatch, SetStateAction } from 'react';

import { m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import { useConfig } from '@/context/ConfigContext';
import { DisconnectedIcon } from '@/icons/DisconnectedIcon';
import { TrackFormatter } from '@/util/formatter/TrackFormatter';

type RadioOriginTrackPreviewProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

function RadioOriginTrackPreview({
  isOpen,
  setIsOpen,
}: RadioOriginTrackPreviewProps) {
  const config = useConfig();

  return (
    <div className="radio-plus-origin-track-preview-container relative w-full h-full flex flex-row justify-end items-center">
      <AnimatePresence>
        {config.radioOriginTrack !== null && (
          <m.button
            aria-label={`Smart queue is running based on track called ${config.radioOriginTrack.information.name}`}
            initial={{ x: '30px', y: '-50%', opacity: 0 }}
            animate={{ x: 0, y: '-50%', opacity: 1 }}
            exit={{ x: '30px', y: '-50%', opacity: 0 }}
            transition={{
              duration: 0.1,
              ease: 'easeOut',
              x: { duration: 0.2, ease: 'easeOut' },
            }}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-1/2 right-0 w-fit flex flex-row justify-between items-center gap-x-2.5"
          >
            <div className="relative w-8 h-8 overflow-hidden rounded-full">
              <Image
                src={config.radioOriginTrack.information.album.images[0].url}
                alt={`${config.radioOriginTrack.information.name} album cover`}
                width={32}
                height={32}
              />
            </div>
            <div className="h-full flex flex-col justify-center items-start">
              <p className="text-sm text-white">
                {config.radioOriginTrack?.information.name}
              </p>
              <p className="text-xs text-font-400">
                {TrackFormatter.generateArtistsNameText(
                  config.radioOriginTrack.information.artists,
                  { truncate: { maxLength: 20 } }
                )}
              </p>
            </div>
          </m.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {config.radioOriginTrack === null && (
          <m.button
            aria-label="Smart queue is disabled"
            initial={{ x: '-30px', y: '-50%', opacity: 0 }}
            animate={{ x: 0, y: '-50%', opacity: 1 }}
            exit={{ x: '-30px', y: '-50%', opacity: 0 }}
            transition={{
              duration: 0.1,
              ease: 'easeOut',
              x: { duration: 0.2, ease: 'easeOut' },
            }}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-1/2 right-0 w-fit flex flex-row justify-between items-center gap-x-2.5"
          >
            <div className="relative w-8 h-8 p-1.5 overflow-hidden bg-secondary-700 rounded-full">
              <DisconnectedIcon className="w-full h-auto fill-white" />
            </div>
            <div className="h-full flex flex-col justify-center items-start">
              <p className="text-sm text-secondary-700">
                Smart queue is disabled
              </p>
            </div>
          </m.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export { RadioOriginTrackPreview };
