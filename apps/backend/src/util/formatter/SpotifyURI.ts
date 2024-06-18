enum SpotiyUriType {
  track = 'spotify:track',
  playlist = 'spotify:playlist',
  album = 'spotify:album',
  artist = 'spotify:artist',
}

class SpotifyURI {
  /**
   * Construct a spotify URI for the desired object type, based on the given id.
   * @param id {string} The id of the object.
   * @param type {SpotiyUriType} The type of the object.
   * @returns {string} The construct spotify URI of the correct type.
   */
  public static construct(id: string, type: SpotiyUriType): string {
    return `${type}:${id}`;
  }
}

export { SpotifyURI, SpotiyUriType };
