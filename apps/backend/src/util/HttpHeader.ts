class HttpHeader {
  /**
   * Basic authorization header, mostly used for OAuth purposes.
   */
  public static getSpotifyBasicAuthorization(): string {
    return (
      'Basic ' +
      Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64')
    );
  }

  /**
   * Bearer authorization header, mostly used for interactions with the player.
   */
  public static getSpotifyBearerAuthorization(accessToken: string): string {
    return 'Bearer ' + accessToken;
  }
}

export { HttpHeader };
