import { ErrorOverlayView } from '@/components/player/views/ErrorOverlay';
import { LoadingOverviewView } from '@/components/player/views/LoadingOverlay';
import { PlaylistUrlBtn } from '@/components/player/views/PlaylistUrlBtn';
import { ProgressBarWidget } from '@/components/player/views/ProgressBar';
import { ReconnectBtnView } from '@/components/player/views/ReconnectBtn';
import { ButtonHubWidget } from '@/components/player/widgets/ButtonHub';
import { TrackInfoHubWidget } from '@/components/player/widgets/TrackInfoHub';
import { RadioPlus } from '@/types/RadioPlus';

type PlayerLayoutProps = {
  player: RadioPlus.PlayerHook;
  algoIsLoading: boolean;
  playlistUrl: string | null;
};

function PlayerLayout({
  player,
  algoIsLoading,
  playlistUrl,
}: PlayerLayoutProps) {
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
      <div className="w-full flex justify-center items-center px-5 py-3 mb-3 bg-base-800 rounded-md sm:px-6 md:px-7 max-w-xl">
        <h2 className="font-arizonia text-6xl">
          Radio<span className="font-dmsans text-secondary-700">⁺</span>
        </h2>
      </div>
      <div
        className="radio-plus-player-container relative w-full h-[600px] flex flex-col justify-center items-center px-5 pt-6 pb-5 overflow-hidden bg-base-800 rounded-md sm:px-6 md:px-7 max-w-xl"
        style={{ background: getTrackBackgroundCSS(player.currentTrack) }}
      >
        <LoadingOverviewView isLoading={algoIsLoading} />
        <ErrorOverlayView
          showError={player.errorOccured}
          isLoading={algoIsLoading}
        />
        <div
          aria-busy={algoIsLoading || player.errorOccured}
          className="radio-plus-player-content-wrapper w-full px-7 py-5 bg-gradient-to-r from-black/70 to-black/70 rounded-md max-w-md"
        >
          <TrackInfoHubWidget currentTrack={player.currentTrack} />
          <ProgressBarWidget
            currentTrack={player.currentTrack}
            trackLength={player.currentTrack?.duration_ms}
            position={player.position}
            seekPosition={player.seekPosition}
            playerEventIsLoading={player.eventIsLoading}
            initPlaybackWasTransferred={player.wasTransferred}
            isPaused={player.isPaused}
          />
          <ButtonHubWidget
            togglePauseHandler={player.togglePause}
            isPaused={player.isPaused}
            playerEventIsLoading={player.eventIsLoading}
            initPlaybackWasTransferred={player.wasTransferred}
            skipBackHandler={player.skipBackwards}
            skipFwdHandler={player.skipForward}
            activeTrackId={player.activeTrackId}
          />
        </div>
        <ReconnectBtnView
          showReconnectBtn={player.showReconnectBtn}
          reconnectHandler={player.reconnectPlayer}
        />
      </div>
      <PlaylistUrlBtn url={playlistUrl} />
    </>
  );
}

export { PlayerLayout };
