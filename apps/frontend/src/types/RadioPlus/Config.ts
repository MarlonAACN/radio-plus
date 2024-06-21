type Config = {
  radioOriginTrackUrl: string | null;
  freshTracks: boolean;
  selectedGenres: Array<string>;
};

type ConfigErrors = {
  radioOriginTrackUrl: string | null;
  freshTracks: string | null;
  selectedGenres: string | null;
};

type ConfigFormErrors = {
  radioOriginTrackUrl: string | null;
};

export type { Config, ConfigErrors, ConfigFormErrors };
