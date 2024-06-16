type Recommendations = {
  /** The position the user is currently at. */
  position: number;
  /** The tracks that were generated, based on the recommendation algorithm from spotify. */
  tracks: Array<string>;
};

export type { Recommendations };
