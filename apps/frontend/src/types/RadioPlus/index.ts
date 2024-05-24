import { Config, ConfigErrors } from '@/types/RadioPlus/Config';
import {
  TrackAudioFeatures,
  DetailedTrack,
} from '@/types/RadioPlus/DetailedTrack';
import { Error } from '@/types/RadioPlus/Error';
import { ErrorResponse } from '@/types/RadioPlus/RadioPlusErrorResponse';

declare namespace RadioPlus {
  export {
    Error,
    ErrorResponse,
    Config,
    ConfigErrors,
    DetailedTrack,
    TrackAudioFeatures,
  };
}

export { RadioPlus };
