import {
  TrackAudioFeatures,
  DetailedTrack,
} from '@/types/RadioPlus/DetailedTrack';
import { Error } from '@/types/RadioPlus/Error';
import { Recommendations } from '@/types/RadioPlus/Recommendation';
import { UserData, User } from '@/types/RadioPlus/UserData';

declare namespace RadioPlus {
  export {
    DetailedTrack,
    Error,
    TrackAudioFeatures,
    UserData,
    User,
    Recommendations,
  };
}

export { RadioPlus };
