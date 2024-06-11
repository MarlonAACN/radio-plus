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
import { ErrorResponse } from '@/types/RadioPlus/RadioPlusErrorResponse';
import { UserData } from '@/types/RadioPlus/UserData';
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
    TrackAudioFeatures,
    UserData,
    UserHook,
  };
}

export { RadioPlus };
