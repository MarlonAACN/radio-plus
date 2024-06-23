function createPlaylistDescription(
  originTrackName: string,
  freshTracks: boolean,
  selectedGenres: Array<string>,
  bpm: number | null
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

  return description;
}

export { createPlaylistDescription };
