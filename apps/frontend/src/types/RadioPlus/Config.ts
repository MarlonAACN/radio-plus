type Config = {
  radioOriginTrackUrl: string | null;
  freshTracks: boolean;
};

type ConfigErrors = {
  radioOriginTrackUrl: string | null;
  freshTracks: string | null;
};

type ConfigFormErrors = {
  radioOriginTrackUrl: string | null;
};

export type { Config, ConfigErrors, ConfigFormErrors };
