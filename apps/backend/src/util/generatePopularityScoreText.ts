function generatePopularityScoreText(value: number): string {
  if (value === 0) {
    return 'unknown';
  }

  if (value < 20) {
    return 'very low';
  }

  if (value < 40) {
    return 'low';
  }

  if (value < 60) {
    return 'moderate';
  }

  if (value < 80) {
    return 'high';
  }

  if (value < 100) {
    return 'very high';
  }

  if (value === 100) {
    return 'maximum';
  }

  return '--';
}

export { generatePopularityScoreText };
