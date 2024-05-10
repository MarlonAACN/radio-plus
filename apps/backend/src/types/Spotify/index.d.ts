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
}
