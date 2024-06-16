import { logger } from '@/util/Logger';

class TrackFormatter {
  /**
   * Turn the play history object of a user in an array of strings, holding the ids for each played track.
   * Duplicates are removed in thos process, returning an array, where each id of a track is unique.
   * @param recentTracks {Array<Spotify.PlayHistoryObject>} The fetched play history object, representing the play history of the user.
   * @return {Array<string>} An array with unique string ids of each played track.
   */
  public static listRecentlyPlayedTrackIds(
    recentTracks: Array<Spotify.PlayHistoryObject>
  ): Array<string> {
    const trackIds = new Set<string>();

    for (const track of recentTracks) {
      trackIds.add(track.track.id);
    }

    logger.log(
      `[listRecentlyPlayedTrackIds] Found ${trackIds.size} eligible track ids that were recently played by the user.`
    );
    return Array.from(trackIds);
  }

  /**
   * Extract all ids from a list of spotify artists.
   * @param artists {Array<Spotify.ArtistObjectFull | Spotify.ArtistObjectSimplified>} The list of artists, which can either be the complete or simplified object.
   * @returns {Array<string>} A list of all ids of the artists.
   */
  public static listArtistIds(
    artists: Array<Spotify.ArtistObjectFull | Spotify.ArtistObjectSimplified>
  ): Array<string> {
    return artists.map((artist) => {
      return artist.id;
    });
  }

  /**
   * Extract all ids from a list of spotify tracks.
   * @param tracks {Array<Spotify.TrackObjectFull | Spotify.TrackObjectSimplified>} The list of tracks, which can either be the complete or simplified object.
   * @returns {Array<string>} A list of all ids of the tracks.
   */
  public static listTracksIds(
    tracks: Array<Spotify.TrackObjectFull | Spotify.TrackObjectSimplified>
  ): Array<string> {
    return tracks.map((track) => {
      return track.id;
    });
  }
}

export { TrackFormatter };
