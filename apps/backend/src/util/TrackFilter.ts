class TrackFilter {
  /**
   * Finds and returns the first track that is considered playable by spotify.
   * @param tracks {Array<Spotify.RecommendationTrackObject>} A list of recommended tracks.
   * @returns {Spotify.RecommendationTrackObject | null} The first track that is considered playable or null if no track is playable.
   */
  private static findFirstPlayable(
    tracks: Array<Spotify.RecommendationTrackObject>
  ): Spotify.RecommendationTrackObject | null {
    return tracks[0];

    for (const track of tracks) {
      if (track.is_playable) {
        console.log('playable track', track);
        return track;
      }
    }
    return null;
  }

  /**
   * Get a track recommendation from an array of recommendation tracks.
   * This runs each applied filter on it to find a fitting track.
   * @param tracks {Array<Spotify.RecommendationTrackObject>} A list of recommended tracks from spotify.
   * @returns {string | null} The id of the choosen track, based on filtering the recommendation array or null if no track could be found where all filters could be applied to.
   */
  public static filterRecommendations(
    tracks: Array<Spotify.RecommendationTrackObject>
  ): string | null {
    console.log(tracks);
    const track = this.findFirstPlayable(tracks);

    if (track) {
      return track.id;
    }

    return null;
  }
}

export { TrackFilter };
