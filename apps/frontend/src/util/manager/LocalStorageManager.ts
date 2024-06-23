import { LocalStorageKeys } from '@/constants/LocalStorageKeys';
import { RadioPlus } from '@/types/RadioPlus';
import { TrackFormatter } from '@/util/formatter/TrackFormatter';
import { logger } from '@/util/Logger';

class LocalStorageManager {
  private static getRadioTrackUrlFromLs(): string | null {
    const lsRadioOriginTrackUrl = localStorage.getItem(
      LocalStorageKeys.radioOriginTrackUrl
    );

    if (lsRadioOriginTrackUrl !== null) {
      // Check if url is valid and not malformed.
      try {
        TrackFormatter.parseTrackUrl(lsRadioOriginTrackUrl);
      } catch (err) {
        logger.warn(
          '[LocalStorageManager] Radio origin track url found in localStorage is malformed.'
        );

        this.removeFromLocalStorage(LocalStorageKeys.radioOriginTrackUrl);
        return null;
      }
    }

    return lsRadioOriginTrackUrl;
  }

  private static getFreshTracksBoolFromLs(): boolean {
    const lsFreshTracks = localStorage.getItem(LocalStorageKeys.freshTracks);

    if (!lsFreshTracks) {
      return false;
    }

    return lsFreshTracks === 'true';
  }

  private static getSelectedGenresFromLs(): Array<string> {
    const lsSelectedGenres = localStorage.getItem(
      LocalStorageKeys.selectedGenres
    );

    if (!lsSelectedGenres || lsSelectedGenres === '') {
      return [];
    }

    return lsSelectedGenres.split(',');
  }

  private static getBpmFromLs(): number | null {
    const lsBpm = localStorage.getItem(LocalStorageKeys.bpm);

    if (!lsBpm || isNaN(Number(lsBpm))) {
      return null;
    }

    return Number(lsBpm);
  }

  private static getDanceabilityFromLs(): number | null {
    const lsDanceability = localStorage.getItem(LocalStorageKeys.danceability);

    if (!lsDanceability || isNaN(Number(lsDanceability))) {
      return null;
    }

    return Number(lsDanceability);
  }

  /**
   * Returns the config object, built upon the data fetched from the clients local storage.
   * @returns {RadioPlus.Config} The config built upon the data from the clients local storage.
   */
  public static getConfig(): RadioPlus.Config {
    return {
      radioOriginTrackUrl: this.getRadioTrackUrlFromLs(),
      freshTracks: this.getFreshTracksBoolFromLs(),
      selectedGenres: this.getSelectedGenresFromLs(),
      bpm: this.getBpmFromLs(),
      danceability: this.getDanceabilityFromLs(),
    };
  }

  /**
   * Saves a specific config value in the clients local storage.
   * If a value for that key already exists, it will be overwritten.
   * If the given value is null, the current key:value pair will be deleted.
   * @param key {LocalStorageKeys} One of the supported local storage keys.
   * @param value {string | null} The stringified value to be saved in the local storage. Delete the entry if the value is null.
   */
  public static updateConfigValue(key: LocalStorageKeys, value: string | null) {
    if (!value) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, value);
  }

  /**
   * Remove specific item from local storage.
   * @param key {LocalStorageKeys} One of the supported local storage keys.
   */
  public static removeFromLocalStorage(key: LocalStorageKeys) {
    localStorage.removeItem(key);
  }

  /**
   * Clears all key:value pairs related to the radio plus config from the clients local storage.
   */
  public static wipeLocalStorage() {
    Object.values(LocalStorageKeys).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}

export { LocalStorageManager };
