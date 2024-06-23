function generateDanceabilityScoreText(value: number): string {
  if (value === 0) {
    return 'very low';
  }

  if (value < 0.2) {
    return 'low';
  }

  if (value < 0.4) {
    return 'barely';
  }

  if (value < 0.6) {
    return 'moderate';
  }

  if (value < 0.8) {
    return 'high';
  }

  if (value < 1) {
    return 'groovy';
  }

  if (value === 1) {
    return 'maximum';
  }

  return '--';
}

export { generateDanceabilityScoreText };
