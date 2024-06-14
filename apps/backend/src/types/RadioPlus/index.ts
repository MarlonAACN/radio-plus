import {
  TrackAudioFeatures,
  DetailedTrack,
} from '@/types/RadioPlus/DetailedTrack';
import { Error } from '@/types/RadioPlus/Error';
import { UserData, User } from '@/types/RadioPlus/UserData';
import { Recommendations } from '@/types/RadioPlus/Recommendation';

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
