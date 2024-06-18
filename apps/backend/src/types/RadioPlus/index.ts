import {
  TrackAudioFeatures,
  DetailedTrack,
} from '@/types/RadioPlus/DetailedTrack';
import { Error } from '@/types/RadioPlus/Error';
import { FilterOptions } from '@/types/RadioPlus/FilterOptions';
import { PlaylistDetailData } from '@/types/RadioPlus/Playlist';
import { Recommendations } from '@/types/RadioPlus/Recommendation';
import { UserData, User } from '@/types/RadioPlus/UserData';

declare namespace RadioPlus {
  export {
    DetailedTrack,
    Error,
    FilterOptions,
    PlaylistDetailData,
    TrackAudioFeatures,
    UserData,
    User,
    Recommendations,
  };
}

export { RadioPlus };
