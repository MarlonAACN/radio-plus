class TrackFormatter {
  private static truncateText(text: string, length: number) {
    if (text.length <= length) {
      return text;
    }

    return text.substring(0, length) + '\u2026';
  }

  public static generateArtistsNameText(
    artists: Array<Spotify.Entity> | undefined,
    options?: { truncate?: { maxLength: number } }
  ): string {
    if (!artists) {
      return '';
    }

    const artistsString = artists.map((obj) => obj.name).join(', ');

    if (options?.truncate?.maxLength) {
      return this.truncateText(artistsString, options.truncate.maxLength);
    }

    return artistsString;
  }

  /**
   * Tries to extract the track id from a potential track url.
   * @param trackUrl {string} The string that potentially is a track url.
   * @returns {string | null} The track id or null if the id couldn't be properly extracted.
   * @throws {Error} if the trackUrl is malformed and couldn't be transformed into an url object.
   */
  public static parseTrackUrl(trackUrl: string): string | null {
    let trackId;
    try {
      const spotifyTrackUrl = new URL(trackUrl);
      const trackIdMatch = spotifyTrackUrl.pathname.match(/\/track\/([^/]+)/);
      trackId = trackIdMatch ? trackIdMatch[1] : null;
    } catch (_err) {
      throw Error('Spotify track URL is malformed!');
    }

    return trackId;
  }
}

export { TrackFormatter };
