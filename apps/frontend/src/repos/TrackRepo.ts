import { ApiRouter } from '@/router/api/ApiRouter';
import { RadioPlus } from '@/types/RadioPlus';
import { HttpHandler } from '@/util/HttpHandler';

class TrackRepo {
  private readonly router: ApiRouter;

  constructor(apiBase: string) {
    this.router = new ApiRouter(apiBase);
  }

  /**
   * Fetches basic information about a spotify track.
   * @param id {string} The id of the desired track.
   * @returns {RadioPlus.DetailedTrack} The detailed track data based on the given id.
   */
  getDetailedTrack(id: string): Promise<RadioPlus.DetailedTrack> {
    return fetch(
      this.router.get('getDetailedTrack').build({
        v: 'v1',
        trackId: id,
      }),
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<RadioPlus.DetailedTrack>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<RadioPlus.DetailedTrack>(errResponse);
      });
  }
}

export { TrackRepo };
