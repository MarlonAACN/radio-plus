class DateFormatter {
  /**
   * Create a new Date object, that matches the date that is after the amount of seconds provided.
   * @param delay {number} The amount of seconds from now until the date should be.
   * @returns {Date} A new Date object that matches the date that is after the amount of seconds provided.
   */
  public static CreateDateAfterDelay(delay: number): Date {
    const currentTimeInMillis: number = Date.now();
    const durationInMillis: number = delay * 1000;

    // Get date that is from now until delay.
    const endTimeInMillis: number = currentTimeInMillis + durationInMillis;

    // Create a Date object for the end time
    return new Date(endTimeInMillis);
  }
}

export { DateFormatter };
