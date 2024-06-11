declare namespace Spotify {
  type AuthToken = {
    /** The access token */
    access_token: string;

    /** The token type */
    expires_in: number;

    /** The refresh token if any to refresh the current token */
    refresh_token: string;
  };

  type DetailedAuthToken<T> = T & {
    /** The duration of the token in milliseconds */
    token_type: string;

    /** All scopes the token has access to, seperated by whitespace */
    scope: string;
  };

  type AccessToken = Omit<AuthToken, 'refresh_token'>;

  type AuthenticationError = {
    error: string;
    error_description: string;
  };

  type Error = {
    status: number;
    message: string;
  };

  interface Entity {
    name: string;
    uri: string;
    url: string;
  }

  interface Image {
    height?: number | null | undefined;
    url: string;
    size?: string | null | undefined;
    width?: number | null | undefined;
  }

  interface Album {
    name: string;
    uri: string;
    images: Image[];
  }

  interface Track {
    album: Album;
    artists: Entity[];
    duration_ms: number;
    id: string | null;
    is_playable: boolean;
    name: string;
    uid: string;
    uri: string;
    media_type: 'audio' | 'video';
    type: 'track' | 'episode' | 'ad';
    track_type: 'audio' | 'video';
    linked_from: {
      uri: string | null;
      id: string | null;
    };
  }

  /**
   * External Url Object
   * [](https://developer.spotify.com/web-api/object-model/)
   *
   * Note that there might be other types available, it couldn't be found in the docs.
   */
  interface ExternalUrlObject {
    spotify: string;
  }

  /**
   * External Id object
   * [](https://developer.spotify.com/web-api/object-model/)
   *
   * Note that there might be other types available, it couldn't be found in the docs.
   */
  interface ExternalIdObject {
    isrc?: string | undefined;
    ean?: string | undefined;
    upc?: string | undefined;
  }

  /**
   * Image Object
   * [](https://developer.spotify.com/web-api/object-model/)
   */
  interface ImageObject {
    /**
     * The image height in pixels. If unknown: `null` or not returned.
     */
    height?: number | undefined;
    /**
     * The source URL of the image.
     */
    url: string;
    /**
     * The image width in pixels. If unknown: null or not returned.
     */
    width?: number | undefined;
  }

  /**
   * Context Object
   * [](https://developer.spotify.com/web-api/object-model/#context-object)
   */
  interface ContextObject {
    /**
     * The object type.
     */
    type: 'artist' | 'playlist' | 'album' | 'show' | 'episode';
    /**
     * A link to the Web API endpoint providing full details.
     */
    href: string;
    /**
     * Known external URLs.
     */
    external_urls: ExternalUrlObject;
    /**
     * The [Spotify URI](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids).
     */
    uri: string;
  }

  interface RestrictionsObject {
    reason: string;
  }

  /**
   * Simplified Artist Object
   * [artist object (simplified)](https://developer.spotify.com/web-api/object-model/)
   */
  interface ArtistObjectSimplified extends ContextObject {
    /**
     * The name of the artist.
     */
    name: string;
    /**
     * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the artist.
     */
    id: string;
    type: 'artist';
  }

  /**
   * Track Link Object
   * [](https://developer.spotify.com/web-api/object-model/#track-object-simplified)
   */
  interface TrackLinkObject {
    external_urls: ExternalUrlObject;
    href: string;
    id: string;
    type: 'track';
    uri: string;
  }

  /**
   * Simplified Track Object
   * [track object (simplified)](https://developer.spotify.com/web-api/object-model/#track-object-simplified)
   */
  interface TrackObjectSimplified {
    /**
     * The artists who performed the track.
     */
    artists: ArtistObjectSimplified[];
    /**
     * A list of the countries in which the track can be played,
     * identified by their [ISO 3166-1 alpha-2 code](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
     */
    available_markets?: string[] | undefined;
    /**
     * The disc number (usually `1` unless the album consists of more than one disc).
     */
    disc_number: number;
    /**
     * The track length in milliseconds.
     */
    duration_ms: number;
    /**
     * Whether the track has explicit lyrics (`true` = yes it does; `false` = no it does not OR unknown).
     */
    explicit: boolean;
    /**
     * Known external URLs for this track.
     */
    external_urls: ExternalUrlObject;
    /**
     * A link to the Web API endpoint providing full details of the track.
     */
    href: string;
    /**
     * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the track.
     */
    id: string;
    /**
     * Part of the response when [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/) is applied.
     * If `true`, the track is playable in the given market. Otherwise, `false`.
     */
    is_playable?: boolean | undefined;
    /**
     * Part of the response when [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/) is applied,
     * and the requested track has been replaced with different track.
     * The track in the `linked_from` object contains information about the originally requested track.
     */
    linked_from?: TrackLinkObject | undefined;
    /**
     * Part of the response when [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/) is applied,
     * the original track is not available in the given market, and Spotify did not have any tracks to relink it with.
     * The track response will still contain metadata for the original track, and a restrictions object containing the reason
     * why the track is not available: `"restrictions" : {"reason" : "market"}`.
     */
    restrictions?: RestrictionsObject | undefined;
    /**
     * The name of the track.
     */
    name: string;
    /**
     * A link to a 30-second preview (MP3 format) of the track. Can be null
     */
    preview_url: string | null;
    /**
     * The number of the track. If an album has several discs, the track number is the number on the specified disc.
     */
    track_number: number;
    /**
     * The object type: “track”.
     */
    type: 'track';
    /**
     * The [Spotify URI](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the track.
     */
    uri: string;
  }

  /**
   * Full Track Object
   * [track object (full)](https://developer.spotify.com/web-api/object-model/#track-object-full)
   */
  interface TrackObjectFull extends TrackObjectSimplified {
    /**
     * The album on which the track appears.
     */
    album: AlbumObjectSimplified;
    /**
     * Known external IDs for the track.
     */
    external_ids: ExternalIdObject;
    /**
     * The popularity of the track. The value will be between `0` and `100`, with `100` being the most popular.
     * The popularity of a track is a value between `0` and `100`, with `100` being the most popular.
     * The popularity is calculated by algorithm and is based, in the most part,
     * on the total number of plays the track has had and how recent those plays are.
     */
    popularity: number;
    /**
     * Whether the track is from a local file.
     */
    is_local?: boolean | undefined;
  }

  /**
   * Simplified Album Object
   * [album object (simplified)](https://developer.spotify.com/web-api/object-model/#album-object-simplified)
   */
  interface AlbumObjectSimplified extends ContextObject {
    /**
     * The field is present when getting an artist’s albums.
     * Possible values are “album”, “single”, “compilation”, “appears_on”.
     * Compare to album_type this field represents relationship between the artist and the album.
     */
    album_group?: 'album' | 'single' | 'compilation' | 'appears_on' | undefined;
    /**
     * The type of the album: one of “album”, “single”, or “compilation”.
     */
    album_type: 'album' | 'single' | 'compilation';
    /**
     * The artists of the album.
     * Each artist object includes a link in href to more detailed information about the artist.
     */
    artists: ArtistObjectSimplified[];
    /**
     * The markets in which the album is available: [ISO 3166-1 alpha-2 country codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
     * Note that an album is considered available in a market when at least 1 of its tracks is available in that market.
     */
    available_markets?: string[] | undefined;
    /**
     * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the album.
     */
    id: string;
    /**
     * The cover art for the album in various sizes, widest first.
     */
    images: ImageObject[];
    /**
     * The name of the album. In case of an album takedown, the value may be an empty string.
     */
    name: string;
    /**
     * The date the album was first released, for example `1981`.
     * Depending on the precision, it might be shown as `1981-12` or `1981-12-15`.
     */
    release_date: string;
    /**
     * The precision with which release_date value is known: `year`, `month`, or `day`.
     */
    release_date_precision: 'year' | 'month' | 'day';
    /**
     * Part of the response when [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/) is applied,
     * the original track is not available in the given market, and Spotify did not have any tracks to relink it with.
     * The track response will still contain metadata for the original track,
     * and a restrictions object containing the reason why the track is not available: `"restrictions" : {"reason" : "market"}`
     */
    restrictions?: RestrictionsObject | undefined;
    type: 'album';
    /**
     * The number of tracks on the album.
     */
    total_tracks: number;
  }

  interface RecommendationsSeedObject {
    afterFilteringSize: number;
    afterRelinkingSize: number;
    href: string;
    id: string;
    initialPoolSize: number;
    type: 'artist' | 'track' | 'genre';
  }

  /**
   * Recommendation Album Object
   * Uses the same object structure as Simple Album Object, but with `album_type` in caps.
   */
  interface RecommendationAlbumObject
    extends Omit<AlbumObjectSimplified, 'album_type'> {
    /**
     * The type of the album: one of “ALBUM”, “SINGLE”, or “COMPILATION”.
     * Note that this differs from the types returned by all other spotify APIs by being in all caps.
     */
    album_type: 'ALBUM' | 'SINGLE' | 'COMPILATION';
  }

  /**
   * Recommendation Track Object
   * Uses the same object structure as Full Track Object, but with `album.album_type` in caps.
   */
  interface RecommendationTrackObject extends Omit<TrackObjectFull, 'album'> {
    album: RecommendationAlbumObject;
  }

  /**
   * Recommendations Object
   * [](https://developer.spotify.com/web-api/object-model/#recommendations-object)
   */
  interface RecommendationsObject {
    seeds: RecommendationsSeedObject[];
    tracks: RecommendationTrackObject[];
  }

  /**
   * User Object (Private)
   * [](https://developer.spotify.com/web-api/object-model/#track-object-simplified)
   */
  interface UserObjectPrivate extends UserObjectPublic {
    birthdate: string;
    country: string;
    email: string;
    product: string;
  }

  /**
   * User Object (Public)
   * [](https://developer.spotify.com/web-api/object-model/#track-object-simplified)
   */
  interface UserObjectPublic {
    display_name?: string | undefined;
    external_urls: ExternalUrlObject;
    followers?: FollowersObject | undefined;
    href: string;
    id: string;
    images?: ImageObject[] | undefined;
    type: 'user';
    uri: string;
  }
}
