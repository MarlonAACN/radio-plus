import { AlgorithmHook } from '@/types/RadioPlus/AlgorithmHook';
import {
  Config,
  ConfigErrors,
  ConfigFormErrors,
} from '@/types/RadioPlus/Config';
import {
  TrackAudioFeatures,
  DetailedTrack,
} from '@/types/RadioPlus/DetailedTrack';
import { Error } from '@/types/RadioPlus/Error';
import { PlayerHook } from '@/types/RadioPlus/PlayerHook';
import { PlaylistUrl } from '@/types/RadioPlus/PlaylistUrl';
import { ErrorResponse } from '@/types/RadioPlus/RadioPlusErrorResponse';
import { TrackMood } from '@/types/RadioPlus/TrackMoods';
import { User, UserData } from '@/types/RadioPlus/UserData';
import { UserHook } from '@/types/RadioPlus/UserHook';

declare namespace RadioPlus {
  export {
    AlgorithmHook,
    ConfigFormErrors,
    Error,
    ErrorResponse,
    Config,
    ConfigErrors,
    DetailedTrack,
    PlayerHook,
    PlaylistUrl,
    TrackAudioFeatures,
    User,
    UserData,
    UserHook,
  };
}

export { RadioPlus, TrackMood };
