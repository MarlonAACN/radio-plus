type AlgorithmHook = {
  error: string | null;
  setOriginTrack: (trackId: string, deviceId: string) => Promise<boolean>;
  userDataFetched: boolean;
};

export type { AlgorithmHook };
