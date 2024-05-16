import { ProgressBarWidget } from '@/components/player/views/ProgressBar';
import { ButtonHubWidget } from '@/components/player/widgets/ButtonHub';
import { TrackInfoHubWidget } from '@/components/player/widgets/TrackInfoHub';
import usePlayer from '@/hooks/usePlayer';

function PlayerLayout() {
  const player = usePlayer();

  function getTrackBackgroundCSS(track: Spotify.Track | null): string {
    if (!track || (!track.album.images[0].url && !track.album.images[2].url)) {
      return '#242424';
    }

    let trackImageUrl: string;

    // Check for high-res image
    if (track.album.images[2].url) {
      trackImageUrl = track.album.images[2].url;
    } else {
      trackImageUrl = track.album.images[0].url;
    }

    return `url(${trackImageUrl}) no-repeat center/cover`;
  }

  return (
    <>
      <h2 className="mb-10 font-arizonia text-6xl">
        Radio<span className="font-dmsans text-secondary-700">⁺</span>
      </h2>
      <div
        className="radio-plus-player-container w-full h-[600px] flex flex-col justify-center items-center px-5 pt-6 pb-5 bg-base-800 rounded-md sm:px-6 md:px-7 max-w-xl"
        style={{ background: getTrackBackgroundCSS(player.currentTrack) }}
      >
        <div className="radio-plus-player-content-wrapper w-full px-7 py-5 bg-gradient-to-r from-black/70 to-black/70 rounded-md max-w-md">
          <TrackInfoHubWidget currentTrack={player.currentTrack} />
          <ProgressBarWidget
            currentTrack={player.currentTrack}
            trackLength={player.currentTrack?.duration_ms}
            position={player.position}
            seekPosition={player.seekPosition}
            playerEventIsLoading={player.eventIsLoading}
            initPlaybackWasTransfered={player.wasTransfered}
            isPaused={player.isPaused}
          />
          <ButtonHubWidget
            togglePauseHandler={player.togglePause}
            isPaused={player.isPaused}
            playerEventIsLoading={player.eventIsLoading}
            initPlaybackWasTransfered={player.wasTransfered}
            skipBackHandler={player.skipBackwards}
            skipFwdHandler={player.skipForward}
          />
        </div>
      </div>
      <p>{player.isActive ? 'active' : 'inactive'}</p>
    </>
  );
}

export { PlayerLayout };
