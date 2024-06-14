import {
  TrackAudioFeatures,
  DetailedTrack,
} from '@/types/RadioPlus/DetailedTrack';
import { Error } from '@/types/RadioPlus/Error';
import { UserData, User } from '@/types/RadioPlus/UserData';

declare namespace RadioPlus {
  export { DetailedTrack, Error, TrackAudioFeatures, UserData, User };
}

export { RadioPlus };
