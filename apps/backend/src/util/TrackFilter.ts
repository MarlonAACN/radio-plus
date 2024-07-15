import { HttpStatus } from '@nestjs/common';

import { RadioPlus } from '@/types/RadioPlus';
import { RadioPlusError } from '@/types/RadioPlus/Error';
import { logger } from '@/util/Logger';

class TrackFilter {
  /**
   * Remove all tracks that are not considered playable by spotify.
   * Being playable means, that this track is available in the market (country) of the user.
   * @param tracks {Array<Spotify.RecommendationTrackObject>} A list of recommended tracks.
   * @returns {Array<Spotify.RecommendationTrackObject>} A list of all tracks that are considered playable by spotify.
   */
  private static removeUnplayableTracks(
    tracks: Array<Spotify.RecommendationTrackObject>
  ): Array<Spotify.RecommendationTrackObject> {
    const playableTrackList: Array<Spotify.RecommendationTrackObject> = [];

    for (const track of tracks) {
      if (track.is_playable) {
        playableTrackList.push(track);
      }
    }

    return playableTrackList;
  }

  private static removeTracksKnownToTheUser(
    tracks: Array<Spotify.RecommendationTrackObject>,
    userData: RadioPlus.UserData
  ): Array<Spotify.RecommendationTrackObject> {
    const filteredList: Array<Spotify.RecommendationTrackObject> = [];

    const filterStats = {
      recentTracks: 0,
      topTracks: 0,
      topArtists: 0,
      followedArtists: 0,
    };

    function trackIsknown(track: Spotify.RecommendationTrackObject): boolean {
      if (userData.recentTracks.includes(track.id)) {
        filterStats.recentTracks += 1;
        return true;
      }
      if (userData.topTracks.includes(track.id)) {
        filterStats.topTracks += 1;
        return true;
      }

      // Only if ALL artists of a track is known to the user, return true.
      const artistIdSet = new Set(track.artists.map((artist) => artist.id));
      if (userData.topArtists.every((id) => artistIdSet.has(id))) {
        filterStats.topArtists += 1;
        return true;
      }

      // If at least one artist is known return true.
      if (userData.followedArtists.some((id) => artistIdSet.has(id))) {
        filterStats.followedArtists += 1;
        return true;
      }

      return false;
    }

    for (const track of tracks) {
      if (!trackIsknown(track)) {
        filteredList.push(track);
      }
    }

    logger.log('[FilterAnalytics] Filtered tracks origin:', filterStats);

    return filteredList;
  }

  private static trackListToTrackIdList(
    tracks: Array<Spotify.RecommendationTrackObject>
  ): Array<string> {
    return tracks.map((track) => {
      return track.id;
    });
  }

  /**
   * Filter a list of recommendation tracks, based on filter settings and general options.
   * @param tracks {Array<Spotify.RecommendationTrackObject>} A list of recommended tracks from spotify.
   * @param userData {RadioPlus.UserData | undefined} User data that is relevant to some filter options.
   * @param options {RadioPlus.FilterOptions} Options that influence the filtering.
   * @returns {Array<string>} The filtered list of tracks, now only consisting of the id of each track that was deemed eligible.
   */
  public static filterRecommendations(
    tracks: Array<Spotify.RecommendationTrackObject>,
    userData: RadioPlus.UserData | undefined,
    options: RadioPlus.FilterOptions
  ): Array<string> {
    let filteredTracks = this.removeUnplayableTracks(tracks);

    if (options.freshTracks) {
      if (!userData) {
        throw new RadioPlusError(
          HttpStatus.BAD_REQUEST,
          'Failed fetching user listening preferences.'
        );
      }

      filteredTracks = this.removeTracksKnownToTheUser(
        filteredTracks,
        userData
      );
    }

    return this.trackListToTrackIdList(filteredTracks);
  }
}

export { TrackFilter };
