type Config = {
  radioOriginTrackUrl: string | null;
  freshTracks: boolean;
  selectedGenres: Array<string>;
  /** undefined if untouched on load, null if disabled or not set, number if set. */
  bpm: number | null | undefined;
  /** undefined if untouched on load, null if disabled or not set, number if set in range of 0-1. */
  danceability: number | null | undefined;
  /** undefined if untouched on load, null if disabled or not set, number if set in range of 0-100. */
  popularity: number | null | undefined;
  /** undefined if untouched on load, null if disabled or not set, number if set. */
  valence: number | null | undefined;
};

/**
 * Errors, which can occure in the backend.
 */
type ConfigErrors = {
  radioOriginTrackUrl: string | null;
  freshTracks: string | null;
  selectedGenres: string | null;
  bpm: string | null;
  danceability: string | null;
  popularity: string | null;
  valence: string | null;
};

/**
 * Config errors which are directly related to user input.
 * Meaning those errors are created my malformed user input.
 */
type ConfigFormErrors = {
  radioOriginTrackUrl: string | null;
};

export type { Config, ConfigErrors, ConfigFormErrors };
