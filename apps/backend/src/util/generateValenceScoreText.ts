function generateValenceScoreText(value: number): string {
  if (value === 0) {
    return 'depressed';
  }

  if (value < 0.2) {
    return 'gloomy';
  }

  if (value < 0.4) {
    return 'melancholic';
  }

  if (value < 0.6) {
    return 'neutral';
  }

  if (value < 0.8) {
    return 'cheerful';
  }

  if (value < 1) {
    return 'happy';
  }

  if (value === 1) {
    return 'euphoric';
  }

  return '--';
}

export { generateValenceScoreText };
