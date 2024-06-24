class SliderFilterFormatter {
  /**
   * Turns the given value into a valid slider range value.
   * The slider range is betwen 0 - 100 and the config is between 0 - 1
   * @param value {number} The config value that should be transformed
   * @returns {number} The value in a suitable slider range value.
   */
  public static toSliderValueFromConfigValue(value: number): number {
    return value * 100;
  }

  /**
   * Turns the given value into a valid config value.
   * The slider range is betwen 0 - 100 and the config is between 0 - 1
   * @param value {number} The slider value that should be transformed
   * @returns {number} The value in a suitable config value.
   */
  public static toConfigValueFromSliderValue(value: number): number {
    return value / 100;
  }
}

export { SliderFilterFormatter };
