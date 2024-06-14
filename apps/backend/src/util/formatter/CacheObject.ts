enum CacheObjectType {
  UserData = 'user-data',
  Recommendations = 'user-track-recommendations',
}

class CacheObject {
  /**
   * Constructs a valid string used as key for caching.
   * The key always consists of the user id and the type appended to it.
   * @param userId {string} The spotify user id.
   * @param type {CacheObjectType} The type of the to be created key.
   * @returns {string} The constructed string able to use as caching object key.
   */
  public static constructKey(userId: string, type: CacheObjectType): string {
    return `${userId}-${type}`;
  }
}

export { CacheObject, CacheObjectType };
