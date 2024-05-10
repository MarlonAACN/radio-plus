import { RequestError } from '@/util/Error';

/**
 * Since spotify silencely throws error, it needs to be manually checked,
 * if the returned data is an error or not.
 * @throws {RequestError} a RequestError if the given data contains an error body.
 */
function throwIfDataIsSpotifyError(data: any | { error: Spotify.Error }): void {
  if (data?.error) {
    throw new RequestError(data.error.status, data.error.message);
  }

  return;
}

export { throwIfDataIsSpotifyError };
