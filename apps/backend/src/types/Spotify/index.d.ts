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
}
