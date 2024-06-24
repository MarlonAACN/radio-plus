import { ApiRouter } from '@/router/api/ApiRouter';
import { RadioPlus } from '@/types/RadioPlus';
import { HttpHandler } from '@/util/HttpHandler';

class AlgoRepo {
  private readonly router: ApiRouter;

  constructor(apiBase: string) {
    this.router = new ApiRouter(apiBase);
  }

  runAlgorithm(
    deviceId: string,
    originTrackId: string,
    user: RadioPlus.User,
    freshTracks: boolean,
    selectedGenres: Array<string>,
    bpm: number | null,
    danceability: number | null,
    popularity: number | null,
    valence: number | null
  ): Promise<RadioPlus.PlaylistUrl> {
    return fetch(
      this.router.get('runAlgorithm').build({
        v: 'v1',
      }),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          deviceId: deviceId,
          originTrackId: originTrackId,
          user: user,
          freshTracks: freshTracks,
          selectedGenres: selectedGenres,
          bpm: bpm,
          danceability: danceability,
          popularity: popularity,
          valence: valence,
        }),
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<RadioPlus.PlaylistUrl>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<RadioPlus.PlaylistUrl>(errResponse);
      });
  }
}

export { AlgoRepo };
