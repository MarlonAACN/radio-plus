class ArrayManager {
  /**
   * Function that compares to string arrays on their similarity.
   * @param arr1 {Array<string>} First array.
   * @param arr2 {Array<string>} Second array.
   * @returns {boolean} True if they're equal, otherwise false.
   */
  static isEqual(arr1: Array<string>, arr2: Array<string>): boolean {
    return arr1.toString() === arr2.toString();
  }

  /**
   * Removes the given value from the given array list.
   * @param from {Array<string>} The array from which the item should be removed.
   * @param value {string} The value that should be removed from the array.
   * @returns {Array<string>} The updated array, without the value.
   */
  static removeValue(from: Array<string>, value: string): Array<string> {
    return [
      ...from.filter((item) => {
        return item !== value;
      }),
    ];
  }
}

export { ArrayManager };
