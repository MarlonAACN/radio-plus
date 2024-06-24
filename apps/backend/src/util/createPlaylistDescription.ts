import { generateDanceabilityScoreText } from '@/util/generateDanceabilityScoreText';
import { generatePopularityScoreText } from '@/util/generatePopularityScoreText';
import { generateValenceScoreText } from '@/util/generateValenceScoreText';

function createPlaylistDescription(
  originTrackName: string,
  freshTracks: boolean,
  selectedGenres: Array<string>,
  bpm: number | null,
  danceability: number | null,
  popularity: number | null,
  valence: number | null
) {
  const dateString = new Date().toLocaleDateString('de');

  let description = `Radio⁺ session playlist (${dateString}). Origin track: ${originTrackName}`;

  if (freshTracks) {
    description += `, fresh tracks: ${freshTracks}`;
  }

  if (selectedGenres.length > 0) {
    const genres = selectedGenres.join(', ');
    description += `, selected genres: ${genres}`;
  }

  if (bpm !== null) {
    description += `, BPM: ${bpm}`;
  }

  if (danceability !== null) {
    description += `, danceability: ${generateDanceabilityScoreText(
      danceability
    )}`;
  }

  if (popularity !== null) {
    description += `, popularity: ${generatePopularityScoreText(popularity)}`;
  }

  if (valence !== null) {
    description += `, mood: ${generateValenceScoreText(valence)}`;
  }

  return description;
}

export { createPlaylistDescription };
