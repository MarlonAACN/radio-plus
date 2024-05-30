import { LocalStorageKeys } from '@/constants/LocalStorageKeys';
import { RadioPlus } from '@/types/RadioPlus';

class LocalStorageManager {
  /**
   * Returns the config object, built upon the data fetched from the clients local storage.
   * @returns {RadioPlus.Config} The config built upon the data from the clients local storage.
   */
  public static getConfig(): RadioPlus.Config {
    return {
      radioOriginTrackUrl: localStorage.getItem(
        LocalStorageKeys.radioOriginTrackUrl
      ),
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
   * Clears all key:value pairs related to the radio plus config from the clients local storage.
   */
  public static wipeLocalStorage() {
    Object.values(LocalStorageKeys).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}

export { LocalStorageManager };
