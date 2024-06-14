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
   * @returns {Array<string>} The filtered list of tracks, now only consisting of the id of each track that was deemed eligible.
   */
  public static filterRecommendations(
    tracks: Array<Spotify.RecommendationTrackObject>
  ): Array<string> {
    const filteredTracks = this.removeUnplayableTracks(tracks);

    return this.trackListToTrackIdList(filteredTracks);
  }
}

export { TrackFilter };
