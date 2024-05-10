// import {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useState,
// } from 'react';
//
// import { useRouter } from 'next/router';
//
// import {
//   SPOTIFY_DEVICE_NAME,
//   SPOTIFY_INIT_VOLUME,
//   SPOTIFY_PLAYBACK_SDK_URL,
// } from '@/constants';
// import useAuth from '@/hooks/useAuth';
// import { appRouter } from '@/router/app/AppRouter';
// import { logger } from '@/util/Logger';
//
// type SpotifyPlayerContextProps = {
//   playbackSDKReady: boolean;
//   player: Spotify.Player | null;
//   isPaused: boolean;
//   currentTrack: Spotify.Track | null;
//   togglePause: () => void;
// };
//
// type SpotifyPlayerProps = {
//   children: ReactNode;
// };
//
// const spotifyPlayerDefaultValues: SpotifyPlayerContextProps = {
//   playbackSDKReady: false,
//   player: null,
//   isPaused: true,
//   currentTrack: null,
//   togglePause: () => {
//     return;
//   },
// };
//
// const SpotifyPlayerContext = createContext<SpotifyPlayerContextProps>(
//   spotifyPlayerDefaultValues
// );
//
// function useSpotifyPlayer() {
//   return useContext(SpotifyPlayerContext);
// }
//
// function SpotifyPlayerProvider({ children }: SpotifyPlayerProps) {
//   const { getAuthToken, isAuthenticated } = useAuth();
//   const router = useRouter();
//
//   const [webPlaybackSDKReady, setWebPlaybackSDKReady] =
//     useState<boolean>(false);
//   const [player, setPlayer] = useState<Spotify.Player | null>(null);
//
//   const [isPaused, setPaused] = useState<boolean>(false);
//   const [isActive, setActive] = useState<boolean>(false);
//   const [currentTrack, setTrack] = useState<Spotify.Track | null>(null);
//
//   // load Web Playback SDK, when user is authenticated and SDK hasn't been instanciated yet.
//   useEffect(() => {
//     if (isAuthenticated && !webPlaybackSDKReady) {
//       const script = document.createElement('script');
//       script.src = SPOTIFY_PLAYBACK_SDK_URL;
//       document.body.appendChild(script);
//
//       window.onSpotifyWebPlaybackSDKReady = () => {
//         logger.log('[SpotifyPlayer] Web playback SDK is ready.');
//         setWebPlaybackSDKReady(true);
//       };
//
//       return () => {
//         document.body.removeChild(script);
//       };
//     }
//   }, [isAuthenticated]);
//
//   // create Spotify.Player instance. Called once when playback SDK is marked as ready.
//   // Since SDK can only be marked as ready, when user is authenticated, the useEffect call needs to additional auth check.
//   useEffect(() => {
//     createPlayer();
//
//     return () => {
//       if (player) {
//         logger.log('[SpotifyPlayer] Disconnecting player from spotify.');
//         player.disconnect();
//       }
//     };
//   }, [webPlaybackSDKReady]);
//
//   /**
//    * Creates a new Spotify.Player instance and registers all required listeners to it.
//    */
//   function createPlayer() {
//     if (webPlaybackSDKReady) {
//       const player = new Spotify.Player({
//         name: SPOTIFY_DEVICE_NAME,
//         getOAuthToken: async (callback) =>
//           callback(
//             await getAuthToken().catch(() => {
//               resetPlayer();
//
//               return 'unauthorized';
//             })
//           ),
//         volume: SPOTIFY_INIT_VOLUME,
//       });
//
//       player.addListener('player_state_changed', (state) => {
//         if (!state) {
//           return;
//         }
//
//         setTrack(state.track_window.current_track);
//         setPaused(state.paused);
//
//         player.getCurrentState().then((state) => {
//           !state ? setActive(false) : setActive(true);
//         });
//       });
//
//       player.addListener('ready', ({ device_id }) => {
//         console.log('Ready with Device ID', device_id);
//       });
//
//       player.addListener('not_ready', ({ device_id }) => {
//         console.log('Device ID has gone offline', device_id);
//       });
//
//       player.on('authentication_error', ({ message }) => {
//         console.error('Failed to authenticate', message);
//         player.disconnect();
//       });
//
//       setPlayer(player);
//
//       player.connect();
//     }
//   }
//
//   /**
//    * When both the access token and the refresh token are expired and thus are not present as cookies anymore (rare potential occasion),
//    * Reset the player and redirect user back to login page to authenticate themselves once again.
//    */
//   function resetPlayer() {
//     player?.disconnect();
//     setPlayer(null);
//
//     router.push(appRouter.get('Login').build());
//   }
//
//   function togglePausePlayer() {
//     setPaused(!isPaused);
//   }
//
//   const value: SpotifyPlayerContextProps = {
//     playbackSDKReady: webPlaybackSDKReady,
//     player: player,
//     isPaused: isPaused,
//     currentTrack: currentTrack,
//     togglePause: togglePausePlayer,
//   };
//
//   return (
//     <SpotifyPlayerContext.Provider value={value}>
//       {children}
//     </SpotifyPlayerContext.Provider>
//   );
// }
//
// export { useSpotifyPlayer, SpotifyPlayerProvider };
