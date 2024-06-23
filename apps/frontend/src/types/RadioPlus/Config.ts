type Config = {
  radioOriginTrackUrl: string | null;
  freshTracks: boolean;
  selectedGenres: Array<string>;
  bpm: number | null | undefined;
};

/**
 * Errors, which can occure in the backend.
 */
type ConfigErrors = {
  radioOriginTrackUrl: string | null;
  freshTracks: string | null;
  selectedGenres: string | null;
  bpm: string | null;
};

/**
 * Config errors which are directly related to user input.
 * Meaning those errors are created my malformed user input.
 */
type ConfigFormErrors = {
  radioOriginTrackUrl: string | null;
};

export type { Config, ConfigErrors, ConfigFormErrors };
