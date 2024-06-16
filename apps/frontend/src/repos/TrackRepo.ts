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

  /**
   * Checkes if the given track is saved in spotify.
   * @param id {string} The id of the track that should be checked if saved.
   * @returns {RadioPlus.DetailedTrack} True if the track is saved.
   */
  isTrackSaved(id: string): Promise<boolean> {
    return fetch(
      this.router.get('isTrackSaved').build({
        v: 'v1',
        trackId: id,
      }),
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<boolean>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<boolean>(errResponse);
      });
  }

  /**
   * Save a track to in users spotify saved track list.
   * @param id {string} The id of the track that should be saved.
   */
  saveTrack(id: string): Promise<void> {
    return fetch(
      this.router.get('saveTrack').build({
        v: 'v1',
        trackId: id,
      }),
      {
        method: 'PUT',
        credentials: 'include',
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<void>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<void>(errResponse);
      });
  }

  /**
   * Remove a saved track from the user saved track list in spotify.
   * @param id {string} The id of the track that should be removed from the saved track list of the user.
   */
  removeSavedTrack(id: string): Promise<void> {
    return fetch(
      this.router.get('removeSaveTrack').build({
        v: 'v1',
        trackId: id,
      }),
      {
        method: 'DELETE',
        credentials: 'include',
      }
    )
      .then((response: Response) => {
        return HttpHandler.response<void>(response);
      })
      .catch((errResponse) => {
        return HttpHandler.error<void>(errResponse);
      });
  }
}

export { TrackRepo };
