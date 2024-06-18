import { ArrowTopRightOnSquareIcon } from '@heroicons/react/16/solid';
import { m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type PlaylistUrlBtnProps = {
  url: string | null;
};

function PlaylistUrlBtn({ url }: PlaylistUrlBtnProps) {
  return (
    <AnimatePresence>
      {url !== null && (
        <m.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeOut', duration: 0.2 }}
        >
          <Link
            href={url}
            target="_blank"
            rel="noreferrer"
            className="w-fit flex flex-row flex-nowrap justify-center items-start gap-x-1 px-5 py-2 mx-auto mt-5 text-primary-500 border rounded-full border-primary-500 transition-colors cursor-pointer hover:text-white hover:bg-primary-400 max-w-xl"
          >
            Open playlist in Spotify
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </Link>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export { PlaylistUrlBtn };
